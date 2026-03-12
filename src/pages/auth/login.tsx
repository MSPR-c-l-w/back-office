import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/** Mot de passe commun des comptes seed (affiché uniquement en dev). */
const DEV_SEED_PASSWORD = "SeedPassword123!";

type DevAdmin = { email: string; first_name: string; last_name: string };

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [devAdmins, setDevAdmins] = useState<DevAdmin[] | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (router.query.error === "forbidden") {
      setError(
        "Accès refusé. Seuls les administrateurs peuvent accéder au back-office."
      );
      void router.replace("/auth/login", undefined, { shallow: true });
    }
  }, [router.query.error, router]);

  useEffect(() => {
    if (!isDev) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;
    fetch(`${apiUrl.replace(/\/$/, "")}/auth/dev-accounts`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { admins: DevAdmin[] }) => setDevAdmins(data.admins ?? []))
      .catch(() => setDevAdmins([]));
  }, [isDev]);

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
          "Accès refusé. Seuls les administrateurs peuvent accéder au back-office."
        );
        return;
      }
      const res =
        err && typeof err === "object" && "response" in err
          ? (
              err as {
                response?: { data?: { message?: string }; status?: number };
              }
            ).response
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
      <div className="flex w-full max-w-md flex-col items-center">
        <Card className="w-full border-gray-200 bg-white shadow-sm">
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

        {isDev && (
          <Card className="mt-8 w-full border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex flex-wrap items-center gap-2 text-base font-semibold text-amber-900">
                <span>🛠️ Outil de développement</span>
              </CardTitle>
              <p className="text-xs text-amber-800">
                Cette carte n’apparaît qu’en mode développement
                (NODE_ENV=development). Cliquez sur un nom pour remplir
                automatiquement email et mot de passe.
              </p>
              <p className="mt-1 text-sm font-medium text-amber-900">
                Mot de passe commun des comptes admin (seed) :{" "}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-amber-900">
                  {DEV_SEED_PASSWORD}
                </code>
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {devAdmins === null ? (
                <p className="text-sm text-amber-800">
                  Chargement des comptes…
                </p>
              ) : devAdmins.length === 0 ? (
                <p className="text-sm text-amber-800">
                  Aucun compte admin trouvé (lancez le seed du backend si
                  besoin).
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border border-amber-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-amber-200 bg-amber-100/70">
                        <th className="px-3 py-2 text-left font-medium text-amber-900">
                          Nom (ADMIN)
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-amber-900">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {devAdmins.map((admin) => (
                        <tr
                          key={admin.email}
                          className="cursor-pointer border-b border-amber-100 transition-colors hover:bg-amber-100/50"
                          onClick={() => {
                            setEmail(admin.email);
                            setPassword(DEV_SEED_PASSWORD);
                            setError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setEmail(admin.email);
                              setPassword(DEV_SEED_PASSWORD);
                              setError(null);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                        >
                          <td className="px-3 py-2 font-medium text-amber-900">
                            {admin.first_name} {admin.last_name}
                          </td>
                          <td className="px-3 py-2 text-amber-800">
                            {admin.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
