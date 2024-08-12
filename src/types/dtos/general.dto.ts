import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class DynamoPaginationQueryDto {
	@ApiProperty({ description: 'limit of documents' })
	@Type(() => Number)
	@IsInt()
	itemsPerPage: number;

	@ApiProperty({ description: 'last id of the last document fetched' })
	@IsUUID('4')
	@IsOptional()
	lastId?: string;
}

export class MongoPaginationQueryDto {
	@ApiProperty({ description: 'Items per page' })
	@Type(() => Number)
	@IsInt()
	itemsPerPage: number;

	@ApiProperty({ description: 'Current page to fetch' })
	@IsInt()
	page: number;
}

export class DynamoPaginationResultDto<T> {
	@ApiProperty({ description: 'last item id' })
	lastId: string;

	@ApiProperty({ description: 'Pagination result' })
	data: T[];
}
