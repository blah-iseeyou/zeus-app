
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Box, Icon, IconButton, HStack, VStack } from "native-base";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import TabbarBackground from "../../assets/icons/TabbarBackground"
import Dashboard from "../Components/Admin/Dashboard"

const BottomStack = createBottomTabNavigator()

export default function () {
    
    const insets = useSafeAreaInsets();

    return <BottomStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Dashboard"
        tabBar={() => {
            return <Box bg={"transparent"} w="100%" height="120" m={0} p={0} style={{ position: "absolute", bottom: 0 }}>
                <TabbarBackground width="100%" height={insets.bottom + 180} style={{ flex: 1, position: "absolute",bottom: -insets.bottom-10 }} />
                <VStack
                    alignItems="center"
                    bg={{
                        linearGradient: {
                            colors: ['#A62E99', '#681FB0'],
                            start: { x: 0.5, y: 0.5 },
                            end: { x: 1, y: 0.5 },
                        },
                    }}
                    mx="auto"
                    w={70}
                    h={70}
                    borderRadius={100}
                    bottom={insets.bottom / 2}
                    >
                    <Icon as={AntDesign} m="auto" name="plus" size="xl" color="white" />
                </VStack>
                <HStack flex="1" bottom={insets.bottom}>
                    <VStack flex="1" alignItems="center">
                        <Icon as={Octicons} name="bell-fill" size="xl" color="marine.900" />
                        <Box>Home</Box>
                    </VStack>
                    <VStack flex="1" alignItems="center">
                        <Icon as={Octicons} name="bell-fill" size="xl" color="marine.900" />
                        <Box>Home</Box>
                    </VStack>
                    <VStack flex="1" alignItems="center">
                        <Icon as={Octicons} name="bell-fill" size="xl" color="marine.900" />
                        <Box>Home</Box>
                    </VStack>
                    <VStack flex="1" alignItems="center">
                        <Icon as={Octicons} name="bell-fill" size="xl" color="marine.900" />
                        <Box>Home</Box>
                    </VStack>
                </HStack>
            </Box>
        }}>
        <BottomStack.Screen name={"Dashboard"} component={Dashboard} />
    </BottomStack.Navigator>
}