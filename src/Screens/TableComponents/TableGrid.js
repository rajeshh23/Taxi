import React, {Component} from 'react';
import '../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../Assets/react-table.css';
import ColumnStatus from "../CommomComponents/ColumnStatus";

const data = [
    {
       "File Name":"Glac5-Zelle_15.mp4",
        Groups:"GLAC 5",
        Channel:"ALL",
        "Wide Banner":"",
        "Wing Banner":"",
        "GeoZones Included":"",
        "GeoZones Excluded":"",
         Network:"None",
         "Alter Image":""
    },
    {
        "File Name":"Glac5-Zelle_15.mp4",
         Groups:"GLAC 4",
         Channel:"ALL",
         "Wide Banner":"",
         "Wing Banner":"",
         "GeoZones Included":"",
         "GeoZones Excluded":"",
          Network:"None",
          "Alter Image":""
     },
     {
        "File Name":"Glac5-Zelle_15.mp4",
         Groups:"GLAC 5",
         Channel:"ALL",
         "Wide Banner":"",
         "Wing Banner":"",
         "GeoZones Included":"",
         "GeoZones Excluded":"",
          Network:"None",
          "Alter Image":""
     },
     {
        "File Name":"Glac5-Zelle_15.mp4",
         Groups:"GLAC 5",
         Channel:"ALL",
         "Wide Banner":"",
         "Wing Banner":"",
         "GeoZones Included":"",
         "GeoZones Excluded":"",
          Network:"None",
          "Alter Image":""
     },  
   ]
 
  

const grpData=[
  {
    "Group Name":"All",
    Status:"Active"
  },
  {
    "Group Name":"VMS",
    Status:"Active"
  },
  {
    "Group Name":"All",
    Status:"Active"
  },
]

const grpColumn=[
  {
    Header: ()=><div className="ScheduleHeaderWrp">
    <div>Group Name</div>
    <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
    </div>,
    accessor: 'Group Name',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  },
  {
    Header: ()=><div className="ScheduleHeaderWrp">
    <div>Status</div>
    <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
    </div>,
    accessor: 'Status',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }
]

const switchcolumns = [{
  Header: ()=><div className="ScheduleHeaderWrp">
      <div>File Name</div>
      <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>,
  accessor: 'File Name',
  show:true,
  // filterMethod:  (filter, row) => customOptionsFilterMethod(filter, row),
  // Filter: () => {
  //     return(
  //         <div style={{width:'100%',backgroundColor:'red'}}>xyz</div>  
  //     )
  // },
}, 
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>Groups</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>,
  accessor: 'Groups',
  show:true,
  Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
}, 
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>Channel</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>,
  accessor: 'Channel', // Custom value accessors!
  show:true,
},
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>Wide Banner</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>,   
  accessor: "wide Banner",
  show:true,
},
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>Wing Banner</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>, // Custom header components!
  accessor: "Wing Banner",
  show:true,
},
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>GeoZones Included</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>, // Custom header components!
  accessor: "GeoZones Included",
  show:true,
},
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>GeoZones Excluded</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>,
  accessor: "GeoZones Excluded",
  show:true,
},
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>Network</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>,
  accessor: "Network",
  show:true,
},
{
  Header: ()=><div className="ScheduleHeaderWrp">
  <div>Alter Image</div>
  <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
  </div>,
  accessor: "Alter Image",
  show:true,
}
]

const ColumnCol=["File Name","Groups","Channel","Wide Banner","Wing Banner","GeoZones Included","GeoZones Excluded","Network","Alter Image"]

export default class TableGrid extends Component{
  tem=[];
    constructor(props){
         super(props);
         this.state={
             group:false,
             groupName:"ALL",
             columns:[],
             switchcolumns:switchcolumns,
             columnSt:false,
             grpColumn:grpColumn,
             filtered:[],
             sty:{width:"30px",height:"0px"},
             filter:-1,
         }
        }       
  

      componentDidMount(){
        console.log('efhoweihoie==============')
        // var abc = [{id: "File Name", value: "h"}]
        // setTimeout(()=>this.setState({filtered:abc}),500)
      }

      // componentDidMount(){
      //   console.log("TableGrid=============")
      //   let dColumn = [];
      //   ColumnCol.map((key,index)=>{
      //        let obj={
      //         Header: (cellInfo)=><div className="ScheduleHeaderWrp">
      //         <div>{cellInfo.column.id}</div>
      //         <img src={require('../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id)}></img>
      //         <div className={this.state.filter!==cellInfo.column.id?"SchedHedFiltWrp":"SchedHedFiltWrp1"}>
      //               <input className="SchedFiltInptWrp" onChange={(e)=>this.customFilerChange(cellInfo.column.id,e.target.value)}></input>
      //            </div>
      //         </div>,
      //         accessor:key,
      //         show:true,
      //        }
      //        dColumn.push(obj);
      //   });
      //   console.log("============================="+dColumn);
      //   this.setState({columns:dColumn});

