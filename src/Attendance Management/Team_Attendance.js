import moment from 'moment';
import React from 'react';
import {
    AsyncStorage, Dimensions, FlatList, Alert,
    ActivityIndicator, Image, StyleSheet, Text, Platform,
    TouchableOpacity, View, ScrollView, Animated, PlatformColor
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { extractBaseURL } from '../api/BaseURL';
import { 
    CommonModal, IOS_StatusBar, WaveHeader, getWidthnHeight, statusBarGradient, AnimateDateLabel,
    fontSizeH4, getMarginTop, Spinner, getMarginLeft, getMarginVertical, getMarginBottom
} from '../KulbirComponents/common';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const colorTitle = '#0B8EE8';
const inColor = '#64E291';
const outColor = '#FB3569';
  
const todays = `${moment().year()}-${moment().month() + 1}-${moment().date()}`;

export default class monthlyreport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date:todays,
            user_id:'',
            loading: false,
            monthly:'',
            name:'',
            data:[],
            counter_data:'',
            pic_name_data:'',
            s_date:'',
            activeSwitch: [],
            data_sec:'',
            type:null,
            data_self:'',
            baseURL: null,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            animateDate: new Animated.Value(0),
            showDate: true
        };
    }

    onDecline(){
        this.setState({commonModal: false})
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({commonModal: true})
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }

    componentDidMount(){
        this.animateDateFunction();
        this.team();
    }

    animateDateFunction(show = true){
        const { animateDate } = this.state;
        Animated.timing(animateDate, {
            toValue: (show)? 1 : 0,
            duration: 300
        }).start(({finished}) => {
            if(finished){
                this.setState({showDate: show});
            }
        })
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
        })
    }

    view_sec=()=>{
        const a="jarwal";
        console.log(a)
    }

    team_one=()=>{
        const a="team";
        this.setState({type:a})
    }

    self_one=()=>{
        const a="self";
        this.setState({type:a})
    }

    team =async() =>{
        await this.extractLink();
        const {baseURL} = this.state;
        const context=this;
        const _this = this;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_sec=permissions_fir.success.secret_token;
        var data = new FormData();
        const {date,type}=this.state;
        console.log(type)
        if(date===""){
            Alert.alert("Please select date")
        }else{

        }
        data.append("on_date", date);
        data.append("attendance_type", "team");

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState !== 4) {
                                return;
            }
            if(xhr.status===200){
                _this.hideLoader();
                var json_obj = JSON.parse(xhr.responseText);
                var c = json_obj.success.employees;
                var d = json_obj.success.attendance_data;
                //console.log("@@@ DATA: ", c)
                context.setState({data:c});
                context.setState({data_self:d});
                context.animateDateFunction(false);
            }
            else{
              console.log("inside error")
              _this.hideLoader();
              _this.enableModal(xhr.status, "010");
            }
        });

        xhr.open("POST", `${baseURL}/attendance-detail`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_sec);
        xhr.send(data);
    }

    functionCombined() {
        this.team();
    }
    renderHeader(){
        return (
            <WaveHeader
                wave={Platform.OS ==="ios" ? false : false} 
                //logo={require('../Image/Logo-164.png')}
                menu='white'
                title='Team Attendance'
                //version={`Version ${this.state.deviceVersion}`}
            />
        );
    }

    showCalender(){
        const { showDate } = this.state;
        if(showDate){
            this.animateDateFunction(false);
        }else{
            this.animateDateFunction();
        }
    }

    render() {
        const {data, animateDate, loading}=this.state;
        //console.log("MAX DATE: ", `${moment().year()}-${moment().month() + 1}-${moment().date()}`)
        // console.log(data)
        const animatedStyle = {
            transform: [
                {
                    translateX: animateDate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [getWidthnHeight(-50).width, getWidthnHeight(-4.5).width]
                    })
                }
            ],
            marginLeft: getMarginLeft(2).marginLeft,
        }
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                    {this.renderHeader()}
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>  
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <View style={[{alignItems: 'flex-start', ...Platform.select({ios: {zIndex: 15}})}, getWidthnHeight(100), getMarginBottom(1)]}>
                            <View style={{zIndex: 10, position: 'absolute'}}>
                                <Animated.View style={[{
                                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                                    borderTopRightRadius: getWidthnHeight(10).width, borderBottomRightRadius: getWidthnHeight(10).width
                                    }, styles.dateStyle, getMarginTop(2), getWidthnHeight(60, 9), animatedStyle
                                ]}>
                                    <AnimateDateLabel
                                        containerColor={['#C4C4C4', '#C4C4C4']}
                                        containerBorderWidth={[1 , 1]}
                                        containerStyle={[{
                                            borderRadius: getWidthnHeight(1).width, justifyContent: 'center',
                                            backgroundColor: 'white'
                                        }, getWidthnHeight(40, 6.5), getMarginLeft(4)]}
                                        slideVertical={[0, getWidthnHeight(undefined, -3.3).height]}
                                        slideHorizontal={[0, getWidthnHeight(-15).width]}
                                        style={[{justifyContent: 'center'}, getWidthnHeight(40, 6.5)]}
                                        date={this.state.date}
                                        minDate="2018-01-01"
                                        maxDate={todays}
                                        mode="date"
                                        placeholder="Date"
                                        format="YYYY-MM-DD"
                                        onDateChange={(date) => {this.setState({date: date}, () => this.team())}}
                                    />
                                    <TouchableOpacity 
                                        style={[{
                                            borderColor: 'black', borderWidth: 0, alignItems: 'center', justifyContent: 'center'
                                        }, getWidthnHeight(10, 8)]} 
                                        onPress={() => {
                                            this.showCalender();
                                        }}
                                    >
                                        <FontAwesome name='angle-double-right' color={colorTitle} size={getWidthnHeight(8).width}/>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </View>
                        <Animated.View style={[{flex: 1, zIndex: 5}]}>
                            <FlatList 
                                data={data}
                                keyExtractor={(item) => item.employee_code}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={[{alignItems: 'center'}, getMarginBottom(2)]}>
                                            <LinearGradient 
                                                start={{x: 0, y: 1}} end={{x: 1, y: -1}}
                                                colors={["#292C6D", "#6867AC"]}
                                                style={[{
                                                    alignItems: 'center', justifyContent: 'center', borderRadius: getWidthnHeight(4).width,
                                                    shadowColor: 'black', shadowOpacity: 0.4, shadowRadius: 2, elevation: 3
                                                }, getWidthnHeight(70)]}
                                            >
                                                <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                                                    <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingTop: getMarginTop(1).marginTop}, getWidthnHeight(70)]}>
                                                        <View style={[{alignItems:'center'}]}>
                                                            <Image 
                                                                source={{uri:item.profile_picture}} 
                                                                resizeMode="cover" 
                                                                style={{
                                                                    width: getWidthnHeight(17).width, height: getWidthnHeight(17).width, borderRadius: getWidthnHeight(8.5).width,
                                                                    borderColor: 'white', borderWidth: 2
                                                                }}
                                                            />
                                                        </View>
                                                        <View style={{alignItems: 'center'}}>
                                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                                {/* <View style={[{backgroundColor: inColor, width: getWidthnHeight(3).width, height: getWidthnHeight(3).width, borderRadius: getWidthnHeight(1.5).width}]}/> */}
                                                                <View style={[{borderColor: 'white', borderWidth: 0}, getWidthnHeight(10)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white'}]}>IN:</Text>
                                                                </View>
                                                                <View style={[{backgroundColor: 'white', borderRadius: getWidthnHeight(1).width, alignItems: 'center', justifyContent: 'center'}, getMarginLeft(2), getWidthnHeight(20)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'black'}]}>{item.attendance_data.first_punch}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginTop(1)]}>
                                                                {/* <View style={[{backgroundColor: outColor, width: getWidthnHeight(3).width, height: getWidthnHeight(3).width, borderRadius: getWidthnHeight(1.5).width}]}/> */}
                                                                <View style={[{borderColor: 'white', borderWidth: 0}, getWidthnHeight(10)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white'}]}>OUT:</Text>
                                                                </View>
                                                                <View style={[{backgroundColor: 'white', borderRadius: getWidthnHeight(1).width, alignItems: 'center', justifyContent: 'center'}, getMarginLeft(2), getWidthnHeight(20)]}>
                                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white'}]}>{item.attendance_data.last_punch}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <Text style={[{fontSize: (fontSizeH4().fontSize - 1), color: 'white', paddingVertical: getMarginTop(1).marginTop}]}>{item.fullname.toUpperCase()}</Text>
                                                </View>
                                            </LinearGradient>
                                        </View>
                                    );
                                }}
                            />
                        </Animated.View>
                    </View>
                    <View 
                        style={[{
                        backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center', zIndex: 20
                        }, StyleSheet.absoluteFill]} 
                        pointerEvents={(loading)? 'auto' : 'none'}
                    >
                        {(loading) &&
                            <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                        }
                    </View>
                </View>
            </View>
        )}
    }

const styles = StyleSheet.create({
    dateStyle: {
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        elevation: 3,
        ...Platform.select({
            ios: {
                shadowOffset: {
                    width: 0,
                    height: 0
                }
            }
        })
    },
    loadingStyle: {
        flexDirection:'row', 
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
        //position: 'absolute', 
        borderRadius: 10,      
        shadowOffset:{width: 0,  height: 5},
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        borderColor: 'red',
        borderWidth: 0,
    }
});
