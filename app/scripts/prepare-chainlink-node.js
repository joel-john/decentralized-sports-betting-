const getAddr = require('./utils/get-address')
const createJob = require('./utils/create-chainlink-job')
const oracle0 = require('../build/Oracle0.json')
const oracle1 = require('../build/Oracle1.json')
const oracle2 = require('../build/Oracle2.json')

const fs = require('fs')

let Oracle = artifacts.require('Oracle');

const chainlinkHost = process.env.CHAINLINK_HOST || 'localhost'
console.log(`Chainlink host = ${chainlinkHost}`)
console.log(`=================================`)
/**
 * Connect Oracle contract to chainlink node and fund chainlink node
 */
module.exports = async callback => {
  if (process.env.DEMO) {
    const PreCoordinator = artifacts.require('PreCoordinator');
    try {

      let { Oracle } = require('@chainlink/contracts/truffle/v0.5/Oracle')
      Oracle.setProvider(web3.currentProvider)

      const accounts = await web3.eth.getAccounts();

      const oracles = await Promise.all([
        Oracle.at(oracle0.address),
        Oracle.at(oracle1.address),
        Oracle.at(oracle2.address)])

      const accountAddr = await Promise.all([
        getAddr(chainlinkHost, 6688),
        getAddr(chainlinkHost, 6689),
        getAddr(chainlinkHost, 6690)
      ]);
      
      // Set permission
      console.log('Set permissions')
      console.log('=============================================')
      console.log(`Setting fulfill permission to true for ${accountAddr[0]}...`);
      let tx = await oracles[0].setFulfillmentPermission(accountAddr[0], true, { from: accounts[0]});
      console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);

      console.log(`Setting fulfill permission to true for ${accountAddr[1]}...`);
      tx = await oracles[1].setFulfillmentPermission(accountAddr[1], true, { from: accounts[0]});
      console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);

      console.log(`Setting fulfill permission to true for ${accountAddr[2]}...`);
      tx = await oracles[2].setFulfillmentPermission(accountAddr[2], true, { from: accounts[0]});
      console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);
      
      console.log('Send ether to each Chainlink node')
      console.log('=============================================')
      // Send some Ether
      console.log(`Sending 1 ETH from ${accounts[0]} to ${accountAddr[0]}.`);
      let result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr[0], value: '1000000000000000000'});
      console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);

      console.log(`Sending 1 ETH from ${accounts[0]} to ${accountAddr[1]}.`);
      result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr[1], value: '1000000000000000000'});
      console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);

      console.log(`Sending 1 ETH from ${accounts[0]} to ${accountAddr[2]}.`);
      result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr[2], value: '1000000000000000000'});
      console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);

      // Create jobs
      console.log('Create jobs')
      console.log('=============================================')
      const jobs = await Promise.all([
        createJob(`http://${chainlinkHost}:6688`, oracle0.address),
        createJob(`http://${chainlinkHost}:6689`, oracle1.address),
        createJob(`http://${chainlinkHost}:6690`, oracle2.address)
      ])

      jobIds = jobs.map((j) => j.data.data.id)
      jobIds.forEach((jobId, i) => {
        const data = { jobId }
        console.log(`Writing jobId${i}.json with ${jobId}`)
        fs.writeFileSync(`${__dirname}/../ui/src/contracts/jobId${i}.json`, JSON.stringify(data))
      })

      // Setup PreCoordinator\
      console.log('Setup PreCoordinator')
      const pc = await PreCoordinator.deployed()
      const solOracles = oracles.map(oc => oc.address);
      const soljobIds = jobIds.map(jobId => web3.utils.fromAscii(jobId))
      const solPayments = ['1000000000000000000', '1000000000000000000', '1000000000000000000']
      const sa = await pc.createServiceAgreement(3, solOracles, soljobIds, solPayments, { from: accounts[0] })
      const saId = sa.logs[0].args.saId
      console.log(`Writing saId.json with ${saId}`)
      fs.writeFileSync(`${__dirname}/../ui/src/contracts/saId.json`, JSON.stringify({saId}))
      console.log(saId)

    } catch (ex) {
      console.error(ex)
    }
    
    
  } else {
    const oracle = await Oracle.deployed();
    const accountAddr = await getAddr();
    console.log(`Setting fulfill permission to true for ${accountAddr}...`);
    const tx = await oracle.setFulfillmentPermission(accountAddr, true);
    console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);

    const accounts = await web3.eth.getAccounts();
    console.log(`Sending 1 ETH from ${accounts[0]} to ${accountAddr}.`);
    const result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr, value: '1000000000000000000'});
    console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);
  }

  callback();
}
