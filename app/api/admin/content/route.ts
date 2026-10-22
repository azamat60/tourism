import type { Json } from '@/lib/supabase/database.types';
import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin/auth";
import {
  entryInput,
  validateContent,
  preserveShape,
} from "@/lib/admin/validation";
import { apiError, jsonBody, sameOrigin } from "@/lib/http";
export async function GET() {
  try {
    const { supabase } = await requireStaff(["admin", "editor"]);
    const { data, error } = await supabase
      .from("tourism_content")
      .select("*")
      .order("kind")
      .order("slug");
    if (error) throw error;
    return NextResponse.json(data, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { supabase } = await requireStaff(["admin", "editor"]);
    const input = entryInput.parse(await jsonBody(request));
    validateContent(input.kind, input.data);
    if (["page", "settings"].includes(input.kind) && !input.published)
      throw new Error("Core pages and settings must stay published.");
    if (input.kind === "tour" || input.kind === "post") {
      if ((input.data as { slug: string }).slug !== input.slug)
        throw new Error("Record slug must match URL slug.");
    }
    if (input.kind === "departure") {
      if ((input.data as { id: string }).id !== input.id)
        throw new Error("Departure ID must match record ID.");
      const { data } = await supabase
        .from("tourism_content")
        .select("id")
        .eq("kind", "tour")
        .eq("slug", (input.data as { tourSlug: string }).tourSlug)
        .single();
      if (!data) throw new Error("Select an existing tour.");
    }
    if (input.version === 0) {
      if (!["tour", "departure", "post", "faq"].includes(input.kind))
        throw new Error("Cannot create this content kind.");
      const { data, error } = await supabase
        .from("tourism_content")
        .insert({ ...input, data: input.data as Json, translations: input.translations as Json, version: 1 })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    }
    const { data: previous } = await supabase
      .from("tourism_content")
      .select("*")
      .eq("id", input.id)
      .single();
    if (!previous || previous.kind !== input.kind) throw new Error("CONFLICT");
    if (input.kind === "page" || input.kind === "settings")
      preserveShape(previous.data, input.data);
    if (previous.slug !== input.slug)
      throw new Error(
        "Published URL slugs are immutable. Archive and create a new record.",
      );
    const { data, error } = await supabase
      .from("tourism_content")
      .update({
        data: input.data as Json,
        translations: input.translations as Json,
        published: input.published,
      })
      .eq("id", input.id)
      .eq("version", input.version)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("CONFLICT");
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
