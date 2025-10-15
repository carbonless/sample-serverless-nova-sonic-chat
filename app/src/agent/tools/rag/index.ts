import { z } from 'zod';
import { zodToJsonSchemaBody } from '@/lib/utils';
import { ToolDefinition } from '../common';

const inputSchema = z.object({
  query: z.string().describe('Question to search in the knowledge base'),
  rag_id: z.string().default('ng911').describe('RAG system to query (default: ng911)'),
});

const handler = async (input: z.infer<typeof inputSchema>) => {
  const { query, rag_id } = input;
  
  try {
    const response = await fetch('https://rag.thorpe-industries.com/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rag_id,
        query,
      }),
    });

    if (!response.ok) {
      throw new Error(`RAG API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'No response from RAG system';
  } catch (error) {
    console.error('RAG query error:', error);
    return `Error querying knowledge base: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const ragTool: ToolDefinition<z.infer<typeof inputSchema>> = {
  name: 'searchKnowledge',
  handler,
  schema: inputSchema,
  toolSpec: () => ({
    name: 'searchKnowledge',
    description: 'Search specialized knowledge bases for detailed information on topics like NG911, emergency services, and technical documentation',
    inputSchema: {
      json: JSON.stringify(zodToJsonSchemaBody(inputSchema)),
    },
  }),
};