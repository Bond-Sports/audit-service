import { model, Schema } from 'dynamoose';
import * as uuid from 'uuid';
import { IAuditActionType, IAuditLog } from '../types/interfaces';
import { Type } from 'class-transformer';
import { AuditLog } from './audit-log';
import { ModelType } from 'dynamoose/dist/General';

const ActionTypeSchema = new Schema(
	{
		id: { type: String, required: true, index: true, set: () => uuid.v4() },
		name: { type: String, required: true },
		description: { type: String, required: true },
		deletedAt: {
			type: {
				value: Date,
				settings: {
					storage: 'iso',
				},
			},
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

export const ActionTypeModel: ModelType<IAuditActionType> = model('audit_action_types', ActionTypeSchema);

export class ActionType {
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
