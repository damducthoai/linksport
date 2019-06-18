import * as http from 'http';

const server = http.createServer((req, res) => {

 

  req.on('data', (chunk) => {
    const regBody: Uint8Array[] = [];
    regBody.push(chunk);
    const regBodyJson = Buffer.concat(regBody).toString();
    res.end('data received')
  })

});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);