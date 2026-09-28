import {
  CaretRightIcon,
  type Icon,
  LayoutIcon,
  PaletteIcon,
  SquaresFourIcon,
  StackIcon,
} from '@phosphor-icons/react';
import { DocsContext } from '@storybook/addon-docs/blocks';
import { type MouseEvent, useContext } from 'react';
import { NAVIGATE_URL } from 'storybook/internal/core-events';

import { Badge } from '@/components/badge';
import {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemLink,
  ItemMedia,
  ItemTitle,
} from '@/components/item';
import { Box } from '@/layout/box';

type Section = { title: string; description: string; path: string; icon: Icon };

const sections: Section[] = [
  {
    title: 'Foundations',
    description: 'Colors, fonts and radii, with contrast ratios.',
    path: '/docs/foundations-tokens--docs',
    icon: PaletteIcon,
  },
  {
    title: 'Components',
    description: 'A typed wrapper for each shadcn/ui part.',
    path: '/docs/components-button--docs',
    icon: SquaresFourIcon,
  },
  {
    title: 'Blocks',
    description: 'Shell, header, table, stat card and more.',
    path: '/docs/blocks-app-shell--docs',
    icon: StackIcon,
  },
  {
    title: 'Showcase',
    description: 'A full dashboard built from the library.',
    path: '/story/showcase-dashboard--dashboard',
    icon: LayoutIcon,
  },
];

export function SectionLinks() {
  const context = useContext(DocsContext);

  function openSection(event: MouseEvent<HTMLAnchorElement>, path: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    context.channel.emit(NAVIGATE_URL, `?path=${path}`);
  }

  return (
    <nav aria-label="Sections">
      <Box className="grid gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <ItemLink
            key={section.title}
            variant="outline"
            href={`./?path=${section.path}`}
            target="_top"
            onClick={(event) => openSection(event, section.path)}
          >
            <ItemMedia icon={section.icon} />
            <ItemContent>
              <ItemTitle>{section.title}</ItemTitle>
              <ItemDescription>{section.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <CaretRightIcon aria-hidden />
            </ItemActions>
          </ItemLink>
        ))}
      </Box>
    </nav>
  );
}

export function WelcomeHero() {
  return (
    <div className="mb-10 flex flex-col gap-4 font-sans text-foreground">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="info">0.1.0</Badge>
        <Badge variant="outline">React 19</Badge>
        <Badge variant="outline">Tailwind CSS v4</Badge>
        <Badge variant="outline">Base UI</Badge>
      </div>
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Nanostack design system
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        <code className="font-mono text-base text-foreground">@nanostackorg/design-system</code> is
        shadcn/ui, wrapped. It gives every Nanostack product the same components, blocks and design
        tokens, in light and dark.
      </p>
    </div>
  );
}
