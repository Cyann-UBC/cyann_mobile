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
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');


export default class Login extends Component {
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
      <View style={styles.container}>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    backgroundColor:'#2d3545',
    alignItems: 'center',
  },
})

AppRegistry.registerComponent('Login', () => Login);
