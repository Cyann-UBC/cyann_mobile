import React, { PropTypes, Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  StatusBar,
  ScrollView,
  AsyncStorage,
  WebView,
  Image,
  Text,
  View
} from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons'

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
      imgurl:'',
      user:'',
      buttonText:''
    }
  }
  componentWillMount(){
      var _this = this
    FBLoginManager.getCredentials(function(error, data){
      console.warn(JSON.stringify(data))
      if(data === null){
        _this.setState({user:null})
        _this.setState({buttonText:'login'})
      }else{
        _this.setState({user:data.credentials})
        _this.setState({buttonText:'logout'})
      //  Actions.courseList()
      }
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
        _this.setState({ user : data},_this.fetchUserInfo(data))
        // this.props.onLogin && _this.props.onLogin();
      } else {
        console.warn('wtf')
        console.warn(JSON.stringify(data))
        console.warn(error, data);
      }
    })
  }


    handleLogout(){
      var _this = this
      FBLoginManager.logout(function(error, data){
        if (!error) {
          console.warn(JSON.stringify(data))
          _this.setState({ user : null});
          // this.props.onLogout && _this.props.onLogout();
        } else {
          console.log(error, data);
        }
      });
    }

  retreiveJWT(){

  }
    _responseInfoCallback=(error: ?Object, result: ?Object)=>{
  if (error) {
    alert('Error fetching data: ' + error.toString());
  } else {
    this.retreiveJWT()
    console.warn(JSON.stringify(result))
    this.setState({imgurl:result.picture.data.url})
    alert('Success fetching data: ' + result.toString());
  //  Actions.courseList()
  }
}
  fetchUserInfo(data){

    const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: data.credentials.token,
                  parameters: {
                    fields: {
                      string: 'email,name,first_name,middle_name,last_name,picture'
                    }
                  }
                },
                this._responseInfoCallback
              )
              new GraphRequestManager().addRequest(infoRequest).start()

    // var _this = this
    //  fetch('https://graph.facebook.com/v2.8/me?access_token='+data.credentials.token +'?fields=picture')
    //  .then((response) => response.json())
    //  .then((responseData) => {
    //      console.warn(JSON.stringify(responseData))
    //  })
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
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
            />
      <TouchableOpacity onPress={this.state.user===null?()=>this.handleLogin():()=>this.handleLogout()}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Ionicon style={{marginRight:10}} name={'logo-facebook'} color={'white'} size={30} />
            <Text style={{fontSize:19,fontWeight:'700',color:'white'}}>{this.state.user===null?"Login":"Logout"}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    backgroundColor:'#4fc1e9',
    alignItems: 'center',
  },
})

AppRegistry.registerComponent('Login', () => Login);
