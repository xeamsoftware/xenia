import React, {Component} from 'react';
import {
    AsyncStorage, StyleSheet,
    Text, TouchableOpacity,
    View, Alert, BackHandler
} from 'react-native';
import {connect} from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {extractBaseURL} from './api/BaseURL';
import { showGame } from './actions';
import {CommonModal, getWidthnHeight, fontSizeH4, Spinner} from './KulbirComponents/common';

class Header extends Component {
    constructor(props){
    super(props)
        this.state={
            loading: false,
            token:'',
            final_data:'',
            final_data_sec:'',
            language:'',
            language_sec:'',
            tvf:[],
            tvl:[],
            data:[],
            from:'',
            to:'',
            counter_data:'',
            pic_name_data:'',
            emp_code:'',
            unsavedTracks: false,
            commonModal: false,
            uploadDate: null,
            totalDistance: null,
            errorCode: null,
            apiCode: null,
            syncModal: false,
            baseURL: null
        }
    }
hideLoader = () => {
    this.setState({ loading: false });
}

showLoader = () => {
    this.setState({ loading: true });
}

componentDidMount(){
    const {navigation} = this.props;
    BackHandler.addEventListener('hardwareBackPress', () => {
        (Actions.currentScene === "LogOutPage") ? Actions.popTo('First') : null;
    })
    this._unsubscribe = navigation.addListener("didFocus", async() => {
        console.log("WORKING")
        await this.extractLink();
        this.unsavedTracks();
    })
  // this.logOut().done();
  // this.logoutWithoutApi()
}

UNSAFE_componentWillUnmount(){
    this._unsubscribe().remove();
    BackHandler.removeEventListener('hardwareBackPress', () => {
        (Actions.currentScene === "LogOutPage") ? Actions.popTo('First') : null;
    })
}

async extractLink(){
    await extractBaseURL().then((baseURL) => {
        this.setState({baseURL}, () => console.log("EXTRACT LINK: ", this.state.baseURL))
    })
}

async unsavedTracks(){
    const asyncData = await AsyncStorage.getItem('UnsavedLocations')
    //AsyncStorage.setItem('SpareData', asyncData)
    if(asyncData){
       this.setState({unsavedTracks: true})
    }else {
        this.setState({unsavedTracks: false})
    }
}

calculateDistance(){
    let totalDistance = 0;
    let totalTime = [];
    this.state.data.forEach((individual) => {
        totalDistance += individual.distance;
    })
    totalDistance = Number(totalDistance.toFixed(3))
    this.setState({totalDistance}, () => console.log("DISTANCE SUM: ", Number(this.state.totalDistance.toFixed(3))))
}

//==========Upload Data==========\\
uploadEmpData = async () => {
    const {baseURL} = this.state;
    console.log("URL: ", `${baseURL}/save-cordinates`)
    const user_token = await AsyncStorage.getItem('user_token');
    const asyncData = await AsyncStorage.getItem('UnsavedLocations');
    const asyncParsedData = JSON.parse(asyncData);
    const asyncDataEmpID = asyncParsedData[0]['empCode'];
    let uploadDate = asyncParsedData[0]['date'];
    const permissions_fir = JSON.parse(user_token);
    const employeeID = permissions_fir.success.user.id
    const extracted_token = permissions_fir.success.secret_token;
    //this.setState({employeeID})
    console.log("EMPLOYEE ID: ", asyncDataEmpID, asyncData, uploadDate)
    const _this = this;
    this.showLoader(); 
    var data = new FormData();
    data.append("user_id", asyncDataEmpID);
    data.append("coordinates", asyncData);
    data.append("log_dates", uploadDate);
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", async() => {
        if(xhr.readyState !== 4) {
            return;
        }if(xhr.status === 201){
            _this.hideLoader();
            await AsyncStorage.removeItem('UnsavedLocations')
            await _this.unsavedTracks();
            _this.setState({syncModal: false})
            _this.logoutWithoutApi();
        } else {
            _this.hideLoader();
            _this.enableModal(xhr.status, "108");
        }
    });
    xhr.open("POST", `${baseURL}/save-cordinates`);
    xhr.send(data);
}

