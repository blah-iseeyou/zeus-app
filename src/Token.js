import AsyncStorage from "@react-native-async-storage/async-storage";



export const token = async () => {
    let token = await AsyncStorage.getItem('@token')
    return token
}