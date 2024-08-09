import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { AuditModule } from '../audit/audit.module';

@Module({ imports: [AuditModule], controllers: [EventsController] })
export class EventsModule {}
