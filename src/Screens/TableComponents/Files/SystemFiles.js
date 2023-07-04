import React, { Component } from "react";
import axios from "axios";
import "../../../Assets/StyleSheet.css";
import ReactTable from "react-table";
import "../../../Assets/react-table.css";
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import { getData, postData, deletData } from "../../../Services/MainServices";
import Pagination from "../../CommomComponents/Pagination";
import NewPagination from "../../CommomComponents/NewPagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, MultiChoice } from "../../CommomComponents/Filters";
import ComCheck from "../../CommomComponents/ComCheck";
import Dialog from "../../CommomComponents/Dialog";
import { Line } from "rc-progress";
import BaseUrl from "../../../Services/BaseUrl";
import moment from "moment";
import { ExportCSV } from "../../../Utility/ExportCSV.js";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const options = [
  { name: "Swedish", value: "sv" },
  { name: "English", value: "en" },
];
const unitMode = ["Demo/Lab", "Production"];
const testoptions = [
  { id: 1, label: "John" },
  { id: 2, label: "Miles" },
  { id: 3, label: "Charles" },
  { id: 4, label: "Herbie" },
];
let unitType = ["M10", "TREK"];
const UnitMode = ["Lab/Demo", "Production"];
const statusCnst = ["Active", "Inactive"];
const subTabs = ["File Details", "Associated Cabs", "Reports"];
const priorityCnt = ["", "Low", "Medium", "High"];
const subTabsUrl = [
  "",
  "ScheduleRelease/FetchReleaseAssociatedCabs/",
  "Phase/FetchAssociatedReport/",
];

const tabColumns = [
  [
    { accessor: "FileName", lable: "File Name" },
    { accessor: "Description", lable: "Description" },
    { accessor: "ReadMeFileName", lable: "ReadMeFileName" },
    { accessor: "ExpDate", lable: "Expiry Date" },
    { accessor: "Dated", lable: "Dated" },
    { accessor: "FileSize", lable: "File Size" },
    { accessor: "UnitTYpe1", lable: "Unit Type" },
  ],
];

let subTabColumns = [
  [
    [
      { accessor: "ComponentName", lable: "Component" },
      { accessor: "Version", lable: "versions" },
    ],
    [{ accessor: "SuccessCriteria", lable: "criteria" }],
  ],
  [
    { accessor: "CABNUMBER", lable: "Cab Number" },
    { accessor: "UNITKEY", lable: "IMSI" },
    { accessor: "IPAddress", lable: "IP Address" },
    { accessor: "DIM", lable: "DIM" },
    { accessor: "PIM", lable: "PIM" },
    { accessor: "CCCODE1", lable: "Client Code" },
    { accessor: "WatchDog", lable: "Watch Dog" },
    { accessor: "TaxiRideService", lable: "Taxi Ride" },
    { accessor: "PIMReplica", lable: "PIM Replica" },
    { accessor: "iTapp", lable: "ITapp" },
    { accessor: "Horton", lable: "Horton" },
    { accessor: "Map", lable: "Map" },
    { accessor: "LastUpdate", lable: "Last Update" },
    { accessor: "UnitType", lable: "UnitType" },
    { accessor: "Current", lable: "Status" },
    { accessor: "LastIndex", lable: "Unit Index" },
    { accessor: "IND", lable: "Latest Index" },
    { accessor: "Verunit", lable: "Unit Version" },
    { accessor: "CLIENTNAME", lable: "Client Name" },
    { accessor: "Vx820", lable: "VX820" },
    { accessor: "UnitMode", lable: "Unit Mode" },
    { accessor: "ident", lable: "Ident" },
    { accessor: "MeterType", lable: "Meter Type" },
    { accessor: "TermType", lable: "Terminal Type" },
    { accessor: "GBversion", lable: "GBversion" },
    { accessor: "MUA", lable: "MUA" },
    { accessor: "PWI", lable: "PWI" },
    { accessor: "PWL", lable: "PWL" },
    { accessor: "PWSSL", lable: "PWSSL" },
    { accessor: "PWSNF", lable: "PWSNF" },
  ],
  [
    { accessor: "unitkey", lable: "IMSI" },
    { accessor: "cabnumber", lable: "Cab Number" },
    { accessor: "ipaddress", lable: "IP Address" },
    /*{
          Header: ()=><div className="ScheduleHeaderWrp">
              <div>status</div>
              <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"></img>
          </div>,
          accessor: 'status',
          Cell: rowInfo => <span className='number'>{rowInfo.original.status}</span> // Custom cell components!
      },*/
    { accessor: "status", lable: "Status" },
  ],
];

let scheduleCol = [
  { accessor: "CABNUMBER", lable: "Cab Number" },
  { accessor: "UNITKEY", lable: "IMSI" },
  { accessor: "IPAddress", lable: "IP Address" },
  { accessor: "DIM", lable: "DIM" },
  { accessor: "PIM", lable: "PIM" },
  { accessor: "CLIENTCODE", lable: "Client Code" },
  { accessor: "WatchDog", lable: "Watch Dog" },
  { accessor: "TaxiRideService", lable: "Taxi Ride" },
  { accessor: "PIMReplica", lable: "PIM Replica" },
  { accessor: "iTapp", lable: "ITapp" },
];
let associateCabsCol = [
  { accessor: "CABNUMBER", lable: "Cab Number" },
  { accessor: "UNITKEY", lable: "IMSI" },
  { accessor: "IPAddress", lable: "IP Address" },
  { accessor: "DIM", lable: "DIM" },
  { accessor: "PIM", lable: "PIM" },
  { accessor: "CCCODE1", lable: "Client Code" },
  { accessor: "WatchDog", lable: "Watch Dog" },
  { accessor: "TaxiRideService", lable: "Taxi Ride" },
  { accessor: "PIMReplica", lable: "PIM Replica" },
  { accessor: "iTapp", lable: "ITapp" },
  { accessor: "Horton", lable: "Horton" },
  { accessor: "Map", lable: "Map" },
  { accessor: "LastUpdate", lable: "Last Update" },
  { accessor: "UnitType", lable: "UnitType" },
  { accessor: "Current", lable: "Status" },
  { accessor: "LastIndex", lable: "Unit Index" },
  { accessor: "IND", lable: "Latest Index" },
  { accessor: "Verunit", lable: "Unit Version" },
  { accessor: "CLIENTNAME", lable: "Client Name" },
  { accessor: "Vx820", lable: "VX820" },
  { accessor: "UnitMode", lable: "Unit Mode" },
  { accessor: "ident", lable: "Ident" },
  { accessor: "MeterType", lable: "Meter Type" },
  { accessor: "TermType", lable: "Terminal Type" },
  { accessor: "GBversion", lable: "GBversion" },
  { accessor: "MUA", lable: "MUA" },
  { accessor: "PWI", lable: "PWI" },
  { accessor: "PWL", lable: "PWL" },
  { accessor: "PWSSL", lable: "PWSSL" },
  { accessor: "PWSNF", lable: "PWSNF" },
];

const grpData = [
  {
    "Group Name": "All",
    Status: "Active",
  },
  {
    "Group Name": "VMS",
    Status: "Active",
  },
  {
    "Group Name": "All",
    Status: "Active",
  },
];

const subdata = [
  [{ id: "0" }, { id: "0" }, { id: "0" }, { id: "0" }],
  [{ id: "1" }, { id: "1" }, { id: "1" }, { id: "1" }],
];

const cabStatus = ["Lost", "Current"];

export default class SystemFiles extends Component {
  rowClick = false;
  doubleClick = false;
  sysetmSelected = 0;
  tem = [];
  tabs = ["System Files", "Release Management"];
  myInterval;
  myTimer = null;
  listOption = [];
  ClientlistOption = [];
  SysFilelistOption = [];
  cabObj = {};
  upldCabObj = {};
  allowedSysFileType = ".zip";
  allowedRelNoteFileType = ".txt";
  timer = null;
  dataObj = {
    iTapp: null,
    IPAddress: null,
    CabNumber: "",
    UnitKey: null,
    PIM: null,
    CCCODE1: null,
    TermType: null,
    GBVersion: null,
    ClientName: null,
    DIM: null,
    Status: null,
    FilterUnitTypeList: null, //["TaxiTopNYC"],///this is multi choice
    strLastUpdate: null,
    VerunitArr: null, ///this is multi choice
  };
  grpColumn = [
    {
      Header: () => (
        <div className="ScheduleHeaderWrp">
          <div>Group Name</div>
          <img
            src={require("../../../Assets/Images/Filter/filter.png")}
            className="ScheduleheadFilt"
          ></img>
        </div>
      ),
      accessor: "Name",
      Cell: (rowInfo) => (
        <div className="SystFlColContainer">
          <span className="number">{rowInfo.original.Name}</span>
          <div className="SystGrpRowImgWrp">
            <img
              src={require("../../../Assets/Images/Group/file.png")}
              className="StatGrpFileImg1"
              onClick={() =>
                this.scheduleRelease("Report", rowInfo.original.ID)
              }
            ></img>
            <img
              src={require("../../../Assets/Images/System/run.png")}
              className="SystTableToolImg"
              onClick={() =>
                this.scheduleRelease("Schedule", rowInfo.original.ID)
              }
            ></img>
            <img
              src={require("../../../Assets/Images/Group/add-over.png")}
              className="SystTableToolImg2"
              onClick={() => this.openAddPhasePopUp("Add Phase")}
            ></img>
          </div>
        </div>
      ), // Custom cell components!
    },
  ];

  subColumn = [
    {
      Header: "",
      accessor: "Name",
      Cell: (rowInfo) => (
        <div className="SystFlColContainer">
          <span className="number">{rowInfo.original.Name}</span>
          {rowInfo.original.Status === 1 ? (
            <div className="SystGrpRowImgWrp">
              <img
                src={
                  require("../../../Assets/Images/System/active.PNG")
                }
                className="StatGrpFileImg1"
              ></img>
            </div>
          ) : (
            <div className="SystGrpRowImgWrp">
              <img
                src={
                  require("../../../Assets/Images/System/inActive.PNG")
                }
                className="StatGrpFileImg1"
              ></img>
              <img
                src={
                  require("../../../Assets/Images/Group/delete-over.png")
                    
                }
                className="StatGrpFileImg1"
                onClick={() => this.deletePhase(rowInfo.original)}
              ></img>
            </div>
          )}
        </div>
      ),
    },
  ];

  verColumn = [
    {
      Header: (cellInfo) => (
        <div className="ScheduleHeaderWrp">
          <div>Component Name</div>
        </div>
      ),
      accessor: "ComponentName",
      show: true,
    },
    {
      Header: (cellInfo) => (
        <div className="ScheduleHeaderWrp">
          <div>Version</div>
        </div>
      ),
      accessor: "Version",
      show: true,
    },
  ];

  crtColumn = [
    {
      Header: (cellInfo) => (
        <div className="ScheduleHeaderWrp">
          <div>#</div>
        </div>
      ),
      show: true,
      Cell: (rowInfo) => (
        <ComCheck
          onChange={(e) => this.selectCriteria(rowInfo.original)}
          containerStyle={"ComCheckMainWrp"}
          tickStyle={"SchedCheckTick"}
        ></ComCheck>
      ),
      width: 25,
    },
    {
      Header: (cellInfo) => (
        <div className="ScheduleHeaderWrp">
          <div>Criteria</div>
        </div>
      ),
      accessor: "SuccessCriteria",
      show: true,
    },
  ];

