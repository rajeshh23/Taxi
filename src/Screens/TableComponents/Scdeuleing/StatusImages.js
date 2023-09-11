import React, { Component } from "react";
import "../../../Assets/StyleSheet.css";
import ReactTable from "react-table";
import "../../../Assets/react-table.css";
import { getData, postData, putData } from "../../../Services/MainServices";
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import axios from "axios";
import Pagination from "../../CommomComponents/Pagination";
import ComCheck from "../../CommomComponents/ComCheck";
import Dialog from "../../CommomComponents/Dialog";
import { DatePicker } from "antd";
import { Line } from "rc-progress";
import moment from "moment";

const ColumnCol = [
  { accessor: "Image_Type", lable: "Image Type" },
  { accessor: "Client_code", lable: "Client Code" },
  { accessor: "File_id", lable: "File Name" },
];
const flType = ["", "thank you", "shutoff"];
let userList = sessionStorage.getItem("userList");
const userID = sessionStorage.getItem("userID");

export default class StatusImages extends Component {
  addobj = {
    WebVisibleURL: "",
    FileName: "",
    VBannerName: "",
  };
  uploadFileExt = ".wmv,.jpg,.jpeg,.gif,.png,.swf";
  filterType = "";
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {
      columns: [],
      data: [],
      columnSt: false,
      filtered: [],
      filter: -1,
      tabIndex: 0,
      loading: true,
      filterc: false,
      filterVal: [],
      visibleFilters: [],
      userName: "",
      email: "",
      fName: "",
      lName: "",
      grpName: "MANAGER",
      status: "0",
      message: "",
      dlgtitle: "",
      dlgType: "",
      dlgEnable: false,
      delete: [],
      rowInfo: [],
      userList: [],
      imageType: "",
      clientType: "",
      schedVal: false,
      dlgtitle: "",
      message: "",
      fileUplaodLoding: false,
      loadFile: false,
      uploadby: -1,
      tags: "",
      searchbyFile: "",
      loadFileData: [],
      clientData: ["cc1", "cc2"],
      uplddata: [],
      upload:false,
    };
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
              percent={props.original.progress}
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

