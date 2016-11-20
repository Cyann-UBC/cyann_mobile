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


export default class comment extends Component {
  mixins: [TimerMixin]
  constructor(props) {
    super(props);
    this.state = {
      post:{},
    }
  }
  componentWillMount(){
    console.warn(this.props.id)
    this.setState({uri:this.props.uri})
  }
  componentDidMount(){
    fetch("http://localhost:3000/api/courses/"+this.props.id+"/posts",{method:"GET",
    headers:{
      'Authorization': 'Bearer '+this.props.jwt
    }
    })
    .then((response) => response.json())
    .then((responseData) => {
    //    console.warn(JSON.stringify(responseData.data))
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.posts)})
    })
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


AppRegistry.registerComponent('comment', () => comment);
