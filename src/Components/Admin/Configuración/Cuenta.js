import React, { useContext, useEffect, useState, } from "react";
import { Dimensions, } from "react-native"
import {
    HStack,
    VStack,
    Text,
    Box,
    Heading,
    Icon,
    FlatList,
    Spacer,
    Pressable,
    ScrollView,
    FormControl,
    Input,
    Button,
    Select
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment"

import axios from "../../../Axios"
import Header from "../../Header"
import { SetUser, User } from "../../../Contexts/User"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";


export default function SignIn({ route, navigation }) {

    const [paises, setPaises] = useState([])
    const [estados, setEstados] = useState([])

    const [formData, setFormData] = React.useState({});
    const [errors, setErrors] = React.useState({});


    useEffect(() => {
        getCliente()
        getPaises()
    }, [])

    const onSubmit = () => {
        validate() ? update() : console.log('Validation Failed');
    }

    const setData = (valuesForm) => {
        setFormData(valuesForm)
    }

    const validate = () => {
        // if (formData.name === undefined) {
        //     setErrors({
        //         ...errors,
        //         name: 'Name is required'
        //     });
        //     return false;
        // } else if (formData.name.length < 3) {
        //     setErrors({
        //         ...errors,
        //         name: 'Name is too short'
        //     });
        //     return false;
        // }

        return true;
    }



    /**
    * @memberOf FormCliente
    * @method getCliente
    * @param {string} cliente_id Identificador del cliente
    * @description Obtiene la informacion de un cliente
    */
    const getCliente = () => {
        // this.setState({loading: true})
        axios.get('/customer/cliente')
            .then(({ data }) => {
                setFormData(data.cliente)
                getEstados(data?.cliente?.pais_id)
            })
            .catch(error => {

            })
    }

    /**
    * @memberOf FormCliente
    * @method getPaises
    * @description obtiene una lista de los paises
    */
    const getPaises = () => {
        axios.get('/paises')
            .then(({ data }) => {
                setPaises(data.data)
            })
            .catch(error => {

            })
    }

    /**
    * @memberOf FormCliente
    * @method getEstados
    * @description obtiene una lista de los estados
    */
    const getEstados = (pais_id) => {
        axios.get('/estados', {
            params: { pais_id }
        })
            .then(({ data }) => {
                setEstados(data.data)
            })
            .catch(error => {

            })
    }

    /**
    * @memberOf FormCliente
    * @method updateCliente
    * @param {object} cliente El objeto cliente
    * @description Actualiza la informacion de un cliente
    */
    const update = cliente => {
        axios.post('/customer/cliente', formData)
            .then(response => {

                // message.success('Se ha guardado exitosamente.')
                // this.props.onClose()
            })
            .catch(error => {
                // console.log("error", error);
                // message.error(error.response?.data?.message ?? "Ha ocurrido un error al actualizar la información.")
            })

    }

    return (
        <Box variant={"layout"} flex="1"  >
            <SafeAreaView flex={1}>
                <Header />
                <ScrollView>
                    <Box px="4" mt="4" mb="5" space="9">
                        <Text fontSize="xl" textAlign="center" my={2}>Información Personal</Text>
                        <FormControl isRequired isInvalid={'nombre' in errors}>
                            <FormControl.Label _text={{ bold: true }}>Nombres</FormControl.Label>
                            <Input placeholder="Juan" value={formData.nombre} onChangeText={value => setData({ ...formData, nombre: value })} />
                            {'nombre' in errors ? <FormControl.ErrorMessage>{errors['nombre']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'apellido_paterno' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Apellido Paterno</FormControl.Label>
                            <Input placeholder="Ruiz" value={formData.apellido_paterno} onChangeText={value => setData({ ...formData, apellido_paterno: value })} />
                            {'apellido_paterno' in errors ? <FormControl.ErrorMessage>{errors['apellido_paterno']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'apellido_materno' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Apellido Materno</FormControl.Label>
                            <Input placeholder="Perez" value={formData.apellido_materno} onChangeText={value => setData({ ...formData, apellido_materno: value })} />
                            {'apellido_materno' in errors ? <FormControl.ErrorMessage>{errors['apellido_materno']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <Text fontSize="xl" textAlign="center" my={2}>Información de Contacto</Text>

                        <FormControl isRequired isInvalid={'telefono' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Telefono</FormControl.Label>
                            <Input placeholder="18456987" value={formData.telefono} onChangeText={value => setData({ ...formData, telefono: value })} />
                            {'telefono' in errors ? <FormControl.ErrorMessage>{errors['telefono']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'email' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Email</FormControl.Label>
                            <Input placeholder="you@example.com" value={formData.email} onChangeText={value => setData({ ...formData, email: value })} />
                            {'email' in errors ? <FormControl.ErrorMessage>{errors['email']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <Text fontSize="xl" textAlign="center" my={2}>Dirección</Text>

                        <FormControl isRequired isInvalid={'calles' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Calles</FormControl.Label>
                            <Input placeholder="Soledad" value={formData.calles} onChangeText={value => setData({ ...formData, calles: value })} />
                            {'calles' in errors ? <FormControl.ErrorMessage>{errors['calles']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'numero' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Número</FormControl.Label>
                            <Input placeholder="#1850" value={formData.numero} onChangeText={value => setData({ ...formData, numero: value })} />
                            {'numero' in errors ? <FormControl.ErrorMessage>{errors['numero']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'codigo_postal' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Código Postal</FormControl.Label>
                            <Input placeholder="58413" value={formData.codigo_postal} onChangeText={value => setData({ ...formData, codigo_postal: value })} />
                            {'codigo_postal' in errors ? <FormControl.ErrorMessage>{errors['codigo_postal']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'pais_id' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Pais</FormControl.Label>
                            <Select
                                placeholder="México"
                                selectedValue={formData.pais_id}
                                onValueChange={value => {

                                    let updateValues = {
                                        ...formData,
                                        pais_id: value
                                    }

                                    if (value !== formData?.pais_id)
                                        delete updateValues['estado_id']

                                    getEstados(value)
                                    setData(updateValues)
                                }}
                            >
                                {paises.map(({ _id, nombre, nombre_es }) => <Select.Item label={nombre_es || nombre} value={_id} />)}
                            </Select>
                            {'pais_id' in errors ? <FormControl.ErrorMessage>{errors['pais_id']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'estado_id' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Estado</FormControl.Label>
                            <Select
                                placeholder="Ciudad de México"
                                onValueChange={value => setData({ ...formData, estado_id: value })}
                                selectedValue={formData.estado_id}
                            >
                                {estados.map(({ _id, nombre, nombre_es }) => <Select.Item label={nombre_es || nombre} value={_id} />)}
                            </Select>
                            {'estado_id' in errors ? <FormControl.ErrorMessage>{errors['estado_id']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <FormControl isRequired isInvalid={'ciudad' in errors} my={2}>
                            <FormControl.Label _text={{ bold: true }}>Ciudad</FormControl.Label>
                            <Input placeholder="John" value={formData.ciudad} onChangeText={value => setData({ ...formData, ciudad: value })} />
                            {'ciudad' in errors ? <FormControl.ErrorMessage>{errors['ciudad']}</FormControl.ErrorMessage> : null}
                        </FormControl>

                        <Button onPress={onSubmit} mt="5" colorScheme="cyan">
                            Submit
                        </Button>

                    </Box>
                </ScrollView>
            </SafeAreaView>
        </Box>
    );
}
// apellido_materno
// apellido_paterno
// calles
// ciudad
// codigo_postal
// email
// estado_id
// fecha_nacimiento
// nombre
// numero
// pais_id
// telefono
