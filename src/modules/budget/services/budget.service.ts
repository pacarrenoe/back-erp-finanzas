import * as repo from "../repositories/budget.repo";

export async function create(data: any) {
  return repo.createRule(data);
}

export async function getAll() {
  return repo.getActiveRules();
}