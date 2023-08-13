import {StatusBar} from 'expo-status-bar';
import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from "react";


import {useFonts} from "expo-font";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Enter from "./components/Enter";
import Settings from "./components/Settings";
import axios from "axios";

let customFonts = {
    'Dosis': require('./assets/fonts/Dosis-VariableFont_wght.ttf')
};
export default function App() {
    const Stack = createNativeStackNavigator();
    const [isLoaded] = useFonts(customFonts);

    if (isLoaded) return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Home'
                    component={Enter}
                />
                <Stack.Screen name='Settings'
                              component={Settings}
                />
            </Stack.Navigator>

        </NavigationContainer>

    );
};


