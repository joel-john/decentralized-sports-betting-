import Web3 from 'web3';
import contracts from '@/contracts/contracts.json';

function getWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
  return {
    instance: window.web3,
    contracts: {
      betting: new window.web3.eth.Contract(
        contracts.betting.abi,
        contracts.betting.address,
      ),
      oracle: new window.web3.eth.Contract(
        contracts.oracle.abi,
        contracts.oracle.address,
      ),
      link: new window.web3.eth.Contract(
        contracts.link.abi,
        contracts.link.address,
      ),
    },
  };
}

export default getWeb3;
