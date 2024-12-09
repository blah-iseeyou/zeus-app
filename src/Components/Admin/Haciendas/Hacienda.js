import React, { useContext, useEffect, useState, useRef } from "react";
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
} from 'native-base';
import Carousel from 'react-native-reanimated-carousel/src/index'
import { SafeAreaView } from "react-native-safe-area-context";

import Color from "color";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"
import 'moment/locale/es'

import axios from "../../../Axios"
import User from "../../../Contexts/User"

import Header from "../../Header"
// import ModalInversion from "../Comprar/ModalInversion"
import Decimal from "decimal.js";
import Reventas from "./Reventas";

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { SkiaRenderer, SkiaChart } from '@wuba/react-native-echarts';

echarts.use([SkiaRenderer, LineChart, GridComponent, TooltipComponent]);

const momentPreciseRangePlugin = require('moment-precise-range')(moment);

export default function SignIn({ route, navigation }) {
    const skiaRef = useRef(null);

    const user = useContext(User)

    const [haciendaId, setHaciendaId] = useState(route.params.hacienda_id)
    const [visibleHacienda, setVisibleHacienda] = useState(false)
    const [hacienda, setHacienda] = useState(null)
    const [data_historica, setDataHistorica] = useState([])


    useEffect(() => {
        getHacienda()
        getHaciendaHistorica()
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

    let getHaciendaHistorica = () => {
        axios.get('/hacienda/historico', {
            params: {
                hacienda_id: route.params.hacienda_id
            }
        })
            .then(response => {
                setDataHistorica(response.data)
            })
            .catch(error => {

            })
    }


    if (route.params.hacienda_id && route.params.hacienda_id !== haciendaId) {
        setHaciendaId(route.params.hacienda_id)
        getHacienda()
        getHaciendaHistorica()

    }

    useEffect(() => {

        console.log('data_historica real')
        console.log('data_historica')
        console.log('data_historica')
        console.log('data_historica', data_historica?.map((f) => { return [f.k, f.v] }))

        const option = {

            xAxis: {
                type: 'category',
                show: true,
                axisPointer: {
                    label: {
                        formatter: (d) => {
                            print(d)
                            let date = moment(d.value, 'DD-MM-YYYY')
                            date.locale('es')
                            return date.format('LL')
                        }
                    }
                }
            },
            yAxis: {
                type: 'value',

            },
            series: [
                {
                    data: data_historica?.map((f) => [moment(f.k).format('DD-MM-YYYY'), f.v]),
                    type: 'line',

                    smooth: true,
                    color: '#31A078',
                },
            ],
            tooltip: {
                trigger: 'axis',
                valueFormatter: (value) => {
                    return `$ ${value} MXN`
                }

            }
        };
        let opciones = {
            dataset: {
                dimensions: ['date', 'value'],
                source: data_historica?.map((f) => { return [f.k, f.v] })
            },
            grid: {
                show: false,
            },
            xAxis: {
                type: 'time',
                show: true,
            },
            yAxis: {
                type: 'value',
                show: true,
                axisLabel: {
                    formatter: '$ {value} MXN'
                }

            },
            series: [
                {

                    type: 'line',
                    smooth: true,
                    color: '#31A078',
                    encode: {

                        y: 'value'
                    }

                }
            ],
            tooltip: {
                trigger: 'axis',
                valueFormatter: (value) => {
                    return `$ ${value} MXN`
                }

            }
        }
        let chart = null
        if (skiaRef.current) {
            chart = echarts.init(skiaRef.current, 'light', {
                renderer: 'skia',
                width: Dimensions.get('window').width,
                height: 300
            });
            chart.setOption(option);
        } else {

        }





        return () => {
            chart?.dispose()
        }



    }, [data_historica])






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
                                <Image alt={"Zeus Oro azul de los altos"} source={require("../../../../assets/img/zeus_agave.png")} resizeMode="contain" h={"20"} opacity={0.2} right={-135} bottom={10} />
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
                                        onPress={() => {
                                            // setVisibleHacienda(true)
                                            navigation.navigate("Comprar", {
                                                hacienda_id: hacienda?._id
                                            })

                                        }}>INVERTIR AHORA</Button>
                                </Box>

                            </VStack>
                        </Box>
                        {data_historica.length > 0 ? <>
                            <Box mt={5} px={0}>
                                <HStack mx={5} mt={4} justifyContent={"center"}>
                                    <Heading fontSize="lg" marginBottom={4}>Historial de precios</Heading>
                                </HStack>

                                <SkiaChart ref={skiaRef} />

                            </Box>
                        </> : null}
                        <Box mt={5} px={2}>
                            <Reventas hacienda_id={hacienda?._id} />
                        </Box>
                    </> : null}
                </ScrollView>
            </SafeAreaView>
        </Box>
    );
}
