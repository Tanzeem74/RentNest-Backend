import {PropertyStatus,PropertyType} from "../../../prisma/generated/prisma/client";

export interface IProperty {
    title: string;
    description: string;
    location: string;
    rentAmount: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: PropertyType;
    status?: PropertyStatus;
    images: string[];
    amenities: string[];
    categoryId: string;
}