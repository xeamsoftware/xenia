import React from 'react';
import {
    StyleSheet, Text, TouchableOpacity,
    View, ScrollView, FlatList,
    TouchableHighlight, TextInput,
    KeyboardAvoidingView, Animated, Platform
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Dropdown } from 'react-native-material-dropdown';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import {
    CommonModal, IOS_StatusBar, getMarginTop, getMarginBottom, getWidthnHeight,fontSizeH4,
    FloatingTitleTextInputField, getMarginVertical, DateSelector, WaveHeader, fontSizeH3, ItineraryModal,
    TimePicker, RoundButton, RadioEnable, RadioDisable, AlertBox, DismissKeyboard, getMarginLeft, Date, MySwitch, getMarginRight
} from '../KulbirComponents/common';
const AnimateTextInput = Animated.createAnimatedComponent(TextInput);
const AnimateTouch = Animated.createAnimatedComponent(TouchableOpacity);

export default class Travel_Approvals extends React.Component {

    constructor() {
        super();
        this.state = {
            searchtext:'',
            status:'',
            placeholder:'Search here',
            show: true,
            showbox: true,
            showsubmitbtn:false,
            opid:'',
            opacity:1,
            backstatus:'',
            full:true,
            DATA : [
                {
                    id: '01',
                    from:'Travel Purpose',
                    travelcode:'200700002',
                    status:'Approved',
                    to:'To',
                    title: 'First Item',
                    name:'Name',
                    show:false,
                    swbtn:true,
                    swipe:true
                },
                {
                    id: '02',
                    from:'Travel Purpose',
                    travelcode:'200700002',
                    status:'Paid',
                    to:'To',
                    title: 'Second Item',
                    name:'Name',
                    show:false,
                    swbtn:true,
                    swipe:true
                },
                {
                    id: '03',
                    from:'Travel Purpose',
                    travelcode:'200700002',
                    status:'New',
                    to:'To',
                    title: 'Third Item',
                    name:'Name',
                    show:false,
                    swipe:true,
                    swbtn:true,
                },
                {
                    id: '04',
                    from:'Travel Purpose',
                    travelcode:'200700002',
                    status:'New',
                    to:'To',
                    title: 'First Item',
                    name:'Name',
                    show:false,
                    swbtn:true,
                    swipe:true
                },
                {
                    id: '05',
                    from:'Travel Purpose',
                    travelcode:'200700002',
                    status:'Back',
                    to:'To',
                    title: 'Second Item',
                    name:'Name',
                    show:false,
                    swbtn:true,
                    swipe:true
                },
                {
                    id: '06',
                    from:'Travel Purpose',
                    travelcode:'200700002',
                    status:'New',
                    to:'To',
                    title: 'Third Item',
                    name:'Name',
                    show:false,
                    swbtn:true,
                    swipe:true
                },
            ],
            animatedWidth: new Animated.Value(0),
            animatedHeight: new Animated.Value(0),
            iconalign: new Animated.Value(0),
            animateOpacity: new Animated.Value(1),
            animateTextInputWidth: new Animated.Value(0),
            animateTextInputHeight: new Animated.Value(0),
            animatedlistHeight: new Animated.Value(0),
            animatedlistWidth: new Animated.Value(0),
            animateCommentWidth: new Animated.Value(0),
            animateSubmitButton: new Animated.Value(0),
            animateBoxOpacity: new Animated.Value(0)
        };
        this.arrayholder = this.state.DATA;
    }
 

      // componentWillMount = () => {
      //     this.borderanimated = new Animated.Value(0)
      //     this.iconmargintop = new Animated.Value(0)
      //     this.animation = new Animated.Value(0)
      //     this.animatedlistHeight = new Animated.Value(0)
      //     this.animatedlistWidth = new Animated.Value(0)
      //     this.animatedswipWidth = new Animated.Value(10)
      //     this.animatedopacity = new Animated.Value(1)
      //     this.animatedmargin = new Animated.Value(100)
      //     this.animatedcommentWidth = new Animated.Value(0)
      //     this.animatedcommentHeight = new Animated.Value(0)
      //     this.bordercommentanimated = new Animated.Value(0)
      //  }
 
