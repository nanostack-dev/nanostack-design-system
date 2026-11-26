import { DesktopIcon, MoonIcon, PaletteIcon, SunIcon } from '@phosphor-icons/react';
import { useId } from 'react';

import { IconButton } from '@/components/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/components/field';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/popover';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Switch } from '@/components/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

import { isPalette, type Palette, palettes } from './palettes';
import { type Theme, useTheme } from './theme';

export interface ThemeSettingsLabels {
  mode: string;
  light: string;
  dark: string;
  system: string;
  palette: string;
  contrast: string;
  contrastDescription: string;
}

export interface ThemePickerLabels extends ThemeSettingsLabels {
  trigger: string;
  title: string;
}

export interface ThemeSettingsProps {
  labels?: Partial<ThemeSettingsLabels>;
}

export interface ThemePickerProps {
  labels?: Partial<ThemePickerLabels>;
}

const defaultLabels: ThemePickerLabels = {
  trigger: 'Appearance',
  title: 'Appearance',
  mode: 'Mode',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  palette: 'Theme',
  contrast: 'Increase contrast',
  contrastDescription: 'Stronger text and edges.',
};

const modes: { value: Theme; icon: typeof SunIcon; label: keyof ThemeSettingsLabels }[] = [
  { value: 'light', icon: SunIcon, label: 'light' },
  { value: 'dark', icon: MoonIcon, label: 'dark' },
  { value: 'system', icon: DesktopIcon, label: 'system' },
];

const isMode = (value: unknown): value is Theme => modes.some((mode) => mode.value === value);

/**
 * A thumbnail of a theme, drawn with that theme's own tokens: the element sets
 * `data-ns-palette`, so its subtree resolves the palette's colours in the
 * current mode and contrast.
 */
function PalettePreview({ palette }: { palette: Palette }) {
  return (
    <span
      data-ns-palette={palette}
      aria-hidden="true"
      className="flex h-10 w-14 shrink-0 gap-1 overflow-hidden rounded-xl bg-ground bg-(image:--glass-backdrop) p-1 inset-ring inset-ring-segment-edge"
    >
      <span className="w-2.5 rounded-sm bg-card/60" />
      <span className="flex flex-1 flex-col justify-between rounded-sm bg-card p-1">
        <span className="h-1 w-5 rounded-full bg-foreground/80" />
        <span className="h-1 w-3 rounded-full bg-muted-foreground/60" />
        <span className="h-1.5 w-4 rounded-full bg-primary" />
      </span>
    </span>
  );
}

/**
 * The appearance controls: light, dark or system; the colour theme; and the
 * contrast level. `ThemePicker` shows them in a popover; a settings page can
 * render them inline. Needs a `ThemeProvider` above it.
 */
export function ThemeSettings({ labels }: ThemeSettingsProps) {
  const { theme, setTheme, palette, setPalette, contrast, setContrast } = useTheme();
  const text = { ...defaultLabels, ...labels };
  const id = useId();
  const contrastId = `${id}-contrast`;
  const contrastDescriptionId = `${id}-contrast-description`;

  return (
    <FieldGroup>
      <FieldSet>
        <FieldLegend size="sm">{text.mode}</FieldLegend>
        <ToggleGroup
          variant="outline"
          size="sm"
          aria-label={text.mode}
          value={[theme]}
          onValueChange={(value) => {
            const [next] = value;
            if (isMode(next)) setTheme(next);
          }}
        >
          {modes.map(({ value, icon: Icon, label }) => (
            <ToggleGroupItem key={value} value={value}>
              <Icon aria-hidden />
              {text[label]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend size="sm">{text.palette}</FieldLegend>
        <RadioGroup
          aria-label={text.palette}
          value={palette}
          onValueChange={(value) => {
            if (isPalette(value)) setPalette(value);
          }}
        >
          {palettes.map((option) => (
            <FieldLabel key={option.id} htmlFor={`${id}-${option.id}`}>
              <Field orientation="horizontal">
                <RadioGroupItem value={option.id} id={`${id}-${option.id}`} />
                <PalettePreview palette={option.id} />
                <FieldContent>
                  <FieldTitle>{option.label}</FieldTitle>
                  <FieldDescription>{option.description}</FieldDescription>
                </FieldContent>
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </FieldSet>

      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor={contrastId}>{text.contrast}</FieldLabel>
          <FieldDescription id={contrastDescriptionId}>{text.contrastDescription}</FieldDescription>
        </FieldContent>
        <Switch
          id={contrastId}
          aria-describedby={contrastDescriptionId}
          checked={contrast === 'high'}
          onCheckedChange={(checked) => setContrast(checked ? 'high' : 'standard')}
        />
      </Field>
    </FieldGroup>
  );
}

/** An icon button that opens the appearance controls in a popover. */
export function ThemePicker({ labels }: ThemePickerProps) {
  const text = { ...defaultLabels, ...labels };
  return (
    <Popover>
      <PopoverTrigger
        render={<IconButton icon={PaletteIcon} label={text.trigger} tooltip={false} />}
      />
      <PopoverContent align="end">
        <PopoverHeader>
          <PopoverTitle>{text.title}</PopoverTitle>
        </PopoverHeader>
        <ThemeSettings labels={labels} />
      </PopoverContent>
    </Popover>
  );
}
