import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const eventBridge = new EventBridgeClient({});

export async function handler(input) {
  const records = normalize(input);
  const enriched = records.map(record => ({
    ...record,
    processedAt: new Date().toISOString(),
    riskScore: scoreRisk(record),
    segment: segment(record)
  }));

  if (process.env.EVENT_BUS_NAME) {
    await eventBridge.send(new PutEventsCommand({
      Entries: enriched.map(event => ({
        EventBusName: process.env.EVENT_BUS_NAME,
        Source: 'analytics.ingestion',
        DetailType: 'UserBehaviorEvent',
        Detail: JSON.stringify(event)
      }))
    }));
  }

  return {
    statusCode: 202,
    body: JSON.stringify({ accepted: enriched.length, events: enriched })
  };
}

function normalize(input) {
  if (Array.isArray(input?.records)) {
    return input.records;
  }
  if (input?.body) {
    const body = typeof input.body === 'string' ? JSON.parse(input.body) : input.body;
    return Array.isArray(body) ? body : [body];
  }
  return [input];
}

function scoreRisk(event) {
  const latencyWeight = Math.min(1, Number(event.latencyMs ?? 0) / 1200);
  const lowValueWeight = Number(event.value ?? 0) === 0 ? 0.25 : 0;
  return Number(Math.min(0.99, latencyWeight * 0.65 + lowValueWeight).toFixed(3));
}

function segment(event) {
  if (event.device === 'mobile' && event.country === 'IN') return 'mobile-growth';
  if (Number(event.value ?? 0) > 250) return 'high-value';
  return 'standard';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  handler({ records: [{ userId: 'demo', device: 'mobile', country: 'IN', value: 0, latencyMs: 840 }] })
    .then(result => console.log(result));
}
