import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';



import { Box, FormControl, Heading, HStack, Text, VStack, Button, useToast } from 'native-base';
import moment from 'moment/moment';
import { Input } from '../../../Widgets/Input';

import axios from '../../../../Axios';

// bottomSheetRef.current.forceClose()

export default function (props) {
    const { cuenta_id, onClose } = props
    const [index, setIndex] = useState(-1)

    const toast = useToast()

    const [cuentaId, setCuentaId] = useState(null)
    const [cuenta, setCuenta] = useState({})
    const [errors, setErrors] = useState({})


    const snapPoints = useMemo(() => ['80%'], []);


    const bottomSheetRef = useRef(null);

    const getCuenta = () => {
        axios.get('/cuenta', { params: { id: cuenta_id } })
            .then(({ data }) => {
                setCuenta(data.data)
            })
            .catch(error => {
                console.log("error", error)

            })
            .finally(() => this.setState({ loading: false }))
    }

    /**
     * @memberof ModalCuenta
     * @method onFinish
     * @description Cuando se envia el formulario
     * 
     */
    const onSubmit = () => {
        if (cuenta_id && typeof cuenta_id !== "boolean") {
            console.log("UPD");
            updateCuenta()
        } else {
            console.log("ADD");
            addCuenta()
        }
    }


    /**
     * @memberof ModalCuenta
     * @method addCuenta
     * @description Agregamos una Cuenta
     */
    const addCuenta = () => {
        console.log("Asd", cuenta)
        axios.post('/cuenta/add', cuenta)
            .then(response => {

                console.log("A", response.data)
                setCuentaId(null)
                setCuenta({})
                bottomSheetRef.current.forceClose()
                onClose()
            })
            .catch(error => {
                console.log("err", error)
                toast.show({
                    description: "Hubo un error al guardar"
                })
            })
    }

    /**
     * @memberof ModalCuenta
     * @method updateCuenta
     * @description Actualizamos los valores de la Cuenta
     */
    const updateCuenta = (values) => {
        axios.put('/cuenta/update', {
            ...cuenta,
            id: cuenta_id,
        })
            .then(response => {
                // message.success('Cuenta Actualizada')
                // this.props.onCancel()
                console.log("ASd")
                onClose()
                setCuentaId(null)
                setCuenta({})
                bottomSheetRef.current.forceClose()
            })
            .catch(error => {
                // message.error('Error al actualizar la Cuenta')
                toast.show({
                    description: "Hubo un error al guardar"
                })

            })
            // .finally(() => this.setState({ loading: false }))
    }


    if (cuenta_id && cuentaId !== cuenta_id) {

        if (typeof cuenta_id != "boolean")
            getCuenta()

        setCuentaId(cuenta_id)
        setIndex(0)
    }

    const setData = (valuesForm) => {
        setCuenta(valuesForm)
    }

    return (
        <>

            <BottomSheet
                ref={bottomSheetRef}
                index={index}
                snapPoints={snapPoints}
                onChange={e => {
                    setIndex(e)

                    console.log("E", e)
                    if (e == -1) {
                        onClose()
                        setCuentaId(null)
                        setCuenta({})
                    }
                }}
                enablePanDownToClose={true}
            >
                <Box mx={5}>
                    <HStack justifyContent={"space-between"}>
                        <Box>
                            <Heading size={"sm"}>Cuenta de Deposito</Heading>
                        </Box>
                    </HStack>
                    <VStack mt={4} justifyContent="space-between">
                        <FormControl isRequired isInvalid={errors['nombre']} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Nombre de la Cuenta</FormControl.Label>
                            <Input placeholder="Cuenta Retorno" value={cuenta.nombre} onChangeText={value => setData({ ...cuenta, nombre: value })} />
                            {errors['nombre'] && <FormControl.ErrorMessage>{errors['nombre']}</FormControl.ErrorMessage>}
                        </FormControl>
                        <FormControl isRequired isInvalid={errors['titular']} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Titular de la Cuenta</FormControl.Label>
                            <Input placeholder="Juan Ruiz" value={cuenta.titular} onChangeText={value => setData({ ...cuenta, titular: value })} />
                            {errors['titular'] && <FormControl.ErrorMessage>{errors['titular']}</FormControl.ErrorMessage>}
                        </FormControl>
                        <FormControl isRequired isInvalid={errors['banco']} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Banco</FormControl.Label>
                            <Input placeholder="Banco SA" value={cuenta.banco} onChangeText={value => setData({ ...cuenta, banco: value })} />
                            {errors['banco'] && <FormControl.ErrorMessage>{errors['banco']}</FormControl.ErrorMessage>}
                        </FormControl>
                        <FormControl isRequired isInvalid={errors['cuenta']} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Número / CLABE de Cuenta</FormControl.Label>
                            <Input placeholder="120923123" value={cuenta.cuenta} onChangeText={value => setData({ ...cuenta, cuenta: value })} />
                            {errors['cuenta'] && <FormControl.ErrorMessage>{errors['cuenta']}</FormControl.ErrorMessage>}
                        </FormControl>
                    </VStack>
                    <VStack mt={4} justifyContent="space-between">
                        <Button onPress={onSubmit} mt="5" colorScheme="cyan">
                            Submit
                        </Button>
                    </VStack>
                </Box>
            </BottomSheet>
        </>
    );
}