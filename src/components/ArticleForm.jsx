import {
  Trash,
  Send,
  FileText,
  Loader2,
  Sparkles,
  Type,
  FileDigit,
} from "lucide-react";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import { useApp } from "../context/AppContext";

const CATEGORY_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20",
  "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20",
  "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20",
  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-500/20",
  "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  "bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-500/20",
  "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
  "bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-500/20",
];

function getCategoryStyle(index, isActive) {
  const colorIdx = (index * 2) % CATEGORY_COLORS.length;
  return isActive ? CATEGORY_COLORS[colorIdx + 1] : CATEGORY_COLORS[colorIdx];
}

function ArticleForm({ onPublish, loading, initialData }) {
  const { categories } = useApp();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const contentLevel =
    wordCount === 0
      ? null
      : wordCount < 200
        ? {
            label: "Short",
            color: "bg-amber-100 text-amber-700",
            width: "w-1/4",
          }
        : wordCount < 800
          ? {
              label: "Medium",
              color: "bg-blue-100 text-blue-700",
              width: "w-2/4",
            }
          : {
              label: "Long",
              color: "bg-emerald-100 text-emerald-700",
              width: "w-full",
            };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.category || "Technology");
      setContent(initialData.content || "");
    }
  }, [initialData]);

  const handleDiscard = () => setShowDiscardConfirm(true);

  const confirmDiscard = () => {
    setTitle("");
    setCategory("Technology");
    setContent("");
    setValidationError("");
    setShowDiscardConfirm(false);
  };

  const handleSubmit = (e, statusOverride) => {
    e.preventDefault();
    setValidationError("");

    if (!title.trim() || !content.trim()) {
      setValidationError("Please fill in both the title and content body.");
      return;
    }

    onPublish({ title, category, status: statusOverride, content });
  };

  return (
    <>
      <ConfirmModal
        isOpen={showDiscardConfirm}
        title="Discard Draft"
        message="Are you sure you want to discard this draft? All inputs will be cleared."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        onConfirm={confirmDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
      />

      <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-2xl shadow-sm w-full">
        <form className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Article Content
              </h3>
              <p className="text-xs text-slate-400">
                Fill in the details for your article
              </p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mb-2">
              <Type className="w-3.5 h-3.5" />
              Article Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError("");
              }}
              placeholder="e.g. 10 Must-Know Design Trends in 2026"
              className={`w-full px-4 py-3 border text-slate-800 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all duration-200 text-sm ${
                validationError && !title.trim()
                  ? "border-red-400 bg-red-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
          </div>

          {/* Category Pills */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 mb-3">
              <FileDigit className="w-3.5 h-3.5" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((catName, index) => {
                const isActive = category === catName;
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setCategory(catName)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer ${getCategoryStyle(
                      index,
                      isActive,
                    )}`}
                  >
                    {catName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                Content Body
              </label>
              <div className="flex items-center gap-3">
                {contentLevel && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${contentLevel.color}`}
                  >
                    {contentLevel.label}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-medium">
                  {wordCount} words · {charCount} chars
                </span>
              </div>
            </div>
            {/* Content progress bar */}
            {content && (
              <div className="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${contentLevel?.width || "w-0"} bg-indigo-500`}
                />
              </div>
            )}
            <textarea
              rows="10"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (validationError) setValidationError("");
              }}
              placeholder="Start typing your story, insights, or updates here...&#10;&#10;Tip: Use line breaks for paragraphs and keep your content engaging!"
              className={`w-full px-4 py-3.5 border text-slate-800 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-y transition-all duration-200 text-sm leading-relaxed min-h-[200px] ${
                validationError && !content.trim()
                  ? "border-red-400 bg-red-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            ></textarea>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-sm font-medium text-red-700">
                {validationError}
              </span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={loading}
              className="flex items-center cursor-pointer gap-2 text-red-500 text-sm font-semibold hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <Trash className="w-4 h-4" /> Discard Changes
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={loading}
                className="flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                <FileText className="w-4 h-4 text-slate-400" /> Save Draft
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, "published")}
                disabled={loading}
                className="flex cursor-pointer items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-indigo-500/10"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading
                  ? initialData
                    ? "Updating..."
                    : "Publishing..."
                  : initialData
                    ? "Update Article"
                    : "Publish Article"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ArticleForm;
