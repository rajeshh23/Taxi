import React, {Component, createRef} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import ComCheck from "../../CommomComponents/ComCheck";
import {Search, MultiChoice} from "../../CommomComponents/Filters";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import {postData, getData, deletData} from '../../../Services/MainServices';
import Dialog from "../../CommomComponents/Dialog";
import moment from "moment";
import {Line} from 'rc-progress';
import {ExportCSV} from '../../../Utility/ExportCSV.js';


let ColumnCol = [
    {accessor: "FileName", lable: "File Name"},
    {accessor: "Group_ADS_NAME", lable: "Groups"},
    {accessor: "Channel", lable: "Channel"},
    {accessor: "VBannerName", lable: "Wide Banner"},
    {accessor: "HBannerName", lable: "Wing Banner"},
    {accessor: "GeozoneIncluded", lable: "GeoZones Included"},
    {accessor: "GeozoneExcluded", lable: "GeoZone Excluded"},
    {accessor: "Network", lable: "Network"},
    {accessor: "AltImage", lable: "Alter Image"},

]

let swictCol = [
    [

        {accessor: "FileName", lable: "File Name"},
        {accessor: "ORDERLOOP", lable: "Order"},
        {accessor: "DATESTART", lable: "Date Start"},
        {accessor: "DATEEND", lable: "Date End"},
        {accessor: "TIMESTART", lable: "Time Start"},
        {accessor: "TIMEEND", lable: "Time End"},
        {accessor: "Len", lable: "Duration"},
        {accessor: "FULLSCR_NG", lable: "Full Screen"},
        {accessor: "WeekpartStr", lable: "Weekpart"},
        {accessor: "VBannerName", lable: "Wide Banner"},
        {accessor: "HBannerName", lable: "Wing Banner"},
        {accessor: "GeozoneIncluded", lable: "GeoZones Included"},
        {accessor: "GeozoneExcluded", lable: "GeoZone Excluded"},
        {accessor: "Network", lable: "Network"},
        {accessor: "AltImage", lable: "Alter Image"},
        {accessor: "Provider", lable: "Provider"},

    ],
    [
        {accessor: "VFileDisplayName", lable: "Vertical Banner"},
        {accessor: "HFileDisplayName", lable: "Horizontal Banner"},
        {accessor: "FileGeoZonesString", lable: "Selected GeoZones"},
        {accessor: "Microsite", lable: "Microsite"},
        {accessor: "OrderLoop", lable: "Order"},
        {accessor: "Channel", lable: "Channel"},
        {accessor: "DateStart", lable: "Date Start"},
        {accessor: "DateEnd", lable: "Date End"},
        {accessor: "TimeStart", lable: "Time Start"},
        {accessor: "TimeEnd", lable: "Time End"},
        {accessor: "Length", lable: "Length"},
    ]
]

const subTCol = [
    [
        {accessor: "ORDERLOOP", lable: "Order"},
        {accessor: "Group_ADS_NAME", lable: "Group Name"},
        {accessor: "DATESTART", lable: "Start Date"},
        {accessor: "DATEEND", lable: "End Date"},
        {accessor: "TIMESTART", lable: "Start Time"},
        {accessor: "TIMEEND", lable: "End Time"},
        {accessor: "Len", lable: "Lentgh"},
        {accessor: "FULLSCR_NG", lable: "Full Screen"}
    ],
    [
        {accessor: "Group_ADS_Name", lable: "Group Name"},
        {accessor: "strStatus", lable: "Status"},
    ],
    [
        {accessor: "GroupName", lable: "Group Name"},
        {accessor: "Name", lable: "Geo-Zone Name"},
        {accessor: "strStatus", lable: "Status"},
    ],
    [
        {accessor: "Group_ADS_Name", lable: "Group Name"},
        {accessor: "RateCode", lable: "Rate Codes"},
    ],
    [
        {accessor: "Group_ADS_Name", lable: "Group Name"},
        {accessor: "PickupGeozone", lable: "Pick-Up Geozones"},
    ]
]

const previewCol = [
    {accessor: "GROUP_ADS_NAME", lable: "Groups"},
    {accessor: "IndexType", lable: "Loop Type"},
    {accessor: "FileName", lable: "File Name"},
    {accessor: "ORDERLOOP", lable: "Order"},
    {accessor: "strDATESTART", lable: "Date Start"},
    {accessor: "strDATEEND", lable: "Date End"},
    {accessor: "TIMESTART", lable: "Time Start"},
    {accessor: "TIMEEND", lable: "Time End"},
    {accessor: "Len", lable: "Length"},
    {accessor: "FULLSCR_NG", lable: "Full Screen"},
    {accessor: "VBanner", lable: "Vertical Banner"},
    {accessor: "HBanner", lable: "Horizontal Banner"},
]
const subTabs = ["Details", "Associated Groups", "Associated GeoZones"];
const subTabsKey = ["FileDetails", "FileGroups", "FileGeoZones", "FileGroups", "FileGroups"]
const rowColor = ["", "#81FFB9", "#FCF084", "#E59696"]
const flType = ["Video", "Banner"];
const grpStatus = ["Current", "Test", "Draft", "Test"];
const tabsUrl = ["GroupAds_Flash_Video/GetAllVideosForGroup/", "GroupAds_Flash_Banner_Group/GetAllBannersForGroup/"];
const dataChannel = ["ALL", "NBC", "NYCM"];
const loopType = ["AdLoop", "", "WelcomeLoop", "GoodByLoop", "Payment Loop","PairNPay Loop"];
const FScreen = ["false", "true"]
const userID = sessionStorage.getItem("userID");
//let userList = sessionStorage.getItem("userList");
const grpCol1 = [
    {
        Header: "Group Names",
        accessor: "Group_ADS_Name",
    }
];
const grpCol2 = [
    {
        Header: "Selected Group Names",
        accessor: "Group_ADS_Name"
    }
]
const GeoZoneCol2 = [
    {
        Header: "Selected GeoZone Names",
        accessor: "Name"
    }
]

const customOptionsFilterMethod = (filter, row) => {

    if (filter.value === '') {
        return true
    }

    if (dataChannel.includes(filter.value)) {
        return row[filter.id] === filter.value
    } else {
        console.log(false)
        return true
    }

}


export default class TableGrid extends Component {
    tem = [];
    filterType = "";
    filterType1 = "";
    tabs = ["Videos"];
    marketid = "";

    addobj = {
        VBannerName: "",
        HBannerName: "",
        FileName: "",
        WebVisibleURLVBanner: "",
        WebVisibleURLHBanner: "",
        WebVisibleURL: "",
        Banner1: 0,
        Banner2: 0
    };
    check = false;
    myInterval;
    btmRow = {};
    fileType = "";
    comnExpDate = new Date();
    uploadFileExt = ".wmv,.jpg,.jpeg,.gif,.png,.swf,.mp4";

    rateCodesCol = [
        {
            Header: "#",
            Cell: (rowInfo) => <ComCheck onClick={(e) => e.preventDefault()} onChange={(e) => {
                this.setRateCodes(e, rowInfo.original)
            }} checked={this.state.rateCodesDt.indexOf(rowInfo.original.ID) >= 0} containerStyle={"ComCheckMainWrp"}
                                         tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
            width: 25
        },
        {
            Header: "Rate codes",
            accessor: "Name"
        }
    ]

    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        if(sessionStorage.getItem("marketId")){
            if(sessionStorage.getItem("marketId")=="GLACIER"){
                this.marketid="GLACIER";
                ColumnCol = [
                    {accessor:"IndexType",lable:"Loop Type"},
                    {accessor: "FileName", lable: "File Name"},
                    {accessor: "Group_ADS_NAME", lable: "Groups"},
                    {accessor: "Channel", lable: "Channel"},
                    {accessor: "VBannerName", lable: "Wide Banner"},
                    {accessor: "HBannerName", lable: "Wing Banner"},
                    {accessor: "GeozoneIncluded", lable: "GeoZones Included"},
                    {accessor: "GeozoneExcluded", lable: "GeoZone Excluded"},
                    {accessor: "Network", lable: "Network"},
                    {accessor: "AltImage", lable: "Alter Image"},

                ];
                swictCol[0]=[
                    {accessor:"IndexType",lable:"Loop Type"},
                    {accessor: "FileName", lable: "File Name"},
                    {accessor: "ORDERLOOP", lable: "Order"},
                    {accessor: "DATESTART", lable: "Date Start"},
                    {accessor: "DATEEND", lable: "Date End"},
                    {accessor: "TIMESTART", lable: "Time Start"},
                    {accessor: "TIMEEND", lable: "Time End"},
                    {accessor: "Len", lable: "Duration"},
                    {accessor: "FULLSCR_NG", lable: "Full Screen"},
                    {accessor: "WeekpartStr", lable: "Weekpart"},
                    {accessor: "VBannerName", lable: "Wide Banner"},
                    {accessor: "HBannerName", lable: "Wing Banner"},
                    {accessor: "GeozoneIncluded", lable: "GeoZones Included"},
                    {accessor: "GeozoneExcluded", lable: "GeoZone Excluded"},
                    {accessor: "Network", lable: "Network"},
                    {accessor: "AltImage", lable: "Alter Image"},
                    {accessor: "Provider", lable: "Provider"},
                ]

            }
        }

