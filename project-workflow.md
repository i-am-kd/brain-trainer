Here is the revised development roadmap, broken down into **8 distinct phases**. This structure prioritizes immediate feedback loops and minimizes configuration overhead by leveraging NPM Workspaces and Vite’s native TypeScript support.

### Phase 1: Monorepo Foundation & Workspace Setup
**Goal:** Establish a working monorepo structure with zero external tooling dependencies (no Turborepo, no Nx).

1.  **Initialize Root:** Create `package.json` with `"private": true` and `"workspaces": ["apps/*", "packages/*"]`.
2.  **Create Directory Structure:** Manually create folders for `apps/api`, `apps/web`, `packages/types`, and `packages/utils`.
3.  **Install Dependencies:** Run `npm install` at the root. Verify that `node_modules` is created at the root level (hoisting).
4.  **Verify Linking:** Create a dummy file in `packages/types` and import it in `apps/api` to ensure NPM symlinking works automatically.

### Phase 2: Shared Core (Types & Utilities)
**Goal:** Define the single source of truth for data structures and business logic.

1.  **Setup `@brain-trainer/types`:**
    -   Create `src/index.ts`, `src/game.ts`, `src/user.ts`.
    -   Define interfaces: `GameResult`, `WordSequence`, `User`, `AuthResponse`.
    -   Configure `package.json` to point `main` and `types` to `src/index.ts`.
2.  **Setup `@brain-trainer/utils`:**
    -   Create `src/scoring.ts` with pure function `calculateScore()`.
    -   Add `@brain-trainer/types` as a dependency in `packages/utils/package.json`.
3.  **Unit Testing Core:**
    -   Install Vitest in `packages/utils`.
    -   Write tests for `calculateScore()` to ensure logic correctness before building apps.

### Phase 3: Backend Skeleton & Database Connection
**Goal:** Get the Express server running with TypeScript support via Vite Node.

1.  **Initialize `apps/api`:**
    -   Create `package.json` with dependencies: `express`, `mongoose`, `zod`.
    -   Add dev dependencies: `vite`, `vite-node`, `@types/express`, `@types/node`.
2.  **Configure Vite for Node:**
    -   Create `vite.config.ts` in `apps/api` to handle path aliases (`@/`) and externalize node modules.
3.  **Database Setup:**
    -   Create `src/db/connect.ts` using Mongoose.
    -   Add `docker-compose.yml` at the root for a local MongoDB instance.
4.  **Server Entry Point:**
    -   Create `src/server.ts` to initialize Express and connect to DB.
    -   Add script `"dev": "vite-node src/server.ts"` to `package.json`.
    -   **Milestone:** Server starts successfully and connects to MongoDB.

### Phase 4: Backend Feature Implementation (Auth & Game)
**Goal:** Implement core API endpoints using the Service-Controller pattern.

1.  **Mongoose Models:**
    -   Create `src/db/models/User.ts` and `src/db/models/GameSession.ts`.
2.  **Auth Module:**
    -   Implement `auth.service.ts` (JWT generation, password hashing).
    -   Implement `auth.controller.ts` and `auth.routes.ts`.
3.  **Game Module:**
    -   Implement `game.service.ts` importing `calculateScore` from `@brain-trainer/utils`.
    -   Implement `game.controller.ts` to handle game submission and score verification.
4.  **Integration Testing:**
    -   Setup `vitest.config.ts` in `apps/api`.
    -   Use `mongodb-memory-server` in global setup.
    -   Write integration tests for `POST /api/game/submit`.

### Phase 5: Frontend Skeleton & State Management
**Goal:** Set up React, Vite, and global state providers.

1.  **Initialize `apps/web`:**
    -   Create `package.json` with dependencies: `react`, `react-dom`, `axios`, `@tanstack/react-query`, `zustand`.
    -   Add dev dependencies: `vite`, `@vitejs/plugin-react`, `@types/react`.
2.  **Vite Configuration:**
    -   Create `vite.config.ts` with React plugin and proxy configuration (`/api` -> `http://localhost:3000`).
3.  **State Setup:**
    -   Configure `TanStack Query` client in `src/lib/queryClient.ts`.
    -   Create a simple Zustand store for UI state (e.g., `useUIStore` for theme/modal).
4.  **Axios Instance:**
    -   Create `src/lib/axios.ts` with base URL and interceptors for JWT tokens.

### Phase 6: Frontend Feature Implementation
**Goal:** Build the user interface and connect it to the backend.

1.  **Auth Feature:**
    -   Create `LoginForm.tsx` and `useAuth.ts` hook.
    -   Implement login/logout functionality using TanStack Query mutations.
2.  **Game Feature:**
    -   Create `GameScreen.tsx` component.
    -   Implement `useGameSession.ts` hook to fetch words and submit answers.
    -   Import `GameResult` type from `@brain-trainer/types` to ensure type safety.
3.  **Routing:**
    -   Implement basic protected routes (redirect to login if not authenticated).

### Phase 7: Testing & Quality Assurance
**Goal:** Ensure reliability across the monorepo.

1.  **Frontend Component Tests:**
    -   Install `@testing-library/react` and `jsdom` in `apps/web`.
    -   Write tests for `LoginForm` and `GameScreen` components.
2.  **End-to-End Flow Check:**
    -   Manually test the full flow: Login -> Start Game -> Submit Answer -> View Score.
    -   Verify that changes in `packages/utils` reflect immediately in both apps without rebuilding.

### Phase 8: CI/CD & Deployment Prep
**Goal:** Automate validation and prepare for production.

1.  **GitHub Actions:**
    -   Create `.github/workflows/ci.yml`.
    -   Steps: `checkout`, `setup-node`, `npm ci`, `npm run build`, `npm test`.
2.  **Dockerization:**
    -   Create `Dockerfile` for `apps/api` and `apps/web`.
    -   Ensure multi-stage builds work with NPM Workspaces (copying entire monorepo but only building specific apps).
3.  **Environment Variables:**
    -   Standardize `.env` handling for both apps (e.g., `VITE_API_URL` for web, `MONGO_URI` for api).

---

### Key Advantages of This Phased Approach

1.  **Immediate Feedback:** By Phase 3, you have a running server. By Phase 5, you have a running client. No weeks of configuration.
2.  **Isolated Complexity:** Each phase focuses on one layer (Shared, Backend, Frontend), reducing cognitive load.
3.  **Native Tooling:** Using `vite-node` for the backend and NPM Workspaces eliminates the need to debug complex bundler configurations or daemon processes.
4.  **Type Safety First:** Defining types in Phase 2 ensures that subsequent phases benefit from immediate TypeScript errors if contracts are violated.
