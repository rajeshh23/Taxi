import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import Loader from '../../CommomComponents/Loader';
import {getData, postData,deletData} from "../../../Services/MainServices";
import Pagination from "../../CommomComponents/Pagination";
import {Search} from "../../CommomComponents/Filters";
import Dialog from "../../CommomComponents/Dialog";
import moment from "moment";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { yellow } from 'colorette';
import {ExportCSV} from '../../../Utility/ExportCSV.js';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


   let tabColumns=[
     [{accessor:"UNITKEY",lable:"IMSI"},{accessor:"IPAddress",lable:"IP Address"},{accessor:"CABNUMBER",lable:"Cab Number"},{accessor:"LastUpdate",lable:"Last Update"},{accessor:"UnitType",lable:"Unit Type"},{accessor:"Current",lable:"Status"},{accessor:"LastIndex",lable:"Unit Index"},{accessor:"IND",lable:"Latest Index"},{accessor:"SurveyUnitIndex",lable:"SurveyUnitIndex"},{accessor:"SurveyServerIndex",lable:"SurveyServerIndex"},{accessor:"CLIENTNAME",lable:"Client Name"},{accessor:"CCCODE1",lable:"Client Code"},{accessor:"Verunit",lable:"Verunit"},{accessor:"UnitMode",lable:"UnitMode"}],
    //  [{accessor:"CABNUMBER",lable:"Cab Number"},{accessor:"UNITKEY",lable:"IMSI"},{accessor:"IPAddress",lable:"IP Address"},{accessor:"UNITTYPE",lable:"Unit Type"},{accessor:"strDated",lable:"Last Update"},{accessor:"IsUpdated",lable:"IsUpdated"}],
     [
       {accessor:"UnitID",lable:"Cab Number"},
       {accessor:"UNITKEY",lable:"IMSI"},
       {accessor:"IPAddress",lable:"IP Address"},
       {accessor:"UNITTYPE",lable:"Unit Type"},
       {accessor:"DIM",lable:"Dim"},
       {accessor:"CCCODE1",lable:"Client Code"},
       {accessor:"GBVersion",lable:"GBVersion"},
       {accessor:"strDated",lable:"Last Updated"},
       /*{accessor:"streFleetLastPingTime",lable:"eFleet Last Ping Time"},*/
       {accessor:"Lat",lable:"Lattitude"},
       {accessor:"Long",lable:"Longitude"},
       {accessor:"strGPSLastUpdateTime",lable:"GPS Last Updated"},
       {accessor:"GPSStatus",lable:"GPS Status"},
       {accessor:"WatchDog",lable:"Watch Dog"},
       {accessor:"TaxiRideService",lable:"Taxi Ride"},
       {accessor:"PIMReplica",lable:"PIM Replica"},
       {accessor:"iTapp",lable:"ITapp"},
       {accessor:"MUA",lable:"MUP"},
       {accessor:"Map",lable:"Map"},
       {accessor:"CommandHandler",lable:"Command Handler"},
       {accessor:"EWFHotFix",lable:"EWFHotFix"},
       {accessor:"NTPKill",lable:"NTPKill"},
       {accessor:"EWFStatus",lable:"EWFStatus"},
       {accessor:"FreeSpaceDriveC",lable:"C Drive Space"},
       {accessor:"FreeSpaceDriveD",lable:"D Drive Space"},
       {accessor:"TickerControl",lable:"Ticker Control"},
       {accessor:"VTMSMediaManager",lable:"VTMS Media Manager"},
       {accessor:"Vx510",lable:"Vx510"},
       {accessor:"Vx820",lable:"Vx820"},
       {accessor:"UnitMode",lable:"UnitMode"},
     ],
     [
       {accessor:"MEDALLION_NUMBER",lable:"Medallion Number"},
       {accessor:"imsi",lable:"IMSI"},
       {accessor:"driverid",lable:"Driver ID"},
       {accessor:"LATITUDE",lable:"Latitude"},
       {accessor:"LONGITUDE",lable:"Longitude"},
       {accessor:"STATUS",lable:"Meter Status"},
       {accessor:"PingStatus",lable:"Ping Status"},
       {accessor:"DIRECTION",lable:"Direction"},
       {accessor:"TIMESTAMP",lable:"TimeStamp"},
       {accessor:"StrLastUpdate",lable:"Last Update"},
     ],
     [
       {accessor:"MASTER_DRIVERID",lable:"Master Driver ID"},
       {accessor:"FIRSTNAME",lable:"First Name"},
       {accessor:"LASTNAME",lable:"Last Name"},
       {accessor:"STATE_LIC",lable:"State LIC"},
       {accessor:"PROF_LIC",lable:"Prof LIC"},
       {accessor:"ADDRESS",lable:"Address"},
       {accessor:"CITY",lable:"City"},
       {accessor:"STATE",lable:"State"},
       {accessor:"ZIP",lable:"Zip"},
       {accessor:"GroupCompanyID",lable:"Group Company ID"},
       {accessor:"STATUSID",lable:"Status ID"},
       {accessor:"Phone",lable:"Phone"},
       {accessor:"Cell",lable:"Cell"},
       {accessor:"DBDateUpdated",lable:"Date Upadted"},
     ],

   ];

   const tabColDTTU=[
    [{accessor:"UNITKEY",lable:"IMSI"},{accessor:"IPAddress",lable:"IP Address"},{accessor:"CABNUMBER",lable:"Cab Number"},{accessor:"LastUpdate",lable:"Last Update"},{accessor:"UnitType",lable:"Unit Type"},{accessor:"Current",lable:"Status"},{accessor:"LastIndex",lable:"Unit Index"},{accessor:"IND",lable:"Latest Index"},{accessor:"CLIENTNAME",lable:"Client Name"},{accessor:"CCCODE1",lable:"Client Code"},{accessor:"Verunit",lable:"Verunit"},{accessor:"UnitMode",lable:"UnitMode"},{accessor:"PIM",lable:"PIM"},{accessor:"DIM",lable:"DIM"}],
    [
      {accessor:"CABNUMBER",lable:"Cab Number"},
      {accessor:"UNITKEY",lable:"IMSI"},
      {accessor:"IPAddress",lable:"IP Address"},
      {accessor:"UNITTYPE",lable:"Unit Type"},
      {accessor:"Dated",lable:"Last Update"},
      {accessor:"IsUpdated",lable:"IsUpdated"}
     ],
    //  [{accessor:"CABNUMBER",lable:"Cab Number"},{accessor:"UNITKEY",lable:"IMSI"},{accessor:"IPAddress",lable:"IP Address"},{accessor:"UNITTYPE",lable:"Unit Type"},{accessor:"strDated",lable:"Last Update"},{accessor:"IsUpdated",lable:"IsUpdated"}],
     [
       {accessor:"UnitID",lable:"Cab Number"},
       {accessor:"UNITKEY",lable:"IMSI"},
       {accessor:"IPAddress",lable:"IP Address"},
       {accessor:"UNITTYPE",lable:"Unit Type"},
       {accessor:"DIM",lable:"Dim"},
       {accessor:"CCCODE1",lable:"Client Code"},
       {accessor:"GBVersion",lable:"GBVersion"},
       {accessor:"strDated",lable:"Last Updated"},
       {accessor:"streFleetLastPingTime",lable:"eFleet Last Ping Time"},
       {accessor:"Lat",lable:"Lattitude"},
       {accessor:"Long",lable:"Longitude"},
       {accessor:"strGPSLastUpdateTime",lable:"GPS Last Updated"},
       {accessor:"GPSStatus",lable:"GPS Status"},
       {accessor:"WatchDog",lable:"Watch Dog"},
       {accessor:"TaxiRideService",lable:"Taxi Ride"},
       {accessor:"PIMReplica",lable:"PIM Replica"},
       {accessor:"iTapp",lable:"ITapp"},
       {accessor:"MUA",lable:"MUP"},
       {accessor:"Map",lable:"Map"},
       {accessor:"CommandHandler",lable:"Command Handler"},
       {accessor:"EWFHotFix",lable:"EWFHotFix"},
       {accessor:"NTPKill",lable:"NTPKill"},
       {accessor:"EWFStatus",lable:"EWFStatus"},
       {accessor:"FreeSpaceDriveC",lable:"C Drive Space"},
       {accessor:"FreeSpaceDriveD",lable:"D Drive Space"},
       {accessor:"TickerControl",lable:"Ticker Control"},
       {accessor:"VTMSMediaManager",lable:"VTMS Media Manager"},
       {accessor:"Vx510",lable:"Vx510"},
       {accessor:"Vx820",lable:"Vx820"},
       {accessor:"UnitMode",lable:"UnitMode"}
     ],
     [
      {accessor:"CABNUMBER",lable:"Cab Number"},
      {accessor:"UNITKEY",lable:"IMSI"},
      {accessor:"IPAddress",lable:"IP Address"},
      {accessor:"UNITTYPE",lable:"Unit Type"},
      {accessor:"Dated",lable:"Last Update"},
      {accessor:"IsUpdated",lable:"IsUpdated"}
     ]


   ]

   const dttuSubTabs=[
     [
       {accessor:"ID",lable:"ID"},
       {accessor:"CabNumber",lable:"Cab Number"},
       {accessor:"UnitType",lable:"Unit Type"},
       {accessor:"Unitkey",lable:"IMSI"},
       {accessor:"StandbyMode",lable:"StandBy Mode"},
       {accessor:"SoftwareVersionInformation",lable:"Software Version Information"},
       {accessor:"SystemInformation",lable:"System Information"},
       {accessor:"SystemTime",lable:"System Time"},
       {accessor:"Volume",lable:"Volume"},
       {accessor:"UpTime",lable:"Up Time"},
       {accessor:"ActiveIncidentCount",lable:"Active Incident Count"},
       {accessor:"IncidentCountSinceReset",lable:"Incident Count Since Reset"},
       {accessor:"DesiredBrightnessFace1",lable:"Desired Brightness Face1"},
       {accessor:"DisplayBrightnessFace1",lable:"Desired Brightness Face2"},
       {accessor:"DesiredBrightnessFace2",lable:"Display Brightness Face1"},
       {accessor:"DisplayBrightnessFace2",lable:"Display Brightness Face2"},
     ],
     [
      {accessor:"ID",lable:"ID"},
      {accessor:"CabNumber",lable:"Cab Number"},
      {accessor:"UnitType",lable:"Unit Type"},
      {accessor:"Unitkey",lable:"IMSI"},
      {accessor:"StandbyMode",lable:"StandBy Mode"},
      {accessor:"SoftwareVersionInformation",lable:"Software Version Information"},
      {accessor:"SystemInformation",lable:"System Information"},
      {accessor:"SystemTime",lable:"System Time"},
      {accessor:"Volume",lable:"Volume"},
      {accessor:"UpTime",lable:"Up Time"},
      {accessor:"ActiveIncidentCount",lable:"Active Incident Count"},
      {accessor:"IncidentCountSinceReset",lable:"Incident Count Since Reset"},
      {accessor:"DesiredBrightnessFace1",lable:"Desired Brightness Face1"},
      {accessor:"DisplayBrightnessFace1",lable:"Desired Brightness Face2"},
      {accessor:"DesiredBrightnessFace2",lable:"Display Brightness Face1"},
      {accessor:"DisplayBrightnessFace2",lable:"Display Brightness Face2"},
    ]
   ]

   const grpCol=[
     {
       Header:"Group Name",
       accessor:"Name"
     }
   ]

   let tabUrl=[];
   let tabUrlForExport=[];
   const modStatus=["Lab/Demo","Production"]

