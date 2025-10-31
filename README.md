# Time MCP Server

A basic Model Context Protocol (MCP) server that provides current time information for different timezones.

## Features

- Get current time in any timezone using IANA timezone format
- Simple and lightweight implementation
- Uses the MCP SDK for standard protocol compliance

## Installation

```bash
npm install
```

## Usage

### Running the Server

```bash
npm start
```

## Timezone approach

This project uses a free, offline-friendly approach to map locations to IANA timezones:

- Geocoding: Nominatim (OpenStreetMap) — free service, please respect their usage policy and include a valid User-Agent.
- Timezone mapping: `tz-lookup` — local mapping from lat/lon to IANA timezone.

### Test locally (quick)

Run the small test runner which geocodes a sample location and asserts expected results:

```bash
npm test
```

This runs `scripts/test-runner.js` and will exit with a non-zero code if assertions fail.

### Available Tools

#### `get_time`

Gets the current time in a specific timezone.

**Parameters:**
- `timezone` (string, required): The timezone in IANA format (e.g., 'America/New_York', 'Europe/London', 'Asia/Tokyo')

**Example:**
```json
{
  "timezone": "America/New_York"
}
```

## Common Timezones

- `America/New_York` - Eastern Time
- `America/Chicago` - Central Time
- `America/Denver` - Mountain Time
- `America/Los_Angeles` - Pacific Time
- `Europe/London` - UK Time
- `Europe/Paris` - Central European Time
- `Asia/Tokyo` - Japan Standard Time
- `Asia/Shanghai` - China Standard Time
- `Australia/Sydney` - Australian Eastern Time

For a complete list of IANA timezones, see: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

## MCP Configuration

To use this server with an MCP client, add it to your MCP settings:

```json
{
  "mcpServers": {
    "time": {
      "command": "node",
      "args": ["/path/to/time-mcp-server/index.js"]
    }
  }
}
```

## License

MIT
