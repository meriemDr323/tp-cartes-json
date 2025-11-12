import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function CardItem({ 
  title, 
  description, 
  image, 
  category, 
  isFavorite, 
  onToggleFavorite, 
  onDelete 
}) {
  return (
    <View style={styles.card}>
      {/* Image de couverture */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: image }} 
          style={styles.cover}
          resizeMode="contain"
        />
        
        {/* Bouton Favori */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
        >
          <Text style={styles.heartIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>

        {/* Bouton Supprimer */}
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Corps de la carte */}
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>
        <Text style={styles.desc} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 150,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cover: {
    width: '80%',
    height: 100,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  heartIcon: {
    fontSize: 20,
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteIcon: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  body: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: '#4f46e5',
    fontWeight: '600',
  },
  desc: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
});