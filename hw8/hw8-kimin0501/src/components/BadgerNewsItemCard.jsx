import React from 'react';
import { Text, Image, StyleSheet, Pressable } from 'react-native';

// Define the styles for the component with a card
const styles = StyleSheet.create({
    card: {
        padding: 15,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        marginBottom: 16, 
    },
    image: {
        width: '100%',
        height: 200, 
    },
    title: {
        color: 'black', 
        marginTop: 8, 
        fontSize: 23,
        fontWeight: 'bold',
    },
});

// Component for rendering a single news item card
export default function BadgerNewsItemCard({ article, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.card}>
            <Image source={{ uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${article.img}` }} style={styles.image} />
            <Text style={styles.title}>{article.title}</Text>
        </Pressable>
    );
}
