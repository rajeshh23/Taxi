import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import {Search} from "../../CommomComponents/Filters";
import {getData,postData} from "../../../Services/MainServices";
import Pagination from "../../CommomComponents/Pagination";
import DatePicker from "react-datepicker";
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import moment from "moment";
import beautify from 'xml-beautifier';

var format = require('xml-formatter');

const options= [{name: 'Srigar', id: 1},{name: 'Sam', id: 2}]

   const tabColumns=[
     [
      {accessor:"GROUP_ADS_NAME",lable:"Group Name"},
      {accessor:"LOOP_TYPE",lable:"Loop Type"},
      {accessor:"ORDERLOOP",lable:"Order"},
      {accessor:"Channel",lable:"Channel"},
      {accessor:"ContractId",lable:"Contract Number"},
      {accessor:"TempName",lable:"File Name"},
      {accessor:"DATESTART",lable:"Start Date"},
      {accessor:"DATEEND",lable:"End Date"},
      {accessor:"TIMESTART",lable:"Start Time"},
      {accessor:"TIMEEND",lable:"End Time"},
      {accessor:"LEN",lable:"Length"},
      {accessor:"FULLSCR_NG",lable:"Full Screen"},
      {accessor:"Banner1",lable:"Vertical Banner"},
      {accessor:"Banner2",lable:"Horizontal Banner"},
      {accessor:"Microsite",lable:"Microsite"}
     ],
     [
      {accessor:"GROUP_ADS_NAME",lable:"Group Name"},
      {accessor:"ORDERLOOP",lable:"Order"},
      {accessor:"Channel",lable:"Channel"},
      {accessor:"Banner1",lable:"Vertical Banner"},
      {accessor:"Banner2",lable:"Horizontal Banner"},
      {accessor:"Microsite",lable:"Microsite"},
      {accessor:"DATESTART",lable:"Start Date"},
      {accessor:"DATEEND",lable:"End Date"},
      {accessor:"TIMESTART",lable:"Start Time"},
      {accessor:"TIMEEND",lable:"End Time"},
      {accessor:"LEN",lable:"Length"},
     ]
   ]

   const dropDnStyle={
    multiselectContainer:{width:"70px",height:"7px",backgroundColor:"#A8A8A8"},
    optionContainer:{
      backgroundColor:"#A8A8A8",
      fontFamily:"Arial, Helvetica, sans-serif",
      fontSize:"11px",
      color:"#000000",
    },
    searchBox:{
      backgroundColor:"#A8A8A8",
      fontFamily:"Arial, Helvetica, sans-serif",
      fontSize:"11px",
      color:"#000000"
    },
    option: { // To change css for dropdown options
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      height:'5px'
    }
   }

