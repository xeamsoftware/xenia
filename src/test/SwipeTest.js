import React from 'react';
import {
    AsyncStorage, Alert, PermissionsAndroid, Image, PixelRatio, StyleSheet,
    Text, TouchableOpacity, View, KeyboardAvoidingView, Keyboard, Dimensions,
    TextInput, BackHandler
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import { withNavigation } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Utils from '../Utils';
import {extractBaseURL} from '../api/BaseURL';
import {getWidthnHeight, CommonModal, IOS_StatusBar, WaveHeader, getMarginTop, Spinner, getMarginLeft} from '../KulbirComponents/common/';
import {cameraFile} from '../actions';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const RANGE = 500;

    export async function request_camera_runtime_permission() {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    'title': 'XENIA Camera Permission',
                    'message': 'XENIA App needs access to your Camera '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            }else {
                Alert.alert("Camera Permission Not Granted");
            }
        }catch (err) {
          console.warn(err)
        }
    }


    class App extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                file:'',
                file_sec:'',
                comment:'Check-In',
                type:'Check-In',
                isMapReady:false,
                latitude: null,
                longitude: null,
                latitudeDelta: '',
                longitudeDelta: '',
                receivedCurrentLocation:true,
                loading: false,
                animating: true,
                location: null,
                comment_error:'',
                baseURL: null,
                errorCode: null,
                apiCode: null,
                commonModal: false,
                image: false,
                data: null,
                fileError: true,
                Lat_LongError: true,
                commentError: false,
                buttonPressed: false,
                anyError: function(){
                  return (this.fileError === true || this.Lat_LongError === true || this.commentError === true)
                },
                allError: function(){
                  return (this.fileError === false && this.Lat_LongError === false && this.commentError === false)
                }
            };
            this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
        }

    selectPhotoTapped() {
        const options = {
            quality: 0.5,
            maxWidth: 400,
            maxHeight: 400,
            cameraType:'front',
            storageOptions: {
                waitUntilSaved: true,
                cameraRoll: true,
                skipBackup : true,
            },
        };
        ImagePicker.launchCamera(options, (response)  => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }else {
                let source = {uri:response.uri,type:response.type,name:response.fileName};
                console.log(source)
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    file: source,
                    file_sec: response.data
                }, () => console.log("IMAGE FILE: ", this.state.file));
            }
        });
    }

    componentDidMount() {
        const {addListener} = this.props.navigation;
        //console.log("CAMERA: ", this.props.navigation.actions, "\n", "NAVIGATION: ", this.props.navigation, "\n")
        this._unsubscribe = addListener('didFocus', async() => {
            await this.extractLink();
            this.findCoordinates();
            if(this.props.file.file){
                const filePath = this.props.file.file.uri
                const splitArray = filePath.split('Camera/')
                const fileData = {type: 'image/jpeg', name: splitArray[1], uri: filePath}
                console.log("OBJECT ASSIGN: ", Object.assign({}, fileData))
                this.setState({data: filePath}, () => {
                    if(this.state.data){
                        this.props.cameraFile(null)
                    }
                    console.log("FILE: ", this.state.data)
                })
                this.setState({image: true})
                this.setState({fileError: false})
                this.setState({file: fileData}, () => console.log("FILE DATA: ", this.state.file))
            }
            console.log("FILE: ", this.state.data)
            console.log('********ComponentDidMount*********');
            this._isMounted = true;
            const context = this;
            context.askPermissions(context);
        })
    }

    UNSAFE_componentWillUnmount(){
        this._unsubscribe().remove();
    }

    async calculateDistance(){
        const { latitude, longitude, buttonPressed } = this.state;
        this.setState({buttonPressed: true})
        console.log("@@@ BEFORE: ", latitude, longitude)
        await this.functionCombined();
        console.log("### AFTER: ", latitude, longitude)
        const R = 6371;
        const xeniaLatitude = "26.743548960185258";
        const xeniaLongitude = "80.94520378795231";
        //const xeniaLatitude = "30.709934";
        //const xeniaLongitude = "76.714763";
        let dLat = this.deg2rad(latitude - xeniaLatitude);
        let dLng = this.deg2rad(longitude - xeniaLongitude);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +  
                Math.cos(this.deg2rad(xeniaLatitude)) * Math.cos(this.deg2rad(latitude)) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c * 1000;
        //console.log("@@@ DISTANCE: ", distance)
        if(distance <= RANGE){
            this.checkBlank();
        }else{
            Alert.alert("Location Too Far!!!", `Please ensure to remain within ${RANGE} meters of range from the office.`);
            return;
        }
    }

    deg2rad(deg){
        return deg * (Math.PI/180)
    }

    async extractLink(){
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
        })
    }  

    askPermissions(context) {
        //Checking for the permission just after component loaded
        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION  
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('granted');
                    console.log('show location dialog if gps is off');
                    //To Check, If Permission is granted
                    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                        .then(data => {
                            console.log('enabled or already enabled gps');
                            // The user has accepted to enable the location services
                            // data can be :
                            //  - "already-enabled" if the location services has been already enabled
                            //  - "enabled" if user has clicked on OK button in the popup
                            Geolocation.getCurrentPosition(
                                (position) => {
                                    console.log("current position");
                                    console.log(position);
                                    if (context._isMounted) {
                                        context.setState({
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                            Lat_LongError: false
                                        })
                                    }
                                },
                                (error) => console.log(error.message),
                                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                            );
                        }).catch(err => {
                            // The user has not accepted to enable the location services or something went wrong during the process
                            // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                            // codes :
                            //  - ERR00 : The user has clicked on Cancel button in the popup
                            //  - ERR01 : If the Settings change are unavailable
                            //  - ERR02 : If the popup has failed to open
                            console.log(err)
                            if (err && err.code === 'ERR00') {
                                BackHandler.exitApp()
                            }
                        });
                }else{
                    console.log('permission denied');
                    BackHandler.exitApp()
                }
            }catch (err){
                console.log('error in runtime permission block');
                console.warn(err)
            }
        }
        if (Utils.isAndroid()) {
            //Calling the permission function
            requestLocationPermission();
        }
    }

    hideLoader = () => {
        this.setState({ loading: false });
    }

    showLoader = () => {
        this.setState({ loading: true });
    }

    submit = async (latitude, longitude) => {
        const {comment,baseURL} = this.state;
        const _this = this;
        this.showLoader();
        const context=this;
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        //var successToken = (this.props.successToken.token);
        var userName = "Kulbir Singh";
        var user_id = 175;
        var xyz = "Check-In";
        console.log("chIn",permissions_four);
        console.log(comment);
        console.log(user_id)
        // context.props.navigation.navigate("monthlyreport",{successToken:successToken});
        // context.props.navigation.navigate("monthlyreport",{user_id:user_id});
        var data = new FormData();
        data.append("latitude", latitude);
        data.append("longitude", longitude);
        data.append("comment", this.state.comment);
        data.append("file", this.state.file);
        data.append("type", xyz);
        data.append("ver", "2.4.8");
        data.append("auth", permissions_four);
        data.append("user_id", user_id);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function () {
            console.log(xhr.status)
            console.log(xhr.readyState)
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status === 200) {
                _this.hideLoader();
                console.log("Successfully200")
                context.setState({file: undefined})
                context.setState({comment: 'Check-In'})
                //context.textComment.clear();
                _this.setState({fileError: true})
                _this.setState({Lat_LongError: true})
                _this.setState({commentError: false})
                _this.setState({buttonPressed: false})
                Alert.alert(
                    userName.toUpperCase(), 
                    "YOUR ATTENDANCE HAS BEEN SUCCESSFULLY SAVED", 
                    [{
                        text: 'OK', 
                        //onPress: () => _this.props.callFunction()
                    }]
                );   
                //context.props.navigation.navigate("First");
                Actions.First();
            }else{
                _this.hideLoader();
                _this.findCoordinates();
                var error = xhr.responseText;
                console.log("error",error)
                _this.setState({errorCode: xhr.status})
                _this.setState({apiCode: "004"})
                _this.setState({commonModal: true})
                //_this.setState({file: undefined})
                //_this.setState({comment: 'In'})
                //_this.textComment.clear();
                //_this.setState({fileError: true})
                //_this.setState({Lat_LongError: true})
                //_this.setState({commentError: false})
                _this.setState({buttonPressed: false})
                if(error=='{"validation_error":{"comment":["The comment field is required."],"file":["The file field is required."]}}'){
                  Alert.alert("PLEASE FILL ALL COMPONENTS","1) TAKE PICTURE\n2) WRITE COMMENT\n3)WAIT FOR LOADING MAP",[{text:'OK'}]);
                }if(error == '{"message":"Unauthenticated."}'){
                  Alert.alert("Session Expired\n" , "Please log in again");
                } 
                if(error == '{"validation_error":{"comment":["The comment field is required."]}}'){
                  Alert.alert('The comment field is required.')
                }
                if(error == '{"validation_error":{"file":["The file field is required."]}}'){
                  Alert.alert('The file field is required.')
                }
                if(error == '{"validation_error":{"type":["The type field is required."]}}'){
                  Alert.alert('The type field is required.')
                }
                if(error == '{"validation_error":{"longitude":["The longitude field is required."]}}'){
                  Alert.alert('The longitude field is required.')
                }
                if(error == 'The Internet connection appears to be offline.'){
                  Alert.alert('The Internet connection appears to be offline.')
                }
            }
            console.log("abc",this.responseText);
        });
        xhr.open("POST", `${baseURL}/attendance-location`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.setRequestHeader("Authorization", "Bearer " + permissions_four);
        xhr.send(data);
    }

    hide = () => {
        const a= Keyboard.dismiss();
    }

    functionCombined() {
        const anyError = this.state.anyError();
        const allError = this.state.allError();
        if(anyError){
            Alert.alert("Please fill the fields highlighted in RED")
        }
        if(allError){
            Keyboard.dismiss();
            this.findCoordinates(true);
        }
    }

    error(){
        if(this.state.file == null){
            Alert.alert('The file field is required.')
        }
    }

    findCoordinates = (call = false) => {
        Geolocation.getCurrentPosition(
            (position) => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longitude = JSON.stringify(position.coords.longitude);
                // console.log(latitude);
                // console.log(longitude);
                if(call === true){
                    this.setState({latitude: null, longitude: null, Lat_LongError: true}, () => {
                        if(!this.state.latitude && !this.state.longitude){
                            this.submit(latitude, longitude);
                        }
                    });
                }else{
                    this.setState({
                        latitude: latitude, longitude: longitude, Lat_LongError: false
                    });
                }
                // this.setState({ location });
            },
            error => Alert.alert("Error !", error.message, [{
                text: 'Go Back',
                onPress: () => Actions.pop()
            }]),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    renderHeader(){
        return (
            <WaveHeader
                wave={Platform.OS ==="ios" ? false : false} 
                //logo={require('../Image/Logo-164.png')}
                menu='white'
                menuState={false}
                title='Check In'
            />
        );
    }

    onDecline(){
        this.setState({commonModal: false})
    }

    checkBlank(){
        const {comment, loading} = this.state;
        if(loading){
            return;
        }
        this.setState({buttonPressed: true})
        const check = comment.trim();
        if(check){
            this.functionCombined();
        }else{
            this.setState({commentError: true, comment: ''})
            Alert.alert("Please fill the fields highlighted in RED")
        }
    }

    render() {
        //console.log("THIS<PROPS: ", this.props)
        const {errorCode, apiCode, buttonPressed, fileError, Lat_LongError, commentError, loading} = this.state;
        const animating = this.state.animating;
        const context=this;
        const card = {card: {width: viewportWidth, height: viewportHeight}};
        var userName = "Kulbir Singh";
        //console.log("THIS PROPS: ", this.props);
        // var  coordinate=;
        const latitude=this.state.latitude;
        const longitude = this.state.longitude;
        var office = {
            latitude: Number("26.743548960185258"),
            longitude: Number("80.94520378795231"),
            latitudeDelta:.1,
            longitudeDelta: .1,
        }
        var region = {
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta:.1,
            longitudeDelta: .1,
        }
        // const kayboard=this.state.KeyboardAvoidingView
        let gradient = ['#039FFD', '#EA304F'];
        const circleWidth = getWidthnHeight(50)
        const circleHeight = {height: circleWidth.width}
        return (
            <View>
                <KeyboardAvoidingView behavior="position" style={styles.container}>
                    <IOS_StatusBar color={gradient} barStyle="light-content"/>
                    <View style={{alignItems: 'center'}}>
                        {this.renderHeader()}
                    </View>
                    <View>
                        <View style={{flex: 1, alignItems: 'center', borderColor: 'red', borderWidth: 0}}>
                            <View style={{alignItems: 'center', marginVertical: 20}}>
                                {(!this.state.image)?
                                    <View style={[{
                                        borderRadius: 200, backgroundColor: '#69726F', alignItems: 'center', 
                                        justifyContent: 'center', shadowColor: '#000000', elevation: 7, 
                                        shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5},
                                        borderWidth: (buttonPressed && fileError)? 3 : 1, 
                                        borderColor: (buttonPressed && fileError)? 'red' : 'transparent',
                                        borderStyle: (buttonPressed && fileError)? 'dotted' : 'solid'
                                        }, circleWidth, circleHeight]}
                                    >
                                        <TouchableOpacity onPress={() => (loading)? null : Actions.camera()}>
                                            <Image source={require('../Image/white-camera.png')} style={{width: 45, height: 45}}/>
                                        </TouchableOpacity>
                                    </View>
                                : 
                                    <View style={[{
                                        borderRadius: circleWidth.width, backgroundColor: '#69726F', alignItems: 'center', 
                                        justifyContent: 'center', shadowColor: '#000000', elevation: 7,
                                        shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5}
                                        }, circleWidth, circleHeight]}
                                    >
                                      <TouchableOpacity onPress={() => (loading)? null : Actions.camera()}>
                                          <Image source={{uri: `${this.state.data}`}} style={[{borderRadius: circleWidth.width}, circleWidth, circleHeight]}/>
                                      </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            <View style={{alignItems: 'center'}}>
                                <View style={[styles.MainContainer, {
                                    borderWidth: (buttonPressed && Lat_LongError)? 2 : 1, 
                                    borderColor: (buttonPressed && Lat_LongError)? 'red' : 'transparent',
                                    borderStyle: (buttonPressed && Lat_LongError)? 'dotted' : 'solid'
                                }]}>
                                    <MapView
                                        style={[styles.mapStyle, getWidthnHeight(90, 20)]}
                                        region={region}
                                        mapType={"standard"}
                                        provider={PROVIDER_GOOGLE}
                                        showsUserLocation={true}
                                        zoomUserLocation={true}
                                        zoomEnabled={true}
                                        zoomControlEnabled={true}
                                        showsMyLocationButton={true}
                                        followsUserLocation={true}
                                        showsCompass={true}
                                        toolbarEnabled={true}
                                    >
                                        <MapView.Marker
                                            coordinate={office}
                                            title={"Office"}
                                            description={"OFFICE LOCATION"}
                                        />
                                        <MapView.Marker
                                            coordinate={region}
                                            title={userName}
                                            pinColor={"#21BF73"}
                                            description={"YOUR LOCATION FOR ATTENDANCE"}
                                        />
                                    </MapView>
                                </View>
                                {Boolean(this.state.latitude && this.state.longitude) &&
                                    <View style={[{flexDirection: 'row', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                                        <Text style={{fontSize: 10}}>{`LATTITUDE: ${parseFloat(this.state.latitude).toFixed(3)}`}</Text>
                                        <Text style={{fontSize: 10}}>{`LONGITUDE: ${parseFloat(this.state.longitude).toFixed(3)}`}</Text>
                                    </View>
                                }
                            </View>
                            <View style={[styles.commentbox, getWidthnHeight(90)]}>
                                <TextInput
                                    style={[styles.input, {
                                      borderWidth: (buttonPressed && commentError)? 2 : 1, 
                                      borderColor: (buttonPressed && commentError)? 'red' : 'transparent',
                                      borderStyle: (buttonPressed && commentError)? 'dotted' : 'solid'
                                    }]}
                                    placeholder="COMMENT BOX"
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    onChangeText={comment => {
                                      this.setState({ comment })
                                      this.setState({commentError: false})
                                      if(comment === ''){
                                        this.setState({commentError: true})
                                      }
                                    }}
                                    editable={(loading)? false : true}
                                    value={this.state.comment}
                                    autoCorrect={false}
                                    placeholderTextColor="black"
                                />
                            </View>
                            <View style={{alignItems:'center'}}>
                                <TouchableOpacity onPress={() => this.calculateDistance()}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <LinearGradient 
                                            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                            colors={gradient}
                                            style={[styles.button, getWidthnHeight(40, 8)]}
                                        >
                                            <Text style={{ color:'white',fontSize: 14, textAlign: 'center'}}>SUBMIT</Text>
                                        </LinearGradient>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <CommonModal 
                                title="Something went wrong"
                                subtitle= {`Error Code: ${errorCode}${apiCode}`}
                                visible={this.state.commonModal}
                                onDecline={this.onDecline.bind(this)}
                                buttonColor={['#0E57CF', '#25A2F9']}
                            />
                        </View>
                        <View 
                            style={[{
                              backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', alignItems: 'center', justifyContent: 'center'
                            }, StyleSheet.absoluteFill]} 
                            pointerEvents={(loading)? 'auto' : 'none'}
                        >
                            {(loading) &&
                                <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10), getMarginTop(-5), getMarginLeft(3)]} color='rgb(19,111,232)'/>
                            }
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>   
        )}
    }

    const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            shadowColor: '#000000',
            marginTop: 10,
            elevation: 7
        },
        buttonShadow: {
            marginTop: 10,
            marginLeft: 0,
            borderTopLeftRadius: 50,
            borderBottomRightRadius: 50
        },
        container: {
            height:viewportHeight,
            flex: 0,
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop:0,
            marginBottom:0
        },
        avatarContainer: {
            borderColor: 'transparent',
            borderWidth: 5 / PixelRatio.get(),
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 7,
        },
        avatar: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderTopWidth: 1,
            borderBottomWidth:1,
            borderRightWidth:1,
            borderLeftWidth:1,
            width:viewportWidth,
            height: viewportHeight / 3,
        },
        MainContainer: {
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            margin:5,
            borderRadius: 8,
            shadowOffset:{  width: 0,  height: 5,  },
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 7,
            zIndex: 1
        },
        commentbox: {
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            shadowOffset:{  width: 0,  height: 5,  },
            shadowColor: '#000000',
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 10,
            marginTop: 20,
            zIndex: 1
        },
        mapStyle: {
            flex:0,
            flexDirection:'row',
            alignItems:'center',
            margin:5,
            borderRadius: 8,
            borderTopWidth: 1,
            borderBottomWidth:1,
            borderRightWidth:1,
            borderLeftWidth:1,
            shadowOffset:{  width: 100,  height: 100,  },
            shadowColor: '#000000',
            shadowOpacity: 0,
            shadowRadius: 10,
            elevation: 7,
        },
        input: {
            width:'100%',
            borderRadius: 10,
            backgroundColor: '#F0F8FF',
            paddingLeft:20,
            paddingRight:0,
            paddingTop:20,
            paddingBottom:20,
            fontSize:15,
            borderStyle:'dashed',
            elevation: 5,
        },
        loader: {
            ...Platform.select({
                ios: {
                    zIndex: 1,
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
        },
    });

    const mapStateToProps = (state) => {
        //console.log("***Welcome***MAP STATE TO PROPS: ", state.cameraFile)
        return {
            file: state.cameraFile
        }
    }

    const appComponent = withNavigation(App);
export default connect(mapStateToProps, {cameraFile})(appComponent);