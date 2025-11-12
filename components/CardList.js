import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CardItem from './CardItem';
import cardsData from '../data/cards.json'; 

export function CardList() {
  const renderItem = ({ item }) => (
    
    <CardItem
      title={item.title}
      description={item.description}
      image={item.image}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cardsData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});