import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ClipboardList, BarChart3 } from 'lucide-react';

const links = [
  { to: '/', label: 'Student', icon: BookOpen, desc: 'Recommendations' },
  { to: '/librarian', label: 'Librarian', icon: ClipboardList, desc: 'Review workspace' },
  { to: '/district', label: 'District', icon: BarChart3, desc: 'Pilot dashboard' },
];

export default function RoleNav() {
  const { pathname } = useLocation();

  return (
    <nav className="border-b border-border bg-card" role="navigation" aria-label="Role navigation">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-foreground text-base">
          <BookOpen className="w-5 h-5 text-accent" />
          Reading Lift
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-body font-medium transition-colors min-h-[44px] ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
