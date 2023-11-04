import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import axios from '../../../Axios';
import { Box, Heading, HStack, Text, VStack, Button } from 'native-base';
import moment from 'moment/moment';
import { useNavigation } from '@react-navigation/native';

export default function (props) {

    const navigation = useNavigation()

    const { inversion_id, onClose } = props

    const [index, setIndex] = useState(-1)
    const [inversionId, setInversionId] = useState(null)



    const [inversion, setInversion] = useState(null)


    const [transacciones, setTransacciones] = useState({
        data: [],
        page: 1,
        limit: 20,

        pages: 0,
        total: 0
    })

    const snapPoints = useMemo(() => ['80%'], []);



    const getInversion = () => {
        axios.get('/customer/inversion', {
            params: {
                id: inversion_id
            }
        })
            .then(response => {
                setInversion(response?.data?.data)
            })
            .catch(error => {

            })
    }

    const getTransacciones = ({ page, limit } = transacciones) => {
        axios.get('/customer/transaccion', {
            params: {
                page,
                limit,
                inversion_id
            }
        })

            .then(response => {
                console.log("response.data.data", response.data)
                setTransacciones(response.data.data)
            })
            .catch(error => {

            })

    }


    if (inversion_id && inversion_id != null && inversionId !== inversion_id) {
        getInversion()
        getTransacciones()
        setInversionId(inversion_id)
        setIndex(0)
    }



    /**
   * @param {*} estatus
   * @description Renderiza el Tag con el estatus de la inversion
   */
    const renderEstatusInversion = (estatus = 0) => {
        let steps = {
            0: <Text borderRadius={100} h={5} bg={"red.400"} color="white" px={3} right={-8}>Cancelada</Text>,
            1: <Text borderRadius={6} h={5} bg={"yellow.400"} color="white" px={3} right={-8}>Pendiente</Text>,
            2: <Text borderRadius={100} h={5} bg={"green.500"} color="white" px={3} right={-8}>Pagada</Text>,
            3: <Text borderRadius={100} h={5} bg={"gray.400"} px={3} right={-8}>Ejecutada</Text>,
            4: <Text borderRadius={100} h={5} bg={"red.400"} color="white" px={3}>Revendida</Text>,
        }
        return estatus != undefined ? steps[estatus] : 'N/A'
    }
    return (
        <>

            <BottomSheet
                index={index}
                snapPoints={snapPoints}
                onChange={e => {
                    setIndex(e)

                    console.log("E", e)
                    if (e == -1) {
                        onClose()
                        setInversionId(null)
                        setInversion(null)
                        // ...transacciones, {}
                        setTransacciones({...transacciones, data: [], total: 0, pages: 0, page: 1})
                    }
                }}
                enablePanDownToClose={true}
            >
                <Box mx={5}>
                    <HStack justifyContent={"space-between"}>
                        <Box>
                            <Heading size={"sm"}>Folio de Inversión:</Heading>
                            <Text>{inversion?.folio}</Text>
                        </Box>
                        {renderEstatusInversion(inversion?.estatus)}
                    </HStack>
                    <HStack mt={4} justifyContent="space-between">
                        <Box flex={1}>
                            <Text >Hacienda</Text>
                            <Heading size={"xs"}>{inversion?.hacienda_id?.nombre}</Heading>
                        </Box>
                        <Box flex={1}>
                            <Text textAlign="right">Plantas</Text>
                            <Heading textAlign="right" size={"xs"}>{inversion?.cantidad}</Heading>
                        </Box>
                    </HStack>
                    <HStack mt={4} justifyContent="space-between">
                        <Box flex={1}>
                            <Text >Total</Text>
                            <Heading size={"xs"}>{inversion?.monto?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Heading>
                        </Box>
                        <Box flex={1}>
                            <Text textAlign="center">Pagado</Text>
                            <Heading textAlign="center" color="green.500" size={"xs"}>{inversion?.monto_pagado?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Heading>
                        </Box>
                        <Box flex={1}>
                            <Text textAlign="right">Pendiente</Text>
                            <Heading textAlign="right" color="red.500" size={"xs"}>{inversion?.monto_pendiente?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Heading>
                        </Box>
                    </HStack>
                    {
                        (inversion?.estatus >= 2) ? 
                            <HStack justifyContent={"center"} mt={5}>
                                <Button onPress={() => navigation.navigate("Haciendas")} background="primary.900" color={'white'} size="sm" px={2} py={1}>Agregar Reventa</Button>
                            </HStack>

                        : null 
                    }
                    {(transacciones.total > 0) ? <Heading size="sm" mt={5} mb={2}>Pagos y Transacciones Registrados</Heading> : null}
                    {transacciones.data?.map(({ concepto, hacienda_id, monto, createdAt }) => <VStack mt={3} pb={2} borderBottomColor="gray.200" borderBottomWidth={1}>
                        <HStack justifyContent={"space-between"}>
                            <Text>{concepto}</Text>
                            <Text>{monto?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
                        </HStack>
                        <HStack justifyContent={"space-between"} mt={1}>
                            <Text fontSize={12}>{hacienda_id ? hacienda_id?.nombre : 'N/A'}</Text>
                            <HStack>
                                <Text fontSize={10} top={1}>{moment(createdAt).format("YYYY-MM-DD")}</Text>
                            </HStack>
                        </HStack>
                    </VStack>)}
                </Box>
            </BottomSheet>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});