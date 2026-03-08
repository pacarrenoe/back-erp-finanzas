import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as repo from "../repositories/auth.repo";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function register(email: string, password: string) {
  const existing = await repo.findByEmail(email);
  if (existing) throw new Error("Email ya registrado");

  const hash = await bcrypt.hash(password, 10);
  return repo.createUser(email, hash);
}

export async function login(email: string, password: string) {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("Credenciales inválidas");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Credenciales inválidas");

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function getUserById(id: string) {
  return repo.findById(id);
}