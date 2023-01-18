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
    Pressable,
    Button
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from "../../../Axios"
import Header from "../../Header"
import { SetUser, User } from "../../../Contexts/User"

export default function SignIn({ route, navigation }) {


    const [cuentas, setCuentas] = useState({
        data: [],
        page: 1,
        limit: 20,

        pages: 0,
        total: 0
    })

    useEffect(() => {
        getCuentas()
    }, [])


    const getCuentas = ({ page, limit } = cuentas) => {

        setCuentas({ ...cuentas, page, limit })

        axios.get('/cuentas', {
            params: {
                page, limit
            }
        })
            .then(response => {
                setCuentas({
                    ...cuentas,
                    data: response.data.data.itemsList,
                    total: response.data.data.itemCount,
                    pages: response.data.data.totalPages
                })
            })
            .catch(error => {
                // message.error('Ocurrio un error al cargar datos')
            })
    }


    return (
        <Box variant={"layout"} flex="1"  >
            <Header />
            <Heading fontSize="xl" p="4" pb="3">
                Configuración
            </Heading>
            <FlatList
                data={cuentas.data}
                _contentContainerStyle={{
                    marginX: 5
                }}
                renderItem={({ item }) => <Box borderBottomWidth="1" _dark={{ borderColor: "coolGray.500" }} borderColor="coolGray.300" pl={["0", "4"]} pr={["0", "5"]} mt="3">
                    <HStack space={[2, 3]} justifyContent="space-between" mb={1}>
                        <VStack flex={1}>
                            <Text _dark={{ color: "warmGray.50" }} color="coolGray.800" bold>{item.nombre}</Text>
                            <Text color="coolGray.600" _dark={{ color: "warmGray.200" }}>{item.cuenta} {item.banco} </Text>
                        </VStack>
                        <HStack>
                            <Button size="sm" leftIcon={<Icon as={AntDesign} name="edit" />} mr={1} />
                            <Button size="sm" bg="danger.500" leftIcon={<Icon as={AntDesign} name="delete" />} />
                        </HStack>
                    </HStack>
                </Box>}
                keyExtractor={item => item.id}
            />
        </Box>
    );
}
