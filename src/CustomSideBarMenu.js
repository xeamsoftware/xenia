//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { DrawerItems } from 'react-navigation-drawer';
import {createStackNavigator,StackNavigator} from 'react-navigation-stack';
import Base_url from './Base_url';

export default class CustomSidebarMenu extends Component {
  static navigationOptions = {
     headerLeft:null,
   }
   constructor(props){
         super(props)
             this.state={
                           successToken:'',
                           userName:'',
                           loading: false,
                         }
           this.items = [
             {
               navOptionThumb: 'camera',
               navOptionName: 'Home',
               screenToNavigate: 'Screen1',
             },
             {
               navOptionThumb: 'image',
               navOptionName: 'Attendance',
               screenToNavigate: 'Screen3',
             },
             {
               navOptionThumb: 'build',
               navOptionName: 'Leave Management',
               screenToNavigate: 'Screen4',
             },
           ];
 }
    //Setting up the Main Top Large Image of the Custom Sidebar

    //Array of the sidebar navigation option with icon and screen to navigate
    //This screens can be any screen defined in Drawer Navigator in App.js
    //You can find the Icons from here https://material.io/tools/icons/
 // componentDidMount(){
 //   const a="bro";
 //   const context=this;
 //   var userObj = (context.props.navigation.state.params.userObj);
 //   console.log(userObj);
 //   console.log(a);
 // }

  render() {

    const {navigate} = this.props.navigation;
    return (
      <View style={styles.sideMenuContainer}>
        {/*Top Large Image */}
        <Image
          source={{ uri: this.proileImage }}
          style={styles.sideMenuProfileIcon}
        />
        {/*Divider between Top Image and Sidebar Option*/}
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#e2e2e2',
            marginTop: 15,
          }}
        />
        {/*Setting up Navigation Options from option array using loop*/}
        <View style={{ width: '100%' }}>

          {this.items.map((item, key) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
              }}
              key={key}>
              <View style={{ marginRight: 10, marginLeft: 20 }}>

              </View>
              <Text
                style={{
                  fontSize: 15,
                  color: global.currentScreenIndex === key ? 'red' : 'black',
                }}
                onPress={() => {
                  global.currentScreenIndex = key;
                  this.props.navigation.navigate(item.screenToNavigate);
                }}>
                {item.navOptionName}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 50,
    height: 50,
    marginTop: 20,
    borderRadius: 150 / 2,
  },
});
