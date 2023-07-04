import React, {Component,createRef} from 'react';
import '../../../Assets/StyleSheet.css';
import ReactTable from 'react-table';
import '../../../Assets/react-table.css';
import moment from "moment";
import ColumnStatus from "../../CommomComponents/ColumnStatus";
import ComCheck from "../../CommomComponents/ComCheck";
import {Search,MultiChoice,Radio} from "../../CommomComponents/Filters";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { postData, getData, deletData } from '../../../Services/MainServices';
import {ExportCSV} from '../../../Utility/ExportCSV.js';
import Dialog from "../../CommomComponents/Dialog";


const rightcol1=[
    {accessor:"Name",lable:"Name"},
    {accessor:"Order",lable:"Order"},
    {accessor:"Status",lable:"State"},
    {accessor:"StartDate",lable:"Start Date"},
    {accessor:"EndDate",lable:"End Date"},
]
const qustionCol=[
    {accessor:"Question",lable:"Questions"},
    {accessor:"Status",lable:"State"},
]
const tabCol=[
    [
        {accessor:"Question",lable:"Question"}
    ],
    [
        {accessor:"SurveyCompletionString",lable:"Survey Completion Date"},
        {accessor:"CabNumber",lable:"Cab Number"},
        {accessor:"TripID",lable:"Trip ID"},
        {accessor:"SurveyID",lable:"Survey ID"},
        {accessor:"Name",lable:"Name"},
        {accessor:"Question",lable:"Question"},
        {accessor:"Answer",lable:"Answer"},
        {accessor:"SurveyProvider",lable:"Survey Provider"},
    ],
    [
        {accessor:"ID",lable:"ID"},
        {accessor:"Question",lable:"Question"},
        {accessor:"Answer",lable:"Answer"}
    ],
    [],
    [
        {accessor:"groupName",lable:"Group Name"}
    ]

]

const subCol=[
    {
        Header:"",
        accessor:"xyz",
        Cell:props=><div style={{display:"flex"}}>
            <img src={require("../../../Assets/Images/Schedule/arrowRight1.png")}></img>
            {props.original.QuestionOrAns}
            <span>{props.value}</span>
            </div>
    }
]
const subCol1=[
    {
        Header:"",
        accessor:"xyz",
        Cell:props=><div style={{display:"flex"}}>
            <img src={require("../../../Assets/Images/Schedule/arrowRight1.png")}></img>
            {props.original.Answer}
            <span>{props.value}</span>
            </div>
    }
]
const mailCol1=[
    {
        Header:"Question",
        accessor:"Question"
    },
    {
        Header:"Survey",
        accessor:"SurveyName"
    }
];
const mailCol2=[
    {
        Header:"Answer",
        accessor:"Answer"
    },
    {
        Header:"Count",
        accessor:"Count"
    }
]

const questionDtCol=[
    {
        Header:"Name",
        accessor:"Name",
    }
]

const addQuestCol=[
    {
        Header:"Question",
        accessor:"Question",
        Cell:props=><div style={{display:"flex"}}>
        <img  src={require("../../../Assets/Images/Schedule/questionIcon.png")}></img>
        <span>{props.original.Question}</span>
        </div>
    }
]

const statData=[
    {"xyz":"abc"}
];
const StatusCostant=["active","inactive","archive"];
const statusConst=["Lost","Current"]

export default class Survey extends Component{
    tabs=["Survey Details","Reports","Tally Reports","Email Reports","Groups"];
    tbsUrl=["Survey/GetSurveyDetails/","Survey/GetSurveyReport","Survey/GetSurveyTalleyReport","Survey/GetSurveyEmailReport","Survey/GetSurveyGroups/"];
    tabs1=["Survey Details"]
    constructor(props){
        super(props);
        this.state={
            rightColumns:[],
            active:true,
            rFiltered:[],
            rvisibleFilters:[],
            rfilterVal:[],
            strDate:new Date(),
            endDate:new Date(),
            tabIndex:0,
            filterVal:[],
             visibleFilters:[],
             filtered:[],
             leftColumns:[],
             leftData:statData,
            surveyListData:[],
            questionListData:[],
            selectedQuestionIds:[],
            selectedSurveyIds:[],
            surveySelectedState:-1,
            addSurvey:false,
            addStrDate:new Date(),
            addEndDate:new Date(),
            name:"",
            order:1,
            adstatus:0,
            addQuestion:false,
            addQuestionData:[],
            radioCheck:[],
            questGrp:false,
            dlgEnable:false,
            dlgtitle:null,
            dlgType:"",
            message:"",
            surveyStatus:false,
            srStatus:0,
            questInfo:false,
            qName:"",
            mChoice:false,
            rsp1:"",
            rsp2:"",
            rsp3:"",
            rsp4:"",
            rsp5:"",
            qustInfoDlg:false,
            msgRsp:[],
            surveyID:0,
            questName:"",
            questID:"",
            questRsp:[],
            questInfoColl:[],
            mailData:[],
            updateGrp:false,
            grpData:[],
            grpLoading:false,
            grpIds:[],
            surveyValid:false,
            surveyScc:false,
            deletQuestID:-1,
            questLoading:false,
            selectedRow:null,
            exportFileName:"exportSurveyReport",
            editSurvey:false,
            editGrp:[],
            emailRpt:false,
            email:"",
            emailData:[],
            emailValid:false,
        }
    }

    componentDidMount(){
        this.setRightTab();
        this.setLeftTab(this.state.tabIndex);
        this.getSurveyAndQuestonList(true, -1)
        this.getGrpData()//0 fro survey list tab,1 for question list tab
    }

