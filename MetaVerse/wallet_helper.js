var myabi = window.abi;
var contractAddress = window.config1.contract;
var mySmartContract;
var miAddress;

function init() {
  if (typeof window.ethereum !== 'undefined') {

    try {
      window.ethereum.autoRefreshOnNetworkChange = false;
    } catch (error) {
      // User denied account access
      console.log('User denied web3 access');
      return;
    }
    web3 = new Web3(window.ethereum);
    window.ethereum.enable();
  }
  else if (window.web3) {
    // Deprecated web3 provider
    web3 = new Web3(web3.currentProvider);
    // no need to ask for permission
  }
  else {
    console.log('No web3 provider detected');
    return;
  }
  initContract();
}

function initContract() {
  mySmartContract = new web3.eth.Contract(myabi, window.config1.contract);
}

init();