        this.state = {
            group: false,
            groupName: "ALL",
            data: [],
            columns: [],
            grpData: [],
            switchcolumns: [],
            columnSt: false,
            grpColumn: this.grpColumn,
            filtered: [],
            sty: {width: "30px", height: "0px"},
            filter: -1,
            filterVal: [],
            visibleFilters: [],
            grpvisibleFilters: [],
            loading: true,
            schedBanner: false,
            schedFile: false,
            schedVideo: false,
            grpFileView: false,
            collapse: false,
            botmDrawer: false,
            schedBtm: false,
            FlDtIndex: 0,
            FlDtTabIndex: 0,
            btmCol: [],
            btmData: [],
            fileDelete: [],
            flLoading: true,
            editFile: false,
            flEditData: [],
            typeL: 0,
            channel: "0",
            mSite: 0,
            fLength: 15,
            loadFile: false,
            loadFileData: [],
            uploadby: -1,
            searchbyFile: "",
            tags: "",
            upload: false,
            uplddata: [],
            selectedFiles: [],
            grpSelection: false,
            grp1Data: [],
            grp2Data: [],
            tabIndex: 0,
            message: "",
            dlgtitle: "",
            dlgType: "",
            dlgEnable: false,
            order: 1,
            provider: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            timeSrtmin: 0,
            timeSrthr: 0,
            timeEndmin: 59,
            timeEndhr: 23,
            fScreen: 0,
            grp1Index: [],
            grp2Index: [],
            systProgCnt: 0,
            expDate: new Date(),
            deletData: [],
            grpInfo: false,
            grpObj: {
                groupName: '',
                startDate: new Date(),
                endDate: new Date(),
                unitType: 2
            },
            unitData: [],
            grpDelete: [],
            display: 0,
            btmDetails: false,
            btmGrpAssociated: false,
            schedVal: false,
            grpIndex: 0,
            upLoadvalidMsg: false,

            selectedGroupData: null,
            groupVideoCount: 0,
            groupBannerCount: 0,
            SelectedGroupIds: [],
            grViewGroupValid: false,
            showStatus: false,
            loadFileBackupData: [],
            filteredBackFileList: [],
            userList: [],
            micrositeList: [],
            VideoMicrosite: false,
            grpSelecteIndex: 0,
            adujstRow: [],
            fileUplaodLoding: false,
            groupEditData: [],
            grpEditInfo: false,
            providerData: [],
            visibletoolTip: false,
            tooltipImg: "",
            editGrFile: false,
            channelMulti: [],
            geoZone1Data: [],
            geoZone2Data: [],
            geoZoneData: [],
            GeoZoneId: 0,
            geoZoneIndex: [],
            rateCodeList: [],
            rateCodesDt: [],
            btmRateCodes: false,
            loopMulti: [],
            selectedRow: null,
            rightAction: 0,
            x: 0,
            y: 0,
            houseAd: false,
            previewLoop: false,
            prevData: [],
            prevCol: [],
            houseObj: {},
            grpViewLoading: false,
            grpLoading: false,
            grpfilterVal: ["", "", ""],
            grpfiltered: [],
            GrSelectionInfo: false,
            exportFileName: "exportScheduleFile",
            networkArray:[],
            network:"None",
            altImagesData:[],
            altImage:null,
            WeekPartArray:[],
            WeekPart:[],
            weekAllDay:true,
            geoZoneIncluded:false,
            geoZoneExcluded:false,
            goforgeozoneEdit:false,
            isDisableDruration:false,
            tempremoveGeozone:[],
            zonefiltered:[],
            zonefilteval:[""],
            zoneVisibleFilters:[],
            isImage:0,
            subTabFiltered:[],
            subTabVisibleFilters:[],
            subTabFilterVal:[],
            isbusy:false,
            enableAltImge:false,
            isenableschedBtn:true

        }
    }

    GeoZoneCol1 = [
        {
            Header: (cellInfo) => <div className="ScheduleHeaderWrp">
            <div>GeoZone Names</div>
            {
                this.state.zonefilteval[0] === "" ?
                    <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"
                         onClick={() => this.zoneSetFilter(cellInfo.column.id, 0)}></img>
                    :
                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                         className="ScheduleheadFilt"
                         onClick={() => this.zoneSetFilter(cellInfo.column.id, 0)}></img>
            }
        </div>,
            accessor: "Name",
            filterable: true,
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
                    this.state.zoneVisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    <Search onChange={(e) => this.zonecustomFilerChange(e.target.value, cellInfo.column.id, 0)}
                            value={this.state.zonefilteval[0]}></Search>
                }
                </div>
        }
    ];


    grpColumn = [
        {
            Header: "#",
            Cell: (rowInfo) => <ComCheck onClick={(e) => e.preventDefault()} onChange={(e) => {
                this.check = true;
                this.selGrpRow(e, rowInfo)
            }} containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>, // Custom cell components!
            width: 25
        },
        {
            Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                <div>Group Name</div>
                {
                    this.state.grpfilterVal[1] === "" ?
                        <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"
                             onClick={() => this.grpsetFilter(cellInfo.column.id, 1)}></img>
                        :
                        <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                             className="ScheduleheadFilt"
                             onClick={() => this.grpsetFilter(cellInfo.column.id, 1)}></img>
                }
            </div>,
            accessor: 'Group_ADS_Name',
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
                    <Search onChange={(e) => this.grpcustomFilerChange(e.target.value, cellInfo.column.id, 1)}
                            value={this.state.grpfilterVal[1]}></Search>
                }
                </div>
        },
        {
            Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                <div>Status</div>
                {
                    this.state.grpfilterVal[2] === "" ?
                        <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt"
                             onClick={() => this.grpsetFilter(cellInfo.column.id, 2)}></img>
                        :
                        <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                             className="ScheduleheadFilt"
                             onClick={() => this.grpsetFilter(cellInfo.column.id, 2)}></img>
                }
            </div>,
            accessor: 'Status',
            filterable: true,
            Cell: props => <span className='number'>{grpStatus[props.value]}</span>, // Custom cell components!

            Filter: (cellInfo) =>
                <div>{
                    this.state.grpvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    <Search
                        onChange={(e) => this.grpsetStatusFilter(e, "key", cellInfo.column.id, 2, "fileType", grpStatus)}
                        value={this.state.grpfilterVal[2]}></Search>
                }
                </div>
        },

    ]

    upColumns = [
        {
            Header: "File Name",
            accessor: "FileName"
        },
        {
            Header: "Expiry Date",
            accessor: "ExpDate",
            Cell: (rowInfo) => <DatePicker selected={this.getExpDate(rowInfo)}
                                           onChange={(date) => this.setUpldInput(date, rowInfo, "ExpDate")}
                                           wrapperClassName="MediaDatePickWrp" className="MediaDateInptWrp"
                                           popperPlacement="right-start"></DatePicker>
        },
        {
            Header: "Content File Type",
            accessor: "ContentFileTypeID",
            Cell: (rowInfo) => <select className="MediaDropDwn1"
                                       onChange={(e) => this.setUpldInput(e.target.value, rowInfo, "ContentFileTypeID")}>
                <option value=''></option>
                <option value="1">AD</option>
                <option value="2">NEWS</option>
                <option value="3">CONTENT</option>
                <option value="4">WEATHER</option>
            </select>
        },
        {
            Header: "Owner",
            accessor: "OwnerID",
            Cell: (rowInfo) => <select className="MediaDropDwn1"
                                       onChange={(e) => this.setUpldInput(e.target.value, rowInfo, "OwnerID")}>
                <option value=''></option>
                <option value="1">Verifone</option>
                <option value="2">NBC</option>
                <option value="3">NYCM</option>
                <option value="4">Vistar</option>
            </select>
        },
        {
            Header: "Tags",
            accessor: "Tag",
            Cell: (rowInfo) => <div className="MeadiaUpldInptwrp"><input className="MediaUpldInpt"
                                                                         onChange={(e) => this.setUpldInput(e.target.value, rowInfo, "Tag")}></input>
            </div>
        },
        {
            Header: "Contract#",
            accessor: "ContractID",
            Cell: (rowInfo) => <div className="MeadiaUpldInptwrp"><input className="MediaUpldInpt"  min="1"
                                                                         onChange={(e) => this.setUpldInput(e.target.value, rowInfo, "ContractID")}></input>
            </div>
        },
        {
            Header: "Commited Impression",
            accessor: "Commited",
            Cell: (rowInfo) => <div className="MeadiaUpldInptwrp"><input className="MediaUpldInpt"  min="1"
                                                                         onChange={(e) => this.setUpldInput(e.target.value, rowInfo, "Impression")}></input>
            </div>
        },
        {
            Header: "Upload Progress",
            accessor: "upload",
            Cell: (props) => <div className={props.original.Code ? "" : "ProgressBrWrp"}>
                {
                    props.original.Code ?
                        <span>
                            {props.original.Code == 0 ? props.original.Status : props.original.Message}
                            </span>
                        :
                        <Line percent={props.original.progress} strokeWidth="1" strokeColor="#80BBD7"
                              trailColor="#FFFFFF" className="SystUProgress"/>


                }

            </div>
        },
        {
            Header: "",
            Cell: (rowInfo) => <div style={{paddingBottom: "10px"}}><img
                src={require("../../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg1"
                onClick={() => this.deleteRow(rowInfo)}></img></div>, // Custom cell components!
            width: 35
        },

    ]


    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('scroll', this.handleClickOutside);
        this.setSwicthCol(ColumnCol, "nonGroup");

        //userList = sessionStorage.getItem("userList");

        this.comnExpDate.setDate(this.comnExpDate.getDate() + 30); // Set now + 30 days as the new date
        this.setState({expDate: this.comnExpDate});

        this.getAvailbleMediafiles();
        if (sessionStorage.getItem("userList")) {
            try {
                let userList = JSON.parse(sessionStorage.getItem("userList"));
                this.setState({userList: userList});
            } catch (err) {
                this.setState({userList: []});
            }


        } else {
            this.setState({userList: []});
        }
        this.fetchunitTypeData();
        this.fetchProviderData();
        this.getGeoZoneData();
        this.getRateCodeData();
        this.getHouseData();
        this.getAltImagesData();
        this.state.networkArray = ['None', 'CBS', 'TBS', 'TNT', 'TRUTV', 'Howard', 'LEBRON', 'thundervscavaliers', 'kingsvsrockets', 'UNITED'];

        let tempWeekData = [
            {
                dayId: 0,
                day: "Sun",
                isselected:true
            },
            {
                dayId: 1,
                day: "Mon",
                isselected:true
            },
            {
                dayId: 2,
                day: "Tue",
                isselected:true
            },
            {
                dayId: 3,
                day: "Wed",
                isselected:true
            },
            {
                dayId: 4,
                day: "Thu",
                isselected:true
            },
            {
                dayId: 5,
                day: "Fri",
                isselected:true
            },
            {
                dayId: 6,
                day: "Sat",
                isselected:true
            }

        ]

        this.setState({WeekPartArray: tempWeekData});
        this.setState({WeekPart: [1,2,3,4,5,6,0]});

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
            this.setState({grpvisibleFilters: []});
            this.setState({zoneVisibleFilters:[]})
        } else {
            console.log("inside inside");
        }
    }


    deleteRow(rowInfo) {
        let data1 = [];
        for (let i = 0; i < this.state.uplddata.length; i++) {
            if (i !== rowInfo.index) {
                data1.push(this.state.uplddata[i])
            }
        }


        this.setState({uplddata: data1})
    }
    checkFileImagesSelect(fileName){
        var extension = fileName.substring(fileName.lastIndexOf('.')+1);
        if(extension=="JPG"|| extension=="jpg"|| extension=="png"|| extension=="PNG"){
            this.setState({fScreen:1})
            return true;
        }else{
            this.setState({fScreen:0})
            return false;

        }
    }

    setSwicthCol(colData, type) {
        let dColumn = [];
        let sColumn = [];
        this.state.filterVal = [];
        colData && colData.map((key, index) => {
            this.state.filterVal.push("")
            let obj;
            if (key.accessor === "FileType") {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search
                                onChange={(e) => this.setChnlFilter(e, key, cellInfo.column.id, index, "fileType", flType)}
                                value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    //   Filter: (cellInfo) =>
                    //   <div>{
                    //       this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    //       <Search onChange={(e)=>this.setChnlFilter(e,key,cellInfo.column.id,index,"fileType",flType)} value={this.state.filterVal[index]}></Search>
                    //     }
                    //     </div>,
                    Cell: (rowInfo) => <span>{flType[rowInfo.original.FileType]}</span>

                }
            }
            else if (key.accessor === "Channel") {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search
                                onChange={(e) => this.setChnlFilter(e, key, cellInfo.column.id, index, "loopMulti", dataChannel)}
                                value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    //   Filter: (cellInfo) =>
                    //   <div>{
                    //       this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    //       <Search onChange={(e)=>this.setChnlFilter(e,key,cellInfo.column.id,index,"loopMulti",dataChannel)} value={this.state.filterVal[index]}></Search>
                    //   }
                    //   </div>,
                    Cell: (rowInfo) => <span>{dataChannel[rowInfo.original.Channel]}</span>

                }
            }
            else if (key.accessor === "IndexType") {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search
                                onChange={(e) => this.setChnlFilter(e, key, cellInfo.column.id, index, "loopMulti", loopType)}
                                value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    //   Filter: (cellInfo) =>
                    //       <div>{
                    //           this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    //           <Search onChange={(e)=>this.setChnlFilter(e,key,cellInfo.column.id,index,"loopMulti",loopType)} value={this.state.filterVal[index]}></Search>
                    //       }
                    //       </div>,
                    Cell: (rowInfo) => <span>{loopType[rowInfo.original.IndexType]}</span>

                }
            }
            else if (key.accessor === "FULLSCR_NG") {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    // Filter: (cellInfo) =>
                    //     <div>{
                    //         this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    //         <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                    //     }
                    //     </div>,
                    Cell: (rowInfo) => <span>{FScreen[rowInfo.original.FULLSCR_NG]}</span>

                }
            }
            else if (key.accessor === "Group_ADS_NAME") {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    filterMethod: (filter, row) => {
                        if(filter.value === ""){
                            return true
                        }
                        let count =0;
                        row._original.FileDetails && row._original.FileDetails.map((key,index)=>{
                            if(String(key.Group_ADS_NAME.toUpperCase().indexOf(filter.value.toUpperCase())) >=0){
                                count =1;
                            }

                        })
                        if(count === 1){
                            return true
                        }
                        return false;
                    },
                    Cell: (rowInfo) => <div>{
                        rowInfo.original.FileDetails && rowInfo.original.FileDetails.length > 0 &&
                        <div>{
                            rowInfo.original.FileDetails.map((key, index) => {
                                if (index === rowInfo.original.FileDetails.length - 1) {
                                    return <span>{key.Group_ADS_NAME}</span>
                                } else {
                                    return <span>{key.Group_ADS_NAME + ","}.</span>
                                }

                            })
                        }</div>
                    }</div>

                }

            }
            else if (key.accessor === "FileName" || key.accessor === "VBannerName" || key.accessor === "HBannerName" || key.accessor === "VFileDisplayName" || key.accessor === "HFileDisplayName") {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    filterMethod: (filter, row) => {
                        if (filter.value === "") {
                            return true
                        }
                        if (row[filter.id]) {
                            return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >= 0
                        }
                        return false;
                    },
                    //   Filter: (cellInfo) =>
                    //   <div>{
                    //       this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    //       <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                    //     }
                    //     </div>,

                    Cell: (rowInfo) => <div className="SystFlColContainer">
                        <span className="SystFlColTxt">{rowInfo.original[key.accessor]}</span>
                        {
                            key.accessor === "VBannerName" || key.accessor === "HBannerName" || key.accessor === "VFileDisplayName" || key.accessor === "HFileDisplayName" ?

                                <img
                                    onMouseMove={() => this.showImgToolTip(key.accessor === "VBannerName" || key.accessor === "VFileDisplayName" ? rowInfo.original.WebVisibleURLVBanner : rowInfo.original.WebVisibleURLHBanner)}
                                    onMouseLeave={() => this.hideImgToolTip("")}
                                    src={rowInfo.original[key.accessor] ? require("../../../Assets/Images/Media/image-preview.png") : ""}
                                    className="MediaFlColDnldImg"></img>

                                :
                                rowInfo.original.FileType === 0 ?
                                    <img src={require("../../../Assets/Images/Media/video-preview.png")}
                                         onClick={() => this.showPreview(rowInfo.original.WebVisibleURL)}
                                         className="MediaFlColDnldImg"></img>
                                    :
                                    <div></div>


                        }
                    </div>

                }
            }
            else if (key.accessor === "GeozoneIncluded") {
                obj = {
                    Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    Filter: (cellInfo) =>
                        <div>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>,
                    Cell: (rowInfo) => <div className="">
                        {
                            rowInfo.original.FileGeoZones && rowInfo.original.FileGeoZones.length > 0 &&
                            <div style={{"text-align":"center"}}>{
                                rowInfo.original.FileGeoZones.map((key, index) => {
                                    if(key.Inclusion==1){
                                        if (index === rowInfo.original.FileGeoZones.length - 1) {
                                            return <span>{key.Name}</span>
                                        } else {
                                            return <span>{key.Name + ","}.</span>
                                        }
                                    }


                                })
                            }</div>
                        }


                    </div>

                }
            }
            else if (key.accessor === "GeozoneExcluded") {
                obj = {
                    Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    Filter: (cellInfo) =>
                        <div>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>,
                    Cell: (rowInfo) => <div className="">
                        {
                            rowInfo.original.FileGeoZones && rowInfo.original.FileGeoZones.length > 0 &&
                            <div style={{"text-align":"center"}}>{
                                rowInfo.original.FileGeoZones.map((key, index) => {
                                    if(key.Inclusion==0){
                                        if (index === rowInfo.original.FileGeoZones.length - 1) {
                                            return <span>{key.Name}</span>
                                        } else {
                                            return <span>{key.Name + ","}.</span>
                                        }
                                    }


                                })
                            }</div>
                        }


                    </div>

                }
            }
            else if (key.accessor === "Geozone") {
                obj = {
                    Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                        <div>{key.lable}</div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    Filter: (cellInfo) =>
                        <div>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>,
                    Cell: (rowInfo) => <div className="SystFlColContainer geoZoneCell">
                        {
                            rowInfo.original.FileGeoZones && rowInfo.original.FileGeoZones.length > 0 &&
                            <img src={require("../../../Assets/Images/Schedule/geoZone.PNG")}
                                 className="MediaFlColDnldImg"></img>
                        }


                    </div>

                }
            }
            else if (key.accessor === "DATESTART" || key.accessor === "DATEEND" || key.accessor === "DateStart" || key.accessor === "DateEnd") {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
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
                    //       <div>{
                    //           this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                    //           <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                    //       }
                    //       </div>,
                    Cell: (rowInfo) => <div
                        className="SystFlColContainer">{this.convertDate(rowInfo.original[key.accessor])}</div>

                }
            }
            else {
                obj = {
                    Header: (cellInfo) => <div>
                        <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>
                        <div style={{position: "absolute", zIndex: 12, marginTop: "12px"}}>{
                            this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                            <Search onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                        }
                        </div>
                    </div>,
                    accessor: key.accessor,
                    show: true,
                    filterable: true,
                    filterMethod: (filter, row) => {
                        if (filter.value === "") {
                            return true
                        }
                        if (row[filter.id]) {
                            if (isNaN(row[filter.id])) {
                                return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >= 0;
                            } else {
                                return String(row[filter.id].toString().indexOf(filter.value)) >= 0;
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
            }
            dColumn.push(obj);
        });
        if (type === "nonGroup") {
            let obj = {
                Header: "",
                Cell: (rowInfo) => <div style={{paddingBottom: "10px"}}>{
                    rowInfo.original.ColorStatus !== 3 &&
                    <img src={require("../../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg1"
                         onClick={(() => this.deleteSchedFile(rowInfo.original))}></img>
                }</div>, // Custom cell components!
                width: 40
            }
            dColumn.push(obj)
            this.setState({columns: dColumn, loading: false}, () => this.getRecords("GroupADSFLFiles/Fetch"));
        } else {
            let obj1 = {
                Header: "",
                width: 10
            }
            dColumn.push(obj1)
            let obj = {
                Header: "#",
                Cell: (rowInfo) => <div className="SchedCheck"><ComCheck onChange={(e) => this.setDelete(rowInfo.index)}
                                                                         containerStyle={"ComCheckMainWrp"}
                                                                         tickStyle={"SchedCheckTick"}
                                                                         checked={false}></ComCheck></div>, // Custom cell components!
                width: 25
            }
            dColumn.splice(0, 0, obj)

            this.setState({
                switchcolumns: dColumn,
                group: true,
                loading: false
            }, () => this.getRecords("GroupADSFLFiles/Fetch"));
        }

    }

    setPrevColumns() {
        if (previewCol) {
            let dCol = [];
            this.state.filterVal = [];
            this.state.visibleFilters = [];
            previewCol.map((key, index) => {
                let obj = {}
                this.state.filterVal.push("")
                if (key.accessor === "IndexType") {
                    obj = {
                        Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>,
                        accessor: key.accessor,
                        show: true,
                        filterable: true,
                        Filter: (cellInfo) =>
                            <div>{
                                this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <MultiChoice keyData={loopType} choice={this.state.loopMulti}
                                             setChoice={(e, key) => this.setChnlFilter(e, key, cellInfo.column.id, index, "loopMulti", loopType)}></MultiChoice>
                            }
                            </div>,
                        Cell: (rowInfo) => <span>{loopType[rowInfo.original.IndexType]}</span>

                    }
                } else if (key.accessor === "FULLSCR_NG") {
                    obj = {
                        Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>,
                        accessor: key.accessor,
                        show: true,
                        filterable: true,
                        Filter: (cellInfo) =>
                            <div>{
                                this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search
                                    onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                            }
                            </div>,
                        Cell: (rowInfo) => <span>{FScreen[rowInfo.original.FULLSCR_NG]}</span>

                    }
                } else if (key.accessor === "DATESTART" || key.accessor === "DATEEND" || key.accessor === "strDATEEND" || key.accessor === "strDATESTART") {
                    obj = {
                        Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>,
                        accessor: key.accessor,
                        show: true,
                        filterable: true,
                        Filter: (cellInfo) =>
                            <div>{
                                this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search
                                    onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
                            }
                            </div>,
                        Cell: (rowInfo) => <div
                            className="SystFlColContainer">{this.convertDate(rowInfo.original[key.accessor])}</div>

                    }
                } else {
                    obj = {
                        Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.filterVal[index] === "" ?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')}
                                         className="ScheduleheadFilt"
                                         onClick={() => this.setFilter(cellInfo.column.id, index)}></img>
                            }
                        </div>,
                        accessor: key.accessor,
                        show: true,
                        filterable: true,
                        Filter: (cellInfo) =>
                            <div>{
                                this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search
                                    onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.filterVal[index]}></Search>
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

    convertDate(date) {
        if (date) {
            return moment(date).format("DD-MMM-YYYY HH:mm:ss");
        }

    }

    showImgToolTip(url) {
        console.log("call showImgToolTip", url);
        this.setState({visibletoolTip: true, tooltipImg: url});

    }

    hideImgToolTip(url) {
        console.log("call hideImgToolTip")
        this.setState({visibletoolTip: false, tooltipImg: url});

    }

    setChnlFilter(e, key, accessor, index1, type, type1) {
        let index = -1;
        for (let i = 0; i < type1.length; i++) {
            if (e.target.value !== "" && type1[i].toUpperCase().includes(e.target.value.toUpperCase())) {
                if (index === -1) {
                    index = i
                }
            }
        }
        if (index !== -1) {
            this.multicustomFilerChange(index, accessor, index1, e.target.value)
        } else {
            this.multicustomFilerChange(null, accessor, index1, e.target.value)
        }
    }

    grpsetStatusFilter(e, key, accessor, index1, type, type1) {
        let index = -1;
        for (let i = 0; i < type1.length; i++) {
            if (e.target.value !== "" && type1[i].toUpperCase().includes(e.target.value.toUpperCase())) {
                if (index === -1) {
                    index = i
                }
            }
        }
        if (index !== -1) {
            this.grpmulticustomFilerChange(index, accessor, index1, e.target.value)
        } else {
            this.grpmulticustomFilerChange(null, accessor, index1, e.target.value)
        }
    }

    getRecords(url) {
        console.log("call getRecords");
        this.setState({flLoading: true,deletData:[],channel:"0"})
        if (this.state.group === true) {
            this.setState({grpViewLoading: true})
            if (this.state.grpData && this.state.grpData.length === 0) {
                this.getGrpData("GroupADSFL/Fetch")
            } else {
                getData(tabsUrl[this.state.tabIndex] + this.state.grpId)
                    .then((res) => {
                        this.setState({data: [], flLoading: false})
                        if (res && res.data && res.data.ResponseCollection) {
                           console.log("mack",res.data.ResponseCollection)
                            this.setState({
                                data: res.data.ResponseCollection,
                                flLoading: false,
                                grpViewLoading: false,
                                systProgCnt: 0
                            }, () => {

                            })
                        } else {
                            this.setState({data: [], flLoading: false, grpViewLoading: false})
                        }
                    })
            }
        }
        else {
            let obj = {
                "startIndex": 0,
                "count": 0,
                "criteria": []
            }
            postData(url, obj)
                .then((res) => {
                    if (res && res.data && res.data.ResponseCollection) {
                        console.log("asdjalskjdlksjdlkajslkdjlk",res.data.ResponseCollection)
                        this.setState({data: res.data.ResponseCollection[0], flLoading: false}, () => {
                            if (this.state.grpData && this.state.grpData.length === 0) {
                                this.getGrpData("GroupADSFL/Fetch")
                            }
                        })
                    } else {
                        this.setState({data: [], flLoading: false})
                    }
                })
        }

    }

    getGrpData(url, type) {
        if (this.state.grpData.length === 0 || type === "get") {
            this.setState({grpLoading: true,deletData:[],grpDelete:[]})
            let obj = {
                "startIndex": 1,
                "count": 1,
                "criteria": []
            }
            postData(url, obj)
                .then((res) => {
                    this.setState({flLoading: false})
                    this.setState({grpData: []});
                    if (res && res.data && res.data.ResponseCollection) {
                        console.log("+++++++++++++++++++++", res.data.ResponseCollection)
                        this.setState({
                            grpData: res.data.ResponseCollection,
                            grp1Data: res.data.ResponseCollection,
                            grpId: res.data.ResponseCollection[0].Group_ADS_ID,
                            grpLoading: false
                        })
                        if (this.state.group) {
                            this.getRecords();
                        }
                    } else {
                        this.setState({grpData: [], grpLoading: false})
                    }
                })
        }
    }

    getGeoZoneData() {
        getData("Geozone/GetAllGeoZones/0")
            .then((res) => {
                this.setState({geoZone1Data: []});
                if (res && res.data && res.data.ResponseCollection) {
                    if (res.data.ResponseCollection.length > 0) {
                        this.setState({
                            geoZoneData: res.data.ResponseCollection,
                            geoZone1Data: res.data.ResponseCollection,
                            GeoZoneId: res.data.ResponseCollection[0].ID
                        })
                    }
                } else {
                    this.setState({geoZoneData: [], geoZone1Data: []})
                }
            })

    }

    getRateCodeData() {
        getData("Geozone/fetchRateCodes")
            .then((res) => {
                if (res && res.data && res.data.ResponseCollection) {
                    this.setState({rateCodeList: res.data.ResponseCollection})
                } else {
                    this.setState({rateCodeList: []})
                }
            })

    }

    getHouseData() {
        getData("HouseAdvDetails/GetHouseAdDetail")
            .then((res) => {
                if (res && res.data && res.data.ResponseCollection) {
                    this.setState({houseObj: res.data.ResponseCollection[0]})
                } else {
                    this.setState({houseObj: {}})
                }
            })
    }
    getAltImagesData() {
        getData("GroupADSFLFiles/FetchImagesList")
            .then((res) => {
                if (res && res.data && res.data.ResponseCollection) {
                    this.setState({altImagesData: res.data.ResponseCollection,altImage:res.data.ResponseCollection[0].TempName})
                } else {
                    this.setState({altImagesData: []})
                }
            })
    }

    deleteSchedFile(data) {
        this.setState({flLoading: true})
        let data1 = [];
        let obj;
        if (data.FileDetails) {
            for (let i = 0; i < data.FileDetails.length; i++) {
                let myObj = {
                    GROUP_ADSFL_DETAILID: data.FileDetails[i].GROUP_ADSFL_DETAILID
                }
                data1.push(myObj)
            }
        }
        if (data.FileType === 0) {
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "FileType": data.FileType,
                        "FILEID": data.FILEID,
                        "Banner1": data.Banner1,
                        "Banner2": data.Banner1,
                        "Len": data.Len,
                        "FileDetailsList": data1

                    }
                ],
                "operationCode": 2
            }
        } else {
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "FileType": data.FileType,
                        "Banner1": data.Banner1,
                        "Banner2": data.Banner1,
                        "Len": 0,
                        "RoadBlock": 0,
                        "Len": data.Len,
                        "FileDetailsList": data1
                    }
                ],
                "operationCode": 2
            }
        }
        postData("GroupADSFLFiles/Update", obj)
            .then(res => {
                if (res.data.ReturnCode === 0) {
                    this.setState({
                        dlgtitle: "Information",
                        message: "Deleted Successfully",
                        dlgType: "information",
                        dlgEnable: true
                    }, () => this.getRecords("GroupADSFLFiles/Fetch"))
                } else {
                    this.setState({flLoading: false})
                }
            })

    }

    selAllDayRow(e) {
        console.log("all checkbox value",e.target.value);
        let temparray = this.state.WeekPartArray;

        //this.state.weekAllDay=e;
         console.log("go weekAllday",this.state.weekAllDay);
        if (this.state.weekAllDay) {
            this.state.weekAllDay= false;
            this.setState({weekAllDay: false});
            temparray.forEach(function (item) {
                item.isselected = false
            })
            this.setState({WeekPart: []});
        } else {
            this.state.weekAllDay=true;
            this.setState({weekAllDay: true});
            temparray.forEach(function (item) {
                item.isselected = true
            })
            this.setState({WeekPart: [1,2,3,4,5,6,0]});
        }

        var self=this;
        setTimeout(function () {
            self.setState({WeekPartArray: temparray});
            console.log("all1",self.state.weekAllDay);
            if(self.state.editFile){
                self.state.flEditData.weekAllDay=self.state.weekAllDay;
                self.state.flEditData.Weekpart=self.state.WeekPart;
                self.state.flEditData.WeekPartArray=self.state.WeekPartArray;

            }
            console.log("edit all1",self.state.flEditData.weekAllDay);
            console.log("edit all1",self.state.flEditData.Weekpart);
            console.log("WeekPartArray",self.state.flEditData.WeekPartArray);
            console.log("flEditData",self.state.flEditData);
            self.setState({refresh: true})
        },100)





        //let self =this;
        //setTimeout(function () {
            //console.log("all3",self.state.WeekPart);
        //},5000)

    }



    selDayRow(e, data,i) {
        console.log("call selDayRow",data)
        console.log("Weekpart",this.state.flEditData.Weekpart);
        if(this.state.editFile){
            this.state.WeekPart =this.state.flEditData.Weekpart;
        }
        console.log("WeekPart",this.state.WeekPart);
        console.log(i);
        var index = this.state.WeekPart.indexOf(i);
        console.log("weeppart index",index);
        if (index >= 0) {
            this.state.WeekPart.splice(index, 1)
        } else {
            this.state.WeekPart.push(i)
        }
        console.log(this.state.WeekPart);
        if(this.state.WeekPart.length==7){
            this.setState({weekAllDay:true});
            this.state.flEditData.weekAllDay=true

        }else{
            this.setState({weekAllDay:false})
            this.state.flEditData.weekAllDay=false
        }
        let tempArr =[];
        tempArr = this.state.WeekPartArray;
        var ind = tempArr.findIndex(x => x.dayId == data.dayId);
        if(data.isselected){

            tempArr[ind].isselected=false;
        }else{
            tempArr[ind].isselected=true;
        }
        this.setState({WeekPartArray: tempArr});
        console.log("WeekPart is",this.state.WeekPart);
        console.log("tempArr length is",tempArr.length);
        console.log("at the end WeekPartArray",this.state.WeekPartArray);
        /*tempArr.forEach(function (item) {

        })*/

       /*var ind = tempArr.findIndex(x => x.dayId == data.dayId);
        if (ind >= 0) {
            tempArr.splice(ind, 1)
        } else {
            tempArr.push(data)
        }
        this.setState({WeekPartArray: tempArr});*/
    }


    selGrpRow(e, info) {
        let index = this.state.grpDelete.indexOf(info.index);
        if (index >= 0) {
            this.state.grpDelete.splice(index, 1)
        } else {
            this.state.grpDelete.push(info.index)
        }
        this.check = false;
        if (info.original.Group_ADS_ID) {
            var tempArr = [];
            tempArr = this.state.SelectedGroupIds;
            let index = tempArr.indexOf(info.original.Group_ADS_ID);
            if (index >= 0) {
                tempArr.splice(index, 1)
            } else {
                tempArr.push(info.original.Group_ADS_ID)
            }
            this.setState({SelectedGroupIds: tempArr});
        }

        console.log("SelectedGroupIds is", this.state.SelectedGroupIds)


    }

    setFilter(id, index) {
        this.setState(({visibleFilters}) => {
            let update = [...visibleFilters];
            const index = update.indexOf(id);
            index < 0 ? update.push(id) : update.splice(index, 1);
            return {visibleFilters: update};
        });
    }

    grpsetFilter(id, index) {
        this.setState(({grpvisibleFilters}) => {
            let update = [...grpvisibleFilters];
            const index = update.indexOf(id);
            index < 0 ? update.push(id) : update.splice(index, 1);
            return {grpvisibleFilters: update};
        });
    }

    zoneSetFilter(id, index) {
        this.setState(({zoneVisibleFilters}) => {
            let update = [...zoneVisibleFilters];
            const index = update.indexOf(id);
            index < 0 ? update.push(id) : update.splice(index, 1);
            return {zoneVisibleFilters: update};
        });
    }

    customFilerChange(value, accessor, index) {
        let filtered = this.state.filtered;
        let insertNewFilter = 1;
        this.state.filterVal[index] = value
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
            filtered.push({id: accessor, value: value});
        }
        let newFilter = filtered.map((key, index) => {
            let temp1 = Object.assign({}, key);
            return temp1;
        })
        this.setState({filtered: newFilter});
    }

    multicustomFilerChange(value, accessor, index, indexvalue) {
        let filtered = this.state.filtered;
        let insertNewFilter = 1;
        this.state.filterVal[index] = indexvalue
        if (filtered.length) {
            filtered.forEach((filter, i) => {
                if (value !== null) {
                    if (filter["id"] === accessor) {
                        if (indexvalue === "" || !indexvalue.length) {
                            filtered.splice(i, 1);

                        } else {
                            filter["value"] = value;

                            insertNewFilter = 0;
                        }

                    }
                } else {
                    if (filter["id"] === accessor) {
                        if (indexvalue === "" || !indexvalue.length) {
                            filtered.splice(i, 1);

                        } else {
                            filter["value"] = indexvalue;
                            insertNewFilter = 0;
                        }

                    }
                }
            });
        }

        if (insertNewFilter) {
            if (value !== null) {
                filtered.push({id: accessor, value: value});
            } else {
                filtered.push({id: accessor, value: indexvalue});
            }
        }
        let newFilter = filtered.map((key, index) => {
            let temp1 = Object.assign({}, key);
            return temp1;
        })
        this.setState({filtered: newFilter});
    }

    grpmulticustomFilerChange(value, accessor, index, indexvalue) {
        let filtered = this.state.grpfiltered;
        let insertNewFilter = 1;
        this.state.grpfilterVal[index] = indexvalue
        if (filtered.length) {
            filtered.forEach((filter, i) => {
                if (value !== null) {
                    if (filter["id"] === accessor) {
                        if (indexvalue === "" || !indexvalue.length) {
                            filtered.splice(i, 1);

                        } else {
                            filter["value"] = value;

                            insertNewFilter = 0;
                        }

                    }
                } else {
                    if (filter["id"] === accessor) {
                        if (indexvalue === "" || !indexvalue.length) {
                            filtered.splice(i, 1);

                        } else {
                            filter["value"] = indexvalue;
                            insertNewFilter = 0;
                        }

                    }
                }
            });
        }

        if (insertNewFilter) {
            if (value !== null) {
                filtered.push({id: accessor, value: value});
            } else {
                filtered.push({id: accessor, value: indexvalue});
            }
        }
        let newFilter = filtered.map((key, index) => {
            let temp1 = Object.assign({}, key);
            return temp1;
        })
        this.setState({grpfiltered: newFilter});
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
            filtered.push({id: accessor, value: value});
        }
        let newFilter = filtered.map((key, index) => {
            let temp1 = Object.assign({}, key);
            return temp1;
        })
        this.setState({grpfiltered: newFilter});
    }

    zonecustomFilerChange(value, accessor, index) {
        let filtered = this.state.zonefiltered;
        let insertNewFilter = 1;
        this.state.zonefilteval[index] = value
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
            filtered.push({id: accessor, value: value});
        }
        let newFilter = filtered.map((key, index) => {
            let temp1 = Object.assign({}, key);
            return temp1;
        })
        this.setState({zonefiltered: newFilter});
    }


    getPreviewData() {
        if (this.state.SelectedGroupIds && this.state.SelectedGroupIds.length > 0) {
            let Str = "";
            for (let i = 0; i < this.state.SelectedGroupIds.length; i++) {
                if (i === this.state.SelectedGroupIds.length - 1) {
                    Str = Str + this.state.SelectedGroupIds[i]
                } else {
                    Str = Str + this.state.SelectedGroupIds[i] + ","
                }
            }
            getData("PreviewLoop/FetchPreviewLoop/" + Str)
                .then(res => {
                    if (res.data.ResponseCollection) {
                        console.log(res.data.ResponseCollection);
                        this.setState({prevData: res.data.ResponseCollection, previewLoop: true})
                    } else {
                        this.setState({prevData: [], previewLoop: true})
                    }
                })
        } else {
            this.setState({
                dlgtitle: "Information",
                message: "Please select groups",
                dlgType: "information",
                dlgEnable: true,
                previewLoop: false
            })
        }

    }

    setGroupInf(rowInfo) {
        if (rowInfo) {
            this.setState({groupName: rowInfo.original["Group_ADS_Name"], grpIndex: rowInfo.index});
            //console.log(" cab count",rowInfo.original[rowInfo.index].AsssociatedCabCount)
            console.log(" cab count", rowInfo.original)
        }
    }

    setColumn = (e, stateval) => {
        var myData = this.state[stateval];
        this.temp = this.state[stateval]
        const newData = myData.map((key, index) => {
            let temp = Object.assign({}, key);
            if (index === e.index) {
                temp.show = e.status;
            }
            return temp;
        })
        this.state[stateval] = newData
        this.setState({refresh: true})
    }

    resetColmn(e, stateval) {
        if (e === 'close' && this.temp && this.temp.length) {
            const newData = this.temp.map((key, index) => {
                let temp1 = Object.assign({}, key);
                return temp1;
            })
            this.state[stateval] = newData
        }
        this.setState({columnSt: false})
    }

    setGroup(val) {
        if (val) {
            this.setState({
                group: val,
                columnSt: false,
                loading: true,
                columnSt: false,
                grpFileView: false,
                collapse: true,
                grpDelete: [],
                flEditData: [],
                FlDtIndex: 0
            }, () => this.setSwicthCol(swictCol[this.state.tabIndex], "Group"))
        } else {
            this.setState({
                group: val,
                columnSt: false,
                loading: true,
                columnSt: false,
                grpFileView: false,
                collapse: false,
                grpDelete: [],
                flEditData: [],
                FlDtIndex: 0
            }, () => this.setSwicthCol(ColumnCol, "nonGroup"))
        }
    }

    setFlDetails(index, value, colapse) {
        if (colapse && this.state.schedBtm) {
            this.setState({schedBtm: !this.state.schedBtm, FlDtTabIndex: index})
        } else if(this.state.data && this.state.data.length > 0) {
            let dColumn = [];
            this.state.subTabFilterVal=[];
            subTCol[index].map((key, index) => {
                this.state.subTabFilterVal.push("")
                let obj = {};
                if (key.accessor === "DATESTART" || key.accessor === "DATEEND" || key.accessor === "DateStart" || key.accessor === "DateEnd") {
                    obj = {
                        Header: (cellInfo) => <div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.subTabFilterVal[index] === ""?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setSubTabFilter(cellInfo.column.id,index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setSubTabFilter(cellInfo.column.id,index)}></img>
                            }
                        </div>,
                        accessor: key.accessor,
                        show: true,
                        filterable: true,
                        Filter: (cellInfo) =>
                            <div>{
                                this.state.subTabVisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search
                                    onChange={(e) => this.customFilerChange(e.target.value, cellInfo.column.id, index)}
                                    value={this.state.subTabFilterVal[index]}></Search>
                            }
                            </div>,
                        Cell: (rowInfo) => <div
                            className="SystFlColContainer">{this.convertDate(rowInfo.original[key.accessor])}</div>

                    }
                } else if (key.accessor === "FULLSCR_NG") {
                    obj = {
                        Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.subTabFilterVal[index] === ""?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setSubTabFilter(cellInfo.column.id,index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setSubTabFilter(cellInfo.column.id,index)}></img>
                            }
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        filterable:true,
                        Filter: (cellInfo) =>
                            <div>{
                                this.state.subTabVisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.customsubTabFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.subTabFilterVal[index]}></Search>
                            }
                            </div>,
                        Cell:(rowInfo)=><span>{FScreen[rowInfo.original.FULLSCR_NG]}</span>

                    }
                } else {
                    obj = {
                        Header: (cellInfo)=><div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.subTabFilterVal[index] === ""?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setSubTabFilter(cellInfo.column.id,index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setSubTabFilter(cellInfo.column.id,index)}></img>
                            }
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        filterable:true,
                        Filter: (cellInfo) =>
                            <div>{
                                this.state.subTabVisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.customsubTabFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.subTabFilterVal[index]}></Search>
                            }
                            </div>

                    }
                }
                dColumn.push(obj);
            });
            this.setState({btmCol: dColumn, schedBtm: true, FlDtTabIndex: index})
        }
    }

    customsubTabFilerChange(value, accessor, index) {
        let filtered = this.state.subTabFiltered;
        let insertNewFilter = 1;
        this.state.subTabFilterVal[index] = value
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
        this.setState({ subTabFiltered: newFilter});
    }

    setSubTabFilter(id,index){
        this.setState(({ subTabVisibleFilters }) => {
            let update = [...subTabVisibleFilters];
            const index = update.indexOf(id);
            index < 0 ? update.push(id) : update.splice(index, 1);
            return { subTabVisibleFilters: update };
        });
    }

    filterMedia(type, value, serachby) {
        let UploadedBy = this.state.uploadby
        let FilteredBackupFileList = [];
        let uploadByArray = [];
        let filenamesArray = [];
        let tagArray = [];
        let searchbyFile = this.state.searchbyFile;
        let searchTag = this.state.tags
        if (UploadedBy >= 0) {
            FilteredBackupFileList = this.state.filteredBackFileList;
            if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
                FilteredBackupFileList.forEach(function (item) {
                    console.log(UploadedBy + "item.UserID" + item.UserID);
                    if (item.UserID == UploadedBy) {
                        uploadByArray.push(item);
                    }
                });
            }


            if (serachby == "file" || serachby == "uploadedBy") {
                FilteredBackupFileList = uploadByArray;
                if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
                    FilteredBackupFileList.forEach(function (item) {
                        if (searchTag) {
                            if (item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        } else {
                            if (item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        }
                    });
                }
            }
            else if (serachby == "tag" || serachby == "uploadedBy") {
                FilteredBackupFileList = uploadByArray;
                if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
                    FilteredBackupFileList.forEach(function (item) {
                        if (searchbyFile) {
                            if (item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        } else {
                            if (item.Tag.toUpperCase().includes(searchTag.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        }
                    });
                }
            } else {
                filenamesArray = uploadByArray
            }

            this.setState({loadFileData: filenamesArray});
        } else {
            uploadByArray = this.state.filteredBackFileList
            if (serachby == "file" || serachby == "uploadedBy") {
                FilteredBackupFileList = uploadByArray;
                if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
                    FilteredBackupFileList.forEach(function (item) {
                        if (searchTag) {
                            if (item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        } else {
                            if (item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        }
                    });
                }
            }
            else if (serachby == "tag" || serachby == "uploadedBy") {
                FilteredBackupFileList = uploadByArray;
                if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
                    FilteredBackupFileList.forEach(function (item) {
                        if (searchbyFile) {
                            if (item.Tag.toUpperCase().includes(searchTag.toUpperCase()) && item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        } else {
                            if (item.Tag.toUpperCase().includes(searchTag.toUpperCase())) {

                                filenamesArray.push(item);
                            }
                        }
                    });
                }
            } else {
                filenamesArray = uploadByArray
            }
            this.setState({loadFileData: filenamesArray});
        }


    }

    loadFiles(type, type1,) {
        this.filterType = type;
        this.filterType1 = type1;
        let BackupFileList = [];
        BackupFileList = this.state.loadFileBackupData;
        let filterList = []
        if (BackupFileList && BackupFileList.length > 0) {
            BackupFileList.forEach(function (item) {
                if (item.ContentTypeID == type || item.ContentTypeID == 7 || item.ContentTypeID == "7") {
                    filterList.push(item)
                }
            });
            filterList.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.Dated) - new Date(a.Dated);
            });
        }
        this.setState({loadFileData: filterList, loadFile: true, filteredBackFileList: filterList});
        console.log("load data", this.state.loadFileData);

        //this.filterMedia(type,this.state.uploadby,"uploadedBy");
        /*this.setState({loadFile:true});
         let obj ={
         "startIndex":0,
         "count":0,
         "criteria":[]
         }
         postData("FileUpload/Fetch",obj)
         .then((res)=>{
         if(res.data && res.data.ResponseCollection){
         this.setState({loadFileData:res.data.ResponseCollection},()=>{
         })
         }else{
         this.setState({loading:false})
         }
         })*/
    }

    getAvailableMicrisites() {
        let obj = {
            "fileTypes": null,
            "filenames": "",
            "regularExpression": null,
            "isConsiderExpiry": false,
            "fetchTimeStamp": null,
            "dtFetchTimeStamp": null,
            "strFileName": "",
            "ContentFileType": 0,
            "Tag": null,
            "UserID": 0,
            "UnitType": 0,
            "strFromDate": null,
            "strToDate": null,
            "OwnerID": -1, // -1= ALL
            "ExpiryFlag": 0, // 0=Non Expired, 1= Expired, -1=ALL
            "ContentType": 4,
            "GroupID": 0
        }
        postData("FileUpload/FetchFiles", obj)
            .then((res) => {
                if (res.data && res.data.ResponseCollection) {
                    this.setState({micrositeList: res.data.ResponseCollection}, () => {
                    })
                }
            })
    }

    getAvailbleMediafiles() {
        let obj = {
            "startIndex": 0,
            "count": 0,
            "criteria": []
        }
        postData("FileUpload/Fetch", obj)
            .then((res) => {
                if (res.data && res.data.ResponseCollection) {
                    console.log("avail file data", res.data.ResponseCollection);
                    this.setState({loadFileData: res.data.ResponseCollection})
                    this.setState({loadFileBackupData: res.data.ResponseCollection})
                    let micrositeArray = [];
                    if (res.data.ResponseCollection && res.data.ResponseCollection.length > 0) {
                        res.data.ResponseCollection.forEach(function (item) {
                            if (item.ContentTypeID == 4) {
                                micrositeArray.push(item);
                            }
                        });
                        this.setState({micrositeList: micrositeArray});
                        console.log("microsite list", micrositeArray);
                    }
                }
            })
    }

    getThumnail(url) {
        //console.log("thumnail ulr is",url);
        if (url) {
            var ext = url.substr(0, url.lastIndexOf('.'));
            ext = ext + ".jpg";
            return ext;
        } else {
            return "";
        }

    }

    setFullScreenOpt(e) {
        if (e.target.value == 1) {
            if (this.addobj.WebVisibleURLHBanner || this.addobj.WebVisibleURLVBanner) {
                //alert('tumhich');
                var msg = "Full Screen option cannot be selected 'True' when banners are associated";
                this.setState({dlgtitle: "Information", message: msg, dlgType: "information", schedVal: true});
            } else {
                this.setState({fScreen: e.target.value})
            }
        } else {
            this.setState({fScreen: e.target.value})
        }
        console.log("0 banner value", this.addobj.WebVisibleURLHBanner);
        console.log("1 banner value", this.addobj.WebVisibleURLVBanner);

    }

    setLoadFile(data) {
        console.log("data is",this.filterType)
        console.log("check type of file is",data);
        if (this.filterType === 1) {
            if (this.state.schedVideo) {
                this.addobj.WebVisibleURL = data.WebVisibleURL;
                this.addobj.FileName = data.TempName;
                this.addobj["FILEID"] = data.FileID;
                this.state.fLength = data.Length;
                this.addobj["FileType"]=data.FileType
            } else {
                this.state.flEditData.WebVisibleURL = data.WebVisibleURL;
                this.state.flEditData.FileName = data.TempName;
                this.state.flEditData.FILEID = data.FileID
                this.state.flEditData.Len = data.Length;
                this.state.flEditData.FileType=data.FileType
            }

            var extension = data.TempName.substring(data.TempName.lastIndexOf('.')+1);

            if(data.ContentTypeID == "7" && data.TempName.substring(0,2).toUpperCase()=="TT"){
                this.setState({fScreen:1});
                this.setState({imgfileselected:true});

            }else{
                this.setState({fScreen:0})
                this.setState({imgfileselected:false});


            }

            var extension =  data.TempName.substring( data.TempName.lastIndexOf('.')+1);
            console.log("edit extension",extension);
            if(extension){
                if(extension.toLowerCase()=="wmv" || extension.toLowerCase()=="mp4"){
                    this.state.isDisableDruration=true;
                    this.state.isImage=0;
                }else{
                    this.state.isDisableDruration=false;
                    this.state.isImage=1;
                    if (this.state.schedVideo) {
                        this.state.fLength =15
                    }else{
                        this.state.flEditData.Len = 15;
                    }
                }
            }


            console.log("this.state.isDisableDruration",this.state.isDisableDruration)

        }

         else if (this.filterType === 2) {
            if (this.state.schedVideo) {
                this.addobj.WebVisibleURLHBanner = data.WebVisibleURL;
                this.addobj.HBannerName = data.TempName;
                this.addobj["Banner2"] = data.FileID;

                this.addobj.WebVisibleURLVBanner = "";
                this.addobj.VBannerName = "";
                this.addobj.Banner1 = 0;
                this.addobj["FileType"]=data.FileType
            } else if (this.state.schedBanner) {
                this.addobj.WebVisibleURLHBanner = data.WebVisibleURL;
                this.addobj.HBannerName = data.TempName;
                this.addobj["Banner2"] = data.FileID
                this.addobj["FileType"]=data.FileType
            } else {
                this.state.flEditData.WebVisibleURLHBanner = data.WebVisibleURL;
                this.state.flEditData.HBannerName = data.TempName;
                this.state.flEditData.Banner2 = data.FileID;

                this.state.flEditData.WebVisibleURLVBanner = "";
                this.state.flEditData.VBannerName = "";
                this.state.flEditData.Banner1 = 0;
                this.state.flEditData.FileType=data.FileType
            }







        } else if (this.filterType === 3) {
            if (this.state.schedVideo) {
                this.addobj.WebVisibleURLVBanner = data.WebVisibleURL;
                this.addobj.VBannerName = data.TempName;
                this.addobj["Banner1"] = data.FileID;

                this.addobj.WebVisibleURLHBanner = "";
                this.addobj.HBannerName = "";
                this.addobj.Banner2 = 0;
                this.addobj["FileType"]=data.FileType

            } else if (this.state.schedBanner) {
                this.addobj.WebVisibleURLVBanner = data.WebVisibleURL;
                this.addobj.VBannerName = data.TempName;
                this.addobj["Banner1"] = data.FileID
                this.addobj["FileType"]=data.FileType
            } else {
                this.state.flEditData.WebVisibleURLVBanner = data.WebVisibleURL;
                this.state.flEditData.VBannerName = data.TempName;
                this.state.flEditData.Banner1 = data.FileID;

                this.state.flEditData.WebVisibleURLHBanner = "";
                this.state.flEditData.HBannerName = "";
                this.state.flEditData.Banner2 = 0;
                this.state.flEditData.FileType=data.FileType
            }



        }
        this.setState({loadFile: false})
    }

    setHouseAd(data) {
        if (this.filterType === 2) {
            this.state.houseObj["FileDisplayName"] = data.FileName;
            this.state.houseObj["FileID"] = data.FileID;
            this.state.houseObj["WebVisibleURLHBanner"] = data.WebVisibleURL;

        } else if (this.filterType === 3) {
            this.state.houseObj["VFileDisplayName"] = data.FileName;
            this.state.houseObj["FileID_V"] = data.FileID;
            this.state.houseObj["WebVisibleURLVBanner"] = data.WebVisibleURL;
        }
        this.setState({loadFile: false})
    }

    removeHouseAdd(type) {
        if (type === 2) {
            this.state.houseObj["FileDisplayName"] = null;
            this.state.houseObj["FileID"] = -1;
            this.state.houseObj["WebVisibleURLHBanner"] = null;

        } else if (type === 3) {
            this.state.houseObj["VFileDisplayName"] = null;
            this.state.houseObj["FileID_V"] = -1;
            this.state.houseObj["WebVisibleURLVBanner"] = null;
        }
        this.setState({refresh: true})
    }

    upDateHouseAd() {
        postData("HouseAdvDetails/AddHouseAdDetail", this.state.houseObj)
            .then(res => {
                if (res.data && res.data.ReturnCode === 0) {
                    this.setState({
                        dlgtitle: "Information",
                        message: "Configured Successfully",
                        dlgType: "information",
                        dlgEnable: true,
                        houseAd: false,
                        houseObj: {}
                    }, () => this.getHouseData())
                } else {
                    this.setState({
                        dlgtitle: "Information",
                        message: "Failed please try again",
                        dlgType: "information",
                        dlgEnable: true,
                        houseAd: false,
                        houseObj: {}
                    }, () => this.getHouseData())
                }
            })
    }

    checkAutoDispaly(e) {
        console.log("call check", this.state.VideoMicrosite);
        console.log("call check", e.target);
        let Microsite;
        if (this.state.editFile) {
            if (this.state.flEditData.VideoMicrosite) {
                this.state.flEditData.VideoMicrosite = false;
                this.setState({VideoMicrosite: false});

            } else {
                Microsite = this.state.flEditData.Microsite;
                if (Microsite && Microsite > 0) {
                    this.state.flEditData.VideoMicrosite = true;
                    this.state.flEditData.WebVisibleURLHBanner = "";
                    this.state.flEditData.WebVisibleURLVBanner = "";
                    this.state.flEditData.HBannerName = "";
                    this.state.flEditData.VBannerName = "";
                    this.state.flEditData.Banner1 = 0;
                    this.state.flEditData.Banner2 = 0;
                    this.setState({fScreen: 1});
                    this.setState({VideoMicrosite: true});
                } else {
                    //alert("Please select microsite");
                    this.state.flEditData.VideoMicrosite = false;
                    this.setState({VideoMicrosite: false});
                    let msg = "Please select microsite";
                    this.setState({dlgtitle: "Information", message: msg, dlgType: "information", schedEdit: true});
                }
            }
        } else {
            if (this.state.VideoMicrosite) {
                this.setState({VideoMicrosite: false});
            }
            else {
                Microsite = this.state.mSite;
                if (Microsite && Microsite > 0) {
                    this.setState({VideoMicrosite: true});
                    this.addobj.WebVisibleURLHBanner = "";
                    this.addobj.WebVisibleURLVBanner = "";
                    this.addobj.HBannerName = "";
                    this.addobj.VBannerName = "";
                    this.addobj.Banner1 = 0;
                    this.addobj.Banner2 = 0;
                    this.setState({fScreen: 1});
                } else {
                    //alert("Please select microsite");
                    this.setState({VideoMicrosite: false});
                    let msg = "Please select microsite";
                    this.setState({dlgtitle: "Information", message: msg, dlgType: "information", schedVal: true});
                }
            }
        }


    }

    resetEditState() {

        this.setState({editGrFile: false, editFile: false, data: this.state.data});
        this.setState({timeSrthr: 0, timeSrtmin: 0, timeEndhr: 23, timeEndmin: 59});
        this.setState({flEditData: {},tempremoveGeozone:[], geoZone2Data:[],geoZoneIncluded:false,geoZoneExcluded:false, typeL: 0, provider: 0, fScreen: 0,enableAltImge:false});
        this.getRecords("GroupADSFLFiles/Fetch");
    }

    addDeails() {
        console.log("flEditData is", this.state.flEditData);
        let url = "GroupADSFLFiles/Update";
        let msg = "";
        if (this.state.flEditData.WebVisibleURLHBanner !== "" || this.state.flEditData.WebVisibleURLVBanner !== "") {
            if (this.state.fScreen == 1) {
                msg = "Banners not allowed in Full Screen";
            }
        }
        //datevalidation
        let stDate = new Date(this.state.dateStart).getTime();
        let endDate = new Date(this.state.dateEnd).getTime();
        let currentDate = new Date();
        currentDate = new Date(currentDate).setHours(0);
        currentDate = new Date(currentDate).setMinutes(0);
        currentDate = new Date(currentDate).getTime();

        if (endDate < stDate) {
            msg = "End Date can't less than start Date";
        }
        let obj = {}
        if (msg === "") {
            var FileDetailsList = [{
                "GROUP_ADSFL_DETAILID": this.state.flEditData.GROUP_ADSFL_DETAILID
            }]
            var FileGroupsList = [{
                "Group_ADS_ID": this.state.flEditData.GROUP_ADS_ID
            }]
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "FileType": this.state.flEditData.FileType,
                        "FILEID": this.state.flEditData.FileType === 0 ? this.state.flEditData.FILEID : 0,
                        "FileDetailsList": this.state.flEditData.FileDetails,
                        "IndexType": this.state.flEditData.IndexType,
                        "Len": parseInt(this.state.fLength),
                        "Banner1": this.state.flEditData.Banner1,
                        "Banner2": this.state.flEditData.Banner2,
                        "Channel": parseInt(this.state.channel),
                        "FileGroupsList": this.state.flEditData.FileGroups,
                        "ORDERLOOP": this.state.order,
                        "strDATEEND": moment(this.state.dateEnd).format("ddd MMM DD YYYY"),
                        "TIMEEND": this.state.timeEndhr + ":" + this.state.timeEndmin,
                        "strDATESTART": moment(this.state.dateStart).format("ddd MMM DD YYYY"),
                        "TIMESTART": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                        "FULLSCR_NG": this.state.fScreen,
                        "Type": 0,
                        "Microsite": this.state.flEditData.Microsite,
                        "VideoMicrosite": this.state.flEditData.VideoMicrosite,
                        "Provider": this.state.flEditData.Provider,
                    }
                ],
                "operationCode": 0
            }

            postData(url, obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Update Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                            btmDetails: false,
                            flEditData: []
                        }, () => this.getRecords("GroupADSFLFiles/Fetch"))
                        this.resetEditState();
                    } else {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Failed please try again",
                            dlgType: "information",
                            dlgEnable: true,
                            btmDetails: false,
                            flEditData: []
                        }, () => this.getRecords("GroupADSFLFiles/Fetch"))
                    }
                })
        } else {
            this.setState({dlgtitle: "Information", message: msg, dlgType: "information", schedEdit: true});
        }
    }

    editLoadFile() {
        console.log("edit dta", this.state.flEditData);

        let url = "GroupADSFLFiles/Update";

        if (this.state.editGrFile) {
            if (this.state.flEditData.FileType == 0) {
                url = "GroupAds_Flash_Video/EditVideo";
            } else {
                url = "GroupAds_Flash_Banner_Group/EditBanner";
            }

        }

        var extension = this.state.flEditData.FileName.substring(this.state.flEditData.FileName.lastIndexOf('.')+1);
        if(extension.toLowerCase()=="wmv" || extension.toLowerCase()=="mp4"){
            this.state.isImage=0;
        }else{
            this.state.isImage=1;
        }

        let msg = "";
        let type = this.state.flEditData.FileType;
        if (this.state.flEditData.WebVisibleURL == null) {
            this.state.flEditData.WebVisibleURL = "";
        }
        if (this.state.flEditData.WebVisibleURLHBanner == null) {
            this.state.flEditData.WebVisibleURLHBanner = "";
        }
        if (this.state.flEditData.WebVisibleURLVBanner == null) {
            this.state.flEditData.WebVisibleURLVBanner = "";
        }
        this.fileType = "";
        if (type === 0 && this.state.flEditData.WebVisibleURL === "") {
            msg = "Please Select video file"
        }

        if (this.state.flEditData.WebVisibleURLHBanner !== "" || this.state.flEditData.WebVisibleURLVBanner !== "") {
            if (this.state.fScreen == 1) {
                msg = "Banners not allowed in Full Screen";
            }
        }
         //// for temgeozone removing
        var tempremoveGeo= this.state.tempremoveGeozone;
        var GROUP_ADSFL_DETAILID = this.state.flEditData.GROUP_ADSFL_DETAILID;
         if(tempremoveGeo && tempremoveGeo.length>0){
             tempremoveGeo.forEach(function (item) {
                 item["GROUP_ADSFL_DETAILID"] = GROUP_ADSFL_DETAILID;
                 item.Group_ADS_ID = item.GROUP_ADS_ID;
             })
         }


        //datevalidation
        let stDate = new Date(this.state.dateStart).getTime();
        let endDate = new Date(this.state.dateEnd).getTime();
        let currentDate = new Date();
        currentDate = new Date(currentDate).setHours(0);
        currentDate = new Date(currentDate).setMinutes(0);
        currentDate = new Date(currentDate).getTime();

        if (endDate < stDate) {
            msg = "End Date can't less than start Date";
        }


        if (msg === "") {
            let videoMicrosite = 0;
            let provider = "";
            let fScreen = 0;
            if (this.state.flEditData.VideoMicrosite) {
                videoMicrosite = 1;
            }
            if (this.state.fScreen == true || this.state.fScreen == "1" || this.state.fScreen == 1) {
                fScreen = 1;
            }
            if (this.state.provider) {
                if (this.state.providerData && this.state.providerData.length > 0) {
                    var providerid = this.state.provider;
                    this.state.providerData.forEach(function (item) {
                        if (item.Provider_ID == providerid) {
                            provider = item.Provider_Name;
                        }
                    });
                }
            }
            let Weekpart="";

            if(this.state.flEditData.Weekpart && this.state.flEditData.Weekpart.length>0){
                Weekpart="";
                this.state.flEditData.Weekpart.forEach(function (item) {
                    Weekpart +=item+",";
                })
                Weekpart = Weekpart.substring(0,Weekpart.length-1);
            }
            let FileGeoZones=null;
            if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
                FileGeoZones=[]
                //let tempArr =this.state.geoZone2Data;
                let self = this;
                this.state.geoZone2Data.forEach(function (item) {
                    item.UploadFile_ID=self.state.flEditData.FILEID;
                    if(self.state.geoZoneIncluded){
                        item.Inclusion=1;
                    }else{
                        item.Inclusion=0;
                    }
                    FileGeoZones.push(item);
                });
            }
            let altImgValue="";

            if(this.state.flEditData.Network=="UNITED"){
                altImgValue = this.state.altImage
            }else{
                altImgValue = ""
            }
            let obj = {};
            if (this.state.editGrFile) {
                if (this.state.flEditData.FileType == 0) {
                    obj = {
                        "editGROUP_ADSFL_Video": {
                            "FileType": this.state.flEditData.FileType,
                            "FILEID": this.state.flEditData.FileType === 0 ? this.state.flEditData.FILEID : 0,
                            "Priority": this.state.flEditData.Priority,
                            "FileDetailsList": this.state.flEditData.FileDetails,
                            "IndexType": this.state.flEditData.IndexType,
                            "Len": this.state.flEditData.Len,
                            "Banner1": this.state.flEditData.Banner1,
                            "Banner2": this.state.flEditData.Banner2,
                            "Microsite": this.state.flEditData.Microsite,
                            "Channel": parseInt(this.state.channel),
                            "VideoMicrosite": videoMicrosite,
                            "FileGroupsList": this.state.flEditData.FileGroups,
                            "FileGeoZonesNew": FileGeoZones,
                            "ORDERLOOP": this.state.order,
                            "strDATESTART": moment(this.state.flEditData.DATESTART).format("ddd MMM DD YYYY"),
                            "TIMESTART": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                            "strDATEEND": moment(this.state.flEditData.DATEEND).format("ddd MMM DD YYYY"),
                            "TIMEEND": this.state.timeEndhr + ":" + this.state.timeEndmin,
                            "FULLSCR_NG": fScreen,
                            "Provider": provider,
                            "GROUP_ADSFL_DETAILID": this.state.flEditData.GROUP_ADSFL_DETAILID,
                            "GROUP_ADS_ID": this.state.flEditData.GROUP_ADS_ID,


                            "Network":this.state.flEditData.Network?this.state.flEditData.Network:"None",
                            "IsImage":this.state.isImage,
                            "Weekpart":Weekpart,
                            "PlayerMode":0,
                            "AltImage":altImgValue,//this.state.altImage,//setalt1
                            "TempFileGeoZonesList":tempremoveGeo,


                        },
                        "isEndDateModified": false
                    }
                } else {
                    obj = {
                        "editGROUP_ADSFL_Banner": {
                            "ID": this.state.flEditData.ID,
                            "GroupAdsId": this.state.flEditData.GroupAdsId,
                            "FileId": this.state.flEditData.FileId,
                            "RoadBlock": this.state.flEditData.Microsite,
                            "EndDate": moment(this.state.flEditData.DATEEND).format("ddd MMM DD YYYY"),
                            "TimeEnd": this.state.timeEndhr + ":" + this.state.timeEndmin,
                            "FileId_V": this.state.flEditData.Banner1,
                            "FileId_H": this.state.flEditData.Banner2,
                            "Length": this.state.flEditData.Len ? this.state.flEditData.Len : this.state.fLength,
                            "SurveyID": this.state.flEditData.SurveyID,
                            "OrderLoop": this.state.order,
                            "TimeStart": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                            "StartDate": moment(this.state.flEditData.DATESTART).format("ddd MMM DD YYYY"),
                            "URL": this.state.flEditData.URL,
                            "Channel": parseInt(this.state.channel),
                            "TempFileGeoZonesList":tempremoveGeo
                        },
                        "isFileModified": false
                    }
                }

            }
            else {
                obj = {
                    "arrGroupADSL_VideoVO": [
                        {
                            "FileType": this.state.flEditData.FileType,
                            "FILEID": this.state.flEditData.FileType === 0 ? this.state.flEditData.FILEID : 0,
                            "Priority": this.state.flEditData.Priority,
                            "FileDetailsList": this.state.flEditData.FileDetails,
                            "IndexType": this.state.flEditData.IndexType,
                            "Len": parseInt(this.state.fLength),
                            "Banner1": this.state.flEditData.Banner1,
                            "Banner2": this.state.flEditData.Banner2,
                            "Microsite": this.state.flEditData.Microsite,
                            "Channel": parseInt(this.state.channel),
                            "VideoMicrosite": videoMicrosite,
                            "FileGroupsList": this.state.flEditData.FileGroups,
                            "FileGeoZonesNew": FileGeoZones,
                            "ORDERLOOP": this.state.order,
                            "strDATESTART": moment(this.state.flEditData.DATESTART).format("ddd MMM DD YYYY"),
                            "TIMESTART": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                            "strDATEEND": moment(this.state.flEditData.DATEEND).format("ddd MMM DD YYYY"),
                            "TIMEEND": this.state.timeEndhr + ":" + this.state.timeEndmin,
                            "FULLSCR_NG": fScreen,
                            "Provider": provider,
                            "GROUP_ADSFL_DETAILID": this.state.flEditData.GROUP_ADSFL_DETAILID,
                            "GROUP_ADS_ID": this.state.flEditData.GROUP_ADS_ID,
                            "Network":this.state.flEditData.Network?this.state.flEditData.Network:"None",
                            "IsImage":this.state.isImage,
                            "Weekpart":Weekpart,
                            "PlayerMode":0,
                            "AltImage":altImgValue,//this.state.altImage,//setalt2
                            "TempFileGeoZonesList":tempremoveGeo




                        }
                    ],
                    "operationCode": 1
                }
            }

            postData(url, obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Update Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                            editFile: false,
                            editGrFile: false,
                            flEditData: [],
                            geoZone2Data:[],
                            geoZoneIncluded:false,
                            geoZoneExcluded:false,
                            tempremoveGeozone:[],
                            order:1,
                            isImage:0
                        }, () => this.getRecords("GroupADSFLFiles/Fetch"))
                        this.resetEditState();
                    } else {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Failed please try again",
                            dlgType: "information",
                            dlgEnable: true,
                            editFile: false,
                            flEditData: [],
                            geoZone2Data:[],
                            geoZoneIncluded:false,
                            geoZoneExcluded:false,
                            tempremoveGeozone:[]
                        }, () => this.getRecords("GroupADSFLFiles/Fetch"))
                    }
                })
        } else {

            this.setState({dlgtitle: "Information", message: msg, dlgType: "information", schedEdit: true});
        }

    }

    onFileChange(e) {
        this.state.selectedFiles = e.target.files
        let myData = [];

        for (var x = 0; x < e.target.files.length; x++) {
            var date = new Date(); // Now
            date.setDate(date.getDate() + 30);
            let obj = {
                "FileName": e.target.files[x].name,
                "expDate": date,
                "FileSize":e.target.files[x].size,
                "upload": "0"
            }
            myData.push(obj)
        }
        this.setState({fileUplaodLoding: false});
        this.setState({uplddata: myData})
    }

    getExpDate(rowInfo) {
        var date = rowInfo.original.expDate;
        console.log("o date", date);
        date = new Date(date);
        return date;
    }

    setUpldInput(val, rowInfo, type) {
        if (type === "ExpDate") {
            var temdata = [];
            temdata = this.state.uplddata;
            this.setState({expDate: val})
            //let dt1 = new Date(val);
            let dt1 = moment(val).format('MM-DD-YYYY');
            let dt2 = moment().format('MM-DD-YYYY');
            dt1 = new Date(dt1).getTime();
            dt2 = new Date(dt2).getTime();
            console.log("dtydtd", dt1);
            console.log("dtydtd", dt2);
            if (dt1 >= dt2) {
                temdata[rowInfo.index]["expDate"] = new Date(val);
                console.log("temdata is", temdata);
                this.setState({uplddata: temdata});
                console.log("update", this.state.uplddata);
            } else {
                //alert('Expiry date cannot less than current date');
                this.setState({
                    dlgtitle: "Information",
                    message: "Expiry date cannot less than current date",
                    dlgType: "information",
                    upLoadvalidMsg: true
                })
            }


        } else {
            this.state.uplddata[rowInfo.index][type] = val;
        }

    }

    getIdFromUser(user) {
        return getData("UserMgmt/FetchUsers")

    }


    async getuser() {
        const products = [1, 2, 3, 4]

        Promise.all(
            products.map(async (product) => {
                const productId = await this.getIdFromUser(product);
                //console.log(productId);
                //dataarray.push(productId.data)
                return productId;

            })
        ).then(results => {
            console.log("result is ", results);
        })
        //console.log("data is ",dataarray);
        //console.log("data is ",data.PromiseResult);
        console.log(products);
    }

    getResUploadFileOnServer(fileData) {
        return postData("UploadfilesOnserver/Uploadfile", fileData)

    }

    uploadMultiFiles() {
        if (this.state.uplddata.length > 0) {
            if (this.state.fileUplaodLoding == false) {
                let isADcheck = false;
                this.setState({fileUplaodLoding: true});
                let ContractID = -1;
                var tempArr = [];
                tempArr = this.state.uplddata;
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempArr[i].ContentFileTypeID == "1") {
                        if (tempArr[i].ContractID) {
                            if(tempArr[i].ContractID==null || tempArr[i].ContractID==""){
                                isADcheck = true;
                            }

                        } else {
                            isADcheck = true;
                        }
                    }
                }
                if (isADcheck) {
                    alert("is check");
                    var msg = "All ad files must have a Contract #. Please enter a Contract # and try to upload the file again";
                    this.setState({
                        upLoadvalidMsg: true,
                        dlgtitle: "Information",
                        message: msg,
                        dlgType: "information"
                    });
                    this.setState({fileUplaodLoding: false});
                }
                else {
                    //this.setState({})
                    var fileList = [];
                    const fileData = new FormData()
                    for (var x = 0; x < this.state.selectedFiles.length; x++) {
                        fileList.push(this.state.selectedFiles[x]);

                    }
                    var temArr1 = this.state.uplddata;
                    Promise.all(
                        fileList.map(async (file, index) => {
                            const fileData = new FormData()
                            fileData.append('file', file);
                            temArr1[index]["progress"] = 20;
                            this.setState({uplddata: temArr1});
                            const uploadfiledata = await this.getResUploadFileOnServer(fileData);
                            temArr1[index]["progress"] = 100;
                            console.log("this.state.uplddata", this.state.temArr1);
                            this.setState({uplddata: temArr1});
                            return uploadfiledata;

                        })
                    ).then(results => {
                        console.log("result is ", results);
                        var fileDataArr = [];
                        fileDataArr = this.state.uplddata;
                        results.forEach(function (resultItem) {
                            fileDataArr.forEach(function (item) {
                                if (resultItem.data.FileName.trim() == item.FileName.trim()) {
                                    item.Message = resultItem.data.Message;
                                    item.Message = resultItem.data.Message;
                                    item.Code = resultItem.data.ReturnCode;
                                }

                            });


                        });
                        this.setState({uplddata: fileDataArr});
                        let self = this;
                        //setTimeout(function () {
                        self.upDateFiles();
                        //},500)

                    })
                }
            }


        }
        else {
            this.setState({
                dlgtitle: "Information",
                message: "Please select file..",
                dlgType: "information",
                upLoadvalidMsg: true
            })
        }
    }

    /*upLoadFiles(){
     if(this.state.selectedFiles.length > 0){
     var otp = [];
     const fileData = new FormData()
     for(var x = 0; x<this.state.selectedFiles.length; x++) {
     otp.push(this.state.selectedFiles[x]);

     }

     Promise.all(otp.map(info => postData("UploadfilesOnserver/Uploadfile",fileData.append('file', this.state.selectedFiles[0])).then(res => {
     return res.data;
     }))).then(results => {
     console.log(results);
     }).catch(err => {
     console.log(err);
     });
     }
     /////



     }*/

    upLoadFiles() {
        if (this.state.uplddata.length > 0) {
            let isADcheck = false;
            let ContractID = -1;
            var tempArr = [];
            tempArr = this.state.uplddata;
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].ContentFileTypeID == "1") {
                    if (tempArr[i].ContractID) {
                        if (tempArr[i].ContractID <= 0) {
                            isADcheck = true;
                        }

                    } else {
                        isADcheck = true;
                    }
                }
            }
            if (isADcheck) {
                alert("is check");
                var msg = "All ad files must have a Contract #. Please enter a Contract # and try to upload the file again";
                this.setState({upLoadvalidMsg: true, dlgtitle: "Information", message: msg, dlgType: "information"});
            }
            else {
                const fileData = new FormData()
                for (var x = 0; x < this.state.selectedFiles.length; x++) {
                    fileData.append('file', this.state.selectedFiles[x])
                }
                this.myInterval = setInterval(() => this.setState({systProgCnt: this.state.systProgCnt + 1}), 200)
                postData("UploadfilesOnserver/Uploadfile", fileData)
                    .then(res => {
                        clearInterval(this.myInterval)
                        if (res.data && res.data.ReturnCode === 0) {
                            console.log("res fileupload on server", res.data);
                            this.upDateFiles();
                        } else {
                            console.log("res error fileupload on server", res.data);
                            if (res.data.ReturnCode === 4) {
                                this.setState({
                                    dlgtitle: "Information",
                                    message: "File with the same name already exists...",
                                    dlgType: "information",
                                    dlgEnable: true,
                                    upload: false,
                                    uplddata: [],
                                    selectedFiles: []
                                })
                            } else {
                                this.setState({
                                    dlgtitle: "Information",
                                    message: "Failed please try upload again",
                                    dlgType: "information",
                                    dlgEnable: true,
                                    upload: false,
                                    uplddata: [],
                                    selectedFiles: []
                                })
                            }

                            //this.setState({dlgtitle:"Information",message:"Failed please try upload again",dlgType:"information",dlgEnable:true,upload:false,uplddata:[],selectedFiles:[]})
                        }
                    })
            }

        } else {
            this.setState({
                dlgtitle: "Information",
                message: "Please select file..",
                dlgType: "information",
                upLoadvalidMsg: true
            })
        }

    }

    upDateFiles() {
        console.log("call upDateFiles", this.state.uplddata);
        var tempArr = [];
        if (this.state.uplddata && this.state.uplddata.length > 0) {
            this.state.uplddata.forEach(function (item) {
                if (item.Code == 0) {
                    tempArr.push(item);
                }
            })
        }
        //tempArr = this.state.uplddata;
        let pFileUpload = [];

        if (tempArr && tempArr.length > 0) {
            for (var i = 0; i < tempArr.length; i++) {

                var obj = new Object();
                obj.FileID = 0;
                obj.FileName = tempArr[i].FileName;
                obj.strExpDate = tempArr[i].expDate;//"Fri Dec 4 2020";
                obj.FileType = 0;
                obj.OwnerID = tempArr[i].OwnerID;
                obj.ContentFileTypeID = tempArr[i].ContentFileTypeID;
                obj.Impressions = tempArr[i].Impression;
                obj.FileSize=tempArr[i].FileSize;
                if (tempArr[i].Tag) {
                    obj.Tag = tempArr[i].Tag
                } else {
                    obj.Tag = "";
                }
                obj.ContractID = tempArr[i].ContractID;
                if (userID) {
                    obj.UserID = userID
                } else {
                    obj.UserID = 0
                }
                pFileUpload.push(obj);
            }
        }
        else {
            this.setState({fileUplaodLoding: false});
        }

        var postobj = {
            "operationCode": 0,
            "pFileUpload": pFileUpload
        }
        console.log("uplodat file update data", postobj);
        postData("FileUpload/Update", postobj)
            .then(res => {
                this.setState({fileUplaodLoding: false});
                if (res.data && res.data.ReturnCode === 0) {
                    this.setState({
                        dlgtitle: "Information",
                        message: "File Uploaded Successfully",
                        dlgType: "information",
                        dlgEnable: true,
                        upload: false,
                        uplddata: [],
                        selectedFiles: [],
                        systProgCnt: 0,
                        uplddata: [],
                        expDate: this.comnExpDate
                    })

                    this.getAvailbleMediafiles();
                } else {
                    this.setState({
                        dlgtitle: "Information",
                        message: "Failed please try upload again",
                        dlgType: "information",
                        dlgEnable: true,
                        upload: false,
                        uplddata: [],
                        selectedFiles: []
                    })
                }
            })
    }

    setEditData(rowInfo) {
        this.setState({
            flEditData: rowInfo.original,
            editFile: true,
            channel: rowInfo.original.Channel,
            fLength: rowInfo.original.Len
        })
    }

    setEditGroupData(rowInfo) {
        this.setState({groupEditData: rowInfo.original, grpEditInfo: true});
        console.log("grpObj ", rowInfo.original)
    }

    setGrpIndex(index, type) {
        let index1 = this.state[type].indexOf(index);
        if (index1 >= 0) {
            this.state[type].splice(index1, 1)
        } else {
            this.state[type].push(index)
        }
        this.setState({refresh: true})
    }

    setGeoZonIndex(index, type) {
        if (this.state[type] != undefined) {
            let index1 = this.state[type].indexOf(index);
            if (index1 >= 0) {
                this.state[type].splice(index1, 1)
            } else {
                this.state[type].push(index)
            }
        } else {
            this.state[type] = [];
            this.state[type].push(0)
        }

        this.setState({refresh: true,zoneVisibleFilters:[]})
    }


    removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    setGeoZoneSelection(type) {
        let data = [];
        console.log("g1 data", this.state.geoZone1Data);
        console.log("g2 data", this.state.geoZone2Data);

        if (type === "add" && this.state.geoZoneIndex.length > 0) {
            let databack = this.state.geoZone2Data;
            this.setState({geoZone2Data: []});
            let data1 = this.state.geoZone1Data;
            for (let i = 0; i < this.state.geoZoneIndex.length; i++) {
                data.push(this.state.geoZone1Data[this.state.geoZoneIndex[i]])
            }
            if (data && data.length > 0) {
                data.forEach(function (item) {

                    databack.push(item);
                });

                var modarray = this.removeDuplicates(databack, 'ID');
            }
            console.log("databack", modarray);
            var newModarray = [];
            if (modarray && modarray.length > 0) {
                let cal = 20;
                cal = 20 - modarray.length;
                var tempEmptyRow = []
                for (var i = 0; i < cal; i++) {
                    tempEmptyRow.push({})
                }

                modarray.forEach(function (item) {
                    if (item.Name != undefined) {
                        newModarray.push(item);
                    }
                })
            }

            this.setState({geoZone1Data: data1, geoZone2Data: newModarray, geoZoneIndex: [], adujstRow: tempEmptyRow});

        } else if (type === "remove" && this.state.geoZone2Data.length > 0) {
            let unqArray = [];
            unqArray = this.state.geoZone2Data
            this.setState({geoZone2Data: []});

            let tempRemoveArray = this.state.tempremoveGeozone;
            tempRemoveArray.push(unqArray[this.state.geoZoneSelecteIndex]);
            unqArray.splice(this.state.geoZoneSelecteIndex, 1);
            let tempRmArr=this.state.tempremoveGeozone;
            if(tempRemoveArray && tempRemoveArray.length>0){
                tempRemoveArray.forEach(function (item) {
                    tempRmArr.push(item);
                })
            }
            this.setState({tempremoveGeozone:tempRmArr});


            console.log("unqArray", unqArray)
            console.log("tempRemoveArray", this.state.tempremoveGeozone);
            var newModarray = [];
            if (unqArray && unqArray.length > 0) {
                let cal = 20;
                cal = 20 - unqArray.length;
                var tempEmptyRow = []
                for (var i = 0; i < cal; i++) {
                    unqArray.push({})
                }
                unqArray.forEach(function (item) {
                    if (item.Name != undefined) {
                        newModarray.push(item);
                    }
                })

            }
            this.setState({geoZone2Data: newModarray, grp2Index: [], adujstRow: tempEmptyRow});
        }
    }

    setGroupSelection(type) {
        let data = [];
        console.log("g1 data", this.state.grp1Data);
        console.log("g2 data", this.state.grp2Data);

        if (type === "add" && this.state.grp1Index.length > 0) {
            let databack = this.state.grp2Data;
            if (this.state.grp2Data && this.state.grp2Data.length > 0) {
                this.setState({
                    dlgtitle: "Information",
                    message: "Only one group is allowed.",
                    dlgType: "information",
                    GrSelectionInfo: true,

                })
            } else {
                this.setState({ grp2Data: [] });
                let data1 = this.state.grp1Data;
                for (let i = 0; i < this.state.grp1Index.length; i++) {
                    data.push(this.state.grp1Data[this.state.grp1Index[i]])
                }
                if (data && data.length > 0) {
                    data.forEach(function (item) {

                        databack.push(item);
                    });

                    var modarray = this.removeDuplicates(databack, 'Group_ADS_ID');
                }
                console.log("databack", modarray);
                var newModarray = [];
                if (modarray && modarray.length > 0) {
                    let cal = 20;
                    cal = 20 - modarray.length;
                    var tempEmptyRow = []
                    for (var i = 0; i < cal; i++) {
                        tempEmptyRow.push({})
                    }

                    modarray.forEach(function (item) {
                        if (item.Group_ADS_Name != undefined) {
                            newModarray.push(item);
                        }
                    })
                }

                this.setState({ grp1Data: data1, grp2Data: newModarray, grp1Index: [], adujstRow: tempEmptyRow });

            }

        } else if (type === "remove" && this.state.grp2Data.length > 0) {
            let unqArray = [];
            unqArray = this.state.grp2Data
            this.setState({ grp2Data: [] });

            unqArray.splice(this.state.grpSelecteIndex, 1)

            console.log("unqArray", unqArray)
            var newModarray = [];
            if (unqArray && unqArray.length > 0) {
                let cal = 20;
                cal = 20 - unqArray.length;
                var tempEmptyRow = []
                for (var i = 0; i < cal; i++) {
                    unqArray.push({})
                }
                unqArray.forEach(function (item) {
                    if (item.Group_ADS_Name != undefined) {
                        newModarray.push(item);
                    }
                })

            }
            this.setState({ grp2Data: newModarray, grp2Index: [], adujstRow: tempEmptyRow });
        }
    }

    setGroupSelectionold(type) {
        let data = [];
        console.log("g1 data", this.state.grp1Data);
        console.log("g2 data", this.state.grp2Data);
        if (type === "add" && this.state.grp1Index.length > 0) {
            let data1 = this.state.grp1Data;
            for (let i = 0; i < this.state.grp1Index.length; i++) {
                data.push(this.state.grp1Data[this.state.grp1Index[i]])
            }
            this.setState({grp1Data: data1, grp2Data: data, grp1Index: []});
        } else if (type === "remove" && this.state.grp2Index.length > 0) {
            for (let i = 0; i < this.state.grp2Data.length; i++) {
                let index = this.state.grp2Index.indexOf(i);
                if (i === -1) {
                    data.push(this.state.grp2Data[i])
                }
            }
            this.setState({grp2Data: data, grp2Index: []});
        }
    }

    associateGeoZoneTofile() {
        console.log("filetype is ", this.state.flEditData.FileType);
        console.log("this.state.flEditData", this.state.flEditData);
        console.log("this.state.flEditData", this.state.geoZone2Data)
        let url = "";
        let obj = {}
        this.state.zonefilteval[1]="";
        this.setState({zoneVisibleFilters:[],zonefiltered:[]});
        if (this.state.flEditData.FileType == 0) {
            if (this.state.FlDtTabIndex === 2) {
                url = "GroupADSFLFiles/UpdateAssociated";
                if (this.state.group) {
                    let gropus = [
                        {
                            "Group_ADS_ID": this.state.grpId
                        }
                    ];
                    obj = {
                        "arrGroupADSL_VideoVO": [{
                            "FILEID": this.state.flEditData.FILEID,  //this is file id
                            "FileGroupsList": gropus,
                            "FileGeoZonesNew": this.state.geoZone2Data
                        }],
                        "OPCODE": 104 // code for associate geoZone

                    }
                } else {
                    obj = {
                        "arrGroupADSL_VideoVO": [{
                            "FILEID": this.state.flEditData.FILEID,  //this is file id
                            "FileGroupsList": this.state.flEditData.FileGroups,
                            "FileGeoZonesNew": this.state.geoZone2Data
                        }],
                        "OPCODE": 104 // code for associate geoZone

                    }
                }

            } else if (this.state.FlDtTabIndex === 4) {
                url = "GroupAds_Flash_Video/AssociatePickupGeoZones"
                if (this.state.geoZone2Data) {
                    let Str = "";
                    let groupIds = [];
                    for (let i = 0; i < this.state.geoZone2Data.length; i++) {
                        if (i === this.state.geoZone2Data.length - 1) {
                            Str = Str + this.state.geoZone2Data[i].ID
                        } else {
                            Str = Str + this.state.geoZone2Data[i].ID + ","
                        }
                    }
                    if (!this.state.group && this.state.data[this.state.FlDtIndex].FileGroups) {
                        for (let i = 0; i < this.state.data[this.state.FlDtIndex].FileGroups.length; i++) {
                            let myobj = {
                                "Group_ADS_ID": this.state.data[this.state.FlDtIndex].FileGroups[i].Group_ADS_ID
                            }
                            groupIds.push(myobj)
                        }
                    } else {
                        let myobj = {
                            "Group_ADS_ID": this.state.grpId
                        }
                        groupIds.push(myobj)
                    }

                    obj = {
                        "groupIds": groupIds,
                        "GrooupADSFLDetailID": this.state.data[this.state.FlDtIndex].FILEID,
                        "PickupGeozoneString": Str
                    }
                }
            }
            console.log(this.state.selectedRow)
            postData(url, obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Geozones Associated Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                            btmGeoZoneAssociation: false,
                            flEditData: [],
                            geoZone2Data: []
                        }, () => this.getRecords("GroupADSFLFiles/Fetch"));

                    } else {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Failed please try upload again",
                            dlgType: "information",
                            dlgEnable: true,
                            btmGeoZoneAssociation: false,
                            flEditData: [],
                            geoZone2Data: []
                        })
                    }

                })
        }
    }

    associateGroupsTofile() {
        console.log("filetype is ", this.state.flEditData.FileType);
        console.log("this.state.flEditData", this.state.flEditData)
        let url = "GroupADSFLFiles/UpdateAssociated";
        let obj = {}
        if (this.state.flEditData.FileType == 0) {
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "FileGroupsList": this.state.grp2Data,
                        "FileDetailsList": this.state.flEditData.FileDetails,
                        "FILEID": this.state.flEditData.FILEID,
                        "FULLSCR_NG": this.state.flEditData.FULLSCR_NG,
                        "Banner1": this.state.flEditData.Banner1,
                        "Banner2": this.state.flEditData.Banner2,
                        "Microsite": this.state.flEditData.Microsite,
                        "Channel": this.state.flEditData.FILEID,
                    }
                ],
                "OPCODE": "103"
            }
            postData(url, obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Groups Associated Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                            btmGrpAssociated: false,
                            flEditData: [],
                            grp2Data: []
                        }, () => this.getRecords("GroupADSFLFiles/Fetch"));

                    } else {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Failed please try upload again",
                            dlgType: "information",
                            dlgEnable: true,
                            btmGrpAssociated: false,
                            flEditData: [],
                            grp2Data: []
                        })
                    }

                })
        }
    }

    setRateCodes(e, data) {
        let index = this.state.rateCodesDt.indexOf(data.ID)
        if (e && index === -1) {
            this.state.rateCodesDt.push(data.ID)
        } else {
            this.state.rateCodesDt.splice(index, 1)
        }
    }

    associatedRateCodestoFile() {
        if (this.state.rateCodesDt) {
            let Str = "";
            let groupIds = [];
            for (let i = 0; i < this.state.rateCodesDt.length; i++) {
                if (i === this.state.rateCodesDt.length - 1) {
                    Str = Str + this.state.rateCodesDt[i]
                } else {
                    Str = Str + this.state.rateCodesDt[i] + ","
                }
            }
            if (!this.state.group && this.state.data[this.state.FlDtIndex].FileGroups) {
                for (let i = 0; i < this.state.data[this.state.FlDtIndex].FileGroups.length; i++) {
                    let obj = {
                        "Group_ADS_ID": this.state.data[this.state.FlDtIndex].FileGroups[i].Group_ADS_ID
                    }
                    groupIds.push(obj)
                }
            } else {
                let myobj = {
                    "Group_ADS_ID": this.state.grpId
                }
                groupIds.push(myobj)
            }

            let myObj = {
                "GroupIDs": groupIds,
                "GrooupADSFLDetailID": this.state.data[this.state.FlDtIndex].FILEID,
                "rateCodesString": Str
            }
            postData("GroupAds_Flash_Video/updateRateCode", myObj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Rate Codes Associated Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                            btmRateCodes: false,
                            rateCodesDt: []
                        }, () => this.getRecords("GroupADSFLFiles/Fetch", "refresh"));

                    } else {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Failed please try again",
                            dlgType: "information",
                            dlgEnable: true,
                            btmRateCodes: false,
                            rateCodesDt: []
                        })
                    }

                })
        }
    }

    cancelGeoInclusion(){
        this.state.zonefilteval[1]="";
        this.setState({zonefiltered:[],zoneVisibleFilters:[]})
        if(this.state.goforgeozoneEdit){
            if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
                this.setState({editFile:true,scheduleGeoZonening:false});
            }else{
                this.setState({geoZoneIncluded:false,geoZoneExcluded:false,editFile:true,scheduleGeoZonening:false,tempremoveGeozone:[]});
            }
        }else {
            if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
                this.setState({schedVideo:true,scheduleGeoZonening:false});
            }else{
                this.setState({geoZoneIncluded:false,geoZoneExcluded:false,schedVideo:true,scheduleGeoZonening:false});
            }
        }

    }

    setScheduleGeoZonening(){
        console.log("this.state.geoZone2Data",this.state.geoZone2Data);
        this.state.zonefilteval[1]="";
        this.setState({zonefiltered:[],zoneVisibleFilters:[]})
        if(this.state.geoZoneIncluded){
            if(this.state.goforgeozoneEdit){
                if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
                    /*let tempdata = this.state.geoZone2Data;
                    tempdata.forEach(function (item) {
                        item.Inclusion=1;
                    })
                    this.setState({geoZone2Data:tempdata});*/
                    this.setState({geoZoneIncluded:true,editFile:true,geoZoneExcluded:false,scheduleGeoZonening:false});
                }else{
                    this.setState({geoZoneIncluded:false,editFile:true,scheduleGeoZonening:false});
                }
            }else{
                if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
                    this.setState({geoZoneIncluded:true,schedVideo:true,geoZoneExcluded:false,scheduleGeoZonening:false});
                }else{
                    this.setState({geoZoneIncluded:false,schedVideo:true,scheduleGeoZonening:false});
                }
            }

        }else{
            if(this.state.goforgeozoneEdit){
                if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
                    this.setState({geoZoneExcluded:true,editFile:true,geoZoneIncluded:false,scheduleGeoZonening:false});
                }else{
                    this.setState({geoZoneExcluded:false,editFile:true,scheduleGeoZonening:false});
                }
            }else{
                if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
                    this.setState({geoZoneExcluded:true,schedVideo:true,geoZoneIncluded:false,scheduleGeoZonening:false});
                }else{
                    this.setState({geoZoneExcluded:false,schedVideo:true,scheduleGeoZonening:false});
                }
            }

        }

    }

    openIncludedGeoZone(){
        if(this.state.schedVideo){
            this.setState({goforgeozoneEdit:false});
            if(this.state.geoZoneExcluded){
                this.setState({dlgtitle: "Information", message: "Geozones for exclusion are already selected", dlgType: "information", schedVal: true});
            }else{
                this.setState({schedVideo:false,scheduleGeoZonening:true,geoZoneIncluded:true});
            }
        }else{
            if(this.state.editFile) {
                console.log("this.state.flEditData",this.state.flEditData);
                this.setState({goforgeozoneEdit:true});
                let FileGeoZones = this.state.flEditData.FileGeoZones;
                let checkexclusion=false;
                if(this.state.geoZoneExcluded){
                    checkexclusion=true;
                }else{
                    if(FileGeoZones && FileGeoZones.length>0){
                        if(FileGeoZones[0].Inclusion==1){
                            checkexclusion=false;
                        }else{
                            checkexclusion=true;
                        }

                    }
                }

                if(checkexclusion){
                    this.setState({dlgtitle: "Information", message: "Geozones for exclusion are already selected", dlgType: "information", schedVal: true});
                }else{
                    this.setState({editFile: false,geoZone2Data:FileGeoZones, scheduleGeoZonening: true, geoZoneIncluded: true});
                }

                //console.log("this.state.flEditData",this.state.flEditData);
                //console.log("this.state.geoZone2Data",this.state.geoZone2Data);
            }
        }
    }
    openExcludedGeoZone(){
        if(this.state.schedVideo){
            this.setState({goforgeozoneEdit:false});
            if(this.state.geoZoneIncluded){
                this.setState({dlgtitle: "Information", message: "Geozones for inclusion are already selected", dlgType: "information", schedVal: true});
            }else{
                this.setState({schedVideo:false,scheduleGeoZonening:true,geoZoneExcluded:true});
            }
        }else{
            if(this.state.editFile){
                console.log("this.state.flEditData",this.state.geoZone2Data);
                this.setState({goforgeozoneEdit:true});
                let FileGeoZones = this.state.flEditData.FileGeoZones;
                let checkInclusion=false;
                if(this.state.geoZoneIncluded){
                    checkInclusion=true;
                }else{
                    if(FileGeoZones && FileGeoZones.length>0){
                        if(FileGeoZones[0].Inclusion==1){
                            checkInclusion=true;
                        }else{
                            checkInclusion=false;
                        }

                    }
                }

                if(checkInclusion){
                    this.setState({dlgtitle: "Information", message: "Geozones for inclusion are already selected", dlgType: "information", schedVal: true});
                }else {
                    this.setState({
                        editFile: false,
                        geoZone2Data: FileGeoZones,
                        scheduleGeoZonening: true,
                        geoZoneExcluded: true
                    });
                }
                //console.log("this.state.flEditData",this.state.flEditData);
                //console.log("this.state.geoZone2Data",this.state.geoZone2Data);
            }
        }
    }

    schedValid(type) {
        let msg = "";
        this.fileType = "";
        if (type === 0 && this.addobj.WebVisibleURL === "") {
            msg = "Please Select video file"
        }

        if (this.addobj.WebVisibleURLHBanner !== "" || this.addobj.WebVisibleURLVBanner !== "") {
            if (this.state.fScreen == 1) {
                msg = "Banners not allowed in Full Screen";
            }
        }
        if(this.state.imgfileselected==true){
            if(this.state.network=="" || this.state.network=="None" || this.state.network=="None" || this.state.network==null){
                msg="Please select appropriate network";
            }
        }



        //datevalidation
        let stDate = new Date(this.state.dateStart).getTime();
        let endDate = new Date(this.state.dateEnd).getTime();
        let currentDate = new Date();
        currentDate = new Date(currentDate).setHours(0);
        currentDate = new Date(currentDate).setMinutes(0);
        currentDate = new Date(currentDate).getTime();
        if (stDate < currentDate) {
            msg = "Start Date can't less than current Date";
        }
        if (endDate < stDate) {
            msg = "End Date can't less than start Date";
        }

        if (msg === "") {
            this.fileType = type;
            if (this.state.group) {
                if(!this.state.isbusy){
                    this.schedVideo()
                }

            }
            else {
                if (type === 1) {
                    this.setState({schedBanner: false, grpSelection: true})
                } else {
                    this.setState({schedVideo: false, grpSelection: true})
                }

            }
        } else {
            this.setState({dlgtitle: "Information", message: msg, dlgType: "information", schedVal: true});
        }
    }

    backtoShedul() {

        if (this.fileType === 1) {
            this.setState({grpSelection: false, schedBanner: true});
        } else if (this.fileType === 0) {
            this.setState({grpSelection: false, schedVideo: true});
        } else {
            this.setState({grpSelection: false, schedVideo: true});
        }
    }

    checkSelectedGroupLength() {

        if (this.state.grp2Data.length > 0) {
            if(!this.state.isbusy){
                this.schedVideo();
            }

        } else {
            this.setState({
                dlgtitle: "Information",
                message: "Please select groups",
                dlgType: "information",
                GrSelectionInfo: true
            })
        }
    }

    schedVideo() {
        this.setState({isbusy:true});
        this.setState({isenableschedBtn:false});
        console.log("call schedVideo for check type",this.state.isImage);
        let obj;
        let VideoMicrosite = 0;
        let provider = "";

        let Network = this.state.network;
        if(this.state.network="" || this.state.network==undefined || this.state.network==null){
            Network="None";
        }

        if (this.state.VideoMicrosite) {
            VideoMicrosite = 1;
        }
        if (this.state.provider) {
            if (this.state.providerData && this.state.providerData.length > 0) {
                var providerid = this.state.provider;
                this.state.providerData.forEach(function (item) {
                    if (item.Provider_ID == providerid) {
                        provider = item.Provider_Name
                    }
                });
            }
        }
        let Weekpart="";
        if(this.state.WeekPart && this.state.WeekPart.length>0){
            Weekpart="";
            this.state.WeekPart.forEach(function (item) {
                Weekpart +=item+",";
            })
            Weekpart = Weekpart.substring(0,Weekpart.length-1);
        }
        let FileGeoZones=null;
        if(this.state.geoZone2Data && this.state.geoZone2Data.length>0){
            FileGeoZones=[]
            //let tempArr =this.state.geoZone2Data;
            let self = this;
            this.state.geoZone2Data.forEach(function (item) {
                if(self.state.geoZoneIncluded){
                    item.Inclusion=1;
                }else{
                    item.Inclusion=0;
                }
                FileGeoZones.push(item);
            });
        }
        let altImgValue="";

        if(Network=="UNITED"){
            altImgValue = this.state.altImage
        }else{
            altImgValue = ""
        }

        if (this.state.group && this.fileType === 0) {
            let obj1 = [{
                Group_ADS_ID: this.state.grpId,
            }]
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "strDATEEND": moment(this.state.dateEnd).format("ddd MMM DD YYYY"),
                        "TIMEEND": this.state.timeEndhr + ":" + this.state.timeEndmin,
                        "FILEID": this.addobj.FILEID,
                        "ORDERLOOP": this.state.order,
                        "strDATESTART": moment(this.state.dateStart).format("ddd MMM DD YYYY"),
                        "TIMESTART": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                        "FULLSCR_NG": this.state.fScreen,
                        "Banner1": this.addobj.Banner1,
                        "Banner2": this.addobj.Banner2,
                        "Microsite": parseInt(this.state.mSite),
                        "IndexType": this.state.typeL,
                        "FileType": 0,
                        "Channel": parseInt(this.state.channel),
                        "PlayerMode": 0,
                        "Len": parseInt(this.state.fLength),
                        "Type": 0,
                        "VideoMicrosite": VideoMicrosite,
                        "Provider": provider,
                        "FileGroupsList": obj1,
                        "Network":Network,
                        "IsImage":this.state.isImage,
                        "Weekpart":Weekpart,
                        "PlayerMode":0,
                        "AltImage":altImgValue,//this.state.altImage,//setalt3
                        "FileGeoZonesNew": FileGeoZones,//this.state.geoZone2Data,
                    }
                ],
                "operationCode": 0
            }


        }
        else if (this.state.group && this.fileType === 1) {
            let obj1 = [{
                Group_ADS_ID: this.state.grpId,
            }]
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "strDATEEND": moment(this.state.dateEnd).format("ddd MMM DD YYYY"),
                        "TIMEEND": this.state.timeEndhr + ":" + this.state.timeEndmin,
                        "FILEID": 0,
                        "ORDERLOOP": this.state.order,
                        "strDATESTART": moment(this.state.dateStart).format("ddd MMM DD YYYY"),
                        "TIMESTART": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                        "FULLSCR_NG": 0,
                        "Banner1": this.addobj.Banner1,
                        "Banner2": this.addobj.Banner2,
                        "Microsite": parseInt(this.state.mSite),
                        "IndexType": this.state.typeL,
                        "FileType": 1,
                        "Channel": parseInt(this.state.channel),
                        "PlayerMode": 0,
                        "Len": this.state.fLength,
                        "Type": 0,
                        "VideoMicrosite": 0,
                        "Provider": "",
                        "FileGroupsList": obj1
                    }
                ],
                "operationCode": 0
            }

        }
        else if (this.fileType === 0) {
            let data = [];
            if (this.state.grp2Data.length > 0) {
                for (let i = 0; i < this.state.grp2Data.length; i++) {
                    let obj = {
                        Group_ADS_ID: this.state.grp2Data[i].Group_ADS_ID,
                        Group_ADS_NAme: this.state.grp2Data[i].Group_ADS_Name
                    }
                    data.push(obj)
                }

            }
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "strDATEEND": moment(this.state.dateEnd).format("ddd MMM DD YYYY"),
                        "TIMEEND": this.state.timeEndhr + ":" + this.state.timeEndmin,
                        "FILEID": this.addobj.FILEID,
                        "ORDERLOOP": this.state.order,
                        "strDATESTART": moment(this.state.dateStart).format("ddd MMM DD YYYY"),
                        "TIMESTART": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                        "FULLSCR_NG": this.state.fScreen,
                        "Banner1": this.addobj.Banner1,
                        "Banner2": this.addobj.Banner2,
                        "Microsite": parseInt(this.state.mSite),
                        "IndexType": this.state.typeL,
                        "FileType": 0,
                        "Channel": parseInt(this.state.channel),
                        "PlayerMode": 0,
                        "Len": parseInt(this.state.fLength),
                        "Type": 0,
                        "VideoMicrosite": VideoMicrosite,
                        "Provider": provider,
                        "FileGroupsList": data,
                        "Network":Network,
                        "IsImage":this.state.isImage,
                        "Weekpart":Weekpart,
                        "PlayerMode":0,
                        "AltImage":altImgValue,//this.state.altImage,//setalt4
                        "FileGeoZonesNew": FileGeoZones,//this.state.geoZone2Data,
                    }
                ],
                "operationCode": 0
            }
        }
        else {
            let data = [];
            if (this.state.grp2Data.length > 0) {
                for (let i = 0; i < this.state.grp2Data.length; i++) {
                    let obj = {
                        Group_ADS_ID: this.state.grp2Data[i].Group_ADS_ID,
                        Group_ADS_NAme: this.state.grp2Data[i].Group_ADS_Name
                    }
                    data.push(obj)
                }
            }
            obj = {
                "arrGroupADSL_VideoVO": [
                    {
                        "strDATEEND": moment(this.state.dateEnd).format("ddd MMM DD YYYY"),
                        "TIMEEND": this.state.timeEndhr + ":" + this.state.timeEndmin,
                        "FILEID": 0,
                        "ORDERLOOP": this.state.order,
                        "strDATESTART": moment(this.state.dateStart).format("ddd MMM DD YYYY"),
                        "TIMESTART": this.state.timeSrthr + ":" + this.state.timeSrtmin,
                        "FULLSCR_NG": 0,
                        "Banner1": this.addobj.Banner1,
                        "Banner2": this.addobj.Banner2,
                        "Microsite": parseInt(this.state.mSite),
                        "IndexType": this.state.typeL,
                        "FileType": 1,
                        "Channel": parseInt(this.state.channel),
                        "PlayerMode": 0,
                        "Len": this.state.fLength,
                        "Type": 0,
                        "VideoMicrosite": 0,
                        "Provider": "",
                        "FileGroupsList": data,
                        "Network":Network,
                        "IsImage":this.state.isImage,
                        "Weekpart":Weekpart,
                        "PlayerMode":0,
                        "AltImage":altImgValue,//this.state.altImage,//setalt5
                        "FileGeoZonesNew": FileGeoZones,//this.state.geoZone2Data,
                    }
                ],
                "operationCode": 0
            }
        }

        postData("GroupADSFLFiles/Update", obj)
            .then(res => {
                this.setState({isbusy:false});
                if (res.data && res.data.ReturnCode === 0) {
                    let gData =this.state.grpData;
                    this.setState({
                        dlgtitle: "Information",
                        message: "Added Successfully",
                        dlgType: "information",
                        dlgEnable: true,
                        grpSelection: false,
                        flEditData: [],
                        grpDelete:[],
                        grpData:[],
                        grpLoading:true,
                        order:1,
                        isImage:0
                    }, () => {
                        this.state.grpData=gData;
                        this.state.grpLoading = false;
                        this.getRecords("GroupADSFLFiles/Fetch")});

                } else {
                    this.setState({
                        dlgtitle: "Information",
                        message: "Failed please try upload again",
                        dlgType: "information",
                        dlgEnable: true,
                        grpSelection: false,
                        flEditData: []
                    })
                }
                this.resetFlDetails()
            }).catch((e)=>{
            this.setState({isbusy:false});
        })
    }

    setDelete(index) {
        let index1 = this.state.deletData.indexOf(index);
        if (index1 >= 0) {
            this.state.deletData.splice(index1,1);
        } else {
            this.state.deletData.push(index);
        }
    }

    beforeDeletefiles(){
        if (this.state.deletData.length > 0) {
            this.setState({
                dlgtitle: "Information",
                message: "Are you sure want to delete",
                dlgType: "deleteFile",
                dlgEnable: true,
                grpSelection: false,
                flEditData: []
            })
        }else{
            this.setState({
                dlgtitle: "Information",
                message: "Please Select File",
                dlgType: "information",
                dlgEnable: true,
                grpSelection: false,
                flEditData: []
            })
        }
    }

    deleteFiles(type) {
        let obj;
        let data = [];
        let url = "";
        if (this.state.deletData.length > 0) {
            if (type === 1) {
                for (let i = 0; i < this.state.deletData.length; i++) {
                    data.push(this.state.data[this.state.deletData[i]].ID)
                }
                obj = {
                    "bannerIds": data,
                    "groupId": this.state.grpId,
                    "tryAll": false
                }
                url = "GroupAds_Flash_Banner_Group/DeleteBanner";
            } else {
                for (let i = 0; i < this.state.deletData.length; i++) {
                    let obj1 = {
                        "FILEID": this.state.data[this.state.deletData[i]].FILEID, ///video file id
                        "GROUP_ADSFL_DETAILID": this.state.data[this.state.deletData[i]].GROUP_ADSFL_DETAILID, ///deatails  row id
                    }
                    data.push(obj1)
                }
                obj = {
                    "tryAll": true,
                    "groupId": this.state.grpId,
                    "videoIds": data
                }
                url = "GroupAds_Flash_Video/DeleteVideos";
            }
            postData(url, obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        let gData= this.state.grpData;
                        this.setState({
                            dlgtitle: "Information",
                            message: "Deleted Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                            deletData: [],
                            grpDelete:[],
                            grpData:[],
                            grpLoading:true,
                        }, () => {
                            this.state.grpData=gData;
                            this.state.grpLoading=false;
                            this.getRecords("GroupADSFLFiles/Fetch")});

                    } else {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Faild please try  again",
                            dlgType: "information",
                            dlgEnable: true,
                        })
                    }
                })
        } else {
            this.setState({
                dlgtitle: "Information",
                message: "Please Select Banners",
                dlgType: "information",
                dlgEnable: true,
                grpSelection: false,
                flEditData: []
            })
        }

    }

    fetchunitTypeData() {
        let obj = {
            "startIndex": 0,
            "count": 0,
            "criteria": []
        };
        postData('UnitTypes/Fetch', obj)
            .then(res => {
                if (res && res.data && res.data.ResponseCollection) {
                    this.setState({unitData: res.data.ResponseCollection});

                } else {
                    this.setState({unitData: []})
                }
            });
    }

    fetchProviderData() {
        getData('GroupADSFLFiles/FetchProvider')
            .then(res => {
                if (res && res.data && res.data.ResponseCollection) {
                    this.setState({providerData: res.data.ResponseCollection});
                } else {
                    this.setState({providerData: []});
                }
            });
    }

    addGroup = () => {
        this.setState({grpEditInfo: false, groupEditData: {}});
        let grpObj = {
            groupName: '',
            startDate: new Date(),
            endDate: new Date(),
            unitType: 2
        }
        this.setState({grpObj: grpObj});

        this.setState({grpInfo: true, dataLoading: false});
    }

    handleValues = (value, type) => {
        this.state.grpObj[type] = value;
        this.setState({
            refresh: true
        });
    }

    handleEditValues = (value, type) => {
        this.state.groupEditData[type] = value;
        this.setState({
            refresh: true
        });
    }

    addGroupToDatabase = () => {
        let strDt = new Date(this.state.grpObj.startDate).getTime();// moment(this.state.grpObj.startDate).format('MM-DD-YYYY');
        let endDt = new Date(this.state.grpObj.endDate).getTime(); //moment(this.state.grpObj.endDate).format('MM-DD-YYYY');
        let currentdt = new Date().setHours(0);// moment().format('MM-DD-YYYY');
        currentdt = new Date(currentdt).setMinutes(0);
        currentdt = new Date(currentdt).getTime();
        let msg = "";
        let gName = this.state.grpObj.groupName.trim();
        this.state.grpObj.groupName = gName;
        if (!this.state.grpObj.groupName || !this.state.grpObj.unitType) {
            if (!this.state.grpObj.unitType) {
                msg = "Please Select unit type";
            } else {
                msg = "Please enter Group Name";
            }
        } else {

            if (strDt < currentdt) {
                msg = "Start date cannot be less than current date";
            } else if (strDt > endDt) {
                msg = "Start date cannot be greater than end date";
            }


        }
        if (msg) {
            //alert("" + msg);

            this.setState({
                dlgtitle:"Information",
                message:msg,
                dlgType:"information",
                dlgEnable:true,
            });
            this.setState({grViewGroupValid: true, dlgtitle: "information", message: msg})
        } else {
            let obj = {
                "operationCode": 0,
                "pGroupADSFL": [{
                    "Group_ADS_Name": this.state.grpObj.groupName, //this is grpou name
                    "IsDeleted": 0,
                    "Operation": 0,
                    "Status": 2,///set initial status draft
                    "strStartDate": this.state.grpObj.startDate,
                    "strEndDate": this.state.grpObj.endDate,
                    "UnitType": this.state.grpObj.unitType
                }]
            }

            postData('GroupADSFL/Update', obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            grpInfo: false,
                            grpObj: {groupName: '', startDate: '', endDate: '', unitType: ''}
                        }, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                        this.setState({
                            dlgtitle: "Information",
                            message: "Added Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                        });
                    } else {
                        if (res.data && res.data.ReturnCode === 4) {
                            this.setState({
                                grpInfo: false,
                                grpObj: {groupName: '', startDate: '', endDate: '', unitType: ''}
                            }, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                            this.setState({
                                dlgtitle: "Information",
                                message: "Group with the same name already exists",
                                dlgType: "information",
                                dlgEnable: true,
                            });
                        } else {
                            this.setState({
                                grpInfo: false,
                                grpObj: {groupName: '', startDate: '', endDate: '', unitType: ''}
                            }, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                            this.setState({
                                dlgtitle: "Information",
                                message: "Internal Server Error",
                                dlgType: "information",
                                dlgEnable: true,
                            });
                        }

                    }
                });
        }

    }
    editGroupToDatabase = () => {
        let strDt = new Date(this.state.groupEditData.StartDate).getTime();
        let endDt = new Date(this.state.groupEditData.EndDate).getTime();
        let currentdt = new Date().setHours(0);
        currentdt = new Date(currentdt).setMinutes(0);
        currentdt = new Date(currentdt).getTime();
        let msg = "";
        if (!this.state.groupEditData.Group_ADS_Name || this.state.groupEditData.UnitType === undefined || this.state.groupEditData.UnitType === "") {
            if (!this.state.groupEditData.UnitType) {
                msg = "Please Select unit type";
            } else {
                msg = "Please enter Group Name";
            }
        } else {

            if (strDt > endDt) {
                msg = "Start date cannot be greater than end date";
            }


        }
        if (msg) {
            alert("" + msg)
            this.setState({grViewGroupValid: true, dlgtitle: "information", message: msg})
        } else {
            let obj = {
                "operationCode": 1,
                "pGroupADSFL": [{
                    "Group_ADS_Name": this.state.groupEditData.Group_ADS_Name, //this is grpou name
                    "IsDeleted": 0,
                    "Operation": 1,
                    "Status": 2,///set initial status draft
                    "strStartDate": this.state.groupEditData.StartDate,
                    "strEndDate": this.state.groupEditData.EndDate,
                    "UnitType": this.state.groupEditData.UnitType,
                    "Group_ADS_ID": this.state.groupEditData.Group_ADS_ID
                }]
            }

            postData('GroupADSFL/Update', obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            grpEditInfo: false,
                            groupEditData: {}
                        }, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                        this.setState({
                            dlgtitle: "Information",
                            message: "Group Updated Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                        });
                    } else {
                        if (res.data && res.data.ReturnCode === 4) {
                            this.setState({
                                grpEditInfo: false,
                                grpObj: {}
                            }, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                            this.setState({
                                dlgtitle: "Information",
                                message: "Group with the same name already exists",
                                dlgType: "information",
                                dlgEnable: true,
                            });
                        } else {
                            this.setState({
                                grpEditInfo: false,
                                grpObj: {}
                            }, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                            this.setState({
                                dlgtitle: "Information",
                                message: "Internal Server Error",
                                dlgType: "information",
                                dlgEnable: true,
                            });
                        }

                    }
                });
        }

    }

    handeldeleteBeforedelete(){
        if (this.state.grpDelete.length > 0) {
            this.setState({
                dlgtitle: "Information",
                message: "Are you sure want to delete",
                dlgType: "delete",
                dlgEnable: true,
            })
        }else{
            this.setState({
                dlgtitle: "Information",
                message: "Please Select Groups",
                dlgType: "information",
                dlgEnable: true,
            })
        }
    }

    handleDeleteGrp = () => {
        if (this.state.grpDelete.length > 0) {
            let arr = [];
            let gNamestr=""
            for (let i = 0; i < this.state.grpDelete.length; i++) {
                let obj = {
                    "Group_ADS_Name": this.state.grpData[this.state.grpDelete[i]].Group_ADS_Name,
                    Group_ADS_ID: this.state.grpData[this.state.grpDelete[i]].Group_ADS_ID
                }
                arr.push(obj);
                gNamestr+=this.state.grpData[this.state.grpDelete[i]].Group_ADS_Name+" , "
            }

            let obj = {
                "operationCode": 2,
                "pGroupADSFL": arr
            }

            postData('GroupADSFL/Update', obj)
                .then(res => {
                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({
                            dataLoading: true,
                            grpDelete: []
                        }, () => this.getGrpData("GroupADSFL/Fetch", "get"));
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
                            dlgtitle: "Information",
                            message: msg,
                            dlgType: "information",
                            dlgEnable: true,
                        });
                    }
                });
        } else {
            this.setState({
                dlgtitle: "Information",
                message: "Please Select Groups",
                dlgType: "information",
                dlgEnable: true,
            })
        }
    }

    openStatusDll() {
        console.log("check ", this.state.showStatus)
        if (this.state.showStatus) {
            this.setState({showStatus: false});
        } else {
            this.setState({showStatus: true});
        }
    }

    handleStatusChange = (value) => {
        this.setState({showStatus: false});
        console.log("grpDelete", this.state.grpDelete)
        if (this.state.grpDelete.length > 0) {
            this.setState({display: 0})
            var str = "";
            if (this.state.grpDelete && this.state.grpDelete.length > 0) {
                let isNotAllowed = false;
                if (this.state.grpDelete.length == 1) {
                    if (this.state.grpData[this.state.grpDelete[0]].Status == value) {
                        isNotAllowed = true;
                    }
                }

                if (isNotAllowed) {
                    this.setState({
                        dlgtitle: "Information",
                        message: "Selected group has same status..",
                        dlgType: "information",
                        dlgEnable: true
                    })
                } else {
                    for (let i = 0; i < this.state.grpDelete.length; i++) {
                        str += this.state.grpData[this.state.grpDelete[i]].Group_ADS_Name + ",";
                    }
                    this.setState({
                        dlgtitle: "Information",
                        message: "Are you sure you want to change the status of " + str,
                        dlgType: "updateGroup",
                        dlgEnable: true,
                        gStatusValForChange: value
                    })
                }

            }


        } else {

            this.setState({
                dlgtitle: "Information",
                message: "Please select group(s)",
                dlgType: "information",
                dlgEnable: true
            })
        }
    }

    updategroupStatus(value) {
        this.setState({display: 0})

        let arr = [];
        let obj = {
            "statusId": value,///test
            "tryAll": false,
            groupIds: []
        }
        for (let i = 0; i < this.state.grpDelete.length; i++) {
            obj.groupIds.push(this.state.grpData[this.state.grpDelete[i]].Group_ADS_ID);
        }

        postData('GroupADSFL/ChangeGroupStatus', obj)
            .then(res => {

                if (res.data && res.data.ReturnCode === 0) {
                    this.setState({
                        display: 0,
                        grpData: [],
                        grpDelete: []
                    }, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                    this.setState({
                        dlgtitle: "Information",
                        message: "Status Updated Successfully",
                        dlgType: "information",
                        dlgEnable: true,
                    });
                }
            });
    }

    handleStatusChangeold = (value) => {
        if (this.state.grpDelete.length > 0) {
            this.setState({display: 0})

            let arr = [];
            let obj = {
                "statusId": value,///test
                "tryAll": true,
                groupIds: []
            }
            for (let i = 0; i < this.state.grpDelete.length; i++) {
                obj.groupIds.push(this.state.grpData[this.state.grpDelete[i]].Group_ADS_ID);
            }

            postData('GroupADSFL/ChangeGroupStatus', obj)
                .then(res => {

                    if (res.data && res.data.ReturnCode === 0) {
                        this.setState({display: 0, grpDelete: []}, () => this.getGrpData("GroupADSFL/Fetch", "get"))
                        this.setState({
                            dlgtitle: "Information",
                            message: "Status Updated Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                        });
                    }
                });

        } else {
            this.setState({
                dlgtitle: "Information",
                message: "Please Select Groups",
                dlgType: "information",
                dlgEnable: true,
            })
        }
    }


    setBtmDetails(data, flage) {
        console.log("data is", this.state.data);
        console.log("data is", this.state.FlDtIndex);
        console.log("data is", this.state.data[this.state.FlDtIndex]);
        let gr2Data = this.state.data[this.state.FlDtIndex].FileGroups;

        this.setState({grp2Data: gr2Data})
        this.setState({flEditData: this.state.data[this.state.FlDtIndex]});
        if (flage) {
            data = {
                DATESTART: new Date(),
                DATEEND: new Date(),
            };
        }
        if (data && this.state.FlDtTabIndex === 0) {
            this.btmRow = data;
            let strDate = moment(data.DATESTART).format("MM/DD/yyyy");
            let endDate = moment(data.DATEEND).format("MM/DD/yyyy");

            this.setState({
                order: data.ORDERLOOP,
                timeSrtmin: 0,
                timeEndmin: 59,
                timeSrthr: 0,
                timeEndhr: 23,
                fScreen: data.FULLSCR_NG,
                fLength: data.Len,
                dateStart: new Date(strDate),
                dateEnd: new Date(endDate),
                btmDetails: true
            })
        } else if (data && this.state.FlDtTabIndex === 1) {
            this.btmRow = data;
            this.setState({btmGrpAssociated: true})
        } else if (data && this.state.FlDtTabIndex === 2) {
            if (this.state.data[this.state.FlDtIndex].FileGeoZones && this.state.data[this.state.FlDtIndex].FileGeoZones.length > 0) {
                this.state.geoZone2Data = this.removeDuplicates(this.state.data[this.state.FlDtIndex].FileGeoZones, 'ID');
                ;
            }
            this.btmRow = data;
            this.setState({btmGeoZoneAssociation: true})
        } else if (data && this.state.FlDtTabIndex === 3) {
            if (this.state.data[this.state.FlDtIndex].FileGroups && this.state.data[this.state.FlDtIndex].FileGroups.length > 0) {
                for (let i = 0; i < this.state.data[this.state.FlDtIndex].FileGroups.length; i++) {
                    if (this.state.data[this.state.FlDtIndex].FileGroups[i].RateCode) {
                        let temp = this.state.data[this.state.FlDtIndex].FileGroups[i].RateCode.split(/\s*,\s*/);
                        for (let j = 0; j < temp.length; j++) {
                            for (let x = 0; x < this.state.rateCodeList.length; x++) {
                                if (temp[j] === this.state.rateCodeList[x].Name) {
                                    let index = this.state.rateCodesDt.indexOf(this.state.rateCodeList[x].ID);
                                    if (index === -1) {
                                        this.state.rateCodesDt.push(this.state.rateCodeList[x].ID)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.setState({btmRateCodes: true})
        } else if (data && this.state.FlDtTabIndex === 4) {
            if (this.state.data[this.state.FlDtIndex].FileGroups && this.state.data[this.state.FlDtIndex].FileGroups.length > 0) {
                for (let i = 0; i < this.state.data[this.state.FlDtIndex].FileGroups.length; i++) {
                    if (this.state.data[this.state.FlDtIndex].FileGroups[i].PickupGeozone) {
                        let temp = this.state.data[this.state.FlDtIndex].FileGroups[i].PickupGeozone.split(/\s*,\s*/);
                        for (let j = 0; j < temp.length; j++) {
                            for (let x = 0; x < this.state.geoZoneData.length; x++) {
                                if (temp[j] === this.state.geoZoneData[x].Name) {
                                    let index = this.state.geoZone2Data.indexOf(this.state.geoZoneData[x]);
                                    if (index === -1) {
                                        this.state.geoZone2Data.push(this.state.geoZoneData[x])
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.btmRow = data;
            this.setState({btmGeoZoneAssociation: true})
        }
    }

    setContextMenu(type) {
        if (type === "Geozone") {
            if (this.state.data[this.state.FlDtIndex].FileGeoZones && this.state.data[this.state.FlDtIndex].FileGeoZones.length > 0) {
                this.state.geoZone2Data = this.state.data[this.state.FlDtIndex].FileGeoZones;
            }
            this.setState({btmGeoZoneAssociation: true, rightAction: 0, FlDtTabIndex: 2})
        } else if (type === "Ratecode") {
            if (this.state.data[this.state.FlDtIndex].RateCode) {
                let temp = this.state.data[this.state.FlDtIndex].RateCode.split(/\s*,\s*/);
                for (let j = 0; j < temp.length; j++) {
                    for (let x = 0; x < this.state.rateCodeList.length; x++) {
                        if (temp[j] === this.state.rateCodeList[x].Name) {
                            let index = this.state.rateCodesDt.indexOf(this.state.rateCodeList[x].ID);
                            if (index === -1) {
                                this.state.rateCodesDt.push(this.state.rateCodeList[x].ID)
                            }
                        }
                    }
                }
            }
            this.setState({btmRateCodes: true, rightAction: 0})
        } else if (type === "Pickup") {
            if (this.state.data[this.state.FlDtIndex].PickupGeozone) {
                let temp = this.state.data[this.state.FlDtIndex].PickupGeozone.split(/\s*,\s*/);
                for (let j = 0; j < temp.length; j++) {
                    for (let x = 0; x < this.state.geoZoneData.length; x++) {
                        if (temp[j] === this.state.geoZoneData[x].Name) {
                            let index = this.state.geoZone2Data.indexOf(this.state.geoZoneData[x]);
                            if (index === -1) {
                                this.state.geoZone2Data.push(this.state.geoZoneData[x])
                            }
                        }
                    }
                }
            }
            this.setState({btmGeoZoneAssociation: true, rightAction: 0, FlDtTabIndex: 4})
        }

    }

    copyVideo(type) {
        console.log("call copyvideo",)
        if (this.state.deletData.length > 0 && this.state.grpDelete.length > 0) {
            let rowdata = [];
            let grpDtId = [];
            let myobj;
            for (let i = 0; i < this.state.deletData.length; i++) {
                let data = this.state.data[this.state.deletData[i]];
                let obj;
                console.log("data for copy data",data);
                if(data){
                    if (type === 0) {
                        obj = {
                            "Banner1": data.Banner1, //ver banner  id
                            "Banner2": data.Banner2, //hr banner id
                            "BIMAGE": 0,
                            "Channel": data.Channel,
                            "ColorStatus": data.ColorStatus,
                            "DATEEND": data.DATEEND,
                            "DATESTART": data.DATESTART,
                            "EXPDATE": data.EXPDATE,
                            "FILE1ID": 0,
                            "FILEID": data.FILEID, ///video file id
                            "FULLSCR": data.FULLSCR,
                            "FULLSCR_NG": data.FULLSCR_NG,
                            "GROUP_ADS_ID": data.GROUP_ADS_ID, ///group id
                            "Height": 0,
                            "IndexType": data.IndexType, // indextype
                            "IsDeleted": data.IsDeleted,
                            "Len": data.Len,
                            "ORDERLOOP": data.ORDERLOOP,
                            "PlayerMode": 0,
                            "Priority": 0,
                            "strDATEEND": moment(data.DATEEND).format("ddd MMM DD YYYY"),
                            "strDATESTART": moment(data.DATESTART).format("ddd MMM DD YYYY"),
                            "TIMEEND": data.TIMEEND,
                            "TIMESTART": data.TIMESTART,
                            "Type": data.Type,
                            "VideoMicrosite": 0,
                            "Width": 0,
                            "IsImage":data.IsImage,
                            "Network":data.Network,
                            "Weekpart":data.Weekpart,
                        }
                    } else {
                        obj = {
                            "Channel": data.Channel,
                            "ColorStatus": data.ColorStatus,
                            "EndDate": moment(data.DATEEND).format("ddd MMM DD YYYY"),
                            "FileId": 0,
                            "FileId_H": data.Banner1,
                            "FileId_V": data.Banner2,
                            "GroupAdsId": data.GROUP_ADS_ID,
                            "Length": data.Len,
                            "OrderLoop": data.ORDERLOOP,
                            "PlayerMode": 0,
                            "StartDate": moment(data.DATESTART).format("ddd MMM DD YYYY"),
                            "StatusID": data.StatusID,
                            "TimeEnd": data.TIMEEND,
                            "TimeStart": data.TIMESTART,
                        }
                    }
                    rowdata.push(obj)
                }

            }
            for (let i = 0; i < this.state.grpDelete.length; i++) {
                let id = this.state.grpData[this.state.grpDelete[i]].Group_ADS_ID;
                grpDtId.push(id)
            }
            if (type === 0) {
                myobj = {
                    "groupIds": grpDtId,
                    "videos": rowdata
                }
            } else {
                myobj = {
                    "groupIds": grpDtId,
                    "banners": rowdata
                }
            }
            postData("GroupAds_Flash_Video/AddAllVideosToGroups", myobj)
                .then(res => {
                    if (res.data.ReturnCode === 0) {
                        let gData = this.state.grpData;
                        this.setState({
                            dlgtitle: "Information",
                            message: "Copied Successfully",
                            dlgType: "information",
                            dlgEnable: true,
                            deletData: [],
                            grpDelete: [],
                            grpData:[],
                            grpLoading:true,
                        }, () => {
                            this.state.grpData=gData;
                            this.state.grpLoading = false;
                            this.setSwicthCol(swictCol[this.state.tabIndex], "Group", "fetchGrp");
                            this.getRecords("GroupADSFLFiles/Fetch");
                        })
                    } else {
                        this.setState({
                            dlgtitle: "Information",
                            message: "Failed please try again",
                            dlgType: "information",
                            dlgEnable: true,
                            deletData: [],
                            grpDelete: []
                        }, () => {
                            this.setSwicthCol(swictCol[this.state.tabIndex], "Group", "fetchGrp")
                        })
                    }
                })
        } else {
            let msg = ''
            if (this.state.deletData.length === 0) {
                msg = "Please select rows"
            } else {
                msg = "Please select group"
            }
            this.setState({dlgtitle: "Information", message: msg, dlgType: "information", dlgEnable: true,})
        }

    }

    setschedLoadFiles(type) {
        if (type === 0) {
            this.addobj.WebVisibleURL = "";
            this.addobj.FileName = "";
            this.state.flEditData.WebVisibleURL = "";
            this.state.flEditData.FileName = "";
            this.state.flEditData.FILEID = 0;
            this.addobj.FILEID = 0;
            this.setState({imgfileselected:false});
            this.setState({fScreen:0})
        } else if (type === 1) {
            this.addobj.WebVisibleURLHBanner = "";
            this.addobj.HBannerName = "";
            this.state.flEditData.WebVisibleURLHBanner = "";
            this.state.flEditData.HBannerName = "";
            this.state.flEditData.Banner2 = 0;
            this.addobj.Banner2 = 0;

        } else if (type === 2) {
            this.addobj.WebVisibleURLVBanner = "";
            this.addobj.VBannerName = ""
            this.state.flEditData.WebVisibleURLVBanner = "";
            this.state.flEditData.VBannerName = "";
            this.state.flEditData.Banner1 = 0
            this.addobj.Banner1 = 0;
        }
        this.setState({refresh: true});

    }

    resetFlDetails() {
        var temarr = this.state.WeekPartArray;
        if(temarr && temarr.length>0){
            temarr.forEach(function(item){
                item.isselected=true;
            });
            this.setState({WeekPartArray:temarr});
        }
        console.log("this week array",this.state.WeekPartArray)
        this.setState({
            fScreen: 0,
            VideoMicrosite: false,
            order: 1,
            mSite: 0,
            dateStart: new Date(),
            dateEnd: new Date(),
            channel: 0,
            typeL: 0,
            timeEndhr: 23,
            timeEndmin: 59,
            timeSrthr: 0,
            timeSrtmin: 0,
            fLength: 0,
            grp1Index: [],
            grp2Index: [],
            grp2Data: [],
            schedVideo: false,
            schedBanner: false,
            grpSelection: false,
            provider: 0,
            scheduleGeoZonening:false,
            geoZoneIncluded:false,
            geoZoneExcluded:false,
            geoZone2Data:false,
            network:null,
            imgfileselected:false,
            provider:null,
            weekAllDay:true,
            WeekPart:[1,2,3,4,5,6,0],
            enableAltImge:false,
            isImage:0


        })
        this.addobj = {
            VBannerName: "",
            HBannerName: "",
            FileName: "",
            WebVisibleURLVBanner: "",
            WebVisibleURLHBanner: "",
            WebVisibleURL: "",
            Banner1: 0,
            Banner2: 0,
            mSite: 0,
            VideoMicrosite: false,
            fScreen: 0

        };
        this.fileType = "";
    }

    seteditchannet(channel) {
        this.setState({channel: channel});
    }

    seteditLoopType(channel) {
        this.state.flEditData.indexType = channel
        this.setState({channel: channel});
    }


    ///new meths for group view

    handleRowClick = (e, data) => {
        console.log("selected data", e.original);
        if (e.original) {
            this.setState({dataLoading: true});
            this.setState({
                selectedGroupData: e.original,
                groupVideoCount: e.original.VideoCount,
                groupBannerCount: e.original.BannerCount
            });

        }
    }

    getTabDataCount(key) {
        //console.log("key is",key);
        if (key == "Videos") {
            return this.state.groupVideoCount;
        } else {
            return this.state.groupBannerCount;
        }
    }

    showPreview(Url) {
        //Url = "https://localhost:44382/EmulationFiles/ch2.mp4";
        this.setState({dlgtitle: "Preview", message: Url, dlgType: "media", dlgEnable: true});

    }

    convertExportData(data) {
        console.log("call convertExportData");
        return data;
    }
    checkAllWeekPart(){

    }
    checkWeekPart(){

    }

    onchangeNetwork(value){
        this.setState({network: value});
        console.log("value network",value);
        if(value=="UNITED"){
            this.setState({enableAltImge: true});

        }else{
            this.setState({enableAltImge: false});
        }

    }

    onchangeNetworkonEdit(value){
        this.setState({network: value});
        this.state.flEditData.Network= value
        console.log("value network",value);
        if(value=="UNITED"){
            this.setState({enableAltImge: true});

        }else{
            this.setState({enableAltImge: false});
        }
    }



    render() {
        return (
            <div>
                {
                    this.state.loading ?
                        <div className="Loader">
                            <Loader
                                type="Oval"
                                color="#FFFFFF"
                                height={70}
                                width={70}
                            />
                        </div>
                        : this.state.schedBanner ?
                        <div className="Loader">
                            <div className="SchedBnrWrp" draggable={true}>
                                <div className="ForgPassTitle ShedTitle">
                                    <div style={{"width": "96%"}}>Media Scheduling
                                    </div>
                                    <div className="ShedHide" onClick={() => this.resetFlDetails()}>X
                                    </div>
                                </div>
                                <div className="SchedBnrInptWrp">
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt1">Order *</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <input style={{"width": "55%"}} className="SchedBnrPopinpt" type="number"
                                               min="1" max="65535" value={this.state.order}
                                               onChange={(e) => this.setState({order: e.target.value})}></input>
                                    </div>
                                    <div className="leftDiv-md2">
                                    </div>
                                    <div className="RightDiv-md2">
                                    </div>


                                </div>
                                <div className="SchedBnrInptWrp">
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt">Channel *</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <select style={{"width": "59%"}} className="SchedDropDwn1"
                                                onChange={(e) => this.setState({channel: e.target.value})}
                                                value={this.state.channel}>
                                            <option value={0}>ALL</option>
                                            <option value={1}>NBC</option>
                                            <option value={2}>NYCM</option>
                                        </select>
                                    </div>
                                    <div className="leftDiv-md2">
                                    </div>
                                    <div className="RightDiv-md2">
                                    </div>


                                </div>
                                <div className="SchedEdtFileTopWrp">
                                    <div className="SchedEdtFileTopChild"
                                         onClick={() => this.loadFiles(3, "Vbanner", "Bsched")}>
                                        <span className="SchedBnrPopImgTypetxt">Vertical Banner</span>
                                        {
                                            this.addobj && this.addobj.WebVisibleURLVBanner ?
                                                <div>
                                                    <div className="SchedBnrpopImgWrp">
                                                        <img src={this.addobj.WebVisibleURLVBanner}
                                                             className="SchedBnrpopImg_V"></img>
                                                        <div className="SchedBnrpopImgOvrWrp">
                                                            <img
                                                                src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.setschedLoadFiles(2)
                                                            }}></img>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="SchedBnrPopImgTypetxt1">{this.addobj.VBannerName}</span>
                                                </div>
                                                :
                                                <div>
                                                    <img src={require("../../../Assets/Images/images.jpg")}
                                                         className="SchedBnrpopImg"></img>
                                                    <span
                                                        className="SchedBnrPopImgTypetxt1">{this.addobj.VBannerName ? this.addobj.VBannerName : "No Image"}</span>
                                                </div>
                                        }
                                        {
                                            this.state.typeL === 3 || this.state.typeL === "3" &&
                                            <div className="SchedDisbleWrp"></div>
                                        }
                                    </div>
                                    <div className="SchedEdtFileTopChild"
                                         onClick={() => this.loadFiles(2, "Hbanner", "Bsched")}>
                                        <span className="SchedBnrPopImgTypetxt">Horizontal Banner</span>
                                        {
                                            this.addobj && this.addobj.WebVisibleURLHBanner ?
                                                <div>
                                                    <div className="SchedBnrpopImgWrp">
                                                        <img src={this.addobj.WebVisibleURLHBanner}
                                                             className="SchedBnrpopImg_H"></img>
                                                        <div className="SchedBnrpopImgOvrWrp">
                                                            <img
                                                                src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.setschedLoadFiles(1)
                                                            }}></img>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className="SchedBnrPopImgTypetxt1">{this.addobj.HBannerName}</span>
                                                </div>
                                                :
                                                <div>
                                                    <img src={require("../../../Assets/Images/images.jpg")}
                                                         className="SchedBnrpopImg"></img>
                                                    <span
                                                        className="SchedBnrPopImgTypetxt1">{this.addobj.HBannerName ? this.addobj.HBannerName : "No Image"}</span>
                                                </div>
                                        }

                                    </div>

                                </div>
                                <div className="SchedBnrPopImgWrp2">
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt">Date Start *</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <DatePicker selected={this.state.dateStart}
                                                    onChange={(date) => this.setState({dateStart: date})}
                                                    wrapperClassName="" className="SchedDatePickInptWrp"
                                                    popperPlacement="right-start"></DatePicker>
                                    </div>
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt">Date End *</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <DatePicker selected={this.state.dateEnd}
                                                    onChange={(date) => this.setState({dateEnd: date})}
                                                    wrapperClassName="" className="SchedDatePickInptWrp"
                                                    popperPlacement="right-start"></DatePicker>
                                    </div>

                                </div>
                                <div className="SchedBnrPopImgWrp2" style={{marginTop: "13px"}}>
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt">Time Start *</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <input className="SchedBnrPopinpt2" type="number" min="0" max="23"
                                               value={this.state.timeSrthr}
                                               onChange={(e) => this.setState({timeSrthr: e.target.value})}></input>
                                        <input className="SchedBnrPopinpt2" type="number" min="0" max="59"
                                               value={this.state.timeSrtmin}
                                               onChange={(e) => this.setState({timeSrtmin: e.target.value})}></input>
                                    </div>
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt" style={{marginLeft: "2%"}}>Time End *</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <input className="SchedBnrPopinpt2" type="number" min="0" max="23"
                                               value={this.state.timeEndhr}
                                               onChange={(e) => this.setState({timeEndhr: e.target.value})}></input>
                                        <input className="SchedBnrPopinpt2" type="number" min="0" max="59"
                                               value={this.state.timeEndmin}
                                               onChange={(e) => this.setState({timeEndmin: e.target.value})}></input>
                                    </div>
                                </div>
                                <div className="SchedBnrPopImgWrp2">
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt"
                                              style={{"padding-right": "5px"}}>Microsite</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <select style={{"width": "59%"}} className="SchedDropDwn1"
                                                onChange={(e) => this.setState({mSite: e.target.value})}
                                                value={this.state.mSite}>
                                            <option value={0}></option>
                                            {
                                                this.state.micrositeList.map((key, index) => {
                                                    return (
                                                        <option value={key.FileID}>{key.TempName}</option>
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
                                <div className="SchedBnrPopImgWrp2">
                                    <div className="leftDiv-md2">
                                        <span className="SchedBnrPopTxt">Length *</span>
                                    </div>
                                    <div className="RightDiv-md2">
                                        <input style={{"width": "59%", "margin-left": "4px"}} min="1" max="65535"
                                               className="SchedBnrPopinpt" type="number" value={this.state.fLength}
                                               onChange={(e) => this.setState({fLength: e.target.value})}></input>
                                    </div>
                                    <div className="leftDiv-md2">
                                    </div>
                                    <div className="RightDiv-md2">
                                    </div>


                                </div>
                                <div className="SchedPopBtnWrp1">
                                    <img style={{paddingRight: "10px"}}
                                         src={require("../../../Assets/Images/next-btn.png")} className=""
                                         onClick={() => this.schedValid(1)}></img>
                                    <img src={require("../../../Assets/Images/Login/cancel-btn.png")} className=""
                                         onClick={() => this.resetFlDetails()}></img>
                                    <div style={{"width": "7%"}}></div>
                                </div>
                            </div>
                            {
                                this.state.loadFile &&
                                <div>
                                    <div className="SchedBnrWrp3">
                                        <div className="ForgPassTitle">Media Filter <img
                                            src={require("../../../Assets/Images/close.png")}
                                            className="SchedColStClose" style={{marginLeft: "82%"}}
                                            onClick={() => this.setState({loadFile: false})}></img></div>
                                        <div className="SchedBnrInptWrp">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: '5%'}}>Uploaded By</span>
                                            <select className="SchedDropDwn1"
                                                    onChange={(e) => this.setState({uploadby: e.target.value}, () => this.filterMedia(this.filterType, this.state.uploadby, "uploadedBy"))}
                                                    value={this.state.uploadby}>
                                                <option value="-1">ALL</option>
                                                {
                                                    this.state.userList.map((key, index) => {
                                                        return (
                                                            <option value={key.userId}>{key.Name}</option>
                                                        )
                                                    })
                                                }

                                            </select>
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: '4%', marginTop: "3px"}}>Tags</span>
                                            <input style={{marginTop: "3px"}}
                                                   onChange={(e) => this.setState({tags: e.target.value})}
                                                   onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "tag")}
                                                   value={this.state.tags}></input>
                                        </div>
                                        <div className="SchedBnrInptWrp">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: '8%', marginTop: "3px"}}>File Name</span>
                                            <input style={{marginTop: "3px"}}
                                                   onChange={(e) => this.setState({searchbyFile: e.target.value})}
                                                   onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "file")}
                                                   value={this.state.searchbyFile}></input>
                                        </div>
                                        <div className="SchedLodFlWrp">

                                            {
                                                this.state.loadFileData && this.state.loadFileData.map((key, index) => (
                                                    key.ContentTypeID === this.filterType &&
                                                    <div className="SchedLodFlChildWrp"
                                                         onDoubleClick={() => this.setLoadFile(key)}>
                                                        {key.ContentTypeID}
                                                        <img src={this.getThumnail(key.WebVisibleURL)}
                                                             className={key.ContentTypeID === 2 ? "MediaFlImgWrp2" : key.ContentTypeID === 3 ? "MediaFlImgWrp3" : "MediaFlImgWrp"}></img>
                                                        <span className="MediaFlTitle">{key.TempName}</span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                this.state.schedVal &&
                                <Dialog title={this.state.dlgtitle} message={this.state.message}
                                        onOk={() => this.setState({schedVal: false})}
                                        onHide={() => this.setState({schedVal: false})}/>
                            }
                        </div>
                        : this.state.schedVideo ?
                            <div className="Loader">
                                <div className="SchedBnrWrp1" draggable={true}>
                                    <div className="ForgPassTitle ShedTitle">
                                        <div style={{"width": "96%"}}>Media Scheduling
                                        </div>
                                        <div className="ShedHide" onClick={() => this.resetFlDetails()}>X</div>

                                    </div>

                                    <div className="SchedEdtFileTopWrp1">
                                        <div className="SchedEdtFileTopChild"
                                             onClick={() => this.loadFiles(1, "video", "Vsched")}>
                                            <span className="SchedBnrPopImgTypetxt">File</span>
                                            {
                                                this.addobj && this.addobj.WebVisibleURL ?
                                                    <div className={"schedBannerMainWrp"}>
                                                        <div className="SchedBnrpopImgWrp">
                                                            <img src={this.getThumnail(this.addobj.WebVisibleURL)}
                                                                 className="SchedBnrpopImg"></img>
                                                            <div className="SchedBnrpopImgOvrWrp">
                                                                <img
                                                                    src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                    className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.setschedLoadFiles(0)
                                                                }}></img>
                                                            </div>
                                                        </div>
                                                        <span className="SchedBnrPopImgTypetxt1">{this.addobj.FileName}</span>
                                                    </div>
                                                    :
                                                    <div>
                                                        <img src={require("../../../Assets/Images/images.jpg")}
                                                             className="SchedBnrpopImg"></img>
                                                        <span
                                                            className="SchedBnrPopImgTypetxt2">{this.addobj.FileName ? this.addobj.FileName : "No image"}</span>
                                                    </div>
                                            }

                                        </div>
                                        <div className="SchedEdtFileTopChild" onClick={(e) => {
                                            e.preventDefault();
                                            this.loadFiles(3, "Vbanner", "Vsched")
                                        }}>
                                            <span className="SchedBnrPopImgTypetxt">Wide Banner</span>
                                            {
                                                this.addobj && this.addobj.WebVisibleURLVBanner ?
                                                    <div className={"schedBannerMainWrp"}>
                                                        <div className="SchedBnrpopImgWrp">
                                                            <img src={this.addobj.WebVisibleURLVBanner}
                                                                 className="SchedBnrpopImg_V"></img>
                                                            <div className="SchedBnrpopImgOvrWrp">
                                                                <img
                                                                    src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                    className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.setschedLoadFiles(2)
                                                                }}></img>
                                                            </div>
                                                        </div>
                                                        <span
                                                            className="SchedBnrPopImgTypetxt1">{this.addobj.VBannerName}</span>
                                                    </div>
                                                    :
                                                    <div>
                                                        <img src={require("../../../Assets/Images/images.jpg")}
                                                             className="SchedBnrpopImg"></img>
                                                        <span
                                                            className="SchedBnrPopImgTypetxt2">{this.addobj.VBannerName ? this.addobj.VBannerName : "No image"}</span>
                                                    </div>
                                            }
                                            {
                                                this.state.fScreen === 1 || this.state.fScreen === "1" || this.state.imgfileselected ?
                                                    <div onClick={(e) => e.stopPropagation()} className="SchedDisbleWrp"
                                                         disabled={true}></div>
                                                    :
                                                    <div></div>
                                            }
                                            {
                                                this.addobj.Banner2 > 0 ?
                                                    <div onClick={(e) => e.stopPropagation()} style={{width:"9%"}} className="SchedDisbleWrp"
                                                         disabled={true}></div>
                                                    :
                                                    <div></div>
                                            }

                                        </div>
                                        <div className="SchedEdtFileTopChild" onClick={(e) => {
                                            e.preventDefault();
                                            this.loadFiles(2, "Hbanner", "Vsched")
                                        }}>
                                            <span className="SchedBnrPopImgTypetxt">Wing Banner</span>
                                            {
                                                this.addobj && this.addobj.WebVisibleURLHBanner ?
                                                    <div className={"schedBannerMainWrp"}>
                                                        <div className="SchedBnrpopImgWrp">
                                                            <img src={this.addobj.WebVisibleURLHBanner}
                                                                 className="SchedBnrpopImg_H"></img>
                                                            <div className="SchedBnrpopImgOvrWrp">
                                                                <img
                                                                    src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                    className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.setschedLoadFiles(1)
                                                                }}></img>
                                                            </div>
                                                        </div>
                                                        <span
                                                            className="SchedBnrPopImgTypetxt1">{this.addobj.HBannerName}</span>
                                                    </div>
                                                    :
                                                    <div>
                                                        <img src={require("../../../Assets/Images/images.jpg")}
                                                             className="SchedBnrpopImg"></img>
                                                        <span
                                                            className="SchedBnrPopImgTypetxt2">{this.addobj.HBannerName ? this.addobj.HBannerName : "No image"}</span>
                                                    </div>
                                            }
                                            {
                                                this.addobj.Banner1 > 0 ?
                                                    <div onClick={(e) => e.stopPropagation()} style={{width:"9%"}} className="SchedDisbleWrp"
                                                         disabled={true}></div>
                                                    :
                                                    <div></div>
                                            }


                                        </div>

                                    </div>

                                    <div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: '-1.5%', marginTop: "10px"}}>Full Screen *</span>
                                        </div>
                                        <div className={this.state.imgfileselected?"RightDiv-md2 disableDiv":"RightDiv-md2"} style={{"margin-left":"6px"}}>
                                            <select style={{width: "77%"}} className="SchedDropDwn1"
                                                    onChange={(e) => {
                                                        if(e.target.value==1) {
                                                            this.addobj.WebVisibleURLHBanner = "";
                                                            this.addobj.WebVisibleURLVBanner = "";
                                                            this.addobj.HBannerName = "";
                                                            this.addobj.VBannerName = "";
                                                            this.addobj.Banner1 = 0;
                                                            this.addobj.Banner2 = 0;
                                                        };
                                                        this.setState({fScreen:e.target.value})
                                                    }}
                                                    value={this.state.fScreen}>
                                                <option value={1}>True</option>
                                                <option value={0}>false</option>
                                            </select>
                                            </div>
                                            {
                                                this.marketid == "GLACIER" ?
                                                    <div className="leftDiv-md2">
                                                        <span className="SchedBnrPopTxt">Loop Type*</span>
                                                    </div>
                                                    :
                                                    <div className="leftDiv-md2">

                                                    </div>
                                            }
                                            {
                                                this.marketid == "GLACIER" ?
                                                    <div className="RightDiv-md2">
                                                        <select style={{ width: "94%" }} className="" onChange={(e) => {

                                                            this.setState({ typeL: e.target.value })
                                                        }} value={this.state.typeL}>
                                                            <option value={0}>AD Loop</option>
                                                            <option value={2}>Welcome Loop</option>
                                                            <option value={3}>Goodbye Loop</option>
                                                            <option value={4}>Payment Loop</option>
                                                            <option value={5}>PairNPay Loop</option>
                                                            
                                                        </select>
                                                    </div>
                                                    : <div className="RightDiv-md2">

                                                    </div>
                                            }

                                        </div>

                                    <div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt1"
                                                  style={{marginLeft: "6.5%"}}>Order *</span>
                                        </div>
                                        <div className="RightDiv1-md2">
                                            <input style={{width: "100%"}} type="number" min="1" max="65535"
                                                   value={this.state.order}
                                                   onChange={(e) => this.setState({order: e.target.value})}></input>
                                        </div>
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt" style={{marginLeft: "8%"}}>Provider</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <select style={{width: "96%"}} className=""
                                                    onChange={(e) => this.setState({provider: e.target.value})}
                                                    value={this.state.provider}>
                                                <option value={""}></option>

                                                {
                                                    this.state.providerData.map((key, index) => {
                                                        return (
                                                            <option value={key.Provider_ID}>{key.Provider_Name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>


                                    </div>
                                    {/*<div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt">Type Loop *</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <select style={{width: "94%"}} className="" onChange={(e) => {
                                                if (e.target.value == 3) {
                                                    this.addobj.WebVisibleURLHBanner = "";
                                                    this.addobj.WebVisibleURLVBanner = "";
                                                    this.addobj.HBannerName = "";
                                                    this.addobj.VBannerName = "";
                                                    this.addobj.Banner1 = 0;
                                                    this.addobj.Banner2 = 0;
                                                    this.state.provider = 0;
                                                    this.state.VideoMicrosite = false;
                                                }
                                                this.setState({typeL: e.target.value})
                                            }} value={this.state.typeL}>
                                                <option value={0}>AD Loop</option>
                                                <option value={2}>Welcome Loop</option>
                                                <option value={3}>Goodbye Loop</option>
                                                <option value={4}>Payment Loop</option>
                                            </select>
                                        </div>
                                        <div className="leftDiv-md2">

                                        </div>
                                        <div className="RightDiv-md2">

                                        </div>
                                    </div>*/}

                                    <div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt" style={{marginLeft: "4%"}}>Channel *</span>
                                        </div>
                                        <div className="RightDiv1-md2">
                                            <select style={{width: "107%"}} className=""
                                                    onChange={(e) => this.setState({channel: e.target.value})}
                                                    value={this.state.channel}>
                                                <option value={0}>ALL</option>
                                                <option value={1}>NBC</option>
                                                <option value={2}>NYCM</option>
                                            </select>
                                        </div>
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt" style={{marginLeft: "8%"}}>AltImage</span>
                                        </div>
                                        <div
                                            className={this.state.enableAltImge?"RightDiv-md2 ":"RightDiv-md2 disableDiv"}>
                                            <select style={{width: "96%"}} className=""
                                                    onChange={(e) => this.setState({altImage: e.target.value})}
                                                    value={this.state.altImage}>
                                                <option value={""}></option>

                                                {
                                                    this.state.altImagesData.map((key, index) => {
                                                        return (
                                                            <option value={key.TempName}>{key.TempName}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>


                                    </div>

                                    <div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt" style={{marginLeft: '5%'}}>Duration *</span>
                                        </div>
                                        <div className="RightDiv1-md2">

                                                    <input style={{width: "100%"}} className="SchedBnrPopinpt" type="number"
                                                           disabled={this.state.isDisableDruration}    onChange={(e) => this.setState({fLength: e.target.value})}      value={this.state.fLength}></input>


                                        </div>
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt" style={{marginLeft: "8%"}}>NetWork *</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <select style={{width: "96%"}} className=""
                                                    onChange={(e) => this.onchangeNetwork(e.target.value)}
                                                    value={this.state.network}>

                                                {
                                                    this.state.networkArray.map((key, index) => {
                                                        return (
                                                            <option value={key}>{key}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: "4.5%"}}>Date Start *</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <DatePicker selected={this.state.dateStart}
                                                        onChange={(date) => this.setState({dateStart: date})}
                                                        wrapperClassName="" className="SchedDatePickInptWrp"
                                                        popperPlacement="right-start"></DatePicker>
                                        </div>
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: "10%"}}>Date End *</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <DatePicker selected={this.state.dateEnd}
                                                        onChange={(date) => this.setState({dateEnd: date})}
                                                        wrapperClassName="" className="SchedDatePickInptWrp"
                                                        popperPlacement="right-start"></DatePicker>
                                        </div>
                                    </div>
                                    <div className="SchedBnrInptWrp" style={{marginTop: "13px"}}>
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt">Time Start *</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <input className="SchedBnrPopinpt2" type="number" min="0" max="23"
                                                   value={this.state.timeSrthr}
                                                   onChange={(e) => this.setState({timeSrthr: e.target.value})}></input>
                                            <input className="SchedBnrPopinpt2" type="number" min="0" max="59"
                                                   value={this.state.timeSrtmin}
                                                   onChange={(e) => this.setState({timeSrtmin: e.target.value})}></input>
                                        </div>
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: "2%"}}>Time End *</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <input className="SchedBnrPopinpt2" type="number" min="0" max="23"
                                                   value={this.state.timeEndhr}
                                                   onChange={(e) => this.setState({timeEndhr: e.target.value})}></input>
                                            <input className="SchedBnrPopinpt2" type="number" min="0" max="59"
                                                   value={this.state.timeEndmin}
                                                   onChange={(e) => this.setState({timeEndmin: e.target.value})}></input>
                                        </div>
                                    </div>

                                    <div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt" style={{marginLeft: '5%'}}>WeekPart *</span>
                                        </div>
                                        <div className="week_part">
                                            {/*{

                                                this.state.WeekPartArray.map((key, index) => {
                                                return (

                                                    <div style={{"width": "14%"}}>
                                                        <ComCheck checked={key.isselected} onClick={(e) => e.preventDefault()} onChange={(e) => {
                                                            this.selDayRow(e,key,index);
                                                        }} label={key.day} containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                                    </div>
                                                )
                                            })

                                            }*/}
                                            {
                                                this.state.WeekPartArray && this.state.WeekPartArray.map((key, index) => {
                                                    return (
                                                        <div style={{"width":"14%"}}>
                                                            <input type="checkbox" id="allEmployeesCheckBox" name="allEmployeesCheckBox" className="styled pending-assign-user weekPartDay"
                                                                   checked={key.isselected} onChange={(e)=>{this.selDayRow(e,key,index)}}>
                                                            </input>
                                                            <span  className="SchedBnrPopTxt">{key.day}</span>
                                                        </div>
                                                    )
                                                })
                                            }



                                        </div>
                                    </div>

                                    <div className="SchedBnrInptWrp">
                                        <div className="leftDiv-md2">

                                        </div>
                                        <div className="week_part">
                                            <div>
                                                <input type="checkbox" id="allEmployeesCheckBox" name="allEmployeesCheckBox" className="styled pending-assign-user AllweekPart"
                                                       checked={this.state.weekAllDay} onChange={(e)=>{this.selAllDayRow(e)}}>
                                                </input>
                                                <span  className="SchedBnrPopTxt">Select/De-select all days</span>
                                            </div>
                                            {/*<div style={{"width": "100%"}}>
                                                <ComCheck checked={this.state.weekAllDay} onClick={(e) => e.preventDefault()} onChange={(e) => {
                                                    this.selAllDayRow(e);
                                                }} label="Select/De-select all days" containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                            </div>*/}



                                        </div>
                                    </div>

                                    <div className="SchedBnrInptWrp" style={{marginTop: "13px"}}>
                                        <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt">GeoZoning</span>
                                        </div>
                                        <div className="RightDiv-md2">
                                            <button style={{ "cursor": "pointer"}}

                                                 className="ForgPassBtn inclusionBtn" onClick={()=>{this.openIncludedGeoZone()}} >Inclusion</button>
                                        </div>
                                        <div className="leftDiv-md2">
                                            <button style={{"paddingRight": "10px", "cursor": "pointer"}}

                                                 className="ForgPassBtn inclusionBtn" onClick={()=>{this.openExcludedGeoZone()}} >Exclusion</button>
                                        </div>
                                        <div className="RightDiv-md2">

                                        </div>
                                    </div>

                                    <div className="SchedPopBtnWrp">
                                        {
                                            this.state.group ?
                                                <img style={{"paddingRight": "10px", "cursor": "pointer"}}
                                                     src={require("../../../Assets/Images/ok-btn.png")}
                                                     disabled={!this.state.isenableschedBtn}
                                                     className={!this.state.isenableschedBtn?"ForgPassBtn disabledBtn":"ForgPassBtn"} onClick={() => this.schedValid(0)}></img>
                                                :
                                                <img style={{"paddingRight": "10px", "cursor": "pointer"}}
                                                     src={require("../../../Assets/Images/next-btn.png")}
                                                     disabled={!this.state.isenableschedBtn}
                                                     className={!this.state.isenableschedBtn?"ForgPassBtn disabledBtn":"ForgPassBtn"} onClick={() => this.schedValid(0)}></img>
                                        }

                                        <img style={{"cursor": "pointer"}}
                                             src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                             className="ForgPassBtn" onClick={() => this.resetFlDetails()}></img>
                                        <div style={{"width": "7%"}}></div>
                                    </div>
                                </div>
                                {
                                    this.state.loadFile &&
                                    <div>
                                        <div className="SchedBnrWrp3">
                                            <div className="ForgPassTitle">Media Filter <img
                                                src={require("../../../Assets/Images/close.png")}
                                                className="SchedColStClose" style={{marginLeft: "82%"}}
                                                onClick={() => this.setState({loadFile: false})}></img></div>
                                            <div className="SchedBnrInptWrp">
                                                <span className="SchedBnrPopTxt"
                                                      style={{marginLeft: '5%'}}>Uploaded By</span>
                                                <select className="SchedDropDwn1"
                                                        onChange={(e) => this.setState({uploadby: e.target.value}, () => this.filterMedia(this.filterType, this.state.uploadby, "uploadedBy"))}
                                                        value={this.state.uploadby}>
                                                    <option value="-1">ALL</option>
                                                    {
                                                        this.state.userList.map((key, index) => {
                                                            return (
                                                                <option value={key.userId}>{key.Name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <span className="SchedBnrPopTxt"
                                                      style={{marginLeft: '4%', marginTop: "3px"}}>Tags</span>
                                                <input style={{marginTop: "3px"}}
                                                       onChange={(e) => this.setState({tags: e.target.value})}
                                                       onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "tag")}
                                                       value={this.state.tags}></input>
                                            </div>
                                            <div className="SchedBnrInptWrp">
                                                <span className="SchedBnrPopTxt"
                                                      style={{marginLeft: '8%', marginTop: "3px"}}>File Name</span>
                                                <input style={{marginTop: "3px"}}
                                                       onChange={(e) => this.setState({searchbyFile: e.target.value})}
                                                       onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "file")}
                                                       value={this.state.searchbyFile}></input>
                                            </div>
                                            <div className="SchedLodFlWrp">
                                                {
                                                    this.state.loadFileData && this.state.loadFileData.map((key, index) => (
                                                        this.filterType=="1"?
                                                            (key.ContentTypeID === this.filterType  || key.ContentTypeID == "7") &&
                                                            <div className="SchedLodFlChildWrp"
                                                                 onDoubleClick={() => this.setLoadFile(key)}>
                                                                <img src={this.getThumnail(key.WebVisibleURL)}
                                                                     className={key.ContentTypeID === 2 ? "MediaFlImgWrp2" : key.ContentTypeID === 3 ? "MediaFlImgWrp3" : "MediaFlImgWrp"}></img>
                                                                <span className="MediaFlTitle">{key.TempName}</span>
                                                            </div>
                                                            :
                                                            key.ContentTypeID === this.filterType &&
                                                            <div className="SchedLodFlChildWrp"
                                                                 onDoubleClick={() => this.setLoadFile(key)}>
                                                                <img src={this.getThumnail(key.WebVisibleURL)}
                                                                     className={key.ContentTypeID === 2 ? "MediaFlImgWrp2" : key.ContentTypeID === 3 ? "MediaFlImgWrp3" : "MediaFlImgWrp"}></img>
                                                                <span className="MediaFlTitle">{key.TempName}</span>
                                                            </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    this.state.schedVal &&
                                    <Dialog title={this.state.dlgtitle} message={this.state.message}
                                            onOk={() => this.setState({schedVal: false})}
                                            onHide={() => this.setState({schedVal: false})}/>
                                }
                            </div>
                            : this.state.editFile ?
                                <div className="Loader">
                                    <div className="SchedBnrWrp1" draggable={true}>
                                        <div className="ForgPassTitle ShedTitle">
                                            <div style={{"width": "96%"}}>Media Scheduling Edit
                                            </div>
                                            <div className="ShedHide" onClick={()=>this.resetEditState()}>X
                                            </div>

                                        </div>

                                        <div className="SchedEdtFileTopWrp1">
                                            {
                                                this.state.flEditData.FileType === 0 &&
                                                <div className="SchedEdtFileTopChild"
                                                     onClick={() => this.loadFiles(1, "video", "Vsched")}>
                                                    <span className="SchedBnrPopImgTypetxt">File</span>
                                                    {
                                                        this.state.flEditData && this.state.flEditData.WebVisibleURL ?
                                                            <div>
                                                                <div className="SchedBnrpopImgWrp">
                                                                    <img src={this.getThumnail(this.state.flEditData.WebVisibleURL)}
                                                                         className="SchedBnrpopImg"></img>
                                                                    <div className="SchedBnrpopImgOvrWrp">
                                                                        <img
                                                                            src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                            className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            this.setschedLoadFiles(0)
                                                                        }}></img>
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className="SchedBnrPopImgTypetxt1">{this.state.flEditData.FileName}</span>
                                                            </div>
                                                            :
                                                            <div>
                                                                <img src={require("../../../Assets/Images/images.jpg")}
                                                                     className="SchedBnrpopImg"></img>
                                                                <span
                                                                    className="SchedBnrPopImgTypetxt2">{this.state.flEditData.FileName ? this.state.flEditData.FileName : "No image"}</span>
                                                            </div>
                                                    }

                                                </div>
                                            }

                                            <div className="SchedEdtFileTopChild" onClick={(e) => {
                                                e.preventDefault();
                                                this.loadFiles(3, "Vbanner", "Vsched")
                                            }}>
                                                <span className="SchedBnrPopImgTypetxt">Wide Banner</span>
                                                {
                                                    this.state.flEditData && this.state.flEditData.WebVisibleURLVBanner ?
                                                        <div>
                                                            <div className="SchedBnrpopImgWrp">
                                                                <img src={this.state.flEditData.WebVisibleURLVBanner}
                                                                     className="SchedBnrpopImg_V"></img>
                                                                <div className="SchedBnrpopImgOvrWrp">
                                                                    <img
                                                                        src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                        className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        this.setschedLoadFiles(2)
                                                                    }}></img>
                                                                </div>
                                                            </div>
                                                            <span
                                                                className="SchedBnrPopImgTypetxt1">{this.state.flEditData.VBannerName}</span>
                                                        </div>
                                                        :
                                                        <div>
                                                            <img src={require("../../../Assets/Images/images.jpg")}
                                                                 className="SchedBnrpopImg"></img>
                                                            <span
                                                                className="SchedBnrPopImgTypetxt2">{this.state.flEditData.VBannerName ? this.state.flEditData.VBannerName : "No image"}</span>
                                                        </div>
                                                }
                                                {
                                                    this.state.fScreen === 1 || this.state.fScreen === "1"  ?
                                                        <div onClick={(e) => e.stopPropagation()} className="SchedDisbleWrp"
                                                             disabled={true}></div>
                                                        :
                                                        <div></div>
                                                }
                                                {
                                                    this.state.flEditData.Banner2 > 0 ?
                                                        <div onClick={(e) => e.stopPropagation()} style={{width:"9%"}} className="SchedDisbleWrp"
                                                             disabled={true}></div>
                                                        :
                                                        <div></div>
                                                }

                                            </div>
                                            <div className="SchedEdtFileTopChild" onClick={(e) => {
                                                e.preventDefault();
                                                this.loadFiles(2, "Hbanner", "Vsched")
                                            }}>
                                                <span className="SchedBnrPopImgTypetxt">Wing Banner</span>
                                                {
                                                    this.state.flEditData && this.state.flEditData.WebVisibleURLHBanner ?
                                                        <div>
                                                            <div className="SchedBnrpopImgWrp">
                                                                <img src={this.state.flEditData.WebVisibleURLHBanner}
                                                                     className="SchedBnrpopImg_H"></img>
                                                                <div className="SchedBnrpopImgOvrWrp">
                                                                    <img
                                                                        src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                        className="SchedGrpTableToolImg3" onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        this.setschedLoadFiles(1)
                                                                    }}></img>
                                                                </div>
                                                            </div>
                                                            <span
                                                                className="SchedBnrPopImgTypetxt1">{this.state.flEditData.HBannerName}</span>
                                                        </div>
                                                        :
                                                        <div>
                                                            <img src={require("../../../Assets/Images/images.jpg")}
                                                                 className="SchedBnrpopImg"></img>
                                                            <span
                                                                className="SchedBnrPopImgTypetxt2">{this.state.flEditData.HBannerName ? this.state.flEditData.HBannerName : "No image"}</span>
                                                        </div>
                                                }
                                                {
                                                    this.state.flEditData.Banner1 > 0 ?
                                                        <div onClick={(e) => e.stopPropagation()} style={{width:"9%"}} className="SchedDisbleWrp"
                                                             disabled={true}></div>
                                                        :
                                                        <div></div>
                                                }


                                            </div>

                                        </div>

                                        <div className="SchedBnrInptWrp">
                                            <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: '-1.5%', marginTop: "10px"}}>Full Screen *</span>
                                            </div>
                                            <div className="RightDiv-md2" style={{"margin-left":"6px"}}>
                                                <select style={{width: "77%"}} className="SchedDropDwn1"
                                                        onChange={(e) => {
                                                            if(e.target.value==1) {
                                                                this.state.flEditData.WebVisibleURLHBanner = "";
                                                                this.state.flEditData.WebVisibleURLVBanner = "";
                                                                this.state.flEditData.HBannerName = "";
                                                                this.state.flEditData.VBannerName = "";
                                                                this.state.flEditData.Banner1 = 0;
                                                                this.state.flEditData.Banner2 = 0;
                                                            };
                                                            this.state.flEditData.FULLSCR_NG=e.target.value;
                                                            this.setState({fScreen:e.target.value})
                                                        }}
                                                        value={this.state.fScreen}>
                                                    <option value={1}>True</option>
                                                    <option value={0}>false</option>
                                                </select>
                                            </div>
                                            {
                                                this.marketid=="GLACIER"?
                                                <div className="leftDiv-md2">
                                                    <span className="SchedBnrPopTxt">Loop Type*</span>
                                                </div>
                                                :
                                                <div className="leftDiv-md2">

                                                </div>
                                            }
                                            {
                                                this.marketid=="GLACIER"?
                                                <div className="RightDiv-md2">
                                                    <select style={{ width: "94%" }} className="" onChange={(e) => {
                                                        this.state.flEditData.IndexType = e.target.value;

                                                        this.setState({ typeL: e.target.value })
                                                    }} value={this.state.typeL}>
                                                        <option value={0}>AD Loop</option>
                                                        <option value={2}>Welcome Loop</option>
                                                        <option value={3}>Goodbye Loop</option>
                                                        <option value={4}>Payment Loop</option>
                                                        <option value={5}>PairNPay Loop</option>
                                                    </select>
                                                </div>
                                                :
                                                <div className="RightDiv-md2">

                                                </div>
                                            }


                                        </div>

                                        <div className="SchedBnrInptWrp">
                                            <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt1"
                                                  style={{marginLeft: "6.5%"}}>Order *</span>
                                            </div>
                                            <div className="RightDiv1-md2">
                                                <input style={{width: "100%"}} type="number" min="1" max="65535"
                                                       value={this.state.flEditData.ORDERLOOP}
                                                       onChange={(e) => {this.setState({order: e.target.value});this.state.flEditData.ORDERLOOP=e.target.value}}></input>
                                            </div>
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt" style={{marginLeft: "8%"}}>Provider</span>
                                            </div>
                                            <div className="RightDiv-md2">
                                                <select style={{width: "96%"}} className=""
                                                        onChange={(e) => {this.setState({provider: e.target.value});
                                                            this.state.flEditData.provider = e.target.value}}
                                                        value={this.state.provider}>
                                                    <option value={""}></option>

                                                    {
                                                        this.state.providerData.map((key, index) => {
                                                            return (
                                                                <option value={key.Provider_ID}>{key.Provider_Name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>


                                        </div>


                                        <div className="SchedBnrInptWrp">
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt" style={{marginLeft: "4%"}}>Channel *</span>
                                            </div>
                                            <div className="RightDiv1-md2">
                                                <select style={{width: "107%"}} className=""
                                                        onChange={(e)=>this.seteditchannet(e.target.value)}
                                                        value={this.state.channel}>
                                                    <option value={0}>ALL</option>
                                                    <option value={1}>NBC</option>
                                                    <option value={2}>NYCM</option>
                                                </select>
                                            </div>
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt" style={{marginLeft: "8%"}}>AltImage</span>
                                            </div>
                                            <div
                                                className={this.state.enableAltImge?"RightDiv-md2 ":"RightDiv-md2 disableDiv"}>
                                                <select style={{width: "96%"}} className=""
                                                        onChange={(e) => {this.state.flEditData.altImage = e.target.value;this.setState({altImage: e.target.value})}}
                                                        value={this.state.flEditData.altImage}>
                                                    <option value={""}></option>

                                                    {
                                                        this.state.altImagesData.map((key, index) => {
                                                            return (
                                                                <option value={key.TempName}>{key.TempName}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>


                                        </div>

                                        <div className="SchedBnrInptWrp">
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt" style={{marginLeft: '5%'}}>Duration *</span>
                                            </div>
                                            <div className="RightDiv1-md2">
                                                <input style={{width: "100%"}} className="SchedBnrPopinpt" type="number"
                                                       disabled={this.state.isDisableDruration} onChange={(e)=>{this.setState({fLength:e.target.value});this.state.flEditData.Len=e.target.value}} value={this.state.flEditData.Len}></input>
                                            </div>
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt" style={{marginLeft: "8%"}}>NetWork *</span>
                                            </div>
                                            <div className="RightDiv-md2">
                                                <select style={{width: "96%"}} className=""
                                                        onChange={(e) => this.onchangeNetworkonEdit(e.target.value)}
                                                        value={this.state.flEditData.Network}>

                                                    {
                                                        this.state.networkArray.map((key, index) => {
                                                            return (
                                                                <option value={key}>{key}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="SchedBnrInptWrp">
                                            <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: "4.5%"}}>Date Start *</span>
                                            </div>
                                            <div className="RightDiv-md2">
                                                <DatePicker selected={this.state.flEditData.DATESTART}
                                                            onChange={(date) => {this.setState({dateStart: date});this.state.flEditData.DATESTART=date}}
                                                            wrapperClassName="" className="SchedDatePickInptWrp"
                                                            popperPlacement="right-start"></DatePicker>
                                            </div>
                                            <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: "10%"}}>Date End *</span>
                                            </div>
                                            <div className="RightDiv-md2">
                                                <DatePicker selected={this.state.flEditData.DATEEND}
                                                            onChange={(date) => {this.setState({dateEnd: date});this.state.flEditData.DATEEND=date}}
                                                            wrapperClassName="" className="SchedDatePickInptWrp"
                                                            popperPlacement="right-start"></DatePicker>
                                            </div>
                                        </div>
                                        <div className="SchedBnrInptWrp" style={{marginTop: "13px"}}>
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt">Time Start *</span>
                                            </div>
                                            <div className="RightDiv-md2">
                                                <input className="SchedBnrPopinpt2" type="number" min="0" max="23"
                                                       value={this.state.timeSrthr}
                                                       onChange={(e) => this.setState({timeSrthr: e.target.value})}></input>
                                                <input className="SchedBnrPopinpt2" type="number" min="0" max="59"
                                                       value={this.state.timeSrtmin}
                                                       onChange={(e) => this.setState({timeSrtmin: e.target.value})}></input>
                                            </div>
                                            <div className="leftDiv-md2">
                                            <span className="SchedBnrPopTxt"
                                                  style={{marginLeft: "2%"}}>Time End *</span>
                                            </div>
                                            <div className="RightDiv-md2">
                                                <input className="SchedBnrPopinpt2" type="number" min="0" max="23"
                                                       value={this.state.timeEndhr}
                                                       onChange={(e) => this.setState({timeEndhr: e.target.value})}></input>
                                                <input className="SchedBnrPopinpt2" type="number" min="0" max="59"
                                                       value={this.state.timeEndmin}
                                                       onChange={(e) => this.setState({timeEndmin: e.target.value})}></input>
                                            </div>
                                        </div>

                                        <div className="SchedBnrInptWrp">
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt" style={{marginLeft: '5%'}}>WeekPart *</span>
                                            </div>
                                            <div className="week_part">
                                                {
                                                    this.state.flEditData.WeekPartArray && this.state.flEditData.WeekPartArray.length>0 && this.state.flEditData.WeekPartArray.map((key, index) => {
                                                        return (
                                                            <div style={{"width":"14%"}}>
                                                                <input type="checkbox" id="allEmployeesCheckBox" name="allEmployeesCheckBox" className="styled pending-assign-user weekPartDay"
                                                                       checked={key.isselected} onChange={(e)=>{this.selDayRow(e,key,index)}}>
                                                                </input>
                                                                <span  className="SchedBnrPopTxt">{key.day}</span>
                                                            </div>
                                                        )
                                                    })
                                                }



                                            </div>
                                        </div>

                                        <div className="SchedBnrInptWrp">
                                            <div className="leftDiv-md2">

                                            </div>
                                            <div className="week_part">
                                                <div>
                                                    <input type="checkbox" id="allEmployeesCheckBox" name="allEmployeesCheckBox" className="styled pending-assign-user AllweekPart"
                                                           checked={this.state.flEditData.weekAllDay} onChange={(e)=>{this.selAllDayRow(e)}}>
                                                    </input>
                                                    <span  className="SchedBnrPopTxt">Select/De-select all days</span>
                                                </div>
                                                {/*<div style={{"width": "100%"}}>
                                                 <ComCheck checked={this.state.weekAllDay} onClick={(e) => e.preventDefault()} onChange={(e) => {
                                                 this.selAllDayRow(e);
                                                 }} label="Select/De-select all days" containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"}></ComCheck>
                                                 </div>*/}



                                            </div>
                                        </div>

                                        <div className="SchedBnrInptWrp" style={{marginTop: "13px"}}>
                                            <div className="leftDiv-md2">
                                                <span className="SchedBnrPopTxt">GeoZoning</span>
                                            </div>
                                            <div className="RightDiv-md2">
                                                <button style={{ "cursor": "pointer"}}

                                                        className="ForgPassBtn inclusionBtn" onClick={()=>{this.openIncludedGeoZone()}} >Inclusion</button>
                                            </div>
                                            <div className="leftDiv-md2">
                                                <button style={{"paddingRight": "10px", "cursor": "pointer"}}

                                                        className="ForgPassBtn inclusionBtn" onClick={()=>{this.openExcludedGeoZone()}} >Exclusion</button>
                                            </div>
                                            <div className="RightDiv-md2">

                                            </div>
                                        </div>

                                        <div className="SchedPopBtnWrp">
                                            <div className="SchedEditBtnWrp" style={{marginTop:"0px"}} >
                                                <img style={{paddingRight:"10px"}} src={require("../../../Assets/Images/Login/ok-btn.png")} className="" onClick={()=>this.editLoadFile()}></img>
                                                <img src={require("../../../Assets/Images/Login/cancel-btn.png")} className=""  onClick={()=>this.resetEditState()}></img>
                                                <div style={{"width":"7%"}}></div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        this.state.loadFile &&
                                        <div>
                                            <div className="SchedBnrWrp3">
                                                <div className="ForgPassTitle">Media Filter <img
                                                    src={require("../../../Assets/Images/close.png")}
                                                    className="SchedColStClose" style={{marginLeft: "82%"}}
                                                    onClick={() => this.setState({loadFile: false})}></img></div>
                                                <div className="SchedBnrInptWrp">
                                                <span className="SchedBnrPopTxt"
                                                      style={{marginLeft: '5%'}}>Uploaded By</span>
                                                    <select className="SchedDropDwn1"
                                                            onChange={(e) => this.setState({uploadby: e.target.value}, () => this.filterMedia(this.filterType, this.state.uploadby, "uploadedBy"))}
                                                            value={this.state.uploadby}>
                                                        <option value="-1">ALL</option>
                                                        {
                                                            this.state.userList.map((key, index) => {
                                                                return (
                                                                    <option value={key.userId}>{key.Name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <span className="SchedBnrPopTxt"
                                                          style={{marginLeft: '4%', marginTop: "3px"}}>Tags</span>
                                                    <input style={{marginTop: "3px"}}
                                                           onChange={(e) => this.setState({tags: e.target.value})}
                                                           onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "tag")}
                                                           value={this.state.tags}></input>
                                                </div>
                                                <div className="SchedBnrInptWrp">
                                                <span className="SchedBnrPopTxt"
                                                      style={{marginLeft: '8%', marginTop: "3px"}}>File Name</span>
                                                    <input style={{marginTop: "3px"}}
                                                           onChange={(e) => this.setState({searchbyFile: e.target.value})}
                                                           onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "file")}
                                                           value={this.state.searchbyFile}></input>
                                                </div>
                                                <div className="SchedLodFlWrp">
                                                    {
                                                        this.state.loadFileData && this.state.loadFileData.map((key, index) => (

                                                                this.filterType=="1"?
                                                                (key.ContentTypeID === this.filterType  || key.ContentTypeID == "7") &&
                                                                <div className="SchedLodFlChildWrp"
                                                                     onDoubleClick={() => this.setLoadFile(key)}>
                                                                    <img src={this.getThumnail(key.WebVisibleURL)}
                                                                         className={key.ContentTypeID === 2 ? "MediaFlImgWrp2" : key.ContentTypeID === 3 ? "MediaFlImgWrp3" : "MediaFlImgWrp"}></img>
                                                                    <span className="MediaFlTitle">{key.TempName}</span>
                                                                </div>
                                                            :
                                                                key.ContentTypeID === this.filterType  &&
                                                                <div className="SchedLodFlChildWrp"
                                                                     onDoubleClick={() => this.setLoadFile(key)}>
                                                                    <img src={this.getThumnail(key.WebVisibleURL)}
                                                                         className={key.ContentTypeID === 2 ? "MediaFlImgWrp2" : key.ContentTypeID === 3 ? "MediaFlImgWrp3" : "MediaFlImgWrp"}></img>
                                                                    <span className="MediaFlTitle">{key.TempName}</span>
                                                                </div>




                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        this.state.schedVal &&
                                        <Dialog title={this.state.dlgtitle} message={this.state.message}
                                                onOk={() => this.setState({schedVal: false})}
                                                onHide={() => this.setState({schedVal: false})}/>
                                    }
                                </div>
                                : this.state.upload ?
                                    <div className="Loader">
                                        {
                                            this.state.fileUplaodLoding &&
                                            <div className="fileuploadLoading">
                                                <img src={require("../../../Assets/Images/kOnzy.gif")}></img>
                                            </div>
                                        }

                                        <div className="MediaUpldMainWrp">

                                            <div className="ForgPassTitle">File Upload</div>

                                            <input type="file" accept={this.uploadFileExt} style={{display: "none"}} ref="fileUploader"
                                                   onChange={(e) => {
                                                       this.setState({fileUplaodLoding: true});
                                                       this.onFileChange(e)
                                                   }} multiple></input>
                                            <img src={require("../../../Assets/Images/Media/select-files.png")}
                                                 className="MeadiaUpldSlFl"
                                                 onClick={() => this.refs.fileUploader.click()}></img>
                                            <ReactTable
                                                columns={this.upColumns}
                                                data={this.state.uplddata}
                                                showPagination={false}
                                                sortable={false}
                                                minRows={10}
                                                defaultPageSize={10}
                                                pageSize={this.state.uplddata.length}
                                                NoDataComponent={() => null}

                                            />
                                            <div className="MediaFlUpldBtm">
                                                <img src={require("../../../Assets/Images/Media/upload-btn-popup.png")}
                                                     className="MediaFlupBtn"
                                                     onClick={() => this.uploadMultiFiles()}></img>
                                                <img src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                     className="MediaFlupBtn" onClick={() => this.setState({
                                                    fileUplaodLoding: false,
                                                    upload: false,
                                                    uplddata: [],
                                                    selectedFiles: [],
                                                    upLoadvalidMsg: false
                                                })}></img>
                                            </div>
                                            {
                                                this.state.upLoadvalidMsg == true ?
                                                    <Dialog title={this.state.dlgtitle} message={this.state.message}
                                                            onOk={() => this.setState({upLoadvalidMsg: false})}
                                                            onHide={() => this.setState({upLoadvalidMsg: false})}/>
                                                    : <div></div>


                                            }

                                        </div>
                                    </div>


                                    : this.state.grpSelection ?
                                        <div className="Loader">
                                            <div className="SchedBnrWrp4">
                                                <div className="ForgPassTitle ShedTitle">
                                                    <div style={{"width": "96%"}}>Media Scheduling
                                                    </div>
                                                    <div className="ShedHide" onClick={() => this.resetFlDetails()}>X
                                                    </div>
                                                </div>
                                                <div className="shedSelGrSubTitle">Select Groups
                                                </div>
                                                <div className="SchedgrpSelWrp">
                                                    <ReactTable
                                                        columns={grpCol1}
                                                        data={this.state.grp1Data}
                                                        pageSize={this.state.grp1Data.length ? this.state.grp1Data.length : 20}
                                                        showPagination={false}
                                                        sortable={false}
                                                        NoDataComponent={() => null}
                                                        getTrGroupProps={(state, rowInfo, column, instance) => {
                                                            if (rowInfo !== undefined) {
                                                                return {
                                                                    onClick: (e, handleOriginal) => {
                                                                        if(this.state.grp1Index && this.state.grp1Index.length>0){

                                                                        }else{
                                                                            this.setGrpIndex(rowInfo.index, "grp1Index")
                                                                        }

                                                                    },
                                                                    style: {
                                                                        background: this.state.grp1Index.indexOf(rowInfo.index) >= 0 ? "#5ca0f2" : "",
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        style={{height: "350px", margin: "10px", width: "150px"}}
                                                    />
                                                    <div className="SchedgrpSelBtnWrp">
                                                        <div className="SchedSleGrpbtn"
                                                             onClick={() => this.setGroupSelection("add")}>{'>'}
                                                        </div>
                                                        <div className="SchedSleGrpbtn"
                                                             onClick={() => this.setGroupSelection("remove")}>{"<"}</div>
                                                    </div>
                                                    <div className="ReactTable" style={{
                                                        "height": "350px",
                                                        "margin": "10px",
                                                        "width": "150px"
                                                    }}>
                                                        <div className="rt-table" role="grid">
                                                            <div className="rt-thead -header"
                                                                 style={{"min-width": "100px"}}>
                                                                <div className="rt-tr" role="row">
                                                                    <div className="rt-th rt-resizable-header"
                                                                         role="columnheader"
                                                                         tabindex="-1" style={{
                                                                        "flex": "100 0 auto",
                                                                        "width": "100px"
                                                                    }}>
                                                                        <div className="rt-resizable-header-content">
                                                                            Selected Group Names
                                                                        </div>
                                                                        <div className="rt-resizer"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="rt-tbody" style={{"min-width": "100px;"}}>
                                                                {
                                                                    this.state.grp2Data && this.state.grp2Data.length > 0 ?
                                                                        <div>
                                                                            {
                                                                                this.state.grp2Data.map((key, index) => {
                                                                                    return (
                                                                                        <div
                                                                                            className={this.state.grpSelecteIndex == index ? "rt-tr-group rowgroupSelected" : "rt-tr-group"}
                                                                                            onClick={() => {
                                                                                                this.setState({grpSelecteIndex: index})
                                                                                            }} role="rowgroup">
                                                                                            <div
                                                                                                className="rt-tr -padRow -even"
                                                                                                role="row">
                                                                                                <div className="rt-td"
                                                                                                     role="gridcell"
                                                                                                     style={{
                                                                                                         "flex": "100 0 auto",
                                                                                                         "width": "100px;"
                                                                                                     }}>
                                                                                                    <span>{key.Group_ADS_Name}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })

                                                                            }
                                                                            {
                                                                                this.state.adujstRow.map((key, index) => {
                                                                                    return (
                                                                                        <div className="rt-tr-group"
                                                                                             role="rowgroup">
                                                                                            <div
                                                                                                className="rt-tr -padRow -even"
                                                                                                role="row">
                                                                                                <div className="rt-td"
                                                                                                     role="gridcell"
                                                                                                     style={{
                                                                                                         "flex": "100 0 auto",
                                                                                                         "width": "100px;"
                                                                                                     }}>
                                                                                                    <span>&nbsp;</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })

                                                                            }

                                                                        </div>
                                                                        : <div></div>
                                                                }


                                                            </div>
                                                        </div>
                                                        <div className="-loading">
                                                            <div className="-loading-inner">Loading...</div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="MediaFlUpldBtm">
                                                    <img src={require("../../../Assets/Images/System/previous.png")}
                                                         className="ShedGrnextBtn"
                                                         onClick={() => this.backtoShedul()}></img>
                                                    <img src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                         className={!this.state.isenableschedBtn?"ShedGrnextBtn disabledBtn":"ShedGrnextBtn"}
                                                         disabled={!this.state.isenableschedBtn}
                                                         onClick={() => this.checkSelectedGroupLength()}></img>
                                                    <img src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                         className="ShedGrnextBtn"
                                                         onClick={() => this.resetFlDetails()}></img>
                                                </div>

                                            </div>
                                            {
                                                this.state.GrSelectionInfo &&
                                                <Dialog title={this.state.dlgtitle} type={this.state.dlgType}
                                                        message={this.state.message} onOk={() => {
                                                    this.setState({GrSelectionInfo: false})
                                                }} onHide={() => this.setState({GrSelectionInfo: false})}/>
                                            }
                                        </div>
                                        : this.state.dlgEnable ?
                                            <Dialog title={this.state.dlgtitle} type={this.state.dlgType}
                                                    message={this.state.message} onOk={() => {
                                                     this.setState({dlgEnable: false})
                                                if(this.state.dlgType === "deleteFile"){
                                                    this.deleteFiles();
                                                }
                                                if(this.state.dlgType === "delete"){
                                                    this.handleDeleteGrp();
                                                }
                                                if (this.state.dlgType == "updateGroup") {
                                                    this.updategroupStatus(this.state.gStatusValForChange);
                                                }
                                            }} onHide={() => this.setState({dlgEnable: false})}/>
                                            : this.state.grpInfo ?
                                                <div className="Loader">
                                                    <div className="SystemAddRelWrp">
                                                        <div className="ForgPassTitle">Add Group</div>
                                                        <div style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            marginTop: "6px",
                                                            width: '100%'
                                                        }}>
                                                            <span className="SystemFlUpldtxt" style={{
                                                                marginLeft: "6%",
                                                                width: '25%'
                                                            }}>Group Name *</span>
                                                            <input className="grpName innershadow"
                                                                   value={this.state.grpObj.groupName}
                                                                   onChange={(e) => this.handleValues(e.target.value, 'groupName')}></input>
                                                        </div>

                                                        <div>
                                                            <div style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                marginTop: "6px",
                                                                width: '100%'
                                                            }}>
                                                                <span className="SystemFlUpldtxt"
                                                                      style={{marginLeft: "6%", width: '25%'}}>Start Date *</span>
                                                                <DatePicker selected={this.state.grpObj.startDate}
                                                                            onChange={(date) => this.handleValues(date, 'startDate')}
                                                                            wrapperClassName="grpDatePickWrp"
                                                                            className="DatePickInptWrp"
                                                                            popperPlacement="right-start"></DatePicker>
                                                            </div>
                                                            <div style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                marginTop: "6px",
                                                                width: '100%'
                                                            }}>
                                                                <span className="SystemFlUpldtxt"
                                                                      style={{marginLeft: "6%", width: '25%'}}>End Date *</span>
                                                                <DatePicker selected={this.state.grpObj.endDate}
                                                                            onChange={(date) => this.handleValues(date, 'endDate')}
                                                                            wrapperClassName="grpDatePickWrp"
                                                                            className="DatePickInptWrp"
                                                                            popperPlacement="right-start"></DatePicker>
                                                            </div>
                                                            <div style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                marginTop: "6px",
                                                                width: '100%'
                                                            }}>
                                                                <span className="SystemFlUpldtxt"
                                                                      style={{marginLeft: "6%", width: '25%'}}>Unit Type *</span>
                                                                <select className="unitDropDown"
                                                                        value={this.state.grpObj.unitType}
                                                                        onChange={(e) => this.handleValues(e.target.value, 'unitType')}>
                                                                    <option value=''>Select Unit Type</option>
                                                                    {
                                                                        this.state.unitData.map((key, index) => {
                                                                            return (
                                                                                <option
                                                                                    value={key.ID}>{key.Name}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </div>

                                                        </div>
                                                        <div className="SystFlUpldBtm">
                                                            <img
                                                                src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                className="SystFlnextBtn"
                                                                onClick={() => this.addGroupToDatabase()}></img>
                                                            <img
                                                                src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                                className="SystFlnextBtn" onClick={() => this.setState({
                                                                grpInfo: false,
                                                                grpObj: {
                                                                    groupName: '',
                                                                    startDate: '',
                                                                    endDate: '',
                                                                    unitType: ''
                                                                }
                                                            })}></img>
                                                        </div>

                                                    </div>
                                                </div>
                                                : this.state.grpEditInfo ?
                                                    <div className="Loader">
                                                        <div className="SystemAddRelWrp">
                                                            <div className="ForgPassTitle">Edit Group</div>
                                                            <div style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                marginTop: "6px",
                                                                width: '100%'
                                                            }}>
                                                                <span className="SystemFlUpldtxt"
                                                                      style={{marginLeft: "6%", width: '25%'}}>Group Name *</span>
                                                                <input className="grpName innershadow"
                                                                       value={this.state.groupEditData.Group_ADS_Name}
                                                                       onChange={(e) => this.handleEditValues(e.target.value, 'Group_ADS_Name')}></input>
                                                            </div>
                                                            <div>
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    marginTop: "6px",
                                                                    width: '100%'
                                                                }}>
                                                                    <span className="SystemFlUpldtxt"
                                                                          style={{marginLeft: "6%", width: '25%'}}>Start Date *</span>
                                                                    <DatePicker
                                                                        selected={new Date(this.state.groupEditData.StartDate)}
                                                                        onChange={(date) => this.handleEditValues(date, 'StartDate')}
                                                                        wrapperClassName="grpDatePickWrp"
                                                                        className="DatePickInptWrp"
                                                                        popperPlacement="right-start"></DatePicker>
                                                                </div>
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    marginTop: "6px",
                                                                    width: '100%'
                                                                }}>
                                                                    <span className="SystemFlUpldtxt"
                                                                          style={{marginLeft: "6%", width: '25%'}}>End Date *</span>
                                                                    <DatePicker
                                                                        selected={new Date(this.state.groupEditData.EndDate)}
                                                                        onChange={(date) => this.handleEditValues(date, 'EndDate')}
                                                                        wrapperClassName="grpDatePickWrp"
                                                                        className="DatePickInptWrp"
                                                                        popperPlacement="right-start"></DatePicker>
                                                                </div>
                                                                <div style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    marginTop: "6px",
                                                                    width: '100%'
                                                                }}>
                                                                    <span className="SystemFlUpldtxt"
                                                                          style={{marginLeft: "6%", width: '25%'}}>Unit Type *</span>
                                                                    <select className="unitDropDown"
                                                                            value={this.state.groupEditData.UnitType}
                                                                            onChange={(e) => this.handleEditValues(e.target.value, 'UnitType')}>
                                                                        <option value=''>Select Unit Type</option>
                                                                        {
                                                                            this.state.unitData.map((key, index) => {
                                                                                return (
                                                                                    <option
                                                                                        value={key.ID}>{key.Name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>

                                                            </div>
                                                            <div className="SystFlUpldBtm">
                                                                <img
                                                                    src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                    className="SystFlnextBtn"
                                                                    onClick={() => this.editGroupToDatabase()}></img>
                                                                <img
                                                                    src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                                    className="SystFlnextBtn"
                                                                    onClick={() => this.setState({
                                                                        grpEditInfo: false,
                                                                        groupEditData: {}
                                                                    })}></img>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    : this.state.btmDetails ?
                                                        <div className="Loader">
                                                            <div className="SchedBtmDtPopWrp">
                                                                <div className="ForgPassTitle">Add Details</div>
                                                                <div className="SchedBnrPopImgWrp2">
                                                                    <div className="leftDiv-md2">
                                                                        <span className="SchedBnrPopTxt1">Order *</span>
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                        <input className="SchedBnrPopinpt"
                                                                               style={{width: '55%'}} type="number"
                                                                               min="0" value={this.state.order}
                                                                               onChange={(e) => this.setState({order: e.target.value})}></input>
                                                                    </div>
                                                                    <div className="leftDiv-md2">
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                    </div>


                                                                </div>
                                                                <div className="SchedBnrPopImgWrp2"
                                                                     style={{marginTop: "10px"}}>
                                                                    <div className="leftDiv-md2">
                                                                        <span className="SchedBnrPopTxt"
                                                                              style={{marginLeft: "-10%"}}>Date Start *</span>
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                        <DatePicker style={{width: '95%'}}
                                                                                    selected={this.state.dateStart}
                                                                                    onChange={(date) => this.setState({dateStart: date})}
                                                                                    wrapperClassName=""
                                                                                    className="SchedDatePickInptWrp"
                                                                                    popperPlacement="right-start"></DatePicker>
                                                                    </div>
                                                                    <div className="leftDiv-md2">
                                                                        <span className="SchedBnrPopTxt"
                                                                              style={{marginLeft: "6%"}}>Date End *</span>
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                        <DatePicker style={{width: '95%'}}
                                                                                    selected={this.state.dateEnd}
                                                                                    onChange={(date) => this.setState({dateEnd: date})}
                                                                                    wrapperClassName=""
                                                                                    className="SchedDatePickInptWrp"
                                                                                    popperPlacement="right-start"></DatePicker>
                                                                    </div>
                                                                </div>

                                                                <div className="SchedBnrPopImgWrp2"
                                                                     style={{marginTop: "13px"}}>

                                                                    <div className="leftDiv-md2">
                                                                        <span
                                                                            className="SchedBnrPopTxt">Time Start *</span>
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                        <input className="SchedBnrPopinpt1"
                                                                               style={{width: '37%'}} type="number"
                                                                               min="0" value={this.state.timeSrthr}
                                                                               onChange={(e) => this.setState({timeSrthr: e.target.value})}></input>
                                                                        <input className="SchedBnrPopinpt1"
                                                                               style={{width: '37%'}} type="number"
                                                                               min="0" value={this.state.timeSrtmin}
                                                                               onChange={(e) => this.setState({timeSrtmin: e.target.value})}></input>
                                                                    </div>
                                                                    <div className="leftDiv-md2">
                                                                        <span className="SchedBnrPopTxt"
                                                                              style={{marginLeft: "2%"}}>Time End *</span>
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                        <input className="SchedBnrPopinpt1"
                                                                               style={{width: '37%'}} type="number"
                                                                               min="0" value={this.state.timeEndhr}
                                                                               onChange={(e) => this.setState({timeEndhr: e.target.value})}></input>
                                                                        <input className="SchedBnrPopinpt1"
                                                                               style={{width: '37%'}} type="number"
                                                                               min="0" value={this.state.timeEndmin}
                                                                               onChange={(e) => this.setState({timeEndmin: e.target.value})}></input>
                                                                    </div>

                                                                </div>
                                                                <div className="SchedBnrPopImgWrp2">
                                                                    <div className="leftDiv-md2">
                                                                        <span className="SchedBnrPopTxt">Length *</span>
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                        <input className="SchedBnrPopinpt"
                                                                               style={{width: '55%'}} type="number"
                                                                               onChange={(e) => this.setState({fLength: e.target.value})}
                                                                               value={this.state.fLength == "" ? this.state.flEditData.Len : this.state.fLength}
                                                                               min="0"></input>
                                                                    </div>
                                                                    <div className="leftDiv-md2">
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                    </div>


                                                                </div>
                                                                <div className="SchedBnrPopImgWrp2">
                                                                    <div className="leftDiv-md2">
                                                                        <span className="SchedBnrPopTxt" style={{
                                                                            marginLeft: '-1.5%',
                                                                            marginTop: "10px"
                                                                        }}>Full Screen *</span>
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                        <select className="SchedDropDwn1"
                                                                                onChange={(e) => this.setState({fScreen: e.target.value})}
                                                                                value={this.state.fScreen}>
                                                                            <option value={1}>True</option>
                                                                            <option value={0}>false</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="leftDiv-md2">
                                                                    </div>
                                                                    <div className="RightDiv-md2">
                                                                    </div>


                                                                </div>
                                                                <div className="SystFlUpldBtm">
                                                                    <img
                                                                        src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                        className="SystFlnextBtn"
                                                                        onClick={() => this.addDeails()}></img>
                                                                    <img
                                                                        src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                                        className="SystFlnextBtn"
                                                                        onClick={() => this.setState({
                                                                            btmDetails: false,
                                                                            order: 1,
                                                                            dateStart: new Date(),
                                                                            dateEnd: new Date(),
                                                                            timeEndhr: 0,
                                                                            timeEndmin: 0,
                                                                            timeSrthr: 0,
                                                                            timeSrtmin: 0,
                                                                            fScreen: 0,
                                                                            fLength: 0
                                                                        })}></img>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        : this.state.btmGrpAssociated ?
                                                            <div className="Loader">
                                                                <div className="SchedBnrWrp4">
                                                                    <div className="ForgPassTitle">Media Scheduling
                                                                    </div>
                                                                    <div className="SchedgrpSelWrp">
                                                                        <ReactTable
                                                                            columns={grpCol1}
                                                                            data={this.state.grp1Data}
                                                                            pageSize={this.state.grp1Data.length ? this.state.grp1Data.length : 20}
                                                                            sortable={false}
                                                                            showPagination={false}
                                                                            NoDataComponent={() => null}
                                                                            getTrGroupProps={(state, rowInfo, column, instance) => {
                                                                                if (rowInfo !== undefined) {
                                                                                    return {
                                                                                        onClick: (e, handleOriginal) => {
                                                                                            this.setGrpIndex(rowInfo.index, "grp1Index")
                                                                                        },
                                                                                        style: {
                                                                                            background: this.state.grp1Index.indexOf(rowInfo.index) >= 0 ? "#5ca0f2" : "",
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }}
                                                                            style={{
                                                                                height: "350px",
                                                                                margin: "10px",
                                                                                width: "150px"
                                                                            }}
                                                                        />
                                                                        <div className="SchedgrpSelBtnWrp">
                                                                            <div className="SchedSleGrpbtn"
                                                                                 onClick={() => this.setGroupSelection("add")}>
                                                                                {'>'}
                                                                            </div>
                                                                            <div className="SchedSleGrpbtn"
                                                                                 onClick={() => this.setGroupSelection("remove")}>{"<"}</div>
                                                                        </div>
                                                                        <div className="ReactTable" style={{
                                                                            "height": "350px",
                                                                            "margin": "10px",
                                                                            "width": "150px"
                                                                        }}>
                                                                            <div className="rt-table" role="grid">
                                                                                <div className="rt-thead -header"
                                                                                     style={{"min-width": "100px"}}>
                                                                                    <div className="rt-tr" role="row">
                                                                                        <div
                                                                                            className="rt-th rt-resizable-header"
                                                                                            role="columnheader"
                                                                                            tabindex="-1" style={{
                                                                                            "flex": "100 0 auto",
                                                                                            "width": "100px"
                                                                                        }}>
                                                                                            <div
                                                                                                className="rt-resizable-header-content">
                                                                                                Selected Group Names
                                                                                            </div>
                                                                                            <div
                                                                                                className="rt-resizer"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="rt-tbody"
                                                                                     style={{"min-width": "100px;"}}>
                                                                                    {
                                                                                        this.state.grp2Data && this.state.grp2Data.length > 0 ?
                                                                                            <div>
                                                                                                {
                                                                                                    this.state.grp2Data.map((key, index) => {
                                                                                                        return (
                                                                                                            <div
                                                                                                                className={this.state.grpSelecteIndex == index ? "rt-tr-group rowgroupSelected" : "rt-tr-group"}
                                                                                                                onClick={() => {
                                                                                                                    this.setState({grpSelecteIndex: index})
                                                                                                                }}
                                                                                                                role="rowgroup">
                                                                                                                <div
                                                                                                                    className="rt-tr -padRow -even"
                                                                                                                    role="row">
                                                                                                                    <div
                                                                                                                        className="rt-td"
                                                                                                                        role="gridcell"
                                                                                                                        style={{
                                                                                                                            "flex": "100 0 auto",
                                                                                                                            "width": "100px;"
                                                                                                                        }}>
                                                                                                                        <span>{key.Group_ADS_Name}</span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                    })

                                                                                                }
                                                                                                {
                                                                                                    this.state.adujstRow.map((key, index) => {
                                                                                                        return (
                                                                                                            <div
                                                                                                                className="rt-tr-group"
                                                                                                                role="rowgroup">
                                                                                                                <div
                                                                                                                    className="rt-tr -padRow -even"
                                                                                                                    role="row">
                                                                                                                    <div
                                                                                                                        className="rt-td"
                                                                                                                        role="gridcell"
                                                                                                                        style={{
                                                                                                                            "flex": "100 0 auto",
                                                                                                                            "width": "100px;"
                                                                                                                        }}>
                                                                                                                        <span>&nbsp;</span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        )
                                                                                                    })

                                                                                                }

                                                                                            </div>
                                                                                            : <div></div>
                                                                                    }


                                                                                </div>
                                                                            </div>
                                                                            <div className="-loading">
                                                                                <div className="-loading-inner">
                                                                                    Loading...
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div className="MediaFlUpldBtm">
                                                                        <img
                                                                            src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                            className="SystFlnextBtn"
                                                                            onClick={() => this.associateGroupsTofile()}></img>
                                                                        <img
                                                                            src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                                            className="SystFlnextBtn"
                                                                            onClick={() => this.setState({
                                                                                btmGrpAssociated: false,
                                                                                grp1Index: [],
                                                                                grp2Index: [],
                                                                                grp2Data: []
                                                                            }, () => this.getRecords("GroupADSFLFiles/Fetch"))}></img>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            : this.state.btmGeoZoneAssociation ?
                                                                <div className="Loader">
                                                                    <div className="SchedBnrWrp4">
                                                                        <div className="ForgPassTitle">Media
                                                                            Scheduling
                                                                        </div>
                                                                        <div className="SchedgrpSelWrp">
                                                                            <ReactTable
                                                                                columns={this.GeoZoneCol1}
                                                                                data={this.state.geoZone1Data}
                                                                                minRows={20}
                                                                                defaultPageSize={20}
                                                                                filtered={this.state.zonefiltered}
                                                                                pageSize={this.state.geoZone1Data.length ? this.state.geoZone1Data.length : 20}
                                                                                showPagination={false}
                                                                                sortable={false}
                                                                                NoDataComponent={() => null}
                                                                                getTrGroupProps={(state, rowInfo, column, instance) => {
                                                                                    if (rowInfo !== undefined) {
                                                                                        return {
                                                                                            onClick: (e, handleOriginal) => {
                                                                                                var arr = []
                                                                                                //arr = this.state.geoZoneIndex;
                                                                                                this.setGeoZonIndex(rowInfo.index, "geoZoneIndex");
                                                                                                //arr.push(rowInfo.index)
                                                                                                //this.setState({geoZoneIndex:arr};
                                                                                            },
                                                                                            style: {
                                                                                                background: this.state.geoZoneIndex.indexOf(rowInfo.index) >= 0 ? "#5ca0f2" : "",
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                style={{
                                                                                    height: "350px",
                                                                                    margin: "10px",
                                                                                    width: "150px"
                                                                                }}
                                                                            />
                                                                            <div className="SchedgrpSelBtnWrp">
                                                                                <div className="SchedSleGrpbtn"
                                                                                     onClick={() => this.setGeoZoneSelection("add")}>
                                                                                    {'>'}
                                                                                </div>
                                                                                <div className="SchedSleGrpbtn"
                                                                                     onClick={() => this.setGeoZoneSelection("remove")}>{"<"}</div>
                                                                            </div>
                                                                            <div className="ReactTable" style={{
                                                                                "height": "350px",
                                                                                "margin": "10px",
                                                                                "width": "150px"
                                                                            }}>
                                                                                <div className="rt-table" role="grid">
                                                                                    <div className="rt-thead -header"
                                                                                         style={{"min-width": "100px"}}>
                                                                                        <div className="rt-tr"
                                                                                             role="row">
                                                                                            <div
                                                                                                className="rt-th rt-resizable-header"
                                                                                                role="columnheader"
                                                                                                tabindex="-1" style={{
                                                                                                "flex": "100 0 auto",
                                                                                                "width": "100px"
                                                                                            }}>
                                                                                                <div
                                                                                                    className="rt-resizable-header-content">
                                                                                                    Selected Zone Names
                                                                                                </div>
                                                                                                <div
                                                                                                    className="rt-resizer"></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="rt-tbody"
                                                                                         style={{"min-width": "100px;"}}>
                                                                                        {
                                                                                            this.state.geoZone2Data && this.state.geoZone2Data.length > 0 ?
                                                                                                <div>
                                                                                                    {
                                                                                                        this.state.geoZone2Data.map((key, index) => {
                                                                                                            return (
                                                                                                                <div
                                                                                                                    className={this.state.setGeoZoneIndex == index ? "rt-tr-group rowgroupSelected" : "rt-tr-group"}
                                                                                                                    onClick={() => {
                                                                                                                        this.setState({geoZoneSelecteIndex: index})
                                                                                                                    }}
                                                                                                                    role="rowgroup">
                                                                                                                    <div
                                                                                                                        className="rt-tr -padRow -even"
                                                                                                                        role="row">
                                                                                                                        <div
                                                                                                                            className="rt-td"
                                                                                                                            role="gridcell"
                                                                                                                            style={{
                                                                                                                                "flex": "100 0 auto",
                                                                                                                                "width": "100px;"
                                                                                                                            }}>
                                                                                                                            <span>{key.Name}</span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })

                                                                                                    }
                                                                                                    {
                                                                                                        this.state.adujstRow.map((key, index) => {
                                                                                                            return (
                                                                                                                <div
                                                                                                                    className="rt-tr-group"
                                                                                                                    role="rowgroup">
                                                                                                                    <div
                                                                                                                        className="rt-tr -padRow -even"
                                                                                                                        role="row">
                                                                                                                        <div
                                                                                                                            className="rt-td"
                                                                                                                            role="gridcell"
                                                                                                                            style={{
                                                                                                                                "flex": "100 0 auto",
                                                                                                                                "width": "100px;"
                                                                                                                            }}>
                                                                                                                            <span>&nbsp;</span>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })

                                                                                                    }

                                                                                                </div>
                                                                                                : <div></div>
                                                                                        }


                                                                                    </div>
                                                                                </div>
                                                                                <div className="-loading">
                                                                                    <div className="-loading-inner">
                                                                                        Loading...
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className="MediaFlUpldBtm">
                                                                            <img
                                                                                src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                                className="SystFlnextBtn"
                                                                                onClick={() => this.associateGeoZoneTofile()}></img>
                                                                            <img
                                                                                src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                                                className="SystFlnextBtn"
                                                                                onClick={() => {
                                                                                    this.state.zonefilteval[1]="";
                                                                                    this.setState({
                                                                                        btmGeoZoneAssociation: false,
                                                                                        geoZone2Data: [],
                                                                                        zonefiltered:[],
                                                                                        zoneVisibleFilters:[]
                                                                                    })
                                                                                }}></img>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                : this.state.scheduleGeoZonening ?
                                                                    <div className="Loader">
                                                                        <div className="SchedBnrWrp4">
                                                                            <div className="ForgPassTitle">Media
                                                                                Scheduling
                                                                            </div>
                                                                            <div className="SchedgrpSelWrp">
                                                                                <ReactTable
                                                                                    columns={this.GeoZoneCol1}
                                                                                    data={this.state.geoZone1Data}
                                                                                    minRows={20}
                                                                                    filtered={this.state.zonefiltered}
                                                                                    defaultPageSize={20}
                                                                                    pageSize={this.state.geoZone1Data.length ? this.state.geoZone1Data.length : 20}
                                                                                    showPagination={false}
                                                                                    sortable={false}
                                                                                    NoDataComponent={() => null}
                                                                                    getTrGroupProps={(state, rowInfo, column, instance) => {
                                                                                        if (rowInfo !== undefined) {
                                                                                            return {
                                                                                                onClick: (e, handleOriginal) => {
                                                                                                    var arr = []
                                                                                                    //arr = this.state.geoZoneIndex;
                                                                                                    this.setGeoZonIndex(rowInfo.index, "geoZoneIndex");
                                                                                                    //arr.push(rowInfo.index)
                                                                                                    //this.setState({geoZoneIndex:arr};
                                                                                                },
                                                                                                style: {
                                                                                                    background: this.state.geoZoneIndex.indexOf(rowInfo.index) >= 0 ? "#5ca0f2" : "",
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    style={{
                                                                                        height: "350px",
                                                                                        margin: "10px",
                                                                                        width: "150px"
                                                                                    }}
                                                                                />
                                                                                <div className="SchedgrpSelBtnWrp">
                                                                                    <div className="SchedSleGrpbtn"
                                                                                         onClick={() => this.setGeoZoneSelection("add")}>
                                                                                        {'>'}
                                                                                    </div>
                                                                                    <div className="SchedSleGrpbtn"
                                                                                         onClick={() => this.setGeoZoneSelection("remove")}>{"<"}</div>
                                                                                </div>
                                                                                <div className="ReactTable" style={{
                                                                                    "height": "350px",
                                                                                    "margin": "10px",
                                                                                    "width": "150px"
                                                                                }}>
                                                                                    <div className="rt-table" role="grid">
                                                                                        <div className="rt-thead -header"
                                                                                             style={{"min-width": "100px"}}>
                                                                                            <div className="rt-tr"
                                                                                                 role="row">
                                                                                                <div
                                                                                                    className="rt-th rt-resizable-header"
                                                                                                    role="columnheader"
                                                                                                    tabindex="-1" style={{
                                                                                                    "flex": "100 0 auto",
                                                                                                    "width": "100px"
                                                                                                }}>
                                                                                                    <div
                                                                                                        className="rt-resizable-header-content">
                                                                                                        Selected Zone Names
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="rt-resizer"></div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="rt-tbody"
                                                                                             style={{"min-width": "100px;"}}>
                                                                                            {
                                                                                                this.state.geoZone2Data && this.state.geoZone2Data.length > 0 ?
                                                                                                    <div>
                                                                                                        {
                                                                                                            this.state.geoZone2Data.map((key, index) => {
                                                                                                                return (
                                                                                                                    <div
                                                                                                                        className={this.state.setGeoZoneIndex == index ? "rt-tr-group rowgroupSelected" : "rt-tr-group"}
                                                                                                                        onClick={() => {
                                                                                                                            this.setState({geoZoneSelecteIndex: index})
                                                                                                                        }}
                                                                                                                        role="rowgroup">
                                                                                                                        <div
                                                                                                                            className="rt-tr -padRow -even"
                                                                                                                            role="row">
                                                                                                                            <div
                                                                                                                                className="rt-td"
                                                                                                                                role="gridcell"
                                                                                                                                style={{
                                                                                                                                    "flex": "100 0 auto",
                                                                                                                                    "width": "100px;"
                                                                                                                                }}>
                                                                                                                                <span>{key.Name}</span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            })

                                                                                                        }
                                                                                                        {
                                                                                                            this.state.adujstRow.map((key, index) => {
                                                                                                                return (
                                                                                                                    <div
                                                                                                                        className="rt-tr-group"
                                                                                                                        role="rowgroup">
                                                                                                                        <div
                                                                                                                            className="rt-tr -padRow -even"
                                                                                                                            role="row">
                                                                                                                            <div
                                                                                                                                className="rt-td"
                                                                                                                                role="gridcell"
                                                                                                                                style={{
                                                                                                                                    "flex": "100 0 auto",
                                                                                                                                    "width": "100px;"
                                                                                                                                }}>
                                                                                                                                <span>&nbsp;</span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            })

                                                                                                        }

                                                                                                    </div>
                                                                                                    : <div></div>
                                                                                            }


                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="-loading">
                                                                                        <div className="-loading-inner">
                                                                                            Loading...
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="MediaFlUpldBtm">
                                                                                <img
                                                                                    src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                                    className="SystFlnextBtn"
                                                                                    onClick={() => {this.setScheduleGeoZonening()}}></img>
                                                                                <img
                                                                                    src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                                                    className="SystFlnextBtn"
                                                                                    onClick={() => this.cancelGeoInclusion()}></img>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                : this.state.btmRateCodes ?
                                                                    <div className="Loader">
                                                                        <div className="SchedBnrWrp5">
                                                                            <div className="ForgPassTitle">Associate
                                                                                Ratecodes
                                                                            </div>
                                                                            <ReactTable
                                                                                columns={this.rateCodesCol}
                                                                                data={this.state.rateCodeList}
                                                                                pageSize={this.state.rateCodeList.length ? this.state.rateCodeList.length : 20}
                                                                                showPagination={false}
                                                                                sortable={false}
                                                                                NoDataComponent={() => null}
                                                                                style={{
                                                                                    height: "130px",
                                                                                    width: "200px"
                                                                                }}
                                                                            />
                                                                            <div className="MediaFlUpldBtm1">
                                                                                <img
                                                                                    src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                                    className="SystFlnextBtn1"
                                                                                    onClick={() => this.associatedRateCodestoFile()}></img>
                                                                                <img
                                                                                    src={require("../../../Assets/Images/Login/cancel-btn.png")}
                                                                                    className="SystFlnextBtn1"
                                                                                    onClick={() => this.setState({
                                                                                        btmRateCodes: false,
                                                                                        rateCodesDt: [],
                                                                                    })}></img>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    : this.state.houseAd ?
                                                                        <div className="Loader">
                                                                            <div className="SchedHouseAdwrp">
                                                                                <div
                                                                                    className="ForgPassTitle ShedTitle">
                                                                                    <div style={{"width": "96%"}}>
                                                                                        Configure HouseAd
                                                                                    </div>
                                                                                    <div className="ShedHide"
                                                                                         onClick={() => this.setState({houseAd: false}, () => this.getHouseData())}>
                                                                                        X
                                                                                    </div>
                                                                                </div>
                                                                                <div className="SchedEdtFileTopWrp">
                                                                                    <div
                                                                                        className="SchedEdtFileTopChild1"
                                                                                        onClick={() => this.loadFiles(3, "Vbanner", "Bsched")}>
                                                                                        <span
                                                                                            className="SchedBnrPopImgTypetxt">Vertical Banner</span>
                                                                                        {
                                                                                            this.state.houseObj && this.state.houseObj.WebVisibleURLVBanner ?
                                                                                                <div>
                                                                                                    <div
                                                                                                        className="SchedBnrpopImgWrp">
                                                                                                        <img
                                                                                                            src={this.state.houseObj.WebVisibleURLVBanner}
                                                                                                            className="SchedBnrpopImg_V"></img>
                                                                                                        <div
                                                                                                            className="SchedBnrpopImgOvrWrp">
                                                                                                            <img
                                                                                                                src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                                                                className="SchedGrpTableToolImg4"
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation();
                                                                                                                    this.removeHouseAdd(3)
                                                                                                                }}></img>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <span
                                                                                                        className="SchedBnrPopImgTypetxt1">{this.state.houseObj.VBannerName}</span>
                                                                                                </div>
                                                                                                :
                                                                                                <div>
                                                                                                    <img
                                                                                                        src={require("../../../Assets/Images/images.jpg")}
                                                                                                        className="SchedBnrpopImg1"></img>
                                                                                                    <span
                                                                                                        className="SchedBnrPopImgTypetxt1">{this.state.houseObj.VBannerName ? this.state.houseObj.VBannerName : "No Image"}</span>
                                                                                                </div>
                                                                                        }
                                                                                        {
                                                                                            this.state.typeL === 3 || this.state.typeL === "3" &&
                                                                                            <div
                                                                                                className="SchedDisbleWrp"></div>
                                                                                        }
                                                                                    </div>
                                                                                    <div
                                                                                        className="SchedEdtFileTopChild1"
                                                                                        onClick={() => this.loadFiles(2, "Hbanner", "Bsched")}>
                                                                                        <span
                                                                                            className="SchedBnrPopImgTypetxt">Horizontal Banner</span>
                                                                                        {
                                                                                            this.state.houseObj && this.state.houseObj.WebVisibleURLHBanner ?
                                                                                                <div>
                                                                                                    <div
                                                                                                        className="SchedBnrpopImgWrp">
                                                                                                        <img
                                                                                                            src={this.state.houseObj.WebVisibleURLHBanner}
                                                                                                            className="SchedBnrpopImg_H"></img>
                                                                                                        <div
                                                                                                            className="SchedBnrpopImgOvrWrp">
                                                                                                            <img
                                                                                                                src={require("../../../Assets/Images/Group/delete-over.png")}
                                                                                                                className="SchedGrpTableToolImg4"
                                                                                                                onClick={(e) => {
                                                                                                                    e.stopPropagation();
                                                                                                                    this.removeHouseAdd(2)
                                                                                                                }}></img>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <span
                                                                                                        className="SchedBnrPopImgTypetxt1">{this.state.houseObj.HBannerName}</span>
                                                                                                </div>
                                                                                                :
                                                                                                <div>
                                                                                                    <img
                                                                                                        src={require("../../../Assets/Images/images.jpg")}
                                                                                                        className="SchedBnrpopImg1"></img>
                                                                                                    <span
                                                                                                        className="SchedBnrPopImgTypetxt1">{this.state.houseObj.HBannerName ? this.state.houseObj.HBannerName : "No Image"}</span>
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
                                                                                        }, () => this.getHouseData())}></img>
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                this.state.loadFile &&
                                                                                <div>
                                                                                    <div className="SchedBnrWrp3">
                                                                                        <div className="ForgPassTitle">
                                                                                            Media Filter <img
                                                                                            src={require("../../../Assets/Images/close.png")}
                                                                                            className="SchedColStClose"
                                                                                            style={{marginLeft: "82%"}}
                                                                                            onClick={() => this.setState({loadFile: false})}></img>
                                                                                        </div>
                                                                                        <div
                                                                                            className="SchedBnrInptWrp">
                                                                                            <span
                                                                                                className="SchedBnrPopTxt"
                                                                                                style={{marginLeft: '5%'}}>Uploaded By</span>
                                                                                            <select
                                                                                                className="SchedDropDwn1"
                                                                                                onChange={(e) => this.setState({uploadby: e.target.value}, () => this.filterMedia(this.filterType, this.state.uploadby, "uploadedBy"))}
                                                                                                value={this.state.uploadby}>
                                                                                                <option value="-1">ALL
                                                                                                </option>
                                                                                                {
                                                                                                    this.state.userList.map((key, index) => {
                                                                                                        return (
                                                                                                            <option
                                                                                                                value={key.userId}>{key.Name}</option>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </select>
                                                                                            <span
                                                                                                className="SchedBnrPopTxt"
                                                                                                style={{
                                                                                                    marginLeft: '4%',
                                                                                                    marginTop: "3px"
                                                                                                }}>Tags</span>
                                                                                            <input
                                                                                                style={{marginTop: "3px"}}
                                                                                                onChange={(e) => this.setState({tags: e.target.value})}
                                                                                                onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "tag")}
                                                                                                value={this.state.tags}></input>
                                                                                        </div>
                                                                                        <div
                                                                                            className="SchedBnrInptWrp">
                                                                                            <span
                                                                                                className="SchedBnrPopTxt"
                                                                                                style={{
                                                                                                    marginLeft: '8%',
                                                                                                    marginTop: "3px"
                                                                                                }}>File Name</span>
                                                                                            <input
                                                                                                style={{marginTop: "3px"}}
                                                                                                onChange={(e) => this.setState({searchbyFile: e.target.value})}
                                                                                                onKeyUp={(e) => this.filterMedia(this.filterType, e.target.value, "file")}
                                                                                                value={this.state.searchbyFile}></input>
                                                                                        </div>
                                                                                        <div className="SchedLodFlWrp">
                                                                                            {
                                                                                                this.state.loadFileData && this.state.loadFileData.map((key, index) => (
                                                                                                    key.ContentTypeID === this.filterType &&
                                                                                                    <div
                                                                                                        className="SchedLodFlChildWrp"
                                                                                                        onDoubleClick={() => this.setHouseAd(key)}>
                                                                                                        <img
                                                                                                            src={this.getThumnail(key.WebVisibleURL)}
                                                                                                            className={key.ContentTypeID === 2 ? "MediaFlImgWrp2" : key.ContentTypeID === 3 ? "MediaFlImgWrp3" : "MediaFlImgWrp"}></img>
                                                                                                        <span
                                                                                                            className="MediaFlTitle">{key.TempName}</span>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                        : this.state.previewLoop &&
                                                                        <div className="Loader">
                                                                            <div className="SchedPrevLoopWrp">
                                                                                <div className="ForgPassTitle">Preview
                                                                                    Loop <img
                                                                                        src={require("../../../Assets/Images/close.png")}
                                                                                        className="SchedColStClose"
                                                                                        style={{marginLeft: "82%"}}
                                                                                        onClick={() => this.setState({previewLoop: false})}></img>
                                                                                </div>
                                                                                <div className="ScheduleTabToolWrp">
                                                                                    <div
                                                                                        className="ScheduleTableToolCont">
                                                                                        {/*<img
                                                                                            src={require('../../../Assets/Images/tools/filter-ico.png')}
                                                                                            className="ScheduleToolImg"></img>*/}
                                                                                        <img
                                                                                            src={require("../../../Assets/Images/separator.png")}
                                                                                            className="SchedTopCredSeprtr"></img>
                                                                                        <img
                                                                                            src={require('../../../Assets/Images/tools/show-coloumn.png')}
                                                                                            className="ScheduleToolImg"
                                                                                            onClick={() => this.setState({columnSt: !this.state.columnSt})}></img>
                                                                                        <img
                                                                                            src={require("../../../Assets/Images/separator.png")}
                                                                                            className="SchedTopCredSeprtr"></img>
                                                                                        {/* <img src={require('../../../Assets/Images/tools/export.jpg')} className="ScheduleToolImg"></img>
                                                                                         <img src={require("../../../Assets/Images/separator.png")} className="SchedTopCredSeprtr"></img> */}
                                                                                        <img
                                                                                            src={require('../../../Assets/Images/tools/refresh.png')}
                                                                                            className="ScheduleToolImg"
                                                                                            onClick={() => this.getRecords("GroupADSFLFiles/Fetch")}></img>
                                                                                    </div>
                                                                                </div>
                                                                                <ReactTable
                                                                                    data={this.state.prevData}  ///this previevLoop
                                                                                    columns={this.state.prevCol}
                                                                                    loading={this.state.flLoading}
                                                                                    NoDataComponent={() => null}
                                                                                    showPagination={false}
                                                                                    extradata={this.state}
                                                                                    filtered={this.state.filtered}
                                                                                    sortable={false}
                                                                                    style={{
                                                                                        height: "280px", //
                                                                                    }}
                                                                                    getTheadFilterProps={(state, rowInfo, column, instance) => {
                                                                                        return {
                                                                                            style: this.state.visibleFilters.length === 0
                                                                                                ? {display: "none"}
                                                                                                : null
                                                                                        };
                                                                                    }}
                                                                                    getTheadFilterThProps={(state, rowInfo, column, instance) => {
                                                                                        return {
                                                                                            className: this.state.visibleFilters.indexOf(column.id) < 0
                                                                                                ? "hiddenFilter"
                                                                                                : null
                                                                                        };
                                                                                    }}
                                                                                />
                                                                                <div className="MediaFlUpldBtm">
                                                                                    <img
                                                                                        src={require("../../../Assets/Images/Login/ok-btn.png")}
                                                                                        className="SystFlnextBtn"
                                                                                        onClick={() => this.setState({previewLoop: false})}></img>

                                                                                </div>
                                                                            </div>
                                                                        </div>

                }
                {
                    !this.state.group ?
                        <div className={"SchedGrpFilVWrp"}>
                            <div className={this.state.grpFileView ? "TableBorder" : "TableBorder1"}>
                                {
                                    this.state.columnSt &&
                                    <ColumnStatus data={this.state.columns}
                                                  onChange={(e) => this.setColumn(e, 'columns')}
                                                  class={"SchedColumnHideWrp"}
                                                  onClose={(e) => this.resetColmn(e, 'columns')}></ColumnStatus>
                                }
                                <div className="ScheduleTabToolWrp">
                                    <img src={require('../../../Assets/Images/Upload/upload-btn.png')}
                                         className="ScheduleupldImg"
                                         onClick={() => this.setState({upload: true})}></img>
                                    <div>
                                        <img src={require('../../../Assets/Images/Upload/schedule-btn.png')}
                                             className="ScheduleupldImg1"
                                             onClick={() => this.setState({schedFile: false,isenableschedBtn:true, schedVideo: true})}></img>

                                    </div>
                                    <div className="ScheduleTableToolCont">
                                        <img src={require('../../../Assets/Images/tools/change-perspective.png')}
                                             className="ScheduleToolImg" onClick={() => this.setGroup(true)}></img>
                                        <img src={require("../../../Assets/Images/separator.png")}
                                             className="SchedTopCredSeprtr"></img>
                                        {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')}
                                             className="ScheduleToolImg"></img>*/}
                                        <img src={require("../../../Assets/Images/separator.png")}
                                             className="SchedTopCredSeprtr"></img>
                                        <img src={require('../../../Assets/Images/tools/show-coloumn.png')}
                                             className="ScheduleToolImg"
                                             onClick={() => this.setState({columnSt: !this.state.columnSt})}></img>
                                        <img src={require("../../../Assets/Images/separator.png")}
                                             className="SchedTopCredSeprtr"></img>
                                        <ExportCSV csvData={this.state.data} fileName={this.state.exportFileName}
                                                   visibleCol={this.state.columns} isConversion={true}
                                                   callback={() => this.getRecords("GroupADSFLFiles/Fetch")}/>
                                        <img src={require("../../../Assets/Images/separator.png")}
                                             className="SchedTopCredSeprtr"></img>
                                        <img src={require('../../../Assets/Images/tools/refresh.png')}
                                             className="ScheduleToolImg"
                                             onClick={() => this.getRecords("GroupADSFLFiles/Fetch")}></img>
                                    </div>
                                </div>


                                <ReactTable
                                    data={this.state.data}  ///this main file view grid
                                    columns={this.state.columns}
                                    ref={this.wrapperRef}
                                    loading={this.state.flLoading}
                                    NoDataComponent={() => null}
                                    showPagination={false}
                                    extradata={this.state}
                                    filtered={this.state.filtered}
                                    minRows={20}
                                    defaultPageSize={20}
                                    pageSize={this.state.data.length}
                                    sortable={false}
                                    getTrGroupProps={(state, rowInfo, column, instance) => {
                                        if (rowInfo !== undefined) {
                                            return {
                                                onClick: (e, handleOriginal) => {
                                                    this.setState({FlDtIndex: rowInfo.index}, () => console.log("MainData", rowInfo.original))
                                                },
                                                onDoubleClick: () => {
                                                    console.log("data on double click", rowInfo.original,this.state.data);
                                                    if(this.state.data[rowInfo.index].FileGroups && this.state.data[rowInfo.index].FileGroups[0]){
                                                        var providerId = this.state.data[rowInfo.index].FileGroups[0].Provider ;
                                                    }

                                                    if (rowInfo.original.VideoMicrosite == 1) {
                                                        this.setState({VideoMicrosite: true})
                                                        this.state.flEditData.VideoMicrosite = true
                                                    } else {
                                                        this.setState({VideoMicrosite: false})
                                                        this.state.flEditData.VideoMicrosite = false
                                                    }
                                                    this.setState({channel: rowInfo.original.Channel})

                                                    let data = rowInfo.original;

                                                    data.FileGroups = [
                                                        {
                                                            "Group_ADS_ID": rowInfo.original.GROUP_ADS_ID
                                                        }
                                                    ]
                                                    let provider;
                                                    if(this.state.providerData && this.state.providerData.length > 0) {

                                                        console.log("==================",providerId)
                                                        this.state.providerData.forEach(function (item) {
                                                            if(providerId == item.Provider_Name) {
                                                                provider = item.Provider_ID;
                                                            }
                                                        });
                                                        if(provider){
                                                            this.state.provider = provider;
                                                        }
                                                    }
                                                    data.Provider = provider;
                                                    if(rowInfo.original.FileDetails && rowInfo.original.FileDetails.length>0){

                                                        if (rowInfo.original.FileDetails[0].DATEEND) {
                                                            data.DATEEND = new Date(rowInfo.original.FileDetails[0].DATEEND);
                                                        } else {
                                                            if (rowInfo.original.FileDetails[0].DateEnd) {
                                                                data.DATEEND = new Date(rowInfo.original.FileDetails[0].DateEnd);
                                                            }
                                                        }
                                                        if (rowInfo.original.FileDetails[0].DATESTART) {
                                                            data.DATESTART = new Date(rowInfo.original.FileDetails[0].DATESTART);
                                                        } else {
                                                            if (rowInfo.original.FileDetails[0].DateStart) {
                                                                data.DATESTART = new Date(rowInfo.original.FileDetails[0].DateStart);
                                                            }
                                                        }

                                                        let timeSrthr = 0;
                                                        let timeSrtmin = 0;
                                                        let timeEndhr = 0;
                                                        let timeEndmin = 0;
                                                        if (rowInfo.original.FileDetails[0].TIMESTART) {
                                                            var strTimeArr = rowInfo.original.FileDetails[0].TIMESTART.split(":");
                                                            if (strTimeArr && strTimeArr.length > 0) {
                                                                timeSrthr = strTimeArr[0];
                                                            }
                                                            if (strTimeArr && strTimeArr.length > 1) {
                                                                timeSrtmin = strTimeArr[1];
                                                            }
                                                        }
                                                        else {
                                                            if (rowInfo.original.FileDetails[0].TimeStart) {
                                                                var strTimeArr = rowInfo.original.FileDetails[0].TimeStart.split(":");
                                                                if (strTimeArr && strTimeArr.length > 0) {
                                                                    timeSrthr = strTimeArr[0];
                                                                }
                                                                if (strTimeArr && strTimeArr.length > 1) {
                                                                    timeSrtmin = strTimeArr[1];
                                                                }
                                                            }
                                                        }
                                                        if (rowInfo.original.FileDetails[0].TIMEEND) {
                                                            var endTimeArr = rowInfo.original.FileDetails[0].TIMEEND.split(":");
                                                            if (endTimeArr && endTimeArr.length > 0) {
                                                                timeEndhr = endTimeArr[0];
                                                            }
                                                            if (endTimeArr && endTimeArr.length > 1) {
                                                                timeEndmin = endTimeArr[1];
                                                            }
                                                        }
                                                        else {
                                                            if (rowInfo.original.FileDetails[0].TimeEnd) {
                                                                var endTimeArr = rowInfo.original.FileDetails[0].TimeEnd.split(":");
                                                                if (endTimeArr && endTimeArr.length > 0) {
                                                                    timeEndhr = endTimeArr[0];
                                                                }
                                                                if (endTimeArr && endTimeArr.length > 1) {
                                                                    timeEndmin = endTimeArr[1];
                                                                }
                                                            }
                                                        }
                                                        this.setState({
                                                            timeSrthr: timeSrthr,
                                                            timeSrtmin: timeSrtmin,
                                                            timeEndhr: timeEndhr,
                                                            timeEndmin: timeEndmin
                                                        });
                                                        if(rowInfo.original.FileDetails[0].ORDERLOOP){
                                                            data.ORDERLOOP = rowInfo.original.FileDetails[0].ORDERLOOP;
                                                        }

                                                        if(rowInfo.original.FileDetails[0].FULLSCR_NG){
                                                            data.FULLSCR_NG =  rowInfo.original.FileDetails[0].FULLSCR_NG;
                                                            this.state.fScreen = rowInfo.original.FileDetails[0].FULLSCR_NG
                                                        }
                                                    }


                                                    if (data.Len) {

                                                    } else {
                                                        if (data.Length) {
                                                            data.Len = data.Length;
                                                        }
                                                    }
                                                    let weekPartArry=[];
                                                    let AllDay =false;
                                                    if(data.Weekpart && data.Weekpart !=""){
                                                          try{
                                                              let tempArr =  data.Weekpart.split(',');

                                                              if(tempArr && tempArr.length>0){
                                                                  this.state.WeekPartArray.forEach(function (item) {

                                                                      item.isselected=false;

                                                                  })
                                                                  for(var i=0;i<tempArr.length;i++){
                                                                      tempArr[i]=parseInt(tempArr[i]);
                                                                      this.state.WeekPartArray.forEach(function (item) {
                                                                          if(item.dayId==tempArr[i]){
                                                                              item.isselected=true;
                                                                          }
                                                                      })
                                                                  }
                                                                  this.setState({Weekpart:tempArr})
                                                                  this.state.Weekpart=tempArr;
                                                                  data["Weekpart"] = this.state.Weekpart;

                                                                  data.WeekPartArray =this.state.WeekPartArray;


                                                                  if(tempArr.length==7){
                                                                      this.state.weekAllDay = true;
                                                                      data.weekAllDay=true;
                                                                  }
                                                              }
                                                          }catch(error){

                                                          }

                                                    }else{
                                                        console.log("is blanck weekpart")
                                                        this.state.weekAllDay = false;
                                                        data.weekAllDay=false;
                                                        this.state.Weekpart=[];
                                                        data.Weekpart=[];
                                                        let tempWeekData = [
                                                            {
                                                                dayId: 0,
                                                                day: "Sun",
                                                                isselected:false
                                                            },
                                                            {
                                                                dayId: 1,
                                                                day: "Mon",
                                                                isselected:false
                                                            },
                                                            {
                                                                dayId: 2,
                                                                day: "Tue",
                                                                isselected:false
                                                            },
                                                            {
                                                                dayId: 3,
                                                                day: "Wed",
                                                                isselected:false
                                                            },
                                                            {
                                                                dayId: 4,
                                                                day: "Thu",
                                                                isselected:false
                                                            },
                                                            {
                                                                dayId: 5,
                                                                day: "Fri",
                                                                isselected:false
                                                            },
                                                            {
                                                                dayId: 6,
                                                                day: "Sat",
                                                                isselected:false
                                                            }

                                                        ]
                                                        data.WeekPartArray=tempWeekData;
                                                        this.state.WeekPartArray=tempWeekData;
                                                        //this.state.Weekpart=tempArr;
                                                    }

                                                    var extension =  data.FileName.substring( data.FileName.lastIndexOf('.')+1);
                                                    console.log("edit extension",extension);
                                                    if(extension=="wmv" || extension=="mp4"){
                                                        this.state.isDisableDruration=true;
                                                    }else{
                                                        this.state.isDisableDruration=false;
                                                    }
                                                    data.IndexType = rowInfo.original.IndexType;
                                                    var enableAltImge=false;
                                                    if(data.Network=="UNITED"){
                                                        enableAltImge=true;
                                                    }
                                                    data.altImage = data.AltImage;

                                                    console.log("data after for edit on double click",data);
                                                    this.setState({
                                                        flEditData: data,
                                                        editFile: true,
                                                        typeL: rowInfo.original.IndexType,
                                                        fLength: rowInfo.original.Len,
                                                        enableAltImge:enableAltImge,
                                                        Weekpart:data.Weekpart,
                                                        order:data.ORDERLOOP
                                                    },()=>console.log("+++++++++++++",this.state.provider));
                                                    var self = this;
                                                    setTimeout(function () {
                                                        console.log("flEditData on double click",self.state.flEditData);
                                                    },5000)

                                                },
                                                style: {
                                                    background: this.state.FlDtIndex === rowInfo.index ? "#5ca0f2"
                                                        : rowInfo.original.ColorStatus > 0 &&
                                                        rowColor[rowInfo.original.ColorStatus],
                                                }
                                            }
                                        }
                                    }}
                                    style={{
                                        height: this.state.schedBtm ? "280px" : "425px", //
                                    }}
                                    getTheadFilterProps={(state, rowInfo, column, instance) => {
                                        return {
                                            style: {display: "none"}
                                        };
                                    }}

                                />
                                <div className="SchedFilVwbtmTogWrp" onClick={() => this.setFlDetails(0, true, true)}>
                                    <img src={require('../../../Assets/Images/Media/right-arrow.png')}
                                         className={this.state.schedBtm ? "SchedBtmArrowImg2" : "SchedBtmArrowImg"}></img>
                                </div>
                                {
                                    this.state.visibletoolTip == true &&
                                    <div className="fileviewToolTip">
                                        <img src={this.state.tooltipImg}></img>
                                    </div>
                                }

                                {
                                    this.state.schedBtm &&
                                    <div>
                                        <div className="CabDtTabMainWrp">
                                            {
                                                subTabs && subTabs.map((key, index) => (
                                                    <div
                                                        className={this.state.FlDtTabIndex === index ? "CabDtTabWrp1" : "CabDtTabWrp"}
                                                        onClick={() => this.setFlDetails(index, true, false)}>{key}</div>
                                                ))
                                            }
                                        </div>
                                        <ReactTable
                                            data={this.state.data[this.state.FlDtIndex][subTabsKey[this.state.FlDtTabIndex]] ? this.state.data[this.state.FlDtIndex][subTabsKey[this.state.FlDtTabIndex]] : []}
                                            columns={this.state.btmCol} ///this is bottom grid for fileview
                                            showPagination={false}
                                            NoDataComponent={() => null}
                                            extradata={this.state}
                                            filtered={this.state.subTabFiltered}
                                            sortable={false}
                                            style={{
                                                height: "117px", //
                                            }}
                                            getTrGroupProps={(state, rowInfo, column, instance) => {
                                                if (rowInfo !== undefined) {
                                                    return {
                                                        onDoubleClick: () => {
                                                            this.setBtmDetails(rowInfo.original)
                                                        },
                                                    }
                                                } else {
                                                    return {
                                                        onDoubleClick: () => {
                                                            this.setBtmDetails(null, 1)
                                                        },
                                                    }
                                                }
                                            }}
                                            getTheadFilterProps={(state, rowInfo, column, instance) => {
                                                return {
                                                    style:
                                                        this.state.subTabVisibleFilters.length === 0
                                                            ? { display: "none" }
                                                            : null
                                                };
                                            }}
                                            getTheadFilterThProps={(state, rowInfo, column, instance) => {
                                                return {
                                                    className:
                                                        this.state.subTabVisibleFilters.indexOf(column.id) < 0
                                                            ? "hiddenFilter"
                                                            : null
                                                };
                                            }}
                                        />
                                    </div>
                                }


                            </div>
                            {
                                this.state.grpFileView ?
                                    <div className="SchedGrpWrp">
                                        <div className="SchedGrpTableToolWrp">
                                            <img src={require("../../../Assets/Images/Group/add-over.png")}
                                                 className="SchedGrpTableToolImg" onClick={() => this.addGroup()}></img>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            <img src={require("../../../Assets/Images/Group/delete-over.png")}
                                                 className="SchedGrpTableToolImg"
                                                 onClick={() => this.handeldeleteBeforedelete()}></img>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            <div>
                                                <img src={require("../../../Assets/Images/Group/change-status.png")}
                                                     className="SchedGrpTableToolImg"
                                                     onClick={() => this.openStatusDll()}></img>
                                                <div className={this.state.showStatus ? "grpStatus" : "grpStatus_none"}>
                                                    <div className="nav__submenu-item"
                                                         onClick={() => this.handleStatusChange(0)}>Current
                                                    </div>
                                                    <div className="nav__submenu-item"
                                                         onClick={() => this.handleStatusChange(2)}>Draft
                                                    </div>
                                                    <div className="nav__submenu-item"
                                                         onClick={() => this.handleStatusChange(3)}>Test
                                                    </div>
                                                </div>

                                            </div>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            {/* <img src={require("../../../Assets/Images/Group/house_icon_20px.gif")}
                                                 className="SchedGrpTableToolImg"
                                                 onClick={() => this.setState({houseAd: true})}></img>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            <img src={require("../../../Assets/Images/Group/preview.gif")}
                                                 className="SchedGrpTableToolImg"
                                                 onClick={() => this.setPrevColumns()}></img>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img> */}
                                            <img src={require("../../../Assets/Images/tools/refresh.png")}
                                                 className="SchedGrpTableToolImg" style={{"object-fit":"contain","margin-top":"-6px"}}
                                                 onClick={() => this.getGrpData("GroupADSFL/Fetch", "get")}></img>
                                            <img src={require("../../../Assets/Images/Media/collapse-view.png")}
                                                 className="SchedGrpTableToolImg2" onClick={() => {
                                                this.setState({grpDelete:[],grpFileView: false});
                                                this.getGrpData("GroupADSFL/Fetch", 'get')
                                            }}></img>
                                        </div>
                                        <ReactTable
                                            data={this.state.grpData} ///this is group gird from file view
                                            columns={this.grpColumn}
                                            loading={this.state.grpLoading}
                                            filtered={this.state.grpfiltered}
                                            sortable={false}
                                            minRows={20}
                                            defaultPageSize={20}
                                            pageSize={this.state.grpData.length}
                                            showPagination={false}
                                            className="SchedGrpTableWrp1"
                                            getTrGroupProps={(state, rowInfo, column, instance) => {
                                                if (rowInfo !== undefined) {
                                                    return {
                                                        onMouseOver: (e, handleOriginal) => {
                                                            this.setGroupInf(rowInfo)
                                                        },
                                                        onClick: (e, handleOriginal) => {
                                                            this.setState({
                                                                FlDtIndex: rowInfo.index,
                                                                grpDelete:[],
                                                                 deletData:[],
                                                                grpId: rowInfo.original.Group_ADS_ID
                                                            })
                                                        },
                                                        onDoubleClick: () => {
                                                            this.setEditGroupData(rowInfo)
                                                        },
                                                        /*style:{
                                                         background:rowInfo.original.ColorStatus > 0 ? rowColor[rowInfo.original.ColorStatus]:"",
                                                         }*/
                                                        style: {
                                                            background: this.state.grpId === rowInfo.original.Group_ADS_ID ? "#5ca0f2" : ""
                                                        }
                                                    }
                                                }
                                            }}
                                            getTheadFilterProps={(state, rowInfo, column, instance) => {
                                                return {
                                                    style: this.state.grpvisibleFilters.length === 0
                                                        ? {display: "none"}
                                                        : null
                                                };
                                            }}
                                            getTheadFilterThProps={(state, rowInfo, column, instance) => {
                                                return {
                                                    className: this.state.grpvisibleFilters.indexOf(column.id) < 0
                                                        ? "hiddenFilter"
                                                        : null
                                                };
                                            }}

                                        />
                                        <div className="ScedGrpInfoMainWrp">
                                            <div className="SchedGrpInfoChild1">{this.state.groupName}</div>
                                            <div className="SchedGrpInfoChild1">
                                                <div className="SchedGrpInfoChild2">
                                                    Videos:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].VideoCount : 0}</div>
                                                <div className="SchedGrpInfoChild2">
                                                    Buttons:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].ButtonCount : 0}</div>
                                                <div className="SchedGrpInfoChild2">
                                                    Banners:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].BannerCount : 0}</div>
                                            </div>
                                            <div className="SchedGrpInfoChild1">
                                                <div className="SchedGrpInfoChild2">Associated
                                                    Cabs:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].CabCount : 0}</div>
                                                <div className="SchedGrpInfoChild2">Restricted
                                                    Cabs:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].RestrictedCabCount : 0}</div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="SchedFileVTogWrp"
                                         onClick={() => this.setState({grpFileView: true})}>
                                        <img src={require('../../../Assets/Images/Media/right-arrow.png')}
                                             className="SchedBtmArrowImg1"></img>
                                    </div>
                            }
                        </div>

                        :
                        <div id="container" contextMenu="none" onContextMenu={(e) => e.preventDefault()}>
                            {
                                this.state.rightAction > 0 ?
                                    <div className="actionMenu"
                                         style={{top: `${this.state.y}px`, left: `${this.state.x}px`}}>
                                        <ul className="actionUl" style={{"list-style": "none"}}>
                                            <li>
                                                <div onClick={() => this.setContextMenu("Geozone")}>Update Geozones
                                                </div>

                                            </li>
                                        </ul>
                                    </div> : <div></div>


                            }
                            <div className="SchedGrpMainWrp">

                                <div className="SchedGrpTaleWrp">
                                    {
                                        this.state.columnSt &&
                                        <ColumnStatus data={this.state.switchcolumns}
                                                      onChange={(e) => this.setColumn(e, 'switchcolumns')}
                                                      class={"SchedGrpColSt"}
                                                      onClose={(e) => this.resetColmn(e, 'switchcolumns')}></ColumnStatus>
                                    }
                                    <div className="CabDtTabMainWrp">
                                        {
                                            this.tabs && this.tabs.map((key, index) => (
                                                <div
                                                    className={this.state.tabIndex === index ? "CabDtTabWrp1" : "CabDtTabWrp"}
                                                    onClick={() => this.setState({tabIndex: index}, () => this.setGroup(true))}>{key}
                                                    ( {this.getTabDataCount(key)} )</div>
                                            ))
                                        }
                                    </div>
                                    <div className="ScheduleTabToolWrp">
                                        <img src={require('../../../Assets/Images/Upload/upload-btn.png')}
                                             className="grShedImg" onClick={() => this.setState({upload: true})}></img>
                                        {
                                            this.state.tabIndex === 0 ?
                                                <div style={{display: "flex"}}>
                                                    <img src={require('../../../Assets/Images/Schedule/add-video.png')}
                                                         className="grShedImg"
                                                         onClick={() => this.setState({schedVideo: true,isenableschedBtn:true})}></img>
                                                    <img
                                                        src={require('../../../Assets/Images/Schedule/delete-video.png')}
                                                        className="grShedImg" onClick={() => this.beforeDeletefiles(0)}></img>
                                                    <img src={require('../../../Assets/Images/Schedule/copy-video.png')}
                                                         className="grShedImg" onClick={() => this.copyVideo(0)}></img>
                                                </div>
                                                :
                                                <div style={{display: "flex"}}>
                                                    <img src={require('../../../Assets/Images/Schedule/add-banner.png')}
                                                         className="grShedImg"
                                                         onClick={() => this.setState({schedBanner: true})}></img>
                                                    <img
                                                        src={require('../../../Assets/Images/Schedule/delete-banner.png')}
                                                        className="grShedImg" onClick={() => this.beforeDeletefiles(1)}></img>
                                                    <img
                                                        src={require('../../../Assets/Images/Schedule/copy-banner.png')}
                                                        className="grShedImg" onClick={() => this.copyVideo(1)}></img>
                                                </div>
                                        }
                                        <div className="ScheduleTableToolCont">
                                            <img src={require('../../../Assets/Images/tools/change-perspective.png')}
                                                 className="ScheduleToolImg" onClick={() => this.setGroup(false)}></img>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')}
                                                 className="ScheduleToolImg"></img>*/}
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            <img src={require('../../../Assets/Images/tools/show-coloumn.png')}
                                                 className="ScheduleToolImg"
                                                 onClick={() => this.setState({columnSt: !this.state.columnSt})}></img>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            <ExportCSV csvData={this.state.data} fileName={this.state.exportFileName}
                                                       visibleCol={this.state.switchcolumns} isConversion={true}
                                                       callback={() => this.getRecords("GroupADSFLFiles/Fetch")}/>
                                            <img src={require("../../../Assets/Images/separator.png")}
                                                 className="SchedTopCredSeprtr"></img>
                                            <img src={require('../../../Assets/Images/tools/refresh.png')}
                                                 className="ScheduleToolImg"
                                                 onClick={() => this.getRecords("GroupADSFLFiles/Fetch")}></img>
                                        </div>
                                    </div>
                                    <ReactTable
                                        data={this.state.data}
                                        columns={this.state.switchcolumns}  ///this is main group view grid
                                        filtered={this.state.filtered}
                                        loading={this.state.grpViewLoading}
                                        showPagination={false}
                                        NoDataComponent={() => null}
                                        minRows={20}
                                        sortable={false}
                                        defaultPageSize={20}
                                        pageSize={this.state.data.length}
                                        style={
                                            {
                                                width: "100%"
                                            }
                                        }
                                        defaultFilterMethod={(filter, row, column) => {
                                            const id = filter.pivotId || filter.id;
                                            return row[id] !== undefined
                                                ? String(row[id]).includes(filter.value)
                                                : true;
                                        }}
                                        getTrGroupProps={(state, rowInfo, column, instance) => {
                                            if (rowInfo !== undefined) {
                                                return {
                                                    onContextMenu: (e) => {
                                                        this.setState({
                                                            selectedRow: rowInfo,
                                                            rightAction: 1,
                                                            x: e.screenX,
                                                            y: e.screenY - 50,
                                                            visibleFilters: [],
                                                            flEditData: rowInfo.original,
                                                            FlDtIndex: rowInfo.index
                                                        });


                                                    },
                                                    onClick: (e, handleOriginal) => {
                                                        this.setState({FlDtIndex: rowInfo.index})
                                                    },
                                                    onDoubleClick: () => {
                                                        console.log("DATA on Doubl click", rowInfo.original);
                                                        let data = rowInfo.original;

                                                        data.FileDetails = [
                                                            {
                                                                "GROUP_ADSFL_DETAILID": rowInfo.original.GROUP_ADSFL_DETAILID
                                                            }
                                                        ]
                                                        data.FileGroups = [
                                                            {
                                                                "Group_ADS_ID": rowInfo.original.GROUP_ADS_ID
                                                            }
                                                        ]
                                                        let provider;
                                                        if (this.state.providerData && this.state.providerData.length > 0) {
                                                            this.state.providerData.forEach(function (item) {
                                                                if (rowInfo.original.Provider == item.Provider_Name) {
                                                                    provider = item.Provider_ID;
                                                                }
                                                            });
                                                        }
                                                        this.setState({channel: rowInfo.original.Channel})
                                                        data.Provider = provider;
                                                        if (rowInfo.original.DATEEND) {
                                                            data.DATEEND = new Date(rowInfo.original.DATEEND);
                                                        } else {
                                                            if (rowInfo.original.DateEnd) {
                                                                data.DATEEND = new Date(rowInfo.original.DateEnd);
                                                            }
                                                        }
                                                        if (rowInfo.original.DATESTART) {
                                                            data.DATESTART = new Date(rowInfo.original.DATESTART);
                                                        } else {
                                                            if (rowInfo.original.DateStart) {
                                                                data.DATESTART = new Date(rowInfo.original.DateStart);
                                                            }
                                                        }


                                                        let timeSrthr = 0;
                                                        let timeSrtmin = 0;
                                                        let timeEndhr = 0;
                                                        let timeEndmin = 0;
                                                        if (rowInfo.original.TIMESTART) {
                                                            var strTimeArr = rowInfo.original.TIMESTART.split(":");
                                                            if (strTimeArr && strTimeArr.length > 0) {
                                                                timeSrthr = strTimeArr[0];
                                                            }
                                                            if (strTimeArr && strTimeArr.length > 1) {
                                                                timeSrtmin = strTimeArr[1];
                                                            }
                                                        } else {
                                                            if (rowInfo.original.TimeStart) {
                                                                var strTimeArr = rowInfo.original.TimeStart.split(":");
                                                                if (strTimeArr && strTimeArr.length > 0) {
                                                                    timeSrthr = strTimeArr[0];
                                                                }
                                                                if (strTimeArr && strTimeArr.length > 1) {
                                                                    timeSrtmin = strTimeArr[1];
                                                                }
                                                            }
                                                        }
                                                        if (rowInfo.original.TIMEEND) {
                                                            var endTimeArr = rowInfo.original.TIMEEND.split(":");
                                                            if (endTimeArr && endTimeArr.length > 0) {
                                                                timeEndhr = endTimeArr[0];
                                                            }
                                                            if (endTimeArr && endTimeArr.length > 1) {
                                                                timeEndmin = endTimeArr[1];
                                                            }
                                                        } else {
                                                            if (rowInfo.original.TimeEnd) {
                                                                var endTimeArr = rowInfo.original.TimeEnd.split(":");
                                                                if (endTimeArr && endTimeArr.length > 0) {
                                                                    timeEndhr = endTimeArr[0];
                                                                }
                                                                if (endTimeArr && endTimeArr.length > 1) {
                                                                    timeEndmin = endTimeArr[1];
                                                                }
                                                            }
                                                        }
                                                        if (data.Len) {

                                                        } else {
                                                            if (data.Length) {
                                                                data.Len = data.Length;
                                                            }
                                                        }

                                                        if (data.Banner1 > 0) {

                                                        } else {
                                                            if (data.FileId_V) {
                                                                data.Banner1 = data.FileId_V;
                                                            }
                                                        }

                                                        if (data.Banner2 > 0) {

                                                        } else {
                                                            if (data.FileId_H) {
                                                                data.Banner2 = data.FileId_H;
                                                            }
                                                        }
                                                        if (data.Microsite > 0) {

                                                        } else {
                                                            if (data.RoadBlock) {
                                                                data.Microsite = data.RoadBlock;
                                                            }
                                                        }
                                                        let weekPartArry=[];
                                                        let AllDay =false;
                                                        if(data.Weekpart && data.Weekpart !=""){
                                                            let tempArr =  data.Weekpart.split(',');

                                                            if(tempArr && tempArr.length>0){
                                                                this.state.WeekPartArray.forEach(function (item) {

                                                                    item.isselected=false;

                                                                })
                                                                for(var i=0;i<tempArr.length;i++){
                                                                    tempArr[i]=parseInt(tempArr[i]);
                                                                    this.state.WeekPartArray.forEach(function (item) {
                                                                        if(item.dayId==tempArr[i]){
                                                                            item.isselected=true;
                                                                        }
                                                                    })
                                                                }
                                                                this.setState({Weekpart:tempArr})
                                                                this.state.Weekpart=tempArr;
                                                                data["Weekpart"] = this.state.Weekpart;

                                                                data.WeekPartArray =this.state.WeekPartArray;


                                                                if(tempArr.length==7){
                                                                    this.state.weekAllDay = true;
                                                                    data.weekAllDay=true;
                                                                }
                                                            }
                                                        }else{
                                                            /*this.state.weekAllDay = true;
                                                            data.weekAllDay=true;*/
                                                            console.log("is blanck weekpart")
                                                            this.state.weekAllDay = false;
                                                            data.weekAllDay=false;
                                                            this.state.Weekpart=[];
                                                            data.Weekpart=[];
                                                            let tempWeekData = [
                                                                {
                                                                    dayId: 0,
                                                                    day: "Sun",
                                                                    isselected:false
                                                                },
                                                                {
                                                                    dayId: 1,
                                                                    day: "Mon",
                                                                    isselected:false
                                                                },
                                                                {
                                                                    dayId: 2,
                                                                    day: "Tue",
                                                                    isselected:false
                                                                },
                                                                {
                                                                    dayId: 3,
                                                                    day: "Wed",
                                                                    isselected:false
                                                                },
                                                                {
                                                                    dayId: 4,
                                                                    day: "Thu",
                                                                    isselected:false
                                                                },
                                                                {
                                                                    dayId: 5,
                                                                    day: "Fri",
                                                                    isselected:false
                                                                },
                                                                {
                                                                    dayId: 6,
                                                                    day: "Sat",
                                                                    isselected:false
                                                                }

                                                            ]
                                                            data.WeekPartArray=tempWeekData;
                                                            this.state.WeekPartArray=tempWeekData;

                                                        }

                                                        this.setState({
                                                            timeSrthr: timeSrthr,
                                                            timeSrtmin: timeSrtmin,
                                                            timeEndhr: timeEndhr,
                                                            timeEndmin: timeEndmin
                                                        });

                                                        var extension =  data.FileName.substring( data.FileName.lastIndexOf('.')+1);
                                                        console.log("edit extension",extension);
                                                        if(extension=="wmv" || extension=="mp4"){
                                                            this.state.isDisableDruration=true;
                                                        }else{
                                                            this.state.isDisableDruration=false;
                                                        }
                                                        this.setState({
                                                            flEditData: data,
                                                            editFile: true,
                                                            editGrFile: true,
                                                            typeL: rowInfo.original.IndexType,
                                                            provider: provider,
                                                            fScreen:data.FULLSCR_NG,
                                                            order:data.ORDERLOOP
                                                        },()=>console.log(rowInfo.original));
                                                    },
                                                    style: {
                                                        background: rowInfo.original.ColorStatus > 0 ? rowColor[rowInfo.original.ColorStatus] : "",
                                                    }
                                                }
                                            }
                                        }}
                                        getTheadFilterProps={(state, rowInfo, column, instance) => {
                                            return {
                                                style: {display: "none"}
                                            };
                                        }}

                                    />
                                    {
                                        this.state.visibletoolTip == true &&
                                        <div className="fileviewGrToolTip">
                                            <img src={this.state.tooltipImg}></img>
                                        </div>
                                    }
                                </div>
                                {
                                    this.state.collapse ?
                                        <div className="SchedGrpWrp">
                                            <div className="SchedGrpTableToolWrp">
                                                <img src={require("../../../Assets/Images/Group/add-over.png")}
                                                     className="SchedGrpTableToolImg"
                                                     onClick={() => this.addGroup()}></img>
                                                <img src={require("../../../Assets/Images/separator.png")}
                                                     className="SchedTopCredSeprtr"></img>
                                                <img src={require("../../../Assets/Images/Group/delete-over.png")}
                                                     className="SchedGrpTableToolImg"
                                                     onClick={() => this.handeldeleteBeforedelete()}></img>
                                                <img src={require("../../../Assets/Images/separator.png")}
                                                     className="SchedTopCredSeprtr"></img>
                                                <div>
                                                    <img src={require("../../../Assets/Images/Group/change-status.png")}
                                                         className="SchedGrpTableToolImg"
                                                         onClick={() => this.openStatusDll()}></img>
                                                    <div
                                                        className={this.state.showStatus ? "grpStatus" : "grpStatus_none"}>
                                                        <div className="nav__submenu-item"
                                                             onClick={() => this.handleStatusChange(0)}>Current
                                                        </div>
                                                        <div className="nav__submenu-item"
                                                             onClick={() => this.handleStatusChange(2)}>Draft
                                                        </div>
                                                        <div className="nav__submenu-item"
                                                             onClick={() => this.handleStatusChange(3)}>Test
                                                        </div>
                                                    </div>

                                                </div>
                                                <img src={require("../../../Assets/Images/separator.png")}
                                                     className="SchedTopCredSeprtr"></img>
                                                {/* <img src={require("../../../Assets/Images/Group/house_icon_20px.gif")}
                                                     className="SchedGrpTableToolImg"
                                                     onClick={() => this.setState({houseAd: true})}></img>
                                                <img src={require("../../../Assets/Images/separator.png")}
                                                     className="SchedTopCredSeprtr"></img>
                                                <img src={require("../../../Assets/Images/Group/preview.gif")}
                                                     className="SchedGrpTableToolImg"
                                                     onClick={() => this.setPrevColumns()}></img>
                                                <img src={require("../../../Assets/Images/separator.png")}
                                                     className="SchedTopCredSeprtr"></img> */}
                                                <img src={require("../../../Assets/Images/tools/refresh.png")}
                                                     style={{"object-fit":"contain","margin-top":"-6px"}}
                                                     className="SchedGrpTableToolImg" onClick={() => {
                                                    this.setState({grpData: [],deletData:[],grpDelete:[]});
                                                    this.getGrpData("GroupADSFL/Fetch", "get")

                                                }}></img>
                                                <img src={require("../../../Assets/Images/Media/collapse-view.png")}
                                                     className="SchedGrpTableToolImg2" onClick={() => {
                                                    this.setState({grpDelete:[],collapse: false});
                                                    this.getGrpData("GroupADSFL/Fetch", 'get')
                                                }}></img>
                                            </div>
                                            <ReactTable
                                                data={this.state.grpData} //this group view Grop grid
                                                columns={this.grpColumn}
                                                loading={this.state.grpLoading}
                                                filtered={this.state.grpfiltered}
                                                sortable={false}
                                                minRows={20}
                                                defaultPageSize={20}
                                                pageSize={this.state.grpData.length}
                                                showPagination={false}
                                                className="SchedGrpTableWrp1"
                                                getTrGroupProps={(state, rowInfo, column, instance) => {
                                                    if (rowInfo !== undefined) {

                                                        return {
                                                            onMouseOver: (e, handleOriginal) => {
                                                                this.setGroupInf(rowInfo)
                                                            },
                                                            onDoubleClick: () => {
                                                                this.setEditGroupData(rowInfo)
                                                            },
                                                            onClick: (e, handleOriginal) => {
                                                                this.handleRowClick(rowInfo);
                                                                this.setState({grpId: rowInfo.original.Group_ADS_ID,deletData:[]}, () => {
                                                                    if (this.state.group) {
                                                                        this.getRecords();
                                                                    }
                                                                })
                                                            },
                                                            style: {
                                                                background: this.state.grpId === rowInfo.original.Group_ADS_ID ? "#5ca0f2" : ""
                                                            }
                                                        }
                                                    }
                                                }}
                                                getTheadFilterProps={(state, rowInfo, column, instance) => {
                                                    return {
                                                        style: this.state.grpvisibleFilters.length === 0
                                                            ? {display: "none"}
                                                            : null
                                                    };
                                                }}
                                                getTheadFilterThProps={(state, rowInfo, column, instance) => {
                                                    return {
                                                        className: this.state.grpvisibleFilters.indexOf(column.id) < 0
                                                            ? "hiddenFilter"
                                                            : null
                                                    };
                                                }}
                                            />
                                            <div className="ScedGrpInfoMainWrp">
                                                <div className="SchedGrpInfoChild1">{this.state.groupName}</div>
                                                <div className="SchedGrpInfoChild1">
                                                    <div className="SchedGrpInfoChild2">
                                                        Videos:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].VideoCount : 0}</div>
                                                    <div className="SchedGrpInfoChild2">
                                                        Buttons:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].ButtonCount : 0}</div>
                                                    <div className="SchedGrpInfoChild2">
                                                        Banners:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].BannerCount : 0}</div>
                                                </div>
                                                <div className="SchedGrpInfoChild1">
                                                    <div className="SchedGrpInfoChild2">Associated
                                                        Cabs:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].CabCount : 0}</div>
                                                    <div className="SchedGrpInfoChild2">Restricted
                                                        Cabs:{this.state.grpData.length && this.state.grpData[this.state.grpIndex] ? this.state.grpData[this.state.grpIndex].RestrictedCabCount : 0}</div>
                                                </div>
                                            </div>
                                            {
                                                this.state.grViewGroupValid ?
                                                    <Dialog title={this.state.dlgtitle} message={this.state.message}
                                                            onOk={() => this.setState({grViewGroupValid: false})}
                                                            onHide={() => this.setState({grViewGroupValid: false})}/>
                                                    : <div></div>

                                            }
                                        </div>
                                        :
                                        <div className="SchedFileVTogWrp"
                                             onClick={() => this.setState({collapse: true})}>
                                            <img src={require('../../../Assets/Images/Media/right-arrow.png')}
                                                 className="SchedBtmArrowImg1"></img>
                                        </div>
                                }

                            </div>
                        </div>
                }
            </div>
        )
    }
}