import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { lang } = useLang();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !message) { toast.error('Please fill in all fields'); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setName(''); setEmail(''); setMessage('');
    setSending(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold">{t(lang, 'contactUs')}</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Have questions or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Mail, label: 'Email', value: 'support@trustpulse.com' },
          { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
          { icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
        ].map((item) => (
          <div key={item.label} className="bg-card rounded-2xl border border-border/50 p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
              <item.icon className="h-6 w-6 text-primary" />
            </div>
            <p className="font-heading font-semibold">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 space-y-5 max-w-2xl mx-auto">
        <h2 className="font-heading text-xl font-bold">{t(lang, 'sendMessage')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t(lang, 'name')}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t(lang, 'yourName')} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t(lang, 'email')}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t(lang, 'yourEmail')} className="rounded-xl" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t(lang, 'message')}</label>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t(lang, 'howCanWeHelp')} rows={5} className="rounded-xl resize-none" />
        </div>
        <Button type="submit" disabled={sending} className="w-full h-12 rounded-2xl gap-2">
          {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          {sending ? 'Sending...' : t(lang, 'sendMessage')}
        </Button>
      </form>
    </div>
  );
}