import { FileText, Eye, Clock, TrendingUp, ArrowUp } from "lucide-react";
import { useApp } from "../context/AppContext";

function Action() {
  const { articles, articlesLoading: loading } = useApp();

  const totalArticles = articles.length;
  const publishedArticles = articles.filter(
    (a) => a.status?.toLowerCase() === "published" || a.isVisible === true,
  ).length;
  const draftArticles = articles.filter(
    (a) => a.status?.toLowerCase() !== "published" && !a.isVisible,
  ).length;
  const featuredArticles = articles.filter((a) => a.isFeatured).length;

  const stats = [
    {
      label: "Total Articles",
      value: totalArticles,
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      label: "Published",
      value: publishedArticles,
      icon: Eye,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Drafts",
      value: draftArticles,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Featured",
      value: featuredArticles,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50">
            <ArrowUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Content Overview
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              Quick summary of your content library
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-slate-400">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border ${stat.border} ${stat.bg}`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">
                      {stat.value}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && totalArticles > 0 && (
        <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            {publishedArticles} of {totalArticles} articles published
          </p>
        </div>
      )}
    </div>
  );
}

export default Action;
