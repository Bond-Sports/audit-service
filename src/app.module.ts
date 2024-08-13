import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HealthcheckService } from './services/health-check.service';
import { AuditModule } from './audit/audit.module';
import { AuditController } from './audit.controller';

// Todo - AuditModule shoule include the AuditController and remove it from here. the import AuditModule should be enough
// Todo - create a HealthCheckModule and move the HealthCheckService to it and import it in the AppModule (this way we can start working with NestJS template and automaticly build it )
@Module({
	imports: [AuditModule],
	controllers: [AppController, AuditController],
	providers: [HealthcheckService],
})
export class AppModule {}
