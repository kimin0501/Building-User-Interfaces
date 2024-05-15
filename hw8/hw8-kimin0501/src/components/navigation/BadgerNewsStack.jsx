import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BadgerNewsScreen from '../screens/BadgerNewsScreen';
import ArticleDetailsScreen from '../screens/ArticleDetailsScreen';
import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen'; 

// Create a stack navigator instance
const Stack = createStackNavigator();

// Configure the stack navigator with the screens
function BadgerNewsStack() {
    return (
    <Stack.Navigator>
      <Stack.Screen
      name="NewsSummaries"
      component={BadgerNewsScreen}
      options={{ headerShown: true, title: 'Articles' }} 
    />
    <Stack.Screen
      name="ArticleDetails"
      component={ArticleDetailsScreen}
      options={{ title: 'Article' }} 
    />
    <Stack.Screen
      name="Preferences" 
      component={BadgerPreferencesScreen}
      options={{ title: 'Preferences' }} 
      />
    
    </Stack.Navigator>
  );
}

export default BadgerNewsStack;