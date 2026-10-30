/**
 * Resilient image upload utility.
 * Attempts Cloudinary first (fast and reliable), then falls back to ImgBB with an abort timeout
 * to prevent uploads from hanging indefinitely.
 */
export async function uploadImage(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const imgbbKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

  // 1. Try Cloudinary first
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(15000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) {
          return data.secure_url as string;
        }
      }
    } catch (err) {
      console.warn("Cloudinary upload failed or timed out, trying fallback:", err);
    }
  }

  // 2. Try ImgBB fallback (with strict timeout to prevent indefinite hanging)
  if (imgbbKey) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbKey)}`, {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(10000),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const url = data.data?.display_url || data.data?.url;
        if (url) return url as string;
      }
    } catch (err) {
      console.warn("ImgBB upload failed or timed out:", err);
    }
  }

  throw new Error("Image upload service was unreachable or timed out. Please check your connection or cloud storage settings.");
}

