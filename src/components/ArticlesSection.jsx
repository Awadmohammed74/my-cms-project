import { useState } from "react";
import {
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ChevronDown,
  Check,
  FileX,
  Star,
  Eye,
} from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";

function ArticlesSection() {
  const { articles, articlesLoading, searchQuery } = useApp();

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const filterOptions = [
    { value: "all", label: "All Status" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "featured", label: "Featured Only" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "title", label: "Alphabetical (A-Z)" },
  ];

  const currentFilterLabel = filterOptions.find(
    (opt) => opt.value === statusFilter,
  )?.label;
  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === sortBy,
  )?.label;

  // Helper to get article link (slug or id)
  const getArticleLink = (article) => article?.seo?.slug || article?.id;

  const filteredAndSorted = articles
    .filter((article) => {
      if (statusFilter === "published") {
        return (
          article.status?.toLowerCase() === "published" ||
          article.isVisible === true
        );
      }
      if (statusFilter === "draft") {
        return (
          article.status?.toLowerCase() !== "published" && !article.isVisible
        );
      }
      if (statusFilter === "featured") {
        return article.isFeatured === true;
      }
      return true;
    })
    .filter((article) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        article.title?.toLowerCase().includes(query) ||
        article.author?.toLowerCase().includes(query) ||
        article.category?.toLowerCase().includes(query) ||
        article.content?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateA - dateB;
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { id } = confirmDelete;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "articles", id));
      setToast({ message: "Article deleted successfully.", type: "success" });
    } catch (error) {
      console.error("Error deleting article:", error);
      setToast({
        message: "Failed to delete article: " + error.message,
        type: "error",
      });
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (articlesLoading) {
    return (
      <div className="flex justify-center items-center py-16 bg-white border border-slate-200 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Loading articles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${confirmDelete?.title || ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50 gap-3 sm:gap-0">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  setIsSortOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-300 rounded-lg shadow-sm px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                <span className="truncate max-w-24 sm:max-w-none">
                  {currentFilterLabel}
                </span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              </button>
              {isFilterOpen && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterOpen(false)}
                ></div>
              )}
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between ${statusFilter === option.value ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {option.label}
                      {statusFilter === option.value && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsFilterOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-300 rounded-lg shadow-sm px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
                <span className="truncate max-w-24 sm:max-w-none">
                  {currentSortLabel}
                </span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              </button>
              {isSortOpen && (
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSortOpen(false)}
                ></div>
              )}
              {isSortOpen && (
                <div className="absolute left-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center justify-between ${sortBy === option.value ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
                    >
                      {option.label}
                      {sortBy === option.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search results indicator */}
          {searchQuery && (
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-indigo-100">
              Search: "{searchQuery}" ({filteredAndSorted.length})
            </span>
          )}
        </div>

        {/* Mobile Cards View */}
        <div className="sm:hidden">
          {filteredAndSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <FileX className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-base font-semibold text-slate-500">
                No articles found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAndSorted.map((article) => {
                const isPublished =
                  article.status?.toLowerCase() === "published" ||
                  article.isVisible === true;
                return (
                  <div
                    key={article.id}
                    className={`p-4 ${deletingId === article.id ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <div className="flex gap-3 mb-3">
                      <img
                        src={
                          article.image ||
                          article.mainImage ||
                          "https://placehold.co/600x400/e2e8f0/475569?text=No+Image"
                        }
                        alt={article.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1 truncate">
                          {article.title}
                        </h3>
                        <p className="text-xs text-slate-400 mb-2">
                          {article.category}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {article.isFeatured ? (
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ) : (
                          <span className="text-xs text-slate-300">
                            Not featured
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/articles/view/${getArticleLink(article)}`,
                            )
                          }
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View article"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/articles/edit-article/${article.id}`)
                          }
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDelete({
                              id: article.id,
                              title: article.title,
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold uppercase text-slate-500">
                  Title
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold uppercase text-slate-500">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold uppercase text-slate-500 text-center">
                  Featured
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-semibold uppercase text-slate-500 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileX className="w-12 h-12 text-slate-300" />
                      <p className="text-lg font-semibold text-slate-500">
                        No articles found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((article) => {
                  const isPublished =
                    article.status?.toLowerCase() === "published" ||
                    article.isVisible === true;
                  return (
                    <tr
                      key={article.id}
                      className={`hover:bg-slate-50/50 transition-colors ${deletingId === article.id ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <img
                            src={
                              article.image ||
                              article.mainImage ||
                              "https://placehold.co/600x400/e2e8f0/475569?text=No+Image"
                            }
                            alt={article.title}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-100"
                          />
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-slate-900">
                              {article.title}
                            </h3>
                            <span className="text-xs text-slate-400">
                              by {article.author || "Admin"} •{" "}
                              {Math.max(
                                1,
                                Math.ceil(
                                  (article.content?.trim().split(/\s+/)
                                    .length || 0) / 200,
                                ),
                              )}{" "}
                              min read
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-slate-600">
                        {article.category}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full border ${isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                        {article.isFeatured ? (
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 mx-auto" />
                        ) : (
                          <span className="text-slate-200">-</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="flex justify-center gap-2 sm:gap-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/articles/view/${getArticleLink(article)}`,
                              )
                            }
                            className="p-1 sm:p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                            title="View article"
                          >
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/articles/edit-article/${article.id}`)
                            }
                            className="p-1 sm:p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit article"
                          >
                            <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                id: article.id,
                                title: article.title,
                              })
                            }
                            className="p-1 sm:p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ArticlesSection;
