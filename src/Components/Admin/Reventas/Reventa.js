import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import axios from '../../../Axios';
import { Box, Button, Divider, FormControl, Heading, HStack, KeyboardAvoidingView, Text, VStack } from 'native-base';
import moment from 'moment/moment';
import InputFormatNumber from '../../Widgets/InputFormatNumber';

export default function (props) {

    const { reventa_id, onClose } = props

    const [index, setIndex] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [reventaId, setReventaId] = useState(null)
    const [reventa, setReventa] = useState(null)
    const [values, setValues] = useState({
        cantidad: 0,
        precio: 0
    })

    const snapPoints = useMemo(() => [400], []);



    const getReventa = () => {
        axios.get('/customer/reventa', {
            params: {
                id: reventa_id
            }
        })
            .then(({data}) => {
                console.log(data)
                setReventa(data)
                setValues({
                    cantidad: data.cantidad_restante,
                    precio: data.precio_reventa
                })
            })
            .catch(error => {
                console.log(error)
            })
    }


    if (reventa_id && reventa_id != null && reventaId !== reventa_id) {
        getReventa()
        setReventaId(reventa_id)
        setIndex(0)
    }

    const update = ({
        cantidad = values.cantidad,
        precio = values.precio
    } = values) => {
        setLoading(true)
        axios.put('/customer/reventa', {
            cantidad,
            precio_reventa: precio,
            reventa_id: this.props.reventa,
        }).then(() => {
            onClose()
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoading(false)
        })
    }

    const remove = () => {
        setLoading(true)
        axios.delete('/customer/reventa')
            .then(() => {
                onClose()
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setLoading(false)
            })
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
                        setReventaId(null)
                        setReventa(null)
                        // ...transacciones, {}
                        setTransacciones({...transacciones, data: [], total: 0, pages: 0, page: 1})
                    }
                }}
                enablePanDownToClose={true}
            >
                <KeyboardAvoidingView height={"100%"} behavior='height'>
                    <Box flex={1} px={3} py={3}>
                        <Heading size={"md"}>Revender</Heading>
                        <Divider my={3} orientation={"horizontal"}/>
                        <Heading size={"sm"}>Mi inversión</Heading>
                        <Box mt={2}>
                            <Heading size={"xs"} opacity={0.6}>Hacienda</Heading>
                            <Text>{reventa?.hacienda_id?.nombre}</Text>
                        </Box>
                        <HStack mt={2} space={4}>
                            <Box flex={1}>
                                <Heading size={"xs"} opacity={0.6}>Cantidad Disponible</Heading>
                                <Text>{reventa?.cantidad_restante}</Text>
                            </Box>
                            <Box flex={1}>
                                <Heading size={"xs"} opacity={0.6}>Precio Hacienda</Heading>
                                <Text>{reventa?.hacienda_id?.precio?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
                            </Box>
                        </HStack>
                        <Divider my={3} orientation={"horizontal"}/>
                        <HStack space={4}>
                            <Box flex={1}>
                                <FormControl isRequired isDisabled={reventa?.cantidad_restante < 1}>
                                    <FormControl.Label>Cantidad de Plantas</FormControl.Label>
                                    <InputFormatNumber
                                        value={values.cantidad}
                                        keyboardType='decimal-pad'
                                        placeholder="Ingrese la cantidad de plantas"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                        onChangeText={value => setValues(state => ({...state, cantidad: Number(value)}))}
                                    />
                                </FormControl>
                            </Box>
                            <Box flex={1}>
                                <FormControl isRequired>
                                    <FormControl.Label>Precio de Venta</FormControl.Label>
                                    <InputFormatNumber
                                        value={values.precio}
                                        keyboardType='decimal-pad'
                                        placeholder="Ingrese el precio de venta"
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                        onChangeText={value => setValues(state => ({...state, precio: Number(value)}))}
                                    />
                                </FormControl>
                            </Box>
                        </HStack>
                        <HStack space={2} mt={4}>
                            <Box flex={1}>
                                <Button isDisabled={reventa?.estatus !== 3} isLoading={loading} bg={"red.400"} onPress={() => remove()}>Eliminar</Button>
                            </Box>
                            <Box flex={2}>
                                <Button isDisabled={reventa?.cantidad_restante < 1 || reventa?.estatus !== 3} isLoading={loading} onPress={() => update()}>Guardar Cambios</Button>
                            </Box>
                        </HStack>
                    </Box>
                </KeyboardAvoidingView>
            </BottomSheet>
        </>
    );
};
