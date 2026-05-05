// src/components/shopowner/DashboardComplaints.jsx
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const statusColor = {
  open:        'bg-red-50 text-red-600 border-red-200',
  in_progress: 'bg-amber-50 text-amber-600 border-amber-200',
  resolved:    'bg-green-50 text-green-600 border-green-200',
};

const statusIcon = {
  open:        AlertCircle,
  in_progress: Clock,
  resolved:    CheckCircle,
};

export default function DashboardComplaints({ shop }) {
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!shop?.id) { setLoading(false); return; }
    base44.entities.Complaint.filter({ shop_id: shop.id }, '-created_at', 50)
      .then((data) => { setComplaints(data); setLoading(false); });
  }, [shop?.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold">Complaints</h1>
        <span className="text-sm text-muted-foreground">{complaints.length} total</span>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-background rounded-2xl border border-border/50 p-12 text-center">
          <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-400" />
          <p className="font-medium">No complaints! 🎉</p>
          <p className="text-sm text-muted-foreground mt-1">Your shop has a clean record.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => {
            const StatusIcon = statusIcon[c.status] || AlertCircle;
            const colorClass = statusColor[c.status] || statusColor.open;
            return (
              <div key={c.id} className="bg-background rounded-xl border border-border/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${colorClass}`}>
                    <StatusIcon className="h-3 w-3" />
                    {(c.status || 'open').replace('_', ' ')}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{c.complaint_text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
