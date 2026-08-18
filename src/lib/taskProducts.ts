import { supabase } from '@/lib/supabaseClient';

export type TaskProductRef = { id: string; name: string };

export function parseProductIds(body: {
  product_ids?: unknown;
  product_id?: unknown;
}): string[] {
  const fromArray = Array.isArray(body.product_ids)
    ? body.product_ids.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : [];
  if (fromArray.length > 0) {
    return [...new Set(fromArray)];
  }
  if (typeof body.product_id === 'string' && body.product_id) {
    return [body.product_id];
  }
  return [];
}

export async function replaceTaskProducts(taskId: string, productIds: string[]) {
  const uniqueIds = [...new Set(productIds.filter(Boolean))];

  const { error: deleteError } = await supabase
    .from('pb_task_products')
    .delete()
    .eq('task_id', taskId);

  if (deleteError) throw deleteError;

  if (uniqueIds.length === 0) return;

  const { error: insertError } = await supabase
    .from('pb_task_products')
    .insert(uniqueIds.map((product_id) => ({ task_id: taskId, product_id })));

  if (insertError) throw insertError;
}

export function mapTaskProducts(row: Record<string, unknown>): {
  product_ids: string[];
  products: TaskProductRef[];
  product_id: string | null;
  product_name: string | null;
} {
  const links = Array.isArray(row.task_products) ? row.task_products : [];
  const fromLinks: TaskProductRef[] = links
    .map((link) => {
      const product = (link as { product?: TaskProductRef | null })?.product;
      if (product?.id && product?.name) return { id: product.id, name: product.name };
      return null;
    })
    .filter((p): p is TaskProductRef => Boolean(p));

  const fallback = row.product as TaskProductRef | null | undefined;
  const products =
    fromLinks.length > 0
      ? fromLinks
      : fallback?.id
        ? [{ id: fallback.id, name: fallback.name }]
        : [];

  const product_ids = products.map((p) => p.id);
  return {
    product_ids,
    products,
    product_id: product_ids[0] ?? null,
    product_name: products.map((p) => p.name).join(', ') || null,
  };
}
