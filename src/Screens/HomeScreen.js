import React, { Component } from "react";
import "../Assets/StyleSheet.css";
import { detect } from "detect-browser";
import TableGrid from "./TableComponents/TableGrid";
import SchedFileNY from "./TableComponents/Scdeuleing/SchedFile";
import SchedFileMx925 from "./TableComponents/Scdeuleing/SchedFileMx925";
import SchedFileDttu from "./TableComponents/Scdeuleing/SchedFileDttu";
import CabDetails from "./TableComponents/Cabs/CabDetails";
import CabAssociation from "./TableComponents/Cabs/CabAssociation";
import SystemFiles from "./TableComponents/Files/SystemFiles";
import MediaFiles from "./TableComponents/Files/MediaFiles";
import PlayLogs from "./TableComponents/Reports/PlayLogs";
import Statistics from "./TableComponents/Reports/Statistics";
import GlobleIndex from "./TableComponents/Reports/GlobleIndex";
import UserDash from "./TableComponents/Reports/UserDash";
import InProgress from "./TableComponents/Transfer/InProgress";
import Queue from "./TableComponents/Transfer/Queue";
import TransferContent from "./TableComponents/Transfer/TransferContent";
import ManageUser from "./TableComponents/UserMgnt/ManageUser";
import GeoZone from "./TableComponents/Scdeuleing/GeoZone";
import RemoteMonitoring from "./TableComponents/Cabs/RemoteMonitoring";
import Survey from "./TableComponents/Scdeuleing/Survey";
import moment from "moment";
import { getData, postData } from "../Services/MainServices";
import StatusImages from "./TableComponents/Scdeuleing/StatusImages";

let SchedFile;

const browser1 = detect();

const marketId = sessionStorage.getItem("marketId");

/*if(marketId=="MX925"){
    SchedFile =  SchedFileMx925;
}else if(marketId=="DTTU"){
    SchedFile =  SchedFileDttu;
}else{
    SchedFile =  SchedFileNY;
}*/

var subMenulist = [];

var self = "";

export default class HomeScreen extends Component {
  browser = "chrome";
  constructor(props) {
    super(props);
    if (browser1) {
      this.browser = browser1.name;
    }
    console.log("market is id ", sessionStorage.getItem("marketId"));
    if (sessionStorage.getItem("marketId")) {
      if (sessionStorage.getItem("marketId") == "MX925") {
        SchedFile = SchedFileMx925;
      } else if (sessionStorage.getItem("marketId") == "DTTU") {
        SchedFile = SchedFileDttu;
      } else if (sessionStorage.getItem("marketId") == "GLACIER") {
        SchedFile = SchedFileDttu;
      } else {
        SchedFile = SchedFileNY;
      }
    }
    this.handleUniversalClickOutside =
      this.handleUniversalClickOutside.bind(this);
    this.state = {
      browser: "chrome",
      mouse: false,
      index: -1,
      compName: "Schedule Media Files",
      nav: <SchedFile></SchedFile>,
      Menu: "Scheduling",
      userInfo: {},
      changePass: false,
      oldPass: "",
      newPass: "",
      confPass: "",
      userMainMenu: "",
      userSubMenu: "",
      about: false,
      marketName: "",
      marketId: "",
      serverDate: "",
    };
  }

