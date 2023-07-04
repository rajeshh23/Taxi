import React, {Component,createRef} from 'react';

import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import {
    CollapsibleComponent,
    CollapsibleHead,
    CollapsibleContent
} from "react-collapsible-component";
import {Search,MultiChoice,Radio} from "../../CommomComponents/Filters";
import { getData } from '../../../Services/MainServices';

import GoogleMapReact from 'google-map-react';

import SearchBox from '../../CommomComponents/SearchBox'



/* import { Map, GoogleApiWrapper } from 'google-maps-react';
import { map } from 'react-dom-factories'; */




const grpStatus=["Active","Inactive",];

const mapStyles = {
  width: '70%',
  height: '60%'
};
const handleApiLoaded = (map, maps) => {
  // use map and maps objects
  console.log("map",map);
  console.log("maps",maps);
};
let LOS_ANGELES_CENTER = [34.0522, -118.2437]

export default  class GeoZone extends Component{
    constructor(props){
        super(props);

        this.state={
            grpfilterVal:["","",""],
            grpvisibleFilters:[],
            grpfiltered:[],
            activeData:[],
            inactiveData:[],
            activeLoading:true,
            inactiveLoading:true,
            active:true,
            lat:-1.2884,
            lng:36.8233,
            mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: [],
        }
    }

    grpColumn=[
       
        {
          Header: (cellInfo)=><div className="ScheduleHeaderWrp">
          <div>Name</div>
          {
                    this.state.grpfilterVal[1] === ""?
                    <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.grpsetFilter(cellInfo.column.id,1)}></img>
                    :
                    <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.grpsetFilter(cellInfo.column.id,1)}></img>
                }
          </div>,
          accessor: 'Name',
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
        },
        {
          Header: (cellInfo)=><div className="ScheduleHeaderWrp">
          <div>Status</div>
         
          </div>,
          accessor: 'Status',
          filterable:false,
          Cell: props => <span className='number'>{grpStatus[props.value]}</span>, // Custom cell components!
        
       
        },
      
      ];

      componentDidMount(){
        
        getData("Geozone/GetAllGeoZones/0")
          .then(res=>{
             if(res.data && res.data.ResponseCollection){
                 this.setState({activeData:res.data.ResponseCollection,activeLoading:false})
             }else{
                 this.setState({activeLoading:false})
             }
          })
          getData("Geozone/GetAllGeoZones/1")
          .then(res=>{
            if(res.data && res.data.ResponseCollection){
                this.setState({inactiveData:res.data.ResponseCollection,inactiveLoading:false})
            }else{
                this.setState({inactiveLoading:false})
            }
          })
      }

      _onClick = ({x, y, lat, lng, event}) => console.log(x, y, lat, lng, event)
      loadLocation(){
        console.log("call loadLocation");
        this.setState({lat:18.5204,lng:73.8567});
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
      setGeoZoneList(val){
          this.setState({active:val},()=>this.getGeoZoneList(val));
      }
      getGeoZoneList(val){
        if(val){
          getData("Geozone/GetAllGeoZones/0")
          .then(res=>{
             if(res.data && res.data.ResponseCollection){
                 this.setState({activeData:res.data.ResponseCollection,activeLoading:false})
             }else{
                 this.setState({activeLoading:false})
             }
          })
        }else{
          getData("Geozone/GetAllGeoZones/1")
          .then(res=>{
            if(res.data && res.data.ResponseCollection){
                this.setState({inactiveData:res.data.ResponseCollection,inactiveLoading:false})
            }else{
                this.setState({inactiveLoading:false})
            }
          })
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

    render(){
      const {
        places, mapApiLoaded, mapInstance, mapApi,
      } = this.state;  
      return(
            <div className="GeoZoneMainWrp">
                <div className="GeoZoneMainTableWrp">
                     <div className="GeoZoneCollapseHead" onClick={()=>this.setGeoZoneList(true)}>
                         <span style={{marginLeft:"5px"}}>Active Geo-Zones</span>
                     </div>
                     {
                         this.state.active &&
                         <div>
                         <div className="GeoZoneCollapseTitle">
                             <span style={{marginLeft:"5px"}}>GeoZone :Define Tags</span>
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
                         NoDataComponent={()=>null}
                         style={{
                             height:"400px"
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
                     <div className="GeoZoneCollapseHead" onClick={()=>this.setGeoZoneList(false)}>
                         <span style={{marginLeft:"5px"}}>Inactive Geo-Zones</span>
                     </div>
                     {
                         !this.state.active &&
                         <div>
                         <div className="GeoZoneCollapseTitle"  >
                             <span style={{marginLeft:"5px"}}>GeoZone :Define Tags</span>
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
                         NoDataComponent={()=>null}
                         style={{
                             height:"400px"
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
                <div className="GeoZoneMainMapWrp">
              <div className="GeoZoneMapTopWrp">
                <div className="GeoZoneMapTopChild">
                  <span style={{ marginLeft: "5px" }}>Define Geozones to be used for targeting</span>
                  <div className="GeoZoneRadioWrp">
                    <Radio></Radio>
                    <span style={{ marginLeft: "3px", marginRight: "20px" }}>Regular Geozone</span>
                    <Radio s></Radio>
                    <span style={{ marginLeft: "3px" }}>Multipoint Geozone</span>
                  </div>
                </div>
                <div className="GeoZoneMapTopChild1">
                  <span style={{ marginLeft: "5px" }}>Map to address</span>
                  {/* <input style={{ marginLeft: "5px", width: "35%" }}></input> */}
                  {mapApiLoaded && <SearchBox map={mapInstance} mapApi={mapApi} addplace={this.addPlace} />}
                  <div onClick={()=>this.loadLocation()} className="GeoZoneMapAddrWrp">
                    <span>Map it</span>
                  </div>
                  <div className="GeoZoneRadioWrp1">
                    <span style={{ marginLeft: "3px" }}>Clear Markers</span>
                    <span style={{ marginLeft: "3px" }}>Clear All</span>
                    <span style={{ marginLeft: "3px" }}>Configur</span>
                    <span style={{ marginLeft: "3px" }}>Help</span>
                  </div>
                </div>
              </div>
              <div className="GeoZoneMapDetails" style={{width:"70%"}}>
                          
             {/*  <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={
          {
            lat: this.state.lat,
            lng: this.state.lng
          }
        }
      /> */}
      
      <GoogleMapReact
  bootstrapURLKeys={{ key: "AIzaSyB7_MYCPUafhKpDmqFZSGDBWZ0FoH1pkzs",libraries:['places', 'geometry', 'drawing', 'visualization'] }}
  defaultCenter={LOS_ANGELES_CENTER}
  defaultZoom={3}
  yesIWantToUseGoogleMapApiInternals
  onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
  onClick={this._onClick} 
  
>
  
</GoogleMapReact>
              </div>
                </div>
                
            </div>
        )
    }
}

/* export default GoogleApiWrapper({
  apiKey: 'AIzaSyB7_MYCPUafhKpDmqFZSGDBWZ0FoH1pkzs'
})(GeoZone); */

