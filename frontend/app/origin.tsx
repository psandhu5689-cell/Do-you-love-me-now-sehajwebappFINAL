import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from './_layout';

export default function OriginStory() {
  const router = useRouter();
  const { userName } = useUser();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const heartPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for heart
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.pageLabel}>Our Beginning</Text>

          <Animated.View
            style={[
              styles.heartIcon,
              { transform: [{ scale: heartPulse }] },
            ]}
          >
            <Ionicons name="heart-circle" size={70} color="#FF6B9D" />
          </Animated.View>

          <View style={styles.storyCard}>
            <Text style={styles.storyText}>
              I still remember the first time I saw you, {userName}. There was
              something about you that made everything else fade away.
            </Text>

            <View style={styles.divider} />

            <Text style={styles.storyText}>
              It wasn't just how you looked — it was the way you laughed, the
              way your eyes lit up when you talked about things you loved.
            </Text>

            <View style={styles.divider} />

            <View style={styles.detailContainer}>
              <Ionicons name="star" size={20} color="#FFB347" />
              <Text style={styles.detailText}>
                The small detail I remember: the way you tucked your hair
                behind your ear when you were thinking.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/early-feelings')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  pageLabel: {
    fontSize: 14,
    color: '#9B7FA7',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  heartIcon: {
    marginBottom: 24,
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: 32,
  },
  storyText: {
    fontSize: 17,
    lineHeight: 28,
    color: '#4A1942',
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#FFD6E6',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 1,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#6B5B4F',
    fontStyle: 'italic',
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
});
