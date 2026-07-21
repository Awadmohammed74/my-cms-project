import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [toast, setToast] = useState(null);

  const { signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setToast({
        message: "Google login failed: " + error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginWithEmail("hr@procms.com", "HrDemo@2026");
      navigate("/");
    } catch (error) {
      setToast({
        message: "Demo login failed: " + (error.message || "Unknown error"),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToast({
        message: "Please enter email and password.",
        type: "warning",
      });
      return;
    }
    if (isRegister && !username.trim()) {
      setToast({
        message: "Please enter your name.",
        type: "warning",
      });
      return;
    }
    if (password.length < 6) {
      setToast({
        message: "Password must be at least 6 characters.",
        type: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      if (isRegister) {
        await registerWithEmail(email, password, username.trim());
      } else {
        await loginWithEmail(email, password);
      }
      navigate("/");
    } catch (error) {
      const messages = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Invalid email or password.",
        "auth/email-already-in-use":
          "An account with this email already exists.",
        "auth/weak-password":
          "Password is too weak. Use at least 6 characters.",
        "auth/invalid-email": "Invalid email address.",
      };
      setToast({
        message: messages[error.code] || error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-6 px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-indigo-400">
            PROCMS
          </h1>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mt-1">
            Enterprise Admin
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 sm:p-7 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              {isRegister
                ? "Sign up to manage your content"
                : "Sign in to your account"}
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 p-3 rounded-xl font-semibold hover:bg-slate-100 transition-all mb-3.5 sm:mb-4 cursor-pointer disabled:opacity-60 text-sm"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              className="w-5 h-5"
              alt="Google"
            />
            Continue with Google
          </button>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mb-3.5 sm:mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 rounded-xl font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? "Signing in..." : "Demo Login (HR Account)"}
          </button>

          <div className="flex items-center gap-4 mb-3.5 sm:mb-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              or
            </span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
            {/* Username field - only for registration */}
            {isRegister && (
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Your Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 sm:p-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-500 transition-all mt-1 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setUsername("");
                setToast(null);
              }}
              className="text-xs sm:text-sm text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
