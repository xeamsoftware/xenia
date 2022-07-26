import * as React from 'react';
import {
      LayoutAnimation, StyleSheet, View, Easing, Image,
      Text, ScrollView, UIManager, TouchableOpacity,
      Platform, FlatList, Alert, Animated,
    } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {ActionConst, Actions} from 'react-native-router-flux'; 
import { ListItem, Avatar } from 'react-native-elements'
import Gradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import {extractBaseURL, drawerMenuWidth} from './api/BaseURL';
import {
    getWidthnHeight, CommonModal, IOS_StatusBar, fontSizeH4, getMarginRight, getMarginLeft, getMarginTop, getMarginVertical,
    Spinner, GradientIcon
} from './KulbirComponents/common';
import { showGame } from './actions/index';

const EWF = "Elite Workforce";
const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);
var CustomAnimation = {
    // duration: 300,
    // create: {
    //     type: LayoutAnimation.Types.linear,
    //     property: LayoutAnimation.Properties.scaleXY,
    //     springDamping: 0
    // }
}

class DrawerMenu extends React.Component {
    //Main View defined under this Class
    constructor() {
        super();
        if (Platform.OS === 'android') {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = {
            listDataSource:[],
            permissions:[],
            abc:[],
            rendum_value:'',
            layoutValue:0,
            h: 0, 
            counter:0,
            emp:'4545345',
            emp_two:'873737388',
            data:[],
            project: null,
            token: null,
            show: 'false',
            baseURL: null,
            dimensions: undefined,
            selectedID: null,
            errorCode: null,
            apiCode: null,
            commonModal: false,
            projectType: null,
            touchCount: 0,
            animation: new Animated.Value(0),
            loading: false,
            animateSubCategory: new Animated.Value(0),
            hourHand: '',
            date: '',
            day: ''
        };
    }
   

    updateLayout = async(index, categories) => {
        console.log("PAYLOAD: ", index)
        if(index === categories[index]['id']){
            console.log("Selected: ", categories[index]['category_name'])
            this.setState({selectedID: categories[index]['id']})
        }
    };
   
    permission(){
        if(this.state.permissions==="apply-leave"){
            this.setState({abc:this.state.listDataSource})
        }if(this.state.permissions==="approve-leave"){
            this.setState({abc:this.state.listDataSource_sec})
        }
    }

    showLoader(){
        this.setState({loading: true})
    }

    hideLoader(){
        this.setState({loading: false})
    }

    value = async () => {
        //console.log("Value function")
        this.showLoader();
        const _this = this;
        const {baseURL} = this.state;
        var value = await AsyncStorage.getItem('userObj');
        var userObj = JSON.parse(value);
        if(userObj!==null){
            var tag_value = userObj.success.user;
            //console.log("tag_value",tag_value)
            var permission_value = userObj.success.user.permissions;
            var token = userObj.success.secret_token;
            permission_value.map((item) => {
                this.setState({rendum_value:item})
            })
        }else(userObj===null)
      
        if(userObj!==null){
            var profile_picture={uri:userObj.success.user.employee.profile_picture};
            this.setState({image:profile_picture});
            console.log("IMAGE HERE: ", profile_picture, this.state.token)
        }else(userObj===null)
        const context=this;  
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState !== 4) {
                return;
            }
            if(xhr.status === 200){
                _this.hideLoader();
                var json_obj = JSON.parse(xhr.responseText)
                // console.log("@@@ ### THIS IS IT: ", json_obj.data);
                var listDataSource = json_obj.data;
                if(_this.state.projectType === "Aarti Drugs Ltd"){
                    listDataSource.push(HOLIDAYS, SALARYSLIP)
                }
                // else{
                //     listDataSource.push(TestScreen);
                // }
                let checkGames = [];
                checkGames = listDataSource.filter((item) => {
                    return (item.category_name === 'Games')
                })
                //console.log("@@@ ### THIS IS IT: ", checkGames);
                if(checkGames.length > 0){
                    this.props.showGame(true);
                }else if(checkGames.length === 0){
                    this.props.showGame(false);
                }
                {/*KULBIR*/}
                //listDataSource.push(TestScreen)
                //listDataSource.push(SALARYSLIP, HOLIDAYS)
                context.setState({listDataSource: listDataSource, show: true})
            }else {
                _this.hideLoader();
                console.log('@@@Error: ', xhr.status)
                _this.setState({errorCode: xhr.status})
                _this.setState({apiCode: "001"})
                _this.setState({commonModal: true})
                //Alert.alert("Error Occured");
            }
        });
        xhr.open("GET", `${baseURL}/side-menu`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send();
    }

    onDecline(){
        this.setState({commonModal: false})
    }
    
    time(){
        var date = moment().date(); //Current Date
        var month = moment().month() + 1; //Current Month
        var year = moment().year(); //Current Year
        this.setState({
            date: `${date}/${month}/${year}`,
        });
    }

    wish(){
        const {hourHand} = this.state;
        if (hourHand >= 0 && hourHand < 12){
            this.setState({wish: "Good Morning"})
        }else if (hourHand >= 12 && hourHand < 16){
            this.setState({wish: "Good Afternoon"})
        }else {
            this.setState({wish: "Good Evening"})
        }
    }

    refresh(){
        //this.dawer().done();
        this.value(); 
    }

    async componentDidMount(){
        // this.dawer();
        this.setState({selectedID: null}, () => this.animateText())
        const drawerProps = JSON.parse(this.props.drawerProps) 
        this.setState({projectType: drawerProps.success.project})
        await extractBaseURL().then((baseURL) => {
            this.setState({baseURL}, () => {
                // console.log("EXTRACT LINK: ", this.state.baseURL)
                this.value();
            })
        })
        const {navigation} = this.props;
        //console.log("^^^ ### DRAWER OPENED", this.props.navigation.state.isDrawerOpen)
        const getTime = moment().format('H');
        this.setState({hourHand: getTime, day: moment().format("dddd")}, () => {
            this.wish();
            this.time();
        })
        this.setState({show: false})
    }
    
    // UNSAFE_componentWillUpdate(){
    //     LayoutAnimation.configureNext(CustomAnimation)
    // }

    animateText(){
        const {animation} = this.state;
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 6000,
                easing: Easing.ease
            })
        ).start()
    }

    showHideSubCategory(show = true){
        const {animateSubCategory} = this.state;
        if(show){
            animateSubCategory.setValue(0);
        }
        Animated.timing(animateSubCategory, {
            toValue: (show)? 1 : 0,
            duration: (show)? 400 : 200,
            easing: Easing.ease
        }).start(({finished}) => {
            if(finished){
                if(!show){
                    this.setState({selectedID: null})
                }
            }
        })
    }
   
    render() {
        // const extractProps = {...this.props.navigation.state.routes[0]};
        // const unParsedProps = extractProps.routes[0]['params'].drawerProps.userObj;
        const unParsedProps = this.props.drawerProps;
        const drawerProps = JSON.parse(unParsedProps);
        //console.log("###### DRAWER PROPS: ", drawerProps.success.user.employee.fullname)
        const empName = drawerProps.success.user.employee.fullname;
        const projectName = drawerProps.success.project
        const {errorCode, apiCode, animation, selectedID, loading, day, date} = this.state;
        let refreshButtonSize = {width: drawerMenuWidth.width / 5};
        const pic=this.state.image;
        let newlistDataSource = [];
        if(this.state.show){
            newlistDataSource = this.state.listDataSource.map((item) => (
                item.category_name === "Attendance Management"? {...item, image:require('../src/Image/atten.png')} : item
                &&
                item.category_name === "Leaves Management"? {...item, image:require('../src/Image/leave32.png')} : item
                &&
                item.category_name === "Task Management"? {...item, image:require('../src/Image/task_2.png')} : item
                &&
                item.category_name === "Target"? {...item, image:require('../src/Image/target.png')} : item
                &&
                item.category_name === "Lead Management"? {...item, image:require('../src/Image/lead.png')} : item
                &&
                item.category_name === "Location Tracker"? {...item, image:require('../src/Image/location32.png')} : item
                &&
                item.category_name === "Holidays"? {...item, image:require('../src/Image/tent.png')} : item
                &&
                item.category_name === "Salary Slip"? {...item, image:require('../src/Image/salary.png')} : item
                &&
                item.category_name === "Travel Management"? {...item, image:require('../src/Image/globe.png')} : item
                &&
                item.category_name === "Coupon Management"? {...item, image: CouponScreen.image} : item
                &&
                item.category_name === "Stationary Management"? {...item, image: stationary.image} : item
                &&
                item.category_name === "Games"? {...item, image: games.image} : item
            ))
            const displayCategories = newlistDataSource;
            newlistDataSource = displayCategories.map((category, index) => {
                return {...category, id: index}
            })
            //console.log("DRAWER CONTENT: ", newlistDataSource)
        }
        let background = {backgroundColor:'rgb(19,111,232)'};
        let gradient = {backgroundColor: 'rgb(19,111,232)'};
        let textColor = {color: 'rgb(19,111,232)'};
        let buttonColor = ['#0E57CF', '#25A2F9'];
        let COLOR1 = "#039FFD";
        let COLOR2 = "#EA304F"; 
        const animatedStyle = {
            transform: [{
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [getWidthnHeight(56).width, getWidthnHeight(-56).width]
                })
            }]
        }
        return (
            <View style={{flex: 1}}>
                <View>
                    <IOS_StatusBar color={[COLOR1, COLOR2]} barStyle="light-content"/>
                    <Gradient 
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        colors={[COLOR1, COLOR2]}
                        style={[drawerMenuWidth]}>
                        <ListItem containerStyle={{backgroundColor: 'transparent'}}>
                            <Avatar 
                                imageProps={{resizeMode: "cover"}} 
                                source={pic} 
                                containerStyle={{width: getWidthnHeight(20).width, height: getWidthnHeight(20).width}} 
                                avatarStyle={{borderRadius: getWidthnHeight(10).width}}
                            />
                            <ListItem.Content>
                                <ListItem.Title style={[{color: 'white', fontWeight: 'bold', fontSize: fontSizeH4().fontSize + 1}, styles.boldFont]}>{this.state.wish}</ListItem.Title>
                                <ListItem.Subtitle style={{color: 'white', fontSize: fontSizeH4().fontSize}}>{empName.toUpperCase()}</ListItem.Subtitle>
                                <ListItem.Subtitle style={{color: 'white', fontSize: fontSizeH4().fontSize}}>{day}, {date}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>

                        <View style={[{borderColor: 'black', borderWidth: 0, marginBottom: 5,justifyContent: 'space-evenly',flexDirection: 'row', alignItems: 'center'}]}>
                            <View style={{flex: 1, borderColor: 'white', borderWidth: 0, alignItems: 'center', overflow: 'hidden'}}>
                                <Animated.Text style={[{color:'white', fontSize: fontSizeH4().fontSize - 1}, animatedStyle]}>
                                    Click Refresh, to reload Drawer Menu
                                </Animated.Text>
                            </View>
                            <View style={[{backgroundColor: '#F1F1F1', borderRadius: 10}, getMarginRight(2), refreshButtonSize]}>
                                <TouchableOpacity onPress={()=>this.refresh()}>
                                    <Text style={{textAlign: 'center', marginLeft: 0, fontSize: fontSizeH4().fontSize - 1}}>Refresh</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Gradient>
                </View>

                {/* DRAWER MENU */}
                {(!this.props.disableDrawer) &&
                    <View style={[{borderColor: 'red', borderWidth: 0, flex: 1}]}>
                        <View style={{flex: 1, borderColor: 'cyan', borderWidth: 0}}>
                            <ScrollView>
                            <View style={{justifyContent: 'center', borderBottomColor: '#C4C4C4', borderBottomWidth: 0.5}}>
                                <TouchableOpacity 
                                    style={[{justifyContent: 'center', flex: 1, borderWidth: 0, borderColor: 'red', paddingVertical: getMarginTop(2.2).marginTop}, getWidthnHeight(80)]}
                                    onPress={() => {
                                        this.setState({selectedID: null}, () => {
                                            if(Actions.currentScene !== 'First'){
                                                Actions.popTo('First');
                                            }else {
                                                Actions.drawerClose();
                                            }
                                        })
                                    }}
                                >
                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginLeft(5), getMarginTop(0)]}>
                                        <Image style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} resizeMode="contain" source={require('../src/Image/home.png')} />
                                        <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 1)}, styles.boldFont, textColor, getMarginLeft(5)]}>Home</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                {/* {newlistDataSource.map((item, key) => (
                                    <ExpandableItemComponent
                                        key={key}
                                        item={item}
                                        onClick={this.updateLayout.bind(this, key, newlistDataSource)}
                                        textColor={textColor}
                                        employer={projectName}
                                        selectedID={this.state.selectedID}
                                        drawerWidth={drawerWidth}
                                        navigation={this.props.navigation}
                                    />
                                ))} */}
                                <FlatList 
                                    data={newlistDataSource}
                                    keyExtractor={(item) => `${item.id}`}
                                    renderItem={({item}) => {
                                        //console.log("### ALL DATA: ", item)
                                        const {animateSubCategory} = this.state;
                                        const animatedStyle = {
                                            transform: [
                                                {
                                                    translateX: animateSubCategory.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [getMarginLeft(-50).marginLeft, 0]
                                                    })
                                                }
                                            ]
                                        }
                                        return (
                                            <View>
                                                {(selectedID !== item.id)?
                                                    <View style={{justifyContent: 'center', borderBottomColor: '#C4C4C4', borderBottomWidth: 0.5}}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.7}
                                                            style={[{justifyContent: 'center', flex: 1, borderWidth: 0, borderColor: 'red', paddingVertical: getMarginTop(2.2).marginTop}, getWidthnHeight(80)]}
                                                            onPress={() => {
                                                                if(item.category_name === 'Salary Slip' && item.subcategory[0]['type'] === 'SalarySlipXM'){
                                                                    this.setState({selectedID: null}, () => {
                                                                        if(Actions.currentScene === 'SalarySlipXM'){
                                                                            Actions.drawerClose();
                                                                        }else{
                                                                            Actions.SalarySlipXM({projectName})
                                                                        }
                                                                    })
                                                                    return;
                                                                }
                                                                this.setState({selectedID: item.id}, () => {
                                                                    this.showHideSubCategory(true)
                                                                })
                                                            }}
                                                        >
                                                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginLeft(5)]}>
                                                                {(item.category_name === 'Coupon Management' || item.category_name === 'Stationary Management' || item.category_name === 'Games')?
                                                                    <View style={{borderColor: 'red', borderWidth: 0}}>
                                                                        {item.image}
                                                                    </View>
                                                                : 
                                                                    <Image style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} resizeMode="contain" source={item.image} />
                                                                }
                                                                <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 1)}, styles.boldFont, textColor, getMarginLeft(5)]}>{item.category_name}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                :
                                                    <View style={{justifyContent: 'center', borderBottomColor: '#C4C4C4', borderBottomWidth: 0.5}}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.7}
                                                            style={[{justifyContent: 'center', flex: 1, borderWidth: 0, borderColor: 'red', paddingVertical: getMarginTop(2.2).marginTop}, getWidthnHeight(80)]}
                                                            onPress={() => this.showHideSubCategory(false)}>
                                                            <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginLeft(5)]}>
                                                                {(item.category_name === 'Coupon Management' || item.category_name === 'Stationary Management' || item.category_name === 'Games')?
                                                                    <View style={{borderColor: 'red', borderWidth: 0}}>
                                                                        {item.image}
                                                                    </View>
                                                                :
                                                                    <Image style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} resizeMode="contain" source={item.image} />
                                                                }
                                                                <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 1)}, styles.boldFont, textColor, getMarginLeft(5)]}>{item.category_name}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <View style={{overflow: 'hidden'}}>
                                                            <View style={[]}>
                                                                {item.subcategory.map((screen) => {
                                                                    return (
                                                                        <View style={{flexDirection: 'row'}}>
                                                                            <View style={[getWidthnHeight(15)]}/>
                                                                            <View style={{overflow: 'hidden', flex: 1}}>
                                                                                <AnimateTouch 
                                                                                    style={[{borderColor: 'cyan', borderWidth: 0, flex: 1}, animatedStyle]}
                                                                                    onPress={() => {
                                                                                        console.log("OPEN SCREEN: ", screen.type)
                                                                                        if(Actions.currentScene !== screen.type){
                                                                                            if(screen.type === "ApplyForLeave" && projectName === EWF){
                                                                                                Actions.applyLeaveEWF({projectName})
                                                                                            }else if(screen.type === "AppliedLeaves" && projectName === EWF){
                                                                                                Actions.appliedLeaveEWF({projectName})
                                                                                            }else{
                                                                                                Actions[screen.type]({projectName});
                                                                                            }
                                                                                        }else {
                                                                                            Actions.drawerClose();
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <View style={[{
                                                                                        flexDirection: 'row', alignItems: 'center', borderWidth: 0, borderColor: 'blue',
                                                                                        paddingBottom: getMarginTop(2.5).marginTop
                                                                                    }]}>
                                                                                        <View style={[{
                                                                                            borderColor: '#000000', borderWidth: getWidthnHeight(0.5).width, borderRadius: getWidthnHeight(3).width, 
                                                                                            width: getWidthnHeight(2.5).width, height: getWidthnHeight(2.5).width
                                                                                        }]}/>
                                                                                        <Text style={[fontSizeH4(), getMarginLeft(3)]}>{screen.val}</Text>
                                                                                    </View>
                                                                                </AnimateTouch>
                                                                            </View>
                                                                        </View>
                                                                    );
                                                                })
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                }
                                            </View>
                                        );
                                    }}
                                />
                            </View>  
                            <View style={{justifyContent: 'center', borderBottomColor: '#C4C4C4', borderBottomWidth: 0.5}}>
                                <TouchableOpacity
                                    style={[{
                                        justifyContent: 'center', flex: 1, borderWidth: 0, borderColor: 'red', 
                                        paddingVertical: getMarginTop(2.2).marginTop}, getWidthnHeight(80)
                                    ]}
                                    onPress={() => {
                                        this.setState({selectedID: null}, () => Actions.LogOutPage({user: projectName, button: gradient}))
                                    }}>
                                    <View style={[{flexDirection: 'row', alignItems: 'center'}, getMarginLeft(5), getMarginTop(0)]}>
                                        <Image style={{width: getWidthnHeight(5.5).width, height: getWidthnHeight(5.5).width}} resizeMode="contain" source={require('../src/Image/log_out.png')} />
                                        <Text style={[{fontWeight: 'bold', fontSize: (fontSizeH4().fontSize + 1)}, styles.boldFont, textColor, getMarginLeft(5)]}>Log Out</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{alignItems: 'center', marginTop: 0}}>                               
                                <Text style={{fontSize: fontSizeH4().fontSize - 3, textAlign:'center'}}>XEAM Ventures Pvt. Ltd.</Text>
                            </View>
                            </ScrollView>
                        </View>
                        <View 
                            style={[{
                                backgroundColor: (loading)? 'rgba(254, 208, 73, 0.3)' : 'transparent', borderTopLeftRadius:0,
                                borderTopRightRadius: 0}, StyleSheet.absoluteFill
                            ]} 
                            pointerEvents={(loading)? 'auto' : 'none'}
                        >
                            {(loading) && 
                                <Spinner loading={loading} style={[styles.loadingStyle, getWidthnHeight(40, 8)]} color='rgb(19,111,232)'/>
                            }
                        </View>
                    </View>
                }
                <CommonModal 
                    title="Something went wrong"
                    subtitle= {`Error Code: ${errorCode}${apiCode}`}
                    visible={this.state.commonModal}
                    onDecline={this.onDecline.bind(this)}
                    buttonColor={buttonColor}
                />
            </View>
        );
    }
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
    },
    topHeading: {
        paddingLeft: 10,
        fontSize: 20,
    },
    header: {
        padding: 0,
    },
    headerText: {
        fontSize: 13,
        fontWeight: 'bold',
        color:'rgb(19,111,232)',
    },
    separator: {
        height: 0.5,
        backgroundColor: '#808080',
        width: '95%',
        marginLeft: 16,
        marginRight: 16,
    },
    text: {
        fontSize: 13,
        color: 'black',
        padding: 5,
    },
    content: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
    },
    boldFont: {
        ...Platform.select({
        android: {
            fontFamily: ''
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
        borderWidth: 0
    },
});

const mapStateToProps = (state) => {
    //console.log("***Drawer***MAP STATE TO PROPS: ", state.enableDrawer.drawer, state.props)
    return {
        disableDrawer: state.enableDrawer.drawer,
        drawerProps: state.props.userObj
    }
}

export default connect(mapStateToProps, { showGame })(DrawerMenu);

  //Dummy content to show
  //You can also use dynamic data by calling webservice
const CouponScreen = {
    category_name: 'Coupon Management',
    image:  <GradientIcon
                start={{x: 0.3, y: 0}}
                end={{x: 0.7, y: 0}}
                containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(5.5)]}
                icon={<MaterialIcons name={'receipt'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(5.5).width}/>}
                colors={["#FF6A4D", "#FF3333"]}
            />
    ,
    subcategory: [
        {id: 1, type: 'issueNewBook', val: 'Issue New Book'},
        {id: 2, type: 'serialNumber', val: 'Serial Number'},
        {id: 3, type: 'soldCoupons', val: 'Sold Coupons'},
    ]
}
const stationary = {
    id: 2,
    category_name: 'Stationary Management',
    image: (
        <GradientIcon
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(6)]}
            icon={<MaterialCommunityIcons name={'newspaper'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(6).width}/>}
            colors={["#184D47", "#29BB89"]}
        />
    ),
    subcategory: [
        {id: '1', type: 'consumedPaper', val: 'Consumed Paper'},
        {id: '2', type: 'addPaperConsumption', val: 'Add Paper Consumption'}
    ]
}
const CONTENT = 
    {
        isExpanded: false,
        category_name: ' Lead Management',
        image:require('../src/Image/lead.png'),
        subcategory: [{ id: 1, val: 'Create New Lead',type:'CreateNewLead' },{ id: 1, val: 'Created Leads',type:'CreatedLeads' },{ id: 1, val: 'List of Leads',type:'ListOfLeads' },{ id: 1, val: 'Assigned Leads',type:'AssignedLeads' },{ id: 1, val: 'Unassigned Leads',type:'UnassignedLeads' },{ id: 1, val: 'Recommended Lead',type:'RecommendedLead' }], 
    }

