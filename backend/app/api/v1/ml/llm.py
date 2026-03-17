import json

from openai import OpenAI
from pydantic import BaseModel, ValidationError

from app.config import BaseSettings
from app.schemas.ml import (
    BigFiveScoresPayload,
    ChatMessage,
    ChatOpenResponse,
    ChatResponse,
    ReportInsight,
)


class LLMConfigurationError(RuntimeError):
    pass


class LLMResponseError(RuntimeError):
    pass


class LLMOpenPayload(BaseModel):
    reply: str


class LLMChatPayload(BaseModel):
    reply: str
    summary: str
    report_insight: ReportInsight | None = None


DIMENSION_LABELS = {
    "O": "개방성",
    "C": "성실성",
    "E": "외향성",
    "A": "친화성",
    "N": "정서 민감성",
}

BASE_INSTRUCTIONS = """
당신은 Bodeum의 한국어 심리 코치다.
- 사용자의 Big Five 점수는 해석의 단서일 뿐이며, 진단처럼 단정하지 않는다.
- 공감은 짧고 정확하게 하고, 실제로 도움이 되는 관찰과 질문을 준다.
- 답변은 과장 없이 차분하고 실용적으로 쓴다.
- 의료, 법률, 위기 개입처럼 들리는 표현은 피한다.
""".strip()


def _make_client(settings: BaseSettings) -> OpenAI:
    if not settings.llm_api_key.strip():
        raise LLMConfigurationError("LLM_API_KEY is not configured.")
    return OpenAI(
        api_key=settings.llm_api_key,
        base_url=settings.get_llm_base_url(),
        timeout=30.0,
    )


def _build_score_lines(scores: BigFiveScoresPayload) -> str:
    return "\n".join(
        f"- {DIMENSION_LABELS[key]}({key}): {round(value, 1)} / 100"
        for key, value in scores.model_dump().items()
    )


def _build_transcript(messages: list[ChatMessage]) -> str:
    role_labels = {"user": "사용자", "coach": "코치"}
    return "\n".join(
        f"{role_labels[message.role]}: {message.text.strip()}"
        for message in messages
    )


def generate_chat_opening(
    *,
    settings: BaseSettings,
    scores: BigFiveScoresPayload,
) -> ChatOpenResponse:
    client = _make_client(settings)

    instructions = (
        f"{BASE_INSTRUCTIONS}\n"
        "- 이번 응답은 반드시 JSON으로만 반환한다.\n"
        "- JSON 키는 reply 하나만 사용한다.\n"
        "- reply는 화면에 바로 보여줄 코치의 첫 마디다."
    )

    prompt = f"""
사용자가 100문항 설문을 막 마쳤다. 아래 Big Five 점수를 바탕으로 첫 인사를 작성해라.

[Big Five 점수]
{_build_score_lines(scores)}

[작성 규칙]
- 점수 조합에서 가장 특징적인 부분(높은 점수 1~2개, 낮은 점수 1개)을 짚어라.
- 그 성향이 실제 일상이나 관계에서 어떻게 나타날 것 같은지 한 문장으로 말해라.
- 마지막으로 그 성향이 어떤 상황에서 드러나는지 구체적인 질문 하나만 해라.
- "예/아니오"가 아닌 서술형 질문이어야 한다.
- 전체 길이는 3~5문장 이내로 간결하게.

반드시 JSON 객체로만 응답해라.
""".strip()

    response = client.responses.create(
        model=settings.llm_model,
        instructions=instructions,
        input=prompt,
        text={"format": {"type": "json_object"}},
    )

    raw_output = (response.output_text or "").strip()
    if not raw_output:
        raise LLMResponseError("The model returned an empty response.")

    try:
        payload = LLMOpenPayload.model_validate(json.loads(raw_output))
    except (json.JSONDecodeError, ValidationError) as exc:
        raise LLMResponseError("The model returned an invalid JSON payload.") from exc

    return ChatOpenResponse(reply=payload.reply.strip(), model=settings.llm_model)


def generate_chat_response(
    *,
    settings: BaseSettings,
    scores: BigFiveScoresPayload,
    messages: list[ChatMessage],
    turn_count: int,
) -> ChatResponse:
    client = _make_client(settings)

    # turn 0: 첫 번째 사용자 답변 → 더 깊이 탐색
    # turn 1: 두 번째 사용자 답변 → 강점/어려움 정리 + 마지막 질문
    # turn 2+: 마무리 → 핵심 통찰 + 팁 + report_insight 생성
    if turn_count == 0:
        turn_instructions = (
            "- 사용자가 코치의 첫 질문에 답했다.\n"
            "- 사용자의 말을 한 문장으로 공감하며 짚고, Big Five 점수와 연결해 "
            "그 성향이 어떤 구체적인 상황에서 나타나는지 질문 하나만 해라.\n"
            "- 질문은 서술형으로 유도하고, 새로운 주제는 꺼내지 않는다.\n"
            "- JSON 키는 reply, summary 두 개만 사용한다.\n"
            "- summary는 이 턴까지의 대화를 1문장으로 요약한다."
        )
    elif turn_count == 1:
        turn_instructions = (
            "- 사용자가 구체적인 경험을 나눴다.\n"
            "- 그 경험 안에서 강점 하나를 찾아 짚어주고, 어려움이 있다면 가볍게 인정해줘라.\n"
            "- '이 성향이 앞으로 어떻게 도움이 될 수 있을지'에 관한 질문 하나만 해라.\n"
            "- JSON 키는 reply, summary 두 개만 사용한다.\n"
            "- summary는 이 턴까지의 대화를 1~2문장으로 요약한다."
        )
    else:
        turn_instructions = (
            "- 대화를 마무리하는 답변을 작성한다.\n"
            "- 오늘 대화에서 나온 가장 중요한 통찰 1개를 짧게 정리해라.\n"
            "- 이 사람의 점수 조합과 대화 내용을 바탕으로 실행 가능한 팁 1~2개를 구체적으로 제시해라.\n"
            "- 새로운 질문은 하지 않는다.\n"
            "- JSON 키는 reply, summary, report_insight 세 개를 사용한다.\n"
            "- summary는 전체 대화를 2문장으로 요약한다.\n"
            "- report_insight는 strength(강점 한 문장), challenge(어려움 한 문장), tip(실행 팁 한 문장) 세 필드를 가진 객체다."
        )

    instructions = (
        f"{BASE_INSTRUCTIONS}\n"
        "- 이번 응답은 반드시 JSON으로만 반환한다.\n"
        f"{turn_instructions}"
    )

    prompt = f"""
아래 정보를 바탕으로 사용자를 위한 코치 응답을 작성해라.

[Big Five 점수]
{_build_score_lines(scores)}

[대화 기록]
{_build_transcript(messages)}

반드시 JSON 객체로만 응답해라.
""".strip()

    response = client.responses.create(
        model=settings.llm_model,
        instructions=instructions,
        input=prompt,
        text={"format": {"type": "json_object"}},
    )

    raw_output = (response.output_text or "").strip()
    if not raw_output:
        raise LLMResponseError("The model returned an empty response.")

    try:
        payload = LLMChatPayload.model_validate(json.loads(raw_output))
    except (json.JSONDecodeError, ValidationError) as exc:
        raise LLMResponseError("The model returned an invalid JSON payload.") from exc

    return ChatResponse(
        reply=payload.reply.strip(),
        summary=payload.summary.strip(),
        model=settings.llm_model,
        report_insight=payload.report_insight,
    )
