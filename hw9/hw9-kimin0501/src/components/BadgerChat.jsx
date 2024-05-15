import { useEffect, useState, useRef } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {
  // State hooks for login status, registration status, and chatrooms list
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [chatroomList, setChatroomList] = useState([]);

  // Fetching chatroom names on component mount
  useEffect(() => {
    fetch("https://cs571.org/api/s24/hw9/chatrooms", {
      method: "GET",
      headers: {
        "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.json())
    .then((data) => setChatroomList(data))
    .catch((error) => console.error(error));
  }, []);

  // Function to handle user login
  function handleLogin(username, password) {
    fetch("https://cs571.org/api/s24/hw9/login", {
      method: "POST",
      headers: {
        "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error('Incorrect username or password');
      } else {
        throw new Error('An unexpected error occurred');
      }
    })
    .then((json) => {
      SecureStore.setItemAsync("token", json.token).then(() => {
        setIsLoggedIn(true);
      });
    })
    .catch((error) => {
      alert(error.message);
    });
  }

  // Function to handle new user registration
  function handleSignup(username, password) {
    fetch("https://cs571.org/api/s24/hw9/register", {
      method: "POST",
      headers: {
        "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 409) {
        throw new Error('That account already exists.');
      } else if (response.status === 400) {
        throw new Error('Invalid data');
      } else {
        throw new Error('An unexpected error occurred');
      }
    })
    .then((json) => {
      return SecureStore.setItemAsync("token", json.token);
    })
    .then(() => {
      setIsLoggedIn(true);
      setIsGuestMode(false);
    })
    .catch((error) => {
      alert(error.message);
    });
  }

  // Function to handle user logout
  const handleLogout = () => {
    SecureStore.deleteItemAsync("token").then(() => {
        setIsLoggedIn(false);
        setIsRegistering(false);
        setIsGuestMode(false);
        alert("Successfully logged out!");
    });
};

// Function to handle guest user access
function handleContinueAsGuest() {
  setIsGuestMode(true);
  setIsLoggedIn(false); 
  SecureStore.deleteItemAsync("token");
}

const navigationRef = useRef();

// Conditional rendering based on user's authentication status
if (isLoggedIn) {
  // Case1) Render chatroom navigation
  return (
    <NavigationContainer>
      <ChatDrawer.Navigator initialRouteName="Landing">
        <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
        {chatroomList.map((chatroom) => (
          <ChatDrawer.Screen key={chatroom} name={chatroom}>
            {(props) => <BadgerChatroomScreen {...props} name={chatroom} />}
          </ChatDrawer.Screen>
        ))}
        <ChatDrawer.Screen 
          name="Logout" 
          children={() => <BadgerLogoutScreen handleLogout={handleLogout} />}
        />
      </ChatDrawer.Navigator>
    </NavigationContainer>
  );
  
  } else if (isRegistering) {
    // Case2) Render registration screen
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} setIsGuest={setIsGuestMode} />;
  
  } else if (isGuestMode) {
    // Case3) Render guest access
    return (
      <NavigationContainer ref={navigationRef}>
        <ChatDrawer.Navigator initialRouteName="Landing">
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatroomList.map((chatroom) => (
            <ChatDrawer.Screen key={chatroom} name={chatroom}>
              {(props) => <BadgerChatroomScreen {...props} isGuest={true} name={chatroom} />}
            </ChatDrawer.Screen>
          ))}

      <ChatDrawer.Screen name="Signup">
  {() => <BadgerConversionScreen setIsRegistering={setIsRegistering} />}
</ChatDrawer.Screen>

          <ChatDrawer.Screen 
  name="Conversion" 
  component={BadgerConversionScreen}
  options={{ drawerItemStyle: { height: 0 } }} 
/>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );

  } else {
    // Case4) Render login screen by default
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleContinueAsGuest={handleContinueAsGuest} />;
  }
}