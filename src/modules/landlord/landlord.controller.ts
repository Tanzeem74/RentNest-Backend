import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { landlordServices } from "./landlord.service";

const getRentalRequests = catchAsync(
    async (req: Request, res: Response) => {

        const landlordId = req.user?.userId as string;

        const result = await landlordServices.getRentalRequests(landlordId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental requests retrieved successfully",
            data: result,
        });
    }
);
const updateRentalRequestStatus = catchAsync(
    async (req: Request, res: Response) => {

        const landlordId = req.user?.userId as string;

        const requestId = req.params.id as string;

        const result =
            await landlordServices.updateRentalRequestStatus(
                landlordId,
                requestId,
                req.body
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Rental request updated successfully",
            data: result,
        });
    }
);

export const landlordController = {
    getRentalRequests,
    updateRentalRequestStatus,
};