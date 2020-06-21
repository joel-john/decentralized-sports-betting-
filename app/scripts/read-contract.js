const BetContract = artifacts.require('Bet')
const contractAddresses = require('../build/contractAddresses.json')

/*
  This script makes it easy to read the data variable
  of the requesting contract.
*/

console.log("Your contracts are deployed under the following addresses:")
console.log(contractAddresses)

module.exports = async callback => {
  try {
    const bc = await BetContract.deployed()

    const state = {
      playerA: await bc.playerA.call(),
      playerB: await bc.playerB.call(),
      linkContract: await bc.getChainlinkToken.call(),
      gameId: await bc.gameId.call(),
      playerAPrediction: await bc.playerAPrediction.call(),
      observedGameOutcome: await bc.observedGameOutcome.call(),
      isActive: await bc.isActive.call(),
    }

    console.log('The Bet contract has the following state:')
    console.log(state)
  } catch (ex) {
    console.error(ex)
  }


  callback()
}
