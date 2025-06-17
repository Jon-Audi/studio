
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Send } from "lucide-react";
import type { FullEstimateData } from '@/types';
import { useState } from "react";

interface ResultsCardProps {
  title: string;
  description?: string;
  data: Record<string, string | number | undefined>;
  icon?: React.ReactNode;
  onSendToInvoice?: (estimatePayload: FullEstimateData) => Promise<{ success: boolean; message: string; quoteId?: string }>;
  fullEstimateData?: FullEstimateData;
}

export function ResultsCard({ title, description, data, icon, onSendToInvoice, fullEstimateData }: ResultsCardProps) {
  const [isSending, setIsSending] = useState(false);
  
  const validEntries = Object.entries(data).filter(([, value]) => value !== undefined && value !== null && value !== '' && !(typeof value === 'number' && isNaN(value)));

  if (validEntries.length === 0 && !onSendToInvoice) { // Only return null if no data AND no send to invoice option
    return null;
  }

  const handleSend = async () => {
    if (onSendToInvoice && fullEstimateData) {
      setIsSending(true);
      await onSendToInvoice(fullEstimateData);
      setIsSending(false);
    }
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon || <CheckCircle2 className="h-6 w-6 text-accent" />}
          <CardTitle className="font-headline">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {validEntries.length > 0 && (
        <CardContent>
          <ul className="space-y-2">
            {validEntries.map(([key, value]) => (
              <li key={key} className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
      {onSendToInvoice && fullEstimateData && (
        <CardFooter>
          <Button onClick={handleSend} disabled={isSending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Send className="mr-2 h-4 w-4" />
            {isSending ? 'Sending...' : 'Send to DFS Invoicing'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
