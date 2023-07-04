import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import ComCheck from "../../CommomComponents/ComCheck";
import {Search} from "../../CommomComponents/Filters";
import {getData,postData} from "../../../Services/MainServices";
import Dialog from "../../CommomComponents/Dialog";
import DatePicker from "react-datepicker";
import Pagination from "../../CommomComponents/Pagination";
import moment from "moment";
import {ExportCSV} from '../../../Utility/ExportCSV.js';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

let userList =  sessionStorage.getItem("userList");




let associateCabsCol = [
    {accessor:"Cabnumber",lable:"Cab Number"},
    {accessor:"UnitKey",lable:"IMSI"},
    {accessor:"IPAddress",lable:"IP Address"},
    {accessor:"DIM",lable:"DIM"},
    {accessor:"PIM",lable:"PIM"},
    {accessor:"CCCODE1",lable:"Client Code"},
    {accessor:"WatchDog",lable:"Watch Dog"},
    {accessor:"TaxiRideService",lable:"Taxi Ride"},
    {accessor:"PIMReplica",lable:"PIM Replica"},
    {accessor:"iTapp",lable:"ITapp"},
    {accessor:"Horton",lable:"Horton"},
    {accessor:"Map",lable:"Map"},
    {accessor:"LastUpdate",lable:"Last Update"},
    {accessor:"UnitType",lable:"UnitType"},
    {accessor:"STATUS",lable:"Status"},
    {accessor:"LastIndex",lable:"Latest Index"},
    {accessor:"CLIENTNAME",lable:"Client Name"},
    {accessor:"Vx820",lable:"VX820"},
    {accessor:"UnitMode",lable:"Unit Mode"},

  ]


const previewCol=[
    {accessor:"GROUP_ADS_NAME",lable:"Groups"},
    {accessor:"IndexType",lable:"Loop Type"},
    {accessor:"FileName",lable:"File Name"},
    {accessor:"ORDERLOOP",lable:"Order"},
    {accessor:"strDATESTART",lable:"Date Start"},
    {accessor:"strDATEEND",lable:"Date End"},
    {accessor:"TIMESTART",lable:"Time Start"},
    {accessor:"TIMEEND",lable:"Time End"},
    {accessor:"Len",lable:"Length"},
    {accessor:"FULLSCR_NG",lable:"Full Screen"},
    {accessor:"VBanner",lable:"Vertical Banner"},
    {accessor:"HBanner",lable:"Horizontal Banner"},
]

let switchcolumns = [{accessor:"UnitKey",lable:"IMSI"},{accessor:"CabNumber",lable:"Cab Number"},{accessor:"IPAddress",lable:"IP Address"},{accessor:"Status",lable:"Status"},{accessor:"UnitType",lable:"Unit Type"},{accessor:"ClientName",lable:"Client Name"},{accessor:"LastUpdated",lable:"Last Update"}]
const groupCol = [{accessor:"Group_ADS_Name",lable:"Group Name"},{accessor:"Status",lable:"Status"}];
const tabs1=["GroupAds_Flash_Cab/GetAllCabsForGroup/","GroupAds_Flash_Cab/FetchRestrictedGroupCabs/"]
const loopType=["AdLoop","GoodByLoop","WelcomeLoop","","Payment Loop"];
const FScreen=["false","true"];
const grpStatus=["Current","Test","Draft","Test"];
export default class CabAssociation extends Component{
  tem=[];
  tabs=["Associated cabs","Restricted Cabs"];
  filterType="";
  filterType1="";
  filterHead=[];
  timer=null;
    constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        if(sessionStorage.getItem("marketId")){
            if(sessionStorage.getItem("marketId")=="MX925"){
                switchcolumns = [{accessor:"UnitKey",lable:"IMSI"},
                    {accessor:"CabNumber",lable:"Cab Number"},
                    {accessor:"Status",lable:"Status"},
                    {accessor:"UnitType",lable:"Unit Type"},
                    {accessor:"ClientName",lable:"Client Name"},
                    {accessor:"LastUpdated",lable:"Last Update"},
                    {accessor:"PIM",lable:"PIM"},
                    {accessor:"DIM",lable:"DIM"},
                    {accessor:"VerUnit",lable:"Unit Version"}
                    ];
                this.tabs=["Associated cabs"];
            }

            if(sessionStorage.getItem("marketId")=="DTTU" || sessionStorage.getItem("marketId")=="GLACIER"){
                associateCabsCol = [
                    {accessor:"UnitKey",lable:"IMSI"},
                    {accessor:"Cabnumber",lable:"Cab Number"},
                    {accessor:"IPAddress",lable:"IP Address"},
                    {accessor:"UnitType",lable:"Unit Type"},
                    {accessor:"VerUnit",lable:"Unit Version"},
                    {accessor:"CCCODE1",lable:"Client Code"},
                    {accessor:"PIM",lable:"PIM"},
                    {accessor:"TermType",lable:"Terminal Type"},
                    {accessor:"GBVersion",lable:"GBVersion"},
                    {accessor:"iTapp",lable:"ITapp"},
                ]
            }
            if(sessionStorage.getItem("marketId")=="MX925"){
                associateCabsCol = [
                    {accessor:"UnitKey",lable:"IMSI"},
                    {accessor:"Cabnumber",lable:"Cab Number"},

                    {accessor:"UnitType",lable:"Unit Type"},
                    {accessor:"VerUnit",lable:"Unit Version"},
                    {accessor:"CCCODE1",lable:"Client Code"},
                    {accessor:"PIM",lable:"PIM"},
                    {accessor:"TermType",lable:"Terminal Type"},
                    {accessor:"GBVersion",lable:"GBVersion"},
                    {accessor:"iTapp",lable:"ITapp"},
                ]
            }
        }

