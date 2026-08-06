import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {

    const result = await adminServices.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully.",
        data: result,
    });

});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {

    const adminId = req.user!.userId;

    const result = await adminServices.updateUserStatus(
        adminId,
        req.params.id as string,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status updated successfully.",
        data: result,
    });

});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {

    const result = await adminServices.getAllProperties();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Properties retrieved successfully.",
        data: result,
    });

});

const getAllRentals = catchAsync(async (req: Request, res: Response) => {

    const result = await adminServices.getAllRentals();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Rental requests retrieved successfully.",
        data: result,
    });

});

export const adminControllers = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
};