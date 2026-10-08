# @nanostackorg/design-system

Owned shadcn/ui components, layout blocks and design tokens for Nanostack products. React 19, Tailwind CSS v4, Base UI primitives and Phosphor icons, with a closed, typed public API.

Storybook: https://nanostack-dev.github.io/nanostack-design-system/

## Install

1. Add the package, its peers and the fonts:

   ```bash
   pnpm add @nanostackorg/design-system tailwindcss @tailwindcss/vite @fontsource-variable/plus-jakarta-sans @fontsource-variable/outfit @fontsource-variable/geist-mono
   ```

2. Add the Tailwind plugin to `vite.config.ts`:

   ```ts
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({ plugins: [react(), tailwindcss()] });
   ```

3. In the main CSS file, import Tailwind, then the library tokens, then register the package output so Tailwind generates the classes its components use. The `@source` path is relative to this CSS file:

   ```css
   @import 'tailwindcss';
   @import '@nanostackorg/design-system/styles.css';
   @source "../node_modules/@nanostackorg/design-system/dist";
   ```

4. Load the fonts once in the entry point:

   ```ts
   import '@fontsource-variable/plus-jakarta-sans';
   import '@fontsource-variable/outfit';
   import '@fontsource-variable/geist-mono';
   ```

5. Wrap the app:

   ```tsx
   import { DesignSystemProvider, ThemeProvider } from '@nanostackorg/design-system';

   createRoot(root).render(
     <ThemeProvider defaultTheme="system">
       <DesignSystemProvider>
         <App />
       </DesignSystemProvider>
     </ThemeProvider>,
   );
   ```

## Use

```tsx
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@nanostackorg/design-system';
import { DataTable } from '@nanostackorg/design-system/blocks/data-table';

<Card>
  <CardHeader>
    <CardTitle>Deployments</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge tone="success">Healthy</Badge>
    <Button variant="outline" size="sm">
      Retry
    </Button>
  </CardContent>
</Card>;
```

- Components are owned and expose typed content, behavior and supported variants through `@nanostackorg/design-system/components/<name>` or the root import. Their public props reject `className` and `style`.
- Blocks: `app-shell`, `page-header`, `empty-state`, `data-table`, `stat-card`, `confirm-dialog`, `theme`, under `@nanostackorg/design-system/blocks/<name>`.
- `cn` merges Tailwind classes: `@nanostackorg/design-system/utils`.
- Compose layout with `Box`, `Stack`, `Inline`, `Columns` and `Spread`. Box is the open primitive for building a product component with tokens; pages and routes use the closed public components and request missing variants here.
- Supply `DesignSystemProvider linkComponent={RouterLink}` for product router links. Without an adapter, links render ordinary anchors.
- Dark mode is the `dark` class on `<html>`. `ThemeProvider` and `ThemeToggle` manage it.

## Develop

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm storybook
```

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (Storybook play and a11y tests in Chromium, light and dark), `pnpm build`, `pnpm test:package`.
- Add or update a shadcn component through `pnpm shadcn:update`; follow the committed [owned component procedure](.claude/skills/own-shadcn-component/SKILL.md) and preserve the upstream merge base.
- Rules for contributors and consumer apps: [AGENTS.md](AGENTS.md).
- Standalone setup, architecture, tests, release and rollback: [documentation index](docs/README.md). Canonical terms: [CONTEXT.md](CONTEXT.md).

## License

MIT. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for shadcn/ui and Base UI.