export default class CabDetails extends Component{
  tem=[];
  tabs=["Unit List","Version Information","Taxi Tracking","Driver Information"];
  subTabs=["MRI Details","MRI Logs",];
  timer=null;
    constructor(props){
         super(props);
         this.handleClickOutside = this.handleClickOutside.bind(this);
         this.myRef = React.createRef();
        if(sessionStorage.getItem("marketId")){
            if(sessionStorage.getItem("marketId")=="MX925"){
                tabUrl=["UnitList/Fetch","DeviceInfo/Fetch"];

                this.tabs=["Unit List","Version Information"];
                tabColumns[0] = [
                    {accessor:"UNITKEY",lable:"IMSI"},
                    {accessor:"IPAddress",lable:"IP Address"},
                    {accessor:"CABNUMBER",lable:"Cab Number"},
                    {accessor:"LastUpdate",lable:"Last Update"},
                    {accessor:"UnitType",lable:"Unit Type"},
                    {accessor:"Current",lable:"Status"},
                    {accessor:"LastIndex",lable:"Unit Index"},
                    {accessor:"IND",lable:"Latest Index"},
                    {accessor:"CurrentMediaStorage",lable:"Current Media Storage"},
                    {accessor:"SurveyUnitIndex",lable:"SurveyUnitIndex"},
                    {accessor:"SurveyServerIndex",lable:"SurveyServerIndex"},
                    {accessor:"CLIENTNAME",lable:"Client Name"},
                    {accessor:"CCCODE1",lable:"Client Code"},
                    {accessor:"Verunit",lable:"Verunit"},
                    {accessor:"UnitMode",lable:"UnitMode"}
                    ]
                tabColumns[1]=[
                    {accessor:"UnitKey",lable:"IMSI"},
                    {accessor:"UnitID",lable:"Cab Number"},
                    {accessor:"WatchDog",lable:"Watch Dog"},
                    {accessor:"TaxiRideService",lable:"NT Ride Service"},
                    {accessor:"PIMReplica",lable:"Pim Replica"},
                    {accessor:"CCCODE1",lable:" Client Code"},
                    {accessor:"CLIENTNAME",lable:"Fleet name"},
                    {accessor:"Current",lable:"Online Status"},
                    {accessor:"Map",lable:"Map"},
                    {accessor:"DIM",lable:"Dim"},
                    {accessor:"iTapp",lable:"iTapp"},
                    {accessor:"USBFreeSpace",lable:"USB Free Space"},
                    {accessor:"USBStatusString",lable:"USB Status"},
                    {accessor:"SDCardStatus",lable:"SD Card Status"},
                    {accessor:"SDCardFreeSpace",lable:"SD Card Free Space"},
                    {accessor:"CurrentMediaStorage",lable:"Current Media Storage"},
                    {accessor:"strDated",lable:"Last Updated"},
                    {accessor:"ADAAudio",lable:"Asset"},
                    {accessor:"MapVersion",lable:"Map Version"},
                    {accessor:"commondhandler",lable:"Commond Handler"},
                    {accessor:"EWFHotFix",lable:"EWFHotFix"},
                    {accessor:"UnitMode",lable:"UnitMode"}
                ];

            }else if(sessionStorage.getItem("marketId")=="DTTU"){
                //tabUrl=["UnitList/Fetch","DeviceInfo/Fetch","UnitList/FetchDriverList","DeviceInfo/Fetch","DeviceInfo/FetchEhail"];
                tabUrl=["UnitList/Fetch","UnitList/FetchCabDetails","DeviceInfo/Fetch",];
                tabUrlForExport=["UnitList/FetchExport","UnitList/FetchCabDetails","DeviceInfo/FetchExport"];

                this.tabs=["Unit List","Cab Details Management","Version Information","MRI Hardware Status"];
            }else if(sessionStorage.getItem("marketId")=="GLACIER"){
                tabUrl=["UnitList/Fetch","DeviceInfo/Fetch"];
                this.tabs=["Unit List","Version Information"];
            }else{
                tabUrl=["UnitList/Fetch","DeviceInfo/Fetch","DeviceInfo/FetchEhail","UnitList/FetchDriverList"];
                this.tabs=["Unit List","Version Information","Taxi Tracking","Driver Information"];
                tabUrlForExport=["UnitList/FetchExport","DeviceInfo/FetchExport","DeviceInfo/FetchEhailExport","UnitList/FetchDriverListExport"];
            }
        }
         this.state={
             columns:[],
             data:[],
             columnSt:false,
             filtered:[],
             sty:{width:"30px",height:"0px"},
             filter:-1,
             tabIndex:0,
             loading:true,
             filterVal:[],
             visibleFilters:[],
             page:0,
             pageCount:0,
             filterCnt:0,
             totalCnt:0,
             typing: false,
             typingTimeout: 0,
             click:false,
             cabId:"",
             rowData:null,
             dlgEnable:false,
             message:"",
             dlgtitle:"",
             subTabIndex:0,
             strDate:new Date(),
             endDate:new Date(),
             rightAction: 0,
             selected:-1,
             selectedRowData:[],
             assGrp:false,
             grPData:[],
             grpLoading:false,
             exportFileName:"exportCabDetails",
             sortOption: [],
         }
        }

