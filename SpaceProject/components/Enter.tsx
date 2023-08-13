import React from 'react';
import {Image, StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
const img = require('../assets/image1.png')
const imgText = require('../assets/mars.png')
const Enter = ({navigation}) => {
    return (
        <View onTouchEnd={() => navigation.navigate('Settings', {name: 'Settings'})} style={styles.container}>
            <Image style={styles.img} source={img}/>
            <Image style={styles.imgText} source={imgText}/>
            <StatusBar style="auto"/>
        </View>
    );


};

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    img: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    imgText: {
        position: 'relative',
        top: 60,
        left: 30
    },
});

export default Enter;