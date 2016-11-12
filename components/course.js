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
  Modal,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons'
import Octicon from 'react-native-vector-icons/Octicons'
import Drawer from 'react-native-drawer';
import TimerMixin from 'react-timer-mixin';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import FacebookTabBar from './tabbar.js';
import * as Animatable from 'react-native-animatable';
import Tabbar from 'react-native-tabbar'
import Collapsible from 'react-native-collapsible';
var Accordion = require('react-native-accordion');
import ActionButton from 'react-native-action-button';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
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
      ifrenderFile:'none',
      userName:"TA1",
      courseId:'',
      modalVisible:false,
    };
  }

  componentWillMount(){
    this.setState({questionList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.questionList)})
    this.setState({courseId:this.props.id})
  }

  componentDidMount(){
    this.fetchPostsAPI()
    this.fetchAssignmentAPI()
    this.fetchReadingsAPI()
  }

fetchPostsAPI(){
    fetch("http://localhost:3000/api/courses/"+this.state.courseId+"/posts",{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
    //    console.warn(JSON.stringify(responseData.data))
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.posts)})
    })
  }

  fetchAssignmentAPI(){
    fetch("http://localhost:3000/api/"+this.state.courseId+"/files/assignments",{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
      //  console.warn(JSON.stringify(responseData))
      this.setState({assignmentList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.files)})
    })
  }

  fetchReadingsAPI(){
    fetch("http://localhost:3000/api/"+this.state.courseId+"/files/readings",{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
        console.warn(JSON.stringify(responseData))
      this.setState({readingList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.files)})
    })
  }

  deleteOwnPost(id){
    var post = {
    'userId': '5824217b40a0836d65adc165'
    }
    var formBody = []
    for (var property in post) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(post[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch("http://localhost:3000/api/courses/"+this.state.courseId+"/posts/"+id,{method:"DELETE",
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          },body:formBody})
    .then((response) => response.json())
    .then((responseData) => {
      this.fetchPostsAPI()
    })
  }

  gotoFile(rowData,type){
    Actions.fileView({uri:"http://localhost:3000/api/"+this.state.courseId+'/files/'+type+'/download/'+rowData})
  }

  ifRenderCross(id,name){
    if('5824217b40a0836d65adc165' === name){
      return(
        <TouchableOpacity onPress={()=>this.deleteOwnPost(id,name)}>
          <Icon name={'close'} size={29} color={'gray'} style={{marginTop:10,marginRight:10}}/>
        </TouchableOpacity>
      )
    }else{
      return(
        <View style={{height:20,width:30,marginTop:10,marginRight:10,backgroundColor:'transparent'}}></View>
      )
    }
  }
  renderRow(rowData, sectionID, rowID, highlightRow){
    var header = (
      <View style={{backgroundColor:'white',flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'center',marginBottom:15,shadowColor: "#000000",
  shadowOpacity: 0.3,shadowRadius: 2,shadowOffset: {height: 3.5,width: 0},}}>
        <View style={{height:40,marginBottom:10}}>
          <View style={{flex:0.6,flexDirection:"row",justifyContent:'space-between',height:5}}>
            <Text style={{fontSize:16,width:width/1.2,color:"#656D78",marginTop:10,fontWeight:'bold',height:height/17}}>{rowData.title}</Text>
            {this.ifRenderCross(rowData._id,rowData.author._id)}
          </View>
        </View>
        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',height:30,marginBottom:20,paddingLeft:10}}>
          <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',height:5}}>
            <Image
              style={{width: 36, height: 36,borderRadius:18}}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
          <View style={{height:36}}>
              <View style={{flex:1,flexDirection:"row",justifyContent:'flex-start',alignItems:'center'}}>
                <Text style={{color:"#AAB2BD",marginLeft:10}}>{rowData.author.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    )

    var content = (
      <TouchableOpacity onPress={()=>this.viewQuestion(rowData._id,rowData.title, rowData.content, rowData.author)}>
        <Animatable.View ref="first" animation={this.state.delayFirst?'slideInDown':undefined} delay={this.state.delayFirst?1900:200} duration={this.state.delayFirst?900:300} style={{backgroundColor:'white',height:height/3.4,shadowColor: "#000000",
    shadowOpacity: 0.3,shadowRadius: 2,shadowOffset: {height: 3.5,width: 0},flex:1,flexDirection:'column',justifyContent:'flex-start',borderColor:'white',borderWidth:2,marginBottom:7,paddingLeft:10}}>

          <Animatable.View key={rowID} style={{height:80}}>
            <View style={{flex:1,flexDirection:'row'}}>
              <Text style={{fontSize:16,fontWeight:'400',width:width/1.25,color:'gray',paddingBottom:10}}>{rowData.content.length>130?rowData.content.substring(0,130)+'...':rowData.content}</Text>
              </View>
            </Animatable.View>
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
            <Octicon name={rowData.split('.')[1]==='pdf'?'file-pdf':'file'} size={30} color={'gray'} style={{marginRight:20}}/>
            <Text style={{fontSize:20,fontWeight:'500',color:'gray'}}>{rowData}</Text>
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
            <Octicon name={rowData.split('.')[1]==='pdf'?'file-pdf':'file'} size={30} color={'gray'} style={{marginRight:20}}/>
            <Text style={{fontSize:20,fontWeight:'500',color:'gray'}}>{rowData.split('.')[0]}</Text>
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
    'userId': '5824217b40a0836d65adc165'
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
     'Content-Type': 'application/x-www-form-urlencoded'
     },
    body:formBody})
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.posts)})
    })
    setTimeout(()=>{this.setState({pageNumber:0})},800)
    setTimeout(()=>{this.setState({pageNumber:undefined})},810)
    setTimeout(()=>{this.refs.titleBounceOff.fadeInDown(200)},1000)
    setTimeout(()=>{this.refs.contentBounceOff.fadeInDown(200)},1000)
    setTimeout(()=>{this.setState({buttonExit:false})},800)
    setTimeout(()=>{this.setState({delayFirst:false})},2100)
  }

  viewQuestion=(id,title,content,author)=>{
    fetch("http://localhost:3000/api/courses/"+this.state.courseId+'/'+'posts/'+id,{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
      Actions.viewQuestion({data:responseData,courseId:this.state.courseId,questionId:id,questionTitle:title,questionContent:content,questionAuthor:author})
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
      if(this.state.assignmentList.length==0){
        return null
      }else{
        return(
          <Animatable.View animation={'fadeIn'} duration={500}>
            <TouchableOpacity onPress={()=>this.setState({ifrenderFile:'none'})}>
              <Icon name="close" size={30} color={'white'} style={{margin:10}}/>
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
              <Icon name="close" size={30} color={'white'} style={{margin:10}}/>
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
            <ActionButton position="right" text="answer" buttonColor="#4fc1e9" onPress={()=>this.setState({modalVisible:!this.state.modalVisible})}
              icon={<Icon name={'search'} size={33} color='#f6f7fb'/>}>
            </ActionButton>

            <Modal
                animationType={"fade"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {alert("Modal has been closed.")}}
                >
                <LinearGradient colors={['#4fc1e9', '#2DBCCC', '#31CDDE']} style={{flex:1,flexDirection:'column',justifyContent:'space-between',padding:20,paddingTop:40,paddingBottom:40}}>
                  <Text style={{backgroundColor:'transparent',color:'white'}}>Instructor</Text>
                  <Text style={{backgroundColor:'transparent',color:'white'}}>Time</Text>
                  <Text style={{backgroundColor:'transparent',color:'white'}}>Keywords</Text>
                </LinearGradient>
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
                multiline={true}
                style={{height: 100,color:'black',fontSize:20}}
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
                style={{height: 230,color:'black',fontSize:20}}
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
          </KeyboardAwareScrollView>

          <View style={{flex:1,backgroundColor:this.state.backgroundColor}}>
            {this.renderFiles()}
          </View>

          <View style={{flex:1,backgroundColor:this.state.backgroundColor}}>

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
    backgroundColor:"#3bafda",
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
    backgroundColor:"white",
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
    backgroundColor:"white",
    borderRadius:height/100,
    padding:10,
    marginBottom:10,
  },
  fileRow:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:"white",
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
  }

});

AppRegistry.registerComponent('course', () => course);
