import { AutoMap } from '@automapper/classes';
import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsOptional, IsString, IsUrl, Max, ValidateNested } from 'class-validator';
import { HttpVerbsEnum } from '../../../types/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { STRING_DEFAULT_LIMIT } from '@bondsports/general';
import { Type } from 'class-transformer';

export abstract class AuditBaseDto {
	@AutoMap()
	id: string;

	@AutoMap()
	@Type(() => Number)
	organizationId: number;

	@AutoMap()
	@Type(() => Date)
	createdAt: Date;

	@AutoMap()
	@Type(() => Date)
	updatedAt: Date;

	@AutoMap()
	@Type(() => Date)
	deletedAt?: Date;
}

export class CreateAuditLogDto {
	@ApiProperty({ description: 'User ID' })
	@AutoMap()
	@IsInt()
	userId: number;

	@ApiPropertyOptional({ description: 'Facility ID' })
	@AutoMap()
	@IsInt()
	@IsOptional()
	facilityId?: number;

	@ApiPropertyOptional({ description: 'User roles' })
	@AutoMap(() => [String])
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	@IsOptional()
	userRoles?: string[];

	@ApiProperty({ description: 'HTTP method' })
	@AutoMap()
	@IsString()
	@IsIn([HttpVerbsEnum.PUT, HttpVerbsEnum.POST, HttpVerbsEnum.DELETE, HttpVerbsEnum.PATCH])
	method: string;

	@ApiProperty({ description: 'URL' })
	@AutoMap()
	@IsUrl()
	url: string;

	@ApiPropertyOptional({ description: 'Changes JSON' })
	@AutoMap(() => Object)
	@IsOptional()
	changes?: any;

	@ApiPropertyOptional({ description: 'Response JSON' })
	@AutoMap(() => Object)
	@IsOptional()
	response?: any;

	@ApiPropertyOptional({ description: 'Category ID' })
	@AutoMap()
	@IsString()
	@IsOptional()
	categoryId?: string;

	@ApiPropertyOptional({ description: 'Sub-category ID' })
	@AutoMap()
	@IsString()
	@IsOptional()
	subCategoryId?: string;

	@ApiPropertyOptional({ description: 'Action-type ID' })
	@AutoMap()
	@IsString()
	@IsOptional()
	actionTypeId?: string;
}

export class CreateAuditLogEventDto {
	@ApiProperty({ description: 'Organization ID' })
	@IsInt()
	organizationId: number;

	@AutoMap(() => CreateAuditLogDto)
	@ValidateNested()
	log: CreateAuditLogDto;
}

export class CreateSubCategoryDto {
	@ApiProperty({ description: 'Organization ID' })
	@IsInt()
	organizationId: number;

	@ApiProperty({ description: 'Name of the sub-category' })
	@IsString()
	@Max(STRING_DEFAULT_LIMIT)
	name: string;

	@ApiPropertyOptional({ description: 'Description of the sub-category' })
	@IsString()
	@IsOptional()
	description?: string;
}

export class CreateActionTypeDto {
	@ApiProperty({ description: 'Organization ID' })
	@IsInt()
	organizationId: number;

	@ApiProperty({ description: 'Name of the action-type' })
	@IsString()
	@Max(STRING_DEFAULT_LIMIT)
	name: string;

	@ApiPropertyOptional({ description: 'Description of the action-type' })
	@IsString()
	@IsOptional()
	description?: string;
}

export class CreateCategoryDto {
	@ApiProperty({ description: 'Organization ID' })
	@IsInt()
	organizationId: number;

	@ApiProperty({ description: 'Name of the category' })
	@IsString()
	@Max(STRING_DEFAULT_LIMIT)
	name: string;

	@ApiPropertyOptional({ description: 'Description of the category' })
	@IsString()
	@IsOptional()
	description?: string;
}

export class CategoryDto extends AuditBaseDto {
	@AutoMap()
	name: string;

	@AutoMap()
	description?: string;

	@AutoMap(() => [AuditLogDto])
	@Type(() => AuditLogDto)
	auditLogs?: AuditLogDto[];
}

export class SubCategoryDto extends AuditBaseDto {
	@AutoMap()
	name: string;

	@AutoMap()
	description?: string;

	@AutoMap(() => [AuditLogDto])
	@Type(() => AuditLogDto)
	auditLogs?: AuditLogDto[];
}

export class ActionTypeDto extends AuditBaseDto {
	@AutoMap()
	name: string;

	@AutoMap()
	description?: string;

	@AutoMap(() => [AuditLogDto])
	@Type(() => AuditLogDto)
	auditLogs?: AuditLogDto[];
}

export class AuditLogDto extends AuditBaseDto {
	@AutoMap()
	@Type(() => Number)
	userId: number;

	@AutoMap()
	@Type(() => Number)
	facilityId?: number;

	@AutoMap(() => [String])
	@Type(() => String)
	userRoles?: string[];

	@AutoMap()
	method: string;

	@AutoMap()
	url: string;

	@AutoMap(() => Object)
	@Type(() => Object)
	changes?: any;

	@AutoMap(() => Object)
	@Type(() => Object)
	response?: any;

	@AutoMap()
	categoryId?: string;

	@AutoMap()
	subCategoryId?: string;

	@AutoMap()
	actionTypeId?: string;

	@AutoMap(() => CategoryDto)
	@Type(() => CategoryDto)
	category: CategoryDto;

	@AutoMap(() => SubCategoryDto)
	@Type(() => SubCategoryDto)
	subCategory: SubCategoryDto;

	@AutoMap(() => ActionTypeDto)
	@Type(() => ActionTypeDto)
	actionType: ActionTypeDto;
}
