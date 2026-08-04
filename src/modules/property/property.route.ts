import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma/client";
import { auth } from "../../middlewares/auth";
import { propertyController } from "./property.controller";

const router = Router();

router.post(
  "/",
  auth(Role.LANDLORD),
  propertyController.createProperty
);

export const propertyRoutes = router;