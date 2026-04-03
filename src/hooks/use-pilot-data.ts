import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { Enums } from '@/integrations/supabase/types';

// Cover image imports (static assets for the POC)
import coverScythe from '@/assets/covers/scythe.jpg';
import coverGiver from '@/assets/covers/the-giver.jpg';
import coverBloodBone from '@/assets/covers/children-blood-bone.jpg';
import coverPercy from '@/assets/covers/percy-jackson.jpg';
import coverAmal from '@/assets/covers/amal-unbound.jpg';
import coverWrinkle from '@/assets/covers/wrinkle-in-time.jpg';

// Map DB cover_image paths to local assets for the POC
const coverMap: Record<string, string> = {
  '/covers/scythe.jpg': coverScythe,
  '/covers/the-giver.jpg': coverGiver,
  '/covers/children-blood-bone.jpg': coverBloodBone,
  '/covers/percy-jackson.jpg': coverPercy,
  '/covers/amal-unbound.jpg': coverAmal,
  '/covers/wrinkle-in-time.jpg': coverWrinkle,
};

export function resolveCover(path: string) {
  return coverMap[path] || path;
}

// ---------- Types ----------

export type DbBook = Tables<'books'>;
export type DbStudent = Tables<'students'>;
export type DbRecommendation = Tables<'recommendations'>;
export type DbLibrarianAction = Tables<'librarian_actions'>;
export type DbSchoolMetric = Tables<'school_metrics'>;
export type DbWeeklyTrend = Tables<'weekly_trends'>;

export type RecommendationWithBook = DbRecommendation & { books: DbBook };

// ---------- Queries ----------

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as DbStudent[];
    },
  });
}

export function useRecommendationsForStudent(studentId: string | undefined) {
  return useQuery({
    queryKey: ['recommendations', studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*, books(*)')
        .eq('student_id', studentId!)
        .order('position');
      if (error) throw error;
      return data as RecommendationWithBook[];
    },
  });
}

export function useSchoolMetrics() {
  return useQuery({
    queryKey: ['school_metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_metrics')
        .select('*')
        .order('lift_percent', { ascending: false });
      if (error) throw error;
      return data as DbSchoolMetric[];
    },
  });
}

export function useWeeklyTrends() {
  return useQuery({
    queryKey: ['weekly_trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_trends')
        .select('*')
        .order('week');
      if (error) throw error;
      return data as DbWeeklyTrend[];
    },
  });
}

export function useLibrarianActions() {
  return useQuery({
    queryKey: ['librarian_actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('librarian_actions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as DbLibrarianAction[];
    },
  });
}

// ---------- Mutations ----------

export function useUpdateRecommendationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recId,
      status,
      librarianName,
      studentId,
      note,
    }: {
      recId: string;
      status: Enums<'recommendation_status'>;
      librarianName: string;
      studentId: string;
      note?: string;
    }) => {
      // Update recommendation status
      const { error: recError } = await supabase
        .from('recommendations')
        .update({ status })
        .eq('id', recId);
      if (recError) throw recError;

      // Map status to action type
      const actionMap: Record<string, Enums<'librarian_action_type'>> = {
        approved: 'approved',
        pinned: 'pinned',
        suppressed: 'suppressed',
      };
      const actionType = actionMap[status];
      if (actionType) {
        const { error: actError } = await supabase
          .from('librarian_actions')
          .insert({
            librarian_name: librarianName,
            student_id: studentId,
            recommendation_id: recId,
            action: actionType,
            note: note || null,
          });
        if (actError) throw actError;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recommendations'] });
      qc.invalidateQueries({ queryKey: ['librarian_actions'] });
    },
  });
}
