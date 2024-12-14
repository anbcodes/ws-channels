import WebSocket, { WebSocketServer } from 'ws';

const port = +process.argv[2] || 8080;

const wss = new WebSocketServer({
  port: 8080,
});

const channels: {[id: string]: WebSocket[]} = {};
wss.on('connection', (ws, req) => {
  if (!req.url.startsWith('/chan')) {
    console.log('Invalid connection');
    ws.close(3003);
    return;
  }
  console.log(`Connection to ${req.url}`)
  channels[req.url] ??= [];
  channels[req.url].push(ws);

  ws.on('message', (data, isBinary) => {
    channels[req.url].filter(v => v !== ws).forEach(w => w.send(data, { binary: isBinary }));
  });

  ws.on('close', () => {
    channels[req.url] = channels[req.url].filter(v => v !== ws);
  })
})

console.log(`Listening on ws://localhost:${port}`);
