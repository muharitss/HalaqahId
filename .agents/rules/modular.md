---
trigger: always_on
---

````md
---
description: Strict modular architecture. Every file must have one clear responsibility.
trigger: glob
globs: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"]
---

# Strict Modularity Rules

## 1. One File = One Responsibility

Every file MUST have one clear primary responsibility.

Never combine unrelated responsibilities in the same file.

Examples of responsibilities that MUST be separated:

- UI rendering
- business logic
- API communication
- state management
- validation
- data transformation
- browser APIs
- file processing
- complex calculations

If a file starts handling multiple responsibilities, split it.

## 2. React Components

Components MUST primarily handle:

- rendering
- props
- UI events
- composition of child components

Components MUST NOT contain large amounts of:

- business logic
- API calls
- complex calculations
- image/file processing
- validation
- data transformation
- complex asynchronous workflows

Extract these into hooks, services, utilities, or validation modules.

Prefer:

```text
Feature
├── components/
│   ├── MainComponent.tsx
│   ├── Header.tsx
│   └── Form.tsx
├── hooks/
│   ├── useFeature.ts
│   └── useFeatureForm.ts
├── api/
│   ├── services/
│   ├── queries/
│   └── mutations/
├── utils/
├── validation/
└── types/
````

over one large component containing everything.

## 3. Hooks

Each custom hook MUST represent one coherent behavior.

Do not create hooks that manage unrelated responsibilities.

Prefer:

```text
useImageCrop.ts
useAvatarUpload.ts
useProfileForm.ts
```

Avoid:

```text
useEverything.ts
useFeatureManager.ts
```

when they contain unrelated logic.

## 4. Utilities

Utilities MUST contain focused, reusable logic.

Avoid generic dumping-ground files:

```text
utils.ts
helpers.ts
common.ts
misc.ts
```

Split unrelated utilities into specific files.

Prefer:

```text
image-export.ts
calculate-crop.ts
validate-image.ts
format-name.ts
```

## 5. API Separation

Components MUST NOT directly perform API requests.

API logic belongs in:

```text
api/services/
api/queries/
api/mutations/
```

Components consume API functionality through hooks or feature APIs.

## 6. Validation Separation

Validation schemas and validation logic MUST be separated from UI components.

Prefer:

```text
validation/
├── user-schema.ts
└── profile-schema.ts
```

## 7. Composition Over Monolithic Components

When a component contains multiple independent UI sections or behaviors, split it.

Example:

```text
AvatarUpload/
├── components/
│   ├── AvatarPreview.tsx
│   ├── AvatarActions.tsx
│   └── AvatarCropDialog.tsx
├── hooks/
│   ├── use-avatar-upload.ts
│   └── use-image-crop.ts
├── utils/
│   ├── image-loader.ts
│   └── image-export.ts
├── types.ts
└── index.ts
```

Do NOT put the entire feature into one `AvatarUpload.tsx`.

## 8. File Size

Line count is a warning signal, not the primary rule.

* Components SHOULD stay below 150 lines.
* Components above 200 lines MUST be reviewed and decomposed when responsibilities can be separated.
* Files above 250 lines SHOULD be reviewed for decomposition.
* Files above 300 lines MUST NOT be created or expanded without strong justification.

Responsibility separation has higher priority than line count.

## 9. Refactor Before Adding Complexity

If an existing file is already complex:

1. Identify its responsibilities.
2. Extract independent responsibilities.
3. Preserve existing behavior.
4. Then implement the new functionality.

Do NOT continue making an already complex file larger.

## 10. No Duplicate Responsibility

There MUST be one obvious place for each responsibility.

Do not duplicate:

* business rules
* validation
* API logic
* transformations
* formatting
* state synchronization

## 11. Co-location

Keep code close to the feature that owns it.

Do not move feature-specific utilities into global directories unless they are genuinely shared.

## 12. Naming

File names MUST clearly describe their responsibility.

Prefer:

```text
use-image-crop.ts
image-export.ts
validate-avatar.ts
avatar-upload-service.ts
AvatarCropDialog.tsx
```

Avoid vague names:

```text
manager.ts
handler.ts
processor.ts
logic.ts
helper.ts
common.ts
```

unless the responsibility is genuinely clear from context.

## 13. Avoid Over-Abstraction

Do not create abstractions merely to reduce duplication or file count.

Avoid unnecessary:

```text
BaseComponent
BaseHook
GenericManager
UniversalService
AbstractProcessor
```

Prefer simple, explicit, cohesive modules.

## 14. Mandatory Final Review

Before completing a task, verify:

* Every new file has one clear responsibility.
* Components are primarily presentation/composition.
* Complex behavior is extracted into hooks.
* Pure logic is extracted into utilities.
* API logic is isolated.
* Validation is isolated.
* No unrelated responsibilities are mixed.
* No existing file became unnecessarily large.
* Another developer can easily locate each responsibility.
* An AI agent can modify one responsibility without loading unrelated logic.

### Core Principle

Prefer:

```text
small + cohesive + explicit + modular
```

over:

```text
large + convenient + monolithic
```

The goal is **high cohesion, low coupling, clear boundaries, and easy maintenance**.

```
