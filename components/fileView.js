import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  StatusBar,
  ScrollView,
  WebView,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');


export default class fileView extends Component {
  mixins: [TimerMixin]
  constructor(props) {
    super(props);
    this.state = {
      uri:'',
    }
  }
  componentWillMount(){
    this.setState({uri:this.props.uri})
  }

  render(){
    return(
      <WebView
        scalesPageToFit={true}
        source={{uri: this.state.uri}}
        style={{marginTop: 20}}
      />
    )
  }
}


AppRegistry.registerComponent('fileView', () => fileView);
