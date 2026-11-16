import { Loader2 } from "lucide-react";

/**
 * Global Splash Screen (presentational component)
 *
 * Shown while the application performs its initial data fetch
 * (auth check + Firestore data loading). A single, professional
 * overlay replaces the chaotic multiple spinners that used to
 * appear across individual components.
 *
 * The `visible` prop controls a fade-out animation:
 *   - visible={true}  → fully opaque (shown)
 *   - visible={false} → fading out / invisible (App unmounts after fade)
 *
 * All timing (minimum duration, fade-out delay) is controlled
 * by the parent component (App.jsx).
 */
function SplashScreen({ visible = true }) {
  const opacity = visible ? "opacity-100" : "opacity-0";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center
                   bg-gradient-to-br from-plum via-secondary to-plum
                   transition-opacity duration-500 ${opacity}`}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center">
          <div className="text-5xl sm:text-6xl font-black tracking-wider text-accent">
            PROCMS
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.25em] mt-1">
            Enterprise Admin
          </p>
        </div>

        {/* Spinner */}
        <div className="relative">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-accent/20 border-t-transparent animate-ping" />
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-slate-300">
            Loading your dashboard…
          </p>
          <p className="text-xs text-slate-500">
            Fetching articles, statistics, and categories
          </p>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;