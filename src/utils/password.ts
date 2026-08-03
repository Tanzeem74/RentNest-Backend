import bcrypt from "bcrypt";
import config from "../config";

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, config.bcrypt_salt_rounds as string | number);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const PasswordUtils = {
  hashPassword,
  comparePassword,
};