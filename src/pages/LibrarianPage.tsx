import { useState } from 'react';
import { students, recentActions } from '@/data/synthetic';
import type { Student, Recommendation, RecommendationStatus } from '@/data/types';
import { Check, Pin, X, Search, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

const statusClass: Record<RecommendationStatus, string> = {
  approved: 'status-approved',
  pinned: 'status-pinned',
  suppressed: 'status-suppressed',
  pending: 'status-pending',
  'auto-published': 'status-auto',
};

const statusLabel: Record<RecommendationStatus, string> = {
  approved: 'Approved',
  pinned: 'Pinned',
  suppressed: 'Suppressed',
  pending: 'Needs review',
  'auto-published': 'Auto-published',
};

export default function LibrarianPage() {
  const [selected, setSelected] = useState<Student>(students[0]);
  const [search, setSearch] = useState('');
  const [recStates, setRecStates] = useState<Record<string, RecommendationStatus>>({});

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.homeroom.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (rec: Recommendation): RecommendationStatus =>
    recStates[rec.id] ?? rec.status;

  const setStatus = (recId: string, status: RecommendationStatus) =>
    setRecStates((prev) => ({ ...prev, [recId]: status }));

  const pendingCount = selected.recommendations.filter(
    (r) => getStatus(r) === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Student selector */}
      <aside className="w-72 border-r border-border bg-sidebar flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-base text-sidebar-foreground">Students</h2>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name or homeroom…"
              className="pl-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {filtered.map((s) => {
            const pending = s.recommendations.filter((r) => (recStates[r.id] ?? r.status) === 'pending').length;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-border transition-colors min-h-[44px] ${
                  selected.id === s.id ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Grade {s.grade} · {s.homeroom} · {s.checkoutCount} checkouts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {pending > 0 && (
                    <span className="status-pending text-[10px]">{pending}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Center: Recommendation queue */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground">{selected.name}</h1>
              <p className="text-sm text-muted-foreground">
                Grade {selected.grade} · {selected.homeroom} · {selected.school}
              </p>
            </div>
            {pendingCount > 0 && (
              <span className="status-pending text-sm">{pendingCount} needs review</span>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4 max-w-3xl">
            {selected.recommendations.map((rec) => {
              const st = getStatus(rec);
              return (
                <div
                  key={rec.id}
                  className="border border-border rounded-lg bg-card p-4 animate-fade-in"
                  style={{ animationDelay: `${rec.position * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    <img
                      src={rec.book.coverImage}
                      alt={`Cover of ${rec.book.title}`}
                      className="w-14 h-20 object-cover rounded flex-shrink-0"
                      loading="lazy"
                      width={512}
                      height={768}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-semibold text-foreground leading-tight">
                            {rec.book.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{rec.book.author} · {rec.book.genre}</p>
                        </div>
                        <span className={statusClass[st]}>{statusLabel[st]}</span>
                      </div>

                      <p className="text-sm text-foreground/75 mt-2 font-body">
                        {rec.explanation}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {rec.signals.map((s) => (
                          <span key={s} className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-body">
                            <Sparkles className="w-3 h-3 inline mr-0.5 -mt-0.5" />
                            {s}
                          </span>
                        ))}
                        <span className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-body">
                          Confidence: {Math.round(rec.confidence * 100)}%
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                        <ActionButton
                          icon={<Check className="w-3.5 h-3.5" />}
                          label="Approve"
                          active={st === 'approved'}
                          onClick={() => setStatus(rec.id, 'approved')}
                        />
                        <ActionButton
                          icon={<Pin className="w-3.5 h-3.5" />}
                          label="Pin"
                          active={st === 'pinned'}
                          onClick={() => setStatus(rec.id, 'pinned')}
                        />
                        <ActionButton
                          icon={<X className="w-3.5 h-3.5" />}
                          label="Suppress"
                          active={st === 'suppressed'}
                          onClick={() => setStatus(rec.id, 'suppressed')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
          {recentActions.map((a) => {
            const st = students.find((s) => s.id === a.studentId);
            return (
              <div key={a.id} className="px-4 py-3 border-b border-border">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{a.timestamp}</span>
                </div>
                <p className="text-xs text-foreground mt-1">
                  <span className="font-medium">{a.librarianName}</span>{' '}
                  <span className={statusClass[a.action]}>{a.action}</span>{' '}
                  a rec for {st?.name ?? 'Unknown'}
                </p>
                {a.note && (
                  <p className="text-[11px] text-muted-foreground mt-1 italic">"{a.note}"</p>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-xs font-body font-medium px-2.5 py-1.5 rounded transition-colors min-h-[44px] ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
