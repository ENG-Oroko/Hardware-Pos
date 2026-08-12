import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center">
      <ShieldAlert className="h-12 w-12 text-amber-500" />
      <h1 className="text-xl font-bold text-slate-900">You don't have access to this page</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Your role doesn't include the permissions required here. If you
        believe this is a mistake, contact your business administrator.
      </p>
      <Link to="/dashboard">
        <Button variant="secondary" className="mt-2">
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}
