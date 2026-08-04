import { prisma } from "../../lib/prisma";
import { IProperty } from "./property.interface";

const createProperty = async (
    userId: string,
    payload: IProperty
) => {
    const landlord = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
    await prisma.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId,
        },
    });

    const result = await prisma.property.create({
        data: {
            ...payload,
            landlordId: landlord.id,
        },
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};
const getAllProperties = async (query: any) => {
    const {
        search,
        categoryId,
        propertyType,
        status,
        minRent,
        maxRent,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const where: any = {};

    // Search
    if (search) {
        where.OR = [
            {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                location: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }

    // Category Filter
    if (categoryId) {
        where.categoryId = categoryId;
    }

    // Property Type Filter
    if (propertyType) {
        where.propertyType = propertyType;
    }

    // Status Filter
    if (status) {
        where.status = status;
    }

    // Rent Range Filter
    if (minRent || maxRent) {
        where.rentAmount = {};

        if (minRent) {
            where.rentAmount.gte = Number(minRent);
        }

        if (maxRent) {
            where.rentAmount.lte = Number(maxRent);
        }
    }

    const total = await prisma.property.count({
        where,
    });

    const result = await prisma.property.findMany({
        where,
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: perPage,
    });

    return {
        meta: {
            page: currentPage,
            limit: perPage,
            total,
            totalPage: Math.ceil(total / perPage),
        },
        data: result,
    };
};
const getSingleProperty = async (id: string) => {
    const result = await prisma.property.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
        },
    });

    return result;
};
const updateProperty = async (propertyId: string, userId: string, payload: Partial<IProperty>
) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    if (property.landlordId !== userId) {
        throw new Error("You are not authorized to update this property.");
    }

    if (payload.categoryId) {
        await prisma.category.findUniqueOrThrow({
            where: {
                id: payload.categoryId,
            },
        });
    }

    const result = await prisma.property.update({
        where: {
            id: propertyId,
        },
        data: payload,
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                },
            },
        },
    });
    return result;
};

const deleteProperty = async (propertyId: string, userId: string) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    if (property.landlordId !== userId) {
        throw new Error("You are not authorized to delete this property.");
    }

    const result = await prisma.property.delete({
        where: {
            id: propertyId,
        },
    });

    return result;
};

export const propertyServices = {
    createProperty,
    getAllProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty
};