    /* To Animate Open Search Bar On click*/
    /******/
    animatedBox = () => {
        this.setState({show:false}, () => {
            const {animatedHeight, animatedWidth, iconalign, animateOpacity, animateTextInputWidth, animateTextInputHeight} = this.state;
            Animated.timing(animatedWidth, {
                toValue: getWidthnHeight(85).width,
                duration: 700
            }).start()
            Animated.timing(animatedHeight, {
                toValue: getWidthnHeight(undefined, 5).height,
                duration: 10
            }).start()
            Animated.timing(animateTextInputWidth, {
                toValue: getWidthnHeight(65).width,
                duration: 700
            }).start()
            Animated.timing(animateTextInputHeight, {
                toValue: getWidthnHeight(undefined, 4.8).height,
                duration: 10
            }).start()
            Animated.timing(animateOpacity, {
                toValue: 1,
                duration: 30
            }).start()
            Animated.timing(iconalign, {
                toValue: getMarginLeft(0).marginLeft,
                duration: 700
            }).start()
        })
    }
    /******/

    /* To Animate Open Status Box On click*/
    /******/

    animatedlistbox =(status, id)=>{
        this.setState({
            backstatus:status, showsubmitbtn:true
            }, () => {
                this.state.DATA.forEach(element => {
                if(element.id === id && element.swipe === true){
                element.show = true
                this.setState({opid:selectedid, showbox: false}, () => this.listbox())
                }
            });
        })
    }

    listbox =()=>{
        const {animatedlistWidth, animateCommentWidth, animateSubmitButton, animateBoxOpacity} = this.state;
        console.log("@@@ ENTERED LISTBOX")
        Animated.parallel([
            Animated.timing(animatedlistWidth, {
                toValue: 1,
                duration: 800
            }),
            Animated.timing(animateCommentWidth, {
                toValue: 1,
                duration: 800
            }),
            Animated.timing(animateSubmitButton, {
              toValue: 1,
              duration: 300
            }),
            Animated.timing(animateBoxOpacity, {
              toValue: 1,
              duration: 50
            })
        ]).start()
    }

    /******/

