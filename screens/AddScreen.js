import React, { useState, useEffect } from 'react';
import {YellowBox, StyleSheet, View, Text, TouchableOpacity, Keyboard, ActivityIndicator, Image, KeyboardAvoidingView} from 'react-native';
import {Form, Button, Item, Label, Input} from 'native-base';
import * as firebase from 'firebase';
import 'expo-random';
import {nanoid} from 'nanoid/async/index'
import * as ImagePicker from 'expo-image-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

YellowBox.ignoreWarnings(['Setting a timer']);

function AddScreen({navigation}){
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [phone, setphone] = useState('');
    const [email, setemail] = useState('');
    const [addr, setaddr] = useState('');
    const [image, setImage] = useState('empty');
    const [uploading, setUpload] = useState(false);
    const [url, setUrl] = useState('empty');
    
    saveContact = async () =>{
        if((fname !== '') && (lname !== '') && (phone !== '') && (email !== '') && (addr !== '')){
            setUpload(true);
            const databaseRef = firebase.database().ref("Contacts");
            const storageRef = firebase.storage().ref();
            if(image !== 'empty'){
                const imgDownloadUrl = await UploadImg(image, storageRef);
                setUrl(imgDownloadUrl)
            }
            var contact = {
                fname: fname,
                lname: lname,
                phone: phone,
                email: email,
                addr: addr,
                imageUrl: url
            }
            await databaseRef.push(contact)
            .then(() => navigation.goBack())
            .catch(error => alert(error.message));
        }
    }

    takePicture = async () =>{
        let result =await ImagePicker.launchImageLibraryAsync({
            quality: 0.2,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            base64: true,
            aspect: [1, 1]
        });
        if(!result.cancelled){
            setImage(result.uri);
        }
    }

    UploadImg = async (uri, storageRef) => {
        const parts = uri.split('.');
        const fileExtension = parts[parts.length - 1];
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() { resolve(xhr.response);}
            xhr.onerror = function(error) {reject( new TypeError('Network Connection Failed') );}
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        const ref =storageRef.child('ContactImages').child(await nanoid(10) + '.' + fileExtension);
        const snapShot = await ref.put(blob);
        blob.close();
        return await snapShot.ref.getDownloadURL(); 
    }

    if(uploading){
        return (
            <View style = {styles.Container}>
                <Text style = {{color: '#61DAFB', marginBottom: 10, alignSelf: 'center'}}>Saving Contact...</Text>
                <ActivityIndicator color = '#61DAFB' />
            </View>
        );
    }
    return(
        <View style = {styles.Container} > 
            <TouchableWithoutFeedback style = {{ width: '100%'}}onPressIn = {() => Keyboard.dismiss()}>
                <TouchableOpacity style = {styles.img} onPress = {() => takePicture()}>
                    <Image 
                    style = {styles.imgHolder}
                    source = {
                        image === 'empty'? require('../assets/logo.png') : {uri : image}
                    }
                    />
                </TouchableOpacity>  
            </TouchableWithoutFeedback>
            <KeyboardAvoidingView enabled style = {{width: '100%'}}>
            <View style={styles.addcontainer, {width: '97%'}}>
            <Form>
                <Item floatingLabel>
                <Label style = {styles.addLbl}>First Name</Label>
                <Input style = {styles.addInput}
                autoCorrect = {false}
                autoCapitalize = 'none'
                autoCompleteType = 'off'
                keyboardType = 'default'
                keyboardAppearance = 'dark'
                onChangeText = { fname => setfname(fname)}
                />
                </Item>
                <Item floatingLabel>
                <Label style = {styles.addLbl}>Last Name</Label>
                <Input style = {styles.addInput}
                autoCorrect = {false}
                autoCapitalize = 'none'
                autoCompleteType = 'off'
                keyboardType = 'default'
                keyboardAppearance = 'dark'
                onChangeText = { lname => setlname(lname)}
                />
                </Item>
                <Item floatingLabel>
                <Label style = {styles.addLbl}>Contact Number</Label>
                <Input style = {styles.addInput}
                autoCorrect = {false}
                autoCapitalize = 'none'
                autoCompleteType = 'off'
                keyboardType = 'number-pad'
                keyboardAppearance = 'dark'
                maxLength = {10}
                onChangeText = { phone => setphone(phone)}         
                />
                </Item>
                <Item floatingLabel>
                <Label style = {styles.addLbl}>Email</Label>
                <Input style = {styles.addInput}
                autoCorrect = {false}
                autoCapitalize = 'none'
                autoCompleteType = 'off'
                keyboardType = 'email-address'
                keyboardAppearance = 'dark'
                onChangeText = { email => setemail(email)}          
                />
                </Item>
                <Item floatingLabel>
                <Label style = {styles.addLbl}>Address</Label>
                <Input style = {styles.addInput}
                autoCorrect = {false}
                autoCompleteType = 'off'
                autoCapitalize = 'none'
                keyboardType = 'default'
                keyboardAppearance = 'dark'
                onChangeText = { addr => setaddr(addr)}          
                />
                </Item>
            </Form>
           <Button block style = {{ marginTop : 20, backgroundColor: '#61DAFB', marginHorizontal : 25 }}
            onPress = { () => saveContact()} 
            >
                <Text>Save Contact</Text>
            </Button>
            </View>  
            </KeyboardAvoidingView>
        </View>
    )

}

export default AddScreen;

const styles = StyleSheet.create({
    Container : {
        flex : 1,
        backgroundColor : '#282A36',
        alignContent : 'center',
        justifyContent : 'center'
    },
    img : {
        width: 108,
        height: 108,
        borderRadius: 108/2,
        borderColor: '#61DAFB',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2, 
        alignSelf: 'center'
    },
    imgHolder : {
        width: 100,
        height: 100,
        borderRadius: 100/2,
    },
    addLbl : {
        color : '#fff',
    },
    addInput : {
        width: 100,
        color: 'white',
    }, 
})