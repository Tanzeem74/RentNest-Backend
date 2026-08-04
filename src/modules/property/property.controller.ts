import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyServices } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId as string;
    const result = await propertyServices.createProperty(
        userId,
        req.body
    );
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property created successfully",
        data: result,
    });
});

export const propertyController = {
    createProperty,
};