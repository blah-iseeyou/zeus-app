import React, { useContext, useEffect, useState, } from "react";
import { Dimensions, } from "react-native"
import {
    HStack,
    VStack,
    Text,
    Box,
    Heading,
    Icon,
    FlatList,
    Spacer,
    Pressable
} from 'native-base';

import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import axios from "../../../Axios"
import Header from "../../Header"
import { SetUser, User } from "../../../Contexts/User"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";


export default function SignIn({ route, navigation }) {

    const setUser = useContext(SetUser)
    const user = useContext(User)



    const signOut = () => {
        axios.get('/logout')
            .then(async () => {
                await AsyncStorage.clear()
                setUser(undefined)
                navigation.navigate("SignIn")
            })
            .catch(error => {
                console.log("err", error)
            })
    }



    return (
        <Box variant={"layout"} flex="1"  >
            <SafeAreaView flex={1}>
                <Header />
                <Box>
                    <Heading fontSize="xl" p="4" pb="3">
                        Configuración
                    </Heading>
                    <FlatList

                        data={
                            [
                                {
                                    id: "cuenta",
                                    nombre: "Configuración de la Cuenta",
                                    description: "Cambiar el nombre, dirección, etc.",
                                    icon: "user",
                                    event: () => navigation.navigate("Cuenta")
                                },
                                {
                                    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
                                    nombre: "Cuentas Bancarias del Sistema",
                                    description: "Agregar las cuentas de retorno de inversión",
                                    icon: "team",
                                    event: () => navigation.navigate("Cuentas")
                                },
                                {
                                    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f64",
                                    nombre: "Beneficiarios",
                                    description: "Agregar las cuentas de retorno de inversión",
                                    icon: "team",
                                    event: () => navigation.navigate("Beneficiarios")
                                },
                                {
                                    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f65",
                                    nombre: "Soporte",
                                    description: "Iniciar un chat con el equipo de soporte",
                                    icon: "questioncircle",
                                    event: () => navigation.navigate("Soporte")
                                },
                                {
                                    id: "58694a0f-3da1-471f-bd96-145571e29d72",
                                    nombre: "Cerrar Sesión",
                                    description: "Cierra la Sesión en la cuenta",
                                    icon: "logout",
                                    event: () => signOut()
                                },
                            ]
                        }
                        _contentContainerStyle={{
                            marginX: 5
                        }}
                        renderItem={({ item }) => <Pressable flex={1} onPress={item.event}>
                            <Box borderBottomWidth="1" _dark={{ borderColor: "coolGray.500" }} borderColor="coolGray.300" pl={["0", "4"]} pr={["0", "5"]} mt="3">
                                <HStack space={[2, 3]} justifyContent="space-between">
                                    <Icon as={AntDesign} name={item.icon} size="xl" />
                                    <VStack>
                                        <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>{item.nombre}</Text>
                                        <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>{item.description}</Text>
                                    </VStack>
                                    <Spacer />
                                </HStack>
                            </Box>
                        </Pressable>}
                        keyExtractor={item => item.id}
                    />
                </Box>
            </SafeAreaView>
        </Box>
    );
}
