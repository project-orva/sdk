import http from 'http';

const parseRequest = (req: any) => {
  return new Promise((res, rej) => {
    const data: Array<string> = [];
    req.on('data', (chunk: any) => {
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
    req.on('error', (err: string) => {
      rej(err);
    });
  });
};


const handleErr = (
  res: http.ServerResponse,
) => (handlerErr: { message: string }) => {
  const adjustedErr = { Error: handlerErr.message };

  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(adjustedErr));
  res.end();

  return;
};

type Handler = (
  resp: any,
  handleErr: ( f: { message: string }) => void,
  req: http.IncomingMessage,
) => string

const HTTPServer = async (port: number, handler: Handler) => {
  http.createServer(async (req, res) => {
    const { resp, err } = await parseRequest(req)
      .then((resp) => ({ resp, err: undefined }))
      .catch((err) => ({ resp: undefined, err }));

    if (err) {
      const adjustedErr = { Error: err.message };

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(adjustedErr));
      res.end();

      return;
    }

    const skillResponse = await handler(resp, handleErr(res), req);
    if (!skillResponse) {
      return;
    }

    const jsonResp = JSON.stringify(skillResponse);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(jsonResp);
    res.end();
  }).listen(port);
};

export default HTTPServer;
