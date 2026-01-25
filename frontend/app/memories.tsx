import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Memory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  content: string;
}

const MEMORIES: Memory[] = [
  {
    id: 'funny',
    title: 'Funny Memory',
    icon: 'happy',
    color: '#FFB347',
    content:
      "Remember when we couldn't stop laughing at the most random thing? Everyone around us thought we were crazy, but in that moment, nothing else mattered. Your laugh is still my favorite sound in the world — even when you snort a little at the end.",
  },
  {
    id: 'sweet',
    title: 'Sweet Memory',
    icon: 'heart',
    color: '#FF6B9D',
    content:
      "That quiet moment when you held my hand for the first time. My heart was racing so fast, I was sure you could hear it. You looked at me with those beautiful eyes, and I knew right then — I'd cross any ocean just to see you smile.",
  },
  {
    id: 'meaningful',
    title: 'Meaningful Memory',
    icon: 'star',
    color: '#9B59B6',
    content:
      "The night we stayed up talking until sunrise. We shared our dreams, our fears, everything we usually keep hidden. That's when I realized — with you, I don't have to pretend. You see me, really see me, and you still chose to stay.",
  },
];

export default function Memories() {
  const router = useRouter();
  const [viewedMemories, setViewedMemories] = useState<Set<string>>(new Set());
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(MEMORIES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      150,
      cardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const handleMemoryPress = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const handleCloseMemory = () => {
    if (selectedMemory) {
      setViewedMemories((prev) => new Set([...prev, selectedMemory.id]));
    }
    setSelectedMemory(null);
  };

  const allViewed = viewedMemories.size === MEMORIES.length;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.pageLabel}>Our Memories</Text>
        <Text style={styles.instruction}>Tap each card to explore</Text>

        <View style={styles.cardsContainer}>
          {MEMORIES.map((memory, index) => {
            const isViewed = viewedMemories.has(memory.id);
            return (
              <Animated.View
                key={memory.id}
                style={[
                  styles.cardWrapper,
                  {
                    opacity: cardAnims[index],
                    transform: [
                      {
                        scale: cardAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.memoryCard,
                    { borderColor: memory.color },
                    isViewed && styles.viewedCard,
                  ]}
                  onPress={() => handleMemoryPress(memory)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: memory.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={memory.icon}
                      size={36}
                      color={memory.color}
                    />
                  </View>
                  <Text style={styles.cardTitle}>{memory.title}</Text>
                  {isViewed && (
                    <View style={styles.checkBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#4CAF50"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {viewedMemories.size} of {MEMORIES.length} memories explored
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(viewedMemories.size / MEMORIES.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {allViewed && (
          <Animated.View style={styles.continueContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/word-hunt')}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      {/* Memory Detail Modal */}
      <Modal
        visible={!!selectedMemory}
        animationType="fade"
        transparent
        onRequestClose={handleCloseMemory}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMemory && (
              <>
                <View
                  style={[
                    styles.modalIconCircle,
                    { backgroundColor: selectedMemory.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={selectedMemory.icon}
                    size={50}
                    color={selectedMemory.color}
                  />
                </View>
                <Text style={styles.modalTitle}>{selectedMemory.title}</Text>
                <ScrollView style={styles.modalScroll}>
                  <Text style={styles.modalText}>{selectedMemory.content}</Text>
                </ScrollView>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: selectedMemory.color },
                  ]}
                  onPress={handleCloseMemory}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 14,
    color: '#9B7FA7',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 16,
    color: '#6B5B6B',
    marginBottom: 32,
  },
  cardsContainer: {
    width: '100%',
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  memoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  viewedCard: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#4A1942',
  },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  progressContainer: {
    width: '100%',
    marginTop: 32,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#9B7FA7',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#FFE4EC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B9D',
    borderRadius: 4,
  },
  continueContainer: {
    marginTop: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(74, 25, 66, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    width: '100%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A1942',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 200,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#5A4A5A',
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 24,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
