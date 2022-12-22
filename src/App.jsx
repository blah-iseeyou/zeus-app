import 'react-native-gesture-handler';
import React from "react";
import {  createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, extendTheme, theme as nbTheme } from "native-base";
// import StarterIntro from "./screens/StarterIntro";
// import SignUp from "./screens/SignUp"
import SignIn from "./Components/Public/SignIn"
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminRouter from "./Routes/AdminRouter"
import { Config, Theme } from "./Config"

const NativeStack = createStackNavigator();

export default function App() {


	// const insets = useSafeAreaInsets();

	
	return (
		<NativeBaseProvider theme={Theme()} config={Config}>
			<NavigationContainer>
				<NativeStack.Navigator
					screenOptions={{ headerShown: false }}
					initialRouteName="SignIn"
					>
					<NativeStack.Screen name={"SignIn"} component={SignIn} />
					<NativeStack.Screen name={"Admin"} component={AdminRouter} />
				</NativeStack.Navigator>
			</NavigationContainer>
		</NativeBaseProvider>
	);
}