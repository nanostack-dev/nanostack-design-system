import { CheckIcon } from '@phosphor-icons/react';
import { Questionnaire as QuestionnairePrimitive } from '@shadcn/react/questionnaire';
import type { ComponentProps, ComponentPropsWithRef } from 'react';

import { buttonStyles } from '@/components/button/button';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

type PrimitiveProps<Part extends keyof typeof QuestionnairePrimitive> = ClosedProps<
  Omit<ComponentProps<(typeof QuestionnairePrimitive)[Part]>, 'render'>
>;

export type QuestionnaireProps = PrimitiveProps<'Root'>;
export type QuestionnaireProgressProps = PrimitiveProps<'Progress'>;
export type QuestionnaireItemProps = PrimitiveProps<'Item'>;
export type QuestionnaireTitleProps = PrimitiveProps<'Title'>;
export type QuestionnaireDescriptionProps = PrimitiveProps<'Description'>;
export type QuestionnaireChoicesProps = PrimitiveProps<'Choices'>;
export type QuestionnaireChoiceProps = PrimitiveProps<'Choice'>;
export type QuestionnaireChoiceDescriptionProps = ClosedProps<ComponentPropsWithRef<'span'>>;
export type QuestionnaireInputProps = PrimitiveProps<'Input'>;
export type QuestionnaireErrorProps = PrimitiveProps<'Error'>;
export type QuestionnaireActionsProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type QuestionnairePreviousProps = PrimitiveProps<'Previous'>;
export type QuestionnaireSkipProps = PrimitiveProps<'Skip'>;
export type QuestionnaireNextProps = PrimitiveProps<'Next'>;
export type QuestionnaireSubmitProps = PrimitiveProps<'Submit'>;

export function Questionnaire(props: QuestionnaireProps) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className="flex w-full min-w-0 flex-col gap-6"
      {...props}
    />
  );
}

export function QuestionnaireProgress(props: QuestionnaireProgressProps) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className="min-h-[1lh] w-fit min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums"
      {...props}
    />
  );
}

export function QuestionnaireItem(props: QuestionnaireItemProps) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className="flex min-w-0 flex-col gap-5 border-0 p-0 outline-none"
      {...props}
    />
  );
}

export function QuestionnaireTitle(props: QuestionnaireTitleProps) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className="font-heading text-base font-semibold text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-5"
      {...props}
    />
  );
}

export function QuestionnaireDescription(props: QuestionnaireDescriptionProps) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className="text-sm text-pretty text-muted-foreground"
      {...props}
    />
  );
}

export function QuestionnaireChoices(props: QuestionnaireChoicesProps) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className="group/questionnaire-choices grid min-w-0 gap-3"
      {...props}
    />
  );
}

export function QuestionnaireChoice({ children, ...props }: QuestionnaireChoiceProps) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      className="group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-3xl border border-input px-4 py-3 text-start text-sm transition-colors outline-none select-none hover:bg-input/40 has-[>input:focus-visible]:border-ring has-[>input:focus-visible]:ring-3 has-[>input:focus-visible]:ring-ring/50 data-invalid:border-destructive data-checked:border-primary/40 data-checked:bg-primary/10 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50"
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-[5px] border border-transparent bg-input/90 group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[type=radio]/questionnaire-choice:rounded-full group-data-checked/questionnaire-choice:border-primary group-data-checked/questionnaire-choice:bg-primary group-data-checked/questionnaire-choice:text-primary-foreground dark:group-data-checked/questionnaire-choice:bg-primary"
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className="hidden size-2 rounded-full bg-primary-foreground group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block dark:size-2.5"
        />
        <CheckIcon
          data-slot="questionnaire-choice-indicator-check"
          className="hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-1 leading-snug has-data-[slot=questionnaire-choice-description]:font-medium"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className="pointer-events-none ms-auto hidden size-5 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-full border border-primary/10 bg-background/80 font-mono text-[0.625rem] leading-none font-medium text-muted-foreground group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[shortcut]/questionnaire-choice:inline-flex"
      />
    </QuestionnairePrimitive.Choice>
  );
}

export function QuestionnaireChoiceDescription(props: QuestionnaireChoiceDescriptionProps) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className="font-normal text-muted-foreground"
      {...props}
    />
  );
}

export function QuestionnaireInput(props: QuestionnaireInputProps) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className="h-9 min-h-11 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 sm:min-h-0 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        {...props}
      />
    </div>
  );
}

export function QuestionnaireError(props: QuestionnaireErrorProps) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className="mt-2 text-sm text-destructive-on-tint"
      {...props}
    />
  );
}

export function QuestionnaireActions(props: QuestionnaireActionsProps) {
  return (
    <div
      data-slot="questionnaire-actions"
      className="grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-9"
      {...props}
    />
  );
}

const secondaryAction = buttonStyles({ variant: 'outline', tone: 'neutral', size: 'md' });
const primaryAction = buttonStyles({ variant: 'solid', tone: 'brand', size: 'md' });

export function QuestionnairePrevious({ children, ...props }: QuestionnairePreviousProps) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      className={cn(
        secondaryAction,
        'col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0',
      )}
      {...props}
    >
      {children ?? 'Previous'}
    </QuestionnairePrimitive.Previous>
  );
}

export function QuestionnaireSkip({ children, ...props }: QuestionnaireSkipProps) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      className={cn(
        secondaryAction,
        'col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0',
      )}
      {...props}
    >
      {children ?? 'Skip'}
    </QuestionnairePrimitive.Skip>
  );
}

export function QuestionnaireNext({ children, ...props }: QuestionnaireNextProps) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      className={cn(primaryAction, 'col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0')}
      {...props}
    >
      {children ?? 'Next'}
    </QuestionnairePrimitive.Next>
  );
}

export function QuestionnaireSubmit({ children, ...props }: QuestionnaireSubmitProps) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      className={cn(primaryAction, 'col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0')}
      {...props}
    >
      {children ?? 'Submit'}
    </QuestionnairePrimitive.Submit>
  );
}
