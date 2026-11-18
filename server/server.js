let shipments = [
  { id: 1, trackingNumber: 'STP-1001', origin: 'Beirut', destination: 'Paris', status: 'in_transit' },
  { id: 2, trackingNumber: 'STP-1002', origin: 'Dubai', destination: 'Beirut', status: 'delivered' },
];


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
      const data = JSON.parse(body);
      console.log('Origin is:', data.origin);
      console.log('Destination is:', data.destination);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Got it!' }));
    });

    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});