const MyContract = null
const Bet = null
const Betting = artifacts.require('Betting')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const Oracle = artifacts.require('Oracle')

// const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
// const { Oracle } = require('@chainlink/contracts/truffle/v0.4/Oracle')

const fs = require('fs');

module.exports = (deployer, network, [defaultAccount, playerA, playerB]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  if (!network.startsWith('live')) {
    LinkToken.setProvider(deployer.provider)
    Oracle.setProvider(deployer.provider)

    switch (network) {
      // case 'bet':
      //   deployer.deploy(LinkToken, { from: defaultAccount }).then(link => {
      //     return deployer
      //       .deploy(Oracle, link.address, { from: defaultAccount })
      //       .then(oracle => {
      //         return deployer
      //           .deploy(Bet, link.address, playerA, playerB)
      //           .then(bet => {
      //             const contractAddresses = {
      //               linkToken: link.address,
      //               oracleContract: oracle.address,
      //               betContract: bet.address
      //             }
      //             let data = JSON.stringify(contractAddresses);
      //             fs.writeFileSync(__dirname + '/../build/contractAddresses.json', data);
      //           })
      //       })
      //   })
      //   break
        case 'ui':
          return deployer.then(() => {
            return LinkToken.at(require('../build/LinkToken.json').address)
          }).then(link => {
            console.log(link.address)
            return deployer.deploy(Betting, link.address, { from: defaultAccount })
          }).then(betting => {
              const contractContext = {address: betting.address, abi: betting.abi}
              const data = JSON.stringify(contractContext)
              fs.writeFileSync(`${__dirname}/../build/Betting.json`, data);
              fs.writeFileSync(`${__dirname}/../ui/src/contracts/Betting.json`, data);
          })
        break
        case 'demo':
          console.log('hello')
          return deployer.then(() => {
            return LinkToken.at(require('../build/LinkToken.json').address)
          }).then(link => {
            console.log(link.address)
            return deployer.deploy(Betting, link.address, { from: defaultAccount })
          }).then(betting => {
              const contractContext = {address: betting.address, abi: betting.abi}
              const data = JSON.stringify(contractContext)
              fs.writeFileSync(`${__dirname}/../build/Betting.json`, data);
              fs.writeFileSync(`${__dirname}/../ui/src/contracts/Betting.json`, data);
          })
        break
      default:
        deployer.deploy(LinkToken, { from: defaultAccount }).then(link => {
          return deployer
            .deploy(Oracle, link.address, { from: defaultAccount })
            .then(() => {
              return deployer
                .deploy(MyContract, link.address)
                .then(() => {
                  return deployer.deploy(Bet, link.address, playerA, playerB)
                })
            })
        })
        break
    }

  } else {
    // For live networks, use the 0 address to allow the ChainlinkRegistry
    // contract automatically retrieve the correct address for you
    deployer.deploy(MyContract, '0x0000000000000000000000000000000000000000')
  }
}
