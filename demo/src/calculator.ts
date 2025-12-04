import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function calculatorTool(mcpServer: McpServer) {
  mcpServer.registerTool(
    'calculator-add',
    {
      description: 'A simple calculator tool that can add two numbers.',
      inputSchema: {
        a: z.number().describe('The first number.'),
        b: z.number().describe('The second number.'),
      },
      outputSchema: { result: z.number() },
    },
    async ({ a, b }) => {
      const output = { result: a + b };
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );
}
