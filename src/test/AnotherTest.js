import React from 'react';
import {
    Platform, PixelRatio, StyleSheet, 
    Text, TouchableOpacity, View, TextInput,
    ScrollView, Alert, TouchableHighlight, 
    AsyncStorage, Animated, KeyboardAvoidingView,
    Keyboard, Easing
} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-material-dropdown';
import AntdesignIcons from 'react-native-vector-icons/AntDesign';
import Asterisk from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';
import axios from 'axios';
import {
    CommonModal, IOS_StatusBar, getMarginTop, getMarginBottom, getWidthnHeight,fontSizeH4, AdjustableHeightTextInput,
    FloatingTitleTextInputField, getMarginVertical, DateSelector, WaveHeader, fontSize_H3, ItineraryModal,
    TimePicker, RoundButton, RadioEnable, RadioDisable, AlertBox, DismissKeyboard, getMarginLeft, Date, MySwitch,
    Spinner, getMarginRight, StayModal, statusBarGradient, CustomTextInput, SearchableDropDown, Slider, getMarginHorizontal
} from '../KulbirComponents/common';
import {extractBaseURL} from '../api/BaseURL';

const colorBase = '#25A2F9';
const colorTitle = '#0B8EE8';
const message = "Please fill the fields highlighted in RED";

export default class Pre_Approval_Form extends React.Component {

    constructor(props) {
        super(props)
            this.state = {
                animateBox: new Animated.Value(0),
                animateScaleIcon: new Animated.Value(2),
                animateBar: new Animated.Value(0),
                animateKeyboard: new Animated.Value(0),
                animateStrip: new Animated.Value(0)
            };
            this.startAnimation();
    }

