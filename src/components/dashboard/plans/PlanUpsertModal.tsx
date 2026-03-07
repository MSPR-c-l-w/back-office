import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Save, Trash2 } from "lucide-react";
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-[#4A5568]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {isCreate ? "Nouveau plan" : plan?.name}
            </DialogTitle>
            <DialogDescription className="text-[#4A5568]/70">
              {isCreate ? "Création d’un plan." : `ID: ${plan?.id}`}
            </DialogDescription>
          </DialogHeader>

          {!isCreate && !isEditing && plan && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="text-sm text-[#4A5568] opacity-70">Prix</div>
                  <div className="text-lg font-semibold text-[#4A5568] mt-1">
                    {formatPrice(plan.price)}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white md:col-span-2">
                <CardContent className="pt-6">
                  <div className="text-sm text-[#4A5568] opacity-70">
                    Fonctionnalités
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {plan.features.length === 0 ? (
                      <span className="text-sm text-[#4A5568] opacity-70">
                        —
                      </span>
                    ) : (
                      plan.features.map((f, idx) => (
                        <Badge
                          key={`${plan.id}-f-${idx}`}
                          variant="outline"
                          className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                        >
                          {f}
                        </Badge>
                      ))
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
                  placeholder="Premium"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Prix</label>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="19.99"
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#4A5568]">
                  Fonctionnalités (1 par ligne)
                </label>
                <textarea
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder={
                    "Accès illimité\nProgrammes personnalisés\nSupport coach"
                  }
                  className="w-full min-h-28 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
            </div>
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
