import { AuditBase } from './audit.base';
import { Schema } from 'mongoose';
import { Prop, Schema as SchemaDecorator, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { AuditLog } from './audit-log';
import { Type } from 'class-transformer';
import { STRING_DEFAULT_LIMIT } from '@bondsports/general';
import { AUDIT_ACTION_TYPES_COLLECTION, AUDIT_LOGS_COLLECTION } from './constants';
import { IActionTypeDocument } from './types/audit.interfaces';

@SchemaDecorator({ collection: AUDIT_ACTION_TYPES_COLLECTION })
export class ActionType extends AuditBase implements IActionTypeDocument {
	@Prop({ type: Schema.Types.String, required: true, index: true, maxlength: STRING_DEFAULT_LIMIT })
	@AutoMap()
	name: string;

	@Prop({ type: [{ type: Schema.Types.ObjectId, ref: AUDIT_LOGS_COLLECTION }] })
	@Type(() => AuditLog)
	@AutoMap(() => [AuditLog])
	auditLogs: AuditLog[];
}

export const AuditActionTypeSchema = SchemaFactory.createForClass(ActionType);
