'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  AVAILABLE_CUSTOM_TOOLS, 
  AVAILABLE_MCP_SERVERS, 
  AVAILABLE_KNOWLEDGE_BASES,
  ToolConfig 
} from '@/common/toolConfig';

interface ToolSelectionProps {
  toolConfig: ToolConfig;
  onConfigChange: (config: ToolConfig) => void;
  disabled?: boolean;
}

export default function ToolSelection({ toolConfig, onConfigChange, disabled = false }: ToolSelectionProps) {
  const handleCustomToolToggle = (toolId: string, enabled: boolean) => {
    const newTools = enabled 
      ? [...toolConfig.customTools, toolId]
      : toolConfig.customTools.filter(id => id !== toolId);
    
    onConfigChange({
      ...toolConfig,
      customTools: newTools
    });
  };

  const handleMcpServerToggle = (serverId: string, enabled: boolean) => {
    const newServers = enabled
      ? [...toolConfig.mcpServers, serverId]
      : toolConfig.mcpServers.filter(id => id !== serverId);
    
    onConfigChange({
      ...toolConfig,
      mcpServers: newServers
    });
  };

  const handleKnowledgeBaseToggle = (kbId: string, enabled: boolean) => {
    const newKbs = enabled
      ? [...toolConfig.knowledgeBases, kbId]
      : toolConfig.knowledgeBases.filter(id => id !== kbId);
    
    onConfigChange({
      ...toolConfig,
      knowledgeBases: newKbs
    });
  };

  return (
    <div className="space-y-4">
      {/* Custom Tools */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Custom Tools</h3>
        <div className="space-y-2">
          {AVAILABLE_CUSTOM_TOOLS.map(tool => (
            <div key={tool.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-sm">{tool.name}</div>
                <div className="text-xs text-gray-500">{tool.description}</div>
              </div>
              <Switch
                checked={toolConfig.customTools.includes(tool.id)}
                onCheckedChange={(enabled) => handleCustomToolToggle(tool.id, enabled)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* MCP Servers */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">MCP Servers</h3>
        <div className="space-y-2">
          {AVAILABLE_MCP_SERVERS.map(server => (
            <div key={server.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-sm">{server.name}</div>
                <div className="text-xs text-gray-500">{server.description}</div>
              </div>
              <Switch
                checked={toolConfig.mcpServers.includes(server.id)}
                onCheckedChange={(enabled) => handleMcpServerToggle(server.id, enabled)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Knowledge Bases */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Knowledge Bases</h3>
        <div className="space-y-2">
          {AVAILABLE_KNOWLEDGE_BASES.map(kb => (
            <div key={kb.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-sm">{kb.name}</div>
                <div className="text-xs text-gray-500">{kb.description}</div>
              </div>
              <Switch
                checked={toolConfig.knowledgeBases.includes(kb.id)}
                onCheckedChange={(enabled) => handleKnowledgeBaseToggle(kb.id, enabled)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}