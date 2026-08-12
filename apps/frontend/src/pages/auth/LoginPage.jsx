import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";
import { env } from "../../config/env.js";
import { MOCK_USERS, MOCK_PASSWORD } from "../../services/mock/mockAuthData.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Sign in</h2>

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
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="mt-1.5 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand-700 hover:text-brand-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>

      {env.useMockApi && (
        <div className="mt-6 rounded-md border border-dashed border-green-200 bg-green-50 p-3 text-xs text-slate-600">
          <p className="mb-2 font-semibold text-slate-700">
            Demo mode — no backend connected yet
          </p>
          <p className="mb-2">
            Password for every demo account:{" "}
            <code className="rounded bg-green-100 px-1">{MOCK_PASSWORD}</code>
          </p>
          <ul className="space-y-0.5">
            {MOCK_USERS.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(u.email);
                    setPassword(MOCK_PASSWORD);
                  }}
                  className="text-brand-700 underline-offset-2 hover:underline"
                >
                  {u.role}
                </button>{" "}
                — {u.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
