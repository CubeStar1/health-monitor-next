import { createSupabaseBrowser } from "@/lib/supabase/client";

export async function getDocuments(userId: string) {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("documents")
    .select("id, file_name, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    return [];
  }

  return data;
}
