import crypto from "crypto";
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

import {
    PaymentProvider,
    PaymentStatus,
    PropertyStatus,
    RentalRequestStatus,
} from "../../../prisma/generated/prisma/client";

const createPayment = async (
    tenantId: string,
    payload: {
        rentalRequestId: string;
        provider: PaymentProvider;
    }
) => {
    const rentalRequest = await prisma.rentalRequest.findFirstOrThrow({
        where: {
            id: payload.rentalRequestId,
            tenantId,
        },
        include: {
            tenant: true,
            property: true,
        },
    });
    let payment = await prisma.payment.findUnique({
        where: {
            rentalRequestId: rentalRequest.id,
        },
    });
    if (payment?.status === PaymentStatus.COMPLETED) {
        throw new Error("Payment already completed.");
    }
    if (rentalRequest.status !== RentalRequestStatus.APPROVED) {
        throw new Error("Rental request is not approved.");
    }
    if (!payment) {
        payment = await prisma.payment.create({
            data: {
                transactionId: crypto.randomUUID(),
                rentalRequestId: rentalRequest.id,
                amount: rentalRequest.property.rentAmount,
                provider: payload.provider,
                status: PaymentStatus.PENDING,
            },
        });
    }
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],

        customer_email: rentalRequest.tenant.email,

        success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.client_url}/payment/cancel`,

        metadata: {
            paymentId: payment.id,
            rentalRequestId: rentalRequest.id,
        },

        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount:
                        Number(rentalRequest.property.rentAmount) * 100,

                    product_data: {
                        name: rentalRequest.property.title,
                        description:
                            rentalRequest.property.description ??
                            "Property Rent",
                    },
                },
            },
        ],
    });

    return {
        checkoutUrl: session.url,
    };
};
const confirmPayment = async (event: Stripe.Event) => {

    if (event.type !== "checkout.session.completed") {
        return;
    }

    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = session.metadata?.paymentId;

    if (!paymentId) {
        throw new Error("Payment ID not found.");
    }

    const payment = await prisma.payment.findUniqueOrThrow({
        where: {
            id: paymentId,
        },
        include: {
            rentalRequest: {
                include: {
                    property: true,
                },
            },
        },
    });

    if (payment.status === PaymentStatus.COMPLETED) {
        return payment;
    }

    await prisma.$transaction(async (tx) => {

        await tx.payment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: PaymentStatus.COMPLETED,
                paidAt: new Date(),
                transactionId:
                    typeof session.payment_intent === "string"
                        ? session.payment_intent
                        : payment.transactionId,
            },
        });

        await tx.rentalRequest.update({
            where: {
                id: payment.rentalRequestId,
            },
            data: {
                status: RentalRequestStatus.ACTIVE,
            },
        });

        await tx.property.update({
            where: {
                id: payment.rentalRequest.property.id,
            },
            data: {
                status: PropertyStatus.RENTED,
            },
        });

        await tx.rentalRequest.updateMany({
            where: {
                propertyId: payment.rentalRequest.propertyId,
                id: {
                    not: payment.rentalRequestId,
                },
                status: RentalRequestStatus.APPROVED,
            },
            data: {
                status: RentalRequestStatus.REJECTED,
            },
        });

    });

    return {
        success: true,
        message: "Payment confirmed successfully.",
    };
};

const getMyPayments = async (tenantId: string) => {

    const result = await prisma.payment.findMany({
        where: {
            rentalRequest: {
                tenantId,
            },
        },
        include: {
            rentalRequest: {
                include: {
                    property: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

const getSinglePayment = async (
    tenantId: string,
    paymentId: string
) => {

    const result = await prisma.payment.findFirstOrThrow({
        where: {
            id: paymentId,
            rentalRequest: {
                tenantId,
            },
        },
        include: {
            rentalRequest: {
                include: {
                    property: {
                        include: {
                            category: true,
                        },
                    },
                },
            },
        },
    });

    return result;
};

export const paymentServices = {
    createPayment,
    confirmPayment,
    getMyPayments,
    getSinglePayment,
};