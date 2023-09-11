import React, { Component } from "react";
import "../../../Assets/StyleSheet.css";
import ReactTable from "react-table";
import "../../../Assets/react-table.css";
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import { getData, postData } from "../../../Services/MainServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Search } from "../../CommomComponents/Filters";
import ComCheck from "../../CommomComponents/ComCheck";
import Dialog from "../../CommomComponents/Dialog";
import BaseUrl from "../../../Services/BaseUrl";
import { Line } from "rc-progress";

const columns = [
  { accessor: "FileName", lable: "Zipped Name" },
  { accessor: "TempName", lable: "File Name" },
  { accessor: "ContentTypeID", lable: "Content File Type" },
  { accessor: "PathLocation", lable: "Path" },
  { accessor: "FileSize", lable: "File Size" },
  { accessor: "Tag", lable: "Tags" },
  { accessor: "strDated", lable: "Upload Date" },
  { accessor: "strFileDate", lable: "Date Created" },
  { accessor: "ExpDate", lable: "Expiry Date" },
  { accessor: "Length", lable: "Length" },
  { accessor: "ContractID", lable: "Contract" },
];

const content = {
  "All Files": "",
  Videos: 1,
  Banners: 2,
  Microsites: 4,
  Buttons: 6,
};

const userID = sessionStorage.getItem("userID");

const marketID = sessionStorage.getItem("marketId");

