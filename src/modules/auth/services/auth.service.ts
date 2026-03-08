import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as repo from "../repositories/auth.repo";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function register(
  email: string,
  password: string,
  name: string,
  phone?: string
) {

  const existing = await repo.findByEmail(email);

  if (existing) {
    throw new Error("El email ya está registrado");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await repo.createUser(
    email,
    hash,
    name,
    phone
  );

  return user;

}

export async function login(
  email: string,
  password: string
) {

  const user = await repo.findByEmail(email);

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const valid = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!valid) {
    throw new Error("Credenciales inválidas");
  }

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {

    token,

    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone
    }

  };

}