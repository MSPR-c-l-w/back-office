import { Badge } from "@/components/ui/badge";
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
import { deleteExercise, updateExercise } from "@/utils/exercisesApi";
import type { UpdateExerciseInput } from "@/utils/exercisesApi";
import type { Exercise } from "@/utils/interfaces/exercise";
import { Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Props = {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (exercise: Exercise) => void;
  onDeleted: (id: number) => void;
};

function parseList(raw: string): string[] {
  return raw
    .split(/\r?\n|,/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function scrollExerciseModalToTop() {
  const el = document.querySelector(
    '[data-exercise-modal="true"]'
  ) as HTMLElement | null;
  el?.scrollTo({ top: 0, behavior: "smooth" });
}

export function ExerciseUpsertModal({
  exercise,
  open,
  onOpenChange,
  onSaved,
  onDeleted,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const initial = useMemo(
    () => ({
      name: exercise?.name ?? "",
      level: exercise?.level ?? "",
      category: exercise?.category ?? "",
      mechanic: exercise?.mechanic ?? "",
      equipment: exercise?.equipment ?? "",
      exercise_type: exercise?.exercise_type ?? "",
      primary_muscles: (exercise?.primary_muscles ?? []).join("\n"),
      secondary_muscles: (exercise?.secondary_muscles ?? []).join("\n"),
      instructions: (exercise?.instructions ?? []).join("\n"),
      image_urls: (exercise?.images_urls ?? []).join("\n"),
    }),
    [exercise]
  );

  const [name, setName] = useState(initial.name);
  const [level, setLevel] = useState(initial.level);
  const [category, setCategory] = useState(initial.category);
  const [mechanic, setMechanic] = useState(initial.mechanic);
  const [equipment, setEquipment] = useState(initial.equipment);
  const [exerciseType, setExerciseType] = useState(initial.exercise_type);
  const [primaryMuscles, setPrimaryMuscles] = useState(initial.primary_muscles);
  const [secondaryMuscles, setSecondaryMuscles] = useState(
    initial.secondary_muscles
  );
  const [instructions, setInstructions] = useState(initial.instructions);
  const [imageUrls, setImageUrls] = useState(initial.image_urls);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setIsEditing(false);
    setName(initial.name);
    setLevel(initial.level);
    setCategory(initial.category);
    setMechanic(initial.mechanic);
    setEquipment(initial.equipment);
    setExerciseType(initial.exercise_type);
    setPrimaryMuscles(initial.primary_muscles);
    setSecondaryMuscles(initial.secondary_muscles);
    setInstructions(initial.instructions);
    setImageUrls(initial.image_urls);
  }, [open, initial]);

  const goBackToDetails = () => {
    setError(null);
    setIsEditing(false);
    setName(initial.name);
    setLevel(initial.level);
    setCategory(initial.category);
    setMechanic(initial.mechanic);
    setEquipment(initial.equipment);
    setExerciseType(initial.exercise_type);
    setPrimaryMuscles(initial.primary_muscles);
    setSecondaryMuscles(initial.secondary_muscles);
    setInstructions(initial.instructions);
    setImageUrls(initial.image_urls);
    requestAnimationFrame(scrollExerciseModalToTop);
  };

  async function handleSave() {
    if (!exercise) return;
    setError(null);
    if (!name.trim()) {
      setError("Le nom est obligatoire.");
      return;
    }
    const payload: UpdateExerciseInput = {
      name: name.trim(),
      level: level.trim(),
      category: category.trim(),
      mechanic: mechanic.trim() || null,
      equipment: equipment.trim() || null,
      exercise_type: exerciseType.trim(),
      primary_muscles: parseList(primaryMuscles),
      secondary_muscles: parseList(secondaryMuscles),
      instructions: parseList(instructions),
      image_urls: parseList(imageUrls),
    };

    setLoading(true);
    try {
      const saved = await updateExercise(exercise.id, payload);
      onSaved(saved);
      onOpenChange(false);
    } catch {
      setError("Impossible d’enregistrer l’exercice.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!exercise) return;
    setLoading(true);
    try {
      await deleteExercise(exercise.id);
      onDeleted(exercise.id);
      setDeleteConfirmOpen(false);
      onOpenChange(false);
    } catch {
      setError("Impossible de supprimer l’exercice.");
    } finally {
      setLoading(false);
    }
  }

  if (!exercise) return null;
  const images = exercise.images_urls ?? [];
  const heroImage = images.find((u) => typeof u === "string" && u.trim().length > 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          data-exercise-modal="true"
          className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-[#4A5568]"
        >
          <DialogHeader>
            <div className="flex items-start gap-4">
              {heroImage ? (
                <a
                  href={heroImage}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-md border bg-white overflow-hidden"
                  title="Ouvrir l'image"
                >
                  <Image
                    src={heroImage}
                    alt={exercise.name}
                    width={72}
                    height={72}
                    unoptimized
                    className="h-16 w-16 object-cover"
                  />
                </a>
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-md border bg-gray-50 flex items-center justify-center text-xs text-[#4A5568]/60">
                  —
                </div>
              )}

              <div className="min-w-0">
                <DialogTitle className="text-2xl truncate">
                  {exercise.name}
                </DialogTitle>
                <DialogDescription className="text-[#4A5568]/70">
                  ID: {exercise.id} • {exercise.category} • {exercise.level}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {!isEditing ? (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                    Type
                  </div>
                  <div
                    className="mt-1 text-sm font-semibold text-[#2D3748] truncate"
                    title={exercise.exercise_type}
                  >
                    {exercise.exercise_type || "—"}
                  </div>
                </div>

                <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                    Équipement
                  </div>
                  <div
                    className="mt-1 text-sm font-semibold text-[#2D3748] truncate"
                    title={exercise.equipment ?? undefined}
                  >
                    {exercise.equipment ?? "—"}
                  </div>
                </div>

                <div className="rounded-md border bg-[#F8FAFB] px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-[#4A5568]/70">
                    Mécanique
                  </div>
                  <div
                    className="mt-1 text-sm font-semibold text-[#2D3748] truncate"
                    title={exercise.mechanic ?? undefined}
                  >
                    {exercise.mechanic ?? "—"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-[#4A5568] opacity-70">
                  Muscles principaux
                </div>
                <div className="flex flex-wrap gap-2">
                  {(exercise.primary_muscles ?? []).map((m) => (
                    <Badge
                      key={`pm-${exercise.id}-${m}`}
                      variant="outline"
                      className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]"
                    >
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>

              {!!exercise.secondary_muscles?.length && (
                <div className="space-y-2">
                  <div className="text-sm text-[#4A5568] opacity-70">
                    Muscles secondaires
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(exercise.secondary_muscles ?? []).map((m) => (
                      <Badge
                        key={`sm-${exercise.id}-${m}`}
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-300"
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {!!exercise.instructions?.length && (
                <div className="space-y-2">
                  <div className="text-sm text-[#4A5568] opacity-70">
                    Instructions
                  </div>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-[#4A5568]">
                    {(exercise.instructions ?? []).map((s, idx) => (
                      <li key={`inst-${exercise.id}-${idx}`}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}

              {!!exercise.images_urls?.length && (
                <div className="space-y-2">
                  <div className="text-sm text-[#4A5568] opacity-70">
                    Images
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(exercise.images_urls ?? []).slice(0, 8).map((url, idx) => (
                      <a
                        key={`img-${exercise.id}-${idx}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border bg-white overflow-hidden"
                        title="Ouvrir l'image"
                      >
                        <Image
                          src={url}
                          alt={`${exercise.name} ${idx + 1}`}
                          width={320}
                          height={200}
                          unoptimized
                          className="h-24 w-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Nom</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Niveau</label>
                <Input value={level} onChange={(e) => setLevel(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Catégorie</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Type</label>
                <Input
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Équipement</label>
                <Input
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#4A5568]">Mécanique</label>
                <Input
                  value={mechanic}
                  onChange={(e) => setMechanic(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#4A5568]">
                  Muscles principaux (1 par ligne)
                </label>
                <textarea
                  value={primaryMuscles}
                  onChange={(e) => setPrimaryMuscles(e.target.value)}
                  className="w-full min-h-20 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#4A5568]">
                  Muscles secondaires (1 par ligne)
                </label>
                <textarea
                  value={secondaryMuscles}
                  onChange={(e) => setSecondaryMuscles(e.target.value)}
                  className="w-full min-h-20 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#4A5568]">
                  Instructions (1 par ligne)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full min-h-28 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-[#4A5568]">
                  Images (URLs, 1 par ligne)
                </label>
                <textarea
                  value={imageUrls}
                  onChange={(e) => setImageUrls(e.target.value)}
                  placeholder="https://…"
                  className="w-full min-h-20 rounded-md border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
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
                onClick={() => {
                  setIsEditing(true);
                  requestAnimationFrame(scrollExerciseModalToTop);
                }}
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
        title="Supprimer l’exercice"
        description={`Confirmer la suppression de “${exercise.name}” ?`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        confirmVariant="destructive"
        loading={loading}
        onConfirm={handleDelete}
      />
    </>
  );
}

