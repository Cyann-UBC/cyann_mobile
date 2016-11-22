/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { Router, Scene,ActionConst } from 'react-native-router-flux';
import courseList from './components/courseList';
import course from './components/course';
import viewQuestion from './components/viewQuestion';
import fileView from './components/fileView';
import comment from './components/comment'
import login from './components/login';

export default class cyann_mobile extends Component {
  render() {
    return (
      <Router>
        <Scene hideNavBar={true}  key="courseList" duration={600} component={courseList} title="courseList"/>
        <Scene hideNavBar={true}  panHandlers={null} key="course" duration={600} animation="fade" component={course} title="course"/>
        <Scene hideNavBar={true}  key="viewQuestion" component={viewQuestion} duration={600} title="viewQuestion"/>
        <Scene hideNavBar={true}  key="fileView" component={fileView} duration={600} title="fileView"/>
        <Scene hideNavBar={true}  key="comment" component={comment} duration={600} title="comment"/>
        <Scene hideNavBar={true}  key="login" component={login} duration={600} title="login" initial={true}/>
      </Router>
    )
  }
}

AppRegistry.registerComponent('cyann_mobile', () => cyann_mobile);
