import { mcpConfigSchema } from '@/common/schemas';
import { main } from '../agent';
import { Handler } from 'aws-lambda';
import z from 'zod';

const toolConfigSchema = z.object({
  customTools: z.array(z.string()),
  mcpServers: z.array(z.string()),
  knowledgeBases: z.array(z.string()),
}).optional();

const eventSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  systemPrompt: z.string(),
  voiceId: z.string(),
  mcpConfig: mcpConfigSchema,
  toolConfig: toolConfigSchema,
});

export const handler: Handler<z.infer<typeof eventSchema>> = async (event, context) => {
  console.log(JSON.stringify(event));
  const { sessionId, userId, systemPrompt, voiceId, mcpConfig, toolConfig } = eventSchema.parse(event);
  await main(sessionId, userId, systemPrompt, voiceId, mcpConfig, toolConfig);
};
