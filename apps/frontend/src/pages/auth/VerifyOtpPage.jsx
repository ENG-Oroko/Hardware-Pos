import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import authService from "../../services/auth.service.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

/**
 * Step 2 of the password-reset flow. Requires `email` (and, in mock mode,
 * `demoOtp`) to have been handed off from ForgotPasswordPage via router
 * state — if a user lands here directly (e.g. refresh, bookmarked URL)
 * we send them back to start the flow properly rather than guessing.
 */
export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const demoOtp = location.state?.demoOtp;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentDemoOtp, setCurrentDemoOtp] = useState(demoOtp);
  const [resendMessage, setResendMessage] = useState(null);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Enter the 6-digit code we sent you.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { resetToken } = await authService.verifyOtp(email, otp);
      navigate("/reset-password", { state: { email, resetToken } });
    } catch (err) {
      setError(err?.message || "That code isn't valid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setResendMessage(null);
    setIsResending(true);
    try {
      const result = await authService.requestPasswordReset(email);
      setCurrentDemoOtp(result.otp);
      setResendMessage("A new code has been sent.");
    } catch (err) {
      setError(err?.message || "Unable to resend the code right now.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div>
      <Link
        to="/forgot-password"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Use a different email
      </Link>

      <h2 className="mb-1 text-lg font-semibold text-slate-800">Enter the code</h2>
      <p className="mb-4 text-sm text-slate-500">
        We sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span>.
        It expires in 10 minutes.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="6-digit code"
          name="otp"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
          className="text-center text-lg font-semibold tracking-[0.5em]"
          required
        />

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        {resendMessage && !error && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            {resendMessage}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          <ShieldCheck className="h-4 w-4" />
          Verify code
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-slate-500">
        Didn't get a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="font-medium text-brand-700 hover:text-brand-800 hover:underline disabled:text-slate-400"
        >
          {isResending ? "Resending..." : "Resend code"}
        </button>
      </div>

      {currentDemoOtp && (
        <div className="mt-6 rounded-md border border-dashed border-green-200 bg-green-50 p-3 text-center text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Demo mode — no SMS/email connected yet</p>
          <p className="mt-1">
            Your code is{" "}
            <code className="rounded bg-green-100 px-1 text-sm font-semibold tracking-widest">
              {currentDemoOtp}
            </code>
          </p>
        </div>
      )}
    </div>
  );
}
