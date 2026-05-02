import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PROFILE_ITEMS = [
  { key: 'name',        label: 'Shop name registered',         pts: 0 },
  { key: 'shop_icon',   label: 'Logo uploaded',                pts: 0 },
  { key: 'platform',    label: 'Platform linked',              pts: 0 },
  { key: 'license',     label: 'Trade license uploaded',       pts: 2, missing: true },
  { key: 'description', label: 'Shop description',             pts: 1 },
  { key: 'contact',     label: 'Contact / WhatsApp number',    pts: 1, missing: true },
];

export default function DashboardProfile({ shop, onSave, categories, platforms }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(shop);
  const [saving, setSaving] = useState(false);

  const completedItems = PROFILE_ITEMS.filter((item) => {
    if (item.missing) return false;
    return !!shop[item.key];
  });
  const completionPct = Math.round((completedItems.length / PROFILE_ITEMS.length) * 100);

  async function handleSave() {
    setSaving(true);
    await onSave(editData);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="font-heading text-xl font-extrabold">Shop profile</h1>
        <p className="text-sm text-muted-foreground">Complete your profile to improve your trust score</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        {/* Completeness bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">Overall completion</span>
            <span className="font-bold text-amber-600">{completionPct}%</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Complete all items to earn full 10 points from this factor.</p>
        </div>

        {/* Item list */}
        <div className="space-y-2">
          {PROFILE_ITEMS.map((item) => {
            const done = !item.missing && !!shop[item.key];
            return (
              <div key={item.key} className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${done ? 'bg-primary/5' : 'bg-amber-50'}`}>
                <span>{item.label}</span>
                {done
                  ? <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Done</span>
                  : <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {item.pts > 0 ? `Missing — +${item.pts} pt${item.pts > 1 ? 's' : ''}` : 'Incomplete'}
                    </span>}
              </div>
            );
          })}
        </div>

        <hr className="border-border" />

        {/* Edit form */}
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="w-full gap-2">
            <Edit2 className="h-4 w-4" /> Edit shop profile
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Shop Name</label>
                <Input value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <Select value={editData.category} onValueChange={(v) => setEditData({ ...editData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Platform</label>
                <Select value={editData.platform} onValueChange={(v) => setEditData({ ...editData, platform: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Profile URL</label>
                <Input value={editData.profile_url || ''} onChange={(e) => setEditData({ ...editData, profile_url: e.target.value })} />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <Textarea value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
                <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => { setEditing(false); setEditData(shop); }} className="gap-2">
                <X className="h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}