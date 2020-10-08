/* eslint-disable */

import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import Web3 from 'web3';
import './style.css';
import VoteButton from './customButton/VoteButton';
import clientRaindrop from '../../../services/contracts/clientRaindrop';
import abi from'./abi';

export default class EditAccountDialog extends Component {


	constructor(props) {
		super(props)
			this.state = {
            votingContract:'',
            raindrop:'',
            maxCandidates:[],
            votes:[],
            userName:[],
            accounts:[],
            blockNumber:'',
            candidate:'',

            loading:true,
            
        }
        this.handleChangeCandidate = this.handleChangeCandidate.bind(this)
	}


	componentDidMount(){
	  this._isMounted = true;
      this.loadBlockchain();
	}

    async loadBlockchain(){
       
        const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));  
        
        const network = await web3.eth.net.getNetworkType();
        const accounts = await web3.eth.getAccounts();
        const blockNumber = await web3.eth.getBlockNumber();
        if (this._isMounted){
        this.setState({blockNumber:blockNumber - 1});
        }
        if (this._isMounted){
        this.setState({account: accounts[0]}); 
        }
        const raindrop = new web3.eth.Contract(clientRaindrop.abi,clientRaindrop.address);
        if (this._isMounted){
            this.setState({raindrop:raindrop});
        }
        const votingContract = new web3.eth.Contract(abi,'0x7Df28F6007f09f30f0dF0457d54eF950baB0De5D');
        if (this._isMounted){
            this.setState({votingContract:votingContract});
        }
        const maxCandidates = await votingContract.methods.getMaxCandidates().call();    
        this.setState({maxCandidates:maxCandidates[0]})

        
        
        for(var m=0; m<this.state.maxCandidates.length; m++){
            const voteCount = await votingContract.methods.candidates(this.state.maxCandidates[m]).call();
            const userName = await raindrop.methods.getDetails(this.state.maxCandidates[m]).call();        
            this.setState({votes:[...this.state.votes,voteCount]});
            this.setState({userName:[...this.state.userName,userName[1]]});
           
        }
        
        votingContract.events.voted({fromBlock:this.state.blockNumber, toBlock:'latest'})
        .on('data',(log) => {  
   
        const getIndex = (element) => element == parseInt(log.returnValues._candidate);
        let index = this.state.maxCandidates.findIndex(getIndex);
        let votes =  [...this.state.votes]
        let count= this.state.votes[index];
            count = parseInt(count)+1;
            votes[index] = count
            this.setState({votes})
            
        })

        votingContract.events.becameCandidate({fromBlock:this.state.blockNumber, toBlock:'latest'})
        .on('data',async(event) => { 
            const newCandidate = await raindrop.methods.getDetails(parseInt(event.returnValues._candidateEIN)).call();
            this.setState({maxCandidates:[...this.state.maxCandidates,event.returnValues._candidateEIN],
                userName:[...this.state.userName,newCandidate[1]],
                votes:[...this.state.votes,0]           
            })
        
        })
        this.setState({loading:false,
            candidate:this.state.maxCandidates[0]},()=>console.log())
        }

 
    handleChangeCandidate (event){
        let candidates = event.target.value;
        this.setState({candidate:candidates});      
      }

   async web3NewData(){
        this.setState({votes:[]});
        for(var m=0; m<this.state.maxCandidates.length; m++){
            const voteCount = await this.state.votingContract.methods.candidates(this.state.maxCandidates[m]).call();
            this.setState({votes:[...this.state.votes,voteCount]});
            }
    }



  render() {
    let barThickness = 300;
    let barfontsize = 17;

    if(this.state.maxCandidates.length === 4){
        barThickness = 150;
    }
    else if(this.state.maxCandidates.length === 5){
        barThickness = 190;
        barfontsize = 16;
    }
    else if(this.state.maxCandidates.length === 6){
        barThickness = 170;
        barfontsize = 14;
    }
    
    if(!this.state.loading)
    this.BarData = (canvas) => {
        const ctx = canvas.getContext("2d")
        const gradient = ctx.createLinearGradient(800,200,500,800,200);
        gradient.addColorStop(0, 'rgb(210, 230, 240)');
        gradient.addColorStop(1, 'rgb(86, 152, 206)');
     
        return {
        //labels: ['hello','ch'],
         labels: this.state.maxCandidates.map((ein,index)=>["EIN:"+ein+' - '+this.state.userName[index]]),
          datasets: [{
            label:'VOTES',
            fontColor:'white',
            backgroundColor: [gradient,gradient,gradient,gradient,gradient],
            borderColor: 'white',
            borderWidth: .8,
            backgroundColor: [gradient,gradient,gradient,gradient,gradient],
            hoverBorderColor: 'rgb(245, 191, 76)',
            hoverBorderWidth:2,
            weight:5,
            maxBarThickness: 230,
            borderAlign:'center',
            data:this.state.votes.map(votes=>votes),
            }],					
            }	
         
        }

    return (

            <div style={{width: '100%',textAlign:'center'}} >

                {this.state.loading &&<div className="spinner"/>} 
                {!this.state.loading && <div className="dashboard-bar">
                 
                {this.props.beCandidate}
              <Bar className ="bars"
                options={{
                responsive:true,
                maintainAspectRatio:false,
                title:{
                display: true,
                position:"top",
                text: 'Based On Hydro Revenue',
                fontSize: 16,
                lineHeight:5.5,
                padding:1,
                fontColor:'white',                   
                },   
                legend: {
                    display: false,
                    labels: {
                        fontColor: 'rgb(245, 191, 76)'
                     }
                    }, 
                scales: {
                  yAxes: [{ticks: {beginAtZero:true,fontSize:17,fontColor:'white',fontStyle: '600',precision:0 }}],
                  xAxes: [{ticks: {beginAtZero:true,fontSize:barfontsize,fontColor:'rgb(241, 189, 77)', fontStyle: '600' },barPercentage:1,display: true}]
                },
                elements:{
                rectangle:{borderSkipped:'bottom',}
                }  
                }} data={this.BarData} />
              </div> }
              
			<div>
				</div>
                <div style={{display:'inline-block',textAlign:'center',width: '100%'}} className="divButtons">
                
                {!this.state.loading &&<select className="selectOptions" onChange={this.handleChangeCandidate}>
                {this.state.maxCandidates.map((candidate,index)=><option key={index} 
                    value={candidate} 
                    className="votingOptions">{'EIN: ' + candidate}
                    </option>)}
                </select>}
                
                <VoteButton readyText='VOTE NOW' 
                style={{display:'inline-block',textAlign:'center'}} 
                className="voteButton" 
                method={()=>this.props.vote(this.state.candidate)}/>
                </div>
            </div>
		);
	}
}