import * as React from 'react';
import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

function VoterBtns({ workflowStatus }) {
  const { state: { contract, accounts } } = useEth();
  const [voterToGet, setVoterToGet] = useState("");
  const [proposalToAdd, setProposalToAdd] = useState("");
  const [proposalToGet, setProposalToGet] = useState("");
  const [proposals, setProposals] = useState([]);

  const handleGetVoterAddressChange = e => {
    setVoterToGet(e.target.value);
  };

  const handleProposalToAddChange = e => {
    setProposalToAdd(e.target.value);
  };
  
  const handleProposalToGetChange = e => {
    setProposalToGet(e.target.value);
  };

  const getVoter = async () => {
    try {
      const voter = await contract.methods.getVoter(voterToGet).call({ from: accounts[0] });
      alert(`This voter is registed: ${voter.isRegistered}.\n
        He has voted: ${voter.hasVoted}. \n
        Voted for proposal: ${voter.votedProposalId}. \n
        N° of Proposals submitted: ${voter.proposalsAdded}.`);
      return voter;
    } catch (err) {
      alert(err);
    }
  };

  const getOneProposal = async () => {
    try {
      const proposal = await contract.methods.getOneProposal(proposalToGet).call({ from: accounts[0] });
      alert(`Proposal description: ${proposal.description}. \n
        Vote count: ${proposal.voteCount}.`);
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
    setProposals(proposals);
  };

  const addProposal = async () => {
    try {
      await contract.methods.addProposal(proposalToAdd).call({ from: accounts[0] });
      await contract.methods.addProposal(proposalToAdd).send({ from: accounts[0] });
      getProposals();
    } catch (err) {
      alert(err);
    }
  };

  const setVote = async (id) => {
    try {
      await contract.methods.setVote(id).call({ from: accounts[0] });
      await contract.methods.setVote(id).send({ from: accounts[0] });
      getProposals();
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    getProposals();
  }, [contract, accounts]);

  return (
    <div className="btns">
      <Stack spacing={2} direction="column" alignItems="center">
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={getVoter}>Get a voter</Button>
          <TextField 
            id="outlined-basic"
            label="Type address.."
            variant="outlined"
            value={voterToGet}
            onChange={handleGetVoterAddressChange}
          />
        </Stack>
        {
          workflowStatus === '1' && 
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={addProposal}>Add a proposal</Button>
            <TextField 
              id="outlined-basic"
              label="Type your proposal.."
              variant="outlined"
              value={proposalToAdd}
              onChange={handleProposalToAddChange}
            />
          </Stack>
        }

        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={getOneProposal}>Get one proposal</Button>
          <TextField 
            id="outlined-basic"
            label="Type the proposal's ID.."
            variant="outlined"
            value={proposalToGet}
            onChange={handleProposalToGetChange}
          />
        </Stack>
      </Stack>

      <Typography sx={{ mt: 4, mb: 2 }} variant="h4" component="div" align='center'>
        List of proposals
      </Typography>

      <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'gold', align: 'center', margin: 'auto' }}>
        {proposals.map((proposal, id) =>
          <>
            <ListItem variant="contained" key={id}>
              <ListItemText
                primaryTypographyProps={{fontSize: '1.5rem'}} 
                primary={proposal.description}
                secondaryTypographyProps={{fontSize: '1.3rem'}} 
                secondary={`Vote count: ${proposal.voteCount}`}
              />
              {workflowStatus === '3' && <Button variant="contained" onClick={() => setVote(id + 1)}>Vote</Button>}
            </ListItem>
            {id !== proposals.length - 1 && <Divider light />}
          </>
        )}
      </List>

    </div>
  );
}

export default VoterBtns;