export default class GlobleIndex extends Component{
  tem=[];
  tabs=["Video Loop","Banner Loop","Indexes"];
  tabsUrl=["GlobalIndex/GetMainLoopData","GlobalIndex/GetBannerLoop","GlobalIndex/GetIndexList"];
    constructor(props){
         super(props);
         this.handleClickOutside = this.handleClickOutside.bind(this);
        if(sessionStorage.getItem("marketId")){
            if(sessionStorage.getItem("marketId")=="MX925"){
                this.tabs = ["Video Loop"];
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
             filterVal:[],
             visibleFilters:[],
             tabIndex:0,
             pageCount:0,
             loading:false,
             xml:"",
             options:[{name: 'Srigar', id: 1},{name: 'Sam', id: 2}],
             indexList:[]
         }
        } 

        componentDidMount(){
          document.addEventListener('mousedown', this.handleClickOutside);
          this.setTab(this.state.tabIndex);
        
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

        gonvertDate(date){
          if(date){
              return moment(date).format("DD-MMM-YYYY HH:mm:ss");
          }
  
      }
        
        setTab(index){
          if(index < 2 && tabColumns && tabColumns[index]){
            this.setState({loading:true})
           let dColumn = [];
           let sColumn=[];
           this.state.filterVal=[];
           tabColumns[index].map((key,index)=>{
                this.state.filterVal.push("");
                let obj;
                if(key.accessor === "DATESTART" || key.accessor === "DATEEND"){
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
                    Filter: (cellInfo) =>
                    <div>{ 
                        this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                        <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                      }
                      </div>
                      
                   }
                }
                dColumn.push(obj);
           });
           this.setState({columns:dColumn,tabIndex:index},()=>{
            getData(this.tabsUrl[this.state.tabIndex])
            .then((res)=>{
              if(res && res.data && res.data.ResponseCollection){
                this.setState({data:res.data.ResponseCollection,loading:false,pageCount:Math.ceil(res.data.TotalcountOfItems/200)})
              }else{
                this.setState({data:[],loading:false})
              }
            })
           });
         
          }else{
            this.setState({tabIndex:index,loading:true},()=>{
              /*getData("GlobalIndex/FetchIndexXmlFile/26727")
              .then((res)=>{
                if(res && res.data && res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                  var formattedXml = format(res.data.ResponseCollection[0].IndexXml);

                  this.setState({xml:formattedXml,loading:false,indexList:res.data.ResponseCollection.IndexList})
                }else{
                  this.setState({data:[],loading:false,indexList:[]})
                }
              })*/

                getData("GlobalIndex/GetIndexList")
                    .then((res)=>{
                        if(res && res.data && res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                            var formattedXml = format(res.data.ResponseCollection[0].IndexXml);
                             console.log("data ",beautify(formattedXml));
                            this.setState({xml:beautify(formattedXml),loading:false,selectedLoppIndex:res.data.ResponseCollection[0].IndexList[0],indexList:res.data.ResponseCollection[0].IndexList});

                        }else{
                            this.setState({data:[],loading:false,indexList:[]})
                        }
                    })
            })
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

    setSelectedIndex(){
        this.setState({loading:true})
        getData("GlobalIndex/FetchIndexXmlFile/"+this.state.selectedLoppIndex)
            .then((res)=>{
                if(res && res.data && res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                    var formattedXml = format(res.data.ResponseCollection[0].IndexXml);
                    console.log("data ",res.data.ResponseCollection);
                    this.setState({xml:beautify(formattedXml),loading:false,});

                }else{
                    this.setState({loading:false})
                }
            })
    }
  
    render(){
        return(
           <div>
                <div className="CabDtTabMainWrp">
                  {
                    this.tabs && this.tabs.map((key,index)=>(
                    <div className={this.state.tabIndex === index ?"CabDtTabWrp1":"CabDtTabWrp"} onClick={()=>this.setTab(index)}>{key}</div>
                    ))
                  }
                </div>
                 <div className="TableBorder">
                {
                  this.state.columnSt &&
                  <ColumnStatus data={this.state.columns} onChange={(e)=>this.setColumn(e,'columns')} class={"SchedColumnHideWrp"} onClose={(e)=>this.resetColmn(e,'columns')}></ColumnStatus>
                }
               <div className="ScheduleTabToolWrp">
               {/* <Multiselect options={this.state.options} style={dropDnStyle} displayValue="name" singleSelect></Multiselect> */}
                 
                  {
                    this.state.tabIndex < 2 ?
                    <div className="ScheduleTableToolCont">
                        {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                        <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                        <img src={require('../../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                        <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                        {/* <img src={require('../../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg"></img>
                        <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img> */}
                        <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg"></img>
                    </div>
                        :
                    <div className="ScheduleTableToolCont1" style={{"width":"37%;","padding-left":"none"}}>
                        <div className="SchedBnrPopImgWrp" style={{height:"30px",border:"none"}}>
                            <div className="leftDiv-md2">
                                <span className="SchedBnrPopTxt" style={{marginLeft:'-1.5%',marginTop:"10px",color:"white"}}>Index number</span>
                            </div>
                            <div className="RightDiv-md2">
                                <select className="SchedDropDwn1" onChange={(e)=>this.setState({selectedLoppIndex:e.target.value},()=>this.setSelectedIndex())} value={this.state.selectedLoppIndex}>

                                    {
                                        this.state.indexList.map((key, index) =>{
                                            return (
                                                <option value={key}>{key}</option>
                                            )
                                        })
                                    }

                                </select>
                            </div>
                            <div className="leftDiv-md2">
                            </div>
                            <div className="RightDiv-md2">
                            </div>


                        </div>
                      </div>
                  }
               </div>

                {
                  this.state.tabIndex < 2 ?
                  <ReactTable
                    loading={this.state.loading}
                    data={this.state.data}
                    columns={this.state.columns}
                    showPagination={false}
                    extradata={this.state}
                    filtered={this.state.filtered}
                    NoDataComponent={()=>null}
                    sortable={false}
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
                 :
                 <div style={{height:"420px",overflow:"auto",color:"white"}}>

                   {  this.state.loading ?
                       <div className="indexloadLoading">
                           <img style={{height:"80px"}} src={require("../../../Assets/Images/kOnzy.gif")}></img>
                       </div>:
                       <textarea id="txtXml" rows="25" cols="140" readonly="readonly" className="indexLoopTextArea" >
                           {this.state.xml}
                       </textarea>


                   }
                 </div>
                }
           </div>
           </div>
        )
    }
}