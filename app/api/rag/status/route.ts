import { createSupabaseServer } from '@/lib/supabase/server';
import { Ragie } from 'ragie';
import { NextRequest, NextResponse } from 'next/server';

const ragie = new Ragie({
  auth: process.env.RAGIE_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch all documents for the user from Supabase
    const { data: documents, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id);

    if (docError) {
      console.error('Error fetching documents:', docError);
      return new Response(JSON.stringify({ error: 'Failed to fetch documents' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Fetch status from Ragie and update Supabase if changed
    const updatedDocuments = await Promise.all(
      documents.map(async (doc) => {
        try {
          const statusResponse = await ragie.documents.get({ documentId: doc.document_id });
          const newStatus = statusResponse.status;

          if (doc.status !== newStatus) {
            const { data: updatedDoc, error: updateError } = await supabase
              .from('documents')
              .update({ status: newStatus })
              .eq('id', doc.id)
              .select()
              .single();
            
            if (updateError) {
              console.error(`Failed to update status for doc ${doc.id}:`, updateError);
              return doc; // Return original doc on update failure
            }
            return updatedDoc;
          }
          return doc;
        } catch (ragieError) {
          console.error(`Failed to get status for doc ${doc.document_id} from Ragie:`, ragieError);
          // If Ragie fails, we assume the status is 'failed'
          const { data: updatedDoc, error: updateError } = await supabase
            .from('documents')
            .update({ status: 'failed' })
            .eq('id', doc.id)
            .select()
            .single();
          return updatedDoc || { ...doc, status: 'failed' };
        }
      })
    );

    return NextResponse.json(updatedDocuments);

  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
