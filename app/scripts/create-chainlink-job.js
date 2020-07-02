const fetch = require('fetch')

fetch("http://localhost:6688/v2/specs", {
  "headers": {
    "accept": "application/json",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "explorer=%7B%22status%22%3A%22disconnected%22%2C%22url%22%3A%22%22%7D; clsession=MTU5MzcwOTUxMnxEdi1CQkFFQ180SUFBUkFCRUFBQVJ2LUNBQUVHYzNSeWFXNW5EQTRBREdOc2MyVnpjMmx2Ymw5cFpBWnpkSEpwYm1jTUlnQWdZVFEzWVRJNE5UUmlOVFprTkRka1ptSTBZamMzWW1NNFlqSTFNRFV6WW1JPXye0n3PSSGSDo-p-ndopwt2s5fcJjXaR0Q7TvrwkfrSyQ=="
  },
  "referrer": "http://localhost:6688/jobs/new",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "{\"initiators\":[{\"type\":\"runlog\",\"params\":{\"address\":\"0xD2405c4078805F0C2BCa615ac693CbC500ee748F\"}}],\"tasks\":[{\"type\":\"httpget\",\"confirmations\":null,\"params\":{}},{\"type\":\"jsonparse\",\"confirmations\":null,\"params\":{}},{\"type\":\"multiply\",\"confirmations\":null,\"params\":{}},{\"type\":\"ethuint256\",\"confirmations\":null,\"params\":{}},{\"type\":\"ethtx\",\"confirmations\":null,\"params\":{}}],\"startAt\":null,\"endAt\":null}",
  "method": "POST",
  "mode": "cors"
});
