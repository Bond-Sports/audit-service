import { PaginationQuery, PaginationResultDto } from '@bondsports/types';

export interface IDal<T> {
	paginatedFind(organizationId: number, pagination: PaginationQuery): Promise<PaginationResultDto<T>>;
	find(organizationId: number): Promise<T[]>;
	findById(organizationId: number, id: string): Promise<T>;
	create(organizationId: number, data: T): Promise<T>;
	update(organizationId: number, id: string, data: Partial<T>): Promise<T>;
	delete(organizationId: number, id: string): Promise<boolean>;
}
