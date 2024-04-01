import { Module, forwardRef } from '@nestjs/common';
import { GlickoService } from './glicko.service';
import { RanksService } from './ranks.service';
import { UsersModule } from 'src/user/user.module';

@Module({
    imports: [forwardRef(() => UsersModule)],
    providers: [GlickoService, RanksService],
    exports: [RanksService, GlickoService],
})
export class RankedModule { }
