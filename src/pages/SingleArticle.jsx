import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Eye,
  BookOpen,
  Star,
  ExternalLink,
  Loader2,
  FileSearch,
} from "lucide-react";
import Toast from "../components/Toast";

function SingleArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setToast({ message: "Article not found.", type: "error" });
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setToast({
          message: "Failed to load article: " + error.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="flex items-center justify-center py-32 bg-white border border-slate-200 rounded-xl mt-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-xs font-medium text-slate-500">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="px-4 py-8">
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-xl">
          <BookOpen className="w-12 h-12 text-slate-300" />
          <p className="text-lg font-semibold text-slate-500 mt-4">Article not found</p>
          <button
            onClick={() => navigate("/articles")}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const isPublished = article.status?.toLowerCase() === "published" || article.isVisible === true;

  return (
    <div className="px-4 py-6 flex flex-col gap-5">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
        <button
          onClick={() => navigate("/articles")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Articles
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border ${isPublished ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
          >
            <span className={`w-1 h-1 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
            {isPublished ? "Published" : "Draft"}
          </span>

          {article.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border border-amber-200 bg-amber-50 text-amber-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Main Article Card */}
      <article className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {article.image && (
          <div className="relative w-full h-[250px] md:h-[350px] overflow-hidden bg-slate-100">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}

        <div className="px-5 md:px-8 py-6">
          {article.category && (
            <div className="mb-3">
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {article.category}
              </span>
            </div>
          )}

          <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">{article.author || "Admin"}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{Math.max(1, Math.ceil((article.content?.trim().split(/\s+/).length || 0) / 200))} min read</span>
            </div>
            {article.createdAt && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.views || 0} views</span>
            </div>
          </div>

          <div className="mt-5">
            {article.content ? (
              <div className="text-sm leading-6 text-slate-700 whitespace-pre-wrap">{article.content}</div>
            ) : (
              <p className="text-xs text-slate-400 italic">No content available for this article.</p>
            )}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-start gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Bottom Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm gap-3">
        <button
          onClick={() => navigate("/articles")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Articles
        </button>
        <button
          onClick={() => navigate(`/articles/edit-article/${article.id}`)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all cursor-pointer shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Edit Article
        </button>
      </div>

      {/* SEO Information */}
      {article.seo && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <FileSearch className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">SEO Information</h3>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {article.seo.metaTitle && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Meta Title</p>
                <p className="text-xs font-medium text-slate-700">{article.seo.metaTitle}</p>
              </div>
            )}
            {article.seo.metaDescription && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Meta Description</p>
                <p className="text-xs font-medium text-slate-700">{article.seo.metaDescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Author</p>
          <p className="text-xs font-semibold text-slate-800 mt-0.5">{article.author || "Admin"}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Category</p>
          <p className="text-xs font-semibold text-slate-800 mt-0.5">{article.category || "Uncategorized"}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Reading Time</p>
          <p className="text-xs font-semibold text-slate-800 mt-0.5">
            {Math.max(1, Math.ceil((article.content?.trim().split(/\s+/).length || 0) / 200))} min read
          </p>
        </div>
      </div>
    </div>
  );
}

export default SingleArticle;