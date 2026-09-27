import { createRoot } from 'react-dom/client';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import {
  Button,
  Cluster,
  ControlRow,
  DefinitionItem,
  DefinitionList,
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
  EmptyState,
  Field,
  FieldLabel,
  Input,
  Report,
  ReportContent,
  ReportHeader,
  Select,
  Stack,
  Surface,
  Text,
  Theme,
} from '../../../src/index.js';
import '../../../src/styles.css';

const environments = [
  { value: 'staging', label: 'staging' },
  { value: 'production', label: 'production' },
];

function Polish() {
  return (
    <Theme>
      <Surface padding="lg">
        <Stack gap="lg">
          <ControlRow>
            <Input aria-label="Search variables" icon={MagnifyingGlassIcon} placeholder="Search" />
            <Button variant="ghost">Add variable</Button>
          </ControlRow>
          <Cluster>
            <Select aria-label="Toolbar environment" options={environments} />
            <Text>Toolbar select</Text>
          </Cluster>
          <Field>
            <FieldLabel>Form environment</FieldLabel>
            <Select options={environments} />
          </Field>
          <EmptyState
            title="No response yet"
            description="Send the request to see its response."
            action={
              <DefinitionList layout="columns">
                <DefinitionItem label="Send">⌘ Enter</DefinitionItem>
                <DefinitionItem label="Save">⌘ S</DefinitionItem>
              </DefinitionList>
            }
          />
          <Report aria-label="Pinned report">
            <ReportHeader>Pinned heading</ReportHeader>
            <ReportContent>Pinned body</ReportContent>
          </Report>
          <Report aria-label="Scrolling report">
            <ReportHeader sticky={false}>Scrolling heading</ReportHeader>
            <ReportContent>Scrolling body</ReportContent>
          </Report>
          <Disclosure>
            <DisclosureTrigger>Headers</DisclosureTrigger>
            <DisclosurePanel>content-type: application/json</DisclosurePanel>
          </Disclosure>
          <Button variant="ghost">Ghost action</Button>
        </Stack>
      </Surface>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(<Polish />);
