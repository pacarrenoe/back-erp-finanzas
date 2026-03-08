import * as repo from "../repositories/budget.repo";

type CreateInput = {
  category_id: string;
  limit_amount: number;
  alert_threshold_pct?: number;
  period_type?: "PERIOD";
  active?: boolean;
};

type UpdateInput = {
  category_id?: string;
  limit_amount?: number;
  alert_threshold_pct?: number;
  period_type?: "PERIOD";
  active?: boolean;
};

export async function create(data: CreateInput) {
  const exists = await repo.existsActiveRuleByCategory(
    data.category_id,
    data.period_type ?? "PERIOD"
  );

  if (exists) {
    throw new Error("Ya existe una regla activa de presupuesto para esta categoría");
  }

  return repo.createRule(data);
}

export async function getAll(active?: boolean) {
  return repo.getRules(active);
}

export async function getOne(id: string) {
  const rule = await repo.getRuleById(id);

  if (!rule) {
    throw new Error("Regla de presupuesto no encontrada");
  }

  return rule;
}

export async function getBudget(periodId: string) {
  return repo.getBudgetStatus(periodId);
}

export async function update(id: string, data: UpdateInput) {
  const current = await repo.getRuleById(id);

  if (!current) {
    throw new Error("Regla de presupuesto no encontrada");
  }

  const categoryId = data.category_id ?? current.category_id;
  const periodType = data.period_type ?? current.period_type;
  const active =
    typeof data.active === "boolean" ? data.active : current.active;

  if (active) {
    const exists = await repo.existsActiveRuleByCategory(
      categoryId,
      periodType,
      id
    );

    if (exists) {
      throw new Error("Ya existe otra regla activa para esta categoría");
    }
  }

  const updated = await repo.updateRule(id, data);

  if (!updated) {
    throw new Error("No se pudo actualizar la regla de presupuesto");
  }

  return updated;
}

export async function remove(id: string) {
  const current = await repo.getRuleById(id);

  if (!current) {
    throw new Error("Regla de presupuesto no encontrada");
  }

  const deleted = await repo.softDeleteRule(id);

  if (!deleted) {
    throw new Error("No se pudo eliminar la regla de presupuesto");
  }

  return deleted;
}