import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  AsyncStorage,
  StatusBar,
  TextInput,
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
      {courseName:'Lorem Ipsum?',comments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'a'},
      {courseName:'Lorem Ipsum?',comments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'b'},
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
      myCourse:[],
      showSearchBar: false,
    };
  }

  componentWillMount(){
    this.setState({courseList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.courseList)})
  }

  componentDidMount(){
    fetch('http://localhost:3000/api/courses',{method:"GET"})
    .then((response)=>response.json())
    .then((responseData)=>{
      console.warn(JSON.stringify(responseData))
      this.setState({courseList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
      this.setState({listSource:responseData.data})
    })


  }

  toggleSearchBar(){
    this.setState({showSearchBar:!this.state.showSearchBar})
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

  renderCourses(rowData){
    let courseContainerStyle = [styles.courseContainer, this.state.courseStyle]
    return(
      <TouchableOpacity onPress={() => this.gotoCourse(rowData.courseName)}>
      <Animatable.View animation="flipInY" style={this.state.courseStyle}>
        <Animatable.Text animation="fadeInUp" easing="ease-in" duration={500} delay={500} style={{color:'white',textAlign:'center',fontSize:20,fontWeight:'bold'}}>{rowData.courseName}</Animatable.Text>
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

                      placeholder='Tap here to search for courses'
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

  ifRenderScrollView(){
    if(!this.state.myCourse.length == 1){
      return(

          <ListView
            showsVerticalScrollIndicator={false}
            dataSource={this.state.courseList}
            renderRow={this.renderCourses.bind(this)}
            horizontal={false}
            removeClippedSubviews={true}/>


      )
    }else{
      var courses = this.state.courseList
      return(
        <ScrollView
          style={{flex:1,flexDirection:'row'}}
          contentContainer={{justifyContent:'center'}}
          horizontal ={true}
          pagingEnabled ={true}
          >
          {this.state.listSource.map(function(course, i){

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
               borderRadius:height/100,
               width:width/1.2,
               backgroundColor:'white',
               marginLeft:marginLeft,
               marginRight:marginRight,
               paddingLeft:20,
               paddingRight:20,
               paddingBottom:60,
             };

             var courseCardStyle=[containerStyle,this.state.containerStyle]
              return(
                <TouchableOpacity onPress={()=>this.gotoCourse(course._id)}>
                  <View obj={course} key={i} style={courseCardStyle} >

                    <View style={{width:width/1.5,paddingLeft:10}}>
                      <Text style={{color:'gray',fontSize:25,fontWeight:'600',margin:10}}>{course.courseName}</Text>
                    </View>

                    <View style={{width:width/1.5,paddingLeft:10}}>
                      <Text style={{color:'gray',fontSize:18,fontWeight:'600',margin:10}}>Professor</Text>
                      <Text style={{paddingLeft:10}}>Farshid Agharebparast</Text>
                    </View>


                    <View style={{width:width/1.5,paddingLeft:10}}>
                      <Text style={{color:'gray',fontSize:18,fontWeight:'600',margin:10}}>TAs</Text>
                      <View style={{flex:1,flexDirection:'row',flexWrap: 'wrap',paddingLeft:10}}>
                        {[course.TAs].map(function(TA, i){
                          return(
                            <Text>TA</Text>
                          )
                        },this)}
                      </View>

                    </View>
                  </View>
                </TouchableOpacity>
            )
          },this)}
        </ScrollView>
      )
    }
  }
  render() {

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          />

          <View style={this.state.mainContainer}>

            <TextInput
              multiline={true}
              style={{padding:10,height: 50,color:'white',fontSize:20,textAlign:'center'}}
              onChangeText={(text)=>this.setState({commentContent:text})}
              value={this.state.commentContent}
              autoFocus={true}
              placeholder="Search here to add a course"
              placeholderTextColor={'white'}
            />
              {this.ifRenderScrollView()}

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
        alignSelf: 'center',
        width:300,
        borderRadius:height/100,
        height: 50,
        backgroundColor: '#FFF',
        borderColor: 'lightblue',
        borderWidth: 1
    },


});

AppRegistry.registerComponent('courseList', () => courseList);
