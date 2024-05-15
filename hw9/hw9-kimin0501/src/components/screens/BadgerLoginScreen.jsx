import { Alert, Button, TextInput, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from 'react';

function BadgerLoginScreen(props) {
    // State hooks for username and password input
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Function to handle the press the login button
    function handleLoginPress() {
        if (username === "" || password === "") {
            Alert.alert("Error", "Please fill in all fields.");
        } else {
            props.handleLogin(username, password);
        }
    }   

    // Render the login form
    return (
        <View style={styles.container}>
            <Text style={styles.title}>BadgerChat Login</Text>
            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
            />
            <TouchableOpacity style={styles.buttonLogin} onPress={handleLoginPress}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <View style={styles.signupTextContainer}>
                <Text>New here?</Text>
                <View style={styles.signupAndGuestContainer}>
                    <TouchableOpacity style={styles.buttonSignup} onPress={() => props.setIsRegistering(true)}>
                        <Text style={styles.buttonTextSignup}>SIGN UP</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonGuest} onPress={props.handleContinueAsGuest}>
                        <Text style={styles.buttonTextGuest}>CONTINUE AS GUEST</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// Styling for the components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
    },
    input: {
        height: 48,
        width: '80%',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    buttonLogin: {
        backgroundColor: 'crimson',
        width: '80%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupTextContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    signupAndGuestContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonSignup: {
        backgroundColor: 'grey',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginRight: 5,
    },
    buttonTextSignup: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonGuest: {
        backgroundColor: 'grey',
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 12,
        
    },
    buttonTextGuest: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BadgerLoginScreen;