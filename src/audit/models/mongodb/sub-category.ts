import { AuditBase } from './audit.base';
import { Schema } from 'mongoose';
import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose';
import { AuditLog } from './audit-log';
import { Type } from 'class-transformer';
import { AutoMap } from '@automapper/classes';
import { STRING_DEFAULT_LIMIT } from '@bondsports/general';
import { AUDIT_LOGS_COLLECTION, AUDIT_SUB_CATEGORIES_COLLECTION } from './constants';
import { ISubCategoryDocument } from './types/audit.interfaces';

@SchemaDecorator({ collection: AUDIT_SUB_CATEGORIES_COLLECTION })
export class SubCategory extends AuditBase implements ISubCategoryDocument {
	@Prop({ type: Schema.Types.String, required: true, index: true, maxlength: STRING_DEFAULT_LIMIT })
	@AutoMap()
	name: string;

	@Prop({ type: Schema.Types.String, required: false, maxlength: STRING_DEFAULT_LIMIT })
	@AutoMap()
	description?: string;

	@Prop({ type: [{ type: Schema.Types.ObjectId, ref: AUDIT_LOGS_COLLECTION }] })
	@Type(() => AuditLog)
	@AutoMap(() => [AuditLog])
	auditLogs: AuditLog[];
}

export const AuditSubCategorySchema = SchemaFactory.createForClass(SubCategory);
