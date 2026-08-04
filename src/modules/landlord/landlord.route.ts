import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { landlordController } from "./landlord.controller";
import { propertyController } from "../property/property.controller";

const router = Router();

router.post(
    "/properties",
    auth(Role.LANDLORD),
    propertyController.createProperty
);

router.patch(
    "/properties/:id",
    auth(Role.LANDLORD),
    propertyController.updateProperty
);

router.delete(
    "/properties/:id",
    auth(Role.LANDLORD),
    propertyController.deleteProperty
);


router.get(
    "/requests",
    auth(Role.LANDLORD),
    landlordController.getRentalRequests
);

router.patch(
    "/requests/:id",
    auth(Role.LANDLORD),
    landlordController.updateRentalRequestStatus
);

export const landlordRoutes = router;