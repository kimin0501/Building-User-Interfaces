import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BadgerNewsScreen from '../screens/BadgerNewsScreen';
import ArticleDetailsScreen from '../screens/ArticleDetailsScreen';
import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen'; 

// Create individual stack navigators for news and preferences 
const NewsStack = createStackNavigator();
const PreferencesStack = createStackNavigator();

// Create a bottom tab navigator to switch between the stacks
const Tab = createBottomTabNavigator();


// Stack navigator for the News screen 
function NewsStackScreen() {
  return (
    <NewsStack.Navigator>
      <NewsStack.Screen
        name="NewsSummaries"
        component={BadgerNewsScreen}
        options={{ headerShown: true, title: 'Articles' }} 
      />
      <NewsStack.Screen
        name="ArticleDetails"
        component={ArticleDetailsScreen}
        options={{ title: 'Article' }} 
      />
    </NewsStack.Navigator>
  );
}

// Stack navigator for the Preferences screen
function PreferencesStackScreen() {
  return (
    <PreferencesStack.Navigator>
      <PreferencesStack.Screen
        name="PreferencesScreen"
        component={BadgerPreferencesScreen}
        options={{ headerShown: true, title: 'Preferences' }}
      />
    </PreferencesStack.Navigator>
  );
}

// The bottom tab navigator to switch between the News and Preferences stacks
function BadgerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="News"
        component={NewsStackScreen}
        options={{ headerShown: false }} 
      />
      <Tab.Screen
        name="Preferences"
        component={PreferencesStackScreen}
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
}

export default BadgerTabs;