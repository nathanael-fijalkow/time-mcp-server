#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { handleGetTime, handleGetTimezone } from './lib/tools.js';

// Create server instance
const server = new Server(
  {
    name: "time-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_time",
        description: "Get the current time in a specific timezone. Provide the timezone in IANA format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')",
        inputSchema: {
          type: "object",
          properties: {
            timezone: {
              type: "string",
              description: "The timezone in IANA format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')",
            },
          },
          required: ["timezone"],
        },
      },
      {
        name: "get_timezone",
        description: "Get the timezone from a given location. The timezone is in IANA format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')",
        inputSchema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "A location (city, country, region, specific address)",
            },
          },
          required: ["location"],
        },
      },
    ],
  };
});


// Handle tool calls by delegating to encapsulated functions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_time") return await handleGetTime(args);
  if (name === "get_timezone") return await handleGetTimezone(args);

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Time MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
