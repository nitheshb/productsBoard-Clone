

// api/product/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Helper function to validate status values
const isValidStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const validStatuses = ['Todo', 'In Progress', 'Completed'];
  return validStatuses.includes(status);
};

// Helper function to determine status based on progress
const getStatusFromProgress = (progress: number): string => {
  if (progress === 0) {
    return 'Todo';
  } else if (progress === 100) {
    return 'Completed';
  } else {
    return 'In Progress';
  }
};

// Get a single product with its components and features
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) {
      if (productError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      throw productError;
    }

    // Fetch components for this product
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('*')
      .eq('product_id', id);

    if (componentsError) throw componentsError;

    // Fetch features for all components of this product
    const componentIds = components.map(comp => comp.id);
    let features = [];

    if (componentIds.length > 0) {
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .in('component_id', componentIds);

      if (featuresError) throw featuresError;
      features = featuresData;
    }

    // Structure the data hierarchically
    const componentsWithFeatures = components.map(component => {
      const componentFeatures = features.filter(feature => feature.component_id === component.id);
      return {
        ...component,
        features: componentFeatures
      };
    });

    const structuredProduct = {
      ...product,
      components: componentsWithFeatures
    };

    return NextResponse.json(structuredProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const body = await request.json();
    console.log('Product update request:', { id, body });

    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      console.error('Error checking product existence:', checkError);
      throw checkError;
    }

    // Prepare update fields - only update fields that are provided
    const updateFields: any = {};
    
    if (body.name !== undefined) updateFields.name = body.name;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.progress !== undefined) updateFields.progress = body.progress;
    if (body.version !== undefined) updateFields.version = body.version;
    if (body.team !== undefined) updateFields.team = body.team;
    if (body.days !== undefined) updateFields.days = body.days;
    if (body.startDate !== undefined || body.startdate !== undefined) {
      updateFields.startdate = body.startDate || body.startdate;
    }
    if (body.targetDate !== undefined || body.targetdate !== undefined) {
      updateFields.targetdate = body.targetDate || body.targetdate;
    }
    if (body.completedOn !== undefined || body.completedon !== undefined) {
      updateFields.completedon = body.completedOn || body.completedon;
    }
    if (body.remarks !== undefined) updateFields.remarks = body.remarks;
    if (body.description !== undefined) updateFields.description = body.description;

    // Validate status if provided
    if (body.status && !isValidStatus(body.status)) {
      return NextResponse.json({ 
        error: 'Invalid status value. Must be one of: Todo, In Progress, Completed' 
      }, { status: 400 });
    }

    // If progress is provided, automatically set status based on progress
    // But only if status is not explicitly provided
    if (body.progress !== undefined && body.status === undefined) {
      updateFields.status = getStatusFromProgress(body.progress);
      console.log(`Auto-setting status to ${updateFields.status} based on progress ${body.progress}`);
    } else if (body.status !== undefined) {
      console.log(`Using explicit status: ${body.status}`);
    }

    console.log('Updating product with fields:', updateFields);

    const { data, error } = await supabase
      .from('products')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Product not found after update' }, { status: 404 });
    }

    console.log('Product updated successfully:', data[0]);
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error in PUT /api/product/[id]:', error);
    return NextResponse.json({ 
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the product (cascade deletion will handle components and features)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}


