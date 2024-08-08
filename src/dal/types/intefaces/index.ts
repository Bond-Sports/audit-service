import { IBaseAudit } from '../../../types/interfaces';
import { PaginationQueryDto, PaginationResultDto } from '../../../types/dtos/general.dto';

export interface IDal<T extends IBaseAudit> {
	paginatedFind(organizationId: number, pagination: PaginationQueryDto): Promise<PaginationResultDto<T>>;
	find(organizationId: number): Promise<T[]>;
	findById(id: string): Promise<T>;
	create(data: T): Promise<T>;
	update(id: string, data: Partial<T>): Promise<T>;
	delete(id: string): Promise<boolean>;
}
