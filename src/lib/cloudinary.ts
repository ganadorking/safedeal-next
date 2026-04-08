import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  const {
    width = 400,
    height = 300,
    crop = "fill",
    quality = "auto",
    format = "webp",
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
    secure: true,
  });
}

export async function uploadImage(
  file: string | Buffer,
  folder = "products"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:image/png;base64,${file.toString("base64")}`,
    {
      folder: `safedeal/${folder}`,
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// Generate optimized product image URL
export function productImageUrl(
  url: string | null,
  size: "thumb" | "card" | "detail" | "full" = "card"
): string {
  if (!url) {
    return "https://placehold.co/400x533/0d0d1a/555?text=SD";
  }

  // If it's already a full URL (external), return as-is
  if (url.startsWith("http") && !url.includes("cloudinary")) {
    return url;
  }

  // If it's a Cloudinary URL, transform it
  if (url.includes("cloudinary")) {
    const sizes = {
      thumb: "w_150,h_150,c_fill",
      card: "w_400,h_533,c_fill",
      detail: "w_800,h_600,c_fit",
      full: "w_1200,h_900,c_fit",
    };
    return url.replace("/upload/", `/upload/${sizes[size]},q_auto,f_webp/`);
  }

  // Legacy local path
  return url;
}
