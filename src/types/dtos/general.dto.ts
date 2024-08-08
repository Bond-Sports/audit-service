import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class PaginationQueryDto {
	@ApiProperty({ description: 'limit of documents' })
	@Type(() => Number)
	@IsInt()
	limit: number;

	@ApiProperty({ description: 'last id of the last document fetched' })
	@IsUUID('4')
	@IsOptional()
	lastId?: string;
}

export class PaginationResultDto<T> {
	@ApiProperty({ description: 'last item id' })
	lastId: string;

	@ApiProperty({ description: 'Pagination result' })
	data: T[];
}
