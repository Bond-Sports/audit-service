import { Injectable } from '@nestjs/common';
import { ActionType } from '../../models/mongodb/action-type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AUDIT_ACTION_TYPES_COLLECTION } from '../../models/mongodb/constants';
import { AuditBaseDal } from './base.dal';

@Injectable()
export class ActionTypeDal extends AuditBaseDal<ActionType> {
	constructor(@InjectModel(AUDIT_ACTION_TYPES_COLLECTION) model: Model<ActionType>) {
		super(model as any);
	}
}
