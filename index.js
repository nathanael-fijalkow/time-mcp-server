#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

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
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_time") {
    const timezone = args.timezone;

    try {
      // Get current time in the specified timezone
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "long",
      });

      const formattedTime = formatter.format(now);

      return {
        content: [
          {
            type: "text",
            text: `Current time in ${timezone}:\n${formattedTime}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Invalid timezone '${timezone}'. Please use a valid IANA timezone format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo').`,
          },
        ],
        isError: true,
      };
    }
  }

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
