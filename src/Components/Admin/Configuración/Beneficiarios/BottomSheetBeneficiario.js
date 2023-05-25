import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';



import { Box, FormControl, Heading, HStack, Input, Text, VStack, Button, useToast } from 'native-base';
import moment from 'moment/moment';

import axios from '../../../../Axios';

// bottomSheetRef.current.forceClose()

export default function (props) {
    const { beneficiario_id, onClose } = props
    const [index, setIndex] = useState(-1)

    const toast = useToast()

    const [beneficiarioId, setBeneficiarioId] = useState(null)
    const [beneficiario, setBeneficiario] = useState({})
    const [errors, setErrors] = useState({})


    const snapPoints = useMemo(() => ['80%'], []);


    const bottomSheetRef = useRef(null);

    const getBeneficiario = () => {
        axios.get('/customer/beneficiario', { params: { id: beneficiario_id } })
            .then(({ data }) => {

                console.log('data.data',)
                setBeneficiario(data)
            })
            .catch(error => {
                console.log("error", error)
            })
        // .finally(() => this.setState({ loading: false }))
    }

    /**
     * @memberof ModalCuenta
     * @method onFinish
     * @description Cuando se envia el formulario
     * 
     */
    const onSubmit = () => {
        if (beneficiario_id && typeof beneficiario_id !== "boolean") {
            // console.log("UPD");
            updateBeneficiario()
        } else {
            console.log("ADD");
            addBeneficiario()
        }
    }


    /**
     * @memberof ModalCuenta
     * @method addBeneficiario
     * @description Agregamos una Cuenta
     */
    const addBeneficiario = () => {
        console.log("Asd", beneficiario)
        axios.post('/customer/beneficiario', beneficiario)
            .then(response => {
                // console.log("A", response.data)
                setBeneficiarioId(null)
                setBeneficiario({})
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
     * @method updateBeneficiario
     * @description Actualizamos los valores de la Cuenta
     */
    const updateBeneficiario = (values) => {
        axios.put('/customer/beneficiario', {
            ...beneficiario,
            
            beneficiario_id: beneficiario_id,
        })
            .then(response => {
                // message.success('Cuenta Actualizada')
                // this.props.onCancel()
                console.log("ASd")
                onClose()
                setBeneficiarioId(null)
                setBeneficiario({})
                bottomSheetRef.current.forceClose()
            })
            .catch(error => {
                console.log('e', error);
                // message.error('Error al actualizar la Cuenta')
                toast.show({
                    description: "Hubo un error al guardar"
                })
            })
    }


    if (beneficiario_id && beneficiarioId !== beneficiario_id) {

        if (typeof beneficiario_id != "boolean")
            getBeneficiario()

        setBeneficiarioId(beneficiario_id)
        setIndex(0)
    }

    const setData = (valuesForm) => {
        setBeneficiario(valuesForm)
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
                        setBeneficiarioId(null)
                        setBeneficiario({})
                    }
                }}
                enablePanDownToClose={true}
            >
                <BottomSheetScrollView>
                    <Box mx={5}>
                        <HStack justifyContent={"space-between"}>
                            <Box>
                                <Heading size={"sm"}>Cuenta de Deposito</Heading>
                            </Box>
                        </HStack>
                        <VStack mt={4} justifyContent="space-between">

                            {/* nombre
                        rfc
                        curp
                        telefono
                        email
                        direccion":"5"} */}

                            <FormControl isRequired isInvalid={errors['nombre']} my={2}>
                                <FormControl.Label _text={{ bold: true }}>Nombre Completo del Beneficiario</FormControl.Label>
                                <Input value={beneficiario.nombre} onChangeText={nombre => setData({ ...beneficiario, nombre })} />
                                {errors['nombre'] && <FormControl.ErrorMessage>{errors['nombre']}</FormControl.ErrorMessage>}
                            </FormControl>

                            <FormControl isRequired isInvalid={errors['rfc']} my={2}>
                                <FormControl.Label _text={{ bold: true }}>RFC del Beneficiario</FormControl.Label>
                                <Input value={beneficiario.rfc} onChangeText={rfc => setData({ ...beneficiario, rfc })} />
                                {errors['rfc'] && <FormControl.ErrorMessage>{errors['rfc']}</FormControl.ErrorMessage>}
                            </FormControl>

                            <FormControl isRequired isInvalid={errors['curp']} my={2}>
                                <FormControl.Label _text={{ bold: true }}>CURP del Beneficiario</FormControl.Label>
                                <Input value={beneficiario.curp} onChangeText={curp => setData({ ...beneficiario, curp })} />
                                {errors['curp'] && <FormControl.ErrorMessage>{errors['curp']}</FormControl.ErrorMessage>}
                            </FormControl>

                            <FormControl isRequired isInvalid={errors['telefono']} my={2}>
                                <FormControl.Label _text={{ bold: true }}>Número Telefónico</FormControl.Label>
                                <Input value={beneficiario.telefono} onChangeText={telefono => setData({ ...beneficiario, telefono })} />
                                {errors['telefono'] && <FormControl.ErrorMessage>{errors['telefono']}</FormControl.ErrorMessage>}
                            </FormControl>

                            <FormControl isRequired isInvalid={errors['email']} my={2}>
                                <FormControl.Label _text={{ bold: true }}>Correo Electrónico</FormControl.Label>
                                <Input value={beneficiario.email} onChangeText={email => setData({ ...beneficiario, email })} />
                                {errors['email'] && <FormControl.ErrorMessage>{errors['email']}</FormControl.ErrorMessage>}
                            </FormControl>

                            <FormControl isRequired isInvalid={errors['direccion']} my={2}>
                                <FormControl.Label _text={{ bold: true }}>Dirección</FormControl.Label>
                                <Input value={beneficiario.direccion} onChangeText={direccion => setData({ ...beneficiario, direccion })} />
                                {errors['direccion'] && <FormControl.ErrorMessage>{errors['direccion']}</FormControl.ErrorMessage>}
                            </FormControl>

                        </VStack>
                        <VStack mt={4} justifyContent="space-between">
                            <Button onPress={onSubmit} mt="5" colorScheme="cyan">
                                Submit
                            </Button>
                        </VStack>
                    </Box>
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    );
}