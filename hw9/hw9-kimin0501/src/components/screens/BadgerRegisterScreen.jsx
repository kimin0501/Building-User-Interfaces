import { Alert, Button, StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from 'react';

function BadgerRegisterScreen(props) {  
    // State hooks for username, password, and confirmation password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Function to handle the press the signup button
    function handleSignupPress() {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
        } else if (password === "") {
            Alert.alert("Error", "Please enter a password.");
        } else {
            props.handleSignup(username, password);
        }
    }

    // Render the registration form
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join BadgerChat!</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholder="Confirm Password"
                secureTextEntry
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.buttonSignup} onPress={handleSignupPress}>
                <Text style={styles.buttonText}>SIGNUP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonNevermind} onPress={() => {props.setIsRegistering(false); props.setIsGuest(false);}}>
                <Text style={styles.buttonTextNevermind}>NEVERMIND!</Text>
            </TouchableOpacity>
        </View>
    );
}

// Styling for the components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonSignup: {
        width: '80%',
        backgroundColor: 'crimson',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonNevermind: {
        marginTop: 5,
        width: '80%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey', 
        borderRadius: 5,
        marginTop: 10, 
    },
    buttonTextNevermind: {
        color: 'white', 
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BadgerRegisterScreen;