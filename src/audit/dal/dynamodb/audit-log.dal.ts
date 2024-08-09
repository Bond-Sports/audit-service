import { BaseDal } from './base.dal';
import { IAuditLog } from '../../models/dynamodb/types/audit.dynamodb.interfaces';
import { AuditLogModel } from '../../models/dynamodb/audit-log';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogDal extends BaseDal<IAuditLog> {
	constructor() {
		super(AuditLogModel);
	}
}