const TRAVEL = 
    {
        category_name: 'Manage Travel',
        image:require('../src/Image/lead.png'),
        subcategory: [{val: 'Pre Approval Form',type:'PreApprovalForm' },{val: 'Travel Approvals',type:'TravelApprovals' },{val: 'Claim Requests',type:'ClaimRequests' },{val: 'Imprest Requests',type:'ImprestRequests' }], 
    }
    
const HOLIDAYS = {
    category_name: 'Holidays',
    image: require('../src/Image/tent.png'),
    subcategory: [{ permission: "", val: 'Holidays List', type: 'HolidaysList'}],
}

const SALARYSLIP = {
    category_name: 'Salary Slip',
    image: require('../src/Image/salary.png'),
    subcategory: [{ permission: "", val: 'Salary Slip', type: 'SalarySlip'}],
}

const games = {
    category_name: 'Games',
    image: (
        <GradientIcon
            start={{x: 0.3, y: 0}}
            end={{x: 0.7, y: 0}}
            containerStyle={[{borderWidth: 0, borderColor: 'red', alignItems: 'center'}, getWidthnHeight(6)]}
            icon={<IonIcons name={'game-controller'} style={{backgroundColor: 'transparent'}} size={getWidthnHeight(6).width}/>}
            colors={["#084594", "#1572A1"]}
        />
    ),
    subcategory: [{ val: 'Tic-Tac-Toe', type: 'tictactoe'}],
}

