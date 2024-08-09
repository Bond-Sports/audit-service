import { BaseDal } from './base.dal';
import { IAuditActionType } from '../../models/dynamodb/types/audit.dynamodb.interfaces';
import { ActionTypeModel } from '../../models/dynamodb/action-type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionTypeDal extends BaseDal<IAuditActionType> {
	constructor() {
		super(ActionTypeModel);
	}
}
