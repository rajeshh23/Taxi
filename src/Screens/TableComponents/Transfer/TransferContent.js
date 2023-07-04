import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import {Search} from "../../CommomComponents/Filters";
import {getData,postData} from "../../../Services/MainServices";
import Pagination from "../../CommomComponents/Pagination";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

let columns = [{accessor:"CABNUMBER",lable:"Cab Number"},{accessor:"FileName",lable:"File Name"},{accessor:"DateStart",lable:"Start Date"},{accessor:"DateEnd",lable:"End Date"},{accessor:"Size",lable:"File Size"}]



export default class TransferContent extends Component{
  tem=[];
    constructor(props){
         super(props);
         this.handleClickOutside = this.handleClickOutside.bind(this);
        if(sessionStorage.getItem("marketId")){
            if(sessionStorage.getItem("marketId")=="MX925"){
                columns = [
                    {accessor:"CABNUMBER",lable:"Cab Number"},
                    {accessor:"FileName",lable:"File Name"},
                    {accessor:"DateStart",lable:"Start Date"},
                    {accessor:"DateEnd",lable:"End Date"},
                    {accessor:"Size",lable:"File Size"},
                    {accessor:"UnitKey",lable:"Unit Key"},
                    {accessor:"CCCODE1",lable:"Client CODE"}
                ]
            }else if(sessionStorage.getItem("marketId")=="DTTU" || sessionStorage.getItem("marketId")=="GLACIER"){
              columns = [
                {accessor:"CABNUMBER",lable:"Cab Number"},
                {accessor:"IPAddress",lable:"IP Address"},
                {accessor:"FileName",lable:"File Name"},
                {accessor:"DateStart",lable:"Start Date"},
                {accessor:"DateEnd",lable:"End Date"},
                {accessor:"Size",lable:"File Size"},

            ]

            }
        }
         this.state={
            columns:[],
            data:[],
            columnSt:false,
            filtered:[],
            sty:{width:"30px",height:"0px"},
            filter:-1,
            filterVal:[],
            visibleFilters:[],
            loading:true,
            pageCount:0,
            filterCnt:0,
            totalCnt:0,
            strDate:moment(new Date().setDate(new Date().getDate() - 1)),//"01/"+moment().format("DD")+"/"+moment().format("YYYY"),
            endDate:new Date(),
             sortOption:[],
            dataObj:{
              "CABNUMBER":"",
              "CCCODE1":"",
              "FILENAME":"",
              "LogStatus":0,
              "PrId":0,
              "RowCountPerPage":50,
              "SortColumn":"",
              "SortOrder":0,
              "UnitKey":null
          },
         }
        }

