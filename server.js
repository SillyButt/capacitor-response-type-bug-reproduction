const http = require('node:http');
const fs = require('node:fs/promises');

async function requestListener(req, res) {
  switch (req.url) {
    case '/get-document':
      const file = await fs.readFile('dummy.pdf', { encoding: 'binary' });
      res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
      res.write(file, 'binary');
      res.end();
      break;

    default:
      res.writeHead(404);
      break;
  }
}

const server = http.createServer(requestListener);

const [host, port] = ['192.168.100.6', 8000];
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