    addQstCol=[
        {
            Header:"",
            Cell:(rowInfo)=><div onClick={()=>this.setRadio(rowInfo.index)}><Radio></Radio></div>,
            width:25
        },
        {
            Header:"Question",
            accessor:"Question"
        }

    ];
    grpCol=[
        {
            Header: "#",
            Cell: (rowInfo) => <div className="SchedCheck"><ComCheck  onChange={(e)=>this.selectGrp(e,rowInfo.index)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"} checked={this.state.grpIds.indexOf(rowInfo.index)>=0}></ComCheck></div>, // Custom cell components!
            width:25
        },
        {
            Header:"Group Name",
            accessor:"Group_ADS_Name",
        }
    ];
    emailCol=[
        {
            Header:"Email",
            accessor:"Email"
        },
        {
            Header: "",
            Cell: (rowInfo) =><div style={{paddingBottom:"10px"}}> <img src={require("../../../Assets/Images/Group/delete-over.png")} className="SchedGrpTableToolImg1" onClick={(()=>this.deleteEmail(rowInfo.index))}></img></div>, // Custom cell components!
              width:40
        }
    ]

    setRadio(index){
       let index1 = this.state.radioCheck.indexOf(index);
       if(index1 === -1){
        this.state.radioCheck.push(index)
       }
    }

    getGrpData(url){
        if(this.state.grpData.length === 0){
            this.setState({grpLoading:true})
         let obj={
           "startIndex": 1,
           "count": 1,
           "criteria": []
           }
        postData(url,obj)
        .then((res)=>{
            this.setState({flLoading: false})
             this.setState({grpData:[]});
             if(res && res.data && res.data.ResponseCollection){
                 if(this.state.editSurvey){
                    this.setEditGrp(res.data.ResponseCollection);
                 }else{
                    this.setState({grpData:res.data.ResponseCollection,grpLoading:false})
                 }
             
         }else{
           this.setState({grpData:[],grpLoading:false})
         }
        })
        }
       }

        setEditGrp(response){
            this.state.grpIds=[]
            for(let i=0;i<this.state.editGrp.length;i++){
               let index = response.findIndex(x=>x.Group_ADS_ID===this.state.editGrp[i].groupID);
               if(index >=0){
                this.state.grpIds.push(index)
               }
            }
            this.setState({grpData:response,grpLoading:false})
        }

       selectGrp(e,id){
           let index = this.state.grpIds.indexOf(id)
           if(e === true && index === -1){
            this.state.grpIds.push(id)
           }else if(e === true && index >=0){
            this.state.grpIds.splice(index,1)
           }
       }

    setLeftTab(index1){
      this.state.filterVal=[];
      this.state.filtered=[];
      this.state.visibleFilters=[];
      this.setState({leftColumns:[],leftData:[],activeLoading:true})
      let dCol=[];
      if(tabCol && tabCol[index1]){
          tabCol[index1].map((key,index)=>{
              let obj;
             if(index1 > 0){
                obj={
                    Header:key.lable,
                    accessor:key.accessor
                }
             }else if(index1===0){
                obj={
                    Header:key.lable,
                    accessor:key.accessor,
                    Cell:props=><div style={{display:"flex"}}>
                        <img  src={require("../../../Assets/Images/Schedule/questionIcon.png")}></img>
                        <span>{props.original.QuestionOrAns}</span>
                        </div>
                }
             }
              dCol.push(obj);
          })
          this.setState({leftColumns:dCol,tabIndex:index1},()=>this.getSurveyData(index1))
      }
    }

    getSurveyData(index){
        this.setState({activeLoading:true})
        let obj={
            "surveyID":this.state.surveyID,
            "startDateString":moment(this.state.strDate).format("MM/DD/YYYY"),
            "endDateString":moment(this.state.endDate).format("MM/DD/YYYY"),
        }
        if(index === 4){
            getData(this.tbsUrl[index]+this.state.surveyID)
            .then(res=>{
                if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                    console.log("grp========================",res.data.ResponseCollection)
                    this.setState({leftData:res.data.ResponseCollection,activeLoading:false})
                }else{
                    this.setState({leftData:[],activeLoading:false})
                }
            })
        }else if(index === 0){
            getData(this.tbsUrl[index]+this.state.surveyID)
                .then(res=>{
                    if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                        console.log("========================",res.data.ResponseCollection)
                        this.setState({leftData:res.data.ResponseCollection,activeLoading:false},()=>{
                            if(this.state.editSurvey){
                              this.setQuestionsForEdit(res.data.ResponseCollection)
                            }
                        })
                    }else{
                        this.setState({leftData:[],activeLoading:false})
                    }
                })
        }else{
            postData(this.tbsUrl[index],obj)
            .then(res=>{
                if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                    console.log("========================",res.data.ResponseCollection)
                    if(index === 3){
                        let temp2=[];
                        for(let i=0;i<res.data.ResponseCollection.length;i++){
                            let temp1=[];
                            temp1.push(res.data.ResponseCollection[i]);
                            temp2.push(temp1);
                        }
                        this.setState({mailData:temp2});
                    }
                    this.setState({leftData:res.data.ResponseCollection,activeLoading:false})
                }else{
                    this.setState({leftData:[],activeLoading:false})
                }
            })
        }
       
        
    }

    setQuestionsForEdit(response){
        let tempQuest=[];
        for(let i=0;i<response.length;i++){
            let tempAns=[];
            for(let j=0;j<response[i].childrenList.length;j++){
                let obj1={
                    ID:response[i].childrenList[j].AnswerID,
                    Answer:response[i].childrenList[j].QuestionOrAns
                }
                tempAns.push(obj1)
            }
            let obj={
                ID:response[i].QuestionID,
                Question:response[i].QuestionOrAns,
                AssociatedAnswers:tempAns
            } 
            tempQuest.push(obj) 
        }
        this.setState({addQuestionData:tempQuest})
    }

    setRightTab(){
        this.state.rFiltered=[];
        this.state.rvisibleFilters=[];
        this.state.rfilterVal=[];
        let dCol=[];
        let obj = {
            Header: "#",
            Cell: (rowInfo) => <div className="SchedCheck"><ComCheck  onChange={(e)=>this.setSelectedData(rowInfo.index,rowInfo.original)}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"} checked={false}></ComCheck></div>, // Custom cell components!
            width:25
          }
          dCol.push(obj);
        if(this.state.active){
            rightcol1.map((key,index)=>{
                let obj={};
                this.state.rfilterVal.push("")
                if(key.accessor=="Status"){
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp" style={{display:"block",textAlign:"center"}}>
                            <div>{key.lable}</div>
                            <div style={{width:"58px"}}>
                                <select style={{"width":"100%"}} className="SchedDropDwn1" onChange={(e)=>{this.setState({surveySelectedState:e.target.value});this.getSurveyAndQuestonList(true,e.target.value)}} value={this.state.surveySelectedState}>
                                    <option value={0}>Active</option>
                                    <option value={1}>Inactive</option>
                                    <option value={2}>Archive</option>
                                    <option value={-1}>All</option>
                                </select>
                            </div>
                        </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        width:70,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
                                }

                            }
                            return false;
                        },
                        Cell: (rowInfo) => <span >{this.getStatusStr(rowInfo.value)}</span>,

                    }
                }else if(key.accessor=="StartDate" || key.accessor=="EndDate"){
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                this.state.rfilterVal[index] === ""?
                                    <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                                    :
                                    <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                            }
                        </div>
                            <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{
                                this.state.rvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.rfilterVal[index]}></Search>
                            }
                            </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        width:70,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
                                }

                            }
                            return false;
                        },
                        Cell: (rowInfo) => <span >{this.convertDate(rowInfo.value)}</span>,

                    }
                }
                else{
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                            {
                                    this.state.rfilterVal[index] === ""?
                                        <img src={require('../../../Assets/Images/Filter/filter.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                                        :
                                        <img src={require('../../../Assets/Images/Filter/filter_active.png')} className="ScheduleheadFilt" onClick={()=>this.setFilter(cellInfo.column.id,index)}></img>
                                }
                        </div>
                            <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{
                                this.state.rvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.rfilterVal[index]}></Search>
                            }
                            </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        width:90,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
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

                   dCol.push(obj)
            })
            let obj1 = {
                Header: "",
                width:10
              }
              dCol.push(obj1);
        }
        else{
            //console.log("get question column")
            qustionCol.map((key,index)=>{
                let obj={};
                this.state.rfilterVal.push("")
                if(key.accessor=="Status"){
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                           
                        </div>
                            <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{
                                this.state.rvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                            }
                            </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        width:70,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
                                }

                            }
                            return false;
                        },
                        Cell: (rowInfo) => <span >{this.getStatusStr(rowInfo.original.Status)}</span>,

                    }
                }
                else{
                    obj={
                        Header: (cellInfo)=><div><div className="ScheduleHeaderWrp">
                            <div>{key.lable}</div>
                          
                        </div>
                            <div style={{position:"absolute",zIndex:12,marginTop:"12px"}}>{
                                this.state.rvisibleFilters.indexOf(cellInfo.column.id) >= 0 &&
                                <Search onChange={(e)=>this.customFilerChange(e.target.value,cellInfo.column.id,index)} value={this.state.filterVal[index]}></Search>
                            }
                            </div>
                        </div>,
                        accessor:key.accessor,
                        show:true,
                        filterable:true,
                        filterMethod: (filter, row) => {
                            if(filter.value === ""){
                                return true
                            }
                            if(row[filter.id]){
                                if(isNaN(row[filter.id])){
                                    return String(row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase())) >=0;
                                }else{
                                    return String(row[filter.id].toString().indexOf(filter.value)) >=0;
                                }

                            }
                            return false;
                        },

                    }
                }

                dCol.push(obj)
            })

        }
        this.setState({rightColumns:dCol})
    }

    setFilter(id,index){
        this.setState(({ rvisibleFilters }) => {
          let update = [...rvisibleFilters];
          const index = update.indexOf(id);
          index < 0 ? update.push(id) : update.splice(index, 1);
          return { rvisibleFilters: update };
        });
       }
       
    customFilerChange(value, accessor, index) {
        let filtered = this.state.rFiltered;
        let insertNewFilter = 1;
        this.state.rfilterVal[index] = value
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
        this.setState({ rFiltered: newFilter});
       }

    getStatusStr(val){
        console.log("val is",val);
        console.log("StatusCostant is",StatusCostant[val]);
       return StatusCostant[val]
    }
    setSelectedData(index,data) {
        console.log("seldat", this.state.active);
        console.log("data.ID", data.ID);
        console.log("selecyd question",this.state.selectedQuestionIds);
        if(this.state.active){
            let tempArr = this.state.selectedSurveyIds;
            let index = tempArr.indexOf(data.ID);
            if(index>=0){
                tempArr.splice(index,1);
            }else{
                tempArr.push(data.ID);
            }
            this.setState({selectedSurveyIds:tempArr});
        }else{
            let tempArr = this.state.selectedQuestionIds;
            let index = tempArr.indexOf(data.ID);
            if(index>=0){
                tempArr.splice(index,1);
            }else{
                tempArr.push(data.ID);
            }
            this.setState({selectedQuestionIds:tempArr});
        }
        console.log("selecyd survey",this.state.selectedSurveyIds);
        console.log("selecyd question",this.state.selectedQuestionIds);
    }

    convertDate(val){
        return moment(val).format("DD-MMM-YYYY");
    }

    setRightCol(val){
        this.setState({active:val,tabIndex:0},()=>{this.setRightTab();this.getSurveyAndQuestonList(val,-1)})
    }
    getSurveyAndQuestonList(selection,status,popup){
       if(popup){
        this.setState({questLoading: true})
       }else{
        this.setState({activeLoading: true})
       }
        if(selection==true){
            this.setState({surveyListData:[]})
            let obj={
                "filter":null,
                "status":status
            }
           
            postData("Survey/GetAllSurveys",obj)
                .then(res => {
                    if (res.data && res.data.ResponseCollection) {
                        console.log("surveyDt==========",res.data.ResponseCollection)
                        this.setState({ surveyListData: res.data.ResponseCollection,activeLoading: false,surveyID:res.data.ResponseCollection[0].ID,selectedRow:res.data.ResponseCollection[0]},()=>this.getSurveyData(0))
                    } else {
                        this.setState({ surveyListData: [],activeLoading: false })
                    }
                }).catch((e)=>{
                    this.setState({activeLoading: false})
                })
        }else{
            let obj={
                "filter":null,
                "status":-1
            }
            postData("Question/GetQuestions",obj)
                .then(res => {
                    if (res.data && res.data.ResponseCollection) {
                        console.log("======================",res.data.ResponseCollection)
                        this.setState({ questionListData: res.data.ResponseCollection,questID:res.data.ResponseCollection[0].ID,questName:res.data.ResponseCollection[0].Question, activeLoading: false,questLoading:false},()=>this.getQuestDetails())
                    } else {
                        this.setState({ questionListData: [],activeLoading: false,questLoading:false})
                    }
                }).catch((e)=>{
                   this.setState({activeLoading: false})
                })
        }


    }

    getQuestDetails(){
        getData("Question/GetAnswersForQuestion/"+this.state.questID)
        .then(res => {
            let myData=[];
            if(res.data && res.data.InfoCollection && res.data.InfoCollection.length > 0){
                for(let i=0;i<res.data.InfoCollection.length;i++){
                    let obj={
                        Name:res.data.InfoCollection[i]
                    }
                    myData.push(obj)
                }
            }
            if (res.data && res.data.ResponseCollection && res.data.ResponseCollection.length >0) {
                this.setState({questRsp:res.data.ResponseCollection,questInfoColl:myData})
            } else {
                this.setState({questRsp:[],questInfoColl:myData})
            }
           
        })
    }

    associateGrp(){
        if(this.state.name === ""){
           
            this.setState({dlgtitle:"Information",message:"Please Enter Survey Name",dlgType:"information",surveyValid:true,addSurvey:false});
        }else if(this.state.addQuestionData.length ===0){
            
            this.setState({dlgtitle:"Information",message:"Associate atleast one question with the survey",dlgType:"information",surveyValid:true,addSurvey:false});
        }else{
            this.setState({addSurvey:false,questGrp:true},()=>this.getGrpData("GroupADSFL/Fetch"))
        }
      
    }

    getGrpData(url,type){
        this.setState({grpLoading:true})
        let obj={
          "startIndex": 1,
          "count": 1,
          "criteria": []
          }
       postData(url,obj)
       .then((res)=>{
           this.setState({flLoading: false})
            this.setState({grpData:[]});
            if(res && res.data && res.data.ResponseCollection){
                if(this.state.editSurvey){
                    this.setEditGrp(res.data.ResponseCollection)
                }else{
                    this.setState({grpData:res.data.ResponseCollection,grpLoading:false})
                }
          
           
        }else{
          this.setState({grpData:[],grpLoading:false})
        }
       })
       }

    deleteSurvey(){
        if(this.state.selectedSurveyIds && this.state.selectedSurveyIds.length > 0){
            let ids=[];
            for(let i=0;i<this.state.selectedSurveyIds.length;i++){
                ids.push(this.state.selectedSurveyIds[i])
            }

            let obj={
                "surveyIDs":ids
            }

            postData("Survey/DeleteSurvey",obj)
            .then(res=>{
                if(res.data.ReturnCode === 0){
                    this.setState({surveyListData:[],selectedSurveyIds:[],activeLoading:true},()=>this.getSurveyAndQuestonList(true,-1))
                }
            })

        }else{
            this.setState({dlgtitle:"Information",message:"Please Select Survey",dlgType:"information",dlgEnable:true});
        }
    }

    addQuestionToSurvey(){
        if(this.state.radioCheck && this.state.radioCheck.length > 0){
            let temp = [];
            for(let i=0;i<this.state.radioCheck.length;i++){
                temp.push(this.state.questionListData[this.state.radioCheck[i]]);
            }
            console.log(temp)
            this.setState({addQuestionData:temp,addQuestion:false})
        }
    }
    activeStatusCont(){
        if(this.state.selectedSurveyIds && this.state.selectedSurveyIds.length > 0){
            this.setState({surveyStatus:true})
        }else{
            this.setState({dlgtitle:"Information",message:"Please Select Survey",dlgType:"information",dlgEnable:true});
        }
    }
    addQuestion(){
        if(this.state.qName === ""){
            this.setState({dlgtitle:"Information",message:"Enter the question",dlgType:"information",qustInfoDlg:true});
        }else if(this.state.rsp1 === "" || this.state.rsp1 === ""){
            this.setState({dlgtitle:"Information",message:"Enter the response",dlgType:"information",qustInfoDlg:true});
        }else{
            let quest=[
                {
                    "ID": "0",
                    "QuestionID": "0",
                    "Answer":this.state.rsp1,
                    "Count": "0",
                    "AssociateQuestion": [
                      
                    ]  
                },
                {
                    "ID": "0",
                    "QuestionID": "0",
                    "Answer":this.state.rsp2,
                    "Count": "0",
                    "AssociateQuestion": [
                      
                    ]  
                },
            ];
          
       if(this.state.rsp3 !== ""){
        let obj={
            "ID": "0",
            "QuestionID": "0",
            "Answer":this.state.rsp3,
            "Count": "0",
            "AssociateQuestion": [
              
            ]  
        }
        quest.push(obj)
       }
       if(this.state.rsp4 !== ""){
        let obj={
            "ID": "0",
            "QuestionID": "0",
            "Answer":this.state.rsp4,
            "Count": "0",
            "AssociateQuestion": [
              
            ]  
        }
        quest.push(obj)
       }
       if(this.state.rsp5 !== ""){
        let obj={
            "ID": "0",
            "QuestionID": "0",
            "Answer":this.state.rsp5,
            "Count": "0",
            "AssociateQuestion": [
              
            ]  
        }
        quest.push(obj)
       }
       let myObj={
        newQuestion:{
            Answers:quest,
            "AnswerType": 0,
            "AssociatedAnswers": [
              
            ],
            "ID": "0",
            "IsDeleted": "0",
            "Question": this.state.qName,
            "QuestionType":this.state.mChoice?"1":"0",
            "Status": "0",
            "SurveyName": ""
        
        }
       }
       postData("Question/AddQuestion",myObj)
       .then(res=>{
           if(res.data.ReturnCode === 0){
               this.setState({questInfo:false,qName:"",rsp1:"",rsp2:"",rsp3:"",rsp4:"",rsp5:"",mChoice:false},()=>this.getSurveyAndQuestonList(false,-1))
           }else{
            this.setState({questInfo:false,qName:"",rsp1:"",rsp2:"",rsp3:"",rsp4:"",rsp5:"",mChoice:false}) 
           }
       })
       .catch(e=>{
        this.setState({questInfo:false,qName:"",rsp1:"",rsp2:"",rsp3:"",rsp4:"",rsp5:"",mChoice:false}) 
       })
    }
}   

    changeSurveyStatus(){
        if(this.state.selectedSurveyIds && this.state.selectedSurveyIds.length > 0){
            let ids=[];
            for(let i=0;i<this.state.selectedSurveyIds.length;i++){
                ids.push(this.state.selectedSurveyIds[i])
            }

            let obj;
            if(parseInt(this.state.srStatus)=== 2){
                getData(this.tbsUrl[4]+this.state.selectedSurveyIds[0])
                .then(res=>{
                    if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                      obj={
                        "surveyIds":ids,
                        "groupIds":res.data.ResponseCollection,
                        "statusId":parseInt(this.state.srStatus),// current=0,draft=1,test=2
                        "tryAll":false
                    
                      };
                      this.setState({activeLoading:true},()=>this.changeStatus(obj))
                    }else{
                        this.setState({surveyStatus:false,activeLoading:false,dlgtitle:"Information",message:"Something went wrong please try again.",dlgType:"information",dlgEnable:true})
                    }
                })
            }else{
                obj={
                    "surveyIds":ids,
                    "groupIds":null,
                    "statusId":parseInt(this.state.srStatus),// current=0,draft=1,test=2
                    "tryAll":false
                
                }
                this.setState({activeLoading:true},()=>this.changeStatus(obj))
            }
           
           

        }
    }
    changeStatus(obj){
        postData("Survey/ChangeSurveyStatus",obj)
        .then(res=>{
            if(res.data.ReturnCode === 0){
                let tempData = this.state.surveyListData
                this.setState({surveyStatus:false,activeLoading:false, surveyListData:[],selectedSurveyIds:[],dlgtitle:"Information",message:"Status Updated Successfully",dlgType:"information",dlgEnable:true},()=>this.setState({surveyListData:tempData}))
            }else{
                this.setState({surveyStatus:false,activeLoading:false,dlgtitle:"Information",message:"Something went wrong please try again.",dlgType:"information",dlgEnable:true})
            }
        })
        .catch(e=>{
            this.setState({surveyStatus:false,activeLoading:false,dlgtitle:"Information",message:"Something went wrong please try again.",dlgType:"information",dlgEnable:true})
        })
    }

    deleteQuestion(){
        if(this.state.selectedQuestionIds && this.state.selectedQuestionIds.length > 0){
            let ids=[];
            for(let i=0;i<this.state.selectedQuestionIds.length;i++){
                ids.push(this.state.selectedQuestionIds[i])
            }
            let obj={
                "questionIDs":ids
                }
                
            postData("Question/GetSurveyDetailsForQuestion",obj)
            .then(res=>{
                if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                    console.log("================",res.data.ResponseCollection)
                    this.setState({dlgtitle:"Confiramtion",message:"",dlgType:"confirmation",msgRsp:res.data.ResponseCollection,dlgEnable:true}) 
                }else{
                    this.setState({dlgtitle:"Confiramtion",message:"Are you sure?",dlgType:"confiramtion",msgRsp:[],dlgEnable:true}) 
                }
                
            })

        }else{
            this.setState({surveyStatus:false,dlgtitle:"Information",message:"Something went wrong please try again.",dlgType:"information",dlgEnable:true})
        }
    }
    deleteQuestConfirm(){
        if(this.state.selectedQuestionIds && this.state.selectedQuestionIds.length > 0){
            let ids=[];
            for(let i=0;i<this.state.selectedQuestionIds.length;i++){
                ids.push(this.state.selectedQuestionIds[i])
            }
            let obj={
                "questionIDs":ids
                }
                
            postData("Question/DeleteQuestion",obj)
            .then(res=>{
                if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                    this.setState({dlgtitle:"Information",message:"Deleted Successfully",dlgType:"information",msgRsp:res.data.ResponseCollection,dlgEnable:true},()=>this.getSurveyAndQuestonList(false,-1)) 
                }else{
                    this.setState({dlgtitle:"Confiramtion",message:"Something went wrong please try again.",dlgType:"information",msgRsp:[],dlgEnable:true}) 
                }
                
            })

        }
    }
   
    setEditDataForSurvey(){
        getData(this.tbsUrl[0]+this.state.surveyID)
        .then(res=>{
            if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                this.setQuestionsForEdit(res.data.ResponseCollection)
            }
        });
        getData(this.tbsUrl[4]+this.state.surveyID)
        .then(res=>{
            if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                console.log("grp========================",res.data.ResponseCollection)
               this.setState({editGrp:res.data.ResponseCollection})
            }
        })
    }


    setGrpForStatus(){
        getData(this.tbsUrl[4]+this.state.surveyID)
        .then(res=>{
            if(res.data.ResponseCollection && res.data.ResponseCollection.length > 0){
                console.log("grp========================",res.data.ResponseCollection)
               this.setState({editGrp:res.data.ResponseCollection})
            }
        }) 
    }
 

    addSurvey(){
        let grpContainer=[];
        let QuestAns=[];
        let valid = -1;
        if(valid === -1){
            for(let i=0;i<this.state.grpIds.length;i++){
                let obj={
                    "groupID":this.state.grpData[this.state.grpIds[i]].Group_ADS_ID,
                    "groupName": this.state.grpData[this.state.grpIds[i]].Group_ADS_Name,
                    "Status": this.state.grpData[this.state.grpIds[i]].Status
    
                };
                grpContainer.push(obj);
            }
            for(let i=0;i<this.state.addQuestionData.length;i++){
                let childList=[];
                if(this.state.addQuestionData[i].AssociatedAnswers){
                    for(let j=0;j<this.state.addQuestionData[i].AssociatedAnswers.length;j++){
                        let obj1={
                            "AnswerID": this.state.addQuestionData[i].AssociatedAnswers[j].ID, //this is id of answer of question
                            "AnswerType": 0,
                            "AssociatedAnswersQuestion": null,
                            "childrenList": [],
                            "order": 0,
                            "QuestionID": this.state.addQuestionData[i].ID, //this is id of  question
                            "QuestionOrAns": this.state.addQuestionData[i].AssociatedAnswers[j].Answer, //this is aanswer title
                            "Type": 1
                        }
                        childList.push(obj1)
                    }
                    
                }
               
                let obj={
                    "AnswerID": 0,
                    "AnswerType": 1,
                    "AssociatedAnswersQuestion": null,
                    "childrenList": childList,
                    "order": 1,
                    "QuestionID":this.state.addQuestionData[i].ID,
                    "QuestionOrAns":this.state.addQuestionData[i].Question, //this is a question title
                    "Type":0,
    
                }
                QuestAns.push(obj);
            }
    
            let myObj={
                "newSurvey": {
                    "EndDate": moment(this.state.addEndDate).format("MM/DD/YYYY HH:mm:ss A"),
                    "EndDateString":  moment(this.state.addEndDate).format("MM/DD/YYYY"),
                    "ID": "0",
                    "Name": this.state.name,
                    "Order": this.state.order,
                    "StartDate": moment(this.state.addStrDate).format("MM/DD/YYYY HH:mm:ss A"),
                    "StartDateString":  moment(this.state.addStrDate).format("MM/DD/YYYY"),
                    "Status":this.state.adstatus,
                    "SurveyAssociateQuestions": null,
                    "SurveyGroupsList":grpContainer,
                    "SurveyQuestionsList":QuestAns,
                    "SurveyStatus": "0",
                    "Title": null        
                }
            }
            postData("Survey/AddSurvey",myObj)
            .then(res=>{
                if(res.data.ReturnCode === 0){
                    this.setState({questGrp:false,addSurvey:false,dlgtitle:"Information",message:"Added Successfully",dlgType:"Information",dlgEnable:true,name:"",order:1,addStrDate:new Date(),addEndDate:new Date(),adstatus:0,addQuestionData:[],grpIds:[],radioCheck:[]},()=>this.getSurveyAndQuestonList(true,-1)) 
                }else if(res.data.ReturnCode === 12){
                    this.setState({questGrp:false,addSurvey:false,grpIds:[],dlgtitle:"Information",message:"Survey exist with same order",dlgType:"Information",surveyScc:true}) 
                }else if(res.data.ReturnCode === 4){
                    this.setState({questGrp:false,addSurvey:false,grpIds:[],dlgtitle:"Information",message:"Survey name already exist",dlgType:"Information",surveyScc:true}) 
                }
            })
        }
    
    }

    editSurvey(){
        let grpContainer=[];
        let QuestAns=[];
        let valid = -1;
        if(valid === -1){
            for(let i=0;i<this.state.grpIds.length;i++){
                let obj={
                    "groupID":this.state.grpData[this.state.grpIds[i]].Group_ADS_ID,
                    "groupName": this.state.grpData[this.state.grpIds[i]].Group_ADS_Name,
                    "Status": this.state.grpData[this.state.grpIds[i]].Status
    
                };
                grpContainer.push(obj);
            }
            
    
            let myObj={
                "editSurvey": {
                    "EndDate": moment(this.state.addEndDate).format("MM/DD/YYYY HH:mm:ss A"),
                    "EndDateString":  moment(this.state.addEndDate).format("MM/DD/YYYY"),
                    "ID": this.state.selectedRow.ID,
                    "Name": this.state.name,
                    "Order": this.state.order,
                    "StartDate": moment(this.state.addStrDate).format("MM/DD/YYYY HH:mm:ss A"),
                    "StartDateString":  moment(this.state.addStrDate).format("MM/DD/YYYY"),
                    "Status":this.state.adstatus,
                    "SurveyAssociateQuestions": null,
                    "SurveyGroupsList":grpContainer,
                    "SurveyQuestionsList":[],
                    "SurveyStatus":this.state.selectedRow.SurveyStatus,
                    "Title": null        
                }
               
            }
            postData("Survey/EditSurvey",myObj)
            .then(res=>{
                if(res.data.ReturnCode === 0){
                    this.setState({questGrp:false,addSurvey:false,dlgtitle:"Information",message:"Updated",dlgType:"Information",dlgEnable:true,name:"",order:1,addStrDate:new Date(),addEndDate:new Date(),adstatus:0,addQuestionData:[],grpIds:[],radioCheck:[],editSurvey:false},()=>this.getSurveyAndQuestonList(true,-1)) 
                }else if(res.data.ReturnCode === 12){
                    this.setState({questGrp:false,addSurvey:false,grpIds:[],dlgtitle:"Information",message:"Something went wrong please try again",dlgType:"Information",surveyScc:true,editSurvey:false}) 
                }else if(res.data.ReturnCode === 4){
                    this.setState({questGrp:false,addSurvey:false,grpIds:[],dlgtitle:"Information",message:"Something went wrong please try again",dlgType:"Information",surveyScc:true,editSurvey:false}) 
                }
            })
        }
    }

    deleteQuestFromList(temp){
     if(this.state.deletQuestID !== -1){
        this.setState({addQuestionData:[]});
        let index = temp.findIndex(x => x.ID === this.state.deletQuestID);
        if(index >=0){
            temp.splice(index,1);
        }
        this.setState({addQuestionData:temp})
     }
    }

    keyPress(e,data){
        let temp;
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(e.keyCode == 13){
         temp=data;
         this.setState({emailData:[]},(e)=>{
             if( re.test(String(this.state.email).toLowerCase())){
                let temp1=temp
                let obj={
                    Email:this.state.email
                }
                temp1.push(obj)
                this.setState({emailData:temp1,email:""})
             }else{
                this.setState({dlgtitle:"Information",message:"Enter Valid Information",dlgType:"Information",emailValid:true}) 
             }
           
          
         })
       
    }
}

