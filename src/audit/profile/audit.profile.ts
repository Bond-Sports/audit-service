import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AuditLog } from '../models/mongodb/audit-log';
import { AuditLogDto } from '../types/dto/audit.dto';

@Injectable()
export class AuditProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	get profile(): MappingProfile {
		return (mapper: Mapper) => {
			createMap(
				mapper,
				AuditLog,
				AuditLogDto,
				forMember(
					log => log.id,
					mapFrom(log => String(log._id))
				),
				forMember(
					log => log.categoryId,
					mapFrom(log => (log.category?._id ? String(log.category?._id) : null))
				),
				forMember(
					log => log.subCategoryId,
					mapFrom(log => (log.subCategory?._id ? String(log.subCategory?._id) : null))
				),
				forMember(
					log => log.actionTypeId,
					mapFrom(log => (log.actionType?._id ? String(log.actionType?._id) : null))
				),
				forMember(
					log => log.response,
					mapFrom(log => log.response)
				),
				forMember(
					log => log.changes,
					mapFrom(log => log.changes)
				)
			);
			createMap(mapper, AuditLogDto, AuditLog);
		};
	}
}
