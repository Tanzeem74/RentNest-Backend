import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalRequestServices } from "./rentalRequest.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user?.userId as string;

    const result = await rentalRequestServices.createRentalRequest(
        tenantId,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental request submitted successfully",
        data: result,
    });
});
const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user?.userId as string;

    const result = await rentalRequestServices.getMyRentalRequests(tenantId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests retrieved successfully",
        data: result,
    });
});
const getSingleRentalRequest = catchAsync(
    async (req: Request, res: Response) => {

        const tenantId = req.user?.userId as string;
        const id = req.params.id as string;

        const result =
            await rentalRequestServices.getSingleRentalRequest(
                tenantId,
                id
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental request retrieved successfully",
            data: result,
        });
    }
);

export const rentalRequestControllers = {
    createRentalRequest,
    getMyRentalRequests,
    getSingleRentalRequest,
};