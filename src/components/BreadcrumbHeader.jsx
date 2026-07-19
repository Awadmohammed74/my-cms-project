import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { Dot } from "lucide-react";
function BreadcrumbHeader({ title, par, condition }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <div className="">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
          {title}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1 sm:mt-2">
          {par}
        </p>
      </div>

      {condition ? (
        <Button onClick={() => navigate("/articles/add")} />
      ) : (
        <span className="flex items-center justify-center px-2.5 sm:px-3 py-0.5 text-xs sm:text-sm font-medium rounded-full bg-white text-indigo-600 border border-indigo-200">
          <Dot className="w-5 h-5 sm:w-6 sm:h-6 animate-color-pulse shrink-0" />
          <span>Auto Saving...</span>
        </span>
      )}
    </div>
  );
}
export default BreadcrumbHeader;
