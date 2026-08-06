import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user!.userId;

    const result = await reviewServices.createReview(
        tenantId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully.",
        data: result,
    });

});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user!.userId;

    const result = await reviewServices.getMyReviews(
        tenantId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My reviews retrieved successfully.",
        data: result,
    });

});

const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {

    const result = await reviewServices.getPropertyReviews(
        req.params.propertyId as string
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Property reviews retrieved successfully.",
        data: result,
    });

});

export const reviewControllers = {
    createReview,
    getMyReviews,
    getPropertyReviews,
};