import React, { Component } from "react";
import "../../../Assets/StyleSheet.css";
import ReactTable from "react-table";
import "../../../Assets/react-table.css";
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import { Search } from "../../CommomComponents/Filters";
import { getData, postData } from "../../../Services/MainServices";
import Pagination from "../../CommomComponents/Pagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { ExportCSV } from "../../../Utility/ExportCSV.js";
import BaseUrl from "../../../Services/BaseUrl";
import { i } from "react-dom-factories";

const tabColumns = [
  [
    { accessor: "CabNumber", lable: "Cab Number" },
    { accessor: "UnitKey", lable: "IMSI" },
    { accessor: "TripID", lable: "Trip ID" },
    { accessor: "TripStart", lable: "Trip Start" },
    { accessor: "TripEnd", lable: "Trip End" },
    { accessor: "Pass_Num", lable: "Passengers" },
    { accessor: "DS", lable: "Distance" },
    { accessor: "Fare", lable: "Fare" },
  ],
  [],
  [
    { accessor: "ACTION", lable: "Action" },
    { accessor: "ACTIONCOUNT", lable: "Action Count" },
    { accessor: "TRIPCOUNT", lable: "Trip Count" },
  ],
  [
    { accessor: "ACTION", lable: "Action" },
    { accessor: "ACTIONCOUNT", lable: "Action Count" },
    { accessor: "TRIPCOUNT", lable: "Trip Count" },
  ],
];

const subColumns = [
  { accessor: "ACTION", lable: "Action" },
  { accessor: "LAT", lable: "LAT" },
  { accessor: "LONG", lable: "LONG" },
];

