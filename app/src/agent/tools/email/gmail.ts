import { z } from 'zod';
import { zodToJsonSchemaBody } from '@/lib/utils';
import { ToolDefinition } from '../common';

const inputSchema = z.object({
  action: z.enum(['read', 'summarize', 'draft']).describe('Email action to perform'),
  query: z.string().optional().describe('Search query for emails'),
  count: z.number().default(10).describe('Number of emails to retrieve'),
});

const handler = async (input: z.infer<typeof inputSchema>) => {
  const { action, query, count } = input;
  
  try {
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    if (!accessToken) {
      return 'Gmail access token not configured. Please set GMAIL_ACCESS_TOKEN environment variable.';
    }
    
    const baseUrl = 'https://gmail.googleapis.com/gmail/v1/users/me';
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    
    switch (action) {
      case 'read': {
        const searchQuery = query ? `q=${encodeURIComponent(query)}` : 'q=is:unread';
        const response = await fetch(`${baseUrl}/messages?${searchQuery}&maxResults=${count}`, { headers });
        
        if (!response.ok) {
          return `Gmail API error: ${response.status} ${response.statusText}`;
        }
        
        const data = await response.json();
        const emails = [];
        
        for (const message of data.messages || []) {
          const msgResponse = await fetch(`${baseUrl}/messages/${message.id}`, { headers });
          if (msgResponse.ok) {
            const msgData = await msgResponse.json();
            const headersList = msgData.payload.headers;
            
            emails.push({
              id: message.id,
              subject: headersList.find((h: any) => h.name === 'Subject')?.value || 'No Subject',
              from: headersList.find((h: any) => h.name === 'From')?.value || 'Unknown',
              date: new Date(parseInt(msgData.internalDate)).toISOString(),
              snippet: msgData.snippet,
              priority: headersList.find((h: any) => h.name === 'X-Priority')?.value === '1' ? 'high' : 'normal'
            });
          }
        }
        
        return { emails, total: emails.length };
      }
      
      case 'summarize': {
        const response = await fetch(`${baseUrl}/messages?q=is:unread&maxResults=100`, { headers });
        if (!response.ok) {
          return `Gmail API error: ${response.status} ${response.statusText}`;
        }
        
        const data = await response.json();
        const unreadCount = data.resultSizeEstimate || 0;
        
        return {
          summary: `You have ${unreadCount} unread emails.`,
          unread: unreadCount,
          highPriority: 0
        };
      }
      
      case 'draft':
        return {
          draft: 'Based on the context, here is a suggested response: Thank you for your email. I will review this and get back to you soon.',
          suggestions: ['Personalize greeting', 'Add specific timeline', 'Include next steps']
        };
      
      default:
        return 'Invalid email action';
    }
  } catch (error) {
    return `Error processing email: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const emailTool: ToolDefinition<z.infer<typeof inputSchema>> = {
  name: 'manageEmail',
  handler,
  schema: inputSchema,
  toolSpec: () => ({
    name: 'manageEmail',
    description: 'Read, summarize, and manage user emails from Gmail',
    inputSchema: {
      json: JSON.stringify(zodToJsonSchemaBody(inputSchema)),
    },
  }),
};