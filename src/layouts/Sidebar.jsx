import { useState } from "react";
import {
  Settings,
  LogOut,
  Home,
  FileText,
  Layers,
  Tags,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

function Sidebar({ isOpen, setIsOpen }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const links = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/articles", label: "All Articles", icon: Layers },
    { to: "/articles/add", label: "Add Article", icon: FileText },
    { to: "/categories", label: "Categories", icon: Tags },
  ];

  const navLinkStyling = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 p-6 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-wider text-indigo-400">
              PROCMS
            </h2>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
              Enterprise Admin
            </h4>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  {/* ضفنا end هنا عشان نمنع تداخل التنوير */}
                  <NavLink
                    to={link.to}
                    className={navLinkStyling}
                    end
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* الروابط السفلية الثابتة */}
        <ul className="space-y-2 mt-auto border-t border-slate-800 pt-4">
          <li>
            <NavLink
              to="/settings"
              className={navLinkStyling}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </li>

          <li
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white font-medium cursor-pointer transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </li>
        </ul>

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
      </aside>
    </>
  );
}

export default Sidebar;
