import { RentalRequestStatus } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getRentalRequests = async (landlordId: string) => {
    const result = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId,
            },
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
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

const updateRentalRequestStatus = async (
    landlordId: string,
    requestId: string,
    payload: {
        status: RentalRequestStatus;
    }
) => {
    if (
        payload.status !== RentalRequestStatus.APPROVED &&
        payload.status !== RentalRequestStatus.REJECTED
    ) {
        throw new Error("Invalid status.");
    }
    const rentalRequest = await prisma.rentalRequest.findFirstOrThrow({
        where: {
            id: requestId,
            property: {
                landlordId,
            },
        },
        include: {
            property: true,
        },
    });
    if (rentalRequest.status !== RentalRequestStatus.PENDING) {
        throw new Error("This rental request has already been processed.");
    }
    const result = await prisma.$transaction(async (tx) => {

        const updatedRequest = await tx.rentalRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: payload.status,
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePhoto: true,
                    },
                },
                property: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (payload.status === RentalRequestStatus.APPROVED) {
            await tx.rentalRequest.updateMany({
                where: {
                    propertyId: rentalRequest.propertyId,
                    id: {
                        not: requestId,
                    },
                    status: RentalRequestStatus.PENDING,
                },
                data: {
                    status: RentalRequestStatus.REJECTED,
                },
            });
        }

        return updatedRequest;
    });

    return result;
};

export const landlordServices = {
    getRentalRequests,
    updateRentalRequestStatus,
};