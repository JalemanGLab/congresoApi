import { Module } from '@nestjs/common';
import { AssistantsController } from './assistants.controller';
import { AssistantsService } from './assistants.service';
import { SupabaseModule } from '../../config/supabase/supabase.module';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../../config/email/email.module';

@Module({
  imports: [SupabaseModule, UsersModule, EmailModule],
  controllers: [AssistantsController],
  providers: [AssistantsService],
})
export class AssistantsModule {}