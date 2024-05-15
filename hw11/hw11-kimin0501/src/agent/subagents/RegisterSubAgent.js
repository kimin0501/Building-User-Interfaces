import { isLoggedIn } from "../Util";
import AIEmoteType from "../../components/chat/messages/AIEmoteType";

const createRegisterSubAgent = (end) => {
    let stage = "INITIAL";
    let username, password;

    // Function to handle the initialization of the registration process
    const handleInitialize = async () => {
        if (await isLoggedIn()) {
            end("You are already logged in, try logging out first.");
            return;
        }
        stage = "GET_USERNAME";
        return {
            msg: "Great! What username would you like to use?",
        }
    };

    // Function to handle the follow-up for collecting username
    const handleGetUsername = async (prompt) => {
        username = prompt;
        stage = "GET_PASSWORD";
        return {
            msg: "Thanks, what password would you like to use?",
            nextIsSensitive: true, 
        }
    };

    const handleGetPassword = async (prompt) => {
        password = prompt;
        stage = "CONFIRM_PASSWORD";
        console.log(`Received password: ${password}`);
        return {
            msg: "Lastly, please confirm your password.",
            nextIsSensitive: true,
        }
    };

    // Function to handle the follow-up for collecting password
    const handleConfirmPassword = async (prompt) => {
        if (password !== prompt) {
            return end({
                msg: "The passwords do not match.",
                emote: AIEmoteType.ERROR,
              });
        }
        
        console.log(`Passwords match, proceeding with registration for ${username}`);
        
        try {
            const response = await fetch('https://cs571.org/api/s24/hw11/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CS571-ID': CS571.getBadgerId()
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const responseBody = await response.json();

            if (response.ok) {
                return end({
                    msg: `Success! Your account has been registered. Welcome ${responseBody.user.username}.`,
                    emote: AIEmoteType.SUCCESS,
                });
            } else {
                console.log(`Registration failed with status ${response.status}: ${responseBody.msg}`);
                return end({
                    msg: `${responseBody.msg}`,
                    emote: AIEmoteType.ERROR, 
                });
            }
        } catch (error) {
            console.error("Registration failed:", error);
            return end({
                msg: "An error occurred during registration. Please try again later.",
                emote: AIEmoteType.ERROR, 
            });
        }
    };

    // Function to handle the confirmation of the password
    const handleReceive = async (prompt) => {
        console.log(`Current stage: ${stage}, Received prompt: ${prompt}`);
        switch (stage) {
            case "INITIAL":
                return handleInitialize();
            case "GET_USERNAME":
                return handleGetUsername(prompt);
            case "GET_PASSWORD":
                return handleGetPassword(prompt);
            case "CONFIRM_PASSWORD":
                return handleConfirmPassword(prompt);
            default:
                console.log('Resetting registration process.');
                stage = "GET_USERNAME";
                return end("There seems to be an issue. Can we start over?");
        }
    };

    return {
        handleInitialize,
        handleReceive
    };
};

export default createRegisterSubAgent;
