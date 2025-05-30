import { useQuery } from '@tanstack/react-query';
import { createSupabaseBrowser } from '@/lib/supabase/client';

export function useHealthRecords() {
  const supabase = createSupabaseBrowser();

  return useQuery({
    queryKey: ['health-records'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const [storageResponse, metadataResponse] = await Promise.all([
        supabase.storage.from('health-records').list(`${user.id}`),
        supabase.from('file_metadata').select('*').eq('user_id', user.id)
      ]);

      if (storageResponse.error) throw storageResponse.error;
      if (metadataResponse.error) throw metadataResponse.error;

      return storageResponse.data.map(file => {
        const metadata = metadataResponse.data?.find(m => m.file_name === file.name);
        return {
          id: metadata?.id,
          name: file.name,
          displayName: metadata?.display_name || file.name,
          created_at: file.created_at,
        };
      });
    }
  });
} 