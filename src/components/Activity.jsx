import { FileText, Star, Eye, Clock, ArrowUp, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Activity() {
  const navigate = useNavigate();
  const { articles, articlesLoading: loading } = useApp();

  const recentArticles = [...articles]
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    })
    .slice(0, 6);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getActivityIcon = (article) => {
    const isPublished =
      article.status?.toLowerCase() === "published" ||
      article.isVisible === true;
    if (article.isFeatured) return Star;
    if (isPublished) return ArrowUp;
    return FileText;
  };

  const getIconBg = (article) => {
    const isPublished =
      article.status?.toLowerCase() === "published" ||
      article.isVisible === true;
    if (article.isFeatured) return "bg-amber-50 text-amber-600";
    if (isPublished) return "bg-emerald-50 text-emerald-600";
    return "bg-slate-100 text-slate-500";
  };

  const getActionText = (article) => {
    const isPublished =
      article.status?.toLowerCase() === "published" ||
      article.isVisible === true;
    if (article.isFeatured) return "featured";
    if (isPublished) return "published";
    return "created";
  };

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm w-full ">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-700">Recent Activity</h2>
        </div>

        <button
          onClick={() => navigate("/articles")}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="text-sm font-medium text-slate-400">
                Loading activity...
              </p>
            </div>
          </div>
        ) : recentArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="p-3 rounded-full bg-slate-100 mb-3">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-base font-bold text-slate-600">
              No activity yet
            </p>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              Create your first article to see real-time activity here.
            </p>
          </div>
        ) : (
          recentArticles.map((article) => {
            const Icon = getActivityIcon(article);
            const iconBg = getIconBg(article);
            const action = getActionText(article);
            const timeAgo = getTimeAgo(article.createdAt);

            return (
              <div
                key={article.id}
                onClick={() => navigate(`/articles/view/${article.id}`)}
                className="flex items-start gap-4 px-5 py-4 transition-all cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
              >
                {/* Icon */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-slate-700 leading-snug">
                    <span className="font-semibold text-slate-800">
                      {article.author || "Admin"}
                    </span>{" "}
                    <span className="text-slate-400">{action}</span>{" "}
                    <span className="font-medium text-indigo-600">
                      {article.title}
                    </span>
                  </p>
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo}
                    </span>
                    {article.category && (
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                        {article.category}
                      </span>
                    )}
                    {article.isFeatured && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* View button - always visible */}
                <div className="shrink-0 self-center">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 text-xs font-semibold">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Activity;