        componentDidMount(){
          document.addEventListener('mousedown', this.handleClickOutside);
          let dColumn = [];
          let sColumn=[];
          this.state.filterVal=[];
          columns.map((key,index)=>{
               this.state.filterVal.push("")
               let obj={
                Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                <div>{key.lable}</div>
                    <div style={{display:"flex",marginLeft:"auto"}}>
                        <img src={require('../../../Assets/Images/Cab/sort.png')} className="ScheduleheadFilt1" onClick={()=>this.setSort(cellInfo.column.id,index)}></img>
                        {
                            this.state.filterVal[index] === ""?
                                <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                                :
                                <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                        }
                    </div>
                </div>,
                accessor:key.accessor,
                show:true,
                filterable:true,
                Filter: (cellInfo) =>
                <div>{
                    this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]}></Search>
                  }
                  </div>

               }
               dColumn.push(obj);
          });
          this.setState({columns:dColumn},()=>{
            this.refReactTable.fireFetchData();
          });
        }

        componentWillUnmount() {
          document.removeEventListener('mousedown', this.handleClickOutside);
      }

    setSort(accessor,index){
        let sorted = this.state.sortOption;
        let check=0;
        let order =0;
        if (sorted.length) {
            sorted.forEach((sort, i) => {
                if (sort["id"] === accessor) {
                    if(sort.hasOwnProperty("desc")){
                        order =1;
                    }
                    sorted.splice(i, 1);
                    check=1;
                }
            });
        }
        sorted=[];

        if(check === 0){
            sorted.push({ id: accessor, desc: true });
            this.state.dataObj["SortColumn"]=accessor;
            this.state.dataObj["SortOrder"]=1;
        }
        if(check === 1 && order === 1){
            sorted.push({ id: accessor, asc: true });
            this.state.dataObj["SortColumn"]=accessor;
            this.state.dataObj["SortOrder"]=0;
        }else if(check === 1){
            sorted.push({ id: accessor, desc: true });
            this.state.dataObj["SortColumn"]=accessor;
            this.state.dataObj["SortOrder"]=1;
        }
        let newSorted = sorted.map((key,index)=>{
            let temp1 = Object.assign({}, key);
            return temp1;
        })
        this.setState({ sortOption: newSorted,loading:true });
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

         customFilerChange(value,accessor,index,column){
          let filtered = this.state.filtered;
          let insertNewFilter = 1;
          this.state.filterVal[index]=value
          this.state.dataObj[column]=value;
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
          this.setState({ filtered: newFilter});
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

    exportTransferToExcel(){
        console.log("this filtered",this.state.filtered);
        let strurl ="";
        let SortColumn="SENDFILEID";
        let SortOrder="1";
        let strFromDate=moment(this.state.strDate).format("MM/DD/YYYY");
        let strToDate=moment(this.state.endDate).format("MM/DD/YYYY");
        let PageNo="1";
        let RowCountPerPage=this.state.filterCnt;
        let FILENAME="";
        let CABNUMBER="";
        let Clientcode="";
        let hiddenColumns="";
        if(this.state.filtered && this.state.filtered.length>0){
            for(var i=0;i<this.state.filtered.length;i++){
                if(this.state.filtered[i].id=="CABNUMBER" && this.state.filtered[i].value){
                    CABNUMBER=this.state.filtered[i].value;
                }
                if(this.state.filtered[i].id=="FileName" && this.state.filtered[i].value){
                    FILENAME=this.state.filtered[i].value;
                }
                /*if(this.state.filtered[i].id=="DATED" && this.state.filtered[i].value){
                    strFromDate=moment(this.state.filtered[i].value).format("MM/DD/YYYY");
                }
                if(this.state.filtered[i].id=="ExpDate" && this.state.filtered[i].value){
                    strToDate=moment(this.state.filtered[i].value).format("MM/DD/YYYY");
                }*/
                if(this.state.strDate){
                  strFromDate=moment(this.state.strDate).format("MM/DD/YYYY");
                }
                if(this.state.endDate){
                  strToDate=moment(this.state.endDate).format("MM/DD/YYYY");
                }
            }
        }
        console.log("strFromDate1",strFromDate);

        console.log("strToDate1",strToDate);

        let url = sessionStorage.getItem("mktUrl")+"ExporttransferContent.aspx?SortColumn="+SortColumn+"&SortOrder="+SortOrder+
            "&strFromDate="+strFromDate+"&strToDate="+strToDate+"&PageNo="+PageNo+
            "&RowCountPerPage="+RowCountPerPage+"&FILENAME="+FILENAME+
            "&CABNUMBER="+CABNUMBER+"&Clientcode="+Clientcode+"&hiddenColumns=";

        console.log("export url is",url);

        window.open(url);
    }

    refreshData(){
        console.log("call refreshData")
        this.setState({data:[],loading:true});
        postData("TransferLog/Fetch",this.state.dataObj)
            .then((res)=>{

              if(res && res.data && res.data.ResponseCollection){

                    if(res.data.ResponseCollection && res.data.ResponseCollection.length>0){
                        res.data.ResponseCollection.forEach(function (item) {
                            let fileSize =parseFloat(item.Size);
                            fileSize = fileSize / 1024;
                            //fileSize = Math.Round(fileSize, 2);
                            fileSize = fileSize.toFixed(2);
                            item.Size = fileSize + " KB";
                            if (fileSize >= 1024)
                            {
                                fileSize = fileSize / 1024;
                                fileSize = fileSize.toFixed(2);
                                item.Size = fileSize + "MB";
                            }

                        })
                    }

                    this.setState({data:res.data.ResponseCollection,pageCount:Math.ceil(res.data.FilteredCount/50),totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false})
                }else{
                    this.setState({data:[],loading:false})
                }
            })
    }



    render(){
        return(
           <div>
                 <div className="TableBorder">
                {
                  this.state.columnSt &&
                  <ColumnStatus data={this.state.columns} onChange={(e)=>this.setColumn(e,'columns')} class={"SchedColumnHideWrp"} onClose={(e)=>this.resetColmn(e,'columns')}></ColumnStatus>
                }
               <div className="ScheduleTabToolWrp">
               <div className='SchedHeadTxt'>From</div>
                   <DatePicker selected={new Date(this.state.strDate)}   onChange={(date)=>this.setState({strDate:date})} wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                   <div className='SchedHeadTxt'>To</div>
                   <DatePicker selected={this.state.endDate}  onChange={(date)=>this.setState({endDate:date})} wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                    <img src={require('../../../Assets/Images/Filter/apply-filter.png')} className="ScheduleupldImg" onClick={()=> this.setState({loading:true},()=>{this.refReactTable.fireFetchData()})}></img>
                   <div className="ScheduleTableToolCont">
                       <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg" onClick={(e)=>this.exportTransferToExcel()} ></img>
                       <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={(e)=>this.refreshData()}></img>
                   </div>
               </div>
               <ReactTable
                 ref={(refReactTable) => {this.refReactTable = refReactTable;}}
                 loading={this.state.loading}
                 data={this.state.data}
                 columns={this.state.columns}
                 PaginationComponent={(Pagination)}
                 defaultPageSize={50}
                 pages={this.state.pageCount}
                 totlaItems={this.state.totalCnt}
                 filterCnt={this.state.filterCnt}
                 filtered={this.state.filtered}
                 sortable={false}
                 sorted={this.state.sortOption}
                 NoDataComponent={() => null}
                 style={{
                   height: "430px" //
                 }}
                 onPageChange={()=>this.setState({loading:true})}
                 manual
                 onFetchData={(state, instance) => {
                    this.state.dataObj["strFromDate"]=moment(this.state.strDate).format("MM-DD-YYYY");
                    this.state.dataObj[ "strToDate"]=this.state.endDate;
                   this.state.dataObj["PageNo"]=instance.state.page+1;
                   postData("TransferLog/Fetch",this.state.dataObj)
                   .then((res)=>{
                     if(res && res.data && res.data.ResponseCollection){

                         if(res.data.ResponseCollection && res.data.ResponseCollection.length>0){
                             res.data.ResponseCollection.forEach(function (item) {
                                 let fileSize =parseFloat(item.Size);
                                 fileSize = fileSize / 1024;
                                 //fileSize = Math.Round(fileSize, 2);
                                 fileSize = fileSize.toFixed(2);
                                 item.Size = fileSize + " KB";
                                 if (fileSize >= 1024)
                                 {
                                     fileSize = fileSize / 1024;
                                     fileSize = fileSize.toFixed(2);
                                     item.Size = fileSize + "MB";
                                 }

                             })
                         }

                         this.setState({data:res.data.ResponseCollection,pageCount:Math.ceil(res.data.FilteredCount/50),totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,loading:false})
                     }else{
                       this.setState({data:[],loading:false})
                     }
                   })
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
           </div>
        )
    }
}