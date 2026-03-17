import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization } from "@/utils/interfaces/organization";
import type { Role } from "@/utils/interfaces/role";
import type { User } from "@/utils/interfaces/user";
import { listOrganizations } from "@/utils/organizationsApi";
import { listRoles } from "@/utils/rolesApi";
import { updateUser, updateUserRole } from "@/utils/usersApi";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (user: User) => void;
};

function extractHttpErrorMessage(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const err = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const message = err.response?.data?.message;
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  if (typeof message === "string") {
    return message;
  }
  return typeof err.message === "string" ? err.message : null;
}

export function UserUpdateModal({ user, open, onOpenChange, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const initial = useMemo(
    () => ({
      email: user?.email ?? "",
      firstName: user?.first_name ?? "",
      lastName: user?.last_name ?? "",
      height: user?.height != null ? String(user.height) : "",
      organizationId:
        user?.organization?.id != null ? String(user.organization.id) : "",
      roleId: user?.role?.id != null ? String(user.role.id) : "none",
    }),
    [user]
  );

  const [email, setEmail] = useState(initial.email);
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [height, setHeight] = useState(initial.height);
  const [organizationId, setOrganizationId] = useState(initial.organizationId);
  const [roleId, setRoleId] = useState(initial.roleId);
  const fieldErrorId = "user-update-error";

  useEffect(() => {
    if (!open || !user) return;
    setError(null);
    setEmail(initial.email);
    setFirstName(initial.firstName);
    setLastName(initial.lastName);
    setHeight(initial.height);
    setOrganizationId(initial.organizationId);
    setRoleId(initial.roleId);
  }, [open, user, initial]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingOptions(true);
    Promise.all([listOrganizations(), listRoles()])
      .then(([orgs, rolesData]) => {
        if (cancelled) return;
        setOrganizations(orgs);
        setRoles(rolesData);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Impossible de charger les options d’édition.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingOptions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSave() {
    if (!user) return;
    setError(null);

    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError("L’email, le prénom et le nom sont obligatoires.");
      return;
    }

    const nextHeight = height.trim() === "" ? undefined : Number(height);
    if (nextHeight !== undefined && !Number.isFinite(nextHeight)) {
      setError("La taille doit être un nombre valide.");
      return;
    }

    const payload = {
      email: email.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      ...(nextHeight !== undefined ? { height: nextHeight } : {}),
      ...(organizationId ? { organization_id: Number(organizationId) } : {}),
    };

    setLoading(true);
    try {
      let savedUser = await updateUser(user.id, payload);
      const initialRoleId =
        user.role?.id != null ? String(user.role.id) : "none";
      if (roleId !== initialRoleId) {
        savedUser = await updateUserRole(user.id, {
          role_id: roleId === "none" ? null : Number(roleId),
        });
      }
      onSaved(savedUser);
      onOpenChange(false);
    } catch (e: unknown) {
      const details = extractHttpErrorMessage(e);
      setError(
        details
          ? `Impossible d’enregistrer l’utilisateur : ${details}`
          : "Impossible d’enregistrer l’utilisateur."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl bg-white text-[#4A5568]"
        aria-busy={loading || loadingOptions}
      >
        <DialogHeader>
          <DialogTitle>Modifier l’utilisateur</DialogTitle>
          <DialogDescription className="text-[#4A5568]/70">
            Mettez à jour les informations modifiables du profil.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="user-first-name" className="text-sm text-[#4A5568]">
              Prénom
            </label>
            <Input
              id="user-first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="bg-white"
              disabled={loading || loadingOptions}
              aria-invalid={!!error && !firstName.trim()}
              aria-describedby={
                error && !firstName.trim() ? fieldErrorId : undefined
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="user-last-name" className="text-sm text-[#4A5568]">
              Nom
            </label>
            <Input
              id="user-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="bg-white"
              disabled={loading || loadingOptions}
              aria-invalid={!!error && !lastName.trim()}
              aria-describedby={
                error && !lastName.trim() ? fieldErrorId : undefined
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="user-email" className="text-sm text-[#4A5568]">
              Email
            </label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              className="bg-white"
              disabled={loading || loadingOptions}
              aria-invalid={!!error && !email.trim()}
              aria-describedby={
                error && !email.trim() ? fieldErrorId : undefined
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="user-height" className="text-sm text-[#4A5568]">
              Taille (cm)
            </label>
            <Input
              id="user-height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="178"
              inputMode="decimal"
              className="bg-white"
              disabled={loading || loadingOptions}
              aria-invalid={
                !!error &&
                height.trim() !== "" &&
                !Number.isFinite(Number(height))
              }
              aria-describedby={
                error &&
                height.trim() !== "" &&
                !Number.isFinite(Number(height))
                  ? fieldErrorId
                  : undefined
              }
            />
          </div>
          <div className="space-y-2">
            <label id="user-role-label" className="text-sm text-[#4A5568]">
              Rôle
            </label>
            <Select
              value={roleId}
              onValueChange={setRoleId}
              disabled={loading || loadingOptions}
            >
              <SelectTrigger
                className="w-full bg-white"
                aria-labelledby="user-role-label"
              >
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun rôle</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              id="user-organization-label"
              className="text-sm text-[#4A5568]"
            >
              Organisation
            </label>
            <Select
              value={organizationId || undefined}
              onValueChange={setOrganizationId}
              disabled={loading || loadingOptions}
            >
              <SelectTrigger
                className="w-full bg-white"
                aria-labelledby="user-organization-label"
              >
                <SelectValue placeholder="Sélectionner une organisation" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((organization) => (
                  <SelectItem
                    key={organization.id}
                    value={String(organization.id)}
                  >
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <p
            id={fieldErrorId}
            className="text-sm text-[#FF887B] mt-2"
            role="alert"
          >
            {error}
          </p>
        )}

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="bg-white"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || loadingOptions}
            className="bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
