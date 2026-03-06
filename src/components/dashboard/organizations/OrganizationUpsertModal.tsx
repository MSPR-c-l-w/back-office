import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Organization } from "@/utils/interfaces/organization";
import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "@/utils/organizationsApi";
import { Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = {
  organization: Organization | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (organization: Organization) => void;
  onDeleted: (id: number) => void;
};

function formatDate(value: unknown) {
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function extractHttpErrorDetails(e: unknown): {
  status?: number;
  details?: string | null;
  raw?: unknown;
} | null {
  if (typeof e !== "object" || e === null) return null;
  const err = e as {
    response?: { status?: number; data?: unknown };
    message?: unknown;
  };
  const status = err.response?.status;
  const data = err.response?.data;
  const details =
    typeof data === "string"
      ? data
      : data && typeof data === "object"
        ? JSON.stringify(data)
        : typeof err.message === "string"
          ? err.message
          : null;

  if (status == null && details == null) return null;
  return { status: status ?? undefined, details, raw: data };
}

function isUnknownPropertyError(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as { message?: unknown };
  if (!Array.isArray(r.message)) return false;
  return r.message.some(
    (m) =>
      typeof m === "string" &&
      (m.includes("property is_active should not exist") ||
        m.includes("property isActive should not exist"))
  );
}

export function OrganizationUpsertModal({
  organization,
  open,
  onOpenChange,
  onSaved,
  onDeleted,
}: Props) {
  const isCreate = !organization;
  const [isEditing, setIsEditing] = useState(isCreate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const initial = useMemo(
    () => ({
      name: organization?.name ?? "",
      type: organization?.type ?? "",
      primaryColor: organization?.branding_config?.primaryColor ?? "",
      logoUrl: organization?.branding_config?.logoUrl ?? "",
      is_active: organization?.is_active ?? true,
    }),
    [organization]
  );

  const [name, setName] = useState(initial.name);
  const [type, setType] = useState(initial.type);
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor);
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl);
  const [isActive, setIsActive] = useState(initial.is_active);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setInfo(null);
    setIsEditing(isCreate);
    setName(initial.name);
    setType(initial.type);
    setPrimaryColor(initial.primaryColor);
    setLogoUrl(initial.logoUrl);
    setIsActive(initial.is_active);
  }, [open, initial, isCreate]);

  const goBackToDetails = () => {
    if (isCreate) return;
    setError(null);
    setInfo(null);
    setIsEditing(false);
    setName(initial.name);
    setType(initial.type);
    setPrimaryColor(initial.primaryColor);
    setLogoUrl(initial.logoUrl);
    setIsActive(initial.is_active);
  };

  async function handleSave() {
    setError(null);
    setInfo(null);
    if (!name.trim() || !type.trim()) {
      setError("Le nom et le type sont obligatoires.");
      return;
    }
    setLoading(true);
    try {
      const branding_config =
        primaryColor.trim() || logoUrl.trim()
          ? {
              ...(primaryColor.trim()
                ? { primaryColor: primaryColor.trim() }
                : {}),
              ...(logoUrl.trim() ? { logoUrl: logoUrl.trim() } : {}),
            }
          : undefined;

      const basePayload = {
        name: name.trim(),
        type: type.trim(),
        branding_config,
      };

      const payloadWithStatusSnake = { ...basePayload, is_active: isActive };
      const payloadWithStatusCamel = { ...basePayload, isActive };

      const saveWith = async (
        payload:
          | typeof basePayload
          | typeof payloadWithStatusSnake
          | typeof payloadWithStatusCamel
      ) =>
        isCreate
          ? await createOrganization(payload)
          : await updateOrganization(organization.id, payload);

      let saved: Organization;
      let statusIgnored = false;
      try {
        saved = await saveWith(payloadWithStatusSnake);
      } catch (e: unknown) {
        const info = extractHttpErrorDetails(e);
        if (info?.status === 400 && isUnknownPropertyError(info.raw)) {
          try {
            saved = await saveWith(payloadWithStatusCamel);
          } catch (e2: unknown) {
            const info2 = extractHttpErrorDetails(e2);
            if (info2?.status === 400 && isUnknownPropertyError(info2.raw)) {
              statusIgnored = true;
              saved = await saveWith(basePayload);
            } else {
              throw e2;
            }
          }
        } else {
          throw e;
        }
      }

      onSaved(saved);
      onOpenChange(false);
      if (statusIgnored) {
        setInfo(
          "Organisation enregistrée, mais l’API ne permet pas de modifier le statut (active/inactive)."
        );
      }
    } catch (e: unknown) {
      const info = extractHttpErrorDetails(e);
      setError(
        `Impossible d’enregistrer l’organisation${
          info?.status ? ` (HTTP ${info.status})` : ""
        }${info?.details ? ` : ${info.details}` : ""}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!organization) return;
    setError(null);
    setLoading(true);
    try {
      await deleteOrganization(organization.id);
      onDeleted(organization.id);
      setDeleteConfirmOpen(false);
      onOpenChange(false);
    } catch {
      setError("Impossible de supprimer l’organisation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-[#4A5568]">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={organization?.branding_config?.logoUrl ?? logoUrl}
                  />
                  <AvatarFallback className="bg-[#4A90E2] text-white">
                    {(organization?.name ?? name ?? "OR")
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase())
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl truncate">
                    {isCreate ? "Nouvelle organisation" : organization?.name}
                  </DialogTitle>
                  <DialogDescription className="text-[#4A5568]/70">
                    {isCreate
                      ? "Création d’une organisation."
                      : `ID: ${organization?.id} • Créée le ${formatDate(
                          organization?.created_at
                        )}`}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

        {!isCreate && !isEditing && organization && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-sm text-[#4A5568] opacity-70">Type</div>
                <div className="text-lg font-semibold text-[#4A5568] mt-1">
                  {organization.type}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-sm text-[#4A5568] opacity-70">Statut</div>
                <Badge
                  variant="outline"
                  className={
                    organization.is_active
                      ? "mt-2 bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]"
                      : "mt-2 bg-gray-200 text-gray-600 border-gray-300"
                  }
                >
                  {organization.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="text-sm text-[#4A5568] opacity-70">Branding</div>
                <div className="text-sm text-[#4A5568] mt-2 space-y-2">
                  <div>
                    <span className="opacity-70">Couleur:</span>{" "}
                    {organization.branding_config?.primaryColor ?? "—"}
                  </div>
                  {organization.branding_config?.logoUrl ? (
                    <>
                      <Image
                        src={organization.branding_config.logoUrl}
                      alt={`Logo ${organization.name}`}
                      width={192}
                      height={64}
                      unoptimized
                      className="h-14 w-auto rounded-md border bg-white object-contain"
                      />
                      {organization.branding_config.logoUrl.startsWith(
                        "data:"
                      ) ? (
                        <span className="text-xs text-[#4A5568]/70">
                          Logo intégré
                        </span>
                      ) : (
                        <a
                          href={organization.branding_config.logoUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={organization.branding_config.logoUrl}
                          className="text-xs text-[#4A90E2] hover:underline"
                        >
                          Ouvrir le logo
                        </a>
                      )}
                    </>
                  ) : (
                    <div className="opacity-70">Logo: —</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {(isCreate || isEditing) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm text-[#4A5568]">Nom</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ACME"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#4A5568]">Type</label>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="gym"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#4A5568]">
                Couleur primaire (hex)
              </label>
              <Input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#111827"
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#4A5568]">Logo URL</label>
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="bg-white"
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-2 pt-2">
              <Checkbox
                checked={isActive}
                onCheckedChange={(v) => setIsActive(v === true)}
                id="org-active"
              />
              <label htmlFor="org-active" className="text-sm text-[#4A5568]">
                Organisation active
              </label>
            </div>
          </div>
        )}

        {info && (
          <p className="text-sm text-[#4A90E2] mt-2" role="status">
            {info}
          </p>
        )}
        {error && (
          <p className="text-sm text-[#FF887B] mt-2" role="alert">
            {error}
          </p>
        )}

        <DialogFooter className="mt-6 flex flex-row justify-end gap-2">
          {!isCreate && !isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
            >
              Modifier
            </Button>
          )}
          {!isCreate && isEditing && (
            <Button
              variant="outline"
              onClick={goBackToDetails}
              disabled={loading}
              className="bg-white"
            >
              Précédent
            </Button>
          )}
          {!isCreate && (
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={loading}
              className="bg-white text-[#FF887B] border-[#FF887B] hover:bg-[#FF887B] hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          )}
          {(isCreate || isEditing) && (
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Supprimer l’organisation"
        description={
          organization
            ? `Confirmer la suppression (soft-delete) de “${organization.name}” ?`
            : undefined
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        confirmVariant="destructive"
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}

