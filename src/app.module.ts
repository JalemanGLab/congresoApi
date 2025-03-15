import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { DistributorsModule } from './distributors/distributors.module';
import { AssistantsModule } from './assistants/assistants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    DistributorsModule,
    AssistantsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
