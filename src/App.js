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

export default function App() {
	let [user, setUser] = useState(null);


	const createSocket = async (oldSocket) => {
		if (oldSocket) {
			oldSocket.disconnect();
			oldSocket.close();
		}

		let socket = null;

		try {
			const token = await AsyncStorage.getItem('@token');
			console.log("TOKEN", token);

			socket = io("https://zeusagave.com:4002", {
				extraHeaders: {
					Authorization: token
				},
			});

			console.log("Socket created");

		} catch (error) {
			console.error("Error creating socket:", error);
		}

		return socket;
	};

	let [socket, setSocket] = useState(null);

	const setSocketC = (socket) => {
		setSocket(createSocket(socket));
	}

	useEffect(async () => {

		let socketTemp = await createSocket(socket);
		setSocket(socketTemp);


		console.log('before unsubscribe')
		const unsubscribe = messaging().onMessage(async remoteMessage => {
			console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
			//Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
		});
		console.log('after unsubscribe')
		return () => { unsubscribe() };
	}, [])

	return (
		<User.Provider value={user}>
			<SetUser.Provider value={setUser}>
				<Socket.Provider value={socket}>
					<SetSocketContext.Provider value={setSocket}>
						<NativeBaseProvider theme={Theme()} config={Config}>
							<NavigationContainer ref={navigationRef}>
								<NativeStack.Navigator
									screenOptions={{ headerShown: false }}
									initialRouteName="SignIn"
								>
									<NativeStack.Screen name={"SignIn"} component={SignIn} />
									<NativeStack.Screen
										name={"RecoveryPassword"}
										component={RecoveryPassword}
									/>
									<NativeStack.Screen
										name={"Credentials"}
										component={Credentials}
									/>
									<NativeStack.Screen
										name={"UserInformation"}
										component={UserInformation}
									/>
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