  componentDidMount() {
    if (userList) {
      try {
        userList = JSON.parse(userList);
        this.setState({ userList: userList });
      } catch (err) {
        this.setState({ userList: [] });
      }
    } else {
      this.setState({ userList: [] });
    }

    document.addEventListener("mousedown", this.handleClickOutside);
    let dColumn = [];
    let sColumn = [];
    let obj = {
      Header: "#",
      Cell: (rowInfo) => (
        <ComCheck
          //   onChange={(e) => this.setDelete(e, rowInfo)}
          containerStyle={"ComCheckMainWrp"}
          tickStyle={"SchedCheckTick"}
        ></ComCheck>
      ), // Custom cell components!
      width: 25,
    };
    dColumn.push(obj);
    ColumnCol.map((key, index) => {
      this.state.filterVal.push("");
      let obj;
      if (key.accessor === "Image_Type") {
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
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
                <div className="FiltreWrp">
                  <input
                    className="SchedFiltInptWrp"
                    onChange={(e) =>
                      this.customFilerChange(
                        cellInfo.column.id,
                        e.target.value,
                        index
                      )
                    }
                    value={this.state.filterVal[index]}
                  ></input>
                </div>
              )}
            </div>
          ),
          Cell: (rowInfo) => <span>{flType[rowInfo.original.Image_Type]}</span>,
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
          Filter: (cellInfo) => (
            <div>
              {this.state.visibleFilters.indexOf(cellInfo.column.id) >= 0 && (
                <div className="FiltreWrp">
                  <input
                    className="SchedFiltInptWrp"
                    onChange={(e) =>
                      this.customFilerChange(
                        cellInfo.column.id,
                        e.target.value,
                        index
                      )
                    }
                    value={this.state.filterVal[index]}
                  ></input>
                </div>
              )}
            </div>
          ),
        };
      }
      dColumn.push(obj);
    });
    this.setState({ columns: dColumn }, () => {
      this.getRecord();
      this.getAvailbleMediafiles();
    });
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

  deleteRow(rowInfo) {
    let data1 = [];
    for (let i = 0; i < this.state.uplddata.length; i++) {
      if (i !== rowInfo.index) {
        data1.push(this.state.uplddata[i]);
      }
    }

    this.setState({ uplddata: data1 });
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
          var temArr1 = this.state.uplddata;
          Promise.all(
            fileList.map(async (file, index) => {
              const fileData = new FormData();
              fileData.append("file", file);
              temArr1[index]["progress"] = 20;
              this.setState({ uplddata: temArr1 });
              const uploadfiledata = await this.getResUploadFileOnServer(
                fileData
              );
              temArr1[index]["progress"] = 100;
              console.log("this.state.uplddata", this.state.temArr1);
              this.setState({ uplddata: temArr1 });
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

  getResUploadFileOnServer(fileData) {
    return postData("UploadfilesOnserver/Uploadfile", fileData);
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
        this.setState({
          dlgtitle: "Information",
          message: "File Uploaded Successfully",
          dlgType: "information",
          schedVal: true,
          upload: false,
          uplddata: [],
          selectedFiles: [],
          systProgCnt: 0,
          uplddata: [],
          expDate: this.comnExpDate,
        });

        this.getAvailbleMediafiles();
      } else {
        this.setState({
          dlgtitle: "Information",
          message: "Failed please try upload again",
          dlgType: "information",
          schedVal: true,
          upload: false,
          uplddata: [],
          selectedFiles: [],
        });
      }
    });
  }

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
        var msg =
          "All ad files must have a Contract #. Please enter a Contract # and try to upload the file again";
        this.setState({
          upLoadvalidMsg: true,
          dlgtitle: "Information",
          message: msg,
          dlgType: "information",
        });
      } else {
        const fileData = new FormData();
        for (var x = 0; x < this.state.selectedFiles.length; x++) {
          fileData.append("file", this.state.selectedFiles[x]);
        }
        this.myInterval = setInterval(
          () => this.setState({ systProgCnt: this.state.systProgCnt + 1 }),
          200
        );
        postData("UploadfilesOnserver/Uploadfile", fileData).then((res) => {
          clearInterval(this.myInterval);
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
                schedVal: true,
                upload: false,
                uplddata: [],
                selectedFiles: [],
              });
            } else {
              this.setState({
                dlgtitle: "Information",
                message: "Failed please try upload again",
                dlgType: "information",
                schedVal: true,
                upload: false,
                uplddata: [],
                selectedFiles: [],
              });
            }

            //this.setState({dlgtitle:"Information",message:"Failed please try upload again",dlgType:"information",dlgEnable:true,upload:false,uplddata:[],selectedFiles:[]})
          }
        });
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
  
  getRecord() {
    console.log("call get record ");
    this.setState({ data: [], loading: true });
    postData("GroupADSFL/GetImgList").then((res) => {
      if (res && res.data && res.data.ResponseCollection) {
        if (res.data.ResponseCollection.length > 0) {
          res.data.ResponseCollection.forEach(function (item) {
            if (item.StatusID == 1) {
              item.StatusID = "Inactive";
            } else {
              item.StatusID = "Active";
            }
          });
          res.data.TotalcountOfItems = res.data.ResponseCollection.length;
        }
        this.setState({
          data: res.data.ResponseCollection,
          totalCnt: res.data.TotalcountOfItems,
          filterCnt: res.data.FilteredCount,
          loading: false,
        });
      } else {
        this.setState({ data: [], loading: false });
      }
    });
  }
  setGroupInf(rowInfo) {
    if (rowInfo) {
      this.addobj['FILEID'] = rowInfo.original["File_id"]

      this.setState(
        {
          clientType: rowInfo.original["Client_code"],
          imageType: rowInfo.original["Image_Type"],
          rowInfo: rowInfo.original,
          dlgEnable : true
        },
        () => {
          console.log(this.state);
        }
      );
    }
  }
  AddImageFile() {
    let msg = "";
    if (!this.addobj.WebVisibleURL) {
      msg = "Please add image file";
    } else if (!this.state.imageType) {
      msg = "Please select image type";
    }
    if (!msg) {
      let obj = {
        pImgData: [
          {
            ID: "1",
            File_id: this.addobj.FILEID,
            Client_code: this.state.clientType,
            Image_Type: this.state.imageType,
          },
        ],
        operationCode: "0",
      };
      postData("GroupADSFL/ImgSet", obj)
        .then((resp) => {
          console.log(resp);
          msg = "Added Successfully";
          this.setState({
            message: msg,
            dlgtitle: "Information",
            schedVal: true,
            dlgEnable: false,
          });
          this.getRecord();
        })
        .catch(() => {
          console.log("Error");
        });
    } else {
      this.setState({
        message: msg,
        dlgtitle: "Information",
        schedVal: true,
      });
    }
  }
  filterMedia(type, value, serachby) {
    let UploadedBy = this.state.uploadby;
    let FilteredBackupFileList = [];
    let uploadByArray = [];
    let filenamesArray = [];
    let tagArray = [];
    let searchbyFile = this.state.searchbyFile;
    let searchTag = this.state.tags;
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
              if (
                item.Tag.toUpperCase().includes(searchTag.toUpperCase()) &&
                item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())
              ) {
                filenamesArray.push(item);
              }
            } else {
              if (
                item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())
              ) {
                filenamesArray.push(item);
              }
            }
          });
        }
      } else if (serachby == "tag" || serachby == "uploadedBy") {
        FilteredBackupFileList = uploadByArray;
        if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
          FilteredBackupFileList.forEach(function (item) {
            if (searchbyFile) {
              if (
                item.Tag.toUpperCase().includes(searchTag.toUpperCase()) &&
                item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())
              ) {
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
        filenamesArray = uploadByArray;
      }

      this.setState({ loadFileData: filenamesArray });
    } else {
      uploadByArray = this.state.filteredBackFileList;
      if (serachby == "file" || serachby == "uploadedBy") {
        FilteredBackupFileList = uploadByArray;
        if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
          FilteredBackupFileList.forEach(function (item) {
            if (searchTag) {
              if (
                item.Tag.toUpperCase().includes(searchTag.toUpperCase()) &&
                item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())
              ) {
                filenamesArray.push(item);
              }
            } else {
              if (
                item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())
              ) {
                filenamesArray.push(item);
              }
            }
          });
        }
      } else if (serachby == "tag" || serachby == "uploadedBy") {
        FilteredBackupFileList = uploadByArray;
        if (FilteredBackupFileList && FilteredBackupFileList.length > 0) {
          FilteredBackupFileList.forEach(function (item) {
            if (searchbyFile) {
              if (
                item.Tag.toUpperCase().includes(searchTag.toUpperCase()) &&
                item.FileName.toUpperCase().includes(searchbyFile.toUpperCase())
              ) {
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
        filenamesArray = uploadByArray;
      }
      this.setState({ loadFileData: filenamesArray });
    }
  }
  resetFlDetails() {
    this.setState({ imageType: "", dlgEnable: false });
    this.addobj = {
      VBannerName: "",
      FileName: "",
    };
  }
  setschedLoadFiles() {
    this.addobj.VBannerName = "";
    this.addobj.FileName = "";
    this.state.imageType = "";
    this.state.clientType = "";
  }
  getAvailbleMediafiles() {
    let obj = {
      startIndex: 0,
      count: 0,
      criteria: [],
    };
    postData("FileUpload/Fetch", obj).then((res) => {
      if (res.data && res.data.ResponseCollection) {
        console.log("avail file data", res.data.ResponseCollection);
        this.setState({ loadFileData: res.data.ResponseCollection });
        this.setState({ loadFileBackupData: res.data.ResponseCollection });
        let micrositeArray = [];
        if (
          res.data.ResponseCollection &&
          res.data.ResponseCollection.length > 0
        ) {
          res.data.ResponseCollection.forEach(function (item) {
            if (item.ContentTypeID == 4) {
              micrositeArray.push(item);
            }
          });
          this.setState({ micrositeList: micrositeArray });
          console.log("microsite list", micrositeArray);
        }
      }
    });
  }
  getThumnail(url) {
    //console.log("thumnail ulr is",url);
    if (url) {
      //   var ext = url.substr(0, url.lastIndexOf("."));
      var correctedUrl = url.replace(/\\/g, "/");
      //   ext = ext + ".jpg";
      return correctedUrl;
    } else {
      return "";
    }
  }
  setLoadFile(data) {
    this.addobj.WebVisibleURL = data.WebVisibleURL;
    this.addobj.VBannerName = data.TempName;
    this.addobj.FileName = data.TempName;
    /*if(data.Banner2){
            this.state.flEditData.Banner1=data.Banner2
          }*/
    this.addobj["FILEID"] = data.FileID;
    this.setState({ loadFile: false });
  }
  loadFiles(type, type1) {
    this.filterType = type;
    this.filterType1 = type1;
    let BackupFileList = [];
    BackupFileList = this.state.loadFileBackupData;
    let filterList = [];
    if (BackupFileList && BackupFileList.length > 0) {
      BackupFileList.forEach(function (item) {
        if (item.ContentTypeID == type) {
          filterList.push(item);
        }
      });
      filterList.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.Dated) - new Date(a.Dated);
      });
    }
    this.setState({
      loadFileData: filterList,
      loadFile: true,
      filteredBackFileList: filterList,
    });
    console.log("load data", this.state.loadFileData);
  }
  onFileChange(e) {
    this.state.selectedFiles = e.target.files;
    let myData = [];

    for (var x = 0; x < e.target.files.length; x++) {
      var date = new Date(); // Now
      date.setDate(date.getDate() + 30);
      let obj = {
        FileName: e.target.files[x].name,
        expDate: date,
        upload: "0",
        FileSize: e.target.files[x].size,
      };
      myData.push(obj);
    }
    this.setState({ fileUplaodLoding: false });
    this.setState({ uplddata: myData });
  }
  render() {
    return (
      <>
        {this.state.dlgEnable && (
          <div className="Loader">
            <div className="SchedBnrWrp" draggable={true}>
              <div className="ForgPassTitle ShedTitle">
                <div style={{ width: "96%" }}>Media Scheduling</div>
                <div className="ShedHide" onClick={() => this.resetFlDetails()}>
                  X
                </div>
              </div>

              <div className="SchedEdtFileTopWrp">
                <div
                  className="SchedEdtFileTopChild"
                  onClick={() => this.loadFiles(4, "Vbanner", "Bsched")}
                  style={{ cursor: "pointer" }}
                >
                  <span className="SchedBnrPopImgTypetxt">File *</span>
                  {this.addobj && this.addobj.WebVisibleURL ? (
                    <div>
                      <div className="SchedBnrpopImgWrp">
                        <img
                          src={this.getThumnail(this.addobj.WebVisibleURL)}
                          className="SchedBnrpopImg_V"
                        ></img>
                        <div className="SchedBnrpopImgOvrWrp">
                          <img
                            src={require("../../../Assets/Images/Group/delete-over.png")}
                            className="SchedGrpTableToolImg4"
                            onClick={(e) => {
                              e.stopPropagation();
                              this.setschedLoadFiles();
                            }}
                          ></img>
                        </div>
                      </div>
                      <span className="SchedBnrPopImgTypetxt1">
                        {this.addobj.VBannerName}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={require("../../../Assets/Images/images.jpg")}
                        className="SchedBnrpopImg"
                      ></img>
                      <span className="SchedBnrPopImgTypetxt1">
                        {this.addobj.VBannerName
                          ? this.addobj.VBannerName
                          : "No Image"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="SchedBnrPopImgWrp2">
                <div className="leftDiv-md2">
                  <span
                    className="SchedBnrPopTxt"
                    style={{ paddingRight: "5px" }}
                  >
                    Image Type *
                  </span>
                </div>
                <div className="RightDiv-md2">
                  <select
                    className="SchedDropDwn1"
                    onChange={(e) =>
                      this.setState({ imageType: e.target.value })
                    }
                    value={this.state.imageType}
                  >
                    <option value={0}></option>
                    {flType.map((key, index) => {
                      return (
                        index !== 0 && (
                          <option value={index} key={index}>
                            {key}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="SchedBnrPopImgWrp2" style={{ marginTop: 10 }}>
                <div className="leftDiv-md2">
                  <span
                    className="SchedBnrPopTxt"
                    style={{ paddingRight: "5px" }}
                  >
                    Client Code
                  </span>
                </div>
                <div className="RightDiv-md2">
                  <select
                    className="SchedDropDwn1"
                    onChange={(e) =>
                      this.setState({ clientType: e.target.value })
                    }
                    value={this.state.clientType}
                  >
                    <option value={0}></option>
                    {this.state.clientData.map((key, index) => {
                      return (
                        <option value={key} key={index}>
                          {key}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="SchedPopBtnWrp1">
                <img
                  style={{ paddingRight: "10px" }}
                  src={require("../../../Assets/Images/ok-btn.png")}
                  className=""
                  onClick={() => this.AddImageFile()}
                ></img>
                <img
                  src={require("../../../Assets/Images/Login/cancel-btn.png")}
                  className=""
                  onClick={() => this.resetFlDetails()}
                ></img>
                <div style={{ width: "7%" }}></div>
              </div>
            </div>
            {this.state.loadFile && (
              <div>
                <div className="SchedBnrWrp3">
                  <div className="ForgPassTitle">
                    Media Filter{" "}
                    <img
                      src={require("../../../Assets/Images/close.png")}
                      className="SchedColStClose"
                      style={{ marginLeft: "82%" }}
                      onClick={() => this.setState({ loadFile: false })}
                    ></img>
                  </div>
                  <div className="SchedBnrInptWrp">
                    <span
                      className="SchedBnrPopTxt"
                      style={{ marginLeft: "5%" }}
                    >
                      Uploaded By
                    </span>
                    <select
                      className="SchedDropDwn1"
                      onChange={(e) =>
                        this.setState({ uploadby: e.target.value }, () =>
                          this.filterMedia(
                            this.filterType,
                            this.state.uploadby,
                            "uploadedBy"
                          )
                        )
                      }
                      value={this.state.uploadby}
                    >
                      <option value="-1">ALL</option>
                      {this.state.userList.map((key, index) => {
                        return (
                          <option value={key.userId} key={index}>
                            {key.Name}
                          </option>
                        );
                      })}
                    </select>
                    <span
                      className="SchedBnrPopTxt"
                      style={{ marginLeft: "4%", marginTop: "3px" }}
                    >
                      Tags
                    </span>
                    <input
                      style={{ marginTop: "3px" }}
                      onChange={(e) => this.setState({ tags: e.target.value })}
                      onKeyUp={(e) =>
                        this.filterMedia(this.filterType, e.target.value, "tag")
                      }
                      value={this.state.tags}
                    ></input>
                  </div>
                  <div className="SchedBnrInptWrp">
                    <span
                      className="SchedBnrPopTxt"
                      style={{ marginLeft: "8%", marginTop: "3px" }}
                    >
                      File Name
                    </span>
                    <input
                      style={{ marginTop: "3px" }}
                      onChange={(e) =>
                        this.setState({ searchbyFile: e.target.value })
                      }
                      onKeyUp={(e) =>
                        this.filterMedia(
                          this.filterType,
                          e.target.value,
                          "file"
                        )
                      }
                      value={this.state.searchbyFile}
                    ></input>
                  </div>
                  <div className="SchedLodFlWrp">
                    {this.state.loadFileData &&
                      this.state.loadFileData.map(
                        (key, index) =>
                          key.ContentTypeID === this.filterType && (
                            <div
                              key={index}
                              className="SchedLodFlChildWrp"
                              onDoubleClick={() => this.setLoadFile(key)}
                            >
                              {key.ContentTypeID}
                              <img
                                src={this.getThumnail(key.WebVisibleURL)}
                                className={
                                  key.ContentTypeID === 2
                                    ? "MediaFlImgWrp2"
                                    : key.ContentTypeID === 3
                                    ? "MediaFlImgWrp3"
                                    : "MediaFlImgWrp"
                                }
                              ></img>
                              <span className="MediaFlTitle">
                                {key.TempName}
                              </span>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>
            )}
            
            
          </div>
        )}
        {this.state.schedVal && (
              <Dialog
                title={this.state.dlgtitle}
                message={this.state.message}
                onOk={() => this.setState({ schedVal: false })}
                onHide={() => this.setState({ schedVal: false })}
              />
            )}
        {this.state.upload && (
              <div className="Loader">
                {this.state.fileUplaodLoding && (
                  <div className="fileuploadLoading">
                    <img
                      src={require("../../../Assets/Images/kOnzy.gif")}
                    ></img>
                  </div>
                )}

                <div className="MediaUpldMainWrp">
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
                    minRows={10}
                    defaultPageSize={10}
                    pageSize={this.state.uplddata.length}
                    NoDataComponent={() => null}
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
                </div>
              </div>
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
            <img
              src={require("../../../Assets/Images/Upload/upload-btn.png")}
              className="ScheduleupldImg"
              onClick={() => this.setState({ upload: true })}
            ></img>
            <img
              src={require("../../../Assets/Images/Schedule/add-banner.png")}
              className="ScheduleupldImg"
              onClick={() => this.setState({ dlgEnable: true })}
            ></img>
            <div className="ScheduleTableToolCont">
              {/*<img src={require('../../../Assets/Images/tools/filter-ico.png')} className="ScheduleToolImg"></img>*/}
              <img
                src={require("../../../Assets/Images/separator.png")}
                className="SchedTopCredSeprtr"
              ></img>
              <img
                src={require("../../../Assets/Images/tools/show-coloumn.png")}
                className="ScheduleToolImg"
                onClick={() =>
                  this.setState({ columnSt: !this.state.columnSt })
                }
              ></img>
              <img
                src={require("../../../Assets/Images/separator.png")}
                className="SchedTopCredSeprtr"
              ></img>
              <img
                src={require("../../../Assets/Images/tools/refresh.png")}
                className="ScheduleToolImg"
                onClick={() => this.getRecord()}
              ></img>
            </div>
          </div>
          <ReactTable
            data={this.state.data}
            loading={this.state.loading}
            columns={this.state.columns}
            NoDataComponent={() => null}
            PaginationComponent={Pagination}
            totlaItems={this.state.totalCnt}
            filterCnt={this.state.filterCnt}
            filtered={this.state.filtered}
            sortable={false}
            style={{
              height: "440px", //
            }}
            getTrGroupProps={(state, rowInfo, column, instance) => {
              return {
                onDoubleClick: (e, handleOriginal) => {
                  this.setGroupInf(rowInfo);
                },
              };
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
        </div>
      </>
    );
  }
}
