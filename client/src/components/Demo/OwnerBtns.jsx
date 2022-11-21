import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function OwnerBtns() {
  const { state: { contract, accounts } } = useEth();
  const [voterToAdd, setVoterToAdd] = useState("");

  const handleAddVoterAddressChange = e => {
    setVoterToAdd(e.target.value);
  };

  const addVoter = async () => {
    try {
      await contract.methods.addVoter(voterToAdd).call({ from: accounts[0] });
      await contract.methods.addVoter(voterToAdd).send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  const startProposalsRegistering = async () => {
    try {
      await contract.methods.startProposalsRegistering().call({ from: accounts[0] });
      await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  const endProposalsRegistering = async () => {
    try {
      await contract.methods.endProposalsRegistering().call({ from: accounts[0] });
      await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  const startVotingSession = async () => {
    try {
      await contract.methods.startVotingSession().call({ from: accounts[0] });
      await contract.methods.startVotingSession().send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  const endVotingSession = async () => {
    try {
      await contract.methods.endVotingSession().call({ from: accounts[0] });
      await contract.methods.endVotingSession().send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  const tallyVotes = async () => {
    try {
      await contract.methods.tallyVotes().call({ from: accounts[0] });
      await contract.methods.tallyVotes().send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="btns">

      <button onClick={startProposalsRegistering}>
        Start the proposal registration
      </button>

      <button onClick={endProposalsRegistering}>
        End the proposal registration
      </button>

      <button onClick={startVotingSession}>
        Start the voting session
      </button>

      <button onClick={endVotingSession}>
        End the voting session
      </button>

      <button onClick={tallyVotes}>
        Find the winning proposal
      </button>

      <button onClick={addVoter}>
        Add a voter
      </button>
      <input
        type="text"
        placeholder="address"
        value={voterToAdd}
        onChange={handleAddVoterAddressChange}
      />
    </div>
  );
}

export default OwnerBtns;