        this.state = {
            group: false,
            groupName: "ALL",
            switchcolumns: [],
            columnSt: false,
            grpColumn: [],
            filtered: [],
            sty: {width: "30px", height: "0px"},
            filter: -1,
            tabIndex: 0,
            filterVal: [],
            visibleFilters: [],
            grpfilterval:[],
            grpfilterVal:[],
            grpvisibleFilters:[],
            grpfiltered:[],
            data: [],
            grpData: [],
            grpLoading: true,
            dataLoading: true,
            grpId: null,
            grpObj: {
                groupName: '',
                startDate: '',
                endDate: '',
                unitType: ''
            },
            grpInfo: false,
            unitData: [],
            videoCount: 0,
            bannerCount: 0,
            buttonCount: 0,
            cabCount: 0,
            RestCabCount: 0,
            deletedObj: [],
            selectedCabsObj:[],
            display : 0,
            showStatus:false,
            availableCabInfo:false,
            availableCabsColumns:[],
            availableCabsList:[],
            selectedGroupData:null,
            cabId:[],
            selctedGroupUnitIds:[],
            selctedUnitIds:[],
            selctedGroupIds:[],
            rowSelectedindex:0,
            groupCbCount:0,
            groupRestCbCount:0,
            popEnable:false,
            poptitle:"",
            message:"",
            popType:"Information",
            page:0,
            pageCount:0,
            totalCnt:0,
            filterCnt:0,
            isAllSelected:false,
            gStatusValForChange:null,
             houseAd:false,
             previewLoop:false,
             prevCol:[],
             prevData:[],
             houseObj:{},
             loadFileData:[],
             loadFileData:[],
             uploadby:-1,
             searchbyFile:"",
             tags:"",
             loadFileBackupData:[],
             micrositeList:[],
             userList:[],
             cabInfoLoading:false,
             cabtotalCnt:0,
             cabfilterCnt:0,
             exportFileName:"CabAssociation"


        }
    }

      componentDidMount(){
        /*if(this.state.data.length>0){
            this.recursive();
        }*/
          document.addEventListener('mousedown', this.handleClickOutside);
        let myobj = {
          Header: "#",
          Cell: (rowInfo) => <ComCheck  onChange={(e)=>this.selCabsRow(e,rowInfo)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
          width:25
        }
        let myobj1 = {
          Header: "#",
          Cell: (rowInfo) => <ComCheck  onChange={(e)=>this.selGrpRow1(e,rowInfo)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
          width:25
        }
        let dColumn = [];
        let sColumn=[];
        this.state.filterVal=[];
        this.state.grpfilterval=[];
        dColumn.push(myobj)
        sColumn.push(myobj1)
        switchcolumns.map((key,index)=>{
             this.state.filterVal.push("")
             let obj={};
              if(key.accessor === "LastUpdated"){
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
                        (this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && !this.state.availableCabInfo) &&
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
                    Cell:(rowInfo)=><div className="SystFlColContainer">{this.gonvertDate(rowInfo.original[key.accessor])}</div>

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
                        (this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && !this.state.availableCabInfo) &&
                        <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                      }
                      </div>
                    </div>,
                    accessor:key.accessor,
                    show:true,
                    filterable:true,
                    // Filter: (cellInfo) =>
                    // <div>{
                    //     this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    //     <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                    //   }
                    //   </div>


                   }
              }
             dColumn.push(obj);
        });
        groupCol.map((key,index)=>{
          this.state.grpfilterval.push("")
            let obj={}
            if(key.accessor=="Status"){
                obj=  {
                    Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                    <div>Status</div>
                        {
                            this.state.grpfilterval[index] === "" || this.state.grpfilterval[index] === undefined?
                                <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.grpsetFilter(cellInfo.column.id,2)}></img>
                                :
                                <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.grpsetFilter(cellInfo.column.id,2)}></img>
                        }
                    </div>,
                    accessor: 'Status',
                    filterable:true,
                    Cell: props => <span className='number'>{grpStatus[props.value]}</span>, // Custom cell components!

                    Filter: (cellInfo) =>
                    <div>{
                        this.state.grpvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                        <Search onChange={(e)=>this.grpsetStatusFilter(e,"key",cellInfo.column.id,2,"fileType",grpStatus)} value={this.state.grpfilterVal[2]}></Search>
                      }
                      </div>
                  }
            }else{
                obj=  {
                    Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                    <div>Group Name</div>
                        {
                            this.state.grpfilterval[1] === "" || this.state.grpfilterval[1] === undefined?
                                <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.grpsetFilter(cellInfo.column.id,1)}></img>
                                :
                                <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.grpsetFilter(cellInfo.column.id,1)}></img>
                        }
                    </div>,
                    accessor: 'Group_ADS_Name',
                    filterable:true,
                    Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
                    filterMethod: (filter, row) => {
                        if(filter.value === ""){
                            return true
                        }
                        if(row[filter.id]){
                            return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0
                        }
                        return false;
                      },
                    Filter: (cellInfo) =>
                    <div>{
                        this.state.grpvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                        <Search onChange={(e)=>this.grpcustomFilerChange(e.target.value,cellInfo.column.id,1)} value={this.state.grpfilterVal[1]}></Search>
                      }
                      </div>
                  }
            }

          sColumn.push(obj);
     });
        this.getUnitType();

        this.setState({switchcolumns:dColumn,grpColumn:sColumn},()=>{
          this.getRecords();
        });
        this.getHouseData();
        this.getAvailbleMediafiles();
        if(userList){
            try{
                userList = JSON.parse(userList);
                this.setState({userList:userList});
            }catch (err){
                this.setState({userList:[]});
            }



        }else{
            this.setState({userList:[]});
        }
      }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        // if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
        //     this.setState({visibleFilters:[]})
        // }
        var x = document.getElementsByClassName("SchedFiltInptWrp");
        //console.log("x is ", x[0])
        //console.log("event.target is ", event.target);
        if (event.target !== x[0]) {
            //console.log("out inside");
            this.setState({visibleFilters: []});
            this.setState({grpvisibleFilters: []});
            //this.setState({grpvisibleFilters: []});

        } else {
            //console.log("inside inside");
        }
        //console.log("call handleClickOutside", event);


    }
      gonvertDate(date){
        if(date){
            return moment(date).format("DD-MMM-YYYY HH:mm:ss");
        }

    }

      setPrevColumns(){
        if(previewCol){
            let dCol=[];
            this.state.filterVal=[];
            this.state.visibleFilters=[];
            previewCol.map((key,index)=>{
                let obj={}
                this.state.filterVal.push("")
                if(key.accessor === "IndexType"){
                  obj={
                      Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                          <div>{key.lable}</div>
                          {
                            this.state.filterVal[index] === ""?
                            <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                            :
                            <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                          }
                      </div>,
                      accessor:key.accessor,
                      show:true,
                      filterable:true,
                      Filter: (cellInfo) =>
                          <div>{
                              this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                              <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                          }
                          </div>,
                      Cell:(rowInfo)=><span>{loopType[rowInfo.original.IndexType]}</span>

                  }
              }else if(key.accessor === "FULLSCR_NG"){
                obj={
                    Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                        {
                      this.state.filterVal[index] === ""?
                      <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                      :
                      <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                      }
                    </div>,
                    accessor:key.accessor,
                    show:true,
                    filterable:true,
                    Filter: (cellInfo) =>
                        <div>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                        }
                        </div>,
                    Cell:(rowInfo)=><span>{FScreen[rowInfo.original.FULLSCR_NG]}</span>

                }
            }else if(key.accessor === "DATESTART" || key.accessor === "DATEEND" || key.accessor === "strDATEEND" || key.accessor === "strDATESTART"){
              obj={
                  Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                      <div>{key.lable}</div>
                      {
                  this.state.filterVal[index] === ""?
                  <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                  :
                  <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                  }
                  </div>,
                  accessor:key.accessor,
                  show:true,
                  filterable:true,
                  Filter: (cellInfo) =>
                      <div>{
                          this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                          <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                      }
                      </div>,
                  Cell:(rowInfo)=><div className="SystFlColContainer">{this.gonvertDate(rowInfo.original[key.accessor])}</div>

              }
          }else {
              obj={
                  Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                  <div>{key.lable}</div>
                  {
                      this.state.filterVal[index] === ""?
                      <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                      :
                      <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                  }
                  </div>,
                  accessor:key.accessor,
                  show:true,
                  filterable:true,
                  Filter: (cellInfo) =>
                  <div>{
                      this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                      <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                    }
                    </div>

                 }

              }

              dCol.push(obj)
            })
            this.state.prevCol = dCol;
            this.getPreviewData();
        }
    }

    grpsetFilter(id,index){
        this.setState(({ grpvisibleFilters }) => {
          let update = [...grpvisibleFilters];
          const index = update.indexOf(id);
          index < 0 ? update.push(id) : update.splice(index, 1);
          return { grpvisibleFilters: update };
        });
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
            this.grpmulticustomFilerChange(index,accessor,index1,e.target.value)
        }else{
            this.grpmulticustomFilerChange(null,accessor,index1,e.target.value)
        }
    }

       grpmulticustomFilerChange(value,accessor,index,indexvalue){
        let filtered = this.state.grpfiltered;
        let insertNewFilter = 1;
        this.state.grpfilterVal[index]=indexvalue
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
        this.setState({ grpfiltered: newFilter});
       }

       grpcustomFilerChange(value,accessor,index){
        let filtered = this.state.grpfiltered;
        let insertNewFilter = 1;
        this.state.grpfilterVal[index]=value
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
        this.setState({ grpfiltered: newFilter});
       }


    getPreviewData(){
        if(this.state.selctedGroupIds && this.state.selctedGroupIds.length > 0){
            let Str ="";
            for(let i=0;i<this.state.selctedGroupIds.length;i++){
                if(i === this.state.selctedGroupIds.length -1){
                    Str = Str+this.state.selctedGroupIds[i]
                }else{
                 Str = Str+this.state.selctedGroupIds[i]+","
                }
            }
            getData("PreviewLoop/FetchPreviewLoop/"+Str)
             .then(res=>{
                 if(res.data.ResponseCollection){
                     console.log(res.data.ResponseCollection);
                     this.setState({prevData:res.data.ResponseCollection,previewLoop:true})
                 }else{
                     this.setState({prevData:[],previewLoop:true})
                 }
             })
        }else{
         this.setState({dlgtitle:"Information",message:"Please select groups",dlgType:"information",dlgEnable:true,previewLoop:false})
        }

    }

      getAvailbleMediafiles(){
        let obj ={
            "startIndex":0,
            "count":0,
            "criteria":[]
        }
        postData("FileUpload/Fetch",obj)
            .then((res)=>{
                if(res.data && res.data.ResponseCollection){
                    console.log("avail file data",res.data.ResponseCollection);
                    this.setState({loadFileData:res.data.ResponseCollection})
                    this.setState({loadFileBackupData:res.data.ResponseCollection})
                     let micrositeArray=[];
                    if(res.data.ResponseCollection && res.data.ResponseCollection.length>0){
                        res.data.ResponseCollection.forEach(function (item) {
                            if(item.ContentTypeID==4){
                                micrositeArray.push(item);
                            }
                        });
                        this.setState({micrositeList:micrositeArray});
                        console.log("microsite list",micrositeArray);
                    }
                }
            })
    }

    setAssociatecabsCol(){
        let dColumn = [];
        this.state.visibleFilters=[];
        this.state.filterVal=[];
        let obj = {
            Header: "#",
            Cell: (rowInfo) => <ComCheck   onChange={(e)=>this.setCab(rowInfo.original.UNITID)} checked={this.state.cabId.indexOf(rowInfo.original.UNITID) !== -1}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
            width:25
        }
        dColumn.push(obj)
        associateCabsCol.map((key,index)=>{
            this.state.filterVal.push("")
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
                //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
                //     }
                //     </div>,

            }
            dColumn.push(obj);
        })
        obj={
            Header:'',
            width:10
        };
        dColumn.push(obj);
        this.setState({availableCabsColumns:dColumn});

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
        if(this.state.availableCabInfo){
           clearTimeout(this.timer);
           this.timer = setTimeout(()=>this.getAvailavleCabsListForAssociation(newFilter),550)
        }
       }

       customFilerChange1(value,accessor,index){
        let filtered = this.state.grpfiltered;
        let insertNewFilter = 1;
        this.state.grpfilterval[index]=value
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
        this.setState({ grpfiltered: newFilter });

       }

       setFilter1(id,index){
        this.setState(({ grpvisibleFilters }) => {
          let update = [...grpvisibleFilters];
          const index = update.indexOf(id);
          index < 0 ? update.push(id) : update.splice(index, 1);
          return { grpvisibleFilters: update };
        });
       }




    getAllunitIds(e,newFilter){
        console.log("call getAllunitIds");
        console.log("before unit ids",this.state.cabId);
        let cabinfo=this.state.availableCabsList;
        this.setState({})
        if(this.state.isAllSelected || e=== false){
            this.setState({cabInfoLoading:true,availableCabsList:[],isAllSelected:false,cabId:[]},()=>{
                this.setState({availableCabsList:cabinfo,cabInfoLoading:false})
            })
            //console.log("1 after unit ids",this.state.cabId);
        }else{
            this.setState({cabInfoLoading:true,isAllSelected:true,availableCabsList:[]})
            if(!this.state.availableCabInfo){
                this.setState({availableCabInfo:true,cabId:[]});
                this.setAssociatecabsCol();
            }
            console.log("select group data",this.state.selectedGroupData);
            if(this.state.selectedGroupData){
                let obj1 = {
                    "Cabnumber":null,
                    "IPAddress":null,
                    "UnitKey":null,
                    "PIM":null,
                    "iTapp":null,
                    "Horton":null,
                    "CCCODE1":null,
                    "TermType":null,
                    "GBVersion":null,
                    "PageNo":this.state.page+1,
                    "RowCountPerPage":50,

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

                var obj={
                    "filterCriteria":obj1,
                    "pCriteriaVO":{
                        "UnitType":sessionStorage.getItem("marketId")=="MX925"?0:2,
                        "GroupID": this.state.selectedGroupData.Group_ADS_ID
                    },


                }
                let selectedTab = this.state.tabIndex;
                var url="";
                if(selectedTab != undefined){
                    if(selectedTab==0){
                        url="GroupAds_Flash_Cab/GetAllSelectedUnitIds";

                    }else{
                        url="GroupAds_Flash_Cab/GetAllRestrictedSelectedUnitIds";

                    }

                }else{
                    url="GroupAds_Flash_Cab/GetAllSelectedUnitIds";
                }
                postData(url,obj)
                    .then(res=>{
                        if(res.data && res.data.ResponseCollection){
                            console.log("selected unit data",res.data.ResponseCollection);
                            this.setState({cabId:res.data.ResponseCollection},()=>{
                                this.setState({availableCabsList:cabinfo,cabInfoLoading:false})
                            })
                            //this.setState({cabCount:res.data.ResponseCollection.length,availableCabsList:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,pageCount:Math.ceil(res.data.TotalcountOfItems/50)})
                        }else{
                            this.setState({availableCabsList:cabinfo,cabInfoLoading:false})
                        }
                        console.log("after unit ids",this.state.cabId);
                    })

            }
        }


    }

    getHouseData(){
        getData("HouseAdvDetails/GetHouseAdDetail")
                .then((res)=>{
                    if(res && res.data && res.data.ResponseCollection){
                        if(res.data.ResponseCollection.length>0){
                            this.setState({houseObj:res.data.ResponseCollection[0]})
                        }

                    }else{
                        this.setState({houseObj:{}})
                    }
                })
    }

    getAvailavleCabsListForAssociation(newFilter){
       if(!this.state.availableCabInfo){
        this.setState({availableCabInfo:true,cabId:[],visibleFilters:[],});
        this.setAssociatecabsCol();
       }
        if(this.state.selectedGroupData && ((this.state.availableCabInfo && newFilter.length > 0)|| (!this.state.availableCabInfo && newFilter.length === 0))){
            let temp=this.state.availableCabsList;
            this.setState({availableCabsList:[],cabInfoLoading:true})
            let obj1 = {
                "IPAddress":null,
                "UnitKey":null,
                "PIM":null,
                "iTapp":null,
                "Horton":null,
                "CCCODE1":null,
                "TermType":null,
                "GBVersion":null,
                "PageNo":this.state.page+1,
                "RowCountPerPage":50
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

           let UnitType=2;
            if(sessionStorage.getItem("marketId")){
                if(sessionStorage.getItem("marketId")=="MX925"){
                    UnitType =  0;
                }
            }

            var obj={
                "filterCriteria":obj1,
                "pCriteriaVO":{
                    "UnitType": UnitType,
                    "GroupID": this.state.selectedGroupData.Group_ADS_ID
                },


            }
            let selectedTab = this.state.tabIndex;
            var url="";
            if(selectedTab != undefined){
                if(selectedTab==0){
                    url="GroupAds_Flash_Cab/GetAllCabs";

                }else{
                    url="GroupAds_Flash_Cab/GetAllRestrictedCabs";

                }

            }else{
                url="GroupAds_Flash_Cab/GetAllCabs";
            }
            console.log("++++++++++++++++++++call")
            postData(url,obj)
                .then(res=>{
                    if(res.data && res.data.ResponseCollection){
                        console.log(res.data.ResponseCollection)
                        if(res.data.ResponseCollection.length>0){
                            res.data.ResponseCollection.forEach(function (item) {
                                item["isSelUnitId"]=false;
                            })
                        }
                        console.log("+++++++++++++++++",res.data.ResponseCollection)
                        this.setState({cabCount:res.data.ResponseCollection.length,availableCabsList:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,pageCount:Math.ceil(res.data.TotalcountOfItems/50),cabInfoLoading:false})
                    }else{
                        this.setState({availableCabsList:temp})
                    }
                })

        }

    }

      getRecords(){
          this.setState({showStatus:false,grpLoading:true});
          let obj={
          "startIndex": 1,
          "count": 1,
          "criteria": []
          }
          this.setState({grpData: [],grpLoading: true})
       postData("GroupADSFL/Fetch",obj)
           .then((res) => {
               if (res && res.data && res.data.ResponseCollection) {
                   var selectedGroupData =null;
                   var groupName =null;
                   var grpId =null;
                   var CabCount =0;
                   var RestrictedCabCount = 0;
                   var groupSelectedRow=-1;

                   if(this.state.selectedGroupData && this.state.selectedGroupData.Group_ADS_ID){
                        console.log("yes group selected ",this.state.selectedGroupData.Group_ADS_ID)





                        console.log("is selectedgroup id",this.state.selectedGroupData.Group_ADS_ID);
                        for(var i=0;i<res.data.ResponseCollection.length>0;i++ ){

                            if(res.data.ResponseCollection[i].Group_ADS_ID==this.state.selectedGroupData.Group_ADS_ID){

                                selectedGroupData = res.data.ResponseCollection[i];
                                groupName = res.data.ResponseCollection[i].Group_ADS_Name;
                                grpId =res.data.ResponseCollection[i].Group_ADS_ID;
                                CabCount = res.data.ResponseCollection[i].CabCount;
                                RestrictedCabCount = res.data.ResponseCollection[i].RestrictedCabCount;
                                groupSelectedRow = i;
                            }
                        }

                   }else{
                       console.log("yes group NOT selected ",res.data.ResponseCollection[0].Group_ADS_ID);
                        selectedGroupData = res.data.ResponseCollection[0];
                        groupName = res.data.ResponseCollection[0].Group_ADS_Name;
                        grpId = res.data.ResponseCollection[0].Group_ADS_ID;
                        CabCount = res.data.ResponseCollection[0].CabCount;
                        RestrictedCabCount = res.data.ResponseCollection[0].RestrictedCabCount;
                        groupSelectedRow = 1;
                   }
                   console.log("0 data",selectedGroupData);
                   console.log("1 data",groupName);
                   console.log("2 data",grpId);
                   console.log("3 data",CabCount);
                   console.log("4 data",RestrictedCabCount);
                   console.log("5 data",groupSelectedRow);
                   this.setState({
                       grpData: res.data.ResponseCollection,
                       grpLoading: false,
                       groupName: groupName,
                       grpId: grpId,
                       selectedGroupData:selectedGroupData,
                       rowSelectedindex:groupSelectedRow,
                       groupCbCount: CabCount,
                       groupRestCbCount: RestrictedCabCount,
                       cabCount:CabCount,
                       restCabCount:RestrictedCabCount
                   });
                   this.getTableData(grpId);
                       /*, () => {
                       console.log("group id fro get data",grpId);
                       this.getTableData(grpId);
                       /!*if(this.state.selectedGroupData && this.state.selectedGroupData.Group_ADS_ID){
                           this.getTableData(this.state.selectedGroupData.Group_ADS_ID);
                       }else{
                           this.getTableData(this.state.grpData[0].Group_ADS_ID);
                       }*!/

                   })*/
               } else {
                   this.setState({grpData: [], grpLoading: false})
               }
       })


      }
        getStatusString(val){
          if (val == 0) {
                return 'Current';
            } else if (val == 2) {
                return 'Draft';
            } else if (val == 3) {
                return 'Test';
            }
        }

      getTableData(id,newFilter){
          if(id === undefined || id === null){
              if(this.state.selectedGroupData && this.state.selectedGroupData.Group_ADS_ID){
                  id = this.state.selectedGroupData.Group_ADS_ID
              }else{
                  id = this.state.grpId;
              }

          }

         this.setState({dataLoading:true,data:[],selctedUnitIds:[]});
         if(this.state.tabIndex === 0){
            let obj1={
                "iTapp":null,
                "IPAddress":null,
                "CabNumber":null,
                "UnitKey":null,
                "PIM":null,
                "CCCODE1":null,
                "TermType":null,
                "GBVersion":null,
                "ClientName":null,
                "DIM":null,
                "Status":null,
                "FilterUnitTypeList":null,//["TaxiTopNYC"],///this is multi choice
                "strLastUpdate":null,
                "VerunitArr":null,///this is multi choice
                "PageNo":this.state.page+1,
                "RowCountPerPage":100
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
                "groupId":id,
                "filterCriteria":obj1,
              }

              postData("GroupAds_Flash_Cab/GetAllCabsForGroupWithFilter",obj)
                  .then(res => {
                      if (res.data && res.data.ResponseCollection) {

                        this.setState({data:res.data.ResponseCollection,dataLoading:false,cabtotalCnt:res.data.TotalcountOfItems,cabfilterCnt:res.data.FilteredCount,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/100)})
                      }
                  })
         }else{
            getData(tabs1[this.state.tabIndex]+id)
            .then(res=>{
             if(res && res.data && res.data.ResponseCollection){
               this.setState({data:res.data.ResponseCollection,dataLoading:false})
             }else{
               this.setState({data:[],dataLoading:false})
             }
            })
         }


      }




      setGroupInf(rowInfo){
        //console.log(rowInfo);
          if(rowInfo){
            this.setState({groupName:rowInfo.original["Group_ADS_Name"], videoCount : rowInfo.original["VideoCount"], bannerCount : rowInfo.original["BannerCount"], buttonCount : rowInfo.original["ButtonCount"], cabCount : rowInfo.original["CabCount"], restCabCount : rowInfo.original["RestrictedCabCount"]})
          }
        }

     selCabsRow(e,rowInfo){
         console.log("call selCabsRow");
          if(e === true){
            this.state.selectedCabsObj.push(rowInfo.original);
            this.setState({grpId:rowInfo.original.Group_ADS_ID, selectedCabsObj : this.state.selectedCabsObj});
             console.log("select data cab data",rowInfo.original)
            if(rowInfo.original.GroupUnitId){

               let cabidsArray =[];
               cabidsArray = this.state.selctedGroupUnitIds;
               let index = cabidsArray.indexOf(rowInfo.original.GroupUnitId)
               if(index >= 0){
                   cabidsArray.splice(index,1)
               }else{
                   cabidsArray.push(rowInfo.original.GroupUnitId)
               }
               this.setState({selctedGroupUnitIds:cabidsArray})
           }

           if(rowInfo.original.UnitId){

               let unitidArray =[];
               unitidArray = this.state.selctedUnitIds;
               let index = unitidArray.indexOf(rowInfo.original.UnitId)
               if(index >= 0){
                   unitidArray.splice(index,1)
               }else{
                   unitidArray.push(rowInfo.original.UnitId)
               }
               this.setState({selctedUnitIds:unitidArray})
           }

       }else{
              if(rowInfo.original.UnitId){

                  let unitidArray =[];
                  unitidArray = this.state.selctedUnitIds;
                  let index = unitidArray.indexOf(rowInfo.original.UnitId)
                  if(index >= 0){
                      unitidArray.splice(index,1)
                  }
                  this.setState({selctedUnitIds:unitidArray})
              }
          }
     }
     selGrpRow1(e,rowInfo){
        console.log("0 call selGrpRow1");
         //if(e === true){
             console.log("1 call")
            //this.state.deletedObj.push(rowInfo.original);
            //this.setState({grpId:rowInfo.original.Group_ADS_ID, deletedObj : this.state.deletedObj});
            if(rowInfo.original.Group_ADS_ID){
                console.log("2 call")
                let unitidArray =[];
                let gropObjDataArry=[];
                unitidArray = this.state.selctedGroupIds;
                let index = unitidArray.indexOf(rowInfo.original.Group_ADS_ID)
                if(index >= 0){
                    unitidArray.splice(index,1);
                }else{
                    unitidArray.push(rowInfo.original.Group_ADS_ID);
                }
                gropObjDataArry = this.state.deletedObj;
                let index1 = gropObjDataArry.indexOf(rowInfo.original)
                if(index1 >= 0){
                    gropObjDataArry.splice(index1,1);
                }else{
                    gropObjDataArry.push(rowInfo.original);
                }
                this.setState({selctedGroupIds:unitidArray,grpId:rowInfo.original.Group_ADS_ID, deletedObj : gropObjDataArry})
            }
          console.log("deletedObj is ",this.state.deletedObj);
        //}
    }
    setCab(id){
        if(id){
            let cabidsArray =[];
            cabidsArray = this.state.cabId;
            let index = cabidsArray.indexOf(id)
            if(index >= 0){
                cabidsArray.splice(index,1)
            }else{
                cabidsArray.push(id)
            }
            this.setState({cabId:cabidsArray})

        }
    }

    associateCabsTogroup(){
        if(this.state.selectedGroupData && this.state.selectedGroupData.Group_ADS_ID){
            for(let i=0;i<this.state.filterVal.length;i++){
                this.state.filterVal[i]="";
            }
            if(this.state.cabId && this.state.cabId.length>0 ){
                let selectedCabs = this.state.tabIndex;
                var obj={
                    cabIds:this.state.cabId,
                    groupIds:[this.state.selectedGroupData.Group_ADS_ID]
                }
                var url="";
                if(selectedCabs != undefined){
                    if(selectedCabs==0){
                        url="GroupAds_Flash_Cab/AddCabsToGroup";

                    }else{
                        obj={
                            pUnitID:this.state.cabId,
                            pGroupIDs:[this.state.selectedGroupData.Group_ADS_ID]
                        }
                        url="GroupAds_Flash_Cab/AddRestrictedCabToGroups";

                    }
                }else{
                    url="GroupAds_Flash_Cab/AddCabsToGroup";

                }
                postData(url,obj)
                    .then(res=>{
                        if(res && res.data && res.data.ReturnCode==0){
                            this.setState({availableCabInfo:false,cabId:[],isAllSelected:false,filtered:[]})
                            //this.getTableData(this.state.selectedGroupData.Group_ADS_ID);
                            this.getRecords();
                        }
                    });
            }
        }else{

        }

    }
    copyCabsTogroup(){
        if(this.state.selctedGroupIds && this.state.selctedGroupIds.length>0){
            if(this.state.selctedUnitIds && this.state.selctedUnitIds.length>0 ){
                var obj={
                    cabIds:this.state.selctedUnitIds,
                    groupIds:this.state.selctedGroupIds
                }
                var selectedTab = this.state.tabIndex;
                var url =""
                if(selectedTab != undefined){
                    if(selectedTab==0){
                        url = "GroupAds_Flash_Cab/AddCabsToGroup";
                    }else{
                        url = "GroupAds_Flash_Cab/AddRestrictedCabToGroups";
                        obj={
                            pUnitID:this.state.selctedUnitIds,
                            pGroupIDs:this.state.selctedGroupIds
                        }
                    }
                }else{
                    url = "GroupAds_Flash_Cab/AddCabsToGroup";
                }
                postData(url,obj)
                    .then(res=>{
                        let str="";
                        if(res && res.data && res.data.ReturnCode==0){
                            if(res.data.StatusResponseCollection && res.data.StatusResponseCollection.length>0){
                             let success =0;
                             let failed =0;
                                res.data.StatusResponseCollection.forEach(function (item) {
                                    if(item==0){
                                        success++;
                                    }else{
                                        failed++;
                                    }
                                })
                                str =success+" Cab(s) moved to selected groups successfully."+failed+" cab(s)";
                                str +=" were not added because of duplication or some internal error";


                            }else{
                                str="Cab Copied successfully";
                            }
                                this.getTableData(this.state.selctedGroupIds[0].Group_ADS_ID);
                                this.getRecords();
                                this.setState({selctedUnitIds:[],selctedGroupIds:[],deletedObj : [],selctedGroupUnitIds:[]});
                            this.setState({
                                poptitle: "Information",
                                message: str,
                                popType: "information",
                                popEnable: true
                            })

                            /*this.setState({availableCabInfo:false})
                            */
                        }
                    });


            }else {

                this.setState({
                    poptitle: "Information",
                    message: "please selcet cabs for copy",
                    popType: "information",
                    popEnable: true
                })
            }
        }else{

            this.setState({
                poptitle: "Information",
                message: "please selcet groups",
                popType: "information",
                popEnable: true
            })
        }

    }
    deleteConformation(){
        if (this.state.selectedGroupData && this.state.selectedGroupData.Group_ADS_ID) {
            if (this.state.selctedUnitIds && this.state.selctedUnitIds.length > 0) {
                this.setState({
                    poptitle: "Information",
                    message: "Are you sure want to delete",
                    popType: "delete",
                    popEnable: true
                });
            } else {

                this.setState({
                    poptitle: "Information",
                    message: "Please select cabs",
                    popType: "information",
                    popEnable: true
                })
            }
        } else {

        }
    }
    deletCabsFromGroup(){
        //if(this.state.selectedGroupData && this.state.selectedGroupData.Group_ADS_ID){
            //if(this.state.selctedGroupUnitIds && this.state.selctedGroupUnitIds.length>0 ){
                console.log("selected cabs is",this.state.selctedGroupUnitIds)

                var obj={
                    arrGroupUnitID:this.state.selctedGroupUnitIds,
                    GROUP_ADS_ID:this.state.selectedGroupData.Group_ADS_ID,
                    tryAll:false
                }
                var selectedTab = this.state.tabIndex;
                var url="";
                if(selectedTab != undefined){
                    if(selectedTab==0){
                        url = "GroupAds_Flash_Cab/DeleteCabsFromGroup";

                    }else{
                        url = "GroupAds_Flash_Cab/DeleteRestrcitedCab";
                        obj={
                            pUnitID:this.state.selctedGroupUnitIds,
                            pGroupID:this.state.selectedGroupData.Group_ADS_ID

                        }
                    }
                }
                else{
                    url = "GroupAds_Flash_Cab/DeleteCabsFromGroup";
                }
                //this.setState({selctedGroupUnitIds:[]})
                postData(url,obj)
                    .then(res=>{
                        if(res && res.data && res.data.ReturnCode==0){
                            this.setState({availableCabInfo:false})
                            this.getRecords()
                            this.setState({selctedGroupUnitIds:[],selctedUnitIds:[],selctedGroupIds:[],deletedObj : []});
                        }
                    });




        /* }
            else{

                this.setState({poptitle:"Information",message:"Please select cabs",popType:"information",popEnable:true})
            }*/
        /*}else{

        }*/
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

    /*========================= add Group =============================*/

    getUnitType(){
        let obj = {
            "startIndex":0,
            "count":0,
            "criteria":[]
        };

        postData('UnitTypes/Fetch', obj)
            .then(res=>{
                if(res && res.data && res.data.ResponseCollection){
                    this.setState({unitData:res.data.ResponseCollection});
                    this.getRecords();
                }else{
                    this.setState({unitData:[]})
                }
            });
    }

    addGroup = () =>{
        this.setState({grpInfo:true});
        var stDate = new Date();
        var date = new Date(); // Now
        date.setDate(date.getDate() + 30);
        var grpObj ={
            startDate: stDate,
            endDate:date
        }
        this.setState({grpObj:grpObj});
        /*let obj = {
            "startIndex":0,
            "count":0,
            "criteria":[]
        };

        postData('UnitTypes/Fetch', obj)
            .then(res=>{
                if(res && res.data && res.data.ResponseCollection){
                    this.setState({unitData:res.data.ResponseCollection,grpInfo:true, dataLoading:false});
                    this.getRecords();
                }else{
                    this.setState({unitData:[],dataLoading:false})
                }
            });*/
    }

    handleValues = (value, type) =>{
        this.state.grpObj[type] = value;
        this.setState({
            refresh : true
        });
    }

    addGroupToDatabase = () =>{
        let strDt = new Date(this.state.grpObj.startDate).getTime();// moment(this.state.grpObj.startDate).format('MM-DD-YYYY');
        let endDt = new Date(this.state.grpObj.endDate).getTime(); //moment(this.state.grpObj.endDate).format('MM-DD-YYYY');
        let currentdt = new Date().setHours(0);// moment().format('MM-DD-YYYY');
        currentdt = new Date(currentdt).setMinutes(0);
        currentdt = new Date(currentdt).getTime();
        let msg="";
        let gName=""
        if(this.state.grpObj.groupName){
            gName = this.state.grpObj.groupName.trim();
        }

        this.state.grpObj.groupName = gName;

        if(!this.state.grpObj.groupName.trim()){
            msg = "Please enter Group Name";
        }else if(!this.state.grpObj.unitType){
            if(sessionStorage.getItem("marketId")=="MX925"){

            }else{
                msg = "Please Select unit type";
            }

        }else{
            if(strDt < currentdt){
                msg = "Start date cannot be less than current date";
            }else if(strDt > endDt){
                msg = "Start date cannot be greater than end date";
            }

        }
        /*if(!this.state.grpObj.groupName.trim() || !this.state.grpObj.unitType){

                if(!this.state.grpObj.unitType){
                    msg = "Please Select unit type";
                }else{
                    msg = "Please enter Group Name";
                }


        }else{

            if(strDt < currentdt){
                msg = "Start date cannot be less than current date";
            }else if(strDt > endDt){
                msg = "Start date cannot be greater than end date";
            }




        }*/
        if(msg){
            //alert(""+msg);
            this.setState({
                poptitle:"Information",
                message:msg,
                popType:"information",
                popEnable:true,
            });
            this.setState({grpInfo:true,dlgtitle:"information",message:msg})
        }else {
            let obj = {
                "operationCode":0,
                "pGroupADSFL":[{
                    "Group_ADS_Name":this.state.grpObj.groupName, //this is grpou name
                    "IsDeleted":0,
                    "Operation":0,
                    "Status":2,///set initial status draft
                    "strStartDate":this.state.grpObj.startDate,
                    "strEndDate":this.state.grpObj.endDate,
                    "UnitType": this.state.grpObj.unitType
                }]
            }
            postData('GroupADSFL/Update', obj)
                .then(res =>{
                    this.setState({grpInfo:false});
                    if(res.data && res.data.ReturnCode===0){
                        this.setState({grpInfo: false, grpObj : {groupName: '', startDate : '', endDate : '', unitType : ''}})
                        this.getRecords();
                    }
                });
        }

    }
    /*========================= add Group =============================*/

    /*========================= delete Group =============================*/
    openStatusDll(){
        console.log("check ",this.state.showStatus)
        if(this.state.showStatus){
            this.setState({showStatus:false});
        }else{
            this.setState({showStatus:true});
        }
    }
    handeldeleteBeforedelete(){
        if (this.state.deletedObj.length > 0) {
            this.setState({
                poptitle: "Information",
                message: "Are you sure want to delete",
                popType: "deleteGroup",
                popEnable: true,
            })
        }else{
            this.setState({
                poptitle: "Information",
                message: "please select group for delete",
                popType: "information",
                popEnable: true
            })
        }
    }

    handleDeleteGrp = () => {
        if(this.state.deletedObj.length > 0){


            let arr = [];
            let gNamestr=""
            for(let i=0; i<this.state.deletedObj.length; i++){
                let obj = {
                    "Group_ADS_Name": this.state.deletedObj[i].Group_ADS_Name,
                    Group_ADS_ID : this.state.deletedObj[i].Group_ADS_ID
                }
                arr.push(obj);
                gNamestr+=this.state.deletedObj[i].Group_ADS_Name+" , "
            }

            let obj = {
                "operationCode":2,
                "pGroupADSFL":arr
            }

            postData('GroupADSFL/Update', obj)
                .then(res =>{
                    if(res.data && res.data.ReturnCode===0){
                        this.setState({dataLoading : true, deletedObj : [],selctedGroupIds:[]});
                        let msg=""
                        console.log("check1",res.data.StatusResponseCollection);
                        if(res.data.StatusResponseCollection && res.data.StatusResponseCollection.length>0 && res.data.StatusResponseCollection[0]==4){
                            console.log("check2");
                            msg="Unable to delete group(s) "+gNamestr+" as some contents are scheduled in it.";
                        }else{
                            console.log("check3");
                            msg="Deleted Successfully";
                        }
                        this.setState({
                            poptitle: "Information",
                            message: msg,
                            popType: "information",
                            popEnable: true
                        })
                        this.getRecords();
                    }else{
                        this.setState({
                            poptitle: "Information",
                            message: "Something Went Wrong!",
                            popType: "information",
                            popEnable: true
                        })
                    }
                });
        }else{

            this.setState({
                poptitle: "Information",
                message: "please select group for delete",
                popType: "information",
                popEnable: true
            })
        }
    }

    handleRowClick = (e, data) =>{
        this.setState({selctedGroupUnitIds:[]})
        console.log("selected data",e.original);
        if(e.original){
            this.setState({dataLoading:true});
            this.setState({selectedGroupData:e.original,groupCbCount:e.original.CabCount,groupRestCbCount:e.original.RestrictedCabCount});
            this.getTableData(e.original.Group_ADS_ID)
        }
    }

    /*========================= delete Group =============================*/

    updategroupStatus = (value) => {
        this.setState({showStatus:false});
        if(this.state.deletedObj.length > 0){
            this.setState({display : 0})
            let arr = [];
            let obj = {
                "statusId":value,///test
                "tryAll":false,
                groupIds : []
            }
            for(let i=0; i<this.state.deletedObj.length; i++){
                obj.groupIds.push(this.state.deletedObj[i].Group_ADS_ID);
            }

            postData('GroupADSFL/ChangeGroupStatus', obj)
                .then(res =>{
                    console.log('============= res =================');
                    console.log(res);
                    if(res.data && res.data.ReturnCode===0){

                        this.setState({dataLoading : true,display : 0, deletedObj : [],selctedGroupIds:[]});
                        this.getRecords();
                    }
                });

        }
    }

    handleStatusChange = (value) => {
        this.setState({showStatus:false});
        if(this.state.deletedObj.length > 0){
            this.setState({display : 0})
            var str ="";
            if(this.state.deletedObj && this.state.deletedObj.length>0) {
                let isNotAllowed =false;
                if(this.state.deletedObj.length==1) {
                  if(this.state.deletedObj[0].Status == value) {
                      isNotAllowed =true;
                  }
                }

                if(isNotAllowed) {
                    this.setState({
                        poptitle: "Information",
                        message: "Selected group has same status..",
                        popType: "information",
                        popEnable: true
                    })
                }else {
                    for(let i=0; i<this.state.deletedObj.length; i++){
                        str +=this.state.deletedObj[i].Group_ADS_Name+ ",";
                    }
                    this.setState({
                        poptitle: "Information",
                        message: "Are you sure you want to change the status of "+str,
                        popType: "updateGroup",
                        popEnable: true,
                        gStatusValForChange:value
                    })
                }

            }



        }else{

            this.setState({
                poptitle: "Information",
                message: "Please select group(s)",
                popType: "information",
                popEnable: true
            })
        }
    }
    /*recursive = () => {
        setTimeout(() => {
            let hasMore = this.state.data.length + 1 < this.props.data.length;
            this.setState( (prev, props) => ({
                data: props.data.slice(0, prev.data.length + 1)
            }));
            if (hasMore) this.recursive();
        }, 0);
    }*/

    loadFiles(type,type1,){
        this.filterType  = type;
        this.filterType1 = type1;
        let BackupFileList = [];
        BackupFileList = this.state.loadFileBackupData;
        let filterList = []
        if(BackupFileList && BackupFileList.length>0){
            BackupFileList.forEach(function (item){
               if(item.ContentTypeID==type){
                   filterList.push(item)
               }
            });
            filterList.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.Dated) - new Date(a.Dated);
            });
        }
        this.setState({loadFileData:filterList,loadFile:true,filteredBackFileList:filterList});
        console.log("load data",this.state.loadFileData);


  }

  filterMedia(type,value,serachby){
    let UploadedBy = this.state.uploadby
    let FilteredBackupFileList = [];
    let uploadByArray=[];
    let filenamesArray=[];
    let tagArray=[];
    let searchbyFile = this.state.searchbyFile;
    let searchTag = this.state.tags
    if(UploadedBy>=0){
        FilteredBackupFileList = this.state.filteredBackFileList;
        if(FilteredBackupFileList && FilteredBackupFileList.length>0){
            FilteredBackupFileList.forEach(function (item) {
                console.log(UploadedBy + "item.UserID"+ item.UserID);
                if(item.UserID == UploadedBy){
                    uploadByArray.push(item) ;
                }
            });
        }


        if(serachby=="file" || serachby=="uploadedBy"){
            FilteredBackupFileList = uploadByArray;
            if(FilteredBackupFileList && FilteredBackupFileList.length>0){
                FilteredBackupFileList.forEach(function (item) {
                    if(searchTag){
                        if(item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())){

                            filenamesArray.push(item) ;
                        }
                    }else {
                        if (item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                            filenamesArray.push(item);
                        }
                    }
                });
            }
        }
        else if(serachby=="tag" || serachby=="uploadedBy" ){
            FilteredBackupFileList = uploadByArray;
            if(FilteredBackupFileList && FilteredBackupFileList.length>0){
                FilteredBackupFileList.forEach(function (item) {
                    if(searchbyFile){
                        if(item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())){

                            filenamesArray.push(item) ;
                        }
                    }else {
                        if (item.Tag.toUpperCase().includes(searchTag.toUpperCase())) {

                            filenamesArray.push(item);
                        }
                    }
                });
            }
        }else{
            filenamesArray =  uploadByArray
        }

        this.setState({loadFileData:filenamesArray});
    }else{
        uploadByArray = this.state.filteredBackFileList
        if(serachby=="file" || serachby=="uploadedBy"){
            FilteredBackupFileList = uploadByArray;
            if(FilteredBackupFileList && FilteredBackupFileList.length>0){
                FilteredBackupFileList.forEach(function (item) {
                    if(searchTag){
                        if(item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())){

                            filenamesArray.push(item) ;
                        }
                    }else {
                        if (item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                            filenamesArray.push(item);
                        }
                    }
                });
            }
        }
        else if(serachby=="tag" || serachby=="uploadedBy"){
            FilteredBackupFileList = uploadByArray;
            if(FilteredBackupFileList && FilteredBackupFileList.length>0){
                FilteredBackupFileList.forEach(function (item) {
                    if(searchbyFile){
                        if(item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())){

                            filenamesArray.push(item) ;
                        }
                    }else {
                        if (item.Tag.toUpperCase().includes(searchTag.toUpperCase())) {

                            filenamesArray.push(item);
                        }
                    }
                });
            }
        }else{
            filenamesArray =  uploadByArray
        }
        this.setState({loadFileData:filenamesArray});
    }
  }

  getThumnail(url){
    //console.log("thumnail ulr is",url);
    if(url){
        var ext = url.substr(0,url.lastIndexOf('.'));
        ext = ext+".jpg";
        return ext;
    }else{
        return "";
    }

}

