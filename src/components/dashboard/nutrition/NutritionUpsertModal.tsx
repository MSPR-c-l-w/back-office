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
import type { Nutrition } from "@/utils/interfaces/nutrition";
import { deleteNutrition, updateNutrition } from "@/utils/nutritionApi";
import type { UpdateNutritionInput } from "@/utils/nutritionApi";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  nutrition: Nutrition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (nutrition: Nutrition) => void;
  onDeleted: (id: number) => void;
};

const emptyNutrition = {
  name: "",
  category: "",
  calories_kcal: 0,
  protein_g: 0,
  carbohydrates_g: 0,
  fat_g: 0,
  fiber_g: 0,
  sugar_g: 0,
  sodium_mg: 0,
  cholesterol_mg: 0,
  meal_type_name: "",
  water_intake_ml: 0,
  picture_url: "" as string | null,
};

export function NutritionUpsertModal({
  nutrition,
  open,
  onOpenChange,
  onSaved,
  onDeleted,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const n = nutrition ?? emptyNutrition;
  const initial = useMemo(
    () => ({
      name: n.name,
      category: n.category,
      calories_kcal: n.calories_kcal,
      protein_g: n.protein_g,
      carbohydrates_g: n.carbohydrates_g,
      fat_g: n.fat_g,
      fiber_g: n.fiber_g,
      sugar_g: n.sugar_g,
      sodium_mg: n.sodium_mg,
      cholesterol_mg: n.cholesterol_mg,
      meal_type_name: n.meal_type_name,
      water_intake_ml: n.water_intake_ml,
      picture_url: n.picture_url ?? "",
    }),
    [n]
  );

  const [name, setName] = useState(initial.name);
  const [category, setCategory] = useState(initial.category);
  const [calories_kcal, setCalories_kcal] = useState(
    String(initial.calories_kcal)
  );
  const [protein_g, setProtein_g] = useState(String(initial.protein_g));
  const [carbohydrates_g, setCarbohydrates_g] = useState(
    String(initial.carbohydrates_g)
  );
  const [fat_g, setFat_g] = useState(String(initial.fat_g));
  const [fiber_g, setFiber_g] = useState(String(initial.fiber_g));
  const [sugar_g, setSugar_g] = useState(String(initial.sugar_g));
  const [sodium_mg, setSodium_mg] = useState(String(initial.sodium_mg));
  const [cholesterol_mg, setCholesterol_mg] = useState(
    String(initial.cholesterol_mg)
  );
  const [meal_type_name, setMeal_type_name] = useState(initial.meal_type_name);
  const [water_intake_ml, setWater_intake_ml] = useState(
    String(initial.water_intake_ml)
  );
  const [picture_url, setPicture_url] = useState(initial.picture_url);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setIsEditing(false);
    setName(initial.name);
    setCategory(initial.category);
    setCalories_kcal(String(initial.calories_kcal));
    setProtein_g(String(initial.protein_g));
    setCarbohydrates_g(String(initial.carbohydrates_g));
    setFat_g(String(initial.fat_g));
    setFiber_g(String(initial.fiber_g));
    setSugar_g(String(initial.sugar_g));
    setSodium_mg(String(initial.sodium_mg));
    setCholesterol_mg(String(initial.cholesterol_mg));
    setMeal_type_name(initial.meal_type_name);
    setWater_intake_ml(String(initial.water_intake_ml));
    setPicture_url(initial.picture_url);
  }, [open, initial]);

  const goBackToDetails = () => {
    setError(null);
    setIsEditing(false);
    setName(initial.name);
    setCategory(initial.category);
    setCalories_kcal(String(initial.calories_kcal));
    setProtein_g(String(initial.protein_g));
    setCarbohydrates_g(String(initial.carbohydrates_g));
    setFat_g(String(initial.fat_g));
    setFiber_g(String(initial.fiber_g));
    setSugar_g(String(initial.sugar_g));
    setSodium_mg(String(initial.sodium_mg));
    setCholesterol_mg(String(initial.cholesterol_mg));
    setMeal_type_name(initial.meal_type_name);
    setWater_intake_ml(String(initial.water_intake_ml));
    setPicture_url(initial.picture_url);
  };

  function parseNum(val: string): number {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  }

  async function handleSave() {
    if (!nutrition) return;
    setError(null);
    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }

    setLoading(true);
    try {
      const payload: UpdateNutritionInput = {
        name: name.trim(),
        category: category.trim(),
        calories_kcal: parseNum(calories_kcal),
        protein_g: parseNum(protein_g),
        carbohydrates_g: parseNum(carbohydrates_g),
        fat_g: parseNum(fat_g),
        fiber_g: parseNum(fiber_g),
        sugar_g: parseNum(sugar_g),
        sodium_mg: parseNum(sodium_mg),
        cholesterol_mg: parseNum(cholesterol_mg),
        meal_type_name: meal_type_name.trim(),
        water_intake_ml: parseNum(water_intake_ml),
        picture_url: picture_url.trim() || null,
      };

      const saved = await updateNutrition(nutrition.id, payload);
      onSaved(saved);
      onOpenChange(false);
    } catch {
      setError("Impossible d'enregistrer le nutriment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!nutrition) return;
    setLoading(true);
    try {
      await deleteNutrition(nutrition.id);
      onDeleted(nutrition.id);
      setDeleteConfirmOpen(false);
      onOpenChange(false);
    } catch {
      setError("Impossible de supprimer le nutriment.");
    } finally {
      setLoading(false);
    }
  }

  if (!nutrition) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-[#4A5568]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{nutrition.name}</DialogTitle>
            <DialogDescription className="text-[#4A5568]/70">
              ID: {nutrition.id} • {nutrition.category} •{" "}
              {nutrition.meal_type_name}
            </DialogDescription>
          </DialogHeader>

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Calories
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.calories_kcal} kcal
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Protéines
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.protein_g} g
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Glucides
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.carbohydrates_g} g
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Lipides
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.fat_g} g
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Fibres
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.fiber_g} g
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Sucres
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.sugar_g} g
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Sodium
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.sodium_mg} mg
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Cholestérol
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.cholesterol_mg} mg
                </div>
              </div>
              <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                  Eau
                </div>
                <div className="mt-1 text-sm font-semibold text-[#2D3748]">
                  {nutrition.water_intake_ml} ml
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#4A5568]">Nom</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Catégorie</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Type de repas</label>
                <Input
                  value={meal_type_name}
                  onChange={(e) => setMeal_type_name(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">
                  Calories (kcal)
                </label>
                <Input
                  value={calories_kcal}
                  onChange={(e) => setCalories_kcal(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Protéines (g)</label>
                <Input
                  value={protein_g}
                  onChange={(e) => setProtein_g(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Glucides (g)</label>
                <Input
                  value={carbohydrates_g}
                  onChange={(e) => setCarbohydrates_g(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Lipides (g)</label>
                <Input
                  value={fat_g}
                  onChange={(e) => setFat_g(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Fibres (g)</label>
                <Input
                  value={fiber_g}
                  onChange={(e) => setFiber_g(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Sucres (g)</label>
                <Input
                  value={sugar_g}
                  onChange={(e) => setSugar_g(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Sodium (mg)</label>
                <Input
                  value={sodium_mg}
                  onChange={(e) => setSodium_mg(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">
                  Cholestérol (mg)
                </label>
                <Input
                  value={cholesterol_mg}
                  onChange={(e) => setCholesterol_mg(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Eau (ml)</label>
                <Input
                  value={water_intake_ml}
                  onChange={(e) => setWater_intake_ml(e.target.value)}
                  inputMode="decimal"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#4A5568]">URL image</label>
                <Input
                  value={picture_url}
                  onChange={(e) => setPicture_url(e.target.value)}
                  placeholder="https://…"
                  className="bg-white"
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
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="bg-white text-[#4A90E2] border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white"
              >
                Modifier
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={goBackToDetails}
                disabled={loading}
                className="bg-white"
              >
                Précédent
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={loading}
              className="bg-white text-[#FF887B] border-[#FF887B] hover:bg-[#FF887B] hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
            {isEditing && (
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
        title="Supprimer le nutriment"
        description={`Confirmer la suppression de “${nutrition.name}” ?`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        confirmVariant="destructive"
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}
