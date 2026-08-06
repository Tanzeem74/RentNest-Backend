import { Router } from "express";
import { reviewControllers } from "./review.controller";
import { Role } from "../../../prisma/generated/prisma/client";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post(
    "/",
    auth(Role.TENANT),
    reviewControllers.createReview
);
router.get(
    "/my",
    auth(Role.TENANT),
    reviewControllers.getMyReviews
);
router.get(
    "/property/:propertyId",
    reviewControllers.getPropertyReviews
);

export const reviewRoutes = router;