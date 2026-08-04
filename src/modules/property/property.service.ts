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

export const propertyServices = {
    createProperty,
};