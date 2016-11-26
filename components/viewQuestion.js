import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  TextInput,
  Image,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

export default class viewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iconName:'md-add',
      title:'',
      content:'',
      author:'',
      course:'',
      ifTypingAnswering:false,
      ifPostAnser:false,
      commentList:null,
      commentContent:'',
      postId:'',
      courseId:'',
      userId:'',
      showAnswer:false,
      setAsAnswerID:'',
    };
  }

  componentWillMount(){
    console.warn(this.props.courseId)
    console.warn(this.props.questionId)
    this.setState({courseId:this.props.courseId})
    this.setState({postId:this.props.questionId})
    console.warn(JSON.stringify(this.props.data))
    this.setState({commentList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.props.data.data.comments)})
  }

  componentDidMount(){
    this.getComments()
  }

  renderAnswerLabel(isAnswer){
    if(isAnswer){
      return(
        <Text style={{textAlign:'left',fontSize:13,color:'#26D3F2',fontWeight:'500',marginTop:5,marginBottom:-10,marginLeft:5,}}>ANSWER</Text>
      )
    }else{
      return(
        null
      )
    }
  }

  getComments(){
    var url = "http://localhost:3000/"+"api/courses/"+this.props.courseId+"/posts/"+this.props.questionId+"/comments"
    fetch(url
    ,{method:"GET",
      headers:{
        'Authorization': 'Bearer '+this.props.jwt
      }})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      this.setState({commentList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
    })
  }
  gotoCourse(name){
    Actions.course({courseName:name})
  }
  upvoteComment(id){
// /api/courses/:courseId/posts/:postId/comments/:commentId/upvote
    fetch("http://localhost:3000/api/courses/"+this.state.courseId+"/posts/"+this.state.postId +"/comments/"+id+'/upvote',{method:"put",
          headers: {
          'Authorization': 'Bearer '+this.props.jwt
          }})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      this.getComments()
    })
  }
  showAnswer(answer,id){
    this.setState({answer:answer})
    this.setState({setAnserId:id})
    this.setState({showAnswer:true})
  }
  renderScrollView=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    if(this.state.ifTypingAnswering == true){
      return(
          <View style={{flex:1,backgroundColor:'#527ba6',borderRadius:height/100,margin:7}}>
            <TouchableOpacity onPress={()=>this.cancelAnswer()}>
              <FontAwesomeIcon name={"close"} size={25} color={'white'} style={{marginTop:10,marginLeft:10,}}/>
            </TouchableOpacity>
            <TextInput
              onChangeText={(text)=>this.setState({commentContent:text})}
              style={{color:'white',height:height/1.5,fontSize:20,width:width,padding:20}}
              multiline={true}
              value={this.state.commentContent}
              placeholder={'your answer here'}
              placeholderTextColor='white' />
          </View>
      )
    }else if(this.state.showAnswer == true){
      return(
        <View style={{flex:1,backgroundColor:'#527ba6',borderRadius:height/100,margin:7}}>
          <View style={{height:40}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <TouchableOpacity onPress={()=>this.setState({showAnswer:false})}>
                <FontAwesomeIcon name={"close"} size={25} color={'white'} style={{marginTop:10,marginLeft:10,}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.setAsAnswer()}>
                <FontAwesomeIcon name={"star"} size={25} color={'white'} style={{marginTop:10,marginRight:10,}}/>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView>
            <Text style={{color:'white',height:height/1.5,fontSize:20,width:width-25,padding:20}}>{this.state.answer}</Text>
          </ScrollView>
        </View>
      )
    }else{
      return(
          <ListView
            style={{flex:1,backgroundColor:'#527ba6',borderRadius:height/100,margin:7}}
            showsVerticalScrollIndicator={false}
            dataSource={this.state.commentList}
            renderRow={this.renderRow.bind(this)}
            horizontal={false}
            removeClippedSubviews={true}
          />
      )
    }
  }
  renderRow(rowData){
    return(
      <TouchableOpacity onPress={()=>this.showAnswer(rowData.content,rowData._id)}>
        {this.renderAnswerLabel(rowData.isAnswer)}
        <View style={{flex:1,flexDirection:'column', justifyContent:'space-around', alignItems:'center',height:height/5,marginBottom:7,borderBottomWidth:1.5,borderBottomColor:'#294a62'}}>
          <View style={{height:height/10,width:width,padding:3,paddingLeft:20,}}>
            <View style={{flex:1,alignSelf:'flex-start',flexDirection:'column', justifyContent:'flex-start', alignItems:'center'}}>
              <Text style={{height:70,fontSize:17,fontWeight:'500',marginBottom:3,color:'white'}}>{rowData.content.length>110?rowData.content.substring(0,110)+'...':rowData.content}</Text>
            </View>
          </View>
          <View style={{height:30}}>
            <View style={{width:width-20,flex:1,flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={{width:width/2}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <Image
                    style={{width: 36, height: 36,borderRadius:18}}
                    source={{uri: rowData.author.profileImg}}
                  />
                  <Text style={{color:"white",marginLeft:10}}>{rowData.author.name}</Text>
                  {this.ifRenderInstructor(rowData.author.userType)}
                </View>
              </View>
              <View style={{width:50,marginRight:20}}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity onPress={()=>this.upvoteComment(rowData._id)}><FontAwesomeIcon name={'thumbs-up'} size={25} color={'white'}/></TouchableOpacity>
                  <Text style={{marginLeft:5,color:'white'}}>{rowData.upvotes}</Text>
                </View>
              </View>
            </View>
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  ifRenderInstructor(userType){
    if(userType === "Instructor"){
      return(
        <View style={{width:40}}>
          <Text style={{marginLeft:10,extAlign:'center',fontSize:13,color:'#26D3F2',fontWeight:'500'}}>INS</Text>
        </View>
      )
    }else if(userType === "TA"){
      return(
        <View style={{width:40}}>
          <Text style={{marginLeft:10,extAlign:'center',fontSize:13,color:'#26D3F2',fontWeight:'500'}}>TA</Text>
        </View>
    )
    }else{
      return(
        <View style={{width:40}}>
        </View>
      )
    }
  }
  onBackPress(){
    Actions.pop();
  }
  writeQuestion(){
    this.setState({ifTypingAnswering:!this.state.ifTypingAnswering})
    this.setState({ifPostAnser:!this.state.ifPostAnser})
  }
  cancelAnswer(){
    this.setState({ifTypingAnswering:false})
    this.setState({ifPostAnser:false})
  }

  setAsAnswer(){
    var url = "http://localhost:3000/"+"api/courses/"+this.props.courseId+"/posts/"+this.props.questionId+"/comments/"+this.state.setAnserId+"/setAsAnswer"
    fetch(url,{method:"PUT",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+this.props.jwt}})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
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
    var url = "http://localhost:3000/"+"api/courses/"+this.props.courseId+"/posts/"+this.props.questionId+"/comments"
    fetch(url,{method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+this.props.jwt}
      ,body:formBody})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      this.setState({ifTypingAnswering:!this.state.ifTypingAnswering})
      this.setState({ifPostAnser:!this.state.ifPostAnser})
      this.setState({commentContent:''})
      this.getComments()
    })
  }

  render() {
    return (
      <View>
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={{marginLeft:15}}
            onPress={this.onBackPress}>
            <FontAwesomeIcon name={"arrow-left"} size={27} color={'white'} />
          </TouchableOpacity>

            <Text style={styles.courseTitle}>{this.props.courseName}</Text>

            <TouchableOpacity
              onPress={this.openDrawer}
              style={{height:20,width:20,marginRight: 15}}>
            </TouchableOpacity>
        </View>

              <ScrollView style={{flex:1,height:height-height/12.5-height/1.5,backgroundColor:'#294a62',paddingLeft:15,paddingRight:15,paddingTop:7}}>
              <Text style={{color:'white',fontSize:17,fontWeight:'400',marginBottom:10}}>{this.props.questionContent}</Text>
              </ScrollView>



        <View style={{flex:1,height:height/1.5,backgroundColor:'#294a62',paddingLeft:7,paddingRight:7}}>
            {this.renderScrollView()}
        </View>
        <ActionButton position="right" text="answer" buttonColor="#26D3F2" onPress={this.state.ifPostAnser?()=>this.postAnswer():()=>this.writeQuestion()}
          icon={this.state.ifTypingAnswering?<FontAwesomeIcon name={'send-o'} size={23} color='#f6f7fb'/>
        :<FontAwesomeIcon name={'pencil'} size={23} color='#f6f7fb'/>}>
        </ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
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
  topContainer: {
      flex: 1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height/12.5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#294a62',
      paddingTop: 20,
  },
});

AppRegistry.registerComponent('viewQuestion', () => viewQuestion);
//
