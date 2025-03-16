import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { DistributorsModule } from './distributors/distributors.module';
import { AssistantsModule } from './assistants/assistants.module';
import { UsersModule } from './users/users.module';
import { FAQModule } from './fap/faq.module';
import { EmailModule } from './email/email.module';
import { QRModule } from './qr/qr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    DistributorsModule,
    AssistantsModule,
    UsersModule,
    FAQModule,
    EmailModule,
    QRModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