deleteEmail(index){
    let temp;
    temp=this.state.emailData;
    let temp1 =temp;
    this.setState({emailData:[]},()=>{
       temp1.splice(index,1) 
       this.setState({emailData:temp1})
    })
}


    render(){
        return(
            <div className="GeoZoneMainWrp">
                  {
                                this.state.surveyValid &&
                                 <div className="Loader">
                                     <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} onOk={()=>this.setState({surveyValid:false,addSurvey:true})} onHide={()=>this.setState({surveyValid:false,addSurvey:true})}/>
                                 </div>
                    }
                       {
                             this.state.surveyScc &&
                             <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} onOk={()=>this.setState({surveyScc:false,addSurvey:true})} onHide={()=>this.setState({surveyScc:false,addSurvey:true})}/>
                         }
                        
                  {
                    this.state.addSurvey ?
                     <div className="Loader">
                         <div className="SurveyAddwrp">
                            <div className="ForgPassTitle">Survey Details</div>
                            <div className="SurveyAddChild1">
                                <span>Required *</span>
                            </div>
                            <div className="SurveyAddChild2">
                                <span style={{marginLeft:"4.3%",marginRight:"1%"}}>Name *</span>
                                <input value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} disabled={this.state.editSurvey}></input>
                            </div>
                            <div className="SurveyAddChild2">
                                <span style={{marginLeft:"4.3%",marginRight:"1%"}}>Order *</span>
                                <input type={"number"} min={1} value={this.state.order} onChange={(e)=>this.setState({order:e.target.value})}></input>
                            </div>
                            <div className="SurveyAddChild2">
                                <span style={{marginLeft:"1%",marginRight:"1%"}}>Start Date *</span>
                                <DatePicker selected={new Date(this.state.addStrDate)}   onChange={(date)=>this.setState({addStrDate:date},()=>console.log(this.state.strDate))}  wrapperClassName="SurveyDatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            </div>
                            <div className="SurveyAddChild2">
                                <span style={{marginLeft:"1%",marginRight:"1.5%"}}>End Date *</span>
                                <DatePicker selected={new Date(this.state.addEndDate)}   onChange={(date)=>this.setState({addEndDate:date},()=>console.log(this.state.strDate))}  wrapperClassName="SurveyDatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            </div>
                            <div className="SurveyAddChild2">
                                <span style={{marginLeft:"4.3%",marginRight:"1%"}}>Status</span>
                                <div style={{width:"62px"}}>
                                    <select style={{"width":"100%"}} className="SchedDropDwn1" onChange={(e)=>{this.setState({adstatus:e.target.value})}} value={this.state.adstatus}>
                                        <option value={0}>Active</option>
                                        <option value={1}>Inactive</option>
                                        <option value={2}>Archive</option>
                                    </select>
                                </div>
                            </div>
                            {
                                !this.state.editSurvey && 
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"1%"}}>Add Question :</span>
                                    <div className="SurveyAddTbHead">
                                        <div className="SurveyRightBtnWrp" onClick={()=>this.setState({addQuestion:true},()=>{
                                            if(this.state.questionListData && this.state.questionListData.length === 0){
                                                this.getSurveyAndQuestonList(false,-1,"loading")
                                            }
                                        })}>Add Question</div>
                                        <div className="SurveyRightBtnWrp">Skip To Question</div>
                                        <div className="SurveyRightBtnWrp" onClick={()=>this.deleteQuestFromList(this.state.addQuestionData)}>Delete Question</div>
                                    </div>
                                </div>
                            }
                            <div className="SurveyAddTbWrp">
                                    <ReactTable
                                    data={this.state.addQuestionData} //left Table 
                                    columns={addQuestCol}
                                    loading={this.state.activeLoading}
                                    showPagination={false}
                                    sortable={false}
                                    minRows={10}
                                    TheadComponent={props => null}
                                    pageSize={this.state.addQuestionData.length}
                                    NoDataComponent={() => null}
                                    style={{
                                    height: "210px"
                                    }}
                                    getTrGroupProps={(state, rowInfo, column, instance) => { 
                                        if(rowInfo !== undefined){
                                          return { 
                                            onClick: (e, handleOriginal) =>{this.setState({deletQuestID:rowInfo.original.ID})},
                                              style:{
                                                  background:this.state.deletQuestID===rowInfo.original.ID?"#5ca0f2":""
                                              }
                                          }
                                         }
                                      }}
                                    getTheadFilterProps={(state, rowInfo, column, instance) => {
                                    return {
                                        style:
                                        { display: "none" }
                                    };
                                    }}
                                    SubComponent={(rowInfo)=><ReactTable
                                        data={this.state.addQuestionData[rowInfo.index].AssociatedAnswers} //left Table 
                                        columns={subCol1}
                                        loading={this.state.activeLoading}
                                        showPagination={false}
                                        filterable={false}
                                        sortable={false}
                                        minRows={5}
                                        pageSize={this.state.leftData ?this.state.leftData.length:5}
                                        TheadComponent={props => null}
                                        //pageSize={this.state.activeData.length}
                                        NoDataComponent={() => null}
                                    > 
                                    </ReactTable>}
                                
                                >                   
   
                               </ReactTable> 
                            </div>
                            <div className="SurveyAddChild2">
                                <div className="SurveyAddTbHead">
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.associateGrp()}>Next</div>
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.setState({addSurvey:false,name:"",order:1,addStrDate:new Date(),addEndDate:new Date(),adstatus:0,addQuestionData:[],grpIds:[],radioCheck:[],editSurvey:false})}>Cancel</div>
                                </div>
                            </div>
                         </div>
                         {
                             this.state.addQuestion && 
                             <div className="SurveyAddwrp1">
                                 <div className="ForgPassTitle">Select Question</div> 
                                 <ReactTable
                                        data={this.state.questionListData} //Add Question Table
                                        columns={this.addQstCol}
                                        loading={this.state.questLoading}
                                        showPagination={false}
                                        sortable={false}
                                        minRows={8}
                                        pageSize={this.state.questionListData.length}
                                        NoDataComponent={() => null}
                                        style={{
                                        height: "180px"
                                        }}
                                    
                                        getTheadFilterProps={(state, rowInfo, column, instance) => {
                                        return {
                                            style:
                                            { display: "none" }
                                        };
                                        }}
                                    
                                    >
    
                                </ReactTable>
                                <div className="SurveyAddChild2">
                                <div className="SurveyAddTbHead">
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.addQuestionToSurvey()}>Add</div>
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.setState({addQuestion:false})}>Close</div>
                                </div>
                            </div>
                             </div>
                         }
                      
                     </div>
                     : this.state.questGrp ?
                      <div className="Loader">
                           <div className="SurveyAddwrp3">
                                <div className="ForgPassTitle">Survey Details</div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"1%"}}>Select Group :</span>
                               </div>
                               <ReactTable
                                        data={this.state.grpData} //Add Question Table
                                        columns={this.grpCol}
                                        loading={this.state.grpLoading}
                                        showPagination={false}
                                        sortable={false}
                                        minRows={20}
                                        pageSize={this.state.grpData.length}
                                        NoDataComponent={() => null}
                                        style={{
                                        height: "380px"
                                        }}
                                    
                                        getTheadFilterProps={(state, rowInfo, column, instance) => {
                                        return {
                                            style:
                                            { display: "none" }
                                        };
                                        }}
                                    
                                    >
    
                                </ReactTable>
                                <div className="SurveyAddChild2">
                                <div className="SurveyAddTbHead">
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.setState({questGrp:false,addSurvey:true,grpIds:[]})}>Previous</div>
                                    <div className="SurveyRightBtnWrp" onClick={()=>{
                                        if(!this.state.editSurvey){
                                            this.addSurvey()
                                        }else{
                                            this.editSurvey()
                                        }
                                    }}>Save</div>
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.setState({questGrp:false,name:"",order:1,addStrDate:new Date(),addEndDate:new Date(),adstatus:0,addQuestionData:[],grpIds:[],radioCheck:[],editSurvey:false})}>Cancel</div>
                                </div>
                               </div>
                           </div>     
                      </div>
                      : this.state.surveyStatus ?
                        <div className="Loader">
                            <div className="SurveyChangeStsWrp">
                                 <div className="ForgPassTitle">Change Survey Status</div>
                                 <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"4.3%",marginRight:"1%"}}>Change Status to:</span>
                                    <div style={{width:"62px"}}>
                                        <select style={{"width":"100%"}} className="SchedDropDwn1" onChange={(e)=>{this.setState({srStatus:e.target.value})}} value={this.state.srStatus}>
                                            <option value={0}>Current</option>
                                            <option value={1}>Draft</option>
                                            <option value={2}>Test</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="SurveyAddChild3">
                                <div className="SurveyAddTbHead">
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.changeSurveyStatus()}>Update</div>
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.setState({surveyStatus:false})}>Cancel</div>
                                </div>
                               </div>
                            </div>
                        </div>
                      : this.state.questInfo ?
                        <div className="Loader">
                            <div className="SurveyAddwrp2">
                                 <div className="ForgPassTitle">Question Information</div>
                                 <div className="SurveyAddChild1">
                                        <span>Required *</span>
                                 </div>
                                 <div className="SurveyAddChild3">
                                    <span style={{marginLeft:"8%",marginRight:"1%"}}>Question *</span>
                                    <input value={this.state.qName} onChange={(e)=>this.setState({qName:e.target.value})} className="SurveyQuestInfoInpt"></input>
                                </div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"9%",marginRight:"1%"}}>Status</span>
                                    <div style={{width:"62px"}}>
                                        <select style={{"width":"100%"}} className="SchedDropDwn1" onChange={(e)=>{this.setState({adstatus:e.target.value})}} value={0} disabled={true}>
                                            <option value={0}>Active</option>
                                            <option value={1}>Inactive</option>
                                            <option value={2}>Archive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"4.3%",marginRight:"1%"}}>Response *</span>
                                    <input value={this.state.rsp1} onChange={(e)=>this.setState({rsp1:e.target.value})} className="SurveyQuestInfoInpt1"></input>
                                </div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"14.5%",marginRight:"1%"}}>*</span>
                                    <input value={this.state.rsp2} onChange={(e)=>this.setState({rsp2:e.target.value})} className="SurveyQuestInfoInpt1"></input>
                                </div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"15%",marginRight:"1%"}}></span>
                                    <input value={this.state.rsp3} onChange={(e)=>this.setState({rsp3:e.target.value})} className="SurveyQuestInfoInpt1"></input>
                                </div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"15%",marginRight:"1%"}}></span>
                                    <input value={this.state.rsp4} onChange={(e)=>this.setState({rsp4:e.target.value})} className="SurveyQuestInfoInpt1"></input>
                                </div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"15%",marginRight:"1%"}}></span>
                                    <input value={this.state.rsp4} onChange={(e)=>this.setState({rsp4:e.target.value})} className="SurveyQuestInfoInpt1"></input>
                                </div>
                                <div className="SurveyAddChild2">
                                    <span style={{marginLeft:"0.5%",marginRight:"1%"}}>Multiple Choice</span>
                                    <ComCheck  onChange={(e)=>this.setState({mChoice:e})}  containerStyle={"ComCheckMainWrp"} tickStyle={"SchedCheckTick"} checked={this.state.mChoice}></ComCheck>
                                </div>
                                <div className="SurveyAddChild2">
                                    <div className="SurveyAddTbHead">
                                        <div className="SurveyRightBtnWrp" onClick={()=>this.addQuestion()}>Add</div>
                                        <div className="SurveyRightBtnWrp" onClick={()=>this.setState({questInfo:false})}>Cancel</div>
                                    </div>
                               </div>
                            </div>
                            {
                                this.state.qustInfoDlg &&
                                 <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} onOk={()=>this.setState({qustInfoDlg:false})} onHide={()=>this.setState({qustInfoDlg:false})}/>
                            }
                        </div>
                        : this.state.updateGrp ?
                             <div className="Loader">
                                  <div className="SurveyAddwrp">
                                       <div className="ForgPassTitle">Update Survey Group</div>
                                       <div className="SurveyAddChild2">
                                           <span style={{marginLeft:"1%"}}>Select Group :</span>
                                      </div>
                                      <ReactTable
                                               data={this.state.grpData} //Add Question Table
                                               columns={this.grpCol}
                                               loading={this.state.grpLoading}
                                               showPagination={false}
                                               sortable={false}
                                               minRows={20}
                                               pageSize={this.state.grpData.length}
                                               NoDataComponent={() => null}
                                               style={{
                                               height: "380px"
                                               }}
                                               getTheadFilterProps={(state, rowInfo, column, instance) => {
                                               return {
                                                   style:
                                                   { display: "none" }
                                               };
                                               }}
                                           
                                           >
           
                                       </ReactTable>
                                       <div className="SurveyAddChild2">
                                       <div className="SurveyAddTbHead">
                                           <div className="SurveyRightBtnWrp">Save</div>
                                           <div className="SurveyRightBtnWrp" onClick={()=>this.setState({updateGrp:false,grpIds:[]})}>Cancel</div>
                                       </div>
                                      </div>
                                  </div>     
                             </div>
                      : this.state.emailRpt ?
                         <div className="Loader">
                            <div className="SurvetEmailWrp">
                                 <div className="ForgPassTitle">Send Email</div>
                                 <div className="SurveyEmailDtWrp">Enter email address in the text box and press enter to add the address to the mailing list below. Press send to send the mail.</div>
                                 <div className="SurveyEmailDtInptWrp">
                                    <span className="SurveyEmailDtTxt">Email</span>
                                    <input style={{width:"60%"}} onChange={(e)=>this.setState({email:e.target.value})} value={this.state.email} onKeyDown={(e)=>this.keyPress(e,this.state.emailData)}></input>
                                </div>
                                   <ReactTable
                                               data={this.state.emailData} //Add Question Table
                                               columns={this.emailCol}
                                               //loading={this.state.emailLoading}
                                               showPagination={false}
                                               sortable={false}
                                               minRows={10}
                                               pageSize={this.state.emailData.length}
                                               NoDataComponent={() => null}
                                               style={{
                                               height: "190px",
                                               marginTop:"10px"
                                               }}
                                               getTheadFilterProps={(state, rowInfo, column, instance) => {
                                               return {
                                                   style:
                                                   { display: "none" }
                                               };
                                               }}
                                           
                                 ></ReactTable>
                                 <div style={{width:"100%",marginTop:"10px",display:"flex",justifyContent:"flex-end",paddingRight:"30px"}}>
                                    <div className="SurveyAddTbHead">
                                            <div className="SurveyRightBtnWrp" disabled={this.state.emailData.length === 0}>Send</div>
                                            <div className="SurveyRightBtnWrp" onClick={()=>this.setState({emailRpt:false,emailData:[],email:""})}>Close</div>
                                    </div>
                                 </div>
                            </div>
                            {
                                this.state.emailValid && 
                                <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} onOk={()=>this.setState({emailValid:false})} onHide={()=>this.setState({emailValid:false})}/>
                            }
                         </div>       
                      : this.state.dlgEnable &&
                      <Dialog title={this.state.dlgtitle}  type={this.state.dlgType} message={this.state.message} msgRsp={this.state.msgRsp} onOk={()=>{
                          if(this.state.dlgType === "confirmation"){
                            this.setState({dlgEnable:false},()=>this.deleteQuestConfirm())
                          }else{
                            this.setState({dlgEnable:false})
                          }
                      }} onHide={()=>this.setState({dlgEnable:false})} onCancel={()=>this.setState({dlgEnable:false})}/>
                }
                <div className="SurveyRightTableWrp">
                    <div className="SurveyCollapseHead" onClick={() => this.setRightCol(true)}>
                        <span style={{ marginLeft: "5px" }}>Surveys</span>
                    </div>
                    {
                        this.state.active &&
                        <div>
                            <div className="SurveyCollapseHead1">
                                <div className="SurveyRightBtnWrp" onClick={()=>this.setState({addSurvey:true})}>Add</div>
                                <div className="SurveyRightBtnWrp" onClick={()=>this.deleteSurvey()}>Delete</div>
                                <div className="SurveyRightBtnWrp" onClick={()=>this.activeStatusCont()}>Change Survey Status</div>
                            </div>
                                <ReactTable
                                    data={this.state.surveyListData} //Right Table survey list
                                    columns={this.state.rightColumns}
                                    loading={this.state.activeLoading}
                                    filtered={this.state.rFiltered}
                                    showPagination={false}
                                    sortable={false}
                                    minRows={20}
                                    pageSize={this.state.surveyListData.length}
                                    NoDataComponent={() => null}
                                    style={{
                                    height: "400px",
                                    zIndex:"0px"
                                    }}
                                    getTrGroupProps={(state, rowInfo, column, instance) => { 
                                        if(rowInfo !== undefined){
                                            return{
                                                onDoubleClick:()=>{this.setState({activeLoading:false,name:rowInfo.original.Name,order:rowInfo.original.Order,addStrDate:new Date(moment(rowInfo.original.StartDate).format("MM/DD/YYYY")),addEndDate:new Date(moment(rowInfo.original.EndDate).format("MM/DD/YYYY")),adstatus:rowInfo.original.SurveyStatus,addSurvey:true,editSurvey:true},()=>this.setEditDataForSurvey())},
                                                onClick: (e, handleOriginal) =>{this.setState({surveyID:rowInfo.original.ID,selectedRow:rowInfo.original},()=>this.getSurveyData(this.state.tabIndex))},
                                                style:{
                                                    background:this.state.surveyID=== rowInfo.original.ID ? "#5ca0f2":"",
                                                  }
                                            }
                                        }
                                    }}
                                    getTheadFilterProps={(state, rowInfo, column, instance) => {
                                    return {
                                        style:
                                        { display: "none" }
                                    };
                                    }}
                                
                                >

                            </ReactTable>
                            </div>
                    
                    }
                     <div className="SurveyCollapseHead" onClick={() => this.setRightCol(false)}>
                        <span style={{ marginLeft: "5px" }}>Questions</span>
                     </div>
                     {
                                !this.state.active &&
                                <div>
                                <div className="SurveyCollapseHead1">
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.setState({questInfo:true})}>Add</div>
                                    <div className="SurveyRightBtnWrp" onClick={()=>this.deleteQuestion()}>Delete</div>
                                </div>
                                    <ReactTable
                                        data={this.state.questionListData} //Right Table 2  question list
                                        columns={this.state.rightColumns}
                                        loading={this.state.activeLoading}
                                        filtered={this.state.rFiltered}
                                        showPagination={false}
                                        sortable={false}
                                        minRows={20}
                                        pageSize={this.state.questionListData.length}
                                        NoDataComponent={() => null}
                                        style={{
                                        height: "400px"
                                        }}
                                        getTrGroupProps={(state, rowInfo, column, instance) => { 
                                            if(rowInfo !== undefined){
                                                return{
                                                    onClick: (e, handleOriginal) =>{this.setState({questID:rowInfo.original.ID,questName:rowInfo.original.Question},()=>this.getQuestDetails())},
                                                    style:{
                                                        background:this.state.questID=== rowInfo.original.ID ? "#5ca0f2":"",
                                                      }
                                                }
                                            }
                                        }}
                                        getTheadFilterProps={(state, rowInfo, column, instance) => {
                                        return {
                                            style:
                                            { display: "none" }
                                        };
                                        }}
                                    
                                    >
    
                                </ReactTable>
                        </div>
                            }
                </div>
                {
                    this.state.active ?
                    <div className="SurveyLeftWrp">
                    <div className="CabDtTabMainWrp1">
                    {
                        this.tabs1 && this.tabs.map((key,index)=>(
                        <div className={this.state.tabIndex === index ?"CabDtTabWrp1":"CabDtTabWrp"} onClick={()=>this.setLeftTab(index)} key={index}>{key}</div>
                        ))
                    }
                    </div>
                   {
                       (this.state.tabIndex === 1 || this.state.tabIndex === 2 || this.state.tabIndex === 3) ?
                       <div className="ScheduleTabToolWrp">
                            <div className='SchedHeadTxt'>From</div>
                            <DatePicker selected={new Date(this.state.strDate)}   onChange={(date)=>this.setState({strDate:date},()=>console.log(this.state.strDate))}  wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            <div className='SchedHeadTxt'>To</div>
                            <DatePicker selected={this.state.endDate}  onChange={(date)=>this.setState({endDate:date})} wrapperClassName="DatePickWrp" className="DatePickInptWrp" popperPlacement="right-start"></DatePicker>
                            <div className="SurveyRightBtnWrp1" onClick={()=>this.getSurveyData(this.state.tabIndex)}>Get Report</div>
                            {
                                this.state.tabIndex === 3 &&
                                <div className="ScheduleTableToolCont" onClick={()=>this.setState({emailRpt:true})}>
                                <div className="SurveyRightBtnWrp2">Email Report</div>
                                </div>
                            }
                            <ExportCSV csvData={this.state.leftData} fileName={this.state.exportFileName} visibleCol={this.state.leftColumns} isConversion={true} expButton={true}  />
                      </div>
                      :this.state.tabIndex === 4 &&
                      <div className="ScheduleTabToolWrp">
                             <div className="SurveyRightBtnWrp1" onClick={()=>this.setState({updateGrp:true},()=>this.getGrpData("GroupADSFL/Fetch"))}>Update Associate Group</div>
                      </div>
                   }
                   {
                       this.state.tabIndex === 0 &&  this.state.selectedRow && 
                       <div className="SurveyDisplayData">
                           <span>Status:{statusConst[this.state.selectedRow.Status]}</span>
                           <span style={{marginLeft:"120px"}}>Start Date:{moment(this.state.selectedRow.StartDate).format("MM/DD/YYYY")}</span>
                           <span style={{marginLeft:"120px"}}>End Date:{moment(this.state.selectedRow.EndDate).format("MM/DD/YYYY")}</span>
                       </div>
                   }
                   {
                     (this.state.tabIndex === 1 ||  this.state.tabIndex === 2 ||  this.state.tabIndex === 4) &&
                      <ReactTable //left Table 
                      loading={this.state.activeLoading}
                      columns={this.state.leftColumns}
                      data={this.state.leftData}
                      showPagination={false}
                      sortable={false}
                      minRows={20}
                      pageSize={this.state.leftData.length}
                     // TheadComponent={props => this.state.tabIndex === 4 && null}
                      NoDataComponent={() => null}
                      style={{
                      height: "410px"
                      }}
                  
                      getTheadFilterProps={(state, rowInfo, column, instance) => {
                      return {
                          style:
                          { display: "none" }
                      };
                      }}
                  
                  >                   
   
                  </ReactTable>
                  }
                 
                 {
                     this.state.tabIndex === 3 &&
                     <div style={{width:"100%",height:"100%",overflow:"auto"}}>
                         {
                             this.state.leftData && this.state.leftData.map((key,index)=>{
                                 return(
                                    <div style={{width:"100%"}} key={index}>
                                         <ReactTable
                                                data={this.state.mailData[index]} //Question details table
                                                columns={mailCol1}
                                                showPagination={false}
                                                sortable={false}
                                                minRows={1}
                                                //pageSize={this.state.activeData.length}
                                                NoDataComponent={() => null}
                                                style={{
                                                    height: "50px",
                                                    marginTop:"10px"
                                                }}

                                                getTheadFilterProps={(state, rowInfo, column, instance) => {
                                                    return {
                                                        style:
                                                            { display: "none" }
                                                    };
                                                }}

                                            ></ReactTable>
                                            <ReactTable
                                                data={this.state.leftData[index] ?this.state.leftData[index].Answers:[]} //Question details table
                                                columns={mailCol2}
                                                showPagination={false}
                                                sortable={false}
                                                minRows={1}
                                                //pageSize={this.state.activeData.length}
                                                NoDataComponent={() => null}
                                                style={{
                                                    height: "120px",
                                                }}

                                                getTheadFilterProps={(state, rowInfo, column, instance) => {
                                                    return {
                                                        style:
                                                            { display: "none" }
                                                    };
                                                }}

                                            ></ReactTable>
                                    </div>
                                 )
                             })
                         }
                     </div>
                 }
                   {
                       this.state.tabIndex === 0 &&
                       <div >
                       <ReactTable
                            data={this.state.leftData} //left Table 
                            columns={this.state.leftColumns}
                            loading={this.state.activeLoading}
                            showPagination={false}
                            sortable={false}
                            minRows={20}
                            TheadComponent={props => null}
                            //pageSize={this.state.activeData.length}
                            NoDataComponent={() => null}
                            style={{
                            height: "450px"
                            }}
                        
                            getTheadFilterProps={(state, rowInfo, column, instance) => {
                            return {
                                style:
                                { display: "none" }
                            };
                            }}
                            SubComponent={(rowInfo)=><ReactTable
                                data={this.state.leftData[rowInfo.index].childrenList} //left Table
                                columns={subCol}
                                loading={this.state.activeLoading}
                                showPagination={false}
                                filterable={false}
                                sortable={false}
                                minRows={5}
                                pageSize={this.state.leftData ?this.state.leftData.length:5}
                                TheadComponent={props => null}
                                //pageSize={this.state.activeData.length}
                                NoDataComponent={() => null}

                            >
                                
                            </ReactTable>}
                        
                        >                   
   
                   </ReactTable>
                       </div>
                  }
             
                </div>
                :
                <div className="SurveyLeftWrp">
                    <div className="CabDtTabMainWrp1">
                    {
                        this.tabs1 && this.tabs1.map((key,index)=>(
                        <div className={this.state.tabIndex === index ?"CabDtTabWrp1":"CabDtTabWrp"} onClick={()=>this.setLeftTab(index)} key={index}>{key}</div>
                        ))
                    }
                    </div>
                    <div className="SurveyQstDtWrp">
                        <div className="SurveyQstDtChild1">Question Details</div>
                        <div className="SurveyQstDtChild2">
                            <div className="SurveyQstDtChildHead">
                                <span>Question</span>
                                <span style={{marginLeft:"20px"}}>{this.state.questName}</span>
                            </div>
                            {
                                this.state.questRsp && this.state.questRsp.map((key,index)=>{
                                    return(
                                        <div className="SurveyQstDtChilddt" key={index}>
                                            <span>Response {index+1}</span>
                                            <span style={{marginLeft:"15px"}}>{key.Answer}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="SurveyQstDtWrp1">
                        <div className="SurveyQstDtChild1">Associated Surveys</div>
                        <div className="questiondetailsGrid">
                            <ReactTable
                                data={this.state.questInfoColl} //Question details table
                                columns={questionDtCol}
                                loading={this.state.activeLoading}
                                showPagination={false}
                                sortable={false}
                                minRows={10}
                                //pageSize={this.state.activeData.length}
                                NoDataComponent={() => null}
                                style={{
                                    height: "240px",
                                    marginTop:"10px"
                                }}

                                getTheadFilterProps={(state, rowInfo, column, instance) => {
                                    return {
                                        style:
                                            { display: "none" }
                                    };
                                }}

                            >

                            </ReactTable>
                        </div>


                    </div>
                                  
                </div>
                }
            </div>
        )
    }
}