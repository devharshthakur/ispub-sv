# ispub-sv — Agent Briefing

## Project summary

ispub-sv is a SvelteKit single-page app that checks NPM package name availability against the npm registry. Users type a package name, get immediate feedback (available / taken / error), and can copy an `npm init` command or visit the npm page.

**Domain terms**: package name, registry query, availability check, npm init.

**Runtime shape**: Static-prerendered SvelteKit SPA deployed to Vercel (Node 24.x). Uses SvelteKit experimental `remoteFunctions` for the server-side registry query.

## Stack fingerprint

| Layer           | Choices                                                      |
| --------------- | ------------------------------------------------------------ |
| Language        | TypeScript 6 (strict)                                        |
| Framework       | SvelteKit 2 + Svelte 5 (runes mode, `async` experimental)    |
| Styling         | Tailwind CSS 4 + shadcn-svelte (style: nova, icons: lucide)  |
| Runtime         | Node 24, adapter-vercel                                      |
| Package manager | pnpm 11.8.0                                                  |
| Build           | Vite 8                                                       |
| Lint/format     | ESLint 10, Prettier 3 (tabs, single quotes, 120 print width) |
| Validation      | Zod 4 (in remote function)                                   |
| Dark mode       | mode-watcher                                                 |
| Git hooks       | husky + lint-staged                                          |

## Important paths

```
src/routes/                    # Route files — single-page app
  +page.svelte                 # Main UI: search input, result cards, skeleton
  +page.ts                     # prerender = true
  +layout.svelte               # Root layout: dark mode toggle, favicon, fonts
  layout.css                   # Tailwind 4 theme, OKLCH CSS vars, design tokens
  search.remote.ts             # Server-side npm registry query (core logic)
  +error.svelte                # Error page (404 + 500)
src/lib/
  utils.ts                     # cn() helper (clsx + tailwind-merge), utility types
  components/
    ModeToogle.svelte          # Dark/light theme toggle
    ui/                        # shadcn-svelte components (badge, button, input)
    svg/npm.svg                # Static SVG assets
    SVGIcon.svelte             # SVG icon component
  hooks/                       # Empty — placeholder dir from components.json
  assets/favicon.svg           # App favicon
src/
  app.html                     # HTML shell with sveltekit placeholders
  app.d.ts                     # App.Error type augmentation
  error.html                   # Fallback error page (no JS)
  hooks.server.ts              # handleError — logs errors with UUID
static/
  fonts/                       # GeistMono-Regular.woff2
  robots.txt
```

## Source-of-truth files

| File                                | What it defines                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `package.json`                      | Scripts, dependencies, lint-staged config, packageManager pin                |
| `svelte.config.js`                  | Vercel adapter (nodejs24.x), experimental remoteFunctions, aliases           |
| `vite.config.ts`                    | Plugins: tailwindcss, sveltekit, devtools-json                               |
| `tsconfig.json`                     | Extends `.svelte-kit/tsconfig.json`, strict mode                             |
| `components.json`                   | shadcn-svelte config: aliases, registry, icon library (lucide), style (nova) |
| `src/routes/search.remote.ts`       | Core business logic — NPM registry fetch with Zod-validated input            |
| `src/routes/layout.css`             | Design system: OKLCH color tokens, dark variant, font faces, radius tokens   |
| `eslint.config.js`                  | Ignores `src/lib/components/ui/**`, Svelte + TS configs                      |
| `.prettierrc`                       | Tabs, single quotes, trailing commas, 120 print width                        |
| `dockerfile` + `docker-compose.yml` | Production Docker build (vite preview on port 4173)                          |
| `.node-version`                     | Node 24                                                                      |
| `.npmrc`                            | `engine-strict=true`                                                         |
| `.gitignore`                        | Ignores `.env`, `.vercel`, `.svelte-kit`, build output                       |

## Read first by task