    /* To Animate Hide Search Box On click*/
    /******/
    hideshow=()=>{
        const {animatedHeight, animatedWidth, iconalign, animateOpacity, animateTextInputWidth, animateTextInputHeight} = this.state;
        Animated.timing(animatedWidth, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animatedHeight, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animateTextInputWidth, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animateTextInputHeight, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(animateOpacity, {
            toValue: 0,
            duration: 300
        }).start()
        Animated.timing(iconalign, {
            toValue: 0,
            duration: 300
        }).start(() => this.setState({show:true}))
    }
    /******/

    /* To Animate Hide Status Box On click*/
    /******/

    opacitybox = (id) => {
        this.state.DATA.forEach(element => {
            if(element.id === id){
                element.show = false
                this.listclose()
            //this.close(id);
            }
        });
    }

    listclose = () => {
        const {animatedlistWidth, animateCommentWidth, animateSubmitButton, animateBoxOpacity} = this.state;
        Animated.parallel([
          Animated.timing(animatedlistWidth, {
              toValue: 0,
              duration: 400
          }),
          Animated.timing(animateCommentWidth, {
              toValue: 0,
              duration: 400
          }),
          Animated.timing(animateSubmitButton, {
              toValue: 0,
              duration: 400
          }),
          Animated.timing(animateBoxOpacity, {
              toValue: 0,
              duration: 400
          })
        ]).start(() => this.setState({opid:selectedid}));
    }
    /******/

    open = (item) => {
        global.selectedid = ' '
    }

    close = (id) => {
        //this.renderLeftActions().close
    }

    set = (id) => {
        this.state.DATA.forEach(element => {
            if(element.id === id){
                element.swipe = true
            }
        });
    }

    onPress=()=>{
        const newData = this.arrayholder.filter((item)=>{
            return item.id.match(this.state.searchtext);
        })
        this.setState({ DATA: newData});
    }
  
    ondrop=()=>{
        const newData = this.arrayholder.filter((item)=>{
            return item.status === this.state.status
        }).filter((item)=>{
            return item.id.match(this.state.searchtext);
        })
        this.setState({ DATA: newData });
    }

    /* On Swipe Render*/
    /******/

    renderLeftActions = (progress,id,show,swipe,swbtn) => {
        console.log("ARGUMENTS: ", progress, id, show, swipe, swbtn)
        global.selectedid = id
        const {animatedlistWidth, animateCommentWidth, animateSubmitButton, animateBoxOpacity} = this.state;
        const widthInterpolate = animatedlistWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [0, getWidthnHeight(60).width]
        })
        const commentInterpolate = animateCommentWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [0, getWidthnHeight(55).width]
        })
        const animatedStyle = {
            width: widthInterpolate,
            height: getWidthnHeight(undefined, 9).height,
            opacity: animateBoxOpacity
        }
        const commentStyle = {
            width: commentInterpolate
        }
        const statusStyle = {
            width: widthInterpolate
        }
        const submitButtonStyle = {
            opacity: animateSubmitButton
        }
        return (
            <Animated.View style ={[{borderColor: 'pink', borderWidth: 0}, getMarginTop(0.5), getWidthnHeight(85, 9)]} >
                {swipe?
                    <View>  
                        <View style ={[{flexDirection:'row', borderColor: 'red', borderWidth: 0, alignItems: 'flex-start'}, getWidthnHeight(85, 9)]}>
                            <View style={[{borderColor: 'black', borderWidth: 0}, getWidthnHeight(25, 7), getMarginLeft(2)]}>  
                                <TouchableHighlight underlayColor="#3280E4" onPress= {()=>this.animatedlistbox('Approved', id)} style={[{borderRadius:5, borderWidth:0, backgroundColor:'#009E00', justifyContent:'center'}, getWidthnHeight(21)]}>
                                    <View style={[{alignItems:'center'}]}>   
                                    <Text style = {{padding:0.5,color:'white'}}>Approved</Text>
                                    </View> 
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor="#3280E4" onPress= {() =>this.animatedlistbox('Rejected', id)} style={[{borderRadius:5, borderWidth:0, backgroundColor:'#EA3933', justifyContent:'center'}, getMarginTop(1), getWidthnHeight(21)]}>
                                    <View style={[{alignItems:'center'}]}>   
                                    <Text style = {{padding:0.5,color:'white'}}>Rejected</Text>
                                    </View> 
                                </TouchableHighlight>
                            </View>
        {(show)?
        <Animated.View style = {[{borderWidth:0, borderColor: 'green', backgroundColor:'white',},getMarginLeft(0),getMarginTop(0), animatedStyle]}>
            <Animated.View style ={[{flexDirection:'row', flex:1, justifyContent: 'space-between'}, statusStyle]}> 
                <View>
                {this.state.backstatus != ''?
                <Text numberOfLines={1} style={[{alignItems:'center', borderColor: 'red', borderWidth: 0}, getMarginLeft(0)]}>Status : {this.state.backstatus}</Text>:
                <Text>STATUS : {show}</Text>}</View>
                <View>
                <TouchableOpacity onPress={() => this.opacitybox(id)} style ={[{borderWidth: 0, borderColor: 'black', alignItems: 'center'}, , getWidthnHeight(10), getMarginRight(5)]}>
                  <FontAwesomeIcons name='close' size={18} color={'black'}/>
                </TouchableOpacity> 
                </View>
            </Animated.View> 
            <AnimateTextInput
              placeholder={'Comment'}
              onFocus={() => this.setState({placeholder: ''})}
              onBlur = {() => this.setState({placeholder: 'Search here'})}
              onChangeText={(searchtext) => this.setState({searchtext})}  
              value={this.state.searchtext}
              backgroundColor='white'
              style= {[{paddingLeft:5,borderWidth:0.8, borderColor:'#DBE8F8', borderRadius:0, padding:0}, commentStyle]}
            />   
            {this.state.showsubmitbtn? 
              <AnimateTouch onPress={this.opacitybox} style ={[{borderWidth:0,borderRadius:5, backgroundColor:'#3280E2'},getMarginTop(0), submitButtonStyle, getWidthnHeight(20), getMarginLeft(36)]}>
              <Text style={[{textAlign:'center', color:'white'}, fontSizeH4()]}>SUBMIT</Text>
              </AnimateTouch>: null }
        </Animated.View>  : null}
        </View>
        </View>:null}
      </Animated.View>
    );
  };

  /******/

  
  /* Render Flatlist*/
  /******/


  renderItem = ({ item }) => {
    //const animatedopacity = {opacity: this.animatedopacity}
    return( 
        // {<Animated.View style={[item.id == this.state.opid? animatedopacity:{opacity:1},styles.flatlistcontainer, getMarginLeft(4)]}>}
        <Animated.View style={[styles.flatlistcontainer, getMarginLeft(4)]}>
        {/* {<Swipeable childrenContainerStyle ={{backgroundColor:'white'}} onSwipeableWillClose = {()=>this.close(item.id)} renderLeftActions= {(progress) => this.renderLeftActions(progress, item.id, item.show, item.swipe , item.swbtn)}>} */}
        <Swipeable childrenContainerStyle ={{backgroundColor:'white'}} renderLeftActions= {(progress) => this.renderLeftActions(progress, item.id, item.show, item.swipe , item.swbtn)}>
            <View style={[styles.triangleCorner]}/>
            <View>
                <Text style={[{marginTop:getMarginTop(-5).marginTop, color:'white'}, fontSizeH4(),getMarginLeft(1)]}>{item.id}</Text>       
            </View>
            <View style={[{flexDirection:'row', flex:1}]}>
                <View style = {{flex:0.97}}>
                    <Text style={[{color:'#3180E5', fontWeight:'500', fontSize: fontSizeH4().fontSize + 3 },getMarginTop(-4.8), getMarginLeft(10)]}>{item.name}</Text>
                </View>
                {(item.status === 'Approved')?
                <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#029D01', justifyContent:'flex-end'}, getWidthnHeight(undefined,3), getMarginTop(-4.2)]}>
                    <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status}</Text>
                </View>:
                (item.status === 'Paid')?
                <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#EB3A32', justifyContent:'flex-end'}, getWidthnHeight(undefined,3), getMarginTop(-4.2)]}>
                    <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status}</Text>
                </View>:
                (item.status === 'New')?
                <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#00B7DB', justifyContent:'flex-end'}, getWidthnHeight(undefined,3), getMarginTop(-4.2)]}>
                    <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status}</Text>
                </View>:
                <View style={[{borderWidth:0, borderRadius:5, backgroundColor:'#DE9222', justifyContent:'flex-end'}, getWidthnHeight(undefined,3), getMarginTop(-4.2)]}>
                    <Text style={[{color:'#ffffff', paddingHorizontal:10, paddingVertical:1, fontStyle:'italic'}, fontSizeH4()]}>{item.status}</Text>
                </View>
                }
            </View>
            <View style ={[{flexDirection:'row'},getMarginLeft(6), getMarginTop(-1.6)]}>
                <FontAwesomeIcons name='caret-right' size={23} color={'#3280E4'}/>  
                <Text style={[{fontWeight:'bold'},getMarginLeft(2), styles.boldFont]}>{item.from}</Text>
            </View>
            <View style = {[{alignItems:'flex-start', flexDirection:'row'}, getMarginLeft(6), getMarginTop(0.6)]}>
                <Text style = {[{color:'#565656', fontWeight:'600'} ,fontSizeH4()]}>CC: </Text>
            <View style={{backgroundColor:'#DAE7F7'}}>
                <Text style = {[{fontWeight:'600', fontStyle:'italic',fontSize: fontSizeH4().fontSize - 1}]}> {item.travelcode} </Text>
            </View>
            <View>
                <Text style = {[{color:'#565656', fontWeight:'bold', fontSize: fontSizeH4().fontSize + 7}, styles.boldFont, getMarginTop(-1), getMarginLeft(7.5)]}>|</Text>
            </View>
                <Text style = {[{color:'#565656', fontWeight:'600'},fontSizeH4(),getMarginLeft(7.5)]}>Amount: </Text>
            <View style={{backgroundColor:'#367FE6'}}>
                <Text style = {[{color:'#fff', fontWeight:'600', fontStyle:'italic',fontSize: fontSizeH4().fontSize - 1}]}> {'3000/-'} </Text>
            </View>
            <TouchableHighlight underlayColor="#3280E4" onPress= {() =>console.log("Pressed")} style={{width: '8%',height: 25,borderRadius: 25/2, borderWidth:0, backgroundColor:'#DBE8F8', justifyContent:'center',marginLeft:getMarginLeft(7).marginLeft}}>
                <View style={[{alignItems:'center'}]}>   
                    <FontAwesomeIcons name='eye' size={16}/>
                </View> 
            </TouchableHighlight>
            </View>
        </Swipeable>
        </Animated.View>     
    )
  };

  /******/

  /* Main Render */
  /******/
  render() {
    let data = [{
      value: 'Banana',
    }, {
      value: 'New',
    }, {
      value: 'Ne',
    }];
    const {animatedWidth, animatedHeight, iconalign, animateOpacity, animateTextInputWidth, animateTextInputHeight} = this.state;
    const animatedStyle = { width: animatedWidth}
    const animateTextInput = {width: animateTextInputWidth, height: animateTextInputHeight}
    const iconmargin = {marginLeft: iconalign}
    const interpolateOpacity = animateOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    })
    const hideOpacity = {
      opacity: interpolateOpacity
    }
    console.log('### ^^^WIDTH: ', animateTextInput, animatedStyle)
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style = {styles.container}>
          <WaveHeader
                wave={Platform.OS ==="ios" ? false : false} 
                //logo={require('../Image/Logo-164.png')}
                menu='white'
                title='Travel Claim Requests'
                headerType = {'small'}
                //version={`Version ${this.state.deviceVersion}`}
          /> 
          <View style={[{alignItems:'center'}, getMarginTop(1.5), fontSizeH3()]}>
                <Text style = {{color:'#3381E6', textDecorationLine: 'underline',}}>Check Travel Pre Approval Status</Text>
          </View>
          <View style={[styles.MainContainer, getMarginTop(2)]}>
            <View style = {[{flexDirection:'row', justifyContent:'center'},getMarginTop(2.5)]} >
              <View style = {[styles.Dropbox, getMarginLeft(-1)]}>
                <Dropdown
                 containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 0, paddingLeft: 0, borderRadius: 10, marginTop:-5}, getWidthnHeight(88.5, 7)]}
                 //  maxLength = {12}
                 inputContainerStyle={[{borderBottomWidth:0, marginTop:4,alignSelf:'center'}, getWidthnHeight(40, 7.9)]}
                 label={'Request Type'}
                 data={data}
                 //data={this.state.leadIndustryOptionsId}
                 //valueExtractor={({id})=> id}
                 //labelExtractor={({industry_name})=> industry_name}
                 onChangeText={status => this.setState({ status }, this.ondrop)}
                 //value={leadIndustryOptions_id}
                 //baseColor = {(data)? colorTitle : 'grey'}
                 //baseColor = {(leadIndustryOptions_id)? colorTitle : 'grey'}
                 //  selectedItemColor='#aaa'
                 //  textColor='#aaa'
                 //  itemColor='#aaa'
                 baseColor='grey'
                 pickerStyle={{borderWidth: 0}}
                 dropdownOffset={{ 'top': 25 }}
                 fontSize = {13.5}
                  />
              </View>  
              <View style = {[styles.Dropbox , getMarginLeft(2)]}>
                 <Dropdown
                 containerStyle={[{justifyContent: 'center', borderColor: 'grey', borderWidth: 0, paddingLeft: 0, borderRadius: 10, marginTop:-5}, getWidthnHeight(88.5, 7)]}
                 //  maxLength = {12}
                 inputContainerStyle={[{borderBottomWidth:0, marginTop:4,alignSelf:'center'}, getWidthnHeight(40, 7.9)]}
                 label={'List Type'}
                 data={data}
                 //data={this.state.leadIndustryOptionsId}
                 //valueExtractor={({id})=> id}
                 //labelExtractor={({industry_name})=> industry_name}
                 //onChangeText={leadIndustryOptions_id => this.setState({ leadIndustryOptions_id }, () => console.log("INDUSTRY: ", this.state.leadIndustryOptions_id))}
                 //value={leadIndustryOptions_id}
                 //baseColor = {(data)? colorTitle : 'grey'}
                 //baseColor = {(leadIndustryOptions_id)? colorTitle : 'grey'}
                 //  selectedItemColor='#aaa'
                 //  textColor='#aaa'
                 //  itemColor='#aaa'
                 baseColor='grey'
                 pickerStyle={{borderWidth: 0}}
                 dropdownOffset={{ 'top': 25 }}
                 fontSize = {13.5}
                 />         
              </View>  
          </View>  
          <DismissKeyboard>
          <View style={[{alignItems:'center',justifyContent:'center'}, getWidthnHeight(100, 5), getMarginTop(2)]}>
                {(this.state.show)?
                  <TouchableOpacity style = {[{backgroundColor:'white',width: '25%', borderColor: 'red', borderWidth: 0},styles.Ancontainer]} onPress = {this.animatedBox}>  
                      <Animated.View style={[{elevation: 15, width: getWidthnHeight(9).width,height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width, borderWidth:0, backgroundColor:'white', justifyContent:'center'}, iconmargin]}>
                      <Animated.View style={[{alignItems:'center'}]}>   
                          <FontAwesomeIcons name='search' size={20} color={'#3181E2'}/>
                      </Animated.View>
                      </Animated.View>
                  </TouchableOpacity>
                :
                  <View style={[getMarginTop(0)]}>
                  <Animated.View style={[{flexDirection: 'row', borderColor: '#DBE8F8', borderWidth: 1, borderRadius: 50, justifyContent: 'space-around', alignItems: 'center'}, animatedStyle, hideOpacity]}>
                    <View style ={[getWidthnHeight(5), getMarginLeft(2)]}>
                      <TouchableOpacity onPress = {this.hideshow}>
                        <FontAwesomeIcons name='close' size={20} color={'#C4C4C4'}/>
                      </TouchableOpacity>
                    </View> 
                    <AnimateTextInput
                      placeholder={this.state.placeholder}
                      onFocus={() => this.setState({placeholder: ''})}
                      onBlur = {() => this.setState({placeholder: 'Search here'})}
                      onChangeText={(searchtext) => this.setState({searchtext}, this.ondrop)}  
                      value={this.state.searchtext}
                      backgroundColor='white'
                      style= {[{paddingLeft:10,borderWidth:0, borderColor:'#DBE8F8', borderRadius:50, padding:10}, animateTextInput, fontSizeH4()]}
                    />  
                    <TouchableOpacity style = {[{backgroundColor:'white'},styles.Ancontainer,]} onPress = {this.animatedBox}>  
                        <Animated.View style={[{width: getWidthnHeight(9).width,height: getWidthnHeight(9).width, borderRadius: getWidthnHeight(9).width, borderWidth:0, borderColor: 'red', backgroundColor:'#3280E4', justifyContent:'center'}, iconmargin]}>
                          <Animated.View style={[{alignItems:'center'}]}>   
                              <FontAwesomeIcons name='search' size={20} color={'white'}/>
                          </Animated.View>
                        </Animated.View>
                    </TouchableOpacity>
                  </Animated.View>
                  </View>
                }
          </View>  
          </DismissKeyboard>
          <ScrollView>
                <FlatList
                    data={this.state.DATA}
                    initialNumToRender = {this.state.DATA.length}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                /> 
          </ScrollView>
          </View>
          </View>
          </KeyboardAvoidingView>
    )
  }
}

