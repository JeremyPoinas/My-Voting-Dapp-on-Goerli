const Voting = artifacts.require("Voting");

module.exports = async function (callback) {
  const deployed = await Voting.deployed();
  
  callback();
};