const SALARYSLIPXM = {
    category_name: 'Salary Slip',
    image: require('../src/Image/salary.png'),
    subcategory: [{ permission: "", val: 'Salary Slip', type: 'SalarySlipXM'}],
}

const CONTENT_SEC = {
    isExpanded: false,
    category_name: 'My Targets',
    image: require('../src/Image/target.png'),
    subcategory: [{ permission: "", val: 'Create Target', type: 'CreateTarget'}, { permission: "", val: 'Achieved Target', type: 'AchievedTarget'}, { permission: "", val: 'My Report', type: 'ReportLog'}, { permission: "", val: 'Team Report', type: 'TeamReport'}],
}

const LocationTracker = {
    isExpanded: false,
    category_name: 'Location Tracker',
    image: require('../src/Image/location32.png'),
    subcategory: [{ id: 1, val: 'Location Tracker', type: 'LocationTracker'}, { id: 1, val: 'Saved Locations', type: 'SavedLocations'}, { id: 1, val: 'Admin Tracker', type: 'AdminTracker'}],
}

const TestScreen = {
    isExpanded: false,
    category_name: 'Test Screen',
    image: require('../src/Image/test.png'),
    subcategory: [
        { id: '1', val: 'Apply Leave', type: 'applyLeaveEWF'}, 
        { id: '2', val: 'Applied Leaves', type: 'appliedLeaveEWF'}, 
        { id: '3', val: 'HTML View', type: 'HTMLView'}, 
        { id: '4', val: 'Login Test Page', type: 'LoginTestPage'}, 
        { id: '5', val: 'Swipe Test', type: 'SwipeTest'},
        { id: '6', val: 'Test TextInput', type: 'TestInputText'}
    ]
}
