import React, { Component } from 'react';
import Web3 from 'web3';
import './Charity-style.css';
import clientRaindrop from '../../../services/contracts/clientRaindrop';
import CharityFactoryABI from './ABI/CharityFactoryABI';
import CharityInstance from './CharityInstance';
import CharityCards from './SubPageCharityFactory/CharityCards';
import CreateCharity from './SubPageCharityFactory/CreateCharity';

//import NewElection from './NewElection';
//import ElectionCards from './ElectionCards';
import JwPagination from 'jw-react-pagination';


const customStyles = {
    ul: {
        border:'rgb(10, 53, 88)',
        background:'rgb(10, 53, 88)',
        
    },
    li: {
        border:'rgb(10, 53, 88)',
        background:'rgb(10, 53, 88)'
       
    },
    a: {
        color: 'rgb(214, 217, 219)',
        background:'linear-gradient(to bottom,#083863,rgb(0, 0, 5))',
		
	},
	
};


export default class CharityFactory extends Component {


	constructor(props) {
        super(props)
			this.state = {
            charityFactory:[],
            charityAddress:[],
            account:[],
            raindrop:'',
            loading:true,
            page:1,
            subPage:1,
            set:[],
            address:null,
            id:null,
            ein:null,
            pageOfItems:[],
            sample:['0xEb6C266ee98323e00e1ff1685E71313eFec8bd48','0xEb6C266ee98323e00e1ff1685E71313eFec8bd48','0xEb6C266ee98323e00e1ff1685E71313eFec8bd48','0xEb6C266ee98323e00e1ff1685E71313eFec8bd48','0xEb6C266ee98323e00e1ff1685E71313eFec8bd48','0xEb6C266ee98323e00e1ff1685E71313eFec8bd48','0xEb6C266ee98323e00e1ff1685E71313eFec8bd48']
            
            
        }
       this.onChangePage = this.onChangePage.bind(this);
	}


	componentDidMount(){
	  this._isMounted = true;
     this.loadBlockchain();
	}

    async loadBlockchain(){
        
        let ethereum= window.ethereum;
        let web3=window.web3;

        if(typeof ethereum !=='undefined'){
         await ethereum.enable();
         web3 = new Web3(ethereum);       
        }
 
        else if (typeof web3 !== 'undefined'){
        console.log('Web3 Detected!')
        window.web3 = new Web3(web3.currentProvider);
        }
     
        else{console.log('No Web3 Detected')
        window.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b'));  
        } 
       
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
        const charityFactory = new web3.eth.Contract(CharityFactoryABI,'0xf80Cd09e8851366dB17Ad7f14C7b573D8EcbCCDd');
        if (this._isMounted){
            this.setState({charityFactory:charityFactory});
        }

        const charityAddress = await charityFactory.methods.returnAllCharities().call()
        if (this._isMounted){
           this.setState({charityAddress:charityAddress},()=>console.log(this.state.charityAddress.length))
        }

        charityFactory.events.newCharityCreated({fromBlock:'latest', toBlock:'latest'})
        .on('data',async(log) => {  
        const incomingCharityAddress = await charityFactory.methods.returnAllCharities().call()

        if (this._isMounted){
               this.setState({charityAddress:incomingCharityAddress},()=>console.log(this.state.charityAddress.length))}
        })
        }

    onChangePage(pageOfItems) {
        this.setState({loading:false})
        this.setState({ pageOfItems,loading:true});
        setTimeout(()=>this.setState({loading:false}),1000)
	}
    

    /*NAVIGATE FACTORY PAGE*/
    factoryPage=()=>{
        this.setState({page:1,subPage:1},()=>console.log())
    }

    createCharityPage=()=>{
        this.setState({page:1,subPage:2},()=>console.log())
    }

    charityInstancePage=()=>{
        this.setState({page:2,subPage:1},()=>console.log())
    }

    

    /*NAVIGATE CHARITY PAGE*/
    subPageMenu=()=>{
        this.setState({subPage:1},()=>console.log())
    }


    subPageRegistration=()=>{
        this.setState({subPage:2},()=>console.log())
    }

    subPageContribute=()=>{
        this.setState({subPage:3},()=>console.log())
    }

    subPageProfile=()=>{
        this.setState({subPage:4},()=>console.log())
    }

    subPageAdmin=()=>{
        this.setState({subPage:5},()=>console.log())
    }



    setPage=(contractAddress,ein)=>{
    if(contractAddress !== null && ein !== null){
    this.setState({address:contractAddress,ein:ein},()=>this.charityInstancePage());
    }
    }


  render() {

    let custom = '';
    if (this.state.loading || this.state.page === 1 && this.state.subPage === 2 || this.state.page === 2){
        custom = 'hidden';
    }

    
    return (

            <div style={{width: '100%',textAlign:'center'}} >    
            <div className="Charity-background">
       
            {this.state.page === 1 && <ul className="charityFactory-navbar align-items-center" style={{alignItems:'center'}}>
            <li className="nav-item" onClick={()=>this.factoryPage()}> Charities </li>
            <li className="nav-item ml-5" onClick={()=>this.createCharityPage()}> Create Charity</li>
            </ul>}

            {this.state.loading && <div style={{width: '100%',textAlign:'center'}} >
                <div className="spinner"/></div> } 

            {this.state.page === 1 && this.state.subPage === 1 && !this.state.loading && <div className="rows">
                 {this.state.pageOfItems.map((contract,index)=>(
                    <div className="columns"onClick={()=>this.setPage(contract,this.state.subPage)} key = {index}>
                        <CharityCards key = {index} charityAddress = {contract} />
                    </div>))}
                    </div>}

            {this.state.page === 1 && this.state.subPage === 2 && !this.state.loading && <CreateCharity account={this.state.account}/>}
        
            {this.state.page === 2 &&<CharityInstance 
                ein = {this.props.ein}
                goToFactory = {this.factoryPage}
                subPageMenu = {this.subPageMenu}
                subPageContribute = {this.subPageContribute}
                subPageRegistration = {this.subPageRegistration}
                subPageProfile = {this.subPageProfile}
                subPageAdmin = {this.subPageAdmin}
                subPage = {this.state.subPage}
                Address = {this.state.address}
                account={this.state.account}/>
               }

            <div className={custom}>  <JwPagination items={this.state.charityAddress.reverse()} onChangePage={this.onChangePage} maxPages={5} pageSize={4} styles={customStyles} /></div>
    
              
             </div>
            </div>
		);
	}
}