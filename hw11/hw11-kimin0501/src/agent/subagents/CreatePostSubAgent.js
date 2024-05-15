import { isLoggedIn } from '../Util';


const createPostSubAgent = (end) => {
    const CS571_WITAI_ACCESS_TOKEN = "43VWLIMPNPQC65Z3U46KMZBVUYZ7E4LF"; 
    
    // Initialize the stage to ask for the chatroom
    let stage = "ASK_CHATROOM";
    
    // Initialize the vatiables to store chatroom, title, content and an array to hold available chatrooms
    let chatroom, title, content;
    let chatrooms = []; 

    // Function to fetch chatrooms from the server
    const fetchChatrooms = async () => {
        const response = await fetch("https://cs571.org/api/s24/hw11/chatrooms", {
            headers: { "X-CS571-ID": CS571.getBadgerId() },
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch chatrooms');
        }
        chatrooms = await response.json();
    };

    // Function to post a message to a specified chatroom
    const postMessage = async (chatroom, title, content) => {
        const response = await fetch(`https://cs571.org/api/s24/hw11/messages?chatroom=${encodeURIComponent(chatroom)}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: 'include',
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            return { success: true, data: await response.json() };
        } else {
            const errorData = await response.json();
            return { success: false, status: response.status, message: errorData.msg };
        }
    };

    // Function to initialize the post creation process
    const handleInitialize = async (data) => {
        if (!(await isLoggedIn())) {
            return end("You need to be logged in to create a post. Please log in first.");
        }

        try {
            await fetchChatrooms();

            console.log('Received data:', data);
            console.log('Available chatrooms:', chatrooms);

            if (data && data.chatroom && chatrooms.includes(data.chatroom)) {
                chatroom = data.chatroom;
                stage = "ASK_TITLE";
                return "What would you like the title of your post to be?";
            } else {
                stage = "ASK_CHATROOM";
                return "Which chatroom would you like to post in?";
            }
        } catch (error) {
            console.error(error);
            return end("Failed to fetch chatrooms. Please try again later.");
        }
    };

  // Function to handle received messages
  const handleReceive = async (prompt) => {
    switch (stage) {
      case "ASK_CHATROOM":
        const witResponse = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
          headers: {
            "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
          }
        });
        const witData = await witResponse.json();
        const chatroomEntity = witData.entities['chatroom:chatroom'];

        if (chatroomEntity && chatroomEntity.length > 0) {
          chatroom = chatroomEntity[0].value;
          stage = "ASK_TITLE";
          return "What would you like the title of your post to be?";
        } else {
          return "That chatroom does not exist. Would you like to try another chatroom name? (yes/no)";
        }
      case "RETRY":
        if (prompt.toLowerCase() === "yes") {
          stage = "ASK_CHATROOM";
          return "Which chatroom would you like to post in?";
        } else {
          return end("Post creation canceled.");
        }
      case "ASK_TITLE":
        title = prompt;
        stage = "ASK_CONTENT";
        return "What would you like to say in your post?";
      case "ASK_CONTENT":
        content = prompt;
        stage = "CONFIRM";
        return `You're about to post the following message in ${chatroom}: Title - ${title}, Content - ${content}. Is that correct?`;
      case "CONFIRM":
        if (prompt.toLowerCase() === "yes") {
        
          const { success, message } = await postMessage(chatroom, title, content);
          if (success) {
            return end("Your post has been made.");
          } else {
            return end(`Failed to post your message. ${message}`);
          }
        } else {
          return end("Post canceled. Let's start over.");
        }
      default:
        return "I'm not sure what happened. Let's start over. Which chatroom would you like to post in?";
    }
  };
    return {
        handleInitialize,
        handleReceive
    };
};

export default createPostSubAgent;


