import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-center">
      <Compass className="h-12 w-12 text-slate-400" />
      <h1 className="text-xl font-bold text-slate-900">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/dashboard">
        <Button variant="secondary" className="mt-2">
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}
