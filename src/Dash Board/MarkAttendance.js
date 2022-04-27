import React, { Component } from "react";
import {View, Text, TouchableOpacity, Animated, Platform, Image, Alert, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import moment from "moment";
import MapView, {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import {WaveHeader, getWidthnHeight, IOS_StatusBar, statusBarGradient, getMarginVertical, BasicCamera} from '../KulbirComponents/common';

class MarkAttendance extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: '',
            buttonPressed: false, 
            imageError: true,
            loading: false,
            openCamera: false,
            LatLongError: true,
            latitude: null,
            longitude: null,
            comment:this.props.title,
            commentError: false,
            type:this.props.title,
        }
    }

    componentDidMount(){
        //this.findCoordinates();
    }

    findCoordinates = (call = false) => {
        Geolocation.getCurrentPosition(
            (position) => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longitude = JSON.stringify(position.coords.longitude);
                // console.log(latitude);
                // console.log(longitude);
                if(call === true){
                    this.setState({latitude: null, longitude: null, LatLongError: true}, () => {
                        if(!this.state.latitude && !this.state.longitude){
                            this.submit(latitude, longitude);
                        }
                    });
                }else{
                    this.setState({
                        latitude: latitude, longitude: longitude, LatLongError: false
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

    render(){
        const {buttonPressed, imageError, image, openCamera, LatLongError} = this.state;
        const {title = 'Check-In'} = this.props;
        const circleWidth = getWidthnHeight(48);
        const circleHeight = {height: circleWidth.width};
        var region = {
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta:.1,
            longitudeDelta: .1,
        }
        return (
            <View style={{flex: 1}}>
                <View>
                    <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                    <WaveHeader
                        wave={false} 
                        menu='white'
                        menuState={false}
                        title={title}
                    />
                </View>
                <View style={{flex: 1, borderColor: 'red', borderWidth: 0}}>
                    <View style={[{alignItems: 'center'}, getMarginVertical(2)]}>
                        {(!image)?
                            <View style={[{
                                borderRadius: 200, backgroundColor: '#69726F', alignItems: 'center', 
                                justifyContent: 'center', shadowColor: '#000000', elevation: 7, 
                                shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5},
                                borderWidth: (buttonPressed && imageError)? 3 : 1, 
                                borderColor: (buttonPressed && imageError)? 'red' : 'transparent',
                                borderStyle: (buttonPressed && imageError)? 'dotted' : 'solid'
                                }, circleWidth, circleHeight]}
                            >
                                <TouchableOpacity onPress={() => this.setState({openCamera: true})}>
                                    <Image resizeMode="contain" source={require('../Image/white-camera.png')} style={{transform: [{scale: 0.7}]}}/>
                                </TouchableOpacity>
                            </View>
                        : 
                            <View style={[{
                                borderRadius: circleWidth.width, backgroundColor: '#69726F', alignItems: 'center', 
                                justifyContent: 'center', shadowColor: '#000000', elevation: 7,
                                shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: {width: 0, height: 5}
                                }, circleWidth, circleHeight]}
                            >
                                <TouchableOpacity onPress={() => this.setState({openCamera: true})}>
                                    <Image source={{uri: `${this.state.image['uri']}`}} style={[{borderRadius: circleWidth.width}, circleWidth, circleHeight]}/>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <View style={[{
                            borderWidth: (buttonPressed && LatLongError)? 2 : 1, 
                            borderColor: (buttonPressed && LatLongError)? 'red' : 'transparent',
                            borderStyle: (buttonPressed && LatLongError)? 'dotted' : 'solid',
                            overflow: 'hidden', borderRadius: getWidthnHeight(6).width
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
                                    coordinate={region}
                                    title={'Test'}
                                    description={"YOUR LOCATION FOR ATTENDANCE"}
                                />
                            </MapView>
                        </View>
                    </View>
                </View>
                {(openCamera) &&
                    <BasicCamera 
                        isVisible={openCamera}
                        closeCamera={() => this.setState({openCamera: false})}
                        rearCamera={false} 
                        imageQuality={0.25} 
                        width={getWidthnHeight(100).width} 
                        height={500} 
                        style={[getWidthnHeight(100, 95)]}
                        captureImage={(userImage) => this.setState({image: userImage, imageError: false}, () => console.log("$$$ IMAGE: ", this.state.image))}
                    />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
})

export default MarkAttendance;