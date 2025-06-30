"use client";

import { useState, useEffect } from 'react';
import useUser from '@/hooks/use-user';
import { useMedicalSummary } from '@/hooks/use-medical-summary';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BellIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function AlertConfigurationPopover() {
  const { data: user } = useUser();
  const { data: medicalSummary, isLoading: isSummaryLoading } = useMedicalSummary();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSendAlert = async () => {
    if (!email) {
      toast.error('Email is required.');
      return;
    }
    if (!medicalSummary) {
      toast.error('Medical summary is not available yet.');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, medicalSummary }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send alert.');
      }

      toast.success('Health summary sent successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <BellIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Configure Alerts</h4>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive detection alerts.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <Button onClick={handleSendAlert} disabled={isSending || isSummaryLoading}>
            {isSending
              ? 'Sending...'
              : isSummaryLoading
              ? 'Loading Summary...'
              : 'Send Test Alert'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
