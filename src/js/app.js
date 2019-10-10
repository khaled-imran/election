App = {
  web3Provider: null,
  contracts: {},
  // account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional

    // node 1
    var network_endpoint = 'https://k0y6vftf8s:2pi3-y80uCubwqt69rStvkp-PD8elgdYSHAqZwvBzlk@k0sjcvlrcv-k0wzc6xrj8-rpc.kr0-aws.kaleido.io'
    // node 2
    // var network_endpoint = 'https://k0y6vftf8s:2pi3-y80uCubwqt69rStvkp-PD8elgdYSHAqZwvBzlk@k0sjcvlrcv-k0rezwlp7b-rpc.kr0-aws.kaleido.io'

    // var network_endpoint = 'http://localhost:7545'


    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      // App.web3Provider = web3.currentProvider;
      // web3 = new Web3(web3.currentProvider);

      App.web3Provider = new Web3.providers.HttpProvider(network_endpoint);
      web3 = new Web3(App.web3Provider);

    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider(network_endpoint);
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      // if (err === null) {
      //   App.account = account;
      //   $("#accountAddress").html("Your Account: " + account);
      // }
      console.log('--1----');
      console.log(account);
      $("#accountAddress").html("Your Account: " + account);

      // var account_no = 2;
      // App.account = account[account_no];


      App.account = account;

      console.log ('account------>');
      console.log(App.account);




    });

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {



      web3.eth.getCoinbase(function(err, account) {
      // if (err === null) {
      //   App.account = account;
      //   $("#accountAddress").html("Your Account: " + account);
      // }
      console.log('--1----');
      console.log(account);

      // var account_no = 2;
      // App.account = account[account_no];


      App.account = account;

      console.log ('account------>');
      console.log(App.account);




    });






      console.log ('account------>3');
      console.log(App.account);
      electionInstance = instance;
      // var cancount;
      // electionInstance.candidatesCount().then(function(cc){cancount=cc});
      // console.log('cancount');
      // console.log(cancount);
      console.log ('account------>3.5');
      console.log(App.account);
      return electionInstance.candidatesCount({ from: App.account });
    }).then(function(candidatesCount) {
      console.log ('account------>4');
      console.log(App.account);

      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();


      console.log ('account------>5');
      for (var i = 1; i <= candidatesCount; i++) {
        console.log ('account------>6');
        electionInstance.candidates(i, { from: App.account }).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account, { from: App.account });
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      console.log ('account------>2');
      console.log(App.account);
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
