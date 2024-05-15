import createChatDelegator from "./ChatDelegator";
import { getLoggedInUsername, isLoggedIn } from './Util';


const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "43VWLIMPNPQC65Z3U46KMZBVUYZ7E4LF"; 

    // Create a chat delegator instance and an array to store chatrooms
    const delegator = createChatDelegator();
    let chatrooms = [];

    // Function to initialize the chat agent
    const handleInitialize = async () => {
        const resp = await fetch("https://cs571.org/api/s24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        ,credentials: 'include'
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    // Function to handle received messages
    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        console.log('User prompt:', prompt);
        const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        });
        const data = await resp.json();
        console.log('Wit.ai response:', JSON.stringify(data, null, 2));
    
        if (data.intents.length > 0) {
            const intent = data.intents[0].name; 
            switch (intent) { 
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();

            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }
    

    const handleTranscription = async (rawSound, contentType) => {
        const resp = await fetch(`https://api.wit.ai/dictation`, {
            method: "POST",
            headers: {
                "Content-Type": contentType,
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            },
            body: rawSound
        })
        const data = await resp.text();
        const transcription = data
            .split(/\r?\n{/g)
            .map((t, i) => i === 0 ? t : `{${t}`)  
            .map(s => JSON.parse(s))
            .filter(chunk => chunk.is_final)      
            .map(chunk => chunk.text)
            .join(" ");                            
        return transcription;
    }

    const handleSynthesis = async (txt) => {
        if (txt.length > 280) {
            return undefined;
        } else {
            const resp = await fetch(`https://api.wit.ai/synthesize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "audio/wav",
                    "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    q: txt,
                    voice: "Rebecca",
                    style: "soft"
                })
            })
            const audioBlob = await resp.blob()
            return URL.createObjectURL(audioBlob);
        }
    }

     // Function to provide help tips
    const handleGetHelp = async () => {
        const helpResponses = [
            "Try asking 'give me a list of chatrooms, or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
            "Try asking 'give me the 4 latest posts', or ask for more help!",
            "Try asking 'login', or ask for more help!",
            "Try asking 'register', or ask for more help!",
            "Try asking 'who am I', or ask for more help!",
            "Try asking 'logout', or ask for more help!",
            "Try asking 'create a post', or ask for more help!",
        ];

        const randomResponse = helpResponses[Math.floor(Math.random() * helpResponses.length)];
        return randomResponse;
    }

    // Function to return a list of chatrooms
    const handleGetChatrooms = async () => {
        let response = "Of course, there are " + chatrooms.length + " chatrooms: ";
        response += chatrooms.join(", ") + ".";
        return response;
    }


    // Function to retrieve messages 
    const handleGetMessages = async (witData) => {
        const numberOfMessages = witData.entities['wit$number:number'] ? parseInt(witData.entities['wit$number:number'][0].value) : 1;
        const chatroomEntity = witData.entities['chatroom:chatroom'];

        const numMessagesToFetch = Math.max(1, Math.min(numberOfMessages, 10));
    
        const chatroomName = chatroomEntity ? chatroomEntity[0].value : undefined;
    
        let apiUrl = `https://cs571.org/api/s24/hw11/messages?num=${numMessagesToFetch}`;
        if (chatroomName) {
            apiUrl += `&chatroom=${encodeURIComponent(chatroomName)}`;
        }
    
        const response = await fetch(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            return data.msg || "An error occurred while fetching messages.";
        }
    
    if (data.messages && data.messages.length > 0) {
        return data.messages.map(msg => 
            `In ${msg.chatroom}, ${msg.poster} created a post titled '${msg.title}' saying '${msg.content}'`
        ); 
    } else {
        return ["There are no messages to display."];
    }
}
    

// Function to handle user login
const handleLogin = async () => {
    if (await isLoggedIn()) {
      return "You are already logged in. Please log out before trying to log in again.";
    } else {
      return await delegator.beginDelegation("LOGIN");
    }
  };

  // Function to handle user register
  const handleRegister = async () => {
    return await delegator.beginDelegation("REGISTER");
  };

    // Function to handle creation of a new message
    const handleCreateMessage = async (witData) => {
        const chatroomEntity = witData.entities['chatroom:chatroom'];
        const chatroomName = chatroomEntity && chatroomEntity.length > 0 ? chatroomEntity[0].value : undefined;

        return await delegator.beginDelegation("CREATE", chatroomName ? { chatroom: chatroomName } : undefined);
    };

// Function to handle user logout
const handleLogout = async () => {
    if (!(await isLoggedIn())) {
      return "You are not currently logged in.";
    } else {
      try {
        const response = await fetch('https://cs571.org/api/s24/hw11/logout', {
          method: 'POST',
          headers: {
            'X-CS571-ID': CS571.getBadgerId()
          },
          credentials: 'include'
        });
  
        if (response.ok) {
          return "You have been logged out!";
        } else {
          const errorText = await response.text();
          throw new Error(errorText);
        }
      } catch (error) {
        console.error('Logout failed:', error);
        return "An error occurred during logout. Please try again.";
      }
    }
  };
    // Function to check who is currently logged in
    const handleWhoAmI = async () => {
        if (await isLoggedIn()) {
            const username = await getLoggedInUsername();
            return `You are currently logged in as ${username}`;
        } else {
            return "You are not currently logged in.";
        }
    };

    return {
        handleInitialize,
        handleReceive,
        handleTranscription,
        handleSynthesis
    }
}

export default createChatAgent;