import messaging from '@react-native-firebase/messaging';


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
        console.log('Token:', token);
        
      } catch (error) {
        console.error('Error getting new FCM token:', error);
      }
}

export default getToken;
