import { useSchoolMetrics, useStudents, useLibrarianActions, useWeeklyTrends } from '@/hooks/use-pilot-data';
import { School, Users, TrendingUp, CheckCircle, BookOpen, Clock, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';

export default function PrincipalPage() {
  const { data: metrics, isLoading: loadingMetrics } = useSchoolMetrics();
  const { data: students, isLoading: loadingStudents } = useStudents();
  const { data: actions } = useLibrarianActions();
  const { data: trends } = useWeeklyTrends();

  if (loadingMetrics || loadingStudents) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Principal sees their own school — pick the first school for the POC
  const mySchool = metrics?.[0];
  const schoolStudents = students?.filter((s) => s.school === mySchool?.school) ?? [];
  const schoolActions = actions?.filter((a) => {
    const student = students?.find((s) => s.id === a.student_id);
    return student?.school === mySchool?.school;
  }) ?? [];

  const approvedCount = schoolActions.filter((a) => a.action === 'approved').length;
  const pinnedCount = schoolActions.filter((a) => a.action === 'pinned').length;
  const suppressedCount = schoolActions.filter((a) => a.action === 'suppressed').length;

  const actionBreakdown = [
    { action: 'Approved', count: approvedCount, fill: 'hsl(152, 60%, 40%)' },
    { action: 'Pinned', count: pinnedCount, fill: 'hsl(38, 92%, 50%)' },
    { action: 'Suppressed', count: suppressedCount, fill: 'hsl(0, 60%, 55%)' },
  ];

  const topReaders = [...schoolStudents].sort((a, b) => b.checkout_count - a.checkout_count).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-8 pb-2 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <School className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-display font-semibold text-foreground">{mySchool?.school ?? 'My School'}</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Principal overview · Reading Lift Pilot
        </p>
      </header>

      {/* KPI cards */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<TrendingUp className="w-5 h-5 text-status-approved" />}
            label="Checkout lift"
            value={`+${Number(mySchool?.lift_percent ?? 0).toFixed(1)}%`}
            subtext="vs. prior-year baseline"
            emphasis
          />
          <KpiCard
            icon={<Users className="w-5 h-5 text-chart-4" />}
            label="Students reached"
            value={`${mySchool?.students_reached ?? 0} / ${mySchool?.total_students ?? 0}`}
            subtext={`${mySchool ? Math.round((mySchool.students_reached / mySchool.total_students) * 100) : 0}% exposure`}
          />
          <KpiCard
            icon={<CheckCircle className="w-5 h-5 text-status-approved" />}
            label="Librarian approval"
            value={`${Number(mySchool?.approval_rate ?? 0)}%`}
            subtext={`${schoolActions.length} total actions`}
          />
          <KpiCard
            icon={<BookOpen className="w-5 h-5 text-accent" />}
            label="Avg checkouts"
            value={schoolStudents.length ? (schoolStudents.reduce((a, s) => a + s.checkout_count, 0) / schoolStudents.length).toFixed(1) : '0'}
            subtext="per student this semester"
          />
        </div>
      </section>

      {/* Charts row */}
      <section className="max-w-6xl mx-auto px-6 pb-8 grid lg:grid-cols-2 gap-6">
        {/* Checkout trend */}
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">Weekly checkout trend</h2>
          <div className="border border-border rounded-lg bg-card p-4">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trends ?? []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 18%, 88%)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'DM Sans' }} domain={[1.5, 3]} />
                <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid hsl(35, 18%, 88%)' }} />
                <Legend wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 11 }} />
                <Line type="monotone" dataKey="checkouts_per_student" name="Checkouts / student" stroke="hsl(220, 40%, 22%)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="hsl(35, 18%, 75%)" strokeWidth={1.5} strokeDasharray="6 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Librarian action breakdown */}
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">Librarian action breakdown</h2>
          <div className="border border-border rounded-lg bg-card p-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={actionBreakdown} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 18%, 88%)" />
                <XAxis dataKey="action" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
                <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid hsl(35, 18%, 88%)' }} />
                <Bar dataKey="count" name="Actions" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Top readers table */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">Top readers</h2>
        <div className="border border-border rounded-lg bg-card overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Grade</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Homeroom</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Checkouts</th>
              </tr>
            </thead>
            <tbody>
              {topReaders.map((s, i) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.grade}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.homeroom}</td>
                  <td className="text-right px-4 py-3 font-medium text-foreground">{s.checkout_count}</td>
                </tr>
              ))}
              {topReaders.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value, subtext, emphasis }: { icon: React.ReactNode; label: string; value: string; subtext: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 animate-fade-in ${emphasis ? 'border-accent bg-accent/5' : 'border-border bg-card'}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground font-body uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-2xl font-display font-semibold ${emphasis ? 'text-accent-foreground' : 'text-foreground'}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
  );
}
