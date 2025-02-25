import React, { useContext, useEffect, useState } from "react";
import { Button, VStack, Text, Link, Image, IconButton, Icon, Center, Hidden, StatusBar, Stack, Heading,
	Spinner, useToast, Box, ScrollView } from 'native-base';
import io from "socket.io-client";
import Entypo from "react-native-vector-icons/Entypo";
import AppIntroSlider from 'react-native-app-intro-slider';
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//Componentes
import axios from '../../Axios.js'
import { Input } from '../Widgets/Input'
import { SetUser } from "../../Contexts/User";
import Socket, { SetSocketContext } from "../../Contexts/Socket";

import { API_URL } from "../../ENVIROMENT"

// Función para crear un socket
const createSocket = async () => {
	const token = await AsyncStorage.getItem('@token');
	return io(API_URL, {
		extraHeaders: {
			Authorization: token,
		},
		withCredentials: true,
	});
};


export default function SignInForm({ navigation }) {

	const slides = [
		{
			key: 's1',
			title: '¡Invierte en Agave!',
			subtitle: 'Desde cualquier parte del mundo como nunca antes',
			description: "Somos la nueva generación de AgroTech",
			image: require("../../../assets/img/logo_zeus_oadla.png"),
			content: <>
				<Button borderRadius={100} width={200} mt={5} onPress={(e) => {
					onDone()
					navigation.navigate('Register')
				}}>Crear una Cuenta</Button>
				<Button borderRadius={100} width={200} mt={5} onPress={() => {
					console.log("onDone")
					onDone()
				}}>Iniciar Sesión</Button>
			</>
		},
		{
			key: 's2',
			title: 'Selección de Haciendas',
			subtitle: 'Buscamos los mejores predios para plantar y cultivar agave.',
			image: require("../../../assets/img/card1_farm.png"),
		},
		{
			key: 's3',
			title: 'Selección de Plantas',
			subtitle: 'Elegimos plantas de primera calidad para ofrecerte el mejor rendimiento posible',
			image: require("../../../assets/img/card2_plant.png"),
		},
		{
			key: 's4',
			title: 'Venta de plantas',
			subtitle: 'Despues de plantar el agave en las haciendas elegidas, ponemos en venta las plantas en nuestra plataforma y app móvil.',
			image: require("../../../assets/img/card3_sell.png"),
		},
		{
			key: 's5',
			title: 'Retorno de Capital',
			subtitle: 'Una vez el agave llega a su maduración en alguna de nuestras haciendas, lo vendemos a las tequileras y hacemos retornos de capital.',
			image: require("../../../assets/img/card4_return.png"),
		},
	]

	const toast = useToast();
	const setUser = useContext(SetUser)
	const setSocket = useContext(SetSocketContext);

	const [text, setText] = useState("")
	const [pass, setPass] = useState("")
	const [intro, setIntro] = useState(false)
	const [showPass, setShowPass] = useState(false)
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getIntroStatus()
		getUserLogged()
	}, [])


	const getIntroStatus = () => {
		AsyncStorage.getItem('@intro_status')
			.then(status => {
				setIntro((status == null))
			})
			.catch(error => {
				console.log("e", error)
			})
	}


	/**
	 * 
	 * @descrpcion Obtiene los datos del usuario logueado y redirige según su estado.
	 * Hace una solicitud para obtener la información del usuario.
	 * dependiendo del estado del usuario (`status`), redirige a la pantalla correspondiente.
	 * en caso de error, redirige a la pantalla de inicio de sesión.
	 */
	const getUserLogged = async () => {
	    setLoading(true);

	    try {
	        const { data } = await axios.get('/user/logged', {
	            params: { cliente: true },
	            withCredentials: true,
	        });

	        console.log("Usuario logueado:", data.data);
	        setUser(data.data);

	        // Redirige según el estado del usuario
	        switch (data.data.status) {
	            case 0:
	                // Usuario inactivo, no se realiza redirección
	                break;
	            case 1:
	                navigation.navigate("Admin");
	                break;
	            case 2:
	                navigation.navigate("UserInformation");
	                break;
	            case 3:
	                navigation.navigate("Address");
	                break;
	            default:
	                navigation.navigate("Admin");
	                break;
	        }

	        // Crear el socket después de obtner la informacion
	        const socket = await createSocket();
	        setSocket(socket); // Actualizar el contexto del socket

	    } catch (error) {
	        console.error("Error al obtener el usuario logueado:", error);
	        navigation.navigate("SignIn"); // Redirige a inicio de sesión en caso de error
	    } finally {
	        setLoading(false); // Detiene el indicador de carga
	    }
	};



	const onDone = () => {
		console.log("A")
		AsyncStorage.setItem('@intro_status', String(true))
			.then(status => {
				setIntro(false)
			})
			.catch(error => {
				console.log("e", error)
			})
	}


	/**
	 *  @descripcion Maneja el envío del formulario de inicio de sesión.
	 * 
	 * Envía las credenciales del usuario a la API de inicio de sesión.
	 * Guarda el token en AsyncStorage y actualiza los encabezados de Axios.
	 * Dependiendo del estado del usuario (`status`), redirige a la pantalla correspondiente.
	 * Crea el socket después de iniciar sesión exitosamente.
	 */
	const onFinish = async () => {
	    setLoading(true);

	    try {
	        const response = await axios.post(
	            '/login',
	            { email: text, password: pass, keep_session: true },
	            { withCredentials: true }
	        );

	        const { data, headers } = response;

	        await AsyncStorage.setItem('@token', headers.authorization);
	        axios.defaults.headers.common['Authorization'] = headers.authorization;
	        setUser(data.user);

	        // Redirigir según el estado del usuario
	        console.log("Estado del usuario:", data.user.status);
	        switch (data.user.status) {
	            case 0:
	                // Usuario inactivo, no se realiza redirección
	                break;
	            case 1:
	                navigation.navigate("Admin");
	                break;
	            case 2:
	                navigation.navigate("UserInformation");
	                break;
	            case 3:
	                navigation.navigate("Address");
	                break;
	            default:
	                navigation.navigate("Admin");
	                break;
	        }

	        // Crear el socket después de iniciar sesión
	        const socket = await createSocket();
	        setSocket(socket); // Actualizar el contexto del socket

	    } catch (error) {
	        console.error("Error durante el inicio de sesión:", error);

	        toast.show({
	            render: () => (
	                <Box bg="red.500" px="2" mx="4" py="1" rounded="sm" mb={5}>
	                    <Heading size="xs" color="white">
	                        {error?.response?.data?.message ?? "El usuario o la contraseña no son correctos"}
	                    </Heading>
	                </Box>
	            ),
	        });
	    } finally {
	        setLoading(false);
	    }
	};



	if (loading)
		return <Spinner flex={1} color="primary.900" size="lg" />


	if (intro)
		return <AppIntroSlider
			renderDoneButton={(e) => <Button variant={"link"} onPress={onDone}>Finalizar</Button>}
			activeDotStyle={{ backgroundColor: "green" }}
			data={slides}
			renderItem={({ item }) => (<Center flex={1} px="5" _light={{ bg: "white", }}>
				<Image alt={item.subtitle} source={item.image} resizeMethod="scale" resizeMode="contain" maxH={250} />
				<Heading mt={"5"}>{item.title}</Heading>
				<Text mt="5" fontWeight="bold" textAlign="center">{item.subtitle}</Text>
				<Text mt="5">{item.description}</Text>
				{item.content}
			</Center>)}
			onDone={onDone}
			showSkipButton={false}
			onSkip={onDone}
		/>


	return <>
		<StatusBar
			translucent
			backgroundColor="transparent"
			barStyle="dark-content"
		/>
		<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
			<Center
				safeAreaTop
				colorScheme="primary"
				my="auto"
				// variant="linear-gradient"
				flex="1"
			>
				<Stack
					flexDirection={{
						base: "column",
						md: "row",
					}}
					w="100%"
					maxW={{
						md: "1016px",
					}}
				// flex={{
				//   base: "1",
				//   md: "none",
				// }}
				>
					<Hidden from="md">
						<VStack px="4" mt="4" mb="5" space="9">
							<Image alt={"Zeus Oro Azul de los Altos"} source={require("../../../assets/img/logo_zeues_oadlah.png")} resizeMode="contain" h={"20"} />
							<VStack space="2">
								<Text fontSize="3xl" fontWeight="bold" >
									Bienvenido
								</Text>
								<Text
									fontSize="md"
									fontWeight="normal"
									_dark={{
										color: "white.300",
									}}
								>
									Inicie sesión para continuar
								</Text>
							</VStack>
						</VStack>
					</Hidden>
					<VStack flex="1" px="6" py="9" space="3" justifyContent="space-between"
						_dark={{ bg: "coolGray.800", }}
						borderTopRightRadius={{ base: "2xl", md: "xl" }}
						borderBottomRightRadius={{ base: "0", md: "xl", }}
						borderTopLeftRadius={{ base: "2xl", md: "0", }}
					>
						<VStack space="7">
							<Hidden till="md">
								<Text fontSize="lg" fontWeight="normal">
									!Inicie sesión para continuar!
								</Text>
							</Hidden>
							<VStack>
								<VStack space="3">
									<VStack space={{ base: "7", md: "4", }}>
										<Input

											value={text}
											onChangeText={txt => setText(txt.toLocaleLowerCase().trim())}


											autoCapitalize="none"
											autoCorrect={false}
											spellCheck={false}

											isRequired
											size="xl"
											label="Email"
											placeholder="Correo Electrónico"

											_text={{ fontSize: "sm", fontWeight: "medium", }}
										/>
										<Input
											value={pass}
											onChangeText={setPass}

											size="xl"
											isRequired
											type={showPass ? "text" : "password"}
											placeholder="Contraseña"
											label="Password"
											InputRightElement={
												<IconButton
													variant="unstyled"
													icon={
														<Icon
															size="4"
															color="coolGray.400"
															as={Entypo}
															name={showPass ? "eye-with-line" : "eye"}
														/>
													}
													onPress={() => setShowPass(!showPass)}
												/>
											}
											_text={{
												fontSize: "sm",
												fontWeight: "medium",
											}}
										/>
									</VStack>
									<Link
										ml="auto"
										_text={{
											fontSize: "xs",
											fontWeight: "bold",
											textDecoration: "none",
										}}
										_light={{
											_text: {
												color: "primary.900",
											},
										}}
										_dark={{
											_text: {
												color: "primary.500",
											},
										}}
										onPress={() => navigation.navigate("RecoveryPassword")}
									>
										¿Olvidó su contraseña?
									</Link>
									<Button
										mt="5"
										size="md"

										_text={{
											fontWeight: "medium",
										}}
										onPress={onFinish}
										borderRadius={300}
										isLoading={loading}
									>
										Iniciar Sesión
									</Button>
									<Text textAlign={"center"}>¿No tienes cuenta? <Text color={"primary.900"} onPress={() => navigation.navigate("Credentials")}>Registrate</Text></Text>
								</VStack>
							</VStack>
						</VStack>
					</VStack>
				</Stack>
			</Center>
		</KeyboardAwareScrollView>
	</>
}