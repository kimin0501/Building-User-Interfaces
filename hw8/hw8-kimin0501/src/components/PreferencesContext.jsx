import React, { createContext, useEffect, useState } from 'react';

// Create a context for managing user preferences
export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  
  // State to hold the user's preferences
  const [preferences, setPreferences] = useState({});

  // Fetch the unique tags 
  useEffect(() => {
    fetch('https://cs571.org/api/s24/hw8/articles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CS571-ID': 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa',
      },
    })
    .then(response => response.json())
    .then(articles => {
      // Extract all tags from the articles
      const tags = articles.map(article => article.tags).flat();
      const uniqueTags = [...new Set(tags)];
      
      // Initialize preferences with all tags set to true
      const initialPrefs = uniqueTags.reduce((prefs, tag) => {
        prefs[tag] = true;
        return prefs;
      }, {});
      setPreferences(initialPrefs);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);
  
  // Update the state with the toggled preference
  const togglePreference = (tag) => {
    setPreferences((prevPrefs) => ({
      ...prevPrefs,
      [tag]: !prevPrefs[tag],
    }));
  };

  
  // Passes down the preferences and the function to toggle them
  return (
    <PreferencesContext.Provider value={{ preferences, togglePreference }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;