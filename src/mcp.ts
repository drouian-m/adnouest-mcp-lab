import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

function codeReviewPrompt(mcpServer: McpServer) {
  mcpServer.registerPrompt(
    'code-review'
    // implémenter la solution
  );
}

export { codeReviewPrompt };
