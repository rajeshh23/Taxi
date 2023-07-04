import React from 'react'
import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportCSV = ({csvData, fileName,visibleCol,isConversion,callback,expButton}) => {
    console.log("call ExportCSV",csvData)
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let visibleData =[]
    const loopType=["AdLoop","","WelcomeLoop","GoodByLoop","Payment Loop"];
    const dataChannel=["ALL","NBC","NYCM"];
    const FileType=["Video","Banner"];
    const statusType=["Scheduled","Upgrade Successfull","Yet to be scheduled"];
    const exportToCSV = (csvData, fileName) => {
        console.log("visibleCol",visibleCol)
        console.log("csvData",csvData)
        visibleData = csvData;
        let datakeys=[]
        if(visibleCol){
            visibleData.forEach(function (item) {
                datakeys =  Object.keys(item);
                datakeys.forEach(function (key) {
                    let ispresent=false;
                    if(key=="IndexType"){
                        key = "Loop Type";
                    }
                    visibleCol.forEach(function (visibleitem) {
                        if(visibleitem.accessor){
                            if(key == visibleitem.accessor){
                                ispresent = true;
                            }else{
                               if(key == "FileGroups" || key=="FileGeoZones"){
                                   ispresent = true;
                               }
                            }
                        }

                    })
                    if(ispresent){

                    }else{
                        delete item[key];
                    }
                })




            })
            console.log("visibleData",visibleData)

        }
        if(isConversion){
            console.log("is conversion");
            visibleData.forEach(function (item) {
                if(item.IndexType>=0){
                    item.IndexType = loopType[item.IndexType];
                }
                if(item.Channel>=0){
                    item.Channel = dataChannel[item.Channel];
                }
                if(item.FileType>=0){
                    item.FileType = FileType[item.FileType];
                }
                if(item.Group_ADS_NAME>=0){
                    let str = "";
                    if(item.FileGroups && item.FileGroups.length>0){
                        for(var i=0;i<item.FileGroups.length;i++){
                            str+= item.FileGroups[i].Group_ADS_Name+", "
                        }
                    }
                    item.Group_ADS_NAME = str;
                    delete item["FileGroups"];
                }




                if (item.FileGeoZones && item.FileGeoZones.length > 0) {
                    let str = "";
                    for (var i = 0; i < item.FileGeoZones.length; i++) {
                        str += item.FileGeoZones[i].Name + ", "
                    }
                    item.GeoZones = str;
                    delete item["FileGeoZones"];

                }

                if(item.status>=0){

                    var status = statusType[item.status];
                    if(status){
                        item.status =status;
                    }
                }



            })
            console.log("visibleData1",visibleData)
        }
        const ws = XLSX.utils.json_to_sheet(visibleData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    if(expButton && expButton === true){
        return (
            <div className="ScheduleTableToolCont" onClick={(e) => {exportToCSV(csvData,fileName);}}>
            <div className="SurveyRightBtnWrp1">Export To Excel</div>
            </div>

    )
    }else{
        return (
            <img src={require('../Assets/Images/tools/export.jpg')} className="ScheduleToolImg" onClick={(e) => {exportToCSV(csvData,fileName);callback()}}></img>

        )
    }
   
}