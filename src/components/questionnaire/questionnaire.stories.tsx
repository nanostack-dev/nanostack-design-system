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
} from './questionnaire';

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

const meta = {
  title: 'Components/Questionnaire',
  parameters: {
    docs: {
      description: {
        component:
          'A step-by-step list of questions with choices. Use it for onboarding and for short surveys.',
      },
    },
  },
  component: Questionnaire,
  args: { defaultItem: 'direction', items, onSubmit: handleSubmit },
  beforeEach: () => {
    submitted.mockClear();
  },
  render: (args) => (
    <Questionnaire {...args} className="w-lg">
      <QuestionnaireProgress />
      <QuestionnaireItem name="direction" required>
        <QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose one direction or write another answer.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="delegation">
            <span className="font-medium">Sub-agent delegation</span>
            <QuestionnaireChoiceDescription>
              Show when work is delegated and what comes back.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="questions">
            <span className="font-medium">Question prompts</span>
            <QuestionnaireChoiceDescription>
              Show choices while the agent waits for input.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="both">
            <span className="font-medium">Both together</span>
          </QuestionnaireChoice>
          <QuestionnaireInput aria-label="Another direction" placeholder="Type another direction" />
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
