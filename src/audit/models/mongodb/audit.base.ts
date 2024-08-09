import { Schema } from 'mongoose';
import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { AutoMap } from '@automapper/classes';
import { IBaseDocument } from './types/audit.interfaces';

export abstract class AuditBase implements IBaseDocument {
	@Prop({ type: Schema.Types.ObjectId, index: true, _id: true })
	@Type(() => String)
	@AutoMap()
	id: Schema.Types.ObjectId;

	@Prop({ type: Number, required: true, index: true })
	@Type(() => Number)
	@AutoMap()
	organizationId: number;

	@Prop({ type: Date, required: true, default: () => new Date() })
	@Type(() => Date)
	@AutoMap()
	createdAt: Date;

	@Prop({ type: Date, required: true, default: () => new Date() })
	@Type(() => Date)
	@AutoMap()
	updatedAt: Date;

	@Prop({ type: Date, required: false })
	@Type(() => Date)
	@AutoMap()
	deletedAt?: Date;
}
