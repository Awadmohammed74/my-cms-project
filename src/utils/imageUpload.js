import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

const MAX_WIDTH = 800; // Increased max width for better quality
const JPEG_QUALITY = 0.8;

/**
 * Compresses an image file and converts it to a Blob.
 * Reduces image width to MAX_WIDTH while maintaining aspect ratio,
 * then encodes as JPEG with the given quality.
 */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          const scale = MAX_WIDTH / width;
          width = MAX_WIDTH;
          height = height * scale;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas to Blob failed"));
          },
          "image/jpeg",
          JPEG_QUALITY
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * Automatically compresses the image before uploading.
 * @param {File} file The image file to upload.
 * @returns {Promise<string>} The public download URL.
 */
export async function uploadImage(file) {
  try {
    const compressedBlob = await compressImage(file);
    const fileName = `images/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, compressedBlob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
