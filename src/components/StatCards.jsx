import {
  Archive,
  CheckCircle,
  ArrowUp,
  Radio,
  Clock,
  FileText,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const getCardMeta = (type) => {
  switch (type) {
    case "total":
      return {
        icon: Archive,
        trendIcon: ArrowUp,
        iconColor: "text-violet-600",
        iconBg: "bg-violet-100",
        trendIconColor: "text-violet-600",
      };
    case "published":
      return {
        icon: CheckCircle,
        trendIcon: Radio,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-100",
        trendIconColor: "text-emerald-600",
      };
    case "draft":
      return {
        icon: FileText,
        trendIcon: Clock,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-100",
        trendIconColor: "text-amber-600",
      };
    default:
      return {
        icon: FileText,
        trendIcon: ArrowUp,
        iconColor: "text-gray-600",
        iconBg: "bg-gray-100",
        trendIconColor: "text-gray-600",
      };
  }
};

function StatCards() {
  const { stats, statsLoading } = useApp();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-white border border-slate-200 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-9">
      {stats.map((stat) => {
        const {
          icon: Icon,
          trendIcon: TrendIcon,
          iconColor,
          iconBg,
          trendIconColor,
        } = getCardMeta(stat.type);
        return (
          <div
            key={stat.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`p-2.5 rounded-lg ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">
                {stat.value}
              </span>
              <div className="flex items-center gap-1.5">
                <TrendIcon className={`w-4 h-4 ${trendIconColor}`} />
                <span className={`text-sm font-semibold ${trendIconColor}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatCards;
