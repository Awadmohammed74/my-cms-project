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
        iconColor: "text-accent",
        iconBg: "bg-rose",
        trendIconColor: "text-accent",
      };
    case "published":
      return {
        icon: CheckCircle,
        trendIcon: Radio,
        iconColor: "text-accent",
        iconBg: "bg-rose",
        trendIconColor: "text-accent",
      };
    case "draft":
      return {
        icon: FileText,
        trendIcon: Clock,
        iconColor: "text-accent",
        iconBg: "bg-rose",
        trendIconColor: "text-accent",
      };
    default:
      return {
        icon: FileText,
        trendIcon: ArrowUp,
        iconColor: "text-accent",
        iconBg: "bg-rose",
        trendIconColor: "text-accent",
      };
  }
};

function StatCards() {
  const { stats } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-9">
      {stats.map((stat) => {
        // استخراج الخصائص مع التأكد من وجود قيمة افتراضية إذا لم تجد الدالة شيئاً
        const {
          icon: Icon,
          trendIcon: TrendIcon,
          iconColor = "text-slate-600",
          iconBg = "bg-slate-100",
          trendIconColor = "text-slate-500",
        } = getCardMeta(stat.type) || {};

        return (
          <div
            key={stat.id}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider truncate">
                {stat.title}
              </span>
              <div
                className={`p-2.5 rounded-lg ${iconBg} transition-colors duration-200`}
              >
                {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
              </div>
            </div>

            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                {TrendIcon && (
                  <TrendIcon className={`w-4 h-4 ${trendIconColor}`} />
                )}
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
