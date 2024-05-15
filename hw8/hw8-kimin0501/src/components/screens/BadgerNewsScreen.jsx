import { Text, View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import BadgerNewsItemCard from '../BadgerNewsItemCard'; 
import { PreferencesContext } from '../PreferencesContext';

function BadgerNewsScreen({ navigation }) {
    // State for storing articles and tracking loading status
    const [articles, setArticles] = useState([]); 
    const [loading, setLoading] = useState(true); 
    // Access user preferences from context
    const { preferences } = useContext(PreferencesContext); 
  
    // Filters articles based on the current preferences
    const filterArticles = (allArticles, prefs) => {
        if (Object.values(prefs).every(value => value === false)) {
          return [];
        }

        return allArticles.filter(article =>
          article.tags.every(tag => prefs[tag])
        );
    };

    // Fetch articles
    useEffect(() => {
        setLoading(true);
        fetch('https://cs571.org/api/s24/hw8/articles', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa',
            },
        })
        .then((response) => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then((data) => {
            setLoading(false);
            const filteredData = filterArticles(data, preferences);
            setArticles(filteredData)
        })
        .catch((error) => {
            console.error(error.message);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [preferences]);
    

    // Render the component
    return (
        <View style={{ flex: 1 }}>
            {loading ? (

                <ActivityIndicator style={styles.loader} />
            ) : articles.length > 0 ? (

                <FlatList
                    data={articles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <BadgerNewsItemCard
                          article={item}
                          onPress={() => { navigation.navigate('ArticleDetails', { articleId: item.fullArticleId });}}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (

                <View style={styles.centered}>
                    <Text>There are no articles that fit your preferences!</Text>
                </View>
            )}
        </View>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    loader: {
        marginTop: '50%', 
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default BadgerNewsScreen;