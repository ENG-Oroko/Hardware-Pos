const SIZE_CLASSES = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

/**
 * Generic loading indicator. Use `fullScreen` for route-level/auth-restore
 * loading states, and the bare spinner inline within buttons or cards.
 */
export default function LoadingSpinner({ size = "md", fullScreen = false, label }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <span
        className={`animate-spin rounded-full border-brand-600 border-t-transparent ${SIZE_CLASSES[size]}`}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
