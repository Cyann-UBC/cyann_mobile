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
import ActionButton from 'react-native-action-button';
import Swiper from 'react-native-swiper';
var Modal   = require('react-native-modalbox');

var DeviceInfo = require('react-native-device-info');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

var animations = {
  layout: {
    spring: {
      duration: 250,
      create: {
        duration:300,
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
      offset:15,
      radius:3.5,
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
      {courseName:'',comments:[],content:'',author:''},
      {courseName:'',ccomments:[],content:'',author:''},
    ],
      password:'',
      listSource:[],
      ifRenderList:false,
      commentSource:{},
      viewToggle:'list',
      selectedCourse:'',
      myCourse:{_dataBlob:{s1:[]}},
      myCourseEmpty:true,
      courseObjects:[],
      showSearchBar: false,
      query:'',
      allCourseList:[],
      allCourseFilter:[],
      userAddCourseSwitch:false,
      renderPlus:true,
      userList:[],
      showUserList:false,
      jwtToken:'',
      currentCourseId:'',
      currentCourseName:'',
      showInfo:false,
      offsetY:470,
      dropCourseName:'',
      dropCourseId:'',
    };
  }

  componentWillMount(){
    var model = DeviceInfo.getModel();
    console.warn(model)
    if(model === 'iPhone 6 Plus' || model === 'iPhone 6s Plus' || model ==='iPhone 7 Plus'){
      this.setState({offsetY:510})
    }
    console.warn(JSON.stringify(this.props.jwt.jwt))
    this.setState({jwtToken:this.props.jwt.jwt})
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
    fetch('http://localhost:8080/api/courses',{method:"GET",headers: {'Authorization': 'Bearer '+this.props.jwt.jwt}})
    .then((response)=>response.json())
    .then((responseData)=>{
      //console.warn(JSON.stringify(responseData))
      this.setState({allCourseList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
      //  console.warn("all course: "+JSON.stringify(responseData))
      this.setState({allCourseFilter:responseData.data})
    })
    .catch((error) => {
        this.refs.modal6.open();
      });
    console.log(this.state.myCourse.length)
  }

  getUserCourses(){
    fetch('http://localhost:8080/api/users/my/courseData',{method:"GET",headers: {'Authorization': 'Bearer '+this.props.jwt.jwt}})
    .then(response=>response.json())
    .then(responseData=>{
      console.warn('my courses '+JSON.stringify(responseData))
      this.setState({myCourse:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData)})
      this.setState({listSource:responseData})
      console.warn(JSON.stringify(this.state.myCourse))
      console.warn(this.state.myCourse._dataBlob.s1.length)
    })
    .catch((error)=>{
      this.refs.modal6.open();
    })
  }

  getListofUser(id){
    fetch('http://localhost:8080/api/courses/users/'+id,{method:"GET",headers:{'Authorization': 'Bearer '+this.props.jwt.jwt}})
    .then(response=>response.json())
    .then(responseData=>{
      this.setState({userList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData)})
      console.warn(JSON.stringify(responseData))
      this.setState({showUserList:true})
    })
    .catch((error)=>{
      this.refs.modal6.open();
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

  // setNextCourseState(i){
  //   var myCourseList = this.state.myCourse._dataBlob.s1
  //   if(i !== myCourseList.length){
  //     this.setState({currentCourseId:myCourseList[i]._id})
  //     this.setState({currentCourseName:myCourseList[i].courseName})
  //   }
  // }
  gotoCourse=(id)=>{
    LayoutAnimation.configureNext(animations.layout.spring)
    this.setState({selectedCourse:id})
    this.setState({showSearchBar:false})
    // this.setState({renderPlus:false})
  //  this.setState({offset:-50})
    // this.setState({containerStyle:{
    //   // flex:1,
    //   marginLeft:10,
    //   marginRight:10,
    // }})
    // this.setState({mainContainer:{
    //   height:height
    // }})
    //
    // setTimeout(()=>{this.setState({containerStyle:{
    //   flex:1,
    //   width:width,
    //   marginLeft:-20,
    //   marginRight:-20,
    //   backgroundColor:'white',
    //   borderRadius:0,
    //   marginTop:-380,
    //   paddingBottom:100,
    //   backgroundColor:"#18bdd6",
    //   marginBottom:600,
    // }})},200)

    setTimeout(()=>{this.setState({viewToggle:'name'})},200)
    setTimeout(()=>{Actions.course({id:id,jwt:this.props.jwt})},250)

  }

  addCourse(id){
    fetch('http://localhost:8080/api/courses/addUser/'+id,{method:"PUT",headers: {'Authorization': 'Bearer '+this.props.jwt.jwt}})
    .then((response)=>response.json())
    .then((responseData)=>{
       console.warn(JSON.stringify(responseData))
       this.getUserCourses()
       this.setState({userAddCourseSwitch:false})
    })
    .catch((error)=>{
      this.refs.modal6.open();
    })
  }

  ifDropCourse(id,dropCourseName){
    this.setState({dropCourseId:id})
    this.setState({dropCourseName:dropCourseName},()=>this.refs.dropCourseModal.open())
  }

  confirmDropCourse(){
    fetch('http://localhost:8080/api/courses/removeUser/'+this.state.dropCourseId,{method:"PUT",headers: {'Authorization': 'Bearer '+this.props.jwt.jwt}})
    .then((response)=>response.json())
    .then((responseData)=>{
       console.warn(JSON.stringify(responseData))
       this.setState({dropCourseId:''})
       this.setState({dropCourseName:''})
       this.refs.dropCourseModal.close()
       this.getUserCourses()
       this.setState({userAddCourseSwitch:false})
    })
    .catch((error)=>{
      this.refs.modal6.open();
    })
  }

  cancelDropCourse(){
    this.setState({dropCourseId:''})
    this.setState({dropCourseName:''})
    this.refs.dropCourseModal.close()
  }

  emailUser=(to)=>{
    console.warn(to)
    Communications.email(to,null,null,'email from Cyann User','')
  }
  renderUserList(rowData){
    return(
      <TouchableOpacity onPress={()=>this.emailUser(rowData.email)}>
      <Animatable.View animation="flipInY" style={{paddingRight:20,paddingLeft:20,height:80,flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginLeft:10,marginRight:10,marginTop:17,paddingLeft:10,borderBottomWidth:2,borderBottomColor:'white'}}>
        <Animatable.View animation="fadeInLeft" easing="ease-in" duration={500} delay={500} style={{flex:1,flexDirection:'row',justifyContent:"flex-start",alignItems:"center"}}>
          <Image
            style={{width: 50, height: 50,borderRadius:25}}
            source={{uri: rowData.profileImg}}
          />
        <Text style={{marginLeft:10,color:'white',textAlign:'center',fontSize:16,fontWeight:'500'}}>{rowData.name}</Text>
        </Animatable.View>
        <Animatable.View animation="fadeInRight" easing="ease-in" duration={500} delay={500} style={{width:60}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <View>
              <FontAwesomeIcon name="star-o" size={27} color={'white'}/>
            </View>
            <Text animation="fadeInRight" easing="ease-in" duration={500} delay={500} style={{marginLeft:3,marginTop:5,marginRight:5,color:'white'}}>{rowData.honour}</Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInRight" easing="ease-in" duration={500} delay={500} style={{marginLeft:10}}>
          <FontAwesomeIcon name="commenting-o" size={27} color={'white'}/>
        </Animatable.View>

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
      // <TouchableOpacity onPress={()=>this.setState({userAddCourseSwitch:true})}>
      //   <FontAwesomeIcon name={'plus'} color={'white'} size={27} style={{marginLeft:320,marginBottom:20}}/>
      // </TouchableOpacity>
      return(
        <ActionButton position="right" text="answer" offsetY={this.state.offsetY} offsetX={this.state.offset} buttonColor="#26D3F2"
            onPress={()=>this.setState({userAddCourseSwitch:true})}
            icon={<FontAwesomeIcon name={'plus'} size={22} color='#f6f7fb'/>}>
          </ActionButton>
      )
    }else{
      return(
        null
      )
    }
  }


  ifRenderScrollView(){
    LayoutAnimation.configureNext(animations.layout.spring)
    if(this.state.myCourse._dataBlob.s1.length == 0 || this.state.userAddCourseSwitch == true && this.state.showUserList == false && this.state.showInfo == false){
      return(
        <View style={{position:'absolute',top:-70,left:0,right:0}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <TextInput
              selectionColor={'white'}
              style={{padding:10,height: 50,color:'white',fontSize:20,textAlign:'center',width:200}}
              onChangeText={(text)=>this.filterCourses(text)}
              value={this.state.commentContent}
              autoFocus={false}
              placeholder="Tap here to search"
              placeholderTextColor={'white'}
            />
          <TouchableOpacity onPress={()=>this.setState({userAddCourseSwitch:false})}>
              <FontAwesomeIcon name='times' color={'white'} size={27} style={{marginLeft:20}}/>
            </TouchableOpacity>
          </View>

        <View style={{height:height/-100,marginBottom:50,}}>
          <ListView
            showsVerticalScrollIndicator={false}
            dataSource={this.state.allCourseList}
            renderRow={this.renderCourses.bind(this)}
            horizontal={false}
            removeClippedSubviews={true}/>
        </View>

        </View>
      )
    }else if(this.state.showInfo && !this.state.showUserList){
      return(
        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
          <View style={{height:height/20}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',width:width,paddingLeft:10,marginBottom:10}}>
              <TouchableOpacity onPress={()=>this.setState({showInfo:false})}>
                <FontAwesomeIcon name='times' color={'white'} size={27} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{width:width,color:'white'}}>alkshfaklsdhlkahsdfljkahdsljkhalkdjsfhalkjsdfhlkajbvkljbsdklfadslkjfhalkjshflkajsdhflkashdlfkjahsdlkjfhalkjsdhflkajsdhflkjahsdlkjfhalksdhflkasdhflkahsdlkfhaslkdfhlkasdhfklahlskdf</Text>
        </View>
      )
    }
    else if(this.state.showUserList){
      return(
        <View>
          <View style={{height:height/20}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',width:width,paddingLeft:10,marginBottom:10}}>
              <TouchableOpacity onPress={()=>this.setState({showUserList:false})}>
                <FontAwesomeIcon name='times' color={'white'} size={27} />
              </TouchableOpacity>
            </View>
          </View>
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
        <View style={{height:height,paddingTop:height/4.5}}>

          <Swiper
            height={height/1.45}
            loop={true}
            activeDot = {<View style={{backgroundColor: 'white', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
            contentContainer={{justifyContent:'center'}}
            horizontal ={true}
            pagingEnabled ={true}
            onTouchStart={()=>this.setState({offset:-50})}
            onTouchEnd={()=>this.setState({offset:15})}
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
               var marginLeft=width/12;

               var containerStyle = {
                 flex:1,
                 flexDirection:'column',
                 justifyContent:'space-around',
                 alignItems:'center',
                 borderRadius:height/100,
                 width:width/1.2,
                 backgroundColor:'#527ba6',
                 marginLeft:marginLeft,
                 marginRight:marginRight,
                 marginBottom:10,
                 paddingLeft:20,
                 paddingRight:20,
                 shadowColor: "#000000",
                 shadowOpacity: 0.4,
                 shadowRadius: this.state.radius,
                 shadowOffset: {height: 5.5,width: -3.5},
                 paddingBottom:30,
                 height:height/1.77,
               };
               var instructors = ['Farshid Agharebparast','Sathish Gopalakrishnan']
               var TAs = ['Bader Alahmad','John Deppe','Bibek Kaur','Theresa Mammarella','Nick Mulvenna']
               var courseCardStyle=[containerStyle,this.state.containerStyle]

                return(
                  <TouchableOpacity onPressIn={()=>this.setState({radius:1.5})} onPressOut={()=>this.setState({radius:3.5})} onPress={()=>this.gotoCourse(course._id)}>
                    <View obj={course} key={i} style={courseCardStyle} >

                      <View style={{width:width/1.5,marginBottom:10}}>
                        <Text style={{color:'white',fontSize:25,fontWeight:'600',margin:10,textAlign:'center'}}>{course.courseName}</Text>
                      </View>


                      <View style={{height:70,width:width/1.5,paddingLeft:10,marginBottom:25}}>
                        <Text style={{color:'white',fontSize:18,fontWeight:'700',margin:10}}>Instructors</Text>
                        <View style={{flex:1,flexDirection:'row',flexWrap: 'wrap',paddingLeft:10}}>
                          {instructors.map(function(instructor, i){
                            return(
                              <Text style={{color:'white',fontSize:15,fontWeight:'500',marginRight:15}}>{instructor}</Text>
                            )
                          },this)}
                        </View>
                      </View>

                      <View style={{height:100,width:width/1.5,paddingLeft:10,marginBottom:25}}>
                        <Text style={{color:'white',fontSize:18,fontWeight:'700',margin:10}}>TAs</Text>
                          <View>
                            <View style={{flex:1,flexDirection:'row',flexWrap: 'wrap',paddingLeft:10}}>
                              {TAs.map(function(TA, i){
                                return(
                                  <Text style={{height:25,color:'white',fontSize:15,fontWeight:'500',marginRight:15}}>{TA}</Text>
                                )
                              },this)}
                            </View>
                          </View>
                      </View>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:200,marginTop:20}}>
                          <TouchableOpacity onPress={()=>this.ifDropCourse(course._id)}>
                            <View>
                              <FontAwesomeIcon name={'times'} color={'white'} size={28} style={{marginRight:5}}/>
                            </View>
                          </TouchableOpacity>
                          <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <FontAwesomeIcon name={'list-alt'} color={'white'} size={28}/>
                            <Text style={{marginLeft:7,color:'white',fontSize:16,fontWeight:'500',textAlign:'center',paddingTop:10,marginBottom:10}}>{course.postCount}</Text>
                          </View>

                          <TouchableOpacity onPress={()=>this.getListofUser(course._id)}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                              <FontAwesomeIcon name={'users'} color={'white'} size={27}/>
                              <Text style={{marginLeft:7,color:'white',fontSize:16,fontWeight:'500',textAlign:'center',paddingTop:10,marginBottom:10}}>{course.userCount}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                    </View>
                  </TouchableOpacity>
              )
            },this)}
          </Swiper>

          {this.ifRenderPlus()}
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
          <Modal backdrop={false} style={[styles.modal1, styles.modal5]} ref={"dropCourseModal"} backdropOpacity={0.2}>
            <View style={{flex:1,flexDirection:'column',justifyContent:'space-around',alignItems:'center'}}>
              <Animatable.View ref="yourAnswerView" animation={'fadeIn'} duration={1000} style={{height:50,marginTop:20}}>
                <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23,textAlign:'center'}}>Are you sure you want to delete your post</Text>
                </View>
              </Animatable.View>

              <View style={{height:30,width:width,marginBottom:20}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'auto'}}>
                  <TouchableOpacity onPress={()=>this.confirmDropCourse()}>
                    <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',width:width/2-50,height:height/13,backgroundColor:'#26D3F2',borderRadius:height/100}}>
                      <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23}}>Yes</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>this.cancelDropCourse()}>
                    <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',width:width/2-50,height:height/13,backgroundColor:'#26D3F2',borderRadius:height/100}}>
                      <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23}}>No</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    backgroundColor:'#294a62',
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
  modal: {
    paddingTop:10,
    paddingBottom:20,
    paddingLeft:20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modal1:{
    paddingTop:10,
    paddingBottom:20,
    paddingLeft:10,
    paddingRight:10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modal5: {
    height: 250,
    backgroundColor:'#102942'
  },
});

AppRegistry.registerComponent('courseList', () => courseList);
