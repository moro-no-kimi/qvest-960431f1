import { useState } from 'react';
import {
  useStudents,
  useRecommendationsForStudent,
  useLibrarianActions,
  useUpdateRecommendationStatus,
  resolveCover,
  type DbStudent,
  type RecommendationWithBook,
} from '@/hooks/use-pilot-data';
import type { Enums } from '@/integrations/supabase/types';
import { Check, Pin, X, Search, ChevronRight, Clock, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type RecStatus = Enums<'recommendation_status'>;

const statusClass: Record<RecStatus, string> = {
  approved: 'status-approved',
  pinned: 'status-pinned',
  suppressed: 'status-suppressed',
  pending: 'status-pending',
  'auto-published': 'status-auto',
};

const statusLabel: Record<RecStatus, string> = {
  approved: 'Approved',
  pinned: 'Pinned',
  suppressed: 'Suppressed',
  pending: 'Needs review',
  'auto-published': 'Auto-published',
};

export default function LibrarianPage() {
  const { data: students, isLoading: loadingStudents } = useStudents();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const selected = students?.find((s) => s.id === selectedId) ?? students?.[0];
  const { data: recs, isLoading: loadingRecs } = useRecommendationsForStudent(selected?.id);
  const { data: actions, isLoading: loadingActions } = useLibrarianActions();
  const mutation = useUpdateRecommendationStatus();

  const filtered = students?.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.homeroom.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const pendingCount = recs?.filter((r) => r.status === 'pending').length ?? 0;

  const handleAction = (rec: RecommendationWithBook, status: RecStatus) => {
    if (!selected) return;
    mutation.mutate(
      {
        recId: rec.id,
        status,
        librarianName: 'Ms. Patterson',
        studentId: selected.id,
      },
      {
        onSuccess: () => {
          toast({ title: `Recommendation ${statusLabel[status].toLowerCase()}`, description: rec.books.title });
        },
      }
    );
  };

  if (loadingStudents) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Student selector */}
      <aside className="w-72 border-r border-border bg-sidebar flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-base text-sidebar-foreground">Students</h2>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name or homeroom…" className="pl-8 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {filtered.map((s) => (
            <StudentRow key={s.id} student={s} active={selected?.id === s.id} onClick={() => setSelectedId(s.id)} />
          ))}
        </nav>
      </aside>

      {/* Center: Recommendation queue */}
      <main className="flex-1 flex flex-col min-w-0">
        {selected && (
          <header className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-xl font-semibold text-foreground">{selected.name}</h1>
                <p className="text-sm text-muted-foreground">Grade {selected.grade} · {selected.homeroom} · {selected.school}</p>
              </div>
              {pendingCount > 0 && <span className="status-pending text-sm">{pendingCount} needs review</span>}
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4 max-w-3xl">
            {loadingRecs ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)
            ) : (
              recs?.map((rec) => (
                <RecCard key={rec.id} rec={rec} onAction={(st) => handleAction(rec, st)} isMutating={mutation.isPending} />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Right: Audit trail */}
      <aside className="w-72 border-l border-border bg-card flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-base text-foreground">Recent Actions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Audit trail across all students</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingActions
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 mx-4 my-2 rounded" />)
            : actions?.map((a) => {
                const st = students?.find((s) => s.id === a.student_id);
                return (
                  <div key={a.id} className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-foreground mt-1">
                      <span className="font-medium">{a.librarian_name}</span>{' '}
                      <span className={statusClass[a.action as RecStatus]}>{a.action}</span>{' '}
                      a rec for {st?.name ?? 'Unknown'}
                    </p>
                    {a.note && <p className="text-[11px] text-muted-foreground mt-1 italic">"{a.note}"</p>}
                  </div>
                );
              })}
        </div>
      </aside>
    </div>
  );
}

function StudentRow({ student, active, onClick }: { student: DbStudent; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-border transition-colors min-h-[44px] ${
        active ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
      }`}
    >
      <div>
        <p className="text-sm font-medium text-sidebar-foreground">{student.name}</p>
        <p className="text-xs text-muted-foreground">Grade {student.grade} · {student.homeroom} · {student.checkout_count} checkouts</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

function RecCard({ rec, onAction, isMutating }: { rec: RecommendationWithBook; onAction: (st: RecStatus) => void; isMutating: boolean }) {
  const book = rec.books;
  return (
    <div className="border border-border rounded-lg bg-card p-4 animate-fade-in" style={{ animationDelay: `${rec.position * 0.05}s` }}>
      <div className="flex gap-4">
        <img src={resolveCover(book.cover_image)} alt={`Cover of ${book.title}`} className="w-14 h-20 object-cover rounded flex-shrink-0" loading="lazy" width={512} height={768} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display font-semibold text-foreground leading-tight">{book.title}</h3>
              <p className="text-xs text-muted-foreground">{book.author} · {book.genre}</p>
            </div>
            <span className={statusClass[rec.status]}>{statusLabel[rec.status]}</span>
          </div>
          <p className="text-sm text-foreground/75 mt-2 font-body">{rec.explanation}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {rec.signals.map((s) => (
              <span key={s} className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-body">
                <Sparkles className="w-3 h-3 inline mr-0.5 -mt-0.5" />
                {s}
              </span>
            ))}
            <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-body">
              Confidence: {Math.round(Number(rec.confidence) * 100)}%
            </span>
          </div>
          <div className="flex gap-2 mt-3 pt-2 border-t border-border">
            <ActionButton icon={<Check className="w-3.5 h-3.5" />} label="Approve" active={rec.status === 'approved'} onClick={() => onAction('approved')} disabled={isMutating} />
            <ActionButton icon={<Pin className="w-3.5 h-3.5" />} label="Pin" active={rec.status === 'pinned'} onClick={() => onAction('pinned')} disabled={isMutating} />
            <ActionButton icon={<X className="w-3.5 h-3.5" />} label="Suppress" active={rec.status === 'suppressed'} onClick={() => onAction('suppressed')} disabled={isMutating} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, active, onClick, disabled }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 text-xs font-body font-medium px-2.5 py-1.5 rounded transition-colors min-h-[44px] disabled:opacity-50 ${
        active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
