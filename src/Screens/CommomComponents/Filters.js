import '../../Assets/StyleSheet.css';
import ComCheck from "../CommomComponents/ComCheck";
import React, {Component} from 'react';

export const Search=(props)=>{
    return(
        <div className="FiltreWrp" onBlur={(e)=>{if(props.hideFilter){props.hideFilter()}}}>
                <input className="SchedFiltInptWrp" onChange={(e)=>props.onChange(e)} value={props.value}></input>
        </div>
    )
}

export class MultiChoice extends Component{

    onChoiceChange(e,key){
        this.props.setChoice(e,key)
    }

   render(){
    return(
        <div className="FiltreWrp1">
            {
                this.props.keyData && this.props.keyData.map((key,index)=>(
                   <div style={{padding:"5px"}}>
                        <ComCheck label={key} checked={this.props.choice.indexOf(key)>=0} onChange={(e)=>this.onChoiceChange(e,key)} containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                   </div>
                ))
            }
        </div>
    )
   }
}

export class Radio extends Component{
    constructor(props){
        super(props);
        this.state={
            active:false
        }
    }

    onChoiceChange(e,key){
        this.setState({active:!this.state.active}) 
    }

   render(){
    return(
        <div className="Radio" onClick={()=>this.onChoiceChange()}>
           {
               this.state.active &&
                 <div className="RadioActive"></div>
           }
        </div>
    )
   }
}


