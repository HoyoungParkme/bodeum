import json

from openai import OpenAI
from pydantic import BaseModel, ValidationError

from app.config import BaseSettings
from app.schemas.ml import BigFiveScoresPayload, ChatMessage, ChatResponse


class LLMConfigurationError(RuntimeError):
    pass


class LLMResponseError(RuntimeError):
    pass


class LLMChatPayload(BaseModel):
    reply: str
    summary: str


DIMENSION_LABELS = {
    "O": "개방성",
    "C": "성실성",
    "E": "외향성",
    "A": "친화성",
    "N": "정서 민감성",
}


def _build_score_lines(scores: BigFiveScoresPayload) -> str:
    return "\n".join(
        f"- {DIMENSION_LABELS[key]}({key}): {round(value, 1)} / 100"
        for key, value in scores.model_dump().items()
    )


def _build_transcript(messages: list[ChatMessage]) -> str:
    role_labels = {
        "user": "사용자",
        "coach": "코치",
    }
    return "\n".join(
        f"{role_labels[message.role]}: {message.text.strip()}"
        for message in messages
    )


def generate_chat_response(
    *,
    settings: BaseSettings,
    scores: BigFiveScoresPayload,
    messages: list[ChatMessage],
    turn_count: int,
) -> ChatResponse:
    if not settings.llm_api_key.strip():
        raise LLMConfigurationError("LLM_API_KEY is not configured.")

    client = OpenAI(
        api_key=settings.llm_api_key,
        base_url=settings.get_llm_base_url(),
        timeout=30.0,
    )

    closing_mode = turn_count >= 2
    instructions = """
당신은 Bodeum의 한국어 심리 코치다.
- 사용자의 Big Five 점수는 해석의 단서일 뿐이며, 진단처럼 단정하지 않는다.
- 공감은 짧고 정확하게 하고, 실제로 도움이 되는 관찰과 질문을 준다.
- 답변은 과장 없이 차분하고 실용적으로 쓴다.
- 의료, 법률, 위기 개입처럼 들리는 표현은 피한다.
- 이번 응답은 반드시 JSON으로만 반환한다.
- JSON 키는 reply, summary 두 개만 사용한다.
- reply는 화면에 바로 보여줄 코치 답변이다.
- summary는 리포트에 넣을 1~2문장 요약이다.
""".strip()

    if closing_mode:
        instructions = (
            f"{instructions}\n"
            "- 이번 응답은 대화를 마무리하는 답변으로 작성한다.\n"
            "- 새로운 질문 대신 핵심 통찰 1개와 실행 팁 1~2개를 짧게 준다."
        )
    else:
        instructions = (
            f"{instructions}\n"
            "- 이번 응답은 사용자의 말을 한 번 짚고, 질문은 하나만 한다."
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
    )