        componentDidMount(){
          let date = new Date();
          date.setDate(date.getDate()-7);
          this.setState({strDate:date})
          this.setTab(this.state.tabIndex);
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

         UnitModeFilterChange(value,accessor,index){
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

         setSort(accessor,index){
             let sorted = this.state.sortOption;
             let check=0;
             let order =0;
             if (sorted.length) {
                 sorted.forEach((sort, i) => {
                     if (sort["id"] === accessor) {
                         if(sort.hasOwnProperty("asc")){
                            order =1;
                         }
                        sorted.splice(i, 1);
                         check=1;
                     }
                 });
             }
             sorted=[];

             if(check === 0){
                 sorted.push({ id: accessor, asc: true });
             }
             if(check === 1 && order === 1){
                 sorted.push({ id: accessor, desc: true });
             }else if(check === 1){
                 sorted.push({ id: accessor, asc: true });
             }
             let newSorted = sorted.map((key,index)=>{
                 let temp1 = Object.assign({}, key);
                 return temp1;
             })
             this.setState({ sortOption: newSorted });
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

    onFilterChnage(value,accessor,index){

    }

    convertDate(date){
      if(date){
          if(!isNaN(Date.parse(date))){
              return moment(date).format("MM-DD-YYYY HH:mm:ss");

          }else{
              return ""
          }

      }else{
          return "";
      }

  }

    setTab(index){

      let tempCol=[]
      if(sessionStorage.getItem("marketId")=="DTTU"){
         tempCol = tabColDTTU;
      }else{
        tempCol = tabColumns;
      }
     if(tempCol && tempCol[index]){
       this.setState({loading:true,data:[],columns:[],visibleFilters:[],filtered:[],tabIndex:index})
      let dColumn = [];
      let sColumn=[];
      this.state.filterVal=[];
      this.state.filtered=[];
      this.state.sortOption=[];
         tempCol[index].map((key,index)=>{
           this.state.filterVal.push("")
           let obj={};
           if(key.accessor === "strDated" || key.accessor === "LastUpdate" || key.accessor === "Dated" || key.accessor==="streFleetLastPingTime" || key.accessor==="strGPSLastUpdateTime"){
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
                          return String(moment(row[filter.id]).format("DD-MMM-YYYY HH:mm:ss").toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
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
                Cell:(rowInfo)=><div className="SystFlColContainer">{this.convertDate(rowInfo.original[key.accessor])}</div>

            }
          }else if(key.accessor === "IsUpdated"){
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
              // Filter: (cellInfo) =>
              //     <div>{
              //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
              //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
              //     }
              //     </div>,
              Cell:(rowInfo)=><div className="SystFlColContainer">{rowInfo.original[key.accessor]?<span>Yes</span>:<span>No</span>}</div>

          }

          }else if(key.accessor === "UnitMode"){
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
              // Filter: (cellInfo) =>
              //     <div>{
              //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
              //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
              //     }
              //     </div>,
              Cell:(rowInfo)=><div className="SystFlColContainer">{modStatus[rowInfo.original.UnitMode]}</div>

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
                        return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0
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
      });
      let obj1={
        Header:"",
        width:10
      }
      dColumn.push(obj1);
      this.setState({columns:dColumn,tabIndex:index,page:0,subTabIndex:0,cabId:""},()=>{
        if(sessionStorage.getItem("marketId")=="DTTU" && this.state.tabIndex === 1){
          this.getRecords()
        }else  if(sessionStorage.getItem("marketId")=="DTTU" && this.state.tabIndex === 3){
          this.setSubTabs(this.state.subTabIndex)
        }else{
          this.refReactTable.fireFetchData();
        }


      });

     }
    }

    setSubTabs(index){
      this.setState({loading:true,data:[],columns:[],visibleFilters:[],filtered:[]})
      let dColumn = [];
      let sColumn=[];
      this.state.filterVal=[];
      this.state.filtered=[];
      this.state.sortOption=[];
      dttuSubTabs[index].map((key,index)=>{
        this.state.filterVal.push("")
        let obj={};
        obj={
          Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
          <div style={{marginRight:"15px",}}>{key.lable}</div>
              <div style={{display:"flex",marginLeft:"auto"}}>
                  <img src={require('../../../Assets/Images/Cab/sort.png')} className="ScheduleheadFilt1" onClick={()=>this.setSort(cellInfo.column.id,index)}></img>
                  {
                      this.state.filterVal[index] === ""?
                          <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                          :
                          <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                  }
              </div>
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
                        return String(moment(row[filter.id]).format("DD-MMM-YYYY HH:mm:ss").toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
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

       dColumn.push(obj);
      })
      let obj1={
        Header:"",
        width:10
      }
      dColumn.push(obj1);
      this.setState({columns:dColumn,subTabIndex:index,page:0},()=>{
        this.getDttuSubData();
      })
    }

    getDttuSubData(){
        if(this.state.subTabIndex === 0){
          getData("RemoteMonitoring/FetchMRI")
          .then(res => {
            if (res.data && res.data.ResponseCollection) {

              this.setState({data:res.data.ResponseCollection,loading:false,cabId:""})
            }else{
              this.setState({loading:false})
            }
        })
        }else{
         let obj={
              "CabNumber":this.state.cabId,
            "Command":0,
            "strFromDate":moment(this.state.strDate).format("MM/DD/YYYY"),
            "strToDate":moment(this.state.endDate).format("MM/DD/YYYY")
           }
           postData("RemoteMonitoring/FetchMRIlog",obj)
           .then(res => {
            if (res.data && res.data.ResponseCollection) {

              this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
            }
            else{
              this.setState({loading:false})
            }
           })
        }

    }

 getRecords(){
  this.setState({laoding:true})
  getData(tabUrl[this.state.tabIndex])
  .then((res)=>{
    if(res && res.data && res.data.ResponseCollection){
      console.log(res.data.ResponseCollection)
      this.setState({data:res.data.ResponseCollection,loading:false})
    }else{
      this.setState({data:[],loading:false})
    }
  })
 }
 getDTTUData(newFilter){
  if(this.state.tabIndex === 0){
    let obj1={

      "CABNUMBER":null,
      "IPAddress":null,
      "UNITKEY":null,
      "PIM":null,
      "iTapp":null,
      "Horton":null,
      "CCCODE1":null,
      "TermType":null,
      "GBVersion":null,
      "Ident":null,
      "MeterType":null,
      "DIM":null,
      "WatchDog":null,
      "TaxiRideService":null,
      "PIMReplica":null,
      "Map":null,
      "Current":null,
      "CLIENTNAME":null,
      "UnitMode":-1, // 0 for Lab/Demo  and 1 for production

      "strLastUpdate":null,

      "FilterUnitTypeList":null, ///for ex ["unknown","TREK","TaxiTopNYC"]/// this is multichoice filter

      "VerunitArr":null, ///for ex ["702","4000"] /// this is multichoice filter
      "SurveyServerIndex":-1, // bydefault-1
      "SurveyUnitIndex":-1 // bydefault-1

  }

    if(newFilter){
      for(let i=0;i<newFilter.length;i++){
          if(newFilter[i].value === ""){
              obj1[newFilter[i].id]= null
          }else{
              obj1[newFilter[i].id]= newFilter[i].value ;
          }
      }
     }
     let obj={
      "RowStart":(this.state.page*100)+1,
      "RowEnd":(this.state.page*100)+100,
      "unitlistCriteria":obj1
  }

    postData("UnitList/Fetch",obj)
        .then(res => {
            if (res.data && res.data.ResponseCollection) {
             console.log("++++++",res.data.ResponseCollection)
              this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
            }
        })

  }
  else if(this.state.tabIndex === 2){
    let obj1={
      "UNITKEY": null,
      "IPAddress": null,
      "UnitID": null,
      "strDated": null,
      "TaxiRideService": null,
      "iTapp": null,
      "Horton": null,
      "FreeSpaceDriveD": null,
      "Vx820": null,
      "SortColumn": "UnitID",
      "SortOrder": 0
  }

    if(newFilter){
      for(let i=0;i<newFilter.length;i++){
          if(newFilter[i].value === ""){
              obj1[newFilter[i].id]= null
          }else{
              obj1[newFilter[i].id]= newFilter[i].value ;
          }
      }
     }
     let obj={
      "RowStart":(this.state.page*100)+1,
      "RowEnd":(this.state.page*100)+100,
      "deviceInfoCriteria":obj1
  }

    postData("DeviceInfo/Fetch",obj)
        .then(res => {
            if (res.data && res.data.ResponseCollection) {

              this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
            }
        })
  }
  else if(this.state.tabIndex === 3){
    this.getDttuSubData();
  }

 }
    getTableData(newFilter){
      if(this.state.tabIndex === 3){
        let obj ={
          "PageNo":this.state.page+1,
          "RowCountPerPage":100,
          "SortColumn":"MASTER_DRIVERID"
         }
        postData(tabUrl[this.state.tabIndex],obj)
        .then((res)=>{
          if(res && res.data && res.data.ResponseCollection){
            this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
          }else{
            this.setState({data:[],loading:false})
          }
        })
      }
      else if(this.state.tabIndex === 0){
        this.setState({loading:true})
        let obj1={

          "CABNUMBER":null,
          "IPAddress":null,
          "UNITKEY":null,
          "PIM":null,
          "iTapp":null,
          "Horton":null,
          "CCCODE1":null,
          "TermType":null,
          "GBVersion":null,
          "Ident":null,
          "MeterType":null,
          "DIM":null,
          "WatchDog":null,
          "TaxiRideService":null,
          "PIMReplica":null,
          "Map":null,
          "Current":null,
          "CLIENTNAME":null,
          "UnitMode":-1, // 0 for Lab/Demo  and 1 for production

          "strLastUpdate":null,

          "FilterUnitTypeList":null, ///for ex ["unknown","TREK","TaxiTopNYC"]/// this is multichoice filter

          "VerunitArr":null, ///for ex ["702","4000"] /// this is multichoice filter
          "SurveyServerIndex":-1, // bydefault-1
          "SurveyUnitIndex":-1 // bydefault-1

      }

        if(newFilter){
          for(let i=0;i<newFilter.length;i++){
              if(newFilter[i].value === ""){
                  obj1[newFilter[i].id]= null
              }else{
                  obj1[newFilter[i].id]= newFilter[i].value ;
              }
          }
         }
         let obj={
          "RowStart":(this.state.page*100)+1,
          "RowEnd":(this.state.page*100)+100,
          "unitlistCriteria":obj1
      }

        postData("UnitList/Fetch",obj)
            .then(res => {
                if (res.data && res.data.ResponseCollection) {
                 console.log("++++++",res.data.ResponseCollection)
                  this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
                }
            })

      }
      else if(this.state.tabIndex === 1){
        let obj1={
          "UNITKEY": null,
          "IPAddress": null,
          "UnitID": null,
          "strDated": null,
          "TaxiRideService": null,
          "iTapp": null,
          "Horton": null,
          "FreeSpaceDriveD": null,
          "Vx820": null,
          "SortColumn": "UnitID",
          "SortOrder": 0
      }

        if(newFilter){
          for(let i=0;i<newFilter.length;i++){
              if(newFilter[i].value === ""){
                  obj1[newFilter[i].id]= null
              }else{
                  obj1[newFilter[i].id]= newFilter[i].value ;
              }
          }
         }
         let obj={
          "RowStart":(this.state.page*100)+1,
          "RowEnd":(this.state.page*100)+100,
          "deviceInfoCriteria":obj1
      }

        postData("DeviceInfo/Fetch",obj)
            .then(res => {
                if (res.data && res.data.ResponseCollection) {

                  this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
                }
            })
      }
      else if(this.state.tabIndex === 2){
        let obj1={
        "STATUS":null, //this will be array
        "LATITUDE":0,
        "LONGITUDE":0,
        "MEDALLION_NUMBER":null,
        "imsi":null,
        "driverid":null,
        "DIRECTION":0,
        "StrTimeTamp":null,
        "StrLastUpdate":null
    }

        if(newFilter){
          for(let i=0;i<newFilter.length;i++){
              if(newFilter[i].value === ""){
                  obj1[newFilter[i].id]= null
              }else{
                  obj1[newFilter[i].id]= newFilter[i].value ;
              }
          }
         }
         let obj={
          "PageNo":this.state.page+1,
          "RowCountPerPage":50,
          "eHailVOCriteria":obj1
      }

        postData("DeviceInfo/FetchEhail",obj)
            .then(res => {
                if (res.data && res.data.ResponseCollection) {

                  this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/50)})
                }
            })
      }
      else{
        let start = (this.state.page*100)+1;
        let end = (this.state.page +1)*100;
        getData(tabUrl[this.state.tabIndex]+"/"+start+"/"+end)
        .then((res)=>{
          if(res && res.data && res.data.ResponseCollection){
            this.setState({data:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
          }else{
            this.setState({data:[],loading:false})
          }
        })
      }
    }

    updateCabDetails(){
      let obj={
        "unitID":this.state.rowData.UNITID,
        "tempcabNumber":this.state.cabId//this new cab Number which enter in input
    }
    postData("UnitList/UpdateCabDetails",obj)
    .then(res=>{
      if(res.data.ReturnCode === 0){
        this.setState({click:false,dlgtitle:"Information",message:"Updated Successfully",dlgType:"information",dlgEnable:true},()=>this.getRecords())
       }else{
        this.setState({loading:false})
       }
    })

    }

    getAssociatedGrp(){
      this.setState({rightAction:0,assGrp:true,grpLoading:true});
      getData("GroupADSFL/GetAssociatedGroups/"+this.state.selectedRowData.UNITID)
      .then(res=>{
        if(res.data && res.data.ResponseCollection){
          let temp=[];
          for(let i=0;i<res.data.ResponseCollection.length;i++){
            let obj={
              Name:res.data.ResponseCollection[i]
            }
            temp.push(obj);
          }
          this.setState({grPData:temp,grpLoading:false})
        }else{
          this.setState({grPData:[],grpLoading:false})
        }
      })
      .catch(e=>{
        console.log(e,this.state.selectedRowData.CABNUMBER);
        this.setState({grPData:[],grpLoading:false})
      })
    }

    deletCab(){
      this.setState({rightAction:0,loading:true});
      deletData("UnitList/DeleteUnit/"+this.state.selectedRowData.UNITID)
      .then(res=>{
        console.log(res)
        if(res.data && res.data.ReturnCode === 0){
          this.getTableData(this.state.filtered)
        }else{
          this.setState({loading:false});
        }
      })
      .catch(e=>{
        this.setState({loading:false});
      })
    }

    updateUnitMode(){
      this.setState({rightAction:0,loading:true});
      let modType =0;
      if(this.state.selectedRowData.UnitMode === 0){
        modType=1;
      }
      let obj= {
        "unitListStr":this.state.selectedRowData.CABNUMBER,
        "mode":modType
        }

      postData("UnitList/UpdateUnitMode",obj)
      .then(res=>{
        console.log(res)
        if(res.data && res.data.ReturnCode === 0){
          this.getTableData(this.state.filtered)
        }else{
          this.setState({loading:false});
        }
      })
      .catch(e=>{
        this.setState({loading:false});
      })

    }

    callServerExport(csvData, fileName,visibleCol,isConversion,callback,expButton){
        console.log("call ExportCSV",csvData)
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        let visibleData =[]
        const loopType=["AdLoop","","WelcomeLoop","GoodByLoop","Payment Loop"];
        const dataChannel=["ALL","NBC","NYCM"];
        const FileType=["Video","Banner"];
        const statusType=["Scheduled","Upgrade Successfull","Yet to be scheduled"];
        console.log("export dttu visibleCol",visibleCol)
        console.log("csvData",csvData)
        visibleData = csvData;
        if(csvData){
            csvData.forEach(function (item) {
               if(item.LastUpdate){
                   item.LastUpdate = moment(item.LastUpdate).format("YYYY-MM-DD");
               }
            });
        }
        let datakeys=[]
        if(visibleCol){
            visibleData.forEach(function (item) {
                datakeys =  Object.keys(item);
                datakeys.forEach(function (key) {
                    let ispresent=false;
                    if(key=="IndexType"){
                        key = "Loop Type";
                    }
                    visibleCol.forEach(function (visibleitem) {
                        if(visibleitem.accessor){
                            if(key == visibleitem.accessor){
                                ispresent = true;
                            }else{
                                if(key == "FileGroups" || key=="FileGeoZones"){
                                    ispresent = true;
                                }
                            }
                        }

                    })
                    if(ispresent){

                    }else{
                        delete item[key];
                    }
                })




            })
            console.log("visibleData",visibleData)

        }
        if(isConversion){
            console.log("is conversion");
            visibleData.forEach(function (item) {
                if(item.IndexType>=0){
                    item.IndexType = loopType[item.IndexType];
                }
                if(item.Channel>=0){
                    item.Channel = dataChannel[item.Channel];
                }
                if(item.FileType>=0){
                    item.FileType = FileType[item.FileType];
                }
                if(item.Group_ADS_NAME>=0){
                    let str = "";
                    if(item.FileGroups && item.FileGroups.length>0){
                        for(var i=0;i<item.FileGroups.length;i++){
                            str+= item.FileGroups[i].Group_ADS_Name+", "
                        }
                    }
                    item.Group_ADS_NAME = str;
                    delete item["FileGroups"];
                }



                if (item.FileGeoZones && item.FileGeoZones.length > 0) {
                    let str = "";
                    for (var i = 0; i < item.FileGeoZones.length; i++) {
                        str += item.FileGeoZones[i].Name + ", "
                    }
                    item.GeoZones = str;
                    delete item["FileGeoZones"];

                }

                if(item.status>=0){

                    var status = statusType[item.status];
                    if(status){
                        item.status =status;
                    }
                }

            })
            console.log("visibleData1",visibleData)
        }
        const ws = XLSX.utils.json_to_sheet(visibleData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    getDTTUDataForExport(newFilter){
        if(this.state.tabIndex === 0){
            let obj1={

                "CABNUMBER":null,
                "IPAddress":null,
                "UNITKEY":null,
                "PIM":null,
                "iTapp":null,
                "Horton":null,
                "CCCODE1":null,
                "TermType":null,
                "GBVersion":null,
                "Ident":null,
                "MeterType":null,
                "DIM":null,
                "WatchDog":null,
                "TaxiRideService":null,
                "PIMReplica":null,
                "Map":null,
                "Current":null,
                "CLIENTNAME":null,
                "UnitMode":-1, // 0 for Lab/Demo  and 1 for production

                "strLastUpdate":null,

                "FilterUnitTypeList":null, ///for ex ["unknown","TREK","TaxiTopNYC"]/// this is multichoice filter

                "VerunitArr":null, ///for ex ["702","4000"] /// this is multichoice filter
                "SurveyServerIndex":-1, // bydefault-1
                "SurveyUnitIndex":-1 // bydefault-1

            }

            if(newFilter){
                for(let i=0;i<newFilter.length;i++){
                    if(newFilter[i].value === ""){
                        obj1[newFilter[i].id]= null
                    }else{
                        obj1[newFilter[i].id]= newFilter[i].value ;
                    }
                }
            }
            let obj={
                "RowStart":(this.state.page*100)+1,
                "RowEnd":(this.state.page*100)+100,
                "unitlistCriteria":obj1
            }
            this.setState({loading:true});
            postData("UnitList/FetchExport", obj)
                .then(res => {
                    this.setState({loading:false});
                    if (res.data && res.data.ResponseCollection) {
                        this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.columns,false)

                    }
                })
                .catch(e=> this.setState({loading:false}))
        }else if(this.state.tabIndex === 1){
            this.callServerExport(this.state.data, this.state.exportFileName,this.state.columns,false)
        }else if(this.state.tabIndex === 2){
            let obj1={
                "UNITKEY": null,
                "IPAddress": null,
                "UnitID": null,
                "strDated": null,
                "TaxiRideService": null,
                "iTapp": null,
                "Horton": null,
                "FreeSpaceDriveD": null,
                "Vx820": null,
                "SortColumn": "UnitID",
                "SortOrder": 0
            }

            if(newFilter){
                for(let i=0;i<newFilter.length;i++){
                    if(newFilter[i].value === ""){
                        obj1[newFilter[i].id]= null
                    }else{
                        obj1[newFilter[i].id]= newFilter[i].value ;
                    }
                }
            }
            let obj={
                "RowStart":(this.state.page*100)+1,
                "RowEnd":(this.state.page*100)+100,
                "deviceInfoCriteria":obj1
            }
            this.setState({loading:true});
            postData("DeviceInfo/FetchExport", obj)
                .then(res => {
                    this.setState({loading:false});
                    if (res.data && res.data.ResponseCollection) {
                        this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.columns,false)

                    }
                })
                .catch(e=> this.setState({loading:false}))
        }else if(this.state.tabIndex === 3){
            this.callServerExport(this.myRef.getResolvedState().sortedData, this.state.exportFileName,this.state.columns,false)
        }

    }

    getDataforExport(newFilter) {
        console.log("call getDataforExport");
        if(sessionStorage.getItem("marketId") === "DTTU"){
            this.getDTTUDataForExport(newFilter)
        }else{
            if(this.state.tabIndex === 0){
                let obj1 = {

                    "CABNUMBER": null,
                    "IPAddress": null,
                    "UNITKEY": null,
                    "PIM": null,
                    "iTapp": null,
                    "Horton": null,
                    "CCCODE1": null,
                    "TermType": null,
                    "GBVersion": null,
                    "Ident": null,
                    "MeterType": null,
                    "DIM": null,
                    "WatchDog": null,
                    "TaxiRideService": null,
                    "PIMReplica": null,
                    "Map": null,
                    "Current": null,
                    "CLIENTNAME": null,
                    "UnitMode": -1, // 0 for Lab/Demo  and 1 for production

                    "strLastUpdate": null,

                    "FilterUnitTypeList": null, ///for ex ["unknown","TREK","TaxiTopNYC"]/// this is multichoice filter

                    "VerunitArr": null, ///for ex ["702","4000"] /// this is multichoice filter
                    "SurveyServerIndex": -1, // bydefault-1
                    "SurveyUnitIndex": -1 // bydefault-1

                }

                if(newFilter){
                    for(let i=0;i<newFilter.length;i++){
                        if(newFilter[i].value === ""){
                            obj1[newFilter[i].id]= null
                        }else{
                            obj1[newFilter[i].id]= newFilter[i].value ;
                        }
                    }
                }
                let obj = {
                    "RowStart": (this.state.page * 100) + 1,
                    "RowEnd": (this.state.page * 100) + 100,
                    "unitlistCriteria": obj1
                }
                console.log("before post getDataforExport",newFilter);
                this.setState({loading:true});
                postData("UnitList/FetchExport", obj)
                    .then(res => {
                        console.log("after post getDataforExport",res);
                        this.setState({loading:false});
                        if (res.data && res.data.ResponseCollection) {
                            console.log("++++++", res.data.ResponseCollection);
                            this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.columns,false)

                        }
                    })
            }else if(this.state.tabIndex === 1){
                let obj1={
                    "UNITKEY": null,
                    "IPAddress": null,
                    "UnitID": null,
                    "strDated": null,
                    "TaxiRideService": null,
                    "iTapp": null,
                    "Horton": null,
                    "FreeSpaceDriveD": null,
                    "Vx820": null,
                    "SortColumn": "UnitID",
                    "SortOrder": 0
                }

                if(newFilter){
                    for(let i=0;i<newFilter.length;i++){
                        if(newFilter[i].value === ""){
                            obj1[newFilter[i].id]= null
                        }else{
                            obj1[newFilter[i].id]= newFilter[i].value ;
                        }
                    }
                }
                let obj={
                    "RowStart":(this.state.page*100)+1,
                    "RowEnd":(this.state.page*100)+100,
                    "deviceInfoCriteria":obj1
                }
                this.setState({loading:true});
                postData("DeviceInfo/FetchExport",obj)
                    .then(res => {
                        this.setState({loading:false});
                        if (res.data && res.data.ResponseCollection) {
                            console.log("fetchexprot device info", res.data.ResponseCollection);
                            this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.columns,false)


                        }
                    })
            }else if(this.state.tabIndex === 2){
                let obj1={
                    "STATUS":null, //this will be array
                    "LATITUDE":0,
                    "LONGITUDE":0,
                    "MEDALLION_NUMBER":null,
                    "imsi":null,
                    "driverid":null,
                    "DIRECTION":0,
                    "StrTimeTamp":null,
                    "StrLastUpdate":null
                }

                if(newFilter){
                    for(let i=0;i<newFilter.length;i++){
                        if(newFilter[i].value === ""){
                            obj1[newFilter[i].id]= null
                        }else{
                            obj1[newFilter[i].id]= newFilter[i].value ;
                        }
                    }
                }
                let obj={
                    "PageNo":this.state.page+1,
                    "RowCountPerPage":50,
                    "eHailVOCriteria":obj1
                }
                this.setState({loading:true});
                postData("DeviceInfo/FetchEhailExport",obj)
                    .then(res => {
                        this.setState({loading:false});
                        if (res.data && res.data.ResponseCollection) {
                            console.log("fetchexprot ehail", res.data.ResponseCollection);
                            this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.columns,false)

                        }
                    })
            }else{
                let start = (this.state.page*100)+1;
                let end = (this.state.page +1)*100;
                this.setState({loading:true});
                getData(tabUrlForExport[this.state.tabIndex]+"/"+start+"/"+end)
                    .then((res)=>{
                        this.setState({loading:false});
                        if(res && res.data && res.data.ResponseCollection){
                            console.log("fetchexprot ehail", res.data.ResponseCollection);
                            this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.columns,false)
                        }
                    })
            }
        }


    }





