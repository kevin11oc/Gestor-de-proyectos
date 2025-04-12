import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

export async function uploadAttachments(files: File[]): Promise<{ name: string; url: string }[]> {
  const supabase = createClient();
  const uploadedFiles = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const filePath = `${uuidv4()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("project-attachments")
      .upload(filePath, file);

    if (error) {
      console.error("Error al subir archivo:", error.message);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("project-attachments")
      .getPublicUrl(filePath);

    uploadedFiles.push({
      name: file.name,
      url: urlData.publicUrl,
    });
  }

  return uploadedFiles;
}
