export const en = {
	audit: {
		errors: {
			categoryNotFound: (categoryId: string) => `Category with id ${categoryId} not found`,
			subCategoryNotFound: (subCategoryId: string) => `SubCategory with id ${subCategoryId} not found`,
			actionTypeNotFound: (actionTypeId: string) => `ActionType with id ${actionTypeId} not found`,
			documentNotOfOrganization: (entityType: string, documentId: string, organizationId: number) =>
				`${entityType} with id "${documentId}" does not belong to organization with id "${organizationId}"`,
		},
	},
	categories: {
		errors: {
			categoryAlreadyExists: (organizationId: number, name: string) =>
				`Category with name "${name}" already exists for organization "${organizationId}"`,
		},
	},
	subCategories: {
		errors: {
			subCategoryAlreadyExists: (organizationId: number, name: string) =>
				`SubCategory with name "${name}" already exists for organization "${organizationId}"`,
		},
	},
	actionTypes: {
		errors: {
			actionTypeAlreadyExists: (organizationId: number, name: string) =>
				`ActionType with name "${name}" already exists for organization "${organizationId}"`,
		},
	},
};
