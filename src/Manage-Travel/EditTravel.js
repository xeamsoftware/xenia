import React from 'react';
import {
    Platform, PixelRatio, StyleSheet, 
    Text, TouchableOpacity, View, 
    ScrollView, Alert, TouchableHighlight, 
    AsyncStorage, Animated, KeyboardAvoidingView
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import AntdesignIcons from 'react-native-vector-icons/AntDesign';
import Asterisk from 'react-native-vector-icons/FontAwesome5';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import {
    CommonModal, IOS_StatusBar, getMarginTop, getMarginBottom, getWidthnHeight,fontSizeH4, Slider,
    FloatingTitleTextInputField, getMarginVertical, DateSelector, WaveHeader, fontSize_H3, ItineraryModal,
    TimePicker, RoundButton, RadioEnable, RadioDisable, AlertBox, DismissKeyboard, getMarginLeft, Date, MySwitch,
    Spinner, getMarginRight, StayModal, statusBarGradient, CustomTextInput, SearchableDropDown
} from '../KulbirComponents/common';
import {extractBaseURL} from '../api/BaseURL';

const colorBase = '#25A2F9';
const colorTitle = '#0B8EE8';
const message = "Please fill the fields highlighted in RED";

export default class EditTravel extends React.Component {

    constructor(props) {
        super(props)
            this.myTextInput = React.createRef();
            this.state = {
                purpose:'',
                purposeError: true,
                travelDateTime:'',
                switchpolicy: false,
                switchStay: false,
                switchImprest: false,
                itinerarytoggle:false,
                staytoggle:false,
                baseURL: null,
                conveyanceType: [],
                cities: [],
                loading: false,
                conveyanceID: null,
                conveyanceName: '',
                fromCityID: null,
                fromCityName: '',
                toCityID: null,
                toCityName: '',
                isLocal: 0,
                pricePerKM: 0,
                distance: '',
                amount: '',
                calculatedAmount: '',
                animateFontSize: new Animated.Value(fontSizeH4().fontSize),
                animateTextHeight: new Animated.Value(0),
                animateTextOpacity: new Animated.Value(0),
                animationCalled: false,
                travelCategories: [],
                travelCategoryID: '',
                travelCategoryName: '',
                travelCategoryError: true,
                tDateError: true,
                conveyanceError: true,
                tFromCityError: true,
                tToCityError: true,
                tDistanceError: true,
                amountError: true,
                checkTravelErrors: function(){
                    return (this.tDateError === false && this.conveyanceError === false && this.fromStateError === false &&  this.tFromCityError === false 
                        && this.toStateError === false && this.tToCityError === false && ((this.isLocal === 0)? true : this.tDistanceError === false) &&
                        ((this.isLocal === 0)? this.amountError === false : true))
                },
                checkStayErrors: function(){
                    return (this.stayDateError === false && this.stayDateError2 === false && this.stateError === false && this.stayCityError === false 
                            && this.stayRateError === false && this.foodExpenseError === false)
                },
                checkImprestError: function(){
                    return (this.projectError === false && this.imprestAmountError === false && this.remarksError === false)
                },
                submitTravel: false,
                travelData: [],
                travelNationalID: [],
                nationalTravelID: null,
                // travelData: [
                //     {"amount": 63, "isLocal": 1, "conveyance": "Auto [Rs.4.5/km]", "date": "17/05/2021", "distance": "14", "from": "Adilabad", "id": 1, "to": "Adoni", "fromCityID": 2, "toCityID": 3, "conveyanceID": 5}, 
                //     {"amount": 825, "isLocal": 1, "conveyance": "Own Car - Petrol [Rs.5.5/km]", "date": "17/05/2021", "distance": "150", "from": "Anantapur", "id": 2, "to": "Banganapalle", "fromCityID": 3, "toCityID": 5, "conveyanceID": 1}, 
                //     {"amount": "20", "isLocal": 0, "conveyance": "DA", "date": "17/05/2021", "distance": null, "from": "Bhainsa", "id": 3, "to": "Bhongir", "fromCityID": 7, "toCityID": 4, "conveyanceID": 1}
                // ],
                enableAlert: false,
                alertTitle: null,
                alertColor: false,
                submitStay: false,
                stayDate: '',
                stayDate2: '',
                stateName: '',
                stateID: null,
                stayDateError: true,
                stayDateError2: true,
                stateError: true,
                stayCityID: null,
                stayCityName: '',
                stayCityError: true,
                stayRate: '',
                stayRateError: true,
                foodExpense: '',
                foodExpenseError: true,
                stateData: [],
                stayData: [],
                stayIDArray: [],
                stayID: null,
                // stayData: [
                //     {"city": "Chandigarh", "stayCityID": 2, "date1": "17/05/2021", "date2": "18/05/2021" , "date": "17/05/2021 - 18/05/2021", "foodExpense": "200", "id": 1, "state": "Chandigarh", "stayRate": "500"},
                //     {"city": "Mohali", "stayCityID": 2, "date1": "19/05/2021", "date2": "20/05/2021", "date": "19/05/2021 - 20/05/2021", "foodExpense": "200", "id": 2, "state": "Punjab", "stayRate": "500"},
                //     {"city": "Moga", "stayCityID": 4, "date1": "21/05/2021", "date2": "22/05/2021", "date": "21/05/2021 - 22/05/2021", "foodExpense": "200", "id": 3, "state": "Punjab", "stayRate": "500"}
                // ],
                stateWiseCity: [],
                foodAllowance: null,
                projects: [],
                projectID: null,
                projectName: '',
                projectError: true,
                save: false,
                imprestAmount: '',
                imprestAmountError: true,
                remarks: '',
                remarksError: true,
                checkTravelBlank: function(){
                    return (this.tDateError === true && this.conveyanceError === true && this.fromStateError === true && this.tFromCityError === true 
                        && this.toStateError === true && this.tToCityError === true && this.tDistanceError === true && ((this.isLocal === 0)? this.amountError === true : true))
                },
                checkStayBlank: function(){
                    return (this.stayDateError === true && this.stayDateError2 === true && this.stateError === true && this.stayCityError === true 
                        && this.stayRateError === true && this.foodExpenseError === true)
                },
                bounceTravelButton: false,
                animateSubmitButton: new Animated.Value(1),
                bounceStayButton: false,
                hotelAllowance: null,
                cityID: null,
                bandID: null,
                radioButton1: true,
                radioButton2: false,
                radioButton3: false,
                travelForID: null,
                travelForName: '',
                travelForError: true,
                otherPurpose: '',
                otherPurposeError: true,
                apiError: false,
                errorCode: null,
                apiCode: null,
                travelDate: [],
                conveyance: [],
                fromCity: [],
                toCity: [],
                distanceInKM: [],
                travelAmount: [],
                stayDateRange: [],
                stayCity: [],
                stayRatePerNight: [],
                da: [],
                stayDateR1: [],
                stayDateR2: [],
                amountHeight: null, 
                itineraryTotal: 0,
                stayTotal: 0,
                editTravel: false,
                editTravelIndex: null,
                editStay: false,
                editStayIndex: null,
                tilData: [],
                showSpinner: false,
                fromStateArray: [],
                fromState: '',
                fromStateID: null,
                fromStateError: true,
                toStateArray: [],
                toState: '',
                toStateID: null,
                toStateError: true
            };
    }

    async componentDidMount(){
        console.log("EDIT PROPS: ", this.props.data.approval.travel_national)
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => {
                console.log("EXTRACT LINK AMAN: ", this.state.baseURL)
                this.apicall()
            })
        })
    }

    autoFillData(){
        const {data} = this.props;
        this.setState({purpose: data.approval.travel_purpose, purposeError: false})
        this.setState({travelCategoryID: data.approval.category_id, travelCategoryName: data.approval.travel_category.name, travelCategoryError: false})
        if(data.approval.travel_for === "1"){
            this.setState({radioButton1: true, radioButton2: false, radioButton3: false})
            this.setState({travelForID: data.approval.project_id, travelForName: data.approval.project.name, travelForError: false})
        }else if(data.approval.travel_for === "2"){
            this.setState({radioButton1: false, radioButton2: true, radioButton3: false})
            this.setState({travelForID: data.approval.lead_id, travelForName: data.lead[0]['name'], travelForError: false})
        }else if(data.approval.travel_for === "3"){
            this.setState({radioButton1: false, radioButton2: false, radioButton3: true})
            this.setState({otherPurpose: data.approval.others, otherPurposeError: false})
        }
        let travelNational = data.approval.travel_national;
        let travelNationalID = [];
        let travelData = travelNational.map((item, index) => {
            travelNationalID.push(item.id)
            let conveyanceName = '';
            if(item.conveyance.islocal === 1){
                conveyanceName = `${item.conveyance.name} [Rs.${item.conveyance.price_per_km}/km]`
            }else{
                conveyanceName = item.conveyance.name;
            }
            const splitTravelDate = item.travel_date.split(" ");
            const travelDateTime = moment(splitTravelDate[0]).format('DD-MM-YYYY');
            return {
                id: item.id,
                nationalID: item.id,
                date: travelDateTime,
                conveyance: conveyanceName,
                conveyanceID: item.conveyance_id,
                fromState: item.from_city.state.name,
                fromStateID: item.from_city.state.id,
                from: item.from_city.name,
                fromCityID: item.from_city_id,
                toState: item.to_city.state.name,
                toStateID: item.to_city.state.id,
                to: item.to_city.name,
                toCityID: item.to_city_id,
                distance: (item.conveyance.islocal === 0)? null : String(item.distance_in_km),
                amount: String(item.travel_amount),
                isLocal: item.conveyance.islocal, 
                pricePerKM: item.conveyance.price_per_km
            }
        }) 
        this.setState({travelData, travelNationalID}, () => {
            console.log("**** TRAVEL NATIONAL ID: ", this.state.travelNationalID)
            this.compileTravelData()
        })
        const stay = (data.approval.stay === 0)? false : true;
        this.setState({switchStay: stay}, () => {
            const {switchStay} = this.state;
            if(switchStay){
                let stayIDArray = [];
                let travelStay = data.approval.travel_stay;
                let stayData = travelStay.map((item, index) => {
                    stayIDArray.push(item.id)
                    const fromDate = moment(item.from_date).format("DD-MM-YYYY");
                    const toDate = moment(item.to_date).format("DD-MM-YYYY");
                    const date1 = moment(fromDate, "DD-MM-YYYY");
                    const date2 = moment(toDate, "DD-MM-YYYY");
                    const days = date2.diff(date1, 'days');
                    return {
                        id: item.id,
                        uniqueStayID: item.id,
                        date: `${fromDate} - ${toDate}`,
                        state: item.city.state.name,
                        stateID: item.city.state_id,
                        city: item.city.name,
                        stayCityID: item.city_id,
                        stayRate: String(item.rate_per_night),
                        foodExpense: String(item.da),
                        calcStayRate: String((item.rate_per_night) * ((days === 0)? 1 : days)),
                        calcFoodExpense: String((item.da) * ((days === 0)? 1 : (days + 1))),
                        date1: fromDate,
                        date2: toDate
                    }
                })
                this.setState({stayData, stayIDArray}, () => {
                    console.log("**** STAY ID: ", this.state.stayIDArray)
                    this.compileStayData()
                })
            }else{
                this.setState({stayData: []})
            }
        })
        const imprestRequest = (data.approval.imprest_request === 0)? false : true;
        this.setState({switchImprest: imprestRequest}, () => {
            const {switchImprest} = this.state;
            if(switchImprest){
                this.setState({
                    projectID: data.approval.imprest.project[0].id,
                    projectName: data.approval.imprest.project[0].name,
                    projectError: false, imprestAmount: String(data.approval.imprest.amount),
                    imprestAmountError: false, remarks: data.approval.imprest.remarks_by_applicant,
                    remarksError: false
                }, () => console.log("PREFILL IMPREST: ", this.state.projectID, this.state.projectName, this.state.projectError))
            }
        })
    }

    travelDataSplice(index){
        const {travelNationalID} = this.state;
        const deleteItem = this.state.travelData[index]
        if(deleteItem.nationalID){
            //travelNationalID.splice(index, 1)
            if(travelNationalID.length === 1){
                alert("Last record cannot be deleted, but can be updated.");
                return;
            }else{
                this.removeItem('national', deleteItem.nationalID, index)
                console.log("### $$$ DELETE ITEM: ", deleteItem.nationalID, travelNationalID)
            }
        }else{
            this.spliceTravelData(index)
        }
    }

    spliceTravelData(index){
        const {travelData, editTravelIndex} = this.state;
        const id = travelData[index]['id'];
        if(editTravelIndex == index){
            this.clearTravel();
        }
        travelData.splice(index, 1);
        this.setState({travelData}, () => {
            console.log("@@@@ SPLICE: ", this.state.travelData)
            this.setState({
                travelDate: [], fromCity: [], 
                toCity: [], distanceInKM: [], travelAmount: [], conveyance: []
            }, () => {
                if(this.state.travelData.length > 0){
                    this.compileTravelData();
                }else{
                    this.setState({itineraryTotal: 0})
                }
            })
        })
    }

    compileTravelData(){
        const {travelData} = this.state;
        let sumAmount = 0;
        travelData.forEach((item) => {
            sumAmount = Number(sumAmount) + Number(item.amount);
        })
        let travelDate = [];
        travelDate = travelData.map((item) => {
            return item.date
        })
        let conveyance = [];
        conveyance = travelData.map((item) => {
            return String(item.conveyanceID)
        })
        let fromCity = [];
        fromCity = travelData.map((item) => {
            return String(item.fromCityID)
        })
        let toCity = [];
        toCity = travelData.map((item) => {
            return String(item.toCityID)
        })
        let distanceInKM = []
        distanceInKM = travelData.map((item) => {
            return String(item.distance)
        })
        let travelAmount = []
        travelAmount = travelData.map((item) => {
            return String(item.amount)
        })
        this.setState({
            itineraryTotal: sumAmount, travelDate: (travelDate), fromCity: (fromCity), 
            toCity: (toCity), distanceInKM: (distanceInKM), travelAmount: (travelAmount),
            conveyance: (conveyance)
        }, () => console.log("\nTRAVEL DATE: ", this.state.travelDate,
        "\nFROM CITY: ", this.state.fromCity, "\nTO CITY: ", this.state.toCity, "\nDISTANCE: ", this.state.distanceInKM, 
        "\nAMOUNT: ", this.state.travelAmount, "\nCONVEYANCE: ", this.state.conveyance
        ))
    }

    async removeItem(dataType, dataID, index){
        const {baseURL} = this.state;
        const {data} = this.props;
        this.setState({showSpinner: true})
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/travel/delete/pre-approval-national-stay`,
        {
            travel_id: data.approval.id,
            type: dataType,
            data_id: dataID
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.setState({showSpinner: false})
            const responseJson = (response.data);
            if(dataType === 'national'){
                this.spliceTravelData(index);
                this.state.travelNationalID.splice(index, 1);
            }else if(dataType === 'stay'){
                this.spliceStayData(index);
                this.state.stayIDArray.splice(index, 1);
            }
            Alert.alert("Success!", responseJson.msg)
            console.log("@@@@@ SUCCESS", responseJson)
        }).catch((error) => {
            this.setState({showSpinner: false})
            let status = null;
            console.log("#### ERROR: ", error, data.approval.id, dataType, dataID)
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '125')
            }else{
                alert(`${error}, API CODE: 125`)
            }
        });
    }

    stayDataSplice(index){
        const {stayIDArray} = this.state;
        const deleteItem = this.state.stayData[index]
        if(deleteItem.uniqueStayID){
            if(stayIDArray.length === 1){
                alert("Last record cannot be deleted, but can be updated.");
                return;
            }else{
                this.removeItem('stay', deleteItem.uniqueStayID, index)
                console.log("### STAY SPLICE: ", deleteItem.uniqueStayID, stayIDArray)
            }
        }else {
            this.spliceStayData(index)
        }
    }

    spliceStayData(index){
        let {stayData, editStayIndex} = this.state;
        const id = stayData[index]['id'];
        if(editStayIndex == index){
            this.clearStay();
        }
        stayData.splice(index, 1)
        this.setState({stayData}, () => {
            console.log("@@@@ SPLICE: ", this.state.stayData)
            this.setState({stayDateRange: [], stayCity: [], stayRatePerNight: [],da: []}, () => {
                if(this.state.stateData.length > 0){
                    this.compileStayData()
                }else{
                    this.setState({stayTotal: 0})
                }
            })
        })
    }

    compileStayData(){
        const {stayData} = this.state;
        let sumAmount = 0;
        stayData.forEach((item) => {
            const date1 = moment(item.date1, "DD-MM-YYYY");
            const date2 = moment(item.date2, "DD-MM-YYYY");
            const days = date2.diff(date1, 'days');
            sumAmount = Number(sumAmount) + Number(item.foodExpense) * ((days === 0)? 1 : (days + 1)) + Number(item.stayRate) * ((days === 0)? 1 : days);
            console.log('Compile Number of Days: ', typeof days, days, sumAmount);
        })
        let stayDateR1 = [];
        stayDateR1 = stayData.map((item) => {
            return item.date1
        })
        let stayDateR2 = [];
        stayDateR2 = stayData.map((item) => {
            return item.date2
        })
        let stayCity = []
        stayCity = stayData.map((item) => {
            return String(item.stayCityID)
        })
        let stayRatePerNight = []
        stayRatePerNight = stayData.map((item) => {
            return item.stayRate
        })
        let da = []
        da = stayData.map((item) => {
            return item.foodExpense
        })
        this.setState({
            stayTotal: sumAmount, stayDateR1: (stayDateR1), stayDateR2: (stayDateR2), stayCity: (stayCity), 
            stayRatePerNight: (stayRatePerNight), da: (da)
        }, () => {
            console.log("\n^^^&&& DATE R1: ", this.state.stayDateR1, "\nDATE R2: ", this.state.stayDateR2,  
            "\nSTAY CITY: ", this.state.stayCity, "\nRATE/NIGHT: ", this.state.stayRatePerNight, 
            "\nDA", this.state.da)
        })
    }

    async apicall(){
        const {baseURL} = this.state;
        this.showLoader()
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.get(`${baseURL}/travel/approval-form`,
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.hideLoader();
            const responseJson = (response.data);
            console.log("@@@@@ SUCCESS", responseJson.data.user.designation)
            const modifyData = responseJson.data.user.designation;
            const conveyanceType = this.manageData(modifyData[0]['band']['travel_conveyances']);
            const bandID = modifyData[0]['band']['id'];
            //console.log("RESPONSE JSON: ", responseJson.data.user)
            this.setState({
                conveyanceType: conveyanceType,
                stateData: responseJson.data.states,
                cities: responseJson.data.cities,
                travelCategories: responseJson.data.categories,
                projects: responseJson.data.projects,
                bandID: bandID,
                tilData: responseJson.data.lead
            }, () => this.autoFillData())
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '121')
            }else{
                alert(`${error}, API CODE: 121`)
            }
        });
    }

    cities = async(stateID, name) => {
        const {baseURL} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/states-wise-cities`,
        {
            state_ids: stateID
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.hideLoader();
            console.log("### STATE WISE CITIES: ", (response.data))
            const responseJson = response.data;
            if(name === 'fromState'){
                this.setState({fromStateArray: responseJson.success.cities})
            }else if(name === 'toState'){
                this.setState({toStateArray: responseJson.success.cities})
            }else{
                this.setState({stateWiseCity: responseJson.success.cities})
            }
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '122')
            }else{
                alert(`${error}, API CODE: 122`)
            }
        })
    }

    cityBand = async() => {
        const {baseURL, stayCityID, bandID} = this.state;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        axios.post(`${baseURL}/band-city`,
        {
            city: stayCityID,
            band: bandID
        },
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+ permissions_four,
            }
        }).then((response) => {
            this.hideLoader();
            console.log("### STATE WISE CITIES: ", (response.data))
            const responseJson = response.data;
            this.setState({
                hotelAllowance: responseJson.city_class[0].pivot.price,
                foodAllowance: responseJson.food_allowance
            }, () => {
                console.log("### CITY ALLOWANCE: ", this.state.hotelAllowance, this.state.foodAllowance)
            })
        }).catch((error) => {
            this.hideLoader();
            let status = null;
            if(error.response){
                status = error.response.status;
                this.enableModal(status, '123')
            }else{
                alert(`${error}, API CODE: 123`)
            }
        })
    }

    manageData(conveyanceData){
        const renamedData = conveyanceData.map((data) => {
            let name = '';
            if(data.islocal === 1){
                name = `${data.name} [Rs.${data.price_per_km}/km]`;
            }else if(data.islocal === 0){
                name = data.name
            }
            return {...data, name}
        })
        return renamedData;
    }

    itinerarytoggle = () => {
        const {itinerarytoggle} = this.state;
        this.setState({itinerarytoggle : !itinerarytoggle},()=>console.log('switchValue:',itinerarytoggle))
    }

    staytoggle = () => {
        const {staytoggle} = this.state;
        this.setState({staytoggle : !staytoggle},()=>console.log('staytoggle:',staytoggle))
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    showAutoCalculatedAmount(){
        const {animateFontSize, animateTextHeight, animateTextOpacity} = this.state;
        Animated.parallel([
            Animated.timing(animateFontSize, {
                toValue: (fontSizeH4().fontSize - 3),
                duration: 150
            }),
            Animated.timing(animateTextHeight, {
                toValue: 30,
                duration: 150
            }),
            Animated.delay(150),
            Animated.timing(animateTextOpacity, {
                toValue: 1,
                duration: 150
            })
        ]).start(() => this.setState({animationCalled: true}))
    }

    checkErrorsInTravel(){
        const {
            travelData, travelDateTime, conveyanceName, fromCityName, toCityName,
            distance, amount, calculatedAmount, isLocal, fromCityID, toCityID,
            conveyance, conveyanceID, pricePerKM, fromState, fromStateID,
            toState, toStateID
        } = this.state;
        this.setState({submitTravel: true})
        let createData = null;
        let data = [];
        const chechError = this.state.checkTravelErrors();
        if(chechError){
            createData = {
                id: moment().valueOf(),
                nationalID: null,
                date: travelDateTime,
                conveyance: conveyanceName,
                conveyanceID,
                fromState,
                fromStateID,
                from: fromCityName,
                fromCityID,
                toState,
                toStateID,
                to: toCityName,
                toCityID,
                distance: distance,
                amount: (isLocal === 0)? amount : calculatedAmount,
                isLocal: isLocal,
                pricePerKM 
            }
            this.state.travelData.push(createData)
            //this.state.travelNationalID.push(createData.nationalID)
            this.setState({
                submitTravel: false, bounceTravelButton: false,
                tDateError: true, conveyanceError: true, editTravel: false,
                tFromCityError: true, tToCityError: true,editTravelIndex: null,
                tDistanceError: true, amountError: true, pricePerKM: 0,
                travelDateTime: '', conveyanceID: null, conveyanceName: '', 
                fromCityID: null, fromCityName: '', toCityID: null, toCityName: '',
                distance: '', amount: '', isLocal: 0, calculatedAmount: '', nationalTravelID: null,
                fromStateID: null, fromState: '', fromStateError: true, fromStateArray: [],
                toStateID: null, toState: '', toStateError: true, toStateArray: []
            }, () => {
                console.log("^^^&&& ITINERARY DATA: ", this.state.travelData.length, this.state.travelData)
                this.compileTravelData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    checkErrorsInStayForm(){
        const {
            stayData, stayDate, stayDate2, stateName, stateID, stayCityName,
            stayRate, foodExpense, stayCityID
        } = this.state;
        this.setState({submitStay: true})
        let createData = null;
        const chechError = this.state.checkStayErrors();
        if(chechError){
            const date1 = moment(stayDate, "DD-MM-YYYY");
            const date2 = moment(stayDate2, "DD-MM-YYYY");
            const days = date2.diff(date1, 'days');
            console.log('Calculate Number of Days: ', typeof days, days)
            createData = {
                id: moment().valueOf(),
                uniqueStayID: null,
                date: `${stayDate} - ${stayDate2}`,
                state: stateName,
                stateID: stateID,
                city: stayCityName,
                stayCityID,
                stayRate: stayRate,
                foodExpense: foodExpense,
                calcStayRate: String((stayRate) * ((days === 0)? 1 : days)),
                calcFoodExpense: String((foodExpense) * ((days === 0)? 1 : (days + 1))),
                date1: stayDate,
                date2: stayDate2
            }
            this.state.stayData.push(createData)
            this.setState({
                submitStay: false, bounceStayButton: false,
                stayDateError: true, stayDateError2: true, 
                stateError: true, stayCityError: true,
                stayRateError: true, foodExpenseError: true, 
                stayDate: '', stayDate2: '', 
                stateID: null, stateName: '', 
                stayCityID: null, stayCityName: '', 
                stayRate: '', foodExpense: '',
                hotelAllowance: null, foodAllowance: null,
                stateWiseCity: [],
            }, () => {
                console.log("###STAY DATA: ", this.state.stayData.length, this.state.stayData)
                this.compileStayData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    async checkAllErrors(){
        const {switchImprest, switchStay, travelData, purposeError, travelCategoryError, stayData} = this.state;
        console.log("POLL TRAVEL ERRORS: ", this.state.checkTravelBlank(), "\n\n",
        this.state.tDateError, this.state.conveyanceError, this.state.tFromCityError , 
        this.state.tToCityError, this.state.tDistanceError, ((this.state.isLocal === 0)? this.state.amountError : false)
        )
        this.setState({save: true})
        const checkTravelData = Boolean(travelData.length > 0);
        let checkStayData = true;
        const pollTravel = this.state.checkTravelBlank();
        const pollStay = this.state.checkStayBlank();
        if(pollTravel && checkTravelData){
            this.setState({submitTravel: false, bounceTravelButton: false})
        }else{
            this.bounceSubmitButton();
            this.setState({submitTravel: true, bounceTravelButton: true})
            this.setState({enableAlert: true, alertTitle: 'Please submit your TRAVEL details', alertColor: false})
            return;
        }
        if(switchStay){
            if(pollStay && stayData.length > 0){
                this.setState({submitStay: false, bounceStayButton: false})
                checkStayData = Boolean(stayData.length > 0);
            }else{
                this.bounceSubmitButton();
                this.setState({submitStay: true, bounceStayButton: true})
                this.setState({enableAlert: true, alertTitle: 'Please submit your STAY details', alertColor: false})
                return;
            }
        }
        let checkImprestError = true;
        if(switchImprest){
            checkImprestError = this.state.checkImprestError();
        }
        let checkTravelFor = null;
        if(!travelCategoryError){
            const {travelCategoryID} = this.state;
            if(travelCategoryID === 1 || travelCategoryID === 10){
                const {radioButton1, radioButton2, radioButton3, travelForError} = this.state;
                if(radioButton1 || radioButton2){
                    if(travelForError){
                        checkTravelFor = false;
                    }else{
                        checkTravelFor = true;
                    }
                }else if(radioButton3){
                    const {otherPurposeError} = this.state;
                    if(otherPurposeError){
                        checkTravelFor = false;
                    }else{
                        checkTravelFor = true;
                    }
                }
            }else{
                checkTravelFor = true;
            }
        }

        if(!purposeError && !travelCategoryError && checkTravelFor && checkTravelData && pollTravel && checkStayData && checkImprestError){
            this.saveApprovalForm();
            // this.setState({
            //     save: false, submitTravel: false, submitStay: false, purpose: '', travelCategoryID: null, 
            //     travelCategoryName: '', travelCategoryError: true, purposeError: true
            // })
            //this.setState({enableAlert: true, alertTitle: 'Data will be saved', alertColor: false})
        }else{
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    clearTravel(){
        this.setState({submitTravel: false, travelDateTime: '', tDateError: true, conveyanceID: null, conveyanceName: '', conveyanceError: true,
            fromCityID: null, fromCityName: '', tFromCityError: true, toCityID: null, toCityName: '', tToCityError: true, editTravel: false,
            distance: '', tDistanceError: true, amount: '', amountError: true, bounceTravelButton: false, isLocal: 0, editTravelIndex: null,
            pricePerKM: 0, nationalTravelID: null, calculatedAmount: '', fromStateID: null, fromState: '', fromStateError: true, toStateID: null, 
            toState: '', toStateError: true, fromStateArray: [], toStateArray: []
        })
    }

    clearStay(){
        this.setState({submitStay: false, stayDate: '', stayDate2: '', stayDateError: true, stayDateError2: true, 
            stateID: null, stateName: '', stateError: true, stayCityID: null, stayCityName: '', stayCityError: true, 
            stayRate: '', stayRateError: true, foodExpense: '', foodExpenseError: true, bounceStayButton: false,
            stateWiseCity: [], hotelAllowance: null, foodAllowance: null, editStay: false, editStayIndex: null, stayID: null
        })
    }

    bounceSubmitButton(){
        const {animateSubmitButton} = this.state;
        Animated.loop(
            Animated.sequence([
                Animated.spring(animateSubmitButton, {
                    toValue: 1.1,
                    friction: 7,
                    tension: 250,
                    useNativeDriver: true
                }),
                Animated.timing(animateSubmitButton, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true
                })
            ])
        ).start();
    }

    saveApprovalForm = async() => {
        const {baseURL, switchStay, switchImprest} = this.state;
        const context=this;
        const _this = this;
        const {screen} = this.props;
        this.showLoader();
        var user_token= await AsyncStorage.getItem('user_token');
        var permissions_fir= JSON.parse(user_token);
        var permissions_four=permissions_fir.success.secret_token;
        var data = new FormData();
        let stay = (switchStay)? 1 : 0;
        let imprestRequest = (switchImprest)? 1 : 0;
        const travelDate = JSON.stringify(this.state.travelDate);
        const conveyance = JSON.stringify(this.state.conveyance);
        const fromCity = JSON.stringify(this.state.fromCity);
        const toCity = JSON.stringify(this.state.toCity);
        const distanceInKM = JSON.stringify(this.state.distanceInKM);
        const travelAmount = JSON.stringify(this.state.travelAmount);
        let totalTravelAmount = 0;
        if(stay === 1){
            totalTravelAmount = this.state.itineraryTotal + this.state.stayTotal;
        }else{
            totalTravelAmount = this.state.itineraryTotal;
        }
        const travelNationalLength = this.state.travelNationalID.length;
        const travelNationalID = JSON.stringify(this.state.travelNationalID);
        console.log("^^^***### SUBMIT FORM: ", travelNationalID)
        data.append('purpose_pre', this.state.purpose);
        data.append('category_id', this.state.travelCategoryID);
        data.append('total_travel_amount', totalTravelAmount);
        if(travelNationalLength > 0){
            data.append('travel_national_id', travelNationalID);
        }
        data.append('travel_type', 2);
        data.append('cover_under_policy', 1);
        data.append('other_financial_approval', 0);
        data.append('travel_date', travelDate);
        data.append('conveyance_id', conveyance)
        data.append('city_id_from_pre', fromCity);
        data.append('city_id_to_pre', toCity);
        data.append('distance_in_km', distanceInKM);
        data.append('amount', travelAmount);
        data.append('stay', stay);
        if(stay === 1){
            const stayIDArrayLength = this.state.stayIDArray.length;
            const stayIDArray = JSON.stringify(this.state.stayIDArray)
            const stayDateR1 = JSON.stringify(this.state.stayDateR1)
            const stayDateR2 = JSON.stringify(this.state.stayDateR2)
            const stayCity = JSON.stringify(this.state.stayCity)
            const stayRatePerNight = JSON.stringify(this.state.stayRatePerNight)
            const da = JSON.stringify(this.state.da)
            if(this.props.data.approval.stay === 1 && stayIDArrayLength > 0){
                data.append('travel_stay_id', stayIDArray);
            }
            data.append('stay_date_from', stayDateR1);
            data.append('stay_date_to', stayDateR2);
            data.append('city_id_stay', stayCity);
            data.append('rate_per_night', stayRatePerNight);
            data.append('da', da);
        }
        data.append('imprest_request', imprestRequest);
        if(imprestRequest === 1){
            if(this.props.data.approval.imprest_request === 1){
                console.log("SUBMIT $$$$####@@@@!!!! ", this.props.data.approval.imprest.id, this.props.data.approval.imprest_request)
                data.append('imperest_id', this.props.data.approval.imprest.id)
            }
            console.log("^^^$$$$####@@@@!!!! ", this.props.data.approval.travel_code, this.props.data.approval.imprest_request, this.props.data.approval.imprest, this.state.projectID,
            this.state.imprestAmount, this.state.remarks
            )
            data.append('project_id_imprest', this.state.projectID);
            data.append('amount_imprest', this.state.imprestAmount)
            data.append('remarks', this.state.remarks)
        }
        if(this.state.travelCategoryID === 1 || this.state.travelCategoryID === 10){
            if(this.state.radioButton1){
                data.append('isclient', 1)
                data.append('existing_customer', this.state.travelForID)
            }else if(this.state.radioButton2){
                data.append('isclient', 2)
                data.append('future_customer', this.state.travelForID)
            }else if(this.state.radioButton3){
                data.append('isclient', 3)
                data.append('local_others', this.state.otherPurpose)
            }
        }
    
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", function() {
            if(xhr.readyState !== 4){
                return;
            }
            if (xhr.status === 200) {
                console.log('%%%%% SUCCESS %%%%%');
                var json_obj = JSON.parse(xhr.responseText);
                console.log('RESPONSE: ', xhr.responseText)
                _this.setState({enableAlert: true, alertTitle: json_obj.success, alertColor: false})
                _this.hideLoader();
                Actions.TravelApprovals();
            }else{
                console.log("### ERROR APPROVAL API: ", xhr.responseText)
                var error = xhr.responseText
                _this.hideLoader();
                _this.enableModal(xhr.status, "124");
            }
        });
        xhr.open("POST", `${baseURL}/travel/approval-request-change/${this.props.data.approval.id}`);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${permissions_four}`);
        xhr.send(data);
    }

    enableModal(status, apiCode){
        this.setState({errorCode: status})
        this.setState({apiCode})
        this.setState({apiError: true})
    }
    
    calAmountLayout(e){
        const {amountHeight} = this.state;
        if(amountHeight){
            return;
        }
        this.setState({amountHeight: Math.floor(e.nativeEvent.layout.height - 3)}, () => {
            console.log("CAL AMOUNT LAYOUT: ", this.state.amountHeight)
        })
    }

    editTravelData(item, index){
        this.itinerarytoggle();
        this.setState({editTravel: true, editTravelIndex: index, 
            travelDateTime: item.date, tDateError: false, nationalTravelID: item.nationalID,
            conveyanceID: item.conveyanceID, conveyanceName: item.conveyance, conveyanceError: false,
            isLocal: item.isLocal, pricePerKM: item.pricePerKM,
        }, async() => {
            await this.cities(item.fromStateID, 'fromState');
            await this.cities(item.toStateID, 'toState');
            this.setState({
                fromStateID: item.fromStateID, fromState: item.fromState, fromStateError: false, 
                fromCityID: item.fromCityID, fromCityName: item.from, tFromCityError: false, 
                toStateID: item.toStateID, toState: item.toState, toStateError: false,
                toCityID: item.toCityID, toCityName: item.to, tToCityError: false,
            })
        })
        if(item.isLocal === 0){
            this.setState({
                distance: item.distance, tDistanceError: true, 
                amount: String(item.amount), amountError: false,
                calculatedAmount: ''
            })
        }else if(item.isLocal === 1){
            this.setState({
                distance: item.distance, tDistanceError: false, 
                calculatedAmount: String(item.amount),
                amount: '', amountError: false
            })
        }
    }

    saveTravelChanges(){
        const {fromState, fromStateID, toState, toStateID} = this.state;
        this.setState({submitTravel: true})
        const chechError = this.state.checkTravelErrors();
        let editTravelArray = null;
        if(chechError){
            editTravelArray = {
                id: moment().valueOf(),
                nationalID: this.state.nationalTravelID,
                date: this.state.travelDateTime,
                conveyance: this.state.conveyanceName,
                conveyanceID: this.state.conveyanceID,
                fromState,
                fromStateID,
                from: this.state.fromCityName,
                fromCityID: this.state.fromCityID,
                toState,
                toStateID,
                to: this.state.toCityName,
                toCityID: this.state.toCityID,
                distance: this.state.distance,
                amount: (this.state.isLocal === 0)? this.state.amount : this.state.calculatedAmount,
                isLocal: this.state.isLocal,
                pricePerKM: this.state.pricePerKM
            }
            console.log("SAVE TRAVEL CHANGES: ", editTravelArray)
            this.state.travelData.splice(this.state.editTravelIndex, 1, editTravelArray)
            this.setState({
                itineraryTotal: 0, travelDate: [], fromCity: [], toCity: [], 
                distanceInKM: [], travelAmount: [], conveyance: []
            })
            this.setState({
                submitTravel: false, bounceTravelButton: false,
                tDateError: true, conveyanceError: true, nationalTravelID: null,
                tFromCityError: true, tToCityError: true, editTravelIndex: null,
                tDistanceError: true, amountError: true, editTravel: false,
                travelDateTime: '', conveyanceID: null, conveyanceName: '', 
                fromCityID: null, fromCityName: '', toCityID: null, toCityName: '',
                distance: '', amount: '', isLocal: 0, calculatedAmount: '', pricePerKM: 0,
                fromStateID: null, fromState: '', fromStateError: true, fromStateArray: [],
                toStateID: null, toState: '', toStateError: true, toStateArray: []
            }, () => {
                console.log("^^^&&& SAVE ITINERARY CHANGES: ", this.state.travelData.length, this.state.travelData)
                this.compileTravelData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    editStayData(item, index){
        this.staytoggle();
        this.setState({editStay: true, editStayIndex: index,
        stayDate: item.date1, stayDate2: item.date2,
        stayDateError: false, stayDateError2: false, 
        stateName: item.state, stateError: false, 
        stateID: item.stateID, stayID: item.uniqueStayID
        }, async() => {
            await this.cities(this.state.stateID, 'stayState');
            this.setState({stayCityName: item.city, stayCityID: item.stayCityID,
            stayRate: item.stayRate, foodExpense: item.foodExpense, stayCityError: false,
            stayRateError: false, foodExpenseError: false}, () => {
                this.cityBand();
            })
        })
        console.log("^^^@@@### EDIT STAY: ", item)
    }

    saveStayChanges(){
        const {
            stayDate, stayDate2, stateName, stateID, stayCityName, stayRate, foodExpense,
            stayCityID, editStayIndex
        } = this.state;
        this.setState({submitStay: true})
        let createData = null;
        const chechError = this.state.checkStayErrors();
        if(chechError){
            const date1 = moment(stayDate, "DD-MM-YYYY");
            const date2 = moment(stayDate2, "DD-MM-YYYY");
            const days = date2.diff(date1, 'days');
            createData = {
                id: moment().valueOf(),
                uniqueStayID: this.state.stayID,
                date: `${stayDate} - ${stayDate2}`,
                state: stateName,
                stateID: stateID,
                city: stayCityName,
                stayCityID,
                stayRate: stayRate,
                foodExpense: foodExpense,
                calcStayRate: String((stayRate) * ((days === 0)? 1 : days)),
                calcFoodExpense: String((foodExpense) * ((days === 0)? 1 : (days + 1))),
                date1: stayDate,
                date2: stayDate2
            }
            this.state.stayData.splice(editStayIndex, 1, createData)
            this.setState({
                stayTotal: 0, stayDateR1: [], stayDateR2: [], stayCity: [], 
                stayRatePerNight: [], da: []
            })
            this.setState({
                submitStay: false, bounceStayButton: false,
                stayDateError: true, stayDateError2: true, 
                stateError: true, stayCityError: true,
                stayRateError: true, foodExpenseError: true, 
                stayDate: '', stayDate2: '', 
                stateID: null, stateName: '', 
                stayCityID: null, stayCityName: '', 
                stayRate: '', foodExpense: '',
                hotelAllowance: null, foodAllowance: null,
                stateWiseCity: [], editStay: false,
                editStayIndex: null, stayID: null
            }, () => {
                console.log("###STAY DATA: ", this.state.stayData.length, this.state.stayData)
                this.compileStayData();
            })
        }else {
            this.setState({enableAlert: true, alertTitle: message, alertColor: true})
        }
    }

    render() {
        const {
            travelDateTime, loading, conveyanceType, cities, conveyanceID, fromCityID, toCityID, isLocal, pricePerKM,
            distance, amount, calculatedAmount, animateFontSize, animateTextHeight, animateTextOpacity, travelCategories,
            travelCategoryID, submitTravel, tDateError, conveyanceError, tFromCityError, tToCityError, tDistanceError,
            amountError, conveyanceName, fromCityName, toCityName, submitStay, stayDate, stayDateError, stateName, showSpinner,
            stateID, stateError, stayCityID, stayCityName, stayCityError, stayRate, stayRateError, foodExpense, foodExpenseError,
            projectID, projectName, projectError, save, imprestAmount, imprestAmountError, switchImprest, remarks, remarksError,
            purposeError, travelCategoryError, travelCategoryName, animateSubmitButton, bounceTravelButton, bounceStayButton,
            hotelAllowance, foodAllowance, radioButton1, radioButton2, radioButton3, projects, travelForID, travelForName, travelForError,
            otherPurpose, otherPurposeError, apiError, errorCode, apiCode, stayDate2, stayDateError2, editTravel, editStay, tilData,
            travelNationalID, stayIDArray, fromState, fromStateID, fromStateError, toState, toStateID, toStateError, fromStateArray, toStateArray
        } = this.state;
        const animateButton = {
            transform: [{
                scale: animateSubmitButton
            }]
        }
        const {screen} = this.props;
        let data = [{
          value: 'Banana',
        }, {
          value: 'Mango',
        }, {
          value: 'Pear',
        }];
        const fontStyle = {
            fontSize: animateFontSize,
        }
        const calculatedAmountStyle = {
            height: animateTextHeight,
            opacity: animateTextOpacity
        }
        let gradient = ['#039FFD', '#EA304F'];
        console.log("@@@ ### SCREEN PROP: ", this.props.data.approval.travel_national.length, this.props.data.approval.travel_stay.length)
        const travelNationalLength = this.props.data.approval.travel_national.length;
        const stayArrayLength = this.props.data.approval.travel_stay.length;
        const travelNationalCheck = Boolean(travelNationalID.length === travelNationalLength);
        const stayArrayCheck = Boolean(stayIDArray.length === stayArrayLength)
        console.log("$$$$$ DATA CHECK: ", travelNationalCheck, stayArrayCheck)
        return (
                <View style={styles.container}>
                    <View>
                        <View>
                            <IOS_StatusBar color={statusBarGradient} barStyle="light-content"/>
                            <WaveHeader
                                wave={Platform.OS ==="ios" ? false : false} 
                                menu='white'
                                title='Edit Travel Form'
                                headerType = {'small'}
                                menuState={false}
                                goBackTo={(screen)? () => Actions[screen]() : null}
                            />
                        </View>
                        {/* {<TouchableOpacity 
                            style={[{backgroundColor: (!travelNationalCheck || !stayArrayCheck)? 'rgba(255, 255, 255, 0.30)' : 'transparent', borderTopLeftRadius:0,
                            borderTopRightRadius: 0}, StyleSheet.absoluteFill]} 
                            pointerEvents={(!travelNationalCheck || !stayArrayCheck)? 'auto' : 'none'}
                        >
                        </TouchableOpacity> } */}
                    </View>
                    <DismissKeyboard>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginVertical:15}}>
                            <View>
                                <Text style={[{color: colorBase, textAlign: 'center', fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>Note: Fields with  </Text>
                            </View>
                            <View style={{width: getWidthnHeight(5).width, height: getWidthnHeight(5).width ,borderRadius: getWidthnHeight(5).width, borderWidth:2,borderColor:colorBase, backgroundColor:colorBase, justifyContent:'center', alignItems: 'center'}}>
                                <Asterisk size={getWidthnHeight(2.5).width} color="#FFF"  name="asterisk"/>
                            </View>
                            <View >
                                <Text style={[{color: colorBase, textAlign: 'center', fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>  are mandatory</Text>
                            </View>
                        </View>
                    </DismissKeyboard>
                    
                    <View style={styles.MainContainer}>
                        <View>
                        {/* {(loading) ?
                            <Spinner loading={loading} style={[styles.loadingStyle, styles.loader, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                        : null} */}
                        <KeyboardAvoidingView contentContainerStyle={{flex: 1}} behavior={(Platform.OS === 'ios')? "padding" : null} keyboardVerticalOffset={(Platform.OS === 'ios')? 170 : null}> 
                        <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" style={[{borderWidth: 0, borderColor: 'green', zIndex: 1}, getMarginTop(3), getMarginBottom(1)]}> 
                            <View style={{alignItems:'center'}}>
                                <View style={[{alignItems: 'center', justifyContent: 'space-evenly', borderWidth: 0, borderColor: 'red'}, getWidthnHeight(100, 18)]}>
                                    <View> 
                                        <CustomTextInput 
                                            placeholder=" Travel Purpose* "
                                            value={this.state.purpose}
                                            prefillEnable={true}
                                            inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                            inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                            activeTitleFontSize={fontSizeH4().fontSize - 3}
                                            onChangeText={(text) => {
                                                this.setState({purpose: text.trimLeft()}, () => {
                                                    const {purpose} = this.state;
                                                    if(purpose === ''){
                                                        this.setState({purposeError: true})
                                                    }else{
                                                        this.setState({purposeError: false})
                                                    }
                                                })
                                            }}
                                            containerStyle={[{
                                                borderColor: (save && purposeError)? 'red' : '#C4C4C4',
                                                borderStyle: (save && purposeError)? 'dashed' : 'solid',
                                                borderWidth: (save && purposeError)? 2 : 1, borderRadius: 1,
                                                justifyContent: 'center', alignItems: 'center'
                                            }, getWidthnHeight(90, 7)]}
                                            textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(90)]}
                                            inactiveTitleColor='dimgrey'
                                            activeTitleColor={colorTitle}
                                        />
                                    </View>
                                    <View style={[styles.box, {
                                            borderColor: (save && travelCategoryError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                            borderStyle: (save && travelCategoryError)? 'dashed' : 'solid', borderWidth: (save && travelCategoryError)? 2 : 1,
                                    }, getMarginTop(2)]}>
                                        <Dropdown
                                            containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 0, paddingLeft: 0, borderRadius: 10}, getWidthnHeight(90, 7)]}
                                            //  maxLength = {12}
                                            inputContainerStyle={[{borderBottomWidth:0,fontSize:13, marginTop:4,alignSelf:'center'}, getWidthnHeight(88)]}
                                            label={'Travel category*'}
                                            labelFontSize={fontSizeH4().fontSize - 2}
                                            data={travelCategories}
                                            valueExtractor={({id})=> id}
                                            labelExtractor={({name})=> name}
                                            onChangeText={(travelCategoryID, index, data) => this.setState({
                                                travelCategoryID, travelCategoryName: data[index]['name'], travelCategoryError: false, radioButton1: true, 
                                                radioButton2: false, radioButton3: false, travelForName: '', travelForID: null, travelForError: true,
                                                otherPurpose: '', otherPurposeError: true
                                            }, () => console.log("TRAVEL CATEGORY: ", this.state.travelCategoryID))}
                                            value={travelCategoryName}
                                            baseColor = {(travelCategoryName)? colorTitle : 'grey'}
                                            pickerStyle={[getMarginRight(0), getWidthnHeight(88), getMarginTop(10)]}
                                            fontSize = {fontSizeH4().fontSize + 3}
                                        />
                                    </View> 
                                </View>
                                {(travelCategoryID == 1 || travelCategoryID == 10)?
                                    <View style={[getMarginBottom(1)]}>
                                        <View style={[{alignItems: 'flex-start'}, getMarginTop(1.5), getMarginBottom(0.5), getWidthnHeight(90)]}>
                                            <Text style={[{color:"#3280E4", fontWeight:'bold'}, styles.boldFont, fontSizeH4()]}>TRAVEL FOR</Text>
                                        </View>
                                        <View style={[{borderColor: '#C4C4C4', borderWidth: 1, alignItems: 'center'}, getWidthnHeight(90, 25)]}>
                                            {(radioButton1)?
                                                <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(undefined, 15)]}>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(80)]}>
                                                        <RadioEnable 
                                                            title="Existing Client"
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'flex-start'}}
                                                            outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                            innerCircle={{width: getWidthnHeight(4.5).width, height: getWidthnHeight(4.5).width, borderRadius: getWidthnHeight(4.5).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                        <RadioDisable 
                                                            title="Prospect" 
                                                            onPress={() => this.setState({
                                                                radioButton1: false, radioButton2: true, radioButton3: false,
                                                                travelForName: '', travelForID: null, travelForError: true, 
                                                                otherPurpose: '', otherPurposeError: true
                                                            })}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'flex-end'}}
                                                            outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    </View>
                                                    <RadioDisable 
                                                        title="Other" 
                                                        onPress={() => this.setState({
                                                            radioButton1: false, radioButton2: false, radioButton3: true,
                                                            travelForName: '', travelForID: null, travelForError: true,
                                                        })}
                                                        containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                        outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                        textContainerStyle={[getMarginLeft(2)]}
                                                    />
                                                </View>
                                            :
                                                null
                                            }
                                            {(radioButton2)?
                                                <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(undefined, 15)]}> 
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(80)]}>
                                                        <RadioDisable 
                                                            title="Existing Client" 
                                                            onPress={() => this.setState({
                                                                radioButton1: true, radioButton2: false, radioButton3: false,
                                                                travelForName: '', travelForID: null, travelForError: true, 
                                                                otherPurpose: '', otherPurposeError: true
                                                            })}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'flex-start'}}
                                                            outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                        <RadioEnable 
                                                            title="Prospect"
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'flex-end'}}
                                                            outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                            innerCircle={{width: getWidthnHeight(4.5).width, height: getWidthnHeight(4.5).width, borderRadius: getWidthnHeight(4.5).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    </View>
                                                    <RadioDisable 
                                                        title="Other" 
                                                        onPress={() => this.setState({
                                                            radioButton1: false, radioButton2: false, radioButton3: true,
                                                            travelForName: '', travelForID: null, travelForError: true,
                                                        })}
                                                        containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                        outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                        textContainerStyle={[getMarginLeft(2)]}
                                                    />
                                                </View>
                                            :
                                                null
                                            }
                                            {(radioButton3)?
                                                <View style={[{borderWidth: 0, borderColor: 'red', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(undefined, 15)]}>
                                                    <View style={[{flexDirection: 'row', justifyContent: 'space-evenly'}, getWidthnHeight(80)]}>
                                                        <RadioDisable 
                                                            title="Existing Client" 
                                                            onPress={() => this.setState({
                                                                radioButton1: true, radioButton2: false, radioButton3: false,
                                                                travelForName: '', travelForID: null, travelForError: true, 
                                                                otherPurpose: '', otherPurposeError: true
                                                            })}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'flex-start'}}
                                                            outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                        <RadioDisable 
                                                            title="Prospect" 
                                                            onPress={() => this.setState({
                                                                radioButton1: false, radioButton2: true, radioButton3: false,
                                                                travelForName: '', travelForID: null, travelForError: true, 
                                                                otherPurpose: '', otherPurposeError: true
                                                            })}
                                                            containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'flex-end'}}
                                                            outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                            textContainerStyle={[getMarginLeft(2)]}
                                                        />
                                                    </View>
                                                    <RadioEnable 
                                                        title="Other"
                                                        containerStyle={{borderWidth: 0, borderColor: 'black', justifyContent: 'center'}}
                                                        outerCircle={{width: getWidthnHeight(8).width, height: getWidthnHeight(8).width, borderRadius: getWidthnHeight(8).width}}
                                                        innerCircle={{width: getWidthnHeight(4.5).width, height: getWidthnHeight(4.5).width, borderRadius: getWidthnHeight(4.5).width}}
                                                        textContainerStyle={[getMarginLeft(2)]}
                                                    />
                                                </View>
                                            :
                                                null
                                            }
                                            {(radioButton1 && !radioButton2 && !radioButton3) &&
                                                <View style={[styles.Dropbox, {borderWidth: 0}, getWidthnHeight(100)]}>  
                                                    <Dropdown
                                                        containerStyle={[{
                                                            borderColor: (save && travelForError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                            borderStyle: (save && travelForError)? 'dashed' : 'solid', borderWidth: (save && travelForError)? 2 : 1, 
                                                            paddingLeft: 0, alignItems: 'center'
                                                        }, getWidthnHeight(80, 7)]}
                                                        maxLength = {40}
                                                        inputContainerStyle={[{borderBottomWidth:0, marginTop:4,alignSelf:'center'}, getWidthnHeight(77)]}
                                                        label={'Select Existing Client'}
                                                        labelFontSize={fontSizeH4().fontSize - 2}
                                                        data={projects}
                                                        valueExtractor={({id})=> id}
                                                        labelExtractor={({name})=> name}
                                                        onChangeText={(travelForID, index, data) => this.setState({travelForName: data[index]['name'], travelForID, travelForError: false }, () => console.log("### TRAVEL FOR: ", this.state.travelForID))}
                                                        value={travelForName}
                                                        baseColor = {(travelForName)? colorTitle : 'grey'}
                                                        pickerStyle={[getMarginLeft(4), getWidthnHeight(80), getMarginTop(10)]}
                                                        fontSize = {fontSizeH4().fontSize}
                                                    />
                                                </View> 
                                            }
                                            {((!radioButton1 && radioButton2 && !radioButton3)) &&
                                                <View style={[styles.Dropbox, {borderWidth: 0}, getWidthnHeight(100)]}>  
                                                    <Dropdown
                                                        containerStyle={[{
                                                            borderColor: (save && travelForError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                            borderStyle: (save && travelForError)? 'dashed' : 'solid', borderWidth: (save && travelForError)? 2 : 1, 
                                                            paddingLeft: 0, alignItems: 'center'
                                                        }, getWidthnHeight(80, 7)]}
                                                        maxLength = {40}
                                                        inputContainerStyle={[{borderBottomWidth:0, marginTop:4,alignSelf:'center'}, getWidthnHeight(77)]}
                                                        label={'Select Prospect'}
                                                        labelFontSize={fontSizeH4().fontSize - 2}
                                                        data={tilData}
                                                        valueExtractor={({id})=> id}
                                                        labelExtractor={({name})=> name}
                                                        onChangeText={(travelForID, index, data) => this.setState({travelForName: data[index]['name'], travelForID, travelForError: false }, () => console.log("### TRAVEL FOR: ", this.state.travelForID))}
                                                        value={travelForName}
                                                        baseColor = {(travelForName)? colorTitle : 'grey'}
                                                        pickerStyle={[getMarginLeft(4), getWidthnHeight(80), getMarginTop(10)]}
                                                        fontSize = {fontSizeH4().fontSize}
                                                    />
                                                </View> 
                                            }
                                            {((!radioButton1 && !radioButton2 && radioButton3)) &&
                                                <View style={[styles.InputBox, {borderWidth: 0}, getMarginTop(1.5), getWidthnHeight(80, 7)]}>
                                                    <CustomTextInput 
                                                        placeholder=" Enter your other purpose "
                                                        value={this.state.otherPurpose}
                                                        inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                        inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                        activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                        onChangeText={(text) => {
                                                            this.setState({otherPurpose: text.trimLeft()}, () => {
                                                                const {otherPurpose} = this.state;
                                                                if(otherPurpose === ''){
                                                                    this.setState({otherPurposeError: true})
                                                                }else{
                                                                    this.setState({otherPurposeError: false})
                                                                }
                                                            })
                                                        }}
                                                        containerStyle={[{
                                                            borderColor: (save && otherPurposeError)? 'red' : '#C4C4C4',
                                                            borderStyle: (save && otherPurposeError)? 'dashed' : 'solid',
                                                            borderWidth: (save && otherPurposeError)? 2 : 1, borderRadius: 1,
                                                            justifyContent: 'center', alignItems: 'center'
                                                        }, getWidthnHeight(80, 7)]}
                                                        textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(80)]}
                                                        inactiveTitleColor='dimgrey'
                                                        activeTitleColor={colorTitle}
                                                    />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                :
                                    null
                                }
                                <View>
                                    <View style ={[{flexDirection:'row', justifyContent: 'space-between'},getWidthnHeight(90)]}> 
                                        <View style={[{alignItems:'flex-start', marginTop:getMarginTop(2).marginTop}]}>
                                            <Text style={[{color:"#3280E4", fontWeight:'bold'}, styles.boldFont, fontSizeH4()]}>ITINERARY DETAILS</Text>
                                        </View>
                                        <View style={[{borderColor: colorBase,}]}/>
                                        <RoundButton 
                                            title={(this.state.travelData.length === 0)? "View All" : `View All (${this.state.travelData.length})`}
                                            onPress={()=>this.itinerarytoggle()}
                                            gradient={['#3280E4', '#3280E4']}
                                            style={[getWidthnHeight(30, 4), getMarginTop(1),getMarginLeft(3)]}
                                        />
                                    </View>
                                </View>
                                {(this.state.itinerarytoggle)? 
                                    <ItineraryModal 
                                        data={this.state.travelData}
                                        //containerstyle = {{height:getWidthnHeight(undefined,29).height}}
                                        editTravelData={(item, index) => this.editTravelData(item, index)}
                                        isvisible={this.state.itinerarytoggle}
                                        travelTotal={this.state.itineraryTotal}
                                        toggle={() => this.itinerarytoggle()}
                                        style = {{backgroundColor:'#3180E5'}}
                                        iconfirst = {'arrow-right-l'}
                                        title = {'Itinerary Details'}
                                        textboxtitle = {'Conveyance: '}
                                        inputbgStyle = {{backgroundColor:'#DAE7F7'}}
                                        iconname_1 = {'route'}
                                        iconsize_1 = {getWidthnHeight(4.5).width}
                                        iconcolor_1 = {'white'}
                                        iconbgColor_1 = {{backgroundColor:'#F48D88'}}
                                        textboxplaceholder_1 = {'Distance'}
                                        boxcontainerStyle_1 = {{backgroundColor:'#EB3A32'}}
                                        iconname_2 = {'money-bill-alt'}
                                        iconsize_2 = {getWidthnHeight(4.5).width}
                                        iconcolor_2 = {'white'}
                                        iconbgColor_2 = {{backgroundColor:'#EAA74E'}}
                                        textboxplaceholder_2 = {'Amount'}
                                        boxcontainerStyle_2 = {{backgroundColor:'#E58E1B'}}
                                        textmarginleft = {[getMarginLeft(4.5)]}
                                        deleteItinerary = {(index) => this.travelDataSplice(index)}
                                        showSpinner={showSpinner}
                                    />
                                : 
                                    null
                                }
                                <View style={[styles.bigbox, {zIndex: 1}, getWidthnHeight(90)]}>
                                    <View style={[{flexDirection:'row'}]}>
                                        <DateSelector 
                                            containerStyle={[{
                                                borderColor: (submitTravel && tDateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitTravel && tDateError)? 'dashed' : 'solid', borderWidth: (submitTravel && tDateError)? 2 : 1,
                                                }, getWidthnHeight(42, 7), getMarginTop(1.5), getMarginLeft(2)]}
                                            //style={[(travelDateTime === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width} : {width: getWidthnHeight(35).width}]}
                                            style={[{borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width}]}
                                            date={this.state.travelDateTime}
                                            // clearDate={(travelDateTime === '')? false : true}
                                            // onPress={() => this.setState({travelDateTime: '', tDateError: true})}
                                            minDate={moment().toDate()}
                                            dateFont={{fontSize: (fontSizeH4().fontSize + 1)}}
                                            androidMode='default'
                                            mode='date'
                                            placeholder='Date'
                                            format='DD-MM-YYYY' 
                                            onDateChange={(date) => {
                                                this.setState({travelDateTime: (date), tDateError: false})
                                            }}  
                                        />
                                        <View style={[styles.Dropbox, {
                                            borderColor: (submitTravel && conveyanceError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                            borderStyle: (submitTravel && conveyanceError)? 'dashed' : 'solid', borderWidth: (submitTravel && conveyanceError)? 2 : 1,
                                        }]}>
                                            <Dropdown
                                                containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 0, paddingLeft: 0, borderRadius: 10, marginTop:-5}, getWidthnHeight(42, 7)]}
                                                maxLength = {24}
                                                inputContainerStyle={[{borderBottomWidth:0, marginTop:4,alignSelf:'center'}, getWidthnHeight(40, 7)]}
                                                label={'Conveyance Type*'}
                                                labelFontSize={fontSizeH4().fontSize - 2}
                                                data={conveyanceType}
                                                valueExtractor={({id})=> id}
                                                labelExtractor={({name})=> name}
                                                onChangeText={(conveyanceID, index, data) => {
                                                    const {animationCalled, animateFontSize, animateTextHeight, animateTextOpacity} = this.state;
                                                    // if(animationCalled){
                                                    //     animateFontSize.setValue(fontSizeH4().fontSize)
                                                    //     animateTextHeight.setValue(0)
                                                    //     animateTextOpacity.setValue(0)
                                                    //     this.setState({animationCalled: false})
                                                    // }
                                                    console.log("### GET DETAILS: ", index, data[index]['name'])
                                                    this.setState({ 
                                                        conveyanceName: data[index]['name'],
                                                        conveyanceID, conveyanceError: false,
                                                        isLocal: data[index]['islocal'],
                                                        pricePerKM: data[index]['price_per_km'] 
                                                    }, () => {
                                                        const {isLocal, distance, pricePerKM} = this.state;
                                                        console.log("CONVEYANCE: ", this.state.conveyanceID, this.state.isLocal, this.state.pricePerKM)
                                                        if(isLocal === 0){
                                                            const {amount} = this.state;
                                                            this.setState({calculatedAmount: ''})
                                                            if(!amount){
                                                                this.setState({amountError: true})
                                                            }
                                                        }
                                                        if(distance !== '' && isLocal === 1){
                                                            this.setState({calculatedAmount: String(distance * pricePerKM), amountError: true, amount: ''})
                                                        }
                                                    })
                                                }}
                                                value={conveyanceName}
                                                baseColor = {(conveyanceID)? colorTitle : 'grey'}
                                                pickerStyle={[getMarginRight(0), getWidthnHeight(50), getMarginTop(10)]}
                                                fontSize = {fontSizeH4().fontSize - 1}
                                            />
                                        </View> 
                                    </View> 
                                    <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', ...Platform.select({ios: { zIndex: 1 }})}, getWidthnHeight(90)]}>
                                        <SearchableDropDown 
                                            placeholder="State (from)*"
                                            data={this.state.stateData}
                                            value={this.state.fromState}
                                            style={[{
                                                borderColor: (submitTravel && fromStateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitTravel && fromStateError)? 'dashed' : 'solid', borderWidth: (submitTravel && fromStateError)? 2 : 1,
                                            }, getMarginTop(1), getWidthnHeight(42, 7)]}
                                            searchStyle={[getWidthnHeight(34, 7)]}
                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                            iconSize={getWidthnHeight(8).width}
                                            onChangeText={(id, name, index, data) => {
                                                this.setState({
                                                    fromStateID: id, fromState: name, fromStateError: false,
                                                    fromCityID: null, fromCityName: '', tFromCityError: true, stateWiseCity: []
                                                }, async() => {
                                                    //console.log("FROM STATE: ", this.state.fromStateID, this.state.fromState, "\n", index, data)
                                                    await this.cities(this.state.fromStateID, 'fromState');
                                                })
                                            }}
                                        />
                                        <SearchableDropDown 
                                            placeholder="City (from)*"
                                            data={fromStateArray}
                                            value={this.state.fromCityName}
                                            disabled={(fromStateID)? false : true}
                                            style={[{
                                                borderColor: (submitTravel && tFromCityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitTravel && tFromCityError)? 'dashed' : 'solid', borderWidth: (submitTravel && tFromCityError)? 2 : 1,
                                            }, getMarginTop(1), getWidthnHeight(42, 7)]}
                                            searchStyle={[getWidthnHeight(34, 7)]}
                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                            iconSize={getWidthnHeight(8).width}
                                            onChangeText={(id, name, index, data) => {
                                                this.setState({fromCityID: id, fromCityName: name, tFromCityError: false}, () => {
                                                    //console.log("FROM STATE: ", this.state.fromCityID, this.state.fromCityName)
                                                })
                                            }}
                                        />
                                    </View> 
                                    <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', ...Platform.select({ios: { zIndex: 1 }})}, getWidthnHeight(90)]}>
                                        <SearchableDropDown 
                                            placeholder="State (to)*"
                                            data={this.state.stateData}
                                            value={this.state.toState}
                                            style={[{
                                                borderColor: (submitTravel && toStateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitTravel && toStateError)? 'dashed' : 'solid', borderWidth: (submitTravel && toStateError)? 2 : 1,
                                            }, getMarginTop(1), getWidthnHeight(42, 7)]}
                                            searchStyle={[getWidthnHeight(34, 7)]}
                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                            iconSize={getWidthnHeight(8).width}
                                            onChangeText={(id, name, index, data) => {
                                                this.setState({
                                                    toStateID: id, toState: name, toStateError: false,
                                                    toCityID: null, toCityName: '', tToCityError: true, stateWiseCity: []
                                                }, async() => {
                                                    //console.log("FROM STATE: ", this.state.toStateID, this.state.toState, "\n", index, data)
                                                    await this.cities(this.state.toStateID, 'toState');
                                                })
                                            }}
                                        />
                                        <SearchableDropDown 
                                            placeholder="City (to)*"
                                            data={toStateArray}
                                            value={this.state.toCityName}
                                            disabled={(toStateID)? false : true}
                                            style={[{
                                                borderColor: (submitTravel && tToCityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitTravel && tToCityError)? 'dashed' : 'solid', borderWidth: (submitTravel && tToCityError)? 2 : 1,
                                            }, getMarginTop(1), getWidthnHeight(42, 7)]}
                                            searchStyle={[getWidthnHeight(34, 7)]}
                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                            iconSize={getWidthnHeight(8).width}
                                            onChangeText={(id, name, index, data) => {
                                                this.setState({toCityID: id, toCityName: name, tToCityError: false}, () => {
                                                    //console.log("FROM STATE: ", this.state.fromCityID, this.state.fromCityName)
                                                })
                                            }}
                                        />
                                    </View> 
                                    <View style={[{flexDirection:'row', justifyContent: 'space-evenly'}, getMarginTop(1.5)]}>
                                        <View style={[getWidthnHeight(42, 7)]}>
                                            <CustomTextInput 
                                                placeholder=" Distance (in k.m)* "
                                                value={this.state.distance}
                                                prefillEnable={(editTravel)? true : false}
                                                inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                onChangeText={(distance) => {
                                                    const {isLocal, pricePerKM} = this.state;
                                                    const number = distance.replace(/[^0-9]/g, '');
                                                    this.setState({distance: number.trim()}, () => {
                                                        if(this.state.distance === ''){
                                                            this.setState({tDistanceError: true})
                                                        }else{
                                                            this.setState({tDistanceError: false})
                                                        }
                                                    })
                                                    if(isLocal === 1 && distance !== ''){
                                                        this.setState({calculatedAmount: String(distance * pricePerKM), amountError: true, amount: ''}, () => {
                                                            console.log("### CALC DISTANCE: ", pricePerKM, typeof calculatedAmount, calculatedAmount)
                                                        })
                                                    }else{
                                                        this.setState({calculatedAmount: ''})
                                                    }
                                                }}
                                                keyboardType = {'numeric'}
                                                editable={(isLocal === 0)? false : true}
                                                containerStyle={[{
                                                    borderColor: ( isLocal === 1 && submitTravel && tDistanceError)? 'red' : '#C4C4C4',
                                                    borderStyle: ( isLocal === 1 && submitTravel && tDistanceError)? 'dashed' : 'solid',
                                                    borderWidth: ( isLocal === 1 && submitTravel && tDistanceError)? 2 : 1, borderRadius: 1,
                                                    backgroundColor: (isLocal === 0)? 'rgba(0,0,0,0.15)' : 'white', 
                                                    justifyContent: 'center', alignItems: 'center'
                                                }, getWidthnHeight(42, 7)]}
                                                textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(42)]}
                                                inactiveTitleColor='dimgrey'
                                                activeTitleColor={colorTitle}
                                            />
                                        </View>
                                        <View style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(42, 7)]}>
                                            {(isLocal === 0)?
                                                <CustomTextInput 
                                                placeholder=" Amount "
                                                value={amount}
                                                prefillEnable={(editTravel)? true : false}
                                                inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                onChangeText={(amount) => {
                                                    const number = amount.replace(/[^0-9]/g, '')
                                                        this.setState({amount: number.trim()}, () => {
                                                            const {amount} = this.state;
                                                            if(amount === ''){
                                                                this.setState({amountError: true})
                                                            }else{
                                                                this.setState({amountError: false})
                                                            }
                                                        })
                                                }}
                                                keyboardType = {'numeric'}
                                                containerStyle={[{
                                                    borderColor: (isLocal === 0 && submitTravel && amountError)? 'red' : '#C4C4C4',
                                                    borderStyle: (isLocal === 0 && submitTravel && amountError)? 'dashed' : 'solid',
                                                    borderWidth: (isLocal === 0 && submitTravel && amountError)? 2 : 1, borderRadius: 1,
                                                    justifyContent: 'center', alignItems: 'center'
                                                }, getWidthnHeight(42, 7)]}
                                                textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(42)]}
                                                inactiveTitleColor='dimgrey'
                                                activeTitleColor={colorTitle}
                                            />
                                            :
                                                <View>
                                                    <CustomTextInput 
                                                        placeholder=" Amount "
                                                        value={(calculatedAmount)? (calculatedAmount) : ''}
                                                        prefillEnable={(calculatedAmount)? true : false}
                                                        inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                        inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                        activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                        editable={false}
                                                        containerStyle={[{
                                                            borderColor: '#C4C4C4',
                                                            borderWidth: 1,
                                                            backgroundColor: 'rgba(0,0,0,0.15)',
                                                            justifyContent: 'center', alignItems: 'stretch'
                                                        }, getWidthnHeight(42, 7)]}
                                                        textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: (fontSizeH4().fontSize + 3), color: 'black'}]}
                                                        inactiveTitleColor='dimgrey'
                                                        activeTitleColor={colorTitle}
                                                    />
                                                    {/* {<View style={[{justifyContent: 'center', borderWidth: 0, borderColor: 'black', backgroundColor: 'rgba(0,0,0,0.15)'}, getWidthnHeight(42, 7)]}>
                                                        <View style={[getMarginLeft(1.5)]}>
                                                            <Animated.Text onLayout={this.calAmountLayout.bind(this)} style={[{
                                                                color: colorTitle, borderColor: 'green', borderWidth: 0, transform: [{translateY: (calculatedAmount)? -(this.state.amountHeight) : 0}],
                                                                width: (calculatedAmount)? getWidthnHeight(12).width : getWidthnHeight(20).width,
                                                                backgroundColor: (calculatedAmount)? 'white' : 'transparent', textAlign: (calculatedAmount)? 'center' : 'left'
                                                                }, fontStyle]}>Amount</Animated.Text>
                                                            <Animated.View style={[{borderColor: 'red', borderWidth: 0}, calculatedAmountStyle]}>
                                                                <Text style={[fontSizeH4()]}>{(calculatedAmount)? calculatedAmount : null}</Text>
                                                            </Animated.View>
                                                        </View>
                                                    </View>} */}
                                                </View>
                                            }
                                        </View> 
                                    </View>  
                                    <View style={[{flexDirection: 'row'}, getMarginTop(1.3), getMarginBottom(1.5), getWidthnHeight(90)]}>
                                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(30)]}/>
                                        <Animated.View style={[{alignItems: 'center', justifyContent: 'center'},(bounceTravelButton)? animateButton : null]}>
                                            <TouchableOpacity 
                                                style={[{flexDirection:'row', justifyContent: 'center'}, getWidthnHeight(30)]} 
                                                onPress={() => {
                                                    if(editTravel){
                                                        this.saveTravelChanges();
                                                    }else{
                                                        this.checkErrorsInTravel()
                                                    }
                                                }}
                                            >
                                                <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:10, borderBottomLeftRadius:10}, getWidthnHeight(4,5)]}/>
                                                <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4'}, getWidthnHeight(20,5)]}>
                                                    <Text style = {[{color:'white', fontWeight:"bold", fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{(editTravel)? 'DONE' : 'ADD'}</Text>
                                                </View>
                                                <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:10, borderBottomRightRadius:10}, getWidthnHeight(4,5)]}/>
                                            </TouchableOpacity>
                                        </Animated.View> 
                                        <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'center'}, getWidthnHeight(30)]}>
                                            <TouchableHighlight 
                                                style={[{
                                                    alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'black', 
                                                    width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                                    borderRadius: getWidthnHeight(7).width}, getMarginRight(4)]} 
                                                underlayColor="#3280E4"
                                                onPress={() => this.clearTravel()}
                                            >
                                                    <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                            </TouchableHighlight>
                                        </View>
                                    </View> 
                                </View>
                  {/* End Big Box */}
                            </View>  
                            {/* {<View>                    
                                <MySwitch
                                    title = 'Covered under policy*'
                                    value={this.state.switchpolicy}
                                    onValueChange ={(switchpolicy)=>this.setState({switchpolicy},()=>console.log('switchValue:',switchpolicy))}
                                    disabled={false}
                                />
                            </View>
                            <View style={{borderWidth:0.3,borderColor:'#BABABA', marginTop:getMarginTop(1).marginTop, width:getWidthnHeight(90).width, marginLeft:getMarginLeft(5).marginLeft}}/>}             */}
                            {/* {<View>
                                <MySwitch
                                    title = 'Stay*'
                                    value={this.state.switchStay}
                                    onValueChange ={(switchStay)=>this.setState({switchStay},()=>{
                                        console.log('switchValue:',switchStay)
                                        this.clearStay()
                                    })}
                                    disabled={false}
                                />
                            </View>} */}
                            <View style={[{alignItems: 'center', zIndex: -1}, getMarginTop(2), getMarginBottom(1)]}>
                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                                    <Text style={[fontSizeH4()]}>Stay*</Text>
                                    <Slider 
                                        activeColor={'#039FFD'} 
                                        //inactiveColor={'red'}
                                        // buttonColor={'red'}
                                        // buttonBorderColor={'blue'}
                                        value={this.state.switchStay}
                                        onSlide={(switchStay)=>this.setState({switchStay},()=>{
                                            console.log('switchValue:',switchStay)
                                            this.clearStay()
                                        })}
                                        delay={500}
                                        //title={['Test', 'Live']}
                                    />
                                </View>
                            </View>
                            {(this.state.switchStay)?
                                <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                                <View style ={[{flexDirection:'row', justifyContent: 'space-between'},getWidthnHeight(90)]}> 
                                    <View style={[{alignItems:'flex-start', marginTop:getMarginTop(2).marginTop}]}>
                                        <Text style={[{color:"#3280E4", fontWeight:'bold'}, styles.boldFont, fontSizeH4()]}>STAY DETAILS</Text>
                                    </View>
                                    <View style={[{borderColor: colorBase,}]}/>
                                        <RoundButton 
                                            title={(this.state.stayData.length === 0)? "View All" : `View All (${this.state.stayData.length})`}
                                            onPress={()=>this.staytoggle()}
                                            gradient={['#3280E4', '#3280E4']}
                                            style={[getWidthnHeight(30, 4), getMarginTop(1),getMarginLeft(3)]}
                                        />
                                </View>
                                {(this.state.staytoggle)? 
                                    <StayModal 
                                        containerstyle = {{height:getWidthnHeight(undefined,25).height}}
                                        data={this.state.stayData}
                                        isvisible={this.state.staytoggle}
                                        stayTotal={this.state.stayTotal}
                                        editStayData={(item, index) => this.editStayData(item, index)}
                                        toggle={() => this.staytoggle()}
                                        style = {{backgroundColor:'#3180E5'}}
                                        title = {'Stay Details'}
                                        inputbgStyle = {{backgroundColor:'#DAE7F7'}}
                                        iconname_1 = {'bed'}
                                        iconsize_1 = {getWidthnHeight(4.5).width}
                                        iconcolor_1 = {'white'}
                                        iconbgColor_1 = {{backgroundColor:'#F48D88'}}
                                        textboxplaceholder_1 = {'Stay Exp'}
                                        boxcontainerStyle_1 = {{backgroundColor:'#EB3A32'}}
                                        iconname_2 = {'hand-holding-usd'}
                                        iconsize_2 = {getWidthnHeight(4.5).width}
                                        iconcolor_2 = {'white'}
                                        iconbgColor_2 = {{backgroundColor:'#EAA74E'}}
                                        textboxplaceholder_2 = {'Food Exp'}
                                        boxcontainerStyle_2 = {{backgroundColor:'#E58E1B'}}
                                        textmarginleft = {[getMarginLeft(4.5)]}
                                        deleteItinerary = {(index) => this.stayDataSplice(index)}
                                        showSpinner={showSpinner}
                                    />
                                : 
                                    null
                                }
                                <View style={[styles.bigbox, {alignItems: 'center', justifyContent: 'space-evenly', zIndex: 1}, getWidthnHeight(90, 33)]}>
                                    <View style={[{flexDirection:'row'}, getMarginLeft(-1.5)]}>
                                        <DateSelector 
                                            containerStyle={[{
                                                borderColor: (submitStay && stayDateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitStay && stayDateError)? 'dashed' : 'solid', borderWidth: (submitStay && stayDateError)? 2 : 1,
                                                }, getWidthnHeight(42, 7), getMarginTop(1), getMarginLeft(2)]}
                                            //style={[(stayDate === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width} : {fontSize: 12, width: getWidthnHeight(35).width}]}
                                            style={[{borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width}]}
                                            date={this.state.stayDate}
                                            //clearDate={(stayDate === '')? false : true}
                                            //onPress={() => this.setState({stayDate: ''})}
                                            minDate={moment().toDate()}
                                            dateFont={{fontSize: (fontSizeH4().fontSize + 1)}}
                                            androidMode='default'
                                            mode='date'
                                            placeholder='From Date'
                                            format='DD-MM-YYYY'
                                            onDateChange={(date) => {
                                                const currentTimeStamp = moment().valueOf();
                                                const addTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A')
                                                const selectedTimeStamp = moment(`${date} ${addTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                                const date2AddTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A');
                                                let date2TimeStamp = moment(`${stayDate2} ${date2AddTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                                //console.log(selectedTimeStamp, date2TimeStamp, moment(selectedTimeStamp).format("DD-MM-YYYY"), moment(date2TimeStamp).format("DD-MM-YYYY"), Boolean(date2TimeStamp))
                                                this.setState({stayDate: date, stayDateError: false})
                                                if(selectedTimeStamp > date2TimeStamp && date2TimeStamp){
                                                    this.setState({stayDate2: '', stayDateError2: true})
                                                }
                                            }}
                                        />
                                        <DateSelector 
                                            containerStyle={[{
                                                borderColor: (submitStay && stayDateError2)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitStay && stayDateError2)? 'dashed' : 'solid', borderWidth: (submitStay && stayDateError2)? 2 : 1,
                                                }, getWidthnHeight(42, 7), getMarginTop(1), getMarginLeft(2)]}
                                            //style={[(stayDate2 === '')? {borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width} : {fontSize: 12, width: getWidthnHeight(35).width}]}
                                            style={[{borderWidth: 0, borderColor: 'green', width: getWidthnHeight(42).width}]}
                                            date={this.state.stayDate2}
                                            //clearDate={(stayDate === '')? false : true}
                                            //onPress={() => this.setState({stayDate: ''})}
                                            minDate={moment().toDate()}
                                            dateFont={{fontSize: (fontSizeH4().fontSize + 1)}}
                                            disabled={(stayDate)? false : true}
                                            androidMode='default'
                                            mode='date'
                                            placeholder='To Date'
                                            format='DD-MM-YYYY'
                                            onDateChange={(date) => {
                                                const currentTimeStamp = moment().valueOf();
                                                const addTime = moment(currentTimeStamp).add(2, 'seconds').format('hh:mm:ss A')
                                                const selectedTimeStamp = moment(`${date} ${addTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                                const date1AddTime = moment(currentTimeStamp).add(1, 'second').format('hh:mm:ss A');
                                                let date1TimeStamp = moment(`${stayDate} ${date1AddTime}`, "DD-MM-YYYY hh:mm:ss A").valueOf();
                                                console.log(date1TimeStamp, selectedTimeStamp, moment(date1TimeStamp).format("DD-MM-YYYY"), moment(selectedTimeStamp).format("DD-MM-YYYY"))
                                                if(date1TimeStamp > selectedTimeStamp){
                                                    this.setState({stayDate2: '', stayDateError2: true})
                                                    alert("This date should be greater/equal to FROM DATE")
                                                }else{
                                                    this.setState({stayDate2: date, stayDateError2: false})
                                                }
                                            }}
                                        />
                                    </View>  
                                    <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', ...Platform.select({ios: { zIndex: 1 }})}, getWidthnHeight(90)]}>
                                        <SearchableDropDown 
                                            placeholder="State"
                                            data={this.state.stateData}
                                            value={this.state.stateName}
                                            style={[{
                                                borderColor: (submitStay && stateError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitStay && stateError)? 'dashed' : 'solid', borderWidth: (submitStay && stateError)? 2 : 1,
                                            }, getMarginTop(1), getWidthnHeight(42, 7)]}
                                            searchStyle={[getWidthnHeight(34, 7)]}
                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                            iconSize={getWidthnHeight(8).width}
                                            onChangeText={(id, name, index, data) => {
                                                this.setState({
                                                    stateName: name, stateError: false, stateID: id, 
                                                    stayCityID: null, stayCityError: true, stayRate: '', stayRateError: true,
                                                    foodExpense: '', foodExpenseError: true, hotelAllowance: null, foodAllowance: null
                                                }, async () => {
                                                        console.log("STATE NAME: ", this.state.stateName)
                                                        await this.cities(this.state.stateID, 'stayState');
                                                        this.setState({stayCityName: ''})
                                                })
                                            }}
                                        />
                                        <SearchableDropDown 
                                            placeholder="City"
                                            data={this.state.stateWiseCity}
                                            value={this.state.stayCityName}
                                            disabled={(this.state.stateName)? false : true}
                                            style={[{
                                                borderColor: (submitStay && stayCityError)? 'red' : '#C4C4C4', justifyContent: 'center', borderRadius: 1,
                                                borderStyle: (submitStay && stayCityError)? 'dashed' : 'solid', borderWidth: (submitStay && stayCityError)? 2 : 1,
                                            }, getMarginTop(1), getWidthnHeight(42, 7)]}
                                            searchStyle={[getWidthnHeight(34, 7)]}
                                            dropDownSize={[getWidthnHeight(42, 20)]}
                                            textBoxSize={[getWidthnHeight(42, 4)]}
                                            iconSize={getWidthnHeight(8).width}
                                            onChangeText={(id, name, index, data) => {
                                                this.setState({
                                                    stayCityName: name, stayCityError: false, stayCityID: id,
                                                    stayRate: '', stayRateError: true, foodExpense: '', foodExpenseError: true, 
                                                    hotelAllowance: null, foodAllowance: null
                                                }, 
                                                    () => {
                                                        console.log("CITY NAME: ", this.state.stayCityName, this.state.stayCityID)
                                                        this.cityBand();
                                                    }
                                                )
                                            }}
                                        />
                                    </View>
                                    <View style={[{flexDirection:'row', justifyContent: 'space-evenly'}, getMarginTop(0.5), getWidthnHeight(90)]}>
                                        <View style={[getWidthnHeight(42, 7)]}>
                                            <CustomTextInput 
                                                placeholder={(hotelAllowance)? ` Per Night(max. ${hotelAllowance}) ` : ' Rate per night '}
                                                value={this.state.stayRate}
                                                prefillEnable={(editStay)? true : false}
                                                inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                onChangeText={(stayRate) => {
                                                    const number = stayRate.replace(/[^0-9]/g, '')
                                                    this.setState({stayRate: number.trim()}, () => {
                                                        const {stayRate, hotelAllowance} = this.state;
                                                        if(stayRate === ''){
                                                            this.setState({stayRateError: true})
                                                        }else if(stayRate > hotelAllowance){
                                                            this.setState({
                                                                enableAlert: true, alertTitle: `Your max Lodge Allowance is ${hotelAllowance}`, 
                                                                alertColor: false, stayRate: '', stayRateError: true
                                                            })
                                                        }else if(stayRate <= hotelAllowance){
                                                            this.setState({stayRateError: false})
                                                        }
                                                    })
                                                }}
                                                keyboardType = {'numeric'}
                                                editable={(hotelAllowance)? true : false}
                                                containerStyle={[{
                                                    borderColor: (submitStay && stayRateError)? 'red' : '#C4C4C4',
                                                    borderStyle: (submitStay && stayRateError)? 'dashed' : 'solid',
                                                    borderWidth: (submitStay && stayRateError)? 2 : 1, borderRadius: 1,
                                                    justifyContent: 'center', alignItems: 'center'
                                                }, getWidthnHeight(42, 7)]}
                                                textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(42)]}
                                                inactiveTitleColor='dimgrey'
                                                activeTitleColor={colorTitle}
                                            />
                                        </View>  
                                        <View style={[getWidthnHeight(42, 7)]}>
                                            <CustomTextInput 
                                                placeholder={(foodAllowance)? ` Food Exp(max. ${foodAllowance}) ` : ' Food Expense '}
                                                value={this.state.foodExpense}
                                                prefillEnable={(editStay)? true : false}
                                                inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                onChangeText={(foodExpense) => {
                                                    const number = foodExpense.replace(/[^0-9]/g, '')
                                                    this.setState({foodExpense: number.trim()}, () => {
                                                        const {foodExpense, foodAllowance} = this.state;
                                                        if(foodExpense === ''){
                                                            this.setState({foodExpenseError: true})
                                                        }else if(foodExpense > foodAllowance){
                                                            this.setState({
                                                                enableAlert: true, alertTitle: `Your max Food Allowance is ${foodAllowance}`, 
                                                                alertColor: false, foodExpense: '', foodExpenseError: true
                                                            })
                                                        }else if(foodExpense <= foodAllowance){
                                                            this.setState({foodExpenseError: false})
                                                        }
                                                    })
                                                }}
                                                keyboardType = {'numeric'}
                                                editable={(foodAllowance)? true : false}
                                                containerStyle={[{
                                                    borderColor: (submitStay && foodExpenseError)? 'red' : '#C4C4C4',
                                                    borderStyle: (submitStay && foodExpenseError)? 'dashed' : 'solid',
                                                    borderWidth: (submitStay && foodExpenseError)? 2 : 1, borderRadius: 1,
                                                    justifyContent: 'center', alignItems: 'center'
                                                }, getWidthnHeight(42, 7)]}
                                                textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(42)]}
                                                inactiveTitleColor='dimgrey'
                                                activeTitleColor={colorTitle}
                                            />
                                        </View> 
                                    </View>
                                    <View style={[{flexDirection: 'row'}, getMarginVertical(1.3), getWidthnHeight(90)]}>
                                        <View style={[{borderColor: 'red', borderWidth: 0}, getWidthnHeight(30)]}/>
                                        <Animated.View style={[{alignItems: 'center', justifyContent: 'center'}, (bounceStayButton)? animateButton : null]}>
                                            <TouchableOpacity 
                                                style={[{flexDirection:'row', justifyContent: 'center', }, getWidthnHeight(30)]}
                                                onPress={() => {
                                                    if(editStay){
                                                        this.saveStayChanges();
                                                    }else{
                                                        this.checkErrorsInStayForm();
                                                    }
                                                }} 
                                            >
                                                <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:10, borderBottomLeftRadius:10}, getWidthnHeight(4,5)]}/>
                                                <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4'}, getWidthnHeight(20,5)]}>
                                                    <Text style = {[{color:'white', fontWeight:"bold", fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{(editStay)? 'DONE' : 'ADD'}</Text>
                                                </View>
                                                <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:10, borderBottomRightRadius:10}, getWidthnHeight(4,5)]}/>
                                            </TouchableOpacity>
                                        </Animated.View>  
                                        <View style={[{borderColor: 'red', borderWidth: 0, alignItems: 'flex-end', justifyContent: 'center'}, getWidthnHeight(30)]}>
                                            <TouchableHighlight 
                                                style={[{
                                                    alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'black', 
                                                    width: getWidthnHeight(7).width, height: getWidthnHeight(7).width, backgroundColor: '#DBE8F8',
                                                    borderRadius: getWidthnHeight(7).width}, getMarginRight(4)]} 
                                                underlayColor="#3280E4"
                                                onPress={() => this.clearStay()}
                                            >
                                                    <AntdesignIcons name='delete' size={getWidthnHeight(4.5).width}/>
                                            </TouchableHighlight>
                                        </View>
                                    </View> 
                                </View>
                                </View>
                            :
                                null
                            }            
                            <View style={{borderWidth:0.3,borderColor:'#BABABA', marginTop:getMarginTop(1).marginTop, width:getWidthnHeight(90).width, marginLeft:getMarginLeft(5).marginLeft}}/>
                            {/* {<View>
                                <MySwitch
                                    title = 'Imprest Request*'
                                    value={this.state.switchImprest}
                                    onValueChange ={(switchImprest)=>this.setState({
                                        switchImprest, projectName: '', projectID: null, projectError: true,
                                        imprestAmount: '', imprestAmountError: true, remarks: '', remarksError: true
                                    },()=>console.log('switchValue:',switchImprest))}
                                    disabled={false}
                                /> 
                            </View>} */}
                            <View style={[{alignItems: 'center', zIndex: -1}, getMarginTop(2), getMarginBottom(1)]}>
                                <View style={[{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}, getWidthnHeight(90)]}>
                                    <Text style={[fontSizeH4()]}>Imprest Request*</Text>
                                    <Slider 
                                        activeColor={'#039FFD'} 
                                        //inactiveColor={'red'}
                                        // buttonColor={'red'}
                                        // buttonBorderColor={'blue'}
                                        value={this.state.switchImprest}
                                        onSlide={(switchImprest)=>this.setState({switchImprest},()=>console.log('switchValue:',switchImprest))}
                                        delay={500}
                                        //title={['Test', 'Live']}
                                    />
                                </View>
                            </View>
                            {(this.state.switchImprest)?
                                <View style = {[{alignItems:'center', justifyContent:'center'}]}>
                                    <View style ={[{flexDirection:'row'},getWidthnHeight(89)]}> 
                                        <View style={[{alignItems:'flex-start', marginTop:getMarginTop(2).marginTop}]}>
                                            <Text style={[{color:"#3280E4", fontWeight:'bold'}, styles.boldFont, fontSizeH4()]}>IMPREST DETAILS</Text>
                                        </View>
                                        <View style={[{borderColor: colorBase,}]}/>
                                    </View>
                                    <View style={{
                                        marginTop:'1%',
                                        width: wp(90),
                                        height:hp(18.75),
                                        backgroundColor: '#FFFFFF',
                                        borderWidth:1,
                                        borderColor: '#C4C4C4',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly'
                                    }}>
                                        <View style={[{flexDirection:'row', alignItems: 'center', justifyContent: 'space-evenly'}, getWidthnHeight(90, 7), getMarginTop(0)]}>
                                            <View>  
                                                <Dropdown
                                                    containerStyle={[{
                                                        borderColor: (switchImprest && save && projectError)? 'red' : '#C4C4C4', justifyContent: 'center',
                                                        borderStyle: (switchImprest && save && projectError)? 'dashed' : 'solid', 
                                                        borderWidth: (switchImprest && save && projectError)? 2 : 1, borderRadius: 1,
                                                    }, getWidthnHeight(42, 7)]}
                                                    maxLength = {20}
                                                    inputContainerStyle={[{borderBottomWidth:0, marginTop:4,alignSelf:'center'}, getWidthnHeight(40), getMarginLeft(1.5)]}
                                                    label={'Project & Remarks*'}
                                                    labelFontSize={fontSizeH4().fontSize - 2}
                                                    data={this.state.projects}
                                                    valueExtractor={({id})=> id}
                                                    labelExtractor={({name})=> name}
                                                    onChangeText={(projectID, index, data) => this.setState({projectName: data[index]['name'], projectID, projectError: false }, () => console.log("INDUSTRY: ", this.state.projectID, this.state.projectName))}
                                                    value={projectName}
                                                    baseColor = {(projectName)? colorTitle : 'grey'}
                                                    pickerStyle={[getMarginRight(0), getWidthnHeight(50), getMarginTop(10)]}
                                                    fontSize = {fontSizeH4().fontSize}
                                                />
                                            </View>  
                                            <View style={[getWidthnHeight(42, 7), getMarginTop(0)]}>
                                                <CustomTextInput 
                                                    placeholder=' Amount for imprest* '
                                                    value={this.state.imprestAmount}
                                                    prefillEnable={(this.props.data.approval.imprest)? true : false}
                                                    inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                    inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                    activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                    onChangeText={(value) => {
                                                        const number = value.replace(/[^0-9]/g, '')
                                                        this.setState({imprestAmount: number.trim()}, () => {
                                                            const {imprestAmount} = this.state;
                                                            if(imprestAmount === ''){
                                                                this.setState({imprestAmountError: true})
                                                            }else{
                                                                this.setState({imprestAmountError: false})
                                                            }
                                                        })
                                                    }}
                                                    keyboardType = {'numeric'}
                                                    containerStyle={[{
                                                        borderColor: (switchImprest && save && imprestAmountError)? 'red' : '#C4C4C4',
                                                        borderStyle: (switchImprest && save && imprestAmountError)? 'dashed' : 'solid',
                                                        borderWidth: (switchImprest && save && imprestAmountError)? 2 : 1, borderRadius: 1,
                                                        justifyContent: 'center', alignItems: 'center'
                                                    }, getWidthnHeight(42, 7)]}
                                                    textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(42)]}
                                                    inactiveTitleColor='dimgrey'
                                                    activeTitleColor={colorTitle}
                                                />
                                            </View>  
                                        </View>   
                                        <View>
                                            <CustomTextInput 
                                                placeholder=' Remarks '
                                                value={this.state.remarks}
                                                prefillEnable={(this.props.data.approval.imprest)? true : false}
                                                inactiveTitleFontSize={fontSizeH4().fontSize + 1}
                                                inactiveTitleHeight={getWidthnHeight(undefined, 3).height}
                                                activeTitleFontSize={fontSizeH4().fontSize - 3}
                                                onChangeText={(text) => {
                                                    this.setState({remarks: text.trimLeft()}, () => {
                                                        const {remarks} = this.state;
                                                        if(remarks === ''){
                                                            this.setState({remarksError: true})
                                                        }else{
                                                            this.setState({remarksError: false})
                                                        }
                                                    })
                                                }}
                                                containerStyle={[{
                                                    borderColor: (switchImprest && save && remarksError)? 'red' : '#C4C4C4',
                                                    borderStyle: (switchImprest && save && remarksError)? 'dashed' : 'solid',
                                                    borderWidth: (switchImprest && save && remarksError)? 2 : 1, borderRadius: 1,
                                                    justifyContent: 'center', alignItems: 'center'
                                                }, getWidthnHeight(86, 7)]}
                                                textInputStyle={[{borderColor: 'black', borderWidth: 0, fontSize: fontSizeH4().fontSize + 3}, getWidthnHeight(86)]}
                                                inactiveTitleColor='dimgrey'
                                                activeTitleColor={colorTitle}
                                            />
                                        </View>
                                    </View>
                                </View>
                            :
                                null
                            }         
                        </ScrollView>
                        <View style={{borderWidth: 1 ,borderColor:'rgba(0,0,0,0.10)', width:getWidthnHeight(100).width}}/>
                        <View style={[{alignItems: 'center', justifyContent: 'center', borderWidth: 0 ,borderColor:'black'}, getWidthnHeight(100, 7)]}>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => this.checkAllErrors()} style={[{flexDirection:'row', justifyContent: 'center', }]}>
                                    <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderRightWidth:2, borderRightColor:'white', borderTopLeftRadius:10, borderBottomLeftRadius:10}, getWidthnHeight(4,5)]}/>
                                    <View style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4'}, getWidthnHeight(20,5)]}>
                                        <Text style = {[{color:'white', fontWeight:"bold", fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>SAVE</Text>
                                    </View>
                                    <View style={[{justifyContent: 'center', alignItems: 'center', backgroundColor:'#3280E4',borderLeftWidth:2, borderLeftColor:'white', borderTopRightRadius:10, borderBottomRightRadius:10}, getWidthnHeight(4,5)]}/>
                                </TouchableOpacity>
                            </View>  
                        </View>
                        </KeyboardAvoidingView>
                        </View>
                            <View 
                                style={[{backgroundColor: (loading)? 'rgba(0, 0, 0, 0.5)' : 'transparent', borderTopLeftRadius:40,
                                borderTopRightRadius: 40}, StyleSheet.absoluteFill]} 
                                pointerEvents={(loading)? 'auto' : 'none'}
                            >
                                {(loading) ?
                                    <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(45, 10)]} color='rgb(19,111,232)'/>
                                : null}
                            </View>
                    </View>
                    {(this.state.enableAlert)?
                        <AlertBox 
                            title={this.state.alertTitle}
                            visible={this.state.enableAlert}
                            onDecline={() => this.setState({enableAlert: false})}
                            titleStyle={{color: 'black'}}
                            color={this.state.alertColor}
                        />
                    :
                        null
                    }
                    {(this.state.apiError)?
                        <AlertBox 
                            title={'Something went wrong'}
                            subtitle={`Error Code: ${errorCode}${apiCode}`}
                            visible={this.state.apiError}
                            onDecline={() => this.setState({apiError: false})}
                            titleStyle={{color: 'black'}}
                            color={false}
                        />
                        :
                        null
                    }
                </View>
            )
        }
    }

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
            flex: 1
        },
        MainContainer:{
            flex: 1,
            alignItems: 'center',
            backgroundColor:'white',
            borderTopLeftRadius:40,
            borderTopRightRadius:40,
            ...Platform.select({
                ios: {
                    shadowColor: 'black',
                    shadowOffset: {
                        width: 0,
                        height: 50,
                    },
                    zIndex: 10
                },
                android: {
                elevation: 15,
                }
            }),
            shadowOpacity: 0.3,
            shadowRadius: 40,
            borderColor: 'blue',
            borderWidth: 0
        },
        avatarContainer: {
            borderColor: '#9B9B9B',
            borderWidth: 1 / PixelRatio.get(),
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatar: {
            borderRadius: 75,
            width: 150,
            height: 150,
        },
        Dropbox:{
            borderWidth: 1,
            left:0,
            width:getWidthnHeight(42).width,
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            borderColor: '#C4C4C4',
            marginLeft:'2%',
            marginTop:getMarginTop(1.5).marginTop
        },
        InputBox:{
            borderWidth: 1,
            left:0,
            width:getWidthnHeight(42).width,
            height:52,
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            borderColor: '#C4C4C4',
            marginLeft:'2%',
            marginTop:getMarginTop(1.5).marginTop
        },
        bigbox:{
            marginTop:'1%',
            backgroundColor: '#FFFFFF',
            borderWidth:1,
            borderColor: '#C4C4C4',
        },
        box:{
            borderWidth:1,
            borderColor: '#C4C4C4',
        },
        switchcontainer: {      
            flexDirection:'row',
            marginTop:getMarginTop(1).marginTop
        },  
        textStyle:{  
            fontSize: fontSize_H3().fontSize,  
            textAlign: 'left',  
            color: '#344953'    
        },
        boldFont: {
            ...Platform.select(
            {
                android: {
                    fontFamily: ''
                }
            }
            )
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
            borderWidth: 0
        },
        loader: {
            ...Platform.select({
                ios: {
                zIndex: 1,
                }
            })
        }
    });
