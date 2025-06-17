
'use server'; // Or remove if not directly used by server components and only client-side fetch

import type { FullEstimateData } from '@/types';

const DFS_INVOICING_API_URL = process.env.NEXT_PUBLIC_DFS_INVOICING_API_URL || 'https://your-dfs-invoicing-app-api-endpoint.com/api/quote'; // Replace with your actual API endpoint

interface SendEstimateResponse {
  success: boolean;
  message: string;
  quoteId?: string;
}

export async function sendEstimateToInvoicingService(estimateData: FullEstimateData): Promise<SendEstimateResponse> {
  if (!DFS_INVOICING_API_URL || DFS_INVOICING_API_URL === 'https://your-dfs-invoicing-app-api-endpoint.com/api/quote') {
    console.error('DFS Invoicing API URL is not configured. Please set NEXT_PUBLIC_DFS_INVOICING_API_URL in your .env file.');
    // To simulate an error for demonstration if URL is not set:
    // return { success: false, message: 'Invoicing API URL not configured.' };
    
    // For now, let's simulate a success to allow UI testing without a backend.
    // In a real scenario, this would be an error.
    console.warn('Simulating successful invoice creation as API URL is not configured.');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return { success: true, message: 'Estimate sent to invoicing (simulated).', quoteId: `SIM-${Date.now()}` };
  }

  try {
    const response = await fetch(DFS_INVOICING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authorization headers, e.g., API key
        // 'Authorization': `Bearer YOUR_API_KEY_HERE`
      },
      body: JSON.stringify(estimateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to send estimate. Invalid response from server.' }));
      return { success: false, message: errorData.message || `Server responded with ${response.status}` };
    }

    const responseData = await response.json();
    return { success: true, message: responseData.message || 'Estimate successfully sent to invoicing!', quoteId: responseData.quoteId };
  } catch (error) {
    console.error('Error sending estimate to invoicing:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to send estimate: ${errorMessage}` };
  }
}
