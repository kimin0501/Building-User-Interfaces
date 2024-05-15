import AIEmoteType from "../../components/chat/messages/AIEmoteType";

const createLoginSubAgent = (end) => {
    // Initial stage of the login process
    let stage = "INITIAL";
    // Variables to store username and password
    let username, password;
  

    // Function to handle the initialization of the login process
    const handleInitialize = async () => {
      stage = "FOLLOWUP_USERNAME";
      return "Great! What is your username?";
    };
  
    // Function to handle the follow-up for collecting username
    const handleFollowupUsername = async (prompt) => {
      username = prompt;
      stage = "FOLLOWUP_PASSWORD";
      return {
        msg: "And what is your password?",
        nextIsSensitive: true,
        }
    };
  
     // Function to handle the follow-up for collecting password
    const handleFollowupPassword = async (prompt) => {
      password = prompt;
      try {
        const response = await fetch('https://cs571.org/api/s24/hw11/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CS571-ID': CS571.getBadgerId()
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });
  
        if (response.status === 200) {
            const data = await response.json();
            return end({
              msg: `Success! Welcome ${data.user.username}.`,
              emote: AIEmoteType.SUCCESS,
            });
          } else {
  
            switch(response.status) {
              case 400:
                return end({
                  msg: "The request was invalid. Please try again.",
                  emote: AIEmoteType.ERROR, 
              }
                );
              case 401:
                return end({
                  msg: 'Your username or password is incorrect. Please try again.',
                  emote: AIEmoteType.ERROR, 
                });
            }
          }
        } catch (error) {
          console.error("Login check failed:", error);
          return end({
              msg:error,
              emote: AIEmoteType.ERROR,
            }); 
        }
      };
  
    // Function to handle messages
    const handleReceive = async (prompt) => {
      switch(stage) {
        case "FOLLOWUP_USERNAME":
          return await handleFollowupUsername(prompt);
        case "FOLLOWUP_PASSWORD":
          return await handleFollowupPassword(prompt);
        default:
          end("I'm not sure what you are trying to do. Can you please log in again?");
          break;
      }
    };

    return {
      handleInitialize,
      handleReceive
    };
  };
  
  export default createLoginSubAgent;
  