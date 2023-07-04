import React,{Component} from 'react';
import '../../Assets/StyleSheet.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

export default class MyLoader extends Component{
    render(){
        return(
            <div className="Loader">
                       <Loader
                        type="Oval"
                        color="#FFFFFF"
                        height={70}
                        width={70}
                        />
                   </div>
        )
    }
}