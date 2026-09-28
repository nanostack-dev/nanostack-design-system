import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FormEvent } from 'react';
import { expect, fn } from 'storybook/test';

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '@/components/questionnaire';

const items = [
  {
    name: 'direction',
    required: true,
    choices: [{ value: 'delegation' }, { value: 'questions' }, { value: 'both' }],
  },
  {
    name: 'signals',
    choices: [{ value: 'progress' }, { value: 'decisions' }, { value: 'risks' }],
  },
] as const;

const submitted = fn();

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  submitted(Object.fromEntries(new FormData(event.currentTarget).entries()));
}

function Navigation() {
  return (
    <QuestionnaireActions>
      <QuestionnairePrevious />
      <QuestionnaireSkip />
      <QuestionnaireNext />
      <QuestionnaireSubmit />
    </QuestionnaireActions>
  );
}

const usage = `
A step-by-step list of questions with choices. Use it for onboarding and for short surveys, or when an assistant waits for an answer. For a single question in a form, use \`RadioGroup\` or \`Checkbox\` in a \`Field\`.

The props are the whole API. No part accepts \`className\` or \`style\`. The questionnaire fills the width of its container.

## Structure

- \`Questionnaire\` is a form. Pass \`items\` (the order and the rules) and \`onSubmit\`.
- \`QuestionnaireItem\` is one question. \`multiple\` makes its choices checkboxes, \`required\` blocks Next until an answer is set.
- \`QuestionnaireChoice\` is one answer. When it has a \`QuestionnaireChoiceDescription\`, the first line becomes the title in medium weight.
- \`QuestionnaireInput\` in \`QuestionnaireChoices\` adds a free answer.
- \`QuestionnaireActions\` holds the navigation. \`Previous\` and \`Skip\` are outline buttons. \`Next\` and \`Submit\` are the solid brand action, and only one of them shows at a time.

## shortcuts

| Value | Use it for |
| --- | --- |
| none | The default. Choices take a click or the arrow keys. |
| \`letters\` | A keyboard-first flow, such as a questionnaire in a chat. Each choice shows its letter. |
| \`numbers\` | The same, for a scale or a ranked list, where a number reads better than a letter. |

## Do not

- Do not put more than one question on a step. Use a form instead.
- Do not add a \`Button\` for navigation. The action parts know the step and the validation.
- Do not use a questionnaire for settings that people change later.
`;

const meta = {
  title: 'Components/Questionnaire',
  parameters: { docs: { description: { component: usage } } },
  component: Questionnaire,
  args: { defaultItem: 'direction', items, onSubmit: handleSubmit },
  beforeEach: () => {
    submitted.mockClear();
  },
  render: (args) => (
    <div className="w-lg">
      <Questionnaire {...args}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="direction" required>
          <QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Choose one direction or write another answer.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="delegation">
              Sub-agent delegation
              <QuestionnaireChoiceDescription>
                Show when work is delegated and what comes back.
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="questions">
              Question prompts
              <QuestionnaireChoiceDescription>
                Show choices while the agent waits for input.
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="both">Both together</QuestionnaireChoice>
            <QuestionnaireInput
              aria-label="Another direction"
              placeholder="Type another direction"
            />
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="signals" multiple>
          <QuestionnaireTitle>What should every update include?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Select all that apply, or skip this question.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="progress">Progress</QuestionnaireChoice>
            <QuestionnaireChoice value="decisions">Decisions</QuestionnaireChoice>
            <QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <Navigation />
      </Questionnaire>
    </div>
  ),
} satisfies Meta<typeof Questionnaire>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('group', { name: 'What should we prototype next?' }),
    ).toBeVisible();
    await expect(canvas.getAllByRole('radio')).toHaveLength(3);
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeVisible();
    const label = canvas.getByText('Sub-agent delegation');
    const description = canvas.getByText('Show when work is delegated and what comes back.');
    await expect(getComputedStyle(label).fontWeight).toBe('500');
    await expect(getComputedStyle(description).fontWeight).toBe('400');
  },
};

export const SelectAndSubmit: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /Question prompts/ }));
    await expect(canvas.getByRole('radio', { name: /Question prompts/ })).toBeChecked();
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(
      await canvas.findByRole('group', { name: 'What should every update include?' }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Progress' }));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Risks' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(submitted).toHaveBeenCalledOnce();
    await expect(submitted.mock.calls[0]![0]).toMatchObject({ direction: 'questions' });
  },
};

export const RequiredAnswer: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(
      canvas.getByRole('group', { name: 'What should we prototype next?' }),
    ).toBeVisible();
    await expect(submitted).not.toHaveBeenCalled();
  },
};

export const Previous: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('radio', { name: /Both together/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await canvas.findByRole('group', { name: 'What should every update include?' });
    await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    const first = await canvas.findByRole('group', { name: 'What should we prototype next?' });
    await expect(first).toBeVisible();
    await expect(canvas.getByRole('radio', { name: /Both together/ })).toBeChecked();
  },
};

export const Keyboard: Story = {
  args: { shortcuts: 'letters' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: /Sub-agent delegation/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('radio', { name: /Question prompts/ })).toBeChecked();
  },
};
