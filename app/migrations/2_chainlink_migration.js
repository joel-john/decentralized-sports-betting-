const LinkToken = artifacts.require('LinkToken')
const Oracle = artifacts.require('Oracle')

const fs = require('fs');

module.exports = (deployer, network, [defaultAccount]) => {
  if (network === 'ui') {
    deployer
      .deploy(LinkToken, { from: defaultAccount })
      .then(link => {
        return deployer
          .deploy(Oracle, link.address, { from: defaultAccount })
          .then(oracle => {
            console.log(link.address)
            console.log(oracle.address)
            // After deployment, copy artifacts to ui folder so that
            // the UI can utilize those
            const contracts = [
              { name: 'LinkToken', contract: link },
              { name: 'Oracle', contract: oracle }
            ]

            contracts.forEach((c) => {
              const contractContext = {address: c.contract.address, abi: c.contract.abi}
              const data = JSON.stringify(contractContext)
              fs.writeFileSync(`${__dirname}/../build/${c.name}.json`, data);
              fs.writeFileSync(`${__dirname}/../ui/src/contracts/${c.name}.json`, data);
            })
          })
      })
  }
}
