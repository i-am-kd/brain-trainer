
# Optimized Lean Monorepo Architecture (NPM Workspaces Edition)

### 1. High-Level Strategy: "The Pragmatic Layered Approach"

Instead of strict Hexagonal layers or complex build tools, we use a **Feature-Module Structure** within a native **NPM Workspace** Monorepo.

- **Shared:** Strictly for Types, Constants, and Utility Functions.
- **Server:** Express + Mongoose. Logic is organized by Feature (Auth, Game). Database access is direct via Mongoose Models.
- **Client:** React + Vite. Logic is organized by Feature. State management is split between TanStack Query (Server) and Zustand (Client).
- **Tooling:** Native NPM Workspaces for dependency management. No external daemons or complex caching layers.

### 2. Optimized Directory Structure (NPM Workspaces)

```text
brain-trainer/
├── .github/workflows/ci.yml
├── package.json          # Root workspace (defines workspaces array)
├── tsconfig.json         # Root solution-style TS config
├── packages/
│   ├── types/            # @brain-trainer/types (Shared Types)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── game.ts   # GameResult, WordSequence interfaces
│   │   │   └── user.ts   # User, AuthResponse interfaces
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils/            # @brain-trainer/utils (Shared Logic)
│       ├── src/
│       │   ├── index.ts
│       │   └── scoring.ts # Pure function: calculateScore()
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   ├── api/              # Node.js + Express Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   └── auth.routes.ts
│   │   │   │   └── game/
│   │   │   │       ├── game.controller.ts
│   │   │   │       ├── game.service.ts
│   │   │   │       └── game.routes.ts
│   │   │   ├── db/
│   │   │   │   ├── connect.ts
│   │   │   │   └── models/ # Mongoose Schemas
│   │   │   ├── middleware/
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts # Used for resolution & building
│   └── web/              # React + Vite Frontend
│       ├── src/
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   ├── components/LoginForm.tsx
│       │   │   │   └── hooks/useAuth.ts
│       │   │   └── game/
│       │   │       ├── components/GameScreen.tsx
│       │   │       ├── hooks/useGameSession.ts
│       │   │       └── api/gameApi.ts
│       │   ├── lib/
│       │   │   ├── axios.ts
│       │   │   └── queryClient.ts
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
└── docker-compose.yml
```

### 3. Key Architectural Decisions & Optimizations

#### A. Testing with Vitest (Unified Experience)

Vitest is faster than Jest and shares the same configuration API as Vite.

- **Configuration:** Each app (`api` and `web`) maintains its own `vitest.config.ts`. Since there is no complex monorepo tool, configs are simple and independent.
- **Global Setup:** Use Vitest's `globalSetup` in `apps/api` to spin up `mongodb-memory-server` for integration tests.
- **Component Testing:** Use `@testing-library/react` with Vitest in `apps/web`.

#### B. Simplified Backend Logic (Service-Controller Pattern)

We skip the Repository Interface. Mongoose Models act as the data access layer.

- **Controller:** Handles HTTP request/response, validation (Zod), and error catching.
- **Service:** Contains business logic. It calls Mongoose Models directly.
- **Why?** For a small project, creating an interface `IGameRepository` and a class `MongoGameRepository` adds boilerplate with little benefit. Direct Mongoose usage is standard and maintainable for this scale.

#### C. Frontend State Management Split

- **TanStack Query (React Query):** Handles all async data fetching (e.g., `useQuery({ queryKey: ['words'], queryFn: fetchWords })`). It manages caching, loading, and error states automatically.
- **Zustand:** Handles transient UI state (e.g., `isModalOpen`, `currentTheme`). It is lighter than Redux and easier to set up than Context for complex state.

#### D. Shared Types & Utilities

- **Types Package:** Defines `interface GameResult`. Both Frontend and Backend import this. If you change the score structure, TypeScript will error in both apps until fixed.
- **Utils Package:** Contains `calculateScore()`. This pure function is imported by the Backend Service (to verify scores) and the Frontend (to show preview scores). This ensures **logic consistency**.
- **Linking:** NPM Workspaces automatically symlinks these packages into `apps/*/node_modules` upon running `npm install` at the root.

### 4. NPM Workspace Configuration

Instead of `turbo.json`, we rely on native NPM features.

**Root `package.json`:**
```json
{
  "name": "brain-trainer-monorepo",
  "private": true,
  "version": "1.0.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present"
  }
}
```

**Key Benefits:**
1.  **Zero Config:** No daemon to manage.
2.  **Hoisting:** Dependencies are hoisted to the root `node_modules` where possible, reducing disk space and install time.
3.  **Symlinking:** Local packages (`@brain-trainer/types`) are linked automatically.

### 5. Implementation Roadmap (Optimized for Speed)

1.  **Scaffold Monorepo:**
    -   Create root folder and `package.json` with `workspaces` field.
    -   Run `npm install` once at the root.
    -   Manually create folder structure for `apps/api`, `apps/web`, `packages/types`, `packages/utils`.

2.  **Configure Shared Packages:**
    -   Set up `packages/types` and `packages/utils` with simple `package.json` pointing to `src/index.ts`.
    -   No build step required for development; Vite/TS will resolve `.ts` files directly.

3.  **Configure Apps:**
    -   **API:** Initialize Express. Add `vite-node` as a dev dependency to run TS files directly during development (`vite-node src/server.ts`).
    -   **Web:** Initialize Vite + React.
    -   Add dependencies: `npm install @brain-trainer/types @brain-trainer/utils -w apps/api` (using `-w` flag to install into specific workspace).

4.  **Develop Core Domain (Shared):**
    -   Define `GameResult` in `packages/types`.
    -   Implement `calculateScore` in `packages/utils`.
    -   Write Vitest unit tests for `calculateScore`.

5.  **Backend MVP (API):**
    -   Set up MongoDB connection.
    -   Create Mongoose Models.
    -   Implement `game.service.ts` importing from `@brain-trainer/utils`.
    -   Write Vitest integration tests.

6.  **Frontend MVP (Web):**
    -   Set up TanStack Query and Axios.
    -   Implement `useGameSession` hook.
    -   Build `GameScreen` component.
    -   Write Vitest component tests.

7.  **CI/CD:**
    -   GitHub Actions runs `npm ci`, `npm run build`, and `npm test` at the root level. NPM executes these scripts across all workspaces.

### 6. Why This Is Better for Your Project

| Feature         | Previous Architecture (Turborepo)      | Optimized Architecture (NPM Workspaces)   |
| :-------------- | :------------------------------------- | :---------------------------------------- |
| **Complexity**  | High (Daemon, Cache Config, Pipeline)  | Low (Native NPM, Standard Scripts)        |
| **Setup Time**  | Hours (Debugging cache/links)          | Minutes (Standard `npm init`)             |
| **Testing**     | Vitest (Configured per app)            | Vitest (Configured per app)               |
| **Boilerplate** | High (`turbo.json`, root config)       | Low (Just `package.json` workspaces field)|
| **Scalability** | Enterprise-ready                       | MVP-ready, easily refactored later        |
| **Debugging**   | Hard (Hidden daemon processes)         | Easy (Standard Node/NPM behavior)         |

