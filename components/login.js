import React, { PropTypes, Component } from 'react';
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
var {FBLogin, FBLoginManager,FBLoginView} = require('react-native-facebook-login');
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
      user:'',
    }
  }
  componentWillMount(){
      var _this = this
    FBLoginManager.getCredentials(function(error, data){
      console.warn(JSON.stringify(data))
      if (!error) {
        _this.setState({ user : data})
      }
    })
  }

  handleLogin(){
    var _this = this
    FBLoginManager.login(function(error, data){
      if (!error) {
        console.warn(JSON.stringify(data))
        _this.setState({ user : data});
        // this.props.onLogin && _this.props.onLogin();
      } else {
        console.warn('wtf')
        console.warn(JSON.stringify(data))
        console.warn(error, data);
      }
    });
  }


    handleLogout(){
      var _this = this
      FBLoginManager.logout(function(error, data){
        if (!error) {
          _this.setState({ user : null});
          // this.props.onLogout && _this.props.onLogout();
        } else {
          console.log(error, data);
        }
      });
    }
/*
the commented code could be used for alternaive for another login mechanism
*/

/*
login button:
<FBLogin style={{ marginBottom: 10, }}
  ref={(fbLogin) => { this.fbLogin = fbLogin }}
  permissions={["email","user_friends"]}
  loginBehavior={FBLoginManager.LoginBehaviors.Native}
  onLogin={(data)=>this.onLogin(data)}
  onLogout={()=>this.onLogout()}
  onLoginFound={(data)=>this.onLoginFound(data)}
  onLoginNotFound={()=>this.onLoginNotFound()}
  onError={(data)=>this.onError(data)}
  onCancel={()=>this.onCancel()}
  onPermissionsMissing={(data)=>this.onPermissionsMissing(data)}
/>
*/

/*
login methods
onLogin(data){
  console.warn("logged in!")
  console.warn(JSON.stringify(data))
  this.setState({user:data.credentials})
}

onLogout(){
  console.warn("logged out")
  this.setState({user:null})
}

onLoginFound(data){
  console.warn('existing login found')
  console.warn(JSON.stringify(data))
  this.setState({user:data.credentials})
}

onLoginNotFound(){
  console.warn("no user logged in ")
  this.setState({user:null})
}

onError(data){
  console.warn("error")
  console.warn(JSON.stringify(data))
}

onCancel(){
  console.warn("user cancelled")
}

onPermissionsMissing(data){
  console.warn("check permissions")
  console.warn(JSON.stringify(data))
}
*/

  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleLogin.bind(this)}>
          <View style={{backgroundColor:'red',width:10,height:10}}></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleLogout.bind(this)}>
          <View style={{backgroundColor:'blue',width:10,height:10}}></View>
        </TouchableOpacity>
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
