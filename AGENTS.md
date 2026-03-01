# Guide pour les agents IA — Back-office

Ce document décrit le contexte du projet et les **obligations** que tout agent IA doit respecter lors des modifications de code.

---

## 1. Contexte du projet

### 1.1 Stack technique

- **Framework** : Next.js 16
- **UI** : React 19, composants (ex. Radix UI), Tailwind CSS
- **Outils** : ESLint (eslint-config-next), Prettier, TypeScript

### 1.2 Rôle de l’application

Le back-office est l’interface d’administration qui consomme l’**API du backend** (NestJS). Il permet notamment :

- **Dashboard** : pilotage, indicateurs, logs d’API, logs d’erreurs du pipeline ETL
- **Logs ETL** : affichage des logs du pipeline ETL (composant `LogEtlPipeline`, cartes `LogEtlCard`)
- **Authentification** : contexte d’auth (`AuthContext`), appels API via une instance axios partagée

### 1.3 Structure principale

- `src/pages/` : pages Next.js (ex. `api-logs`)
- `src/components/` : composants réutilisables et UI (dont `dashboard/`, `layout/`)
- `src/contexts/` : contextes React (ex. `AuthContext`)
- `src/utils/` : utilitaires (ex. `axios` pour les appels API vers le backend)

### 1.4 Commandes utiles

| Commande | Rôle |
|----------|------|
| `npm run build` | Build Next.js |
| `npm run lint` | Vérification ESLint |
| `npm run format` | Application Prettier (write) |
| `npm run format:check` | Vérification Prettier (check only) |

---

## 2. Obligations à chaque requête

**L’agent doit systématiquement :**

1. **Vérifier le lint**  
   Après toute modification de code, exécuter `npm run lint`. Corriger toute erreur (et les warnings si pertinent).

2. **Vérifier le format**  
   S’assurer que le code respecte Prettier : `npm run format:check` ou `npm run format` (pour appliquer). Aucun changement de format non intentionnel.

3. **Vérifier le build**  
   Après modifications, lancer `npm run build` et corriger les erreurs TypeScript ou Next.js.

4. **Cohérence avec le backend**  
   Si des appels API ou des types partagés sont modifiés, vérifier que les endpoints et contrats correspondent au backend (voir le projet **backend** et son `AGENTS.md` pour l’API et l’ETL).

---

## 3. Ordres principaux par type de requête

### 3.1 Nouvelle fonctionnalité ou modification de code

1. Implémenter en respectant l’architecture existante (pages, composants, contextes, utils).
2. Exécuter : `npm run lint` → `npm run format:check` (ou `npm run format`) → `npm run build`.
3. Corriger jusqu’à ce que lint, format et build soient OK.

### 3.2 Correction de bug

1. Identifier et corriger la cause.
2. Vérifier lint, format et build comme en 3.1.

### 3.3 Refactoring ou mise à jour de l’UI

1. Effectuer le refactoring sans casser le comportement attendu (ou en l’adaptant explicitement).
2. Relancer lint, format et build.

### 3.4 Intégration / modification d’appels API

1. Adapter les appels (ex. `src/utils/axios.ts`, services ou hooks) en cohérence avec l’API du backend.
2. Vérifier lint, format et build ; tester manuellement ou via les écrans concernés si possible.

---

## 4. Conventions de code

- **TypeScript** : typage explicite pour les props, états et réponses API ; éviter `any` sauf si nécessaire (avec justification).
- **React** : composants fonctionnels ; privilégier des composants et hooks réutilisables.
- **Styles** : Tailwind CSS ; respecter la config et les conventions du projet (ex. `tw-animate-css`).
- **Français** : libellés et textes utilisateur en français lorsque c’est le standard du projet.

---

## 5. Résumé checklist (à appliquer en fin de réponse)

- [ ] `npm run lint` sans erreur (warnings explicites si conservés)
- [ ] `npm run format:check` OK ou `npm run format` exécuté
- [ ] `npm run build` OK
- [ ] Si modification d’appels API : cohérence avec le backend (voir **backend/AGENTS.md**)
