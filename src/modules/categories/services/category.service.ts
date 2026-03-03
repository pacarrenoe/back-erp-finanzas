import * as repo from "../repositories/category.repo";
import { CreateCategoryInput } from "../dtos/category.schema";

export async function list(filter?: { kind?: string; active?: boolean }) {
  return repo.listCategories(filter);
}

export async function create(input: CreateCategoryInput) {
  return repo.createCategory(input);
}