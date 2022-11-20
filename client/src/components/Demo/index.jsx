import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import OwnerBtns from "./OwnerBtns";
import VoterBtns from "./VoterBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state: { artifact, contract, accounts, owner } } = useEth();
  const isOwner = accounts?.includes(owner);
  const isVoter = async () => {
    try {
      console.log(accounts[0]);
      const voter = await contract?.methods.getVoter(accounts[0]).call({ from: accounts[0] });
      return voter?.isRegistered;
    } catch (err) {
      return false;
    }
  };

  const voter = isVoter();

  const getWorkflowStatus = async () => {
    try {
      const workflowStatus = await contract.methods.workflowStatus().call({ from: accounts[0] });
      console.log(workflowStatus);
      return workflowStatus;
    } catch (err) {
      alert(err);
    }
  };

  const getWinningProposalID = async () => {
    try {
      const winningProposalID = await contract.methods.winningProposalID().call({ from: accounts[0] });
      console.log(winningProposalID);
      return winningProposalID;
    } catch (err) {
      alert(err);
    }
  };

  const demo =
    <>
      <Cta />
      <div className="contract-container">
        <button onClick={getWorkflowStatus}>
          Check workflowStatus
        </button>
        <button onClick={getWinningProposalID}>
          Get winning proposal's ID
        </button>
        {isOwner && <OwnerBtns />}
        {voter  && <VoterBtns />}
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
}

export default Demo;
