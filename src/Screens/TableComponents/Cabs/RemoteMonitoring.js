import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import {getData, postData} from "../../../Services/MainServices";
import {Search} from "../../CommomComponents/Filters";
import Dialog from "../../CommomComponents/Dialog";
import moment from "moment";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ComCheck from "../../CommomComponents/ComCheck";
import { data } from 'autoprefixer';
import {ExportCSV} from '../../../Utility/ExportCSV.js';


const tabColumns=[
    [
        {accessor:"UNITID",lable:"Unit ID"},
        {accessor:"UNITKEY",lable:"IMSI"},
        {accessor:"IPAddress",lable:"IP Address"},
        {accessor:"CABNUMBER",lable:"Cab Number"},
        {accessor:"LastUpdate",lable:"Last Update"},
        {accessor:"UnitType",lable:"Unit Type"},
        {accessor:"statusID",lable:"Status"},
        {accessor:"CLIENTNAME",lable:"Client Name"},
        {accessor:"CLIENTCODE",lable:"Client Code"},
        {accessor:"Verunit",lable:"Verunit"},
    ],
    [
        {accessor:"UnitID",lable:"Unit ID"},
        {accessor:"CABNUMBER",lable:"Cab Number"},
        {accessor:"CommandName",lable:"Command Name"},
        {accessor:"Command Parameters",lable:"Command Parameters"},
        {accessor:"Status",lable:"Status"},
        {accessor:"Dated",lable:"Date Added"},
        {accessor:"Mange from Device",lable:"Mange from Device"},
        {accessor:"DateSent",lable:"Date Sent"},
        {accessor:"DateCompleted",lable:"Date Completed"},
    ]
]

const status =["Lost",""];
const resetModules=["iTapp","TRS","PIM Replica","Watchdog","Horton","Map"];
const runFile=["Restart Unit","Run as Administrator","Wait for Completion",]


export default class RemoteMonitoring extends Component{
    tabs=["Unit List","Command Status"];
    constructor(props){
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state={
            tabIndex:0,
            filterVal:[],
            visibleFilters:[],
            filtered:[],
            columns:[],
            data:[],
            loading:false,
            strDate:new Date(),
            endDate:new Date(),
            selectedLoppIndex:1,
            cabId:[],
            commands:[],
            columnSt:false,
            addCmd:false,
            addCommand:1,
            cmdName:"",
            cmdCheck:[],
            rnFileCheck:[],
            parameters:"",
            cancleCmd:false,
            checkData:[],
            cancleCheck:[],
            loading1:false,
            dlgEnable:false,
            message:"",
            dlgtitle:"",
            dlgEnable1:false,
            exportFileName:"remotemonitoring",
            recordfilterCount:0,
        }
    }

