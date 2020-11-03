/* eslint-disable */

import React, { Component } from 'react';


class CardDeadline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            days:0,
            hours:0,
            minutes:0,
            seconds:0,
            dateNow:0,
        }
        this._isMounted = false;
    }


    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            setInterval(()=>this.getTimeUntil(this.props.deadline),1000)
        }
    }
    
    async getTimeUntil(deadline){
        if (this._isMounted){
            
        const dateTime = Date.now();
        const dateNow = Math.floor(dateTime / 1000);
        const time = await Date.parse(deadline) - Date.parse(new Date());
        const seconds = await Math.floor((time/1000) %60);
        const minutes = await Math.floor((time/1000/60) %60);
        const hours = await Math.floor(time/(1000*60*60) %24);
        const days = await Math.floor(time/(1000*60*60*24));
        this.setState({days,hours,minutes,seconds,dateNow});
        }
    }
    
    componentWillUnmount(){
        this._isMounted = false;
    }
    
    render() {
     if (this.props.charityStatus === 1){
        return(           
        <div className = "charity-awaiting-approval">Status: Awaiting Approval </div>);
     }

     else if (this.props.charityStatus === 3){
        return(           
        <div className = "charity-deadline-close">Status: Disabled</div>);
     }

    
    else {
       
    if (isNaN(this.state.seconds))    
    return(           
        <div className = "charity-awaiting-approval">Loading...</div>);
      
    else if (this.props.unixTime < this.state.dateNow)
        return(           
            <div className = "charity-deadline-close">Charity is closed</div>);                                         
     else
        return(
           <div className = "charity-deadline">Time Left: {this.state.days} Days {this.state.hours} hrs {this.state.minutes} min. {this.state.seconds} sec.</div>);
        }
    }
}
export default CardDeadline;