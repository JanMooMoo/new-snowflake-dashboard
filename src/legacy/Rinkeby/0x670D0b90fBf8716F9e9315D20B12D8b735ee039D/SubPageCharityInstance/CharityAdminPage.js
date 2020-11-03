/* eslint-disable */

import React, { useState, useContext}  from 'react';
import Web3 from 'web3';
import CharityContractABI from '../ABI/CharityContractABI';
import { useGenericContract, useNamedContract,useAccountEffect } from '../../../common/hooks';
import TransactionButton from '../../../common/TransactionButton';
import ContributeButton from '../Buttons/ContributeButton';
import { useWeb3Context } from 'web3-react';
import {rinkeby1484_ABI, rinkeby1484_Address} from '../ABI/SnowflakeABI';
import {
  fromWei,
  formatAmount,
} from '../../../../services/format';
import numeral from 'numeral';
import hydro from '../Images/hydro.png';


export default function CharityAdminPage({ ein,account, Address,subPageMenu}) {

  
  const context = useWeb3Context();

  const resolverContract = useGenericContract(Address, CharityContractABI);
  const snowFlake = useGenericContract(rinkeby1484_Address, rinkeby1484_ABI);
  const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));  
  const [title, charityTitle]  = useState('');
  const [goal, charityGoal]  = useState('');
  const [balance, charityBalance]  = useState('');
  const [time, timeRemaining]  = useState('');
  const [description, charityDescription]  = useState('');
  const [admin,overLord] = useState('');
  const [status,contractStatus] = useState('');



  const goalFormat = formatAmount(fromWei(goal.toString()));
  const balanceFormat = formatAmount(fromWei(balance.toString()));
  const numeralGoal = numeral(goalFormat).format('0,0');
  const numeralBalance = numeral(balanceFormat).format('0,0');

  useAccountEffect(() => {
    
    //clientRaindropContract.methods.getDetails(ein).call().then(user => {einUser(user[1]), EthUser(user[0])});
    resolverContract.methods.title().call().then(result =>{charityTitle(result)}); 
    resolverContract.methods.charityGoal().call().then(result =>{charityGoal(result)});   
    resolverContract.methods.checkRemainingTime().call().then(result =>{timeRemaining(result)}); 
    resolverContract.methods.description().call().then(result =>{charityDescription(result)});
    resolverContract.methods.currentBalance().call().then(result =>{charityBalance(result)}); 
    resolverContract.methods.overlord().call().then(result =>{overLord(result)});
    resolverContract.methods.checkState().call().then(result =>{contractStatus(result)});
    
  });
  
  let charityState = '';
  if(parseInt(status) === 1){
    charityState = 'Awaiting Approval';
  }

  else if(parseInt(status) === 2){
    charityState = 'Disabled';
  }

  else{
    charityState = 'Approved';
  }

  return (
    <div style ={{textAlign:"center"}}>
      
      <div className="registrationWrapper-charity"> 
      <div className ="registerAsContributor-card" style ={{textAlign:"center"}}>
      
      <div className="registrationImage"><img src={require('../logo.png')} alt="Logo" className="charityLogo mb-2 mr-1" width={230}/></div>

      <p className="mt-2">Charity Title: {title}</p>
      <p>Charity Status: {charityState}</p>
      <p>Charity Goal: {numeralGoal} <img src={hydro} className="mb-1 mr-1"  border={1} alt="Hydro logo" width={20}/></p>
      <p>Funded: {numeralBalance} <img src={hydro} className="mb-1 mr-1"  border={1} alt="Hydro logo" width={20}/></p>
      <p>Description: {description}</p>
      
    </div>
   
    <div className ="registerAsContributor-card" style ={{textAlign:"center"}}>
      <div className="registrationImage"><div className="registerIcon" ><i class="fas fa-user-astronaut"/></div></div>
      <p className="mt-2">The ADMINISTRATOR is entrusted by the community with the power to APPROVE & DISABLE charity contracts, therefore making him/her responsible in maintaining the Charity-Dapp.</p>
      
      <div className="mt-3"> { account === admin && <ContributeButton
      readyText='Approve Charity' 
      method={() => resolverContract.methods.approveCharity()}/>}
      </div>

      {account === admin?<div className="mt-3"> <ContributeButton
      readyText='Disable Charity' 
      method={() => resolverContract.methods.disableCharity()}/>
      </div>
      :
      <div className="mt-5">
           <button className="txButton"> You are not the administrator </button> 
      </div>}
      
      
      </div>

    </div>
    <button readyText='Go Back'className="txButton" onClick={subPageMenu}> Go Back </button>
    </div>
  );
}