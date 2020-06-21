const Bet = artifacts.require('Bet')
const contractAddresses = require('../build/contractAddresses.json')


/*
  This script allows for a Chainlink request to be created from
  the requesting contract. Defaults to the Chainlink oracle address
  on this page: https://docs.chain.link/docs/testnet-oracles
*/

const oracleAddress =
  process.env.TRUFFLE_CL_BOX_ORACLE_ADDRESS ||
  contractAddresses.oracleContract
const jobId =
  process.env.TRUFFLE_CL_BOX_JOB_ID || '3cff0a3524694ff8834bda9cf9c779a1'
const payment = process.env.TRUFFLE_CL_BOX_PAYMENT || '1000000000000000000'
const url =
  process.env.TRUFFLE_CL_BOX_URL ||
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
const path = process.env.TRUFFLE_CL_BOX_JSON_PATH || 'USD'
const times = process.env.TRUFFLE_CL_BOX_TIMES || '100'

module.exports = async callback => {
  try {
    const accounts = await web3.eth.getAccounts()
    const defaultAccount = accounts[0]

    const bc = await Bet.deployed()
    console.log('Creating request on contract:', bc.address)
    const tx = await bc.createRequestTo(
      oracleAddress,
      web3.utils.toHex(jobId),
      payment,
      url,
      path,
      times,
      { from: defaultAccount }
    )

    console.log('Request successful!')
    console.log(`The tx hash is\n${tx.tx}`)

    callback()
  } catch (ex) {
    console.error(ex)
  }
  
}
