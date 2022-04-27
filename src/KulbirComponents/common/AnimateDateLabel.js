import React, {Component} from 'react';
import {View, Text, TextInput, Animated, TouchableOpacity, StyleSheet, Keyboard, ScrollView, Platform} from 'react-native';
import moment from 'moment';
import Close from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-datepicker';
import {number, string, func, array, bool} from 'prop-types';
import {getWidthnHeight, getMarginLeft, fontSizeH4} from './width';

class AnimateDateLabel extends Component {

    constructor(props){
        super(props)
        this.state = {
            animateLabel: new Animated.Value(0),
            fontWeight: 'normal'
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.date === ''){
            const animateLabel = state.animateLabel;
            Animated.timing(animateLabel, {
                toValue: 0,
                duration: 200
            }).start();
        }else{
            const animateLabel = state.animateLabel;
            Animated.timing(animateLabel, {
                toValue: 1,
                duration: 200
            }).start();
        }
        return null;
    }

    onFocus(){
        const {date} = this.props;
        if(!date){
            const {animateLabel} = this.state;
            Animated.timing(animateLabel, {
                toValue: 1,
                duration: 200
            }).start();
        }
    }

    onBlur(){
        const {animateLabel} = this.state;
        Animated.timing(animateLabel, {
            toValue: 0,
            duration: 200
        }).start();
    }

    render(){
        const {
            placeholder = "Date of Birth", date = '', containerStyle, minDate = '2012-01', maxDate = `${moment().year()}-12`,
            onDateChange = () => {}, slideVertical = [0, getWidthnHeight(undefined, -3.5).height], disabled = false,
            placeholderScale = [1, 0.75], slideHorizontal= [0, getWidthnHeight(-2).width], titleStyle = null,
            placeholderColor = ['#C4C4C4', '#0B8EE8'], containerColor = ['#C4C4C4', '#0B8EE8'], dateIcon = null,
            containerBorderWidth = [1, 2], mode = "date", format = "YYYY-MM-DD", style = null, titleContainer = null
        } = this.props;
        const {animateLabel, fontWeight} = this.state;
        const placeholderStyle = {
            transform: [
                {
                    translateX: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: slideHorizontal
                    })
                },
                {
                    translateY: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: slideVertical
                    })
                },
                {
                    scale: animateLabel.interpolate({
                        inputRange: [0, 1],
                        outputRange: placeholderScale
                    })
                }
            ],
            color: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: placeholderColor
            })
            // fontWeight: animateLabel.interpolate({
            //     inputRange: [0, 1],
            //     outputRange: ['normal', 'bold']
            // }),
        }
        const animateContainer = {
            color: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: containerColor
            }),
            borderWidth: animateLabel.interpolate({
                inputRange: [0, 1],
                outputRange: containerBorderWidth
            }),
        }
        return (
            <View>
                <Animated.View style={[containerStyle, {borderColor: animateContainer.color, borderWidth: animateContainer.borderWidth}]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <DatePicker
                            customStyles={{
                                dateInput: {borderWidth: 0}, 
                                dateText: {color: (date)? 'black' : 'transparent', fontSize: (fontSizeH4().fontSize + 2)},
                                dateIcon
                            }}
                            disabled={disabled}
                            style={[style]}
                            date={(date)? date : ''}
                            mode={mode}
                            //placeholder={""}
                            format={format}
                            minDate={minDate}
                            maxDate={maxDate}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            onDateChange={(date) => {
                                this.onFocus();
                                onDateChange(date);
                                Keyboard.dismiss();
                            }}
                        />
                    </View>
                    <View pointerEvents='none' style={[{position: 'absolute', justifyContent: 'center', borderColor: 'red', borderWidth: 0, alignSelf: 'center'}, titleContainer]}>
                        <Animated.Text style={[{
                            textAlignVertical: 'center', textAlign: 'center', color: '#C4C4C4', zIndex: 1, backgroundColor: 'white', fontWeight: fontWeight
                        }, getMarginLeft(1), placeholderStyle, titleStyle, styles.boldFont]}> {placeholder} </Animated.Text>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    boldFont:  {
        ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
        )
    }
})

export {AnimateDateLabel};