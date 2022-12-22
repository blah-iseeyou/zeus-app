import React from "react";
import { VStack, HStack, Button, IconButton, Icon, Text, NativeBaseProvider, Center, Box, StatusBar } from "native-base";
import Octicons from "react-native-vector-icons/Octicons";


import HumanisticsLogo from "../../assets/icons/HumanisticsLogo";

function Header() {
    return <HStack  justifyContent="space-between" alignItems="center" pt="1.5">
        <HStack justifyContent="space-between" flex="1">
            <IconButton />
            <Box height={30}>
                <HumanisticsLogo width={25 * (592 / 100)} height={25 * (157/ 100)}  />
            </Box>
            <IconButton icon={<Icon as={Octicons} name="bell-fill" size="xl" color="white" />} />
        </HStack>
    </HStack>
}

export const AppBar = Header
export default Header