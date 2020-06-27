import Web3 from 'web3';
import contracts from '@/contracts/contracts.json';

function getWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
  console.log(contracts.bettingContract.address);
  return {
    instance: window.web3,
    contracts: {
      betting: new window.web3.eth.Contract(
        contracts.bettingContract.abi,
        contracts.bettingContract.address,
      ),
    },
  };
}

export default getWeb3;
