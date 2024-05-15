const createChatAgent = () => {
    // Wit.AI access token
    const CS571_WITAI_ACCESS_TOKEN = "3PNDAGV3V4AOR2O3A6OT3KJ2FZ4F4Q46"; 

    // State variables for the shopping cart, available items, and welcome message
    let cart = {};
    let availableItems = [];
    let welcomeMessage = ''; 

    // Function to initialize the chat agent
    const handleInitialize = async () => {
        welcomeMessage = 'Welcome to BadgerMart Voice! :) Type your question, or ask for help if you are lost!';

        try {
            const response = await fetch('https://cs571.org/api/s24/hw10/items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CS571-ID': 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa',
                },
            });

            if (!response.ok) {
                throw new Error(error);
            }
            availableItems = await response.json();
        } catch (error) {
            console.error(error);
        }

        return welcomeMessage;
    }

    // Function to add items to the shopping cart
    const addToCart = (itemName, quantity) => {
        const validQuantity = Math.floor(quantity);
        cart[itemName] = (cart[itemName] || 0) + validQuantity;
        console.log(`Added ${validQuantity} of ${itemName} to the cart. Total: ${cart[itemName]}`);
        return `Sure, adding ${validQuantity} ${itemName} to your cart.`;
      };
      

    // Function to remove items from the shopping cart
    const removeFromCart = (itemName, quantity) => {
        if (!cart[itemName]) {
            return `You don't have any ${itemName}s in your cart!`; 
        }

        const validQuantity = Math.floor(quantity);
        const currentQuantity = cart[itemName];
        const newQuantity = currentQuantity - validQuantity;


        if (newQuantity <= 0) {
            delete cart[itemName];
            return `Removed ${currentQuantity} ${itemName}(s) from your cart as that's all you had!`; 
        } else {
            cart[itemName] = newQuantity;
            return `Sure, removing ${validQuantity} ${itemName} from your cart.`;
        }
    };

    // Function to calculate the total price of items
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        for (const [itemName, quantity] of Object.entries(cart)) {
            const item = availableItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
            if (item) {
                totalPrice += item.price * quantity;
            }
        }
        return totalPrice.toFixed(2); 
    };


    // Function to handle checkout process
    const checkoutCart = async () => {
        if (Object.keys(cart).length === 0) {
            return "You don't have any items in your cart to purchase!";
        } else {
          try {
            let checkoutData = {};

            availableItems.forEach(item => {
              checkoutData[item.name] = 0;
            });
      
            Object.entries(cart).forEach(([itemName, quantity]) => {
              const item = availableItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
              if (item) {
                checkoutData[item.name] = quantity; 
              }
            });

            const totalQuantity = Object.values(checkoutData).reduce((total, q) => total + q, 0);
            if (totalQuantity === 0) {
              return 'No items are ordered.';
            }

            const response = await fetch('https://cs571.org/api/s24/hw10/checkout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CS571-ID': 'bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa',
              },
              body: JSON.stringify(checkoutData),
            });
            
            const responseData = await response.json();
      
            if (response.ok) {
              cart = {}; 
              return `Success! Your confirmation ID is ${responseData.confirmationId}`;
            } else {
              console.error(responseData);
              return `Failed to checkout.`;
            }
          } catch (error) {
            console.error(error);
            return `Failed to checkout.`;
          }
        }
      };
      
    
    
    // Function to handle message reception by using Wit.AI
    const handleReceive = async (prompt) => {
                const resp = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(prompt)}`, {
            headers: {
                'Authorization': `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        });
        const data = await resp.json();
        console.log(data);
    
        if (data.intents && data.intents.length > 0) {
            const highestConfidenceIntent = data.intents.sort((a, b) => b.confidence - a.confidence)[0];
            
            console.log(`Highest confidence intent: ${highestConfidenceIntent.name} with confidence: ${highestConfidenceIntent.confidence}`);

            // Fallback message if the highest confidence intent meets the minimum of 75%
            if (highestConfidenceIntent.confidence < 0.75) {
                return "Sorry, I didn't get that. Type 'help' to see what you can do!";
            }

            // Handle different intents
            switch(highestConfidenceIntent.name) {
                
                // Case1) Get help intent: provide options available to the user
                case 'get_help':
                    return 'In BadgerMart Voice, you can get the list of items, the price of an item, add or remove an item from your cart, and checkout!';
                
                // Case2) Get items intent: list all available items for sale
                case 'get_items': 
                    let itemNames = availableItems.map(item => item.name).join(", ");
                    return `We have ${itemNames} for sale!`;

                // Case3) Get price intent: provide the price for a requested item
                case 'get_price':
                    if (data.entities['item:item'] && data.entities['item:item'].length > 0) {
                        const itemEntity = data.entities['item:item'][0];
                        const itemName = itemEntity.value;
                        const item = availableItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
                        if (item) {
                            return `${itemName} costs $${item.price} each.`;
                        } 
                    } else {
                        return `Sorry, we do not have that item in stock.`;
                    }
                    break;
                
                // case 4) Add item intent: add a specified quantity of an item to the cart
                case 'add_item': {
                    const numberEntityValue = data.entities['wit$number:number'] ? parseInt(data.entities['wit$number:number'][0].value) : 1;
                    const itemEntity = data.entities['item:item'] ? data.entities['item:item'][0] : null;
                    
                    if (itemEntity && itemEntity.value) {
                        const itemName = itemEntity.value;
                        const item = availableItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
                        if (item) {
                            if (numberEntityValue > 0) {
                                const response = addToCart(itemName, numberEntityValue);
                                return response;
                            } else {
                                return `I cannot add that number of ${itemName} from your cart!`; 
                            }
                        } 
                    } else {
                        return `Sorry, we do not have that item in stock.`;
                    }
                    break;
                }

                // Case 5) Remove item intent: remove a specified quantity of an item from the cart
                case 'remove_item': {
                    const numberEntity = data.entities['wit$number:number'] ? parseInt(data.entities['wit$number:number'][0].value) : 1;
                    const itemEntity = data.entities['item:item'] ? data.entities['item:item'][0] : null;
                
                    if (itemEntity && itemEntity.value) {
                            const itemName = itemEntity.value;
                            
                            if (numberEntity <= 0) {
                                return `I cannot remove that number of ${itemName} from your cart!`;
                            }  else {
                                const response = removeFromCart(itemName, numberEntity)
                                return response;
                            }
                        } else {
                            return `Sorry, we do not have that item in stock.`; 
                        }
                        break;
                    }
                
                // Case 6) View cart intent: show the items and total price in the cart
                case 'view_cart':
                    if (Object.keys(cart).length === 0) {
                        return "You have nothing in your cart, totaling $0.00";
                    } else {
                        let cartItems = [];
                         for (const [itemName, quantity] of Object.entries(cart)) {
                            cartItems.push(`${quantity} ${itemName}`);
                        }
                        const totalPrice = calculateTotalPrice();
                        return `You have ${cartItems.join(' and ')} in your cart, totaling $${totalPrice}`;
                    }
                    break;
                
                // Case 7) Checkout intent: proceed to checkout with the items in the cart
                case 'checkout':
                    return await checkoutCart();
                    break;
            }
        // Case 8) Fallback message when no intents are understood
        } else {
            return "Sorry, I didn't get that. Type 'help' to see what you can do!";
        }
    }

    // Added getters to expose data
    const getWelcomeMessage = () => welcomeMessage;
    const getAvailableItems = () => availableItems;

    return {
        handleInitialize,
        handleReceive,
        getWelcomeMessage, 
        getAvailableItems, 
    }
}

export default createChatAgent;