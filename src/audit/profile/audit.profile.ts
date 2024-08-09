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
					mapFrom(log => String(log.id))
				),
				forMember(
					log => log.categoryId,
					mapFrom(log => String(log.category?.id))
				),
				forMember(
					log => log.subCategoryId,
					mapFrom(log => String(log.subCategory?.id))
				),
				forMember(
					log => log.actionTypeId,
					mapFrom(log => String(log.actionType?.id))
				)
			);
			createMap(mapper, AuditLogDto, AuditLog);
		};
	}
}
