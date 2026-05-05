// src/components/shopowner/DashboardProfile.jsx
import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DashboardProfile({ shop, onSave, categories, platforms }) {
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [form,    setForm]      = useState({
    name:        shop.name        || '',
    description: shop.description || '',
    category:    shop.category    || '',
    platform:    shop.platform    || '',
    profile_url: shop.profile_url || '',
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(form);
    setEditing(false);
    setSaving(false);
  }

  function handleCancel() {
    setForm({
      name:        shop.name        || '',
      description: shop.description || '',
      category:    shop.category    || '',
      platform:    shop.platform    || '',
      profile_url: shop.profile_url || '',
    });
    setEditing(false);
  }

  const fields = [
    { label: 'Shop Name',      key: 'name',        type: 'input' },
    { label: 'Description',    key: 'description', type: 'textarea' },
    { label: 'Category',       key: 'category',    type: 'select', options: categories },
    { label: 'Platform',       key: 'platform',    type: 'select', options: platforms },
    { label: 'Profile URL',    key: 'profile_url', type: 'input' },
  ];

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-extrabold">Shop Profile</h1>
        {!editing ? (
          <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel} disabled={saving}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-background rounded-2xl border border-border/50 p-5 space-y-4">
        {fields.map(({ label, key, type, options }) => (
          <div key={key} className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{label}</label>
            {!editing ? (
              <p className="text-sm text-muted-foreground px-1">{form[key] || '—'}</p>
            ) : type === 'textarea' ? (
              <Textarea
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={3}
                className="resize-none"
              />
            ) : type === 'select' ? (
              <Select value={form[key]} onValueChange={(v) => handleChange(key, v)}>
                <SelectTrigger><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
                <SelectContent>
                  {(options || []).map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Read-only info */}
      <div className="bg-background rounded-2xl border border-border/50 p-5 space-y-3">
        <h2 className="font-heading font-semibold text-sm">Account Info</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-muted-foreground text-xs">Trust Score</p><p className="font-semibold">{shop.trust_score || 0}%</p></div>
          <div><p className="text-muted-foreground text-xs">Profile Completeness</p><p className="font-semibold">{shop.profile_completeness || 0}%</p></div>
          <div><p className="text-muted-foreground text-xs">License Verified</p><p className="font-semibold">{shop.license_verified ? '✓ Yes' : '✗ No'}</p></div>
          <div><p className="text-muted-foreground text-xs">Shop ID</p><p className="font-mono text-xs text-muted-foreground">{shop.id}</p></div>
        </div>
      </div>
    </div>
  );
}
