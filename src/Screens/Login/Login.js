import React, {Component} from 'react';
import '../../Assets/StyleSheet.css';
import BaseUrl from "../../Services/BaseUrl";
import Checkbox from 'rc-checkbox';
import Select from 'react-select'
import axios from "axios";
import Loader from '../CommomComponents/Loader';
import Dialog from "../CommomComponents/Dialog";
import moment from 'moment';
import {mUrls} from './MarketUrl'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]
export default class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            userName:'',
            password:'',
            loading:false,
            dialog:false,
            message:"",
            url:[],
            forgot:false,
            setMarket:false,
            marketName:'',
            selectedMarket:''

        }
    }
    login(){

        if(this.state.selectedMarket==""){
            this.setState({loading:false,dialog:true,message:"Please select market"});
        }else{
            if(this.state.userName.length > 0 && this.state.password.length > 0){
                this.setState({loading:true})
                let obj = {
                    "UserID":this.state.userName,
                    "Password":this.state.password
                }
                console.log(sessionStorage.getItem("mktUrl"))
                let url = sessionStorage.getItem("mktUrl")+"api/"+"UserMgmt/login";
                axios.post(url,obj)
                    .then((res)=>{
                        this.setState({loading:false})
                        if(res && res.data && res.data.ReturnCode === 0){
                            if(res.data.ResponseCollection && res.data.ResponseCollection.length >0){
                                let data=res.data.ResponseCollection[0];
                                console.log("+++++++",res.data)
                                data["marketName"]=this.state.marketName;
                                data["timeStamp"]=moment(res.data.dtFetchTimeStamp).format('MM/DD/YYYY hh:mm:ss');
                                console.log("+++++++",data)
                                sessionStorage.setItem("userInfo",JSON.stringify(data));
                                sessionStorage.setItem("userID",data.UserRowID);
                                this.fechtSYSteUserData();
                            }
                            this.props.history.push('/HomeScreen')
                        }else{
                            this.setState({loading:false,dialog:true,message:"Invalid UserName/Password"})
                        }
                    })
                    .catch((e)=>{
                        this.setState({loading:false,dialog:true,message:"Internal Server error"})
                    })
            }else{
                this.setState({loading:false,dialog:true,message:"Please enter valid UserName/Password"});
            }
        }

    }
    fechtSYSteUserData(){
        axios.get(sessionStorage.getItem("mktUrl")+"api/"+"UserMgmt/FetchUsers")
            .then((res)=> {
                this.setState({loading: false})
                if(res && res.data && res.data.ReturnCode === 0) {
                  let usedlist=[]
                    if(res.data.ResponseCollection && res.data.ResponseCollection.length>0){
                        res.data.ResponseCollection.forEach(function (item) {
                            let obj ={
                                userId:item.UserRowID,
                                Name:item.UserID,
                            }
                            usedlist.push(obj)
                        });
                        sessionStorage.setItem("userList",JSON.stringify(usedlist));
                    }

                }
            })
    }
    componentDidMount(){
        // axios.get("http://mediadev.taxitronic.org/NY_TAXI_API/api/Market/GetMarkets")
        // .then((res)=>{
        //     if(res && res.data && res.data.ResponseCollection){
        //         console.log(res.data.ResponseCollection);
        //         this.setState({url:res.data.ResponseCollection,loading:false})
        //       }
        // })
    }

    setUrl(val){
       if(val &&  mUrls){
           mUrls.map((key,index)=>{
               if(val === key.Market_Id){
                   sessionStorage.setItem('mktUrl',key.Market_Url);
                   sessionStorage.setItem('marketName',key.Market_Name);
                   sessionStorage.setItem('marketId',key.Market_Id);
                   this.setState({setMarket:true,marketName:key.Market_Name,selectedMarket:key.Market_Id});
               }
           })

       }
    }

    render(){
        return(
            <div className="LoginMainWrp">
                {
                    this.state.loading ?
                    <Loader></Loader>
                    : this.state.dialog ?
                    <Dialog title={"Information"} message={this.state.message} onOk={()=>this.setState({dialog:false})}></Dialog>
                    : this.state.forgot &&
                    <div className="Loader">
                        <div className="ForgPassMainWrp">
                            <div className="ForgPassTitle">Forgot Password</div>
                            <div style={{marginTop:"30px"}}>
                                <div className="LoginInptChildWrp">
                                    <div className="ForgPassUsrNm">User name *</div>
                                    <input className="LoginInputFld" onChange={(e)=>this.setState({userName:e.target.value})} autoComplete="on"></input>
                                </div>
                                <div className="LoginInptChildWrp">
                                    <div className="ForgPassUsrNm1">Email *</div>
                                    <input className="LoginInputFld" type="password" onChange={(e)=>this.setState({password:e.target.value})} autoComplete="on"></input>
                                </div>
                            </div>
                            <div className="ForgPassBtm">
                                <img src={require("../../Assets/Images/Login/ok-btn.png")} className="ForgPassBtn"></img>
                                <img src={require("../../Assets/Images/Login/cancel-btn.png")} className="ForgPassBtn" onClick={()=>this.setState({forgot:false})}></img>
                            </div>
                        </div>
                    </div>
                }
                <div style={{paddingBottom:"35px",paddingTop:"30px","margin-left":"-46px"}}>
                    {<img src={require('../../Assets/Images/logo2.png')} className="" style={{width: "140px"}}></img>}
                </div>


                <div  className="LoginImg">
                    <div className='LoginInptWrp'>
                       <div className="LoginInptChildWrp">
                           <div className="LoginUsernmTxt">User name:</div>
                           <input className="LoginInputFld" onChange={(e)=>this.setState({userName:e.target.value})} autoComplete="on"></input>
                       </div>
                       <div className="LoginInptChildWrp">
                           <div className="LoginUsernmTxt1">Password:</div>
                           <input className="LoginInputFld" type="password" onChange={(e)=>this.setState({password:e.target.value})} autoComplete="on"></input>
                       </div>
                       <div className="LoginInptChildWrp">
                           <div className="LoginUsernmTxt2">Market Type:</div>
                           <select className="DropDwn" defaultValue="" value={this.state.selectedMarket} onChange={(e)=>this.setUrl(e.target.value)}>
                                <option value="" disabled={true}>Select Market Type</option>
                                {
                                    mUrls.map((key,index)=>(
                                    <option value={key.Market_Id}>{key.Market_Name}</option>
                                    ))
                                }
                            </select>
                       </div>
                       <div className="LoginInptChildWrp2">
                         <Checkbox className="LoginCheckbox"></Checkbox>
                         <div className="LoginRembrtxt">Remember Password</div>
                         {/*<div className="LoginRembrtxt1">|</div>
                         <div className="LoginRembrtxt2" onClick={()=>this.setState({forgot:true})}>Forgot Password</div>*/}
                       </div>
                       <img src={require('../../Assets/Images/Login/login-btn.png')} className={this.state.userName.length > 0 && this.state.password.length > 0 && this.state.setMarket?"LoginBtn":"LoginBtn1"} onClick={()=>this.login()} disabled={true}></img>
                    </div>
                </div>
            </div>
        )
    }
}
