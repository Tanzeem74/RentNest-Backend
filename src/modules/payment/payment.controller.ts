import httpStatus from "http-status";
import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { paymentServices } from "./payment.service";
import { verifyWebhook } from "./payment.utils";

const createPayment = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user!.userId;

    const result = await paymentServices.createPayment(
        tenantId,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout session created successfully",
        data: result,
    });

});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {

    const signature = req.headers["stripe-signature"] as string;

    const event = verifyWebhook(
        req.body as Buffer,
        signature
    );

    await paymentServices.confirmPayment(event);

    res.status(200).json({
        received: true,
    });

});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user!.userId;

    const result = await paymentServices.getMyPayments(
        tenantId
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payments retrieved successfully",
        data: result,
    });

});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {

    const tenantId = req.user!.userId;

    const result = await paymentServices.getSinglePayment(
        tenantId,
        req.params.id as string
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment retrieved successfully",
        data: result,
    });

});

export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPayments,
    getSinglePayment,
};