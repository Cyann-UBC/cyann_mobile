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
      jwt:'',
    }
  }


  componentWillMount(){
    // AsyncStorage.removeItem('jwt');
    this.handleLogout()
    var _this = this
    FBLoginManager.getCredentials(function(error, data){
      // //console.warn(JSON.stringify(data))
      if(data === null){
        _this.setState({user:null})
        _this.setState({buttonText:'login'})
        Actions.login()
      }else{
        if(AsyncStorage.getItem('jwt')){
          AsyncStorage.getItem('jwt')
            .then(req => JSON.parse(req))
            .then(json => _this.setState({jwt:json}))
            .then(function(){
              Actions.courseList({jwt:_this.state.jwt})
            })
            .catch((error)=>{
              if(error){
                //console.warn(error)
              }else{
                //console.warn("here")
                // _this.setState({user:data.credentials})
                // _this.setState({buttonText:'logout'})
              }
            })
        }
      }
      if (!error) {
        _this.setState({ user : data})
      }
    })




  }


      handleLogout(){
        var _this = this
        FBLoginManager.logout(function(error, data){
          if (!error) {
            //console.warn(JSON.stringify(data))
            _this.setState({ user : null});
            // this.props.onLogout && _this.props.onLogout();
          } else {
            // console.log(error, data);
          }
        });
      }
  render(){
    return(
      <View style={styles.container}>

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
