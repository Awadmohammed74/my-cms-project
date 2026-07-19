import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, FileX } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
          <FileX className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-6xl font-black text-slate-200 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
