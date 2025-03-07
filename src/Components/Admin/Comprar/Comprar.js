import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Keyboard, Dimensions, ScrollView, ActivityIndicator, Linking, SafeAreaView, Platform, Alert } from 'react-native';
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
    FormControl,
    Pressable,
    Modal as ModalNB,
    useToast,
    KeyboardAvoidingView
} from 'native-base';
import { Input } from '../../Widgets/Input';
import moment from 'moment/moment';
import Color from 'color';
import { Path } from 'react-native-svg';
import AntDesign from "react-native-vector-icons/AntDesign";
import Decimal from 'decimal.js';

import User from '../../../Contexts/User';
import axios from '../../../Axios';
import IconPDF from '../../../../assets/icons/IconPDF'

import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import {  } from 'react-native-safe-area-context';


const windowHeight = Dimensions.get('window').height;



function Comprar(props) {

    const user = useContext(User)

    const {
        loading, setLoading,

        moneda, setMoneda,
        plantas, setPlantas,

        contrato, setContrato,

        hacienda_id,
        hacienda,

        setCompra,

        reventa_id,
        reventa,
        inversiones,
        limite,
        beneficiarios,
        navigator
    } = props

    const [contratoAceptado, setAceptarContrato] = useState(false)
    const [viewContract, setViewContract] = useState(false)

    let getContratoInfo = (plantas, _moneda = moneda) => {
        plantas = parseFloat(plantas)

        setMoneda(_moneda)
        setPlantas(plantas)
        setLoading(true)

        axios.get("/hacienda/contrato", {
            params: {
                hacienda_id,
                plantas: plantas,
                moneda: _moneda,
                reventa: reventa_id,
            }
        })
            .then(({ data }) => {
                setContrato(data)

            })
            .catch(error => {
                console.log("error", error)
            })
            .finally(e => setLoading(false))
    }

    let comprarPlantas = () => {

        setLoading(true)

        console.log(" AS AS AS AS ", plantas)
        axios
            .post("/hacienda/compra", {
                hacienda_id,
                reventa_id,
                moneda,
                plantas,
            })
            .then(({ data }) => {
                setCompra(data)
            })
            .catch((error) => {
                return Toast.show({
                    position: "bottom",
                    bottomOffset: windowHeight * 0.2,
                    type: 'error',
                    text1Style: {
                        fontFamily: "Poppins-Thin"
                    },
                    text2Style: {
                        fontFamily: "Poppins"
                    },
                    text1: 'Debe seleccionar la Moneda',
                    text2: 'Para continuar, debe de haber seleccionado la moneda'
                });
            })
            .finally(e => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getContratoInfo(0)
    }, []);

    useEffect(() => {
        if (contratoAceptado)
            return Toast.show({
                position: "bottom",
                bottomOffset: windowHeight * 0.2,
                type: 'error',
                text1Style: {
                    fontFamily: "Poppins-Thin"
                },
                text2Style: {
                    fontFamily: "Poppins"
                },
                text1: 'Contrado Aceptado',
                text2: 'Presione el botón para continuar'
            });
    }, [contratoAceptado]);

    let renderContrato = () => {


        console.log('contrato')
        console.log('contrato')
        console.log('contrato')
        console.log('contrato')
        console.log('contrato')
        console.log('contrato')
        console.log('contrato')
        console.log('contrato')
        console.log('contrato')
        console.log(contrato)
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

        return <ModalNB
            isOpen={viewContract}
            animationPreset='slide'
            onClose={() => setViewContract(false)}
            size={'lg'}
        >
            <ModalNB.Content maxH={windowHeight * 0.85}>
                <ModalNB.CloseButton />
                <ModalNB.Header>Contrato de Inversión</ModalNB.Header>
                <ModalNB.Body >
                    <ScrollView
                        style={{
                            height: '100%',
                            flex: 1,
                        }}
                    >
                        <Box mr={6}>
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
                                    = = NOVENA.- Así mismo también estipula el “INVERSIONISTA” que si fuere el caso de que durante el tiempo y vigencia del presente contrato de compra llegase a fallecer, todas y cada una de las obligaciones y derechos adquiridos en el presente contrato pasarán en favor de su beneficiario señor {beneficiarios[0].nombre}, quien adquirirá en su persona todos los derechos y obligaciones que en este contrato adquiere el “INVERSIONISTA”.
                                </Text>
                                <Text>
                                    = = LEIDO que fue por las partes el presente contrato, y enteradas debidamente de su contenido y alcance, considerando que no existe error, dolo o violencia, y por encontrarse satisfechos sus elementos de consentimiento, objeto, y forma, reconociendo su validez en todo tiempo y lugar, lo firman ante la presencia de los testigos que firman también el presente contrato, el día de su fecha.
                                </Text>
                            </Text>
                        </Box>
                    </ScrollView>
                </ModalNB.Body>
                <ModalNB.Footer>
                    <Button.Group space={2}>
                        <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                                setViewContract(false);
                            }}
                        >Cerrar</Button>
                        <Button
                            onPress={() => {

                                setAceptarContrato(true)
                                setViewContract(false)
                            }}
                        >
                            Aceptar Contrato
                        </Button>
                    </Button.Group>
                </ModalNB.Footer>
            </ModalNB.Content>
        </ModalNB>
    }
    // return <SafeAreaView style={{ flex: 1 }}></SafeAreaView>
    const insets = useSafeAreaInsets();

    return <>
        <ScrollView
            style={{
                height: '100%',
                flex: 1,
            }}
        >
            <Box pr={3}>
                <Box style={{ height: 20 }} />
                <FormControl
                    isInvalid={reventa_id ? (plantas > reventa?.cantidad_restante || plantas < 1) : false}
                >
                    <FormControl.Label>Cantidad de Plantas  {(!!reventa_id) && <Text>({reventa?.cantidad_restante} Max)</Text>}</FormControl.Label>
                    <Input
                        keyboardType='numeric'
                        placeholder="Ingrese la cantidad de plantas"
                        onChangeText={plantas => {
                            plantas = parseInt(plantas.replace(/[ ,.]/g, ''))
                            if (isNaN(plantas))
                                plantas = 0
                            setAceptarContrato(false)
                            getContratoInfo(plantas, moneda)
                        }}
                    />
                </FormControl>
                <Box style={{ height: 20 }} />
                <FormControl isInvalid mt={5} >
                    <FormControl.Label>Moneda</FormControl.Label>
                    <Button.Group isAttached mx={{ base: "auto", md: 0 }} w="100%">
                        <Button size="sm" flex={1}
                            onPress={() => getContratoInfo(plantas, "MXN")}
                            opacity={(moneda == "MXN") ? 0.7 : undefined}
                            startIcon={
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
            </Box>
        </ScrollView>
        <Box pr={3}>
            <Box mt={2} border>
                <HStack justifyContent={"space-between"} >
                    <Text flex={1} fontWeight={"bold"}>Precio por Planta</Text>
                    {loading ? <ActivityIndicator /> : <Text flex={1} textAlign="right" fontWeight={"bold"}>{Decimal(contrato?.precio_planta ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>{moneda}</Text></Text>}
                </HStack>
            </Box>
            <Box>
                <HStack justifyContent={"space-between"}>
                    <Text flex={1} fontWeight={"bold"}>Total a Invertir</Text>
                    {loading ? <ActivityIndicator /> : <Text flex={1} textAlign="right" fontWeight={"bold"}>{Decimal(contrato?.total ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>{moneda}</Text></Text>}
                </HStack>
            </Box>
            <Box my={2}>
                <HStack justifyContent={"space-between"}>
                    <Pressable onPress={() => {
                        if (isNaN(parseInt(plantas)) || (parseInt(plantas) < 1))
                            return Toast.show({
                                position: "bottom",
                                bottomOffset: windowHeight * 0.2,
                                type: 'error',
                                text1: 'Cantidad Incorrecta',
                                text2: 'Debe ingresar una cantidad de plantas correcta'
                            });
                        if (!moneda)
                            return Toast.show({
                                position: "bottom",
                                bottomOffset: windowHeight * 0.2,
                                type: 'error',
                                text1: 'Debe seleccionar la Moneda',
                                text2: 'Para continuar, debe de haber seleccionado la moneda'
                            });

                        if (reventa_id) {
                            if (parseInt(plantas) < reventa?.cantidad_restante)
                                return Toast.show({
                                    position: "bottom",
                                    bottomOffset: windowHeight * 0.2,
                                    type: 'error',
                                    text1: 'Cantidad Incorrecta',
                                    text2: 'La cantidad es mayor a la permitida'
                                });
                        }

                        console.log("PRINTING PRINTING")
                        if (!contratoAceptado) {
                            console.log('contratoAceptado', contratoAceptado)
                            setViewContract(true)
                        }
                    }}>
                        <HStack>
                            <Icon as={AntDesign} name={contratoAceptado ? "checkcircle" : "minuscircleo"} mr={2} top={0.5} />
                            <Text>Acepto los terminos y condiciones</Text>
                        </HStack>
                    </Pressable>
                </HStack>
            </Box>
            <Button
                isLoading={loading}

                background={contratoAceptado ? null : "amber.300"}
                onPress={() => {


                    if (isNaN(parseInt(plantas)) || (parseInt(plantas) < 1)){
                        return Toast.show({
                            position: "bottom",
                            bottomOffset: windowHeight * 0.2,
                            type: 'error',
                            text1: 'Cantidad Incorrecta',
                            text2: 'Debe ingresar una cantidad de plantas correcta'
                        });
                    }

                    if (inversiones < 1 && parseInt(plantas) < 25) {
                        return Alert.alert(
                            "Cantidad Incorrecta",
                            `Debe ingresar mínimo 25 plantas en la primera compra`
                        )
                    }

                    if (inversiones >= 1 && parseInt(plantas) < props.limite) {
                        return Alert.alert(
                            "Cantidad Incorrecta",
                            `Debe ingresar mínimo ${props.limite} plantas`
                        )
                    }



                    if (!moneda){
                        return Toast.show({
                            position: "bottom",
                            bottomOffset: windowHeight * 0.2,
                            type: 'error',
                            text1: 'Debe seleccionar la Moneda',
                            text2: 'Para continuar, debe de haber seleccionado la moneda'
                        });
                    }

                    if (!!reventa_id) {
                        console.log("REVENTA ID")
                        if (parseInt(plantas) > reventa?.cantidad_restante)
                            return Toast.show({
                                position: "bottom",
                                bottomOffset: windowHeight * 0.2,
                                type: 'error',
                                text1: 'Cantidad Incorrecta',
                                text2: 'La cantidad es mayor a la permitida'
                            });
                    }

                    if (contratoAceptado) {
                        comprarPlantas()
                    } else {
                        setViewContract(true)
                    }

                }}>
                {(() => {
                    if (contratoAceptado)
                        return "Realizar Inversión"
                    else
                        return "Confirmar mi inversión"
                })()}
            </Button>
        </Box>
        {viewContract && renderContrato()}
    </>


}

function Pagar(props) {

    const {
        loading, setLoading,

        moneda, setMoneda,
        plantas, setPlantas,

        contrato,
        setCompra, compra,

        navigation
    } = props

    const [metodoPago, setMetodoPago] = useState(false)

    /* Información del Pago con Tarjeta */
    const [first_name, set_first_name] = useState('')
    const [last_name, set_last_name] = useState('')
    const [card_number, set_card_number] = useState('')
    const [expiration_date_month, set_expiration_date_month] = useState('')
    const [expiration_date_year, set_expiration_date_year] = useState('')
    const [card_code, set_card_code] = useState('')

    const [error, setError] = useState()

    const toast = useToast()

    let pagoTarjeta = () => {
        Keyboard.dismiss()
        console.log("PAGAR PAGAR")
        setLoading(true)


        // console.log(compra)
        // navigator.navigate
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
                navigation.navigate('Dashboard')
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

    let descargaPdf = async () => {

        console.log("YELLOW", compra)
        let urlPDF = new URL(axios.defaults.baseURL + '/crm/ficha-pago');
        urlPDF.searchParams.append('Authorization', await AsyncStorage.getItem('@token'))
        urlPDF.searchParams.append('inversion_id', compra?.inversion?._id)

        await Linking.openURL(urlPDF.href)
    }


    console.log("moneda", moneda)
    console.log("moneda", moneda)
    console.log("moneda", moneda)
    console.log("metodoPago", metodoPago)
    // !metodoPago && (moneda == "USD")
    console.log("!metodoPago", !metodoPago)
    console.log('moneda == "USD"', moneda == "USD")

    const view = <>
        {(moneda == "USD") && <Box pr={3}>
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
        </Box>}
        <ScrollView style={{
            // height: '100%',
            flex: 1,
            minHeight: 500
        }}>
            {(!metodoPago && (moneda == "USD")) ? <Box flex={1} pr={3}>
                <Heading size={'md'} my={5} >Pago con Tarjeta de Débito o Crédito</Heading>
                <HStack >
                    <Box w={"50%"} pr={1}>
                        <FormControl>
                            <Input autoComplete='name' value={first_name} onChangeText={set_first_name} placeholder="Nombre(s) del Titular" />
                        </FormControl>
                    </Box>
                    <Box w={"50%"} pl={1}>
                        <FormControl>
                            <Input autoComplete='name-middle' value={last_name} onChangeText={set_last_name} placeholder="Apellido(s) del Titular" />
                        </FormControl>
                    </Box>
                </HStack>
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
                <Text mx={1} fontSize={"xs"} color="red.300">{error}</Text>
                <Box flex={1} mb={3} />
            </Box> : <Box pr={3}>
                <Heading fontSize="md" my={5}>Pago mediante transferencia bancaria</Heading>
                <Text y={5}>Se ha enviado un correo electrónico a su email registrado que contiene la información para realizar su transferencia.</Text>
                <Text fontWeight="bold" mt={5} fontSize={16} textAlign={'center'}>LA FICHA DE PAGO NO ES UNA CONFIRMACIÓN DE SU INVERSIÓN</Text>
                <Text fontSize={14} textAlign={'center'} mt={5}>Principalmente Contiene la información para que pueda hacer su transferencia.</Text>
            </Box>}
        </ScrollView>
        <Box pr={3}>
            <Box>
                <HStack justifyContent={"space-between"}>
                    <Text flex={1} fontSize="sm" fontWeight={"bold"} color="primary.900">Cantidad de Plantas</Text>
                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>{Decimal(plantas)?.toNumber()} <Text fontSize={"xs"}>planta{(parseInt(plantas) > 1) ? "s" : ""}</Text></Text>
                </HStack>
            </Box>
            <Box>
                <HStack justifyContent={"space-between"}>
                    <Text flex={1} fontSize="sm" fontWeight={"bold"} color="primary.900">Precio por Planta</Text>
                    <Text flex={1} fontSize="sm" textAlign="right" fontWeight={"bold"}>
                        {Decimal(contrato?.total ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        <Text fontSize={"xs"}>{moneda}</Text>
                    </Text>
                </HStack>
            </Box>
            <Box>
                <HStack justifyContent={"space-between"}>
                    <Text flex={1} fontSize="md" color="primary.900" fontWeight={"bold"}>Total a Invertir</Text>
                    <Text flex={1} fontSize="md" textAlign="right" fontWeight={"bold"}>{Decimal(contrato?.total ?? 0).toDecimalPlaces(2)?.toNumber()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} <Text fontSize={"xs"}>{moneda}</Text></Text>
                </HStack>
            </Box>
            <Button
                background={(moneda == "MXN" || metodoPago) ? "red.600" : null}
                isLoading={loading} startIcon={(moneda == "MXN" || metodoPago) ? <IconPDF /> : <Icon as={AntDesign} name="shoppingcart" size={"md"} />}
                onPress={(moneda == "MXN" || metodoPago) ? descargaPdf : pagoTarjeta}>
                {(moneda == "MXN" || metodoPago) ? "Descargar PDF" : "Pagar"}
            </Button>
        </Box>
    </>

    // console.log('Platform.OS', Platform.OS)

    if (Platform.OS == "ios")
        return <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            style={{ flex: 1 }}
        >
            {view}
        </KeyboardAvoidingView>

    return <SafeAreaView style={{ flex: 1 }}>
        {view}
    </SafeAreaView>

}



function Invertir(props) {
    const { hacienda_id, reventa_id, onClose, route, navigation } = props

    console.log({
        hacienda_id, reventa_id
    })

    const user = useContext(User)

    const [loading, setLoading] = useState(false)
    const [hacienda, setHacienda] = useState()


    const [contrato, setContrato] = useState()

    /* Información de la Inversión */
    const [plantas, setPlantas] = useState(0)
    const [moneda, setMoneda] = useState((user?.cliente?.pais_id?.nombre == "Mexico") ? "MXN" : "USD")

    /* Cuando se compra */
    const [compra, setCompra] = useState()
    // const [metodoPago, setMetodoPago] = useState(false)

    //Solo aplica cuando hay reventa
    const [reventa, setReventa] = useState()

    //Cantidad de inversiones del cliente
    const [inversiones, setInversiones] = useState(0)

    //Limite de inversiones del cliente
    const [limite, setLimite] = useState(0)

    const [beneficiarios, setBeneficiarios] = useState([])

    let getHacienda = () => {
        setLoading(true)
        axios.get('/hacienda', {
            params: {
                _id: hacienda_id
            }
        })
            .then(response => {
                setHacienda(response.data.data)
            })
            .catch(error => {
                return toast.show({
                    duration: 2500,
                    render: () => {
                        return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>No fue posible obtener la hacienda</Box>;
                    },
                    top: 10
                })
            })
            .finally(() => setLoading(false))
    }

    let getLimite = () => {
        setLoading(true)
        axios.get('/limite').then(({ data }) => {
            console.log('limite',data)
            setLimite(data.limite)
            setInversiones(data.inversiones)
            setBeneficiarios(data.beneficiarios)
        }).catch(error => {
            return toast.show({
                duration: 2500,
                render: () => {
                    return <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>No fue posible obtener el limite</Box>;
                }
            })

        }).finally(() => setLoading(false))

    }

    let getReventa = (reventaId = reventa_id) => {

        axios.get("/reventa", {
            params: {
                id: reventaId,
            }
        }).then(({ data }) => {
            setReventa(data)
            getContratoInfo({
                moneda: data.moneda,
                plantas: data.cantidad_restante
            })
            console.log("REVENTA", data)
        }).catch(err => {

        })
    }


    useEffect(() => {
        setCompra()
        getHacienda()
        getLimite()

        if (reventa_id)
            getReventa()
    }, [hacienda_id, reventa_id]);

    // console.log('compra')
    // console.log(compra)
    const insets = useSafeAreaInsets();

    const view = <Box flex={1}
        safeArea
        pl={3}
        py={3}
        variant={"layout"} >
        <Box pr={3}>
            <Box bg={hacienda ? { linearGradient: { colors: [Color(hacienda?.color ?? "#FFF").darken(0.2).hex(), hacienda?.color ?? "#FFF"], start: [0, 0], end: [1, 0] } } : "gray.100"} borderRadius={10} width={"100%"} height={70}>
                <VStack p={2}>
                    <Heading size={"sm"} color="white">{hacienda?.nombre ?? "-"}</Heading>
                    <Text color="white">{hacienda?.descripcion ?? "-"}</Text>
                </VStack>
                <Image alt={"Zeus Oro azul de los altos"} source={require("../../../../assets/img/zeus_agave.png")} resizeMode="contain" h={"20"} opacity={0.2} right={-135} bottom={10} />
            </Box>
        </Box>
        <Button
            rounded={100}
            h={7}
            w={7}
            position="absolute"
            zIndex={100}
            // right={2}
            right={(insets.right + 2)}
            top={(insets.top + 2)}
            // right={(Platform.OS == 'ios') ? (insets.right + 2) : 2}
            // top={(Platform.OS == 'ios') ? (insets.top + 2) : 2}
            bg="red.500"
            startIcon={<Icon as={AntDesign} name="close" />}
            onPress={() => {
                // onClose()
                navigation.goBack()
            }}
        />
        {compra ?
            <Pagar

                {...props}
                moneda={moneda}
                setMoneda={setMoneda}

                plantas={plantas}
                setPlantas={setPlantas}

                contrato={contrato}
                setContrato={setContrato}

                loading={loading}
                setLoading={setLoading}

                hacienda={hacienda}

                setCompra={setCompra}
                compra={compra}

                reventa={reventa}
                beneficiarios={beneficiarios}
                inversiones={inversiones}
                limite={limite}
            />
            :
            <Comprar
                {...props}
                moneda={moneda}
                setMoneda={setMoneda}

                plantas={plantas}
                setPlantas={setPlantas}

                contrato={contrato}
                setContrato={setContrato}

                loading={loading}
                setLoading={setLoading}

                hacienda={hacienda}

                setCompra={setCompra}
                compra={compra}
                inversiones={inversiones}
                beneficiarios={beneficiarios}
                limite={limite}
                reventa={reventa}
            />}
        <Toast
            config={{
                fullError: ({ text1, text2, props }) => (
                    <Box px={5}>
                        <Box backgroundColor="red.600" p={"1.5"} borderRadius={5}>
                            <Text style={{ color: "white" }}>{text1}</Text>
                            {text2 && <Text style={{ color: "white", }} fontSize="xs">{text2}</Text>}
                        </Box>
                    </Box>
                )
            }}
        />
    </Box>

    console.log('Platform.OS', Platform.OS)
    if (Platform.OS == "ios")
        return <KeyboardAvoidingView
            behavior="padding"
            // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            style={{ flex: 1 }}
        >
            {view}
        </KeyboardAvoidingView>

    return <SafeAreaView style={{ flex: 1 }}>
        {view}
    </SafeAreaView>
}

const InvertirModal = (props) => {

    // props.hacienda_id = props.route.params.hacienda_id
    // props.reventa_id = props.route.params.reventa_id


    console.log('props')
    console.log('props')
    console.log('props')
    console.log('props', props)

    return (
        <Invertir {
            ...props
        }
            hacienda_id={props.route.params.hacienda_id}
            reventa_id={props.route.params.reventa_id}
        />
        // <Modal
        //     animationType="slide"
        //     transparent={true}
        //     visible={isOpen}

        //     style={{
        //         backgroundColor: "#FFF",
        //         height: "100%"
        //     }}
        //     onRequestClose={() => {
        //         onClose();
        //     }}>
        //     {isOpen && }
        // </Modal>
    );
};

export default InvertirModal;