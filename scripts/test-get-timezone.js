#!/usr/bin/env node

import tzLookup from 'tz-lookup';

const location = process.argv[2] || 'New York, USA';

(async () => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'time-mcp-server-test/1.0 (contact: you@example.com)'
      }
    });

    if (!res.ok) throw new Error(`Geocoding request failed: ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data || data.length === 0) {
      console.error(JSON.stringify({ error: 'Location not found', query: location }, null, 2));
      process.exit(2);
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    const display_name = data[0].display_name;

    const tz = tzLookup(lat, lon);

    console.log(JSON.stringify({ query: location, display_name, lat, lon, timezone: tz }, null, 2));
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
})();
