import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');
const FacebookTabBar = React.createClass({
  tabIcons: [],
  getInitialState() {
    return { tabs: [
      'md-paper',
      'md-text',
      'md-filing',
    ]};
  },
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs:  React.PropTypes.array,
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  setAnimationValue({ value, }) {
    this.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  },

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 255 + (215 - 255) * progress;
    const green = 255 + (215 - 255) * progress;
    const blue = 255 + (215 - 255) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:10,paddingTop: 5,}}>
        <TouchableOpacity onPress={()=>Actions.courseList({type: "reset"})}>
          <Icon name={"ios-arrow-dropleft-circle-outline"} size={30} color={'white'} />
        </TouchableOpacity>
      </View>
      {this.state.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => Actions.pop()} style={ i < 2 ? styles.tab: styles.tab1}>
          <Icon
            name={tab}
            size={30}
            color={this.props.activeTab === i ? 'rgb(255,255,255)' : 'rgb(204,204,204)'}
            ref={(icon) => { this.tabIcons[i] = icon; }}
          />
        </TouchableOpacity>;
      })}
    </View>;
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignSelf:'center',
    alignItems: 'center',
    borderRightWidth:1.5,
    borderRightColor:'white',

    justifyContent: 'center',
  },
  tab1: {
    flex: 1,
    alignSelf:'center',
    alignItems: 'center',
    height:30,
    justifyContent: 'center',
  },
  tabs: {
    height: height/10.5,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor:"#1BB5EC",
  },
});

export default FacebookTabBar;
