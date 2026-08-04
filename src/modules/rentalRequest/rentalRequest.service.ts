import { PropertyStatus } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rentalRequest.interface";

const createRentalRequest = async (
    tenantId: string,
    payload: IRentalRequest
) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: payload.propertyId,
        },
    });
    if (property.status !== PropertyStatus.AVAILABLE) {
        throw new Error("Property is not available.");
    }
    const isExists = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId,
        },
    });

    if (isExists) {
        throw new Error("Rental request already exists.");
    }
    const result = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId: payload.propertyId,
            requestedMoveInDate: new Date(payload.requestedMoveInDate),
        },
        include: {
            property: true,
            tenant: {
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
const getMyRentalRequests = async (tenantId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            tenantId,
        },
        include: {
            property: {
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
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};
const getSingleRentalRequest = async (
    tenantId: string,
    id: string
) => {
    const result = await prisma.rentalRequest.findFirstOrThrow({
        where: {
            id,
            tenantId,
        },
        include: {
            property: {
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
            },
        },
    });

    return result;
};

export const rentalRequestServices = {
    createRentalRequest,
    getMyRentalRequests,
    getSingleRentalRequest,
};