import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context, status) {
        return user;
    }

    canActivate(context: ExecutionContext) {
        try {
            return super.canActivate(context);
        } catch (e) {
            return true;
        }
    }
}
