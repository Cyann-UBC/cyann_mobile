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
import { Router, Scene } from 'react-native-router-flux';
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
        <Scene hideNavBar={true}  type='reset' key="courseList" animation="fade" component={courseList} title="courseList" initial={true}/>
        <Scene hideNavBar={true}  panHandlers={null} key="course" duration={100} animation="fade" component={course} title="course"/>
        <Scene hideNavBar={true}  key="viewQuestion" component={viewQuestion} title="viewQuestion"/>
        <Scene hideNavBar={true}  key="fileView" component={fileView} title="fileView"/>
        <Scene hideNavBar={true}  key="comment" component={comment} title="comment"/>
        <Scene hideNavBar={true}  key="login" component={login} title="login" />
      </Router>
    )
  }
}

AppRegistry.registerComponent('cyann_mobile', () => cyann_mobile);
