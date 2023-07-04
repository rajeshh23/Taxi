import React from 'react'
import Button from 'react-bootstrap/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportCSV = ({csvData, fileName,visibleCol,isConversion,callback}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let visibleData =[]

    const exportToCSV = (csvData, fileName) => {
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

        const ws = XLSX.utils.json_to_sheet(visibleData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (

            <img src={require('../Assets/Images/tools/export.jpg')} className="ScheduleToolImg" onClick={(e) => {exportToCSV(csvData,fileName);callback()}}></img>

    )
}