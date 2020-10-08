/* eslint-disable */

import React, { useState,useEffect } from 'react';

import Button from '@material-ui/core/Button';
import { TextField, Typography} from '@material-ui/core'

import ABI from './abi';
import './style.css';
import { useGenericContract, useNamedContract,useAccountEffect } from '../../common/hooks';
import TransactionButton from '../../common/TransactionButton';
import Typewriter from './Typewriter';
import { useWeb3Context } from 'web3-react';
import { number } from 'prop-types';

// import ShowCampaignStats from './ShowCampaignStats';


let loadingVoter = false;
let loadingCandidate = false;


export default function VerificationPage(props) {

  
  const context = useWeb3Context();
  const [totalCandidates, getTotalCandidates] = useState([]);
  const [candidate, isCandidate]  = useState('')
  const [voter, isVoter]  = useState('');
  const [number, Votes]  = useState(['50']);


  const clientRaindropContract = useNamedContract('clientRaindrop')
  const operatorAddress = '0x7Df28F6007f09f30f0dF0457d54eF950baB0De5D';
  const resolverContract = useGenericContract(operatorAddress, ABI)


  const [lookupEinVoter, setLookupEinVoter]  = useState('')
  const [voterResult, einVoterResult]  = useState('  ')
  const [fontColor, colorResult]  = useState('')

  const [lookupEinCandidate, setLookupEinCandidate]  = useState('')
  const [candidateResult, einCandidateResult]  = useState('  ')
  const [fontColor2, colorResult2]  = useState('')

  useAccountEffect(() => {
    resolverContract.methods.getMaxCandidates().call().then(voter => getTotalCandidates(voter));
    //resolverContract.methods.aCandidate().call().then(candidate => isCandidate(candidate));
  //  resolverContract.methods.aParticipant('2265').call().then(voter => isVoter(voter));
    
   // resolverContract.methods.vote('2265').call().then(status => setCurrentStatus(status));
  //x = totalCandidates.length
    //resolverContract.methods.candidates('2265').call().then(Candidates => getTotalCandidates(Candidates))
    
  })

  function checkVoter () {
    loadingVoter = true;
    resolverContract.methods.aParticipant(lookupEinVoter).call()
    .then(result =>{
      colorResult(result)
        result === false?
          einVoterResult(["EIN-", lookupEinVoter, " is not a registered voter."]) : 
          einVoterResult(["EIN-", lookupEinVoter, " is a registered voter."])});
      
           setTimeout(()=>{loadingVoter = false}, 3000);
  }

  function checkCandidate () {  
    loadingCandidate = true;
    resolverContract.methods.aCandidate(lookupEinCandidate).call()
    .then(result =>{
      colorResult2(result)
        result === false?
          einCandidateResult(["EIN-", lookupEinCandidate, " is not a registered candidate."]) : 
          einCandidateResult(["EIN-", lookupEinCandidate, " is a registered candidate."])});
      
          setTimeout(()=>{loadingCandidate = false}, 3000);
  }


  let voterButton = "registrationButtonDisabled";
  let candidateButton = "registrationButtonDisabled";
  let disabledVoter = true;
  let disabledCandidate = true;
  if(lookupEinVoter !== '' && !loadingVoter){
    voterButton = "registrationButton";
    disabledVoter= false;
  }

  if(lookupEinCandidate !== '' && !loadingCandidate){
    candidateButton = "registrationButton";
    disabledCandidate = false;
  }
 
  return (
    
    <div className="verificationWrapper">

        <div className="registrationWrapper"> <div className ="verifyAsVoter" style ={{textAlign:"center"}}>

        <h2 className="verification-title">Voter Verification</h2>
        <div className="verifyBox" ><Typewriter inputStrings={voterResult} fontColor={fontColor}/></div>

        <div className="form-group row">
			
						
						<div className="group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-texts">EIN</span>
							
							<input className="verify" type="number" min="0"  autoComplete="off" onChange={e => setLookupEinVoter(e.target.value)}/>
                            </div>
                            <label className="verifyLabel mt-2">Verify if an EIN is a registered voter.</label>
					</div>
				</div>
      
      <button
      className={voterButton}   
      onClick={checkVoter} disabled={disabledVoter}>Verify Voter</button>
     
       
    </div>

    <div className ="verifyAsVoter" style ={{textAlign:"center"}}>

        <h2 className="verification-title">Candidate Verification</h2>
        <div className="verifyBox" ><Typewriter inputStrings={candidateResult} fontColor={fontColor2}/></div>

        <div className="form-group row">
			
						
						<div className="group mb-3">
							<div className="input-group-prepend">
								<span className="input-group-texts">EIN</span>
							
							<input className="verify" type="number" min="0"  autoComplete="off" onChange={e => setLookupEinCandidate(e.target.value)}/>
                            </div>
                            <label className="verifyLabel mt-2">Verify if an EIN is a registered candidate.</label>
					</div>
				</div>
      
      <button
      className={candidateButton}   
      onClick={checkCandidate} disabled={disabledCandidate}>Verify Candidate</button>
     
       
    </div>
   
    
    </div>
      

 

  
      
      <Typography variant='h2' gutterBottom  color="textPrimary">
      
      
          
      </Typography>
      
    
      
    </div>
  );
}