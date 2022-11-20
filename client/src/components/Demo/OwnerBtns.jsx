import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function OwnerBtns() {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [voterToAdd, setVoterToAdd] = useState("");
  const [voterToGet, setVoterToGet] = useState("");

  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const handleAddVoterAddressChange = e => {
    setVoterToAdd(e.target.value);
  };

  const handleGetVoterAddressChange = e => {
    setVoterToGet(e.target.value);
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

  const write = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(inputValue);
    await contract.methods.write(newValue).send({ from: accounts[0] });
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

      <div onClick={write} className="input-btn">
        write(<input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />)
      </div>

    </div>
  );
}

export default OwnerBtns;
