import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './config/supabase/supabase.module';
import { DistributorsModule } from './modules/distributors/distributors.module';
import { AssistantsModule } from './modules/assistants/assistants.module';
import { UsersModule } from './modules/users/users.module';
import { FAQModule } from './modules/fap/faq.module'
import { EmailModule } from './config/email/email.module';
import { QRModule } from './common/services/qr/qr.module';
import { PDFModule } from './common/services/pdf/pdf.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    DistributorsModule,
    AssistantsModule,
    AuthModule,
    UsersModule,
    FAQModule,
    EmailModule,
    QRModule,
    PDFModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
