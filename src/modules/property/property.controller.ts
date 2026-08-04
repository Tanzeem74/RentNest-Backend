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
const getAllProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await propertyServices.getAllProperties(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties retrieved successfully",
        data: result,
    });
});
const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result = await propertyServices.getSingleProperty(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property retrieved successfully",
        data: result,
    });
});
const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const propertyId = req.params.id as string;
    const userId = req.user?.userId as string;
    const result = await propertyServices.updateProperty(
        propertyId,
        userId,
        req.body
    );
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property updated successfully",
        data: result,
    });
});
const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const propertyId = req.params.id as string;
    const userId = req.user?.userId as string;

    await propertyServices.deleteProperty(propertyId, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property deleted successfully",
        data: null,
    });
});

export const propertyController = {
    createProperty,
    getAllProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty
};