/* eslint-disable */


import React, { Component } from 'react';
import Web3 from 'web3';
import './Charity-style.css';
import ContributePage from './SubPageCharityInstance/ContributePage';
import RegistrationPage from './SubPageCharityInstance/RegistrationPage';
import CharityProfilePage from './SubPageCharityInstance/CharityProfilePage';
import CharityAdminPage from './SubPageCharityInstance/CharityAdminPage';
import CharityContractABI from './ABI/CharityContractABI';
//import ChartPage from './ChartPage';
//import ProfilePage from './ProfilePage';

export default class CharityInstance extends Component {


	constructor(props) {
		super(props)
			this.state = {
            charityContract:[],
            accounts:[],
            blockNumber:'',       
        }
       
	}


	componentDidMount(){
	  this._isMounted = true;
      this.loadBlockchain();
	}

    async loadBlockchain(){
    
            
            const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));  
            const network = await web3.eth.net.getNetworkType();

            const accounts = await web3.eth.getAccounts();
       
             if (this._isMounted){
            this.setState({account: accounts[0]}); 
             }

            const charityContract = new web3.eth.Contract(CharityContractABI,this.props.Address);
            if (this._isMounted){
                this.setState({charityContract:charityContract},()=>console.log());
            }
            const title = await charityContract.methods.snowflakeName().call()
            if (this._isMounted){
                this.setState({title:title},()=>console.log(this.state.title));
            }
           
        }
 
  render() {    
   let body =  <div style={{width: '100%',textAlign:'center'}}>
   <ul className="charity-menu align-items-center" style={{alignItems:'center'}}>
           <li className="charityInstance-Box" onClick={this.props.goToFactory}><div className="fontIcon"><i class="fas fa-seedling"/></div>Charities</li>
           <li className="charityInstance-Box" onClick={this.props.subPageRegistration}><div className="fontIcon"><i class="fas fa-user-plus"/></div> Register</li>
           <li className="charityInstance-Box"><div className="fontIcon"><i class="fas fa-user-check"/></div> Verify</li>
       </ul>

       
   <ul className="charity-menu align-items-center" style={{alignItems:'center'}}>
       <li className="charityInstance-Box" onClick={this.props.subPageProfile}><div className="fontIcon"><i class="fas fa-id-card"/></div> Profile</li>
       <li className="charityInstance-Box" onClick={this.props.subPageAdmin}><div className="fontIcon"><i class="fas fa-user-astronaut"/></div> Admin</li>
       </ul>
       </div>

        if(this.props.subPage === 2){
        body = <RegistrationPage subPageMenu = {this.props.subPageMenu} Address = {this.props.Address} ein = {this.props.ein}/>
        }

       else if(this.props.subPage === 3){
        body = <ContributePage subPageMenu = {this.props.subPageMenu} Address = {this.props.Address} ein = {this.props.ein} account = {this.props.account} subPageRegistration={this.props.subPageRegistration}/>
       }

       else if(this.props.subPage === 4){
        body = <CharityProfilePage subPageMenu = {this.props.subPageMenu} Address = {this.props.Address} ein = {this.props.ein} subPageRegistration={this.props.subPageRegistration}/>
       }
       
       else if(this.props.subPage === 5){
        body = <CharityAdminPage subPageMenu = {this.props.subPageMenu} Address = {this.props.Address} ein = {this.props.ein} account = {this.props.account}/>
       }

       else {
           body = <div style={{width: '100%',textAlign:'center'}}>
           <ul className="charity-menu align-items-center" style={{alignItems:'center'}}>
                <li className="charityInstance-Box" onClick={this.props.goToFactory}><div className="fontIcon"><i class="fas fa-seedling"/></div>Charities</li>
                <li className="charityInstance-Box" onClick={this.props.subPageRegistration}><div className="fontIcon"><i class="fas fa-user-plus"/></div> Register</li>
                <li className="charityInstance-Box"><div className="fontIcon"><i class="fas fa-user-check"/></div> Verify</li>
            </ul>
        
               
           <ul className="charity-menu align-items-center" style={{alignItems:'center'}}>
                <li className="charityInstance-Box" onClick={this.props.subPageContribute}><div className="fontIcon"><i class="fas fa-hand-holding-water"/></div> Contribute</li>          
                <li className="charityInstance-Box" onClick={this.props.subPageProfile}><div className="fontIcon"><i class="fas fa-id-card"/></div> Profile</li>
                <li className="charityInstance-Box" onClick={this.props.subPageAdmin}><div className="fontIcon"><i class="fas fa-user-astronaut"/></div> Admin</li>
            </ul>
               </div>

       }
    
       

    return (
        
        <div style={{width: '100%',textAlign:'center'}}>
            <ul className="charity-navbar align-items-center" style={{alignItems:'center'}}>
        <li className="nav-item" onClick={this.factoryPage}> Title: {this.state.title} </li>
         </ul>

       {body}
            </div>
		);
	}
}