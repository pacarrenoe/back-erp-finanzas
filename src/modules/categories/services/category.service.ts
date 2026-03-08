import * as repo from "../repositories/category.repo"

export async function list() {
  return repo.listCategories()
}

export async function create(input: any) {
  return repo.createCategory(input)
}

export async function update(id: string, input: any) {
  return repo.updateCategory(id, input)
}

export async function remove(id: string) {
  return repo.deleteCategory(id)
}