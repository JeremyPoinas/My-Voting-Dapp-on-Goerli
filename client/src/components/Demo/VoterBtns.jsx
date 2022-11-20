import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function VoterBtns() {
  const { state: { contract, accounts } } = useEth();
  const [voterToGet, setVoterToGet] = useState("");
  const [proposalToAdd, setProposalToAdd] = useState("");
  const [proposalToGet, setProposalToGet] = useState("");
  const [proposalToVote, setProposalToVote] = useState("");

  const handleGetVoterAddressChange = e => {
    setVoterToGet(e.target.value);
  };

  const handleProposalToAddChange = e => {
    setProposalToAdd(e.target.value);
  };
  
  const handleProposalToGetChange = e => {
    setProposalToGet(e.target.value);
  };
  
  const handleProposalToVoteChange = e => {
    setProposalToVote(e.target.value);
  };

  const getVoter = async () => {
    try {
      const voter = await contract.methods.getVoter(voterToGet).call({ from: accounts[0] });
      console.log(voter);
      return voter;
    } catch (err) {
      alert(err);
    }
  };

  const addProposal = async () => {
    try {
      await contract.methods.addProposal(proposalToAdd).call({ from: accounts[0] });
      await contract.methods.addProposal(proposalToAdd).send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  const getOneProposal = async () => {
    try {
      const proposal = await contract.methods.getOneProposal(proposalToGet).call({ from: accounts[0] });
      console.log(proposal);
      return proposal;
    } catch (err) {
      alert(err);
    }
  };

  const getProposals = async () => {
    let proposals = [];
    for (let id = 1;; id++) {
      try {
        const proposal = await contract.methods.getOneProposal(id).call({ from: accounts[0] });
        proposals.push(proposal);
      } catch (err) {
        break; 
      }
    }
    console.log(proposals);
  };

  const setVote = async () => {
    try {
      await contract.methods.setVote(proposalToVote).call({ from: accounts[0] });
      await contract.methods.setVote(proposalToVote).send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="btns">

      <button onClick={getVoter}>
        Get a voter
      </button>
      <input
        type="text"
        placeholder="address"
        value={voterToGet}
        onChange={handleGetVoterAddressChange}
      />

      <button onClick={addProposal}>
        Add a proposal
      </button>
      <input
        type="text"
        placeholder="Your proposal"
        value={proposalToAdd}
        onChange={handleProposalToAddChange}
      />

      <button onClick={getOneProposal}>
        Get one proposal
      </button>
      <input
        type="text"
        placeholder="Proposal's ID"
        value={proposalToGet}
        onChange={handleProposalToGetChange}
      />

      <button onClick={getProposals}>
        Get all proposals
      </button>

      <button onClick={setVote}>
        Vote for a proposal
      </button>
      <input
        type="text"
        placeholder="Proposal's ID"
        value={proposalToVote}
        onChange={handleProposalToVoteChange}
      />

    </div>
  );
}

export default VoterBtns;
