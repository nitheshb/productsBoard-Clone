import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const BUCKET = 'pb-task-attachments';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('pb_task_attachments')
      .select('*')
      .eq('task_id', params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ attachments: data || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch attachments';
    console.error('Error fetching attachments:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id: taskId } = params;

    if (!body.file_name || !body.file_path || !body.file_url) {
      return NextResponse.json(
        { error: 'file_name, file_path, and file_url are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('pb_task_attachments')
      .insert([
        {
          task_id: taskId,
          file_name: body.file_name,
          file_path: body.file_path,
          file_url: body.file_url,
          mime_type: body.mime_type || null,
          size_bytes: typeof body.size_bytes === 'number' ? body.size_bytes : null,
          uploaded_by: body.uploaded_by || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save attachment';
    console.error('Error saving attachment:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get('attachmentId');
    if (!attachmentId) {
      return NextResponse.json({ error: 'attachmentId is required' }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('pb_task_attachments')
      .select('id, file_path, task_id')
      .eq('id', attachmentId)
      .eq('task_id', params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!existing) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 });
    }

    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([existing.file_path]);
    if (storageError) {
      console.warn('Storage delete failed (continuing to delete metadata):', storageError);
    }

    const { error: deleteError } = await supabase
      .from('pb_task_attachments')
      .delete()
      .eq('id', attachmentId);

    if (deleteError) throw deleteError;
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete attachment';
    console.error('Error deleting attachment:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