    componentDidMount(){
        let date = new Date();
          date.setDate(date.getDate()-30);
          this.setState({strDate:date})
        this.setTab(this.state.tabIndex);
        this.getCommands();
        document.addEventListener('mousedown', this.handleClickOutside);
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

    cancleColumns=[
        {
            Header: "#",
            Cell: (rowInfo) => <ComCheck   onChange={(e)=>this.setCancleCmd(e,rowInfo.original.CommandID)} checked={this.state.cancleCheck.indexOf(rowInfo.original.CommandID) !== -1}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
            width:25
        },
        {
            Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
            <div>Command</div>
              </div>
            </div>,
            accessor:"CommandName",
            show:true,
              
           }

    ]

    setCancleCmd(e,id){
        let index = this.state.cancleCheck.indexOf(id);
        if(e && index === -1){
            this.state.cancleCheck.push(id)
        }else{
            this.state.cancleCheck.splice(index,1)
        }
        this.setState({refresh:true})
    }

    selectAllCancel(e){
        let tempCmd = this.state.commands;
        this.setState({commands:[],cancleCheck:[],loading1:true},()=>this.setAllCancle(e,tempCmd))
    }

    setAllCancle(e,temp){
        if(e){
            for(let i=0;i<temp.length;i++){
                this.state.cancleCheck.push(temp[i].CommandID)
            }
        } 
        this.setState({commands:temp,loading1:false})
    }

    setCommand(e,key){
        let index = this.state.cmdCheck.indexOf(key)
        if(e && index === -1){
            this.state.cmdCheck.push(key)
        }else if(!e &&  index >=0){
            this.state.cmdCheck.splice(index,1)
        }
        this.setState({refresh:true})
    }

    setRnFlCmd(e,key){
        let index = this.state.rnFileCheck.indexOf(key)
        if(e && index === -1){
            this.state.rnFileCheck.push(key)
        }else if(!e &&  index >=0){
            this.state.rnFileCheck.splice(index,1)
        }
        this.setState({refresh:true})
    }

    setTab(index){
        let dColumn = [];
        let sColumn=[];
        this.state.filterVal=[];
        this.state.filtered=[];
        this.setState({loading:true,data:[]})
        if(index === 0){
            let obj = {
                Header: "#",
                Cell: (rowInfo) => <ComCheck   onChange={(e)=>this.setData(e,rowInfo.index)} checked={this.state.checkData.indexOf(rowInfo.index) !== -1}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
                width:25
            }
            dColumn.push(obj)
        }
        if(tabColumns && tabColumns[index]){
            tabColumns[index].map((key,index)=>{
                this.state.filterVal.push("")
                let obj={};
                if(key.accessor === "LastUpdate" || key.accessor === "Dated" || key.accessor === "DateSent" || key.accessor === "DateCompleted"){
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                        {
                            this.state.filterVal[index] === ""?
                            <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                            :
                            <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                        }
                        </div>
                        <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{
                                this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                            }
                            </div>
                        </div>,
                        accessor:key.accessor,
                        
                        show:true,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
                                }
                               
                            }
                            return false;
                          },
                        // Filter: (cellInfo) =>
                        //     <div>{
                        //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                        //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                        //     }
                        //     </div>,
                        Cell:(rowInfo)=><div className="SystFlColContainer">{this.gonvertDate(rowInfo.original[key.accessor])}</div>
        
                    }
                }else if(key.accessor === "statusID"){
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                        {
                            this.state.filterVal[index] === ""?
                            <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                            :
                            <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                        }
                        </div>
                        <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{
                                this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.grpsetStatusFilter(e,"key",cellInfo.column.id,2,"fileType",status)} value={this.state.filterVal[index]}></Search>
                            }
                            </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        filterable:true,
                        // Filter: (cellInfo) =>
                        //     <div>{
                        //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                        //         <Search onChange={(e)=>this.grpsetStatusFilter(e,"key",cellInfo.column.id,index,"fileType",status)} value={this.state.filterVal[index]}></Search>
                        //     }
                        //     </div>,
                         Cell: props => <span className='number'>{status[props.value]}</span>,
        
                    }
               
                }else if(key.accessor === "Status"){
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                        {
                            this.state.filterVal[index] === ""?
                            <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                            :
                            <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                        }
                        </div>
                        <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{ 
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                          }
                          </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
                                }
                               
                            }
                            return false;
                          },
                          Cell:props=><span>
                              {
                                  this.getStatus(props.value)
                              }
                          </span>
                    
                      //   Filter: (cellInfo) =>
                      //   <div>{ 
                      //       this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                      //       <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                      //     }
                      //     </div>
                          
                       }

                }else{
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                        {
                            this.state.filterVal[index] === ""?
                            <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                            :
                            <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                        }
                        </div>
                        <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{ 
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                          }
                          </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
                                }
                               
                            }
                            return false;
                          },
                    
                      //   Filter: (cellInfo) =>
                      //   <div>{ 
                      //       this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                      //       <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                      //     }
                      //     </div>
                          
                       }
                }
               
                   dColumn.push(obj);
                
            })
            let obj1={
                Header:"",
                width:10
              }
              dColumn.push(obj1);
              this.setState({columns:dColumn,tabIndex:index},()=>this.getRecords())
        }
    }

    getStatus(val){
        switch(val) {
            case -1:
                return " Canceled";
            case 0:
                return " New ";
            case 1:
                return " Command sent to unit and waiting for response";
            case 2:
                return " Command executed successfully by unit";
            case 3:
                return " Command executed by unit, but there is some error";
            case 4:
                return " Command not supported by unit";
        }
    }

    setData(e,index){
        let dataIndex = this.state.checkData.indexOf(index);
        if(e && dataIndex === -1){
            this.state.checkData.push(index)
        }else if(!e && dataIndex >=0){
            this.state.checkData.splice(dataIndex,1)
        }
    }

    selectAll(e){
        let tempData = this.state.data;
        this.setState({data:[],checkData:[],loading:true},()=>this.setAll(e,tempData))
       
    }
    setAll(e,myData){
        if(e){
           for(let i=0;i<myData.length;i++){
               this.state.checkData.push(i)
           } 
        }
        this.setState({data:myData,loading:false})
    }

    grpsetStatusFilter(e,key,accessor,index1,type,type1){
        let index =-1;
        for(let i=0;i<type1.length;i++){
            if(e.target.value !== "" && type1[i].toUpperCase().includes(e.target.value.toUpperCase())){
               if(index === -1){
                index = i 
               }
            }
        }
        if(index !== -1){
            this.multicustomFilerChange(index,accessor,index1,e.target.value)
        }else{
            this.multicustomFilerChange(null,accessor,index1,e.target.value)
        }
    }

    multicustomFilerChange(value,accessor,index,indexvalue){
        let filtered = this.state.filtered;
        let insertNewFilter = 1;
        this.state.filterVal[index]=indexvalue
        if (filtered.length) {
          filtered.forEach((filter, i) => {
            if(value !== null){
                if (filter["id"] === accessor) {
                    if (indexvalue === "" || !indexvalue.length){
                      filtered.splice(i, 1);
                     
                    }else{
                       filter["value"] = value;
                      
                      insertNewFilter = 0;
                    } 
                    
                  }
            }else{
                if (filter["id"] === accessor) {
                    if (indexvalue === "" || !indexvalue.length){
                      filtered.splice(i, 1);
                     
                    }else{
                        filter["value"] = indexvalue;
                      insertNewFilter = 0;
                    } 
                    
                  }
            }
          });
        }
    
        if (insertNewFilter) {
          if(value !== null){
            filtered.push({ id: accessor, value: value });
          }else{
            filtered.push({ id: accessor, value: indexvalue }); 
          }
        }
        let newFilter = filtered.map((key,index)=>{
          let temp1 = Object.assign({}, key);
          return temp1;
        })
        this.setState({ filtered: newFilter});
       }

    setFilter(id,index){
        this.setState(({ visibleFilters }) => {
          let update = [...visibleFilters];
          const index = update.indexOf(id);
          index < 0 ? update.push(id) : update.splice(index, 1);
          return { visibleFilters: update };
        });
       }

       customFilerChange(value,accessor,index){
        let filtered = this.state.filtered;
        let insertNewFilter = 1;
        this.state.filterVal[index]=value
        if (filtered.length) {
          filtered.forEach((filter, i) => {
            if (filter["id"] === accessor) {
              if (value === "" || !value.length){
                filtered.splice(i, 1);
                
              }else{
                 filter["value"] = value;
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

       getRecords(){
           this.setState({loading:true})
           if(this.state.tabIndex === 0){
               getData("RemoteMonitoring/Fetch")
               .then(res=>{
                if (res.data && res.data.ResponseCollection) {
                    this.state.data=[];
                    this.setState({data:res.data.ResponseCollection,loading:false})
                  }else{
                    this.setState({loading:false})
                  }
               })
           }else{
               let obj={
                "CabNumber":"",
                "Command":this.state.selectedLoppIndex,
                "strFromDate":moment(this.state.strDate).format("MM/DD/YYYY"),
                "strToDate":moment(this.state.endDate).format("MM/DD/YYYY")
            }
            postData("RemoteMonitoring/FetchCommandDetails",obj)
            .then(res=>{
                if (res.data && res.data.ResponseCollection) {
                    this.state.data=[];
                    this.setState({data:res.data.ResponseCollection,loading:false})
                  }else{
                    this.setState({loading:false})
                  }
               })
           }
       }

       gonvertDate(date){
        if(date){
            return moment(date).format("DD-MM-YYYY HH:mm:ss");
        }
  
    }

    getCommands(){
        getData("RemoteMonitoring/FetchCommandList")
        .then(res=>{
         if (res.data && res.data.ResponseCollection) {
             if(res.data.ResponseCollection.length>0){
                 this.setState({commands:res.data.ResponseCollection,selectedLoppIndex:res.data.ResponseCollection[0].CommandId})
             }

           }
        })
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

    setColumn=(e,stateval)=>{
        var myData = this.state[stateval];
        this.temp=this.state[stateval];
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

    addCmdToDB(){
        let passData = -1;
        let temp1=[];
        let cmdName="";
        for(let i=0;i<this.state.commands.length;i++){
            if(this.state.commands[i].CommandID === parseInt(this.state.addCommand)){
                cmdName = this.state.commands[i].CommandName
            }
        }
        if(this.state.addCommand === 13 || this.state.addCommand === "13") {
            if(this.state.parameters === ""){
                passData =1;
                this.setState({dlgEnable1:true,dlgtitle:"Information",message:"Add parameters."})
            }else{
                let str="";
                for(let i =0;i<3;i++){
                    if(this.state.rnFileCheck.indexOf(i)>=0){
                        str=str+"1,"
                    }else{
                        str=str+"0,"
                    }
                }
               for(let i=0;i<this.state.checkData.length;i++){
                   let obj=    {
                    "CABNUMBER": this.state.data[this.state.checkData[i]].CABNUMBER,
                    "CommandID": this.state.addCommand,
                    "CommandName": cmdName,
                    "CommandText": str+this.state.parameters,
                    "DateCompleted": moment(new Date()).format("MM/DD/YYYY"),
                    "Dated": moment(this.state.data[this.state.checkData[i]].Dated).format("MM/DD/YYYY"),
                    "DateSent": moment(new Date()).format("MM/DD/YYYY"),
                    "ErrorString": null,
                    "Status": this.state.data[this.state.checkData[i]].statusID,
                    "UnitID":this.state.data[this.state.checkData[i]].UNITID,
                    
                  }
                temp1.push(obj)
               }
            }
           
           
        }else if(this.state.addCommand === 1 || this.state.addCommand === "1"){
            for(let i=0;i<this.state.checkData.length;i++){
                let obj=    {
                 "CABNUMBER": this.state.data[this.state.checkData[i]].CABNUMBER,
                 "CommandID": this.state.addCommand,
                 "CommandName": cmdName,
                 "CommandText": this.state.parameters,
                 "DateCompleted": moment(new Date()).format("MM/DD/YYYY"),
                 "Dated":  moment(this.state.data[this.state.checkData[i]].Dated).format("MM/DD/YYYY"),
                 "DateSent": moment(new Date()).format("MM/DD/YYYY"),
                 "ErrorString": null,
                 "Status": this.state.data[this.state.checkData[i]].statusID,
                 "UnitID":this.state.data[this.state.checkData[i]].UNITID,
                 
               }
             temp1.push(obj)
            }
        }else if(this.state.addCommand === 2 || this.state.addCommand === "2"){
            for(let i=0;i<this.state.checkData.length;i++){
                let obj=    {
                 "CABNUMBER": this.state.data[this.state.checkData[i]].CABNUMBER,
                 "CommandID": this.state.addCommand,
                 "CommandName": cmdName,
                 "CommandText": this.state.parameters,
                 "DateCompleted": moment(new Date()).format("MM/DD/YYYY"),
                 "Dated":  moment(this.state.data[this.state.checkData[i]].Dated).format("MM/DD/YYYY"),
                 "DateSent": moment(new Date()).format("MM/DD/YYYY"),
                 "ErrorString": null,
                 "Status": this.state.data[this.state.checkData[i]].statusID,
                 "UnitID":this.state.data[this.state.checkData[i]].UNITID,
                 
               }
             temp1.push(obj)
            }
        }else if(this.state.addCommand === 3 || this.state.addCommand === "3"){
            if(this.state.cmdCheck.length === 0){
                passData =1;
                this.setState({dlgEnable1:true,dlgtitle:"Information",message:"Select module"})
            }else{
                let str="";
                for(let i = 0;i<this.state.cmdCheck.length;i++){
                    str=str+this.state.cmdCheck[i]+","
                }
                for(let i=0;i<this.state.checkData.length;i++){
                    let obj=    {
                     "CABNUMBER": this.state.data[this.state.checkData[i]].CABNUMBER,
                     "CommandID": this.state.addCommand,
                     "CommandName": cmdName,
                     "CommandText": str,
                     "DateCompleted": moment(new Date()).format("MM/DD/YYYY"),
                     "Dated": moment(this.state.data[this.state.checkData[i]].Dated).format("MM/DD/YYYY"),
                     "DateSent": moment(new Date()).format("MM/DD/YYYY"),
                     "ErrorString": null,
                     "Status": this.state.data[this.state.checkData[i]].statusID,
                     "UnitID":this.state.data[this.state.checkData[i]].UNITID,
                     
                   }
                 temp1.push(obj)
                }
            }
           
        }
        else if(this.state.addCommand === 4 || this.state.addCommand === "4"){
            if(this.state.parameters === ""){
                passData =1;
                this.setState({dlgEnable1:true,dlgtitle:"Information",message:"Add parameters."})
            }else{
                for(let i=0;i<this.state.checkData.length;i++){
                    let obj=    {
                     "CABNUMBER": this.state.data[this.state.checkData[i]].CABNUMBER,
                     "CommandID": this.state.addCommand,
                     "CommandName": cmdName,
                     "CommandText": this.state.parameters,
                     "DateCompleted":moment(new Date()).format("MM/DD/YYYY"),
                     "Dated":  moment(this.state.data[this.state.checkData[i]].Dated).format("MM/DD/YYYY"),
                     "DateSent": moment(new Date()).format("MM/DD/YYYY"),
                     "ErrorString": null,
                     "Status": this.state.data[this.state.checkData[i]].statusID,
                     "UnitID":this.state.data[this.state.checkData[i]].UNITID,
                     
                   }
                 temp1.push(obj)
                }
            }
            
        }
        if(passData === -1){
            let myObj={
                commandCollection:temp1
            }
            postData("RemoteMonitoring/AddCommandDetails",myObj)
            .then(res=>{
                if(res.data.ReturnCode === 0){
                    this.setState({addCmd:false,rnFileCheck:[],parameters:"",addCommand:1,cmdName:""})
                    this.setState({dlgEnable:true,dlgtitle:"Information",message:"command added successfully"})
                }else{
                    this.setState({addCmd:false,rnFileCheck:[],parameters:"",addCommand:1,cmdName:""})
                    this.setState({dlgEnable:true,dlgtitle:"Information",message:"Something went wrong please try agian."})
                }
            })
        }
    }

    addcancleCmdToDB(){
        if(this.state.cancleCheck.length > 0){
            let cmd="";
            let ids="";
            for(let i=0;i<this.state.cancleCheck.length;i++){
                if(i === this.state.cancleCheck.length-1){
                    cmd =cmd + this.state.cancleCheck[i]
                }else{
                    cmd=cmd+this.state.cancleCheck[i]+"."
                }
            }
            for(let i=0;i<this.state.checkData.length;i++){
                if(i === this.state.checkData.length-1){
                    ids =ids + this.state.data[this.state.checkData[i]].UNITID
                }else{
                    ids=ids+this.state.data[this.state.checkData[i]].UNITID+","
                }
            }

            let obj={
                "unitIDs":ids,//this is selected unit's ids
                "commandIDs" : cmd //this is selected commond'sids
              }

              postData("RemoteMonitoring/CancelCommand",obj)
              .then(res=>{
                  if(res.data.ReturnCode === 0){
                      this.setState({cancleCmd:false,cancleCheck:[]})
                      this.setState({dlgEnable:true,dlgtitle:"Information",message:"command canceled successfully"})
                  }else{
                    this.setState({cancleCmd:false,cancleCheck:[]})
                    this.setState({dlgEnable:true,dlgtitle:"Information",message:"command canceled successfully"})
                  }
              })

        }
    }

    checkValid(type){
        if(this.state.checkData.length > 0){
            if(type === "cancleCmd"){
                this.setState({cancleCmd:true})
            }else{
                this.setState({addCmd:true})
            }
           
        }else{
            this.setState({dlgEnable:true,dlgtitle:"Information",message:"Please select UnitIds."})
        }
    }

    render(){
        return(
            <div>
                 <div className="CabDtTabMainWrp">
                  {
                    this.tabs && this.tabs.map((key,index)=>(
                    <div className={this.state.tabIndex === index ?"CabDtTabWrp1":"CabDtTabWrp"} onClick={()=>this.setTab(index)} key={index}>{key}</div>
                    ))
                  }
                </div>
                {
                    this.state.columnSt ?
                    <ColumnStatus data={this.state.columns} onChange={(e)=>this.setColumn(e,'columns')} class={"SchedColumnHideWrp"} onClose={(e)=>this.resetColmn(e,'columns')}></ColumnStatus>
                    : this.state.addCmd ?
                   <div className="Loader">
                        <div className="SystemAddRelWrp1">
                             <div className="ForgPassTitle">Add Command</div>
                             <div className="addCmdChildWrp">
                                <div className="addCmdTxt" style={{marginLeft:"40px"}}>Command</div>
                                <div className="RightDiv-md22">
                                    <select className="SchedDropDwn12" onChange={(e)=>this.setState({addCommand:e.target.value,cmdCheck:[],parameters:"",rnFileCheck:[]})} value={this.state.addCommand}>
                                    {
                                        this.state.commands && this.state.commands.map((key,index)=>{
                                            return(
                                                <option value={key.CommandID} onClick={()=>this.setState({cmdName:key.CommandName})}>{key.CommandName}</option>
                                            )
                                        })
                                    }
                                    </select>
                                </div>
                             </div>
                             {
                                 this.state.addCommand == 3 &&
                                 <div className="addCmdChildWrp">
                                  <div className="addCmdTxt" style={{marginLeft:"36px"}}>Select Modules</div>
                                  <div className="addCmdCheckWrp">
                                      {
                                          resetModules.map((key,index)=>(
                                              <div style={{display:"flex",marginTop:"4px"}}>
                                                   <ComCheck onChange={(e)=>this.setCommand(e,key)} containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                                    <span>{key}</span>
                                              </div>
                                           
                                          ))
                                      }
                                  </div>
                                 </div>
                             }
                              {
                                 this.state.addCommand == 13 &&
                                 <div className="addCmdChildWrp">
                                  <div className="addCmdTxt" style={{marginLeft:"98px"}}></div>
                                  <div className="addCmdCheckWrp">
                                      {
                                          runFile.map((key,index)=>(
                                              <div style={{display:"flex",marginTop:"4px"}}>
                                                   <ComCheck onChange={(e)=>this.setRnFlCmd(e,index)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                                    <span>{key}</span>
                                              </div>
                                           
                                          ))
                                      }
                                  </div>
                                 </div>
                             }
                            
                             {
                                 (this.state.addCommand == 1 || this.state.addCommand == 4 || this.state.addCommand == 13)   && 
                                    <div className="addCmdChildWrp">
                                        <div className="addCmdTxt" style={{marginLeft:"36px"}}>Parameters</div>
                                        <textarea onChange={(e)=>this.setState({parameters:e.target.value})}></textarea>
                                    </div>
                             }
                             <div className="SystFlUpldBtm">
                                 <img src={require("../../../Assets/Images/Login/ok-btn.png")} className="SystFlnextBtn"
                                      onClick={() => this.addCmdToDB()}></img>
                                 <img src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                      className="SystFlnextBtn" onClick={() =>  this.setState({addCmd:false,rnFileCheck:[],parameters:"",addCommand:1,cmdName:""})}></img>
                             </div>
                        </div>
                       {
                            this.state.dlgEnable1 &&
                            <Dialog title={this.state.dlgtitle} message={this.state.message} onOk={()=>this.setState({dlgEnable1:false})} onHide={()=>this.setState({dlgEnable1:false})}/>     
                       }
                   </div>
                   : this.state.cancleCmd ?
                   <div className="Loader">
                        <div className="SystemAddRelWrp1">
                             <div className="ForgPassTitle">Cancel Command</div>
                             <ReactTable
                                data={this.state.commands}  ///this main file view grid
                                columns={this.cancleColumns}
                                loading={this.state.loading1}
                                NoDataComponent={()=>null}
                                showPagination={false}
                                manual={false}
                                minRows={6}
                                defaultPageSize={6}
                                pageSize={this.state.commands.length}
                                sortable={false}
                                // style={{height:"420px"}}
                              
                            
                            />
                             <div className="SystFlUpldBtm">
                                   <div id="addcabbtncontainer" className="popsubhead2">
                                         <div>
                                             <ComCheck checked={this.state.isAllSelected}  onChange={(e)=>this.selectAllCancel(e)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                         </div>
                                         <div>Select/De-select all</div>

                                     </div>
                                 <img src={require("../../../Assets/Images/Login/ok-btn.png")} className="SystFlnextBtn"
                                      onClick={() => this.addcancleCmdToDB()}></img>
                                 <img src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                      className="SystFlnextBtn" onClick={() => this.setState({cancleCmd: false,cancleCheck:[]})}></img>
                             </div>
                        </div>     
                   </div>
                    : this.state.dlgEnable &&
                     <Dialog title={this.state.dlgtitle} message={this.state.message} onOk={()=>this.setState({dlgEnable:false})} onHide={()=>this.setState({dlgEnable:false})}/>
                }
                <div className="ScheduleTabToolWrp">
                {
                    this.state.tabIndex === 1 ?
                     <div className="cabDtTabToolWrp">
                         <div className="ForgPassUsrNm2">Command</div>
                         <div className="RightDiv-md21">
                                <select className="SchedDropDwn12" onChange={(e)=>this.setState({selectedLoppIndex:e.target.value})} value={this.state.selectedLoppIndex}>
                                <option value={0}>All Commands</option>
                                  {
                                      this.state.commands && this.state.commands.map((key,index)=>{
                                          return(
                                            <option value={key.CommandID}>{key.CommandName}</option>
                                          )
                                      })
                                  }
                                </select>
                            </div>
                        <div className='SchedHeadTxt'>From</div>
                            <DatePicker selected={new Date(this.state.strDate)}   onChange={(date)=>this.setState({strDate:date},()=>console.log(this.state.strDate))}  wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            <div className='SchedHeadTxt'>To</div>
                            <DatePicker selected={this.state.endDate}  onChange={(date)=>this.setState({endDate:date})} wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            <img src={require('../../../Assets/Images/Filter/apply-filter.png')} className="ScheduleupldImg" onClick={()=>{
                               this.setState({loading:true},()=>{this.getRecords();})
                            }}></img>
                   </div>
                   :this.state.tabIndex === 0 &&
                   <div className="ScheduleTableToolCont1">
                            <div id="addcabbtncontainer" className="popsubhead1">
                                         <div>
                                             <ComCheck checked={this.state.isAllSelected}  onChange={(e)=>this.selectAll(e)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                         </div>
                                         <div>Select/De-select all</div>

                                     </div>
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require("../../../Assets/Images/Group/add-over.png")} className="SchedGrpTableToolImg groupIcon" onClick={() => this.checkValid("addCmd")}></img>
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require("../../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg groupIcon" onClick={()=> this.checkValid("cancleCmd")}></img>
                     
                   </div>
                 }
                   <div className="ScheduleTableToolCont">
                       {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <ExportCSV csvData={this.state.data} fileName={this.state.exportFileName} visibleCol={this.state.columns} isConversion={false} callback={()=>this.getRecords("GroupADSFLFiles/Fetch")} />
                       {/*<img src={require('../../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg"></img>*/}
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>this.getRecords()}></img>
                     
                   </div>
               </div>
               <ReactTable
                 data={this.state.data}  ///this main file view grid
                 columns={this.state.columns}
                 loading={this.state.loading}
                 NoDataComponent={()=>null}
                 showPagination={false}
                 filtered={this.state.filtered}
                 manual={false}
                 minRows={20}
                 defaultPageSize={20}
                 pageSize={this.state.data.length}
                 sortable={false}
                 style={{height:"420px"}}
                 getTheadFilterProps={(state, rowInfo, column, instance) => {
                   return {
                     style:
                     { display: "none" }
                   };
                 }}
               
              />
            </div>
        )
    }
}