import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (router.query.error === "forbidden") {
      setError(
        "Accès refusé. Seuls les administrateurs et les coachs peuvent accéder au back-office."
      );
      void router.replace("/auth/login", undefined, { shallow: true });
    }
  }, [router.query.error, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const isAccessDenied =
        err instanceof Error && err.message === "BACK_OFFICE_ACCESS_DENIED";
      if (isAccessDenied) {
        setError(
          "Accès refusé. Seuls les administrateurs et les coachs peuvent accéder au back-office."
        );
        return;
      }
      const res =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string }; status?: number } })
              .response
          : undefined;
      const message = res?.data?.message;
      if (res?.status === 401 || message === "INVALID_CREDENTIALS") {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB]">
        <p className="text-[#4A5568]">Chargement...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB] p-4">
      <Card className="w-full max-w-md border-gray-200 bg-white shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-[#4A5568]">
            HealthAI Coach
          </CardTitle>
          <p className="text-sm text-[#4A5568] opacity-70">
            Back-office Admin — Connexion
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#4A5568]"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                autoComplete="email"
                className="border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#4A5568]"
              >
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="current-password"
                className="border-gray-200"
              />
              <p className="text-xs text-[#4A5568] opacity-70">
                Minimum 8 caractères
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#4A90E2] hover:bg-[#4A90E2]/90"
              disabled={submitting}
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
