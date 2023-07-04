import React, {Component} from 'react';
import '../../Assets/StyleSheet.css';

export default class Dialog extends Component{
    constructor(props){
        super(props)
        this.state={
         
        }
    }

    render(){
        return(
            <div className="Loader">
                <div className="DlgMainWrp">
                    <div className="DlgTitleWrp" style={{"display": "flex"}}>
                        <div style={{"width":"87%"}}>
                            {this.props.title}
                        </div>
                        <div style={{"width":"10%","cursor":"pointer"}} onClick={()=>this.props.onHide()}>X
                        </div>
                    </div>
                    <div className="DlgMsgWrp">

                        {
                            this.props.type === "media" ?
                            <video width="400" controls autoPlay >
                                <source src={this.props.message} type="video/mp4"/>
                            </video>
                            : this.props.message === "" ?
                               <p className="DlgMsg">
                                   Selected questions are associated with following surveys:<br/>
                                   {
                                       this.props.msgRsp &&  this.props.msgRsp.map((key,index)=>{
                                           return(
                                           <span>{key.Name}{key.status===0?"(Active)":"(Inactive)"}<br/></span>
                                           )
                                       })
                                   }
                                   Are you sure you want to delete the selected questions ?
                               </p>
                                :
                                <p className="DlgMsg">{this.props.message}</p>
                        }
                    </div>
                    <div className="DlgBtnWrp">
                        <button className="DlgBtn" onClick={()=>this.props.onOk()}>OK</button>
                        {
                            this.props.type === "confirmation" &&
                            <button className="DlgBtn1" onClick={()=>this.props.onCancel()}>Cancel</button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}