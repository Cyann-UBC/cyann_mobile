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
  Image,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import {Motion, spring} from 'react-motion';
import * as Animatable from 'react-native-animatable';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';

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
    allCourseList:[
      {courseName:'Lorem Ipsum?',comments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'a'},
      {courseName:'Lorem Ipsum?',ccomments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'b'},
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
      courseObjects:[],
      showSearchBar: false,
      query:'',
      allCourseList:[],
      allCourseFilter:[],
      userAddCourseSwitch:false,
      renderPlus:true,
      userList:[],
      showUserList:false,
    };
  }

  componentWillMount(){
    this.getAllCourses()
    this.getUserCourses()
    AsyncStorage.getItem('courseObjects')
      .then(req => JSON.parse(req))
      .then(json => this.setState({courseObjects:json}))
      .catch(error => console.log('error!'));

    this.setState({allCourseList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.allCourseList)})
  }

  /*
    note to self: when using the production build, change responseData to responseData.data
  */
  componentDidMount(){

  }

  getAllCourses(){
    fetch('http://localhost:3000/api/courses',{method:"GET",headers: {'Authorization': 'Bearer '+this.props.jwt.token}})
    .then((response)=>response.json())
    .then((responseData)=>{
      //console.warn(JSON.stringify(responseData))
      this.setState({allCourseList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
      //  console.warn("all course: "+JSON.stringify(responseData))
      this.setState({allCourseFilter:responseData.data})
    })
  }
  getUserCourses(){
    fetch('http://localhost:3000/api/users/5830e5127e74713d73206139/courseData',{method:"GET",headers: {'Authorization': 'Bearer '+this.props.jwt.token}})
    .then(response=>response.json())
    .then(responseData=>{
      console.warn(JSON.stringify(responseData))
      this.setState({myCourse:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData)})
      this.setState({listSource:responseData})
    })
  }

  getListofUser(id){
    fetch('http://localhost:3000/api/courses/users/'+id,{method:"GET",headers:{'Authorization': 'Bearer '+this.props.jwt.token}})
    .then(response=>response.json())
    .then(responseData=>{
      this.setState({userList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData)})
      console.warn(JSON.stringify(responseData))
      this.setState({showUserList:true})
    })
  }

  filterCourses=(query)=>{
    var courses = this.state.allCourseFilter;
    var result = [];
    var query = query;

    var filtered = courses.filter(function(course){
      return course.courseName.toLowerCase().startsWith(query.toLowerCase())
    })

    this.setState({allCourseList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(filtered)})
    console.warn(JSON.stringify(filtered))
  }

  toggleSearchBar(){
    this.setState({showSearchBar:!this.state.showSearchBar})
  }

  gotoCourse=(id)=>{
    LayoutAnimation.configureNext(animations.layout.spring)
    this.setState({selectedCourse:id})
    this.setState({showSearchBar:false})
    this.setState({renderPlus:false})
    this.setState({containerStyle:{
      flex:1,
      width:width,
      backgroundColor:'white',
      borderRadius:20,
      marginLeft:0,
      marginRight:0,
      marginTop:-100,
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
      marginTop:-300,
      backgroundColor:"#18bdd6",
      marginBottom:600,
    }})},200)

    setTimeout(()=>{this.setState({viewToggle:'name'})},200)
    setTimeout(()=>{Actions.course({type:'reset',id:id,jwt:this.props.jwt})},300)

  }

  addCourse(id){
    fetch('http://localhost:3000/api/courses/addUser/'+id,{method:"PUT",headers: {'Authorization': 'Bearer '+this.props.jwt.token}})
    .then((response)=>response.json())
    .then((responseData)=>{
       console.warn(JSON.stringify(responseData))
       this.getUserCourses()
       this.setState({userAddCourseSwitch:false})
    })
  }

  emailUser=(to)=>{
    Communications.email(to,null,null,'email from Cyann User','')
  }
  renderUserList(rowData){
    return(
      <TouchableOpacity onPress={()=>this.emailUser(rowData.email)}>
      <Animatable.View animation="flipInY" style={{paddingRight:30,paddingLeft:30,height:80,flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginLeft:10,marginRight:10,marginTop:17,paddingLeft:10,borderBottomWidth:2,borderBottomColor:'white'}}>
        <View style={{flex:1,flexDirection:'row',justifyContent:"flex-start",alignItems:"center"}}>
          <Animatable.Image
            animation="fadeInLeft" easing="ease-in" duration={500} delay={500}
            style={{width: 36, height: 36,borderRadius:18}}
            source={{uri: rowData.profileImg}}
          />
        <Animatable.Text animation="fadeInLeft" easing="ease-in" duration={500} delay={500} style={{marginLeft:10,color:'white',textAlign:'center',fontSize:16,fontWeight:'500'}}>{rowData.name}</Animatable.Text>
        </View>
        <View style={{height:30,width:75}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:"space-around"}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <Animatable.View animation="fadeInRight" easing="ease-in" duration={500} delay={500} >
                <FontAwesomeIcon name="star-o" size={27} color={'white'}/>
              </Animatable.View>
              <Animatable.Text animation="fadeInRight" easing="ease-in" duration={500} delay={500} style={{marginLeft:3,marginTop:5,color:'white'}}>{rowData.honour}</Animatable.Text>
            </View>
            <Animatable.View animation="fadeInRight" easing="ease-in" duration={500} delay={500} >
              <FontAwesomeIcon name="commenting-o" size={27} color={'white'}/>
            </Animatable.View>
          </View>
        </View>


      </Animatable.View>
      </TouchableOpacity>
    )
  }
  renderCourses(rowData){
    let courseContainerStyle = [styles.courseContainer, this.state.courseStyle]
    return(
      <TouchableOpacity onPress={()=>this.addCourse(rowData._id)}>
      <Animatable.View animation="flipInY" style={{paddingRight:30,paddingLeft:30,height:80,flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginLeft:10,marginRight:10,marginTop:17,paddingLeft:10,borderBottomWidth:2,borderBottomColor:'white'}}>
        <Animatable.Text animation="fadeInUp" easing="ease-in" duration={500} delay={500} style={{color:'white',textAlign:'center',fontSize:20,fontWeight:'bold'}}>{rowData.courseName}</Animatable.Text>
        <Animatable.View animation="fadeInUp" easing="ease-in" duration={500} delay={500} >
          <FontAwesomeIcon name="plus" size={27} color={'white'}/>
        </Animatable.View>
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

  ifRenderPlus(){
    if(this.state.renderPlus){
      return(
        <TouchableOpacity onPress={()=>this.setState({userAddCourseSwitch:true})}>
          <FontAwesomeIcon name={'plus'} color={'#e2faff'} size={27} style={{marginLeft:320,marginBottom:20}}/>
        </TouchableOpacity>
      )
    }else{
      return(
        null
      )
    }
  }
  ifRenderScrollView(){
    LayoutAnimation.configureNext(animations.layout.spring)
    if(this.state.myCourse.length == 0 || this.state.userAddCourseSwitch == true && this.state.showUserList == false){
      return(
        <View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <TextInput
              style={{padding:10,height: 50,color:'white',fontSize:20,textAlign:'center',width:200}}
              onChangeText={(text)=>this.filterCourses(text)}
              value={this.state.commentContent}
              autoFocus={true}
              placeholder="Tap here to search"
              placeholderTextColor={'white'}
            />
          <TouchableOpacity onPress={()=>this.setState({userAddCourseSwitch:false})}>
              <FontAwesomeIcon name='times' color={'white'} size={27} style={{marginLeft:20}}/>
            </TouchableOpacity>
          </View>

        <View style={{height:height/2}}>
          <ListView
            showsVerticalScrollIndicator={false}
            dataSource={this.state.allCourseList}
            renderRow={this.renderCourses.bind(this)}
            horizontal={false}
            removeClippedSubviews={true}/>
        </View>

        </View>
      )
    }else if(this.state.showUserList){
      return(
        <View>
          <TouchableOpacity onPress={()=>this.setState({showUserList:false})}>
            <FontAwesomeIcon name='times' color={'white'} size={27} style={{marginLeft:20}}/>
          </TouchableOpacity>
          <View style={{height:height/2}}>
            <ListView
              showsVerticalScrollIndicator={false}
              dataSource={this.state.userList}
              renderRow={this.renderUserList.bind(this)}
              horizontal={false}
              removeClippedSubviews={true}/>
          </View>
        </View>
      )
    }else{
      var courses = this.state.listSource
      return(
        <View>
          {this.ifRenderPlus()}


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
               var marginLeft=width/6;

               var containerStyle = {
                 flex:1,
                 flexDirection:'column',
                 justifyContent:'space-around',
                 alignItems:'center',
                 borderRadius:height/100,
                 width:width/1.2,
                 backgroundColor:'#e2faff',
                 marginLeft:marginLeft,
                 marginRight:marginRight,
                 paddingLeft:20,
                 paddingRight:20,
                 paddingBottom:60,
               };
               var instructors = ['Farshid Agharebparast','Sathish Gopalakrishnan']
               var TAs = ['Bader Alahmad','John Deppe','Bibek Kaur','Theresa Mammarella','Nick Mulvenna']
               var courseCardStyle=[containerStyle,this.state.containerStyle]
                return(
                  <TouchableOpacity onPress={()=>this.gotoCourse(course._id)}>
                    <View obj={course} key={i} style={courseCardStyle} >

                      <View style={{width:width/1.5,marginBottom:10}}>
                        <Text style={{color:'gray',fontSize:25,fontWeight:'600',margin:10,textAlign:'center'}}>{course.courseName}</Text>
                      </View>


                      <View style={{height:70,width:width/1.5,paddingLeft:10,marginBottom:25}}>
                        <Text style={{color:'gray',fontSize:18,fontWeight:'600',margin:10}}>Instructors</Text>
                        <View style={{flex:1,flexDirection:'row',flexWrap: 'wrap',paddingLeft:10}}>
                          {instructors.map(function(instructor, i){
                            return(
                              <Text style={{color:'gray',fontSize:13,fontWeight:'500',marginRight:15}}>{instructor}</Text>
                            )
                          },this)}
                        </View>
                      </View>

                      <View style={{height:100,width:width/1.5,paddingLeft:10,marginBottom:25}}>
                        <Text style={{color:'gray',fontSize:18,fontWeight:'600',margin:10}}>TAs</Text>
                          <View>
                            <View style={{flex:1,flexDirection:'row',flexWrap: 'wrap',paddingLeft:10}}>
                              {TAs.map(function(TA, i){
                                return(
                                  <Text style={{height:20,color:'gray',fontSize:13,fontWeight:'500',marginRight:15}}>{TA}</Text>
                                )
                              },this)}
                            </View>
                          </View>
                      </View>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:200}}>
                          <View style={{}}>
                            <FontAwesomeIcon name={'file-text'} color={'#18bdd6'} size={27}/>
                            <Text style={{color:'gray',fontSize:16,fontWeight:'500',textAlign:'center',paddingTop:10}}>{course.postCount}</Text>
                          </View>

                          <TouchableOpacity onPress={()=>this.getListofUser(course._id)}>
                            <View style={{}}>
                              <FontAwesomeIcon name={'users'} color={'#18bdd6'} size={27}/>
                              <Text style={{color:'gray',fontSize:16,fontWeight:'500',textAlign:'center',paddingTop:10}}>{course.userCount}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>


                    </View>
                  </TouchableOpacity>
              )
            },this)}
          </ScrollView>
        </View>
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
    backgroundColor:'#51d1e1',
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
