# Workspace Architecture & Coding Standards

This document defines the architectural standards, directory structure, and coding guidelines for the **HalaqahId** codebase. All AI agents working on this project must strictly adhere to these patterns to ensure consistency, modularity, and clean separation of concerns.

---

## 1. Feature-Based Modular Architecture

All major application features are co-located in `src/features/<feature-name>`. Each feature must be structured in a modular fashion to isolate internal logic and components from other features.

### Recommended Folder Layout
```text
src/features/<feature-name>/
├── api/                   # All network / API concerns
│   ├── services/          # Pure HTTP client request wrappers
│   ├── queries/           # React Query queries (split into modular hooks)
│   ├── mutations/         # React Query mutations (split into modular hooks)
│   └── index.ts           # Barrel export for public queries & mutations
├── components/            # Cross-module feature components (keep this slim)
├── hooks/                 # Root-level entry hooks or cross-module logic hooks
├── pages/                 # Page components (entry points for routing)
├── types/                 # Feature-specific TypeScript models/interfaces
├── modules/               # Independent sub-modules (e.g., form, laporan)
│   ├── <module-name>/     # e.g., form/ or laporan/
│   │   ├── components/    # Atomic / sub-components of the module
│   │   ├── hooks/         # Custom state & logic hooks for the module
│   │   ├── validation/    # Schemas (e.g., Zod schemas)
│   │   ├── constants/     # Module-specific constants
│   │   ├── utils/         # Pure helper/utility functions
│   │   └── index.ts       # Module barrel export
│   └── index.ts           # Re-exports all sub-modules
└── index.ts               # Public entry point of the feature (barrel exports)
```

---

## 2. Coding Principles & Guidelines

### A. Separation of Concerns (UI vs. Logic)
* **Components as Presenters**: UI components (especially complex forms or dashboards) must remain presentational. Keep component bodies short and readable.
* **Logic in Custom Hooks**: All component states, side-effects, validation logic, API callbacks, and event handler setups must be extracted into dedicated custom hooks (`hooks/` or `modules/<module-name>/hooks/`).
* **Schema Separation**: Zod schemas, defaults, and type inferences must live under a dedicated `validation/` folder and be imported by hooks or components.

### B. Co-Location
* Keep files as close as possible to where they are used. If a utility or constant is only used by a single module, put it in `modules/<module-name>/utils/` or `modules/<module-name>/constants/`, not in a global directory.
* Only move items to global directories (e.g. `src/utils/`, `src/components/ui/`) if they are genuinely shared across multiple features.

### C. Barrel Exports (`index.ts`)
* Use `index.ts` files to act as a public API boundary for features and sub-modules.
* Internal hooks or sub-components that are only used within a module should **not** be exported in the public entry points.
* External features importing from a feature must only import from the root features folder, e.g., `import { EditSetoranModal } from "@/features/setoran"` rather than deep imports.

---

## 3. Strict Domain Separation
* Avoid mixing logic, APIs, or components of different domains. If a new business domain is introduced, create a new feature directory under `src/features/`.

---

## 4. Strict TypeScript Type Safety & Banning `any`
* **No `any` Type**: Do not use the `any` type under any circumstances. If a type is truly unknown, use `unknown` (combined with proper type guards or runtime validation) or generic parameters instead of `any`.
* **Explicit Type Definitions**: Always define precise interfaces or type aliases for component props, hooks, API services, request payloads, response payloads, store states, and function arguments/returns.
* **Avoid Unsafe Type Assertions**: Avoid using `as any` or casting to bypass TypeScript checks. If casting is absolutely necessary, cast to `unknown` first, then to the target type, or use safe type narrowing.
* **No Implicit `any`**: Ensure function signatures and parameters are fully typed. Do not rely on implicit `any`.

### Type Modularization Standards (Layered Type Architecture)
* **Global/Shared Domain Types**: Core database models / business entities shared across multiple features must be placed in `src/types/domain/`.
* **Global API Types**: General API response/request wrappers and pagination models must be placed in `src/types/api/`.
* **Feature-Specific Types**: Types specific to a business feature must be placed in `src/features/<feature-name>/types/`.
* **Local Component Types**: Props and types used by a single component must be co-located in the component's file. If shared within a local sub-module, place in `types.ts` in that sub-module.
* **Validation & Schema Inference (Zod)**: Form validation schemas must be defined in validation folders, and types should be inferred using `z.infer<typeof schema>` to avoid duplicate definitions.

---

## 5. TanStack Query (React Query) Best Practices
* **Query Key Factory**: Always use a query key factory (or centralized constant object) for defining `queryKey`s. Do not write manual raw string arrays ad-hoc to prevent typos and ensure reliable cache invalidation.
* **Separation of API Logic**: UI components must not make direct HTTP/fetch/axios requests. All HTTP client logic must live in `api/services/` and be wrapped by custom queries/mutations in `api/queries/` or `api/mutations/`.
* **State Synchronization**: Do not duplicate query data in local React state (`useState`) unless editing form data. Use the React Query cache as the single source of truth for server state.

---

## 6. Zustand State Management Standards
* **Strict Selector Usage**: When consuming state from a Zustand store, always use specific selectors to minimize unnecessary re-renders. Do not destructure the entire store object.
  * *Correct*: `const user = useAuthStore(state => state.user)`
  * *Incorrect*: `const { user, logout } = useAuthStore()`
* **Store Scope**: Keep Zustand strictly for global **Client State** (e.g., authentication, sidebar toggle, theme preference). Use React Query for managing **Server State**.

---

## 7. Performance & Code Splitting
* **Dynamic Imports (Lazy Loading)**: Large feature modules, modals, and route pages must be loaded dynamically using `React.lazy()` and wrapped in a `<Suspense>` boundary to optimize chunk sizes and speed up initial page loads.
* **Avoid Derived State in Effects**: Do not use `useEffect` to synchronize or calculate state that can be derived directly from existing props or state. Use `useMemo` for heavy computation, or calculate it inline.

---

## 8. Error Handling & API Resilience
* **Zod Schema Validation**: Validate all client-side inputs with Zod schemas prior to making network requests.
* **Graceful API Error Handling**: Handle API mutations and queries gracefully inside the hooks (`onError` callback) or in components, presenting actionable error states and toasts to the user rather than letting errors fail silently or crash the client.