        render(){
        return(
           <div>

                <div className="CabDtTabMainWrp1">
                  {
                    this.tabs && this.tabs.map((key,index)=>(
                    <div className={this.state.tabIndex === index ?"CabDtTabWrp1":"CabDtTabWrp"} onClick={()=>this.setTab(index)} key={index}>{key}</div>
                    ))
                  }
                </div>
                {
                    sessionStorage.getItem("marketId") === "DTTU" && this.state.tabIndex === 3 &&
                    <div className="CabDtTabMainWrp">
                    {
                      this.subTabs && this.subTabs.map((key,index)=>(
                      <div className={this.state.subTabIndex === index ?"CabDtTabWrp1":"CabDtTabWrp"} onClick={()=>this.setSubTabs(index)} key={index}>{key}</div>
                      ))
                    }
                  </div>
                }
                 <div className="TableBorder"  contextMenu="none" onContextMenu={(e)=> e.preventDefault()}>
                 {
                             this.state.rightAction > 0 ?
                                 <div className="actionMenu1" style={{top:`${this.state.y-50}px`,left:`${this.state.x}px`}}>
                                     <ul className="actionUl" style={{"list-style":"none"}}>
                                         <li>
                                             <div onClick={()=>this.deletCab()} className="actionContent">Delete Cab</div>
                                         </li>
                                         <li>
                                             <div onClick={()=>this.getAssociatedGrp()} className="actionContent">Get Associated Groups</div>
                                         </li>
                                         <li>
                                           {
                                             this.state.selectedRowData.UnitMode === 0 ?
                                             <div onClick={()=>this.updateUnitMode()} className="actionContent">Change Unit Mode to Production</div>
                                             :
                                             <div onClick={()=>this.updateUnitMode()} className="actionContent">Change Unit Mode to Lab/Demo</div>
                                           }
                                         </li>
                                     </ul>
                                 </div>:<div></div>


                         }
                {
                  this.state.columnSt ?
                  <ColumnStatus data={this.state.columns} onChange={(e)=>this.setColumn(e,'columns')} class={"SchedColumnHideWrp"} onClose={(e)=>this.resetColmn(e,'columns')}></ColumnStatus>
                  : this.state.click ?
                  <div className="Loader">
                        <div className="ForgPassMainWrp1">
                            <div className="ForgPassTitle">Edit Cab Details</div>
                            <div style={{marginTop:"30px"}}>
                                <div className="LoginInptChildWrp">
                                    <div className="ForgPassUsrNm">Cab Number *</div>
                                    <input className="LoginInputFld" onChange={(e)=>this.setState({cabId:e.target.value})} value={this.state.cabId} autoComplete="on"></input>
                                </div>
                            </div>
                            <div className="ForgPassBtm1">
                                <img src={require("../../../Assets/Images/Login/ok-btn.png")} className="ForgPassBtn" onClick={()=>this.updateCabDetails()}></img>
                                <img src={require("../../../Assets/Images/Login/cancel-btn.png")} className="ForgPassBtn" onClick={()=>this.setState({click:false})}></img>
                            </div>
                        </div>
                    </div>
                : this.state.assGrp ?
                    <div className="Loader">
                        <div className="ForgPassMainWrp2">
                            <div className="ForgPassTitle">Associated Groups</div>
                               <span style={{marginLeft:"8px",marginTop:"5px"}}>Cab Number: {this.state.selectedRowData.CABNUMBER}</span>
                            <ReactTable
                                  data={this.state.grPData}  ///this main file view grid
                                  columns={grpCol}
                                  loading={this.state.grpLoading}
                                  NoDataComponent={()=>null}
                                  showPagination={false}
                                  minRows={10}
                                  pageSize={this.state.grPData.length}
                                  sortable={false}
                                  manual={false}
                                  style={{
                                    height: "210px",
                                    marginTop:"8px"//
                                  }}
                                  getTheadFilterProps={(state, rowInfo, column, instance) => {
                                    return {
                                      style:
                                      { display: "none" }
                                    };
                                  }}

                                />
                                 <div className="ForgPassBtm1">
                                    <img src={require("../../../Assets/Images/Login/ok-btn.png")} className="ForgPassBtn" onClick={()=>this.setState({assGrp:false})}></img>
                                </div>
                        </div>
                    </div>
                :    this.state.dlgEnable &&
                    <Dialog title={this.state.dlgtitle} message={this.state.message} onOk={()=>this.setState({dlgEnable:false})} onHide={()=>this.setState({dlgEnable:false})}/>
                }
               <div className="ScheduleTabToolWrp">
                 {
                     sessionStorage.getItem("marketId") === "DTTU" && this.state.subTabIndex === 1 &&
                     <div className="cabDtTabToolWrp">
                         <div className="ForgPassUsrNm2">Cab Number</div>
                         <input className="LoginInputFld1" onChange={(e)=>this.setState({cabId:e.target.value})} value={this.state.cabId} autoComplete="on"></input>
                        <div className='SchedHeadTxt'>From</div>
                            <DatePicker selected={new Date(this.state.strDate)}   onChange={(date)=>this.setState({strDate:date},()=>console.log(this.state.strDate))}  wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            <div className='SchedHeadTxt'>To</div>
                            <DatePicker selected={this.state.endDate}  onChange={(date)=>this.setState({endDate:date})} wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            <img src={require('../../../Assets/Images/Filter/apply-filter.png')} className="ScheduleupldImg" onClick={()=>{
                               this.setState({loading:true},()=>{this.getDttuSubData();})
                            }}></img>
                   </div>
                 }
                   <div className="ScheduleTableToolCont">
                       {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       {/*<ExportCSV csvData={this.state.data} fileName={this.state.exportFileName} visibleCol={this.state.columns} isConversion={true} callback={()=>console.log("export")} />*/}
                       {/*<img src={require("../../../Assets/Images/tools/export.jpg")} className="ScheduleToolImg" onClick={()=>this.callServerExport(this.state.data,this.state.exportFileName,this.state.columns,false)}></img>*/}
                       <img src={require("../../../Assets/Images/tools/export.jpg")} className="ScheduleToolImg" onClick={()=>this.getDataforExport(this.state.filtered)}></img>
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>{
                         if(sessionStorage.getItem("marketId") === "DTTU" && this.state.tabIndex === 3){
                            this.setSubTabs(this.state.subTabIndex)
                         }else{
                          this.setTab(this.state.tabIndex)
                         }
                       }}></img>
                   </div>
               </div>
               {
                 sessionStorage.getItem("marketId") === "DTTU" && this.state.tabIndex === 1 ?
                 <ReactTable
                 data={this.state.data}  ///this main file view grid
                 columns={this.state.columns}
                 loading={this.state.loading}
                 NoDataComponent={()=>null}
                 showPagination={false}
                 filtered={this.state.filtered}
                 minRows={20}
                 defaultPageSize={20}
                 pageSize={this.state.data.length}
                 sortable={false}
                 manual={false}
                 getTrGroupProps={(state, rowInfo, column, instance) => {
                  if(rowInfo !== undefined){

                   return {
                    onDoubleClick:()=>{
                      this.setState({cabId:rowInfo.original.CABNUMBER,rowData:rowInfo.original,click:true})
                    },
                     style:{
                       background:rowInfo.original.IsUpdated === false ? "#FFFF86" : "#81FFB9"
                     }
                   }
                  }
                 }}
                 style={{
                   height: this.state.schedBtm?"280px":"425px", //
                 }}
                 getTheadFilterProps={(state, rowInfo, column, instance) => {
                   return {
                     style:
                     { display: "none" }
                   };
                 }}

              />
              :sessionStorage.getItem("marketId") === "DTTU" && this.state.tabIndex === 3 ?
              <ReactTable
                 ref={(r) => {
                     this.myRef = r;
                 }}
                 data={this.state.data}  ///this main file view grid
                 columns={this.state.columns}
                 loading={this.state.loading}
                 NoDataComponent={()=>null}
                 showPagination={false}
                 filtered={this.state.filtered}
                 minRows={20}
                 defaultPageSize={20}
                 pageSize={this.state.data.length}
                 sortable={false}
                 sorted={this.state.sortOption}
                 manual={false}
                 style={{
                   height: this.state.schedBtm?"280px":"425px", //
                 }}
                 getTheadFilterProps={(state, rowInfo, column, instance) => {
                   return {
                     style:
                     { display: "none" }
                   };
                 }}

              />
              : <ReactTable
              ref={(refReactTable) => {this.refReactTable = refReactTable;}}
              data={this.state.data}
              columns={this.state.columns}
              PaginationComponent={(Pagination)}
              NoDataComponent={()=>null}
              loading={this.state.loading}
              filtered={this.state.filtered}
              sortable={false}
              totlaItems={this.state.totalCnt}
              filterCnt={this.state.filterCnt}
              defaultPageSize={100}
              pages={this.state.pageCount}
              style={{
                height: "410px" //
              }}
              Sortable={false}
              manual
              onFetchData={(state, instance) => {
                let sec =0;
                if(this.state.visibleFilters && this.state.visibleFilters.length > 0){
                  sec = 550;
                }
                if(sessionStorage.getItem("marketId")==="DTTU"){
                  this.setState({page:instance.state.page},()=>{
                    clearTimeout(this.timer);
                    this.timer = setTimeout(()=> this.getDTTUData(this.state.filtered),sec)

                  })
                }else{
                  this.setState({page:instance.state.page},()=>{
                      clearTimeout(this.timer);
                      this.timer = setTimeout(()=> this.getTableData(this.state.filtered),sec)

                  })
                }


              }}
              getTrProps={(state, rowInfo) => {
                if (rowInfo && rowInfo.row) {
                  if(this.state.tabIndex === 0){
                      return {
                        onContextMenu: (e) => {
                          this.setState({selectedRowData:rowInfo.original,selected: rowInfo.index,rightAction:1, x: e.screenX, y: e.screenY-50,visibleFilters:[]});
                        },
                        onClick: (e) => {
                            this.setState({ selected: rowInfo.index,rightAction:0,selectedRowData:rowInfo.original})

                        },
                        style:{
                          background:this.state.selected === rowInfo.index?"#00afec":""
                        }

                    }
                  }else{
                      return {

                    }
                  }
                }else{
                    return {}
                }
            }}
              getTheadFilterProps={(state, rowInfo, column, instance) => {
                return {
                  style:
                  { display: "none" }
                };
              }}

           />


               }


           </div>
           </div>
        )
    }
}