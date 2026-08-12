import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { KeyRound, CheckCircle2 } from "lucide-react";
import authService from "../../services/auth.service.js";
import { env } from "../../config/env.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

/**
 * Step 3 of the password-reset flow. Requires `email` + `resetToken` to
 * have been handed off from VerifyOtpPage via router state — landing
 * here without them (refresh, direct URL) sends the user back to start
 * over, since there's no valid reset session to act on.
 */
export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!email || !resetToken) {
    return <Navigate to="/forgot-password" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(email, resetToken, password);
      setIsDone(true);
    } catch (err) {
      setError(err?.message || "Unable to reset your password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isDone) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="h-10 w-10 text-brand-600" />
        <h2 className="text-lg font-semibold text-slate-800">Password reset</h2>
        <p className="text-sm text-slate-500">
          Your password has been updated. You can now sign in with your new password.
        </p>
        {env.useMockApi && (
          <p className="rounded-md border border-dashed border-green-200 bg-green-50 px-3 py-2 text-xs text-slate-600">
            Demo mode: your password wasn't actually changed on the mock
            account. Keep signing in with <code className="rounded bg-green-100 px-1">password123</code>.
          </p>
        )}
        <Button className="mt-1 w-full" onClick={() => navigate("/login", { replace: true })}>
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold text-slate-800">Set a new password</h2>
      <p className="mb-4 text-sm text-slate-500">
        Choose a new password for <span className="font-medium text-slate-700">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="New password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
        />
        <Input
          label="Confirm new password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your new password"
          required
        />

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          <KeyRound className="h-4 w-4" />
          Reset password
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-500">
        <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800 hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
