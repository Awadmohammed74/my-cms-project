/**
 * Compresses an image file and converts it to a Base64 string.
 * Reduces image width to MAX_WIDTH while maintaining aspect ratio,
 * then encodes as JPEG with the given quality.
 */
const MAX_WIDTH = 400;
const JPEG_QUALITY = 0.6;

export function compressAndConvertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const scale = MAX_WIDTH / img.width;
        const width = MAX_WIDTH;
        const height = img.height * scale;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
