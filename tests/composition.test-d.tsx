import { createRef } from 'react';
import { Form, Label, List, ListItem, ScrollRegion } from '../src/components/layout.js';
import { Code, Text } from '../src/components/typography.js';
import { DefinitionItem, DefinitionList } from '../src/blocks/inspector.js';
import { ResourceList, ResourceRow, ResourceRowLink } from '../src/blocks/resource-list.js';

export const allowed = (
  <>
    <ResourceList density="compact">
      <ResourceRow selected draggable readOnly>
        <ResourceRowLink href="/resource" ref={createRef<HTMLAnchorElement>()}>
          Resource
        </ResourceRowLink>
      </ResourceRow>
    </ResourceList>
    <Form method="post">
      <Label htmlFor="name">Name</Label>
    </Form>
    <List marker="none">
      <ListItem>One</ListItem>
    </List>
    <ScrollRegion label="History" height="fill" viewportRef={createRef<HTMLDivElement>()} />
    <Text display="inline" tone="danger" truncate>
      Failed
    </Text>
    <Code>id</Code>
    <DefinitionList layout="stacked">
      <DefinitionItem label="ID">one</DefinitionItem>
    </DefinitionList>
  </>
);
// @ts-expect-error Styling remains owned by the library.
export const customRow = <ResourceRow className="external" />;
// @ts-expect-error Internal CSS state cannot be set as a variant bypass.
export const forgedState = <ResourceRow {...{ 'data-ns-selected': 'true' }} />;
// @ts-expect-error No arbitrary dimensions.
export const customHeight = <ScrollRegion label="Events" height="314px" />;
// @ts-expect-error No open-ended element substitution.
export const polymorphicText = <Text as="article" />;
// @ts-expect-error Code rejects styles even with a structural object spread.
export const customCode = <Code {...{ style: { fontSize: '30px' } }} />;
// @ts-expect-error Resource links require a real destination.
export const missingDestination = <ResourceRowLink>Details</ResourceRowLink>;
