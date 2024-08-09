import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { AuditLog } from './audit-log';
import { STRING_DEFAULT_LIMIT } from '@bondsports/general';
import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import { AUDIT_CATEGORIES_COLLECTION, AUDIT_LOGS_COLLECTION } from './constants';
import { AuditBase } from './audit.base';
import { ICategoryDocument } from './types/audit.interfaces';

@SchemaDecorator({ collection: AUDIT_CATEGORIES_COLLECTION })
export class Category extends AuditBase implements ICategoryDocument {
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

export const AuditCategorySchema = SchemaFactory.createForClass(Category);
