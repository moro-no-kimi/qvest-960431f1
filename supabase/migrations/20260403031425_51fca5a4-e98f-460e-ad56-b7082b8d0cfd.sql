
-- Create enum types
CREATE TYPE public.recommendation_status AS ENUM ('approved', 'pinned', 'suppressed', 'pending', 'auto-published');
CREATE TYPE public.recommendation_signal AS ENUM ('collaborative', 'content', 'popularity', 'series');
CREATE TYPE public.librarian_action_type AS ENUM ('approved', 'replaced', 'pinned', 'suppressed');

-- Books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL DEFAULT '',
  grade_band TEXT NOT NULL DEFAULT '',
  series TEXT,
  description TEXT NOT NULL DEFAULT '',
  available BOOLEAN NOT NULL DEFAULT true,
  copies_available INTEGER NOT NULL DEFAULT 0,
  total_copies INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL,
  homeroom TEXT NOT NULL DEFAULT '',
  school TEXT NOT NULL DEFAULT '',
  checkout_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recommendations table
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  explanation TEXT NOT NULL DEFAULT '',
  signals recommendation_signal[] NOT NULL DEFAULT '{}',
  confidence NUMERIC NOT NULL DEFAULT 0,
  status recommendation_status NOT NULL DEFAULT 'pending',
  because_you_liked TEXT[] NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Librarian actions table
CREATE TABLE public.librarian_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  librarian_name TEXT NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  recommendation_id UUID NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
  action librarian_action_type NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- School metrics table
CREATE TABLE public.school_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school TEXT NOT NULL,
  pre_baseline_checkouts INTEGER NOT NULL DEFAULT 0,
  current_checkouts INTEGER NOT NULL DEFAULT 0,
  lift_percent NUMERIC NOT NULL DEFAULT 0,
  students_reached INTEGER NOT NULL DEFAULT 0,
  total_students INTEGER NOT NULL DEFAULT 0,
  approval_rate NUMERIC NOT NULL DEFAULT 0,
  override_rate NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Weekly trends table
CREATE TABLE public.weekly_trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week TEXT NOT NULL,
  checkouts_per_student NUMERIC NOT NULL DEFAULT 0,
  baseline NUMERIC NOT NULL DEFAULT 0,
  recommendations_generated INTEGER NOT NULL DEFAULT 0,
  recommendations_exposed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.librarian_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_trends ENABLE ROW LEVEL SECURITY;

-- POC policies: public read/write (will be locked down when auth is added)
CREATE POLICY "Public read access" ON public.books FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.books FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.books FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.students FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.recommendations FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.librarian_actions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.librarian_actions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read access" ON public.school_metrics FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.school_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.school_metrics FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.weekly_trends FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.weekly_trends FOR INSERT WITH CHECK (true);

-- Enable realtime for recommendations and librarian_actions
ALTER PUBLICATION supabase_realtime ADD TABLE public.recommendations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.librarian_actions;

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Timestamp triggers
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON public.recommendations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_school_metrics_updated_at BEFORE UPDATE ON public.school_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
