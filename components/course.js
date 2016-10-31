import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ListView,
  LayoutAnimation,
  StatusBar,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons'
import Drawer from 'react-native-drawer';
import TimerMixin from 'react-timer-mixin';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import FacebookTabBar from './tabbar.js';
import * as Animatable from 'react-native-animatable';
import Tabbar from 'react-native-tabbar'
import Collapsible from 'react-native-collapsible';


import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
var Modal = require('react-native-modalbox');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(View.propTypes);
export default class course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewHeight:20,
      questionPosted:false,
      backgroundColor:'#4fc1e9',
      questionList:[
        {title:'Q1',content:'Q1 Content',author:'a'},
        {title:'Q2',content:'Q2 Content',author:'b'},
        {title:'Q3',content:'Q3 Content',author:'c'},
        {title:'Q4',content:'Q4 Content',author:'d'},
        {title:'Q5',content:'Q5 Content',author:'e'},
        {title:'Q6',content:'Q6 Content',author:'f'},
        {title:'Q7',content:'Q7 Content',author:'g'},
        {title:'Q8',content:'Q8 Content',author:'h'},
        {title:'Q9',content:'Q9 Content',author:'i'},
        {title:'Q10',content:'Q10 Content',author:'j'},
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
      ifrenderFile:'none'
    };
  }

  componentWillMount(){
    this.setState({questionList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.questionList)})

  }

  componentDidMount(){
    this.fetchPostsAPI()
    this.fetchAssignmentAPI()
    this.fetchReadingsAPI()
  }

