import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { AntDesign, MaterialIcons, Fontisto, SimpleLineIcons  } from '@expo/vector-icons';
import * as firebase from 'firebase';


function ViewScreen({navigation, route}) {
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [phone, setphone] = useState('');
    const [email, setemail] = useState('');
    const [addr, setaddr] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [url, setUrl] = useState('empty');
    const hold1 =
    <View style = {styles.viewImg}>
    <Text style = {{ color: '#fff', fontSize: 50, letterSpacing: 1}}>{fname[0]}{lname[0]}</Text>
    </View>;
    const hold2 = 
    <View style = {styles.img}>
        <Image 
        style = {styles.imgHolder}
        source = {
            url === 'empty'? {uri : url} : {uri : image}
        }
        />
    </View>;
    _deleteContact = async () => {
        await firebase.database().ref("Contacts").child(route.params.key).remove()
        .then(() => navigation.goBack())
        .catch(error => alert(error.message));
    }
    
    _fetchContact = key => {
        let details = firebase.database().ref("Contacts").child(key);
        details.on('value', snapShot => {
            if(snapShot.val()){
                let contact = snapShot.val();
                setfname(contact.fname);
                setlname(contact.lname);
                setphone(contact.phone);
                setemail(contact.email);
                setaddr(contact.addr);
                setUrl(contact.imageUrl);
                setLoaded(true);
            }
        })

    }
    useEffect(() => {
        navigation.addListener('focus', () => {
            this._fetchContact(route.params.key);
        })
    }, [navigation]);
    if(!loaded){
        return (
            <View style = {styles.Container}>
                <Text style = {{color: '#61DAFB', marginBottom: 10, alignSelf: 'center'}}>Loading Contact...</Text>
                <ActivityIndicator color = '#61DAFB' size = 'large' />
            </View>
        );
    }
    return (
        <View style={styles.viewcontainer}>
            {url === 'empty'? hold1: hold2}
            <View style = {styles.viewName}>
                <Text style={{ color: '#ffffff', fontSize: 20, letterSpacing: 1}}>{fname} {lname}</Text>
            </View>
            <View style={{flexDirection : 'row', alignContent: 'flex-end', justifyContent: 'flex-end'}}>
                <TouchableOpacity 
                style = {{paddingRight: 10}}
                onPress = { () => navigation.navigate('Edit', {key : route.params.key})}
                >
                <MaterialIcons name="mode-edit" size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                style = {{paddingLeft: 10}}
                onLongPress = { () => _deleteContact()}
                >
                <AntDesign name="delete" size={25} color="#fff" /> 
                </TouchableOpacity>
            </View>
            <View style = {styles.emptyview}>
            </View>
            <View style = {styles.infoView}>
                <View style = {styles.infoContainer}>
                <SimpleLineIcons name="screen-smartphone" size={24} color="#61DAFB" />
                <Text style={styles.infotxt}>{phone}</Text>
                </View>
                <View style = {styles.infoContainer}>
                <Fontisto name="email" size={24} color="#61DAFB" /> 
                <Text style={styles.infotxt}>{email}</Text>
                </View>
                <View style = {styles.infoContainer}>
                <SimpleLineIcons name="location-pin" size={20} color="#61DAFB" />
                <Text style={styles.infotxt}>{addr}</Text>
                </View>
                </View>
        </View>
      );
}

export default ViewScreen;

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#282A36',
        alignContent : 'center',
        justifyContent : 'center'
    },
    viewcontainer : {
        flex: 1,
        backgroundColor: "#282A36",
        height: 500, 
        alignItems: 'center'   
    },
    viewImg : {
        marginTop : 20,
        backgroundColor : 'transparent',
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: '#61DAFB',
        borderRadius: 100/2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewName : {
        marginVertical: 20
    },
    emptyview : {
        marginTop: 20,
        width: '100%',
        height: 10,
        marginBottom: 10,
        backgroundColor: '#282A36',
        shadowColor: '#282A36',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 2,
    },
    infoView : {
        alignItems: 'flex-start',
        justifyContent: 'flex-start', 
        width: '95%'
        },
        infoContainer : {
        flexDirection: 'row', 
        marginBottom: 15, 
        padding: 5,
        borderBottomWidth: 5,
        borderColor: '#282A36',
        width: '100%',
    
    },
    infotxt : { 
        marginLeft: 10,
        color: '#ffffff', 
        fontSize: 15, 
        letterSpacing : 1,
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
})