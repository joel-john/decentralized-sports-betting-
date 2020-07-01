const BetContract = artifacts.require('Betting') // Change this to 'Bet' as desired
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')

/*
  This script is meant to assist with funding the requesting
  contract with LINK. It will send 1 LINK to the requesting
  contract for ease-of-use. Any extra LINK present on the contract
  can be retrieved by calling the withdrawLink() function.
*/

const payment = process.env.TRUFFLE_CL_BOX_PAYMENT || '1000000000000000000'

module.exports = async callback => {
  // Modified from the exmaple code since it did not work out of the box...
  try {
    const accounts = await web3.eth.getAccounts()
    const defaultAccount = accounts[0]

    const bc = await BetContract.deployed()
    const tokenAddress = await bc.getChainlinkToken()
    
    LinkToken.setProvider(web3.currentProvider)
    const token = await LinkToken.at(tokenAddress)
    console.log('Funding contract:', bc.address)
    const tx = await token.transfer(bc.address, payment, {from: defaultAccount})

    const balance = await token.balanceOf.call(bc.address)
    console.log(`LINK balance of Bet: ${balance.toString()}`)

    const totalSupply = await token.totalSupply.call()
    console.log(`Total LINK supply: ${totalSupply.toString()}`)

    callback(tx.tx)
  } catch (ex) {
    console.error(ex)
  }
}
