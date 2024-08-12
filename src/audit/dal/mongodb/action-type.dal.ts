import { Injectable } from '@nestjs/common';
import { ActionType } from '../../models/mongodb/action-type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AUDIT_ACTION_TYPES_COLLECTION } from '../../models/mongodb/constants';
import { AuditBaseDal } from './base.dal';
import { IFindByNameDal } from '../types/interfaces';

@Injectable()
export class ActionTypeDal extends AuditBaseDal<ActionType> implements IFindByNameDal<ActionType> {
	constructor(@InjectModel(AUDIT_ACTION_TYPES_COLLECTION) model: Model<ActionType>) {
		super(model as any);
	}

	/**
	 * Find an action type by name
	 * @param organizationId {number} The organization ID
	 * @param name {string} The name of the action type
	 * @returns {Promise<ActionType>} The action type
	 */
	async findOneByName(organizationId: number, name: string): Promise<ActionType> {
		return await this.model.findOne({ organizationId: { $eq: organizationId }, name: { $eq: name } }).exec();
	}
}
