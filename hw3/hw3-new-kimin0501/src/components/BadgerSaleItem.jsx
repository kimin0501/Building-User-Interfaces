import { useState } from 'react';

export default function BadgerSaleItem(props) {
    
    // state initialization
    const [quantity, setQuantity] = useState(0);
    
    // quantity increase function
    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // quantity decrease function
    const decreaseQuantity = () => {
        if (quantity > 0) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    // initialize the item style
    let itemStyle = {
        padding: '15px',
        borderRadius: '10px',
    };
    
    // conditional styles for featured item and normal items
    if (props.featured) {
        itemStyle.backgroundColor = 'gold'; 
        itemStyle.fontWeight = 'bold'; 
    } else {
        itemStyle.backgroundColor = 'azure';
        itemStyle.fontWeight = 'normal';
    }

    // button styling
    let buttonStyle = {
        backgroundColor: 'light gray', 
        color: 'black'
    };
    
    return (
        <div style={itemStyle}>
            <h2>{props.name}</h2>
            <div>            
                <p>{props.description}</p> {}
                <p>${props.price}</p> {}
                
                <button style = {buttonStyle} onClick = {decreaseQuantity} disabled={quantity === 0}> - </button>
                <p className="inline">{quantity}</p>
                <button style = {buttonStyle} onClick = {increaseQuantity}> + </button>
            </div>
        </div>
    );
}