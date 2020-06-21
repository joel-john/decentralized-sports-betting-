const { Oracle } = require('@chainlink/contracts/truffle/v0.4/Oracle')
const { oracle } = require('@chainlink/test-helpers')
const contractAddresses = require('../build/contractAddresses.json')

/*
  This script mocks an oracle response using a corresponsing request tx hash
*/

const tx = process.env.BET_REQ_TXHASH || '0xa2e8068380d232e46dc55a1f3ef337139571a289a7c14b1f8824bc741c06130f'
const response = process.env.BET_RES_VALUE || 12345;

module.exports = async callback => {
  try {
    const accounts = await web3.eth.getAccounts()
    const defaultAccount = accounts[0]

    Oracle.setProvider(web3.currentProvider)
    const oc = await Oracle.at(contractAddresses.oracleContract)
    
    receipt = await web3.eth.getTransactionReceipt(tx)
    
    console.log(`Fulfilling oracle request with response: ${response} (== '${web3.utils.toHex(response)}')`)

    const request = oracle.decodeRunRequest(receipt.logs[3])
    await oc.fulfillOracleRequest(
      ...oracle.convertFufillParams(request, web3.utils.padLeft(web3.utils.toHex(response), 64), {
        from: defaultAccount,
        gas: 500000,
      }),
    )

    console.log('success')

    callback()

  } catch (ex) {
    console.error(ex)
  }


  callback()
}
