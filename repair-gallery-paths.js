const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mdqzgoctpstpggvtaqwh.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is missing!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function main() {
  const { data: files, error: storageError } = await supabase.storage.from("gallery").list("", { limit: 100 });
  if (storageError) {
    console.error("Storage error:", storageError);
    return;
  }

  const { data: rows, error: dbError } = await supabase.from("gallery").select("id, title, storage_path");
  if (dbError) {
    console.error("DB error:", dbError);
    return;
  }

  console.log(`Found ${files.length} files in storage and ${rows.length} rows in database.`);

  for (const row of rows) {
    let targetFileName = null;
    const cleanTitle = row.title.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (row.title.toLowerCase().includes("screenshot")) {
      targetFileName = "screenshot-2026-06-30-13-17-09-433-com-zhiliaoapp-musically-edit-1782852468444.webp";
    } else {
      // Find matching file
      const matchingFile = files.find(f => {
        const cleanFileName = f.name.toLowerCase().split("-")[0].replace(/[^a-z0-9]/g, "");
        return cleanFileName === cleanTitle || f.name.toLowerCase().startsWith(cleanTitle);
      });
      if (matchingFile) {
        targetFileName = matchingFile.name;
      }
    }

    if (targetFileName) {
      console.log(`Updating Row "${row.title}" (ID: ${row.id}) -> storage_path: "${targetFileName}"`);
      const { data, error: updateError } = await supabase
        .from("gallery")
        .update({ storage_path: targetFileName })
        .eq("id", row.id)
        .select();

      if (updateError) {
        console.error(`Failed to update ${row.title}:`, updateError.message);
      } else {
        console.log(`Successfully updated row, returned:`, data);
      }
    } else {
      console.warn(`No match found for row title: "${row.title}"`);
    }
  }
}

main();
