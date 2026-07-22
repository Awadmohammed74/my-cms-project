import { useState } from "react";
import { useApp } from "../context/AppContext";
import Breadcrumb from "../components/Breadcrumb";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import Toast from "../components/Toast";
import {
  Tags,
  Plus,
  X,
  Loader2,
  Sparkles,
  Hash,
  AlertTriangle,
} from "lucide-react";

const CATEGORY_COLORS = [
  {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
  },
  {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
];

function Categories() {
  const {
    categories,
    categoriesLoading,
    addCategory,
    deleteCategory,
    seedDefaultCategories,
  } = useApp();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    const ok = await addCategory(name);
    if (ok) {
      setNewCategoryName("");
      setToast({ message: `"${name}" added successfully!`, type: "success" });
    } else {
      setToast({
        message: "Category already exists or failed to add.",
        type: "error",
      });
    }
  };

  const handleDelete = async (name) => {
    setDeleting(name);
    const ok = await deleteCategory(name);
    setDeleting(null);
    setToast({
      message: ok ? `"${name}" deleted.` : "Failed to delete category.",
      type: ok ? "success" : "error",
    });
  };

  const handleSeed = async () => {
    const ok = await seedDefaultCategories();
    setToast({
      message: ok ? "Default categories seeded!" : "Failed to seed categories.",
      type: ok ? "success" : "error",
    });
  };

  return (
    <div className="px-4 py-8 flex flex-col gap-5">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Breadcrumb />
      <BreadcrumbHeader
        title="Categories"
        par="Create and manage article categories for your content."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT: Categories List ===== */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Categories Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Tags className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    All Categories
                  </h2>
                  <p className="text-sm text-slate-500">
                    {categories.length} categor
                    {categories.length === 1 ? "y" : "ies"} available
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <p className="text-sm font-medium text-slate-400">
                      Loading categories...
                    </p>
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700 mb-1">
                    No Categories Yet
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-sm">
                    Get started by seeding the default categories or create your
                    own custom ones.
                  </p>
                  <button
                    type="button"
                    onClick={handleSeed}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Seed Default Categories
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((catName, index) => {
                    const color =
                      CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                    const isDeleting = deleting === catName;
                    return (
                      <div
                        key={catName}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                          isDeleting
                            ? "border-red-200 bg-red-50 opacity-60"
                            : `${color.bg} ${color.border} hover:shadow-sm`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${color.dot} shrink-0`}
                          />
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-semibold ${color.text}`}
                            >
                              {catName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Category #{index + 1}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(catName)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Add Category + Info ===== */}
        <div className="flex flex-col gap-6">
          {/* Add Category Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Add Category
                </h3>
                <p className="text-xs text-slate-400">
                  Create a new category for articles
                </p>
              </div>
            </div>

            <div className="px-6 py-5">
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
                    <Hash className="w-3 h-3" />
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder='e.g. "Health", "Gaming", "Sports"...'
                    className="w-full px-3.5 py-2.5 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all text-sm hover:border-slate-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </form>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Hash className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Quick Info</h3>
                <p className="text-xs text-slate-400">About categories</p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total</span>
                <span className="font-bold text-slate-800">
                  {categories.length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Used in articles</span>
                <span className="font-bold text-slate-800">—</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Max categories</span>
                <span className="font-bold text-slate-800">Unlimited</span>
              </div>
              {categories.length > 0 && (
                <button
                  type="button"
                  onClick={handleSeed}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-all cursor-pointer mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Reset to Defaults
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
