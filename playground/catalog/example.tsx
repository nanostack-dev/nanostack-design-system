import type { ReactNode } from 'react';
import * as UI from '../../src/index.js';

export function Example({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <UI.Section>
      <UI.SectionHeader>
        <UI.Stack gap="xs">
          <UI.SectionTitle>{title}</UI.SectionTitle>
          <UI.SectionDescription>{description}</UI.SectionDescription>
        </UI.Stack>
        {actions ? <UI.SectionActions>{actions}</UI.SectionActions> : null}
      </UI.SectionHeader>
      <UI.SectionBody>{children}</UI.SectionBody>
    </UI.Section>
  );
}
