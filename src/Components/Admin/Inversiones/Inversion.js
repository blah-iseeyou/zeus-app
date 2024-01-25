import React, { useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import axios from '../../../Axios';
import { Box, Heading, HStack, Text, VStack, Button, useToast, AlertDialog } from 'native-base';
import moment from 'moment/moment';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../Header';
import { ScrollView } from 'react-native-gesture-handler';
import Decimal from 'decimal.js';
import Reventa from '../Reventas/Reventa';

export default function (props) {
    const navigation = useNavigation()
    const toast = useToast()

    const { route } = props
    const { inversion_id } = route.params

    const [cantidades, setCantidades] = useState({})
    const [inversion, setInversion] = useState(null)

    const [vista, setVista] = useState('transacciones')

    const [reventaId, setReventaId] = useState(null)

    const [isOpenReventa, setIsOpenReventa] = useState(null)

    const reventasRef = useRef();


    useEffect(() => {
        getInversion()
        getCantidades()
    }, [inversion_id])

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

    const getCantidades = () => {
        axios.get('/inversion/cantidades', {
            params: {
                inversion_id
            }
        })
            .then(({ data }) => {
                console.log(data)
                data.data.disponibles = Number(data.data.total - data.data.revendidas)
                // this.setState({ cantidades: data.data })
                setCantidades(data.data)
                // cantidades, setCantidades
            })
            .catch(err => {
                console.log('NO SE PUDO CARGAR', err);
            })
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

    const renderView = () => {
        console.log("vista", vista)
        switch (vista) {
            case 'transacciones':
                return <Transacciones
                    inversion_id={inversion_id}
                    reventaId={reventaId}
                    setReventaId={setReventaId}
                    setIsOpenReventa={setIsOpenReventa}
                    toast={toast}
                // update={update}
                />

            case 'reventas':
                return <Reventas
                    ref={reventasRef}
                    inversion_id={inversion_id}
                    reventaId={reventaId}
                    setIsOpenReventa={setIsOpenReventa}
                    setReventaId={setReventaId}
                    toast={toast}
                // update={update}
                />

            default:
                return <Transacciones
                    inversion_id={inversion_id}
                    reventaId={reventaId}
                    setReventaId={setReventaId}
                    setIsOpenReventa={setIsOpenReventa}
                    toast={toast}
                // update={update}
                />
        }
    }
    return (
        <Box variant={"layout"} flex="1"  >
            <SafeAreaView flex={1}>
                <ScrollView>
                    <Header />
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
                                {inversion?.cantidad_revendidas > 0 ? (
                                    <>
                                        <Heading textAlign="right" size={"xs"}>{cantidades.total} plantas en total</Heading>
                                        <Heading textAlign="right" size={"xs"}>{cantidades.revendidas} plantas reventa.</Heading>
                                        <Heading textAlign="right" size={"xs"}>{cantidades.vendidas} plantas vendidas. </Heading>
                                        <Heading textAlign="right" size={"xs"}>{cantidades.pendientes ?? 0} plantas pendientes</Heading>
                                        <Heading textAlign="right" size={"xs"}>{cantidades.disponibles} plantas disponibles </Heading>
                                    </>
                                ) : (
                                    <Heading textAlign="right" size={"xs"}>{inversion?.cantidad}</Heading>
                                )}
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
                        <HStack justifyContent={"space-between"} mt={'4'}>
                            <Button.Group
                                isAttached
                                size="sm">
                                <Button
                                    onPress={() => setVista('transacciones')}
                                    variant={(vista != 'transacciones') ? 'outline' : null}//{'outline'}
                                    bg={(vista != 'transacciones') ? 'transparent' : null}
                                    _text={{ fontSize: 14 }}>Transacciones</Button>
                                <Button
                                    onPress={() => setVista('reventas')}
                                    variant={(vista != 'reventas') ? 'outline' : null}//{'outline'}
                                    bg={(vista != 'reventas') ? 'transparent' : null}
                                    _text={{ fontSize: 14 }}>Reventas</Button>
                            </Button.Group>
                            <Button
                                size="sm"
                                variant={"solid"}
                                _text={{ fontSize: 14 }}
                                px="2"
                                isDisabled={!(inversion?.estatus == 2 || inversion?.estatus == 3) }
                                onPress={() => {
                                    setIsOpenReventa(true)
                                    setReventaId(null)
                                }}
                            >
                                Vender Plantas
                            </Button>
                        </HStack>
                        {renderView()}
                        {/* <Box flex={1}>
                    </Box> */}
                    </Box>
                </ScrollView>
            </SafeAreaView>
            <Reventa
                isOpen={isOpenReventa}
                reventa_id={reventaId}
                inversion_id={inversion_id}
                onClose={() => {
                    setIsOpenReventa(false)
                    setReventaId(null)
                    if (reventasRef.current) 
                        reventasRef.current.getReventas();

                }}
            />
        </Box>
    );
}


function Transacciones({ inversion_id, update }) {

    const [transacciones, setTransacciones] = useState({
        data: [],
        page: 1,
        limit: 20,

        pages: 0,
        total: 0
    })

    const getTransacciones = ({ page, limit } = transacciones) => {

        console.log("TRANSACCIONES, ", inversion_id)
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

                console.log('NO SE PUDO CARGAR', error);
            })
    }

    useState(() => {

        getTransacciones()
        console.log('inversion_id', inversion_id);
        console.log('update', update);
    }, [inversion_id, update])

    return <>
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
    </>
}


