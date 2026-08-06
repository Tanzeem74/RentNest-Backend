import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes } from "./modules/property/property.route";
import { rentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(
    "/api/payments/confirm",
    express.raw({ type: "application/json" })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', async (req: Request, res: Response) => {
    res.send('Welcome to the RentNest API');
})

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/properties', propertyRoutes);
app.use("/api/rentals", rentalRequestRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews",reviewRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;