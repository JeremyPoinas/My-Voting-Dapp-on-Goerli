import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import OwnerBtns from "./OwnerBtns";
import VoterBtns from "./VoterBtns";
import Proposal from "./Proposal";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state: { artifact, contract, accounts, owner } } = useEth();
  const [proposals, setProposals] = useState([]);
  const [isVoter, setIsVoter] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState('');
  const [winningProposalId, setWinningProposalId] = useState(0);

  const isOwner = accounts?.includes(owner);

  useEffect(() => {
    if (contract && accounts) {
      const getProposals = async () => {
        let proposals = [];
        for (let id = 1;; id++) {
          try {
            const proposal = await contract.methods.getOneProposal(id).call({ from: accounts[0] });
            proposals.push(proposal);
          } catch (err) {
            break; 
          }
        };
        setProposals(proposals);
      };
      getProposals();
  
      const isVoter = async () => {
        try {
          const voter = await contract?.methods.getVoter(accounts[0]).call({ from: accounts[0] });
          if (voter.isRegistered) {
            setIsVoter(voter.isRegistered);
          };
        } catch (err) {
          setIsVoter(false);
        }
      };
      isVoter();
  
      const getWorkflowStatus = async () => {
        try {
          const workflowStatus = await contract.methods.workflowStatus().call({ from: accounts[0] });
          setWorkflowStatus(workflowStatus);
        } catch (err) {
          alert(err);
        }
      };
      getWorkflowStatus();
    
      const getWinningProposalID = async () => {
        try {
          const winningProposalId = await contract.methods.winningProposalID().call({ from: accounts[0] });
          setWinningProposalId(winningProposalId);
        } catch (err) {
          alert(err);
        }
      };
      getWinningProposalID();
    }
  }, [contract, accounts]);

  useEffect(() => {
    // Events listeners
    const workflowStatusSub = contract?.events.WorkflowStatusChange()
      .on('data', event => alert(`Status changed from ${event.returnValues.previousStatus} to ${event.returnValues.newStatus}`));

    const voterRegisteredSub = contract?.events.VoterRegistered()
      .on('data', event => alert(`Voter ${event.returnValues.voterAddress} successfully registered!`));

    const proposalRegisteredSub = contract?.events.ProposalRegistered()
      .on('data', event => alert(`Proposal ${event.returnValues.proposalId} successfully registered!`));

    const votedSub = contract?.events.Voted()
      .on('data', event => alert(`Voter ${event.returnValues.voter} has successfully voted for ${event.returnValues.proposalId}!`));

    return () => {
      workflowStatusSub?.unsubscribe();
      voterRegisteredSub?.unsubscribe();
      proposalRegisteredSub?.unsubscribe();
      votedSub?.unsubscribe();
    };
  }, [contract]);

  const demo =
    <>
      <Cta />
      <div className="contract-container">
        <div>
          Voting status: {workflowStatus}
        </div>
        <div>
          Winning proposal's ID: {winningProposalId}
        </div>
        {isOwner && <OwnerBtns />}
        {isVoter  && <VoterBtns />}
      </div>
        {isVoter && proposals.map((proposal, id) => <Proposal key={id} proposal={proposal} />)}
      <div>

      </div>
      <Desc />
    </>;

  return (
    <div className="demo">
      <Title />
      {
        !artifact ? <NoticeNoArtifact /> :
          !contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
};

export default Demo;
