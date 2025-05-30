import { Suspense } from 'react'
import { createSupabaseServer } from '@/lib/supabase/server'
import HealthRecordsPageClient from './records-client'
import { HealthRecordsSkeleton } from './components/health-records-skeleton'

export const revalidate = 0

async function getInitialData() {
  const supabase = createSupabaseServer()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { user: null, files: [] }
  }

  const { data: storageData, error: storageError } = await supabase.storage
    .from('health-records')
    .list(`${user.id}`);

  if (storageError) {
    console.error('Error fetching files from storage:', storageError)
    return { user, files: [] }
  }

  const { data: metadataData, error: metadataError } = await supabase
    .from('file_metadata')
    .select('*')
    .eq('user_id', user.id);

  if (metadataError) {
    console.error('Error fetching file metadata:', metadataError)
    return { user, files: [] }
  }

  const files = storageData.map(file => {
    const metadata = metadataData?.find(m => m.file_name === file.name);
    return {
      id: metadata?.id,
      name: file.name,
      displayName: metadata?.display_name || file.name,
      created_at: file.created_at,
    };
  });

  return { user, files }
}

export default async function HealthRecordsPage() {
  return (
    <Suspense fallback={<HealthRecordsLoadingState />}>
      <HealthRecordsContent />
    </Suspense>
  )
}

async function HealthRecordsContent() {
  const initialData = await getInitialData()
  return <HealthRecordsPageClient initialData={initialData} />
}

function HealthRecordsLoadingState() {
  return (
    <div className="flex h-screen">
      <HealthRecordsSkeleton />
    </div>
  )
}