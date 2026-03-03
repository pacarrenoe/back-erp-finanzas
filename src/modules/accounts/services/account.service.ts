import { CreateAccountInput, UpdateAccountInput } from "../dtos/account.schema";
import * as repo from "../repositories/account.repo";

function validateBusinessRules(input: CreateAccountInput | UpdateAccountInput) {
  // Si es CREDIT_CARD, sugerimos que tenga last4, billing_day y due_day
  if (input.type === "CREDIT_CARD") {
    if (input.last4 && !/^\d{4}$/.test(input.last4)) {
      throw new Error("last4 debe ser 4 dígitos");
    }
  }
}

export async function list() {
  return repo.listAccounts();
}

export async function getById(id: string) {
  return repo.getAccountById(id);
}

export async function create(input: CreateAccountInput) {
  validateBusinessRules(input);
  return repo.createAccount(input);
}

export async function update(id: string, input: UpdateAccountInput) {
  validateBusinessRules(input);
  return repo.updateAccount(id, input);
}

export async function remove(id: string) {
  return repo.deleteAccount(id);
}