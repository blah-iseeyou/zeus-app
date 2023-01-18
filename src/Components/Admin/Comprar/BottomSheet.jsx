import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Modal, Keyboard} from 'react-native';
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import { Box, Heading, HStack, Icon, Button, Image, Text, VStack, Input, FormControl, WarningOutlineIcon, Checkbox, ScrollView, Pressable, useToast } from 'native-base';
import moment from 'moment/moment';
import Color from 'color';
import { Path } from 'react-native-svg';
import AntDesign from "react-native-vector-icons/AntDesign";
import Decimal from 'decimal.js';

import User from '../../../Contexts/User';
import axios from '../../../Axios';


import InputFormatNumber from '../../Widgets/InputFormatNumber';



export default function (props) {

    const user = useContext(User)
    const { hacienda_id, onClose } = props


    const bottomSheetRef = useRef(null);

    /* Estados corespondientes al bottomSheet y la hacienda */
    const toast = useToast()
    const [index, setIndex] = useState(-1)
    const [haciendaId, setHaciendaId] = useState()
    const [hacienda, setHacienda] = useState()

    const snapPoints = useMemo(() => ['100%'], [])

    /** Información del Contrato **/
    const [contrato, setContrato] = useState()
    const [contratoAceptado, setAceptarContrato] = useState(false)
    const [indexContract, setIndexContract] = useState(false)

    /* Información de la Inversión */
    const [plantas, setPlantas] = useState(0)
    const [moneda, setMoneda] = useState((user.cliente?.pais_id?.nombre == "Mexico") ? "MXN" : "USD")


    /* Información del Pago con Tarjeta */
    const [first_name, set_first_name] = useState('')
    const [last_name, set_last_name] = useState('')
    const [card_number, set_card_number] = useState('')
    const [expiration_date_month, set_expiration_date_month] = useState('')
    const [expiration_date_year, set_expiration_date_year] = useState('')
    const [card_code, set_card_code] = useState('')

    /* Cuando se compra */
    const [compra, setCompra] = useState()
    const [metodoPago, setMetodoPago] = useState(false)


    let getHacienda = () => {
        axios.get('/hacienda', {
            params: {
                _id: hacienda_id
            }
        })
            .then(response => {
                setHacienda(response.data.data)
            })
            .catch(error => {

            })
    }


    let getContratoInfo = (plantas, moneda) => {
        setMoneda(moneda)
        setPlantas(plantas)

        axios.get("/hacienda/contrato", {
            params: {
                hacienda_id,
                plantas: plantas,
                moneda: moneda
            }
        })
            .then(({ data }) => {
                setContrato(data)

            })
            .catch(error => {
                console.log("error", error)
            })
    }

    let comprarPlantas = () => {
        // this.setState({ loading: true });
        axios
            .post("/hacienda/compra", {
                hacienda_id,
                moneda,
                plantas,
            })
            .then(({ data }) => {
                setCompra(data)
            })
            .catch((error) => {
                console.log("error", error)
                return toast.show({
                    duration: 2500,
                    render: () => {
                        return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>No fue posible comprar las plantas</Box>;
                    },
                    top: 10
                })
            })
    }

    let pagoTarjeta = () => {
        console.log("data", compra?.inversion?._id)

        Keyboard.dismiss()
        axios.post('/authorizenet/pago', {
            first_name,
            last_name,
            card_number,
            expiration_date_month,
            expiration_date_year,
            card_code,
            inversion_id: compra?.inversion?._id

        })
            .then(({ data }) => {
                bottomSheetRef.current.forceClose()

                set_first_name('')
                set_last_name('')
                set_card_number('')
                set_expiration_date_month('')
                set_expiration_date_year('')
                set_card_code('')
                setPlantas(0)
                setMoneda((user.cliente?.pais_id?.nombre == "Mexico") ? "MXN" : "USD")
                setCompra()
                setMetodoPago(false)
                toast.show({
                    duration: 5000,
                    placement:"top",
                    render: () => {
                        return <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>Hemos procesado su compra correctamente, revise su correo electronico o ingrese a inversiones</Box>;
                    },
                    top: 10
                })
                setIndex(-1)
            })
            .catch(error => {
                return toast.show({
                    duration: 2500,
                    // bottom: 200,
                    bottom: 200,
                    render: () => {
                        return <Box bg="red.500" px="5" py="1" rounded="sm">
                            <Heading color="white" fontSize="sm">{error?.response?.data?.descripcion ?? "Hubo un error al pagar"}</Heading>
                        </Box>;
                    },
                    top: 10
                })
            })
    }

    if (hacienda_id && hacienda_id != null && hacienda_id !== haciendaId) {
        setHaciendaId(hacienda_id)
        setIndex(0)
        getHacienda()
        getContratoInfo(plantas, moneda)
    }


    let renderContrato = () => {

        if (!contrato) return null;

        const {
            ano,
            ano_text,
            dias,
            folio,
            folio_number,
            mes,
            moneda,
            moneda_text,
            plantas,
            plantas_texto,
            precio_planta,
            precio_planta_decimales,
            precio_planta_text,
            tipo_cambio,
            tipo_cambio_decimales,
            tipo_cambio_text,
            total,
            total_decimales,
            total_text } = contrato


        return <Box mx={5}>
            <Text >FOLIO {folio}</Text>

            <Text>En la ciudad de San Miguel el Alto, Jalisco, a los días <Text>{dias}</Text> del mes de <Text>{mes}</Text> del <Text>{ano} {ano_text}</Text></Text>

            <Heading level={5} align="center">DECLARACIONES:</Heading>
            <Text>
                <Text textAlign="justify">
                    Declara y manifiesta el señor JOSE DE JESUS HERMOSILLO REYNOSO, que es legalmente el Administrador General Unico de la empresa denominada ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de CV. Dicha empresa se constituyó mediante escritura pública número 26,230, de fecha 10 de agosto del 2022, ante la fe del Licenciado César Luis Ramírez Casillas, Notario Público número 1 de San Miguel el Alto, Jalisco. La cual se encuentra en Tramite para su incorporacion en el Registro Público de la Propiedad y de Comercio de Tepatitlán de Morelos, Jalisco.
                </Text >
                <Box flex={1} mx={5} />
                <Text>
                    Así mismo expresa ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de
                    CV, en su calidad de “EL PRODUCTOR Y PROPIETARIO”, que se dedica a
                    la plantación, cultivo, jima y venta de AGAVE AZUL TEQUILANA WEBER
                    de primera calidad.
                </Text>
                <Text>
                    Domicilio en Revolución Mexicana # 75 San Miguel el Alto,
                    Jalisco México Tel: 347-688-12 91.
                </Text>

                <Text>
                    Declara el señor (a) {user?.nombres} {user?.apellido_paterno} {user?.apellido_materno}, a quien por razón del mismo se le denominará como "EL INVERSIONISTA”,
                    ser de nacionalidad mexicana, mayor de edad, con fecha de nacimiento {moment(user?.cliente?.fecha_nacimiento).format("LLL")}, y que tiene plena capacidad legal para
                    contratar y obligarse.
                </Text>
                <Text>
                    Expuesto lo anterior, ambas partes declaran estar de acuerdo
                    de celebrar el presente contrato de INVERSIÓN EN PLANTA DE AGAVE
                    AZUL TEQUILANA WEBER, sujetando a su realización y cumplimiento a
                    la observancia de lo pactado en las siguientes:
                </Text>
            </Text>

            <Heading level={5} align="center" className="mt-1">CLAUSULAS:</Heading>

            <Text>
                <Text align="justify">
                    PRIMERA.- INTERVINIENTES. Por una parte la empresa denominada ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de CV, a quien se le denomina como El Productor y Propietario y por la otra el señor (a)
                    {user?.nombres} {user?.apellido_paterno} {user?.apellido_materno}, a quien por razón del mismo se le denominará como "EL INVERSIONISTA", que en este momento adquiere para si, la cantidad de {plantas} {plantas_texto} PLANTAS DE AGAVE AZUL TEQUILANA WEBER, cada una de ellas por la cantidad de
                    <Text>${precio_planta}
                        ({(precio_planta_text ?? "").toUpperCase()}
                        {precio_planta_decimales}/100 {moneda_text?.toUpperCase()})</Text>,
                    dando un total en su INVERSION la suma de
                    <Text>$ {(parseFloat(total))} ({(total_text ?? "").toUpperCase()} {total_decimales.toUpperCase()} / {moneda_text.toUpperCase()})</Text>, teniendo un tipo de cambio el dólar de <Text>${tipo_cambio} {tipo_cambio_text.toUpperCase()}
                        ({tipo_cambio_decimales}/100 PESOS MEXICANOS)</Text>, cantidad en dinero que se entrega en este momento mediante transferencia interbancaria. Esta cantidad no será reembolsable en
                    ningún momento al “CLIENTE” ya que se utilizará para que las plantan lleven acabo su proceso desde ser plantada, fertilizada, fumigada, jimada y
                    llegue a su acarreo final.
                </Text>
                <Text>
                    = = SEGUNDA.- Así mismo convienen los contratantes tanto la persona moral ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de CV,
                    en su calidad de “EL PRODUCTOR Y PROPIETARIO”, como el señor LUIS MIGUEL ALDANA SOTO a quien por razón del mismo se le denominará
                    como “EL INVERSIONISTA”, que en este instante adquiere la cantidad de {plantas} MIL PLANTAS DE AGAVE AZUL TEQUILANA WEBER, de primera calidad,
                    las que ya han sido plantadas en el <Text>“{hacienda?.nombre}”</Text>, ubicado en <Text>“{hacienda?.localizacion?.place_name}”</Text>, el cual se encuentra
                    perfectamente identificado, delimitado y en posesión legal de "EL PRODUCTOR Y PROPIETARIO”, sin conflicto ante terceras personas, dichas plantas
                    se registran ante el Consejo Regulador del Tequila, expresando que todos los gastos que se generen por la plantación, fertilización, fumigación,
                    mantenimiento, jima y el acarreo de las plantas de AGAVE AZUL TEQUILANA WEBER, correrán por cuenta del primero, por lo que todos los hijuelos que
                    resulten de las plantas sembradas serán propiedad del productor.
                </Text>
                <Text>
                    = = TERCERA.- Así mismo el valor y la cantidad en dinero que recibirá el "INVERSIONISTA”, respecto de la aportación inicial que realizó como inversión, por la adquisición de cada planta de agave, será de acuerdo al precio estipulado por kilo de agave se encuentre en el mercado, de acuerdo a la oferta y demanda al momento de la venta real y definitiva. Además se establece que en su defecto, únicamente procederá el reembolso en beneficio del "INVERSIONISTA" en el momento de que se acredite la venta a un tercero, con la constancia de cesión de derechos.
                </Text>
                <Text>
                    = = CUARTA.- Al llegar a la venta final de las plantas, corresponderá el 65% (sesenta y cinco por ciento) a favor del señor (a) {user?.nombres} {user?.apellido_paterno} {user?.apellido_materno}, a quien por razón del mismo se le denominará como "EL INVERSIONISTA”, y el 35% (TREINTA Y CINCO POR CIENTO) a ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de CV, en su calidad de "EL PRODUCTOR Y PROPIETARIO", así mismo convienen ambas partes, que si fuere el caso de que en el momento de la venta del agave en su rendimiento ya jimado a un tercero, existan leyes que establezcan el pago de algún impuesto fiscal, dicho impuesto será cubierto por cada parte, según su ganancia obtenida.
                </Text>
                <Text>
                    = = QUINTA.- Convienen tanto ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de CV, en su calidad de "EL PRODUCTOR Y PROPIETARIO”, como el "INVERSIONISTA”, que si fuere el caso de que ocurriese la pérdida total o parcial de la plantación, sea esta por siniestros naturales, por causas imputables al mismo, o por caso fortuito o de fuerza mayor (no aplica nevada extrema), el primero responderá en favor del segundo por la reposición de cantidad de la planta adquirida.
                </Text>
                <Text>
                    = = SEXTA.- Convienen ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de CV, en su calidad de “EL PRODUCTOR Y PROPIETARIO”, como el señor (a) {user?.nombres} {user?.apellido_paterno} {user?.apellido_materno}, "EL INVERSIONISTA”, que para que las plantas de agave materia de la presente inversión lleguen a su madurez para la jima y el acarreo final se estipula como plazo el tiempo de 4 cuatro a 7 siete años a partir de que sean plantadas.
                </Text>
                <Text>
                    = = SEPTIMA.- Así mismo estipulan tanto ZEUS ORO AZUL DE LOS ALTOS, S de PR de RL de CV, en su calidad de “EL PRODUCTOR Y PROPIETARIO”, como el “INVERSIONISTA” que en caso de que este último decidiere ceder en su totalidad o en parte sus derechos sobre las plantas a terceras personas, tendrá que dar a conocer dicha cesión a "EL PRODUCTOR Y PROPIETARIO”, por los medios electrónicos, con el propósito de tener un control exacto de la cesión y actualizacion de las plantas inventariadas en el sistema.
                </Text>
                <Text>
                    = = OCTAVA.- Convienen las partes que en el presente contrato están de acuerdo con los derechos y obligaciones en él adquiridos. Así mismo convienen en que cualquier modificación, anexo, o adición al presente contrato solamente surtirá plenos efectos cuando se establezcan por escrito y de mutuo acuerdo, y para el cumplimiento del presente instrumento las partes se sujetan a las leyes mexicanas en la materia, y para la interpretación, ejecución y cumplimiento del presente contrato, las partes se sujetan y se someten expresamente a las Leyes y Tribunales del Partido Judicial de la ciudad de Jalostotitlán, Jalisco, que por razón de fuero y competencia le corresponde, renunciando expresamente al fuero que tengan o que llegaren a tener por razón de su domicilio presente o futuro o por cualquier otra causa.
                </Text>
                <Text>
                    = = NOVENA.- Así mismo también estipula el “INVERSIONISTA” que si fuere el caso de que durante el tiempo y vigencia del presente contrato de compra llegase a fallecer, todas y cada una de las obligaciones y derechos adquiridos en el presente contrato pasarán en favor de su beneficiario señor {user?.nombres} {user?.apellido_paterno} {user?.apellido_materno}, quien adquirirá en su persona todos los derechos y obligaciones que en este contrato adquiere el “INVERSIONISTA”.
                </Text>
                <Text>
                    = = LEIDO que fue por las partes el presente contrato, y enteradas debidamente de su contenido y alcance, considerando que no existe error, dolo o violencia, y por encontrarse satisfechos sus elementos de consentimiento, objeto, y forma, reconociendo su validez en todo tiempo y lugar, lo firman ante la presencia de los testigos que firman también el presente contrato, el día de su fecha.
                </Text>
            </Text>
        </Box>
    }


    return (
        <>
            {(index != -1) ? <Box position="absolute" flex={1} bg="rgba(0,0,0,0.5)" top={0} left={0} h="100%" w="100%" /> : null}
            <BottomSheet
                ref={bottomSheetRef}
                index={index}
                snapPoints={snapPoints}
                onChange={e => {
                    
                    if (e == -1) {
                        onClose()
                        setHaciendaId(null)
                    }
                }}
                enablePanDownToClose={true}
            >
                <Box flex={1} mx={5}>
                    <Box bg={hacienda ? {
                        linearGradient: {
                            colors: [Color(hacienda?.color ?? "#FFF").darken(0.2).hex(), hacienda?.color ?? "#FFF"],
                            start: [0, 0],
                            end: [1, 0]
                        }
                    } : "gray.100"} borderRadius={10} width={"100%"} height={70}>
                        <VStack p={2}>
                            <Heading size={"sm"} color="white">{hacienda?.nombre ?? "-"}</Heading>
                            <Text color="white">{hacienda?.descripcion ?? "-"}</Text>
                        </VStack>
                        <Image alt={"Zeus Oro azul de los altos"} source={require("../../../../assets/img/ZeusAgave.png")} resizeMode="contain" h={"20"} opacity={0.2} right={-135} bottom={10} />
                    </Box>

                    {
                        !compra ? <>
                            <Box flex={0.5} />
                            <FormControl>
                                <FormControl.Label>Cantidad de Plantas</FormControl.Label>
                                <InputFormatNumber
                                    keyboardType='decimal-pad'
                                    placeholder="Ingrese la cantidad de plantas"
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                    onChangeText={plantas => getContratoInfo(plantas, moneda)}
                                />
                            </FormControl>
                            <Box flex={0.3} />
                            <FormControl isInvalid >
                                <FormControl.Label>Cantidad de Plantas</FormControl.Label>
                                <Button.Group isAttached mx={{ base: "auto", md: 0 }} w="100%">
                                    <Button size="sm" flex={1}
                                        onPress={() => getContratoInfo(plantas, "MXN")}
                                        opacity={(moneda == "MXN") ? 0.7 : undefined}
                                        startIcon={
                                            // <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; top: 5px;"><path d="M34.875 18C34.875 10.6313 30.2062 4.38755 23.625 2.0813V33.9188C30.2062 31.6125 34.875 25.3688 34.875 18Z" fill="#ED4C5C"></path><path d="M1.125 18C1.125 25.3688 5.85 31.6125 12.375 33.9188V2.0813C5.85 4.38755 1.125 10.6313 1.125 18Z" fill="#75A843"></path><path d="M23.625 2.08125C21.8813 1.4625 19.9688 1.125 18 1.125C16.0312 1.125 14.1187 1.4625 12.375 2.08125V33.9187C14.1187 34.5375 16.0312 34.875 18 34.875C19.9688 34.875 21.8813 34.5375 23.625 33.9187V2.08125Z" fill="white"></path><path d="M22.8941 17.8313C22.8379 17.6625 22.7816 17.8875 22.7816 17.9438C22.7816 17.775 22.7254 17.6625 22.6129 17.4938C22.4441 17.6625 22.3879 17.8875 22.3879 18.1125C22.3316 17.9438 22.2754 17.775 22.1066 17.7188C22.2191 17.8875 22.1629 18 22.1629 18.1688C22.1629 18.3938 22.3316 18.5625 22.3316 18.7875C22.3316 19.0125 22.2191 19.1813 22.0504 19.35V19.1813C21.4879 19.4063 21.6004 19.6875 21.6004 20.1938C21.6004 20.7 21.3191 20.5875 20.9816 20.8688C21.0379 20.7563 21.0379 20.5875 20.9816 20.475C20.9816 20.8125 20.5316 20.8125 20.4754 21.0938C20.4191 21.2063 20.4754 21.4313 20.3066 21.4875C20.1941 21.5438 20.0254 21.6563 20.0254 21.7688C19.9129 21.7125 19.8004 21.7125 19.6316 21.7125C19.6879 21.6563 19.7441 21.6563 19.8004 21.6C19.2379 21.3188 19.0691 21.9375 18.5629 21.9938C18.3941 21.9938 18.0004 21.7688 18.0004 21.9938C18.5066 21.9938 18.7316 22.4438 19.1254 22.4438C19.4629 22.4438 19.7441 22.1625 20.0816 22.1625C20.0254 22.1625 19.8566 22.05 19.6879 22.05C19.9691 21.8813 20.1379 21.5438 20.4754 21.5438C21.0379 21.5438 21.3191 21.4313 21.4879 20.8688C21.4316 20.8688 21.3754 20.8688 21.3191 20.925C21.3191 20.7 21.5441 20.4188 21.7691 20.3063C22.3316 20.1938 22.2754 19.7438 22.6129 19.35C22.5004 19.35 22.3879 19.4063 22.2754 19.5188C22.2754 19.1813 22.2191 18.8438 22.5004 18.6188C23.0629 18.3375 23.0066 18.225 22.8941 17.8313M13.1066 17.8313C12.9941 18.2813 12.9379 18.3938 13.3879 18.675C13.7254 18.9 13.6129 19.2375 13.6129 19.575C13.5004 19.4625 13.4441 19.4063 13.2754 19.4063C13.6129 19.7438 13.5566 20.25 14.1191 20.3625C14.2879 20.475 14.5691 20.7563 14.5691 20.9813C14.5129 20.9813 14.4566 20.925 14.4004 20.925C14.5691 21.4875 14.8504 21.6 15.4129 21.6C15.7504 21.6 15.9191 21.9375 16.2004 22.1063C16.0316 22.1063 15.8629 22.1625 15.8066 22.2188C16.1441 22.2188 16.4254 22.5563 16.7629 22.5C17.1566 22.5 17.4379 22.05 17.8879 22.05C17.8879 21.825 17.4941 22.05 17.3254 22.05C16.8754 21.9375 16.7066 21.375 16.0879 21.6C16.1441 21.6563 16.2004 21.7125 16.2566 21.7125C16.1441 21.7125 15.9754 21.6563 15.8629 21.7688C15.8066 21.6563 15.6941 21.5438 15.5816 21.4875C15.4691 21.375 15.4691 21.2063 15.4129 21.0938C15.3004 20.8125 14.9066 20.7563 14.9066 20.475C14.8504 20.5875 14.8504 20.7563 14.9066 20.8688C14.5691 20.5875 14.2879 20.7 14.2879 20.1938C14.2879 19.7438 14.4004 19.4063 13.8379 19.1813V19.35C13.6691 19.1813 13.5566 19.0688 13.5566 18.7875C13.5566 18.5625 13.7816 18.3938 13.7254 18.1688C13.7254 18 13.6691 17.8875 13.7816 17.7188C13.6129 17.775 13.5566 17.9438 13.5004 18.1125C13.5004 17.8875 13.4441 17.6625 13.2754 17.4938C13.2191 17.6063 13.1629 17.775 13.1066 17.9438C13.1629 17.8313 13.1066 17.6625 13.1066 17.8313" fill="#75A843"></path><path d="M19.5184 21.2062C19.4059 21.2062 19.3496 21.0937 19.2934 21.0375C19.2934 20.925 19.7434 20.8125 19.7996 20.8125V20.7C19.0684 20.925 16.8746 21.0937 16.4246 20.3062C16.1996 20.6437 15.8059 20.4187 15.4121 20.1375C15.4684 20.25 15.6934 20.8125 15.6934 20.7562C15.8059 20.8125 16.5371 20.9812 16.5371 21.15L16.3684 21.3187C17.5496 21.7125 18.2809 21.825 19.5184 21.2062Z" fill="#428BC1"></path><path d="M18.7875 21.2062C18.8438 21.15 18.8438 21.0937 18.8438 20.9812L18.7875 20.8125C18.9 20.7 18.7875 20.4187 18.6187 20.475C18.5062 20.5312 18.5625 20.5312 18.45 20.475C18.3937 20.475 18.3937 20.4187 18.3375 20.4187H17.325C17.2125 20.4187 17.2125 20.3625 17.1 20.3625C16.9875 20.3062 16.9313 20.4187 16.875 20.475C16.875 20.5875 16.9313 20.5875 16.9313 20.6437C16.9313 20.7 16.875 20.7562 16.875 20.8687C16.875 20.9812 16.9313 21.0375 16.9875 21.0937C16.7625 21.2625 16.9875 21.5437 17.2125 21.375C17.2688 21.4875 17.4375 21.4875 17.6062 21.4875H18.225C18.3375 21.4875 18.5625 21.5437 18.6187 21.375C18.7875 21.6562 19.0125 21.3187 18.7875 21.2062Z" fill="#ED4C5C"></path><path d="M20.5871 19.7438C20.1371 19.1813 19.9121 20.025 19.4058 19.9688C19.5183 19.2938 18.5058 19.5188 18.2246 19.6875C18.2808 19.6313 18.3371 19.5188 18.3933 19.4063C18.1683 19.4063 17.8871 19.5188 17.7183 19.35C17.3808 19.125 16.9308 19.0125 16.6496 19.4063C16.4246 19.0688 15.8058 18.7313 15.4683 19.0688C15.4683 18.7313 15.1308 18.225 14.7371 18.2813C14.2871 18.3375 14.4558 18.9 14.6808 19.125C14.8496 19.2938 15.0746 19.35 15.2996 19.35C15.2996 19.4625 15.3558 19.5188 15.4121 19.575C15.6933 19.8 16.2558 19.8563 16.5371 19.6313C16.5371 20.1938 17.6621 20.1938 17.9433 19.9125C17.8308 20.1938 17.7183 20.7563 18.1121 20.7563C18.4496 20.7563 18.3371 20.4188 18.6183 20.3063C18.8433 20.1938 19.1246 20.1375 19.3496 20.25C19.7433 20.475 20.9808 20.4188 20.5871 19.7438" fill="#428BC1"></path><path d="M15.975 18.3374C15.9188 18.2249 15.8063 18.1124 15.8063 18.1124C15.5813 18.1687 15.5813 17.9999 15.525 17.8312C15.4688 17.5499 15.075 17.4374 15.075 17.2124C15.075 16.9874 15.3 16.7624 15.1313 16.5374C14.9625 16.3124 14.6813 16.1999 14.6813 16.3124C14.625 16.4249 14.9063 16.4249 14.9063 16.7062C14.9063 17.0437 14.5688 17.3249 14.9625 17.6062C15.1875 17.9437 15.1875 18.5624 15.5813 18.5624C15.75 18.5624 15.9188 18.5062 15.975 18.3374" fill="#75A843"></path><path d="M16.8189 18.0562C16.7064 17.8312 16.8189 17.4937 16.5939 17.325C16.3127 17.1 15.7502 17.55 15.6939 16.9875C15.6939 16.875 16.3127 16.2 16.4252 16.1437C16.5939 15.9187 16.5377 15.525 16.3689 15.4125C16.1439 15.3 16.0877 15.4125 15.9189 15.6375C15.9752 15.6937 16.2002 15.8062 16.2002 15.8625C16.0314 16.2562 15.5252 16.3125 15.4127 16.7063C15.3002 16.9875 15.3564 17.4375 15.6377 17.6062C15.8064 17.7187 15.9189 17.7187 16.0877 17.7187C16.5939 17.6625 16.3127 17.775 16.3689 17.8875C16.3689 18 16.5377 18.3937 16.8189 18.0562M15.1314 15.3C15.1314 15.6375 15.4689 15.5812 15.6939 15.525C15.6939 15.4125 15.6939 15.3 15.7502 15.1875C15.6377 15.2437 15.4689 15.2437 15.4127 15.1875C15.2439 15.075 15.8064 14.85 15.7502 14.85C15.7502 14.85 15.1877 15.1312 15.4127 14.7937C15.4689 14.6812 15.5814 14.5688 15.6377 14.4563C15.6939 14.3437 15.4689 14.4563 15.4689 14.4563C15.4127 14.4563 15.3564 14.4562 15.3002 14.5125C14.9627 14.7937 15.0752 14.9625 15.1314 15.3" fill="#75A843"></path><path d="M21.0935 15.3C20.8122 14.9063 19.7435 13.6125 18.2247 13.5C18.056 13.5 17.606 13.6687 17.4372 13.725C16.931 14.0625 17.9997 14.3437 18.056 14.5687C18.056 14.6812 18.1122 14.7375 18.1122 14.85C17.9435 14.5687 17.7747 14.4 17.7185 14.2875C17.4372 14.4 16.9872 14.2312 16.931 13.95C16.8747 14.0625 16.8747 14.1187 16.7622 14.2312C16.7622 14.0625 16.706 14.0625 16.6497 13.95C16.6497 14.1187 16.6497 14.3438 16.481 14.4C16.5372 14.2875 16.481 14.175 16.4247 14.0625C16.4247 14.2313 16.4247 14.3438 16.3122 14.4563C16.3685 14.3438 16.256 14.2875 16.256 14.175C16.1997 14.625 15.581 14.7938 16.1997 14.9625C16.4247 15.0188 16.5372 14.9625 16.7622 15.075C16.8185 15.1312 16.931 15.2438 16.931 15.1875C16.931 15.2438 16.706 15.4688 16.8747 15.525C16.8185 15.5813 16.6497 15.9187 16.6497 15.9187C16.8185 15.9187 16.706 16.0313 16.5935 16.1438C16.4247 16.425 16.5935 16.7062 16.6497 17.0437C16.6497 16.9312 16.8185 17.1 16.8185 17.2688C16.8185 17.4938 17.0435 17.6063 17.0997 17.775C16.8185 17.4938 16.7622 17.775 17.0997 17.9437C16.8185 17.9437 16.7622 18.1125 17.0435 18.225C16.3685 18.225 16.931 18.5062 17.0435 18.5625C17.4935 18.675 17.831 18.3375 17.831 18.2812C17.831 18.2812 18.731 19.1812 18.7872 19.1812C18.8435 19.1812 19.2935 18.9563 19.406 19.0688C19.5185 19.2375 19.631 19.0687 19.7435 19.125C19.856 19.2375 20.306 19.125 20.4185 19.0688C20.4747 19.0688 21.0372 18.9563 20.9247 18.8438C20.6435 18.6187 20.306 18.3937 20.0247 18.1687C19.7435 17.9437 19.4622 17.775 19.2372 17.55C19.1247 17.4375 19.1247 17.2125 19.0685 17.0437C19.5747 17.55 20.081 17.8313 20.0247 16.875C20.3622 17.1562 21.0372 18.7312 21.0935 18.7312C21.2622 18.7312 21.0935 17.0438 21.0935 16.875C21.3185 17.1 21.3185 18.9563 21.3747 18.9563C21.656 19.0125 22.0497 16.5375 21.0935 15.3" fill="#89664C"></path><path d="M17.0439 18.1688C16.9877 18.1688 16.7064 17.775 16.7064 17.7188C16.8752 18.3938 16.2002 18 16.3689 17.7188C16.1439 17.6625 15.5814 18 15.8064 18.3375C15.6939 18.5625 16.5939 18.3938 16.6502 18.2813C16.8752 18.7875 17.4377 18.225 17.0439 18.1688M19.6877 19.8563C19.9689 19.4625 18.7877 19.35 18.9002 18.9C18.7314 19.0125 18.5064 19.4063 18.2814 19.2938C18.1689 19.2375 17.7189 19.5188 17.9439 19.6875C17.9439 19.4625 18.0564 19.6313 18.2252 19.575C18.1689 19.7438 18.0002 19.9125 18.2814 20.025C18.1689 19.6875 18.6189 19.8563 18.5627 19.6875C18.4502 19.575 18.9564 19.575 19.0127 19.575C19.1814 19.575 19.7439 19.7438 19.5189 19.9125C19.5189 19.9125 19.6314 19.9125 19.6877 19.8563M15.9189 15.0188C15.8627 15.1313 15.6377 15.3 15.6377 15.4688C15.6377 15.5813 15.9189 15.8625 16.0314 15.6938C15.6939 15.4688 16.0877 15.3 16.2564 15.3C16.3127 15.3 16.3127 15.4125 16.3127 15.4125C16.3689 15.4688 16.8189 15.3 16.7627 15.1875C16.8189 14.9625 16.0877 14.9625 15.9189 15.0188Z" fill="#FFCE31"></path></svg>
                                            <Icon viewBox="0 0 36 36">
                                                <Path d="M34.875 18C34.875 10.6313 30.2062 4.38755 23.625 2.0813V33.9188C30.2062 31.6125 34.875 25.3688 34.875 18Z" fill="#ED4C5C"></Path>
                                                <Path d="M1.125 18C1.125 25.3688 5.85 31.6125 12.375 33.9188V2.0813C5.85 4.38755 1.125 10.6313 1.125 18Z" fill="#75A843"></Path>
                                                <Path d="M23.625 2.08125C21.8813 1.4625 19.9688 1.125 18 1.125C16.0312 1.125 14.1187 1.4625 12.375 2.08125V33.9187C14.1187 34.5375 16.0312 34.875 18 34.875C19.9688 34.875 21.8813 34.5375 23.625 33.9187V2.08125Z" fill="white"></Path>
                                                <Path d="M22.8941 17.8313C22.8379 17.6625 22.7816 17.8875 22.7816 17.9438C22.7816 17.775 22.7254 17.6625 22.6129 17.4938C22.4441 17.6625 22.3879 17.8875 22.3879 18.1125C22.3316 17.9438 22.2754 17.775 22.1066 17.7188C22.2191 17.8875 22.1629 18 22.1629 18.1688C22.1629 18.3938 22.3316 18.5625 22.3316 18.7875C22.3316 19.0125 22.2191 19.1813 22.0504 19.35V19.1813C21.4879 19.4063 21.6004 19.6875 21.6004 20.1938C21.6004 20.7 21.3191 20.5875 20.9816 20.8688C21.0379 20.7563 21.0379 20.5875 20.9816 20.475C20.9816 20.8125 20.5316 20.8125 20.4754 21.0938C20.4191 21.2063 20.4754 21.4313 20.3066 21.4875C20.1941 21.5438 20.0254 21.6563 20.0254 21.7688C19.9129 21.7125 19.8004 21.7125 19.6316 21.7125C19.6879 21.6563 19.7441 21.6563 19.8004 21.6C19.2379 21.3188 19.0691 21.9375 18.5629 21.9938C18.3941 21.9938 18.0004 21.7688 18.0004 21.9938C18.5066 21.9938 18.7316 22.4438 19.1254 22.4438C19.4629 22.4438 19.7441 22.1625 20.0816 22.1625C20.0254 22.1625 19.8566 22.05 19.6879 22.05C19.9691 21.8813 20.1379 21.5438 20.4754 21.5438C21.0379 21.5438 21.3191 21.4313 21.4879 20.8688C21.4316 20.8688 21.3754 20.8688 21.3191 20.925C21.3191 20.7 21.5441 20.4188 21.7691 20.3063C22.3316 20.1938 22.2754 19.7438 22.6129 19.35C22.5004 19.35 22.3879 19.4063 22.2754 19.5188C22.2754 19.1813 22.2191 18.8438 22.5004 18.6188C23.0629 18.3375 23.0066 18.225 22.8941 17.8313M13.1066 17.8313C12.9941 18.2813 12.9379 18.3938 13.3879 18.675C13.7254 18.9 13.6129 19.2375 13.6129 19.575C13.5004 19.4625 13.4441 19.4063 13.2754 19.4063C13.6129 19.7438 13.5566 20.25 14.1191 20.3625C14.2879 20.475 14.5691 20.7563 14.5691 20.9813C14.5129 20.9813 14.4566 20.925 14.4004 20.925C14.5691 21.4875 14.8504 21.6 15.4129 21.6C15.7504 21.6 15.9191 21.9375 16.2004 22.1063C16.0316 22.1063 15.8629 22.1625 15.8066 22.2188C16.1441 22.2188 16.4254 22.5563 16.7629 22.5C17.1566 22.5 17.4379 22.05 17.8879 22.05C17.8879 21.825 17.4941 22.05 17.3254 22.05C16.8754 21.9375 16.7066 21.375 16.0879 21.6C16.1441 21.6563 16.2004 21.7125 16.2566 21.7125C16.1441 21.7125 15.9754 21.6563 15.8629 21.7688C15.8066 21.6563 15.6941 21.5438 15.5816 21.4875C15.4691 21.375 15.4691 21.2063 15.4129 21.0938C15.3004 20.8125 14.9066 20.7563 14.9066 20.475C14.8504 20.5875 14.8504 20.7563 14.9066 20.8688C14.5691 20.5875 14.2879 20.7 14.2879 20.1938C14.2879 19.7438 14.4004 19.4063 13.8379 19.1813V19.35C13.6691 19.1813 13.5566 19.0688 13.5566 18.7875C13.5566 18.5625 13.7816 18.3938 13.7254 18.1688C13.7254 18 13.6691 17.8875 13.7816 17.7188C13.6129 17.775 13.5566 17.9438 13.5004 18.1125C13.5004 17.8875 13.4441 17.6625 13.2754 17.4938C13.2191 17.6063 13.1629 17.775 13.1066 17.9438C13.1629 17.8313 13.1066 17.6625 13.1066 17.8313" fill="#75A843"></Path>
                                                <Path d="M19.5184 21.2062C19.4059 21.2062 19.3496 21.0937 19.2934 21.0375C19.2934 20.925 19.7434 20.8125 19.7996 20.8125V20.7C19.0684 20.925 16.8746 21.0937 16.4246 20.3062C16.1996 20.6437 15.8059 20.4187 15.4121 20.1375C15.4684 20.25 15.6934 20.8125 15.6934 20.7562C15.8059 20.8125 16.5371 20.9812 16.5371 21.15L16.3684 21.3187C17.5496 21.7125 18.2809 21.825 19.5184 21.2062Z" fill="#428BC1"></Path>
                                                <Path d="M20.5871 19.7438C20.1371 19.1813 19.9121 20.025 19.4058 19.9688C19.5183 19.2938 18.5058 19.5188 18.2246 19.6875C18.2808 19.6313 18.3371 19.5188 18.3933 19.4063C18.1683 19.4063 17.8871 19.5188 17.7183 19.35C17.3808 19.125 16.9308 19.0125 16.6496 19.4063C16.4246 19.0688 15.8058 18.7313 15.4683 19.0688C15.4683 18.7313 15.1308 18.225 14.7371 18.2813C14.2871 18.3375 14.4558 18.9 14.6808 19.125C14.8496 19.2938 15.0746 19.35 15.2996 19.35C15.2996 19.4625 15.3558 19.5188 15.4121 19.575C15.6933 19.8 16.2558 19.8563 16.5371 19.6313C16.5371 20.1938 17.6621 20.1938 17.9433 19.9125C17.8308 20.1938 17.7183 20.7563 18.1121 20.7563C18.4496 20.7563 18.3371 20.4188 18.6183 20.3063C18.8433 20.1938 19.1246 20.1375 19.3496 20.25C19.7433 20.475 20.9808 20.4188 20.5871 19.7438" fill="#428BC1"></Path>
                                                <Path d="M15.975 18.3374C15.9188 18.2249 15.8063 18.1124 15.8063 18.1124C15.5813 18.1687 15.5813 17.9999 15.525 17.8312C15.4688 17.5499 15.075 17.4374 15.075 17.2124C15.075 16.9874 15.3 16.7624 15.1313 16.5374C14.9625 16.3124 14.6813 16.1999 14.6813 16.3124C14.625 16.4249 14.9063 16.4249 14.9063 16.7062C14.9063 17.0437 14.5688 17.3249 14.9625 17.6062C15.1875 17.9437 15.1875 18.5624 15.5813 18.5624C15.75 18.5624 15.9188 18.5062 15.975 18.3374" fill="#75A843"></Path>
                                                <Path d="M19.5184 21.2062C19.4059 21.2062 19.3496 21.0937 19.2934 21.0375C19.2934 20.925 19.7434 20.8125 19.7996 20.8125V20.7C19.0684 20.925 16.8746 21.0937 16.4246 20.3062C16.1996 20.6437 15.8059 20.4187 15.4121 20.1375C15.4684 20.25 15.6934 20.8125 15.6934 20.7562C15.8059 20.8125 16.5371 20.9812 16.5371 21.15L16.3684 21.3187C17.5496 21.7125 18.2809 21.825 19.5184 21.2062Z" fill="#428BC1"></Path>
                                                <Path d="M16.8189 18.0562C16.7064 17.8312 16.8189 17.4937 16.5939 17.325C16.3127 17.1 15.7502 17.55 15.6939 16.9875C15.6939 16.875 16.3127 16.2 16.4252 16.1437C16.5939 15.9187 16.5377 15.525 16.3689 15.4125C16.1439 15.3 16.0877 15.4125 15.9189 15.6375C15.9752 15.6937 16.2002 15.8062 16.2002 15.8625C16.0314 16.2562 15.5252 16.3125 15.4127 16.7063C15.3002 16.9875 15.3564 17.4375 15.6377 17.6062C15.8064 17.7187 15.9189 17.7187 16.0877 17.7187C16.5939 17.6625 16.3127 17.775 16.3689 17.8875C16.3689 18 16.5377 18.3937 16.8189 18.0562M15.1314 15.3C15.1314 15.6375 15.4689 15.5812 15.6939 15.525C15.6939 15.4125 15.6939 15.3 15.7502 15.1875C15.6377 15.2437 15.4689 15.2437 15.4127 15.1875C15.2439 15.075 15.8064 14.85 15.7502 14.85C15.7502 14.85 15.1877 15.1312 15.4127 14.7937C15.4689 14.6812 15.5814 14.5688 15.6377 14.4563C15.6939 14.3437 15.4689 14.4563 15.4689 14.4563C15.4127 14.4563 15.3564 14.4562 15.3002 14.5125C14.9627 14.7937 15.0752 14.9625 15.1314 15.3" fill="#75A843"></Path>
                                                <Path d="M18.7875 21.2062C18.8438 21.15 18.8438 21.0937 18.8438 20.9812L18.7875 20.8125C18.9 20.7 18.7875 20.4187 18.6187 20.475C18.5062 20.5312 18.5625 20.5312 18.45 20.475C18.3937 20.475 18.3937 20.4187 18.3375 20.4187H17.325C17.2125 20.4187 17.2125 20.3625 17.1 20.3625C16.9875 20.3062 16.9313 20.4187 16.875 20.475C16.875 20.5875 16.9313 20.5875 16.9313 20.6437C16.9313 20.7 16.875 20.7562 16.875 20.8687C16.875 20.9812 16.9313 21.0375 16.9875 21.0937C16.7625 21.2625 16.9875 21.5437 17.2125 21.375C17.2688 21.4875 17.4375 21.4875 17.6062 21.4875H18.225C18.3375 21.4875 18.5625 21.5437 18.6187 21.375C18.7875 21.6562 19.0125 21.3187 18.7875 21.2062Z" fill="#ED4C5C"></Path>
                                                <Path d="M15.975 18.3374C15.9188 18.2249 15.8063 18.1124 15.8063 18.1124C15.5813 18.1687 15.5813 17.9999 15.525 17.8312C15.4688 17.5499 15.075 17.4374 15.075 17.2124C15.075 16.9874 15.3 16.7624 15.1313 16.5374C14.9625 16.3124 14.6813 16.1999 14.6813 16.3124C14.625 16.4249 14.9063 16.4249 14.9063 16.7062C14.9063 17.0437 14.5688 17.3249 14.9625 17.6062C15.1875 17.9437 15.1875 18.5624 15.5813 18.5624C15.75 18.5624 15.9188 18.5062 15.975 18.3374" fill="#75A843"></Path>
                                                <Path d="M16.8189 18.0562C16.7064 17.8312 16.8189 17.4937 16.5939 17.325C16.3127 17.1 15.7502 17.55 15.6939 16.9875C15.6939 16.875 16.3127 16.2 16.4252 16.1437C16.5939 15.9187 16.5377 15.525 16.3689 15.4125C16.1439 15.3 16.0877 15.4125 15.9189 15.6375C15.9752 15.6937 16.2002 15.8062 16.2002 15.8625C16.0314 16.2562 15.5252 16.3125 15.4127 16.7063C15.3002 16.9875 15.3564 17.4375 15.6377 17.6062C15.8064 17.7187 15.9189 17.7187 16.0877 17.7187C16.5939 17.6625 16.3127 17.775 16.3689 17.8875C16.3689 18 16.5377 18.3937 16.8189 18.0562M15.1314 15.3C15.1314 15.6375 15.4689 15.5812 15.6939 15.525C15.6939 15.4125 15.6939 15.3 15.7502 15.1875C15.6377 15.2437 15.4689 15.2437 15.4127 15.1875C15.2439 15.075 15.8064 14.85 15.7502 14.85C15.7502 14.85 15.1877 15.1312 15.4127 14.7937C15.4689 14.6812 15.5814 14.5688 15.6377 14.4563C15.6939 14.3437 15.4689 14.4563 15.4689 14.4563C15.4127 14.4563 15.3564 14.4562 15.3002 14.5125C14.9627 14.7937 15.0752 14.9625 15.1314 15.3" fill="#75A843"></Path>
                                                <Path d="M21.0935 15.3C20.8122 14.9063 19.7435 13.6125 18.2247 13.5C18.056 13.5 17.606 13.6687 17.4372 13.725C16.931 14.0625 17.9997 14.3437 18.056 14.5687C18.056 14.6812 18.1122 14.7375 18.1122 14.85C17.9435 14.5687 17.7747 14.4 17.7185 14.2875C17.4372 14.4 16.9872 14.2312 16.931 13.95C16.8747 14.0625 16.8747 14.1187 16.7622 14.2312C16.7622 14.0625 16.706 14.0625 16.6497 13.95C16.6497 14.1187 16.6497 14.3438 16.481 14.4C16.5372 14.2875 16.481 14.175 16.4247 14.0625C16.4247 14.2313 16.4247 14.3438 16.3122 14.4563C16.3685 14.3438 16.256 14.2875 16.256 14.175C16.1997 14.625 15.581 14.7938 16.1997 14.9625C16.4247 15.0188 16.5372 14.9625 16.7622 15.075C16.8185 15.1312 16.931 15.2438 16.931 15.1875C16.931 15.2438 16.706 15.4688 16.8747 15.525C16.8185 15.5813 16.6497 15.9187 16.6497 15.9187C16.8185 15.9187 16.706 16.0313 16.5935 16.1438C16.4247 16.425 16.5935 16.7062 16.6497 17.0437C16.6497 16.9312 16.8185 17.1 16.8185 17.2688C16.8185 17.4938 17.0435 17.6063 17.0997 17.775C16.8185 17.4938 16.7622 17.775 17.0997 17.9437C16.8185 17.9437 16.7622 18.1125 17.0435 18.225C16.3685 18.225 16.931 18.5062 17.0435 18.5625C17.4935 18.675 17.831 18.3375 17.831 18.2812C17.831 18.2812 18.731 19.1812 18.7872 19.1812C18.8435 19.1812 19.2935 18.9563 19.406 19.0688C19.5185 19.2375 19.631 19.0687 19.7435 19.125C19.856 19.2375 20.306 19.125 20.4185 19.0688C20.4747 19.0688 21.0372 18.9563 20.9247 18.8438C20.6435 18.6187 20.306 18.3937 20.0247 18.1687C19.7435 17.9437 19.4622 17.775 19.2372 17.55C19.1247 17.4375 19.1247 17.2125 19.0685 17.0437C19.5747 17.55 20.081 17.8313 20.0247 16.875C20.3622 17.1562 21.0372 18.7312 21.0935 18.7312C21.2622 18.7312 21.0935 17.0438 21.0935 16.875C21.3185 17.1 21.3185 18.9563 21.3747 18.9563C21.656 19.0125 22.0497 16.5375 21.0935 15.3" fill="#89664C"></Path>
                                                <Path d="M17.0439 18.1688C16.9877 18.1688 16.7064 17.775 16.7064 17.7188C16.8752 18.3938 16.2002 18 16.3689 17.7188C16.1439 17.6625 15.5814 18 15.8064 18.3375C15.6939 18.5625 16.5939 18.3938 16.6502 18.2813C16.8752 18.7875 17.4377 18.225 17.0439 18.1688M19.6877 19.8563C19.9689 19.4625 18.7877 19.35 18.9002 18.9C18.7314 19.0125 18.5064 19.4063 18.2814 19.2938C18.1689 19.2375 17.7189 19.5188 17.9439 19.6875C17.9439 19.4625 18.0564 19.6313 18.2252 19.575C18.1689 19.7438 18.0002 19.9125 18.2814 20.025C18.1689 19.6875 18.6189 19.8563 18.5627 19.6875C18.4502 19.575 18.9564 19.575 19.0127 19.575C19.1814 19.575 19.7439 19.7438 19.5189 19.9125C19.5189 19.9125 19.6314 19.9125 19.6877 19.8563M15.9189 15.0188C15.8627 15.1313 15.6377 15.3 15.6377 15.4688C15.6377 15.5813 15.9189 15.8625 16.0314 15.6938C15.6939 15.4688 16.0877 15.3 16.2564 15.3C16.3127 15.3 16.3127 15.4125 16.3127 15.4125C16.3689 15.4688 16.8189 15.3 16.7627 15.1875C16.8189 14.9625 16.0877 14.9625 15.9189 15.0188Z" fill="#FFCE31"></Path>
                                            </Icon>
                                        }>Peso Mexicano</Button>
                                    <Button
                                        onPress={() => getContratoInfo(plantas, "USD")}
                                        opacity={(moneda == "USD") ? 0.7 : undefined}
                                        // bg={(moneda == "USD") ? "primary.900" : "primary.500"}
                                        flex={1}
                                        name="right"
                                        size="sm"
                                        startIcon={
                                            // <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; top: 5px;"><path d="M34.875 18C34.875 10.6313 30.2062 4.38755 23.625 2.0813V33.9188C30.2062 31.6125 34.875 25.3688 34.875 18Z" fill="#ED4C5C"></path><path d="M1.125 18C1.125 25.3688 5.85 31.6125 12.375 33.9188V2.0813C5.85 4.38755 1.125 10.6313 1.125 18Z" fill="#75A843"></path><path d="M23.625 2.08125C21.8813 1.4625 19.9688 1.125 18 1.125C16.0312 1.125 14.1187 1.4625 12.375 2.08125V33.9187C14.1187 34.5375 16.0312 34.875 18 34.875C19.9688 34.875 21.8813 34.5375 23.625 33.9187V2.08125Z" fill="white"></path><path d="M22.8941 17.8313C22.8379 17.6625 22.7816 17.8875 22.7816 17.9438C22.7816 17.775 22.7254 17.6625 22.6129 17.4938C22.4441 17.6625 22.3879 17.8875 22.3879 18.1125C22.3316 17.9438 22.2754 17.775 22.1066 17.7188C22.2191 17.8875 22.1629 18 22.1629 18.1688C22.1629 18.3938 22.3316 18.5625 22.3316 18.7875C22.3316 19.0125 22.2191 19.1813 22.0504 19.35V19.1813C21.4879 19.4063 21.6004 19.6875 21.6004 20.1938C21.6004 20.7 21.3191 20.5875 20.9816 20.8688C21.0379 20.7563 21.0379 20.5875 20.9816 20.475C20.9816 20.8125 20.5316 20.8125 20.4754 21.0938C20.4191 21.2063 20.4754 21.4313 20.3066 21.4875C20.1941 21.5438 20.0254 21.6563 20.0254 21.7688C19.9129 21.7125 19.8004 21.7125 19.6316 21.7125C19.6879 21.6563 19.7441 21.6563 19.8004 21.6C19.2379 21.3188 19.0691 21.9375 18.5629 21.9938C18.3941 21.9938 18.0004 21.7688 18.0004 21.9938C18.5066 21.9938 18.7316 22.4438 19.1254 22.4438C19.4629 22.4438 19.7441 22.1625 20.0816 22.1625C20.0254 22.1625 19.8566 22.05 19.6879 22.05C19.9691 21.8813 20.1379 21.5438 20.4754 21.5438C21.0379 21.5438 21.3191 21.4313 21.4879 20.8688C21.4316 20.8688 21.3754 20.8688 21.3191 20.925C21.3191 20.7 21.5441 20.4188 21.7691 20.3063C22.3316 20.1938 22.2754 19.7438 22.6129 19.35C22.5004 19.35 22.3879 19.4063 22.2754 19.5188C22.2754 19.1813 22.2191 18.8438 22.5004 18.6188C23.0629 18.3375 23.0066 18.225 22.8941 17.8313M13.1066 17.8313C12.9941 18.2813 12.9379 18.3938 13.3879 18.675C13.7254 18.9 13.6129 19.2375 13.6129 19.575C13.5004 19.4625 13.4441 19.4063 13.2754 19.4063C13.6129 19.7438 13.5566 20.25 14.1191 20.3625C14.2879 20.475 14.5691 20.7563 14.5691 20.9813C14.5129 20.9813 14.4566 20.925 14.4004 20.925C14.5691 21.4875 14.8504 21.6 15.4129 21.6C15.7504 21.6 15.9191 21.9375 16.2004 22.1063C16.0316 22.1063 15.8629 22.1625 15.8066 22.2188C16.1441 22.2188 16.4254 22.5563 16.7629 22.5C17.1566 22.5 17.4379 22.05 17.8879 22.05C17.8879 21.825 17.4941 22.05 17.3254 22.05C16.8754 21.9375 16.7066 21.375 16.0879 21.6C16.1441 21.6563 16.2004 21.7125 16.2566 21.7125C16.1441 21.7125 15.9754 21.6563 15.8629 21.7688C15.8066 21.6563 15.6941 21.5438 15.5816 21.4875C15.4691 21.375 15.4691 21.2063 15.4129 21.0938C15.3004 20.8125 14.9066 20.7563 14.9066 20.475C14.8504 20.5875 14.8504 20.7563 14.9066 20.8688C14.5691 20.5875 14.2879 20.7 14.2879 20.1938C14.2879 19.7438 14.4004 19.4063 13.8379 19.1813V19.35C13.6691 19.1813 13.5566 19.0688 13.5566 18.7875C13.5566 18.5625 13.7816 18.3938 13.7254 18.1688C13.7254 18 13.6691 17.8875 13.7816 17.7188C13.6129 17.775 13.5566 17.9438 13.5004 18.1125C13.5004 17.8875 13.4441 17.6625 13.2754 17.4938C13.2191 17.6063 13.1629 17.775 13.1066 17.9438C13.1629 17.8313 13.1066 17.6625 13.1066 17.8313" fill="#75A843"></path><path d="M19.5184 21.2062C19.4059 21.2062 19.3496 21.0937 19.2934 21.0375C19.2934 20.925 19.7434 20.8125 19.7996 20.8125V20.7C19.0684 20.925 16.8746 21.0937 16.4246 20.3062C16.1996 20.6437 15.8059 20.4187 15.4121 20.1375C15.4684 20.25 15.6934 20.8125 15.6934 20.7562C15.8059 20.8125 16.5371 20.9812 16.5371 21.15L16.3684 21.3187C17.5496 21.7125 18.2809 21.825 19.5184 21.2062Z" fill="#428BC1"></path><path d="M18.7875 21.2062C18.8438 21.15 18.8438 21.0937 18.8438 20.9812L18.7875 20.8125C18.9 20.7 18.7875 20.4187 18.6187 20.475C18.5062 20.5312 18.5625 20.5312 18.45 20.475C18.3937 20.475 18.3937 20.4187 18.3375 20.4187H17.325C17.2125 20.4187 17.2125 20.3625 17.1 20.3625C16.9875 20.3062 16.9313 20.4187 16.875 20.475C16.875 20.5875 16.9313 20.5875 16.9313 20.6437C16.9313 20.7 16.875 20.7562 16.875 20.8687C16.875 20.9812 16.9313 21.0375 16.9875 21.0937C16.7625 21.2625 16.9875 21.5437 17.2125 21.375C17.2688 21.4875 17.4375 21.4875 17.6062 21.4875H18.225C18.3375 21.4875 18.5625 21.5437 18.6187 21.375C18.7875 21.6562 19.0125 21.3187 18.7875 21.2062Z" fill="#ED4C5C"></path><path d="M20.5871 19.7438C20.1371 19.1813 19.9121 20.025 19.4058 19.9688C19.5183 19.2938 18.5058 19.5188 18.2246 19.6875C18.2808 19.6313 18.3371 19.5188 18.3933 19.4063C18.1683 19.4063 17.8871 19.5188 17.7183 19.35C17.3808 19.125 16.9308 19.0125 16.6496 19.4063C16.4246 19.0688 15.8058 18.7313 15.4683 19.0688C15.4683 18.7313 15.1308 18.225 14.7371 18.2813C14.2871 18.3375 14.4558 18.9 14.6808 19.125C14.8496 19.2938 15.0746 19.35 15.2996 19.35C15.2996 19.4625 15.3558 19.5188 15.4121 19.575C15.6933 19.8 16.2558 19.8563 16.5371 19.6313C16.5371 20.1938 17.6621 20.1938 17.9433 19.9125C17.8308 20.1938 17.7183 20.7563 18.1121 20.7563C18.4496 20.7563 18.3371 20.4188 18.6183 20.3063C18.8433 20.1938 19.1246 20.1375 19.3496 20.25C19.7433 20.475 20.9808 20.4188 20.5871 19.7438" fill="#428BC1"></path><path d="M15.975 18.3374C15.9188 18.2249 15.8063 18.1124 15.8063 18.1124C15.5813 18.1687 15.5813 17.9999 15.525 17.8312C15.4688 17.5499 15.075 17.4374 15.075 17.2124C15.075 16.9874 15.3 16.7624 15.1313 16.5374C14.9625 16.3124 14.6813 16.1999 14.6813 16.3124C14.625 16.4249 14.9063 16.4249 14.9063 16.7062C14.9063 17.0437 14.5688 17.3249 14.9625 17.6062C15.1875 17.9437 15.1875 18.5624 15.5813 18.5624C15.75 18.5624 15.9188 18.5062 15.975 18.3374" fill="#75A843"></path><path d="M16.8189 18.0562C16.7064 17.8312 16.8189 17.4937 16.5939 17.325C16.3127 17.1 15.7502 17.55 15.6939 16.9875C15.6939 16.875 16.3127 16.2 16.4252 16.1437C16.5939 15.9187 16.5377 15.525 16.3689 15.4125C16.1439 15.3 16.0877 15.4125 15.9189 15.6375C15.9752 15.6937 16.2002 15.8062 16.2002 15.8625C16.0314 16.2562 15.5252 16.3125 15.4127 16.7063C15.3002 16.9875 15.3564 17.4375 15.6377 17.6062C15.8064 17.7187 15.9189 17.7187 16.0877 17.7187C16.5939 17.6625 16.3127 17.775 16.3689 17.8875C16.3689 18 16.5377 18.3937 16.8189 18.0562M15.1314 15.3C15.1314 15.6375 15.4689 15.5812 15.6939 15.525C15.6939 15.4125 15.6939 15.3 15.7502 15.1875C15.6377 15.2437 15.4689 15.2437 15.4127 15.1875C15.2439 15.075 15.8064 14.85 15.7502 14.85C15.7502 14.85 15.1877 15.1312 15.4127 14.7937C15.4689 14.6812 15.5814 14.5688 15.6377 14.4563C15.6939 14.3437 15.4689 14.4563 15.4689 14.4563C15.4127 14.4563 15.3564 14.4562 15.3002 14.5125C14.9627 14.7937 15.0752 14.9625 15.1314 15.3" fill="#75A843"></path><path d="M21.0935 15.3C20.8122 14.9063 19.7435 13.6125 18.2247 13.5C18.056 13.5 17.606 13.6687 17.4372 13.725C16.931 14.0625 17.9997 14.3437 18.056 14.5687C18.056 14.6812 18.1122 14.7375 18.1122 14.85C17.9435 14.5687 17.7747 14.4 17.7185 14.2875C17.4372 14.4 16.9872 14.2312 16.931 13.95C16.8747 14.0625 16.8747 14.1187 16.7622 14.2312C16.7622 14.0625 16.706 14.0625 16.6497 13.95C16.6497 14.1187 16.6497 14.3438 16.481 14.4C16.5372 14.2875 16.481 14.175 16.4247 14.0625C16.4247 14.2313 16.4247 14.3438 16.3122 14.4563C16.3685 14.3438 16.256 14.2875 16.256 14.175C16.1997 14.625 15.581 14.7938 16.1997 14.9625C16.4247 15.0188 16.5372 14.9625 16.7622 15.075C16.8185 15.1312 16.931 15.2438 16.931 15.1875C16.931 15.2438 16.706 15.4688 16.8747 15.525C16.8185 15.5813 16.6497 15.9187 16.6497 15.9187C16.8185 15.9187 16.706 16.0313 16.5935 16.1438C16.4247 16.425 16.5935 16.7062 16.6497 17.0437C16.6497 16.9312 16.8185 17.1 16.8185 17.2688C16.8185 17.4938 17.0435 17.6063 17.0997 17.775C16.8185 17.4938 16.7622 17.775 17.0997 17.9437C16.8185 17.9437 16.7622 18.1125 17.0435 18.225C16.3685 18.225 16.931 18.5062 17.0435 18.5625C17.4935 18.675 17.831 18.3375 17.831 18.2812C17.831 18.2812 18.731 19.1812 18.7872 19.1812C18.8435 19.1812 19.2935 18.9563 19.406 19.0688C19.5185 19.2375 19.631 19.0687 19.7435 19.125C19.856 19.2375 20.306 19.125 20.4185 19.0688C20.4747 19.0688 21.0372 18.9563 20.9247 18.8438C20.6435 18.6187 20.306 18.3937 20.0247 18.1687C19.7435 17.9437 19.4622 17.775 19.2372 17.55C19.1247 17.4375 19.1247 17.2125 19.0685 17.0437C19.5747 17.55 20.081 17.8313 20.0247 16.875C20.3622 17.1562 21.0372 18.7312 21.0935 18.7312C21.2622 18.7312 21.0935 17.0438 21.0935 16.875C21.3185 17.1 21.3185 18.9563 21.3747 18.9563C21.656 19.0125 22.0497 16.5375 21.0935 15.3" fill="#89664C"></path><path d="M17.0439 18.1688C16.9877 18.1688 16.7064 17.775 16.7064 17.7188C16.8752 18.3938 16.2002 18 16.3689 17.7188C16.1439 17.6625 15.5814 18 15.8064 18.3375C15.6939 18.5625 16.5939 18.3938 16.6502 18.2813C16.8752 18.7875 17.4377 18.225 17.0439 18.1688M19.6877 19.8563C19.9689 19.4625 18.7877 19.35 18.9002 18.9C18.7314 19.0125 18.5064 19.4063 18.2814 19.2938C18.1689 19.2375 17.7189 19.5188 17.9439 19.6875C17.9439 19.4625 18.0564 19.6313 18.2252 19.575C18.1689 19.7438 18.0002 19.9125 18.2814 20.025C18.1689 19.6875 18.6189 19.8563 18.5627 19.6875C18.4502 19.575 18.9564 19.575 19.0127 19.575C19.1814 19.575 19.7439 19.7438 19.5189 19.9125C19.5189 19.9125 19.6314 19.9125 19.6877 19.8563M15.9189 15.0188C15.8627 15.1313 15.6377 15.3 15.6377 15.4688C15.6377 15.5813 15.9189 15.8625 16.0314 15.6938C15.6939 15.4688 16.0877 15.3 16.2564 15.3C16.3127 15.3 16.3127 15.4125 16.3127 15.4125C16.3689 15.4688 16.8189 15.3 16.7627 15.1875C16.8189 14.9625 16.0877 14.9625 15.9189 15.0188Z" fill="#FFCE31"></path></svg>
                                            <Icon viewBox="0 0 36 36">
                                                <Path d="M18 6.30002H30.15C29.1937 5.34377 28.125 4.44377 27 3.71252H18V6.30002Z" fill="white"></Path>
                                                <Path d="M18 8.88755H32.2312C31.6125 7.9313 30.9375 7.08755 30.2063 6.30005H18V8.88755Z" fill="#ED4C5C"></Path>
                                                <Path d="M18 11.475H33.5813C33.1875 10.575 32.7375 9.67495 32.2312 8.88745H18V11.475Z" fill="white"></Path>
                                                <Path d="M18 14.0625H34.425C34.2 13.1625 33.9188 12.3187 33.5813 11.475H18V14.0625Z" fill="#ED4C5C"></Path>
                                                <Path d="M18 16.7063H34.8188C34.7625 15.8063 34.5938 14.9625 34.425 14.1188H18V16.7063Z" fill="white"></Path>
                                                <Path d="M34.8188 16.7063H18V18H1.125C1.125 18.45 1.125 18.8438 1.18125 19.2938H34.8188C34.875 18.8438 34.875 18.45 34.875 18C34.875 17.55 34.875 17.1 34.8188 16.7063Z" fill="#ED4C5C"></Path>

                                                <Path d="M1.57539 21.8812H34.4254C34.6504 21.0375 34.7629 20.1937 34.8191 19.2937H1.18164C1.23789 20.1375 1.35039 21.0375 1.57539 21.8812Z" fill="white"></Path>
                                                <Path d="M2.41895 24.4687H33.5814C33.9189 23.625 34.2002 22.7812 34.4252 21.8812H1.5752C1.8002 22.7812 2.08145 23.625 2.41895 24.4687Z" fill="#ED4C5C"></Path>
                                                <Path d="M3.76895 27.0562H32.2314C32.7377 26.2125 33.1877 25.3688 33.5814 24.4688H2.41895C2.8127 25.3688 3.2627 26.2125 3.76895 27.0562Z" fill="white"></Path>
                                                <Path d="M5.79355 29.6438H30.2061C30.9373 28.8563 31.6686 27.9563 32.2311 27.0563H3.76855C4.33105 28.0125 5.0623 28.8563 5.79355 29.6438Z" fill="#ED4C5C"></Path>
                                                <Path d="M8.94394 32.2313H27.0564C28.2377 31.5 29.2502 30.6 30.2064 29.6438H5.79395C6.7502 30.6563 7.81894 31.5 8.94394 32.2313Z" fill="white"></Path>
                                                <Path d="M17.9996 34.875C21.3184 34.875 24.4121 33.9187 27.0559 32.2312H8.94336C11.5871 33.9187 14.6809 34.875 17.9996 34.875Z" fill="#ED4C5C"></Path>
                                                <Path d="M9 3.7125C7.81875 4.44375 6.75 5.34375 5.79375 6.3C5.00625 7.0875 4.33125 7.9875 3.76875 8.8875C3.2625 9.73125 2.75625 10.575 2.41875 11.475C2.08125 12.3187 1.8 13.1625 1.575 14.0625C1.35 14.9062 1.2375 15.75 1.18125 16.65C1.125 17.1 1.125 17.55 1.125 18H18V1.125C14.6812 1.125 11.6438 2.08125 9 3.7125Z" fill="#428BC1"></Path>
                                                <Path d="M14.0621 1.6875L14.3434 2.53125H15.1871L14.5121 3.09375L14.7371 3.9375L14.0621 3.43125L13.3871 3.9375L13.6121 3.09375L12.9371 2.53125H13.7809L14.0621 1.6875ZM16.3121 5.0625L16.5934 5.90625H17.4371L16.7621 6.46875L16.9871 7.3125L16.3121 6.80625L15.6371 7.3125L15.8621 6.46875L15.1871 5.90625H16.0309L16.3121 5.0625ZM11.8121 5.0625L12.0934 5.90625H12.9371L12.2621 6.46875L12.4871 7.3125L11.8121 6.80625L11.1371 7.3125L11.3621 6.46875L10.6871 5.90625H11.5309L11.8121 5.0625ZM14.0621 8.4375L14.3434 9.28125H15.1871L14.5121 9.84375L14.7371 10.6875L14.0621 10.1813L13.3871 10.6875L13.6121 9.84375L12.9371 9.28125H13.7809L14.0621 8.4375ZM9.56211 8.4375L9.84336 9.28125H10.6871L10.0121 9.84375L10.2371 10.6875L9.56211 10.1813L8.88711 10.6875L9.11211 9.84375L8.43711 9.28125H9.28086L9.56211 8.4375ZM5.06211 8.4375L5.34336 9.28125H6.18711L5.51211 9.84375L5.73711 10.6875L5.06211 10.1813L4.38711 10.6875L4.61211 9.84375L3.93711 9.28125H4.78086L5.06211 8.4375ZM16.3121 11.8125L16.5934 12.6562H17.4371L16.7621 13.2188L16.9871 14.0625L16.3121 13.5563L15.6371 14.0625L15.8621 13.2188L15.1871 12.6562H16.0309L16.3121 11.8125ZM11.8121 11.8125L12.0934 12.6562H12.9371L12.2621 13.2188L12.4871 14.0625L11.8121 13.5563L11.1371 14.0625L11.3621 13.2188L10.6871 12.6562H11.5309L11.8121 11.8125ZM7.31211 11.8125L7.59336 12.6562H8.43711L7.76211 13.2188L7.98711 14.0625L7.31211 13.5563L6.63711 14.0625L6.86211 13.2188L6.18711 12.6562H7.03086L7.31211 11.8125ZM14.0621 15.1875L14.3434 16.0312H15.1871L14.5121 16.5938L14.7371 17.4375L14.0621 16.9313L13.3871 17.4375L13.6121 16.5938L12.9371 16.0312H13.7809L14.0621 15.1875ZM9.56211 15.1875L9.84336 16.0312H10.6871L10.0121 16.5938L10.2371 17.4375L9.56211 16.9313L8.88711 17.4375L9.11211 16.5938L8.43711 16.0312H9.28086L9.56211 15.1875ZM5.06211 15.1875L5.34336 16.0312H6.18711L5.51211 16.5938L5.73711 17.4375L5.06211 16.9313L4.38711 17.4375L4.61211 16.5938L3.93711 16.0312H4.78086L5.06211 15.1875ZM6.63711 7.3125L7.31211 6.80625L7.98711 7.3125L7.70586 6.46875L8.38086 5.90625H7.53711L7.31211 5.0625L7.03086 5.90625H6.24336L6.91836 6.4125L6.63711 7.3125ZM2.13711 14.0625L2.81211 13.5563L3.48711 14.0625L3.20586 13.2188L3.88086 12.6562H3.09336L2.81211 11.8125L2.53086 12.6562H1.96836C1.96836 12.7125 1.91211 12.7687 1.91211 12.825L2.36211 13.1625L2.13711 14.0625Z" fill="white"></Path>

                                            </Icon>
                                        }
                                    >Dolar Americano</Button>
                                </Button.Group>
                            </FormControl>
                            <Box flex={1} />
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontWeight={"bold"}>Precio por Planta</Text>
                                    <Text flex={1} textAlign="right" fontWeight={"bold"}>{Decimal(contrato?.precio_planta ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>{moneda}</Text></Text>
                                </HStack>
                            </Box>
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontWeight={"bold"}>Total a Invertir</Text>
                                    <Text flex={1} textAlign="right" fontWeight={"bold"}>{Decimal(contrato?.total ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>{moneda}</Text></Text>
                                </HStack>
                            </Box>
                            <Box mt={3}>
                                <HStack justifyContent={"space-between"}>
                                    <Pressable onPress={() => {

                                        if (!contratoAceptado) {
                                            setIndexContract(true)
                                        }

                                    }}>
                                        <HStack>
                                            <Icon as={AntDesign} name={contratoAceptado ? "checkcircle" : "minuscircleo"} mr={2} top={0.5} />
                                            <Text>Acepto los terminos y condiciones</Text>
                                        </HStack>
                                    </Pressable>
                                </HStack>
                            </Box>
                            <Box my={3}>
                                <Button onPress={() => {
                                    
                                    // console.log("bottomSheetRef.current", bottomSheetRef.current)

                                    // return 
                                    // console.log("moneda", moneda)

                                    if (!(parseFloat(plantas) > 0))
                                        return toast.show({
                                            duration: 2500,
                                            render: () => {
                                                return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>La cantidad de plantas no es correcta</Box>;
                                            },
                                            top: 10
                                        })

                                    if (!moneda)
                                        return toast.show({
                                            duration: 2500,
                                            render: () => {
                                                return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>Debe seleccionar una moneda</Box>;
                                            }
                                        })

                                    if (contratoAceptado) {
                                        comprarPlantas()
                                    } else {
                                        setIndexContract(true)
                                    }
                                }}>Realizar Inversión</Button>
                            </Box>
                        </> : <>
                            <Box mt={3}>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontSize="sm" fontWeight={"bold"} color="primary.900">Cantidad de Plantas</Text>
                                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>{Decimal(plantas)?.toNumber()} <Text fontSize={"xs"}>planta{(parseInt(plantas) > 1) ? "s" : ""}</Text></Text>
                                </HStack>
                            </Box>
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontSize="sm" fontWeight={"bold"} color="primary.900">Precio por Planta</Text>
                                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>{Decimal(contrato?.total ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>{moneda}</Text></Text>
                                </HStack>
                            </Box>
                            <Box>
                                <HStack justifyContent={"space-between"}>
                                    <Text flex={1} fontSize="md" color="primary.900" fontWeight={"bold"}>Total a Invertir</Text>
                                    <Text flex={1} fontSize="md" textAlign="right" fontWeight={"bold"}>{Decimal(contrato?.total ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>{moneda}</Text></Text>
                                </HStack>
                            </Box>
                            <FormControl isInvalid mt={5}>
                                <Button.Group isAttached mx={{ base: "auto", md: 0 }} w="100%">
                                    <Button
                                        size="sm"
                                        flex={1}
                                        onPress={() => setMetodoPago(true)}
                                        opacity={metodoPago ? 0.7 : undefined} >Transferencia Bancaria</Button>
                                    <Button
                                        onPress={() => setMetodoPago(false)}
                                        opacity={!metodoPago ? 0.7 : undefined}
                                        flex={1}
                                        name="right"
                                        size="sm">Pago con Tarjeta</Button>
                                </Button.Group>
                            </FormControl>
                            {(!metodoPago) ? <>

                                <Heading fontSize="xs" my={2}>Pago con Tarjeta de Débito o Crédito</Heading>
                                <HStack >
                                    <Box w={"50%"} pr={1}>
                                        <FormControl>
                                            <Input autoComplete='name' value={first_name} onChangeText={set_first_name} size="xs" fontSize="xs" py={0} placeholder="Nombre(s) del Titular" />
                                        </FormControl>
                                    </Box>
                                    <Box w={"50%"} pl={1}>
                                        <FormControl>
                                            <Input autoComplete='name-middle' value={last_name} onChangeText={set_last_name} size="xs" fontSize="xs" py={0} placeholder="Apellido(s) del Titular" />
                                        </FormControl>
                                    </Box>
                                </HStack>

                                <FormControl mt={3}>
                                    <Input autoComplete='cc-number' value={card_number} onChangeText={set_card_number} size="xs" fontSize="xs" py={0} placeholder="Número de Tarjeta de credito" />
                                </FormControl>
                                <HStack mt={3}>
                                    <Box w={"33%"}>
                                        <FormControl>
                                            <Input autoComplete='cc-exp-month' value={expiration_date_month} onChangeText={set_expiration_date_month} size="xs" fontSize="xs" py={0} placeholder="Mes (MM)" />
                                        </FormControl>
                                    </Box>
                                    <Box w={"33%"} px={2}>
                                        <FormControl>
                                            <Input autoComplete='cc-exp-year' value={expiration_date_year} onChangeText={set_expiration_date_year} size="xs" fontSize="xs" py={0} placeholder="Año (YYYY)" />
                                        </FormControl>
                                    </Box>
                                    <Box w={"33%"}>
                                        <FormControl>
                                            <Input autoComplete='cc-csc' type='password' value={card_code} onChangeText={set_card_code} size="xs" fontSize="xs" py={0} placeholder="CVV / CVC" />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <Box flex={1} />
                                <Button onPress={pagoTarjeta}>Pagar</Button>

                            </> : <>
                                <Heading fontSize="md" my={5}>Pago mediante transferencia bancaria</Heading>
                                <Text y={5}>Se ha enviado un correo electrónico a tu email registrado que contiene la información para realizar su transferencia.</Text>
                                <Text fontWeight="bold" my={5}>LA FICHA DE PAGO NO ES UNA CONFIRMACIÓN DE SU INVERSIÓN, contiene la información para que pueda hacer su transferencia.</Text>

                                <Pressable>
                                    <Icon viewBox="0 0 30 32" size={"5xl"} my={5} mx="auto">
                                        <Path d="M4.73145 3.7509C4.73145 3.14707 4.73144 2.54182 4.73998 1.93941C4.75776 0.805006 5.54366 0.0141233 6.67451 0.0127008C11.2107 0.00748515 15.7467 0.00748515 20.2824 0.0127008C20.3884 0.0127008 20.4958 0.0311923 20.5989 0.0411494C20.6352 0.164192 20.7411 0.140721 20.8315 0.154235C21.3002 0.225357 21.638 0.47073 21.9381 0.844835C22.3108 1.30855 22.441 1.82633 22.4509 2.38891C22.4659 3.22886 22.4808 4.06953 22.4509 4.90807C22.4047 6.13209 23.394 7.13563 24.6614 7.11856C25.5604 7.10647 26.4601 7.10362 27.3584 7.11856C28.2204 7.13492 28.8641 7.52752 29.2787 8.29706C29.3726 8.47131 29.3719 8.68468 29.5184 8.83262C29.5952 9.11284 29.5461 9.4016 29.5461 9.68111C29.549 16.3984 29.549 23.1157 29.5461 29.833C29.5461 31.2725 28.8207 32.0001 27.3847 32.0001H6.88077C5.47112 32.0001 4.73998 31.2661 4.73998 29.8486C4.73998 26.0554 4.73998 22.2644 4.73998 18.4754C4.90427 18.4626 5.06857 18.4377 5.23357 18.4377C9.7949 18.4377 14.356 18.4377 18.9168 18.4377C20.2582 18.4377 21.1501 17.58 21.1586 16.2621C21.1729 14.1654 21.1665 12.0658 21.1586 9.97129C21.17 9.49316 21.0265 9.02417 20.7497 8.63418C20.2689 7.97488 19.5918 7.77289 18.8208 7.77289H5.27624C5.11053 7.77289 4.94481 7.76222 4.77838 7.75582C4.77838 6.64346 4.77838 5.5311 4.76914 4.41875C4.76914 4.19613 4.81821 3.96925 4.73145 3.7509ZM12.2946 27.4219L12.2128 27.3743V26.2406C12.2128 24.8679 12.2128 23.4953 12.2128 22.1219C12.2128 21.6624 11.9568 21.4185 11.5649 21.4867C11.173 21.555 11.1517 21.8609 11.1517 22.1653C11.1517 23.8103 11.1517 25.4554 11.1517 27.1005C11.1517 27.2022 11.205 27.3465 11.1005 27.3956C10.9682 27.4589 10.9035 27.3024 10.8259 27.2263C10.3451 26.7534 9.87147 26.2726 9.39211 25.7982C9.07419 25.4831 8.78614 25.4554 8.52797 25.7065C8.29184 25.9362 8.32669 26.2228 8.64176 26.5393C9.3601 27.2605 10.0806 27.9793 10.8032 28.6957C11.2719 29.158 12.0948 29.1566 12.5706 28.6957C12.902 28.375 13.2249 28.045 13.5514 27.7192C13.9703 27.301 14.397 26.8906 14.8038 26.4604C15.0072 26.247 15.0741 25.9796 14.8557 25.7264C14.6552 25.4952 14.4119 25.4902 14.1495 25.6318C14.0172 25.7106 13.8974 25.8086 13.7939 25.9227L12.2946 27.4219Z" fill="#E1E1E1"></Path>
                                        <Path d="M4.77971 7.75636C4.94471 7.76277 5.11043 7.77343 5.27756 7.77343H18.8193C19.5903 7.77343 20.2674 7.97542 20.7482 8.63473C21.0255 9.02406 21.1696 9.49253 21.1592 9.97041C21.1664 12.0671 21.1728 14.1666 21.1592 16.2612C21.1507 17.5791 20.2588 18.4361 18.9175 18.4368C14.3566 18.4411 9.79551 18.4411 5.23418 18.4368C5.06917 18.4368 4.90488 18.4617 4.74058 18.4745C4.00944 18.3906 3.27617 18.4425 2.54432 18.4418C1.91915 18.4418 1.31603 18.4098 0.801107 17.9881C0.313917 17.5898 0.0187577 17.0834 0.0187577 16.4596C0.0095118 13.0642 0.0187577 9.66885 0.0187577 6.27417C0.180206 6.3332 0.161003 6.50461 0.232126 6.62125C0.636102 7.32607 1.19512 7.76846 2.0486 7.75921C2.95897 7.75636 3.86934 7.75636 4.77971 7.75636ZM8.67722 13.0998V15.6602C8.67722 15.6837 8.67722 15.7079 8.67722 15.7313C8.69429 16.1759 8.86783 16.3565 9.31093 16.3622C9.87991 16.3693 10.4489 16.375 11.0179 16.3622C11.9631 16.3387 12.6053 15.7136 12.6231 14.7683C12.6437 13.6674 12.6416 12.5635 12.6231 11.4633C12.6075 10.501 11.9581 9.87155 10.998 9.85662C10.4645 9.84808 9.93112 9.85093 9.39841 9.85662C8.8337 9.86088 8.67936 10.0159 8.67722 10.5785C8.67438 11.4163 8.67651 12.2577 8.67722 13.0984V13.0998ZM3.6453 13.1169C3.6453 13.9568 3.64103 14.7968 3.6453 15.636C3.64886 16.099 3.85867 16.3622 4.20077 16.3565C4.54287 16.3508 4.71356 16.1062 4.71854 15.6496C4.72352 15.247 4.72849 14.8444 4.71854 14.4405C4.71214 14.2271 4.78966 14.146 5.00303 14.156C5.34513 14.1688 5.68865 14.1638 6.03146 14.156C6.9781 14.1389 7.58762 13.5386 7.60754 12.5998C7.61607 12.1977 7.61607 11.7947 7.60754 11.3907C7.58905 10.4825 6.99944 9.87795 6.09618 9.85235C5.54071 9.8367 4.98454 9.84524 4.42836 9.84808C3.81528 9.84808 3.64601 10.0174 3.64601 10.6304C3.64174 11.4597 3.64459 12.2876 3.6453 13.1155V13.1169ZM13.7966 13.1133C13.7966 13.9896 13.7909 14.8658 13.7966 15.7413C13.8002 16.1545 14.0648 16.4148 14.4019 16.3473C14.739 16.2797 14.8592 16.0393 14.8606 15.7214C14.8606 15.1296 14.8706 14.5372 14.8571 13.9433C14.8521 13.7086 14.9325 13.6297 15.1643 13.641C15.495 13.656 15.8272 13.6524 16.16 13.641C16.5156 13.6282 16.7454 13.4049 16.7432 13.1019C16.7411 12.799 16.5028 12.5899 16.1479 12.5792C15.8286 12.5707 15.5078 12.5643 15.1892 12.5792C14.9481 12.5913 14.8436 12.5209 14.8592 12.2627C14.8802 11.9435 14.8802 11.6232 14.8592 11.304C14.8386 11.0152 14.9253 10.9078 15.2305 10.9192C15.8336 10.9419 16.4395 10.9306 17.042 10.9242C17.4744 10.9199 17.7397 10.7023 17.7333 10.3737C17.7269 10.0451 17.4836 9.85377 17.0604 9.85164C16.207 9.84595 15.3535 9.84595 14.5 9.85164C13.9567 9.85519 13.7973 10.0152 13.7945 10.5529C13.7924 11.4064 13.7959 12.2591 13.7966 13.1119V13.1133Z" fill="#F05844"></Path>
                                        <Path d="M29.5171 8.83463C29.3706 8.68669 29.3749 8.47332 29.2775 8.29907C28.8628 7.52953 28.2192 7.13693 27.3572 7.12057C26.4589 7.10279 25.5592 7.10564 24.6602 7.12057C23.3928 7.13764 22.4035 6.1341 22.4497 4.91008C22.481 4.07155 22.4661 3.23088 22.4497 2.39092C22.4397 1.82834 22.3074 1.31057 21.9369 0.846847C21.6368 0.472742 21.2968 0.226657 20.8302 0.156246C20.7399 0.142733 20.6339 0.166203 20.5977 0.0431613C21.4355 -0.0175386 22.2767 -0.01421 23.114 0.0531184C23.8784 0.120834 24.5957 0.451921 25.1431 0.989803C26.3081 2.11781 27.4532 3.2662 28.5783 4.43498C29.2184 5.09856 29.5292 5.92856 29.5399 6.85315C29.5484 7.51246 29.5961 8.17461 29.5171 8.83463Z" fill="#B4B4B4"></Path>
                                        <Path d="M4.77985 7.75642C3.86948 7.75642 2.95911 7.75642 2.04946 7.76425C1.19598 7.77278 0.636961 7.3304 0.232985 6.62628C0.165419 6.50964 0.181777 6.33824 0.0196172 6.2792C-0.14681 4.79701 0.75858 3.77498 2.24575 3.76644L4.73078 3.75293C4.8147 3.97128 4.76847 4.19816 4.7699 4.42006C4.77843 5.53028 4.77772 6.64264 4.77985 7.75642Z" fill="#BA3F30"></Path>
                                        <Path d="M12.295 27.4219L13.7886 25.9233C13.8921 25.8093 14.012 25.7113 14.1442 25.6324C14.4067 25.4902 14.6499 25.4959 14.8505 25.727C15.0688 25.9802 15.002 26.2455 14.7986 26.461C14.3917 26.8913 13.965 27.3017 13.5461 27.7199C13.2196 28.0456 12.8967 28.3756 12.5653 28.6964C12.0895 29.1566 11.2666 29.158 10.7979 28.6964C10.0739 27.9818 9.35341 27.263 8.6365 26.54C8.32143 26.2235 8.28658 25.9368 8.5227 25.7071C8.78088 25.456 9.06892 25.4838 9.38684 25.7989C9.86621 26.2732 10.3399 26.754 10.8207 27.227C10.8982 27.3031 10.9629 27.4596 11.0952 27.3963C11.1998 27.3472 11.1457 27.2028 11.1464 27.1011C11.1464 25.456 11.1464 23.811 11.1464 22.1659C11.1464 21.8615 11.1685 21.5557 11.5596 21.4874C11.9508 21.4191 12.2061 21.6631 12.2076 22.1225C12.2125 23.4959 12.2076 24.8686 12.2076 26.2412V27.3749L12.295 27.4219Z" fill="#B4B4B4"></Path>
                                        <Path d="M8.67676 13.0984C8.67676 12.2578 8.67676 11.4164 8.67676 10.575C8.67676 10.0124 8.83323 9.85739 9.39794 9.85313C9.93065 9.84815 10.4648 9.8453 10.9975 9.85313C11.9576 9.86806 12.607 10.4975 12.6226 11.4598C12.6397 12.5615 12.6418 13.6646 12.6226 14.7649C12.6049 15.7101 11.9626 16.3352 11.0174 16.3587C10.4484 16.3722 9.87944 16.3665 9.31046 16.3587C8.86736 16.353 8.69383 16.1724 8.67676 15.7279C8.67676 15.7044 8.67676 15.6802 8.67676 15.6567C8.67723 14.8042 8.67723 13.9514 8.67676 13.0984ZM9.7436 13.0771C9.7436 13.7172 9.75213 14.3573 9.73933 14.9974C9.73506 15.2293 9.81045 15.3139 10.043 15.3011C10.3617 15.284 10.6831 15.3054 11.0018 15.2933C11.3687 15.2791 11.5508 15.1062 11.5544 14.7385C11.5636 13.6497 11.5601 12.5608 11.5544 11.4719C11.5544 11.1284 11.3609 10.9449 11.0252 10.9299C10.6895 10.915 10.3624 10.9363 10.0295 10.9178C9.78272 10.9036 9.73222 11.0131 9.73649 11.2329C9.75213 11.846 9.74502 12.4619 9.74502 13.0771H9.7436Z" fill="#FEF9F9"></Path>
                                        <Path d="M3.64428 13.1154C3.64428 12.2875 3.64428 11.4597 3.64428 10.6318C3.64428 10.0216 3.8164 9.85514 4.42663 9.84945C4.98281 9.84945 5.53899 9.83808 6.09445 9.85372C6.99771 9.87933 7.58803 10.4839 7.60581 11.3921C7.61434 11.7937 7.61434 12.1967 7.60581 12.6012C7.5859 13.54 6.97637 14.1403 6.02973 14.1574C5.68692 14.163 5.3434 14.168 5.0013 14.1574C4.78793 14.1495 4.70756 14.2285 4.71681 14.4418C4.7289 14.843 4.72392 15.2455 4.71681 15.6509C4.71183 16.1075 4.52976 16.3522 4.19903 16.3579C3.86831 16.3636 3.64712 16.1004 3.64357 15.6374C3.64072 14.7975 3.64499 13.9554 3.64428 13.1154ZM6.54324 12.0102C6.54324 11.8203 6.54751 11.6311 6.54324 11.4412C6.53186 11.0536 6.41166 10.9284 6.02973 10.9206C5.68692 10.9142 5.34269 10.9334 5.00059 10.9142C4.75166 10.9006 4.70116 11.0095 4.70969 11.2285C4.7225 11.5948 4.70969 11.9618 4.70969 12.3288C4.70969 13.0898 4.7097 13.0898 5.47284 13.0898C6.54324 13.0905 6.54324 13.0905 6.54324 12.0102Z" fill="#FEF9F9"></Path>
                                        <Path d="M13.7955 13.1119C13.7955 12.2584 13.792 11.405 13.7955 10.5515C13.7955 10.0138 13.9577 9.85379 14.5011 9.85024C15.3545 9.84549 16.208 9.84549 17.0615 9.85024C17.4882 9.85024 17.7279 10.0501 17.7343 10.3723C17.7407 10.6945 17.4754 10.9185 17.043 10.9228C16.4392 10.9292 15.8339 10.9405 15.2315 10.9178C14.9264 10.9064 14.8396 11.0138 14.8602 11.3026C14.8812 11.6218 14.8812 11.9421 14.8602 12.2613C14.8446 12.5195 14.9491 12.5899 15.1902 12.5778C15.5089 12.5614 15.8303 12.5678 16.149 12.5778C16.5046 12.5885 16.7421 12.8047 16.7443 13.1005C16.7464 13.3964 16.516 13.6268 16.1611 13.6396C15.8303 13.651 15.4982 13.6546 15.1653 13.6396C14.9335 13.6283 14.8531 13.7072 14.8581 13.9419C14.8716 14.5337 14.8631 15.1261 14.8617 15.72C14.8617 16.0379 14.7372 16.279 14.4029 16.3459C14.0686 16.4127 13.8012 16.1531 13.7977 15.7399C13.7905 14.8644 13.7962 13.9881 13.7955 13.1119Z" fill="#FEF9F9"></Path>
                                        <Path d="M9.74536 13.0771C9.74536 12.4619 9.75247 11.846 9.74536 11.2279C9.74109 11.0082 9.79159 10.8986 10.0384 10.9128C10.3691 10.9313 10.7012 10.9128 11.0341 10.9249C11.367 10.937 11.5618 11.1234 11.5633 11.4669C11.5675 12.5558 11.5711 13.6447 11.5633 14.7336C11.5597 15.1013 11.3776 15.2741 11.0106 15.2883C10.6913 15.3004 10.3705 15.2791 10.0519 15.2961C9.81719 15.3089 9.74393 15.225 9.7482 14.9924C9.75389 14.3559 9.74536 13.7165 9.74536 13.0771Z" fill="#F05844"></Path>
                                        <Path d="M6.54375 12.0102C6.54375 13.0906 6.54375 13.0906 5.47691 13.0906C4.71377 13.0906 4.71377 13.0906 4.71377 12.3296C4.71377 11.9626 4.72302 11.5956 4.71377 11.2293C4.70523 11.0102 4.75573 10.9014 5.00466 10.9149C5.34676 10.9341 5.69099 10.9149 6.0338 10.9213C6.41573 10.9292 6.53593 11.0543 6.54731 11.442C6.54802 11.6311 6.54375 11.8203 6.54375 12.0102Z" fill="#F05844"></Path>
                                    </Icon>
                                    <Heading mt={1} mb={5} fontSize="lg" textAlign="center"> Descargar Ficha de Pago</Heading>
                                </Pressable>
                            </>}
                        </>
                    }
                </Box>
            </BottomSheet>
            <Modal
                visible={indexContract}
                animationType='slide'
            >
                <HStack mt={5} mb={1} mx={5}>
                    <Heading flex={1} fontSize="md" my={5} align="center">CONTRATO DE INVERSIÓN EN PLANTAS DE AGAVE AZUL TEQUILANA WEBER.</Heading>
                    <Pressable onPress={() => setIndexContract(false)}><Text color="red.400">X</Text></Pressable>
                </HStack>
                <ScrollView my={2}>

                    {renderContrato()}
                </ScrollView>
                <Box mx={5} my={2}>
                    <Button onPress={() => {
                        console.log("U2FsdGVkX19RWswjPmj7I5JqR+h5tMce+cV5Pwc=")
                        setIndexContract(false)
                        setAceptarContrato(true)
                    }}>Acepto los Terminos y Condiciones</Button>
                </Box>
            </Modal>
        </>
    );
};