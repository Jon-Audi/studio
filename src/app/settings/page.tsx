
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">Settings</CardTitle>
            </div>
            <CardDescription>Manage your catalog and application settings here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Catalog management features are coming soon.</p>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
