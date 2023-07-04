import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import {Search} from "../../CommomComponents/Filters";
import {getData,postData} from "../../../Services/MainServices";
import Pagination from "../../CommomComponents/Pagination";
import ComCheck from "../../CommomComponents/ComCheck";
import moment from 'moment';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {ExportCSV} from '../../../Utility/ExportCSV.js';


let grpData=[
  {
    "Group Name":"Media Event",
    Status:"Active"
  },
  {
    "Group Name":"Non-Media Event",
    Status:"Active"
  }
]

let subdata=[
  [
  ],
  [

  ]
]
let associatedActionStr="";
let TempSelectionArray =[];
/*const subColumn=[
  {
    Header: "",
    accessor: 'ACTION',
    Cell: props => <div className="StatGrpFileWrp1">
        <img src={require("../../../Assets/Images/Group/file.png")} className="StatGrpFileImg1"></img>
        <ComCheck  onChange={(e)=>this.selAllActionRow(e,props)}  containerStyle={"StatComCheckMainWrp"} tickStyle={"StatComChecktick"}></ComCheck>
        <span className='number'>{props.value}</span></div>
  },
]*/
const columns=[
  {accessor:"ACTION",lable:"Action"},
  {accessor:"YEAR",lable:"Year"},
  {accessor:"MONTH",lable:"Month"},
  {accessor:"DAY",lable:"Day"},
  {accessor:"ACTIONCOUNT",lable:"#Action"},
  {accessor:"TRIPCOUNT",lable:"#Trip"},
  {accessor:"AVGFARE",lable:"Avg Fare"},
  {accessor:"AVGLENTH",lable:"Avg Length"},
  {accessor:"UNITCOUNT",lable:"Unit Count"},
  {accessor:"OwnerName",lable:"Owner"},
  {accessor:"Cfiletype",lable:"Content File Type"},
  {accessor:"Tag",lable:"Tags"},
  {accessor:"ContractId",lable:"Contact#"},
  {accessor:"DATED",lable:"Date"}
];


export default class Statistics extends Component{
  tem=[];
    subColumn=[
        {
            Header: "",
            accessor: 'ACTION',
            Cell: props => <div className="StatGrpFileWrp1">
                <img src={require("../../../Assets/Images/Group/file.png")} className="StatGrpFileImg1"></img>
                <ComCheck  onChange={(e)=>this.selActionRow(e,props)}  containerStyle={"StatComCheckMainWrp"} tickStyle={"StatComChecktick"}></ComCheck>
                <span className='number'>{props.value}</span></div>
        },
    ]
  grpColumn=[
    {
      Header: ()=><div className="ScheduleHeaderWrp">
      <div>Group Name</div>
      <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
      </div>,
      accessor: 'Group Name',
      Cell: props => <div className="StatGrpFileWrp">
        <img src={require("../../../Assets/Images/Group/folder.png")} className="StatGrpFileImg"></img>
        <ComCheck  onChange={(e)=>this.selAllActionRow(e,props)}  containerStyle={"StatComCheckMainWrp"} tickStyle={"StatComChecktick"}></ComCheck>
        <span className='number'>{props.value}</span></div>  // Custom cell components!
    },
  ];
  timeOut = null;

    constructor(props){
         super(props);
         this.handleClickOutside = this.handleClickOutside.bind(this);
         this.state={
             group:false,
             groupName:"ALL",
             columns:[],
             data:[],
             columnSt:false,
             grpColumn:this.grpColumn,
             subColumn:this.subColumn,
             filtered:[],
             sty:{width:"30px",height:"0px"},
             filter:-1,
             filterVal:[],
             visibleFilters:[],
             pageCount:0,
             loading:true,
             filterCnt:0,
             totalCnt:0,
             strDate:new Date(),//"01/"+moment().format("DD")+"/2015",
             endDate:new Date(),
             Actionloading:false,
             actionView:true,
             exportFileName:"stateexport",
             sortedData:[]

         }
        }

