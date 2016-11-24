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
import ActionButton from 'react-native-action-button';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
      <View>
        <WebView
          scalesPageToFit={true}
          source={{uri: this.state.uri,method:'GET',headers:{'Authorization': 'Bearer '+this.props.jwt}}}
          style={{height:height,width:width}}
        />
        <ActionButton position="right" text="answer" buttonColor="#26D3F2" verticalOrientation='down' degrees={90}
            onPress={()=>Actions.pop()}
            icon={<FontAwesomeIcon name={'arrow-left'} size={22} color='#f6f7fb'/>}>
          </ActionButton>
      </View>

    )
  }
}


AppRegistry.registerComponent('fileView', () => fileView);
