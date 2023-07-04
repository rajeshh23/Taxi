import React, {Component} from 'react';
import '../../Assets/StyleSheet.css';
import ComCheck from "../CommomComponents/ComCheck";

export default class ColumnStatus extends Component{
    constructor(props){
        super(props)
        this.state={

        }
    }

    setCol(e,index){
        let obj={
            status:e,
            index:index
        }
        this.props.onChange(obj)
    }

    render(){
        return(
            <div className={this.props.class} style={{"z-index":"999999"}}>
                <div className="SchedColStHead">
                    <div>Show/Hide Columns</div>
                    <img src={require("../../Assets/Images/close.png")} className="SchedColStClose" onClick={()=>this.props.onClose('close')}></img>
                </div>
                <div className="ShedColStCont">
                    {
                        this.props.data && this.props.data.map((key,index)=>(
                            <div className="ShedColStCheckWrp">
                                {
                                    key.accessor !==undefined &&
                                    <ComCheck label={key.accessor} onChange={(e)=>this.setCol(e,index)} checked={key.show} containerStyle={"ComCheckMainWrp"} tickStyle={"ComChecktick"}></ComCheck>
                                }
                               
                            </div>
                        ))
                    }
                </div>
                <div className="SchedColStOkWrp" onClick={()=>this.props.onClose('Ok')}>OK</div>
            </div>
        )
    }
}