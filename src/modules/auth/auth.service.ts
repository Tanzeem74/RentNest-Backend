import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { PasswordUtils } from "../../utils/password";
import { jwtUtils } from "../../utils/jwt";
import { ILoginUser, IJwtPayload } from "./auth.interface";
import { Role, UserStatus } from "../../../prisma/generated/prisma/client";


const registerUser = async (payload: any) => {
    const { email, password, role } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (isUserExists) {
        throw new Error("User already exists");
    }

    if (role === Role.ADMIN) {
        throw new Error("Admin registration is not allowed");
    }

    const hashedPassword = await PasswordUtils.hashPassword(password);

    const user = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword,
        },
    });

    const { password: _, ...result } = user;

    return result;
};

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email,
        },
    });

    if (user.status === UserStatus.BLOCKED) {
        throw new Error("Your account has been blocked.");
    }

    const isPasswordMatch = await PasswordUtils.comparePassword(
        password,
        user.password
    );

    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }

    const jwtPayload: IJwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };


    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions["expiresIn"]
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions["expiresIn"]
    );

    return {
        accessToken,
        refreshToken,
    };
};

const refreshToken = async (token: string) => {
    const verifiedToken = jwtUtils.verifyToken(
        token,
        config.jwt_refresh_secret
    );

    if (!verifiedToken.success) {
        throw new Error(verifiedToken.error);
    }

    const { userId } = verifiedToken.data as IJwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });

    if (user.status === UserStatus.BLOCKED) {
        throw new Error("Your account has been blocked.");
    }

    const jwtPayload: IJwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions["expiresIn"]
    );

    return {
        accessToken,
    };
};

export const AuthServices = {
    registerUser,
    loginUser,
    refreshToken,
};