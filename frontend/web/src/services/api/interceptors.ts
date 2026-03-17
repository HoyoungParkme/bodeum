export type RequestInterceptor = (input: RequestInfo | URL, init: RequestInit) => RequestInit;
export type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

export const requestInterceptors: RequestInterceptor[] = [];
export const responseInterceptors: ResponseInterceptor[] = [];

export async function applyResponseInterceptors(response: Response): Promise<Response> {
  let current = response;

  for (const interceptor of responseInterceptors) {
    current = await interceptor(current);
  }

  return current;
}
