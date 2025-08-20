import { getSession } from '@/lib/auth';
import { SessionRepository } from '@/common/sessionRepository';
import VoiceChatClient from './components/voice-chat-client';

async function getConversations(userId: string) {
  const sessionRepository = new SessionRepository();
  const sessions = await sessionRepository.getSessions(userId);

  return sessions.map((session) => ({
    id: session.sessionId,
    createdAt: new Date(session.createdAt),
  }));
}

export default async function VoiceChatPage() {
  const authSession = await getSession();
  const conversations = await getConversations(authSession.userId);

  return <VoiceChatClient initialConversations={conversations} userId={authSession.userId} />;
}
