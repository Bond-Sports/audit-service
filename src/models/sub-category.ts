import { model, Schema } from 'dynamoose';
import * as uuid from 'uuid';
import { ModelType } from 'dynamoose/dist/General';
import { IAuditLog, IAuditSubCategory } from '../types/interfaces';
import { Type } from 'class-transformer';
import { AuditLog } from './audit-log';

const SubCategorySchema = new Schema(
	{
		id: { type: String, required: true, index: true, default: () => uuid.v4() },
		organizationId: { type: Number, required: true, index: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		deletedAt: {
			type: {
				value: Number,
				settings: {
					storage: 'milliseconds',
				},
			},
			default: null,
			required: false,
		},
	},
	{
		timestamps: {
			createdAt: {
				createdAt: {
					type: {
						value: Number,
						settings: {
							storage: 'milliseconds',
						},
					},
				},
			},
			updatedAt: {
				updatedAt: {
					type: {
						value: Number,
						settings: {
							storage: 'milliseconds',
						},
					},
				},
			},
		},
	}
);

export const SubCategoryModel: ModelType<IAuditSubCategory> = model('audit_log_sub_categories', SubCategorySchema);

export class SubCategory {
	@Type(() => String)
	name: string;

	@Type(() => String)
	description?: string;

	@Type(() => AuditLog)
	auditLogs?: IAuditLog[];

	@Type(() => String)
	id: string;

	@Type(() => Number)
	organizationId: number;

	@Type(() => Date)
	createdAt: Date;

	@Type(() => Date)
	updatedAt: Date;

	@Type(() => Date)
	deletedAt?: Date;
}
