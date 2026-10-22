import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new Error('FORBIDDEN');
}
export async function boundedBody(request: Request, maxBytes: number) {
  if (Number(request.headers.get('content-length') || 0) > maxBytes) throw new Error('PAYLOAD_TOO_LARGE');
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  if (!reader) return new Uint8Array();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((chunk) => {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return body;
}
export async function jsonBody(request: Request, maxBytes = 2_000_000) {
  return JSON.parse(new TextDecoder().decode(await boundedBody(request, maxBytes)));
}
export function apiError(error: unknown) {
  if (error instanceof ZodError)
    return NextResponse.json({ error: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
  const message = error instanceof Error ? error.message : 'Request failed';
  const statuses: Record<string, number> = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    CONFLICT: 409,
    PAYLOAD_TOO_LARGE: 413,
  };
  if (message in statuses) return NextResponse.json({ error: message }, { status: statuses[message] });
  console.error(error);
  return NextResponse.json({ error: 'Could not save changes. Please try again.' }, { status: 400 });
}
