import { CustomFields, LanguageCode } from "@vendure/core";
import { Category } from "../../../../plugins/category/entities/category.entity";
import { Label } from "../../../../plugins/label/entities/label.entity";
import { DeliveryMethod } from "../../../../plugins/delivery/entities/delivery-method.entity";

export const customFields: CustomFields = {
  Promotion: [
    {
      name: "internalPromoCode",
      type: "string",
      nullable: true,
      label: [{ languageCode: "en" as any, value: "Internal promo code" }],
      ui: { tab: "Discount settings" },
    },
    {
      name: "collectionType",
      type: "string",
      nullable: true,
      defaultValue: "custom",
      options: [
        {
          value: "custom",
          label: [
            { languageCode: "en" as any, value: "Custom (specific variants)" },
          ],
        },
        {
          value: "order",
          label: [{ languageCode: "en" as any, value: "Order (whole order)" }],
        },
        {
          value: "no_collection",
          label: [{ languageCode: "en" as any, value: "No collection" }],
        },
      ],
      label: [{ languageCode: "en" as any, value: "Collection type" }],
      ui: { tab: "Discount settings", component: "select-form-input" },
    },
  ],
  Channel: [
    {
      name: "dayLimit",
      type: "int",
      defaultValue: 2,
      validate: (value) => {
        if (![1, 2, 3].includes(value)) {
          return "Day limit must be 1, 2 or 3";
        }
      },
      label: [
        { languageCode: LanguageCode.en, value: "Day limit" },
        { languageCode: LanguageCode.tk, value: "Gun limidi" },
        { languageCode: LanguageCode.ru, value: "Dnewnoy limit" },
      ], // turn into ru
    },
  ],
  Order: [
    {
      name: "deliveryMethod",
      type: "relation",
      entity: DeliveryMethod,
      nullable: true,
      eager: true,
      public: true,
      label: [{ languageCode: LanguageCode.en, value: "Delivery Method" }],
      ui: { component: "delivery-method-picker" },
    },
    {
      name: "assignedCourierId",
      type: "string", // Using string to store ID manually for simplicity in this migration context, or could be relation
      nullable: true,
      public: true,
      label: [{ languageCode: LanguageCode.en, value: "Assigned Courier ID" }],
      ui: { component: "courier-selector" },
    },
    {
      name: "__fix_relational_custom_fields__",
      type: "boolean",
      public: false,
      internal: true,
      nullable: true,
    },
  ],
  Customer: [
    {
      name: "gender",
      type: "string",
      options: [{ value: "male" }, { value: "female" }],
      nullable: true,
    },
    {
      name: "region",
      type: "string",
      nullable: true,
    },
    {
      name: "birthDate",
      type: "string",
      nullable: true,
      public: true,
      label: [{ languageCode: LanguageCode.en, value: "Birth Date" }],
    },
    {
      name: "password",
      type: "string",
      nullable: true,
      label: [
        { languageCode: LanguageCode.en, value: "Password" },
        { languageCode: LanguageCode.tk, value: "Parol" },
        { languageCode: LanguageCode.ru, value: "Parol" },
      ],
      ui: { component: "admin-password-form-input" },
    },
  ],
  Product: [
    {
      name: "categories",
      type: "relation",
      entity: Category,
      list: true,
      public: true,
      label: [{ languageCode: LanguageCode.en, value: "Select a category" }],
      ui: { component: "category-picker" },
    },
    {
      name: "labels",
      type: "relation",
      entity: Label,
      list: true,
      public: true,
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Select a label for a product",
        },
        { languageCode: LanguageCode.tk, value: "harydyn etiketkasyny saylan" },
      ],
      ui: { component: "label-picker" },
    },

    {
      name: "isRecommended",
      type: "boolean",
      public: true,
      defaultValue: false,
      label: [{ languageCode: LanguageCode.en, value: "Recommended" }],
    },
    {
      name: "categoriesIds",
      type: "string",
      list: true,
      internal: true,
    },
    {
      name: "labelsIds",
      type: "string",
      list: true,
      internal: true,
    },
  ],
  ProductVariant: [
    {
      name: "__fix_relational_custom_fields__",
      type: "boolean",
      public: false,
      internal: true,
      nullable: true,
    },
  ],
  Facet: [
    {
      name: "categories",
      type: "relation",
      entity: Category,
      list: true,
      nullable: true,
      public: true,
      internal: true,
      label: [
        { languageCode: LanguageCode.en, value: "Categories (Structural Fix)" },
      ],
    },
    {
      name: "__fix_relational_custom_fields__",
      type: "boolean",
      public: false,
      internal: true,
      nullable: true,
    },
  ],
  FacetValue: [
    {
      name: "categories",
      type: "relation",
      entity: Category,
      list: true,
      nullable: true,
      public: true,
      label: [{ languageCode: LanguageCode.en, value: "Select a category" }],
      ui: { component: "category-picker" },
    },
    {
      name: "__fix_relational_custom_fields__",
      type: "boolean",
      public: false,
      internal: true,
      nullable: true,
    },
  ],
  Address: [
    {
      name: "type",
      type: "string",
      options: [{ value: "home" }, { value: "office" }, { value: "others" }],
      public: true,
      defaultValue: "home",
      nullable: false,
    },
    {
      name: "homeType",
      type: "string",
      options: [{ value: "etaz" }, { value: "howly" }],
      public: true,
      defaultValue: "etaz",
      nullable: false,
    },
    {
      name: "building",
      type: "string",
      public: true,
      nullable: true,
    },
    {
      name: "floor",
      type: "string",
      public: true,
      nullable: true,
    },
    {
      name: "house",
      type: "string",
      public: true,
      nullable: true,
    },
    {
      name: "latitude",
      type: "float",
      nullable: true,
    },
    {
      name: "longitude",
      type: "float",
      nullable: true,
    },
  ],
};

declare module "@vendure/core" {
  interface CustomCustomerFields {
    gender?: "male" | "female";
    latitude?: number;
    longitude?: number;
    region?: string;
    birthDate?: string;
    password?: string;
  }
  interface CustomProductFields {
    categories: Category[];
    labels?: Label[];
    isRecommended?: boolean;
    categoriesIds?: string[];
    labelsIds?: string[];
  }
  interface CustomProductVariantFields {
    __fix_relational_custom_fields__?: boolean;
  }
  interface CustomOrderFields {
    deliveryMethod?: DeliveryMethod;
  }
  interface CustomPromotionFields {
    internalPromoCode?: string;
    collectionType?: "custom" | "order" | "no_collection";
  }
  interface CustomFacetFields {
    categories?: Category[];
    __fix_relational_custom_fields__?: boolean;
  }
  interface CustomFacetValueFields {
    categories?: Category[];
  }
  interface CustomAddressFields {
    type: "home" | "office" | "others";
    homeType: "etaz" | "howly";
    building?: string;
    floor?: string;
    house?: string;
  }
}