fetchPostsAPI(){
    fetch("http://localhost:3000/api/courses/581231d06a5f670b42b5f868/posts",{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
      //  console.warn(JSON.stringify(responseData.data))
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
    })
  }

  fetchAssignmentAPI(){
    fetch("http://localhost:3000/api/581231d06a5f670b42b5f868/files/assignments",{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
        console.warn(JSON.stringify(responseData))
      this.setState({assignmentList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.files)})
    })
  }

  fetchReadingsAPI(){
    fetch("http://localhost:3000/api/581231d06a5f670b42b5f868/files/readings",{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
        console.warn(JSON.stringify(responseData.files))
      this.setState({readingList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.files)})
    })
  }
  gotoFile(rowData,type){
    Actions.fileView({uri:"http://localhost:3000/api/"+'581231d06a5f670b42b5f868'+'/files/'+type+'/download/'+rowData})
  }
  renderRow(rowData, sectionID, rowID, highlightRow){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    let viewProps = {};

    if(rowID == 0){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      return(
        <TouchableOpacity onPress={()=>this.viewQuestion(rowData._id,rowData.title, rowData.content, rowData.author)}>
          <Animatable.View ref="first" animation={this.state.delayFirst?'slideInDown':undefined} delay={this.state.delayFirst?1900:200} duration={this.state.delayFirst?900:300} style={{backgroundColor:'white',height:height/3.7,shadowColor: "#000000",
      shadowOpacity: 0.5,shadowRadius: 2,shadowOffset: {height: 3.5,width: 0},borderRadius:height/100,flex:1,flexDirection:'column',justifyContent:'space-between',borderColor:'white',borderWidth:2,marginTop:12,marginLeft:7,marginRight:7,marginBottom:10,paddingLeft:10}}>
            <Text style={{width:width/1.2,color:"#656D78",marginTop:10,fontWeight:'bold'}}>{rowData.title}</Text>
            <Text style={{color:"#AAB2BD"}}>author</Text>
          <Animatable.View  key={rowID} style={{height:50}}>
            <View  style={{flex:1,flexDirection:'row'}}>
              <Text style={{width:width/1.25,color:'gray',paddingBottom:10,}}>{rowData.content}</Text>
              </View>
            </Animatable.View>
          </Animatable.View>
        </TouchableOpacity>
      )
    }else{
      return(
        <TouchableOpacity onPress={()=>this.viewQuestion(rowData._id,rowData.title, rowData.content, rowData.author)}>
          <Animatable.View  animation={rowID==0 && this.state.questionPosted ?"slideInDown" : "flipInX" } delay={rowID<9?rowID*100:300} duration={rowID<9?rowID*200:500} style={{backgroundColor:'white',height:height/3.7,shadowColor: "#000000",
      shadowOpacity: 0.5,shadowRadius: 2,shadowOffset: {height: 3.5,width: 0},borderRadius:height/100,flex:1,flexDirection:'column',justifyContent:'space-between',borderColor:'white',borderWidth:2,marginTop:7,marginLeft:7,marginRight:7,marginBottom:10,paddingLeft:10}}>
            <Text style={{width:width/1.2,color:"#656D78",marginTop:10,fontWeight:'bold'}}>{rowData.title}</Text>
            <Text style={{color:"#AAB2BD"}}>author</Text>
          <Animatable.View key={rowID} style={{height:50}}>
            <View  style={{flex:1,flexDirection:'row'}}>
              <Text style={{width:width/1.25,color:'gray',paddingBottom:10,}}>{rowData.content}</Text>

              </View>
            </Animatable.View>
          </Animatable.View>
        </TouchableOpacity>
      )
    }
  }

  renderAssignmentList(rowData, sectionID, rowID, highlightRow){
    if(!rowData.includes('.json')){
      return(
        <TouchableOpacity onPress={()=>this.gotoFile(rowData,'assignments')}>
          <View>
            <Text>{rowData}</Text>
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
          <View style={{}}>

            <Text>{rowData.split('.')[0]}</Text>
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
    'userId': '58122f3e6a5f670b42b5f85b'
    }

    var formBody = []

    for (var property in post) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(post[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch("http://localhost:3000/api/courses/581231d06a5f670b42b5f868/posts",{method:"POST",
    headers: {
     'Content-Type': 'application/x-www-form-urlencoded'
     },
    body:formBody})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
    })
    setTimeout(()=>{this.setState({pageNumber:0})},800)
    setTimeout(()=>{this.setState({pageNumber:undefined})},810)
    setTimeout(()=>{this.refs.titleBounceOff.fadeInDown(200)},1000)
    setTimeout(()=>{this.refs.contentBounceOff.fadeInDown(200)},1000)
    setTimeout(()=>{this.setState({buttonExit:false})},800)

    setTimeout(()=>{this.setState({delayFirst:false})},2100)
  }

  viewQuestion=(id,title,content,author)=>{
    Actions.viewQuestion({questionId:id,questionTitle:title,questionContent:content,questionAuthor:author})
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

  renderFiles(){
    if(this.state.ifrenderFile === 'none'){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      return(
        <View style={{flex:1,flexDirection:'column',alignItems:'center', justifyContent:'space-around',paddingTop:height/7,paddingBottom:height/7}}>
          <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'readings'})}>
            <Animatable.View animation={'slideInRight'} delay={100} duration={350} style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <Ionicon name="ios-book" size={50} color={'white'}/>
              <Text style={{textAlign:'center',color:"white",fontSize:20,fontWeight:'600'}}>readings</Text>
            </Animatable.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'assignments'})}>
            <Animatable.View animation={'slideInRight'} delay={200} duration={350} style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <Ionicon name="ios-paper" size={50} color={'white'}/>
              <Text style={{textAlign:'center',color:"white",fontSize:20,fontWeight:'600'}}>assignments</Text>
            </Animatable.View>
          </TouchableOpacity>
        </View>
      )
    }else if(this.state.ifrenderFile === 'assignments'){
      return(
        <Animatable.View animation={'fadeIn'} duration={500}>
          <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'none'})}>
            <Icon name="close" size={30} color={'white'} style={{margin:20}}/>
          </TouchableOpacity>
          <ListView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            dataSource={this.state.assignmentList}
            renderRow={this.renderAssignmentList.bind(this)}
            horizontal={false}
            removeClippedSubviews={true}/>
        </Animatable.View>
      )
    }else if(this.state.ifrenderFile === 'readings'){
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

      return(
        <Animatable.View animation={'fadeIn'} duration={500}>
          <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'none'})}>
            <Icon name="close" size={30} color={'white'} style={{margin:20}}/>
          </TouchableOpacity>
          <ListView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            dataSource={this.state.readingList}
            renderRow={this.renderReadingList.bind(this)}
            horizontal={false}
            removeClippedSubviews={true}/>
        </Animatable.View>
      )
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
        renderTabBar={() =><FacebookTabBar tabs={['ios-add',"ios-alert",'ios-add','ios-add']}/>}
        >

        <View style={{flex:1,backgroundColor:'#4fc1e9'}}>
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
        </View>

        <View style={{flex:1,justifyContent:'space-around',alignItems:'center',backgroundColor:this.state.backgroundColor}}>

          <Animatable.View ref="titleView" animation={'slideInRight'} duration={this.state.buttonExit===false?300:500} style={titleStyle}>
            <Animatable.View ref="titleBounceOff" animation={this.state.questionTitle.length>10?"flash":undefined} style={{
            width:0,
            height:0,
            backgroundColor:this.state.questionTitle.length>10?"#A0D468":"#ED5565",
            borderRadius:20,
            padding:10}}>
            </Animatable.View>
            <TextInput
              multiline={true}
              style={{height: 150,color:'black',fontSize:20}}
              onChange={this.updateTitle.bind(this)}
              value={this.state.questionTitle}
              placeholder="Title"
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
              multiline={true}
              style={{height: 250,color:'black',fontSize:20}}
              onChange={this.updateContent.bind(this)}
              value={this.state.questionContent}
              placeholder="Content"
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

        <View style={{flex:1,backgroundColor:this.state.backgroundColor}}>
          {this.renderFiles()}
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
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {height: 3.5,width: 0},
    width:width/1.3,
    height:height/10,
    backgroundColor:"#3bafda",
    borderRadius:height/100
  },
  contentContainer:{
    width:width/1.3,
    height:height/2.3,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {height: 3.5,width: 0},
    backgroundColor:"white",
    borderRadius:height/100,
    padding:10
  },
  titleContainer:{
    width:width/1.3,
    height:height/4,
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: {height: 3.5,width: 0},
    backgroundColor:"white",
    borderRadius:height/100,
    padding:10
  }

});

AppRegistry.registerComponent('course', () => course);
