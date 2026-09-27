import { createRef } from 'react';
import { Checkbox } from '../src/components/checkbox.js';
import { Textarea } from '../src/components/textarea.js';
import { Disclosure, DisclosurePanel, DisclosureTrigger } from '../src/components/disclosure.js';
import { Menu, MenuContent, MenuItem, MenuLink, MenuTrigger } from '../src/components/menu.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../src/components/tooltip.js';

const ref = createRef<HTMLTextAreaElement>();
export const controls = (
  <>
    <Checkbox
      aria-label="Select all"
      indeterminate
      onCheckedChange={(checked) => checked.valueOf()}
    />
    <Textarea
      ref={ref}
      height="fill"
      name="description"
      onChange={(event) => event.currentTarget.select()}
    />
    <Menu>
      <MenuTrigger size="icon" aria-label="Actions">
        …
      </MenuTrigger>
      <MenuContent align="end" side="right">
        <MenuItem tone="danger">Delete</MenuItem>
      </MenuContent>
    </Menu>
    <Tooltip>
      <TooltipTrigger aria-label="Refresh">Refresh</TooltipTrigger>
      <TooltipContent>Refresh</TooltipContent>
    </Tooltip>
    <Disclosure>
      <DisclosureTrigger>More</DisclosureTrigger>
      <DisclosurePanel keepMounted>Details</DisclosurePanel>
    </Disclosure>
  </>
);

// @ts-expect-error Checkbox owns its indicator.
<Checkbox children="Replacement" />;
// @ts-expect-error Size is a variation, not arbitrary row counts.
<Textarea rows={18} />;
// @ts-expect-error Width belongs to the containing library layout.
<Textarea {...{ cols: 80 }} />;
// @ts-expect-error Height is a closed visual variation.
<Textarea height="500px" />;
// @ts-expect-error Menu triggers own their underlying element.
<MenuTrigger render={<a href="/">Actions</a>} />;
// @ts-expect-error Menus choose semantic placement, never raw CSS offsets.
<MenuContent sideOffset={13} />;
// @ts-expect-error Menu item tones are finite.
<MenuItem tone="orange">Delete</MenuItem>;
// @ts-expect-error Navigation items require a native link destination.
<MenuLink>Details</MenuLink>;
// @ts-expect-error Tooltips provide visual hints, never replace an accessible trigger label.
<TooltipTrigger>Refresh</TooltipTrigger>;
// @ts-expect-error Tooltip content cannot alter its positioning with arbitrary styles.
<TooltipContent style={{ left: 10 }}>Refresh</TooltipContent>;
// @ts-expect-error Content remains library-owned, including structural spreads.
<DisclosurePanel
  {...{ dangerouslySetInnerHTML: { __html: '<style>body{display:none}</style>' } }}
/>;
