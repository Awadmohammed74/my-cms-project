import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

const variants = {
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    iconColor: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    iconColor: "text-amber-500",
  },
};

function Toast({ message, type = "success", onClose, duration = 4000 }) {
  const {
    icon: Icon,
    bg,
    text,
    iconColor,
  } = variants[type] || variants.success;

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg ${bg} min-w-[320px] max-w-md`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
        <p className={`text-sm font-medium flex-1 ${text}`}>{message}</p>
        <button
          onClick={onClose}
          className={`cursor-pointer p-1 rounded-lg hover:bg-black/5 transition-colors ${text}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
عنوان 