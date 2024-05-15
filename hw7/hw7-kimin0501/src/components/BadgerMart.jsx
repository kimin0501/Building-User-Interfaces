import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Alert } from "react-native";
import BadgerSaleItem from "./BadgerSaleItem";

export default function BadgerMart(props) {
  // initialize states for items, item index, and item counts
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemCounts, setItemCounts] = useState({});

  // fetch items from the API 
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://cs571.org/api/s24/hw7/items", {
          headers: {
            "X-CS571-ID": "bid_2986630d6fb0dfefb1baa0d816fd57e125c410aff22d8b5f16d42358502c2caa",
          },
        });
        if (!response.ok) throw new Error();
  
        const data = await response.json();
        setItems(data);
  
        let initialCounts = {};
        data.forEach(item => {
          initialCounts[item.name] = 0;
        });
        setItemCounts(initialCounts);
        
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchItems();
  }, []);
  
  // navigate to the previous item
  const navPrevious = () => {
    setCurrentIndex((prevCurrentIndex) => prevCurrentIndex - 1);
  };

  // navigate to the next item
  const navNext = () => {
    setCurrentIndex((prevCurrentIndex) => prevCurrentIndex + 1);
  };

  // change the count of items
  const changeItemCount = (itemName, changeAmount) => {
    setItemCounts((previousCounts) => {
      const itemUpperLimit = items.find(item => item.name === itemName).upperLimit;
      let expectedNewCount = previousCounts[itemName] + changeAmount;
      expectedNewCount = Math.max(0, Math.min(expectedNewCount, itemUpperLimit));
      
      return {
        ...previousCounts,
        [itemName]: expectedNewCount
      };
    });
  };
  
  // handle placing an order
  const handlePlaceOrder = () => {
    const { totalCost, itemCount } = getTotalCostAndItemCount();

    if (itemCount > 0) {
      Alert.alert(
        "Order Confirmed!",
        `Your order contains ${itemCount} items and would have cost $${totalCost.toFixed(2)}!`,
        [{ text: "OK", onPress: () => resetOrder() }]
      );
    }
  };

  // compute the total cost and ordered item count
  const getTotalCostAndItemCount = () => {
    let totalCost = 0;
    let itemCount = 0;

    Object.keys(itemCounts).forEach(itemName => {
      const itemPrice = items.find(item => item.name === itemName).price;
      const count = itemCounts[itemName];
      totalCost += itemPrice * count;
      itemCount += count;
    });

    return { totalCost, itemCount };
  };

  // destructure total cost and item count
  const { totalCost, itemCount } = getTotalCostAndItemCount();

  // reset the order to initial state
  const resetOrder = () => {
    let initialCounts = {};
    
    items.forEach((item) => {
      initialCounts[item.name] = 0;
    });
    setItemCounts(initialCounts);
    setCurrentIndex(0);
  };

  // render the component of UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Badger Mart!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Previous" onPress={navPrevious} disabled={currentIndex === 0} />
        <View style={styles.spacer} />
        <Button title="Next" onPress={navNext} disabled={currentIndex === items.length - 1} />
      </View>
      {items.length > 0 && currentIndex < items.length && (
        <BadgerSaleItem
          key = {items[currentIndex].name}
          name = {items[currentIndex].name}
          price = {items[currentIndex].price}
          imgSrc = {items[currentIndex].imgSrc}
          upperLimit = {items[currentIndex].upperLimit}
          itemCount = {itemCounts[items[currentIndex].name]}
          onItemCountChange = {(changeAmount) => changeItemCount(items[currentIndex].name, changeAmount)}
        />
      )}

      <Text style={styles.orderDetails}>
        You have {itemCount} item(s) costing ${totalCost.toFixed(2)} in your cart!
      </Text>

      <Button 
        title="PLACE ORDER" 
        onPress={handlePlaceOrder} 
        disabled={itemCount === 0} 
      />
    </View>
  );
}

// style sheet for the component
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 10, 
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10, 
  },
  spacer: {
    width: 10, 
  },
  orderDetails: {
    padding: 10,
  },
});