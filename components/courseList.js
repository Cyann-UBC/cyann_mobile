import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  StatusBar,
  ScrollView,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import {Motion, spring} from 'react-motion';
import * as Animatable from 'react-native-animatable';
if(!StyleSheet.flatten) {
  StyleSheet.flatten = require('flattenStyle');
}
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

var animations = {
  layout: {
    spring: {
      duration: 750,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 400,
      },
    },
    easeInEaseOut: {
      duration: 400,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  },
};


export default class courseList extends Component {
  mixins: [TimerMixin]
  constructor(props) {
    super(props);
    this.state = {
      container:{
        flex: 1,
        flexDirection:'row',
        justifyContent: 'center',
        backgroundColor:'#4fc1e9',
        alignItems: 'center',
      },
      courseStyle:{
        margin:30,
        marginBottom:20,
        padding:15,
        borderBottomColor:'white',
        borderBottomWidth:2
      },
    listStyle:{
      flex:1,
    },
    containerStyle:{},
    mainContainer:{height:height/2},
      courseList:[
        {name:'CPEN 321'},
        {name:'CPEN 281'},
        {name:'ELEC 221'},
        {name:'STAT 302'},
        {name:'ECON 101'}
      ],
      ssc:'',
      password:'',
      listSource:{},
      ifRenderList:false,
      commentSource:{},
      viewToggle:'list',
      selectedCourse:'',
    };
  }

  componentWillMount(){
    this.setState({listSource:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.courseList)})
  }

  componentDidMount(){
    // console.warn(JSON.stringify(this.state.listSource))
  }

  gotoCourse=(name)=>{
    LayoutAnimation.configureNext(animations.layout.spring)
    this.setState({selectedCourse:name})
    this.setState({containerStyle:{
      flex:1,
      width:width,
      backgroundColor:'white',
      borderRadius:20,
      marginLeft:0,
      marginRight:0,
      marginTop:-500,
      backgroundColor:"white",
      marginBottom:600,
    }})
    this.setState({mainContainer:{
      height:height
    }})
    setTimeout(()=>{this.setState({containerStyle:{
      flex:1,
      width:width,
      backgroundColor:'white',
      borderRadius:0,
      marginLeft:0,
      marginRight:0,
      marginTop:-500,
      backgroundColor:"#1BB5EC",
      marginBottom:600,
    }})},200)

    setTimeout(()=>{this.setState({viewToggle:'name'})},200)
    setTimeout(()=>{Actions.course({type:'reset'})},300)

  }

  renderRow(rowData){
    let courseContainerStyle = [styles.courseContainer, this.state.courseStyle]
    return(
      <TouchableOpacity onPress={() => this.gotoCourse(rowData.name)}>
      <Animatable.View  animation="flipInY" style={this.state.courseStyle}>
        <Animatable.Text animation="fadeInUp" easing="ease-in" duration={500} delay={500} style={{color:'white',textAlign:'center',fontSize:20,fontWeight:'bold'}}>{rowData.name}</Animatable.Text>
      </Animatable.View>
      </TouchableOpacity>
    )
  }

  render() {
    var courses = this.state.courseList
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
            />
          <View style={this.state.mainContainer}>
            <ScrollView
              horizontal ={true}
              pagingEnabled ={true}
              >
              {this.state.courseList.map(function(course, i){

                if(i==0){
                  var marginLeft=width/12;
                }
                else if(i==courses.length-1){
                  var marginLeft = width/10
                  var marginRight = width/10
                }
                else
                 var marginLeft=width/10;

                 var containerStyle = {
                   flex:1,
                   flexDirection:'column',
                   justifyContent:'space-around',
                   alignItems:'center',
                   borderRadius:20,
                   width:width/1.2,
                   backgroundColor:'white',
                   marginLeft:marginLeft,
                   marginRight:marginRight,
                   paddingLeft:20,
                   paddingRight:20,
                   paddingBottom:60
                 };

                 var courseCardStyle=[containerStyle,this.state.containerStyle]
                  return(
                    <TouchableOpacity onPress={()=>this.gotoCourse(course.name)}>
                      <View obj={course} key={i} style={courseCardStyle} >

                        <View style={{width:width/1.5,paddingLeft:10}}>
                          <Text>{course.name}</Text>
                        </View>

                        <View style={{width:width/1.5,paddingLeft:10}}>
                          <Text style={{margin:10}}>Professor</Text>
                          <Text style={{paddingLeft:10}}>blalala</Text>
                        </View>

                        <View style={{width:width/1.5,paddingLeft:10}}>
                          <Text style={{margin:10}}>TAS</Text>
                          <View style={{flex:1,flexDirection:'row',flexWrap: 'wrap',paddingLeft:10}}>
                            <Text style={{marginRight:15}}>blalala</Text>
                            <Text style={{marginRight:15}}>blalala</Text>
                            <Text style={{marginRight:15}}>blalala</Text>
                            <Text style={{marginRight:15}}>blalala</Text>
                            <Text style={{marginRight:15}}>blalala</Text>
                            <Text style={{marginRight:15}}>blalala</Text>
                            <Text style={{marginRight:15}}>blalala</Text>
                          </View>

                        </View>
                      </View>
                    </TouchableOpacity>
                )
              },this)}
            </ScrollView>
          </View>


      </View>
    );
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  courseCard:{

  }


});

AppRegistry.registerComponent('courseList', () => courseList);
