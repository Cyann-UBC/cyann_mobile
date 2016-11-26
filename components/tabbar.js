import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


var animations = {
  layout: {
    spring: {
      duration: 950,
      create: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 100,
      },
    },
    linear: {
      duration: 250,
      create: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 100,
      },
    },
    easeInEaseOut: {
      duration: 900,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 0,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  },
};
var Dimensions = require('Dimensions');
var {
  width,
  height
} = Dimensions.get('window');
const FacebookTabBar = React.createClass({
  tabIcons: [],
  getInitialState() {
    return {
      tabs: [
        'list-alt',
        'pencil',
        'paperclip',
        'user'
      ],
      textContainerHeight:15,
    };
  },
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs:  React.PropTypes.array,
    jwt: React.PropTypes.object
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
    const red = 255 + (155 - 255) * progress;
    const green = 255 + (155 - 255) * progress;
    const blue = 255 + (155 - 255) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  changeTextAndGo(i){
    this.props.goToPage(i)
  },
  render() {
    LayoutAnimation.configureNext(animations.layout.spring)
    return <View  style={[styles.tabs, this.props.style, ]}>
      <Animatable.View animation={'bounceInDown'} duration={700} style={{flex:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:20}}>
        <TouchableOpacity onPress={()=>Actions.courseList({type:'reset',jwt:this.props.jwt})}>
          <FontAwesomeIcon name={"arrow-left"} size={27} color={'white'} />
        </TouchableOpacity>
      </Animatable.View>

        {this.state.tabs.map((tab, i) => {
          if(i==0){
            var text = 'posts'
          }
          else if(i==1){
            var text = 'ask'
          }
          else if(i ==2){
            var text = 'files'
          }
          else if(i ==3){
            var text = 'user'
          }

          return <TouchableOpacity key={tab} onPress={() => this.changeTextAndGo(i)} style={ styles.tab}>
            <Animatable.View animation={'bounceInDown'} delay={i===0?200:i*250} duration={700}>
              <FontAwesomeIcon
                name={tab}
                size={30}
                color={this.props.activeTab === i ? 'rgb(255,255,255)' : 'rgb(155,155,155)'}
                ref={(icon) => { this.tabIcons[i] = icon; }}
              />
            </Animatable.View>
        </TouchableOpacity>;
      },this)}
    </View>;
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignSelf:'center',
    height:25,
    width:30,
    paddingTop:7,
    alignItems: 'center',

    backgroundColor:'transparent',
    justifyContent: 'center',
  },
  tab1: {
    flex: 1,
    alignSelf:'center',
    alignItems: 'center',
    height:25,
    width:35,
    paddingTop:7,
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
    backgroundColor:"#102942",
  },
});

export default FacebookTabBar;
