import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Database, CheckCircle2, AlertCircle, Clock, RefreshCw, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

function StatusBadge({ status }) {
  const config = {
    ACTIVE_HEALTHY: { label: 'Active & Healthy', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    INACTIVE: { label: 'Inactive', icon: AlertCircle, color: 'text-gray-500 bg-gray-50 border-gray-200' },
    COMING_UP: { label: 'Coming Up', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    GOING_DOWN: { label: 'Going Down', icon: AlertCircle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    RESTORING: { label: 'Restoring', icon: RefreshCw, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    PAUSED: { label: 'Paused', icon: AlertCircle, color: 'text-red-600 bg-red-50 border-red-200' },
  };

  const cfg = config[status] || { label: status, icon: AlertCircle, color: 'text-gray-500 bg-gray-50 border-gray-200' };
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

export default function SupabaseProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke('getSupabaseProjects', {});
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setProjects(res.data.projects || []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchProjects(); }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold">Supabase Projects</h1>
            <p className="text-xs text-muted-foreground">{projects.length} project{projects.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchProjects} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Projects List */}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Database className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No Supabase projects found.</p>
        </div>
      )}

      {!loading && projects.map((project) => (
        <div key={project.id} className="bg-card border border-border/50 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-lg">{project.name}</h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{project.ref}</p>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Region</p>
                <p className="font-medium">{project.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Postgres</p>
                <p className="font-medium">v{project.database?.postgres_engine || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">{project.created_at ? format(new Date(project.created_at), 'MMM d, yyyy') : '—'}</p>
              </div>
            </div>
          </div>

          {project.database?.host && (
            <p className="text-xs text-muted-foreground font-mono bg-muted/50 rounded-lg px-3 py-2 truncate">
              {project.database.host}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}