    startAnimation(){
        const {animateBox, animateScaleIcon, animateBar, animateKeyboard, animateStrip} = this.state;
        Animated.loop(
            Animated.stagger(1000, [
                Animated.stagger(400, [
                    Animated.parallel([
                        Animated.timing(animateBox, {
                            toValue: 1,
                            duration: 1000
                        }),
                        Animated.timing(animateScaleIcon, {
                            toValue: 1,
                            duration: 1000
                        }),
                    ]),
                    Animated.timing(animateBar, {
                        toValue: 1,
                        duration: 500
                    })
                ]),
                Animated.stagger(1000, [
                    Animated.parallel([
                        Animated.timing(animateBar, {
                            toValue: 0,
                            duration: 500
                        }),
                        Animated.timing(animateBox, {
                            toValue: 2,
                            duration: 700
                        }),
                        Animated.timing(animateStrip, {
                            toValue: 1,
                            duration: 1000
                        })
                    ]),
                    Animated.timing(animateBox, {
                        toValue: 3,
                        duration: 200,
                        easing: Easing.ease
                    }),
                ]),
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(animateStrip, {
                        toValue: 0,
                        duration: 500
                    }),
                    Animated.timing(animateKeyboard, {
                        toValue: 1,
                        duration: 500
                    })
                ]),
                Animated.delay(500),
                Animated.parallel([
                    Animated.timing(animateBox, {
                        toValue: 1,
                        duration: 700,
                    }),
                    Animated.timing(animateKeyboard, {
                        toValue: 0,
                        duration: 500
                    })
                ]),
                Animated.parallel([
                    Animated.timing(animateBox, {
                        toValue: 0,
                        duration: 700,
                    }),
                    Animated.timing(animateScaleIcon, {
                        toValue: 2,
                        duration: 1000
                    })
                ])
            ])
        ).start();
    }

    render() {
        const {animateBox, animateScaleIcon, animateBar, animateKeyboard, animateStrip} = this.state;
        const borderOpacity = animateBox.interpolate({
            inputRange: [0, 0.5],
            outputRange: ['rgba(255, 255, 255, 0)', 'white'],
            extrapolateRight: 'clamp'
        });
        const animatedStyle = {
            borderColor: borderOpacity,
            borderWidth: getWidthnHeight(1).width,
            borderRadius: 5,
            width: animateBox.interpolate({
                inputRange: [0, 1],
                outputRange: [getWidthnHeight(40).width, getWidthnHeight(23).width],
                extrapolateRight: 'clamp'
            }),
            height: animateBox.interpolate({
                inputRange: [0, 1],
                outputRange: [getWidthnHeight(40).width, getWidthnHeight(30).width],
                extrapolateRight: 'clamp'
            }),
            transform: [
                {
                    rotate: animateBox.interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: ['0deg', '0deg', '-90deg', '-90deg'],
                        extrapolateRight: 'clamp'
                    })
                },
                {
                    scaleX: animateBox.interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: [1, 1, 1, 0.85],
                        extrapolateRight: 'clamp'
                    })
                }
            ]
        }
        const animateIcon = {
            transform: [
                {
                    scale: animateScaleIcon.interpolate({
                        inputRange: [1, 2],
                        outputRange: [2, 4.7],
                    })
                }
            ]
        }
        const animateBarStyle = {
            opacity: animateBar,
            width: animateBar.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(8).width]
            })
        }
        const animateKeyboardStyle = {
            width: animateKeyboard.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(37).width]
            }),
            height: 0,
            borderBottomColor: '#FFFFFF',
            borderBottomWidth: getWidthnHeight(12).width,
            borderLeftWidth: animateKeyboard.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(3).width]
            }),
            borderRightWidth: animateKeyboard.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(3).width]
            }),
            borderRightColor: 'transparent',
            borderLeftColor: 'transparent',
            backgroundColor: 'transparent',
            borderRadius: 0,
        }
        const animateStripStyle = {
            width: animateStrip.interpolate({
                inputRange: [0, 1],
                outputRange: [0, getWidthnHeight(9).width]
            }),
            height: getWidthnHeight(5).width,
            backgroundColor: 'white',
            borderColor: 'red',
            borderWidth: 0,
            borderRadius: getWidthnHeight(1).width
        }
        console.log("DIMENSIONS: ", getWidthnHeight(100, 100))
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                    <WaveHeader
                        wave={Platform.OS ==="ios" ? false : false} 
                        menu='white'
                        title='Another Test Screen'
                    />
                </View>
                <View style={[{backgroundColor: '#7F8288', flex: 1, alignItems: 'center', justifyContent: 'center'}, getWidthnHeight(100)]}>
                    <View style={[{alignItems: 'center', justifyContent: 'center', zIndex: 10, borderColor: 'red', borderWidth: 0}]}>
                        <Animated.View style={[{position: 'absolute', backgroundColor: '#7F8288'}, animatedStyle]}/>
                        <Animated.View style={[{borderWidth: 0, borderColor: 'yellow'}, animateIcon]}>
                            <IonIcons name='logo-react' color='#30C3EA' style={[{borderWidth: 0, borderColor: 'yellow'}]} size={getWidthnHeight(8).width}/>
                        </Animated.View>
                        <View style={[{alignItems: 'center'}]}>
                            <View style={{position: 'absolute'}}>
                                <View style={[{borderColor: 'red', borderWidth: 0}, getMarginTop(4)]}>
                                    <Animated.View style={[{backgroundColor: 'white', borderRadius: 2}, getWidthnHeight(undefined, 0.5), animateBarStyle]}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[{alignItems: 'center', borderColor: 'red', borderWidth: 0}, getMarginTop(4)]}>
                        <View style={{alignItems: 'center', zIndex: -15}}>
                            <Animated.View style={[animateStripStyle]}/>
                            <View style={{position: 'absolute'}}>
                                <View style={[{alignItems: 'center', zIndex: -10, borderRadius: getWidthnHeight(1).width, borderColor: 'red', borderWidth: 0, overflow: 'hidden'}]}>
                                    <Animated.View style={[animateKeyboardStyle]}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
