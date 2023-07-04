import React, { Component, createRef } from 'react';

import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import {
  CollapsibleComponent,
  CollapsibleHead,
  CollapsibleContent
} from "react-collapsible-component";
import { Search, MultiChoice, Radio } from "../../CommomComponents/Filters";
import { getData,postData } from '../../../Services/MainServices';
import Dialog from "../../CommomComponents/Dialog";

import ComCheck from "../../CommomComponents/ComCheck";

/* import GoogleMapReact from 'google-map-react';

import SearchBox from '../../CommomComponents/SearchBox' */



/* import { Map, GoogleApiWrapper } from 'google-maps-react';
import { map } from 'react-dom-factories'; */

import Map from './Map'




const grpStatus = ["Active", "Inactive",];

const mapStyles = {
  width: '70%',
  height: '60%'
};
const handleApiLoaded = (map, maps) => {
  // use map and maps objects
  console.log("map", map);
  console.log("maps", maps);
};
let LOS_ANGELES_CENTER = [34.0522, -118.2437]

export default class GeoZone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grpfilterVal: ["", "", ""],
      grpvisibleFilters: [],
      grpfiltered: [],
      activeData: [],
      inactiveData: [],
      activeLoading: true,
      inactiveLoading: true,
      active: true,
      lat: -1.2884,
      lng: 36.8233,
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
      selectedGeoZone:null,
      selGeoVisible:false,
      iseditGeoData:false,
      geoZoneName:"",
      geozoneStatus:0,
      rightAction:0,
      x:0,
      y:0,
      showPopup:false,
      dlgtitle:null,
      dlgType:"",
      message:"",
      selectedGeoForView:[],
        allowMultiView:false,
        multiViewData:[]

    }
  }

  grpColumn = [

    {
      Header: (cellInfo) => <div className="ScheduleHeaderWrp">
        <div>Name</div>
        {
          this.state.grpfilterVal[1] === "" ?
            <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={() => this.grpsetFilter(cellInfo.column.id, 1)}></img>
            :
            <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={() => this.grpsetFilter(cellInfo.column.id, 1)}></img>
        }
      </div>,
      accessor: 'Name',
      filterable: true,
      Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
      filterMethod: (filter, row) => {
        if (filter.value === "") {
          return true
        }
        if (row[filter.id]) {
          return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >= 0
        }
        return false;
      },
      Filter: (cellInfo) =>
        <div>{
          this.state.grpvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
          <Search onChange={(e) => this.grpcustomFilerChange(e.target.value, cellInfo.column.id, 1)} value={this.state.grpfilterVal[1]}></Search>
        }
        </div>
    },
    {
      Header: (cellInfo) => <div className="ScheduleHeaderWrp">
        <div>Status</div>

      </div>,
      accessor: 'Status',
      filterable: false,
      Cell: props => <span className='number'>{grpStatus[props.value]}</span>, // Custom cell components!


    },

  ];



  componentDidMount() {
    /* const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE&callback=initAutocomplete&libraries=places&v=weekly";
    script.async = true;
    //script.onload = () => this.scriptLoaded();

    document.body.appendChild(script); */
    if(sessionStorage.getItem("marketId")=="DTTU" || sessionStorage.getItem("marketId")=="GLACIER"){
      this.getdttuGeoZoneList('-1');
        this.grpColumn.push({
            Header: (cellInfo) => <div className="ScheduleHeaderWrp">
              <div>Zones to view</div>

            </div>,
            accessor: 'Status',
            filterable: false,
            Cell: (rowInfo) => <ComCheck onClick={(e)=>e.preventDefault()}  onChange={(e)=>{this.setSelectedGeoForView(e,rowInfo.original)}}   containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!


        });
        this.setState({allowMultiView:true});
    }else{
        this.setState({allowMultiView:false});
      getData("Geozone/GetAllGeoZones/0")
            .then(res => {
                if (res.data && res.data.ResponseCollection) {
                    this.setState({ activeData: res.data.ResponseCollection, activeLoading: false })
                } else {
                    this.setState({ activeLoading: false })
                }
            })
        getData("Geozone/GetAllGeoZones/1")
            .then(res => {
                if (res.data && res.data.ResponseCollection) {
                    this.setState({ inactiveData: res.data.ResponseCollection, inactiveLoading: false })
                } else {
                    this.setState({ inactiveLoading: false })
                }
            })
    }

  }

  ontest(){
    console.log("call geozone ontest");
  }


  _onClick = ({ x, y, lat, lng, event }) => console.log(x, y, lat, lng, event)
  loadLocation() {
    console.log("call loadLocation");
    this.setState({ lat: 18.5204, lng: 73.8567 });
    LOS_ANGELES_CENTER = [18.5204, 73.8567]
    /* const maps = google.maps;
    let center = new maps.LatLng(current.lat, current.lng);

    console.log(this.map); */
    //let center = this.props.google.maps.maps.LatLng("18.5204","73.8567");
    //console.log(center)
    /* if (prevProps.google !== this.props.google) {
      this.loadMap();
    } */

    //map.load();
    /* Map.initialCenter=
      {
        lat: this.state.lat,
        lng: this.state.lng
      } */

  }
  setGeoZoneList(val) {
    this.setState({ active: val }, () => this.getGeoZoneList(val));
  }
    setSelectedGeoForView(e,data){
        //let index = this.state.selectedGeoForView.indexOf(data.ID)
        let index = this.state.selectedGeoForView.findIndex(x => x.ID == data.ID);
        if(e && index === -1){
            this.state.selectedGeoForView.push(data)
        }else{
            this.state.selectedGeoForView.splice(index,1)
        }
        this.setState({selGeoVisible:false})
        console.log("selectedGeoForView",this.state.selectedGeoForView);
    }
  getdttuGeoZoneList(val){
      getData("Geozone/GetAllGeoZones/-1")
          .then(res => {
              if (res.data && res.data.ResponseCollection) {
                  this.setState({ activeData: res.data.ResponseCollection, activeLoading: false })
              } else {
                  this.setState({ activeLoading: false })
              }
          })
  }
  getGeoZoneList(val) {
    if (val) {
      getData("Geozone/GetAllGeoZones/0")
        .then(res => {
          if (res.data && res.data.ResponseCollection) {
            this.setState({ activeData: res.data.ResponseCollection, activeLoading: false })
          } else {
            this.setState({ activeLoading: false })
          }
        })
    } else {
      getData("Geozone/GetAllGeoZones/1")
        .then(res => {
          if (res.data && res.data.ResponseCollection) {
            this.setState({ inactiveData: res.data.ResponseCollection, inactiveLoading: false })
          } else {
            this.setState({ inactiveLoading: false })
          }
        })
    }
  }
  grpsetFilter(id, index) {
    this.setState(({ grpvisibleFilters }) => {
      let update = [...grpvisibleFilters];
      const index = update.indexOf(id);
      index < 0 ? update.push(id) : update.splice(index, 1);
      return { grpvisibleFilters: update };
    });
  }

  grpcustomFilerChange(value, accessor, index) {
    let filtered = this.state.grpfiltered;
    let insertNewFilter = 1;
    this.state.grpfilterVal[index] = value
    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) {
            filtered.splice(i, 1);

          } else {
            filter["value"] = value;

            insertNewFilter = 0;
          }

        }
      });
    }

    if (insertNewFilter) {
      filtered.push({ id: accessor, value: value });
    }
    let newFilter = filtered.map((key, index) => {
      let temp1 = Object.assign({}, key);
      return temp1;
    })
    this.setState({ grpfiltered: newFilter });
  }

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });
  };

  addPlace = (place) => {
    this.setState({ places: place });
  };
  updateGeoZoneToDb(){
    console.log("call update geozione");
    console.log("selcted data for ediutr",this.state.selectedGeoZone);
    //let GeoTargetCollectionList = this.state.selectedGeoZone.GeoTargetCollection;
    this.state.selectedGeoZone.GeoTargetCollectionList = this.state.selectedGeoZone.GeoTargetCollection;
    this.state.selectedGeoZone.Name = this.state.geoZoneName;
    this.state.selectedGeoZone.Status = this.state.geozoneStatus;
    postData("Geozone/EditGeoZone",this.state.selectedGeoZone)
        .then(res => {
            if(res.data && res.data.ReturnCode==0){
                 console.log("res.data",res.data);
                 this.getGeoZoneList(true);
                 this.setState({iseditGeoData:false,geozoneStatus:0});
                 let msg = "GeoZone updated Successfully.";
                 this.setState({dlgtitle:"Information",message:msg,dlgType:"information",showPopup:true});
            }
        }); 


  }
  setContextMenu(type){
    this.setState({rightAction:0});
    if(type=="editGeozone"){
      alert("go for edit");
      let gname = this.state.selectedGeoZone.Name;
                        let Status = this.state.selectedGeoZone.Status;
                        this.setState({geoZoneName:gname,geozoneStatus:Status});
                        this.setState({iseditGeoData:true,selGeoVisible:false})
    }else if(type=="deleteGeozone"){
      let gname = this.state.selectedGeoZone.Name;
      let msg = "Are you sure you want to delete the geozone "+gname+". Marking the geozone as deleted will dissassociate all the groups/videos associated with it.";
      this.setState({dlgtitle:"Information",message:msg,dlgType:"deleteGeoZone",showPopup:true});
    }else{
      alert("None");
    }
  }
  deleteSelectedGeoZone(){
    //alert("go for delete");
    let geozoneData;
    if(this.state.selectedGeoZone){
      geozoneData = this.state.selectedGeoZone;
      postData("Geozone/DeleteGeoZone",geozoneData)
        .then(res => {
            if(res.data && res.data.ReturnCode==0){
                 console.log("res.data",res.data);
                 this.getGeoZoneList(true);
                 this.setState({iseditGeoData:false,geozoneStatus:0});
                 let msg = "Geozone delete successfully.";
                 this.setState({dlgtitle:"Information",message:msg,dlgType:"information",showPopup:true});
            }
        }); 

    }
  }

  render() {
    const {
      places, mapApiLoaded, mapInstance, mapApi,
    } = this.state;
    return (
      <div className="GeoZoneMainWrp">
        <div className="GeoZoneMainTableWrp" contextMenu="none" onContextMenu={(e)=> e.preventDefault()}>
        {
                             this.state.rightAction > 0 ?
                                 <div className="actionMenu" style={{top:`${this.state.y}px`,left:`${this.state.x}px`}}>
                                     <ul className="actionUl" style={{"list-style":"none"}}>
                                         <li>
                                             <div style={{padding:"5px"}} onClick={()=>this.setContextMenu("editGeozone")}>Edit Geozones</div>
                                             <div style={{padding:"5px"}} onClick={()=>this.setContextMenu("deleteGeozone")}>Delete Geozones</div>
                                            
                                         </li>
                                     </ul>
                                 </div>:<div></div>


                         }


            {
                sessionStorage.getItem("marketId")=="DTTU" || sessionStorage.getItem("marketId")=="GLACIER" ?
                    <div>
                      <div className="GeoZoneCollapseHead" onClick={() => this.getdttuGeoZoneList(true)}>
                        <span style={{ marginLeft: "5px" }}>Active Geo-Zones</span>

                      </div>
                        {
                            this.state.active &&
                            <div>
                              <div className="GeoZoneCollapseTitle">
                                <div>
                                  <span style={{ marginLeft: "5px" }}>GeoZone :Define Tags</span>
                                </div>
                                <div style={{width:"50%","text-align":"right"}}>
                                  <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>this.setGeoZoneList(true)}></img>
                                </div>

                              </div>
                              <ReactTable
                                  data={this.state.activeData} //this group view Grop grid
                                  columns={this.grpColumn}
                                  loading={this.state.activeLoading}
                                  filtered={this.state.grpfiltered}
                                  showPagination={false}
                                  sortable={false}
                                  minRows={20}
                                  pageSize={this.state.activeData.length}
                                  NoDataComponent={() => null}
                                  style={{
                                      height: "400px"
                                  }}
                                  getTrGroupProps={(state, rowInfo, column, instance) => {
                                      if(rowInfo !== undefined){
                                          return {
                                              onContextMenu: (e) => {
                                                  this.setState({selectedGeoZone:rowInfo.original,rightAction:1, x: e.screenX, y: e.screenY-50});
                                              },
                                              onClick: (e, handleOriginal) =>{
                                                  this.setState({iseditGeoData:false,selectedGeoZone:rowInfo.original,selGeoVisible:false})
                                              },
                                              onDoubleClick:()=>{
                                                  let gname = rowInfo.original.Name;
                                                  let Status = rowInfo.original.Status;
                                                  this.setState({geoZoneName:gname,geozoneStatus:Status});
                                                  this.setState({iseditGeoData:true,selectedGeoZone:rowInfo.original,selGeoVisible:false})

                                              }
                                          }

                                      }
                                  }}
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
                              >

                              </ReactTable>
                            </div>
                        }
                    </div>
                    :
                    <div>
                      <div className="GeoZoneCollapseHead" onClick={() => this.setGeoZoneList(true)}>
                        <span style={{ marginLeft: "5px" }}>Active Geo-Zones</span>

                      </div>
                        {
                            this.state.active &&
                            <div>
                              <div className="GeoZoneCollapseTitle">
                                <div>
                                  <span style={{ marginLeft: "5px" }}>GeoZone :Define Tags</span>
                                </div>
                                <div style={{width:"50%","text-align":"right"}}>
                                  <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>this.setGeoZoneList(true)}></img>
                                </div>

                              </div>
                              <ReactTable
                                  data={this.state.activeData} //this group view Grop grid
                                  columns={this.grpColumn}
                                  loading={this.state.activeLoading}
                                  filtered={this.state.grpfiltered}
                                  showPagination={false}
                                  sortable={false}
                                  minRows={20}
                                  pageSize={this.state.activeData.length}
                                  NoDataComponent={() => null}
                                  style={{
                                      height: "400px"
                                  }}
                                  getTrGroupProps={(state, rowInfo, column, instance) => {
                                      if(rowInfo !== undefined){
                                          return {
                                              onContextMenu: (e) => {
                                                  this.setState({selectedGeoZone:rowInfo.original,rightAction:1, x: e.screenX, y: e.screenY-50});
                                              },
                                              onClick: (e, handleOriginal) =>{
                                                  this.setState({iseditGeoData:false,selectedGeoZone:rowInfo.original,selGeoVisible:true})
                                              },
                                              onDoubleClick:()=>{
                                                  let gname = rowInfo.original.Name;
                                                  let Status = rowInfo.original.Status;
                                                  this.setState({geoZoneName:gname,geozoneStatus:Status});
                                                  this.setState({iseditGeoData:true,selectedGeoZone:rowInfo.original,selGeoVisible:false})

                                              }
                                          }

                                      }
                                  }}
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
                              >

                              </ReactTable>
                            </div>
                        }
                      <div className="GeoZoneCollapseHead" onClick={() => this.setGeoZoneList(false)}>
                        <span style={{ marginLeft: "5px" }}>Inactive Geo-Zones</span>

                      </div>
                        {
                            !this.state.active &&
                            <div>
                              <div className="GeoZoneCollapseTitle"  >
                                <div>
                                  <span style={{ marginLeft: "5px" }}>GeoZone :Define Tags</span>
                                </div>
                                <div  style={{width:"50%","text-align":"right"}}>
                                  <img src={require('../../../Assets/Images/tools/refresh.png')} className="ScheduleToolImg" onClick={()=>this.setGeoZoneList(false)}></img>
                                </div>
                              </div>
                              <ReactTable
                                  data={this.state.inactiveData} //this group view Grop grid
                                  columns={this.grpColumn}
                                  loading={this.state.inactiveLoading}
                                  filtered={this.state.grpfiltered}
                                  showPagination={false}
                                  sortable={false}
                                  minRows={20}
                                  defaultPageSize={this.state.inactiveData.length}
                                  NoDataComponent={() => null}
                                  style={{
                                      height: "400px"
                                  }}
                                  getTrGroupProps={(state, rowInfo, column, instance) => {
                                      if(rowInfo !== undefined){
                                          return {
                                              onContextMenu: (e) => {
                                                  this.setState({selectedGeoZone:rowInfo.original,rightAction:1, x: e.screenX, y: e.screenY-50});
                                              },
                                              onClick: (e, handleOriginal) =>{
                                                  this.setState({iseditGeoData:false,selectedGeoZone:rowInfo.original,selGeoVisible:true})
                                              },
                                              onDoubleClick:()=>{
                                                  let gname = rowInfo.original.Name;
                                                  let Status = rowInfo.original.Status;
                                                  this.setState({geoZoneName:gname,geozoneStatus:Status});
                                                  this.setState({iseditGeoData:true,selectedGeoZone:rowInfo.original,selGeoVisible:false})

                                              }
                                          }

                                      }
                                  }}
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
                              >

                              </ReactTable>
                            </div>
                        }
                    </div>

            }


        </div>
        {
          this.state.showPopup &&
          <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} onOk={()=>{
            this.setState({showPopup:false})
            if(this.state.dlgType == "deleteGeoZone"){
              this.deleteSelectedGeoZone();
            }
           }} onHide={()=>this.setState({showPopup:false})}/>
        }
        {
          this.state.iseditGeoData?
          <div className="geoZoneSaveContaner SchedBnrWrp1">
                        <div className="ForgPassTitle ShedTitle" style={{ color: "white" }}>
                            <div style={{ "width": "96%;" }}>Edit Geo-zone</div>
                        </div>
                        <div classNames="SchedPopBtnWrp">

                            <div>
                                <div style={{ display: "inline-flex" }} className="geoseciondev">
                                    <div style={{ width: "30%" }}>Geo-zone name</div>
                                    <div style={{ width: "2%" }}>:</div>
                                    <div style={{ width: "68%" }}>
                                        <input type="text" id="geozoneName" size="40" value={this.state.geoZoneName} onChange={(e) => this.setState({geoZoneName:e.target.value})} style={{ width: "87%", "background": "#f4f4f4;", border: "solid 1px #c9cbcc;", "border-top": "solid 1px #6d6f70;", color: "#000;", "font-size": "11px;", "font-weight": "bold;", "padding": "5px;" }} />

                                    </div>
                                </div>
                                <div style={{ display: "inline-flex" }} className="geoseciondev">
                                    <div style={{ width: "30%" }}>Geo-zone status</div>
                                    <div style={{ width: "2%" }}>:</div>
                                    <div style={{ width: "68%" }}>
                                        <select id="geozoneStatus" value={this.state.geozoneStatus} onChange={(e)=>{this.setState({geozoneStatus:e.target.value})}} style={{ background: "#f4f4f4;", border: "solid 1px #959899;", "border-bottom": "solid 1px #5e6162;", "border-top": "solid 1px #b7babc;", "font-size": "11px;", "font-weight": "bold;", "padding": "3px;", color: "#000" }}>
                                            <option value="0">Active</option>
                                            <option value="1">Inactive</option>
                                        </select></div>
                                </div>
                               
                                <div style={{ display: "inline-flex" }} className="geoseciondev">
                                    <div style={{ width: "30%" }}></div>
                                    <div style={{ width: "2%" }}></div>
                                    <div className="geosavefooter">
                                        <button onClick={()=>{this.updateGeoZoneToDb()}}>Update</button>
                                        <button onClick={()=>{this.setState({iseditGeoData:false,geozoneStatus:0})}}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
          :
          <Map callback={()=>this.getGeoZoneList(true)} ismultiview={this.state.allowMultiView} multiviewData={this.state.selectedGeoForView} selgeoZonedata={this.state.selectedGeoZone} isplotgeoZone={this.state.selGeoVisible}></Map>
          

        }
        

      </div>
    )
  }
}

/* export default GoogleApiWrapper({
  apiKey: 'AIzaSyB7_MYCPUafhKpDmqFZSGDBWZ0FoH1pkzs'
})(GeoZone); */

