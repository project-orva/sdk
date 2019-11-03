import http from 'http';

const handleReq = (req) => {
  return new Promise((res, rej) => {
    const data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });
    req.on('end', () => {
      if (data.length === 0) {
        rej(new Error('request is missing post body'));
        return;
      }

      res(JSON.parse(data));
    });
    req.on('error', (err) => {
      rej(err);
    });
  });
};

const HTTPServer = async (port, handler) => {
  http.createServer(async (req, res) => {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end();

      return;
    }

    const {resp, err} = await handleReq(req)
        .then((resp) => ({resp, err: undefined}) )
        .catch((err) => ({resp: undefined, err}) );

    if (err) {
      const adjustedErr = {Error: err.message};

      res.writeHead(500, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(adjustedErr));
      res.end();

      return;
    }

    const handleErr = (handlerErr) => {
      const adjustedErr = {Error: handlerErr.message};

      res.writeHead(500, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(adjustedErr));
      res.end();
    };

    const skillResponse = await handler(resp, handleErr, req);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(skillResponse));
    res.end();
  }).listen(port);
};

export default HTTPServer;
