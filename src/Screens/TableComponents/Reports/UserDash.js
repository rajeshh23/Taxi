import React, {Component} from 'react';
import '../../../Assets/StyleSheet.css';
import {getData,postData} from "../../../Services/MainServices";

const paneStyle = {
    width: '80%',
    height: '50%',
    top: '25%',
    left: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
};
 
const buttonStyle = {
        paddingLeft: 10,
        textAlign: 'center'
};

export default class UserDash extends Component{
    constructor(props){
         super(props);
         this.state={
            minimize: false
         }
        
        }  
        
        componentDidMount(){
          
        }

        

 
  
    render(){
        return(
           <div>
            
           </div>
        )
    }
}