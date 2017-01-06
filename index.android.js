/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Router, Scene,ActionConst } from 'react-native-router-flux';
import courseList from './components/courseList';
import course from './components/course';
import viewQuestion from './components/viewQuestion';
import fileView from './components/fileView';
import login from './components/login';
import preLogin from './components/preLogin'

export default class cyann_mobile extends Component {
  render() {
    return (
      <Router>
        <Scene hideNavBar={true}  key="preLogin" component={preLogin} duration={500} title="preLogin" initial={true}/>
        <Scene hideNavBar={true}  key="login" component={login} duration={500} title="login"/>
        <Scene hideNavBar={true}  key="courseList" duration={500} component={courseList} title="courseList"/>
        <Scene hideNavBar={true}  panHandlers={null} key="course" duration={500} animation={"fade"} component={course} title="course"/>
        <Scene hideNavBar={true}  key="viewQuestion" component={viewQuestion} duration={500} title="viewQuestion"/>
        <Scene hideNavBar={true}  key="fileView" component={fileView} duration={500} title="fileView"/>
      </Router>
    )
  }
}

AppRegistry.registerComponent('cyann_mobile', () => cyann_mobile);