export default class MediaFiles extends Component {
  tem = [];
  uploadFileExt;
  tabs = ["All Files", "Videos", "Banners", "Microsites", "Buttons"];
  setCol = true;
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    if (sessionStorage.getItem("marketId")) {
      if (sessionStorage.getItem("marketId") == "MX925") {
        this.tabs = ["Videos", "Banners"];
        this.uploadFileExt = ".avi,.jpg,.jpeg,.gif,.png,.swf";
      } else if (sessionStorage.getItem("marketId") == "DTTU") {
        this.tabs = ["All Files", "Videos", "Banners"];
        this.uploadFileExt = ".wmv,.jpg,.jpeg,.gif,.png,.swf,.mp4";
      } else if (sessionStorage.getItem("marketId") == "GLACIER") {
        this.tabs = ["All Files", "Videos", "Banners"];
        this.uploadFileExt = ".wmv,.jpg,.jpeg,.gif,.png,.swf,.mp4";
      } else {
        this.tabs = ["All Files", "Videos", "Banners", "Microsites", "Buttons"];
        this.uploadFileExt = ".wmv,.jpg,.jpeg,.gif,.png,.swf";
      }
    }
    this.state = {
      columns: [],
      columnSt: false,
      data: [],
      backData: [],
      searchFilename: "",
      searchTag: "",
      filtered: [],
      sty: { width: "30px", height: "0px" },
      filter: -1,
      filterVal: [],
      visibleFilters: [],
      tabIndex: 0,
      activeFile: -1,
      strDate: moment(new Date().setDate(new Date().getDate() - 7)).format(
        "MM-DD-YYYY"
      ), //"01/"+moment().format("DD")+"/"+moment().format("YYYY"),
      endDate: new Date(),
      grid: true,
      expiry: 0,
      files: "",
      tags: "",
      loading: true,
      contentType: "All Files",
      upload: false,
      selectedFiles: [],
      uplddata: [],
      expDate: new Date(),
      message: "",
      dlgtitle: "",
      dlgType: "",
      dlgEnable: false,
      deleteFile: [],
      systProgCnt: 0,
      x: 0,
      y: 0,
      divHeight: 0,
      fileUplaodLoding: false,
      screenSection: 0,
      mediaLoading: false,
    };
  }

  componentDidMount() {
    if (sessionStorage.getItem("marketId")) {
      if (sessionStorage.getItem("marketId") == "MX925") {
        this.state.contentType = "Videos";
      }
    }
    this.getRecords();
    this.setTable();
    document.addEventListener("mousedown", this.handleClickOutside);
    /* let { clientHeight, clientWidth } = this.refs.myImgContainer;
          this.setState({ divHeight:clientHeight });*/
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    // if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
    //     this.setState({visibleFilters:[]})
    // }
    var x = document.getElementsByClassName("SchedFiltInptWrp");
    console.log("x is ", x[0]);
    console.log("event.target is ", event.target);
    if (event.target !== x[0]) {
      console.log("out inside");
      this.setState({ visibleFilters: [] });
    } else {
      console.log("inside inside");
    }
  }

  upColumns = [
    {
      Header: "File Name",
      accessor: "FileName",
    },
    {
      Header: "Expiry Date",
      accessor: "ExpDate",
      Cell: (rowInfo) => (
        <DatePicker
          selected={this.getExpDate(rowInfo)}
          onChange={(date) => this.setUpldInput(date, rowInfo, "ExpDate")}
          wrapperClassName="MediaDatePickWrp"
          className="MediaDateInptWrp"
          popperPlacement="right-start"
        ></DatePicker>
      ),
    },
    {
      Header: "Content File Type",
      accessor: "ContentFileTypeID",
      Cell: (rowInfo) => (
        <select
          className="MediaDropDwn1"
          onChange={(e) =>
            this.setUpldInput(e.target.value, rowInfo, "ContentFileTypeID")
          }
        >
          <option value=""></option>
          <option value="1">AD</option>
          <option value="2">NEWS</option>
          <option value="3">CONTENT</option>
          <option value="4">WEATHER</option>
        </select>
      ),
    },
    {
      Header: "Owner",
      accessor: "OwnerID",
      Cell: (rowInfo) => (
        <select
          className="MediaDropDwn1"
          onChange={(e) =>
            this.setUpldInput(e.target.value, rowInfo, "OwnerID")
          }
        >
          <option value=""></option>
          <option value="1">Verifone</option>
          <option value="2">NBC</option>
          <option value="3">NYCM</option>
          <option value="4">Vistar</option>
        </select>
      ),
    },
    {
      Header: "Tags",
      accessor: "Tag",
      Cell: (rowInfo) => (
        <div className="MeadiaUpldInptwrp">
          <input
            className="MediaUpldInpt"
            onChange={(e) => this.setUpldInput(e.target.value, rowInfo, "Tag")}
          ></input>
        </div>
      ),
    },
    {
      Header: "Contract#",
      accessor: "ContractID",
      Cell: (rowInfo) => (
        <div className="MeadiaUpldInptwrp">
          <input
            className="MediaUpldInpt"
            min="1"
            onChange={(e) =>
              this.setUpldInput(e.target.value, rowInfo, "ContractID")
            }
          ></input>
        </div>
      ),
    },
    {
      Header: "Commited Impression",
      accessor: "Commited",
      Cell: (rowInfo) => (
        <div className="MeadiaUpldInptwrp">
          <input
            className="MediaUpldInpt"
            min="1"
            onChange={(e) =>
              this.setUpldInput(e.target.value, rowInfo, "Impression")
            }
          ></input>
        </div>
      ),
    },
    {
      Header: "Upload Progress",
      accessor: "upload",
      Cell: (props) => (
        <div className={props.original.Code ? "" : "ProgressBrWrp"}>
          {props.original.Code ? (
            <span>
              {props.original.Code == 0
                ? props.original.Status
                : props.original.Message}
            </span>
          ) : (
            <Line
              percent={this.state.systProgCnt}
              strokeWidth="1"
              strokeColor="#80BBD7"
              trailColor="#FFFFFF"
              className="SystUProgress"
            />
          )}
        </div>
      ),
    },
    {
      Header: "",
      Cell: (rowInfo) => (
        <div style={{ paddingBottom: "10px" }}>
          {" "}
          <img
            src={require("../../../Assets/Images/Group/delete-over.png")}
            className="SchedGrpTableToolImg1"
            onClick={() => this.deleteRow(rowInfo)}
          ></img>
        </div>
      ), // Custom cell components!
      width: 35,
    },
  ];

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
      this.setState({ expDate: val });
      //let dt1 = new Date(val);
      let dt1 = moment(val).format("MM-DD-YYYY");
      let dt2 = moment().format("MM-DD-YYYY");
      dt1 = new Date(dt1).getTime();
      dt2 = new Date(dt2).getTime();
      console.log("dtydtd", dt1);
      console.log("dtydtd", dt2);
      if (dt1 >= dt2) {
        temdata[rowInfo.index]["expDate"] = new Date(val);
        console.log("temdata is", temdata);
        this.setState({ uplddata: temdata });
        console.log("update", this.state.uplddata);
      } else {
        //alert('Expiry date cannot less than current date');
        this.setState({
          dlgtitle: "Information",
          message: "Expiry date cannot less than current date",
          dlgType: "information",
          upLoadvalidMsg: true,
        });
      }
    } else {
      this.state.uplddata[rowInfo.index][type] = val;
    }
  }

  deleteRow(rowInfo) {
    let data1 = [];
    for (let i = 0; i < this.state.uplddata.length; i++) {
      if (i !== rowInfo.index) {
        data1.push(this.state.uplddata[i]);
      }
    }

    this.setState({ uplddata: data1 });
  }

  getRecords() {
    this.setState({ loading: true });

    var startDt = moment(this.state.strDate).utcOffset(0);
    startDt.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    startDt.toISOString();
    startDt.format();
    var endDt = moment(this.state.endDate).utcOffset(0);
    endDt.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    endDt.toISOString();
    endDt.format();
    let sendContentType = 1;
    if (this.state.contentType == "Banners") {
      sendContentType = "2,3";
    } else {
      sendContentType = content[this.state.contentType]; // -1 : ALL
    }
    let obj = {
      fileTypes: null,
      filenames: "",
      regularExpression: null,
      isConsiderExpiry: false,
      fetchTimeStamp: null,
      dtFetchTimeStamp: null,
      strFileName: "",
      ContentFileType: 0,
      Tag: null,
      UserID: 0,
      UnitType: 0,
      strFromDate: startDt,
      strToDate: endDt,
      OwnerID: -1, // -1= ALL
      ExpiryFlag: this.state.expiry, // 0=Non Expired, 1= Expired, -1=ALL
      ContentType: sendContentType,
      GroupID: 0,
    };
    this.setState({ mediaLoading: true });
    postData("FileUpload/FetchFiles", obj)
      .then((res) => {
        this.setState({ mediaLoading: false });
        if (res.data && res.data.ResponseCollection) {
          this.setState(
            {
              data: res.data.ResponseCollection,
              backData: res.data.ResponseCollection,
              loading: false,
            },
            () => {}
          );
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((e) => {
        this.setState({ loading: false, mediaLoading: false });
      });
  }

  setTable() {
    let dColumn = [];
    let sColumn = [];
    this.state.filterVal = [];
    let obj = {
      Header: "#",
      Cell: (rowInfo) => (
        <ComCheck
          onChange={(e) => this.selectFile(rowInfo.original.FileID, "Table")}
          containerStyle={"ComCheckMainWrp"}
          tickStyle={"SchedCheckTick"}
        ></ComCheck>
      ), // Custom cell components!
      width: 25,
    };
    dColumn.push(obj);
    columns.map((key, index) => {
      this.state.filterVal.push("");
      let obj = {};
      if (key.accessor === "TempName") {
        obj = {
          Header: (cellInfo) => (
            <div className="ScheduleHeaderWrp">
              <div>{key.lable}</div>
              {this.state.filterVal[index] === "" ? (
                <img
                  src={require("../../../Assets/Images/Filter/filter.png")}
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              ) : (
                <img
                  src={require("../../../Assets/Images/Filter/filter_active.png")}
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              )}
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
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
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
          ),
          Cell: (rowInfo) => (
            <div className="SystFlColContainer">
              <span className="SystFlColTxt">{rowInfo.original.TempName}</span>
              <a href={rowInfo.original.WebVisibleURL} download>
                <img
                  src={require("../../../Assets/Images/Media/download.jpg")}
                  className="MediaFlColDnldImg"
                  onClick={() => this.downloadfile(rowInfo.original.TempName)}
                ></img>
              </a>
              <img
                src={require("../../../Assets/Images/Media/video-preview.png")}
                className="MediaFlColDnldImg"
              ></img>
            </div>
          ),
        };
      } else {
        obj = {
          Header: (cellInfo) => (
            <div className="ScheduleHeaderWrp">
              <div>{key.lable}</div>
              {this.state.filterVal[index] === "" ? (
                <img
                  src={require("../../../Assets/Images/Filter/filter.png")}
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              ) : (
                <img
                  src={require("../../../Assets/Images/Filter/filter_active.png")}
                  className="ScheduleheadFilt"
                  onClick={() => this.setFilter(cellInfo.column.id, index)}
                ></img>
              )}
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
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
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
          ),
        };
      }

      dColumn.push(obj);
    });
    this.setState({ columns: dColumn });
  }

  setTab(index, tab) {
    this.setState(
      {
        tabIndex: index,
        contentType: tab,
        grid: true,
        loading: true,
        data: [],
      },
      () => {
        this.getRecords();
      }
    );
  }

  checkAllowed(market, key) {
    if ((key = "All Files")) {
      if (
        market == "NY" ||
        market == "M10" ||
        market == "DTTU" ||
        market == "GLACIER"
      ) {
        return true;
      } else {
        return false;
      }
    } else if ((key = "Videos")) {
      if (
        market == "NY" ||
        market == "M10" ||
        market == "DTTU" ||
        market == "GLACIER" ||
        market == "MX925"
      ) {
        return true;
      } else {
        return false;
      }
    } else if ((key = "Banners")) {
      if (
        market == "NY" ||
        market == "M10" ||
        market == "DTTU" ||
        market == "GLACIER" ||
        market == "MX925"
      ) {
        return true;
      } else {
        return false;
      }
    } else if ((key = "Microsites")) {
      if (
        market == "NY" ||
        market == "M10" ||
        market == "DTTU" ||
        market == "GLACIER"
      ) {
        return true;
      } else {
        return false;
      }
    } else if ((key = "Buttons")) {
      if (
        market == "NY" ||
        market == "M10" ||
        market == "DTTU" ||
        market == "GLACIER"
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  setFilter(id, index) {
    this.setState(({ visibleFilters }) => {
      let update = [...visibleFilters];
      const index = update.indexOf(id);
      index < 0 ? update.push(id) : update.splice(index, 1);
      return { visibleFilters: update };
    });
  }

  customFilerChange(value, accessor, index) {
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

  onFileChange(e) {
    this.state.selectedFiles = e.target.files;
    let myData = [];
    /*for(var x = 0; x<e.target.files.length; x++) {
        let obj = {
          "FileName":e.target.files[x].name,
          "upload":"0"
        }
        myData.push(obj)
      }
      this.setState({uplddata:myData})*/

    for (var x = 0; x < e.target.files.length; x++) {
      var date = new Date(); // Now
      date.setDate(date.getDate() + 30);
      console.log("data fo file", e.target.files[x]);
      let obj = {
        FileName: e.target.files[x].name,
        expDate: date,
        FileSize: e.target.files[x].size,
        upload: "0",
      };
      myData.push(obj);
    }
    this.setState({ fileUplaodLoding: false });
    this.setState({ uplddata: myData });
  }

  ////new methods

  getResUploadFileOnServer(fileData) {
    return postData("UploadfilesOnserver/Uploadfile", fileData);
  }

  uploadMultiFiles() {
    if (this.state.uplddata.length > 0) {
      if (this.state.fileUplaodLoding == false) {
        let isADcheck = false;
        this.setState({ fileUplaodLoding: true });
        let ContractID = -1;
        var tempArr = [];
        tempArr = this.state.uplddata;
        for (var i = 0; i < tempArr.length; i++) {
          if (tempArr[i].ContentFileTypeID == "1") {
            if (tempArr[i].ContractID) {
              if (
                tempArr[i].ContractID == null ||
                tempArr[i].ContractID == ""
              ) {
                isADcheck = true;
              }
            } else {
              isADcheck = true;
            }
          }
        }
        if (isADcheck) {
          alert("is check");
          var msg =
            "All ad files must have a Contract #. Please enter a Contract # and try to upload the file again";
          this.setState({
            upLoadvalidMsg: true,
            dlgtitle: "Information",
            message: msg,
            dlgType: "information",
          });
          this.setState({ fileUplaodLoding: false });
        } else {
          //this.setState({})
          var fileList = [];
          const fileData = new FormData();
          for (var x = 0; x < this.state.selectedFiles.length; x++) {
            fileList.push(this.state.selectedFiles[x]);
          }
          Promise.all(
            fileList.map(async (file) => {
              const fileData = new FormData();
              fileData.append("file", file);
              const uploadfiledata = await this.getResUploadFileOnServer(
                fileData
              );
              return uploadfiledata;
            })
          ).then((results) => {
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
            this.setState({ uplddata: fileDataArr });
            let self = this;
            //setTimeout(function () {
            self.upDateFiles();
            //},500)
          });
        }
      }
    } else {
      this.setState({
        dlgtitle: "Information",
        message: "Please select file..",
        dlgType: "information",
        upLoadvalidMsg: true,
      });
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
      });
    }
    //tempArr = this.state.uplddata;
    let pFileUpload = [];

    if (tempArr && tempArr.length > 0) {
      for (var i = 0; i < tempArr.length; i++) {
        var obj = new Object();
        obj.FileID = 0;
        obj.FileName = tempArr[i].FileName;
        obj.strExpDate = tempArr[i].expDate; //"Fri Dec 4 2020";
        obj.FileType = 0;
        obj.OwnerID = tempArr[i].OwnerID;
        obj.ContentFileTypeID = tempArr[i].ContentFileTypeID;
        obj.Impressions = tempArr[i].Impression;
        obj.FileSize = tempArr[i].FileSize;
        if (tempArr[i].Tag) {
          obj.Tag = tempArr[i].Tag;
        } else {
          obj.Tag = "";
        }
        obj.ContractID = tempArr[i].ContractID;
        if (userID) {
          obj.UserID = userID;
        } else {
          obj.UserID = 0;
        }
        pFileUpload.push(obj);
      }
    } else {
      this.setState({ fileUplaodLoding: false });
    }

    var postobj = {
      operationCode: 0,
      pFileUpload: pFileUpload,
    };
    console.log("uplodat file update data", postobj);
    postData("FileUpload/Update", postobj).then((res) => {
      this.setState({ fileUplaodLoding: false });
      if (res.data && res.data.ReturnCode === 0) {
        this.setState(
          {
            dlgtitle: "Information",
            message: "File Uploaded Successfully",
            dlgType: "information",
            dlgEnable: true,
            upload: false,
            uplddata: [],
            selectedFiles: [],
            systProgCnt: 0,
            uplddata: [],
            expDate: this.comnExpDate,
          },
          () => this.getRecords()
        );
        //this.getAvailbleMediafiles();
      } else {
        this.setState({
          dlgtitle: "Information",
          message: "Failed please try upload again",
          dlgType: "information",
          dlgEnable: true,
          upload: false,
          uplddata: [],
          selectedFiles: [],
        });
      }
    });
  }

  ////

  upLoadFiles() {
    const fileData = new FormData();
    for (var x = 0; x < this.state.selectedFiles.length; x++) {
      fileData.append("file", this.state.selectedFiles[x]);
    }
    console.log("call upLoadFiles");
    this.myInterval = setInterval(
      () => this.setState({ systProgCnt: this.state.systProgCnt + 10 }),
      1000
    );
    postData("UploadfilesOnserver/Uploadfile", fileData).then((res) => {
      clearInterval(this.myInterval);
      if (res.data && res.data.ReturnCode === 0) {
        this.upDateFiles(); //this.setState({dlgtitle:"Information",message:"File uploading",dlgType:"information",dlgEnable:true,upload:false,selectedFiles:[]},()=>this.upDateFiles())
      } else {
        this.setState({
          dlgtitle: "Information",
          message: "Failed please try upload again",
          dlgType: "information",
          dlgEnable: true,
          upload: false,
          uplddata: [],
          selectedFiles: [],
        });
      }
    });
  }

  upDateFilesold() {
    console.log("call upDateFiles", this.state.uplddata);
    var tempArr = [];
    tempArr = this.state.uplddata;
    let pFileUpload = [];
    if (tempArr && tempArr.length > 0) {
      for (var i = 0; i < tempArr.length; i++) {
        var obj = new Object();
        obj.FileID = 0;
        obj.FileName = tempArr[i].FileName;
        obj.strExpDate = tempArr[i].ExpDate; //"Fri Dec 4 2020";
        obj.FileType = 0;
        obj.OwnerID = tempArr[i].OwnerID;
        obj.ContentFileTypeID = tempArr[i].ContentFileTypeID;
        if (tempArr[i].Tag) {
          obj.Tag = tempArr[i].Tag;
        } else {
          obj.Tag = "";
        }
        obj.ContractID = tempArr[i].ContractID;
        if (userID) {
          obj.UserID = userID;
        } else {
          obj.UserID = 0;
        }
        pFileUpload.push(obj);
      }
    }
    var postobj = {
      operationCode: 0,
      pFileUpload: pFileUpload,
    };
    console.log("uplodat file update data", postobj);
    postData("FileUpload/Update", postobj).then((res) => {
      if (res.data && res.data.ReturnCode === 0) {
        this.setState(
          {
            dlgtitle: "Information",
            message: "File upload successfully",
            dlgType: "information",
            dlgEnable: true,
            upload: false,
            uplddata: [],
            systProgCnt: 100,
            selectedFiles: [],
          },
          () => this.getRecords()
        );
      } else {
        this.setState({
          dlgtitle: "Information",
          message: "Failed please try upload again",
          dlgType: "information",
          dlgEnable: true,
          upload: false,
          uplddata: [],
          selectedFiles: [],
        });
      }
    });
  }

  selectFile(id, type) {
    let index = this.state.deleteFile.indexOf(id);
    if (index > 0) {
      this.state.deleteFile.splice(index, 1);
    } else {
      if (
        type === "grid" &&
        this.state.deleteFile &&
        this.state.deleteFile.length > 0
      ) {
        this.state.deleteFile.splice(0, 1);
      }
      this.state.deleteFile.push(id);
    }
  }

  deleteFile(type) {
    if (this.state.deleteFile && this.state.deleteFile.length === 0) {
      this.setState({
        dlgtitle: "Information",
        message: "Select Files",
        dlgType: "information",
        dlgEnable: true,
      });
    } else if (type === "Confirm") {
      this.setState({
        dlgtitle: "Confirmation",
        message: "Are you sure?",
        dlgType: "confirmation",
        dlgEnable: true,
      });
    } else {
      postData("FileUpload/DeleteFile", this.state.deleteFile).then((res) => {
        if (res.data && res.data.ReturnCode === 0) {
          this.setState({
            dlgtitle: "Information",
            message: "Deleted Successfully",
            dlgType: "information",
            dlgEnable: true,
          });
        } else {
          this.setState({
            dlgtitle: "Information",
            message: "Something went wrong please try again.",
            dlgType: "information",
            dlgEnable: true,
          });
        }
      });
    }
  }
  downloadfile(fileName) {
    var ext = fileName.substr(0, fileName.lastIndexOf("."));
    window.open(
      sessionStorage.getItem("mktUrl") + "api/" + "DownloadFiles/GetFile/" + ext
    );
  }
  showPreview(Url) {
    //Url = "https://localhost:44307/EmulationFiles\\avitestdd.mp4";
    this.setState({
      dlgtitle: "Preview",
      message: Url,
      dlgType: "media",
      dlgEnable: true,
    });
  }
  getThumnail(url) {
    var ext = url.substr(0, url.lastIndexOf("."));
    ext = ext + ".jpg";
    return ext;
  }
  getthumbClass(ContentFileTypeID) {
    if (ContentFileTypeID == 3) {
      return "media_thumb_h";
    } else if (ContentFileTypeID == 2) {
      return "media_thumb_v";
    } else if (ContentFileTypeID == 4) {
      return "media_thumb";
    } else {
      return "media_thumb";
    }
  }
  filterByFileName(value) {
    if (value != "") {
      console.log("data is ", this.state.data);
      if (this.state.backData && this.state.backData.length > 0) {
        let tempArr = [];
        let searchTag = this.state.searchTag;
        this.state.backData.forEach(function (item) {
          if (searchTag) {
            if (
              item.Tag.toUpperCase().includes(searchTag.toUpperCase()) &&
              item.FileName.toUpperCase().includes(value.toUpperCase())
            ) {
              tempArr.push(item);
            }
          } else {
            if (item.FileName.toUpperCase().includes(value.toUpperCase())) {
              tempArr.push(item);
            }
          }
        });
        this.setState({ data: tempArr, searchFilename: value });
        //console.log("tempArr",tempArr)
      }
    } else {
      let searchTag = this.state.searchTag;
      if (searchTag) {
        let tempArr = [];
        this.state.backData.forEach(function (item) {
          if (item.Tag.toUpperCase().includes(searchTag.toUpperCase())) {
            tempArr.push(item);
          }
        });
        this.setState({ data: tempArr });
      } else {
        this.setState({ data: this.state.backData });
      }
    }
    console.log("on key value", value);
  }
  filterByTag(value) {
    if (value != "") {
      console.log("data is ", this.state.data);
      if (this.state.backData && this.state.backData.length > 0) {
        let tempArr = [];
        let searchFilename = this.state.searchFilename;
        this.state.backData.forEach(function (item) {
          if (searchFilename) {
            if (
              item.FileName.toUpperCase().includes(
                searchFilename.toUpperCase()
              ) &&
              item.Tag.toUpperCase().includes(value.toUpperCase())
            ) {
              tempArr.push(item);
            }
          } else {
            if (item.Tag.toUpperCase().includes(value.toUpperCase())) {
              tempArr.push(item);
            }
          }
        });
        this.setState({ data: tempArr, searchTag: value });
        //console.log("tempArr",tempArr)
      }
    } else {
      let searchFilename = this.state.searchFilename;
      if (searchFilename) {
        let tempArr = [];
        this.state.backData.forEach(function (item) {
          if (
            item.FileName.toUpperCase().includes(searchFilename.toUpperCase())
          ) {
            tempArr.push(item);
          }
        });
        this.setState({ data: tempArr });
      } else {
        this.setState({ data: this.state.backData });
      }
    }
    console.log("on key value", value);
  }

  _onMouseMove(e) {
    //this.setState({ x: e.screenX, y: e.screenY });
    //console.log("windoe with",window.innerWidth);
    //console.log("windoe with",window.innerHeight);

    let highLeft = window.innerWidth / 2 + 20;
    let highTop = window.innerHeight / 2 + 20;
    let screenSection = 1;
    if (e.screenX <= highLeft && e.screenY <= highTop) {
      screenSection = 1;
    } else if (e.screenX <= highLeft && e.screenY > highTop) {
      screenSection = 2;
    } else if (e.screenX > highLeft && e.screenY > highTop) {
      screenSection = 3;
    } else if (e.screenX > highLeft && e.screenY <= highTop) {
      screenSection = 4;
    }
    console.log(
      e.screenX + "====" + highLeft + "==" + e.screenY + "==" + highTop
    );
    console.log("section ", screenSection);
    this.setState({ screenSection: screenSection });
  }

  getSectionClass() {
    if (this.state.screenSection == 2) {
      return "screenSection_2";
    } else if (this.state.screenSection == 3) {
      return "screenSection_3";
    } else if (this.state.screenSection == 4) {
      return "screenSection_4";
    } else {
      return "screenSection_1";
    }
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
                onClick={() => this.setTab(index, key)}
                key={index}
              >
                {key}
              </div>
            ))}
        </div>
        {this.state.upload ? (
          <div className="Loader">
            {this.state.fileUplaodLoding && (
              <div className="fileuploadLoading">
                <img src={require("../../../Assets/Images/kOnzy.gif")}></img>
              </div>
            )}
            <div
              id="mediaMainDiv"
              ref="myImgContainer"
              className="MediaUpldMainWrp"
            >
              <div className="ForgPassTitle">File Upload</div>
              <input
                type="file"
                accept={this.uploadFileExt}
                style={{ display: "none" }}
                ref="fileUploader"
                onChange={(e) => {
                  this.setState({ fileUplaodLoding: true });
                  this.onFileChange(e);
                }}
                multiple
              ></input>
              <img
                src={require("../../../Assets/Images/Media/select-files.png")}
                className="MeadiaUpldSlFl"
                onClick={() => this.refs.fileUploader.click()}
              ></img>
              <ReactTable
                columns={this.upColumns}
                data={this.state.uplddata}
                showPagination={false}
                sortable={false}
                NoDataComponent={() => null}
                style={{ height: "250px" }}
              />
              <div className="MediaFlUpldBtm">
                <img
                  src={require("../../../Assets/Images/Media/upload-btn-popup.png")}
                  className="MediaFlupBtn"
                  onClick={() => this.uploadMultiFiles()}
                ></img>
                <img
                  src={require("../../../Assets/Images/Login/cancel-btn.png")}
                  className="MediaFlupBtn"
                  onClick={() =>
                    this.setState({
                      fileUplaodLoding: false,
                      upload: false,
                      uplddata: [],
                      selectedFiles: [],
                      upLoadvalidMsg: false,
                    })
                  }
                ></img>
              </div>
              {this.state.upLoadvalidMsg == true ? (
                <Dialog
                  title={this.state.dlgtitle}
                  message={this.state.message}
                  onOk={() => this.setState({ upLoadvalidMsg: false })}
                  onHide={() => this.setState({ upLoadvalidMsg: false })}
                />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          this.state.dlgEnable && (
            <Dialog
              title={this.state.dlgtitle}
              message={this.state.message}
              onOk={() =>
                this.setState({ dlgEnable: false }, () => {
                  if (this.state.dlgType === "confirmation") {
                    this.deleteFile();
                  }
                })
              }
              onCancel={() => this.setState({ dlgEnable: false })}
              onHide={() => this.setState({ dlgEnable: false })}
              type={this.state.dlgType}
            ></Dialog>
          )
        )}
        <div className="TableBorder">
          {this.state.columnSt && (
            <ColumnStatus
              data={this.state.columns}
              onChange={(e) => this.setColumn(e, "columns")}
              class={"SchedColumnHideWrp"}
              onClose={(e) => this.resetColmn(e, "columns")}
            ></ColumnStatus>
          )}
          <div className="ScheduleTabToolWrp">
            <div className="MediaFltWrp">
              <div className="MediaFltWrp1">
                <div className="SchedHeadTxt">Upload Date From</div>
                <DatePicker
                  selected={new Date(this.state.strDate)}
                  onChange={(date) => this.setState({ strDate: date })}
                  wrapperClassName="DatePickWrp"
                  className="DatePickInptWrp"
                  popperPlacement="right-start"
                ></DatePicker>
                <div className="SchedHeadTxt">To</div>
                <DatePicker
                  selected={this.state.endDate}
                  onChange={(date) => this.setState({ endDate: date })}
                  wrapperClassName="DatePickWrp"
                  className="DatePickInptWrp"
                  popperPlacement="right-start"
                ></DatePicker>
                <div className="SchedHeadTxt">Expiry</div>
                <select
                  className="DropDwn1"
                  onChange={(e) => this.setState({ expiry: e.target.value })}
                  value={this.state.expiry}
                >
                  <option value="-1">All</option>
                  <option value="0">Non-expired</option>
                  <option value="1">Expired</option>
                </select>
                <img
                  src={require("../../../Assets/Images/Filter/apply-filter.png")}
                  className="ScheduleupldImg"
                  onClick={() =>
                    this.setState({ loading: true }, () => this.getRecords())
                  }
                ></img>
              </div>
              {this.state.grid && (
                <div className="MediaFltWrp1">
                  <div className="SchedHeadTxt">Uploaded By</div>
                  <select
                    className="DropDwn1"
                    onChange={(e) => this.setFields(e.target.value, "status")}
                    value={this.state.status}
                  >
                    <option value="-1">All</option>
                  </select>
                  <div className="SchedHeadTxt">File Name</div>
                  <input
                    style={{ marginLeft: "2px" }}
                    onKeyUp={(e) => this.filterByFileName(e.target.value)}
                  ></input>
                  <div className="SchedHeadTxt" style={{ marginLeft: "1%" }}>
                    Tags
                  </div>
                  <input
                    style={{ marginLeft: "2px" }}
                    onKeyUp={(e) => this.filterByTag(e.target.value)}
                  ></input>
                </div>
              )}
            </div>
            <div className="MadiaToolBtnContent">
              {this.state.grid ? (
                <img
                  src={require("../../../Assets/Images/Media/tableView.png")}
                  className="MeaiaUpldImg1"
                  onClick={() => this.setState({ grid: false, deleteFile: [] })}
                ></img>
              ) : (
                <img
                  src={require("../../../Assets/Images/Media/grid.png")}
                  className="MeaiaUpldImg1"
                  onClick={() => this.setState({ grid: true, deleteFile: [] })}
                ></img>
              )}
              <img
                src={require("../../../Assets/Images/Upload/upload-btn.png")}
                className="MeaiaUpldImg"
                onClick={() => this.setState({ upload: true })}
              ></img>
              <img
                src={require("../../../Assets/Images/Media/delete.png")}
                className="MeaiaUpldImg"
                onClick={() => this.deleteFile("Confirm")}
              ></img>
            </div>
          </div>
          {this.state.grid ? (
            <div
              className="MediFlMainWrp"
              onMouseMove={this._onMouseMove.bind(this)}
            >
              {this.state.data &&
                this.state.data.map((key, index) => {
                  return (
                    <div
                      className={
                        this.state.activeFile === index
                          ? "MediaFlWrp1"
                          : "MediaFlWrp"
                      }
                      onClick={() =>
                        this.setState({ activeFile: index }, () =>
                          this.selectFile(key.FileID, "grid")
                        )
                      }
                      key={index}
                    >
                      {/*<img src="data:image/jpeg;base64,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" className="MediaFlImgWrp"></img>*/}
                      <div class="tooltip1">
                        <div className="media_thumb_caontainer">
                          <img
                            className={this.getthumbClass(key.ContentTypeID)}
                            src={this.getThumnail(key.WebVisibleURL)}
                          ></img>
                        </div>
                        <div
                          className={"tooltiptext1  " + this.getSectionClass()}
                        >
                          <div className="detailHead">File Details</div>
                          <div>
                            <hr />
                          </div>
                          <div>
                            <div className="detailsMian">
                              <div className="detailRow">
                                <div className="detailcol_1">Ziped name:</div>
                                <div className="detailcol_2">
                                  {key.FileName}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">File name:</div>
                                <div className="detailcol_2">
                                  {key.TempName}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">
                                  Content File Type:
                                </div>
                                <div className="detailcol_2">
                                  {key.ContentFileType}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">Path:</div>
                                <div className="detailcol_2">
                                  {key.PathLocation}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">File Size:</div>
                                <div className="detailcol_2">
                                  {key.FileSize}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">Tags:</div>
                                <div className="detailcol_2">{key.Tag}</div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">upLoad Date:</div>
                                <div className="detailcol_2">
                                  {moment(key.Dated).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                  )}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">Date Created:</div>
                                <div className="detailcol_2">
                                  {moment(key.FileDate).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                  )}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">Expiry Date:</div>
                                <div className="detailcol_2">
                                  {moment(key.ExpDate).format(
                                    "DD-MM-YYYY HH:mm"
                                  )}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">Length(Sec):</div>
                                <div className="detailcol_2">{key.Length}</div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">Contract:</div>
                                <div className="detailcol_2">
                                  {key.ContractID}
                                </div>
                              </div>
                              <div className="detailRow">
                                <div className="detailcol_1">Impressions:</div>
                                <div className="detailcol_2">
                                  {key.Impressions}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <span className="MediaFlTitle">{key.TempName}</span>
                      <div className="MediaFlBtmWrp">
                        <a heref={key.WebVisibleURL} download>
                          <img
                            src={require("../../../Assets/Images/Media/download.jpg")}
                            className="MediaFlIcon1"
                            onClick={() => this.downloadfile(key.TempName)}
                          ></img>
                        </a>
                        {key.ContentTypeID === 1 ? (
                          <img
                            src={require("../../../Assets/Images/Media/video-preview.png")}
                            onClick={() => this.showPreview(key.WebVisibleURL)}
                            className="MediaFlIcon"
                          ></img>
                        ) : (
                          <div className="tooltip">
                            <img
                              src={require("../../../Assets/Images/Media/image-preview.png")}
                              className="MediaFlIcon"
                              style={{ height: "15px", width: "20px" }}
                            ></img>
                            <span
                              className={
                                "tooltiptext " + this.getSectionClass()
                              }
                            >
                              <img src={key.WebVisibleURL}></img>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              {this.state.mediaLoading && (
                <div className="medialoader">
                  <img
                    style={{ height: "80px" }}
                    src={require("../../../Assets/Images/kOnzy.gif")}
                  ></img>
                </div>
              )}
            </div>
          ) : (
            <ReactTable
              data={this.state.data}
              loading={this.state.loading}
              columns={this.state.columns}
              NoDataComponent={() => null}
              showPagination={false}
              extradata={this.state}
              filtered={this.state.filtered}
              sortable={false}
              style={{
                height: "380px", //
              }}
              getTheadFilterProps={(state, rowInfo, column, instance) => {
                return {
                  style:
                    this.state.visibleFilters.length === 0
                      ? { display: "none" }
                      : null,
                };
              }}
              getTheadFilterThProps={(state, rowInfo, column, instance) => {
                return {
                  className:
                    this.state.visibleFilters.indexOf(column.id) < 0
                      ? "hiddenFilter"
                      : null,
                };
              }}
            />
          )}
        </div>
      </div>
    );
  }
}