setHouseAd(data){
    if(this.filterType === 2){
        this.state.houseObj["FileDisplayName"]=data.FileName;
        this.state.houseObj["FileID"]=data.FileID;
        this.state.houseObj["WebVisibleURLHBanner"]=data.WebVisibleURL;

    }else if(this.filterType === 3){
        this.state.houseObj["VFileDisplayName"]=data.FileName;
        this.state.houseObj["FileID_V"]=data.FileID;
        this.state.houseObj["WebVisibleURLVBanner"]=data.WebVisibleURL;
    }
    this.setState({loadFile:false})
}

removeHouseAdd(type){
    if(type === 2){
        this.state.houseObj["FileDisplayName"]=null;
        this.state.houseObj["FileID"]=-1;
        this.state.houseObj["WebVisibleURLHBanner"]=null;

    }else if(type === 3){
        this.state.houseObj["VFileDisplayName"]=null;
        this.state.houseObj["FileID_V"]=-1;
        this.state.houseObj["WebVisibleURLVBanner"]=null;
    }
    this.setState({refresh:true})
}
upDateHouseAd(){
    postData("HouseAdvDetails/AddHouseAdDetail",this.state.houseObj)
    .then(res=>{
        if(res.data && res.data.ReturnCode===0){
            this.setState({dlgtitle:"Information",message:"Configured Successfully",dlgType:"information",dlgEnable:true,houseAd:false,houseObj:{}},()=>this.getHouseData())
        }else{
            this.setState({dlgtitle:"Information",message:"Failed please try again",dlgType:"information",dlgEnable:true,houseAd:false,houseObj:{}},()=>this.getHouseData())
        }
    })
}

