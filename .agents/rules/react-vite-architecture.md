---
trigger: always_on
---

---
description: React Vite Enterprise Architecture Standards (Feature-Driven)
globs: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"]
trigger: auto
---

# React Vite Enterprise Architecture Standards

You are an AI coding agent helping to build and maintain a large-scale enterprise React + Vite application.
You must strictly adhere to the **Feature-Driven Architecture** (inspired by Feature-Sliced Design) defined below.

## 1. Core Principles
- **Domain-centric over Role-centric:** Group files by business feature (e.g., `auth`, `dashboard`), not by technical role (e.g., `components`, `hooks`).
- **Isolation:** Features must be self-contained. UI components, logic, and state specific to a feature must live strictly inside that feature's directory.
- **Maintainability:** Code must be highly modular so it is easily readable by developers and localized for AI context.

## 2. Directory Structure
```text
src/
├── app/                # App-level setups (Providers, Router, Main entry)
├── features/           # DOMAINS / BUSINESS LOGIC (Core modules)
│   ├── [feature-name]/
│   │   ├── api/        # Feature-specific API calls
│   │   ├── components/ # Feature-specific UI
│   │   ├── hooks/      # Feature-specific custom hooks
│   │   ├── store/      # Feature-specific state management
│   │   ├── types/      # Feature-specific TypeScript interfaces
│   │   ├── utils/      # Feature-specific helpers
│   │   └── index.ts    # 🚨 PUBLIC API (Mandatory)
├── pages/              # Routing layer (Composes features)
├── components/         # Shared / Dumb UI components (e.g., Buttons, Inputs)
├── lib/                # 3rd-party library configurations (e.g., Axios, Dayjs)
├── hooks/              # Global shared hooks
├── store/              # Global state (if absolutely necessary)
├── utils/              # Global utility functions
├── types/              # Global TypeScript types
├── config/             # Environment variables and constants
└── index.css           # Global stylesheets
```

## 3. Golden Rules (Strict Enforcement)

### Rule 1: The Public API (`index.ts`)
- **EVERY** folder inside `src/features/` **MUST** have an `index.ts` file at its root.
- This `index.ts` acts as the **Pintu Gerbang (Public API)** for the feature.
- **NEVER** perform deep imports from another feature.
  - ✅ **DO:** `import { LoginForm } from '@/features/auth'`
  - ❌ **DO NOT:** `import { LoginForm } from '@/features/auth/components/LoginForm'`
- Only export what is absolutely necessary for the outside world to use. Hide internal API calls, sub-components, and specific utilities.

### Rule 2: Unidirectional Dependencies
- Features are orchestrated and composed inside `src/pages/`.
- Cross-feature dependencies should be strictly minimized to prevent circular dependencies. If Feature A needs Feature B, bridge them at the `pages/` layer or via a shared global state.
- **NEVER** import anything from `src/features/` into `src/components/`. The global `components/` directory is strictly for reusable, dumb UI components (Design System) without business logic.

### Rule 3: Centralized Library Configurations
- **NEVER** configure libraries (e.g., Axios instance, Firebase initialization) directly inside components or feature files.
- All 3rd-party configurations must be initialized inside `src/lib/`.
- Features must import the configured instance from `src/lib/` (e.g., `import axios from '@/lib/axios'`).

## 4. AI Workflow Instructions
When instructed to create, debug, or modify a feature:
1. **Locate Context:** Limit your file scanning and edits to `src/features/[feature-name]/` to avoid hallucinating dependencies.
2. **Respect Boundaries:** Do not bleed feature-specific logic into global `src/components/` or `src/hooks/`.
3. **Update the Public API:** If you create a new module intended for external use, you must export it in `src/features/[feature-name]/index.ts`.
4. **Prevent Spaghetti Code:** If you notice deep imports or circular dependencies during an edit, automatically refactor them to use the Public API (`index.ts`) or warn the user.