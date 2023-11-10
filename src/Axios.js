
import React, { useEffect, useState } from "react";

import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { navigationRef } from './Contexts/RootNavigation';

let setCookie = require('set-cookie-parser')

// axios.defaults.baseURL = "https://zeusagave.com:4002"

axios.defaults.baseURL = "http://10.0.2.2:4025"
axios.defaults.withCredentials = true
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.request.use(async function (config) {
    config.headers.Authorization = await AsyncStorage.getItem('@token')
    config.headers.Cookie = await AsyncStorage.getItem('@refresh')
    return config;
})

axios.interceptors.response.use(async function (response) {
    if (response?.headers?.authorization)
        await AsyncStorage.setItem('@token', response?.headers?.authorization)

    if (response.headers["set-cookie"] && response.headers["set-cookie"][0]) {
        let cookies = setCookie.parse(response.headers["set-cookie"][0], { map: true })
        if (cookies["refresh"].value !== (await AsyncStorage.getItem('@refresh')))
            await AsyncStorage.setItem('@refresh', response.headers["set-cookie"][0])
    }
    return response;
}, function (error) {
    if (error?.response?.status == 401) 
        navigationRef.navigate("SignIn")
    return Promise.reject(error)
})


export default axios