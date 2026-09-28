# @nanostackorg/design-system

shadcn/ui components, blocks and design tokens for Nanostack products. React 19, Tailwind CSS v4, Base UI primitives, Phosphor icons.

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
   import { ThemeProvider, TooltipProvider } from '@nanostackorg/design-system';

   createRoot(root).render(
     <ThemeProvider defaultTheme="system">
       <TooltipProvider>
         <App />
       </TooltipProvider>
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
    <Badge variant="success">Healthy</Badge>
    <Button variant="outline" size="sm">
      Retry
    </Button>
  </CardContent>
</Card>;
```

- Every shadcn component has a wrapper with the same name and API: `@nanostackorg/design-system/components/<name>` or the root import.
- Blocks: `app-shell`, `page-header`, `empty-state`, `data-table`, `stat-card`, `confirm-dialog`, `theme`, under `@nanostackorg/design-system/blocks/<name>`.
- `cn` merges Tailwind classes: `@nanostackorg/design-system/utils`.
- Style with tokens only (`bg-primary`, `text-muted-foreground`, `text-success-on-tint`). Use `className` for layout. A missing variant goes back to this repository.
- Dark mode is the `dark` class on `<html>`. `ThemeProvider` and `ThemeToggle` manage it.

## Develop

```bash
pnpm install
pnpm storybook
```

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (Storybook play and a11y tests in Chromium, light and dark), `pnpm build`, `pnpm test:package`.
- Add or update a shadcn component: `pnpm dlx shadcn@latest add <name>` then write its wrapper. See `.claude/skills/wrap-shadcn-component/SKILL.md`.
- Rules for contributors and consumer apps: [AGENTS.md](AGENTS.md).

## License

MIT. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for shadcn/ui and Base UI.