  componentDidMount() {
    this.subMenulist = [
      {
        Menu: "Scheduling",
        List: [
          { id: "Schedule Media Files", key: SchedFile },
          { id: "Define Geo-Zones", key: GeoZone },
        ],
      },
      {
        Menu: "Manage Cabs",
        List: [
          { id: "Cab Details", key: CabDetails },
          { id: "Cab Association", key: CabAssociation },
        ],
      },
      {
        Menu: "Manage Files",
        List: [
          { id: "Media Files", key: MediaFiles },
          { id: "System Files", key: SystemFiles },
        ],
      },
      {
        Menu: "Reports",
        List: [
          { id: "Play Log", key: PlayLogs },
          { id: "Play Log Statistics", key: Statistics },
          { id: "Global Index Report", key: GlobleIndex },
          { id: "User Dashbord", key: UserDash },
          { id: "Admin Dashbord", key: TableGrid },
        ],
      },
      {
        Menu: "Transfer",
        List: [
          { id: "In-Progress", key: InProgress },
          { id: "Upload Queue", key: Queue },
          { id: "Transferred Contents", key: TransferContent },
        ],
      },
      {
        Menu: "User Management",
        List: [{ id: "User Management", key: ManageUser }],
      },
      {
        Menu: "Settings",
        List: [
          { id: "Change Password", key: "changePass" },
          { id: "About", key: "about" },
        ],
      },
    ];
    const info = JSON.parse(sessionStorage.getItem("userInfo"));

    /*var pjsonData= info.Permission;
         console.log("json is ",tt)*/

    self = this;

    setInterval(this.getServerTime, 10000);

    this.setState({
      marketName: sessionStorage.getItem("marketName"),
      marketId: sessionStorage.getItem("marketId"),
    });

    if (info) {
      this.setState({ userInfo: info });
      if (info.Permission) {
        var pjsonData = JSON.parse(info.Permission);
        console.log(
          "hk;dgkh;lkghkdghkd'hkdl'kfh'dlkgh'dkh'kdh'kd'k'dkh'k",
          pjsonData
        );
        subMenulist = [];
        console.log("json is ", pjsonData);
        if (
          pjsonData &&
          pjsonData.permissions &&
          pjsonData.permissions.mainMenu &&
          pjsonData.permissions.mainMenu.root &&
          pjsonData.permissions.mainMenu.root.menuitem &&
          pjsonData.permissions.mainMenu.root.menuitem.length > 0
        ) {
          pjsonData.permissions.mainMenu.root.menuitem.forEach(function (item) {
            console.log("each item", item.menuitem);
            if (item.menuitem && Array.isArray(item.menuitem)) {
              if (item.menuitem && item.menuitem.length > 0) {
                if (item["@label"] == "scheduling") {
                  var mainmenu = "Scheduling";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];
                  item.menuitem.forEach(function (subitem) {
                    if (subitem["@label"] == "manage_media_files") {
                      list.push({ id: "Schedule Media Files", key: SchedFile });
                    }
                    if (subitem["@label"] == "define_geozone") {
                      list.push({ id: "Define Geo-Zones", key: GeoZone });
                    }
                    /*if(subitem["@label"]=="manage_buttons"){
                                          list.push(
                                          {id:"Manage Buttons","key":buttoncomponent}
                                          )
                                          }*/
                    //  if (subitem["@label"] == "define_geozone") {
                    //      list.push(
                    //          {id: "Define Geo Zones", "key": TableGrid}
                    //      )
                    //  }
                    if (subitem["@label"] == "survey_menu") {
                      list.push({ id: "Survey", key: Survey });
                    }
                  });
                  list.push({ id: "Static Image", key: StatusImages });
                  obj.List = list;
                  subMenulist.push(obj);
                }
                if (item["@label"] == "manage_cabs_menu") {
                  var mainmenu = "Manage Cabs";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];
                  item.menuitem.forEach(function (subitem) {
                    if (subitem["@label"] == "cab_details") {
                      list.push({ id: "Cab Details", key: CabDetails });
                    }
                    if (subitem["@label"] == "manage_cabs") {
                      list.push({ id: "Cab Association", key: CabAssociation });
                    }
                    if (
                      (sessionStorage.getItem("marketId") === "DTTU" ||
                        sessionStorage.getItem("marketId") === "MX925" ||
                        sessionStorage.getItem("marketId") === "GLACIER") &&
                      subitem["@label"] == "remote_monitoring"
                    ) {
                      list.push({
                        id: "Remote Monitoring",
                        key: RemoteMonitoring,
                      });
                    }
                  });
                  obj.List = list;
                  subMenulist.push(obj);
                }
                if (item["@label"] == "manage_files") {
                  var mainmenu = "Manage Files";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];
                  item.menuitem.forEach(function (subitem) {
                    if (subitem["@label"] == "media_files") {
                      list.push({ id: "Media Files", key: MediaFiles });
                    }
                    if (subitem["@label"] == "system_files") {
                      list.push({ id: "System Files", key: SystemFiles });
                    }
                  });
                  obj.List = list;
                  subMenulist.push(obj);
                }
                if (item["@label"] == "reports") {
                  var mainmenu = "Reports";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];
                  item.menuitem.forEach(function (subitem) {
                    if (subitem["@label"] == "play_logs") {
                      list.push({ id: "Play Log", key: PlayLogs });
                    }
                    if (subitem["@label"] == "play_log_stats") {
                      list.push({ id: "Play Log Statistics", key: Statistics });
                    }
                    if (subitem["@label"] == "global_index") {
                      list.push({
                        id: "Global Index Report",
                        key: GlobleIndex,
                      });
                    }
                    /* if (subitem["@label"] == "user_dashbord") {
                                             list.push(
                                                 {id: "User Dashbord", "key": UserDash}
                                             )
                                         }
                                         if (subitem["@label"] == "admin_dashbord") {
                                             list.push(
                                                 {id: "Admin Dashbord", "key": TableGrid}
                                             )
                                         }*/
                  });
                  obj.List = list;
                  subMenulist.push(obj);
                }
                if (item["@label"] == "transfer") {
                  var mainmenu = "Transfer";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];
                  item.menuitem.forEach(function (subitem) {
                    if (subitem["@label"] == "in_progress") {
                      list.push({ id: "In-Progress", key: InProgress });
                    }
                    if (subitem["@label"] == "upload") {
                      list.push({ id: "Upload Queue", key: Queue });
                    }
                    if (subitem["@label"] == "transfer_content") {
                      list.push({
                        id: "Transferred Contents",
                        key: TransferContent,
                      });
                    }
                  });
                  obj.List = list;
                  subMenulist.push(obj);
                }
                //console.log("mainmenu item",item["@label"])
                if (item["@label"] == "administration_tools") {
                  var mainmenu = "User Management";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];
                  item.menuitem.forEach(function (subitem) {
                    console.log("menu item", subitem);
                    if (subitem["@label"] == "user_management") {
                      list.push({ id: "User Management", key: ManageUser });
                    }
                  });
                  obj.List = list;
                  subMenulist.push(obj);
                }
                if (item["@label"] == "setting") {
                  var mainmenu = "Settings";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];
                  item.menuitem.forEach(function (subitem) {
                    if (subitem["@label"] == "change_password") {
                      list.push({ id: "Change Password", key: "changePass" });
                    }
                    if (subitem["@label"] == "about") {
                      list.push({ id: "About", key: "about" });
                    }
                  });
                  obj.List = list;
                  subMenulist.push(obj);
                }

                //str+='</div>';
              }
            } else {
              if (item.menuitem) {
                console.log("check 0", item);
                console.log("check 1", item.menuitem);
                console.log("check 2", item.menuitem["@label"]);
                if (item["@label"] == "administration_tools") {
                  var mainmenu = "User Management";
                  var obj = new Object();
                  obj.Menu = mainmenu;
                  var list = [];

                  //console.log("menu item",subitem)
                  if (item.menuitem["@label"] == "user_management") {
                    list.push({ id: "User Management", key: ManageUser });
                  }

                  obj.List = list;
                  subMenulist.push(obj);
                }
              }
            }
          });
          console.log("json is ", subMenulist);
        }
      }
    } else {
      this.props.history.push("/");
    }

    document.addEventListener("mousedown", this.handleUniversalClickOutside);
  }
  handleUniversalClickOutside(event) {
    var x = document.getElementsByClassName("SchedFiltInptWrp");
    //console.log("x is ",x[0])
    //console.log("event.target is ",event.target);
    if (event.target !== x[0]) {
      //console.log("out inside");
      this.setState({ visibleFilters: [] });
      //var element = document.getElementsByClassName("rt-th");
      //console.log("element is ",element[0])
      //element[0].classList.add("hiddenFilter");
    } else {
      //console.log("inside inside");
    }
    //console.log("call handleClickOutside",event);
  }
  GetPage = (val) => {
    if (val.key === "changePass") {
      this.setState({ changePass: true });
    } else if (val.key === "about") {
      this.setState({ about: true });
    } else {
      var Comp = val.key;
      if (Comp) {
        this.setState({
          nav: <Comp></Comp>,
          compName: val.id,
          Menu: subMenulist[this.state.index].Menu,
        });
      } else {
        this.setState({ nav: <TableGrid></TableGrid> });
      }
    }
  };

  setSubMenue(val) {
    this.setState({ index: val });
  }
  logout() {
    console.log("logout call");
    sessionStorage.clear("userInfo");
    sessionStorage.clear("mktUrl");
    sessionStorage.clear("userList");
    sessionStorage.clear("userID");
    this.props.history.push("/");
    window.location.reload();
    clearInterval();
  }

  getServerTime() {
    //console.log("call getServerTime");
    getData("UserMgmt/GetServerTime").then((res) => {
      if (res.data.fetchTimeStamp) {
        console.log("fetchTimeStamp is", res.data.fetchTimeStamp);
        self.setState({ serverDate: res.data.fetchTimeStamp });
      } else {
      }
    });
  }
  SubMenu = () => {
    return (
      <div className="nav__submenu">
        {subMenulist[this.state.index] &&
          subMenulist[this.state.index].List.map((key, index) => (
            <div
              className="nav__submenu-item"
              onClick={() => this.GetPage(key)}
              key={index}
            >
              {key.id}
            </div>
          ))}
      </div>
    );
  };

  render() {
    return (
      <div style={{ height: "100vh", backgroundColor: "#232323" }}>
        {this.state.changePass && (
          <div className="Loader">
            <div className="HomeScrChangePassMainWrp">
              <div className="ForgPassTitle">Change Password</div>
              <div style={{ marginTop: "30px" }}>
                <div className="LoginInptChildWrp">
                  <div className="HomeScrChngPasstxt">Old Password *</div>
                  <input
                    className="LoginInputFld"
                    onChange={(e) => this.setState({ oldPass: e.target.value })}
                    autoComplete="on"
                  ></input>
                </div>
                <div className="LoginInptChildWrp">
                  <div className="HomeScrChngPasstxt1">New Password *</div>
                  <input
                    className="LoginInputFld"
                    type="password"
                    onChange={(e) => this.setState({ newPass: e.target.value })}
                    autoComplete="on"
                  ></input>
                </div>
                <div className="LoginInptChildWrp">
                  <div className="HomeScrChngPasstxt2">Confirm Password *</div>
                  <input
                    className="LoginInputFld"
                    type="password"
                    onChange={(e) => this.setState({ newPass: e.target.value })}
                    autoComplete="on"
                  ></input>
                </div>
              </div>
              <div className="HomeSrcChngPassBtm">
                <img
                  src={require("../Assets/Images/Login/ok-btn.png")}
                  className="ForgPassBtn"
                ></img>
                <img
                  src={require("../Assets/Images/Login/cancel-btn.png")}
                  className="ForgPassBtn"
                  onClick={() => this.setState({ changePass: false })}
                ></img>
              </div>
            </div>
          </div>
        )}
        <div className="HomeTopWrp">
          <div className="HomeTopSideWrp" style={{ width: "23%" }}>
            <div className="HomeTopCredWrp"></div>
            <div
              className="HomeTopTabWrp"
              style={{ display: "block", "text-align": "center" }}
            >
              <img
                src={require("../Assets/Images/logo2.png")}
                className="HomeLogoWrp"
                style={{ width: "62%" }}
              ></img>
            </div>
          </div>

          <div className="HomeTopSideWrp">
            {Object.keys(this.state.userInfo).length > 0 &&
              this.state.userInfo.constructor === Object && (
                <div className="HomeTopCredWrp">
                  <div className="HomeTopCredTxt">{this.state.marketName}</div>
                  <img
                    src={require("../Assets/Images/separator.png")}
                    className="HomeTopCredSeprtr"
                  ></img>
                  <div className="HomeTopCredTxt">
                    Server Time: {this.state.serverDate}
                  </div>
                  <img
                    src={require("../Assets/Images/separator.png")}
                    className="HomeTopCredSeprtr"
                  ></img>
                  <div className="HomeTopCredTxt">
                    Welcome :{this.state.userInfo.FirstName}{" "}
                    {this.state.userInfo.LastName}
                  </div>
                  <img
                    src={require("../Assets/Images/separator.png")}
                    className="HomeTopCredSeprtr"
                  ></img>
                  <div
                    className="HomeTopCredTxt"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.logout()}
                  >
                    Logout
                  </div>
                </div>
              )}
            <div className="HomeTopTabWrp">
              <div className="HomeTabIndWrp">
                <div
                  className={
                    this.browser == "safari"
                      ? "HometanIndwrp2"
                      : "HometanIndwrp1"
                  }
                >
                  <div className="HomeTabIndtxt">{this.state.Menu}</div>
                  <div className="HomeTabIndtxt1">&gt;</div>
                  <div className="HomeTabIndtxt2">{this.state.compName}</div>
                </div>
              </div>
              <div className="HomeTabImgWrp">
                <div className="HomeTabNameWrp">
                  <div
                    className="HomeTabTxtWrp"
                    onMouseEnter={() => this.setSubMenue(0)}
                    onMouseLeave={() => this.setState({ index: -1 })}
                  >
                    <div className="HomeTabtxt">
                      <div>Scheduling</div>
                      {this.state.index === 0 && <this.SubMenu></this.SubMenu>}
                    </div>
                  </div>
                  <div className="HomeTabtxt1">|</div>
                  <div
                    className="HomeTabTxtWrp"
                    onMouseEnter={() => this.setSubMenue(1)}
                    onMouseLeave={() => this.setState({ index: -1 })}
                  >
                    <div className="HomeTabtxt">
                      <div>Manage Cabs</div>
                      {this.state.index === 1 && <this.SubMenu></this.SubMenu>}
                    </div>
                  </div>
                  <div className="HomeTabtxt1">|</div>
                  <div
                    className="HomeTabTxtWrp"
                    onMouseEnter={() => this.setSubMenue(2)}
                    onMouseLeave={() => this.setState({ index: -1 })}
                  >
                    <div className="HomeTabtxt">
                      <div>Manage Files</div>
                      {this.state.index === 2 && <this.SubMenu></this.SubMenu>}
                    </div>
                  </div>
                  <div className="HomeTabtxt1">|</div>
                  <div
                    className="HomeTabTxtWrp"
                    onMouseEnter={() => this.setSubMenue(3)}
                    onMouseLeave={() => this.setState({ index: -1 })}
                  >
                    <div className="HomeTabtxt">
                      <div>Reports</div>
                      {this.state.index === 3 && <this.SubMenu></this.SubMenu>}
                    </div>
                  </div>
                  <div className="HomeTabtxt1">|</div>
                  <div
                    className="HomeTabTxtWrp"
                    onMouseEnter={() => this.setSubMenue(4)}
                    onMouseLeave={() => this.setState({ index: -1 })}
                  >
                    <div className="HomeTabtxt">
                      <div>Transfer</div>
                      {this.state.index === 4 && <this.SubMenu></this.SubMenu>}
                    </div>
                  </div>
                  <div className="HomeTabtxt1">|</div>
                  <div
                    className="HomeTabTxtWrp"
                    onMouseEnter={() => this.setSubMenue(5)}
                    onMouseLeave={() => this.setState({ index: -1 })}
                  >
                    <div className="HomeTabtxt">
                      <div>Administration Tools</div>
                      {this.state.index === 5 && <this.SubMenu></this.SubMenu>}
                    </div>
                  </div>
                  <div className="HomeTabtxt1">|</div>
                  <div
                    className="HomeTabTxtWrp"
                    onMouseEnter={() => this.setSubMenue(6)}
                    onMouseLeave={() => this.setState({ index: -1 })}
                  >
                    <div className="HomeTabtxt">
                      <div>Settings</div>
                      {this.state.index === 6 && <this.SubMenu></this.SubMenu>}
                    </div>
                  </div>
                </div>
                <div className="HomeTabImgext"></div>
                <img
                  src={require("../Assets/Images/tab-menu-bg.jpg")}
                  className={
                    this.browser === "safari" ? "HomeTabImg1" : "HomeTabImg"
                  }
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "3px", backgroundColor: "#474747" }}>
          {this.state.nav}
        </div>
        {this.state.about && (
          <div className="Loader">
            <div className="HomeScrChangePassMainWrp aboutmain">
              <div className="ForgPassTitle ShedTitle">
                <div style={{ width: "96%" }}>
                  About Media Management Portal
                </div>
                <div
                  className="ShedHide"
                  onClick={() => this.setState({ about: false })}
                >
                  X
                </div>
              </div>
              <div className="aboutlayoutDiv">
                Product Name: {this.state.marketName}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
