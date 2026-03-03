import * as repo from "../repositories/recurring.repo";

export async function create(input: any) {
  return repo.createRecurring(input);
}

export async function list() {
  return repo.listRecurring();
}