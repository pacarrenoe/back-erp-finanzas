import * as repo from "../repositories/recurring.repo";

export async function create(input: any) {

  return repo.createRecurring(input);

}

export async function list() {

  return repo.listRecurring();

}

export async function update(id: string, input: any) {

  return repo.updateRecurring(id, input);

}

export async function toggleActive(id: string) {

  return repo.toggleRecurring(id);

}

export async function remove(id: string) {

  return repo.deleteRecurring(id);

}