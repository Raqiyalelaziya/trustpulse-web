import { useState } from 'react';

const SAMPLE_COMPLAINTS = [
  { id: 1, name: 'Noura M.',  initials: 'NM', days: '2 days ago', text: 'Item received was not as described. The color was completely different from the photo shown on Instagram.', resolved: false },
  { id: 2, name: 'Ahmed A.',  initials: 'AA', days: '3 days ago', text: 'I paid for express delivery but the order arrived 10 days late with no updates.', resolved: false },
  { id: 3, name: 'Reem A.',   initials: 'RA', days: '5 days ago', text: 'Delivery took 2 weeks instead of the promised 3 days. Issue resolved with a partial refund.', resolved: true },
];

export default function DashboardComplaints() {
  const [complaints, setComplaints] = useState(SAMPLE_COMPLAINTS);
  const [responding, setResponding] = useState(null);
  const [responseText, setResponseText] = useState('');

  function submitResponse(id) {
    setComplaints(c => c.map(x => x.id === id ? { ...x, resolved: true } : x));
    setResponding(null);
    setResponseText('');
  }

  const open = complaints.filter(c => !c.resolved).length;

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="font-heading text-xl font-extrabold">Complaints &amp; feedback</h1>
        <p className="text-sm text-muted-foreground">Unresolved complaints may lower your trust score</p>
      </div>

      {open > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-800">
          You have <strong>{open} open complaint{open > 1 ? 's' : ''}</strong>. Respond within 48 hours to avoid a trust score penalty.
        </div>
      )}

      <div className="space-y-3">
        {complaints.map((c) => (
          <div key={c.id} className={`rounded-xl border p-4 space-y-3 ${!c.resolved ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${c.resolved ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  {c.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Submitted {c.days}</p>
                </div>
              </div>
              {c.resolved
                ? <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Resolved</span>
                : <span className="text-[10px] font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Open</span>}
            </div>
            <p className={`text-sm ${c.resolved ? 'text-muted-foreground' : 'text-foreground'}`}>{c.text}</p>
            {!c.resolved && (
              responding === c.id ? (
                <div className="space-y-2">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write your response..."
                    rows={3}
                    className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background outline-none focus:border-primary resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => submitResponse(c.id)} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
                      Submit response
                    </button>
                    <button onClick={() => setResponding(null)} className="px-4 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setResponding(c.id)}
                  className="px-4 py-1.5 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Respond to complaint
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}