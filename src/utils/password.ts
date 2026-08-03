import bcrypt from "bcrypt";
import config from "../config";


const hashPassword = async (password: string) => {
  return bcrypt.hash(password, config.bcrypt_salt_rounds);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export const PasswordUtils = {
  hashPassword,
  comparePassword,
};