cancCabInfo(){
    for(let i=0;i<this.state.filterVal.length;i++){
        this.state.filterVal[i]="";
    }
    this.setState({cabId:[],isAllSelected:false,availableCabInfo:false,availableCabsList:[],visibleFilters:[],filtered:[]})
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
        console.log("visibleCol",visibleCol)
        console.log("csvData",csvData)
        visibleData = csvData;
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

    exportcabAssociationData(newFilter){
        let obj1={
            "iTapp":null,
            "IPAddress":null,
            "CabNumber":null,
            "UnitKey":null,
            "PIM":null,
            "CCCODE1":null,
            "TermType":null,
            "GBVersion":null,
            "ClientName":null,
            "DIM":null,
            "Status":null,
            "FilterUnitTypeList":null,//["TaxiTopNYC"],///this is multi choice
            "strLastUpdate":null,
            "VerunitArr":null,///this is multi choice
            "PageNo":this.state.page+1,
            "RowCountPerPage":100
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
        var gid =0;
        if(this.state.selectedGroupData.Group_ADS_ID){
            gid = this.state.selectedGroupData.Group_ADS_ID;
        }
        let obj={
            "groupId":gid,
            "filterCriteria":obj1,
        }

        postData("GroupAds_Flash_Cab/GetAllCabsForGroupWithFilterExport",obj)
            .then(res => {
                this.setState({loading:false});
                if (res.data && res.data.ResponseCollection) {
                    this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.switchcolumns,false)
                }
            })
    }


    render(){
        return(
           <div>
               <div className="CabDtTabMainWrp">
                  {
                    this.tabs && this.tabs.map((key,index)=>(
                    <div className={this.state.tabIndex === index ?"CabDtTabWrp1":"CabDtTabWrp"} onClick={()=>this.setState({tabIndex:index},()=>this.getTableData())}>
                        {key}
                         ( {index==0?this.state.groupCbCount:this.state.groupRestCbCount} )
                        </div>
                    ))
                  }
                </div>
                {
                     this.state.dlgEnable ?
                    <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} onOk={()=>{
                        this.setState({dlgEnable:false})
                        if(this.state.dlgType == "updateGroup"){
                            this.updategroupStatus(this.state.gStatusValForChange);
                        }
                    }} onHide={()=>this.setState({dlgEnable:false})}/>
                    : this.state.houseAd ?
                    <div className="Loader">
                        <div className="SchedHouseAdwrp">
                            <div className="ForgPassTitle ShedTitle">
                                <div style={{"width":"96%"}}>Configure HouseAd</div>
                                <div className="ShedHide" onClick={()=>this.setState({houseAd:false},()=>this.getHouseData())} >X</div>
                            </div>
                            <div className="SchedEdtFileTopWrp">
                                      <div className="SchedEdtFileTopChild1" onClick={()=>this.loadFiles(3,"Vbanner","Bsched")}>
                                          <span className="SchedBnrPopImgTypetxt">Vertical Banner</span>
                                          {
                                              this.state.houseObj && this.state.houseObj.WebVisibleURLVBanner?
                                                  <div>
                                                      <div className="SchedBnrpopImgWrp">
                                                          <img src={this.state.houseObj.WebVisibleURLVBanner} className="SchedBnrpopImg"></img>
                                                          <div className="SchedBnrpopImgOvrWrp">
                                                              <img src={require("../../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg4" onClick={(e)=>{e.stopPropagation();this.removeHouseAdd(3)}}></img>
                                                          </div>
                                                      </div>
                                                      <span className="SchedBnrPopImgTypetxt1">{this.state.houseObj.VBannerName}</span>
                                                  </div>
                                                  :
                                                  <div>
                                                      <img src={require("../../../Assets/Images/images.jpg")} className="SchedBnrpopImg1"></img>
                                                      <span className="SchedBnrPopImgTypetxt1">{this.state.houseObj.VBannerName?this.state.houseObj.VBannerName:"No Image"}</span>
                                                  </div>
                                          }
                                          {
                                              this.state.typeL === 1 ||  this.state.typeL === "1"&&
                                              <div className="SchedDisbleWrp"></div>
                                          }
                                      </div>
                                    <div className="SchedEdtFileTopChild1" onClick={()=>this.loadFiles(2,"Hbanner","Bsched")}>
                                      <span className="SchedBnrPopImgTypetxt">Horizontal Banner</span>
                                      {
                                          this.state.houseObj && this.state.houseObj.WebVisibleURLHBanner?
                                          <div>
                                              <div className="SchedBnrpopImgWrp">
                                               <img src={this.state.houseObj.WebVisibleURLHBanner} className="SchedBnrpopImg"></img>
                                               <div className="SchedBnrpopImgOvrWrp">
                                                  <img src={require("../../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg4" onClick={(e)=>{e.stopPropagation();this.removeHouseAdd(2)}}></img>
                                               </div>
                                              </div>
                                              <span className="SchedBnrPopImgTypetxt1">{this.state.houseObj.HBannerName}</span>
                                          </div>
                                          :
                                          <div>
                                              <img src={require("../../../Assets/Images/images.jpg")} className="SchedBnrpopImg1"></img>
                                              <span className="SchedBnrPopImgTypetxt1">{this.state.houseObj.HBannerName?this.state.houseObj.HBannerName:"No Image"}</span>
                                           </div>
                                        }

                                    </div>

                                  </div>
                                  <div className="MediaFlUpldBtm">
                                        <img
                                            src={require("../../../Assets/Images/Login/ok-btn.png")}
                                            className="SystFlnextBtn"
                                            onClick={() => this.upDateHouseAd()}></img>
                                        <img
                                            src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                            className="SystFlnextBtn"
                                            onClick={() => this.setState({
                                                               houseAd: false,
                                                              },()=>this.getHouseData())}></img>
                                </div>
                        </div>
                        {
                                  this.state.loadFile &&
                                  <div>
                                    <div className="SchedBnrWrp3">
                                       <div className="ForgPassTitle">Media Filter <img src={require("../../../Assets/Images/close.png")} className="SchedColStClose" style={{marginLeft:"82%"}} onClick={()=>this.setState({loadFile:false})}></img></div>
                                       <div className="SchedBnrInptWrp">
                                           <span className="SchedBnrPopTxt" style={{marginLeft:'5%'}}>Uploaded By</span>
                                           <select className="SchedDropDwn1" onChange={(e)=>this.setState({uploadby:e.target.value},()=>this.filterMedia(this.filterType,this.state.uploadby,"uploadedBy"))} value={this.state.uploadby}>
                                               <option value="-1">ALL</option>
                                               {
                                                   this.state.userList.map((key, index) =>{
                                                       return (
                                                           <option value={key.userId}>{key.Name}</option>
                                                       )
                                                   })
                                               }
                                           </select>
                                           <span className="SchedBnrPopTxt" style={{marginLeft:'4%',marginTop:"3px"}}>Tags</span>
                                           <input style={{marginTop:"3px"}} onChange={(e)=>this.setState({tags:e.target.value})} onKeyUp={(e)=>this.filterMedia(this.filterType,e.target.value,"tag")} value={this.state.tags}></input>
                                         </div>
                                         <div className="SchedBnrInptWrp">
                                           <span className="SchedBnrPopTxt" style={{marginLeft:'8%',marginTop:"3px"}}>File Name</span>
                                           <input style={{marginTop:"3px"}} onChange={(e)=>this.setState({searchbyFile:e.target.value})} onKeyUp={(e)=>this.filterMedia(this.filterType,e.target.value,"file")} value={this.state.searchbyFile}></input>
                                         </div>
                                         <div className="SchedLodFlWrp">
                                           {
                                             this.state.loadFileData && this.state.loadFileData.map((key,index)=>(
                                               key.ContentTypeID=== this.filterType &&
                                               <div className="SchedLodFlChildWrp" onDoubleClick={()=>this.setHouseAd(key)}>
                                                   <img src={this.getThumnail(key.WebVisibleURL)} className={key.ContentTypeID===2 ? "MediaFlImgWrp2":key.ContentTypeID===3 ? "MediaFlImgWrp3":"MediaFlImgWrp"}></img>
                                                   <span className="MediaFlTitle">{key.TempName}</span>
                                               </div>
                                             ))
                                           }
                                         </div>
                                    </div>
                                  </div>
                              }
                    </div>
                    :this.state.previewLoop &&
                    <div className="Loader">
                        <div className="SchedPrevLoopWrp">
                               <div className="ForgPassTitle">Preview Loop <img src={require("../../../Assets/Images/close.png")} className="SchedColStClose" style={{marginLeft:"82%"}} onClick={()=>this.setState({previewLoop:false})}></img></div>
                               <div className="ScheduleTabToolWrp">
                                   <div className="ScheduleTableToolCont">
                                       {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                                       <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                                       {/* <img src={require('../../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg"></img>
                                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img> */}
                                       <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>this.getPreviewData()}></img>
                                   </div>
                               </div>
                               <ReactTable
                       data={this.state.prevData}  ///this previevLoop
                       columns={this.state.prevCol}
                       loading={this.state.flLoading}
                       NoDataComponent={()=>null}
                       showPagination={false}
                       extradata={this.state}
                       filtered={this.state.filtered}
                       sortable={false}
                       style={{
                         height: "280px", //
                       }}
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
                     <div className="MediaFlUpldBtm">
                                       <img
                                           src={require("../../../Assets/Images/Login/ok-btn.png")}
                                           className="SystFlnextBtn"
                                           onClick={() => this.setState({previewLoop:false})}></img>

                               </div>
                        </div>
                    </div>
                }
            <div className="SchedGrpMainWrp">
             <div className="SchedGrpTaleWrp">
                {
                  this.state.columnSt &&
                  <ColumnStatus data={this.state.switchcolumns} onChange={(e)=>this.setColumn(e,'switchcolumns')} class={"SchedGrpColSt"} onClose={(e)=>this.resetColmn(e,'switchcolumns')}></ColumnStatus>
                }
                <div className="ScheduleTabToolWrp">
                      <img src={require('../../../Assets/Images/Cab/Add-Cab.png')} className="ScheduleupldImg" onClick={()=>this.getAvailavleCabsListForAssociation([])}></img>
                      <img src={require('../../../Assets/Images/Cab/Delete-Cab.png')} className="ScheduleupldImg" onClick={()=>this.deleteConformation()}></img>
                      <img src={require('../../../Assets/Images/Cab/Copy-Cab.png')} className="ScheduleupldImg" onClick={()=>this.copyCabsTogroup()}></img>
                      <div className="ScheduleTableToolCont">
                          {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          {/*<ExportCSV csvData={this.state.data} fileName="associatedCabs" visibleCol={this.state.switchcolumns} isConversion={false} callback={()=>{}} />*/}
                          <img src={require("../../../Assets/Images/tools/export.jpg")} className="ScheduleToolImg" onClick={()=>this.exportcabAssociationData(this.state.filtered)}></img>
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>this.getTableData()}></img>
                      </div>
                  </div>
                  {
                      this.state.tabIndex === 0 ?
                      <ReactTable
                      ref={(refReactTable) => {this.refReactTable = refReactTable;}}
                      data={this.state.data}
                      loading={this.state.dataLoading}
                      columns={this.state.switchcolumns}
                      PaginationComponent={(Pagination)}
                      NoDataComponent={()=>null}
                      filtered={this.state.filtered}
                      sortable={false}
                      totlaItems={this.state.cabtotalCnt}
                      filterCnt={this.state.cabfilterCnt}
                      defaultPageSize={100}
                      pages={this.state.pageCount}
                      style={{
                        height: "410px" //
                      }}
                      Sortable={false}
                      manual
                      onFetchData={(state, instance) => {
                       if(!this.state.availableCabInfo){
                        this.setState({page:instance.state.page},()=>{
                            clearTimeout(this.timer);
                            this.timer = setTimeout(()=>this.getTableData(null,this.state.filtered),550)
                        })
                       }

                      }}
                      getTheadFilterProps={(state, rowInfo, column, instance) => {
                        return {
                          style:
                          { display: "none" }
                        };
                      }}

                   />
                   :
                   <ReactTable
                   data={this.state.data}
                   loading={this.state.dataLoading}
                   columns={this.state.switchcolumns}
                   filtered={this.state.filtered}
                   //minRows={20}
                   //defaultPageSize={20}
                   //pageSize={this.state.data.length}
                   sortable={false}
                   showPagination={false}
                   style={{
                     height: "440px" //
                   }}
                   getTheadFilterProps={(state, rowInfo, column, instance) => {
                     return {
                       style:
                       { display: "none" }
                     };
                   }}

                   NoDataComponent={() => null}
               />
                  }

             </div>
             <div className="SchedGrpWrp">
               <div className="SchedGrpTableToolWrp">
                 <img src={require("../../../Assets/Images/Group/add-over.png")} className="SchedGrpTableToolImg groupIcon" onClick={() => this.addGroup()}></img>
                 <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg groupIcon" onClick={()=> this.handeldeleteBeforedelete()}></img>
                 <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                   <div>
                       <img src={require("../../../Assets/Images/Group/change-status.png")} className="SchedGrpTableToolImg groupIcon" onClick={()=>this.openStatusDll()}></img>

                           <div className={this.state.showStatus ? "grpStatus" :"grpStatus_none"}>
                               <div className="nav__submenu-item" onClick={()=>this.handleStatusChange(0)}>Current</div>
                               <div className="nav__submenu-item" onClick={()=>this.handleStatusChange(2)}>Draft</div>
                               <div className="nav__submenu-item" onClick={()=>this.handleStatusChange(3)}>Test</div>
                           </div>



                   </div>
                 <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../../Assets/Images/Group/house_icon_20px.gif")} className="SchedGrpTableToolImg groupIcon" onClick={()=>this.setState({houseAd:true})}></img>
                 <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../../Assets/Images/Group/preview.gif")} className="SchedGrpTableToolImg groupIcon" onClick={()=>this.setPrevColumns()}></img>
                 <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../../Assets/Images/tools/refresh.png")} className="ScheduleToolImg grouprefresh" onClick={()=>{this.setState({deletedObj:[],selctedGroupUnitIds:[],selctedUnitIds:[],selctedGroupIds:[]});this.getRecords()}}></img>
               </div>
               <ReactTable
                          data={this.state.grpData}
                          columns={this.state.grpColumn}
                          loading={this.state.grpLoading}
                          showPagination={false}
                          filtered={this.state.grpfiltered}
                          sortable={false}
                          className="SchedGrpTableWrp1"
                          minRows={20}
                          defaultPageSize={20}
                          pageSize={this.state.grpData.length}
                          NoDataComponent={() => null}
                          getTheadFilterProps={(state, rowInfo, column, instance) => {
                            return {
                              style:
                                this.state.grpvisibleFilters.length === 0
                                  ? { display: "none" }
                                  : null
                            };
                          }}
                          getTheadFilterThProps={(state, rowInfo, column, instance) => {
                            return {
                              className:
                                this.state.grpvisibleFilters.indexOf(column.id) < 0
                                  ? "hiddenFilter"
                                  : null
                            };
                          }}
                          getTrGroupProps={(state, rowInfo, column, instance) => {
                              if (typeof rowInfo !== "undefined") {
                                  return {
                                      onMouseOver: (e, handleOriginal) => {
                                          this.setGroupInf(rowInfo)
                                      },
                                      onClick: (e, handleOriginal) => {
                                          e.preventDefault();
                                          this.handleRowClick(rowInfo);

                                          this.setState({
                                              rowSelectedindex: rowInfo.index,
                                              selctedGroupUnitIds:[],
                                              selctedUnitIds:[]
                                          });
                                          if (handleOriginal) {
                                              handleOriginal()
                                          }

                                      },
                                      style: {
                                          background: rowInfo.index === this.state.rowSelectedindex ? '#00afec' : '',
                                          color: rowInfo.index === this.state.rowSelectedindex ? 'white' : 'black'
                                      },
                                  }
                              }else{

                              }

                          }}

                  />
                <div className="ScedGrpInfoMainWrp">
                    <div className="SchedGrpInfoChild1">{this.state.groupName}</div>
                      <div className="SchedGrpInfoChild1">
                        <div className="SchedGrpInfoChild2">Videos:{this.state.videoCount}</div>
                        <div className="SchedGrpInfoChild2">Buttons:{this.state.buttonCount}</div>
                        <div className="SchedGrpInfoChild2">Banners:{this.state.bannerCount}</div>
                      </div>
                      <div className="SchedGrpInfoChild1">
                          <div className="SchedGrpInfoChild2">Associated Cabs:{this.state.cabCount}</div>
                          <div className="SchedGrpInfoChild2">Restricted Cabs:{this.state.restCabCount}</div>
                      </div>
                </div>


                 {
                     this.state.popEnable ?
                         <Dialog title={this.state.poptitle} message={this.state.message} onOk={()=>{
                             this.setState({popEnable:false})
                             if(this.state.popType === "delete"){
                                 this.deletCabsFromGroup();
                             }
                             if(this.state.popType === "deleteGroup"){
                                 this.handleDeleteGrp();
                             }
                             if(this.state.popType == "updateGroup"){
                                 this.updategroupStatus(this.state.gStatusValForChange);
                             }
                         }} onHide={()=>this.setState({popEnable:false})} onCancel={()=>this.setState({popEnable:false})} type={this.state.popType}></Dialog>
                         :
                     this.state.grpInfo &&
                     <div className="Loader">
                         <div className="SystemAddRelWrp">
                             <div className="ForgPassTitle">Add Group</div>
                             <div style={{display: "flex", alignItems: "center", marginTop: "6px", width : '100%'}}>
                                 <span className="SystemFlUpldtxt" style={{marginLeft: "6%", width : '25%'}}>Group Name *</span>
                                 <input className="grpDatePickWrp form__input" value={this.state.grpObj.groupName}
                                        onChange={(e) => this.handleValues(e.target.value, 'groupName')}></input>
                             </div>

                             <div>
                                 <div style={{display: "flex", alignItems: "center", marginTop: "6px", width : '100%'}}>
                                     <span className="SystemFlUpldtxt" style={{marginLeft: "6%", width : '25%'}}>Start Date *</span>
                                     <DatePicker selected={this.state.grpObj.startDate}
                                                 onChange={(date) => this.handleValues(date, 'startDate')}
                                                 wrapperClassName="grpDatePickWrp" className="DatePickInptWrp"
                                                 popperPlacement="right-start"></DatePicker>
                                 </div>
                                 <div style={{display: "flex", alignItems: "center", marginTop: "6px", width : '100%'}}>
                                     <span className="SystemFlUpldtxt" style={{marginLeft: "6%", width : '25%'}}>Start Date *</span>
                                     <DatePicker selected={this.state.grpObj.endDate}
                                                 onChange={(date) => this.handleValues(date, 'endDate')}
                                                 wrapperClassName="grpDatePickWrp" className="DatePickInptWrp"
                                                 popperPlacement="right-start"></DatePicker>
                                 </div>
                                 {
                                     sessionStorage.getItem("marketId")=="MX925"?
                                         <div></div>
                                         :
                                         <div style={{display: "flex", alignItems: "center", marginTop: "6px", width : '100%'}}>
                                             <span className="SystemFlUpldtxt" style={{marginLeft: "6%", width : '25%'}}>Unit Type *</span>
                                             <select className="unitDropDown" value={this.state.grpObj.unitType}
                                                     onChange={(e) => this.handleValues(e.target.value, 'unitType')}>
                                                 <option value=''>Select Unit Type</option>
                                                 {
                                                     this.state.unitData.map((key, index) =>{
                                                         return (
                                                             <option value={key.ID}>{key.Name}</option>
                                                         )
                                                     })
                                                 }
                                             </select>
                                         </div>
                                 }


                             </div>
                             <div className="SystFlUpldBtm">
                                 <img src={require("../../../Assets/Images/Login/ok-btn.png")} className="SystFlnextBtn"
                                      onClick={() => this.addGroupToDatabase()}></img>
                                 <img src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                      className="SystFlnextBtn" onClick={() => this.setState({grpInfo: false, grpObj : {groupName: '', startDate : '', endDate : '', unitType : ''}})}></img>
                             </div>

                         </div>
                     </div>
                 }
                 {
                     this.state.availableCabInfo ?
                         <div className="Loader">
                             <div className="MediaUpldMainWrp" id="divPopupOnAssociateCab">
                                 <div className="ForgPassTitle">Associate Cabs</div>
                                 <div className="ScheduleTabToolWrp" style={{"background-color":"#CECECE"}}>
                                     <div id="addcabbtncontainer" className="popsubhead">
                                         <div>
                                             <ComCheck checked={this.state.isAllSelected}  onChange={(e)=>this.getAllunitIds(e,this.state.filtered)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                         </div>
                                         <div>Select/De-select all</div>

                                     </div>

                                     <div className="ScheduleTableToolCont">
                                         <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                                         <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                                     </div>
                                 </div>
                                 <ReactTable
                                     columns={this.state.availableCabsColumns}
                                     data={this.state.availableCabsList}
                                     loading={this.state.cabInfoLoading}
                                     PaginationComponent={Pagination}
                                     totlaItems={this.state.totalCnt}
                                     filterCnt={this.state.filterCnt}
                                     defaultPageSize={50}
                                     pages={this.state.pageCount}
                                     sortable={false}
                                     NoDataComponent={()=>null}
                                     style={{height:"250px"}}
                                     manual
                                     onFetchData={(state, instance) => {
                                         this.setState({page:instance.state.page},()=> this.getAvailavleCabsListForAssociation(this.state.filtered))


                                      }}
                                      getTheadFilterProps={(state, rowInfo, column, instance) => {
                                        return {
                                          style:
                                          { display: "none" }
                                        };
                                      }}

                                 />
                                 <div className="MediaFlUpldBtm">
                                     <span className="SystCabCount">Selected cabs({this.state.cabId.length}/{this.state.filterCnt})</span>
                                     <div className="SystAddCabBtn" onClick={()=>this.associateCabsTogroup()}><span>Add Selected Cabs</span></div>
                                     <div className="SystAddCabBtn" onClick={()=>this.cancCabInfo()}><span>Cancel</span></div>
                                 </div>
                             </div>
                         </div>
                         :<div></div>
                 }
                 {
                     this.state.popEnable ?
                         <Dialog title={this.state.poptitle} message={this.state.message} onOk={()=>{
                             this.setState({popEnable:false})
                             if(this.state.popType === "delete"){
                                 this.deletCabsFromGroup();
                             }
                             if(this.state.popType === "deleteGroup"){
                                 this.handleDeleteGrp();
                             }
                             if(this.state.popType == "updateGroup"){
                                 this.updategroupStatus(this.state.gStatusValForChange);
                             }
                         }} onHide={()=>this.setState({popEnable:false})} onCancel={()=>this.setState({popEnable:false})} type={this.state.popType}></Dialog>
                         :<div></div>
                 }
             </div>
           </div>
           </div>
        )
    }
}