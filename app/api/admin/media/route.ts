import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/admin/auth';
import { apiError, sameOrigin, boundedBody } from '@/lib/http';
const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};
export async function GET() {
  try {
    const { supabase } = await requireStaff(['admin', 'editor']);
    const { data, error } = await supabase.storage.from('tourism-media').list('', {
      limit: 500,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;
    return NextResponse.json(
      data
        .filter((file) => file.id)
        .map((file) => ({
          ...file,
          url: supabase.storage.from('tourism-media').getPublicUrl(file.name).data.publicUrl,
        })),
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { supabase } = await requireStaff(['admin', 'editor']);
    if (Number(request.headers.get('content-length') || 0) > 11_000_000) throw new Error('PAYLOAD_TOO_LARGE');
    const buffer = await boundedBody(request, 11_000_000);
    const form = await new Response(buffer, {
      headers: { 'Content-Type': request.headers.get('content-type') || '' },
    }).formData();
    const file = form.get('file');
    if (!(file instanceof File) || !extensions[file.type] || file.size > 10_485_760 || !file.size)
      throw new Error('Upload JPG, PNG, WebP or PDF, up to 10 MB.');
    const name = `${crypto.randomUUID()}.${extensions[file.type]}`;
    const { error } = await supabase.storage
      .from('tourism-media')
      .upload(name, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    return NextResponse.json({
      url: supabase.storage.from('tourism-media').getPublicUrl(name).data.publicUrl,
    });
  } catch (error) {
    return apiError(error);
  }
}
