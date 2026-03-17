import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Plan } from "@/utils/interfaces/plan";
import { createPlan, deletePlan, updatePlan } from "@/utils/plansApi";
import { Check, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (plan: Plan) => void;
  onDeleted: (id: number) => void;
};

function parseFeatures(raw: string): string[] {
  return raw
    .split(/\r?\n|,/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatPrice(price: number) {
  if (price === 0) return "Gratuit";
  return price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });
}

export function PlanUpsertModal({
  plan,
  open,
  onOpenChange,
  onSaved,
  onDeleted,
}: Props) {
  const isCreate = !plan;
  const [isEditing, setIsEditing] = useState(isCreate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const errorId = "plan-upsert-error";

  const initial = useMemo(
    () => ({
      name: plan?.name ?? "",
      price: plan?.price ?? 0,
      featuresText: (plan?.features ?? []).join("\n"),
    }),
    [plan]
  );

  const [name, setName] = useState(initial.name);
  const [price, setPrice] = useState(String(initial.price));
  const [featuresText, setFeaturesText] = useState(initial.featuresText);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setIsEditing(isCreate);
    setName(initial.name);
    setPrice(String(initial.price));
    setFeaturesText(initial.featuresText);
  }, [open, initial, isCreate]);

  const goBackToDetails = () => {
    if (isCreate) return;
    setError(null);
    setIsEditing(false);
    setName(initial.name);
    setPrice(String(initial.price));
    setFeaturesText(initial.featuresText);
  };

  async function handleSave() {
    setError(null);
    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    const priceNumber = Number(price);
    if (!Number.isFinite(priceNumber) || priceNumber < 0) {
      setError("Le prix doit être un nombre valide.");
      return;
    }
    const features = parseFeatures(featuresText);

    setLoading(true);
    try {
      const saved = isCreate
        ? await createPlan({
            name: name.trim(),
            price: priceNumber,
            features,
          })
        : await updatePlan(plan.id, {
            name: name.trim(),
            price: priceNumber,
            features,
          });

      onSaved(saved);
      onOpenChange(false);
    } catch {
      setError("Impossible d’enregistrer le plan.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!plan) return;
    setLoading(true);
    try {
      await deletePlan(plan.id);
      onDeleted(plan.id);
      setDeleteConfirmOpen(false);
      onOpenChange(false);
    } catch {
      setError("Impossible de supprimer le plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border-[#E2E8F0] bg-white text-[#4A5568] shadow-xl"
          aria-busy={loading}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isCreate ? "Nouveau plan" : plan?.name}
            </DialogTitle>
            <DialogDescription className="text-[#4A5568]/70">
              {isCreate ? "Création d’un plan." : `ID: ${plan?.id}`}
            </DialogDescription>
          </DialogHeader>

          {!isCreate && !isEditing && plan && (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFB] p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-[#4A5568] opacity-70">
                    Prix
                  </span>
                  <span className="text-2xl font-bold text-[#4A90E2]">
                    {formatPrice(plan.price)}
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFB] p-5">
                <h4 className="mb-3 text-sm font-medium text-[#4A5568] opacity-70">
                  Fonctionnalités
                </h4>
                {plan.features.length === 0 ? (
                  <p className="text-sm text-[#4A5568] opacity-60">—</p>
                ) : (
                  <ul className="space-y-2">
                    {plan.features.map((f, idx) => (
                      <li
                        key={`${plan.id}-f-${idx}`}
                        className="flex items-start gap-3 rounded-lg bg-white px-3 py-2.5 text-sm text-[#4A5568] shadow-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5CC58C]" />
                        <span className="min-w-0 flex-1 break-words">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {(isCreate || isEditing) && (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="plan-name" className="text-sm text-[#4A5568]">
                  Nom
                </label>
                <Input
                  id="plan-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Premium"
                  className="bg-white"
                  aria-invalid={!!error && !name.trim()}
                  aria-describedby={error && !name.trim() ? errorId : undefined}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="plan-price" className="text-sm text-[#4A5568]">
                  Prix
                </label>
                <Input
                  id="plan-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="19.99"
                  inputMode="decimal"
                  className="bg-white"
                  aria-invalid={
                    !Number.isFinite(Number(price)) || Number(price) < 0
                  }
                  aria-describedby={error ? errorId : undefined}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="plan-features"
                  className="text-sm text-[#4A5568]"
                >
                  Fonctionnalités (1 par ligne)
                </label>
                <textarea
                  id="plan-features"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder={
                    "Accès illimité\nProgrammes personnalisés\nSupport coach"
                  }
                  className="w-full min-h-28 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  aria-describedby="plan-features-help"
                />
                <p id="plan-features-help" className="text-xs text-[#4A5568]">
                  Saisissez une fonctionnalité par ligne ou séparez-les par des
                  virgules.
                </p>
              </div>
            </div>
          )}

          {error && (
            <p
              id={errorId}
              className="text-sm text-[#FF887B] mt-2"
              role="alert"
            >
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
        title="Supprimer le plan"
        description={
          plan ? `Confirmer la suppression du plan “${plan.name}” ?` : undefined
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