// function Reventas({ inversion_id, setReventaId, toast }) {

const Reventas = forwardRef(({ inversion_id, setReventaId, toast, setIsOpenReventa, }, ref) => {

    const [reventas, setReventas] = useState({
        data: [],
        page: 1,
        limit: 20,

        pages: 0,
        total: 0
    })

    const getReventas = ({ page, limit } = reventas) => {
        axios.get('/customer/reventas', {
            params: {
                page,
                limit,
                inversion_id
            }
        })
            .then(({ data }) => {
                // console.log("response.data.data", response.data)
                setReventas(data)
            })
            .catch(error => {
                console.log('NO SE PUDO CARGAR', error);
                return toast.show({
                    duration: 2500,
                    render: () => {
                        return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>No fue posible obtener las reventas</Box>;
                    },
                    top: 10
                })
            })
    }


    const deleteReventa = () => {
        axios.delete('/reventa', { params: { id: deleteReventaItem._id } })
            .then((response) => {
                return toast.show({
                    duration: 1000,
                    render: () => {
                        return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>Reventa Eliminada</Box>;
                    },
                    top: 10
                })
            })
            .catch(error => {
                console.log('NO SE PUDO CARGAR', error);
                return toast.show({
                    duration: 2500,
                    render: () => {
                        return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>No fue posible obtener las reventas</Box>;
                    },
                    top: 10
                })
            })
            .finally(e => getReventas())
    }

    useImperativeHandle(ref, () => ({
        getReventas
    }));


    useState(() => {
        getReventas()
    }, [inversion_id])

    const [deleteReventaItem, setDeleteReventa] = React.useState(false);


    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = React.useRef(null);

    return <>
        <Heading size="sm" mt={5} mb={2}>Reventas Registradas</Heading>
        {(reventas.total < 1) ? <Box textAlign="center" w="100%">
            No hay Reventas Registradas
        </Box> : null}
        {reventas.data?.map((item) => <VStack mt={3} pb={2} borderBottomColor="gray.200" borderBottomWidth={1}>
            <HStack justifyContent={"space-between"}>
                <Text>{moment(item.fecha).format('DD-MM-YYYY')}</Text>
                <Text>{item.cantidad_vendida} / {item.cantidad} planta{item.cantidad > 1 && 's'}</Text>
            </HStack>
            <HStack justifyContent={"space-between"} mt={1}>
                <Text fontSize={12}>{item.cantidad ?? 0} en total</Text>
                <Text fontSize={12}>{item.cantidad_restante ?? 0} para reventa</Text>
                <Text fontSize={12}>{item.cantidad_vendida ?? 0} vendidas</Text>
            </HStack>
            <HStack justifyContent={"space-between"} mt={1}>
                <Text fontSize={12}>
                    Costo por Planta: ${
                        Decimal(item.precio_reventa).toFixed(2).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        })
                    }
                </Text>
                <Text fontSize={12}>
                    Total: ${
                        Decimal(item.precio_reventa).mul(item.cantidad).toFixed(2).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        })
                    }
                </Text>
            </HStack>
            <HStack justifyContent={"center"} mt={1} size={2} space={2}>
                <Button size={'sm'} onPress={() => {
                    setIsOpenReventa(true)
                    setReventaId(item._id)
                }}> Editar</Button>
                <Button
                    size={'sm'}
                    background={'red.500'}
                    isDisabled={item.cantidad_vendida > 0}
                    onPress={() => {
                        setIsOpen(true)
                        setDeleteReventa(item)
                        // deleteReventa(item)
                    }}
                >Eliminar</Button>
            </HStack>
            <AlertDialog
                leastDestructiveRef={cancelRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Elimina Reventa</AlertDialog.Header>
                    <AlertDialog.Body>
                        ¿Deseas eliminar esta reventa?
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button variant="unstyled" colorScheme="coolGray"
                                onPress={onClose} ref={cancelRef}
                            >
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="danger" onPress={() => {
                                    setIsOpen(false)
                                    deleteReventa()
                                }}
                            >
                                Eliminar
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </VStack>)}
    </>
})