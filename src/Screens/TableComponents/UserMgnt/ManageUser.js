import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import {getData,postData,putData} from "../../../Services/MainServices";
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import axios from 'axios';
import Pagination from "../../CommomComponents/Pagination";
import ComCheck from "../../CommomComponents/ComCheck";
import Dialog from "../../CommomComponents/Dialog";


const ColumnCol=["UserID","FirstName","LastName","EmailId","UserGroup","StatusID"];
const userGrp=[{id:1,value:"MANAGER"},{id:2,value:"USER"},{id:10,value:"ADMIN"},{id:15,value:"SCHEDULER"},{id:16,value:"NBCUSER"}]

export default class ManageUser extends Component{
  tem=[];
    constructor(props){
         super(props);
         this.handleClickOutside = this.handleClickOutside.bind(this);
         this.state={
             columns:[],
             data:[],
             columnSt:false,
             filtered:[],
             filter:-1,
             tabIndex:0,
             loading:true,
             filterc:false,
             filterVal:[],
             visibleFilters: [],
             addUserPop:0,
             userName:"",
             email:"",
             fName:"",
             lName:"",
             grpName:"MANAGER",
             status:"0",
             message:"",
             dlgtitle:"",
             dlgType:"",
             dlgEnable:false,
             delete:[],
             rowInfo:[],
         }
        }       
       
      componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
        let dColumn = [];
        let sColumn=[];
        let obj = {
          Header: "#",
          Cell: (rowInfo) => <ComCheck  onChange={(e)=>this.setDelete(e,rowInfo)} containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
          width:25
        };
        dColumn.push(obj)
        ColumnCol.map((key,index)=>{
             this.state.filterVal.push("")
             let obj={
              Header: (cellInfo)=><div className="ScheduleHeaderWrp">
              <div>{cellInfo.column.id}</div>
              {
                      this.state.filterVal[index] === ""?
                      <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                      :
                      <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                  }
              </div>,
              accessor:key,
              show:true,
              filterable:true,
              Filter: (cellInfo) =>
              <div>{ 
                  this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                  <div className="FiltreWrp">
                  <input className="SchedFiltInptWrp" onChange={(e)=>this.customFilerChange(cellInfo.column.id,e.target.value,index)} value={this.state.filterVal[index]}></input>
                  </div>
                }
                </div>
                
             }
             dColumn.push(obj);
        });
        this.setState({columns:dColumn},()=>{
             this.getRecord();
        });
      }

      componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

      handleClickOutside(event) {
        // if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
        //     this.setState({visibleFilters:[]})
        // }
        var x = document.getElementsByClassName("SchedFiltInptWrp");
        console.log("x is ", x[0])
        console.log("event.target is ", event.target);
        if (event.target !== x[0]) {
            console.log("out inside");
            this.setState({visibleFilters: []});
        } else {
            console.log("inside inside");
        }
    }

      getRecord(){
        console.log("call get record ");
          this.setState({data:[],loading:true})
          getData("UserMgmt/FetchUsers")
        .then((res)=>{
          if(res && res.data && res.data.ResponseCollection){
              if(res.data.ResponseCollection.length>0){
                  res.data.ResponseCollection.forEach(function (item) {
                      if(item.StatusID==1){
                          item.StatusID = "Inactive";
                      }else{
                          item.StatusID = "Active";
                      }
                  });
                  res.data.TotalcountOfItems = res.data.ResponseCollection.length;
              }
              this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false})
          }else{
            this.setState({data:[],loading:false})
          }
        })
      }

      setFilter(id,index){
        this.setState(({ visibleFilters }) => {
          let update = [...visibleFilters];
          const index = update.indexOf(id);
          index < 0 ? update.push(id) : update.splice(index, 1);
          return { visibleFilters: update };
        });
       }

       customFilerChange(accessor,value,index){
        let filtered = this.state.filtered;
        let insertNewFilter = 1;
        if (filtered.length) {
          filtered.forEach((filter, i) => {
            if (filter["id"] === accessor) {
              if (value === "" || !value.length){
                filtered.splice(i, 1);
                this.state.filterVal[index]=value
              }else{
                 filter["value"] = value;
                 this.state.filterVal[index]=value
                insertNewFilter = 0;
              } 
              
            }
          });
        }
    
        if (insertNewFilter) {
          filtered.push({ id: accessor, value: value });
        }
        let newFilter = filtered.map((key,index)=>{
          let temp1 = Object.assign({}, key);
          return temp1;
        })
        this.setState({ filtered: newFilter });
       }


    setColumn=(e,stateval)=>{
        var myData = this.state[stateval];
        this.temp=this.state[stateval]
        const newData = myData.map((key,index)=>{
          let temp = Object.assign({}, key);
          if(index === e.index){
            temp.show = e.status;
          }
          return temp;
        })
        this.state[stateval] = newData
        this.setState({refresh:true})
    }

    resetColmn(e,stateval){
        if(e === 'close' && this.temp && this.temp.length){
          const newData = this.temp.map((key,index)=>{
            let temp1 = Object.assign({}, key);
            return temp1;
          })
          this.state[stateval] = newData
        }
        this.setState({columnSt:false})
    }

    setFields(value,mystate){
      if(mystate){
        this.state[mystate]=value;
        this.setState({refresh:true})
      }

    }

    setGroupInf(rowInfo){
      if(rowInfo){
        this.setState({userName:rowInfo.original["UserID"],email:rowInfo.original["EmailId"],fName:rowInfo.original["FirstName"],lName:rowInfo.original["LastName"],grpName:rowInfo.original["UserGroup"],status:rowInfo.original["StatusID"].toString(),rowInfo:rowInfo.original,addUserPop:2},()=>{
          console.log(this.state)
        })
      }
    }

    onCancle(){
      this.setState({userName:"",email:"",fName:"",lName:"",addUserPop:0})
    }

    setUser(){
      this.setState({loading:true,addUserPop:false})
      let userGrpId;
      userGrp.map((key,index)=>{
        if(key.value === this.state.grpName){
          userGrpId = key.id;
        }
      })
      if(this.state.addUserPop === 1){
        let obj =  {
          "EmailId":this.state.email,
          "FirstName":this.state.fName,
          "LastName":this.state.lName,
          "Password":null,
          "Permission":null,
          "StatusID":this.state.status,
          "UserGroup":this.state.grpName,
          "UserGroupID":userGrpId,
          "UserID":this.state.userName,
          "UserRowID":null
        }
        postData("UserMgmt/AddUser",obj)
        .then((res)=>{
          if(res.data && res.data.ReturnCode == 0){
            this.getRecord();
          }else{
            this.setState({loading:false})
          }
        })
      }else if(this.state.addUserPop === 2){
        let obj =  {
          "EmailId":this.state.email,
          "FirstName":this.state.fName,
          "LastName":this.state.lName,
          "Password":this.state.rowInfo["Password"],
          "Permission":this.state.rowInfo["Permission"],
          "StatusID":this.state.status,
          "UserGroup":this.state.grpName,
          "UserGroupID":userGrpId,
          "UserID":this.state.userName,
          "UserRowID":this.state.rowInfo["UserRowID"]
        }
        putData("UserMgmt/EditUser",obj)
        .then((res)=>{
          if(res.data && res.data.ReturnCode == 0){
            this.getRecord();
          }else{
            this.setState({loading:false})
          }
        })
      }
      
    }

    setDelete(e,rowInfo){
      if(e){
        this.state.delete.push(rowInfo.original["UserRowID"])
      }else{
        var index = this.state.delete.indexOf(rowInfo.original["UserRowID"]);
        if (index >= 0) {
          this.state.delete.splice( index, 1 );
        }
    
      }
    }

    deleteUser(value){
      if(value === "Confirm"){
        if(this.state.delete && this.state.delete.length > 0){
          this.setState({dlgtitle:"Confirmation",message:"Are you sure?",dlgType:"confirmation",dlgEnable:true})
        }else{
            this.setState({dlgtitle:"Information",message:"Please Select User(s)",dlgType:"Information",dlgEnable:true})
        }
      }else{
        if(this.state.delete && this.state.delete.length > 0){
          this.setState({dlgEnable:false,loading:true})
          let obj ={
            "pArrayCollection":this.state.delete
          }
          
          postData("UserMgmt/DeleteUser",obj)
          .then((res)=>{
            if(res.data && res.data.ReturnCode === 0){
              this.getRecord();
            }else{
              this.setState({loading:false})
            }
          })
        }else{
          this.setState({dlgEnable:false})
        }
        
      }
      
    
    }
 
  
    render(){
        return(
           <div>
                {
                  this.state.addUserPop > 0 ?
                  <div className="Loader">
                        <div className="addUserMainWrp userpop" style={{height: "350px"}}>
                            <div className="ForgPassTitle">Add User</div>
                            <div style={{marginTop:"30px"}}>
                                <div className="LoginInptChildWrp">
                                    <div className="ForgPassUsrNm userMgmLabel">User Name </div>
                                    <div className="requiredField">*</div>
                                    <input className="LoginInputFld userMgmfield" onChange={(e)=>this.setFields(e.target.value,"userName")}  value={this.state.userName}></input>
                                </div>
                                <div className="LoginInptChildWrp">
                                    <div className="addsUsrNm1 userMgmLabel">Email </div>
                                    <div className="requiredField">*</div>
                                    <input className="LoginInputFld userMgmfield" onChange={(e)=>this.setFields(e.target.value,"email")} autoComplete="on" value={this.state.email}></input>
                                </div>
                                <div className="LoginInptChildWrp">
                                    <div className="ForgPassUsrNm userMgmLabel">First Name </div>
                                    <div className="requiredField">*</div>
                                    <input className="LoginInputFld userMgmfield" onChange={(e)=>this.setFields(e.target.value,"fName")} autoComplete="on" value={this.state.fName}></input>
                                </div>
                                <div className="LoginInptChildWrp">
                                    <div className="ForgPassUsrNm userMgmLabel">Last Name </div>
                                    <div className="requiredField">*</div>
                                    <input className="LoginInputFld userMgmfield" onChange={(e)=>this.setFields(e.target.value,"lName")} autoComplete="on" value={this.state.lName} error={true}></input>
                                </div>
                                <div className="LoginInptChildWrp">
                                    <div className="addUsrNm userMgmLabel">User Group</div>
                                    <div className="requiredField">*</div>
                                    <div className="userMgmfield">
                                        <select className="DropDwn"  style={{width: "75%"}} onChange={(e)=>this.setFields(e.target.value,"grpName")} value={this.state.grpName}>
                                            <option value="MANAGER" >MANAGER</option>
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                            <option value="SCHEDULER">SCHEDULER</option>
                                            <option value="NBCUSER">NBCUSER</option>
                                        </select>
                                    </div>

                                </div>
                                <div className="LoginInptChildWrp">
                                    <div className="addUsrNm1 userMgmLabel">Status</div>
                                    <div className="requiredField" style={{width: "2%"}}> </div>
                                    <div className="userMgmfield">
                                        <select className="DropDwn" style={{width: "75%"}} onChange={(e)=>this.setFields(e.target.value,"status")} value={this.state.status}>
                                            <option value="0" >Active</option>
                                            <option value="1">Inactive</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <div style={{width: "90%"}}>
                                    <div className="addUserBtm">
                                        <img src={require("../../../Assets/Images/Login/ok-btn.png")} className="ForgPassBtn" onClick={()=>this.setUser()}></img>
                                        <img src={require("../../../Assets/Images/Login/cancel-btn.png")} className="ForgPassBtn" onClick={()=>this.onCancle()}></img>
                                    </div>
                                </div>
                                <div style={{width: "10%"}}></div>
                            </div>

                        </div>
                    </div>
                    :
                    this.state.dlgEnable && 
                    <Dialog title={this.state.dlgtitle} message={this.state.message} onOk={()=>this.deleteUser("delete")} onCancel={()=>this.setState({dlgEnable:false})} type={this.state.dlgType}></Dialog>
                }
                
                 <div className="TableBorder">
                    {
                      this.state.columnSt &&
                      <ColumnStatus data={this.state.columns} onChange={(e)=>this.setColumn(e,'columns')} class={"SchedColumnHideWrp"} onClose={(e)=>this.resetColmn(e,'columns')}></ColumnStatus>
                    }
                  <div className="ScheduleTabToolWrp">
                        <img src={require('../../../Assets/Images/User/add-user.png')} className="ScheduleupldImg" onClick={()=>this.setState({addUserPop:1})}></img>
                        <img src={require('../../../Assets/Images/User/delete-user.png')} className="ScheduleupldImg" onClick={()=>this.deleteUser("Confirm")}></img>
                      <div className="ScheduleTableToolCont">
                          {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>this.getRecord()}></img>
                      </div>
                  </div>
                  <ReactTable
                      data={this.state.data}
                      loading={this.state.loading}
                      columns={this.state.columns}
                      NoDataComponent={()=>null}
                      PaginationComponent={Pagination}
                      totlaItems={this.state.totalCnt}
                      filterCnt={this.state.filterCnt}
                      filtered={this.state.filtered}
                      sortable={false}
                      style={{
                        height: "440px" // 
                      }}
                      getTrGroupProps={(state, rowInfo, column, instance) => { return { onDoubleClick: (e, handleOriginal) =>{this.setGroupInf(rowInfo)}}}}
                      getTheadFilterProps={(state, rowInfo, column, instance) => {
                        return {
                          style:
                            this.state.visibleFilters.length === 0
                              ? { display: "none" }
                              : null
                        };
                      }}
                      getTheadFilterThProps={(state, rowInfo, column, instance) => {
                        return {
                          className:
                            this.state.visibleFilters.indexOf(column.id) < 0
                              ? "hiddenFilter"
                              : null
                        };
                      }}
                  />
            </div>
           </div>
        )
    }
}