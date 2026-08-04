import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { rentalRequestControllers } from "./rentalRequest.controller";
import { Role } from "../../../prisma/generated/prisma/client";

const router = Router();

router.post(
    "/",
    auth(Role.TENANT),
    rentalRequestControllers.createRentalRequest
);
router.get(
    "/",
    auth(Role.TENANT),
    rentalRequestControllers.getMyRentalRequests
);
router.get(
    "/:id",
    auth(Role.TENANT),
    rentalRequestControllers.getSingleRentalRequest
);

export const rentalRequestRoutes = router;