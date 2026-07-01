const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mdqzgoctpstpggvtaqwh.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*");

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("All Gallery Rows:", data.map(d => ({
    id: d.id,
    title: d.title,
    storage_path: d.storage_path,
    thumbnail_url: d.thumbnail_url,
    usage_context: d.usage_context,
    category: d.category
  })));
}

main();