        componentDidMount(){
            var date = new Date(); // Now
            date.setDate(date.getDate() - 30); // Set now + 30 days as the new date
            console.log("on diid mount",date);
            this.setState({strDate:date});
            document.addEventListener('mousedown', this.handleClickOutside);

        subdata=[
                [
                ],
                [

                ]
            ]
            associatedActionStr="";
            TempSelectionArray =[];
           let dColumn = [];
           let sColumn=[];
           this.state.filterVal=[];
          columns.map((key,index)=>{
                this.state.filterVal.push("")
                let obj={}
                if(key.accessor === "DATED"){
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
                      Filter: (cellInfo) =>
                          <div>{
                              this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                              <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                          }
                          </div>,
                      Cell:(rowInfo)=><div className="SystFlColContainer">{rowInfo.original?this.gonvertDate(rowInfo.original[key.accessor]):""}</div>

                  }
              }else{
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
                      Filter: (cellInfo) =>
                      <div>{
                          this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                          <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]}></Search>
                        }
                        </div>

                     }
              }

                dColumn.push(obj);
           });
           this.setState({columns:dColumn},()=>{
               let dataObj={
                   "strStartDate":moment(this.state.strDate).format('YYYY-MM-DD 00:00:00'),
                   "strEndDate": moment(this.state.endDate).format('YYYY-MM-DD 23:59:00'),
                   "strAction": null,
                   "Year": 0,
                   "Month": 0,
                   "Day": 0,
                   "PageNo":1,
                   "strDated": null,
                   "RowCountPerPage": 10000
               }
               let url ="TripLogStat/Fetch";
               this.getRecords(dataObj,url);
               this.FetchAction(dataObj);
           });

          }

          gonvertDate(date){
            if(date){
                return moment(date).format("DD-MMM-YYYY HH:mm:ss");
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
        console.log("x is ", x[0])
        console.log("event.target is ", event.target);
        if (event.target !== x[0]) {
            console.log("out inside");
            this.setState({visibleFilters: []});
        } else {
            console.log("inside inside");
        }
    }

    selActionRow(e, props) {
        console.log("call selActionRow", props);
        associatedActionStr="";
        if(e){
            TempSelectionArray.push(props.original.ACTION);
        }else{
            let tArray = TempSelectionArray;
            TempSelectionArray.forEach(function (tempitem,index) {
                if(props.original.ACTION == tempitem){
                    tArray.splice(index,1);
                }
            });
            TempSelectionArray=tArray;

        }
        if (TempSelectionArray && TempSelectionArray.length > 0) {
            TempSelectionArray.forEach(function (item) {
                associatedActionStr += "'"+item+"',";
            })
        }

        console.log("in single select associatedActionStr", associatedActionStr);
    }

    selAllActionRow(e, props) {
        console.log("call selAllActionRow", e);
        associatedActionStr="";
        if(e){
            console.log("inside true")

            let selectActionArray = subdata[props.index];
            if (selectActionArray && selectActionArray.length > 0) {
                selectActionArray.forEach(function (item) {
                    TempSelectionArray.push(item.ACTION);
                })

            }
            if (TempSelectionArray && TempSelectionArray.length > 0) {
                TempSelectionArray.forEach(function (item) {
                    associatedActionStr += "'"+item+"',";
                })
            }
            //TempSelectionArray = subdata;
        }else{
            console.log("inside false")
            let selectActionArray = subdata[props.index];
            let tArray = TempSelectionArray;
            if (selectActionArray && selectActionArray.length > 0) {

                console.log("Tarrra befoe",tArray);
                selectActionArray.forEach(function (item) {
                    TempSelectionArray.forEach(function (tempitem,index) {
                        if(item.ACTION == tempitem){
                            console.log("fount",index)
                            tArray.splice(index,1);
                        }
                    });
                })

            }
            console.log("Tarrra after",tArray);
            TempSelectionArray = tArray;
            if (TempSelectionArray && TempSelectionArray.length > 0) {
                TempSelectionArray.forEach(function (item) {
                    associatedActionStr += "'"+item+"',";
                })
            }
            //TempSelectionArray = subdata;
        }

        console.log("final associatedActionStr", associatedActionStr);
    }
    applyActionFilter(){
        //associatedActionStr =associatedActionStr.substring()
        //associatedActionStr = associatedActionStr.substring(0, associatedActionStr.Length - 1);
        let tempStr = associatedActionStr;
        tempStr = tempStr.substring(0, tempStr.length-1);
            let dataObj = {
            "strStartDate": moment(this.state.strDate).format('YYYY-MM-DD 00:00:00'),
            "strEndDate": moment(this.state.endDate).format('YYYY-MM-DD 00:00:00'),
            "strAction": tempStr,
            "Year": 0,
            "Month": 0,
            "Day": 0,
            "PageNo": 1,
            "strDated": null,
            "RowCountPerPage": 10000
        }
        let url ="TripLogStat/FetchActionAssociated";
        this.getRecords(dataObj,url);

    }
    getReport() {
        let dataObj = {
            "strStartDate": moment(this.state.strDate).format('YYYY-MM-DD 00:00:00'),
            "strEndDate": moment(this.state.endDate).format('YYYY-MM-DD 23:59:00'),
            "strAction": null,
            "Year": 0,
            "Month": 0,
            "Day": 0,
            "PageNo": 1,
            "strDated": null,
            "RowCountPerPage": 10000
        }
        let url ="TripLogStat/Fetch";
        this.getRecords(dataObj,url);
        this.FetchAction(dataObj);
    }

    FetchAction(dataObj) {
        subdata = [];
        TempSelectionArray = [];
        this.setState({Actionloading: true});
        grpData=[];
        postData("TripLogStat/FetchAction", dataObj)
            .then((res) => {
                console.log("action data", res.data.ResponseCollection);
                grpData=[
                    {
                        "Group Name":"Media Event",
                        Status:"Active"
                    },
                    {
                        "Group Name":"Non-Media Event",
                        Status:"Active"
                    }
                ]
                subdata = res.data.ResponseCollection;
                TempSelectionArray = [];
                this.setState({Actionloading: false});

            })
    }


    getRecords(dataObj,url) {
        console.log("get stat")
        this.setState({data: [], loading: true});


        postData(url, dataObj)
            .then((res) => {
                if (res && res.data && res.data.ResponseCollection) {
                    /*let data = res.data.ResponseCollection;
                     data.sort(function(a, b) {
                     return parseFloat(a.ACTION) - parseFloat(b.ACTION);
                     });*/
                    this.setState({
                        data: res.data.ResponseCollection,
                        sortedData:res.data.ResponseCollection,
                        totalCnt: res.data.ResponseCollection.length,
                        filterCnt: res.data.FilteredCount,
                        loading: false,
                        pageCount: Math.ceil(res.data.ResponseCollection.length / 100)
                    })


                } else {
                    this.setState({data: [], loading: false})
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

           customFilerChange(value,accessor,index,column){
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
            this.setState({ filtered: newFilter},()=>{
              clearTimeout(this.timeOut);
              this.setFilterdData()
            });
            console.log(this.refReactTable)
           }

           setFilterdData=()=>{
               this.timeOut = setTimeout(()=>this.setState({filterCnt:this.refReactTable.state.sortedData.length,sortedData:this.refReactTable.state.sortedData}),300)
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

    setGroupInf(rowInfo){
      if(rowInfo){
        this.setState({groupName:rowInfo.original["Group Name"]})
      }
    }

   onFilteredChange=(filtered)=>{
    console.log(filtered)
   }


    render(){
        return(
           <div>
            <div className="SchedGrpMainWrp">
             <div  className={this.state.actionView?"SchedGrpTaleWrp":"SchedGrpTaleWrpExpad"}>
                {
                  this.state.columnSt &&
                  <ColumnStatus data={this.state.columns} onChange={(e)=>this.setColumn(e,'columns')} class={"SchedGrpColSt"} onClose={(e)=>this.resetColmn(e,'columns')}></ColumnStatus>
                }
                <div className="ScheduleTabToolWrp">
                      <div className='SchedHeadTxt'>Start Date</div>
                      <DatePicker selected={new Date(this.state.strDate)}   onChange={(date)=>this.setState({strDate:date})} wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                      <div className='SchedHeadTxt'>End Date</div>
                      <DatePicker selected={this.state.endDate}  onChange={(date)=>this.setState({endDate:date})} wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                      <img src={require('../../../Assets/Images/Upload/get-report.png')} className="flterBtn" onClick={()=>this.getReport()}></img>
                      <div className="ScheduleTableToolCont">

                          {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <ExportCSV csvData={this.state.sortedData} fileName={this.state.exportFileName} visibleCol={this.state.columns} isConversion={false} callback={()=>{}} />
                          <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg"></img>
                      </div>
                  </div>
                  <ReactTable
                 ref={(refReactTable) => {this.refReactTable = refReactTable;}}
                 loading={this.state.loading}
                 data={this.state.data}
                 columns={this.state.columns}
                 defaultPageSize={100}
                 minRows={100}
                 filtered={this.state.filtered}
                 onChange={this.onFilteredChange}
                 sortable={false}
                 totlaItems={this.state.totalCnt}
                 filterCnt={this.state.totalCnt === this.state.filterCnt?0:this.state.filterCnt}
                 pages={this.state.pageCount}
                 PaginationComponent={(Pagination)}
                 NoDataComponent={()=>null}
                 style={{
                   height: "410px" //
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
             </div>
                {
                    this.state.actionView ?
                    <div className="SchedGrpWrp">
                        <div className="SchedGrpTableToolWrp">
                            <img src={require("../../../Assets/Images/Filter/apply-filter.png")} className="SchedGrpTableToolImg" onClick={()=>this.applyActionFilter()}></img>
                            <img src={require("../../../Assets/Images/Media/collapse-view.png")} className="SchedGrpTableToolImg2" onClick={()=>{this.setState({actionView:false})}}></img>
                        </div>
                        <ReactTable
                            data={grpData}
                            columns={this.grpColumn}
                            loading={this.state.Actionloading}
                            showPagination={false}
                            style={{border:"none",height:"410px"}}
                            className="SchedGrpTableWrp1"
                            getTrGroupProps={(state, rowInfo, column, instance) => { return { onMouseOver: (e, handleOriginal) =>{this.setGroupInf(rowInfo)}}}}
                            TheadComponent={props => null}
                            SubComponent={(rowInfo) =>  <ReactTable
                                data={subdata[rowInfo.index]}
                                columns={this.subColumn}
                                showPagination={false}
                                minRows={10}
                                pageSize={subdata[rowInfo.index].length}
                                className="SchedGrpTableWrp1"
                                TheadComponent={props => null}
                            />}
                        />

                    </div>
                    :
                    <div className="SchedFileVTogWrp" onClick={()=>this.setState({actionView:true})}>
                    <img src={require('../../../Assets/Images/Media/right-arrow.png')} className="SchedBtmArrowImg1"></img>
                    </div>
                }

           </div>
           </div>
        )
    }
}