export default class PlayLogs extends Component {
  tem = [];
  tabsUrl = [
    "TripLog/GetTripLog",
    "TripLogStat/GetTripDataReport",
    "TripLogStat/GetClickReport",
    "TripLogStat/GetPacingReport",
  ];
  tabs = ["Play Log", "Trip Report", "Click Report", "Pricing Report"];
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      columns: [],
      data: [],
      columnSt: false,
      filtered: [],
      sty: { width: "30px", height: "0px" },
      filter: -1,
      filterVal: [],
      visibleFilters: [],
      tabIndex: 0,
      pageCount: 0,
      loading: true,
      filterCnt: 0,
      totalCnt: 0,
      strDate: new Date(),
      endDate: new Date(),
      subCol: [],
      subData: [],
      expanded: {},
      subLoading: false,
      dataObj: {
        TripStart:
          "01/" + moment().format("DD") + "/" + moment().format("YYYY"),
        TripEnd: new Date(),
        RowCountPerPage: "200",
        SortColumn: "AdsUseLogID",
        SortOrder: "1",
      },
      pageCount: 0,
      exportFileName: "exportPlayLog",
    };
  }

  componentDidMount() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    this.setState({ strDate: date }, () => {
      this.setTab(this.state.tabIndex);
    });
    this.setSubComponent();
    document.addEventListener("mousedown", this.handleClickOutside);
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

  setTab(index) {
    if (tabColumns && tabColumns[index]) {
      let dColumn = [];
      let sColumn = [];
      this.state.filterVal = [];
      this.state.filtered = [];
      tabColumns[index].map((key, index) => {
        this.state.filterVal.push("");
        let obj = {};
        if (key.accessor === "TripStart" || key.accessor === "TripEnd") {
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
                {this.gonvertDate(rowInfo.original[key.accessor])}
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
        }

        dColumn.push(obj);
      });
      if (index === 1) {
        this.setState({ columns: dColumn, tabIndex: index, loading: false });
      } else {
        this.setState(
          { columns: dColumn, tabIndex: index, loading: true },
          () => {
            if (this.state.tabIndex === 0) {
              this.refReactTable.fireFetchData();
            } else {
              let obj = {
                startDate: this.state.strDate,
                endDate: this.state.endDate,
              };

              postData(this.tabsUrl[this.state.tabIndex], obj).then((res) => {
                if (res && res.data && res.data.ResponseCollection) {
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
          }
        );
      }
    }
  }

  setTripLog(index) {
    let obj = {
      startDate: this.state.strDate,
      endDate: this.state.endDate,
    };
    this.setState({ tabIndex: index, loading: true });
    postData(this.tabsUrl[index], obj).then((res) => {
      if (res && res.data && res.data.ResponseCollection) {
        let dataObj1 = {};
        let dataObj2 = {};
        let myData = [];
        let colObj = {
          accessor: "TRIPCNT",
          lable: "Trip Count",
        };
        tabColumns[1].push(colObj);
        dataObj1["TRIPCNT"] = "METEROFF-TL";
        dataObj2["TRIPCNT"] = "METERON";

        for (let i = 0; i < res.data.ResponseCollection.length; i++) {
          let colObj = {
            accessor: res.data.ResponseCollection[i].StrActionDate,
            lable: res.data.ResponseCollection[i].StrActionDate,
          };
          tabColumns[1].push(colObj);
          dataObj1[res.data.ResponseCollection[i].StrActionDate] =
            res.data.ResponseCollection[i].METEROFFTL;
          dataObj2[res.data.ResponseCollection[i].StrActionDate] =
            res.data.ResponseCollection[i].METERON;
        }

        myData.push(dataObj1);
        myData.push(dataObj2);
        this.setState(
          {
            data: myData,
            totalCnt: res.data.TotalcountOfItems,
            filterCnt: res.data.FilteredCount,
          },
          () => {
            this.setTab(index);
          }
        );
      }
    });
  }

  setFilter(id, index) {
    this.setState(({ visibleFilters }) => {
      let update = [...visibleFilters];
      const index = update.indexOf(id);
      index < 0 ? update.push(id) : update.splice(index, 1);
      return { visibleFilters: update };
    });
  }

  customFilerChange(value, accessor, index, column) {
    if (this.state.tabIndex === 0) {
      this.state.dataObj[accessor] = value;
      this.setState({ loading: true }, () => {
        this.refReactTable.fireFetchData();
      });
    }
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

  gonvertDate(date) {
    if (date) {
      return moment(date).format("DD-MMM-YYYY HH:mm:ss");
    }
  }

  setSubComponent() {
    let sCol = [];
    subColumns.map((key, index) => {
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
      sCol.push(obj);
    });
    this.setState({ subCol: sCol });
  }

  getSubCompData(obj, index) {
    let idno = index[0];
    getData(
      "TripLog/GetTripLogDetails/" + this.state.data[idno].AdsUseLogID
    ).then((res) => {
      if (res.data && res.data.ResponseCollection) {
        this.setState({
          subData: res.data.ResponseCollection,
          subLoading: false,
        });
      } else {
        this.setState({ subData: [], subLoading: false });
      }
    });
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

  onDateChange(date) {
    let mydt =
      moment(date).format("DD") +
      "/" +
      moment(date).format("MM") +
      "/" +
      moment(date).format("YYYY");
    let abc = mydt.toString();
    this.setState({ strDate: moment(abc).toDate() });
  }
  getPlayLogExport() {
    console.log("this filtered", this.state.filtered);
    let strurl = "";
    let SortColumn = "AdsUseLogID";
    let SortOrder = "1";
    let TripStart = moment(this.state.strDate).format("MM/DD/YYYY");
    let TripEnd = moment(this.state.endDate).format("MM/DD/YYYY");
    let PageNo = "1";
    let RowCountPerPage = "200";
    let TripNo = 0;
    let CABNUMBER = "";
    let UnitKey = "";
    let hiddenColumns = "";
    if (this.state.filtered && this.state.filtered.length > 0) {
      for (var i = 0; i < this.state.filtered.length; i++) {
        if (
          this.state.filtered[i].id == "CabNumber" &&
          this.state.filtered[i].value
        ) {
          CABNUMBER = this.state.filtered[i].value;
        }
        if (
          this.state.filtered[i].id == "IMSI" &&
          this.state.filtered[i].value
        ) {
          UnitKey = this.state.filtered[i].value;
        }
        if (
          this.state.filtered[i].id == "TripID" &&
          this.state.filtered[i].value
        ) {
          TripNo = this.state.filtered[i].value;
        }
        if (
          this.state.filtered[i].id == "TripStart" &&
          this.state.filtered[i].value
        ) {
          TripStart = moment(this.state.filtered[i].value).format("MM/DD/YYYY");
        }
        if (
          this.state.filtered[i].id == "TripEnd" &&
          this.state.filtered[i].value
        ) {
          TripEnd = moment(this.state.filtered[i].value).format("MM/DD/YYYY");
        }
      }
    }

    let url =
      sessionStorage.getItem("mktUrl") +
      "ExportPlyaLog.aspx?SortColumn=" +
      SortColumn +
      "&SortOrder=" +
      SortOrder +
      "&TripStart=" +
      TripStart +
      "&TripEnd=" +
      TripEnd +
      "&PageNo=" +
      PageNo +
      "&RowCountPerPage=" +
      RowCountPerPage +
      "&TripNo=" +
      TripNo +
      "&CABNUMBER=" +
      CABNUMBER +
      "&UnitKey=" +
      UnitKey +
      "&hiddenColumns=";

    console.log("export url is", url);

    window.open(url);
  }
  handleRowExpanded(newExpanded, index, event) {
    if (newExpanded[index[0]] === false) {
      newExpanded = {};
    } else {
      Object.keys(newExpanded).map((k) => {
        newExpanded[k] = parseInt(k) === index[0] ? {} : false;
      });
    }
    this.setState({
      ...this.state,
      expanded: newExpanded,
      subLoading: true,
    });
    if (newExpanded[index[0]] !== false) {
      this.getSubCompData(newExpanded, index);
    }
  }

  render() {
    const abc = moment(this.state.strDate).toDate();
    return (
      <div>
        <div className="CabDtTabMainWrp">
          {this.tabs &&
            this.tabs.map((key, index) => (
              <div
                className={
                  this.state.tabIndex === index ? "CabDtTabWrp1" : "CabDtTabWrp"
                }
                onClick={() => {
                  if (index === 1) {
                    this.setTripLog(index);
                  } else {
                    this.setTab(index);
                  }
                }}
                key={index}
              >
                {key}
              </div>
            ))}
        </div>
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
            <div className="SchedHeadTxt">From</div>
            <DatePicker
              selected={new Date(this.state.strDate)}
              onChange={(date) =>
                this.setState({ strDate: date }, () =>
                  console.log(this.state.strDate)
                )
              }
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
            <img
              src={
                require("../../../Assets/Images/Filter/apply-filter.png")
                  
              }
              className="ScheduleupldImg"
              onClick={() => {
                if (this.state.tabIndex === 1) {
                  this.setTripLog(this.state.tabIndex);
                } else {
                  this.setTab(this.state.tabIndex);
                }
              }}
            ></img>
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
                src={require("../../../Assets/Images/separator.png")}
                className="SchedTopCredSeprtr"
              ></img>
              {/*<ExportCSV csvData={this.state.data} fileName={this.state.exportFileName} />*/}
              <img
                src={require("../../../Assets/Images/tools/export.jpg")}
                className="ScheduleToolImg"
                onClick={() => this.getPlayLogExport()}
              ></img>
              <img
                src={require("../../../Assets/Images/separator.png")}
                className="SchedTopCredSeprtr"
              ></img>
              <img
                src={
                  require("../../../Assets/Images/tools/refresh.png")
                }
                className="ScheduleToolImg"
                onClick={() => this.setTab(this.state.tabIndex)}
              ></img>
            </div>
          </div>
          {this.state.tabIndex === 0 ? (
            <ReactTable
              ref={(refReactTable) => {
                this.refReactTable = refReactTable;
              }}
              loading={this.state.loading}
              data={this.state.data}
              columns={this.state.columns}
              PaginationComponent={Pagination}
              defaultPageSize={200}
              pages={this.state.pageCount}
              NoDataComponent={() => null}
              filtered={this.state.filtered}
              sortable={false}
              totlaItems={this.state.totalCnt}
              filterCnt={this.state.filterCnt}
              onPageChange={() => this.setState({ loading: true })}
              manual
              style={{
                height: "410px", //
              }}
              onFetchData={(state, instance) => {
                let sdate = new Date(this.state.strDate);
                sdate.setHours(0, 0, 0, 0);
                let edate = new Date(this.state.endDate);
                edate.setHours(23, 59, 0, 0);
                this.state.dataObj["PageNo"] = (
                  instance.state.page + 1
                ).toString();
                this.state.dataObj["TripStart"] = sdate;
                this.state.dataObj["TripEnd"] = edate;
                postData("TripLog/GetTripLog", this.state.dataObj).then(
                  (res) => {
                    if (res && res.data && res.data.ResponseCollection) {
                      this.setState({
                        data: res.data.ResponseCollection,
                        pageCount: Math.ceil(res.data.FilteredCount / 200),
                        totalCnt: res.data.TotalcountOfItems,
                        filterCnt: res.data.FilteredCount,
                        loading: false,
                      });
                    } else {
                      this.setState({ data: [], loading: false });
                    }
                  }
                );
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
              onExpandedChange={(newExpanded, index, event) =>
                this.handleRowExpanded(newExpanded, index, event)
              }
              SubComponent={(rowInfo) => (
                <ReactTable
                  columns={this.state.subCol}
                  data={this.state.subData}
                  loading={this.state.subLoading}
                  showPagination={false}
                  defaultPageSize={this.state.subData.length}
                  minRows={5}
                />
              )}
            />
          ) : (
            <ReactTable
              loading={this.state.loading}
              data={this.state.data}
              columns={this.state.columns}
              showPagination={false}
              defaultPageSize={100}
              extradata={this.state}
              pages={10}
              filtered={this.state.filtered}
              expanded={this.state.expanded}
              sortable={false}
              style={{
                height: "410px", //
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
