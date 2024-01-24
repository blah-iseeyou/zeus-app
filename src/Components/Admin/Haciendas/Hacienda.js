import React, { useContext, useEffect, useState, } from "react";
import { Dimensions, } from "react-native"
import {
    HStack,
    VStack,
    Text,
    Stack,
    Box,
    ScrollView,
    Heading,
    Button,
    Image,
    Icon,
    Pressable
} from "native-base";
import Carousel from 'react-native-reanimated-carousel/src/index'
import { SafeAreaView } from "react-native-safe-area-context";

import Color from "color";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import axios from "../../../Axios"
import User from "../../../Contexts/User"

import Header from "../../Header"
import BottomSheet from "../Comprar/BottomSheet"
import Decimal from "decimal.js";
import Reventas from "./Reventas";
// import moment from "moment"

const momentPreciseRangePlugin = require('moment-precise-range')(moment);

export default function SignIn({ route }) {

    // // console.log("route", route.params)

    const user = useContext(User)

    const [haciendaId, setHaciendaId] = useState(route.params.hacienda_id)
    const [visibleHacienda, setVisibleHacienda] = useState()
    const [hacienda, setHacienda] = useState(null)

    useEffect(() => {
        getHacienda()
    }, [])




    let getHacienda = () => {
        axios.get('/hacienda', {
            params: {
                _id: route.params.hacienda_id
            }
        })
            .then(response => {
                setHacienda(response.data.data)
            })
            .catch(error => {

            })
    }


    if (route.params.hacienda_id && route.params.hacienda_id !== haciendaId) {
        setHaciendaId(route.params.hacienda_id)
        getHacienda()
    }

    return (
        <Box variant={"layout"} flex="1"  >
            <SafeAreaView flex={1}>
                <Header />
                <ScrollView flex={1} mx={4}>
                    {hacienda ? <>

                        <Box px="1" flex="1" borderRadius={16}>
                            <Box bg={{
                                linearGradient: {
                                    colors: [Color(hacienda?.color ?? "green").darken(0.2).hex(), hacienda?.color ?? "green"],
                                    start: [0, 0],
                                    end: [1, 0]
                                }
                            }} borderRadius={10} width={"100%"} height={100} position="relative">
                                <VStack p={2}>
                                    <Heading size={"sm"} color="white">{hacienda?.nombre}</Heading>
                                    <Text color="white">{hacienda?.descripcion}</Text>
                                </VStack>
                                <Image alt={"Zeus Oro azul de los altos"} source={require("../../../../assets/img/ZeusAgave.png")} resizeMode="contain" h={"20"} opacity={0.2} right={-135} bottom={10} />
                            </Box>
                        </Box>
                        <Box bg={"white"} mt={5} borderRadius={10} px={2} py={2}>
                            <VStack borderBottomWidth="1" borderBottomColor="gray.200" pb={2}>
                                <Text flex={1} textAlign="center">Hacienda</Text>
                                <Heading flex={1} size="md" textAlign="center">{hacienda.nombre}</Heading>
                            </VStack>

                            <VStack justifyContent="center">
                                <Box mt={5}>
                                    <Text textAlign={"center"}>Edad</Text>
                                    <Text textAlign={"center"} fontWeight="bold">{momentPreciseRangePlugin(hacienda.fecha_creacion, moment(), {
                                        year: true,
                                        month: true,
                                        day: true,
                                    })}</Text>
                                </Box>
                                <Box mt={5}>
                                    <Text textAlign={"center"}>Hectareas</Text>
                                    <Text textAlign={"center"} fontWeight="bold">{hacienda.hectareas}</Text>
                                </Box>
                                <Box mt={5}>
                                    <Text textAlign={"center"}>Precio por Planta</Text>
                                    <HStack justifyContent={"space-between"}>
                                        <Text flex={1} textAlign="center" fontWeight={"bold"}>{hacienda.precio?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>MXN</Text></Text>
                                        <Text flex={1} textAlign="center" fontWeight={"bold"}>{Decimal(hacienda.precio_dolar ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>USD</Text></Text>
                                    </HStack>
                                </Box>
                                <Box mt={5}>
                                    <Button
                                        isDisabled={hacienda.disponible <= 0 || hacienda.estatus == 3}
                                        onPress={() => setVisibleHacienda(hacienda?._id)}>INVERTIR AHORA</Button>
                                </Box>

                            </VStack>
                        </Box>
                        <Box mt={5} px={2}>
                            <Reventas hacienda_id={hacienda?._id}/>
                        </Box>
                    </>
                        : null}
                </ScrollView>
                <BottomSheet
                    hacienda_id={visibleHacienda}
                    onClose={() => {
                        setVisibleHacienda()
                    }}
                />
            </SafeAreaView>

        </Box>
    );
}
