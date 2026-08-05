export async function uploadFileToR2(
  file: File | Blob,
  folder: string,
  fileName?: string
): Promise<string> {
  const formData = new FormData();
  
  if (file instanceof File) {
    formData.append("file", file);
  } else {
    formData.append("file", file, fileName || "upload.jpg");
  }
  
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to upload file to Cloudflare R2");
  }

  const data = await res.json();
  if (!data.publicUrl) {
    throw new Error("No public URL returned from upload API");
  }

  return data.publicUrl;
}
