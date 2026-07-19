import { useLocation, Link } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="breadcrumb">
      <h5 className="text-sm text-slate-800 flex items-center gap-1">
        <Link
          to="/"
          className="text-slate-500 hover:text-indigo-600 transition-colors"
        >
          Dashboard
        </Link>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          const isLast = index === pathnames.length - 1;

          const displayName = value
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <span key={to} className="flex items-center">
              <span className="mx-2 text-slate-400 font-normal">&gt;</span>

              {isLast ? (
                <span className="font-bold text-indigo-500">{displayName}</span>
              ) : (
                <Link
                  to={to}
                  className="text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  {displayName}
                </Link>
              )}
            </span>
          );
        })}
      </h5>
    </div>
  );
}

export default Breadcrumb;
