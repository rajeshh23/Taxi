import React from 'react';
import { Router, Route} from 'react-router';
import {Link, BrowserRouter, HashRouter} from 'react-router-dom';
import Login from './Screens/Login/Login';  
import HomeScreen from './Screens/HomeScreen'

function App() {
  return (
    <HashRouter>
        <Route exact path = "/" component = {Login}/>
        <Route path="/HomeScreen" component={HomeScreen}/>
     </HashRouter>)
  
}

export default App;