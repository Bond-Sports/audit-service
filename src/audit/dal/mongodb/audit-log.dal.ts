import { AuditBaseDal } from './base.dal';
import { AUDIT_LOGS_COLLECTION } from '../../models/mongodb/constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'dynamoose/dist/Model';
import { AuditLog } from '../../models/mongodb/audit-log';
import { IAuditLogDocument } from '../../models/mongodb/types/audit.interfaces';

export class AuditLogDal extends AuditBaseDal<IAuditLogDocument> {
	//@ts-ignore
	constructor(@InjectModel(AUDIT_LOGS_COLLECTION) model: Model<AuditLog>) {
		super(model as any);
	}
}
