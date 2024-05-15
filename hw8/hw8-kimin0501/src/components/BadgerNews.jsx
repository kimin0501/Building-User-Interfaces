import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';

import BadgerTabs from './navigation/BadgerTabs';
import { PreferencesProvider } from './PreferencesContext';


export default function BadgerNews(props) {

  // Just a suggestion for Step 4! Maybe provide this to child components via context...
  
   // State to hold the user preferences
  const [prefs, setPrefs] = useState({});

    // Fetch articles and extract unique tags t
    useEffect(() => {
      // Define asynchronous function inside the effect to fetch data
      const fetchData = async () => {
        try {
          const response = await fetch('https://cs571.org/api/s24/hw8/articles', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CS571-ID': 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa', 
            },
          });
  
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const data = await response.json();
          const tagsSet = new Set();

          // Collect all unique tags 
          data.forEach(article => {
            article.tags.forEach(tag => tagsSet.add(tag));
          });
  
          // Initialize preferences
          const initialPrefs = Array.from(tagsSet).reduce((acc, tag) => {
            acc[tag] = true;
            return acc;
          }, {});
  
          setPrefs(initialPrefs);
        } catch (error) {
          console.error('Fetching error:', error);
        }
      };
  
      fetchData();
    }, []);

  // Render the app with navigation and provide preferences
  return (
    <PreferencesProvider>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </PreferencesProvider>
  );
}
