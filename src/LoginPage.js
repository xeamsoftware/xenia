import React, {Component} from 'react';
import {
    View, StyleSheet, TextInput, ActivityIndicator,
    Text, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, 
    Alert, Dimensions, Keyboard, Linking, Animated, Easing, ScrollView, 
    Platform, BackHandler, ToastAndroid, Image, ImageBackground, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import {Actions} from 'react-native-router-flux';
import ActionModal from 'react-native-modal';
import RNExitApp from 'react-native-exit-app';
import {connect} from 'react-redux';
import DeviceInfo, {getDeviceId} from 'react-native-device-info';
import axios from 'axios';
import { getAppstoreAppMetadata } from "react-native-appstore-version-checker";
//import firebase  from './firebase';
import RNFirebase from '@react-native-firebase/app';
import firebase from './firebase';
import messaging from '@react-native-firebase/messaging';
import LinearGradient from 'react-native-linear-gradient';
import Logo from './header_sec';
import {login, extractBaseURL} from './api/BaseURL';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import PasswordKey from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    getWidthnHeight, Spinner, CommonModal, ChangePassword, IOS_StatusBar, MaskedGradientText,
    getMarginTop, fontSizeH2, InputText, LoginButton, getMarginLeft, statusBarGradient,
    DismissKeyboard, ReactLoader, Slider, getMarginRight, fontSizeH4, DesktopLoader, GradientIcon
} from './KulbirComponents/common';
import {sendProps} from './actions';
//import { RadioButton } from 'react-native-simple-radio-button';

// import { Notifications, NotificationAction, NotificationCategory } from 'react-native-notifications'
let beginCount;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

class LoginPage extends Component {
  	constructor(props){
    super(props)
        this.state={
            employee_code:'',
            userPassword:'',
            device_id: null,
            device_type:'',
            loading: true,
            name:'',
            code:'',
            permissions:'',
            counter:0,
            baseURL: null, 
            userObj: null,
            token: null,
            reload: false,
            showTip: false,
            showPassword: false,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            clickCount: null,
            selectServerModal: false,
            liveLink: '',
            testLink: '',
            serverLink: '',
            bgImage: new Animated.Value(0),
            xeamLogo: new Animated.Value(0),
            versionOpacity: new Animated.Value(0),
            showSlider: true,
            sliderState: false,
            playStoreAppVersion: '',
            currentVersion: DeviceInfo.getVersion(),
            iOSLink: '',
            countTouch: 0,
            exitCount: 0,
            showChangePassModal: false,
            changePassStep: null,
            minuteHand: 0,
            secondHand: 0,
            resetTimer: true,
            onboardingLive: '',
            onboardingTest: '',
            firebaseLink: null
        }
        if(!this.state.firebaseLink){
            database().ref('/url').on('value', snapshot => {
                //console.log('$$$ @@@ User data: ', snapshot.val());
                const realTimeDatabase = snapshot.val();
                const { live, test } = realTimeDatabase;
                this.setState({
                    liveLink: live.erp, testLink: test.erp, serverLink: live.erp,
                    onboardingLive: live.onboarding, onboardingTest: test.onboarding
                }, () => {
                    const { 
                        liveLink, testLink, serverLink, onboardingLive, onboardingTest, showSlider, sliderState
                    } = this.state;
                    console.log(
                        "\nLIVE: ", liveLink, "\nTEST: ", testLink, "\nSERVER LINK: ", serverLink,
                        "\nONBOARDING LIVE: ", onboardingLive, "\nONBOARDING TEST: ", onboardingTest
                    )
                    if(!this.state.sliderState && this.state.showSlider){
                        this.setState({serverLink: this.state.testLink})
                    }
                    AsyncStorage.setItem("onboardingURL", (showSlider && !sliderState)? onboardingTest : onboardingLive);
                })
            });
        }
    }
           
