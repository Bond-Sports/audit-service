import { BaseDal } from './base.dal';
import { IAuditActionType } from '../types/interfaces';
import { ActionTypeModel } from '../models/action-type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionTypeDal extends BaseDal<IAuditActionType> {
	constructor() {
		super(ActionTypeModel);
	}
}
