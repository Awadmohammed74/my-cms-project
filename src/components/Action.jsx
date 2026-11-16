import { FileText, Eye, Clock, TrendingUp, ArrowUp } from "lucide-react";
import { useApp } from "../context/AppContext";

function Action() {
  const { articles } = useApp();

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
      color: "text-primary",
      bg: "bg-cream",
      border: "border-rose",
    },
    {
      label: "Published",
      value: publishedArticles,
      icon: Eye,
      color: "text-accent",
      bg: "bg-cream",
      border: "border-rose",
    },
    {
      label: "Drafts",
      value: draftArticles,
      icon: Clock,
      color: "text-accent",
      bg: "bg-cream",
      border: "border-rose",
    },
    {
      label: "Featured",
      value: featuredArticles,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-rose",
      border: "border-rose",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cream">
            <ArrowUp className="w-4 h-4 text-primary" />
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
      </div>

      {/* Footer */}
      {totalArticles > 0 && (
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
