"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { PROJECT_SIZE_OPTIONS } from '@/config/constants';
import type { AiRecommenderInput } from '@/types';
import { AiRecommenderSchema } from '@/types';
import { suggestMaterialConfiguration } from '@/ai/flows/suggest-material-configuration';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function AiRecommenderForm() {
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AiRecommenderInput>({
    resolver: zodResolver(AiRecommenderSchema),
    defaultValues: {
      projectSize: PROJECT_SIZE_OPTIONS[0],
      selectedMaterials: '',
    },
  });

  async function onSubmit(data: AiRecommenderInput) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await suggestMaterialConfiguration(data);
      setRecommendations(result.materialSuggestions);
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-headline">AI Material Recommendations</CardTitle>
        </div>
        <CardDescription>Get AI-powered suggestions for optimal material configurations based on your project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="projectSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJECT_SIZE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selectedMaterials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selected Materials / Project Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Chain-link fence for a backyard, wooden privacy fence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get Recommendations
            </Button>
          </form>
        </Form>

        {isLoading && (
          <div className="mt-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Generating recommendations...</p>
          </div>
        )}

        {recommendations && !isLoading && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{recommendations}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
