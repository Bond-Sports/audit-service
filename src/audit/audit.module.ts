import { Module } from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { AuditLogDal } from './dal/mongodb/audit-log.dal';
import { ActionTypeDal } from './dal/mongodb/action-type.dal';
import { CategoryDal } from './dal/mongodb/category.dal';
import { SubCategoryDal } from './dal/mongodb/sub-category.dal';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogSchema } from './models/mongodb/audit-log';
import { AuditCategorySchema } from './models/mongodb/category';
import { AuditSubCategorySchema } from './models/mongodb/sub-category';
import { AuditActionTypeSchema } from './models/mongodb/action-type';
import { configService } from '../config/config.service';
import {
	AUDIT_ACTION_TYPES_COLLECTION,
	AUDIT_CATEGORIES_COLLECTION,
	AUDIT_LOGS_COLLECTION,
	AUDIT_SUB_CATEGORIES_COLLECTION,
} from './models/mongodb/constants';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AuditProfile } from './profile/audit.profile';
import { CategoryService } from './services/category.service';
import { SubCategoryService } from './services/sub-category.service';
import { ActionTypeService } from './services/action-type.service';

@Module({
	// Todo - the MongooseModule.forFeature is called multiple times, which can be consolidated into a single call to improve readability and reduce redundancy.
	// Todo - rename the schema to be LogSchema, CategorySchema, SubCategorySchema, ActionTypeSchema to be more descriptive
	// Todo - The MongooseModule.forRoot(configService.getMongoUrl()) tightly couples the module to the configuration service. While this is fine for many cases, you could inject this configuration dynamically, allowing for easier testing and more flexible configurations.
	/*example
	MongooseModule.forRootAsync({
		useFactory: async (configService: ConfigService) => ({
			uri: configService.getMongoUrl(),
		}),
		inject: [ConfigService],
	}),
	*/

	// Todo - *Only if we see it agregate more modules* While the AutomapperModule is well-integrated, you might want to consider separating the automapper configuration into its own module if it's used across multiple modules in your application. This would reduce duplication and improve the maintainability of your mapping configurations.
	imports: [
		MongooseModule.forRoot(configService.getMongoUrl()),
		MongooseModule.forFeature([{ name: AUDIT_LOGS_COLLECTION, schema: AuditLogSchema }]),
		MongooseModule.forFeature([{ name: AUDIT_CATEGORIES_COLLECTION, schema: AuditCategorySchema }]),
		MongooseModule.forFeature([{ name: AUDIT_SUB_CATEGORIES_COLLECTION, schema: AuditSubCategorySchema }]),
		MongooseModule.forFeature([{ name: AUDIT_ACTION_TYPES_COLLECTION, schema: AuditActionTypeSchema }]),
		AutomapperModule.forRoot({
			strategyInitializer: classes(),
		}),
	],
	providers: [
		AuditService,
		AuditLogDal,
		ActionTypeDal,
		CategoryDal,
		SubCategoryDal,
		AuditProfile,
		CategoryService,
		SubCategoryService,
		ActionTypeService,
	],
	exports: [AuditService, CategoryService, SubCategoryService, ActionTypeService],
})
export class AuditModule {}
