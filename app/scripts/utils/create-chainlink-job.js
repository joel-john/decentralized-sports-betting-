const axios = require('axios').default
const fs = require('fs')
const oracle = require('../../build/Oracle.json')

const username = process.env.CHAINLINK_USERNAME || 'user@example.com'
const password = process.env.CHAINLINK_PASSWORD || 'password'

function createJobObj(oracleAddress) {
  return {
    "initiators": [
      {
        "type": "runlog",
        "params": {
          "address": oracleAddress
        }
      }
    ],
    "tasks": [
      {
        "type": "httpgetwithunrestrictednetworkaccess",
        "confirmations": null,
        "params": {
        }
      },
      {
        "type": "jsonparse",
        "confirmations": null,
        "params": {
        }
      },
      {
        "type": "multiply",
        "confirmations": null,
        "params": {
        }
      },
      {
        "type": "ethuint256",
        "confirmations": null,
        "params": {
        }
      },
      {
        "type": "ethtx",
        "confirmations": null,
        "params": {
        }
      }
    ],
    "startAt": null,
    "endAt": null
  }
}

module.exports = async (url, oracleAddress) => {
  const chainlinkApi = axios.create({
    baseURL: url,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return chainlinkApi.post('/sessions', { email: username, password: password })
    .then((res) => {
      // Authenticate
      const cookies = res.headers['set-cookie']
      const session = cookies[1]
      return chainlinkApi.post(
        '/v2/specs',
        createJobObj(oracleAddress),
        { headers: { Cookie: session } })
    })
  // .then((res) => {
  //   // Create new job and pass it to ui .env file for consumption
  //   const jobId = res.data.data.id
  //   const fileContent = `VUE_APP_CHAINLINK_JOBID=${jobId}\nVUE_APP_GAME_API=http://localhost:7070/api`
  //   fs.writeFileSync(`${__dirname}/../ui/.env`, fileContent)
  //   console.log(`Successfully created new job ${jobId} for oracle ${oracle.address}`)
  // })
}


// fetch("http://localhost:6688/v2/specs", {
//   "headers": {
//     "accept": "application/json",
//     "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6",
//     "content-type": "application/json",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "cookie": "explorer=%7B%22status%22%3A%22disconnected%22%2C%22url%22%3A%22%22%7D; clsession=MTU5Mzg2NTk0MnxEdi1CQkFFQ180SUFBUkFCRUFBQVJ2LUNBQUVHYzNSeWFXNW5EQTRBREdOc2MyVnpjMmx2Ymw5cFpBWnpkSEpwYm1jTUlnQWdOREkwWVdaallUTXhNbVZoTkRVMk5EZ3lOMk13TURRd09UUXpPRGc1T1dZPXzPK1-jB8WOMxSrg1dT-l_q8SvSC0-rutE-FFUE827hNg=="
//   },
//   "referrer": "http://localhost:6688/jobs/new",
//   "referrerPolicy": "no-referrer-when-downgrade",
//   "body": "{\"initiators\":[{\"type\":\"runlog\",\"params\":{\"address\":\"0xbd11539eeec8b1d4c483b03eb661e426bea77b86\"}}],\"tasks\":[{\"type\":\"httpgetwithunrestrictednetworkaccess\",\"confirmations\":null,\"params\":{}},{\"type\":\"jsonparse\",\"confirmations\":null,\"params\":{}},{\"type\":\"multiply\",\"confirmations\":null,\"params\":{}},{\"type\":\"ethuint256\",\"confirmations\":null,\"params\":{}},{\"type\":\"ethtx\",\"confirmations\":null,\"params\":{}}],\"startAt\":null,\"endAt\":null}",
//   "method": "POST",
//   "mode": "cors"
// });
