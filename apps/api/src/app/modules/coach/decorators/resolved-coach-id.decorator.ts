import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ResolvedCoachId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    return ctx.switchToHttp().getRequest().resolvedCoachId as string;
  }
);
