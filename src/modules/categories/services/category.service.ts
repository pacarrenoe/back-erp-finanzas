import * as repo from "../repositories/category.repo";
import { CreateCategoryInput } from "../dtos/category.schema";

export async function list(filter?: { kind?: string; active?: boolean }) {
  return repo.listCategories(filter);
}

export async function create(input: CreateCategoryInput) {
  return repo.createCategory(input);
}

export async function getById(id: string) {
  return repo.getCategoryById(id);
}

export async function update(id: string, data: Partial<CreateCategoryInput>) {
  return repo.updateCategory(id, data);
}

export async function remove(id: string) {
  return repo.deleteCategory(id);
}