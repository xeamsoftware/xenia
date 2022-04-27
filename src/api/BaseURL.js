import {AsyncStorage} from 'react-native';
import axios from 'axios';
import {getWidthnHeight} from '../KulbirComponents/common';
//////////////////////////////////////////////////////////////////////////////////////
//LIVE SERVER
export const login = 'http://www.erp.xeamventures.com/api/v1'

export const extractBaseURL = async() => AsyncStorage.getItem('receivedBaseURL');

export const getLeadDownloadAPI = async(fileName) => {
    const serverLink = await AsyncStorage.getItem('receivedBaseURL');
    console.log("@@@@ ACTIVE SERVER: ", serverLink)
    const check = serverLink.includes('bpo')
    if(check){
        return `http://erp.xeambpo.com/api/v1/lead/lead/${fileName}/download`
    }else{
        return `http://erp.xeamventures.com/api/v1/lead/lead/${fileName}/download`
    }
}

export const getLeadAttachmentDownloadAPI = async(fileName) => {
    const serverLink = await AsyncStorage.getItem('receivedBaseURL');
    console.log("@@@@ ACTIVE SERVER: ", serverLink)
    const check = serverLink.includes('bpo')
    if(check){
        return `http://erp.xeambpo.com/api/v1/lead/lead-comments/${fileName}/download`
    }else{
        return `http://erp.xeamventures.com/api/v1/lead/lead-comments/${fileName}/download`
    }
}

export const getClaimDocumentAttachmentAPI = async(fileName) => {
    const serverLink = await AsyncStorage.getItem('receivedBaseURL');
    console.log("@@@@ ACTIVE SERVER: ", serverLink)
    const check = serverLink.includes('bpo')
    if(check){
        return `http://erp.xeambpo.com/api/v1/travel/download-attachment/claim/${fileName}`
    }else{
        return `http://erp.xeamventures.com/api/v1/travel/download-attachment/claim/${fileName}`
    }
}

export const fetchBaseURL = async() => await AsyncStorage.getItem('onboardingURL');

// const savedURL = async() => {
//     await extractBaseURL().then((baseURL) => {
//         return baseURL;
//       })
// }

// export const axiosAPI = axios.create({
//     'baseURL': savedURL()
// })

export const drawerMenuWidth = getWidthnHeight(80);

export const savedToken = "";