/******/

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    height:'100%'
  },
  MainContainer:{
    flex: 1,
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
  },
  Dropbox:{
    borderWidth: 1,
    left:0,
    width:getWidthnHeight(45).width,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    borderColor: '#C4C4C4',
    marginTop:getMarginTop(1.5).marginTop
  },
  rectangletriangleCorner: {
    width: getWidthnHeight(42).width,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 23,
    borderTopWidth: 40,
    borderRightColor: "transparent",
    borderTopColor: "#307FE4",
  }, 
  flatlistcontainer:{
    width:getWidthnHeight(91).width,
    height:getWidthnHeight(undefined,12).height,
    backgroundColor: '#FFFFFF',
    borderWidth:0,
    borderColor: '#C4C4C4',
    marginTop:getMarginTop(2.5).marginTop,
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
        elevation: 13,
      }
    }),
    shadowOpacity: 0.3,
    shadowRadius: 40,
    borderColor: 'black',
    borderWidth: 0
  }, 
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 40,
    borderTopWidth: 40,
    borderRightColor: "transparent",
    borderTopColor: "#307FE4",
  }, 
  Ancontainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
      backgroundColor: 'white',
      width: 0,
      height: 0,
      justifyContent:"center",
      borderRadius:50,
      borderWidth:0,
      borderColor:'#DBE8F8'
  },
  boldFont: {
    ...Platform.select({
      android: {
        fontFamily: ''
      }
    })
  }
});
