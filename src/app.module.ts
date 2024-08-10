import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthcheckService } from './services/health-check.service';
import { AuditModule } from './audit/audit.module';
import { AuditController } from './audit.controller';

@Module({
	imports: [AuditModule],
	controllers: [AppController, AuditController],
	providers: [HealthcheckService],
})
export class AppModule {}
