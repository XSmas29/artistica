type pagination = {
  limit: number,
  page: number,
}

type sort = {
  field: string,
  sort: string,
}

type filterProducts = {
  category_ids: number[],
  material_ids: number[],
  price_max: number | null,
  price_min: number | null,
  search: string | null,
}

enum transactionStatus {
  PENDING = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
}

export {
	pagination,
	sort,
	filterProducts,
	transactionStatus,
}