    componentDidMount(){
        const {sliderState, showSlider, testLink, liveLink} = this.state;
        const {navigation, bgImage, xeamLogo} = this.props;
        //Alert.alert("ALERT 3");
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton());
        this._unsubscribe = navigation.addListener("didFocus", async() => {
            //console.log("PLEASE LOGIN: ", DeviceInfo.getUniqueId())
            const promiseToken = await AsyncStorage.getItem('userObj');
            Promise.all([promiseToken]).then((values) => {
                const userObj = values[0];
                //console.log("#### @@@@ LOGIN PAGE: ", typeof userObj, userObj)
                if(!userObj){
                    this.setState({loading: false}, () => {
                        this.checkXeniaUpdate();
                    })
                }else{
                    this.checkXeniaUpdate();
                }
            })
        })
    }

    resetTimerFunction(){
        this.setState({resetTimer: false, minuteHand: 1, secondHand: 59}, () => {})
    }

    startCount(){
        this.resetTimerFunction();
        beginCount = setInterval(() => {
            const {minuteHand, secondHand} = this.state;
            console.log("@@@@MINUTE: ", minuteHand, "SECOND: ", secondHand)
            if(minuteHand === 1 && secondHand >= 0){
                this.setState({secondHand: secondHand - 1}, () => {
                    const {secondHand} = this.state;
                    if(secondHand < 0){
                        this.setState({minuteHand: 0, secondHand: 59});
                    }
                })
            }else if(minuteHand === 0 && secondHand >= 0){
                this.setState({secondHand: secondHand - 1}, () => {
                    const {secondHand} = this.state;
                    if(secondHand < 0){
                        this.setState({resetTimer: true})
                        clearInterval(beginCount);
                    }
                })
            }
        }, 1000);
    }
    
    componentWillUnmount(){
        this.backHandler.remove();
        this._unsubscribe.remove();
        //BackHandler.removeEventListener('hardwareBackPress', () => this.handleBackButton())
    }

    showSliderFunction(){
        this.setState({countTouch: (this.state.countTouch + 1)}, () => {
            //console.log("KEEP COUNTING: ", this.state.countTouch)
            if(this.state.countTouch === 1){
                setTimeout(() => {
                    this.setState({countTouch: 0}, () => {
                        //console.log("RESET COUNT: ", this.state.countTouch)
                    })
                }, 4000)
            }
            if(this.state.countTouch === 13){
                this.setState({
                    showSlider: true, countTouch: 0, 
                    serverLink: this.state.testLink, 
                    userPassword: 'xeam@123'
                }, async () => {
                    clearTimeout();
                    await AsyncStorage.removeItem('onboardingURL');
                    AsyncStorage.setItem("onboardingURL", (this.state.showSlider && !this.state.sliderState)? this.state.onboardingTest : this.state.onboardingLive);
                })
            }
        })
    }

    checkXeniaUpdate(){
        this.showBackground((checkVersion = false) => {
            if(checkVersion){
                if(Platform.OS === "android"){
                    getAppstoreAppMetadata("com.xenia") //put any apps packageId here
                    .then(metadata => {
                        this.setState({playStoreAppVersion: metadata.version}, () => {
                            console.log("###$$$ Xenia version on Playstore: ", this.state.playStoreAppVersion);
                            this.initialize();
                        })
                    })
                    .catch(err => {
                        this.initialize();
                        console.log("error occurred", err);
                        //Alert.alert('Error!', 'Close the app and try again');
                    });        
                }else{
                    this.checkiOSUpdate();
                }
            }
        });
    }

    checkiOSUpdate(){
        const userID = 'fO81JtVcAfQ5BIALRz094zLBpW52';
        const appID = 'b2TgtDNCt4DQCtCJAPm5';
        const platform = 'ios';
        const appHostURL = `https://appho.st/api/get_current_version/?u=${userID}&a=${appID}&platform=${platform}`;
        //this.showLoader();
        axios.get(appHostURL).then((response) => {
            //this.hideLoader();
            const responseJson = (response.data);
            console.log("!!!### APPHOST SUCCESS", responseJson)
            this.setState({playStoreAppVersion: responseJson.version, iOSLink: responseJson.url}, () => {
                console.log("$#$#!!! Xenia version on App Host: ", this.state.playStoreAppVersion, this.state.iOSLink);
                this.initialize();
            })
        }).catch((error) => {
            //this.hideLoader();
            this.initialize();
            console.log("AXIOS ERROR: ", error)
            let status = null;
            if(error.response){
                status = error.response.status;
                //Alert.alert("Error!", `Close the app and try again. Error Code: ${status}146`);
            }else{
                //Alert.alert("Error!", `Close the app and try again. ${error} API CODE: 146`);
            }
        });
    }

    openGooglePlayStore(){
        Linking.openURL("market://details?id=com.xenia");
    }

    async openAppHostIOS(){
        await Linking.openURL(this.state.iOSLink);
    }

    showBackground(callBack){
        const {bgImage, xeamLogo} = this.state;
        Animated.sequence([
            Animated.parallel([
                Animated.timing(bgImage, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.ease
                }).start(),
                Animated.timing(xeamLogo, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.ease
                })          
            ]),
            Animated.timing(this.state.versionOpacity, {
                toValue: 1,
                duration: 100
            })
        ]).start(({finished}) => {
            if(finished){
                callBack(true)
            }
        })
    }

    hideBackground(){const {bgImage, xeamLogo} = this.state;
        Animated.parallel([
            Animated.timing(bgImage, {
                toValue: 0,
                duration: 700,
                easing: Easing.ease
            }).start(),
            Animated.timing(xeamLogo, {
                toValue: 0,
                duration: 700,
                easing: Easing.ease
            }),
            Animated.timing(this.state.versionOpacity, {
                toValue: 0,
                duration: 400
            }).start()        
        ]).start(() => {
            this.login();
            this.hide();
        })
    }

    handleBackButton(){
        const {exitCount} = this.state;
        console.log("### CALLED")
        if(Actions.currentScene === 'login'){
            Alert.alert("Alert", "Are you sure you want to close the app ?", [
                {
                    text: "CANCEL",
                    onPress: () => null
                },
                {
                    text: "YES",
                    onPress: () => BackHandler.exitApp()
                }
            ])
            return true;
        }
    }

    setExitCount(){
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
        return true;
    }

    initialize(){
        //Alert.alert("ALERT 4");
        const deviceInfo2 = DeviceInfo.getSystemName();
        this.setState({device_type : deviceInfo2}, () => {
            console.log('%^%^&&& DEVICE TYPE: ', deviceInfo2)
            if(Platform.OS === 'ios'){
                this.checkiOSPermission().done();
            }else if(Platform.OS === 'android'){
                this.requestUserPermission();
            }
        });
    }

    requestUserPermission = async () => {
        //Alert.alert("ALERT 5");
        await firebase.messaging().registerDeviceForRemoteMessages();
        const token = await firebase.messaging().getToken();
        this.setState({device_id: token}, () => this.value());
    }

    value_thrd= async()=>{
        console.log("iOS Detected*****")
        //await messaging().registerDeviceForRemoteMessages();
        await firebase.messaging().requestPermission().then(async(success) => {
          console.log("IOS ACK: ", Boolean(success))
          const token = await firebase.messaging().getToken()
          //this.setState({device_id : DeviceInfo.getUniqueId()})
          this.setState({device_id : token}, () => {
            console.log("IOS TOKEN: ", this.state.device_id)
            if(this.state.device_id){
              this.value();
            }
          })
        }).catch((error) => {
          console.log("IOS NACK: ", Boolean(error))
          Alert.alert("Request TimeOut. \n To Allow: \n Goto Settings -> Xenia -> Notifications -> Allow Notifications \n Afterwards, clear app from background and try again.")
          RNExitApp.exitApp();
        })
    }

    async value(){
        const promiseEmpCode = AsyncStorage.getItem('user');
        const promisePassword = AsyncStorage.getItem('user_pass');
        const promiseToken = AsyncStorage.getItem('userObj');
        Promise.all([promiseEmpCode, promisePassword, promiseToken]).then((values) => {
            const {sliderState, showSlider} = this.state;
            const empCode = values[0];
            const password = values[1];
            const userObj = values[2];
            this.setState({
                employee_code: empCode, userPassword: (!sliderState && showSlider)? 'xeam@123' : password,
                token: userObj
            }, () => {});
            const {employee_code, userPassword, token, device_id, device_type, playStoreAppVersion, currentVersion} = this.state;
            console.log("^^^^^^^USERNAME and PASSWORD: ", employee_code, userPassword, "\n", device_type, device_id, playStoreAppVersion, currentVersion);
            if(typeof token === "string"){
                if(playStoreAppVersion > currentVersion){
                    console.log("DUMMY NEW VERSION IS NOW LIVE");
                    if(employee_code && userPassword){
                        this.login();
                    }
                }else{
                    console.log("&&&&&#####&&&&& TOKEN AVAILABLE")
                    const data = JSON.parse(token);
                    this.props.sendProps(token);
                    if(data.success.hasOwnProperty('dashboard_ui')){
                        Actions.main();
                    }else{
                        Actions.coupons();
                    }
                    return;
                }
            }
        }).catch((error) => {
            Alert.alert(error);
        })
    }

    checkiOSPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        console.log("PROMISE CHECK: ", enabled)
        if(enabled){
            this.value_thrd();
        } else {
            this.requestiOSPermission();
        }
    }

    requestiOSPermission = async () => {
        await firebase.messaging().requestPermission()
        .then(() => {
          this.checkiOSPermission();
        })
        .catch((error) => {
          console.log("REQUEST PERMISSION: ", error)
          // User has rejected permissions 
        })
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }

  	login = async() =>{
        // console.log(isLoading);
        console.log("I am inside login()", `${this.state.serverLink}/login`)
        const {employee_code,userPassword,isLoading,device_id,device_type, baseURL} = this.state;
        //	let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(employee_code==""){
            console.log("emp code is empty")
            //alert("Please enter Email address");
            // this.setState({employee:'Please enter Employee id'})
            // this.setState({ isLoading: true });
            let employee='Please enter Employee id';
            Alert.alert(employee);
        }
        else if(userPassword==""){
            console.log('abc')
            this.setState({userPassword:'Please enter Password'})
            // this.setState({ isLoading: true });
              Alert.alert("INVAILD ID");
        }
        else {
            console.log("I am going to call login api")
            var data = JSON.stringify({
                // we will pass our input data to server
                employee_code: this.state.employee_code,
                password: this.state.userPassword,
                device_id: this.state.device_id,
                device_type: this.state.device_type,
            })
            console.log(device_id);
            console.log(device_type);
            const _this = this;
            this.showLoader();
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.timeout = 60000;
            const context=this;
            xhr.addEventListener("readystatechange", async () => {
                console.log(xhr.status)
                console.log(xhr.readyState)
                if (xhr.readyState !== 4) {
                                            return;
                                          }
                if (xhr.status === 200) {
                    _this.hideLoader();
                    console.log("Successfully200")
                    _this.props.sendProps(xhr.responseText);
                    const data = JSON.parse(xhr.responseText);
                    //console.log("HELLO :", data.success.hasOwnProperty('dashboard_ui'))

                    //IMPORTANT LINK - DO NO DELETE
                    //********Central DB XEAM BPO - Uncomment this line to use********//
                    //await AsyncStorage.setItem('receivedBaseURL', data.success.base_url)

                    //TO SHIFT THE APP TO Central DB XEAM BPO - Comment this line
                    AsyncStorage.setItem('receivedBaseURL', this.state.serverLink);
                    AsyncStorage.setItem('user',employee_code);
                    AsyncStorage.setItem('user_pass',userPassword);
                    AsyncStorage.setItem('user_token',xhr.responseText);
                    AsyncStorage.setItem('userObj',xhr.responseText);
                    if(data.success.hasOwnProperty('dashboard_ui')){
                        Actions.main();
                    }else{
                        Actions.coupons();
                    }
                    // await extractBaseURL().then((baseURL) => {
                    //   _this.setState({baseURL}, () => console.log("EXTRACT LINK: ", _this.state.baseURL))
                    // })
                    //_this.receivedBaseURL();
                    // console.log("login", xhr.responseText, "EMPLOYER: ", user)
                }else if (xhr.status === 401){
                    var json_obj = JSON.parse(xhr.responseText);
                    var login_error = json_obj.error;
                    _this.hideLoader();
                    console.log("json_obj",xhr.responseText)
                    console.log("login_error",login_error)
                    Alert.alert(login_error, '', [
                        {text: 'OK', onPress: () => this.showBackground(() => {})}
                    ]);
                }
                else {
                    _this.hideLoader();
                    console.log('@@@@@RPT Error: ', this.responseText, `${this.state.serverLink}/login`);
                    Alert.alert('Error!', `Error Code: ${xhr.status}107`, [
                        {text: 'OK', onPress: () => this.showBackground(() => {})}
                    ])
                }
                    // if (xhr.status === 500){
                    //   _this.hideLoader();
                    //   Alert.alert("Internal Server Error")
                    // }if (xhr.status === 401){
                    //   var json_obj = JSON.parse(xhr.responseText);
                    //   var login_error = json_obj.error;
                    //   console.log("json_obj",xhr.responseText)
                    //   console.log("login_error",login_error)
                    //   Alert.alert(login_error);
                    //   _this.hideLoader();
                    // }
                    //  else {
                    //
                    //  var json_obj = JSON.parse(xhr.responseText);
                    //  var login_error = json_obj.error;
                    //  console.log("json_obj",xhr.responseText)
                    //  console.log("login_error",login_error)
                    //  Alert.alert(login_error);
                    //  _this.hideLoader();
                    //  }
                    // else{
                    //   var json_obj = JSON.parse(xhr.responseText);
                    
                    //   Alert.alert(json_obj);
                    //     _this.hideLoader();
                    // }
                });
                xhr.open("POST", `${this.state.serverLink}/login`);
                xhr.setRequestHeader("accept", "application/json");
                xhr.setRequestHeader("content-type", "application/json");
                xhr.send(data);		
        }
    }

    receivedBaseURL = async() =>{
        console.log("I am inside receivedBaseURL()")
        const {employee_code, userPassword, isLoading, device_id, device_type, baseURL} = this.state;
        console.log("About to call Second Login API", employee_code, userPassword, device_id, device_type, baseURL)
        var data = JSON.stringify({
            employee_code: employee_code,
            password: userPassword,
            device_id: device_id,
            device_type: device_type,
        })
        const _this = this;
        this.showLoader();
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.timeout = 60000;
        const context=this;
        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                _this.hideLoader();
                _this.props.sendProps(xhr.responseText);
                console.log("***RECEIVED BASEURL - Successfully200: ", baseURL)
                AsyncStorage.setItem('user',employee_code);
                AsyncStorage.setItem('user_pass',userPassword);
                AsyncStorage.setItem('user_token',xhr.responseText);
                AsyncStorage.setItem('userObj',xhr.responseText);
                const data = JSON.parse(xhr.responseText);
                const user = data.success.project;
                console.log("Login: ", xhr.responseText, "EMPLOYER: ", user)
                Actions.main();
            }if (xhr.status === 500){
                _this.hideLoader();
                Alert.alert("Internal Server Error")
            }if (xhr.status === 401){
                var json_obj = JSON.parse(xhr.responseText);
                var login_error = json_obj.error;
                console.log("json_obj",xhr.responseText)
                console.log("login_error",login_error)
                Alert.alert(login_error);
                _this.hideLoader();
            }
        });
        xhr.open("POST", `${baseURL}/login`);
        xhr.setRequestHeader("accept", "application/json");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.send(data);    
    }

    hide =()=>{
        const a= Keyboard.dismiss();
    }

    functionCombined() {
        if(this.state.employee_code && this.state.userPassword){
            this.hideBackground();
        }else {
            Alert.alert("Please enter both credentials")
        }
    }

    render () {
        const {
            bgImage, xeamLogo, versionOpacity, loading, showSlider, device_id, showChangePassModal,
            changePassStep, resetTimer, playStoreAppVersion, currentVersion
        } = this.state;
        let directLogin = false;
        console.log("ASYNC CHECK: ", )
            const animateRight = bgImage.interpolate({
                inputRange: [0, 1],
                outputRange: ['-100%', '-0.5%']
            })
            const animateBGImage = {
                //opacity: bgOpacity
                right: animateRight
            }
            const animateLeftLogo = xeamLogo.interpolate({
                inputRange: [0, 1],
                outputRange: ['-300%', '0%']
            })
            const animateLogo = {
                left: animateLeftLogo,
            }
        const {errorCode, apiCode, selectServerModal} = this.state;
        const {navigate} = this.props.navigation;
        const card = {card: {width: '100%', height: '100%',backgroundColor: '#edeceb'}};
        let gradientShadow = ['#0D4EBA', '#197EC4'];
        let gradient = ['#039FFD', '#EA304F']
        const circleWidth = getWidthnHeight(70)
        const circleHeight = {height: circleWidth.width}
        //console.log("@@@@ APP MODE: ", Math.floor(getWidthnHeight(6).width), __DEV__);
        //console.log("device_type", this.state.device_type);
        //console.log("REDUX PROPS: ", this.props)
        //Alert.alert("ALERT 2");
        const _this = this;
        const newIcon = (<MaterialIcons name={'fiber-new'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(10).width}/>);
        const newIconOpacity = (<MaterialIcons name={'fiber-new'} style={{opacity: 0}} size={getWidthnHeight(10).width}/>);
        const animateOpacity = {
            opacity: versionOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
        }
        return (
            <View style={{flex: 1}}>
            <StatusBar hidden={false} barStyle="dark-content" />
            {(!loading) && 
                <View style={{flex: 1}}>
                    <View style={{flex: 1, zIndex: 2}}>
                    <DismissKeyboard>
                        <View style={[{borderColor: 'red', borderWidth: 0, width: '100%', height: '100%'}]}>
                            <Animated.View style={[{borderWidth: 0, borderColor: 'green'}, animateBGImage]}>
                                <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'space-between', flexDirection: 'row', zIndex: 2}, getWidthnHeight(99, 10)]}>
                                    <TouchableOpacity style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(30, 10)]} onPress={() => {
                                        const {showSlider} = this.state;
                                        if(!showSlider){
                                            this.showSliderFunction();
                                        }
                                    }}>
                                        <View style={{flex: 1, backgroundColor: 'transparent'}}/>
                                    </TouchableOpacity>
                                    <View>
                                        {(showSlider) &&
                                            <View style={[getMarginRight(3), {borderColor: 'red', borderWidth: 0}]}>
                                                <Slider 
                                                    activeColor={'#26DA7B'} 
                                                    //inactiveColor={'red'}
                                                    //buttonColor={'red'}
                                                    // buttonBorderColor={'blue'}
                                                    value={this.state.sliderState}
                                                    onSlide={(sliderState) => this.setState({sliderState}, async() => {
                                                        const {sliderState} = this.state;
                                                        await AsyncStorage.removeItem('onboardingURL');
                                                        console.log("SLIDER STATE: ", sliderState)
                                                        if(sliderState){
                                                            this.setState({serverLink: this.state.liveLink, userPassword: ''}, () => {
                                                                AsyncStorage.setItem("onboardingURL", this.state.onboardingLive);
                                                            })
                                                        }else{
                                                            this.setState({serverLink: this.state.testLink, userPassword: 'xeam@123'}, () => {
                                                                AsyncStorage.setItem("onboardingURL", this.state.onboardingTest);
                                                            })
                                                        }
                                                    })}
                                                    delay={300}
                                                    title={['Test', 'Live']}
                                                />
                                            </View>
                                        }
                                    </View>
                                </View>
                                <Animated.View style={[animateLogo]}>
                                    <Animated.View style={[{borderColor: 'black', borderWidth: 0, justifyContent: 'space-evenly'}, getWidthnHeight(100, 25)]}>
                                        <View style={[{borderColor: 'black', borderWidth: 0}, styles.logoPosition]}>
                                            <Animated.Image 
                                                source={require('./Image/512logo.png')} 
                                                style={[{
                                                    resizeMode: 'contain', width: getWidthnHeight(40).width, 
                                                    height: getWidthnHeight(undefined, 10).height
                                                }]}
                                            />
                                        </View>
                                        <Animated.View style={[{
                                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                                            width: getWidthnHeight(60).width, borderWidth: 0, borderColor: 'red'
                                        }, getMarginLeft(2)]}>
                                            <Text style={[styles.boldFont, {fontWeight: 'bold', color: '#505355'}, fontSizeH2()]}>LOGIN</Text>
                                            <View style={[{backgroundColor: 'grey', height: 1}, getWidthnHeight(30)]}/>
                                        </Animated.View>
                                    </Animated.View>
                                </Animated.View>
                            </Animated.View>
                            <Animated.View style={[{flex: 1}, animateLogo]}>
                                <KeyboardAvoidingView contentContainerStyle={{flex: 1}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === "ios")? 120 : null}> 
                                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                                        <Animated.View style={[{borderColor: 'blue', borderWidth: 0}, getWidthnHeight(100, 65)]}>
                                            <View style={[{marginTop: (getMarginTop(7).marginTop + 3)}, getWidthnHeight(80, 15),  styles.credentialsBox]}>
                                                <View style={{flex: 1}}>
                                                    <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                                                        <View style={[{flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderWidth: 0}, getMarginLeft(5), getWidthnHeight(undefined, 7)]}>
                                                            <UserIcon name="user-circle" color='grey' size={Math.floor(getWidthnHeight(10).width)}/>
                                                            <TextInput
                                                                key='TextInput1'
                                                                style={[{paddingLeft: 10, paddingRight: 10, flex: null, borderColor: '#D3D3D3', borderWidth: 0, borderRadius: 10, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(55, 6)]}
                                                                value={this.state.employee_code}
                                                                onChangeText={(employee_code) => _this.setState({employee_code: employee_code.trim()})}
                                                                placeholder='Employee Code'
                                                                placeholderTextColor={'dimgrey'}
                                                                autoCorrect={false}
                                                                autoCapitalize={'none'}
                                                            />
                                                        </View>
                                                        <View style={[{height: 1, backgroundColor: 'lightgrey'}, getWidthnHeight(80)]}/>
                                                        <View style={[{flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderColor: 'black'}, getMarginLeft(5), getWidthnHeight(undefined, 7)]}>
                                                            <View style={{
                                                                backgroundColor: 'grey', borderRadius: 40, alignItems: 'center', 
                                                                justifyContent: 'center', width: Math.floor(getWidthnHeight(10).width),
                                                                height: Math.floor(getWidthnHeight(10).width)
                                                            }}>
                                                                <PasswordKey name="key" color='white' size={Math.floor(getWidthnHeight(6).width)}/>
                                                            </View>
                                                            <View style={{borderWidth: 0, borderColor: 'black'}}>
                                                                <TextInput
                                                                    style={[{paddingLeft: 13, paddingRight: 10, flex: null, borderColor: '#D3D3D3', borderWidth: 0, borderRadius: 10, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(55, 6)]}
                                                                    value={this.state.userPassword}
                                                                    onChangeText={(userPassword) => _this.setState({userPassword: userPassword.trim()})}
                                                                    placeholder='Password'
                                                                    placeholderTextColor={'dimgrey'}
                                                                    autoCorrect={false}
                                                                    autoCapitalize={'none'}
                                                                    secureTextEntry={(!this.state.showPassword)? true : false}
                                                                />
                                                                <View style={[{position: 'absolute', alignSelf: 'flex-end', borderColor: 'black', borderWidth: 0}, getWidthnHeight(undefined, 7)]}>
                                                                {(!this.state.showPassword) ?
                                                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(undefined, 7)]}>
                                                                        <TouchableOpacity onPress={() => this.setState({showPassword: true})}>
                                                                            <Image source={require('./Image/visibilityOff.png')} style={{marginRight: 10, width: 20, height: 20}}/>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                :
                                                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getWidthnHeight(undefined, 7)]}>
                                                                        <TouchableOpacity onPress={() => this.setState({showPassword: false})}>
                                                                            <Image source={require('./Image/visibility.png')} style={{marginRight: 10, width: 20, height: 20}}/>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    {(!device_id) &&
                                                        <View style={[{
                                                            backgroundColor: 'rgba(0,0,0,0.50)', alignItems: 'center', justifyContent: 'center',
                                                            borderTopEndRadius: getWidthnHeight(undefined, 100).height,
                                                            borderBottomEndRadius: getWidthnHeight(undefined, 100).height,}, StyleSheet.absoluteFill
                                                        ]}>
                                                            <ActivityIndicator size="large" color={'#FFFFFF'} style={{transform: [{scale: 1.5}]}}/>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                            <View style={[{justifyContent: 'center', alignItems: 'flex-start', borderColor: 'black', borderWidth: 0}, getMarginLeft(5), getWidthnHeight(50), getMarginTop(5)]}>
                                                <LoginButton 
                                                    title="LOGIN"
                                                    disable={(device_id)? false : true}
                                                    gradient={gradient}
                                                    onPress={() =>{
                                                        const {device_id} = this.state;
                                                        Keyboard.dismiss();
                                                        if(device_id){
                                                            this.functionCombined();
                                                        }else{
                                                            //alert('If its taking too long. Close the app and try again.')
                                                        }
                                                    }}
                                                    style={[{borderRadius: 10},getWidthnHeight(45, 7)]}
                                                    textBoxStyle={[getWidthnHeight(35, 7)]}
                                                />
                                            </View>
                                            <Animated.View style={[getMarginTop(5), getMarginLeft(5), animateOpacity]}>
                                                <TouchableOpacity 
                                                    activeOpacity={0.5}
                                                    onPress={() => {
                                                        if(playStoreAppVersion > currentVersion){
                                                            Alert.alert('Alert!', `Update Xenia (${playStoreAppVersion}) now to continue using "User E-Onboarding"`, [
                                                                {
                                                                    text: 'Update Now',
                                                                    onPress: () => {
                                                                        if(Platform.OS === 'android'){
                                                                            this.openGooglePlayStore();
                                                                        }else if(Platform.OS === 'ios'){
                                                                            this.openAppHostIOS();
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    text: 'Cancel'
                                                                }
                                                            ]);
                                                        }else{
                                                            Actions.Onboarding();
                                                        }
                                                        //console.log("ONBOARDING PORTAL")
                                                    }}
                                                    style={[{flexDirection: 'row', alignItems: 'center'}]}
                                                >
                                                    <GradientIcon
                                                        start={{x: 0, y: 0}}
                                                        end={{x: 0.7, y: 0}}
                                                        containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(10)]}
                                                        icon={newIcon}
                                                        hiddenIcon={newIconOpacity}
                                                        colors={["#CF0000", "#FF2442"]}
                                                    />
                                                    <Text style={[{fontStyle: 'italic', color: '#0074E4', fontSize: (fontSizeH4().fontSize + 3)}]}>USER E-ONBOARDING</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                            {/* {<AnimateTouch
                                                activeOpacity={0.5}
                                                style={[animateOpacity]}
                                                onPress={() => {
                                                    this.setState({showChangePassModal: true})
                                                }}
                                            >
                                                <Text 
                                                    style={[{
                                                        fontStyle: 'italic', textDecorationLine: 'underline', 
                                                        color: '#0074E4', fontSize: (fontSizeH4().fontSize + 3)
                                                    }, getMarginTop(1), getMarginLeft(5)
                                                ]}>
                                                    Forgot Password ?
                                                </Text>
                                            </AnimateTouch>} */}
                                            <Animated.Text style={[{fontStyle: 'italic'}, getMarginTop(5), getMarginLeft(5), animateOpacity]}>Version: {DeviceInfo.getVersion()}</Animated.Text>
                                        </Animated.View>
                                        {(showChangePassModal) && (
                                            <ChangePassword 
                                                title={'FORGOT PASSWORD'}
                                                isvisible={showChangePassModal}
                                                toggle={() => this.setState({showChangePassModal: false})}
                                                colorTheme={'#0B8EE8'}
                                                passStep={changePassStep}
                                                updatePassStep={(step) => this.setState({changePassStep: step})}
                                                startCount={() => this.startCount()}
                                                clearCount={() => {
                                                    this.setState({resetTimer: true, minuteHand: 1, secondHand: 59}, () => clearInterval(beginCount));
                                                }}
                                                minuteHand={this.state.minuteHand}
                                                secondHand={this.state.secondHand}
                                                reset={resetTimer}
                                            />
                                        )}
                                    </ScrollView>
                                </KeyboardAvoidingView>
                            </Animated.View>
                        </View>
                    </DismissKeyboard>
                    </View>
                    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                        <Animated.Image 
                            source={require('./Image/LoginPage.png')}
                            style={[{zIndex: 1}, getWidthnHeight(100, 100), animateBGImage]}
                        />
                    </View>
                </View>
            }
            {(loading) && (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <DesktopLoader 
                        scale={0.7}
                        screenStyle={[getWidthnHeight(30, 10)]}
                        baseStyle={[getWidthnHeight(43, 0.5)]}
                        // outlineColor = "red"
                        // loaderColor = "cyan"
                        size = "large"
                        loaderScale = {1.4}
                    />
                    {/* <ReactLoader /> */}
                </View>
            )}
            </View>
          );
      }
}


    const styles = StyleSheet.create({
        logintext: {
            alignItems:'center',
            marginBottom:0,
            marginTop: -10
        },
        logoPosition: {
            ...Platform.select({
                ios: {
                    marginLeft: getMarginLeft(2).marginLeft
                },
                android: {
                    marginLeft: getMarginLeft(5).marginLeft
                }
            })
        },
        credentialsBox: {
            shadowColor: '#000000',
            shadowOpacity: 0.5,
            elevation: 8,
            borderTopEndRadius: getWidthnHeight(undefined, 100).height,
            borderBottomEndRadius: getWidthnHeight(undefined, 100).height,
            shadowRadius: 5,
            backgroundColor: '#FFFFFF',
            alignItems: 'flex-start',
            justifyContent: 'space-evenly',
            shadowOffset: {width: 0, height: 0}
        },
        title: {
            textAlign:'center',
            color: 'rgb(19,111,232)',
            fontSize: 38,
            marginBottom: 20
            // fontWeight: 'bold',
        },
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            shadowColor: '#000000',
            elevation: 7
        },
        buttonShadow: {
            marginTop: 10,
            marginLeft: 0,
            borderTopLeftRadius: 50,
            borderBottomRightRadius: 50
        },
        pagecomponent: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#ffffff',
            borderRadius: 10,
            borderTopWidth: 1.5,
            borderBottomWidth:1.5,
            borderRightWidth:1.5,
            borderLeftWidth:1.5,
            borderColor: '#ffffff',
            width:viewportWidth/1.2,
            height: '60%',
            // shadowOffset:{  width: 100,  height: 100,  },
            shadowColor: '#330000',
            shadowOpacity: 0,
            // shadowRadius: 0,
            elevation: 3,
        },
        separator: {
            marginVertical: 8,
            borderBottomColor: '#2B2929',
            borderBottomWidth: StyleSheet.hairlineWidth,
        },
        container: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#edeceb'
        },
        btnEye: {
            position: 'absolute',
            top: 20,
            right: 28,
        },
        iconEye: {
            width: 50,
            height: 50,
            tintColor: "black",
        },
        loginCard: {
            backgroundColor: 'white', 
            borderRadius: 10, 
            alignItems: 'center', 
            borderColor: 'black', 
            borderWidth: 0, 
            shadowColor: '#000000',
            elevation: 10,
            justifyContent: 'space-evenly'
        },
        loadingStyle: {
            shadowOffset: null, 
            shadowColor: 'black', 
            shadowOpacity: null, 
            shadowRadius: 10, 
            elevation: 5,
            backgroundColor: 'white',
            height: 60,
            borderRadius:5,
        },
        boldFont: {
            ...Platform.select({
                android: {
                    fontFamily: ''
                }
            })
        }
    });

// export default LoginPage;
const LoginPageComponent = connect(null, {sendProps})(LoginPage);
export default LoginPageComponent;