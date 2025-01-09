import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
	NativeBaseProvider,
	extendTheme,
	theme as nbTheme,
	View,
} from "native-base";

import SignIn from "./Components/Public/SignIn";
import RecoveryPassword from "./Components/Public/RecoveryPassword";

import Credentials from "./Components/Public/Register/Credentials";
import UserInformation from "./Components/Public/Register/UserInformation";

import Address from "./Components/Public/Register/Address";

import { SetUser, User } from "./Contexts/User";
import Socket, { SetSocketContext } from "./Contexts/Socket";
import { Config, Theme } from "./Config";

import AdminRouter from "./Routes/AdminRouter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "./Contexts/RootNavigation";
import io from "socket.io-client";

import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';


const NativeStack = createStackNavigator();

// Crear socket con manejo de errores
const createSocket = async (oldSocket) => {
	if (oldSocket) {
		oldSocket.disconnect();
		oldSocket.close();
	}

	const token = await AsyncStorage.getItem('@token');

	return io("https://87da-201-142-184-176.ngrok-free.app", {
		extraHeaders: { Authorization: token },
		withCredentials: true
	});
	
};

export default function App() {

	let [user, setUser] = useState(null);
	let [socket, setSocket] = useState(null);

	useEffect(() => {
	    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
	        console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
	    });

	    return () => {
	        unsubscribe();
	    };
	}, []);


	const updateSocket = async (newSocket) => {
        setSocket(newSocket);
    };

	return (
		<User.Provider value={user}>
			<SetUser.Provider value={setUser}>
				<Socket.Provider value={socket}>
					<SetSocketContext.Provider value={updateSocket}>
						<NativeBaseProvider theme={Theme()} config={Config}>
							<NavigationContainer ref={navigationRef}>
								<NativeStack.Navigator
									screenOptions={{ headerShown: false }}
									initialRouteName="SignIn"
								>
									<NativeStack.Screen name={"SignIn"} component={SignIn} />
									<NativeStack.Screen name={"RecoveryPassword"} component={RecoveryPassword}/>
									<NativeStack.Screen name={"Credentials"} component={Credentials}/>
									<NativeStack.Screen name={"UserInformation"} component={UserInformation}/>
									<NativeStack.Screen name={"Address"} component={Address} />
									<NativeStack.Screen name={"Admin"} component={AdminRouter} />
								</NativeStack.Navigator>
							</NavigationContainer>
						</NativeBaseProvider>
					</SetSocketContext.Provider>
				</Socket.Provider>
			</SetUser.Provider>
		</User.Provider>
	);
}
