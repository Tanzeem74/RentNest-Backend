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
const getDashboardStatistics = async () => {

    const totalUsers = await prisma.user.count();

    const totalLandlords = await prisma.user.count({
        where: {
            role: "LANDLORD",
        },
    });

    const totalTenants = await prisma.user.count({
        where: {
            role: "TENANT",
        },
    });

    const totalProperties = await prisma.property.count();

    const availableProperties = await prisma.property.count({
        where: {
            status: "AVAILABLE",
        },
    });

    const rentedProperties = await prisma.property.count({
        where: {
            status: "RENTED",
        },
    });

    const totalRentalRequests = await prisma.rentalRequest.count();

    const pendingRequests = await prisma.rentalRequest.count({
        where: {
            status: "PENDING",
        },
    });

    const approvedRequests = await prisma.rentalRequest.count({
        where: {
            status: "APPROVED",
        },
    });

    const activeRentals = await prisma.rentalRequest.count({
        where: {
            status: "ACTIVE",
        },
    });

    const completedPayments = await prisma.payment.count({
        where: {
            status: "COMPLETED",
        },
    });

    const revenue = await prisma.payment.aggregate({
        where: {
            status: "COMPLETED",
        },
        _sum: {
            amount: true,
        },
    });

    return {
        totalUsers,
        totalLandlords,
        totalTenants,
        totalProperties,
        availableProperties,
        rentedProperties,
        totalRentalRequests,
        pendingRequests,
        approvedRequests,
        activeRentals,
        completedPayments,
        totalRevenue: revenue._sum.amount ?? 0,
    };
};

export const adminServices = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
    getDashboardStatistics
};