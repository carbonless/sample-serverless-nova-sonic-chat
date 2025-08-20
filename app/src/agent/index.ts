import type { EventsChannel } from 'aws-amplify/data';
import { MessageRepository } from '@/common/messageRepository';
import { NovaStream } from './nova-stream';
import './amplify';
import { SessionRepository } from '@/common/sessionRepository';
import { dispatchEvent, processResponseStream, initializeSubscription } from './events';
import { voiceConfigurations } from './voices';
import { getWeatherTool } from './tools/weather';

export const main = async (sessionId: string, userId: string, systemPrompt: string, voiceId: string) => {
  let channel: EventsChannel | undefined = undefined;
  const context: { stream?: NovaStream } = {};
  const messageRepository = new MessageRepository();
  const sessionRepository = new SessionRepository();
  const startedAt = Date.now();
  let endReason = '';

  try {
    const voiceConfig = voiceConfigurations[voiceId];
    if (!voiceConfig) throw new Error(`Invalid voiceId: ${voiceId}`);

    const system = `
${systemPrompt}

${voiceConfig.additionalPrompt}
`.trim();

    await sessionRepository.updateSystemPrompt(userId, sessionId, system);

    console.log(`session ${sessionId} initialized`);

    const channelPath = `/${process.env.EVENT_BUS_NAMESPACE}/user/${userId}/${sessionId}`;
    channel = await initializeSubscription(channelPath, context);

    console.log('Subscribed to the channel');

    // Without this sleep, the error below is sometimes thrown
    // "Subscription has not been initialized"
    await new Promise((s) => setTimeout(s, 1000));

    const tools = [
      //
      getWeatherTool,
    ];

    // Start response stream
    while (true) {
      console.log('starting/resuming a session');
      const chatHistory = await messageRepository.getMessages(sessionId);
      const stream = new NovaStream(voiceId, system, tools);
      context.stream = stream;
      await stream.open(chatHistory);
      const res = await processResponseStream(channel, stream, sessionId, startedAt);
      stream.close();
      if (res.state == 'success') {
        console.log(`session finished with state ${res.state}`);
        break;
      }
      // resume the session in the next loop
    }
  } catch (e) {
    console.error('Error in main process', e);
    endReason = (e as any).message ?? 'Internal Server Error';
  } finally {
    try {
      if (channel) {
        console.log('Sending "end" event...');
        await dispatchEvent(channel, { event: 'end', data: { reason: endReason } });

        console.log('Close the channel');
        channel.close();
      }

      console.log('Session ended.');
    } catch (e) {
      console.error('Error during finalization', e);
    }
  }
};
