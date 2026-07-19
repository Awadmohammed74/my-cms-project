import { useRef, useEffect, useState } from "react";
import {
  Sparkles,
  Star,
  Search,
  Globe,
  Link2,
  FileText,
  Hash,
  Tag,
} from "lucide-react";

function PublishSetting({
  tags,
  setTags,
  featured,
  setFeatured,
  seoData = {},
  setSeoData,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm h-fit select-none">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Publishing Settings
          </h3>
          <p className="text-xs text-slate-400">
            Manage promotions and taxonomies
          </p>
        </div>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {/* Featured Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700">
                Pin to Featured
              </span>
              <span className="text-xs text-slate-400">
                Highlight this item at the top of your feed
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-all duration-300 outline-none shrink-0 ${
              featured
                ? "bg-indigo-600 shadow-md shadow-indigo-500/20"
                : "bg-slate-200 border border-slate-300/60"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 ${
                featured ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <hr className="border-slate-100" />

        {/* SEO Section */}
        {setSeoData && (
          <>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <h4 className="text-sm font-semibold text-slate-500">
                  SEO Settings
                </h4>
              </div>
              <p className="text-xs text-slate-400 ml-6">
                Optimize your article for search engines
              </p>
            </div>

            <div className="flex flex-col gap-3.5 ml-6">
              {/* Meta Title */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                  <FileText className="w-3 h-3" />
                  Meta Title
                </label>
                <input
                  type="text"
                  value={seoData.metaTitle || ""}
                  onChange={(e) =>
                    setSeoData((prev) => ({
                      ...prev,
                      metaTitle: e.target.value,
                    }))
                  }
                  placeholder="SEO title for search engines..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 hover:border-slate-300"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block text-right">
                  {(seoData.metaTitle || "").length}/60
                </span>
              </div>

              {/* Meta Description */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                  <FileText className="w-3 h-3" />
                  Meta Description
                </label>
                <textarea
                  rows="2"
                  value={seoData.metaDescription || ""}
                  onChange={(e) =>
                    setSeoData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="Brief description for search results..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none resize-none transition-all placeholder-slate-400 hover:border-slate-300"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block text-right">
                  {(seoData.metaDescription || "").length}/160
                </span>
              </div>

              {/* Keywords */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                  <Hash className="w-3 h-3" />
                  Keywords
                </label>
                <input
                  type="text"
                  value={seoData.keywords || ""}
                  onChange={(e) =>
                    setSeoData((prev) => ({
                      ...prev,
                      keywords: e.target.value,
                    }))
                  }
                  placeholder="keyword1, keyword2, keyword3..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                  <Link2 className="w-3 h-3" />
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={seoData.canonicalUrl || ""}
                  onChange={(e) =>
                    setSeoData((prev) => ({
                      ...prev,
                      canonicalUrl: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/article..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 hover:border-slate-300"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                  <Globe className="w-3 h-3" />
                  URL Slug
                </label>
                <input
                  type="text"
                  value={seoData.slug || ""}
                  onChange={(e) =>
                    setSeoData((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  placeholder="custom-url-slug..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all placeholder-slate-400 hover:border-slate-300 font-mono"
                />
              </div>
            </div>

            <hr className="border-slate-100" />
          </>
        )}

        {/* Tags Section */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-500">Tags</span>
            </div>
            {tags.length > 0 && (
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                {tags.length} active
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 flex items-center gap-1.5 text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300"
                >
                  <span className="font-medium">{tag}</span>
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            {isAdding ? (
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type tag name..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim() !== "") {
                      setTags([...tags, newTag.trim()]);
                      setNewTag("");
                      setIsAdding(false);
                    }
                  }}
                  className="bg-transparent text-sm text-slate-800 font-medium px-1 py-0.5 outline-none w-full placeholder-slate-400"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm active:scale-95"
                    onClick={() => {
                      if (newTag.trim() !== "") {
                        setTags([...tags, newTag.trim()]);
                        setNewTag("");
                        setIsAdding(false);
                      }
                    }}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-1 py-1.5 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setNewTag("");
                      setIsAdding(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50 rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 w-full justify-center"
              >
                <span className="text-sm">+</span>
                Add tag
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom padding spacer */}
      <div className="h-2" />
    </div>
  );
}

export default PublishSetting;
