import React, {Component} from 'react';
import '../../Assets/StyleSheet.css';

export default class ComCheck extends Component{
    constructor(props){
        super(props)
        this.state={
             check:this.props.checked?this.props.checked:false
        }
    }

    onChange(){

        this.setState({check:!this.state.check},()=>{
            if(this.props && this.props.onChange){
                this.props.onChange(this.state.check)
            }

        })
    }

    render(){
        return(
            <div className="ComCheckWrp">
                <div className={this.props.containerStyle?this.props.containerStyle:"ComCheckMainWrp"}  onClick={(e)=>{e.stopPropagation();this.onChange()}}>
                    {
                        this.state.check &&
                        <img src={require("../../Assets/Images/check-mark.png")} className={this.props.tickStyle?this.props.tickStyle:"ComChecktick"}></img>
                    }
                </div>
                <div>{this.props.label}</div>
            </div>
        )
    }
}