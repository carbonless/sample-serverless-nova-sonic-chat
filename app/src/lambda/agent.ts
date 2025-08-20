import { main } from '../agent';
import { Handler } from 'aws-lambda';
import z from 'zod';

const eventSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  systemPrompt: z.string(),
  voiceId: z.string(),
});

export const handler: Handler<z.infer<typeof eventSchema>> = async (event, context) => {
  console.log(event);
  const { sessionId, userId, systemPrompt, voiceId } = eventSchema.parse(event);
  await main(sessionId, userId, systemPrompt, voiceId);
};
