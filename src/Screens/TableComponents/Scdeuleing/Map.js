import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader';
import { Search, MultiChoice, Radio } from "../../CommomComponents/Filters";
import ReactTable from 'react-table';
import { postData } from '../../../Services/MainServices';
import Dialog from "../../CommomComponents/Dialog";


let getPolygonCoords;
let onSelectReactangle;
let onSelectPolygon;
let onConfigure;
let onClearAll;
let map;
var all_overlays = [];
var geoZoneData=[];
//const ColumnCol = ["name","location"];
class Map extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isRectangle:false,
            ismultipoint:true,
            enableGeoSaving:false,
            columns:[],
            geozoneStatus:0,
            enablesavelabe:false,
            geoZoneName:"GeoZone_1",
            showPopup:false,
            dlgtitle:null,
            dlgType:"",
            message:""

        } 
    }
   /*  componentDidMount(){
        let dColumn = [];
        let sColumn=[];
        
        ColumnCol.map((key,index)=>{
            let obj={
             Header: (cellInfo)=><div className="ScheduleHeaderWrp">
             <div>{cellInfo.column.id}</div>
             </div>,
             accessor:key,
             show:true,
            }
            dColumn.push(obj);
       });
       this.setState({columns:dColumn});
    } */
    componentWillReceiveProps({isScriptLoadSucceed}){
        let self = this;
        if (isScriptLoadSucceed) {
            /* var d =document.getElementById("map");
            window.addListener(d,"contextmenu",function(e){
               
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
             }); */

                let initLat = 39.06937;
                let initLng = -46.2321;
                let initZoom=2;
                if(this.props.isplotgeoZone==true){
                    if(this.props.selgeoZonedata && this.props.selgeoZonedata.GeoTargetCollection && this.props.selgeoZonedata.GeoTargetCollection.length>0){
                        var tempArr=[];
                        tempArr =this.props.selgeoZonedata.GeoTargetCollection;
                        initLat = tempArr[0].Latitude;
                        initLng = tempArr[0].Longitude;
                        initZoom = 10;
                    }
                }else{
                    if(this.props.ismultiview==true){
                        //let calzoom = 11;
                        if(this.props.multiviewData && this.props.multiviewData.length>0 && this.props.multiviewData[0].GeoTargetCollection && this.props.multiviewData[0].GeoTargetCollection.length>0){
                            var tempArr=[];
                            console.log("selected lat",)
                            //calzoom = calzoom-this.props.multiviewData.length-1;
                            tempArr =this.props.multiviewData[this.props.multiviewData.length-1].GeoTargetCollection;
                            initLat = tempArr[0].Latitude;
                            initLng = tempArr[0].Longitude;
                            initZoom = 6;
                            console.log("selected lat",initLat)
                            console.log("selected lng",initLng)
                        }
                    }
                }

             let map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: initLat, lng: initLng },
                zoom: initZoom,
                mapTypeId: "roadmap",
              });
              
              if(this.props.isplotgeoZone==true){
                
                console.log("this selceted geozone data",this.props.selgeoZonedata)
                const triangleCoords = [];
                let initLat;
                let initLng;
                if(this.props.selgeoZonedata && this.props.selgeoZonedata.GeoTargetCollection && this.props.selgeoZonedata.GeoTargetCollection.length>0){
                    var tempArr=[];
                    tempArr =this.props.selgeoZonedata.GeoTargetCollection;
                    initLat = tempArr[0].Latitude;
                    initLng = tempArr[0].Longitude;
                    for(var i=0;i<tempArr.length;i++){
                        triangleCoords.push({ lat: tempArr[i].Latitude, lng: tempArr[i].Longitude})
                    }
                    /* this.props.selgeoZonedata.GeoTargetCollection.forEach(function(item){
                        triangleCoords.push({ lat: item.Latitude, lng: item.Longitude})
                    }) */
                } 

               
                /*  const triangleCoords = [
                    { lat: 29.008158, lng: 76.5412 },
                    { lat: 29.008158, lng: 77.197634 },
                    { lat: 28.719513, lng: 77.197634 },
                    { lat: 28.719513, lng: 76.5412 },
                  ];  */
                  console.log("triangleCoords is",triangleCoords);
                  setTimeout(function(){
                    const bermudaTriangle = new window.google.maps.Polygon({
                        paths: triangleCoords,
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: "#FF0000",
                        fillOpacity: 0.35,
                      });
                      bermudaTriangle.setMap(map); 
                  },500)
                  
              }else{
                  if(this.props.ismultiview==true){
                      if(this.props.multiviewData && this.props.multiviewData.length>0){
                          this.props.multiviewData.forEach(function (item) {
                              let multitriangleCoords = [];
                              let initLat;
                              let initLng;
                              if(item.GeoTargetCollection && item.GeoTargetCollection.length>0){
                                  let tempArr =item.GeoTargetCollection;
                                  for(var i=0;i<tempArr.length;i++){
                                      multitriangleCoords.push({ lat: tempArr[i].Latitude, lng: tempArr[i].Longitude})
                                  }
                                  let multibermudaTriangle = new window.google.maps.Polygon({
                                      paths: multitriangleCoords,
                                      strokeColor: "#FF0000",
                                      strokeOpacity: 0.8,
                                      strokeWeight: 2,
                                      fillColor: "#FF0000",
                                      fillOpacity: 0.35,
                                  });
                                  multibermudaTriangle.setMap(map);
                              }
                          })
                      }
                  }
              }
              var selectedShape;
              // Create the search box and link it to the UI element.
              const input = document.getElementById("pac-input");
              const searchBox = new window.google.maps.places.SearchBox(input);
              //map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(input);
              // Bias the SearchBox results towards current map's viewport.
              map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
              });
              
              let markers = [];
              // Listen for the event fired when the user selects a prediction and retrieve
              // more details for that place.
              searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();
            
                if (places.length == 0) {
                  return;
                }
                // Clear out the old markers.
                markers.forEach((marker) => {
                  marker.setMap(null);
                });
                markers = [];
                // For each place, get the icon, name and location.
                const bounds = new window.google.maps.LatLngBounds();
                places.forEach((place) => {
                  if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                  }
                  const icon = {
                    url: place.icon,
                    size: new window.google.maps.Size(71, 71),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(17, 34),
                    scaledSize: new window.google.maps.Size(25, 25),
                  };
                  // Create a marker for each place.
                  markers.push(
                    new window.google.maps.Marker({
                      map,
                      icon,
                      title: place.name,
                      position: place.geometry.location,
                    })
                  );
            
                  if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                  } else {
                    bounds.extend(place.geometry.location);
                  }
                });
                map.fitBounds(bounds);
              });

             const drawingManager = new window.google.maps.drawing.DrawingManager({
                drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
                drawingControl: false,
                drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        //window.google.maps.drawing.OverlayType.MARKER,
                        //window.google.maps.drawing.OverlayType.CIRCLE,
                        window.google.maps.drawing.OverlayType.POLYGON,
                        //window.google.maps.drawing.OverlayType.POLYLINE,
                        window.google.maps.drawing.OverlayType.RECTANGLE,
                    ],
                },
            
                markerOptions: {
                    icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                },
                circleOptions: {
                    fillColor: "#ffff00",
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1,
                },
            });
            drawingManager.setMap(map);
           
            this.getPolygonCoords =function(){
                console.log("callgetPolygonCoords")
            }
           window.google.maps.event.addListener(drawingManager, 'overlaycomplete', function(polygon) {
             console.log("polygon is",polygon); 
             all_overlays.push(polygon);
             if (polygon.type != window.google.maps.drawing.OverlayType.MARKER) {
                var newShape = polygon.overlay;
                newShape.type = polygon.type;
                
                  /* window.google.maps.event.addListener(newShape, 'contextmenu', function(e) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return false;
                  }); */
                 window.google.maps.event.addListener(newShape, 'click', function() {
                    setSelection(newShape);
                  });
                  window.google.maps.event.addListener(newShape, 'rightclick', function(e) {
                    //self.state.enablesavelabe=true;
                    self.setState({enablesavelabe:true});
                    //alert("click right",e);
                    //e.stopImmediatePropagation();
                    //e.preventDefault();
                    //return false;
                    console.log(e)
                    console.log(e.domEvent.clientX)
                    var x = e.domEvent.clientX;
                    var y = e.domEvent.clientY;
                    var savediv = document.getElementById("saveGeoLableDiv");
                    savediv.style.left = x+'px';
                    savediv.style.top = y+'px';
                    /*savediv.style.position = "absolute";
                    savediv.style.left = x+'px';
                    savediv.style.top = y+'px'; */
                    
                  });
                  setSelection(newShape);
                if (polygon.type == "polygon") {
                    var coordinatesArray = polygon.overlay.getPath().getArray();
                    coordinatesArray.forEach(function (item,index) {
                        console.log(item.lat())
                        console.log(item.toUrlValue(5))
                        var i = parseInt(index+1)
                        var obj={
                            name:"point"+i,
                            location:{lat:item.lat(),lng:item.lng()}
                        }
                        geoZoneData.push(obj);
                    });
                    console.log(geoZoneData);
                    drawingManager.setDrawingMode(null);
 
                } else {
                    if (polygon.type == "rectangle") {
                        var bounds = polygon.overlay.bounds;
                        var SW = bounds.getSouthWest();
                        var NE = bounds.getNorthEast();
                        console.log(SW.lat(),SW.lng());
                        console.log(NE.lat(),NE.lng());
                        
                        var obj={
                            name:"point1",
                            location:{lat:SW.lat(),lng:SW.lng()}
                        }
                        geoZoneData.push(obj);
                        var obj={
                            name:"point2",
                            location:{lat:SW.lat(),lng:NE.lng()}
                        }
                        geoZoneData.push(obj);
                        var obj={
                            name:"point3",
                            location:{lat:NE.lat(),lng:NE.lng()}
                        }
                        geoZoneData.push(obj);
                        var obj={
                            name:"point4",
                            location:{lat:NE.lat(),lng:SW.lng()}
                        }
                        geoZoneData.push(obj);
                        
                       
                        
                         console.log(geoZoneData);

                        drawingManager.setDrawingMode(null);
                    }
                } 
             }
            }); 
            //this.setState({drawingManager:drawingManager});
            this.onSelectReactangle=function(){
                console.log("call onSelectReactangle");
                drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.RECTANGLE);
                this.setState({isRectangle:true,ismultipoint:false});
                if (selectedShape) {
                    selectedShape.setMap(null);
                  }
                  geoZoneData=[];
            }
            this.onSelectPolygon=function(){
                console.log("call onSelectPolygon");
                drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
                this.setState({isRectangle:false,ismultipoint:true});
                if (selectedShape) {
                    selectedShape.setMap(null);
                  }
                  geoZoneData=[]
            }
            this.onConfigure=function(){
                console.log("call onConfigure");
                drawingManager.setMap(map);
                if(this.state.isRectangle==true){
                    drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.RECTANGLE);
                }else{
                    drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
                }
                geoZoneData=[];
                
            }
            this.onClearAll=function(){
                console.log("call onClearAll");
                if (selectedShape) {
                    selectedShape.setMap(null);
                  }
                  drawingManager.setMap(null);
                  geoZoneData=[]
            }
            function clearSelection() {
                if (selectedShape) {
                  selectedShape.setEditable(false);
                  selectedShape = null;
                }
              }
              function setSelection(shape) {
                clearSelection();
                selectedShape = shape;
                shape.setEditable(true);
              }
            

            
        }
        else{
            //alert("script not loaded")
        }

        
    }
    /* onSelectMultiPoint(){
        console.log("call onSelectReactangle");
       this.state.drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
       
    }
    onSelectReactangle(){
        console.log("call onSelectReactangle");
       this.state.drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.RECTANGLE);
       
       
        
    } */

    saveGeoZoneToDb(){
         let GeoTargetCollection=[];
         let obj =new Object();
         obj.Created=new Date();
         obj.ID=0;
         obj.UserID=1;
         obj.ParentID=1;
         obj.Status=this.state.geozoneStatus;
         obj.Name=this.state.geoZoneName;
         obj.GeozoneAssociationID=0;
         obj.Operation=0;
         obj.GroupName=null;
         obj.UploadFile_ID=0;
         obj.GROUP_ADS_ID=0;
         obj.Inclusion=0;
        if(geoZoneData && geoZoneData.length>0){
            geoZoneData.forEach(function(item){
                
                let targetObj={
                    Created:new Date(),
                    ID:0,
                    GeoZoneID:0,
                    Latitude:item.location.lat,
                    Longitude:item.location.lng
                }
                GeoTargetCollection.push(targetObj);
            })
        }
        obj.GeoTargetCollection = null;
        obj.GeoTargetCollectionList=GeoTargetCollection;

        console.log("Save object is",obj);

        postData("Geozone/AddGeoZone",obj)
        .then(res => {
            if(res.data){
                 console.log("res.data",res.data);
                 let msg;
                 if(res.data.ReturnCode==4){
                     msg = "Geo-zone with the same name exists in the system.";
                     this.setState({dlgtitle:"Information",message:msg,dlgType:"information",showPopup:true});
                 }else{
                     msg = "Geo-zone information saved successfully.";
                     this.setState({dlgtitle:"Information",message:msg,dlgType:"information",showPopup:true});
                     this.props.callback()
                     this.onClearAll();
                 }
                 
                 

            }
        }); 

        //this.onClearAll();
        this.setState({enableGeoSaving:false,geozoneStatus:0,enablesavelabe:false});
        
    }

    render(){
        return(
            

            <div className="GeoZoneMainMapWrp" contextMenu="none" onContextMenu={(e)=> e.preventDefault()}>
          <div className="GeoZoneMapTopWrp">
            <div className="GeoZoneMapTopChild">
              <span style={{ marginLeft: "5px" }}>Define Geozones to be used for targeting</span>
              <div className="GeoZoneRadioWrp">
                <input onClick={()=>this.onSelectReactangle()} type="radio" name="pointSelection"  />
                <span onClick={()=>this.onSelectReactangle()} style={{ marginLeft: "3px", marginRight: "20px" }}>Regular Geozone</span>
                <input onClick={()=>this.onSelectPolygon()} type="radio" name="pointSelection"  />
                <span onClick={()=>this.onSelectPolygon()}  style={{ marginLeft: "3px" }}>Multipoint Geozone</span>
              </div>
            </div>
            <div className="GeoZoneMapTopChild1">
              <span style={{ marginLeft: "5px" }}>Map to address</span>
              <input  id="pac-input" className="controls"  type="text" placeholder="Search Box" style={{ marginLeft: "5px", width: "35%" }}></input>
              
              {/*<div  className="GeoZoneMapAddrWrp">
                <span>Map it</span>
              </div>*/}
              <div className="GeoZoneRadioWrp1">
                {/*<span onClick={()=>this.onClearAll()} style={{ marginLeft: "3px" }}>Clear Markers</span>
                <span onClick={()=>this.onClearAll()} style={{ marginLeft: "3px" }}>Clear All</span>
                <span onClick={()=>this.onConfigure()} style={{ marginLeft: "3px" }}>Configur</span>
                <span  style={{ marginLeft: "3px" }}>Help</span>*/}
                  <a href="javascript: void(0);" className="a-btn-common" onClick={()=>this.onClearAll()}>Clear Markers</a>
                  <a href="javascript: void(0);" className="a-btn-common" onClick={()=>this.onClearAll()}>Clear All</a>
                  <a href="javascript: void(0);" className="a-btn-common" onClick={()=>this.onConfigure()}>Configure</a>
                  <a href="javascript: void(0);" className="a-btn-common" >Help</a>
              </div>
            </div>
          </div>
          <div className="GeoZoneMapDetails"  style={{ width: "100%",height:"100%" }}>

          <div id="map" style={{height: "87%"}}></div>
               {
                   this.state.enablesavelabe &&
                   <div id="saveGeoLableDiv" onClick={()=>{this.setState({enableGeoSaving:true,enablesavelabe:false})}} className="geosaveLableDiv" style={{position:"absolute",left:"0px"}}>Save GeoZone</div>
               }
               
          </div>
          {
              this.state.enableGeoSaving &&
                    <div className="geoZoneSaveContaner SchedBnrWrp1">
                        <div className="ForgPassTitle ShedTitle" style={{ color: "white" }}>
                            <div style={{ "width": "96%;" }}>Save Geo-zone</div>
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
                                <div style={{ display: "inline-flex",height:"200px" }} className="geoseciondev">
                                <table class="config-table-settings" cellpadding="0" cellspacing="0" width="87%">
                                    <tr>
                                        <th className="geoTh" style={{width:"90px"}} >Name</th>
                                        <th className="geoTh">Location</th>
                                    </tr>
                                    {
                                                              geoZoneData.map((key, index) =>{
                                                                  return (
                                                                    <tr>
                                                                    <td>{key.name}</td>
                                                                    <td>({key.location.lat}, {key.location.lng})</td>
                                                                   </tr>
                                                                  )
                                                              })

                                                          }
                                    
                                </table>
                                    
                                </div>
                                <div style={{ display: "inline-flex" }} className="geoseciondev">
                                    <div style={{ width: "30%" }}></div>
                                    <div style={{ width: "2%" }}></div>
                                    <div className="geosavefooter">
                                        <button onClick={()=>{this.saveGeoZoneToDb()}}>Save</button>
                                        <button onClick={()=>{this.setState({enableGeoSaving:false,geozoneStatus:0})}}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
          }
          {
          this.state.showPopup &&
          <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} onOk={()=>{
            this.setState({showPopup:false})
           }} onHide={()=>this.setState({showPopup:false})}/>
        }
        </div>


        

        )
    }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyDFJmsnugZoc3_7kcM7FmL1NUXX8IzwMJc&callback=initAutocomplete&libraries=places,drawing&v=weekly"]
)(Map)