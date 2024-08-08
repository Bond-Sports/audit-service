import { BaseDal } from './base.dal';
import { IAuditLog } from '../types/interfaces';
import { AuditLogModel } from '../models/audit-log';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogDal extends BaseDal<IAuditLog> {
	constructor() {
		super(AuditLogModel);
	}
}
