import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  TextInput,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons'
import fontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

export default class courseList extends Component {
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
    };
  }

  componentWillMount(){
    console.warn(this.props.courseId)
    console.warn(JSON.stringify(this.props.data))
    this.setState({commentList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.props.data.data.comments)})
  }

  componentDidMount(){
    this.getComments()
  }

  getComments(){
    var url = "http://localhost:3000/"+"api/courses/"+this.props.courseId+"/posts/"+this.props.questionId+"/comments"
    fetch(url
    ,{method:"GET"})
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

  renderScrollView=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    if(this.state.ifTypingAnswering == true){
      return(
        <View>
          <TouchableOpacity onPress={()=>this.cancelAnswer()}>
            <Icon name={"close"} size={30} color={'gray'} style={{marginTop:10,marginLeft:10,}}/>
          </TouchableOpacity>
          <TextInput
            onChangeText={(text)=>this.setState({commentContent:text})}
            style={{height:height/1.5,fontSize:20,width:width,padding:20}}
            multiline={true}
            value={this.state.commentContent}
            placeholder={'your answer here'} />
        </View>

      )
    }else{
      return(
        <ListView
          style={{flex:1}}
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
      <TouchableOpacity>
        <View style={{marginBottom:7,borderBottomWidth:1.5,borderBottomColor:'gray'}}>
          <Text style={{fontSize:17,fontWeight:'500',marginBottom:3}}>{rowData.content}</Text>
          <Text style={{fontSize:16,fontWeight:'500',marginBottom:3}}>{rowData.author}</Text>
          <Text >{rowData.upvotes}</Text>
        </View>
      </TouchableOpacity>
    )
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
  postAnswer(){
    var comment = {
    'content': this.state.commentContent,
    'userId': '58122f3e6a5f670b42b5f85d'
    }

    var formBody = []

    for (var property in comment) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(comment[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    var url = "http://localhost:3000/"+"api/courses/581a27f661083346ae0955dd/posts/"+this.props.questionId+"/comments"
    fetch(url,{method:"POST",headers: {'Content-Type': 'application/x-www-form-urlencoded'},body:formBody})
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
            onPress={this.onBackPress}>
            <Icon name={"chevron-left"} size={37} color={'white'} />
          </TouchableOpacity>

            <Text style={styles.courseTitle}>{this.props.courseName}</Text>

            <TouchableOpacity
              onPress={this.openDrawer}
              style={{height:20,width:20,marginRight: 15}}>
            </TouchableOpacity>
        </View>
          <ScrollView style={{flex:1,height:height-height/12.5-height/1.5,backgroundColor:'#4fc1e9',paddingLeft:15,paddingRight:15}}>
            <Text style={{color:'white',fontSize:25,fontWeight:'500',marginBottom:10}}>{this.props.questionTitle}</Text>
            <Text style={{color:'white',fontSize:18,fontWeight:'500',marginBottom:10}}>{this.props.questionAuthor.name}</Text>
            <Text style={{color:'white',fontSize:18,fontWeight:'400',marginBottom:10}}>{this.props.questionContent}</Text>
          </ScrollView>

        <View style={{flex:1,height:height/1.5,backgroundColor:'#f5f7fa',paddingLeft:7,paddingRight:7}}>
            {this.renderScrollView()}
        </View>
        <ActionButton position="right" text="answer" buttonColor="#4fc1e9" onPress={this.state.ifPostAnser?()=>this.postAnswer():()=>this.writeQuestion()}
          icon={this.state.ifTypingAnswering?<Ionicon name={'ios-send-outline'} size={33} color='#f6f7fb'/>
                                      :<Ionicon name={'ios-add'} size={33} color='#f6f7fb'/>}>
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
  topContainer: {
      flex: 1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height/12.5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#4fc1e9',
      paddingTop: 20,
  },
});

AppRegistry.registerComponent('courseList', () => courseList);
