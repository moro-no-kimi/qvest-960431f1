import { useState } from 'react';
import { useStudents, useRecommendationsForStudent, resolveCover, type RecommendationWithBook } from '@/hooks/use-pilot-data';
import { BookOpen, Heart, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const signalLabel: Record<string, string> = {
  collaborative: 'Students like you',
  content: 'Theme match',
  popularity: 'Popular at your school',
  series: 'Series continuation',
};

export default function StudentPage() {
  const { data: students, isLoading: loadingStudents } = useStudents();
  const student = students?.[0]; // Demo: first student
  const { data: recs, isLoading: loadingRecs } = useRecommendationsForStudent(student?.id);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const isLoading = loadingStudents || loadingRecs;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-6 pt-8 pb-4 max-w-3xl mx-auto">
          <p className="text-muted-foreground text-sm font-body">Finding your next books…</p>
          <Skeleton className="h-8 w-48 mt-2" />
        </header>
        <section className="max-w-3xl mx-auto px-6 pb-6 space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </section>
      </div>
    );
  }

  if (!student || !recs || recs.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display font-semibold text-foreground text-lg">No picks yet</h2>
          <p className="text-sm text-muted-foreground mt-1">
            We don't have personalized recommendations for you yet. Check back after the next nightly refresh, or ask your librarian for suggestions.
          </p>
        </div>
      </div>
    );
  }

  // Only show approved, pinned, or auto-published to students
  const visible = recs.filter(
    (r) => r.status === 'approved' || r.status === 'pinned' || r.status === 'auto-published'
  );

  const hero = visible[0];
  const rest = visible.slice(1);

  if (!hero) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h2 className="font-display font-semibold text-foreground text-lg">Your picks are being reviewed</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your librarian is reviewing your personalized recommendations. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-8 pb-4 max-w-3xl mx-auto">
        <p className="text-muted-foreground text-sm font-body">Good morning,</p>
        <h1 className="text-2xl font-display font-semibold text-foreground">{student.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here are your personalized reading picks based on your borrowing history.
        </p>
      </header>

      <section className="max-w-3xl mx-auto px-6 pb-6">
        <HeroCard rec={hero} saved={saved.has(hero.id)} onToggle={() => toggle(hero.id)} />
      </section>

      {rest.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">More for you</h2>
          <div className="space-y-4">
            {rest.map((rec) => (
              <SecondaryCard key={rec.id} rec={rec} saved={saved.has(rec.id)} onToggle={() => toggle(rec.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function HeroCard({ rec, saved, onToggle }: { rec: RecommendationWithBook; saved: boolean; onToggle: () => void }) {
  const book = rec.books;
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.05s' }}>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-44 w-full flex-shrink-0">
          <img src={resolveCover(book.cover_image)} alt={`Cover of ${book.title} by ${book.author}`} className="w-full h-64 sm:h-full object-cover" width={512} height={768} />
        </div>
        <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <span className="text-xs font-body font-medium text-accent uppercase tracking-wider">Top Pick</span>
                <h3 className="text-xl font-display font-semibold text-foreground mt-1 leading-tight">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
            <p className="text-sm text-foreground/80 mt-3 font-body leading-relaxed italic">"{rec.explanation}"</p>
            {rec.because_you_liked && rec.because_you_liked.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {rec.because_you_liked.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs font-body">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {t}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {rec.signals.map((s) => (
                <span key={s} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-body">
                  <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
                  {signalLabel[s]}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <AvailabilityBadge available={book.available} copies={book.copies_available} />
            <button onClick={onToggle} className="flex items-center gap-1.5 text-sm font-body font-medium text-foreground hover:text-accent transition-colors min-h-[44px] px-3" aria-label={saved ? 'Remove from saved' : 'Save for later'}>
              <Heart className={`w-4 h-4 ${saved ? 'fill-accent text-accent' : ''}`} />
              {saved ? 'Saved' : 'Interested'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecondaryCard({ rec, saved, onToggle }: { rec: RecommendationWithBook; saved: boolean; onToggle: () => void }) {
  const book = rec.books;
  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4 animate-fade-in" style={{ animationDelay: `${rec.position * 0.08}s` }}>
      <img src={resolveCover(book.cover_image)} alt={`Cover of ${book.title} by ${book.author}`} className="w-16 h-24 object-cover rounded flex-shrink-0" loading="lazy" width={512} height={768} />
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-foreground text-base leading-tight">{book.title}</h3>
        <p className="text-xs text-muted-foreground">{book.author} · {book.genre}</p>
        <p className="text-sm text-foreground/75 mt-1.5 line-clamp-2 font-body">{rec.explanation}</p>
        <div className="flex items-center justify-between mt-2">
          <AvailabilityBadge available={book.available} copies={book.copies_available} />
          <button onClick={onToggle} className="flex items-center gap-1 text-xs font-body font-medium text-foreground hover:text-accent transition-colors min-h-[44px] px-2" aria-label={saved ? 'Remove from saved' : 'Save for later'}>
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-accent text-accent' : ''}`} />
            {saved ? 'Saved' : 'Interested'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AvailabilityBadge({ available, copies }: { available: boolean; copies: number }) {
  return (
    <span className={`flex items-center gap-1 text-xs font-body ${available ? 'text-status-approved' : 'text-muted-foreground'}`}>
      <MapPin className="w-3 h-3" />
      {available ? `${copies} available in library` : 'Currently checked out'}
    </span>
  );
}
