import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ListView,
  LayoutAnimation,
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
import {Motion, spring} from 'react-motion';

var Modal = require('react-native-modalbox');
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

export default class course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language:'java',
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
      ]
    };
  }

  componentWillMount(){
    this.setState({questionList:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.questionList)})
  }

  componentDidMount(){

  }
  _getOptionList() {
  }


  renderRow(rowData){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    return(
      <TouchableOpacity onPress={()=>this.viewQuestion(rowData.title, rowData.content, rowData.author)}>
        <View style={{flex:1,flexDirection:'column',justifyContent:'space-around',borderBottomColor:'#aab2bd',borderBottomWidth:1,margin:10,paddingLeft:10}}>
          <Text style={{marginBottom:10,fontWeight:'bold'}}>{rowData.title}</Text>
          <Text style={{paddingBottom:10,}}>{rowData.content}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  onBackPress(){
    Actions.pop()
  }

  openDrawer=()=>{
    this._drawer.open()
  }

  askQuestion=()=>{
    setTimeout(()=>{this._drawer.close()},100)
    setTimeout(()=>{this.refs.modal1.open()},200)
  }

  viewQuestion=(title,content,author)=>{
    Actions.viewQuestion({questionTitle:title,questionContent:content,questionAuthor:author})
  }

  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="static"
        content={
          <View style={{flex:1,flexDirection:'column',alignItems:'center',justifyContent:'space-around',backgroundColor:'#17B3C1',paddingTop:50,paddingBottom:50}}>
            <TouchableOpacity onPress={()=>this.askQuestion()}>
              <View>
                <Ionicon name="ios-hand-outline" color="#f6f7fb" size={height/22} backgroundColor="transparent" >
                </Ionicon>
              </View>
            </TouchableOpacity>

            <View>
              <Ionicon name="ios-folder-outline" color="#f6f7fb" size={height/22} backgroundColor="transparent" >
              </Ionicon>
            </View>

            <View>
              <Icon name="gear" color="#f6f7fb" size={height/22} backgroundColor="transparent" >
              </Icon>
            </View>
          </View>
        }
        acceptDoubleTap
        styles={{main: {shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15}}}
        onOpen={() => {
          console.log('onopen')
          this.setState({drawerOpen: true})
        }}
        onClose={() => {
          console.log('onclose')
          this.setState({drawerOpen: false})
        }}
        captureGestures={false}
        negotiatePan={true}
        tweenDuration={150}
        tweenEasing={'easeOutCirc'}
        panThreshold={0.08}
        disabled={this.state.drawerDisabled}
        openDrawerOffset={(viewport) => {
          return 300
        }}
        side={'right'}
        panCloseMask={500}
        panOpenMask={500}
        closedDrawerOffset={() => 0}
        negotiatePan
        >

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
        <View style={{flex:1,height:height-height/10.5,backgroundColor:'#e6e9ed'}}>
          <ListView
            style={{flex:1}}
            showsVerticalScrollIndicator={false}
            dataSource={this.state.questionList}
            renderRow={this.renderRow.bind(this)}
            horizontal={false}
          />
        </View>
      </View>
      <Modal style={[styles.modal, styles.modal1]} ref={"modal1"} swipeToClose={this.state.swipeToClose} onClosed={this.onClose} onOpened={this.onOpen} onClosingState={this.onClosingState}>
          <Text style={{fontSize:23,height:height/10}}>Ask a Question</Text>
          <View style={{margin:20,padding:20,borderBottomWidth:2,borderBottomColor:'#aab2bd'}}>
            <AutoGrowingTextInput style={{height:50,fontSize:20,width:width/1.2,height:20,marginRight:20,}} placeholder={'title'} />
          </View>
          <View style={{margin:20,padding:20,borderBottomWidth:2,borderBottomColor:'#aab2bd',}}>
            <AutoGrowingTextInput style={{height:50,fontSize:20,width:width/1.2,height:20,marginRight:20,}} placeholder={'content'} />
          </View>
          <TouchableOpacity>
            <View style={{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center',height:height/10,backgroundColor:'#17b3c1',borderRadius:height/20,width:width/2}}>
              <Text style={{fontSize:20,fontWeight:'bold',color:'#f5f7fa',alignSelf:'center'}}>POST</Text>
            </View>
          </TouchableOpacity>
      </Modal>
    </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    backgroundColor:'#17B3C1',
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
      backgroundColor: '#17B3C1',
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

});

AppRegistry.registerComponent('course', () => course);
