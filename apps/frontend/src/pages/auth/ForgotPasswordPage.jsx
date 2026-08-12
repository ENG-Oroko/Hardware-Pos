import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import authService from "../../services/auth.service.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { env } from "../../config/env.js";

/**
 * Step 1 of the password-reset flow. Sends the account email off to
 * request an OTP, then hands off to VerifyOtpPage via router state.
 * Does not need AuthContext for anything except confirming this page is
 * only reachable while logged out (handled by PublicOnlyRoute already).
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await authService.requestPasswordReset(email);
      navigate("/verify-otp", {
        state: { email, demoOtp: env.useMockApi ? result.otp : undefined },
      });
    } catch (err) {
      setError(err?.message || "Unable to send a reset code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Link
        to="/login"
        className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>

      <h2 className="mb-1 text-lg font-semibold text-slate-800">Forgot your password?</h2>
      <p className="mb-4 text-sm text-slate-500">
        Enter the email on your account and we'll send you a 6-digit code to
        reset your password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.co.ke"
          required
        />

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          <Mail className="h-4 w-4" />
          Send reset code
        </Button>
      </form>
    </div>
  );
}
