import { prisma } from "../../lib/prisma";

const createCategory = async (payload: { name: string }) => {
    const isCategoryExists = await prisma.category.findUnique({
        where: {
            name: payload.name,
        },
    });
    if (isCategoryExists) {
        throw new Error("Category already exists");
    }
    const result = await prisma.category.create({
        data: payload,
    });
    return result;
};
const getAllCategories = async () => {
    const result = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
};

const getSingleCategory = async (id: string) => {
    const result = await prisma.category.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return result;
};

const updateCategory = async (
    id: string,
    payload: {
        name?: string;
    }
) => {
    await prisma.category.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (payload.name) {
        const isCategoryExists = await prisma.category.findFirst({
            where: {
                name: payload.name,
                NOT: {
                    id,
                },
            },
        });

        if (isCategoryExists) {
            throw new Error("Category already exists");
        }
    }

    const result = await prisma.category.update({
        where: {
            id,
        },
        data: payload,
    });

    return result;
};
const deleteCategory = async (id: string) => {
    await prisma.category.findUniqueOrThrow({
        where: {
            id,
        },
    });

    const result = await prisma.category.delete({
        where: {
            id,
        },
    });
    return result;
};

export const categoryServices = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};