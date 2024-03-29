import { useEffect, useState } from "react";
import useEth from "./contexts/EthContext/useEth";
import Intro from "./components/Intro";
import OwnerBtns from "./components/OwnerBtns";
import VoterBtns from "./components/VoterBtns";
import Typography from '@mui/material/Typography';
import "./App.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const { state: { contract, accounts, owner } } = useEth();
  const [isVoter, setIsVoter] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState('');
  const [winningProposalId, setWinningProposalId] = useState(0);
  const [pageToDisplay, setPagetoDisplay] = useState('');

  // Check if the account connected is the owner
  const isOwner = accounts?.includes(owner);

  // Get the winning proposal ID and set the associated state
  const getWinningProposalID = async () => {
    try {
      const winningProposalId = await contract.methods.winningProposalID().call({ from: accounts[0] });
      setWinningProposalId(winningProposalId);
    } catch (err) {
      alert(err);
    }
  };

  // Get the workflow statuts and set the associated state
  const getWorkflowStatus = async () => {
    try {
      const workflowStatus = await contract.methods.workflowStatus().call({ from: accounts[0] });
      setWorkflowStatus(workflowStatus);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (contract && accounts) {
      if (isOwner) {
        setPagetoDisplay('admin');
      };
  
      // Check if the account connected is a voter
      const isVoter = async () => {
        try {
          const voter = await contract?.methods.getVoter(accounts[0]).call({ from: accounts[0] });
          if (voter.isRegistered) {
            setIsVoter(voter.isRegistered);
            setPagetoDisplay('voter');
          };
        } catch (err) {
          setIsVoter(false);
        }
      };
      isVoter();

      getWorkflowStatus();
      
      if (workflowStatus === '5') {
        getWinningProposalID();
      }
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
      // Remove event listeners to avoid duplicates
      workflowStatusSub?.unsubscribe();
      voterRegisteredSub?.unsubscribe();
      proposalRegisteredSub?.unsubscribe();
      votedSub?.unsubscribe();
    };
  }, [contract]);


  return (
    <div id="App" >
      <div className="container">
        <Intro
          setPagetoDisplay={setPagetoDisplay}
          isOwner={isOwner}
          isVoter={isVoter}
          workflowStatus={workflowStatus}
        />
        {workflowStatus === '5' &&
        <Typography variant="h2" align='center' gutterBottom sx={{ margin: 4 }}>
          Proposal n°{winningProposalId} has won!!
        </Typography>}
        {isOwner && pageToDisplay === 'admin' && 
        <OwnerBtns 
          workflowStatus={workflowStatus}
          setWorkflowStatus={setWorkflowStatus}
          setIsVoter={setIsVoter}
          getWinningProposalID={getWinningProposalID}
          getWorkflowStatus={getWorkflowStatus}
        />}
        {isVoter && pageToDisplay === 'voter' &&
        <VoterBtns
          workflowStatus={workflowStatus}
        />}
      </div>
    </div>
  );
}

export default App;
