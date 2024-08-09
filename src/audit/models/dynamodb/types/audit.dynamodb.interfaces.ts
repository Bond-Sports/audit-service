import { OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { AnyItem } from 'dynamoose/dist/Item';

export interface IBaseAudit extends AnyItem {
	id: string;
	organizationId: number;
	createdAt: number;
	updatedAt: number;
	deletedAt?: number;
}

export interface IAuditLog extends IBaseAudit {
	userId: number;
	facilityId?: number;
	userRoles?: string[];
	method: string;
	url: string;
	changes?: any;
	response?: any;
	categoryId?: string;
	subCategoryId?: string;
	actionTypeId?: string;
	category: IAuditCategory;
	subCategory: IAuditSubCategory;
	actionType: IAuditActionType;
}

export interface IAuditCategory extends IBaseAudit {
	name: string;
	description?: string;
	auditLogs?: IAuditLog[];
}

export interface IAuditSubCategory extends IBaseAudit {
	name: string;
	description?: string;
	auditLogs?: IAuditLog[];
}

export interface IAuditActionType extends IBaseAudit {
	name: string;
	description?: string;
	auditLogs?: IAuditLog[];
}

export interface IPubSub<T> extends OnApplicationBootstrap, OnApplicationShutdown {
	publish(message: T): Promise<void>;
}
