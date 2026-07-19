import { useState, useRef, useEffect } from "react";
import {
  BellRing,
  Search,
  CircleHelp,
  LogOut,
  X,
  FileText,
  Star,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

function Navbar({ onMenuClick }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const searchRef = useRef(null);

  const { user, logout } = useAuth();
  const { articles, setSearchQuery } = useApp();
  const navigate = useNavigate();

  const searchResults = localSearch.trim()
    ? articles
        .filter((a) => {
          const q = localSearch.toLowerCase();
          return (
            a.title?.toLowerCase().includes(q) ||
            a.author?.toLowerCase().includes(q) ||
            a.category?.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
    setShowSearchResults(true);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearchQuery("");
    setShowSearchResults(false);
    setShowMobileSearch(false);
  };

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Admin";
  const photoURL =
    user?.photoURL ||
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80";
  const email = user?.email || "admin@procms.com";

  return (
    <>
      <nav className="bg-white border-b border-slate-300 px-4 sm:px-6 py-3 shadow-sm">
        <div className="mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Menu + Mobile Search Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Search */}
            <div
              ref={searchRef}
              className="relative hidden sm:block w-80 lg:w-96"
            >
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={localSearch}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (localSearch.trim()) setShowSearchResults(true);
                }}
                placeholder="Search articles, authors, categories..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50/50 py-2 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              {localSearch && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {showSearchResults && (
                <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 animate-scale-in">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-4 text-center">
                      <p className="text-sm text-slate-500">
                        No results for{" "}
                        <span className="font-semibold text-slate-700">
                          "{localSearch}"
                        </span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-2.5 bg-slate-50/50 border-b border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Articles ({searchResults.length})
                        </p>
                      </div>
                      {searchResults.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => {
                            navigate(`/articles/view/${article.id}`);
                            handleClearSearch();
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50/40 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                        >
                          <img
                            src={
                              article.image ||
                              "https://placehold.co/600x400/e2e8f0/475569?text=No+Image"
                            }
                            alt={article.title}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {article.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-400">
                                {article.category || "Uncategorized"}
                              </span>
                              {article.isFeatured && (
                                <span className="flex items-center gap-0.5 text-[11px] font-medium text-amber-600">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                          <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="sm:hidden p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Mobile Search Overlay */}
          {showMobileSearch && (
            <div className="fixed inset-0 z-50 bg-white flex flex-col p-4">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-slate-800">Search</h2>
              </div>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={localSearch}
                  onChange={handleSearchChange}
                  placeholder="Search articles..."
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
                  autoFocus
                />
                {localSearch && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {localSearch.trim() && (
                  <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-10 max-h-80 overflow-y-auto">
                    {searchResults.length === 0 ? (
                      <div className="px-4 py-4 text-center">
                        <p className="text-sm text-slate-500">
                          No results for{" "}
                          <span className="font-semibold text-slate-700">
                            "{localSearch}"
                          </span>
                        </p>
                      </div>
                    ) : (
                      searchResults.map((article) => (
                        <div
                          key={article.id}
                          onClick={() => {
                            navigate(`/articles/view/${article.id}`);
                            handleClearSearch();
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                        >
                          <img
                            src={
                              article.image ||
                              "https://placehold.co/600x400/e2e8f0/475569?text=No+Image"
                            }
                            alt={article.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                              {article.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {article.category}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              aria-label="Notifications"
            >
              <BellRing size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              className="hidden sm:block rounded-lg p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              aria-label="Help"
            >
              <CircleHelp size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-2 sm:gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-slate-400">{email}</p>
              </div>
              <img
                src={photoURL}
                alt={displayName}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-slate-200"
              />
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to log out? You will need to sign in again to access the dashboard."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}

export default Navbar;
