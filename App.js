import React, { useState, useMemo } from 'react';
import {View,Text,TextInput,FlatList,StyleSheet,TouchableOpacity,Modal,ScrollView,SafeAreaView,StatusBar,} from 'react-native';
import CardItem from './components/CardItem';
import cardsData from './data/cards.json';

export default function App() {
  const [cards, setCards] = useState(cardsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [favorites, setFavorites] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Framework',
  });

  // Obtenir toutes les catégories uniques
  const categories = useMemo(() => {
    const cats = new Set(cards.map((card) => card.category));
    return ['Tous', ...Array.from(cats)];
  }, [cards]);

  // Filtrer les cartes
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Tous' || card.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [cards, searchTerm, selectedCategory]);

  // Toggle favori
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };

  // Supprimer une carte
  const deleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      newFavs.delete(id);
      return newFavs;
    });
  };

  // Ajouter une nouvelle carte
  const addCard = () => {
    if (!newCard.title || !newCard.description) {
      alert('Veuillez remplir au moins le titre et la description');
      return;
    }

    const card = {
      ...newCard,
      id: Date.now().toString(),
      image:
        newCard.image ||
        'https://via.placeholder.com/150?text=' + newCard.title,
    };

    setCards((prev) => [card, ...prev]);
    setShowAddModal(false);
    setNewCard({ title: '', description: '', image: '', category: 'Framework' });
  };

  const renderCard = ({ item }) => (
    <CardItem
      {...item}
      isFavorite={favorites.has(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
      onDelete={() => deleteCard(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>📚 Ma Bibliothèque</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par titre ou description..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Filtres par catégorie */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>📊 {filteredCards.length} carte(s)</Text>
          <Text style={styles.statText}>❤️ {favorites.size} favori(s)</Text>
        </View>
      </View>

      {/* Liste des cartes */}
      <FlatList
        data={filteredCards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune carte trouvée 😢</Text>
          </View>
        }
      />

      {/* Modal d'ajout */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle Carte</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Titre *</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.title}
                  onChangeText={(text) =>
                    setNewCard({ ...newCard, title: text })
                  }
                  placeholder="Ex: Vue.js"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newCard.description}
                  onChangeText={(text) =>
                    setNewCard({ ...newCard, description: text })
                  }
                  placeholder="Décris la technologie..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL de l'image</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.image}
                  onChangeText={(text) =>
                    setNewCard({ ...newCard, image: text })
                  }
                  placeholder="https://..."
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Catégorie</Text>
                <View style={styles.categoryPicker}>
                  {['Framework', 'Langage', 'Outil', 'Bibliothèque', 'Runtime', 'CSS', 'Base de données'].map(
                    (cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryOption,
                          newCard.category === cat &&
                            styles.categoryOptionActive,
                        ]}
                        onPress={() =>
                          setNewCard({ ...newCard, category: cat })
                        }
                      >
                        <Text
                          style={[
                            styles.categoryOptionText,
                            newCard.category === cat &&
                              styles.categoryOptionTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={addCard}>
                <Text style={styles.submitButtonText}>Ajouter la carte</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoryButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#4f46e5',
  },
  categoryText: {
    color: '#4b5563',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  listContainer: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryOptionActive: {
    backgroundColor: '#4f46e5',
  },
  categoryOptionText: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryOptionTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});