import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ListView,
  LayoutAnimation,
  StatusBar,
  Image,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import Drawer from 'react-native-drawer';
import TimerMixin from 'react-timer-mixin';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import FacebookTabBar from './tabbar.js';
import * as Animatable from 'react-native-animatable';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

var Accordion = require('react-native-accordion');
import ActionButton from 'react-native-action-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var Modal   = require('react-native-modalbox');
import { Kohana } from 'react-native-textinput-effects';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');


export default class course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewHeight:20,
      questionPosted:false,
      backgroundColor:'#294a62',
      questionList:[
        {title:'Lorem Ipsum?',comments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'a'},
        {title:'Lorem Ipsum?',comments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'b'},
        {title:'What is Lorem Ipsum?',comments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'c'},
        {title:'What is Lorem Ipsum?',comments:[],content:'"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',author:'d'},
        {title:'Q5',comments:[],content:'Q5 Content',author:'e'},
        {title:'Q6',comments:[],content:'Q6 Content',author:'f'},
        {title:'Q7',comments:[],content:'Q7 Content',author:'g'},
        {title:'Q8',comments:[],content:'Q8 Content',author:'h'},
        {title:'Q9',comments:[],content:'Q9 Content',author:'i'},
        {title:'Q10',comments:[],content:'Q10 Content',author:'j'},
      ],
      assignmentList:{},
      readingList:{},
      questionTitle:'',
      questionContent:'',
      activeSection:0,
      titleContainer:{},
      contentContainer:{},
      askButton:{},
      buttonExit:false,
      pageNumber:undefined,
      delayFirst:false,
      ifrenderFile:'none',
      userName:"TA1",
      courseId:'',
      modalVisible:false,
      quesitonIdAnswering:'',
      commentContent:'',
      jwt:'',
      profileImg:'',
      userName:'',
      userPosts:[],
      userComments:[],
      ifRenderPostOrComments:false,
    };
  }

  openModal4() {
    this.refs.modal4.open();
  }

  openModal5(id){
    console.warn(id)
    this.setState({quesitonIdAnswering:id})
    this.refs.modal5.open();
  }

  componentWillMount(){
    this.setState({questionList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.questionList)})
    this.setState({jwt:this.props.jwt.token})
    this.setState({courseId:this.props.id})
  }

  componentDidMount(){
    this.fetchPostsAPI()
    this.fetchAssignmentAPI()
    this.fetchReadingsAPI()
    this.getUserInfo()
    this.getUserComments()
    this.getUserPosts()
    console.warn(this.props.id)
    console.warn(this.props.jwt.token)
  }

  fetchPostsAPI(){
    fetch("http://localhost:3000/api/courses/"+this.state.courseId+"/posts",{method:"GET",headers: {'Authorization': 'Bearer '+this.props.jwt.token}})
    .then((response) => response.json())
    .then((responseData) => {
        console.warn(JSON.stringify(responseData))
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  postAnswer(){
    var comment = {
    'content': this.state.commentContent,
    }

    var formBody = []

    for (var property in comment) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(comment[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    var url = "http://localhost:3000/"+"api/courses/"+this.props.id+"/posts/"+this.state.quesitonIdAnswering+"/comments"
    fetch(url,{method:"POST",headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization': 'Bearer '+this.props.jwt.token},body:formBody})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      this.setState({commentContent:''})
      this.fetchPostsAPI()
      this.refs.modal5.close()
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  fetchAssignmentAPI(){
    fetch("http://localhost:3000/api/"+this.state.courseId+"/files/assignments",{method:"GET",headers: {'Authorization': 'Bearer '+this.props.jwt.token}})
    .then((response) => response.json())
    .then((responseData) => {
      //  console.warn(JSON.stringify(responseData))
      this.setState({assignmentList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.files)})
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  fetchReadingsAPI(){
    fetch("http://localhost:3000/api/"+this.state.courseId+"/files/readings",{method:"GET",headers: {'Authorization': 'Bearer '+this.props.jwt.token}})
    .then((response) => response.json())
    .then((responseData) => {
        console.warn(JSON.stringify(responseData))
      this.setState({readingList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.files)})
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  filterPost(){
    fetch("http://localhost:3000/api/courses/"+this.state.courseId+"/posts/"+id,{method:"DELETE",
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer '+this.props.jwt.token
          }})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      this.fetchPostsAPI()
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  getUserInfo(){
    fetch("http://localhost:3000/api/users/my",{method:"GET",
          headers: {
          'Authorization': 'Bearer '+this.props.jwt.token
          }})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn('user info'+JSON.stringify(responseData))
      this.setState({userName:responseData.userInfo.name})
      this.setState({profileImg:responseData.userInfo.profileImg})
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  getUserComments(){
    fetch("http://localhost:3000/api/users/my/comments",{method:"GET",
          headers: {
          'Authorization': 'Bearer '+this.props.jwt.token
          }})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn('user comments'+JSON.stringify(responseData))
      this.setState({userComments:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData)})
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  getUserPosts(){
    fetch("http://localhost:3000/api/users/my/posts",{method:"GET",
          headers: {
          'Authorization': 'Bearer '+this.props.jwt.token
          }})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn('user posts'+JSON.stringify(responseData))
      this.setState({userPosts:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData)})
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  gotoFile(rowData,type){
    Actions.fileView({uri:"http://localhost:3000/api/"+this.state.courseId+'/files/'+type+'/download/'+rowData, jwt:this.props.jwt.token})
  }

  setQuestionID(id){
    this.setState({quesitonIdAnswering:id})
  }

  ifWantToDelete(id,authorId){
    this.setState({postIdToDelete:id})
    this.setState({authorOfPost:authorId})
    this.refs.modal7.open()
  }

  dontDelete(){
    this.setState({postIdToDelete:""})
    this.setState({authorOfPost:""})
    this.refs.modal7.close()
  }

  deleteOwnPost(){
    fetch("http://localhost:3000/api/courses/"+this.state.courseId+"/posts/"+this.state.postIdToDelete,{method:"DELETE",
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer '+this.props.jwt.token
          }})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      this.fetchPostsAPI()
      this.refs.modal7.close()
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  ifRenderCross(id,authorId){
    if(this.props.jwt.userId === authorId){
      return(
        <TouchableOpacity onPress={()=>this.ifWantToDelete(id,authorId)}>
          <FontAwesomeIcon name={'times'} size={25} color={'white'} style={{marginTop:10,marginRight:10}}/>
        </TouchableOpacity>
      )
    }else{
      return(
        <View style={{height:20,width:30,marginTop:10,marginRight:10,backgroundColor:'transparent'}}></View>
      )
    }
  }

  renderUserPosts(rowData, sectionID, rowID, highlightRow){
    return(
      <Animatable.View  animation={'fadeIn'} delay={rowID*200} duration={rowID*300} style={{backgroundColor:'#527ba6',flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:10,marginRight:10,marginTop:17,borderRadius:5,paddingLeft:10}}>
        <View style={{height:40,marginBottom:10}}>
          <View style={{flex:0.6,flexDirection:"row",justifyContent:'space-between',height:5}}>
            <Text style={{fontSize:16,width:width/1.2,color:"white",marginTop:10,fontWeight:'bold',height:height/17}}>{rowData.title}</Text>
              <TouchableOpacity onPress={()=>this.deleteOwnPost(id,authorId)}>
                <FontAwesomeIcon name={'times'} size={27} color={'white'} style={{marginTop:10,marginRight:10}}/>
              </TouchableOpacity>
          </View>
        </View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',height:30,marginBottom:20}}>
          <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',height:5}}>
          <View style={{height:36}}>
              <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',alignItems:'center'}}>
                <Text style={{color:"white",fontSize:15}}>Course: {rowData.course.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </Animatable.View>

    )
  }

  renderUserComments(rowData, sectionID, rowID, highlightRow){
    return(
      <Animatable.View animation={'fadeIn'} delay={200} duration={300} style={{backgroundColor:'#527ba6',flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:10,marginRight:10,marginTop:17,borderRadius:5,paddingLeft:10}}>
        <View style={{height:80,marginBottom:10}}>
          <View style={{flex:0.6,flexDirection:"row",justifyContent:'space-between',height:5}}>
            <Text style={{fontSize:16,width:width/1.2,color:"white",marginTop:10,fontWeight:'bold',height:height/12}}>{rowData.content.length>80?rowData.content.substring(0,80)+'...':rowData.content}</Text>
              <TouchableOpacity onPress={()=>this.deleteOwnPost(id,authorId)}>
                <FontAwesomeIcon name={'times'} size={27} color={'white'} style={{marginTop:10,marginRight:10}}/>
              </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    )
  }

  renderRow(rowData, sectionID, rowID, highlightRow){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if(rowID == 0){
      var header = (
        <Animatable.View animation={this.state.delayFirst?'slideInDown':undefined} delay={this.state.delayFirst?1900:200} duration={this.state.delayFirst?900:300} style={{backgroundColor:'#527ba6',flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:10,marginRight:10,marginTop:17,borderRadius:5,paddingLeft:10}}>
          <View style={{height:40,marginBottom:10}}>
            <View style={{flex:0.6,flexDirection:"row",justifyContent:'space-between',height:5}}>
              <Text style={{fontSize:16,width:width/1.2,color:"white",marginTop:10,fontWeight:'bold',height:height/17}}>{rowData.title}</Text>
              {this.ifRenderCross(rowData._id,rowData.author._id)}
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',height:30,marginBottom:20,paddingLeft:7}}>
            <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',height:5}}>
              <Image
                style={{width: 36, height: 36,borderRadius:18}}
                source={{uri: rowData.author.profileImg}}
              />
            <View style={{height:36}}>
                <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',alignItems:'center'}}>
                  <Text style={{color:"white",marginLeft:10}}>{rowData.author.name}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animatable.View>
      )
    }
    else{
      var header = (
        <Animatable.View  animation={rowID==0 && this.state.questionPosted ?"slideInDown" : "flipInX" } delay={rowID<9?rowID*200:300} duration={rowID<9?rowID*350:500} style={{backgroundColor:'#527ba6',flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginLeft:10,marginRight:10,marginTop:17,borderRadius:5,paddingLeft:10}}>
          <View style={{height:40,marginBottom:10}}>
            <View style={{flex:0.6,flexDirection:"row",justifyContent:'space-between',height:5}}>
              <Text style={{fontSize:16,width:width/1.2,color:"white",marginTop:10,fontWeight:'bold',height:height/17}}>{rowData.title}</Text>
              {this.ifRenderCross(rowData._id,rowData.author._id)}
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',height:30,marginBottom:20,paddingLeft:7}}>
            <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',height:5}}>
              <Image
                style={{width: 36, height: 36,borderRadius:18}}
                source={{uri: rowData.author.profileImg}}
              />
            <View style={{height:36}}>
                <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',alignItems:'center'}}>
                  <Text style={{color:"white",marginLeft:10}}>{rowData.author.name}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animatable.View>
      )
    }

    var content = (
      <TouchableOpacity onPress={()=>this.viewQuestion(rowData._id,rowData.title, rowData.content, rowData.author)}>
        <Animatable.View ref="first" style={{shadowColor: "#000000",
        shadowOpacity: 0.4,
        shadowRadius: 2.5,
        shadowOffset: {height: 3.5,width: 2},backgroundColor:'#527ba6',height:height/3.4,flex:1,flexDirection:'column',justifyContent:'space-between',marginTop:10,paddingLeft:10,borderRadius:5,marginLeft:10,marginRight:10,padding:10,marginBottom:5}}>
          <Animatable.View key={rowID} style={{height:130}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <Text style={{fontSize:15,fontWeight:'400',width:width/1.25,color:'white',paddingBottom:10,fontWeight:'500'}}>{rowData.content.length>260?rowData.content.substring(0,260)+'...':rowData.content}</Text>
              </View>
          </Animatable.View>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:15,paddingLeft:10,paddingRight:10}}>
            <View style={{flex:1,flexDirection:'row',width:30,justifyContent:'flex-start',alignItems:'center',paddingBottom:20}}>
              <TouchableOpacity onPress={()=>console.warn('asd')}>
                <FontAwesomeIcon name="comments-o" size={30} color={'white'}/>
              </TouchableOpacity>
              <View>
                <Text style={{color:'white',fontWeight:'500',alignSelf:'center',textAlign:'center',marginTop:7,marginLeft:10}}>{rowData.comments.length}</Text>
              </View>
            </View>
            <View style={{flex:1,flexDirection:'row',width:30,justifyContent:'flex-end',alignItems:'center',paddingBottom:20}}>
              <TouchableOpacity onPress={()=>this.openModal5(rowData._id)}>
                <FontAwesomeIcon name="pencil-square-o" size={30} color={'white'}/>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </TouchableOpacity>
    )

    return (
      <Accordion
        activeOpacity={0.5}
        underlayColor={"#1BB5EC"}
        header={header}
        content={content}
        easing="easeOutCubic"
      />
    )
  }

  renderAssignmentList(rowData, sectionID, rowID, highlightRow){
    if(!rowData.includes('.json')){
      return(
        <TouchableOpacity onPress={()=>this.gotoFile(rowData,'assignments')}>
          <View style={styles.fileRow}>
            <FontAwesomeIcon name={rowData.split('.')[1]==='pdf'?'file-pdf-o':'file-o'} size={30} color={'white'} style={{marginRight:20}}/>
            <Text style={{fontSize:20,fontWeight:'500',color:'white'}}>{rowData}</Text>
            <View style={{height:15,width:15}}></View>
          </View>
        </TouchableOpacity>
      )
    }else{
      return(
        null
      )
    }
  }

  renderReadingList(rowData, sectionID, rowID, highlightRow){
    if(!rowData.includes('.json')){
      return(
        <TouchableOpacity onPress={()=>this.gotoFile(rowData,'readings')}>
          <View style={styles.fileRow}>
            <FontAwesomeIcon name={rowData.split('.')[1]==='pdf'?'file-pdf-o':'file-o'} size={30} color={'white'} style={{marginRight:20}}/>
            <Text style={{fontSize:20,fontWeight:'500',color:'white'}}>{rowData.split('.')[0]}</Text>
            <View style={{height:15,width:15}}></View>
          </View>
        </TouchableOpacity>
      )
    }else{
      return(
        null
      )
    }
  }

  askQuestion(){
    this.setState({pageNumber:1})
    this.setState({buttonExit:true})
    this.refs.titleView.bounce(500)
    this.refs.contentView.bounce(500)
    this.refs.buttonView.bounce(1000)
    this.setState({delayFirst:true})
    setTimeout(()=>{this.refs.titleBounceOff.bounceOutUp(750)},200)
    setTimeout(()=>{this.refs.contentBounceOff.bounceOutUp(900)},250)
    var post = {
    'title': this.state.questionTitle,
    'content': this.state.questionContent,
    }

    var formBody = []

    for (var property in post) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(post[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch("http://localhost:3000/api/courses/"+this.state.courseId+"/posts",{method:"POST",
    headers: {
     'Content-Type': 'application/x-www-form-urlencoded',
     'Authorization': 'Bearer '+this.props.jwt.token
     },
    body:formBody})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.posts)})
    })
    setTimeout(()=>{this.setState({pageNumber:0})},800)
    setTimeout(()=>{this.setState({pageNumber:undefined})},850)
    setTimeout(()=>{this.refs.titleBounceOff.fadeInDown(200)},1000)
    setTimeout(()=>{this.refs.contentBounceOff.fadeInDown(200)},1000)
    setTimeout(()=>{this.setState({buttonExit:false})},800)
    setTimeout(()=>{this.setState({delayFirst:false})},2100)
  }

  viewQuestion=(id,title,content,author)=>{
    fetch("http://localhost:3000/api/courses/"+this.state.courseId+'/'+'posts/'+id,{method:"GET",
    headers:{
      'Authorization': 'Bearer '+this.props.jwt.token
    }
    })
    .then((response) => response.json())
    .then((responseData) => {
      Actions.viewQuestion({data:responseData,courseId:this.state.courseId,questionId:id,questionTitle:title,questionContent:content,questionAuthor:author,jwt:this.props.jwt.token})
    })
    .catch((error)=>{
      this.refs.modal6.open()
    })
  }

  updateTitle(event){
    this.setState({questionTitle:event.nativeEvent.text})
  }

  updateContent(event){
    this.setState({questionContent:event.nativeEvent.text})
  }

  getTitleBack(){
    this.refs.titleView.fadeInDown(200)
  }

  ifRenderUserComments(){
    if(this.state.userComments._cachedRowCount == []){
      return(
        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',width:width,height:450}}>
          <Text>Looks like you haven't commented on anything</Text>
        </View>
      )
    }
    else{
      return(
        <ListView
          style={{flex:1,flexDirection:'column',height:450}}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.userComments}
          renderRow={this.renderUserComments.bind(this)}
          horizontal={false}
          removeClippedSubviews={true}/>
      )
    }
  }

  ifRenderUserPosts(){
    if(this.state.userPosts._cachedRowCount == []){
      return(
        <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',width:width,height:450}}>
          <Text>Looks like you haven't posted anything</Text>
        </View>
      )
    }
    else{
      return(
        <ListView
          style={{flex:1,flexDirection:'column',height:450}}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.userPosts}
          renderRow={this.renderUserPosts.bind(this)}
          horizontal={false}
          removeClippedSubviews={true}/>
      )
    }
  }
  renderFiles(){
    if(this.state.ifrenderFile === 'none'){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      return(
        <View style={{flex:1,flexDirection:'column',alignItems:'center', justifyContent:'space-around',paddingTop:height/7,paddingBottom:height/7}}>
          <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'readings'})}>
            <Animatable.View animation={'slideInRight'} delay={100} duration={350} style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <FontAwesomeIcon name="book" size={50} color={'white'} style={{marginBottom:10}}/>
              <Text style={{textAlign:'center',color:"white",fontSize:20,fontWeight:'600'}}>readings</Text>
            </Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'assignments'})}>
            <Animatable.View animation={'slideInRight'} delay={200} duration={350} style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <FontAwesomeIcon name="file-text" size={50} color={'white'} style={{marginBottom:10}}/>
              <Text style={{textAlign:'center',color:"white",fontSize:20,fontWeight:'600'}}>assignments</Text>
            </Animatable.View>
          </TouchableOpacity>
        </View>
      )
    }else if(this.state.ifrenderFile === 'assignments'){
      if(this.state.assignmentList.length==0){
        return null
      }else{
        return(
          <Animatable.View animation={'fadeIn'} duration={500}>
            <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'none'})}>
              <FontAwesomeIcon name="times" size={27} color={'white'} style={{margin:10}}/>
            </TouchableOpacity>
            <ListView
              showsVerticalScrollIndicator={false}
              dataSource={this.state.assignmentList}
              renderRow={this.renderAssignmentList.bind(this)}
              horizontal={false}
              removeClippedSubviews={true}/>
          </Animatable.View>
        )
      }
    }else if(this.state.ifrenderFile === 'readings'){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      if(this.state.readingList.length==0){
        return null
      }else{
        return(
          <Animatable.View animation={'fadeIn'} duration={500}>
            <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'none'})}>
              <FontAwesomeIcon name="times" size={27} color={'white'} style={{margin:10}}/>
            </TouchableOpacity>
            <ListView
              showsVerticalScrollIndicator={false}
              dataSource={this.state.readingList}
              renderRow={this.renderReadingList.bind(this)}
              horizontal={false}
              removeClippedSubviews={true}/>
          </Animatable.View>
        )
      }
    }
  }
  render() {
    let titleStyle = [styles.titleContainer, this.state.titleContainer]
    let contentStyle = [styles.contentContainer, this.state.contentContainer]
    let buttonStyle = [styles.askButton, this.state.askButton]
    return (
        <ScrollableTabView style={{backgroundColor:this.state.backgroundColor}}
          onChangeTab={this.fetchPostsAPI.bind(this)}
          page={this.state.pageNumber}
          prerenderingSiblingsNumber={0}
          keyboardDismissMode="on-drag"
          renderTabBar={() =><FacebookTabBar jwt={this.props.jwt} tabs={['ios-add',"ios-alert",'ios-add','ios-add']}/>}
          >

          <View style={{flex:1,backgroundColor:this.state.backgroundColor}}>
            <StatusBar
              backgroundColor="transparent"
              barStyle="light-content"
                />
            <ListView
              style={{flex:1}}
              showsVerticalScrollIndicator={false}
              dataSource={this.state.questionList}
              renderRow={this.renderRow.bind(this)}
              horizontal={false}
              removeClippedSubviews={true}
            />
          <ActionButton position="right" text="answer" buttonColor="#26D3F2" onPress={()=>this.openModal4()}
              icon={<FontAwesomeIcon name={'search'} size={22} color='#f6f7fb'/>}>
            </ActionButton>

            <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal4"} backdropOpacity={0.2}>
              <Text style={{color:'white',fontSize:20,fontWeight:'500'}}>Filter by</Text>
                <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                  <Kohana
                      style={{ backgroundColor: '#f9f5ed' }}
                      label={'Keyword'}
                      iconClass={FontAwesomeIcon}
                      iconName={'search'}
                      iconColor={'white'}
                      labelStyle={{ fontWeight:'600',color:'white',fontSize:17,marginTop:15,marginLeft:10}}
                      inputStyle={styles.filterButtonText}
                      style={{backgroundColor:'#294a62',width:width-30,height:height/20,borderRadius:height/10,marginRight:20,marginTop:20}}
                    />
                </View>

              <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                <View style={{flex:1,width:width,flexDirection:'row',justifyContent:'flex-start'}}>
                </View>
                <View style={{flex:1,width:width,flexDirection:'row',justifyContent:'flex-start',marginTop:-20}}>
                  <TouchableOpacity style={styles.filterButton}>
                    <View><Text style={styles.filterButtonText}>Instructor</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton}>
                    <View><Text style={styles.filterButtonText}>Me</Text></View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                <View style={{flex:1,width:width,flexDirection:'row',justifyContent:'flex-start'}}>
                </View>
                <View style={{flex:1,width:width,flexDirection:'row',justifyContent:'flex-start',marginTop:-20}}>
                  <TouchableOpacity style={styles.filterButton}>
                    <View><Text style={styles.filterButtonText}>1 week</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton}>
                    <View><Text style={styles.filterButtonText}>2 week</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterButton}>
                    <View><Text style={styles.filterButtonText}>3 week</Text></View>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal style={[styles.modal1, styles.modal4]} position={"top"} ref={"modal5"} backdropOpacity={0.2}>
              <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                <Animatable.View ref="yourAnswerView" animation={'fadeIn'} duration={1000} style={{backgroundColor:'#286b95',width:width-30,borderRadius:5}}>
                  <TextInput
                    selectionColor={'white'}
                    multiline={true}
                    style={{padding:10,height: 250,color:'white',fontSize:20}}
                    onChangeText={(text)=>this.setState({commentContent:text})}
                    value={this.state.commentContent}
                    autoFocus={true}
                    placeholder="Your answer here"
                    placeholderTextColor={'white'}
                  />
                </Animatable.View>
                <TouchableOpacity onPress={()=>this.postAnswer()}>
                  <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',width:width/1.3,height:height/13,backgroundColor:'#26D3F2',borderRadius:height/100}}>
                    <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23}}>Answer</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
            <Modal style={[styles.modal1, styles.modal4]} ref={"modal6"} backdropOpacity={0.2}>
              <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                <Animatable.View ref="yourAnswerView" animation={'fadeIn'} duration={1000} style={{height:50,marginTop:50}}>
                  <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{marginBottom:70,color:"white",fontWeight:'600',alignSelf:"center",fontSize:23}}>Something Went Wrong...</Text>
                    <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23,textAlign:'center'}}>Please check your network and try again</Text>
                  </View>
                </Animatable.View>
                <TouchableOpacity onPress={()=>this.refs.modal6.close()}>
                  <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',width:width/1.3,height:height/13,backgroundColor:'#26D3F2',borderRadius:height/100}}>
                    <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23}}>Got It</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>
            <Modal style={[styles.modal1, styles.modal5]} ref={"modal7"} backdropOpacity={0.2}>
              <View style={{flex:1,flexDirection:'column',justifyContent:'space-around',alignItems:'center'}}>
                <Animatable.View ref="yourAnswerView" animation={'fadeIn'} duration={1000} style={{height:50,marginTop:20}}>
                  <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23,textAlign:'center'}}>Are you sure you want to delete your post</Text>
                  </View>
                </Animatable.View>

                <View style={{height:30,width:width,marginBottom:20}}>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'auto'}}>
                    <TouchableOpacity onPress={()=>this.deleteOwnPost()}>
                      <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',width:width/2-50,height:height/13,backgroundColor:'#26D3F2',borderRadius:height/100}}>
                        <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23}}>Yes</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.refs.modal7.close()}>
                      <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',width:width/2-50,height:height/13,backgroundColor:'#26D3F2',borderRadius:height/100}}>
                        <Text style={{color:"white",fontWeight:'600',alignSelf:"center",fontSize:23}}>No</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </Modal>
          </View>

          <KeyboardAwareScrollView keyboardDismissMode={'on-drag'} contentContainerStyle={{flex:1,justifyContent:'space-around',alignItems:'center',backgroundColor:this.state.backgroundColor}} >
          <View style={{}}>
            <Animatable.View ref="titleView" animation={'slideInRight'} duration={this.state.buttonExit===false?300:500} style={titleStyle}>
              <Animatable.View ref="titleBounceOff" animation={this.state.questionTitle.length>10?"flash":undefined} style={{
              width:0,
              height:0,
              backgroundColor:this.state.questionTitle.length>10?"#A0D468":"#ED5565",
              borderRadius:20,
              padding:10}}>
              </Animatable.View>
              <TextInput
                selectionColor={'white'}
                multiline={true}
                style={{height: 100,color:'white',fontSize:20}}
                onChange={this.updateTitle.bind(this)}
                value={this.state.questionTitle}
                placeholder="Title"
                placeholderTextColor="white"
              />
            </Animatable.View>
            <Animatable.View ref="contentView" animation={'slideInRight'} delay={this.state.buttonExit===false?200:600} duration={this.state.buttonExit===false?300:500} style={contentStyle}>
              <Animatable.View ref="contentBounceOff" animation={this.state.questionContent.length>20?"flash":undefined} style={{
              width:0,
              height:0,
              backgroundColor:this.state.questionContent.length>20?"#A0D468":"#ED5565",
              borderRadius:20,
              padding:10}}></Animatable.View>
              <TextInput
                selectionColor={'white'}
                multiline={true}
                style={{height: 230,color:'white',fontSize:20}}
                onChange={this.updateContent.bind(this)}
                value={this.state.questionContent}
                placeholder="Content"
                placeholderTextColor="white"
              />
            </Animatable.View>

            <TouchableOpacity onPress={this.askQuestion.bind(this)}>
              <Animatable.View ref="buttonView" animation={this.state.buttonExit===false?'slideInRight':'slideInRight'} delay={this.state.buttonExit===false?400:800} duration={this.state.buttonExit===false?300:700} style={buttonStyle}>
                <Text style={{color:"white",fontWeight:'bold',alignSelf:"center",fontSize:25}}>ASK</Text>
              </Animatable.View>
            </TouchableOpacity>

            <View>
            </View>

          </View>
          </KeyboardAwareScrollView>

          <View style={{flex:1,backgroundColor:this.state.backgroundColor}}>
            {this.renderFiles()}
          </View>

          <View style={{flex:1,justifyContent:'space-around',alignItems:'center',backgroundColor:this.state.backgroundColor}}>
            <View style={{width:width,height:height/5,marginBottom:10}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                <Image
                  style={{width: 70, height: 70,borderRadius:35}}
                  source={{uri: this.state.profileImg}}
                />
              <Text style={{color:'white',fontSize:22,fontWeight:'500'}}>{this.state.userName}</Text>
              </View>
            </View>


            <View style={{width:width,marginBottom:20}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:30,paddingRight:30,marginBottom:10}}>
                <TouchableOpacity onPress={()=>this.setState({ifRenderPostOrComments:false})}>
                  <View>
                    <Text style={{color:'white',fontSize:15,fontWeight:'500'}}>Past Posts</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.setState({ifRenderPostOrComments:true})}>
                  <View>
                    <Text style={{color:'white',fontSize:15,fontWeight:'500'}}>Past Comments</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {this.state.ifRenderPostOrComments?this.ifRenderUserComments():this.ifRenderUserPosts()}
            </View>




            <View style={{width:30,height:30}}>

            </View>
          </View>

        </ScrollableTabView>

    );
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
  courseTitle:{
    color:'white',
    fontSize:17,
    fontWeight:'500'
  },
  topContainer: {
      flex: 1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height/10.5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#4fc1e9',
      paddingTop: 20,
  },
  modal: {
    flex:1,
    paddingVertical:40,
    flexDirection:'column',
    justifyContent:'space-around',
    backgroundColor:'#e6e9ed',
    alignItems: 'center'
  },
  askButton:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {height: 3.5,width: 0},
    width:width/1.3,
    height:height/10,
    backgroundColor:"#102942",
    borderRadius:height/100,
    marginBottom:10,
  },
  contentContainer:{
    width:width/1.3,
    height:height/2.3,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {height: 3.5,width: 0},
    backgroundColor:"#527ba6",
    borderRadius:height/100,
    padding:10,
    marginBottom:10,
  },
  titleContainer:{
    width:width/1.3,
    height:height/4,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {height: 3.5,width: 0},
    backgroundColor:"#527ba6",
    borderRadius:height/100,
    padding:10,
    marginBottom:10,
  },
  fileRow:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:"#527ba6",
    height:height/7,
    borderRadius:height/80,
    marginTop:10,
    marginBottom:10,
    marginLeft:7,
    marginRight:7,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    padding:20,
    shadowOffset: {height: 3.5,width: 0},
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
    modal4: {
    height: 350,
    backgroundColor:'#102942'
  },
    modal5: {
    height: 250,
    backgroundColor:'#102942'
  },
  filterButton:{
    flex:1,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:90,
    height:70,
    backgroundColor:'#294a62',
    marginRight:20,
    borderRadius:35
  },
  filterButtonText:{
    fontWeight:'600',
    color:'white',
    fontSize:17
  }

});

AppRegistry.registerComponent('course', () => course);
