import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  AsyncStorage,
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
var AutoComplete = require('react-native-autocomplete');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

var animations = {
  layout: {
    spring: {
      duration: 850,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 900,
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
    mainContainer:{flex:1,flexDirection:'column',height:height/2,justifyContent:'space-around',},
      courseList:[
        {name:'CPEN 321'},
        {name:'CPEN 281'},
        {name:'ELEC 221'},
        {name:'STAT 302'},
        {name:'ECON 101'}
      ],
      password:'',
      listSource:[
        {name:'CPEN 321'},
        {name:'CPEN 281'},
        {name:'ELEC 221'},
        {name:'STAT 302'},
        {name:'ECON 101'}
      ],
      ifRenderList:false,
      commentSource:{},
      viewToggle:'list',
      selectedCourse:'',
      courseList:[],
      myCourse:[],
      showSearchBar: true,
    };
  }

  componentWillMount(){
    fetch('http://localhost:3000/api/courses',{method:"GET"})
    .then((response)=>response.json())
    .then((responseData)=>{
      console.warn(JSON.stringify(responseData))
      this.setState({courseList:responseData.data})
      this.setState({listSource:responseData.data})
    })
  }

  componentDidMount(){

  }

  gotoCourse=(id)=>{
    LayoutAnimation.configureNext(animations.layout.spring)
    this.setState({selectedCourse:id})
    this.setState({showSearchBar:false})
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
    setTimeout(()=>{Actions.course({type:'reset',id:id})},300)

  }

  renderRow(rowData){
    let courseContainerStyle = [styles.courseContainer, this.state.courseStyle]
    return(
      <TouchableOpacity onPress={() => this.gotoCourse(rowData.name)}>
      <Animatable.View animation="flipInY" style={this.state.courseStyle}>
        <Animatable.Text animation="fadeInUp" easing="ease-in" duration={500} delay={500} style={{color:'white',textAlign:'center',fontSize:20,fontWeight:'bold'}}>{rowData.name}</Animatable.Text>
      </Animatable.View>
      </TouchableOpacity>
    )
  }
  onTyping=(text)=> {

          var courses = this.state.listSource.filter(function (course) {
              return course.courseName.toLowerCase().startsWith(text.toLowerCase())
          }).map(function (course) {
              return course.courseName;
          });

          this.setState({
              data:  courses
          });
      }
  ifRenderList(){
    if(this.state.showSearchBar === true){
      return(
        <View style={{marginBottom:20,position:'relative'}}>
          <AutoComplete
                      onTyping={this.onTyping}
                      onSelect={(e) => AlertIOS.alert('You choosed', e)}
                      onBlur={() => console.warn('a')}
                      onFocus={() => console.warn('b')}
                      onSubmitEditing={(e) => AlertIOS.alert('onSubmitEditing')}
                      onEndEditing={(e) => AlertIOS.alert('onEndEditing')}
                      autoCorrect={false}
                      suggestions={this.state.data}

                      placeholder='This is a great placeholder'
                      style={styles.autocomplete}
                      clearButtonMode='always'
                      returnKeyType='go'
                      textAlign='center'
                      clearTextOnFocus={true}

                      maximumNumberOfAutoCompleteRows={10}
                      applyBoldEffectToAutoCompleteSuggestions={true}
                      reverseAutoCompleteSuggestionsBoldEffect={true}
                      showTextFieldDropShadowWhenAutoCompleteTableIsOpen={false}
                      autoCompleteTableViewHidden={false}

                      autoCompleteTableBorderColor='lightblue'
                      autoCompleteTableBackgroundColor='azure'
                      autoCompleteTableCornerRadius={10}
                      autoCompleteTableBorderWidth={1}

                      autoCompleteRowHeight={35}

                      autoCompleteFontSize={15}
                      autoCompleteRegularFontName='Helvetica Neue'
                      autoCompleteBoldFontName='Helvetica Bold'
                      autoCompleteTableCellTextColor={'red'}
                  />
        </View>

      )
    }else{
      return(
        null
      )
    }
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
            <View >
              {this.ifRenderList()}
            </View>

          </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
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

  },
  autocomplete: {
        alignSelf: 'stretch',
        height: 50,
        backgroundColor: '#FFF',
        borderColor: 'lightblue',
        borderWidth: 1
    },


});

AppRegistry.registerComponent('courseList', () => courseList);
