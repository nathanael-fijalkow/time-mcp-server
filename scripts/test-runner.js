#!/usr/bin/env node
import assert from 'assert/strict';
import { handleGetTime, handleGetTimezone } from '../lib/tools.js';

async function run() {
  console.log('Running quick tool tests with assertions...');

  const loc = 'New York, USA';
  console.log(`\nTesting get_timezone for: ${loc}`);
  const tzRes = await handleGetTimezone({ location: loc });
  console.log(JSON.stringify(tzRes, null, 2));

  // Basic assertion: returned text should contain a timezone like 'America/'
  const tzText = tzRes && tzRes.content && tzRes.content[0] && tzRes.content[0].text;
  assert.ok(tzText, 'get_timezone did not return text content');
  assert.match(tzText, /[A-Za-z_-]+\/[A-Za-z_+-]+/, 'get_timezone did not include an IANA timezone');

  const timezone = 'America/New_York';
  console.log(`\nTesting get_time for: ${timezone}`);
  const timeRes = await handleGetTime({ timezone });
  console.log(JSON.stringify(timeRes, null, 2));

  const timeText = timeRes && timeRes.content && timeRes.content[0] && timeRes.content[0].text;
  assert.ok(timeText && timeText.includes('Current time in'), 'get_time did not return expected text');

  console.log('\nAll assertions passed.');
}

run().catch((err) => {
  console.error('Test runner error:');
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
