import { ObjectId } from 'mongoose';

export interface TPaginationResult<T> {
	data: T[];
}

export interface IDal<T> {
	paginatedFind<TPagination extends { itemsPerPage: number }>(
		organizationId: number,
		pagination: TPagination
	): Promise<TPaginationResult<T>>;
	find(organizationId: number): Promise<T[]>;
	findById(organizationId: number, id: string): Promise<T>;
	create(organizationId: number, data: T): Promise<T>;
	update(organizationId: number, id: string, data: Partial<T>): Promise<T>;
	delete(organizationId: number, id: string): Promise<boolean>;
	deleteBy?<K extends keyof T>(
		organizationId: number,
		condition: Record<K, T[K] extends ObjectId ? string : T[K]>
	): Promise<boolean>;
}

export interface IFindByNameDal<T extends { name: string }> {
	findOneByName(organizationId: number, name: string): Promise<T>;
}
