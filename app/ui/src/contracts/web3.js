import Web3 from 'web3';
import LinkToken from '@/contracts/LinkToken.json';
import Oracle from '@/contracts/Oracle.json';
import Betting from '@/contracts/Betting.json';

function getWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
  return {
    instance: window.web3,
    contracts: {
      betting: new window.web3.eth.Contract(
        Betting.abi,
        Betting.address,
      ),
      oracle: new window.web3.eth.Contract(
        Oracle.abi,
        Oracle.address,
      ),
      link: new window.web3.eth.Contract(
        LinkToken.abi,
        LinkToken.address,
      ),
    },
  };
}

export default getWeb3;
