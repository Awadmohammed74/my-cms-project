import { X, Sparkles, Image } from "lucide-react";
import { useState, useEffect } from "react";

function ImageUploader({ onImageSelect, initialdata }) {
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialdata) {
      setImagePreview(initialdata.image || null);
    }
  }, [initialdata]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    onImageSelect(null);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Featured Image</h3>
          <p className="text-xs text-slate-400">
            Upload a cover image for your article
          </p>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex justify-center px-4 py-8 border-2 border-dashed rounded-xl transition-all duration-200 bg-slate-50/50 relative group min-h-[200px] items-center hover:border-indigo-400 hover:bg-indigo-50/30 border-slate-200">
          {!imagePreview ? (
            <div className="space-y-3 text-center w-full">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:shadow-sm transition-all duration-200">
                <Image className="w-7 h-7 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
                >
                  <span>Click to upload</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="text-xs text-slate-400">or drag and drop</p>
              </div>
              <p className="text-[10px] text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1 inline-block">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          ) : (
            <div className="relative w-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-sm">
                  Cover Image
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
