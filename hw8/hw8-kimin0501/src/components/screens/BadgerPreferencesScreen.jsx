import React, { useContext } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';
import { PreferencesContext } from '../PreferencesContext';

function BadgerPreferencesScreen() {
  // Use PreferencesContext to manage the screen based on tags
  const { preferences, togglePreference } = useContext(PreferencesContext);

  // Map through the preferences and create a switch components
  return (
    <View style={styles.container}>
      {Object.entries(preferences).map(([tag, value], index) => (
        <View key={index} style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>
            {`Currently ${value ? '' : 'NOT '}showing `}
            <Text style={styles.preferenceTag}>{`${tag} `}</Text>
            {`articles.`}
          </Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "gray", true: "red" }}
            thumbColor={value ? "pink" : "white"}
            onValueChange={() => togglePreference(tag)}
            value={value}
          />
        </View>
      ))}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0',
  },
  preferenceItem: {
    alignItems: 'center', 
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 5,
  },
  preferenceText: {
    fontSize: 16,
    textAlign: 'center', 
    marginBottom: 10, 
  },
  preferenceTag: {
    fontWeight: 'bold', 
  },
});

export default BadgerPreferencesScreen;