import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Alert, FlatList, Linking, Platform, ActivityIndicator} from 'react-native';
import { Ionicons , MaterialCommunityIcons} from '@expo/vector-icons';
import * as firebase from 'firebase';

function ContactScreen({navigation}) {
    const [data, setData] = useState([]);
    const [loaded, setLoad] = useState(false);
    const [empty, setEmpty] = useState(false);
    callOnNumber = phone =>{
        var phoneNumber = phone;
        if(Platform.OS !== 'android'){
          phoneNumber = `telprompt:${phone}`
        } else {
          phoneNumber = `tel:${phone}`
        }
        Linking.canOpenURL(phoneNumber)
        .then(supported =>{
            if(!supported){
                Alert.alert("Phone Number not availaible")
            } else{
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(error => console.log(error));
    }
    msgOnNumber = phone =>{
        var phoneNumber = phone;
        phoneNumber = `sms:${phone}`  
        Linking.canOpenURL(phoneNumber)
        .then(supported =>{
            if(!supported){
                Alert.alert("Phone Number not availaible")
            } else{
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(error => console.log(error));
    }
    useEffect(() => {
        navigation.addListener('focus', () => {
            const databaseRef = firebase.database().ref("Contacts");
            databaseRef.on('value', snapShot => {
                if(snapShot.val()){
                    let dataRef = Object.values(snapShot.val());
                    let keys = Object.keys(snapShot.val());
                    keys.forEach((value, key) => 
                        dataRef[key]['key'] = value
                    );
                    let dataRefSorted = dataRef.sort((a, b) => {
                        var conA = a.fname.toUpperCase();
                        var conB = b.fname.toUpperCase();
                        if(conA > conB) return 1;
                        if(conA < conB) return -1;
                        return 0;
                    })
                    setData(dataRefSorted);
                    setLoad(true);
                }else{
                    setLoad(true);
                    setEmpty(true);
                }

            })
        })
    }, [navigation]);
    if(!loaded){
        return(
            <View style = {styles.container}>
            <Text style = {{color: '#61DAFB', marginBottom: 10, alignSelf: 'center'}}>Loading Contacts...</Text>
            <ActivityIndicator color = '#61DAFB' />
            </View>
        );
    } else if(empty){
        return(
            <View style = {styles.container}>
            <Text style = {{color: '#61DAFB', marginBottom: 10, alignSelf: 'center'}}>Add your first contact</Text>
            <TouchableOpacity 
            style={styles.floatBtn}
            onPress = { () => navigation.navigate('Add')}
            >
                <Ionicons name="ios-add" size={45} color='#61DAFB' />
            </TouchableOpacity>
            </View>
        );
    }
    return(
        <View style={{ flex: 1, backgroundColor : '#282A36'  }}>
        <FlatList
        data = {data}
        renderItem = { ({item}) => {
        const phoneNum = item.phone;
        const image = item.imageUrl;
        console.log(image);
        const hold1 = 
        <View style = {styles.cardImg}>
        <Text style = {{ color: '#282A36', fontSize: 14, letterSpacing: 2, fontWeight: 'bold' }}>{item.fname[0]}{item.lname[0]}</Text>
        </View>;
        const hold2 = 
        <View style = {styles.img}>
            <Image 
            style = {styles.imgHolder}
            source = {
                image === 'empty'? require('../assets/logo.png') : {uri :image.toString()}
            }
            />
        </View>;
        return( 
            <View style = {styles.cardview}>
            <View>
                <TouchableOpacity
                onPress = {() => callOnNumber(phoneNum)}
                onLongPress = {()=> msgOnNumber(phoneNum)}
                >
                <View style={{flexDirection:'row'}}>
                    {
                        item.imageUrl === 'empty' ? hold1: hold2
                    }
                    <View style={styles.info}>
                    <Text style = {{ color: 'white', marginBottom: 7, fontSize: 14, letterSpacing: 2, fontWeight: '900' }}>{item.fname} {item.lname}</Text>
                    <Text style = {{ color: '#61DAFB', fontSize: 10, letterSpacing: 1, fontWeight: 'bold' }}>{item.phone}</Text>
                    </View>
                </View>
                </TouchableOpacity>
                </View>
                <View style = {{justifyContent: 'center', alignSelf:'center'}}>
                <TouchableOpacity
                onPress = {() => navigation.navigate('ViewScreen', { key : item.key})}
                >
                    <MaterialCommunityIcons name="information-variant" size={24} color="white" />
                </TouchableOpacity>
            </View>
            </View>
        );
        }}
        keyExtractor = { item => item.key }
        />
        <TouchableOpacity 
        style={styles.floatBtn}
        onPress = { () => navigation.navigate('Add')}
        >
            <Ionicons name="ios-add" size={45} color='#61DAFB' />
        </TouchableOpacity>
        </View>
    );
}

export default ContactScreen;

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#282A36',
        alignContent : 'center',
        justifyContent : 'center'
    },
    floatBtn : {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor : '#282A36',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2.22,
        elevation: 9,
        width: 44,
        height: 44,
        borderRadius: 44/2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardview: {
        flexDirection: 'row',
        padding: 13,
        backgroundColor:'#282A36',
        marginBottom: 1, 
        borderBottomWidth: 0.17,
        borderColor: 'white',
        justifyContent: 'space-between'
    },
    cardImg : {
        backgroundColor : '#61DAFB',
        width: 44,
        height: 44,
        borderRadius: 44/2,
        alignItems: 'center',
        justifyContent: 'center'
    
    },
    info : {
        flexDirection:'column',
        paddingLeft: 15
    },
    img : {
        width: 44,
        height: 44,
        borderRadius: 44/2,
        borderColor: '#61DAFB',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2, 
        alignSelf: 'center'
    },
    imgHolder : {
        width: 40,
        height: 40,
        borderRadius: 40/2,
    },
})