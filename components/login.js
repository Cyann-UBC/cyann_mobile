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
  Animated,
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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
      buttonText:'',
      access_token:'',
      doneLogin:false,
      jwt:'',
    }
  }
  componentWillMount(){
    this.handleLogout()
      var _this = this
      AsyncStorage.getItem('jwt')
        .then(req => JSON.parse(req))
        .then(json => _this.setState({jwt:json}))
        .then(function(){
          FBLoginManager.getCredentials(function(error, data){
            // console.warn(JSON.stringify(data))
            if(data === null){
              _this.setState({user:null})
              _this.setState({buttonText:'login'})
            }else{
              _this.setState({user:data.credentials})
              _this.setState({buttonText:'logout'})
                 Actions.courseList({jwt:_this.state.jwt})
            }
            if (!error) {
              _this.setState({ user : data})
            }
          })
        })
        .catch(error => console.warn('error!'));

  }

  handleLogin(){
    var _this = this
    FBLoginManager.login(function(error, data){
      if (!error) {
        // console.warn(JSON.stringify(data.credentials.token))
        _this.setState({access_token: data.credentials.token})
        _this.setState({ user : data},_this.fetchUserInfo(data))
        // this.props.onLogin && _this.props.onLogin();
      } else {
        // console.warn('wtf')
        // console.warn(JSON.stringify(data))
        // console.warn(error, data);
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
          // console.log(error, data);
        }
      });
    }

  retreiveJWT(result){
    // console.warn(this.state.access_token)
    var body = {
    'userType': 'Student',
    'socialToken': this.state.access_token,
    'email':result.email,
    'profileImg':result.picture.data.url
    }

    var formBody = []
    // console.warn(JSON.stringify(body))
    for (var property in body) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch('http://localhost:3000/api/users/register',{method:'POST',headers: {'Content-Type': 'application/x-www-form-urlencoded'},body:formBody})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      AsyncStorage.setItem('jwt',JSON.stringify(responseData.data))
      .then(function(){
        console.warn(responseData.data)
        this.setState(jwt:responseData.data)

      })
      // AsyncStorage.setUserID('userId',responseData.data.userId)
    })
  }


    _responseInfoCallback=(error: ?Object, result: ?Object)=>{
  if (error) {
    alert('Error fetching data: ' + error.toString());
  } else {
    this.retreiveJWT(result)
    Actions.courseList({jwt:this.state.jwt})
    // console.warn(JSON.stringify(result))
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
  }

  render(){
    return(
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
            />
          <View></View>
          <Animatable.View animation={"fadeIn"} duration={500}>
            <Image style={{height:110,width:110}} resizeMode={Image.resizeMode.contain} source={require('../logo1.png')}/>
          </Animatable.View>
          <View>
            <Text style={{marginLeft:10,marginTop:-30,fontSize:27,fontWeight:'700',color:'white'}}>Cyann</Text>
          </View>
          <View></View>
          <View></View>
        <TouchableOpacity onPress={this.state.user===null?()=>this.handleLogin():()=>this.handleLogout()}>
          <View style={{width:width/1.5,height:70}}>
            <View style={{borderRadius:35,backgroundColor:'#26D3F2',flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
              <FontAwesomeIcon style={{marginRight:10}} name={'facebook-square'} color={'white'} size={37} />
              <Text style={{marginLeft:20,fontSize:27,fontWeight:'700',color:'white'}}>{this.state.user===null?"Login":"Logout"}</Text>
            </View>
          </View>

        </TouchableOpacity>
        <View></View>
        <View></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'space-around',
    backgroundColor:'#294a62',
    alignItems: 'center',
  },
})

AppRegistry.registerComponent('Login', () => Login);
