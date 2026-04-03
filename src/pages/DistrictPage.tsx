import { useSchoolMetrics, useWeeklyTrends, useStudents, useLibrarianActions } from '@/hooks/use-pilot-data';
import { TrendingUp, Users, CheckCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function DistrictPage() {
  const { data: metrics, isLoading: loadingMetrics } = useSchoolMetrics();
  const { data: trends, isLoading: loadingTrends } = useWeeklyTrends();
  const { data: students } = useStudents();
  const { data: actions } = useLibrarianActions();

  if (loadingMetrics || loadingTrends) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const schoolMetrics = metrics ?? [];
  const weeklyTrends = trends ?? [];

  const totalStudents = schoolMetrics.reduce((a, s) => a + s.total_students, 0);
  const studentsReached = schoolMetrics.reduce((a, s) => a + s.students_reached, 0);
  const avgLift = schoolMetrics.reduce((a, s) => a + Number(s.lift_percent), 0) / (schoolMetrics.length || 1);
  const avgApproval = schoolMetrics.reduce((a, s) => a + Number(s.approval_rate), 0) / (schoolMetrics.length || 1);
  const totalActions = actions?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pt-8 pb-2 max-w-6xl mx-auto">
        <h1 className="text-2xl font-display font-semibold text-foreground">Reading Lift Pilot Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Last batch: April 2, 2026 · 11:42 PM — {schoolMetrics.length} pilot schools
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={<TrendingUp className="w-5 h-5 text-status-approved" />} label="Avg. checkout lift" value={`+${avgLift.toFixed(1)}%`} subtext="vs. same semester last year" emphasis />
          <MetricCard icon={<Users className="w-5 h-5 text-chart-4" />} label="Students reached" value={`${studentsReached} / ${totalStudents}`} subtext={`${Math.round((studentsReached / totalStudents) * 100)}% exposure`} />
          <MetricCard icon={<CheckCircle className="w-5 h-5 text-status-approved" />} label="Librarian approval rate" value={`${avgApproval.toFixed(0)}%`} subtext={`${totalActions} actions recorded`} />
          <MetricCard icon={<AlertTriangle className="w-5 h-5 text-status-pinned" />} label="Pilot schools" value={schoolMetrics.length.toString()} subtext="Active in the pilot" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">Checkout lift trend</h2>
        <div className="border border-border rounded-lg bg-card p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 18%, 88%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fontFamily: 'DM Sans' }} />
              <YAxis tick={{ fontSize: 12, fontFamily: 'DM Sans' }} domain={[1.5, 3]} />
              <Tooltip contentStyle={{ fontFamily: 'DM Sans', fontSize: 12, borderRadius: 8, border: '1px solid hsl(35, 18%, 88%)' }} />
              <Legend wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 12 }} />
              <Line type="monotone" dataKey="checkouts_per_student" name="Checkouts / student" stroke="hsl(220, 40%, 22%)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="baseline" name="Prior-year baseline" stroke="hsl(35, 18%, 75%)" strokeWidth={1.5} strokeDasharray="6 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">School comparison</h2>
        <div className="border border-border rounded-lg bg-card overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">School</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Baseline</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Current</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Lift</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Exposure</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Approval</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Override</th>
              </tr>
            </thead>
            <tbody>
              {schoolMetrics.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{s.school}</td>
                  <td className="text-right px-4 py-3 text-muted-foreground">{Number(s.pre_baseline_checkouts).toFixed(1)}</td>
                  <td className="text-right px-4 py-3 text-foreground font-medium">{Number(s.current_checkouts).toFixed(1)}</td>
                  <td className="text-right px-4 py-3">
                    <span className={Number(s.lift_percent) >= 20 ? 'text-status-approved font-medium' : 'text-foreground'}>+{Number(s.lift_percent).toFixed(1)}%</span>
                  </td>
                  <td className="text-right px-4 py-3 text-muted-foreground">{Math.round((s.students_reached / s.total_students) * 100)}%</td>
                  <td className="text-right px-4 py-3 text-muted-foreground">{Number(s.approval_rate)}%</td>
                  <td className="text-right px-4 py-3 text-muted-foreground">{Number(s.override_rate)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, subtext, emphasis }: { icon: React.ReactNode; label: string; value: string; subtext: string; emphasis?: boolean }) {
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
