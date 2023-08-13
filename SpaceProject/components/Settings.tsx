import React, {useState} from 'react';
import {Image, ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import axios from 'axios'
import SelectDropdown from 'react-native-select-dropdown'
import {useFonts} from "expo-font";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const uploadLogo = require('../assets/upload.png')
const img = require('../assets/background.png')
import Fontisto from 'react-native-vector-icons/Fontisto'

type cameras = {
    name: string,
    full_name: string
}
export type photo = {
    img_src: string,
    id: number
}


let customFonts = {
    'Dosis': require('../assets/fonts/Dosis-VariableFont_wght.ttf'),
    'Dosis-bold': require('../assets/fonts/Dosis-bold.ttf')
};

const Settings = ({navigation}) => {
    const [data, setData] = React.useState<cameras[]>([] as cameras[])
    const [photos, setPhotos] = React.useState<photo[]>()
    const [pickedPhoto, setPickedPhoto] = React.useState<photo>()
    const [showPhoto, setShowPhoto] = React.useState<boolean>(false)
    const [pickedData, setPickedData] = React.useState<cameras>()
    const [isLoaded] = useFonts(customFonts);
    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState<boolean>(false)
    const [showPhotos, setShowPhotos] = useState<boolean>(false)
    React.useEffect(() => {
        axios.get('https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=7xXJeWEflMWOgXjcD7QLGGxlGQ5knaEnKIwvogIU').then(
            ({data}) => {
                setData(data.photos[0].rover.cameras)
            }
        ).catch(err => console.log(err))
    }, [])

    const getPhotos = () => {
        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&camera=${pickedData.name}&api_key=7xXJeWEflMWOgXjcD7QLGGxlGQ5knaEnKIwvogIU`).then(
            ({data}) => {
                setPhotos(data.photos.map(el => el))
            }
        ).catch(err => console.log(err))
    }

    if (data && isLoaded) return (
        <View style={styles.container}>
            {!showPhotos ? <ImageBackground style={styles.img} source={img} resizeMode={'stretch'}>

                    <Text style={styles.title}>Select camera and date</Text>
                    <View style={styles.selectBox}>
                        <Text>Rover camera</Text>
                        <SelectDropdown
                            searchInputTxtStyle={styles.title}
                            rowTextStyle={styles.text}
                            buttonStyle={styles.input}
                            buttonTextStyle={styles.text}
                            data={data.map(el => el.full_name)}
                            onSelect={(selectedItem, index) => {
                                setPickedData(data[index])
                            }}/>
                    </View>
                    <View style={styles.selectBox}>
                        <Text style={styles.text}>Date</Text>
                        <Pressable onPress={() => {
                            setShowPicker(!showPicker)
                        }} style={styles.dateWindow}>
                            <Text style={styles.text}>{date.toISOString().split('T')[0]}</Text>
                            <Fontisto style={{fontSize: 25}} name='date'></Fontisto>
                        </Pressable>
                        {showPicker &&
                            <RNDateTimePicker onChange={(el, date) => {
                                setShowPicker(!showPicker)
                                setDate(date)
                            }}
                                              mode='date'
                                              display='spinner'
                                              value={date}/>
                        }
                    </View>

                    <Pressable onPress={() => {
                        if (pickedData.full_name) {
                            setShowPhotos(true)
                            getPhotos()
                        }
                    }} style={styles.button}>
                        <Text style={styles.btnText}>Explore</Text>
                    </Pressable>
                </ImageBackground> :
                !showPhoto ? <View style={styles.photosPageWrapper}>
                    <View style={styles.photosPageInfo}>
                        <Text style={styles.backLogo} onPress={() => {
                            setShowPhotos(false)
                            setPhotos([])
                            setPickedData({} as cameras)
                        }}>{`<`}</Text>
                        <View style={styles.photosPageData}>
                            <Text style={styles.photosPageText}>{pickedData.full_name}</Text>
                            <Text style={styles.photosPageDate}>{date.toISOString().split('T')[0]}</Text>
                        </View>
                    </View>
                    <View style={styles.photoContainer}>
                        {photos ? photos.map((el, idx) => <Pressable key={idx} onPress={() => {
                            setPickedPhoto(el)
                            setShowPhoto(true)
                        }}>
                            <Image style={styles.logo}
                                   source={{uri: `${el.img_src}`}}></Image>
                        </Pressable>) : <Text>No photos given</Text>}
                    </View>
                </View> : <View style={[styles.photosPageWrapper, styles.blackBg]}>
                    <View style={styles.pickedPhotoData}>
                        <Text style={[styles.backLogo, styles.whiteColor]}
                              onPress={() => setShowPhoto(false)}>{`<`}</Text>
                        <View style={styles.photosPageData}>
                            <Text style={[styles.photosPageText, styles.whiteColor]}>Photo ID</Text>
                            <Text style={[styles.photosPageDate, styles.whiteColor]}>{pickedPhoto.id}</Text>
                        </View>
                        <Image style={styles.uploadLogo} source={uploadLogo}></Image>

                    </View>
                    <Image style={styles.pickedPhoto} source={{uri: `${pickedPhoto.img_src}`}}></Image>
                </View>
            }

            <StatusBar style="auto"/>
        </View>
    );
};

const styles = StyleSheet.create({
    blackBg: {
        backgroundColor: 'black'
    },
    whiteColor: {
        color: 'white'
    },
    uploadLogo: {
        height: 35,
        width: 35,
    },
    pickedPhoto: {
        width: '90%',
        height: '88%',
        borderRadius: 10
    },
    pickedPhotoData: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        paddingRight: 20,
        paddingLeft: 20
    },
    photosPageData: {
        alignItems: 'center',
    },
    photosPageText: {
        fontFamily: 'Dosis-bold',
        fontSize: 22,
        fontWeight: 'bold'

    },
    photosPageDate: {
        fontFamily: 'Dosis-bold',
        fontSize: 18,

    },
    backLogo: {
        fontSize: 30,
        fontFamily: 'Dosis-bold',
        marginRight: 20,
    },
    photosPageInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    photosPageWrapper: {
        paddingTop: 10,
        flex: 1,
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 109,
        height: 109,
        borderRadius: 10
    },
    dateWindow: {
        display: 'flex',
        borderRadius: 10,
        width: '100%',
        height: 50,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'beige',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20
    },

    button: {
        borderRadius: 10,
        backgroundColor: 'orange',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 22,
        fontFamily: 'Dosis-bold',
        color: 'white'
    },
    title: {
        fontSize: 22,
        fontFamily: 'Dosis-bold'
    },
    text: {
        fontSize: 21,
        fontFamily: 'Dosis-bold'
    },
    selectBox: {
        rowGap: 5,
        width: '100%',
    },
    container: {
        flex: 1,
    },
    photoContainer: {
        paddingTop: 10,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        justifyContent: 'center',
        overflow: 'scroll'
    },
    input: {
        display: 'flex',
        borderRadius: 10,
        width: '100%',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'beige',


    },
    img: {
        rowGap: 40,
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
});

export default Settings;