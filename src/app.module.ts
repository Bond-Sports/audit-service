import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthcheckService } from './services/health-check.service';
import { AuditModule } from './audit/audit.module';

@Module({
	imports: [AuditModule],
	controllers: [AppController],
	providers: [HealthcheckService],
})
export class AppModule {}
