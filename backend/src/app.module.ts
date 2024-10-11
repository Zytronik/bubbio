import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mailer/mailer.module';
import { UsersModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        MailModule,
        UsersModule,
        SessionModule,
    ],
    providers: [],
})
export class AppModule {}
