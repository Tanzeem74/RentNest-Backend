import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../prisma/generated/prisma/client";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { IJwtPayload } from "../modules/auth/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: IJwtPayload;
        }
    }
}

export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token =
                req.cookies.accessToken ||
                (req.headers.authorization?.startsWith("Bearer ")
                    ? req.headers.authorization.split(" ")[1]
                    : undefined);

            if (!token) {
                throw new Error("You are not logged in.");
            }

            const verifiedToken = jwtUtils.verifyToken(
                token,
                config.jwt_access_secret
            );

            if (!verifiedToken.success) {
                throw new Error(verifiedToken.error);
            }

            const { userId, email, role } = verifiedToken.data as IJwtPayload;

            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });

            if (!user) {
                throw new Error("User not found.");
            }

            if (user.status === UserStatus.BLOCKED) {
                throw new Error(
                    "Your account has been blocked. Please contact support."
                );
            }

            if (
                requiredRoles.length > 0 &&
                !requiredRoles.includes(user.role)
            ) {
                throw new Error(
                    "You are not authorized to access this resource."
                );
            }

            req.user = {
                userId,
                email,
                role,
            };

            next();
        }
    );
};