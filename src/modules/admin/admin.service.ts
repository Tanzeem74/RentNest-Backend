import { UserStatus } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {

    const result = await prisma.user.findMany({
        include: {
            properties: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};
const updateUserStatus = async (
    adminId: string,
    userId: string,
    payload: {
        status: UserStatus;
    }
) => {
    if (adminId === userId) {
        throw new Error("You cannot update your own account.");
    }

    if (
        payload.status !== UserStatus.ACTIVE &&
        payload.status !== UserStatus.BLOCKED
    ) {
        throw new Error("Invalid user status.");
    }

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            status: payload.status,
        },
    });

    return result;
};
const getAllProperties = async () => {

    const result = await prisma.property.findMany({
        include: {
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};
const getAllRentals = async () => {

    const result = await prisma.rentalRequest.findMany({
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            property: {
                include: {
                    category: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};
export const adminServices = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
};