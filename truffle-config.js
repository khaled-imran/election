const HDWalletProvider = require("truffle-hdwallet-provider");
 
// const mnemonic = "canvas arch ivory live wrap pond core goat novel clap shaft rhythm";

const mnemonic = "become rescue future pass gate pave obscure image curious pitch physical address spoil tank retreat";



const kaleido_endpoint = "https://k0y6vftf8s:2pi3-y80uCubwqt69rStvkp-PD8elgdYSHAqZwvBzlk@k0sjcvlrcv-k0wzc6xrj8-rpc.kr0-aws.kaleido.io"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!



  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    kaleido: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: function() {
        return new HDWalletProvider(mnemonic, kaleido_endpoint);
      },
      gasPrice: 10,
      network_id: "*"
    }
  },

  compilers: {
    solc: {
      version: "0.5.0",
    }
  }
};
