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
import { Router, Scene } from 'react-native-router-flux';
import courseList from './components/courseList';
import course from './components/course';
import viewQuestion from './components/viewQuestion';

export default class cyann_mobile extends Component {
  render() {
    return (
      <Router>
        <Scene hideNavBar={true}  type='reset' key="courseList" animation="fade" component={courseList} title="courseList" initial={true}/>
        <Scene hideNavBar={true}  panHandlers={null} key="course" duration={100} animation="fade" component={course} title="course"/>
        <Scene hideNavBar={true}  key="viewQuestion" component={viewQuestion} title="viewQuestion"/>
      </Router>
    )
  }
}

AppRegistry.registerComponent('cyann_mobile', () => cyann_mobile);
