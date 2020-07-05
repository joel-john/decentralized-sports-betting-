const http = require('http');


module.exports = async (_host, _port) => {
  if (!_host) _host = 'localhost'
  if (!_port) _port = 6688
  const session = await getSessionCookie(_host, _port)
  return getAddr(session, _host, _port);
};

function getSessionCookie(host, port) {
  return new Promise((resolve, reject) => {
    const opts = {
      host,
      port,
      path: '/sessions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(opts, (res) => {
      res.setEncoding('utf-8');
      
      res.on('data', () => { /* DO NOTHING */ });
      res.on('end', () => {
        resolve(res.headers["set-cookie"][1]);
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    const reqBody = JSON.stringify({
      email: 'user@example.com',
      password: 'password'
    });

    req.write(reqBody);
    req.end();
  });
}

function getAddr(sessionCookie, host, port) {
  return new Promise((resolve, reject) => {
    const opts = {
      host,
      port,
      path: '/v2/user/balances',
      method: 'GET',
      headers: {
        'Cookie': sessionCookie
      }
    };
    
    const req = http.request(opts, (res) => {
      res.setEncoding('utf-8')
      
      let resBody = '';
      res.on('data', (chunk) => {
        resBody += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(resBody).data[0].id);
      });

      res.on('error', (err) => {
        reject(err);
      });
    });

    req.end();
  });
}
