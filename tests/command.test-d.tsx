import { CommandInput, CommandSeparator, CommandStatus } from '../src/components/command.js';

<CommandInput expanded={false} />;
<CommandStatus>Loading results.</CommandStatus>;
// @ts-expect-error Expanded state is behavior, not an open-ended visual variant.
<CommandInput expanded="open" />;
// @ts-expect-error Consumer styles remain forbidden in structural spreads.
<CommandInput {...{ style: { padding: 20 } }} />;
// @ts-expect-error Status options retain the library's owned listbox semantics.
<CommandStatus role="button" />;
// @ts-expect-error Loading/empty content has no consumer CSS escape.
<CommandStatus className="custom" />;
<CommandSeparator alwaysRender />;
// @ts-expect-error The separator stays presentational inside the listbox.
<CommandSeparator role="separator" />;