  crtColumn1 = [
    {
      Header: (cellInfo) => (
        <div className="ScheduleHeaderWrp">
          <div>#</div>
        </div>
      ),
      show: true,
      Cell: (rowInfo) => (
        <ComCheck
          onChange={(e) => this.selectCriteria1(e, rowInfo.original)}
          checked={
            this.state.selectedCriteriaArr.findIndex(
              (x) => x.ID === rowInfo.original.ID
            ) >= 0
              ? true
              : false
          }
          containerStyle={"ComCheckMainWrp"}
          tickStyle={"SchedCheckTick"}
        ></ComCheck>
      ),
      width: 25,
    },
    {
      Header: (cellInfo) => (
        <div className="ScheduleHeaderWrp">
          <div>Criteria</div>
        </div>
      ),
      accessor: "SuccessCriteria",
      show: true,
    },
  ];
  successRsp;
  marketid;
  constructor(props) {
    super(props);
    this.myReportsRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    if (sessionStorage.getItem("marketId")) {
      if (sessionStorage.getItem("marketId") == "MX925") {
        unitType = ["MX"];
        this.marketid = "MX925";
        this.allowedSysFileType = ".tgz";
        associateCabsCol = [
          { accessor: "IPAddress", lable: "IP Address" },

          { accessor: "UNITKEY", lable: "IMSI" },
          { accessor: "CABNUMBER", lable: "Cab Number" },
          { accessor: "LastUpdate", lable: "Last Update" },
          { accessor: "UnitType", lable: "UnitType" },
          { accessor: "Current", lable: "Status" },
          { accessor: "CCCODE1", lable: "Client Code" },
          { accessor: "iTapp", lable: "ITapp" },
          { accessor: "PIMReplica", lable: "PIM Replica" },
          { accessor: "Map", lable: "Map" },
          { accessor: "TaxiRideService", lable: "NT Ride Service" },
          { accessor: "WatchDog", lable: "Watch Dog" },
          { accessor: "OperatingSystem", lable: "OperatingSystem" },
          { accessor: "UnitMode", lable: "Unit Mode" },
          { accessor: "PIM", lable: "PIM" },
          { accessor: "DIM", lable: "DIM" },
          { accessor: "LastIndex", lable: "Unit Index" },
          { accessor: "IND", lable: "Latest Index" },
          { accessor: "CLIENTNAME", lable: "Client Name" },
        ];
        scheduleCol = [
          { accessor: "IPAddress", lable: "IP Address" },

          { accessor: "UNITKEY", lable: "IMSI" },
          { accessor: "CABNUMBER", lable: "Cab Number" },
          { accessor: "LastUpdate", lable: "Last Update" },
          { accessor: "UnitType", lable: "UnitType" },
          { accessor: "Current", lable: "Status" },
          { accessor: "CCCODE1", lable: "Client Code" },
          { accessor: "iTapp", lable: "ITapp" },
          { accessor: "PIMReplica", lable: "PIM Replica" },
          { accessor: "Map", lable: "Map" },
          { accessor: "TaxiRideService", lable: "NT Ride Service" },
          { accessor: "WatchDog", lable: "Watch Dog" },
          { accessor: "UnitMode", lable: "Unit Mode" },
        ];
        subTabColumns[1] = [
          { accessor: "IPAddress", lable: "IP Address" },

          { accessor: "UNITKEY", lable: "IMSI" },
          { accessor: "CABNUMBER", lable: "Cab Number" },
          { accessor: "LastUpdate", lable: "Last Update" },
          { accessor: "UnitType", lable: "UnitType" },
          { accessor: "Current", lable: "Status" },
          { accessor: "CCCODE1", lable: "Client Code" },
          { accessor: "iTapp", lable: "ITapp" },
          { accessor: "PIMReplica", lable: "PIM Replica" },
          { accessor: "Map", lable: "Map" },
          { accessor: "TaxiRideService", lable: "NT Ride Service" },
          { accessor: "WatchDog", lable: "Watch Dog" },
          { accessor: "OperatingSystem", lable: "OperatingSystem" },
          { accessor: "UnitMode", lable: "Unit Mode" },
          { accessor: "PIM", lable: "PIM" },
          { accessor: "DIM", lable: "DIM" },
          { accessor: "LastIndex", lable: "Unit Index" },
          { accessor: "IND", lable: "Latest Index" },
          { accessor: "CLIENTNAME", lable: "Client Name" },
        ];
      } else if (sessionStorage.getItem("marketId") == "DTTU") {
        subTabColumns[1] = [
          { accessor: "CABNUMBER", lable: "Cab Number" },
          { accessor: "UNITKEY", lable: "IMSI" },
          { accessor: "IPAddress", lable: "IP Address" },
          { accessor: "DIM", lable: "DIM" },
          { accessor: "CCCODE1", lable: "Client Code" },
          { accessor: "WatchDog", lable: "Watch Dog" },
          { accessor: "TaxiRideService", lable: "Taxi Ride" },
          { accessor: "PIMReplica", lable: "PIM Replica" },
          { accessor: "iTapp", lable: "ITapp" },
          { accessor: "MUA", lable: "MUA" },
          { accessor: "Map", lable: "Map" },
          { accessor: "LastUpdate", lable: "Last Updated" },
          { accessor: "UnitType", lable: "UnitType" },
          { accessor: "Current", lable: "Status" },
          { accessor: "LastIndex", lable: "Unit Index" },
          { accessor: "IND", lable: "Latest Index" },
          { accessor: "Verunit", lable: "Unit Version" },
          { accessor: "CLIENTNAME", lable: "Client Name" },
          { accessor: "Vx820", lable: "Vx820" },
          { accessor: "UnitMode", lable: "Unit Mode" },
          { accessor: "ident", lable: "Ident" },
          { accessor: "MeterType", lable: "Meter Type" },
          { accessor: "TermType", lable: "Terminal Type" },
          { accessor: "GBversion", lable: "GBversion" },
          { accessor: "PWI", lable: "PWI" },
          { accessor: "PWL", lable: "PWL" },
          { accessor: "PWSSL", lable: "PWSSL" },
          { accessor: "PWSNF", lable: "PWSNF" },
        ];
        associateCabsCol = [
          { accessor: "CABNUMBER", lable: "Cab Number" },
          { accessor: "UNITKEY", lable: "IMSI" },
          { accessor: "IPAddress", lable: "IP Address" },
          { accessor: "DIM", lable: "DIM" },
          { accessor: "CCCODE1", lable: "Client Code" },
          { accessor: "WatchDog", lable: "Watch Dog" },
          { accessor: "TaxiRideService", lable: "Taxi Ride" },
          { accessor: "PIMReplica", lable: "PIM Replica" },
          { accessor: "iTapp", lable: "ITapp" },
          { accessor: "MUA", lable: "MUA" },
          { accessor: "Map", lable: "Map" },
          { accessor: "LastUpdate", lable: "Last Updated" },
          { accessor: "UnitType", lable: "UnitType" },
          { accessor: "Current", lable: "Status" },
          { accessor: "LastIndex", lable: "Unit Index" },
          { accessor: "IND", lable: "Latest Index" },
          { accessor: "Verunit", lable: "Unit Version" },
          { accessor: "CLIENTNAME", lable: "Client Name" },
          { accessor: "Vx820", lable: "Vx820" },
          { accessor: "UnitMode", lable: "Unit Mode" },
          { accessor: "ident", lable: "Ident" },
          { accessor: "MeterType", lable: "Meter Type" },
          { accessor: "TermType", lable: "Terminal Type" },
          { accessor: "GBversion", lable: "GBversion" },
          { accessor: "PWI", lable: "PWI" },
          { accessor: "PWL", lable: "PWL" },
          { accessor: "PWSSL", lable: "PWSSL" },
          { accessor: "PWSNF", lable: "PWSNF" },
        ];
        unitType = ["M10", "TREK"];
        this.marketid = "DTTU";
      } else if (sessionStorage.getItem("marketId") == "GLACIER") {
        unitType = ["M10", "TREK"];
        this.marketid = "GLACIER";
      } else {
        unitType = ["M10", "TREK"];
        this.marketid = "NY";
      }
    }
    this.myRef = React.createRef();
    this.state = {
      columns: [],
      data: [],
      columnSt: false,
      filtered: [],
      sty: { width: "30px", height: "0px" },
      filter: -1,
      tabIndex: 0,
      loading: true,
      filterVal: [],
      visibleFilters: [],
      addCabVisibleFilters: [],
      message: "",
      dlgtitle: "",
      dlgType: "",
      dlgEnable: false,
      deleteFiles: [],
      upload: false,
      systFile: [],
      relFile: [],
      desc: "",
      endDate: new Date(),
      priority: "3",
      uType: [],
      systProg: false,
      systProgCnt: 0,
      relUpload: true,
      relProg: false,
      relProgCnt: 0,
      subTabIndex: 0,
      grpageCount: 0,
      filterCnt: 0,
      grfilterCnt: 0,
      grtotalCnt: 0,
      totalCnt: 0,
      vColumn: [],
      crColumn: [],
      releaseData: [],
      fileIndex: 0,
      addFile: false,
      relName: "",
      systName: "",
      strDate: new Date(),
      strEndDate: new Date(),
      addType: "",
      strHour: "0",
      strMin: "0",
      status: "1",
      childIndex: 0,
      relId: -1,
      phaseId: -1,
      cabUrl: "",
      addCab: false,
      sucUpld: false,
      crtIndex: 0,
      crtData: [],
      cabdata: [],
      cabId: [],
      cabCount: 0,
      phaseIndex: 0,
      systId: "",
      sysFileVersionData: [],
      selectedReleaseData: [],
      selectedPhaseData: [],
      phaseSelected: false,
      selected: null,
      rightAction: 0,
      disbleRelease: true,
      x: 0,
      y: 0,
      isSysfileSchedule: false,
      ScheduleColumns: [],
      ScheduleCabList: [],
      isSysFileForEdit: false,
      selectedRowData: null,
      releaseIndex: 0,
      selectedSysFile: [{ FileName: "E_checkVersion1232233.zip", id: 1049 }],
      releaseSelectedindex: -0,
      phaseSelectedindex: -1,
      availableCabsColumns: [],
      page: 0,
      pageCount: 0,
      dataObj: this.dataObj,
      cabInfoLoading: false,
      uploadVal: false,
      Mx925SYSVersionInfo: [],
      ClientCodeData: [],
      exportFileName: "associatedcabs",
      selectedCriteriaArr: [],
      editSucessCrt: false,
      editSucessCheck: [],
      sortOption: [],
      upldSortOption: [],
      schedLoading: false,
      ClientID: "",
      isAsset: false,
      assetType: [],
      Version: "",
      startIndex: 0,
      count: 0,
      criteria: [],
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.setTab(this.state.tabIndex);
    this.fetchComponent();
    // this.fetchClientCode();
    this.fetchGroupCode();
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  selectCriteria(data) {
    console.log(data);
    var tempArr = this.state.selectedCriteriaArr;
    var index = tempArr.findIndex((x) => x.ID == data.ID);
    if (index >= 0) {
      tempArr.splice(index, 1);
    } else {
      tempArr.push(data);
    }
    this.setState({ selectedCriteriaArr: tempArr });
    console.log("ok", this.state.selectedCriteriaArr);
  }
  selectCriteria1(e, data) {
    console.log(data);
    var tempArr = this.state.selectedCriteriaArr;
    var index = tempArr.findIndex((x) => x.ID == data.ID);
    if (e == false && index >= 0) {
      tempArr.splice(index, 1);
    } else if (e === true && index === -1) {
      tempArr.push(data);
    }
    this.setState({ selectedCriteriaArr: tempArr });
    console.log("ok", this.state.selectedCriteriaArr);
  }

  setTab(index) {
    this.state.cabId = [];
    if (index === 0 && tabColumns && tabColumns[index]) {
      this.setState({ loading: true });
      let dColumn = [];
      let sColumn = [];
      this.state.filterVal = [];
      this.state.visibleFilters = [];
      this.state.filtered = [];
      let obj = {
        Header: "#",
        Cell: (rowInfo) => (
          <ComCheck
            onChange={(e) => this.setDelete(rowInfo.original.FileID)}
            containerStyle={"ComCheckMainWrp"}
            tickStyle={"SchedCheckTick"}
          ></ComCheck>
        ), // Custom cell components!
        width: 25,
      };
      dColumn.push(obj);
      tabColumns[index].map((key, index) => {
        this.state.filterVal.push("");
        let obj;
        if (key.accessor === "UnitTYpe1") {
          obj = {
            Header: (cellInfo) => (
              <div>
                <div className="ScheduleHeaderWrp">
                  <div>{key.lable}</div>
                  {this.state.filterVal[index] === "" ? (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter_active.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 12,
                    marginTop: "12px",
                  }}
                >
                  {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                    0 && (
                    <Search
                      onChange={(e) =>
                        this.customFilerChange(
                          e.target.value,
                          cellInfo.column.id,
                          index
                        )
                      }
                      value={this.state.filterVal[index]}
                    ></Search>
                  )}
                </div>
              </div>
            ),
            accessor: key.accessor,
            show: true,
            filterable: true,
            filterMethod: (filter, row) => {
              if (filter.value === "") {
                return true;
              }
              if (row[filter.id]) {
                if (isNaN(row[filter.id])) {
                  return (
                    String(
                      row[filter.id]
                        .toUpperCase()
                        .indexOf(filter.value.toUpperCase())
                    ) >= 0
                  );
                } else {
                  return (
                    String(row[filter.id].toString().indexOf(filter.value)) >= 0
                  );
                }
              }
              return false;
            },
            // Filter: (cellInfo) =>
            // <div>{
            //     this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
            //     <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
            //   }
            //   </div>,
            //Cell:(props)=><span>{unitType[props.value]}</span>
            Cell: (props) => <span>{props.value}</span>,
          };
        } else if (
          key.accessor === "FileName" ||
          key.accessor === "ReadMeFileName"
        ) {
          obj = {
            Header: (cellInfo) => (
              <div>
                <div className="ScheduleHeaderWrp">
                  <div>{key.lable}</div>
                  {this.state.filterVal[index] === "" ? (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter_active.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 12,
                    marginTop: "12px",
                  }}
                >
                  {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                    0 && (
                    <Search
                      onChange={(e) =>
                        this.customFilerChange(
                          e.target.value,
                          cellInfo.column.id,
                          index
                        )
                      }
                      value={this.state.filterVal[index]}
                    ></Search>
                  )}
                </div>
              </div>
            ),
            accessor: key.accessor,
            show: true,
            filterable: true,
            width: 350,
            width: 300,
            filterMethod: (filter, row) => {
              if (filter.value === "") {
                return true;
              }
              if (row[filter.id]) {
                if (isNaN(row[filter.id])) {
                  return (
                    String(
                      row[filter.id]
                        .toUpperCase()
                        .indexOf(filter.value.toUpperCase())
                    ) >= 0
                  );
                } else {
                  return (
                    String(row[filter.id].toString().indexOf(filter.value)) >= 0
                  );
                }
              }
              return false;
            },
            // Filter: (cellInfo) =>
            // <div>{
            //     this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
            //     <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
            //   }
            //   </div>,
            Cell: (props) => (
              <div className="SystFlColContainer">
                <span className="SystFlColTxt">{props.value}</span>
                {key.accessor === "FileName" && (
                  <img
                    style={{ width: "20px", height: "15px" }}
                    src={
                      require("../../../Assets/Images/Media/download.jpg")
                        
                    }
                    className="SystFlColDnldImg"
                    onClick={() => this.downloadfile(props.value)}
                  ></img>
                )}
              </div>
            ),
          };
        } else if (key.accessor === "ExpDate" || key.accessor === "Dated") {
          obj = {
            Header: (cellInfo) => (
              <div>
                <div className="ScheduleHeaderWrp">
                  <div>{key.lable}</div>
                  {this.state.filterVal[index] === "" ? (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter_active.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 12,
                    marginTop: "12px",
                  }}
                >
                  {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                    0 && (
                    <Search
                      onChange={(e) =>
                        this.customFilerChange(
                          e.target.value,
                          cellInfo.column.id,
                          index
                        )
                      }
                      value={this.state.filterVal[index]}
                    ></Search>
                  )}
                </div>
              </div>
            ),
            accessor: key.accessor,
            show: true,
            filterable: true,
            filterMethod: (filter, row) => {
              if (filter.value === "") {
                return true;
              }
              if (row[filter.id]) {
                if (isNaN(row[filter.id])) {
                  return (
                    String(
                      moment(row[filter.id])
                        .format("DD-MMM-YYYY hh:mm:ss")
                        .toUpperCase()
                        .indexOf(filter.value.toUpperCase())
                    ) >= 0
                  );
                } else {
                  return (
                    String(row[filter.id].toString().indexOf(filter.value)) >= 0
                  );
                }
              }
              return false;
            },
            // Filter: (cellInfo) =>
            //     <div>{
            //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
            //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
            //     }
            //     </div>,
            Cell: (props) => <span>{this.getFormatedDate(props.value)}</span>,
          };
        } else {
          obj = {
            Header: (cellInfo) => (
              <div>
                <div className="ScheduleHeaderWrp">
                  <div>{key.lable}</div>
                  {this.state.filterVal[index] === "" ? (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter_active.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 12,
                    marginTop: "12px",
                  }}
                >
                  {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                    0 && (
                    <Search
                      onChange={(e) =>
                        this.customFilerChange(
                          e.target.value,
                          cellInfo.column.id,
                          index
                        )
                      }
                      value={this.state.filterVal[index]}
                    ></Search>
                  )}
                </div>
              </div>
            ),
            accessor: key.accessor,
            show: true,
            filterable: true,
            filterMethod: (filter, row) => {
              if (filter.value === "") {
                return true;
              }
              if (row[filter.id]) {
                if (isNaN(row[filter.id])) {
                  return (
                    String(
                      row[filter.id]
                        .toUpperCase()
                        .indexOf(filter.value.toUpperCase())
                    ) >= 0
                  );
                } else {
                  return (
                    String(row[filter.id].toString().indexOf(filter.value)) >= 0
                  );
                }
              }
              return false;
            },
            // Filter: (cellInfo) =>
            // <div>{
            //     this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
            //     <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
            //   }
            //   </div>
          };
        }
        dColumn.push(obj);
      });
      this.setState({ columns: dColumn, tabIndex: index }, () => {
        this.getRecords("SystemFile/Fetch");
      });
    } else {
      if (this.state.releaseData && this.state.releaseData.length > 0) {
        this.setState({ tabIndex: index, loading: true }, () =>
          this.setSubTab(this.state.subTabIndex)
        );
      } else {
        this.setState({ tabIndex: index, loading: true }, () =>
          this.getReleaseData()
        );
      }
    }
  }

  downloadfile(fileName) {
    var ext = fileName.substr(0, fileName.lastIndexOf("."));
    window.open(
      sessionStorage.getItem("mktUrl") + "api/" + "DownloadFiles/GetFile/" + ext
    );
  }
  getStaustString(val) {
    if (val == "0") {
      return "Scheduled";
    } else if (val == "1") {
      return "Upgrade Successfull";
    } else if (val == "2") {
      return "Yet to be scheduled";
    }
  }

  setSort(accessor, index) {
    let sorted = this.state.sortOption;
    let check = 0;
    let order = 0;
    if (sorted.length) {
      sorted.forEach((sort, i) => {
        if (sort["id"] === accessor) {
          if (sort.hasOwnProperty("desc")) {
            order = 1;
          }
          sorted.splice(i, 1);
          check = 1;
        }
      });
    }
    sorted = [];

    if (check === 0) {
      sorted.push({ id: accessor, desc: true });
      this.state.dataObj["SortColumn"] = accessor;
      this.state.dataObj["SortOrder"] = 1;
      this.cabObj["SortColumn"] = accessor;
      this.cabObj["SortOrder"] = 1;
    }
    if (check === 1 && order === 1) {
      sorted.push({ id: accessor, asc: true });
      this.state.dataObj["SortColumn"] = accessor;
      this.state.dataObj["SortOrder"] = 0;
      this.cabObj["SortColumn"] = accessor;
      this.cabObj["SortOrder"] = 0;
    } else if (check === 1) {
      sorted.push({ id: accessor, desc: true });
      this.state.dataObj["SortColumn"] = accessor;
      this.state.dataObj["SortOrder"] = 1;
      this.cabObj["SortColumn"] = accessor;
      this.cabObj["SortOrder"] = 1;
    }
    let newSorted = sorted.map((key, index) => {
      let temp1 = Object.assign({}, key);
      return temp1;
    });
    this.setState({ sortOption: newSorted });
  }

  setSort1(accessor, index) {
    let sorted = this.state.upldSortOption;
    let check = 0;
    let order = 0;
    if (sorted.length) {
      sorted.forEach((sort, i) => {
        if (sort["id"] === accessor) {
          if (sort.hasOwnProperty("desc")) {
            order = 1;
          }
          sorted.splice(i, 1);
          check = 1;
        }
      });
    }
    sorted = [];

    if (check === 0) {
      sorted.push({ id: accessor, desc: true });
    }
    if (check === 1 && order === 1) {
      sorted.push({ id: accessor, asc: true });
    } else if (check === 1) {
      sorted.push({ id: accessor, desc: true });
    }
    let newSorted = sorted.map((key, index) => {
      let temp1 = Object.assign({}, key);
      return temp1;
    });
    this.setState({ upldSortOption: newSorted });
  }

  handleClickOutside(event) {
    // if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
    //     this.setState({visibleFilters:[]})
    // }
    var self = this;
    var x = document.getElementsByClassName("SchedFiltInptWrp");
    //console.log("x is ", x[0])
    //console.log("event.target is ", event.target);
    if (event.target !== x[0]) {
      //console.log("out inside");
      self.setState({ visibleFilters: [] });
      self.setState({ addCabVisibleFilters: [] });
    } else {
      //console.log("inside inside");
    }
    //console.log("call handleClickOutside", event);
  }
  getReleaseData() {
    this.refReactgrpTable.fireFetchData();
  }

  getFormatedDate(Date) {
    return moment(Date).local().format("DD-MMM-YYYY HH:mm:ss ");
  }

  scheduleRelease(type, id) {
    let url = "";
    let msg = "";
    if (type === "Schedule") {
      url = "ScheduleRelease/RunReleaseSchedule/" + id;
      msg = "Scheduled Successfully";
    } else {
      url = "ScheduleRelease/RunReleaseForUpgradeReport/" + id;
      msg = "Report Generated Successfully";
    }
    getData(url).then((res) => {
      if (res && res.data && res.data.ReturnCode === 0) {
        this.setState({
          dlgtitle: "Information",
          message: msg,
          dlgType: "information",
          dlgEnable: true,
        });
      } else {
        this.setState({
          dlgtitle: "Information",
          message: "Something went wrong",
          dlgType: "information",
          dlgEnable: true,
        });
      }
    });
  }

  setScheduleCol() {
    let dColumn = [];
    this.state.visibleFilters = [];
    let obj = {
      Header: (
        <div></div>
      ) /*()=><ComCheck onChange={(e)=>this.getAllunitIds()}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>*/,
      Cell: (rowInfo) => (
        <ComCheck
          checked={this.state.cabId.indexOf(rowInfo.original.UNITID) >= 0}
          onChange={(e) => this.setCab(rowInfo.original.UNITID, e)}
          containerStyle={"ComCheckMainWrp"}
          tickStyle={"SchedCheckTick"}
        ></ComCheck>
      ), // Custom cell components!
      width: 25,
      resizable: false,
    };
    dColumn.push(obj);
    scheduleCol.map((key, index) => {
      if (key.accessor == "UnitMode") {
        obj = {
          Header: (cellInfo) => (
            <div className="ScheduleHeaderWrp">
              <div>{key.lable}</div>
              {this.state.filterVal[index] === "" ? (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter.png")
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              ) : (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter_active.png")
                      
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              )}
            </div>
          ),
          accessor: key.accessor,
          show: true,
          filterable: true,
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
                <Search
                  onChange={(e) =>
                    this.customFilerChange(
                      e.target.value,
                      cellInfo.column.id,
                      index,
                      cellInfo.column.id
                    )
                  }
                  value={this.state.filterVal[index]}
                  hideFilter={() => this.setState({ visibleFilters: [] })}
                ></Search>
              )}
            </div>
          ),
          Cell: (props) => <span>{unitMode[props.value]}</span>,
        };
      } else {
        obj = {
          Header: (cellInfo) => (
            <div className="ScheduleHeaderWrp">
              <div>{key.lable}</div>
              <img
                src={require("../../../Assets/Images/Cab/sort.png")}
                className="ScheduleheadFilt1"
                onClick={() => {
                  if (this.state.subTabIndex === 1) {
                    this.setSort(cellInfo.column.id, index);
                  } else {
                    this.setSort1(cellInfo.column.id, index);
                  }
                }}
              ></img>
              {this.state.filterVal[index] === "" ? (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter.png")
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              ) : (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter_active.png")
                      
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              )}
            </div>
          ),
          accessor: key.accessor,
          show: true,
          filterable: true,
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
                <Search
                  onChange={(e) =>
                    this.customFilerChange(
                      e.target.value,
                      cellInfo.column.id,
                      index,
                      cellInfo.column.id
                    )
                  }
                  value={this.state.filterVal[index]}
                  hideFilter={() => this.setState({ visibleFilters: [] })}
                ></Search>
              )}
            </div>
          ),
        };
      }

      dColumn.push(obj);
    });
    this.setState({ ScheduleColumns: dColumn });
  }

  setSubTab(index) {
    this.rowClick = false;
    let dColumn = [];
    let sColumn = [];
    this.state.filterVal = [];
    this.state.visibleFilters = [];
    this.state.cabId = [];
    if (index === 1) {
      let obj = {
        Header: "#",
        Cell: (rowInfo) => (
          <ComCheck
            onChange={(e) => this.setCab(rowInfo.original.UNITID, e)}
            containerStyle={"ComCheckMainWrp"}
            tickStyle={"SchedCheckTick"}
          ></ComCheck>
        ), // Custom cell components!
        width: 25,
      };
      dColumn.push(obj);
    }
    if (index > 0) {
      subTabColumns[index].map((key, index) => {
        this.state.filterVal.push("");
        let obj;
        if (key.accessor === "abc" && index !== 2) {
          obj = {
            Header: (cellInfo) => (
              <div>
                <div className="ScheduleHeaderWrp">
                  <div>{key.lable}</div>
                  {this.state.filterVal[index] === "" ? (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter_active.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 12,
                    marginTop: "12px",
                  }}
                >
                  {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                    0 && (
                    <Search
                      onChange={(e) =>
                        this.customFilerChange(
                          e.target.value,
                          cellInfo.column.id,
                          index
                        )
                      }
                      value={this.state.filterVal[index]}
                    ></Search>
                  )}
                </div>
              </div>
            ),
            accessor: key.accessor,
            show: true,
            filterable: true,
            // Filter: (cellInfo) =>
            // <div>{
            //     this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
            //     <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
            //   }
            //   </div>,
            Cell: (props) => <span>{statusCnst[props.value]}</span>,
          };
        } else if (key.accessor == "UnitMode") {
          obj = {
            Header: (cellInfo) => (
              <div>
                <div className="ScheduleHeaderWrp">
                  <div>{key.lable}</div>
                  {this.state.filterVal[index] === "" ? (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter_active.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() => this.setFilter(cellInfo.column.id, index)}
                    ></img>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 12,
                    marginTop: "12px",
                  }}
                >
                  {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                    0 && (
                    <Search
                      onChange={(e) =>
                        this.customFilerChange(
                          e.target.value,
                          cellInfo.column.id,
                          index
                        )
                      }
                      value={this.state.filterVal[index]}
                    ></Search>
                  )}
                </div>
              </div>
            ),
            accessor: key.accessor,
            show: true,
            filterable: true,
            // Filter: (cellInfo) =>
            //     <div>{
            //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
            //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
            //     }
            //     </div>,
            Cell: (rowInfo) => (
              <span className="number">
                {UnitMode[rowInfo.original.UnitMode]}
              </span>
            ), // Custom cell components!
          };
        } else {
          if (key.accessor == "status") {
            obj = {
              Header: (cellInfo) => (
                <div>
                  <div className="ScheduleHeaderWrp">
                    <div>{key.lable}</div>
                    {this.state.filterVal[index] === "" ? (
                      <img
                        src={
                          require("../../../Assets/Images/Filter/filter.png")
                            
                        }
                        className="ScheduleheadFilt"
                        onClick={() =>
                          this.setFilter(cellInfo.column.id, index)
                        }
                      ></img>
                    ) : (
                      <img
                        src={
                          require("../../../Assets/Images/Filter/filter_active.png")
                            
                        }
                        className="ScheduleheadFilt"
                        onClick={() =>
                          this.setFilter(cellInfo.column.id, index)
                        }
                      ></img>
                    )}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 12,
                      marginTop: "12px",
                    }}
                  >
                    {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                      0 && (
                      <Search
                        onChange={(e) =>
                          this.customStatusFilerChange(
                            e.target.value,
                            cellInfo.column.id,
                            index
                          )
                        }
                        value={this.state.filterVal[index]}
                      ></Search>
                    )}
                  </div>
                </div>
              ),
              accessor: key.accessor,
              show: true,
              filterable: true,
              // Filter: (cellInfo) =>
              //     <div>{
              //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
              //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
              //     }
              //     </div>,
              Cell: (rowInfo) => (
                <span className="number">
                  {rowInfo.original &&
                    this.getStaustString(rowInfo.original.status)}
                </span>
              ), // Custom cell components!
            };
          } else {
            obj = {
              Header: (cellInfo) => (
                <div>
                  <div className="ScheduleHeaderWrp">
                    <div>{key.lable}</div>

                    <div style={{ display: "flex", marginLeft: "auto" }}>
                      <img
                        src={
                          require("../../../Assets/Images/Cab/sort.png")
                        }
                        className="ScheduleheadFilt1"
                        onClick={() => {
                          if (this.state.subTabIndex === 1) {
                            this.setSort(cellInfo.column.id, index);
                          } else {
                            this.setSort1(cellInfo.column.id, index);
                          }
                        }}
                      ></img>
                      {this.state.filterVal[index] === "" ? (
                        <img
                          src={
                            require("../../../Assets/Images/Filter/filter.png")
                              
                          }
                          className="ScheduleheadFilt"
                          onClick={() =>
                            this.setFilter(cellInfo.column.id, index)
                          }
                        ></img>
                      ) : (
                        <img
                          src={
                            require("../../../Assets/Images/Filter/filter_active.png")
                              
                          }
                          className="ScheduleheadFilt"
                          onClick={() =>
                            this.setFilter(cellInfo.column.id, index)
                          }
                        ></img>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 12,
                      marginTop: "12px",
                    }}
                  >
                    {this.state.visibleFilters.indexOf(cellInfo.column.id) >=
                      0 && (
                      <Search
                        onChange={(e) =>
                          this.customFilerChange(
                            e.target.value,
                            cellInfo.column.id,
                            index
                          )
                        }
                        value={this.state.filterVal[index]}
                      ></Search>
                    )}
                  </div>
                </div>
              ),
              accessor: key.accessor,
              show: true,
              filterable: true,
              width: this.state.subTabIndex == 1 ? 140 : 150,
              filterMethod: (filter, row) => {
                if (filter.value === "") {
                  return true;
                }
                if (row[filter.id]) {
                  if (isNaN(row[filter.id])) {
                    return (
                      String(
                        row[filter.id]
                          .toUpperCase()
                          .indexOf(filter.value.toUpperCase())
                      ) >= 0
                    );
                  } else {
                    return (
                      String(row[filter.id].toString().indexOf(filter.value)) >=
                      0
                    );
                  }
                }
                return false;
              },
              // Filter: (cellInfo) =>
              //     <div>{
              //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
              //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
              //     }
              //     </div>,
            };
          }
        }
        dColumn.push(obj);
      });
      let obj1 = {
        Header: "",
        width: 10,
      };
      dColumn.push(obj1);
      this.setState(
        { columns: dColumn, subTabIndex: index, dataObj: this.dataObj },
        () => {
          if (this.state.subTabIndex === 1) {
            if (this.state.releaseData && this.state.releaseData.length > 0) {
              var dataindex = 0;
              if (this.state.phaseSelected) {
                if (this.state.phaseIndex > 0) {
                  dataindex = this.state.phaseIndex;
                }
                this.setData(dataindex, "phase");
              } else {
                if (this.state.releaseIndex > 0) {
                  dataindex = this.state.releaseIndex;
                }
                this.setData(dataindex, "release");
              }
              //this.setData(0,"release")
            } else {
              this.getReleaseData();
            }
            //this.refReactTable.fireFetchData();
          } else if (this.state.subTabIndex === 2) {
            if (this.state.releaseData && this.state.releaseData.length > 0) {
              var dataindex = 0;
              if (this.state.phaseSelected) {
                if (this.state.phaseIndex > 0) {
                  dataindex = this.state.phaseIndex;
                }
                this.setData(dataindex, "phase");
              } else {
                if (this.state.releaseIndex > 0) {
                  dataindex = this.state.releaseIndex;
                }
                this.setData(dataindex, "release");
              }
              //this.setData(0,"release")
            } else {
              this.getReleaseData();
            }
          }
        }
      );
    } else {
      let dColumn = [];
      let sColumn = [];
      this.state.filterVal = [];
      subTabColumns[0][0].map((key, index) => {
        this.state.filterVal.push("");
        let obj = {
          Header: (cellInfo) => (
            <div className="ScheduleHeaderWrp">
              <div>{key.lable}</div>
              {this.state.filterVal[index] === "" ? (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter.png")
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              ) : (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter_active.png")
                      
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              )}
            </div>
          ),
          accessor: key.accessor,
          show: true,
          filterable: true,
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
                <Search
                  onChange={(e) =>
                    this.customFilerChange(
                      e.target.value,
                      cellInfo.column.id,
                      index,
                      cellInfo.column.id
                    )
                  }
                  value={this.state.filterVal[index]}
                ></Search>
              )}
            </div>
          ),
        };
        dColumn.push(obj);
      });

      subTabColumns[0][1].map((key, index) => {
        this.state.filterVal.push("");
        let obj = {
          Header: (cellInfo) => (
            <div className="ScheduleHeaderWrp">
              <div>{key.lable}</div>
              {this.state.filterVal[index] === "" ? (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter.png")
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              ) : (
                <img
                  src={
                    require("../../../Assets/Images/Filter/filter_active.png")
                      
                  }
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              )}
            </div>
          ),
          accessor: key.accessor,
          show: true,
          filterable: true,
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
                <Search
                  onChange={(e) =>
                    this.customFilerChange(
                      e.target.value,
                      cellInfo.column.id,
                      index,
                      cellInfo.column.id
                    )
                  }
                  value={this.state.filterVal[index]}
                ></Search>
              )}
            </div>
          ),
        };
        sColumn.push(obj);
      });
      this.setState({
        vColumn: dColumn,
        crColumn: sColumn,
        subTabIndex: index,
        dataObj: this.dataObj,
      });
    }
  }

  setCab(id, e) {
    /* console.log("0 call setCab",e);
           console.log("1 call setCab",e.checked);*/
    /*let index = this.state.cabId.indexOf(id)
           if(index >= 0){
            this.state.cabId.splice(index,1)
           }else{
            this.state.cabId.push(id)
           }*/
    if (e) {
      this.state.cabId.push(id);
    } else {
      let index = this.state.cabId.indexOf(id);
      this.state.cabId.splice(index, 1);
    }
    this.setState({ refresh: true });
  }
  setAllCab(e) {
    this.state.cabId = [];
    if (e && this.state.cabData) {
      for (let i = 0; i < this.state.cabData.length; i++) {
        this.state.cabId.push(this.state.cabData[i].UNITID);
      }
    }

    this.setState({ refresh: true });
  }

  getunittype(data) {
    console.log("data is", data);
  }
  setFilter(id, index) {
    this.setState(({ visibleFilters }) => {
      let update = [...visibleFilters];
      const index = update.indexOf(id);
      index < 0 ? update.push(id) : update.splice(index, 1);
      return { visibleFilters: update };
    });
  }

  setAddCabFilter(id, index) {
    this.setState(({ addCabVisibleFilters }) => {
      let update = [...addCabVisibleFilters];
      const index = update.indexOf(id);
      index < 0 ? update.push(id) : update.splice(index, 1);
      return { addCabVisibleFilters: update };
    });
  }

  customFilerChange(value, accessor, index, column) {
    let filtered = this.state.filtered;
    let insertNewFilter = 1;
    this.state.filterVal[index] = value;

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
    });
    this.setState({ filtered: newFilter });
    if (this.state.addCab) {
      clearTimeout(this.timer);
      this.timer = setTimeout(
        () => this.getAvailavleCabsListForAssociation(newFilter),
        500
      );
    } else if (this.state.isSysfileSchedule) {
      clearTimeout(this.myTimer);
      this.myTimer = setTimeout(
        () => this.getCabsListForscheduleFile(newFilter),
        400
      );
    } else if (this.state.subTabIndex === 1) {
      if (value === "") {
        this.state.dataObj[accessor] = null;
      } else {
        this.state.dataObj[accessor] = value;
      }
      clearTimeout(this.timer);
      // this.timer = setTimeout(()=>  this.refReactTable.fireFetchData(),650)
    }
  }

  customStatusFilerChange(value, accessor, index, column) {
    let filtered = this.state.filtered;
    let insertNewFilter = 1;
    this.state.filterVal[index] = value;

    if (filtered.length) {
      filtered.forEach((filter, i) => {
        if (filter["id"] === accessor) {
          if (value === "" || !value.length) {
            filtered.splice(i, 1);
          } else {
            if ("scheduled".includes(value.toLowerCase())) {
              filter["value"] = "0";
            } else if ("yet to be scheduled".includes(value.toLowerCase())) {
              filter["value"] = "2";
            } else if ("upgrade successfull".includes(value.toLowerCase())) {
              filter["value"] = "1";
            } else {
              filter["value"] = value;
            }

            insertNewFilter = 0;
          }
        }
      });
    }

    if (insertNewFilter) {
      let val = value;
      if (value !== "" && "scheduled".includes(value.toLowerCase())) {
        val = "0";
      } else if (
        value !== "" &&
        "yet to be scheduled".includes(value.toLowerCase())
      ) {
        val = "2";
      } else if (
        value !== "" &&
        "upgrade successfull".includes(value.toLowerCase())
      ) {
        val = "1";
      }
      filtered.push({ id: accessor, value: val });
    }
    let newFilter = filtered.map((key, index) => {
      let temp1 = Object.assign({}, key);
      return temp1;
    });
    this.setState({ filtered: newFilter });
  }

  getRecords(url) {
    this.setState({
      loading: true,
      rightAction: 0,
      isSysfileSchedule: false,
      cabId: [],
    });

    getData(url).then((res) => {
      if (res && res.data && res.data.ResponseCollection) {
        this.setState({ data: [] });
        if (
          res.data.ResponseCollection &&
          res.data.ResponseCollection.length > 0
        ) {
          res.data.ResponseCollection.forEach(function (item) {
            var str = "";
            if (item.M10 == 1) {
              str += "M10,";
            }
            if (item.TREK == 1) {
              str += "TREK,";
            }
            if (item.MX == 1) {
              str += "MX,";
            }
            if (str.length > 0) {
              str = str.substr(0, str.length - 1);
            }
            item.UnitTYpe1 = str;
          });
        }
        this.setState({
          data: res.data.ResponseCollection,
          loading: false,
          deleteFiles: [],
        });
        if (url === "SystemFile/Fetch") {
          this.setDropDown(res.data.ResponseCollection);
        }
      } else {
        this.setState({ data: [], loading: false, deleteFiles: [] });
      }
    });
  }

  setDropDown(data) {
    this.listOption = [];
    this.SysFilelistOption = [];
    for (let i = 0; i < data.length; i++) {
      let obj = {
        value: data[i].FileID,
        lable: data[i].FileName,
      };
      this.listOption.push(obj);
      let obj1 = {
        id: data[i].FileID,
        FileName: "" + data[i].FileName + "",
      };
      this.SysFilelistOption.push(obj1);
    }
    console.log("SysFilelistOption", this.SysFilelistOption);
  }
  setColumn = (e, stateval) => {
    var myData = this.state[stateval];
    this.temp = this.state[stateval];
    const newData = myData.map((key, index) => {
      let temp = Object.assign({}, key);
      if (index === e.index) {
        temp.show = e.status;
      }
      return temp;
    });
    this.state[stateval] = newData;
    this.setState({ refresh: true });
  };

  resetColmn(e, stateval) {
    if (e === "close" && this.temp && this.temp.length) {
      const newData = this.temp.map((key, index) => {
        let temp1 = Object.assign({}, key);
        return temp1;
      });
      this.state[stateval] = newData;
    }
    this.setState({ columnSt: false });
  }

  setDelete(id) {
    let index = this.state.deleteFiles.indexOf(id);
    if (index >= 0) {
      this.state.deleteFiles.splice(index, 1);
    } else {
      this.state.deleteFiles.push(id);
    }
  }

  deleteFile(value) {
    if (value === "confirm") {
      if (this.state.deleteFiles && this.state.deleteFiles.length > 0) {
        this.setState({
          dlgtitle: "Confirmation",
          message: "Are you sure?",
          dlgType: "confirmation",
          dlgEnable: true,
        });
      } else {
        this.setState({
          dlgtitle: "Information",
          message: "Please Select Files",
          dlgType: "Information",
          dlgEnable: true,
        });
      }
    } else {
      if (this.state.deleteFiles && this.state.deleteFiles.length > 0) {
        this.setState({ dlgEnable: false, loading: true });
        let obj = {
          arrfileId: this.state.deleteFiles,
          pSystemFileVO: {
            arrSystemFileSuccessVO: null,
            arrVersionInfoVO: null,
            Dated: "2/5/2010",
            Description: "testsytem",
            ExpDate: "2/5/2010",
            FileID: 4,
            FileName: "test.zip",
            FileSize: 3221581,
            ID: 0,
            IsSystemFile: 1,
            M10: 0,
            PrID: 0,
            ReadMeFileName: null,
            size: 0,
            strDated: "2/6/2010",
            strExpDate: "",
            TREK: 0,
            UnitTYpe1: 0,
            UnitType2: 0,
            UserID: 27,
          },
        };

        postData("SystemFile/DeleteSystemFile", obj).then((res) => {
          if (res.data && res.data.ReturnCode === 0) {
            if (
              res.data.StatusResponseCollection &&
              res.data.StatusResponseCollection.length > 0
            ) {
              if (res.data.StatusResponseCollection[0] == 4) {
                //this.setState({dlgtitle:"Failinfo",message:" File(s) are currently used in Release Management so cannot be deleted...",dlgType:"Failinfo",dlgEnable:true})
                this.setState({
                  dlgtitle: "Information",
                  message:
                    "File(s) are currently used in Release Management so cannot be deleted...",
                  dlgType: "Information",
                  dlgEnable: true,
                  deleteFiles: [],
                });
              } else {
                this.setState({
                  dlgtitle: "Information",
                  message: "Deleted Successfully",
                  dlgType: "Information",
                  dlgEnable: true,
                  deleteFiles: [],
                });
              }
            } else {
              this.setState({
                dlgtitle: "Information",
                message: "Deleted Successfully",
                dlgType: "Information",
                dlgEnable: true,
                deleteFiles: [],
              });
            }

            this.setState({ loading: false });
            //this.getRecords("SystemFile/Fetch");
          } else {
            this.setState({ loading: false });
          }
        });
      } else {
        this.setState({ dlgEnable: false });
      }
    }
  }

  onFileChange(e, type) {
    if (type === "system") {
      this.setState({ systFile: e.target.files });
    } else {
      this.setState({ relFile: e.target.files });
    }
  }

  setUnit(val) {
    let index = this.state.uType.indexOf(val);
    if (index >= 0) {
      this.state.uType.splice(index, 1);
    } else {
      this.state.uType.push(val);
    }
  }

  setAsset(val) {
    console.log("check on asset", val);
    if (val) {
      this.state.isAsset = true;
      this.setState({ isAsset: true });
      document.getElementById("myTextDrop").classList.remove("disableDiv");
    } else {
      this.state.isAsset = false;
      this.setState({ isAsset: false });
      document.getElementById("myTextDrop").classList.add("disableDiv");
    }
  }

  upLoadFiles(type) {
    const fileData = new FormData();
    if (type === "system") {
      this.setState({ systProg: true });
      this.myInterval = setInterval(() => {
        if (this.state.systProgCnt < 100) {
          this.setState({ systProgCnt: this.state.systProgCnt + 2 });
        }
      }, 1500);
      for (var x = 0; x < this.state.systFile.length; x++) {
        fileData.append("file", this.state.systFile[x]);
      }
      postData("UploadfilesOnserver/Uploadfile", fileData).then((res) => {
        clearInterval(this.myInterval);
        if (res.data && res.data.ReturnCode === 0) {
          this.setState({ systProgCnt: 100 }, () => {
            this.setState({
              relUpload: false,
              systProg: false,
              disbleRelease: false,
            });
          });
        } else if (res.data && res.data.ReturnCode === 4) {
          this.setState({
            dlgtitle: "Information",
            message: "File with same name alrady exists",
            dlgType: "information",
            dlgEnable: true,
            upload: false,
            uplddata: [],
            selectedFiles: [],
            systFile: [],
            relFile: [],
            desc: "",
            endDate: new Date(),
            priority: "",
            uType: [],
            systProgCnt: 0,
            systProg: false,
            relProg: false,
            relProgCnt: 0,
          });
        } else {
          this.setState({
            dlgtitle: "Information",
            message: "Failed please try upload again",
            dlgType: "information",
            dlgEnable: true,
            upload: false,
            uplddata: [],
            selectedFiles: [],
            systFile: [],
            relFile: [],
            desc: "",
            endDate: new Date(),
            priority: "",
            uType: [],
            systProgCnt: 0,
            systProg: false,
            relProg: false,
            relProgCnt: 0,
          });
        }
      });
    } else {
      this.setState({ relProg: true });
      this.myInterval = setInterval(() => {
        if (this.state.relProgCnt < 100) {
          this.setState({ relProgCnt: this.state.relProgCnt + 2 });
        }
      }, 1500);
      for (var x = 0; x < this.state.relFile.length; x++) {
        fileData.append("file", this.state.relFile[x]);
      }
      postData("UploadfilesOnserver/Uploadfile", fileData).then((res) => {
        clearInterval(this.myInterval);
        if (res.data && res.data.ReturnCode === 0) {
          this.setState({ relProgCnt: 100 }, () => {
            this.setState({ relProg: false });
          });
        } else {
          this.setState({
            dlgtitle: "Information",
            message: "Failed please try upload again",
            dlgType: "information",
            dlgEnable: true,
            upload: false,
            uplddata: [],
            selectedFiles: [],
            systFile: [],
            relFile: [],
            desc: "",
            endDate: new Date(),
            priority: "",
            uType: [],
            systProgCnt: 0,
            systProg: false,
            relProg: false,
            relProgCnt: 0,
          });
        }
      });
    }
  }

  openAddReleasePopUp(type, index) {
    var strDate = new Date();
    var date = new Date(); // Now
    date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
    console.log(date);
    var endDate = date;
    this.setState({
      addType: type,
      addFile: true,
      strDate: strDate,
      strEndDate: endDate,
    });
  }
  openAddPhasePopUp(type, index) {
    var strDate = new Date();
    this.setState({
      addType: type,
      addFile: true,
      strDate: strDate,
      status: 0,
    });
  }
  deletePhase(Data) {
    console.log("on delete phase", Data);
    if (Data) {
      let url = "Phase/DeletePhase/" + Data.ID;
      let msg = "Phase Deleted Successfully";
      getData(url).then((res) => {
        if (res.data.ReturnCode === 0) {
          this.setState({
            addFile: false,
            dlgtitle: "Information",
            message: msg,
            dlgType: "information",
            dlgEnable: true,
            systName: "",
            relName: "",
          });
        }
      });
    }
  }

  getsysfileNameOfRelease() {
    let data = this.state.releaseData[this.state.fileIndex];
    if (data && data.systemFileVO && data.systemFileVO.FileName) {
      return data.systemFileVO.FileName;
    } else {
      return "";
    }
  }
  setRelease(type, index) {
    console.log("0 call setRelease");
    if (this.doubleClick === false) {
      this.doubleClick = true;
      console.log("1 call setRelease");
      this.setState({ addType: type, addFile: true });
      if (type === "Edit Release") {
        let data = this.state.releaseData[this.state.fileIndex];
        console.log("2 call setRelease", data);

        this.setState(
          {
            relName: data.Name,
            strDate: new Date(data.strStartDate),
            strEndDate: new Date(data.strEndDate),
            strHour: 0,
            strMin: 0,
            status: data.status,
            systId: data.FileID,
          },
          () => {
            this.doubleClick = false;
          }
        );
      } else if (type === "Edit Phase") {
        console.log("3 call setRelease in editphase");
        let data =
          this.state.releaseData[this.state.fileIndex].childrens[index];
        console.log("edit data", data);
        var strTM = 0;
        var strMIN = 0;
        if (data.StartTime) {
          var temArr = data.StartTime.split(":");
          strTM = temArr[0];
          if (temArr.length >= 2) {
            strMIN = temArr[1];
          }
        }

        this.setState(
          {
            relName: data.Name,
            strDate: new Date(data.strStartDate),
            strHour: strTM,
            strMin: strMIN,
            status: data.Status,
            childIndex: data,
          },
          () => {
            this.doubleClick = false;
          }
        );
      }
    }
    /*else {
            console.log("4 call setRelease");
            this.setState({addType: type, addFile: true})
        }*/
  }

  uploadRelease() {
    console.log("call upload release", this.state.selectedReleaseData);
    let obj = {};
    let url = "";
    let msg = "";
    let isvalied = "";
    if (this.state.addType === "Add Phase") {
      url = "Phase/AddPhase";
      msg = "Phase Added Successfully";
      let rNamw = "";
      if (this.state.relName) {
        rNamw = this.state.relName.trim();
      }
      if (rNamw) {
        isvalied = "";
      } else {
        isvalied = "please enter valid Name";
      }
      obj = {
        AssociateCabCount:
          this.state.releaseData[this.state.fileIndex].AssociateCabCount,
        EndTime: null,
        ID: this.state.releaseData[this.state.fileIndex].ID,
        Name: this.state.relName,
        ScheduleReleaseID: this.state.releaseData[this.state.fileIndex].ID,
        StartTime: this.state.strHour + ":" + this.state.strMin,
        Status: this.state.status,
        strEndDate: null,
        strStartDate: this.state.strDate,
      };
    } else if (this.state.addType === "Edit Phase") {
      console.log("for go editphase", this.state.selectedPhaseData);
      url = "Phase/EditPhase";
      msg = "Phase Edited Successfully";
      obj = {
        AssociateCabCount: this.state.childIndex.AssociateCabCount,
        EndTime: "23:59",
        ID: this.state.childIndex.ID,
        Name: this.state.relName,
        ScheduleReleaseID: this.state.childIndex.ScheduleReleaseID,
        StartTime: this.state.strHour + ":" + this.state.strMin,
        Status: this.state.status,
        strEndDate: this.state.strDate,
        strStartDate: this.state.strDate,
      };
    } else if (this.state.addType === "Add Release") {
      url = "ScheduleRelease/AddScheduleRelease";
      msg = "Release Added Successfully";
      var dt = new Date(this.state.strDate);
      dt.setMinutes(0);
      dt.setHours(0);
      let rNamw = "";
      if (this.state.relName) {
        rNamw = this.state.relName.trim();
      }
      if (rNamw) {
        isvalied = "";
      } else {
        isvalied = "please enter valid Name";
      }
      obj = {
        pSchedule_ReleaseVO: {
          arrReleaseCriteriaVO: null,
          AssociateCabCount: 0,
          childrens: null,
          FileID: this.state.systId,
          FileName: this.state.systName,
          ID: 0,
          Name: rNamw, //this.state.relName,
          Status: 0,
          strEndDate: this.state.strEndDate,
          strStartDate: dt,
          systemFileCriteriaVOs: null,
          systemFileVersionVOs: null,
        },
      };
    } else {
      url = "ScheduleRelease/EditScheduleRelease";
      msg = "Release Updated Successfully";
      var data = this.state.selectedReleaseData;
      console.log("dataon edit", data);
      obj = {
        pSchedule_ReleaseVO: {
          ID: data.ID,
          Status: 0,
          strEndDate: this.state.strEndDate,
          strStartDate: this.state.strDate,
        },
      };
    }
    if (isvalied == "") {
      postData(url, obj).then((res) => {
        if (res.data.ReturnCode === 0) {
          this.setState(
            {
              addFile: false,
              dlgtitle: "Information",
              message: msg,
              dlgType: "information",
              dlgEnable: true,
              loading: true,
              systName: "",
              relName: "",
            },
            () => this.getReleaseData()
          );
        } else if (res.data.ReturnCode === 4) {
          this.setState(
            {
              addFile: false,
              dlgtitle: "Information",
              message: "release with same name alrady exist",
              dlgType: "information",
              dlgEnable: true,
              loading: true,
              systName: "",
              relName: "",
            },
            () => this.getReleaseData()
          );
        }
      });
    } else {
      this.setState({
        dlgtitle: "Information",
        message: isvalied,
        dlgType: "information",
        dlgEnable: true,
      });
    }
  }

  refreshReportData() {
    this.state.cabId = [];
    if (this.state.phaseSelected == true) {
      getData(
        "/Phase/FetchAssociatedReport/" +
          this.state.releaseData[this.state.fileIndex].childrens[
            this.state.phaseIndex
          ].ID +
          "/-1"
      ).then((res) => {
        this.rowClick = false;
        if (res && res.data && res.data.ResponseCollection) {
          this.setState({ data: res.data.ResponseCollection, loading: false });
        } else {
          this.setState({ data: [], loading: false });
        }
      });
    } else {
      getData(
        "/Phase/FetchAssociatedReport/-1/" +
          this.state.releaseData[this.state.fileIndex].ID
      ).then((res) => {
        this.rowClick = false;
        if (res && res.data && res.data.ResponseCollection) {
          this.setState({ data: res.data.ResponseCollection, loading: false });
        } else {
          this.setState({ data: [], loading: false });
        }
      });
    }
  }

  setData(index, type) {
    if (this.rowClick === false) {
      this.setState({ loading: true, cabId: [] });
      this.rowClick = true;
      if (this.state.subTabIndex === 1) {
        if (type === "release") {
          this.state.phaseSelected = false;
          this.cabObj = {
            pReleaseID: this.state.releaseData[this.state.fileIndex].ID,
            unitlistCriteria: this.state.dataObj,
          };
          this.setState(
            { cabUrl: "ScheduleRelease/FetchReleaseAssociatedCabs" },
            () => this.refReactTable.fireFetchData()
          );
        } else if (type === "phase") {
          this.state.phaseSelected = true;
          this.cabObj = {
            pPhaseID:
              this.state.releaseData[this.state.fileIndex].childrens[
                this.state.phaseIndex
              ].ID,
            unitlistCriteria: this.state.dataObj,
          };
          this.setState({ cabUrl: "Phase/FetchAssociatedCabs" }, () =>
            this.refReactTable.fireFetchData()
          );
        }
      } else if (this.state.subTabIndex === 2) {
        if (type === "release") {
          this.state.phaseSelected = false;
          getData(
            "/Phase/FetchAssociatedReport/-1/" +
              this.state.releaseData[index].ID
          ).then((res) => {
            this.rowClick = false;
            if (res && res.data && res.data.ResponseCollection) {
              this.setState({
                data: res.data.ResponseCollection,
                loading: false,
              });
            } else {
              this.setState({ data: [], loading: false });
            }
          });
        } else {
          this.state.phaseSelected = true;
          getData(
            "/Phase/FetchAssociatedReport/" +
              this.state.releaseData[this.state.fileIndex].childrens[index].ID +
              "/-1"
          ).then((res) => {
            this.rowClick = false;
            if (res && res.data && res.data.ResponseCollection) {
              this.setState({
                data: res.data.ResponseCollection,
                loading: false,
              });
            } else {
              this.setState({ data: [], loading: false });
            }
          });
        }
      } else {
        this.setState({ loading: false });
      }
    }
  }

  fetchComponent() {
    getData("SystemFile/FetchComponent").then((res) => {
      if (res.data && res.data.ReturnCode === 0) {
        if (
          res.data.ResponseCollection &&
          res.data.ResponseCollection.length > 0
        ) {
          this.state.Mx925SYSVersionInfo = res.data.ResponseCollection;
        }
      }
    });
  }
  fetchClientCode() {
    getData("ClientCode/FetchClientCodes").then((res) => {
      if (res.data && res.data.ReturnCode === 0) {
        console.log(" client code data", res.data);
        if (
          res.data.ResponseCollection &&
          res.data.ResponseCollection.length > 0
        ) {
          this.state.ClientCodeData = res.data.ResponseCollection;
          //  this.setState({ ClientCodeData: res.data.ResponseCollection })
          // console.log("abhi ", ClientCodeData );
          this.state.ClientID = this.state.ClientCodeData[0].ID;
        }
      }
    });
  }
  fetchGroupCode() {
    let obj = {
      startIndex: 0,
      count: 0,
      criteria: [],
    };
    postData("GroupADSFL/Fetch", obj).then((res) => {
      if (res.data && res.data.ReturnCode === 0) {
        console.log(" group code data", res.data);
        if (
          res.data.ResponseCollection &&
          res.data.ResponseCollection.length > 0
        ) {
          this.state.ClientCodeData = res.data.ResponseCollection;
          this.state.ClientID = this.state.ClientCodeData[0].Group_ADS_ID;
        }
      }
    });
  }

  addSystemFile() {
    if (this.state.isSysFileForEdit && this.state.selectedRowData) {
      if (this.state.uType && this.state.uType.length === 0) {
        this.setState({
          dlgtitle: "Information",
          message: "Please Select Unit Type",
          dlgType: "information",
          uploadVal: true,
        });
      } else if (this.state.desc === "" || this.state.desc === null) {
        this.setState({
          dlgtitle: "Information",
          message: "Please provide brief description about System File",
          dlgType: "information",
          uploadVal: true,
        });
      } else {
        let obj = {
          arrSystemFileSuccessVO:
            this.state.selectedRowData.arrSystemFileSuccessVO,
          arrVersionInfoVO: this.state.selectedRowData.arrVersionInfoVO,
          Description: this.state.desc,
          FileName: this.state.selectedRowData.FileName,
          IsSystemFile: 1,
          M10: this.state.uType.includes("M10") ? 1 : 0,
          PrID: this.state.priority,
          ReadMeFileName: this.state.selectedRowData.ReadMeFileName,
          strExpDate: this.state.endDate,
          TREK: this.state.uType.includes("TREK") ? 1 : 0,
          FileID: this.state.selectedRowData.FileID,
          FileSize: this.state.selectedRowData.FileSize,
          MX: this.state.uType.includes("MX") ? 1 : 0,
        };
        this.state.upload = false;
        postData("SystemFile/EditSystemFile", obj).then((res) => {
          //this.setState({sucUpld:false,systFile:[],relFile:[],desc:"",endDate:new Date(), priority:"",uType:[], systProg:false,systProgCnt:0,relUpload:true,relProg:false,relProgCnt:0,})
          if (res.data && res.data.ReturnCode === 0) {
            this.getRecords("SystemFile/Fetch");
            this.setState({ upload: false, editSucessCrt: true }, () =>
              this.getCriteria()
            );
            //this.setState({dlgtitle:"Information",message:"File Uploaded Successfully",dlgType:"information",dlgEnable:true,systFile:[],relFile:[], desc:"",endDate:new Date(), priority:"", uType:[],systProgCnt:0,systProg:false,relProg:false,relProgCnt:0,editSucessCrt:true},()=>this.getCriteria())
          }
        });
      }
    } else {
      let component = null;
      if (
        this.state.Mx925SYSVersionInfo &&
        this.state.Mx925SYSVersionInfo.length > 0
      ) {
        component = this.state.Mx925SYSVersionInfo;
      }
      if (this.state.systFile.length === 0 || this.state.relFile.length === 0) {
        this.setState({
          dlgtitle: "Information",
          message:
            this.state.systFile.length === 0
              ? "Please select system file"
              : "Please select release file",
          dlgType: "information",
          uploadVal: true,
        });
      } else if (this.state.uType && this.state.uType.length === 0) {
        this.setState({
          dlgtitle: "Information",
          message: "Please Select Unit Type",
          dlgType: "information",
          uploadVal: true,
        });
      } else if (this.state.desc === "" || this.state.desc === null) {
        this.setState({
          dlgtitle: "Information",
          message: "Please provide brief description about System File",
          dlgType: "information",
          uploadVal: true,
        });
      } else {
        let obj = {
          arrSystemFileSuccessVO: null,
          arrVersionInfoVOList: component,
          arrVersionInfoVO: component,
          Description: this.state.desc,
          FileName: this.state.systFile[0].name,
          IsSystemFile: 1,
          M10: this.state.uType.includes("M10") ? 1 : 0,
          PrID: this.state.priority,
          ReadMeFileName: this.state.relFile[0].name,
          strExpDate: this.state.endDate,
          TREK: this.state.uType.includes("TREK") ? 1 : 0,
          MX: this.state.uType.includes("MX") ? 1 : 0,
          ClientId: this.state.ClientID,
          Version: this.state.Version,
          isAsset: this.state.isAsset,
        };

        postData("SystemFile/AddSystemFile", obj).then((res) => {
          if (res.data && res.data.ReturnCode === 0) {
            this.successRsp = res.data.ResponseCollection[0];
            if (res.data.ResponseCollection[0].arrVersionInfoVO) {
              this.state.sysFileVersionData =
                res.data.ResponseCollection[0].arrVersionInfoVO;
            }
            // console.log("system file data ", res.data)
            this.setState({ upload: false, sucUpld: true }, () =>
              this.getCriteria()
            );
          }
        });
      }
    }
  }

  getCriteria(id) {
    getData("SuccessCriteria/Fetch").then((res) => {
      if (res.data && res.data.ResponseCollection) {
        console.log(res.data.ResponseCollection);
        this.setState({ crtData: res.data.ResponseCollection });
      }
    });
    this.getRecords("SystemFile/Fetch");
  }

  editSystemFile() {
    let obj;
    let msg = "";
    this.setState({
      isAsset: false,
      Version: "",
      Clientid: "",
    });
    if (this.state.isSysFileForEdit && this.state.selectedRowData) {
      obj = {
        arrSystemFileSuccessVO: this.state.selectedCriteriaArr,
        arrVersionInfoVO: this.state.selectedRowData.arrVersionInfoVO,
        Description: this.state.desc,
        FileName: this.state.selectedRowData.FileName,
        IsSystemFile: 1,
        M10: this.state.uType.includes("M10") ? 1 : 0,
        PrID: this.state.priority,
        ReadMeFileName: this.state.selectedRowData.ReadMeFileName,
        strExpDate: this.state.endDate,
        TREK: this.state.uType.includes("TREK") ? 1 : 0,
        FileID: this.state.selectedRowData.FileID,
        FileSize: this.state.selectedRowData.FileSize,
        MX: this.state.uType.includes("MX") ? 1 : 0,
      };
      msg = "File Updated Successfully.";
    } else {
      obj = {
        arrSystemFileSuccessVO: this.state.selectedCriteriaArr,
        arrVersionInfoVO: this.successRsp.arrVersionInfoVO,
        Description: this.successRsp.Description,
        FileName: this.successRsp.FileName,
        IsSystemFile: 1,
        M10: this.successRsp.M10,
        PrID: this.successRsp.PrID,
        ReadMeFileName: this.successRsp.ReadMeFileName,
        strExpDate: this.successRsp.strExpDate,
        TREK: this.successRsp.TREK,
        MX: this.successRsp.MX ? this.successRsp.MX : 0,
        FileID: this.successRsp.FileID,
        FileSize: this.successRsp.FileSize,
      };
      msg = "File Uploaded Successfully.";
    }

    console.log("edistfile object", obj);
    postData("SystemFile/EditSystemFile", obj).then((res) => {
      this.setState({
        sucUpld: false,
        editSucessCrt: false,
        systFile: [],
        relFile: [],
        desc: "",
        endDate: new Date(),
        priority: "",
        systProg: false,
        systProgCnt: 0,
        relUpload: true,
        relProg: false,
        relProgCnt: 0,
        selectedCriteriaArr: [],
      });
      if (res.data && res.data.ReturnCode === 0) {
        console.log("EditSystemFile");
        this.setState(
          {
            dlgtitle: "Information",
            message: msg,
            dlgType: "Information",
            dlgEnable: true,
            systFile: [],
            relFile: [],
            desc: "",
            endDate: new Date(),
            priority: "",
            uType: [],
            systProgCnt: 0,
            systProg: false,
            relProg: false,
            relProgCnt: 0,
          },
          () => this.getRecords("SystemFile/Fetch")
        );
      }
    });
  }

  opneeditSysFilePopup() {
    console.log("oprnpop ", this.state.selectedRowData);
    let editUnitType = [];
    if (this.state.selectedRowData && this.state.selectedRowData.M10 == 1) {
      editUnitType.push("M10");
    }
    if (this.state.selectedRowData && this.state.selectedRowData.TREK == 1) {
      editUnitType.push("TREK");
    }
    if (this.state.selectedRowData && this.state.selectedRowData.MX == 1) {
      editUnitType.push("MX");
    }
    this.state.systFile = [{ name: this.state.selectedRowData.FileName }];
    this.state.relFile = [{ name: this.state.selectedRowData.ReadMeFileName }];
    if (this.state.selectedRowData && this.state.selectedRowData.strExpDate) {
      console.log("0 exsiting date", this.state.endDate);
      var newdate = new Date(this.state.selectedRowData.ExpDate);
      console.log("new dtaae", newdate);
      this.state.endDate = newdate;
      //console.log("1 exsiting date",moment(this.state.selectedRowData.ExpDate).format('MM-DD-YYYY'))
    }
    if (this.state.selectedRowData.arrSystemFileSuccessVO) {
      this.state.selectedCriteriaArr =
        this.state.selectedRowData.arrSystemFileSuccessVO;
    }

    this.setState({
      desc: this.state.selectedRowData.Description,
      priority: this.state.selectedRowData.PrID,
      uType: editUnitType,
      isSysFileForEdit: true,
      upload: true,
    });
  }

  getUnitTYpeforEdit(val) {
    console.log("seldata", this.state.selectedRowData);
    if (val == "M10") {
      if (this.state.selectedRowData && this.state.selectedRowData.M10 == 1) {
        return true;
      } else {
        return false;
      }
    }
    if (val == "MX") {
      if (this.state.selectedRowData && this.state.selectedRowData.MX == 1) {
        return true;
      } else {
        return false;
      }
    } else {
      if (this.state.selectedRowData && this.state.selectedRowData.TREK == 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  scheduleSysFileToCab() {
    console.log("selected cab ids", this.state.cabId);
    if (this.state.cabId && this.state.cabId.length > 0) {
      let obj = new Object();
      obj.pUnitID = this.state.cabId;
      obj.pSystemFileVO = {
        FileID: this.state.selectedRowData.FileID,
        strExpDate: this.state.selectedRowData.strExpDate,
        PrID: 2,
      };

      postData("SystemFile/ScheduleSystemFile", obj).then((res) => {
        if (res.data && res.data.ReturnCode == 0) {
          console.log("successfully");
          this.setState({
            dlgtitle: "Information",
            message: "System Files scheduled to the units successfully...",
            dlgType: "information",
            dlgEnable: true,
            addCab: false,
            cabId: [],
            isSysfileSchedule: false,
          });
        }
      });
    }
  }

  getCabsListForscheduleFile(newFilter) {
    if (!this.state.isSysfileSchedule) {
      for (let i = 0; i < this.state.filterVal.length; i++) {
        this.state.filterVal[i] = "";
      }
      this.setState({ rightAction: 0, isSysfileSchedule: true, cabId: [] });
      this.setScheduleCol();
    }
    let obj1 = {
      CABNUMBER: null,
      IPAddress: null,
      UNITKEY: null,
      PIM: null,
      iTapp: null,
      Horton: null,
      CCCODE1: null,
      TermType: null,
      GBVersion: null,
      Ident: null,
      MeterType: null,
      DIM: null,
      WatchDog: null,
      TaxiRideService: null,
      PIMReplica: null,
      Map: null,
      Current: null,
      CLIENTNAME: null,
      UnitMode: -1, // 0 for Lab/Demo  and 1 for production

      strLastUpdate: null,

      FilterUnitTypeList: null, ///for ex ["unknown","TREK","TaxiTopNYC"]/// this is multichoice filter

      VerunitArr: null, ///for ex ["702","4000"] /// this is multichoice filter
      SurveyServerIndex: -1, // bydefault-1
      SurveyUnitIndex: -1, // bydefault-1
    };

    if (newFilter) {
      for (let i = 0; i < newFilter.length; i++) {
        if (newFilter[i].value === "") {
          obj1[newFilter[i].id] = null;
        } else {
          obj1[newFilter[i].id] = newFilter[i].value;
        }
      }
    }

    var obj = {
      RowStart: this.state.page * 100 + 1,
      RowEnd: this.state.page * 100 + 100,
      unitlistCriteria: obj1,
    };

    this.setState({ schedLoading: true });
    postData("UnitList/Fetch", obj).then((res) => {
      if (res.data && res.data.ResponseCollection) {
        this.setState({ ScheduleCabList: [] }, () => {
          this.setState({
            ScheduleCabList: res.data.ResponseCollection,
            totalCnt: res.data.FilteredCount,
            filterCnt: res.data.FilteredCount,
            pageCount: Math.ceil(res.data.TotalcountOfItems / 100),
            schedLoading: false,
          });
          this.setState({ cabCount: res.data.TotalcountOfItems });
        });
      }
    });
  }
  getnewcall(rowstart, rowend) {
    getData(
      "UnitList/FetchReleaseAssociate/" +
        this.state.releaseData[this.state.fileIndex].childrens[
          this.state.phaseIndex
        ].ScheduleReleaseID +
        "/" +
        rowstart +
        "/" +
        rowend
    ).then((res) => {
      if (res.data && res.data.ResponseCollection) {
        if (this.state.cabData) {
        } else {
          this.setState({ cabData: [] });
        }
        if (this.state.cabData) {
          //console.log("start first")
          var temArray = [];
          temArray = this.state.cabData;
          temArray = temArray.concat(res.data.ResponseCollection);
          this.setState({ cabData: temArray });
        }
      }
    });
  }

  getAssocitedCabs() {
    if (this.state.releaseData[this.state.fileIndex].childrens) {
      var obj = {
        SchedulereleaseID:
          this.state.releaseData[this.state.fileIndex].childrens[
            this.state.phaseIndex
          ].ScheduleReleaseID,
        RowStart: 1,
        RowEnd: 100,
        filterCriteria: {
          CABNUMBER: null,
          IPAddress: null,
          UNITKEY: null,
          PIM: null,
          iTapp: null,
          Horton: null,
          CCCODE1: null,
          TermType: null,
          GBVersion: null,
          Ident: null,
          MeterType: null,
          DIM: null,
          WatchDog: null,
          TaxiRideService: null,
          PIMReplica: null,
          Map: null,
          Current: null,
          CLIENTNAME: null,
          UnitMode: -1, // 0 for Lab/Demo  and 1 for production

          strLastUpdate: null,

          FilterUnitTypeList: null, ///for ex ["unknown","TREK"]/// this is multichoice filter

          VerunitArr: null, ///for ex ["702","4000"] /// this is multichoice filter
        },
      };
      postData("UnitList/FetchReleaseAssociateWithFilter", obj).then((res) => {
        if (res.data && res.data.ResponseCollection) {
          this.setState({
            cabData: res.data.ResponseCollection,
            cabCount: res.data.TotalcountOfItems,
          });
        }
      });

      /*getData("UnitList/FetchReleaseAssociate/"+this.state.releaseData[this.state.fileIndex].childrens[this.state.phaseIndex].ScheduleReleaseID+"/1/300")
        .then(res=>{
          if(res.data && res.data.ResponseCollection){
            this.setState({cabData:res.data.ResponseCollection})
          }
        })
        getData("UnitList/FetchReleaseAssociateCabCount/"+this.state.releaseData[this.state.fileIndex].childrens[this.state.phaseIndex].ScheduleReleaseID)
        .then(res=>{
          if(res.data && res.data.TotalcountOfItems){
            this.setState({cabCount:res.data.TotalcountOfItems})

          }
        })*/
    }
  }

  setAssociatecabsCol(reload, data) {
    let dColumn = [];
    this.state.visibleFilters = [];
    this.state.filterVal = [];
    let obj = {
      Header: "#",
      Cell: (rowInfo) => (
        <ComCheck
          onChange={(e) => this.setCab(rowInfo.original.UNITID, e)}
          checked={this.state.cabId.indexOf(rowInfo.original.UNITID) !== -1}
          containerStyle={"ComCheckMainWrp"}
          tickStyle={"SchedCheckTick"}
        ></ComCheck>
      ), // Custom cell components!
      width: 25,
    };
    dColumn.push(obj);
    associateCabsCol.map((key, index) => {
      this.state.filterVal.push("");
      let obj = {};
      if (key.accessor == "UnitMode") {
        obj = {
          Header: (cellInfo) => (
            <div>
              <div className="ScheduleHeaderWrp">
                <div>{key.lable}</div>
                {this.state.filterVal[index] === "" ? (
                  <img
                    src={
                      require("../../../Assets/Images/Filter/filter.png")
                        
                    }
                    className="ScheduleheadFilt"
                    onClick={() =>
                      this.setAddCabFilter(cellInfo.column.id, index)
                    }
                  ></img>
                ) : (
                  <img
                    src={
                      require("../../../Assets/Images/Filter/filter_active.png")
                        
                    }
                    className="ScheduleheadFilt"
                    onClick={() =>
                      this.setAddCabFilter(cellInfo.column.id, index)
                    }
                  ></img>
                )}
              </div>
              <div
                style={{ position: "absolute", zIndex: 12, marginTop: "12px" }}
              >
                {this.state.addCabVisibleFilters.indexOf(cellInfo.column.id) >=
                  0 && (
                  <Search
                    onChange={(e) =>
                      this.customFilerChange(
                        e.target.value,
                        cellInfo.column.id,
                        index
                      )
                    }
                    value={this.state.filterVal[index]}
                  ></Search>
                )}
              </div>
            </div>
          ),
          accessor: key.accessor,
          show: true,
          filterable: true,
          // Filter: (cellInfo) =>
          //     <div>{
          //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
          //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
          //     }
          //     </div>,
          Cell: (rowInfo) => (
            <span className="number">
              {UnitMode[rowInfo.original.UnitMode]}
            </span>
          ), // Custom cell components!
        };
      } else if (key.accessor == "Current") {
        obj = {
          Header: (cellInfo) => (
            <div>
              <div className="ScheduleHeaderWrp">
                <div>{key.lable}</div>
                {this.state.filterVal[index] === "" ? (
                  <img
                    src={
                      require("../../../Assets/Images/Filter/filter.png")
                        
                    }
                    className="ScheduleheadFilt"
                    onClick={() =>
                      this.setAddCabFilter(cellInfo.column.id, index)
                    }
                  ></img>
                ) : (
                  <img
                    src={
                      require("../../../Assets/Images/Filter/filter_active.png")
                        
                    }
                    className="ScheduleheadFilt"
                    onClick={() =>
                      this.setAddCabFilter(cellInfo.column.id, index)
                    }
                  ></img>
                )}
              </div>
              <div
                style={{ position: "absolute", zIndex: 12, marginTop: "12px" }}
              >
                {this.state.addCabVisibleFilters.indexOf(cellInfo.column.id) >=
                  0 && (
                  <Search
                    onChange={(e) =>
                      this.customFilerChange(
                        e.target.value,
                        cellInfo.column.id,
                        index
                      )
                    }
                    value={this.state.filterVal[index]}
                  ></Search>
                )}
              </div>
            </div>
          ),
          accessor: key.accessor,
          show: true,
          filterable: true,
          // Filter: (cellInfo) =>
          //     <div>{
          //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
          //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
          //     }
          //     </div>,
          Cell: (rowInfo) => (
            <span className="number">{rowInfo.original.Current}</span>
          ), // Custom cell components!
        };
      } else {
        obj = {
          Header: (cellInfo) => (
            <div>
              <div className="ScheduleHeaderWrp">
                <div>{key.lable}</div>

                <div style={{ display: "flex", marginLeft: "auto" }}>
                  <img
                    src={require("../../../Assets/Images/Cab/sort.png")}
                    className="ScheduleheadFilt1"
                    onClick={() => {
                      if (this.state.subTabIndex === 1) {
                        this.setSort(cellInfo.column.id, index);
                      } else {
                        this.setSort1(cellInfo.column.id, index);
                      }
                    }}
                  ></img>
                  {this.state.filterVal[index] === "" ? (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() =>
                        this.setAddCabFilter(cellInfo.column.id, index)
                      }
                    ></img>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Filter/filter_active.png")
                          
                      }
                      className="ScheduleheadFilt"
                      onClick={() =>
                        this.setAddCabFilter(cellInfo.column.id, index)
                      }
                    ></img>
                  )}
                </div>
              </div>
              <div
                style={{ position: "absolute", zIndex: 12, marginTop: "12px" }}
              >
                {this.state.addCabVisibleFilters.indexOf(cellInfo.column.id) >=
                  0 && (
                  <Search
                    onChange={(e) =>
                      this.customFilerChange(
                        e.target.value,
                        cellInfo.column.id,
                        index
                      )
                    }
                    value={this.state.filterVal[index]}
                  ></Search>
                )}
              </div>
            </div>
          ),
          accessor: key.accessor,
          show: true,
          filterable: true,
          // Filter: (cellInfo) =>
          //     <div>{
          //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
          //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index,cellInfo.column.id)} value={this.state.filterVal[index]} hideFilter={()=>this.setState({visibleFilters:[]})}></Search>
          //     }
          //     </div>,
        };
      }

      dColumn.push(obj);
    });
    let myobj = {
      Header: "",
      width: 10,
    };
    dColumn.push(myobj);
    this.setState({ availableCabsColumns: dColumn });
  }

  getAvailavleCabsListForAssociation(newFilter, refresh) {
    if (!this.state.addCab) {
      this.setState({ addCab: true, visibleFilters: [], cabInfoLoading: true });
      this.setAssociatecabsCol();
    }
    if (
      this.state.releaseData[this.state.fileIndex].childrens ) {
      let temp = this.state.cabData;
      this.setState({ cabData: [], cabInfoLoading: true });
      let obj1 = {
        IPAddress: null,
        UNITKEY: null,
        PIM: null,
        iTapp: null,
        Horton: null,
        CCCODE1: null,
        TermType: null,
        GBVersion: null,
        Ident: null,
        MeterType: null,
        DIM: null,
        WatchDog: null,
        TaxiRideService: null,
        PIMReplica: null,
        Map: null,
        Current: null,
        CLIENTNAME: null,
        UnitMode: -1, // 0 for Lab/Demo  and 1 for production

        strLastUpdate: null,

        FilterUnitTypeList: null, ///for ex ["unknown","TREK"]/// this is multichoice filter

        VerunitArr: null, ///for ex ["702","4000"] /// this is multichoice filter
      };
      if (newFilter) {
        for (let i = 0; i < newFilter.length; i++) {
          /*if(newFilter[i].id === "Current"){
                let statusIndex =-1
                if(newFilter[i].value !== "" && newFilter[i].value !== null){
                  for(let j=0;j<cabStatus.length;j++){
                    if(cabStatus[j].toUpperCase().includes(newFilter[i].value.toString().toUpperCase())){
                      statusIndex = j;
                    }
                  }
                }else{
                  newFilter[i].value=null;
                }
                if(statusIndex !==-1){
                  newFilter[i].value = statusIndex
                }
              }*/
        }

        for (let i = 0; i < newFilter.length; i++) {
          if (newFilter[i].value === "") {
            obj1[newFilter[i].id] = null;
          } else {
            obj1[newFilter[i].id] = newFilter[i].value;
          }
        }
      }

      var obj = {
        SchedulereleaseID:
          this.state.releaseData[this.state.fileIndex].childrens[
            this.state.phaseIndex
          ].ScheduleReleaseID,
        RowStart: this.state.page * 50 + 1,
        RowEnd: this.state.page * 50 + 50,
        filterCriteria: obj1,
      };
      if (refresh === "refresh") {
        this.setState({ cabData: [], cabId: [] });
      }
      
      postData("UnitList/FetchReleaseAssociateWithFilter", obj)
        .then((res) => {
          if (res.data && res.data.ResponseCollection) {
            if (res.data.ResponseCollection.length > 0) {
              res.data.ResponseCollection.forEach(function (item) {
                item["isSelUnitId"] = false;
              });
            }
            this.setState(
              {
                cabCount: res.data.ResponseCollection.length,
                cabData: res.data.ResponseCollection,
                totalCnt: res.data.TotalcountOfItems,
                filterCnt: res.data.FilteredCount,
                pageCount: Math.ceil(res.data.FilteredCount / 50),
              },
              () => {
                this.setState({ cabInfoLoading: false });
              }
            );
          } else {
            this.setState({ cabData: temp, cabInfoLoading: false });
          }
        })
        .catch((e) => {
          this.setState({ cabData: temp, cabInfoLoading: false });
        });
    } else {
      let temp = this.state.cabData;
      if (refresh === "refresh") {
        this.setState({ cabData: [], cabId: [], cabInfoLoading: true });
        setTimeout(() => {
          this.setState({ cabData: temp, cabInfoLoading: false });
        }, 500);
      }
    }
  }

  getAllUnitForSchedule(newFilter, e) {
    let cabinfo = this.state.ScheduleCabList;
    if (e === false) {
      this.setState(
        {
          ScheduleCabList: [],
          cabInfoLoading: true,
          isAllSelected: false,
          cabId: [],
        },
        () => {
          this.setState({ ScheduleCabList: cabinfo, cabInfoLoading: false });
        }
      );
      //console.log("1 after unit ids",this.state.cabId);
    } else {
      // if(!this.state.addCab){
      //   this.setState({addCab:true,visibleFilters:[]});
      //   this.setAssociatecabsCol();
      //  }
      this.setState({ ScheduleCabList: [], cabInfoLoading: true });
      if (this.state.releaseData[this.state.fileIndex].childrens) {
        let obj1 = {
          CABNUMBER: null,
          IPAddress: null,
          UNITKEY: null,
          PIM: null,
          iTapp: null,
          Horton: null,
          CCCODE1: null,
          TermType: null,
          GBVersion: null,
          Ident: null,
          MeterType: null,
          DIM: null,
          WatchDog: null,
          TaxiRideService: null,
          PIMReplica: null,
          Map: null,
          Current: null,
          CLIENTNAME: null,
          UnitMode: -1, // 0 for Lab/Demo  and 1 for production

          strLastUpdate: null,

          FilterUnitTypeList: null, ///for ex ["unknown","TREK"]/// this is multichoice filter

          VerunitArr: null, ///for ex ["702","4000"] /// this is multichoice filter
        };
        if (newFilter) {
          for (let i = 0; i < newFilter.length; i++) {
            if (newFilter[i].value === "") {
              obj1[newFilter[i].id] = null;
            } else {
              obj1[newFilter[i].id] = newFilter[i].value;
            }
          }
        }

        var obj = {
          SchedulereleaseID:
            this.state.releaseData[this.state.fileIndex].childrens[
              this.state.phaseIndex
            ].ScheduleReleaseID,
          RowStart: this.state.page * 100 + 1,
          RowEnd: this.state.page * 100 + 100,
          filterCriteria: obj1,
        };

        postData("UnitList/FetchReleaseAssociateUnitIds", obj).then((res) => {
          if (res.data && res.data.ResponseCollection) {
            console.log("selected unit data", res.data.ResponseCollection);
            this.setState({
              cabId: res.data.ResponseCollection,
              cabData: cabinfo,
              cabInfoLoading: false,
            });
            //this.setState({cabCount:res.data.ResponseCollection.length,availableCabsList:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,pageCount:Math.ceil(res.data.TotalcountOfItems/50)})
          }
          console.log("after unit ids", this.state.cabId);
        });
      }
    }
  }

  getAllunitIds(newFilter, e) {
    let cabinfo = this.state.cabData;
    if (e === false) {
      this.setState(
        { cabData: [], cabInfoLoading: true, isAllSelected: false, cabId: [] },
        () => {
          this.setState({ cabData: cabinfo, cabInfoLoading: false });
        }
      );
      //console.log("1 after unit ids",this.state.cabId);
    } else {
      if (!this.state.addCab) {
        this.setState({ addCab: true, visibleFilters: [] });
        this.setAssociatecabsCol();
      }
      this.setState({ cabData: [], cabInfoLoading: true });
      console.log("select group data", this.state.selectedGroupData);
      if (this.state.releaseData[this.state.fileIndex].childrens) {
        let obj1 = {
          CABNUMBER: null,
          IPAddress: null,
          UNITKEY: null,
          PIM: null,
          iTapp: null,
          Horton: null,
          CCCODE1: null,
          TermType: null,
          GBVersion: null,
          Ident: null,
          MeterType: null,
          DIM: null,
          WatchDog: null,
          TaxiRideService: null,
          PIMReplica: null,
          Map: null,
          Current: null,
          CLIENTNAME: null,
          UnitMode: -1, // 0 for Lab/Demo  and 1 for production

          strLastUpdate: null,

          FilterUnitTypeList: null, ///for ex ["unknown","TREK"]/// this is multichoice filter

          VerunitArr: null, ///for ex ["702","4000"] /// this is multichoice filter
        };
        if (newFilter) {
          for (let i = 0; i < newFilter.length; i++) {
            if (newFilter[i].value === "") {
              obj1[newFilter[i].id] = null;
            } else {
              obj1[newFilter[i].id] = newFilter[i].value;
            }
          }
        }

        var obj = {
          SchedulereleaseID:
            this.state.releaseData[this.state.fileIndex].childrens[
              this.state.phaseIndex
            ].ScheduleReleaseID,
          RowStart: this.state.page * 100 + 1,
          RowEnd: this.state.page * 100 + 100,
          filterCriteria: obj1,
        };

        postData("UnitList/FetchReleaseAssociateUnitIds", obj).then((res) => {
          if (res.data && res.data.ResponseCollection) {
            console.log("selected unit data", res.data.ResponseCollection);
            this.setState({
              cabId: res.data.ResponseCollection,
              cabData: cabinfo,
              cabInfoLoading: false,
            });
            //this.setState({cabCount:res.data.ResponseCollection.length,availableCabsList:res.data.ResponseCollection,totalCnt:res.data.TotalcountOfItems,filterCnt:res.data.FilteredCount,pageCount:Math.ceil(res.data.TotalcountOfItems/50)})
          }
          console.log("after unit ids", this.state.cabId);
        });
      }
    }
  }

  addAssociatedCabs() {
    if (this.state.cabId && this.state.cabId.length > 0) {
      let obj = {
        pPhaseID:
          this.state.releaseData[this.state.fileIndex].childrens[
            this.state.phaseIndex
          ].ID,
        pUnitIDs: this.state.cabId,
      };
      postData("Phase/AssociateCabs", obj).then((res) => {
        if (res.data && res.data.ReturnCode === 0) {
          for (let i = 0; i < this.state.filterVal.length; i++) {
            this.state.filterVal[i] = "";
          }
          this.state.filtered = [];
          this.state.cabId = [];
          this.setState(
            {
              dlgtitle: "Information",
              message: "Cabs Added Successfully",
              dlgType: "information",
              dlgEnable: true,
              addCab: false,
              cabId: [],
              visibleFilters: [],
            },
            this.setData(0, "phase")
          );
        }
      });
    } else {
      for (let i = 0; i < this.state.filterVal; i++) {
        this.state.filterVal[i] = "";
      }
      this.setState({
        dlgtitle: "Information",
        message: "Please Select Cabs",
        dlgType: "information",
        dlgEnable: true,
        visibleFilters: [],
      });
    }
  }

  beforeCabDelete() {
    if (this.state.cabId && this.state.cabId.length > 0) {
      this.setState({
        dlgtitle: "Information",
        message: "Are you sure want to delete",
        dlgType: "deleteCab",
        dlgEnable: true,
        loading: false,
      });
    } else {
      this.setState({
        dlgtitle: "Information",
        message: "Please Select Cabs",
        dlgType: "information",
        dlgEnable: true,
        loading: false,
      });
    }
  }

  deleteCabs() {
    if (this.state.cabId && this.state.cabId.length > 0) {
      this.setState({ loading: true });
      let obj = {
        pPhaseID:
          this.state.releaseData[this.state.fileIndex].childrens[
            this.state.phaseIndex
          ].ID,
        pUnitIDs: this.state.cabId,
      };
      postData("Phase/deletePhaseAssociateCabs", obj).then((res) => {
        if (res.data && res.data.ReturnCode === 0) {
          this.setState(
            {
              dlgtitle: "Information",
              message: "Cabs Deleted Successfully",
              dlgType: "information",
              dlgEnable: true,
              addCab: false,
              cabId: [],
              data: [],
            },
            this.setData(0, "release")
          );
        }
      });
    } else {
      this.setState({
        dlgtitle: "Information",
        message: "Please Select Cabs",
        dlgType: "information",
        dlgEnable: true,
        loading: false,
      });
    }
  }

  setEndDate(Date) {
    if (this.state.addType === "Add Release") {
      var currentDate = moment(Date);
      var futureMonth = moment(currentDate).add(1, "M");
      var futureMonthEnd = moment(futureMonth).endOf("month");

      if (
        currentDate.date() != futureMonth.date() &&
        futureMonth.isSame(futureMonthEnd.format("YYYY-MM-DD"))
      ) {
        futureMonth = futureMonth.add(1, "d");
      }
      return Date;
    } else {
      return Date;
    }
  }

  checkStatusSet(status) {
    console.log("status is", status);
  }

  getdisabledFun() {
    if (
      this.state.addType == "Edit Release" ||
      this.state.addType == "Edit Phase"
    ) {
      return true;
    } else {
      return false;
    }
  }

  performRightAction() {
    console.log("call performRightAction", this.state.selectedRowData);
  }

  openUploadSysFilePopup() {
    var date = new Date(); // Now
    date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
    console.log(date);
    this.setState({ upload: true, endDate: date });
  }
  selectAllcabs() {
    console.log("all select");
  }

  fetchAssociatedCabs() {
    this.setState({ data: [] });
    postData(this.state.cabUrl, this.cabObj).then((res) => {
      this.rowClick = false;
      if (res && res.data && res.data.ResponseCollection) {
        this.setState({
          data: res.data.ResponseCollection,
          AsscttotalCnt: res.data.TotalcountOfItems,
          AssctfilterCnt: res.data.FilteredCount,
          loading: false,
          AssctpageCount: Math.ceil(res.data.TotalcountOfItems / 100),
        });
      } else {
        this.setState({ data: [], loading: false });
      }
    });
  }

  setAddCabPopup() {
    for (let i = 0; i < this.state.filterVal.length; i++) {
      this.state.filterVal[i] = "";
    }
    this.setState({
      addCab: false,
      visibleFilters: [],
      cabId: [],
      cabData: [],
      filtered: [],
    });
  }

  callServerExport(
    csvData,
    fileName,
    visibleCol,
    isConversion,
    callback,
    expButton
  ) {
    console.log("call ExportCSV", csvData);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let visibleData = [];
    const loopType = [
      "AdLoop",
      "",
      "WelcomeLoop",
      "GoodByLoop",
      "Payment Loop",
    ];
    const dataChannel = ["ALL", "NBC", "NYCM"];
    const FileType = ["Video", "Banner"];
    const statusType = [
      "Scheduled",
      "Upgrade Successfull",
      "Yet to be scheduled",
    ];
    const unitModecheck = ["Demo/Lab", "Production"];
    console.log("visibleCol", visibleCol);
    console.log("csvData", csvData);
    visibleData = csvData;
    let datakeys = [];
    if (visibleCol) {
      visibleData.forEach(function (item) {
        datakeys = Object.keys(item);
        datakeys.forEach(function (key) {
          let ispresent = false;
          if (key == "IndexType") {
            key = "Loop Type";
          }
          visibleCol.forEach(function (visibleitem) {
            if (visibleitem.accessor) {
              if (key == visibleitem.accessor) {
                ispresent = true;
              } else {
                if (key == "FileGroups" || key == "FileGeoZones") {
                  ispresent = true;
                }
              }
            }
          });
          if (ispresent) {
          } else {
            delete item[key];
          }
        });
      });
      console.log("visibleData", visibleData);
    }
    if (isConversion) {
      console.log("is conversion");
      visibleData.forEach(function (item) {
        if (item && item.status >= 0) {
          var status = statusType[item.status];
          if (status) {
            item.status = status;
          }
        }
        if (item.UnitMode >= 0) {
          var UnitMode = unitModecheck[item.UnitMode];
          if (UnitMode) {
            item.UnitMode = UnitMode;
          }
        }
      });
      console.log("visibleData1", visibleData);
    }
    const ws = XLSX.utils.json_to_sheet(visibleData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  getDataforExport(newFilter) {
    console.log("call getDataforExport", this.state.phaseSelected);

    if (this.state.phaseSelected) {
      console.log("phase selected");
      postData("Phase/FetchAssociatedCabsExport", this.cabObj).then((res) => {
        this.rowClick = false;
        if (res && res.data && res.data.ResponseCollection) {
          this.callServerExport(
            res.data.ResponseCollection,
            this.state.exportFileName,
            this.state.columns,
            true
          );
        }
      });
    } else {
      console.log("release selected");
      postData(
        "ScheduleRelease/FetchReleaseAssociatedCabsExport",
        this.cabObj
      ).then((res) => {
        this.rowClick = false;
        if (res && res.data && res.data.ResponseCollection) {
          this.callServerExport(
            res.data.ResponseCollection,
            this.state.exportFileName,
            this.state.columns,
            true
          );
        }
      });
    }
    /*if(this.state.tabIndex === 0){
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
                this.setState({loading:true});
                postData("DeviceInfo/FetchExport",obj)
                    .then(res => {
                        this.setState({loading:false});
                        if (res.data && res.data.ResponseCollection) {
                            console.log("fetchexprot device info", res.data.ResponseCollection);
                            this.callServerExport(res.data.ResponseCollection, this.state.exportFileName,this.state.columns,false)


                        }
                    })
            }*/
  }
  getExportDataForReports() {
    let myData = this.myReportsRef.getResolvedState().sortedData;
    this.callServerExport(
      myData,
      this.state.exportFileName,
      this.state.columns,
      true
    );
  }

  cancleSchedule() {
    for (let i = 0; i < this.state.filterVal.length; i++) {
      this.state.filterVal[i] = "";
    }
    this.setState({ isSysfileSchedule: false, filtered: [] });
  }

  render() {
    return (
      <div>
        <div className="CabDtTabMainWrp">
          {this.tabs &&
            this.tabs.map((key, index) => (
              <div
                className={
                  this.state.tabIndex === index ? "CabDtTabWrp1" : "CabDtTabWrp"
                }
                onClick={() => this.setTab(index)}
              >
                {key}
              </div>
            ))}
        </div>
        <div className="TableBorder">
          {this.state.upload ? (
            <div className="Loader">
              <div
                className={
                  this.marketid == "MX925"
                    ? "SystemFlupldWrpMx925"
                    : "SystemFlupldWrp"
                }
              >
                <div className="ForgPassTitle">Upload System File</div>
                <div
                  className={
                    this.state.isSysFileForEdit
                      ? "SystemFlUpldInptWrp disableDiv"
                      : "SystemFlUpldInptWrp"
                  }
                >
                  <span
                    className="SystemFlUpldtxt"
                    style={{ marginLeft: "2%" }}
                  >
                    System File *
                  </span>
                  <input
                    className="SystFlUpldinpt"
                    disabled={true}
                    value={
                      this.state.systFile &&
                      this.state.systFile[0] &&
                      this.state.systFile[0].name
                    }
                  ></input>
                  <input
                    type="file"
                    accept={this.allowedSysFileType}
                    style={{ display: "none" }}
                    ref={(myRef) => (this.syStFlupld = myRef)}
                    onChange={(e) => this.onFileChange(e, "system")}
                  ></input>
                  <img
                    src={
                      require("../../../Assets/Images/Media/select-files.png")
                        
                    }
                    className="SystFlUpldSelImg"
                    onClick={() => this.syStFlupld.click()}
                  ></img>
                  {this.state.systProg ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "30%",
                        height: "20px",
                      }}
                    >
                      <Line
                        percent={this.state.systProgCnt}
                        strokeWidth="1"
                        strokeColor="#80BBD7"
                        trailColor="#FFFFFF"
                        className="SystUProgress"
                      />
                      <span className="SystProgCnt">
                        {this.state.systProgCnt}%
                      </span>
                    </div>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Media/upload-btn-popup.png")
                          
                      }
                      className="SystFlUpldSelImg"
                      onClick={() => this.upLoadFiles("system")}
                    ></img>
                  )}
                </div>
                <div className="SystemFlUpldInptWrp">
                  <span
                    className="SystemFlUpldtxt"
                    style={{ marginLeft: "3%" }}
                  >
                    Discription *
                  </span>
                  <textarea
                    className="SystFlUpldinpt1"
                    value={this.state.desc}
                    onChange={(e) => this.setState({ desc: e.target.value })}
                  ></textarea>
                </div>
                <div
                  className={
                    this.state.isSysFileForEdit || this.state.disbleRelease
                      ? "SystemFlUpldInptWrp1 disableDiv"
                      : "SystemFlUpldInptWrp"
                  }
                >
                  <span className="SystemFlUpldtxt">Relaese Note *</span>
                  <input
                    className="SystFlUpldinpt"
                    disabled={true}
                    value={
                      this.state.relFile &&
                      this.state.relFile[0] &&
                      this.state.relFile[0].name
                    }
                  ></input>
                  <input
                    type="file"
                    accept={this.allowedRelNoteFileType}
                    style={{ display: "none" }}
                    ref={(myRef) => (this.relFlUpld = myRef)}
                    onChange={(e) => this.onFileChange(e, "release")}
                  ></input>
                  <img
                    src={
                      require("../../../Assets/Images/Media/select-files.png")
                        
                    }
                    className="SystFlUpldSelImg"
                    onClick={() => this.relFlUpld.click()}
                  ></img>
                  {this.state.relProg ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "30%",
                        height: "20px",
                      }}
                    >
                      <Line
                        percent={this.state.relProgCnt}
                        strokeWidth="1"
                        strokeColor="#80BBD7"
                        trailColor="#FFFFFF"
                        className="SystUProgress"
                      />
                      <span className="SystProgCnt">
                        {this.state.relProgCnt}%
                      </span>
                    </div>
                  ) : (
                    <img
                      src={
                        require("../../../Assets/Images/Media/upload-btn-popup.png")
                          
                      }
                      className="SystFlUpldSelImg"
                      onClick={() => this.upLoadFiles("release")}
                    ></img>
                  )}
                </div>
                <div className="SystemFlUpldInptWrp">
                  <span
                    className="SystemFlUpldtxt"
                    style={{ marginLeft: "4%" }}
                  >
                    End Date *
                  </span>
                  <DatePicker
                    selected={this.state.endDate}
                    onChange={(date) => this.setState({ endDate: date })}
                    wrapperClassName="SystDatePickWrp"
                    className="DatePickInptWrp"
                    popperPlacement="right-start"
                  ></DatePicker>
                </div>
                <div className="SystemFlUpldInptWrp">
                  <span
                    className="SystemFlUpldtxt"
                    style={{ marginLeft: "6%" }}
                  >
                    Priority *
                  </span>
                  <select
                    className="SystDropDwn1"
                    onChange={(e) =>
                      this.setState({ priority: e.target.value })
                    }
                    value={this.state.priority}
                  >
                    <option value="3">High</option>
                    <option value="2">Medium</option>
                    <option value="1">Low</option>
                  </select>
                </div>
                {this.marketid == "MX925" ? (
                  <div className="SystemFlUpldInptWrp">
                    <span
                      className="SystemFlUpldtxt"
                      style={{ marginLeft: "4%" }}
                    >
                      Unit Type *
                    </span>

                    <div style={{ marginLeft: "1%" }}>
                      <ComCheck
                        checked={this.getUnitTYpeforEdit("MX")}
                        containerStyle={"ComCheckMainWrp"}
                        tickStyle={"SchedCheckTick"}
                        label={"MX"}
                        onChange={() => this.setUnit("MX")}
                      ></ComCheck>
                    </div>
                  </div>
                ) : (
                  <div className="SystemFlUpldInptWrp">
                    <span
                      className="SystemFlUpldtxt"
                      style={{ marginLeft: "4%" }}
                    >
                      Unit Type *
                    </span>

                    <div style={{ marginLeft: "1%" }}>
                      <ComCheck
                        checked={this.getUnitTYpeforEdit("TREK")}
                        containerStyle={"ComCheckMainWrp"}
                        tickStyle={"SchedCheckTick"}
                        label={"TREK"}
                        onChange={() => this.setUnit("TREK")}
                      ></ComCheck>
                    </div>
                    <div style={{ marginLeft: "2%" }}>
                      <ComCheck
                        checked={this.getUnitTYpeforEdit("M10")}
                        containerStyle={"ComCheckMainWrp"}
                        tickStyle={"SchedCheckTick"}
                        label={"M10"}
                        onChange={() => this.setUnit("M10")}
                      ></ComCheck>
                    </div>
                  </div>
                )}
                {this.marketid == "MX925" && (
                  <div>
                    <div className="SystemFlUpldInptWrp">
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "4%" }}
                      >
                        Asset File :
                      </span>
                      <div style={{ marginLeft: "1%" }}>
                        <ComCheck
                          id="setAsset"
                          containerStyle={"ComCheckMainWrp"}
                          tickStyle={"SchedCheckTick"}
                          label={"Asset"}
                          onChange={(e) => this.setAsset(e)}
                        ></ComCheck>
                      </div>
                    </div>

                    <div id="myTextDrop" className="disableDiv">
                      <div className="SystemFlUpldInptWrp">
                        <span
                          className="SystemFlUpldtxt"
                          style={{ marginLeft: "1.5%" }}
                        >
                          Group Name :
                        </span>
                        <select
                          className="SystDropDwn1"
                          onChange={(e) =>
                            this.setState({ ClientID: e.target.value })
                          }
                          value={this.state.ClientID}
                        >
                          {this.state.ClientCodeData.map((item) => (
                            <option value={item.Group_ADS_ID}>
                              {" "}
                              {item.Group_ADS_Name}{" "}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="SystemFlUpldInptWrp">
                        <span
                          className="SystemFlUpldtxt"
                          style={{ marginLeft: "6%" }}
                        >
                          Version :
                        </span>
                        <input
                          style={{ marginLeft: "1%" }}
                          id="VersionName"
                          onChange={(e) =>
                            this.setState({ Version: e.target.value })
                          }
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="MediaFlUpldBtm">
                  <img
                    src={
                      require("../../../Assets/Images/Media/next-btn.png")
                        
                    }
                    className="SystFlnextBtn"
                    onClick={() => this.addSystemFile()}
                  ></img>
                  <img
                    src={
                      require("../../../Assets/Images/Login/cancel-btn.png")
                        
                    }
                    className="SystFlnextBtn"
                    onClick={() =>
                      this.setState({
                        upload: false,
                        systFile: [],
                        relFile: [],
                        desc: "",
                        endDate: new Date(),
                        priority: "",
                        uType: [],
                        systProgCnt: 0,
                        systProg: false,
                        relProg: false,
                        relProgCnt: 0,
                        isSysFileForEdit: false,
                        selectedRowData: null,
                        isAsset: false,
                        Version: "",
                        ClientID: "",
                        ClientName: "",
                      })
                    }
                  ></img>
                </div>
              </div>
              {this.state.uploadVal && (
                <Dialog
                  title={this.state.dlgtitle}
                  message={this.state.message}
                  onOk={() => this.setState({ uploadVal: false })}
                  onHide={() => this.setState({ uploadVal: false })}
                />
              )}
            </div>
          ) : this.state.sucUpld ? (
            <div className="Loader">
              <div className="SystemFlupldWrp1">
                <div className="ForgPassTitle">Upload System File</div>
                <span className="SystUplScssVrtxt">Version Information</span>
                <ReactTable
                  columns={this.verColumn}
                  data={this.state.sysFileVersionData}
                  showPagination={false}
                  sortable={false}
                  NoDataComponent={() => null}
                  style={{ height: "120px" }}
                />
                <span className="SystUplScssVrtxt">Success Criteria</span>
                <ReactTable
                  columns={this.crtColumn}
                  data={this.state.crtData}
                  showPagination={false}
                  sortable={false}
                  NoDataComponent={() => null}
                  style={{ height: "120px" }}
                />
                <div className="MediaFlUpldBtm">
                  <img
                    src={
                      require("../../../Assets/Images/System/previous.png")
                        
                    }
                    className="SystFlnextBtn"
                    onClick={() =>
                      this.setState({ sucUpld: false, upload: true })
                    }
                  ></img>
                  <img
                    src={
                      require("../../../Assets/Images/Login/ok-btn.png")
                    }
                    className="SystFlnextBtn"
                    onClick={() => this.editSystemFile()}
                  ></img>
                  <img
                    src={
                      require("../../../Assets/Images/Login/cancel-btn.png")
                        
                    }
                    className="SystFlnextBtn"
                    onClick={() =>
                      this.setState({
                        sucUpld: false,
                        systFile: [],
                        relFile: [],
                        desc: "",
                        endDate: new Date(),
                        priority: "",
                        uType: [],
                        systProgCnt: 0,
                        systProg: false,
                        relProg: false,
                        relProgCnt: 0,
                        isSysFileForEdit: false,
                        selectedRowData: null,
                        isAsset: false,
                        Version: "",
                        Clientid: "",
                      })
                    }
                  ></img>
                </div>
              </div>
            </div>
          ) : this.state.editSucessCrt ? (
            <div className="Loader">
              <div className="SystemFlupldWrp1">
                <div className="ForgPassTitle">Edit System File</div>
                <span className="SystUplScssVrtxt">Version Information</span>
                <ReactTable
                  columns={this.verColumn}
                  data={
                    this.state.selectedRowData.arrVersionInfoVO
                      ? this.state.selectedRowData.arrVersionInfoVO
                      : []
                  }
                  showPagination={false}
                  sortable={false}
                  NoDataComponent={() => null}
                  style={{ height: "120px" }}
                />
                <span className="SystUplScssVrtxt">Success Criteria</span>
                <ReactTable
                  columns={this.crtColumn1}
                  data={this.state.crtData}
                  showPagination={false}
                  sortable={false}
                  NoDataComponent={() => null}
                  style={{ height: "120px" }}
                />
                <div className="MediaFlUpldBtm">
                  <img
                    src={require("../../../Assets/Images/System/previous.png")}
                    className="SystFlnextBtn"
                    onClick={() =>
                      this.setState({ editSucessCrt: false, upload: true })
                    }
                  ></img>
                  <img
                    src={require("../../../Assets/Images/Login/ok-btn.png")}
                    className="SystFlnextBtn"
                    onClick={() => this.editSystemFile()}
                  ></img>
                  <img
                    src={require("../../../Assets/Images/Login/cancel-btn.png")}
                    className="SystFlnextBtn"
                    onClick={() =>
                      this.setState({
                        selectedCriteriaArr: [],
                        editSucessCrt: false,
                        systFile: [],
                        relFile: [],
                        desc: "",
                        endDate: new Date(),
                        priority: "",
                        uType: [],
                        systProgCnt: 0,
                        systProg: false,
                        relProg: false,
                        relProgCnt: 0,
                        isSysFileForEdit: false,
                        selectedRowData: null,
                      })
                    }
                  ></img>
                </div>
              </div>
            </div>
          ) : this.state.columnSt ? (
            <ColumnStatus
              data={this.state.columns}
              onChange={(e) => this.setColumn(e, "columns")}
              class={"SchedColumnHideWrp"}
              onClose={(e) => this.resetColmn(e, "columns")}
            ></ColumnStatus>
          ) : this.state.dlgEnable ? (
            <Dialog
              title={this.state.dlgtitle}
              message={this.state.message}
              onOk={() => {
                if (
                  this.state.dlgType === "Information" ||
                  this.state.dlgType === "information"
                ) {
                  this.setState({ dlgEnable: false });
                  if (this.state.subTabIndex !== 1) {
                    this.getRecords("SystemFile/Fetch");
                  }
                } else if (
                  this.state.dlgType === "deleteCab" ||
                  this.state.dlgType === "DeleteCab"
                ) {
                  this.deleteCabs();
                } else {
                  this.deleteFile("delete");
                }
              }}
              onCancel={() => this.setState({ dlgEnable: false })}
              type={this.state.dlgType}
              onHide={() => this.setState({ dlgEnable: false })}
            ></Dialog>
          ) : this.state.addFile ? (
            <div className="Loader">
              <div className="SystemAddRelWrp">
                <div className="ForgPassTitle">{this.state.addType}</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "6px",
                  }}
                >
                  <span
                    className="SystemFlUpldtxt"
                    style={{ marginLeft: "2%" }}
                  >
                    {this.state.addType === "Add Release" ||
                    this.state.addType === "Edit Release"
                      ? "Release"
                      : "Phase"}{" "}
                    Name *
                  </span>
                  <input
                    style={{ width: "50%" }}
                    disabled={this.getdisabledFun()}
                    className="SystFlUpldinpt"
                    value={this.state.relName}
                    onChange={(e) => this.setState({ relName: e.target.value })}
                  ></input>
                </div>

                {this.state.addType === "Add Release" ||
                this.state.addType === "Edit Release" ? (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "6%" }}
                      >
                        System File *
                      </span>

                      {this.state.addType === "Edit Release" ? (
                        <div className="editsysfile">
                          {this.getsysfileNameOfRelease()}
                        </div>
                      ) : (
                        <select
                          disabled={this.getdisabledFun()}
                          className="SystDropDwn1"
                          style={{ width: "50%" }}
                          defaultValue=""
                          onChange={(e) =>
                            this.setState({
                              systName: this.listOption[e.target.value].lable,
                              systId: this.listOption[e.target.value].value,
                            })
                          }
                        >
                          <option value={""} disabled={true}></option>
                          {this.listOption.map((key, index) => (
                            <option value={index}>{key.lable}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "8%" }}
                      >
                        Start Date *
                      </span>
                      <DatePicker
                        selected={this.state.strDate}
                        onChange={(date) => this.setState({ strDate: date })}
                        wrapperClassName="SystRelDatePickWrp"
                        className="DatePickInptWrp"
                        popperPlacement="right-start"
                      ></DatePicker>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "8.5%" }}
                      >
                        End Date *
                      </span>

                      <DatePicker
                        selected={this.state.strEndDate}
                        onChange={(date) => this.setState({ strEndDate: date })}
                        wrapperClassName="SystRelDatePickWrp"
                        className="DatePickInptWrp"
                        popperPlacement="right-start"
                      ></DatePicker>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "8%" }}
                      >
                        Start Date *
                      </span>
                      <DatePicker
                        selected={this.state.strDate}
                        onChange={(date) => this.setState({ strDate: date })}
                        wrapperClassName="SystRelDatePickWrp"
                        className="DatePickInptWrp"
                        popperPlacement="right-start"
                      ></DatePicker>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "8.5%" }}
                      >
                        Time Start *
                      </span>
                      <input
                        className="SchedBnrPopinpt1"
                        type="number"
                        value={this.state.strHour}
                        onChange={(e) =>
                          this.setState({ strHour: e.target.value })
                        }
                      ></input>
                      <input
                        className="SchedBnrPopinpt1"
                        type="number"
                        value={this.state.strMin}
                        onChange={(e) =>
                          this.setState({ strMin: e.target.value })
                        }
                      ></input>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "14%" }}
                      >
                        Status *
                      </span>
                      <select
                        className="SystDropDwn1"
                        onChange={(e) =>
                          this.setState({ status: e.target.value })
                        }
                        value={this.state.status}
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="SystFlUpldBtm">
                  <img
                    src={
                      require("../../../Assets/Images/Login/ok-btn.png")
                    }
                    className="SystFlnextBtn"
                    onClick={() => this.uploadRelease()}
                  ></img>
                  <img
                    src={
                      require("../../../Assets/Images/Login/cancel-btn.png")
                        
                    }
                    className="SystFlnextBtn"
                    onClick={() =>
                      this.setState({
                        addFile: false,
                        systName: "",
                        relName: "",
                      })
                    }
                  ></img>
                </div>
              </div>
            </div>
          ) : (
            this.state.addCab && (
              <div className="Loader">
                <div className="MediaUpldMainWrp">
                  <div className="ForgPassTitle">Schedule System File</div>
                  <div
                    className="ScheduleTabToolWrp"
                    style={{ "background-color": "#CECECE" }}
                  >
                    <div id="addcabbtncontainer" className="popsubhead">
                      <div className="rt-td" aria-disabled={true}>
                        <ComCheck
                          onChange={(e) =>
                            this.getAllunitIds(this.state.filtered, e)
                          }
                          containerStyle={"ComCheckMainWrp"}
                          tickStyle={"SchedCheckTick"}
                        ></ComCheck>
                      </div>
                      <div>Select/De-select all</div>
                    </div>

                    <div className="ScheduleTableToolCont">
                      <img
                        src={
                          require("../../../Assets/Images/tools/show-coloumn.png")
                            
                        }
                        className="ScheduleToolImg"
                        onClick={() =>
                          this.setState({ columnSt: !this.state.columnSt })
                        }
                      ></img>
                      <img
                        src={
                          require("../../../Assets/Images/separator.png")
                            
                        }
                        className="SchedTopCredSeprtr"
                      ></img>
                      <ExportCSV
                        csvData={this.state.cabData}
                        fileName="schedulecabs"
                        visibleCol={this.state.availableCabsColumns}
                        isConversion={false}
                        callback={() => {}}
                      />
                      <img
                        src={
                          require("../../../Assets/Images/separator.png")
                            
                        }
                        className="SchedTopCredSeprtr"
                      ></img>
                      <img
                        src={
                          require("../../../Assets/Images/tools/refresh.png")
                            
                        }
                        className="ScheduleToolImg"
                        onClick={() =>
                          this.getAvailavleCabsListForAssociation(
                            this.state.filtered,
                            "refresh"
                          )
                        }
                      ></img>
                    </div>
                  </div>
                  <ReactTable
                    columns={this.state.availableCabsColumns}
                    data={this.state.cabData}
                    loading={this.state.cabInfoLoading} 
                    PaginationComponent={Pagination}
                    totlaItems={this.state.totalCnt}
                    filterCnt={this.state.filterCnt}
                    //defaultPageSize={50}
                    pages={this.state.pageCount}
                    sortable={true}
                    NoDataComponent={() => null}
                    manual={true}
                    onFetchData={(state, instance) => {
                      this.setState({ page: instance.state.page }, () =>
                        this.getAvailavleCabsListForAssociation(
                          this.state.filtered
                        )
                      );
                    }}
                    getTheadFilterProps={(state, rowInfo, column, instance) => {
                      return {
                        style: { display: "none" },
                      };
                    }}
                    style={{ height: "250px", marginTop: "15px" }}
                  />
                  <div className="MediaFlUpldBtm">
                    <span className="SystCabCount">
                      Selected cabs({this.state.cabId.length}/
                      {this.state.filterCnt})
                    </span>
                    <div
                      className="SystAddCabBtn"
                      onClick={() => this.addAssociatedCabs()}
                    >
                      <span>Associate Cabs</span>
                    </div>
                    <div
                      className="SystAddCabBtn"
                      onClick={() => this.setAddCabPopup()}
                    >
                      <span>Cancel</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
          {this.state.tabIndex === 0 ? (
            <div
              id="container"
              contextMenu="none"
              onContextMenu={(e) => e.preventDefault()}
            >
              {this.state.rightAction > 0 ? (
                <div
                  className="actionMenu"
                  style={{
                    top: `${this.state.y}px`,
                    left: `${this.state.x}px`,
                  }}
                >
                  <ul className="actionUl" style={{ "list-style": "none" }}>
                    <li>
                      <div onClick={() => this.getCabsListForscheduleFile()}>
                        Schedule File
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <div></div>
              )}
              <div className="ScheduleTabToolWrp">
                <img
                  src={
                    require("../../../Assets/Images/Upload/upload-btn.png")
                      
                  }
                  className="ScheduleupldImg"
                  onClick={() => this.openUploadSysFilePopup()}
                ></img>
                <img
                  src={
                    require("../../../Assets/Images/Upload/delete.png")
                  }
                  className="ScheduleupldImg"
                  onClick={() => this.deleteFile("confirm")}
                ></img>

                <div className="ScheduleTableToolCont">
                  {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                  <img
                    src={
                      require("../../../Assets/Images/separator.png")
                    }
                    className="SchedTopCredSeprtr"
                  ></img>
                  <img
                    src={
                      require("../../../Assets/Images/tools/show-coloumn.png")
                        
                    }
                    className="ScheduleToolImg"
                    onClick={() =>
                      this.setState({ columnSt: !this.state.columnSt })
                    }
                  ></img>
                  <img
                    src={
                      require("../../../Assets/Images/separator.png")
                    }
                    className="SchedTopCredSeprtr"
                  ></img>
                  <img
                    src={
                      require("../../../Assets/Images/tools/refresh.png")
                        
                    }
                    className="ScheduleToolImg"
                    onClick={() => this.getRecords("SystemFile/Fetch")}
                  ></img>
                </div>
              </div>
              <ReactTable
                data={this.state.data}
                loading={this.state.loading}
                columns={this.state.columns}
                NoDataComponent={() => null}
                showPagination={false}
                filtered={this.state.filtered}
                minRows={20}
                pageSize={this.state.data.length}
                sortable={false}
                style={{
                  height: "510px", //
                }}
                getTrProps={(state, rowInfo) => {
                  if (rowInfo && rowInfo.row) {
                    return {
                      onContextMenu: (e) => {
                        this.setState({
                          selected: rowInfo,
                          selectedRowData: rowInfo.original,
                        });
                        console.log("right clikc rowdata", rowInfo.original);
                        this.setState({
                          rightAction: 1,
                          x: e.screenX,
                          y: e.screenY - 50,
                          visibleFilters: [],
                        });
                      },
                      onClick: (e) => {
                        this.sysetmSelected = rowInfo.index;
                        this.setState({
                          selected: null,
                        });
                        this.setState({ rightAction: 0 });
                      },
                      onDoubleClick: (e) => {
                        console.log(
                          "double click clikc rowdata",
                          rowInfo.original
                        );
                        this.state.selectedRowData = rowInfo.original;
                        this.opneeditSysFilePopup();
                      },
                      style: {
                        background:
                          this.sysetmSelected === rowInfo.index
                            ? "#00afec"
                            : "",
                      },
                    };
                  } else {
                    return {};
                  }
                }}
                getTheadFilterProps={(state, rowInfo, column, instance) => {
                  return {
                    style: { display: "none" },
                  };
                }}
              />
              {this.state.isSysfileSchedule ? (
                <div className="Loader">
                  <div
                    className="MediaUpldMainWrp"
                    id="divPopupOnscheduleCabFroSystemFile"
                  >
                    <div className="ForgPassTitle">Schedule System File</div>
                    <div
                      className="ScheduleTabToolWrp"
                      style={{ "background-color": "#CECECE" }}
                    >
                      <div id="addcabbtncontainer" className="popsubhead">
                        <div>File Name :</div>
                        <div>{this.state.selectedRowData.FileName}</div>
                      </div>

                      <div className="ScheduleTableToolCont">
                        <img
                          src={
                            require("../../../Assets/Images/tools/show-coloumn.png")
                              
                          }
                          className="ScheduleToolImg"
                          onClick={() =>
                            this.setState({ columnSt: !this.state.columnSt })
                          }
                        ></img>
                        <img
                          src={
                            require("../../../Assets/Images/separator.png")
                              
                          }
                          className="SchedTopCredSeprtr"
                        ></img>
                        <ExportCSV
                          csvData={this.state.ScheduleCabList}
                          fileName="schedulefiletocabs"
                          visibleCol={this.state.ScheduleColumns}
                          isConversion={false}
                          callback={() => {}}
                        />
                        <img
                          src={
                            require("../../../Assets/Images/separator.png")
                              
                          }
                          className="SchedTopCredSeprtr"
                        ></img>
                        <img
                          src={
                            require("../../../Assets/Images/tools/refresh.png")
                              
                          }
                          className="ScheduleToolImg"
                          onClick={() => this.getCabsListForscheduleFile()}
                        ></img>
                      </div>
                    </div>

                    <ReactTable
                      columns={this.state.ScheduleColumns}
                      data={this.state.ScheduleCabList}
                      PaginationComponent={Pagination}
                      totlaItems={this.state.totalCnt}
                      filterCnt={this.state.filterCnt}
                      defaultPageSize={100}
                      loading={this.state.schedLoading}
                      pages={this.state.pageCount}
                      sortable={true}
                      NoDataComponent={() => null}
                      manual={false}
                      onFetchData={(state, instance) => {
                        this.setState({ page: instance.state.page }, () =>
                          this.getCabsListForscheduleFile(this.state.filtered)
                        );
                      }}
                      getTheadFilterProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          style:
                            this.state.visibleFilters.length === 0
                              ? { display: "none" }
                              : null,
                        };
                      }}
                      getTheadFilterThProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          className:
                            this.state.visibleFilters.indexOf(column.id) < 0
                              ? "hiddenFilter"
                              : null,
                        };
                      }}
                      style={{ height: "250px", marginTop: "15px" }}
                    />
                    <div className="MediaFlUpldBtm">
                      <span className="SystCabCount">
                        Selected cabs({this.state.cabId.length}/
                        {this.state.cabCount})
                      </span>
                      <div
                        className="SystAddCabBtn"
                        onClick={() => this.scheduleSysFileToCab()}
                      >
                        <span>Schedule File</span>
                      </div>
                      <div
                        className="SystAddCabBtn"
                        onClick={() => this.cancleSchedule()}
                      >
                        <span>Cancel</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div style={{ display: "inline-flex", width: "100%" }}>
              <div className="SystGrpWrp" style={{ width: "26%" }}>
                <div className="SchedGrpTableToolWrp">
                  <div>
                    <img
                      src={
                        require("../../../Assets/Images/Group/add-over.png")
                          
                      }
                      className="SchedGrpTableToolImg"
                      onClick={() => this.openAddReleasePopUp("Add Release")}
                    ></img>
                  </div>
                  <div>
                    <img
                      src={
                        require("../../../Assets/Images/separator.png")
                      }
                      className="SchedTopCredSeprtr"
                    ></img>
                  </div>
                  <div className="releaseRefresh">
                    <img
                      src={
                        require("../../../Assets/Images/tools/refresh.png")
                          
                      }
                      className="SchedGrpTableToolImg"
                      onClick={() => this.getReleaseData()}
                    ></img>
                  </div>
                </div>
                <ReactTable
                  ref={(refReactgrpTable) => {
                    this.refReactgrpTable = refReactgrpTable;
                  }}
                  data={this.state.releaseData}
                  columns={this.grpColumn}
                  loading={this.state.loading}
                  NoDataComponent={() => null}
                  style={{ border: "none" }}
                  PaginationComponent={NewPagination}
                  totlaItems={this.state.grtotalCnt}
                  filterCnt={this.state.grfilterCnt}
                  defaultPageSize={20}
                  countFlag={false}
                  pages={this.state.grpageCount}
                  className="SchedGrpTableWrp1"
                  getTrGroupProps={(state, rowInfo, column, instance) => {
                    if (typeof rowInfo !== "undefined") {
                      return {
                        onClick: (e, handleOriginal) => {
                          this.setState(
                            {
                              releaseIndex: rowInfo.index,
                              fileIndex: rowInfo.index,
                              phaseId: -1,
                              selectedReleaseData: rowInfo.original,
                              phaseSelected: false,
                              releaseSelectedindex: rowInfo.index,
                            },
                            () => this.setData(rowInfo.index, "release")
                          );
                        },
                        style: {
                          background:
                            rowInfo.index === this.state.releaseSelectedindex
                              ? "#00afec"
                              : "",
                          color:
                            rowInfo.index === this.state.releaseSelectedindex
                              ? "white"
                              : "black",
                        },
                        onDoubleClick: () => {
                          this.setRelease("Edit Release", rowInfo.index);
                        },
                      };
                    } else {
                    }
                  }}
                  TheadComponent={(props) => null}
                  Style={{ height: "415px" }}
                  manual
                  onFetchData={(state, instance) => {
                    let start = instance.state.page * 20;
                    let end = (instance.state.page + 1) * 20;
                    this.setState({ loading: true });
                    getData(
                      "ScheduleRelease/FetchScheduleReleaseWithPagination/" +
                        start +
                        "/" +
                        end
                    ).then((res) => {
                      if (res && res.data && res.data.ResponseCollection) {
                        this.setState({ loading: false });
                        this.setState(
                          {
                            releaseData: res.data.ResponseCollection,
                            grtotalCnt: res.data.TotalcountOfItems,
                            grfilterCnt: res.data.FilteredCount,
                            loading: false,
                            grpageCount: Math.ceil(
                              res.data.TotalcountOfItems / 20
                            ),
                          },
                          () => this.setSubTab(this.state.subTabIndex)
                        );
                      } else {
                        this.setState({ releaseData: [], loading: false });
                      }
                    });
                  }}
                  SubComponent={(rowInfo) =>
                    rowInfo.original.childrens !== null ? (
                      <ReactTable
                        data={
                          this.state.releaseData.length > 0
                            ? this.state.releaseData[rowInfo.index].childrens
                            : []
                        }
                        columns={this.subColumn}
                        getTrGroupProps={(state, rowInfo, column, instance) => {
                          if (typeof rowInfo !== "undefined") {
                            return {
                              onClick: (e, handleOriginal) => {
                                this.setState(
                                  {
                                    relId: -1,
                                    phaseIndex: rowInfo.index,
                                    selectedPhaseData: rowInfo.original,
                                    phaseSelected: true,
                                    phaseSelectedindex: rowInfo.index,
                                  },
                                  () => this.setData(rowInfo.index, "phase")
                                );
                              },
                              style: {
                                background:
                                  rowInfo.index ===
                                  this.state.phaseSelectedindex
                                    ? "#00afec"
                                    : "",
                                color:
                                  rowInfo.index ===
                                  this.state.phaseSelectedindex
                                    ? "white"
                                    : "black",
                              },
                              onDoubleClick: (e) => {
                                this.setRelease("Edit Phase", rowInfo.index);
                              },
                            };
                          } else {
                          }
                        }}
                        showPagination={false}
                        /*minRows={2}
                                                defaultPageSize={2}
                                                pageSize={this.state.releaseData.length> 0 ? this.state.releaseData[rowInfo.index].childrens.length:2}*/
                        className="SchedGrpTableWrp1"
                        TheadComponent={(props) => null}
                      />
                    ) : null
                  }
                />
              </div>
              <div style={{ width: "78%" }}>
                <div className="CabDtTabMainWrp">
                  {subTabs &&
                    subTabs.map((key, index) => (
                      <div
                        className={
                          this.state.subTabIndex === index
                            ? "CabDtTabWrp1"
                            : "CabDtTabWrp"
                        }
                        onClick={() => this.setSubTab(index)}
                      >
                        {key}
                      </div>
                    ))}
                </div>
                {this.state.subTabIndex === 2 ? (
                  <div>
                    <div className="ScheduleTabToolWrp">
                      <div className="ScheduleTableToolCont">
                        {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                        <img
                          src={
                            require("../../../Assets/Images/tools/export.jpg")
                              
                          }
                          className="ScheduleToolImg"
                          onClick={() => this.getExportDataForReports()}
                        ></img>{" "}
                        <img
                          src={require("../../../Assets/Images/separator.png")}
                          className="SchedTopCredSeprtr"
                        ></img>
                        <img
                          src={
                            require("../../../Assets/Images/tools/refresh.png")
                              
                          }
                          className="ScheduleToolImg"
                          onClick={() => this.refreshReportData()}
                        ></img>
                      </div>
                    </div>
                    <ReactTable //Reports Table
                      ref={(ref) => (this.myReportsRef = ref)}
                      data={this.state.data}
                      loading={this.state.loading}
                      columns={this.state.columns}
                      NoDataComponent={() => null}
                      PaginationComponent={Pagination}
                      totlaItems={this.state.data.length}
                      filterCnt={this.state.filterCnt}
                      filtered={this.state.filtered}
                      sortable={false}
                      sorted={this.state.upldSortOption}
                      style={{
                        height: "440px", //
                      }}
                      getTheadFilterProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          style: { display: "none" },
                        };
                      }}
                    />
                  </div>
                ) : this.state.subTabIndex === 1 ? (
                  <div style={{ width: "100%" }}>
                    <div className="ScheduleTabToolWrp">
                      {this.state.phaseSelected ? (
                        <div id="addcabbtncontainer">
                          <img
                            src={
                              require("../../../Assets/Images/Cab/Add-Cab.png")
                                
                            }
                            className="ScheduleupldImg addCabbtn"
                            onClick={() =>
                              this.getAvailavleCabsListForAssociation([])
                            }
                          ></img>
                          <img
                            src={
                              require("../../../Assets/Images/Cab/Delete-Cab.png")
                                
                            }
                            className="ScheduleupldImg addCabbtn"
                            onClick={() => this.beforeCabDelete()}
                          ></img>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      <div className="ScheduleTableToolCont">
                        {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
                        <img
                          src={
                            require("../../../Assets/Images/separator.png")
                              
                          }
                          className="SchedTopCredSeprtr"
                        ></img>
                        <img
                          src={
                            require("../../../Assets/Images/tools/show-coloumn.png")
                              
                          }
                          className="ScheduleToolImg"
                          onClick={() =>
                            this.setState({ columnSt: !this.state.columnSt })
                          }
                        ></img>
                        <img
                          src={
                            require("../../../Assets/Images/separator.png")
                              
                          }
                          className="SchedTopCredSeprtr"
                        ></img>
                        {/*<img src={require('../../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg"></img>*/}
                        <img
                          src={
                            require("../../../Assets/Images/tools/export.jpg")
                              
                          }
                          className="ScheduleToolImg"
                          onClick={() =>
                            this.getDataforExport(this.state.filtered)
                          }
                        ></img>
                        {/*<ExportCSV csvData={this.state.data} fileName={this.state.exportFileName} visibleCol={this.state.columns} isConversion={false} callback={()=>{}} />*/}
                        <img
                          src={
                            require("../../../Assets/Images/separator.png")
                              
                          }
                          className="SchedTopCredSeprtr"
                        ></img>
                        <img
                          src={
                            require("../../../Assets/Images/tools/refresh.png")
                              
                          }
                          className="ScheduleToolImg"
                          onClick={() => {
                            if (this.state.phaseSelected) {
                              this.setData(this.state.phaseIndex, "phase");
                            } else {
                              this.setData(this.state.releaseIndex, "release");
                            }
                          }}
                        ></img>
                      </div>
                    </div>
                    <ReactTable
                      ref={(refReactTable) => {
                        this.refReactTable = refReactTable;
                      }}
                      loading={this.state.loading}
                      data={this.state.data}
                      columns={this.state.columns}
                      PaginationComponent={Pagination}
                      NoDataComponent={() => null}
                      filterable={false}
                      filtered={this.state.filtered}
                      sortable={false}
                      sorted={this.state.sortOption}
                      totlaItems={this.state.AsscttotalCnt}
                      filterCnt={this.state.AssctfilterCnt}
                      defaultPageSize={100}
                      pages={this.state.AssctpageCount}
                      style={{
                        height: "390px", //
                      }}
                      Sortable={false}
                      manual
                      onFetchData={(state, instance) => {
                        this.cabObj["RowStart"] = instance.state.page * 50 + 1;
                        this.cabObj["RowEnd"] = (instance.state.page + 1) * 50;

                        if (
                          this.state.visibleFilters &&
                          this.state.visibleFilters.length > 0
                        ) {
                          clearTimeout(this.timer);
                          this.timer = setTimeout(
                            () => this.fetchAssociatedCabs(),
                            650
                          );
                        } else {
                          this.fetchAssociatedCabs();
                        }
                      }}
                      getTheadFilterProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          style: { display: "none" },
                        };
                      }}
                    />
                  </div>
                ) : (
                  <div className="SystFlDtWrp">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "3.5%" }}
                      >
                        System File
                      </span>
                      <input
                        className="SystFlUpldinpt"
                        value={
                          this.state.releaseData.length > 0
                            ? this.state.releaseData[this.state.fileIndex]
                                .systemFileVO.FileName
                            : ""
                        }
                      ></input>
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "2%" }}
                      >
                        Release Note
                      </span>
                      <input
                        className="SystFlUpldinpt"
                        value={
                          this.state.releaseData.length > 0
                            ? this.state.releaseData[this.state.fileIndex]
                                .systemFileVO.ReadMeFileName
                            : ""
                        }
                      ></input>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "4%" }}
                      >
                        Description
                      </span>
                      <textarea
                        className="SystFlDtxtArea"
                        value={
                          this.state.releaseData.length > 0
                            ? this.state.releaseData[this.state.fileIndex]
                                .systemFileVO.Description
                            : ""
                        }
                      ></textarea>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "2%" }}
                      >
                        Release End Date
                      </span>
                      <input
                        className="SystFlUpldinpt"
                        value={
                          this.state.releaseData.length > 0
                            ? this.state.releaseData[this.state.fileIndex]
                                .systemFileVO.ExpDate
                            : ""
                        }
                      ></input>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "6px",
                      }}
                    >
                      <span
                        className="SystemFlUpldtxt"
                        style={{ marginLeft: "7.5%" }}
                      >
                        Priority
                      </span>
                      <input
                        className="SystFlUpldinpt"
                        value={
                          this.state.releaseData.length > 0
                            ? priorityCnt[
                                this.state.releaseData[this.state.fileIndex]
                                  .systemFileVO.PrID
                              ]
                            : ""
                        }
                      ></input>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                        marginLeft: "12px",
                        width: "89%",
                        borderBottom: "2px solid #FFFFFF",
                        paddingBottom: "7px",
                      }}
                    >
                      <span className="SystFlDtTabHeadtxt">Version</span>
                    </div>
                    <ReactTable
                      data={
                        this.state.releaseData.length > 0 &&
                        this.state.releaseData[this.state.fileIndex]
                          .systemFileVersionVOs
                          ? this.state.releaseData[this.state.fileIndex]
                              .systemFileVersionVOs
                          : []
                      }
                      columns={this.state.vColumn}
                      NoDataComponent={() => null}
                      showPagination={false}
                      filtered={this.state.filtered}
                      sortable={false}
                      style={{
                        height: "100px",
                        width: "89%",
                        marginLeft: "2%",
                        marginTop: "7px",
                      }}
                      getTheadFilterProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          style:
                            this.state.visibleFilters.length === 0
                              ? { display: "none" }
                              : null,
                        };
                      }}
                      getTheadFilterThProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          className:
                            this.state.visibleFilters.indexOf(column.id) < 0
                              ? "hiddenFilter"
                              : null,
                        };
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                        marginLeft: "12px",
                        width: "89%",
                        borderBottom: "2px solid #FFFFFF",
                        paddingBottom: "7px",
                      }}
                    >
                      <span className="SystFlDtTabHeadtxt">
                        Success Criteria
                      </span>
                    </div>
                    <ReactTable
                      data={
                        this.state.releaseData.length > 0 &&
                        this.state.releaseData[this.state.fileIndex]
                          .systemFileCriteriaVOs
                          ? this.state.releaseData[this.state.fileIndex]
                              .systemFileCriteriaVOs
                          : []
                      }
                      columns={this.state.crColumn}
                      NoDataComponent={() => null}
                      showPagination={false}
                      filtered={this.state.filtered}
                      sortable={false}
                      style={{
                        height: "100px",
                        width: "89%",
                        marginLeft: "2%",
                        marginTop: "7px",
                      }}
                      getTheadFilterProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          style:
                            this.state.visibleFilters.length === 0
                              ? { display: "none" }
                              : null,
                        };
                      }}
                      getTheadFilterThProps={(
                        state,
                        rowInfo,
                        column,
                        instance
                      ) => {
                        return {
                          className:
                            this.state.visibleFilters.indexOf(column.id) < 0
                              ? "hiddenFilter"
                              : null,
                        };
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
