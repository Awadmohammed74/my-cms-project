import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/config";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import Breadcrumb from "../components/Breadcrumb";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  LogOut,
} from "lucide-react";

function Settings() {
  const { user, updateUserDisplayName, logout } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayEmail = user?.email || "No email available";
  const providerData = user?.providerData?.[0]?.providerId || "password";
  const isGoogleUser = providerData === "google.com";
  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setToast({ message: "Name cannot be empty.", type: "warning" });
      return;
    }
    try {
      setSaving(true);
      await updateUserDisplayName(displayName.trim());
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setToast({
        message: "Please enter your current password.",
        type: "warning",
      });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setToast({
        message: "New password must be at least 6 characters.",
        type: "warning",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "warning" });
      return;
    }
    try {
      setSaving(true);
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setToast({
        message: "Password updated successfully!",
        type: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const messages = {
        "auth/wrong-password": "Current password is incorrect.",
        "auth/requires-recent-login":
          "Please log out and log in again before changing your password.",
      };
      setToast({
        message: messages[error.code] || error.message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="px-4 py-8 flex flex-col gap-5">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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

      <Breadcrumb />
      <BreadcrumbHeader
        title="Settings"
        par="Manage your account profile and security preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT: Profile Card ===== */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Profile Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Profile Information
                  </h2>
                  <p className="text-sm text-slate-500">
                    Update your display name and personal details.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
              {/* Avatar + Name */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <img
                  src={
                    user?.providerData?.[0]?.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "HR")}&background=4f46e5&color=fff&size=200`
                  }
                  alt={displayName || "User"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "HR")}&background=4f46e5&color=fff&size=200`;
                  }}
                />
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500 w-full overflow-hidden">
                  {/* الأيقونة */}
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />

                  {/* الإيميل - مع خاصية truncate عشان لو الإيميل طويل ما يكسرش التصميم */}
                  <span className="truncate">{displayEmail}</span>

                  {/* الـ Badge */}
                  {isGoogleUser && (
                    <span className="ml-auto shrink-0 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      Google
                    </span>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 shadow-sm w-full sm:w-auto"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Password Section (only for email/password users) */}
          {!isGoogleUser && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Change Password
                    </h2>
                    <p className="text-sm text-slate-500">
                      Update your account password directly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-60 shadow-sm w-full sm:w-auto"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== RIGHT: Account Info Sidebar ===== */}
        <div className="flex flex-col gap-6">
          {/* Account Overview */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Account Info
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
                <img
                  src={
                    user?.providerData?.[0]?.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "HR")}&background=4f46e5&color=fff&size=200`
                  }
                  alt={displayName || "User"}
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 mb-3"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "User")}&background=4f46e5&color=fff&size=200`;
                  }}
                />
                <h3 className="text-base font-bold text-slate-900">
                  {displayName || "User"}
                </h3>
                <p className="text-sm text-slate-500">{displayEmail}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Account Type</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {isGoogleUser ? "Google" : "Email"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Member Since</span>
                  <span className="font-semibold text-slate-800">
                    {createdAt}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">User ID</span>
                  <span className="font-semibold text-slate-800 text-xs font-mono bg-slate-100 px-2 py-0.5 rounded max-w-[140px] truncate">
                    {user?.uid || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border border-red-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-red-100 bg-red-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <LogOut className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Sign Out</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                You will be redirected to the login page and need to sign in
                again to access the dashboard.
              </p>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
