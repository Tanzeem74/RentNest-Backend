import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/client";
import { adminControllers } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get(
    "/users",
    auth(Role.ADMIN),
    adminControllers.getAllUsers
);

router.patch(
    "/users/:id",
    auth(Role.ADMIN),
    adminControllers.updateUserStatus
);

router.get(
    "/properties",
    auth(Role.ADMIN),
    adminControllers.getAllProperties
);

router.get(
    "/rentals",
    auth(Role.ADMIN),
    adminControllers.getAllRentals
);

export const adminRoutes = router;