import type { ComponentProps } from 'react';

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription as AttachmentDescriptionPrimitive,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from '@/components/ui/attachment';
import { cn } from '@/lib/utils';

export type AttachmentProps = ComponentProps<typeof Attachment>;
export type AttachmentState = NonNullable<AttachmentProps['state']>;
export type AttachmentSize = NonNullable<AttachmentProps['size']>;
export type AttachmentOrientation = NonNullable<AttachmentProps['orientation']>;
export type AttachmentGroupProps = ComponentProps<typeof AttachmentGroup>;
export type AttachmentMediaProps = ComponentProps<typeof AttachmentMedia>;
export type AttachmentContentProps = ComponentProps<typeof AttachmentContent>;
export type AttachmentTitleProps = ComponentProps<typeof AttachmentTitle>;
export type AttachmentDescriptionProps = ComponentProps<typeof AttachmentDescriptionPrimitive>;
export type AttachmentActionsProps = ComponentProps<typeof AttachmentActions>;
export type AttachmentActionProps = ComponentProps<typeof AttachmentAction>;
export type AttachmentTriggerProps = ComponentProps<typeof AttachmentTrigger>;

export function AttachmentDescription({ className, ...props }: AttachmentDescriptionProps) {
  return (
    <AttachmentDescriptionPrimitive
      className={cn('group-data-[state=error]/attachment:text-destructive-on-tint', className)}
      {...props}
    />
  );
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
};
