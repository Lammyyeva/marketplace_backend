export interface CategoryDiscountEntry {
  categoryId: string;
  categoryName?: string;
  discount: number;
}

export interface FacetDiscountEntry {
  facetValueId: string;
  facetValueName?: string;
  discount: number;
}

export interface VariantDiscountEntry {
  variantId: string;
  variantName?: string;
  variantSku?: string;
  discount: number;
  maxQtyPerOrder: number;
  totalUnitsLimit: number;
}
