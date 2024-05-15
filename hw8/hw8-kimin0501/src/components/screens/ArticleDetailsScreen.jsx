import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Animated, Linking } from 'react-native';

const ArticleDetailsScreen = ({ route }) => {
  // State for the article data and loading status
  const [article, setArticle] = useState(null);
  const [isLoading, setLoading] = useState(true);
  // Initialize the opacity for the animation
  const animation = new Animated.Value(0); 

  // Fetch the article details
  useEffect(() => {
    const fetchArticleDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://cs571.org/api/s24/hw8/article?id=${route.params.articleId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CS571-ID': 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa'
          },
        });
        const articleData = await response.json();
        setArticle(articleData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticleDetails();
  }, [route.params.articleId]);

  // Start the fade-in animation 
  useEffect(() => {
    if (!isLoading) {

      Animated.timing(animation, {
        toValue: 1,
        duration: 1300,
        useNativeDriver: true
      }).start();
    }
  }, [isLoading]); 


  // Render a loading indicator
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>The content is loading!</Text>
      </View>
    );
  }

  // Render a message if no article is found
  if (!article) {
    return (
      <View style={styles.centered}>
        <Text>No content available.</Text>
      </View>
    );
  }

  // Render the article details once loading is complete
  return (
    <Animated.View style={{...styles.container, opacity: animation}}>
      <ScrollView>
        <Image
          source={{ uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${article.img}` }}
          style={styles.articleImage}
        />
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.metaData}>
          By {article.author} on {article.posted}
        </Text>
        {article.url && (
          <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
            <Text style={styles.readMore}>Read full article here.</Text>
          </TouchableOpacity>
        )}
        {article.body.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleImage: {
    width: '100%',
    height: 200, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  metaData: { 
    fontSize: 17,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
  readMore: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 20,
  },
});






export default ArticleDetailsScreen;