export interface ToolConfig {
  customTools: string[];
  mcpServers: string[];
  knowledgeBases: string[];
}

export const AVAILABLE_CUSTOM_TOOLS = [
  { id: 'weather', name: 'Weather Tool', description: 'Get current weather for locations' },
  { id: 'email', name: 'Email Tool', description: 'Read, summarize, and manage Gmail emails' },
  { id: 'rag', name: 'RAG Tool', description: 'Search knowledge bases for information' }
];

export const AVAILABLE_MCP_SERVERS = [
  { id: 'fetch', name: 'Fetch Server', description: 'Fetch web content and URLs' },
  { id: 'time', name: 'Time Server', description: 'Get current time and convert timezones' },
  { id: 'filesystem', name: 'Filesystem Server', description: 'File operations (disabled in Lambda)' }
];

export const AVAILABLE_KNOWLEDGE_BASES = [
  { id: 'ng911', name: 'NG911', description: 'Emergency services and technical documentation' },
  { id: 'general', name: 'General Knowledge', description: 'General purpose knowledge base' }
];

export const DEFAULT_TOOL_CONFIG: ToolConfig = {
  customTools: ['weather', 'email', 'rag'],
  mcpServers: ['fetch', 'time'],
  knowledgeBases: ['ng911']
};