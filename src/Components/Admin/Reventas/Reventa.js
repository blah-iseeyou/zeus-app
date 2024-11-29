import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import axios from '../../../Axios';
import { Box, Button, Divider, FormControl, Heading, HStack, Icon, KeyboardAvoidingView, Text, VStack } from 'native-base';

import moment from 'moment/moment';
import Decimal from 'decimal.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import InputFormatNumber from '../../Widgets/InputFormatNumber';

export default function (props) {

    const { reventa_id, isOpen, onClose, inversion_id } = props

    const [index, setIndex] = useState(-1)


    const [loading, setLoading] = useState(false)

    const [reventa, setReventa] = useState(null)
    const [inversion, setInversion] = useState(null)

    const [values, setValues] = useState({
        cantidad: 0,
        precio: 0,
        max_precio: 0,
        max_cantidad: 0,

        max_precio: 0,
        minimo_reventa: 0,
        maximo_reventa: 0,
        minimo_cantidad: 1,
        maximo_cantidad: 0,

        tipo_cambio: 0,
        moneda: "MXN",
        tipo: 2
    })

    const snapPoints = useMemo(() => [700], []);
    const bottomSheetRef = useRef(null)

    const getTipoCambio = () => {
        axios.get('/plantas')
            .then(res => {
                // console.log(' * * * * * * * * * ')
                // console.log(' * * * * * * * * * ')
                // console.log(' * * * * * * * * * ')
                // console.log(' * * * * * * * * * ')
                // console.log({
                //     tipo_cambio: res.data.data.tipo_cambio,
                //     minimo_reventa: res.data.data.minimo / 100 + 1,
                //     maximo_reventa: res.data.data.maximo / 100 + 1,
                //     minimo_cantidad: res.data.data.minimo_reventa,
                //     maximo_cantidad: res.data.data.maximo_reventa,
                // })
                // // console.log(res.data)
                setValues(values => ({
                    ...values,

                    tipo_cambio: res.data.data.tipo_cambio,
                    minimo_reventa: res.data.data.minimo / 100 + 1,
                    maximo_reventa: res.data.data.maximo / 100 + 1,
                    minimo_cantidad: res.data.data.minimo_reventa,
                    maximo_cantidad: res.data.data.maximo_reventa,
                    // tipo_cambio: res.data.data.tipo_cambio,
                    // minimo_reventa: res.data.data.minimo / 100 + 1,
                    // maximo_reventa: res.data.data.maximo / 100 + 1
                }))
            })
    }

    const getReventa = () => {
        axios.get('/customer/reventa', {
            params: {
                id: reventa_id
            }
        })
            .then(({ data }) => {
                setValues(values => ({
                    ...values,
                    cantidad: data.cantidad_restante,
                    precio: data.precio_reventa,
                    tipo: data.tipo
                }))
                setReventa(data)
                console.log('data.inversion_original_id', data.inversion_original_id)
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
        }).then(({ data }) => {
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


    useEffect(() => {
        // console.log('isOpen', isOpen)
        setModalStatus(isOpen)
        getTipoCambio()
        // console.log('reventa_id', reventa_id);
        if (reventa_id) {
            console.log('getReventa');
            getReventa()
        } else {
            console.log('getInversion');
            console.log('inversion_id');
            console.log('inversion_id');
            console.log('inversion_id', inversion_id);
            getInversion(inversion_id)
        }

    }, [isOpen])

    const setModalStatus = (status) =>  {
        setIndex(status ? 0 : -1)
        print("EXE")

        if (!status)
            bottomSheetRef.current.close()
    }


    editReventa = ({
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
        })
            .then(() => {
                setModalStatus(false)
                onClose()
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }



    createReventa = ({
        cantidad = values.cantidad,
        precio = values.precio,
        tipo = values.tipo
    } = values) => {
        setLoading(true)
        axios.post('/customer/reventa', {
            cantidad,
            precio,
            tipo,
            id: inversion?._id,
            reventa_id: reventa?._id,
            hacienda_id: inversion?.hacienda_id?._id,
            estatus: 1
        })
            .then(() => {
                // console.log("ASD")
                // console.log()
                setModalStatus(false)
                onClose()
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const min = precio => precio >= (values?.max_precio * values?.minimo_reventa).toFixed(2)
    const max = precio => precio <= (values?.max_precio * values?.maximo_reventa).toFixed(2)

    // console.log('inversion?.cantidad',inversion)

    return (
        <BottomSheet
            index={index}
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            onChange={e => {
                setIndex(e)
                if (e == -1) onClose()
            }}
            enablePanDownToClose={true}
        >
            <KeyboardAvoidingView height={"100%"} behavior='padding'>
                <Box flex={1} px={3} py={3}>
                    <HStack width="100%" justifyContent="space-between">
                        <Heading size={"md"}>Editar Reventa</Heading>
                    </HStack>
                    <Divider my={3} orientation={"horizontal"} />
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
                    <Divider my={3} orientation={"horizontal"} />
                    <HStack space={4}>
                        <Box flex={1}>
                            <FormControl
                                isRequired
                                isInvalid={(
                                    !(inversion?.cantidad - inversion?.cantidad_revendidas > values.cantidad)
                                    ||
                                    !(values.minimo_cantidad <= values.cantidad)
                                    ||
                                    !(values.maximo_cantidad > values.cantidad)
                                )}
                            >
                                <FormControl.Label>Cantidad de Plantas</FormControl.Label>
                                <InputFormatNumber
                                    value={values.cantidad}
                                    keyboardType='decimal-pad'
                                    placeholder="Ingrese la cantidad de plantas"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                    onChangeText={value => setValues(state => ({ ...state, cantidad: Number(value) }))}
                                />
                                <FormControl.ErrorMessage>
                                    {
                                        !(inversion?.cantidad - inversion?.cantidad_revendidas > values.cantidad) && `La cantidad de plantas no puede ser mayor a ${(inversion?.cantidad - inversion?.cantidad_revendidas)}`
                                    }
                                    {
                                        !(values.minimo_cantidad <= values.cantidad) && `La cantidad de plantas no puede ser menor a ${values.minimo_cantidad}`
                                    }
                                    {
                                        !(values.maximo_cantidad > values.cantidad) && `La cantidad de plantas no puede ser mayor a ${values.maximo_cantidad}`
                                    }
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Box>
                        <Box flex={1}>
                            <FormControl
                                isRequired
                                isInvalid={(
                                    !(min(values?.precio)) ||
                                    !(max(values?.precio))
                                )}
                            >
                                <FormControl.Label>Precio de Venta</FormControl.Label>
                                <InputFormatNumber
                                    value={values.precio}
                                    keyboardType='decimal-pad'
                                    placeholder="Ingrese el precio de venta"
                                    // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    // parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/\.(\d{2})\d+/, '.$1')}
                                    parser={(value) => value?.replace(/\$\s?|,/g, '')}
                                    onChangeText={value => setValues(state => ({ ...state, precio: Number(value) }))}
                                />
                                <FormControl.ErrorMessage>
                                    {
                                        !(min(values?.precio)) && `El precio de venta no puede ser menor a $ ${(values?.max_precio * values?.minimo_reventa).toFixed(2)} ${values.moneda}`
                                    }
                                    {
                                        !(max(values?.precio)) && `El precio de venta no puede ser mayor a $ ${(values?.max_precio * values?.maximo_reventa).toFixed(2)} ${values.moneda}`
                                    }
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Box>
                    </HStack>
                    <HStack space={2} mt={4}>
                        <Box flex={2}>
                            <Button
                            // isDisabled={
                            //     !(
                            //         (inversion?.cantidad - inversion?.cantidad_revendidas > values.cantidad)
                            //         &&
                            //         (values.minimo_cantidad <= values.cantidad)
                            //         &&
                            //         (values.maximo_cantidad > values.cantidad)
                            //         &&
                            //         (min(values?.precio))
                            //         &&
                            //         (max(values?.precio))
                            //     )
                            // }
                            isLoading={loading}
                            

                            onPress={() => {

                                setModalStatus(false)
                                if (reventa_id) {
                                    // console.log('SI')
                                    editReventa(values)
                                } else {
                                    // console.log('NO')
                                    createReventa(values)
                                }
                                // console.log('X X X X X');
                                // onFinish()
                            }}
                        >Guardar Cambios</Button>
                        </Box>
                    </HStack>
                </Box>
            </KeyboardAvoidingView>
        </BottomSheet>
    );
};
