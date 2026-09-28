import type { ComponentProps } from 'react';

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
} from '@/components/ui/questionnaire';

export type QuestionnaireProps = ComponentProps<typeof Questionnaire>;
export type QuestionnaireProgressProps = ComponentProps<typeof QuestionnaireProgress>;
export type QuestionnaireItemProps = ComponentProps<typeof QuestionnaireItem>;
export type QuestionnaireTitleProps = ComponentProps<typeof QuestionnaireTitle>;
export type QuestionnaireDescriptionProps = ComponentProps<typeof QuestionnaireDescription>;
export type QuestionnaireChoicesProps = ComponentProps<typeof QuestionnaireChoices>;
export type QuestionnaireChoiceProps = ComponentProps<typeof QuestionnaireChoice>;
export type QuestionnaireChoiceDescriptionProps = ComponentProps<
  typeof QuestionnaireChoiceDescription
>;
export type QuestionnaireInputProps = ComponentProps<typeof QuestionnaireInput>;
export type QuestionnaireErrorProps = ComponentProps<typeof QuestionnaireError>;
export type QuestionnaireActionsProps = ComponentProps<typeof QuestionnaireActions>;
export type QuestionnairePreviousProps = ComponentProps<typeof QuestionnairePrevious>;
export type QuestionnaireSkipProps = ComponentProps<typeof QuestionnaireSkip>;
export type QuestionnaireNextProps = ComponentProps<typeof QuestionnaireNext>;
export type QuestionnaireSubmitProps = ComponentProps<typeof QuestionnaireSubmit>;

export {
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
};
