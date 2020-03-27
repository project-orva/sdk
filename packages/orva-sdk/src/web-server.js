import http from 'http';

const handleReq = (req) => {
  return new Promise((res, rej) => {
    const data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });
    req.on('end', () => {
      if (req.method === 'POST') {
        if (data.length === 0) {
          rej(new Error('request is missing post body'));
          return;
        }

        res(JSON.parse(data));
      }

      res();
    });
    req.on('error', (err) => {
      rej(err);
    });
  });
};

const HTTPServer = async (port, handler) => {
  http.createServer(async (req, res) => {
    const { resp, err } = await handleReq(req)
      .then((resp) => ({ resp, err: undefined }))
      .catch((err) => ({ resp: undefined, err }));

    if (err) {
      const adjustedErr = { Error: err.message };

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(adjustedErr));
      res.end();

      return;
    }

    const handleErr = (handlerErr) => {
      const adjustedErr = { Error: handlerErr.message };

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(adjustedErr));
      res.end();

      return;
    };

    const skillResponse = await handler(resp, handleErr, req);
    if(!skillResponse) {
      return;
    }

    const jsonResp = JSON.stringify(skillResponse);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(typeof jsonResp === "string" ? JSON.stringify(skillResponse) : '{ "Error": "invalid response type, check the return value and try again." }');
    res.end();
  }).listen(port);
};

export default HTTPServer;
