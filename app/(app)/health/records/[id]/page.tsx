import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { RecordDetails } from '../components/record-details';
import { redirect } from 'next/navigation';

export default async function RecordPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServer();
  
  const { data: session } = await supabase.auth.getUser();
  if (!session) {
    redirect('/login');
  }

  // Fetch both file metadata and image analysis in parallel
  const [fileResult, analysisResult] = await Promise.all([
    supabase
      .from('file_metadata')
      .select('*')
      .eq('id', params.id)
      .single(),
    
    supabase
      .from('image_analysis')
      .select('*')
      .eq('file_id', params.id)
      .single()
  ]);


  if (!fileResult.data) {
    redirect('/health/records');
  }

  // Get signed URL for file preview
  const { data: signedUrlData, error: signedUrlError } = await supabase
    .storage
    .from('health-records')
    .createSignedUrl(`${fileResult.data.user_id}/${fileResult.data.file_name}`, 3600);

  if (signedUrlError) {
    console.error('Signed URL error:', signedUrlError);
  }

  const record = {
    ...fileResult.data,
    analysis: {
      ...analysisResult.data,
      indicators: analysisResult.data?.medical_indicators || [],
      clinicalSignificance: analysisResult.data?.clinical_significance || ''
    },
    fileUrl: signedUrlData?.signedUrl || null
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <RecordDetails record={record} />
    </div>
  );
} 