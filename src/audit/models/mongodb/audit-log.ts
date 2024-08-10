import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import {
	AUDIT_ACTION_TYPES_COLLECTION,
	AUDIT_CATEGORIES_COLLECTION,
	AUDIT_LOGS_COLLECTION,
	AUDIT_SUB_CATEGORIES_COLLECTION,
} from './constants';
import { AutoMap } from '@automapper/classes';
import { Schema } from 'mongoose';
import { AuditBase } from './audit.base';
import { IAuditLogDocument } from './types/audit.interfaces';
import { Category } from './category';
import { SubCategory } from './sub-category';
import { ActionType } from './action-type';

@SchemaDecorator({ collection: AUDIT_LOGS_COLLECTION })
export class AuditLog extends AuditBase implements IAuditLogDocument {
	@Prop({ type: Schema.Types.Number, required: true, index: true })
	@Type(() => Number)
	@AutoMap()
	userId: number;

	@Prop({ type: Schema.Types.Number, required: false, index: true })
	@Type(() => Number)
	@AutoMap()
	facilityId?: number;

	@Prop({ type: [Schema.Types.String], required: false })
	@Type(() => String)
	@AutoMap(() => [String])
	userRoles?: string[];

	@Prop({ type: Schema.Types.String, required: true })
	@AutoMap()
	method: string;

	@Prop({ type: Schema.Types.String, required: true })
	@AutoMap()
	url: string;

	@Prop({ type: Schema.Types.Mixed })
	@Type(() => Object)
	@AutoMap(() => Object)
	changes?: any;

	@Prop({ type: Schema.Types.Mixed })
	@Type(() => Object)
	@AutoMap(() => Object)
	response?: any;

	@Prop({ type: Schema.Types.ObjectId, ref: AUDIT_CATEGORIES_COLLECTION, required: false })
	@Type(() => Category)
	@AutoMap(() => Category)
	category: Category;

	@Prop({ type: Schema.Types.ObjectId, ref: AUDIT_SUB_CATEGORIES_COLLECTION, required: false })
	@Type(() => SubCategory)
	@AutoMap(() => SubCategory)
	subCategory: SubCategory;

	@Prop({ type: Schema.Types.ObjectId, ref: AUDIT_ACTION_TYPES_COLLECTION, required: false })
	@Type(() => ActionType)
	@AutoMap(() => ActionType)
	actionType: ActionType;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
