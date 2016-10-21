import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  ListView,
  LayoutAnimation,
  StatusBar,
  Text,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import {Motion, spring} from 'react-motion';

var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');

export default class courseList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseList:[
        {name:'CPEN 321'},
        {name:'CPEN 281'},
        {name:'ELEC 221'},
        {name:'STAT 302'},
        {name:'ECON 101'}
      ],
      ssc:'',
      password:'',
      listSource:{},
      ifRenderList:false,
      commentSource:{},
    };
  }

  componentWillMount(){
    this.setState({listSource:new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
    }).cloneWithRows(this.state.courseList)})
  }
  componentDidMount(){
    console.warn(JSON.stringify(this.state.listSource))
  }

  gotoCourse(name){
    Actions.course({courseName:name})
  }

  renderRow(rowData){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

    return(
      <TouchableOpacity onPress={()=>this.gotoCourse(rowData.name)}>
      <View style={{margin:30,marginBottom:20,padding:10,borderBottomColor:'white',borderBottomWidth:1}}>
        <Text style={{color:'white',textAlign:'center',fontSize:20,fontWeight:'bold'}}>{rowData.name}</Text>
      </View>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"

          barStyle="light-content"
            />
        <ListView
          style={{flex:1}}
          showsVerticalScrollIndicator={false}
          dataSource={this.state.listSource}
          renderRow={this.renderRow.bind(this)}
          horizontal={false}
        />
      </View>
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
});

AppRegistry.registerComponent('courseList', () => courseList);
