import { Schema } from 'mongoose';

export interface IBaseDocument {
	id: Schema.Types.ObjectId;
	organizationId: number;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date;
}

export interface ICategoryDocument extends IBaseDocument {
	name: string;
	description?: string;
	auditLogs: IAuditLogDocument[];
}

export interface ISubCategoryDocument extends IBaseDocument {
	name: string;
	description?: string;
	auditLogs: IAuditLogDocument[];
}

export interface IActionTypeDocument extends IBaseDocument {
	name: string;
	description?: string;
	auditLogs: IAuditLogDocument[];
}

export interface IAuditLogDocument extends IBaseDocument {
	userId: number;
	facilityId?: number;
	userRoles?: string[];
	method: string;
	url: string;
	changes?: any;
	response?: any;
	categoryId?: Schema.Types.ObjectId;
	subCategoryId?: Schema.Types.ObjectId;
	actionTypeId?: Schema.Types.ObjectId;
	category: ICategoryDocument;
	subCategory: ISubCategoryDocument;
	actionType: IActionTypeDocument;
}
