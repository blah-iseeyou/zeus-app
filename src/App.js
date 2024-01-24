import 'react-native-gesture-handler';
import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme, theme as nbTheme, View } from "native-base";

import SignIn from "./Components/Public/SignIn"
import RecoveryPassword from "./Components/Public/RecoveryPassword"

import Credentials from "./Components/Public/Register/Credentials"
import UserInformation from "./Components/Public/Register/UserInformation"


import Address from "./Components/Public/Register/Address"

import { SetUser, User } from "./Contexts/User"
import { Config, Theme } from "./Config"

import AdminRouter from "./Routes/AdminRouter"

import { navigationRef } from './Contexts/RootNavigation';


const NativeStack = createStackNavigator();

export default function App() {

	let [user, setUser] = useState(null)

	return (
		<User.Provider value={user}>
			<SetUser.Provider value={setUser}>
				<NativeBaseProvider theme={Theme()} config={Config}>
					<NavigationContainer ref={navigationRef}>
						<NativeStack.Navigator
							screenOptions={{ headerShown: false }}
							initialRouteName="SignIn"
						>
							<NativeStack.Screen name={"SignIn"} component={SignIn} />
							<NativeStack.Screen name={"RecoveryPassword"} component={RecoveryPassword} />
							<NativeStack.Screen name={"Credentials"} component={Credentials} />
							<NativeStack.Screen name={"UserInformation"} component={UserInformation} />
							<NativeStack.Screen name={"Address"} component={Address} />
							<NativeStack.Screen name={"Admin"} component={AdminRouter} />
						</NativeStack.Navigator>
					</NavigationContainer>
				</NativeBaseProvider>
			</SetUser.Provider>
		</User.Provider>

	);
}