import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/EvilIcons';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
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
      iconName:'pencil',
      title:'',
      content:'',
      author:'',
      course:'',
      ifAnswering:false,
    };
  }

  componentWillMount(){
    console.warn(this.props.questionId)
  }

  componentDidMount(){
    var url = "http://localhost:3000/"+"api/courses/581231d06a5f670b42b5f868/posts/"+this.props.questionId+"/comments"
    fetch(url
    ,{method:"GET"})
    .then((response) => response.json())
    .then((responseData) => {
      console.warn(JSON.stringify(responseData))
      this.setState({questionList:new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
      }).cloneWithRows(responseData.data)})
    })
  }

  gotoCourse(name){
    Actions.course({courseName:name})
  }

  renderScrollView(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    if(this.state.ifAnswering == true){
      return(
        <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center',height:height/1.5,backgroundColor:'#f5f7fa'}}>
          <AutoGrowingTextInput style={{height:50,fontSize:20,width:width/1.2,height:20,marginRight:20,}} placeholder={'content'} />
        </View>
      )
    }else{
      return(
        <ScrollView>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
        </ScrollView>
      )
    }
  }
  renderRow(rowData){

  }
  onBackPress(){
    Actions.pop();
  }
  answerQuestion(){
    this.setState({ifAnswering:!this.state.ifAnswering})
  }
  render() {
    return (
      <View>
        <View style={styles.topContainer}>
          <TouchableOpacity
            onPress={this.onBackPress}>
            <Icon name="chevron-left" color="#f6f7fb" size={36} backgroundColor="transparent" />
          </TouchableOpacity>

            <Text style={styles.courseTitle}>{this.props.courseName}</Text>

            <TouchableOpacity
              onPress={this.openDrawer}
              style={{marginRight: 15}}>
              <Icon name="navicon" color="#f6f7fb" size={30} backgroundColor="transparent"/>
            </TouchableOpacity>
        </View>
        <View style={{flex:1,height:height-height/10.5-height/1.5,backgroundColor:'#17B3C1'}}>
          <Text>{this.props.questionTitle}</Text>
          <Text>{this.props.questionContent}</Text>
          <Text>{this.props.questionAuthor}</Text>
        </View>

        <View style={{flex:1,height:height/1.5,backgroundColor:'#f5f7fa'}}>
            {this.renderScrollView()}
        </View>
        <ActionButton position="right" text="answer" buttonColor="#17B3C1" onPress={()=>this.answerQuestion()}
          icon={<Icon name={this.state.iconName} size={33} color='#f6f7fb'></Icon>}>
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
    backgroundColor:'#17B3C1',
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
      height:Dimensions.get('window').height/10.5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#17B3C1',
      paddingTop: 20,
  },
});

AppRegistry.registerComponent('courseList', () => courseList);
