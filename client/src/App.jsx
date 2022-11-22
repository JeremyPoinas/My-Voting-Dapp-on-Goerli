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

  const isOwner = accounts?.includes(owner);
  const status = [
    'Registering Voters',
    'Registering proposals',
    'Proposals registered',
    'Voting session ongoing',
    'Voting session completed',
    'Votes tallied'
  ];

  useEffect(() => {
    if (contract && accounts) {
      if (isOwner) {
        setPagetoDisplay('admin');
      };
  
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
      .on('data', event => console.log(`Status changed from ${event.returnValues.previousStatus} to ${event.returnValues.newStatus}`));

    const voterRegisteredSub = contract?.events.VoterRegistered()
      .on('data', event => console.log(`Voter ${event.returnValues.voterAddress} successfully registered!`));

    const proposalRegisteredSub = contract?.events.ProposalRegistered()
      .on('data', event => console.log(`Proposal ${event.returnValues.proposalId} successfully registered!`));

    const votedSub = contract?.events.Voted()
      .on('data', event => console.log(`Voter ${event.returnValues.voter} has successfully voted for ${event.returnValues.proposalId}!`));

    return () => {
      workflowStatusSub?.unsubscribe();
      voterRegisteredSub?.unsubscribe();
      proposalRegisteredSub?.unsubscribe();
      votedSub?.unsubscribe();
    };
  }, [contract]);


  return (
    <div id="App" >
      <div className="container">
        <Intro setPagetoDisplay={setPagetoDisplay} isOwner={isOwner} isVoter={isVoter} />
        <Typography variant="h3" gutterBottom>
          {status[workflowStatus]}
        </Typography>
        {winningProposalId > 0 && <Typography variant="h2" gutterBottom>
          {status[workflowStatus]}
        </Typography>}
        {isOwner && pageToDisplay === 'admin' && <OwnerBtns workflowStatus={workflowStatus} setWorkflowStatus={setWorkflowStatus} setIsVoter={setIsVoter} />}
        {isVoter && pageToDisplay === 'voter' && <VoterBtns />}
      </div>
    </div>
  );
}

export default App;
