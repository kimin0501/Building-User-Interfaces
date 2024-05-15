import { StyleSheet, View, FlatList, RefreshControl, Modal, Button, TextInput, Alert, Text  } from "react-native";
import { useState, useEffect, useCallback } from 'react';
import BadgerChatMessage from '../helper/BadgerChatMessage';
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    // State hooks for managing component state
    const [chatMessages, setChatMessages] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');  
    const [loggedInUser, setLoggedInUser] = useState(null);
    
    // Load chat messages for the chatroom
    const loadChatMessages = useCallback(async () => {
      let headers = {
        "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
        'Content-Type': 'application/json',
      };
      
      if (!props.isGuest) {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
        method: 'GET',
        headers: headers,
      })
      .then(response => response.json())
      .then(json => {
        if (json && Array.isArray(json.messages)) {
          setChatMessages(json.messages);
        } else {
          setChatMessages([]);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }, [props.name, props.isGuest]);

    // Refresh handler for pull-to-refresh interaction
    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadChatMessages().then(() => setIsRefreshing(false));
    }, [loadChatMessages]);


    // Fetch current user details
    const fetchLoggedInUser = useCallback(async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        fetch("https://cs571.org/api/s24/hw9/whoami", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
            "Content-Type": "application/json",
          },
        })
        .then(response => response.json())
        .then(json => {
          if (json.isLoggedIn) {
            setLoggedInUser(json.user);
          } 
        })
        .catch(error => {
          console.error( error);
        });
      }
    }, []);
    

    useEffect(() => {
      loadChatMessages();
      if (!props.isGuest) { 
        fetchLoggedInUser();
      }
    }, [loadChatMessages, props.isGuest]);

// Function to handle posting a new message
const handlePost = async () => {

    if (props.isGuest) {
      // Show an alert to the guest user and stop the function
      Alert.alert(
        "Sign Up Required",
        "You need to sign up to create posts.",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") },
          { text: "Sign Up", onPress: () => props.navigation.navigate("Signup") }
          // Assuming you have a navigation prop available and "Signup" is the route name for the signup screen.
        ]
      );
      return; // Early return to prevent the rest of the function from running
    }

  const token = await SecureStore.getItemAsync('token');
  if (token) {
    fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
      method: 'POST',
      headers: {
        "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: postTitle,
        content: postBody,
      }),
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        let errorMessage = `${response.status}`;
        if (response.status === 400) {
          errorMessage = 'Bad Request.';
        } else if (response.status === 404) {
          errorMessage = 'Not Found.';
        } else if (response.status === 413) {
          errorMessage = 'Payload Too Large.';
        }
        throw new Error(errorMessage);
      }
    })
    .then(json => {
      Alert.alert('Posted', 'Successfully posted!');
      setIsModalVisible(false);
      setPostTitle('');
      setPostBody('');
      loadChatMessages();
    })
    .catch(error => {
      Alert.alert('Post Error', error.message);
    });
  }
};


// Function to handle deleting a message
const handleDelete = async (postId) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    fetch(`https://cs571.org/api/s24/hw9/messages?id=${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        let errorMessage = `${response.status}`;
        if (response.status === 400) {
          errorMessage = 'Bad Request.';
        } else if (response.status === 401) {
          errorMessage = 'Unauthorized.';
        } else if (response.status === 404) {
          errorMessage = 'Not Found.';
        }
        throw new Error(errorMessage);
      }
    })
    .then(json => {
      Alert.alert('Deleted', 'Successfully deleted the post!');
      loadChatMessages();
    })
    .catch(error => {
      Alert.alert('Delete Error', error.message);
    });
  }
};

  // Render the Badger Chatroom form
  return (
    <View style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setIsModalVisible(!isModalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Create A Post</Text>
                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                        placeholder="Title"
                        style={[styles.modalText, styles.modalTitleInput]}
                        value={postTitle}
                        onChangeText={setPostTitle}
                    />
                    <Text style={styles.inputLabel}>Body</Text>
                    <TextInput
                        placeholder="Body"
                        style={[styles.modalText, styles.modalBodyInput]}
                        value={postBody}
                        onChangeText={setPostBody}
                        multiline
                    />
                    <View style={styles.modalButtonGroup}>
                        <Button
                            title="Create Post"
                            onPress={handlePost}
                            disabled={!postTitle.trim() || !postBody.trim()}
                            style={styles.modalButton}
                        />
                        <Button
                            title="Cancel"
                            color="red"
                            onPress={() => setIsModalVisible(false)}
                            style={styles.modalButton}
                        />
                    </View>
                </View>
            </View>
        </Modal>
        {!props.isGuest && (
    <View style={styles.addPostButtonContainer}>
      <Button
        title="Add Post"
        onPress={() => setIsModalVisible(true)}
        color="red"
      />
    </View>
  )}
        <FlatList
            data={chatMessages}
            renderItem={({ item }) => {
                const canDelete = loggedInUser && item.poster === loggedInUser.username;
                return (
                    <BadgerChatMessage
                        title={item.title}
                        poster={item.poster}
                        content={item.content}
                        created={item.created}
                        canDelete={canDelete}
                        onDelete={() => handleDelete(item.id)}
                    />
                );
            }}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        />
    </View>
);
}
    
    // Styling for the components
    const styles = StyleSheet.create({
      container: {
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'flex-end',
          paddingBottom: 70,
      },
      addPostButtonContainer: {
          position: 'absolute', 
          bottom: 0,
          width: '100%',
          padding: 10,
          backgroundColor: 'red',
      },
      centeredView: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
      },
      modalView: {
          margin: 20,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 35,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: {
              width: 0,
              height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          width: '90%', 
      },
      modalText: {
          marginBottom: 15,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderColor: 'gray',
          borderWidth: 1,
          borderRadius: 5,
          width: '100%',
      },
      modalTitleInput: {
        width: '100%', 
      },
      modalBodyInput: {
        width: '100%', 
        minHeight: 100, 
        textAlignVertical: 'top', 
      },
      modalButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        width: '100%', 
      },
      modalButton: {
        width: '48%', 
      },
      modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
      },
      inputLabel: {
        alignSelf: 'flex-start', 
        marginLeft: 5, 
        marginTop: 10,
        marginBottom: 5, 
        fontSize: 16, 
        fontWeight: 'bold', 
      },
  });
  
export default BadgerChatroomScreen;