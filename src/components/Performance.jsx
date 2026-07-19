import { FileText, Eye, Clock, Star, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";

function Performance() {
  const { articles, articlesLoading: loading } = useApp();

  const totalArticles = articles.length;
  const publishedArticles = articles.filter(
    (a) => a.status?.toLowerCase() === "published" || a.isVisible === true,
  ).length;
  const draftArticles = articles.filter(
    (a) => a.status?.toLowerCase() !== "published" && !a.isVisible,
  ).length;
  const featuredArticles = articles.filter((a) => a.isFeatured).length;

  const publishedPercent =
    totalArticles > 0 ? (publishedArticles / totalArticles) * 100 : 0;
  const draftPercent =
    totalArticles > 0 ? (draftArticles / totalArticles) * 100 : 0;
  const featuredPercent =
    totalArticles > 0 ? (featuredArticles / totalArticles) * 100 : 0;

  const metrics = [
    {
      label: "Published",
      value: publishedArticles,
      progress: publishedPercent,
      color: "bg-emerald-500",
      trackColor: "bg-emerald-100",
      icon: Eye,
      iconBg: "bg-emerald-50 text-emerald-600",
      suffix: "",
    },
    {
      label: "Drafts",
      value: draftArticles,
      progress: draftPercent,
      color: "bg-amber-500",
      trackColor: "bg-amber-100",
      icon: Clock,
      iconBg: "bg-amber-50 text-amber-600",
      suffix: "",
    },
    {
      label: "Featured",
      value: featuredArticles,
      progress: featuredPercent,
      color: "bg-purple-500",
      trackColor: "bg-purple-100",
      icon: Star,
      iconBg: "bg-purple-50 text-purple-600",
      suffix: "",
    },
    {
      label: "Total Articles",
      value: totalArticles,
      progress: 100,
      color: "bg-indigo-500",
      trackColor: "bg-indigo-100",
      icon: FileText,
      iconBg: "bg-indigo-50 text-indigo-600",
      suffix: "",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Content Distribution
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              Article breakdown by status
            </p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-slate-400">Loading...</p>
            </div>
          </div>
        ) : (
          metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${metric.iconBg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {metric.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {metric.value}
                    {metric.suffix}
                  </span>
                </div>
                <div
                  className={`h-1.5 w-full rounded-full ${metric.trackColor}`}
                >
                  <div
                    className={`h-1.5 rounded-full ${metric.color} transition-all duration-500`}
                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Status */}
      <div className="px-5 py-3 bg-indigo-50/50 border-t border-indigo-100">
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold text-indigo-700">
            {totalArticles} articles in database
          </span>
        </div>
      </div>
    </div>
  );
}

export default Performance;
