"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ResultsCardProps {
  title: string;
  description?: string;
  data: Record<string, string | number | undefined>;
  icon?: React.ReactNode;
}

export function ResultsCard({ title, description, data, icon }: ResultsCardProps) {
  const validEntries = Object.entries(data).filter(([, value]) => value !== undefined && value !== null && value !== '' && !(typeof value === 'number' && isNaN(value)));

  if (validEntries.length === 0) {
    return null;
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon || <CheckCircle2 className="h-6 w-6 text-accent" />}
          <CardTitle className="font-headline">{title}</CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
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
    </Card>
  );
}
