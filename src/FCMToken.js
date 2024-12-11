import messaging from '@react-native-firebase/messaging';
import axios from './Axios';

import DeviceInfo from 'react-native-device-info';


let token = null;
const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        token = (await messaging().getToken()).toString()
    } else {
        console.log('User has rejected permissions');
    }
}

const getToken = async () => {

    try {
        await requestUserPermission();

        await axios.post('/fcm', {
            token: token,
            device_id: await DeviceInfo.getUniqueId(),

        }, { withCredentials: true }).then((response) => {
            console.log('Response:', response.data);
            console.log('Token saved successfully');
        }).catch((error) => {
            console.error('Error saving token:', error);
        });


        console.log('Token:', token);
        console.log('Device ID:', await DeviceInfo.getUniqueId());

    } catch (error) {
        console.error('Error getting new FCM token:', error);
    }
}

export default getToken;
