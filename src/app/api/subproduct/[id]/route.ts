
// api/subproduct/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const isValidStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const validStatuses = ['Todo', 'In Progress', 'Completed', 'Blocked'];
  return validStatuses.includes(status);
};

const getStatusFromProgress = (progress: number): string => {
  if (progress === 0) return 'Todo';
  if (progress === 100) return 'Completed';
  return 'In Progress';
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data: subproduct, error: subproductError } = await supabase
      .from('pb_subproducts')
      .select('*')
      .eq('id', id)
      .single();

    if (subproductError) {
      if (subproductError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Subproduct not found' }, { status: 404 });
      }
      throw subproductError;
    }

    const { data: components, error: componentsError } = await supabase
      .from('pb_components')
      .select('*')
      .eq('subproduct_id', id);

    if (componentsError) throw componentsError;

    return NextResponse.json({
      ...subproduct,
      components: components || []
    });
  } catch (error) {
    console.error('Error fetching subproduct:', error);
    return NextResponse.json({ error: 'Failed to fetch subproduct' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updateFields: any = {};
    if (body.name !== undefined) updateFields.name = body.name;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.progress !== undefined) updateFields.progress = body.progress;
    if (body.version !== undefined) updateFields.version = body.version;
    if (body.team !== undefined) updateFields.team = body.team;
    if (body.team_id !== undefined) updateFields.team_id = body.team_id;
    if (body.days !== undefined) updateFields.days = body.days;
    if (body.startdate !== undefined) updateFields.startdate = body.startdate;
    if (body.targetdate !== undefined) updateFields.targetdate = body.targetdate;
    if (body.completedon !== undefined) updateFields.completedon = body.completedon;
    if (body.remarks !== undefined) updateFields.remarks = body.remarks;
    if (body.description !== undefined) updateFields.description = body.description;

    if (body.progress !== undefined && body.status === undefined) {
      updateFields.status = getStatusFromProgress(body.progress);
    }

    const { data, error } = await supabase
      .from('pb_subproducts')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) throw error;

    // Trigger parent product progress update
    try {
      const { updateProductProgressInDb } = await import('@/utils/progressCalculator');
      const { data: subproductData } = await supabase
        .from('pb_subproducts')
        .select('product_id')
        .eq('id', id)
        .single();
      
      if (subproductData?.product_id) {
        await updateProductProgressInDb(subproductData.product_id);
      }
    } catch (progressError) {
      console.error('Error rippling progress to product:', progressError);
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating subproduct:', error);
    return NextResponse.json({ error: 'Failed to update subproduct' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { error } = await supabase
      .from('pb_subproducts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Subproduct deleted successfully' });
  } catch (error) {
    console.error('Error deleting subproduct:', error);
    return NextResponse.json({ error: 'Failed to delete subproduct' }, { status: 500 });
  }
}
