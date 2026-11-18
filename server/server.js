let shipments = [
  { id: 1, trackingNumber: 'STP-1001', origin: 'Beirut', destination: 'Paris', status: 'in_transit' },
  { id: 2, trackingNumber: 'STP-1002', origin: 'Dubai', destination: 'Beirut', status: 'delivered' },
];
let nextId = 3;


const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  console.log(req.method, path);

 if (req.method === 'GET' && path === '/shipments') {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(shipments));
  return;
}
  if (req.method === 'POST' && path === '/shipments') {
    let body = '';

    req.on('data', (piece) => {
      body += piece;
    });

    req.on('end', () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Body must be a JSON object' }));
        return;
      }

      if (!data.trackingNumber || !data.origin || !data.destination) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'trackingNumber, origin and destination are required' }));
        return;
      }

      const newShipment = {
        id: nextId++,
        trackingNumber: data.trackingNumber,
        origin: data.origin,
        destination: data.destination,
        status: data.status || 'pending',
      };

      shipments.push(newShipment);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newShipment));
    });

    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});