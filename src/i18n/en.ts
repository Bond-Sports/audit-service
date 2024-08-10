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
};
