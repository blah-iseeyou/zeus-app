import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import axios from '../../../Axios';
import { Box, Button, Divider, FormControl, Heading, HStack, KeyboardAvoidingView, Text, VStack } from 'native-base';
import moment from 'moment/moment';
import Decimal from 'decimal.js';
import InputFormatNumber from '../../Widgets/InputFormatNumber';

export default function (props) {

    const { reventa_id, onClose } = props

    const [index, setIndex] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [reventaId, setReventaId] = useState(null)
    const [reventa, setReventa] = useState(null)
    const [inversion, setInversion] = useState(null)
    const [values, setValues] = useState({
        cantidad: 0,
        precio: 0,
        max_precio: 0,
        max_cantidad: 0,
        minimo_reventa: 0,
        maximo_reventa: 0,
        tipo_cambio: 0,
        moneda: "MXN",
        tipo: 2
    })

    const snapPoints = useMemo(() => [400], []);
    const bottomSheetRef = useRef(null)

    const getTipoCambio = () => {
        axios.get('/plantas')
            .then(res => {
                setValues(values => ({
                    ...values,
                    tipo_cambio: res.data.data.tipo_cambio,
                    minimo_reventa: res.data.data.minimo / 100 + 1 ,
                    maximo_reventa: res.data.data.maximo / 100 + 1
                }))
            })
    }

    const getReventa = () => {
        axios.get('/customer/reventa', {
            params: {
                id: reventa_id
            }
        })
            .then(({data}) => {
                setReventa(data)
                setValues(values => ({
                    ...values,
                    cantidad: data.cantidad_restante,
                    precio: data.precio_reventa,
                    tipo: data.tipo
                }))
                getInversion(data.inversion_original_id)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const getInversion = (inversion_id) => {
        axios.get('/inversion', {
            params: {
                id: inversion_id,
                movimiento: true
            }
        }).then(({data}) => { 
            const {
                cantidad, 
                cantidad_revendidas, 
                moneda, 
                hacienda_id,
                tipo_cambio = 0
            } = data?.data
            setInversion(data?.data)
            setValues(values => ({
                ...values,
                moneda,
                max_cantidad: cantidad - cantidad_revendidas,
                max_precio: moneda === "USD" ?
                    Decimal(hacienda_id?.precio).div(tipo_cambio).toDecimalPlaces(2).toNumber()
                    : Decimal(hacienda_id?.precio).toDecimalPlaces(2).toNumber()
            }))
        }).catch((error) => {

        })
    }

    if (reventa_id && reventa_id != null && reventaId !== reventa_id) {
        getTipoCambio()
        getReventa()
        setReventaId(reventa_id)
        setIndex(0)
    }

    if (!reventa_id && reventaId !== reventa_id){
        setReventaId(null)
        setReventa(null)
        setValues({
            cantidad: 0,
            precio: 0
        })
        setIndex(-1)
        bottomSheetRef?.current?.close()
    }

    const update = ({
        cantidad = values.cantidad,
        precio = values.precio,
        tipo = values.tipo
    } = values) => {
        setLoading(true)
        axios.put('/customer/reventa', {
            cantidad,
            precio,
            tipo,
            id: inversion?._id,
            reventa_id: reventa?._id,
            hacienda_id: inversion?.hacienda_id?._id,
            estatus: 1
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
        axios.delete('/reventa', { params: { id: reventa?._id } })
            .then(() => {
                onClose()
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setLoading(false)
            })
    }

    // Objeto de validaciones
    const vals = {
        precio: {
            min: precio => precio >= (values?.max_precio * values?.minimo_reventa).toFixed(2),
            max: precio => precio <= (values?.max_precio * values?.maximo_reventa).toFixed(2)
        }
    }

    return (
        <>
            <BottomSheet
                index={index}
                snapPoints={snapPoints}
                ref={bottomSheetRef}
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
                        <Heading size={"md"}>Editar Reventa</Heading>
                        <Divider my={3} orientation={"horizontal"}/>
                        <Heading size={"sm"}>Mi inversión</Heading>
                        <Box mt={2}>
                            <Heading size={"xs"} opacity={0.6}>Hacienda</Heading>
                            <Text>{inversion?.hacienda_id?.nombre}</Text>
                        </Box>
                        <HStack mt={2} space={4}>
                            <Box flex={1}>
                                <Heading size={"xs"} opacity={0.6}>Cantidad Disponible</Heading>
                                <Text>{values?.max_cantidad}</Text>
                            </Box>
                            <Box flex={1}>
                                <Heading size={"xs"} opacity={0.6}>Precio Hacienda</Heading>
                                <Text>$ {values.max_precio} {values?.moneda}</Text>
                            </Box>
                        </HStack>
                        <Divider my={3} orientation={"horizontal"}/>
                        <HStack space={4}>
                            <Box flex={1}>
                                <FormControl 
                                    isRequired 
                                    isDisabled={true}
                                >
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
                                <FormControl 
                                    isRequired
                                    isInvalid={(
                                        !(vals.precio?.min(values?.precio)) ||
                                        !(vals.precio?.max(values?.precio))
                                    )}
                                >
                                    <FormControl.Label>Precio de Venta</FormControl.Label>
                                    <InputFormatNumber
                                        value={values.precio}
                                        keyboardType='decimal-pad'
                                        placeholder="Ingrese el precio de venta"
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                        onChangeText={value => setValues(state => ({...state, precio: Number(value)}))}
                                    />
                                    <FormControl.ErrorMessage>
                                        {
                                            !(vals.precio?.min(values?.precio)) && `El precio de venta no puede ser menor a $ ${(values?.max_precio * values?.minimo_reventa).toFixed(2)} ${values.moneda}`
                                        }
                                        {
                                            !(vals.precio?.max(values?.precio)) && `El precio de venta no puede ser mayor a $ ${(values?.max_precio * values?.maximo_reventa).toFixed(2)} ${values.moneda}`
                                        }
                                    </FormControl.ErrorMessage>
                                </FormControl>
                            </Box>
                        </HStack>
                        <HStack space={2} mt={4}>
                            <Box flex={1}>
                                <Button isDisabled={reventa?.estatus !== 1} isLoading={loading} bg={"red.400"} onPress={() => remove()}>Eliminar</Button>
                            </Box>
                            <Box flex={2}>
                                <Button isDisabled={reventa?.cantidad_restante < 1 || reventa?.estatus !== 1} isLoading={loading} onPress={() => update()}>Guardar Cambios</Button>
                            </Box>
                        </HStack>
                    </Box>
                </KeyboardAvoidingView>
            </BottomSheet>
        </>
    );
};