      // }
      
      setFilter(column){
        if(this.state.filter === -1){
         this.setState({filter:column})
        }else{
         this.setState({filter:-1})
        }
       }

       customFilerChange(accessor,value){
        let filtered = this.state.filtered;
        let insertNewFilter = 1;
    
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

      setGroupInf(rowInfo){
          if(rowInfo){
            this.setState({groupName:rowInfo.original["Group Name"]})
          }
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

 
  
    render(){
        return(
           <div>
             {
             !this.state.group?
             <div className="TableBorder">
                {
                  this.state.columnSt &&
                  <ColumnStatus data={this.state.columns} onChange={(e)=>this.setColumn(e,'columns')} class={"SchedColumnHideWrp"} onClose={(e)=>this.resetColmn(e,'columns')}></ColumnStatus>
                }
               <div className="ScheduleTabToolWrp">
                   <img src={require('../../Assets/Images/Upload/upload-btn.png')} className="ScheduleupldImg"></img>
                   <img src={require('../../Assets/Images/Upload/schedule-btn.png')} className="ScheduleupldImg"></img>
                   <div className="ScheduleTableToolCont">
                       <img src={require('../../Assets/Images/tools/change-perspective.png')} className="ScheduleToolImg" onClick={()=>this.setState({group:true,columnSt:false})}></img>
                       <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                      {/* <img src={require('../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                       <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                       <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg"></img>
                       <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                       <img src={require('../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg"></img>
                   </div>
               </div>
                <ReactTable
                    data={data}
                    columns={this.state.columns}
                    showPagination={false}
                    extradata={this.state}
                    filtered={this.state.filtered}
                    sortable={false}
                 />
           </div>
           :
           <div className="SchedGrpMainWrp">
             <div className="SchedGrpTaleWrp">
                {
                  this.state.columnSt &&
                  <ColumnStatus data={this.state.switchcolumns} onChange={(e)=>this.setColumn(e,'switchcolumns')} class={"SchedGrpColSt"} onClose={(e)=>this.resetColmn(e,'switchcolumns')}></ColumnStatus>
                }
                <div className="ScheduleTabToolWrp">
                      <img src={require('../../Assets/Images/Upload/upload-btn.png')} className="ScheduleupldImg"></img>
                      <img src={require('../../Assets/Images/Upload/schedule-btn.png')} className="ScheduleupldImg"></img>
                      <div className="ScheduleTableToolCont">
                          <img src={require('../../Assets/Images/tools/change-perspective.png')} className="ScheduleToolImg" onClick={()=>this.setState({group:false,columnSt:false})}></img>
                          <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          {/*<img src={require('../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                          <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../Assets/Images/tools/show-coloumn.png')} className="ScheduleToolImg" onClick={()=>this.setState({columnSt:!this.state.columnSt})}></img>
                          <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg"></img>
                          <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                          <img src={require('../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg"></img>
                      </div>
                  </div>
                    <ReactTable
                        data={data}
                        columns={this.state.switchcolumns}
                        showPagination={false}
                        minRows={17}
                    />
             </div>
             <div className="SchedGrpWrp">
               <div className="SchedGrpTableToolWrp">
                 <img src={require("../../Assets/Images/Group/add-over.png")} className="SchedGrpTableToolImg"></img>
                 <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg"></img>
                 <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../Assets/Images/Group/change-status.png")} className="SchedGrpTableToolImg"></img>
                 <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../Assets/Images/Group/house_icon_20px.gif")} className="SchedGrpTableToolImg"></img>
                 <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../Assets/Images/Group/add-over.png")} className="SchedGrpTableToolImg"></img>
                 <img src={require("../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img>
                 <img src={require("../../Assets/Images/tools/refresh.png")} className="SchedGrpTableToolImg"></img>
               </div>
               <ReactTable
                          data={grpData}
                          columns={grpColumn}
                          showPagination={false}
                          className="SchedGrpTableWrp1"
                          getTrGroupProps={(state, rowInfo, column, instance) => { return { onMouseOver: (e, handleOriginal) =>{this.setGroupInf(rowInfo)}}}}
                  />
                <div className="ScedGrpInfoMainWrp">
             <div className="SchedGrpInfoChild1">{this.state.groupName}</div>
                  <div className="SchedGrpInfoChild1">
                    <div className="SchedGrpInfoChild2">Videos:0</div>
                    <div className="SchedGrpInfoChild2">Buttons:0</div>
                    <div className="SchedGrpInfoChild2">Banners:0</div>
                  </div>
                  <div className="SchedGrpInfoChild1">
                  <div className="SchedGrpInfoChild2">Associated Cabs:0</div>
                    <div className="SchedGrpInfoChild2">Restricted Cabs:0</div>
                  </div>
                </div>
             </div>
           </div>
           }
           </div>
        )
    }
}