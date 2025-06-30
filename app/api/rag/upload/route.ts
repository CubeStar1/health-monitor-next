import { createSupabaseServer } from "@/lib/supabase/server";
import { getUser } from "@/hooks/get-user";
import { NextRequest, NextResponse } from "next/server";
import { Ragie } from "ragie";

const ragie = new Ragie({
  auth: process.env.RAGIE_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const ragieResult = await ragie.documents.create({ file });

    const documentId = ragieResult.id;

    const supabase = await createSupabaseServer();
    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user.id,
      file_name: file.name,
      document_id: documentId,
      status: 'pending'
    });

    if (dbError) {
      console.error("Supabase DB Error:", dbError);
      return NextResponse.json(
        { error: "Failed to save document metadata." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, documentId });
  } catch (error: any) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