enableModal(status, apiCode){
    this.setState({errorCode: status})
    this.setState({apiCode})
    this.setState({commonModal: true})
}

logOut=async()=>{
    const context=this;
    // var userObj = JSON.parse(context.props.navigation.state.params.userObj);
    // var successToken={token:userObj.success.secret_token};
    // console.log("logout" ,successToken)
    const _this = this;
    this.showLoader();
    var user_token= await AsyncStorage.getItem('user_token');
    var permissions_fir= JSON.parse(user_token);
    var permissions_four=permissions_fir.success.secret_token;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
    if (xhr.readyState !== 4) {
        return;
    }
    if(xhr.status===200){
        _this.hideLoader();
        console.log(xhr.responseText)
        AsyncStorage.clear();
        context.props.navigation.navigate("login");
        var json_obj = JSON.parse(xhr.responseText);
        var success = json_obj.success;
        Alert.alert(success);
    }  else{
        _this.hideLoader();
        return;
        console.log("inside error")
    }
});
    xhr.open("GET", `${baseURL}/logout`);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${permissions_four}`);
    xhr.send();
}

logoutWithoutApi = async() =>{
    const context=this;
    this.props.showGame(false);
    Actions.auth();
    await AsyncStorage.clear();
    Alert.alert("Successfully logged out");
}

showModal(){
    this.setState({commonModal: true})
}

onDecline(){
    this.setState({commonModal: false})
}

showSyncModal(){
    this.setState({syncModal: true})
}

syncModal(){
    this.setState({syncModal: false})
    this.uploadEmpData();
}

render () {
    const {loading} = this.state;
    const {user, button} = this.props;
    console.log("LOGOUT: ", Actions.currentScene);
    let buttonColor = null;
    if(user === "Aarti Drugs Ltd"){
        buttonColor = button
    }else{
        buttonColor = button
    }
		return(
        <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', fontSize: (fontSizeH4().fontSize + 3), marginBottom: 20}}>Are you sure you want to Log Out?</Text>
                    {(!this.state.unsavedTracks) ?
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity onPress={()=>this.logoutWithoutApi()} style={[{borderColor: 'black', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(40, 6)]}>
                                <View style={[{borderRadius:10, justifyContent: 'center'}, buttonColor, getWidthnHeight(40, 5)]}>
                                    <Text style={{color:'white', textAlign: 'center', fontWeight: 'bold'}}>Log Out</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    :
                      <View style={{alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => this.showSyncModal()} style={[{borderColor: 'black', borderWidth: 0, justifyContent: 'center'}, getWidthnHeight(40, 6)]}>
                                <View style={[{backgroundColor: '#ABA9A9', borderRadius:10, justifyContent: 'center'}, getWidthnHeight(40, 5)]}>
                                    <Text style={{color:'white', textAlign: 'center', fontWeight: 'bold'}}>Log Out</Text>
                                </View>
                          </TouchableOpacity>
                      </View>
                    }
                </View>
                <View 
                    style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent'}, StyleSheet.absoluteFill]} 
                    pointerEvents={(loading)? 'auto' : 'none'}
                >
                    {(loading) ?
                        <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                    : null}
                </View>
            </View>
            <CommonModal 
              title="Please be sure to Sync UNSAVED TRACKS before you Log Out."
              visible={this.state.syncModal}
              onDecline={this.syncModal.bind(this)}
              buttonText="Sync Now"
            />
            <CommonModal 
                title="Something went wrong"
                subtitle= {`Error Code: ${this.state.errorCode}${this.state.apiCode}`}
                visible={this.state.commonModal}
                onDecline={this.onDecline.bind(this)}
                buttonColor={['#0E57CF', '#25A2F9']}
            />
        </View>
    )}
}

const styles = StyleSheet.create({
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
        borderWidth: 0
    }
});

export default connect(null, { showGame })(Header);
