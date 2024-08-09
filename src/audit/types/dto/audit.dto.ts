import { ByOrganizationIdDto } from '@bondsports/types';
import { AutoMap } from '@automapper/classes';

export abstract class AuditBaseDto {
	@AutoMap()
	id: string;

	@AutoMap()
	organizationId: number;

	@AutoMap()
	createdAt: Date;

	@AutoMap()
	updatedAt: Date;

	@AutoMap()
	deletedAt?: Date;
}

export class CreateAuditLogDto extends ByOrganizationIdDto {
	log: AuditLogDto;
}

export class CategoryDto extends AuditBaseDto {
	@AutoMap()
	name: string;

	@AutoMap()
	description?: string;

	@AutoMap(() => [AuditLogDto])
	auditLogs?: AuditLogDto[];
}

export class SubCategoryDto extends AuditBaseDto {
	@AutoMap()
	name: string;

	@AutoMap()
	description?: string;

	@AutoMap(() => [AuditLogDto])
	auditLogs?: AuditLogDto[];
}

export class ActionTypeDto extends AuditBaseDto {
	@AutoMap()
	name: string;

	@AutoMap()
	description?: string;

	@AutoMap(() => [AuditLogDto])
	auditLogs?: AuditLogDto[];
}

export class AuditLogDto extends AuditBaseDto {
	@AutoMap()
	userId: number;

	@AutoMap()
	facilityId?: number;

	@AutoMap(() => [String])
	userRoles?: string[];

	@AutoMap()
	method: string;

	@AutoMap()
	url: string;

	@AutoMap(() => Object)
	changes?: any;

	@AutoMap(() => Object)
	response?: any;

	@AutoMap()
	categoryId?: string;

	@AutoMap()
	subCategoryId?: string;

	@AutoMap()
	actionTypeId?: string;

	@AutoMap(() => CategoryDto)
	category: CategoryDto;

	@AutoMap(() => SubCategoryDto)
	subCategory: SubCategoryDto;

	@AutoMap(() => ActionTypeDto)
	actionType: ActionTypeDto;
}