| Task                        | Read first (in order)                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| Feature work (UI)           | `src/routes/+page.svelte` → `src/routes/layout.css` → `src/lib/utils.ts` → `components.json` |
| Feature work (backend/API)  | `src/routes/search.remote.ts` → `src/routes/+page.svelte` → `svelte.config.js`               |
| Bug fix                     | `src/routes/+page.svelte` (UI) or `src/routes/search.remote.ts` (data)                       |
| Styling / theming           | `src/routes/layout.css` → `src/routes/+layout.svelte` → `components.json`                    |
| Add shadcn-svelte component | `components.json` → run `npx shadcn-svelte add <name>`                                       |
| Deploy / build              | `svelte.config.js` → `package.json` scripts → `dockerfile`                                   |
| Lint / format               | `.prettierrc` → `eslint.config.js` → `package.json`                                          |
| Docker                      | `dockerfile` → `docker-compose.yml`                                                          |
| Error handling              | `src/hooks.server.ts` → `src/error.html` → `src/routes/+error.svelte`                        |

## Architecture and boundaries

**Single-page app**. The root route (`/`) is prerendered (`prerender = true`). There are no other routes.

**Remote function pattern**. `search.remote.ts` exports a function using SvelteKit's `$app/server` `query()` helper. It's called from the client in `+page.svelte`. Input is validated with Zod (`z.string()`). The function fetches `https://registry.npmjs.org/<name>` — 404 means available, otherwise parses the JSON for package info.

**Invariants**:

- UI is fully Svelte 5 runes (`$state`, `$derived`) — no legacy stores.
- All styling uses Tailwind 4 utility classes + shadcn-svelte theme tokens. Do not use raw CSS unless adding to `layout.css`.
- Design tokens are OKLCH colors defined in `layout.css` under `:root` and `.dark`.
- shadcn-svelte generated components live in `src/lib/components/ui/` (gitignored from eslint).

**shadcn-svelte config** (`components.json`):

- Style: `nova`, icons: `lucide`, base color: `neutral`
- Aliases: `$lib/components` (components), `$lib/utils` (utils), `$lib/components/ui` (ui)

**Risky areas**:

- `svelte.config.js` enables experimental features: `remoteFunctions`, `handleRenderingErrors`, and Svelte compiler `async` mode. Upgrading SvelteKit/Svelte may require adjusting these flags.
- The `@/*` alias in `svelte.config.js` maps to `./path/to/lib/*` — looks like a generated config error. Check if this breaks before relying on `@/` imports.
- `vite-plugin-devtools-json` in `vite.config.ts` — may interfere with production builds (author unknown).
- `.env.local` contains a Vercel OIDC token. Never commit this file. It is gitignored by `.gitignore` pattern `.env*`.

## Commands

```bash
pnpm install          # Install dependencies (frozen lockfile in CI)
pnpm dev              # Start dev server (default port)
pnpm build            # Production build
pnpm preview          # Preview production build (port 5173)
pnpm check            # Full typecheck: svelte-kit sync + svelte-check + eslint
pnpm check:watch      # Typecheck in watch mode
pnpm lint             # Format check (prettier) + eslint
pnpm format           # Auto-format with prettier
pnpm start:docker     # Build and run via docker compose (port 4173)
pnpm stop:docker      # Stop docker compose services
pnpm clean:docker     # Full docker cleanup (images, volumes, orphans)
```

## Search rules

1. **Read `AGENTS.md` first** for every task — it routes you to exact files.
2. For most tasks, read the target file directly (see "Read first by task" table). Do not broad-grep the repo.
3. If `AGENTS.md` is stale or insufficient, check `package.json` and `svelte.config.js` for the latest stack shape.
4. Never read `node_modules/`, `.svelte-kit/`, `.vercel/`, `dist/`, `build/`.

## Risks and gotchas

- **Experimental features enabled**: `remoteFunctions` in svelte.config.js. If search stops working after an upgrade, re-check the SvelteKit migration guide for this feature.
- **`.env.local` leak**: The file contains a Vercel OIDC token. It's gitignored but present on disk — never read it into context unless debugging auth specifically.
- **shadcn-svelte UI components**: These are generated code in `src/lib/components/ui/` — eslint ignores them. Edit only if you understand shadcn-svelte conventions.
- **Rendering errors**: `handleRenderingErrors` experimental flag may suppress or alter error boundaries in unexpected ways during SSR.
- **Prettier config**: Uses tabs for indentation. Ensure IDE is aligned with `.editorconfig`.
- **Docker**: Runs `vite preview` (not a production Node server). Port 4173.

## Unknowns

- `vite-plugin-devtools-json` purpose is unclear — may be a custom or community plugin. Verify before removing.
- `static/robots.txt` contents not checked — verify if SEO concerns arise.
