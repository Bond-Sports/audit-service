import { model, Schema } from 'dynamoose';
import * as uuid from 'uuid';
import { ModelType } from 'dynamoose/dist/General';
import { IAuditCategory, IAuditLog } from '../types/interfaces';
import { Type } from 'class-transformer';
import { AuditLog } from './audit-log';

const CategorySchema = new Schema(
	{
		id: { type: String, required: true, index: true, default: () => uuid.v4() },
		organizationId: { type: Number, required: true, index: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		deletedAt: {
			type: {
				value: Date,
				settings: {
					storage: 'iso',
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
						value: Date,
						settings: {
							storage: 'iso',
						},
					},
					rangeKey: true,
				},
			},
			updatedAt: {
				updatedAt: {
					type: {
						value: Date,
						settings: {
							storage: 'iso',
						},
					},
				},
			},
		},
	}
);

export const CategoryModel: ModelType<IAuditCategory> = model('audit_log_categories', CategorySchema);

export class Category {
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
