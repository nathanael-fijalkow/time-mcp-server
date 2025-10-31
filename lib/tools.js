import tzLookup from 'tz-lookup';

// Geocode helper using Nominatim (OpenStreetMap). Free to use with attribution.
export async function geocodeLocation(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: {
      // Nominatim requires a valid User-Agent identifying the application
      'User-Agent': 'time-mcp-server/1.0 (contact: nathanael.fijalkow@gmail.com)'
    }
  });

  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data || data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    display_name: data[0].display_name
  };
}

export async function handleGetTime(args) {
  const timezone = args.timezone;

  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long'
    });

    const formattedTime = formatter.format(now);

    return {
      content: [ { type: 'text', text: `Current time in ${timezone}:\n${formattedTime}` } ]
    };
  } catch (error) {
    return {
      content: [ { type: 'text', text: `Error: Invalid timezone '${timezone}'.` } ],
      isError: true
    };
  }
}

export async function handleGetTimezone(args) {
  const location = args.location;

  try {
    if (!location || typeof location !== 'string') {
      return {
        content: [ { type: 'text', text: "Error: 'location' is required and must be a string." } ],
        isError: true
      };
    }

    const geo = await geocodeLocation(location);
    if (!geo) {
      return { content: [ { type: 'text', text: `Location not found: '${location}'` } ], isError: true };
    }

    const iana = tzLookup(geo.lat, geo.lon);

    return {
      content: [ { type: 'text', text: `Location: ${geo.display_name}\nLatitude: ${geo.lat}\nLongitude: ${geo.lon}\nTimezone (IANA): ${iana}` } ]
    };
  } catch (error) {
    return {
      content: [ { type: 'text', text: `Error: ${error.message}` } ],
      isError: true
    };
  }
}
