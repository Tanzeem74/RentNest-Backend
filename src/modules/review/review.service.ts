import { RentalRequestStatus } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";

const createReview = async (tenantId: string, payload: ICreateReview) => {
    const { propertyId, rating, comment } = payload;
    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }
    const rentalRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
            status: RentalRequestStatus.ACTIVE,
        },
    });

    if (!rentalRequest) {
        throw new Error("You have not rented this property.");
    }
    const existingReview = await prisma.review.findFirst({
        where: {
            tenantId,
            propertyId,
        },
    });

    if (existingReview) {
        throw new Error("You already reviewed this property.");
    }

    const result = await prisma.review.create({
        data: {
            tenantId,
            propertyId,
            rating,
            comment,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    profilePhoto: true,
                },
            },
            property: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });

    return result;
};

const getPropertyReviews = async (propertyId: string) => {

    const result = await prisma.review.findMany({
        where: {
            propertyId,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    profilePhoto: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

const getMyReviews = async (tenantId: string) => {

    const result = await prisma.review.findMany({
        where: {
            tenantId,
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    location: true,
                    rentAmount: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

export const reviewServices = {
    createReview,
    getPropertyReviews,
    getMyReviews,
};