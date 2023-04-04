import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
    (
        data: string | undefined,
        ctx: ExecutionContext,
    ) => {
        const request: Express.Request = ctx
            .switchToHttp()
            .getRequest();
        return request.user;
    },
);
