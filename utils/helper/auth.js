import { hash, compare } from "bcryptjs";
import { signIn } from "next-auth/react";

export async function hashPassword(password) {
  const hashPassword = await hash(password, 12);

  return hashPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValied = await compare(password, hashedPassword);

  return isValied;
}

export async function loginFunc(credentials) {
  const result = await signIn("credentials", {
    redirect: false,
    email: credentials.email,
    password: credentials.password,
  });

  return result;
}
