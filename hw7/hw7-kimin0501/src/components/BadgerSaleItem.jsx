import React from 'react';
import { Text, View, Image, StyleSheet, Button } from 'react-native';

export default function BadgerSaleItem(props) {

  // destructure props to use in the component
  const { name, imgSrc, price, upperLimit, itemCount, onItemCountChange } = props;

  // style sheet for the component's layout
  const itemStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: 8,
      padding: 16,
      backgroundColor: 'white',
      elevation: 1,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 8,
    },
    name: {
      fontWeight: '500',
      fontSize: 18,
    },
    price: {
      fontSize: 16,
      color: 'darkgrey',
      marginBottom: 4,
    },
    limit: {
      fontSize: 14,
      color: 'grey',
    },
    countContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      justifyContent: 'space-between',
      width: 80,
    },
  });
  
  // render the sale item
  return (
    <View style={itemStyles.container}>
      <Image source={{ uri: imgSrc }} style={itemStyles.image} />
      <Text style={itemStyles.name}>{name}</Text>
      <Text style={itemStyles.price}>${price.toFixed(2)} each</Text>
      <Text style={itemStyles.limit}>You can order up to {upperLimit} units!</Text>
      <View style={itemStyles.countContainer}>
        <Button title = "-" onPress={() => onItemCountChange(-1)} disabled={itemCount <= 0} />
        <Text>{itemCount}</Text>
        <Button title = "+" onPress={() => onItemCountChange(1)} disabled={itemCount >= upperLimit} />
      </View>
    </View>
  );
}