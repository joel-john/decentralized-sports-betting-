const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const Oracle = artifacts.require('Oracle')

const fs = require('fs');

module.exports = async (deployer, network, [defaultAccount]) => {
  LinkToken.setProvider(deployer.provider)
  
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

  if (network === 'demo') {
    const OracleDemoCreator = artifacts.require('OracleDemoCreator')
    const PreCoordinator = artifacts.require('PreCoordinator')
    const oracleAbi = require('@chainlink/contracts/truffle/v0.5/Oracle').abi

    let link;

    deployer.deploy(LinkToken, { from: defaultAccount })
      .then(_link => {
        link = _link
        return deployer.deploy(OracleDemoCreator, link.address, { from: defaultAccount })
      }).then(oracleDemoCreator => {
        return OracleDemoCreator.deployed()
      }).then(odc => {
        return odc.getOracles.call()
      }).then(oracles => {
        console.log(oracleAbi)
        oracles.forEach((oracle, i) => {
          // Write oracle addresses to build
          const contractContext = {address: oracle}
          const data = JSON.stringify(contractContext)
          fs.writeFileSync(`${__dirname}/../build/Oracle${i}.json`, data);
        })
        return deployer.deploy(PreCoordinator, link.address, { from: defaultAccount })
      }).then(oracle => {
        // Pretend the pre coordinator is also an oracle
        // for compabtility
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
      // .then(oracle => {
      //   console.log(link.address)
      //   console.log(oracle.address)
      //   // After deployment, copy artifacts to ui folder so that
      //   // the UI can utilize those
      //   const contracts = [
      //     { name: 'LinkToken', contract: link },
      //     { name: 'Oracle', contract: oracle }
      //   ]

      //   contracts.forEach((c) => {
      //     const contractContext = {address: c.contract.address, abi: c.contract.abi}
      //     const data = JSON.stringify(contractContext)
      //     fs.writeFileSync(`${__dirname}/../build/${c.name}.json`, data);
      //     fs.writeFileSync(`${__dirname}/../ui/src/contracts/${c.name}.json`, data);
      //   })
      // })
  }
}
