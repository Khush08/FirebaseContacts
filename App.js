import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import ContactScreen from './screens/ContactScreen';
import AddScreen from './screens/AddScreen';
import ViewScreen from './screens/ViewScreen';
import EditScreen from './screens/EditScreen';

firebase.initializeApp({
  apiKey: "AIzaSyDnpqdUtU_MiKJ_bWKDdw7SbSHTH3ejfBg",
  authDomain: "reactfirebase-1a975.firebaseapp.com",
  databaseURL: "https://reactfirebase-1a975.firebaseio.com",
  projectId: "reactfirebase-1a975",
  storageBucket: "reactfirebase-1a975.appspot.com",
  messagingSenderId: "44377561203",
  appId: "1:44377561203:web:e6c7b8b01e9c3fa51a3206",
  measurementId: "G-JVGRQD5JFC"
});

const headerOptions = {
  title: 'App',
  headerStyle: {
    backgroundColor: '#282A36',
  },
  headerTintColor: '#61DAFB',
  headerTitleStyle: {
    fontWeight: 'normal',
  },
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Contacts" component={ContactScreen} options={{...headerOptions, title: 'Contacts'}} />
        <Stack.Screen name="Add" component={AddScreen} options={{...headerOptions, title : 'Add Contact'}} />
        <Stack.Screen name="ViewScreen" component={ViewScreen} options={{...headerOptions, title : 'Details'}} />
        <Stack.Screen name="Edit" component={EditScreen} options={{...headerOptions, title : 'Edit Contact'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

