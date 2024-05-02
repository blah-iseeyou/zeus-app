import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Dimensions, ScrollView, ActivityIndicator, Linking, Modal as ModalRN } from 'react-native';
// import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import {
    Box,
    Heading,
    HStack,
    Icon,
    Button,
    Image,
    Text,
    VStack,
    Input,
    FormControl,
    Pressable,
    Modal,
    useToast
} from 'native-base';
import moment from 'moment/moment';
import Color from 'color';
import { Path } from 'react-native-svg';
import AntDesign from "react-native-vector-icons/AntDesign";
import Decimal from 'decimal.js';

import axios from '../../../Axios';

import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function Pagar(props) {

    const {


        moneda, setMoneda,
        plantas, setPlantas,

        contrato, // setContrato,
        // hacienda_id,
        // hacienda,
        setCompra, compra,

        onClose, isOpen,
        inversion_id,
        // setCompra, comprasetCompra

    } = props

    const [inversion, setInversion] = useState()
    const [loading, setLoading] = useState()

    /* Información del Pago con Tarjeta */
    const [first_name, set_first_name] = useState('')
    const [last_name, set_last_name] = useState('')
    const [card_number, set_card_number] = useState('')
    const [expiration_date_month, set_expiration_date_month] = useState('')
    const [expiration_date_year, set_expiration_date_year] = useState('')
    const [card_code, set_card_code] = useState('')

    const [error, setError] = useState()


    const toast = useToast()


    const getInversion = () => {
        setLoading(true)
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
            .finally(e => setLoading(false))
    }



    let pagoTarjeta = () => {
        Keyboard.dismiss()
        setLoading(true)
        axios.post('/authorizenet/pago', {
            first_name,
            last_name,
            card_number,
            expiration_date_month,
            expiration_date_year,
            card_code,
            inversion_id: inversion?._id

        })
            .then(({ data }) => {
                console.log("DATA")
                console.log("DATA")
                console.log(data)
                onClose()
                toast.show({
                    duration: 5000,
                    placement: "bottom",
                    render: () => {
                        return <Box p={3}>
                            <Box bg="green.500" px="2" py="1" rounded="sm" mb={5} borderRadius={5}>Hemos procesado su compra correctamente, revise su correo electronico o ingrese a inversiones</Box>
                        </Box>;
                    },
                    top: 10
                })
            })
            .catch(error => {
                console.log("error", error?.response?.data)
                return Toast.show({
                    type: 'fullError',
                    position: "bottom",
                    bottomOffset: windowHeight * 0.2,
                    text1: 'Error al procesar el pago',
                    text2: error?.response?.data?.descripcion // ?? "Hubo un error al pagar",
                });
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        getInversion()
    }, [])

    console.log("INVE", inversion)

    return <ModalRN
        visible={isOpen}
        isOpen={isOpen}
        animationPreset='slide'
        animationType='slide'
        onRequestClose={onClose}
        size={'full'}
        transparent={true}
    >
        <Box width={'100%'} height={'100%'} background={'rgba(0, 0, 0, 0.6)'} position={'absolute'} />
        <ScrollView style={{ flex: 1 }}>
            <Modal.Content maxW={windowWidth * 0.9} margin={'auto'} mt={windowHeight * 0.05} mb={windowHeight * 0.05}>
                <Modal.CloseButton
                    isDisabled={loading}
                    onPress={onClose} />
                <Modal.Header>
                    <Heading size={'sm'}>Pago con Tarjeta de</Heading>
                    <Heading fontWeight={'normal'} size={'xs'}>Crédito o Debito</Heading>
                </Modal.Header>
                <Modal.Body >
                    <Box px={3}>
                       {!loading &&  <>
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontSize="sm" fontWeight={"bold"} color="primary.900">Folio</Text>
                                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>
                                        {inversion?.folio}
                                        {/* folio */}
                                    </Text>
                                </HStack>
                            </Box>
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontSize="sm" fontWeight={"bold"} color="primary.900">Cantidad</Text>
                                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>
                                        {Decimal(inversion?.cantidad ?? 0).toNumber()?.toLocaleString('en-US', {})}
                                    </Text>
                                </HStack>
                            </Box>
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontSize="sm" fontWeight={"bold"} color="primary.900">Precio </Text>
                                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>
                                        {Decimal(inversion?.precio_planta ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        <Text fontSize={"xs"}>{inversion?.moneda}</Text>
                                    </Text>
                                </HStack>
                            </Box>
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontSize="md" color="primary.900" fontWeight={"bold"}>Total</Text>
                                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>
                                        {Decimal(inversion?.monto ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        <Text fontSize={"xs"}>{inversion?.moneda}</Text>
                                    </Text>
                                </HStack>
                            </Box>
                        </>}
                        <VStack mt={5}>
                            <Box>
                                <FormControl>
                                    <Input autoComplete='name' value={first_name} onChangeText={set_first_name} placeholder="Nombre(s) del Titular" />
                                </FormControl>
                            </Box>
                            <Box mt={3}>
                                <FormControl>
                                    <Input autoComplete='name-middle' value={last_name} onChangeText={set_last_name} placeholder="Apellido(s) del Titular" />
                                </FormControl>
                            </Box>
                        </VStack>
                        <FormControl mt={3}>
                            <Input autoComplete='cc-number' keyboardType='number-pad' value={card_number} onChangeText={set_card_number} placeholder="Número de Tarjeta de credito" />
                        </FormControl>
                        <HStack mt={3}>
                            <Box w={"33%"}>
                                <FormControl>
                                    <Input autoComplete='cc-exp-month' keyboardType='number-pad' value={expiration_date_month} onChangeText={set_expiration_date_month} placeholder="Mes (MM)" />
                                </FormControl>
                            </Box>
                            <Box w={"33%"} px={2}>
                                <FormControl>
                                    <Input autoComplete='cc-exp-year' keyboardType='number-pad' value={expiration_date_year} onChangeText={set_expiration_date_year} placeholder="Año (YYYY)" />
                                </FormControl>
                            </Box>
                            <Box w={"33%"}>
                                <FormControl>
                                    <Input autoComplete='cc-csc' type='password' value={card_code} onChangeText={set_card_code} placeholder="CVV / CVC" />
                                </FormControl>
                            </Box>
                        </HStack>
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button isLoading={loading} colorScheme="danger" onPress={() => onClose()}>Cerrar</Button>
                        <Button isLoading={loading} onPress={pagoTarjeta}>Aceptar Contrato</Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </ScrollView>
        <Toast config={{
            // /*
            //   Overwrite 'success' type,
            //   by modifying the existing `BaseToast` component
            // */
            // success: (props) => (
            //   <BaseToast
            //     {...props}
            //     style={{ borderLeftColor: 'pink' }}
            //     contentContainerStyle={{ paddingHorizontal: 15 }}
            //     text1Style={{
            //       fontSize: 15,
            //       fontWeight: '400'
            //     }}
            //   />
            // ),
            // /*
            //   Overwrite 'error' type,
            //   by modifying the existing `ErrorToast` component
            // */
            // error: (props) => (
            //   <ErrorToast
            //     {...props}
            //     text1Style={{
            //       fontSize: 17
            //     }}
            //     text2Style={{
            //       fontSize: 15
            //     }}
            //   />
            // ),
            /*
              Or create a completely new type - `tomatoToast`,
              building the layout from scratch.
          
              I can consume any custom `props` I want.
              They will be passed when calling the `show` method (see below)
            */
            fullError: ({ text1, text2, props }) => (
                <Box px={5}>
                    <Box backgroundColor="red.600" p={"1.5"} borderRadius={5}>
                        <Text style={{ color: "white" }}>{text1}</Text>
                        {text2 && <Text style={{ color: "white", }} fontSize="xs">{text2}</Text>}
                    </Box>
                </Box>
            )
        }}></Toast>
    </ModalRN >
}



function ModalPago(props) {

    const { hacienda_id, isOpen, onClose } = props

    console.log("isOpen", props)
    return (
        isOpen && <Pagar {...props} />
    );
};

export default ModalPago;