import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from './_layout';
import { useTheme } from '../src/theme/ThemeContext';
import { ThemedBackground, ThemedCard } from '../src/components/themed';
import { HeartVideo } from '../src/components';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// ============ CONTENT ARRAYS ============

const COMPLIMENTS = [
  "You're my berryboo forever",
  "You're the sweetest soul I know",
  "You're my princess bride",
  "You're my beautiful snowflake",
  "You're my favorite person in every room",
  "You're my poopypants and I love you",
  "You're so soft hearted and precious",
  "You're my crybaby and I wouldn't change that for anything",
  "You're the cutest crybaby on earth",
  "You're so easy to love",
  "You make my whole day better",
  "You're stunning in ways you don't even see",
  "You're my comfort person",
  "You're my peace",
  "You're my happiness",
  "You're my heart",
  "You're my girl",
  "You're so lovable it hurts",
  "You're beautiful inside and out",
  "You're my safe place",
  "You're my favorite human",
  "You're my best decision",
  "You're my dream girl",
  "You're perfect to me",
  "You're my forever",
  "You're my baby",
  "You're my everything",
  "You're my soulmate energy",
  "You're my home",
  "You're loved more than you know",
];

const WHY_I_LOVE_YOU = [
  "I love you because you're so sweet and gentle",
  "I love you because you care so deeply",
  "I love you because you're my crybaby",
  "I love you because you're always there for me",
  "I love you because you believe in me",
  "I love you because you make me laugh",
  "I love you because you make me feel wanted",
  "I love you because you feel like home",
  "I love you because you're so loving",
  "I love you because you're you",
  "I love you because you're patient with me",
  "I love you because you try for us",
  "I love you because you make life better",
  "I love you because you're honest",
  "I love you because you're loyal",
  "I love you because you're adorable",
  "I love you because you support my dreams",
  "I love you because you're soft with me",
  "I love you because you're my girl",
  "I love you because you chose me",
  "I love you because you trust me",
  "I love you because you make me feel special",
  "I love you because you're pure hearted",
  "I love you because you're mine",
  "I love you because forever feels right with you",
];

const QUESTIONS = [
  "What nickname do you like the most from me?",
  "When do you feel closest to me?",
  "What makes you feel loved by me?",
  "What is your favorite thing about us?",
  "What is your favorite way I show love?",
  "What song reminds you of me?",
  "What makes you feel safe?",
  "What makes you feel happy with me?",
  "What is your favorite compliment from me?",
  "What is your favorite thing about yourself?",
  "What makes you feel special?",
  "What do you love most about our relationship?",
  "What is something you're proud of?",
  "What makes you feel appreciated?",
  "What is your dream date with me?",
  "What is something you want us to do together?",
  "What makes you feel calm?",
  "What makes you feel understood?",
  "What is your love language?",
  "What makes you feel secure?",
  "What is something you admire about me?",
  "What is your favorite memory with me?",
  "What makes you feel chosen?",
  "What makes you feel valued?",
  "What is something you never want to lose between us?",
];

const CHALLENGES = [
  "Send me a selfie 📸",
  "Tell me one thing you love about yourself",
  "Tell me you love me 💕",
  "Send me a voice note 🎙️",
  "Smile right now 😊",
  "Think about our future for 10 seconds",
  "Send me a heart emoji 💗",
  "Tell me something sweet",
  "Hug me next time you see me 🤗",
  "Think about our first time meeting",
  "Think about our first date",
  "Tell me your favorite nickname",
  "Send me a cute photo",
  "Tell me something you appreciate about us",
  "Think about me before sleeping 🌙",
  "Send me a good morning or good night text",
  "Tell me one thing I do that you like",
  "Imagine our future house 🏠",
  "Think about our wedding for 10 seconds 💒",
  "Tell me what makes you feel loved",
  "Think about holding my hand 🤝",
  "Tell me something you miss about me",
  "Send me a heart",
  "Tell me you're mine",
  "Think about kissing me 💋",
];

const SPECIAL_MOMENTS = [
  "I still remember seeing you at Stampede for the first time",
  "I still remember how nervous I was asking you out",
  "I still remember stressing so hard buying your ring from Pandora",
  "I still remember shopping with Yuvi trying to find you the perfect gift",
  "I still remember falling asleep on call with you after my Paladin shifts",
  "I still remember realizing I was in love with you",
  "I still remember thinking \"she's the one\"",
  "I still remember how you looked the first time we went out",
  "I still remember your smile",
  "I still remember everything",
];

const SAD_MESSAGES = [
  "It's okay sis. Prabh is a bum. He's dumb sometimes. He's mean sometimes. He's rude sometimes. But he loves you more than anything in this world.",
  "Yeah I get mad easily. Yeah I mess up. But I always forgive you. I always come back. I always choose you.",
  "Even when we fight, you're still my girl. Even when we're mad, you're still my forever.",
  "You don't have to be perfect for me. You never did. I fell in love with you as you are.",
  "I know you're hurting right now. But you're not alone. You have me. Always.",
  "I love you on good days. I love you on bad days. I love you on messy days. I love you every day.",
  "We can have a million fights and none of them can break us.",
  "You're stuck with me for life. Sorry.",
  "Even when I'm annoying, I still love you more than anything.",
  "You're my crybaby. And I'll protect my crybaby forever.",
  "You're safe with me. You're loved by me. You're mine.",
  "No matter what happens, I'm not leaving.",
  "I might mess up, but I will always make it right.",
  "You don't have to carry everything alone. Let me hold some of it.",
  "I choose you. Over and over again.",
  "You're not too much. You're not annoying. You're not hard to love.",
  "You're precious to me.",
  "You mean more to me than my ego, my pride, or being right.",
  "Even when we argue, I still look at you and see my future.",
  "I love you more than my bad moods.",
  "You're my favorite person, even when I'm grumpy.",
  "You're my home.",
  "I'm proud of you for surviving today.",
  "You're stronger than you think.",
  "Come here. Let me hug you.",
  "If you're crying right now, wipe those tears. That's my baby.",
  "Nothing you say or do will make me stop loving you.",
  "You're not losing me.",
  "You never lost me.",
  "You will never lose me.",
  "I'm yours.",
  "You're mine.",
  "We're forever whether we like it or not.",
  "You don't have to figure life out today.",
  "Breathe. I got you.",
  "You're allowed to have bad days.",
  "You're allowed to be tired.",
  "You're allowed to be sad.",
  "And I still love you through all of it.",
  "I love you more than words can explain.",
];

// ============ CATEGORY CONFIGURATION ============

const CATEGORIES = [
  { id: 'compliment', title: 'Compliments', icon: 'sparkles', color: '#FF6B9D', data: COMPLIMENTS, emoji: '💫' },
  { id: 'love', title: 'Why I Love You', icon: 'heart', color: '#E91E63', data: WHY_I_LOVE_YOU, emoji: '❤️' },
  { id: 'challenge', title: 'Challenges', icon: 'flash', color: '#FF9800', data: CHALLENGES, emoji: '⚡' },
  { id: 'moment', title: 'Memories', icon: 'camera', color: '#4CAF50', data: SPECIAL_MOMENTS, emoji: '📸' },
];

// ============ MAIN COMPONENT ============

export default function DailyLove() {
  const router = useRouter();
  const { playClick, playSuccess, playMagic } = useAudio();
  const { colors, isDark } = useTheme();

  const [streak, setStreak] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [contentIndex, setContentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showSadMode, setShowSadMode] = useState(false);
  const [sadMessage, setSadMessage] = useState('');
  const [isNewDay, setIsNewDay] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadStreak();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(cardScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadStreak = async () => {
    try {
      const lastVisit = await AsyncStorage.getItem('dailyLove_lastVisit');
      const storedStreak = await AsyncStorage.getItem('dailyLove_streak');
      const today = new Date().toDateString();

      if (lastVisit !== today) {
        setIsNewDay(true);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastVisit === yesterday.toDateString()) {
          const newStreak = (parseInt(storedStreak || '0') || 0) + 1;
          setStreak(newStreak);
          await AsyncStorage.setItem('dailyLove_streak', newStreak.toString());
        } else {
          setStreak(1);
          await AsyncStorage.setItem('dailyLove_streak', '1');
        }
        await AsyncStorage.setItem('dailyLove_lastVisit', today);
      } else {
        setStreak(parseInt(storedStreak || '0') || 0);
      }
    } catch (error) {
      console.log('Error loading streak:', error);
    }
  };

  const selectCategory = (category: typeof CATEGORIES[0]) => {
    playClick();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
    const randomIndex = Math.floor(Math.random() * category.data.length);
    setContentIndex(randomIndex);
    setCurrentContent(category.data[randomIndex]);
    setAnswer('');

    Animated.sequence([
      Animated.timing(cardScaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(cardScaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const getNextContent = () => {
    if (!selectedCategory) return;
    playClick();
    const nextIndex = (contentIndex + 1) % selectedCategory.data.length;
    setContentIndex(nextIndex);
    setCurrentContent(selectedCategory.data[nextIndex]);

    Animated.sequence([
      Animated.timing(cardScaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(cardScaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const goBackToMenu = () => {
    playClick();
    setSelectedCategory(null);
    setCurrentContent('');
  };

  const handleNeedHug = () => {
    playMagic();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSadMode(true);
    const randomSad = SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)];
    setSadMessage(randomSad);
  };

  const handleNextSadMessage = () => {
    playClick();
    const randomSad = SAD_MESSAGES[Math.floor(Math.random() * SAD_MESSAGES.length)];
    setSadMessage(randomSad);
  };

  const closeSadMode = () => {
    playClick();
    setShowSadMode(false);
  };

  // ============ SAD MODE OVERLAY ============
  if (showSadMode) {
    return (
      <ThemedBackground>
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A0D1A' : colors.background }]}>
          {/* Heart Video decorative elements */}
          <HeartVideo position="top-right" size={80} />
          <HeartVideo position="bottom-left" size={70} />

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.card }]}
            onPress={closeSadMode}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.sadContent}>
            <Ionicons name="heart" size={60} color={colors.primary} />
            <Text style={[styles.sadTitle, { color: colors.textPrimary }]}>I'm here for you 💗</Text>

            <ThemedCard variant="glow" glowColor={colors.primary} style={styles.sadCard}>
              <Text style={[styles.sadMessageText, { color: colors.textPrimary }]}>{sadMessage}</Text>
            </ThemedCard>

            <TouchableOpacity
              style={[styles.nextSadButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
              onPress={handleNextSadMessage}
              activeOpacity={0.8}
            >
              <Text style={styles.nextSadButtonText}>Another message</Text>
              <Ionicons name="refresh" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={[styles.sadFooter, { color: colors.textSecondary }]}>
              I love you. I'm not going anywhere.{'\n'}You're my girl. Forever.
            </Text>
          </View>
        </SafeAreaView>
      </ThemedBackground>
    );
  }

  // ============ ACTIVITY VIEW (Selected Category) ============
  if (selectedCategory) {
    const showHeartVideos = selectedCategory.id === 'love' || selectedCategory.id === 'moment';
    
    return (
      <ThemedBackground>
        <SafeAreaView style={styles.container}>
          {/* Heart Video decorative elements for specific pages */}
          {showHeartVideos && (
            <>
              <HeartVideo position="top-right" size={75} />
              <HeartVideo position="bottom-left" size={65} />
            </>
          )}

          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={goBackToMenu}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{selectedCategory.emoji} {selectedCategory.title}</Text>

            <View style={{ width: 44 }} />
          </View>

          <ScrollView contentContainerStyle={styles.activityContent}>
            <Animated.View
              style={[
                { transform: [{ scale: cardScaleAnim }] },
              ]}
            >
              <ThemedCard 
                variant="glow" 
                glowColor={selectedCategory.color} 
                style={[styles.contentCard, { borderColor: selectedCategory.color }]}
              >
                <View style={[styles.cardIconContainer, { backgroundColor: selectedCategory.color + '20' }]}>
                  <Ionicons name={selectedCategory.icon as any} size={40} color={selectedCategory.color} />
                </View>

                <Text style={[styles.cardContent, { color: colors.textPrimary }]}>{currentContent}</Text>

                {selectedCategory.hasInput && (
                  <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
                    <TextInput
                      style={[styles.answerInput, { color: colors.textPrimary, backgroundColor: colors.glass }]}
                      placeholder="Write your thoughts..."
                      placeholderTextColor={colors.textMuted}
                      value={answer}
                      onChangeText={setAnswer}
                      multiline
                    />
                  </View>
                )}
              </ThemedCard>
            </Animated.View>

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: selectedCategory.color, shadowColor: selectedCategory.color }]}
              onPress={getNextContent}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ThemedBackground>
    );
  }

  // ============ MAIN MENU ============
  return (
    <ThemedBackground showFloatingElements={true}>
      <SafeAreaView style={styles.container}>
        {/* Heart Video decorative elements */}
        <HeartVideo position="top-right" size={80} />

        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => { playClick(); router.push('/'); }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <ThemedCard variant="glass" style={styles.streakContainer}>
            <Ionicons name="flame" size={20} color="#FF9800" />
            <Text style={[styles.streakText, { color: '#FF9800' }]}>{streak} days</Text>
          </ThemedCard>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isNewDay && (
            <Animated.View style={[styles.newDayBanner, { opacity: fadeAnim, backgroundColor: colors.primaryGlow }]}>
              <Ionicons name="sunny" size={18} color={colors.primary} />
              <Text style={[styles.newDayText, { color: colors.primary }]}>Welcome back! 💕</Text>
            </Animated.View>
          )}

          <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
            <Text style={[styles.mainTitle, { color: colors.textPrimary }]}>Daily Love 💗</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Choose an activity</Text>
          </Animated.View>

          {/* Activity Cards */}
          <View style={styles.activityGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => selectCategory(category)}
                activeOpacity={0.8}
              >
                <ThemedCard variant="glass" style={[styles.activityCard, { borderColor: category.color }]}>
                  <View style={[styles.activityIconBg, { backgroundColor: category.color + '20' }]}>
                    <Ionicons name={category.icon as any} size={32} color={category.color} />
                  </View>
                  <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>{category.emoji} {category.title}</Text>
                  <Text style={[styles.activityCount, { color: colors.textMuted }]}>{category.data.length} items</Text>
                </ThemedCard>
              </TouchableOpacity>
            ))}
          </View>

          {/* Special Features */}
          <View style={styles.specialSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>More Activities</Text>

            <TouchableOpacity
              onPress={() => { playClick(); router.push('/heart-to-heart'); }}
              activeOpacity={0.8}
            >
              <ThemedCard variant="glass" style={styles.featureCard}>
                <View style={[styles.featureIconBg, { backgroundColor: colors.primaryGlow }]}>
                  <Ionicons name="chatbubbles" size={28} color={colors.primary} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Heart to Heart 💕</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Our apology & repair space</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
              </ThemedCard>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { playClick(); router.push('/would-you-rather'); }}
              activeOpacity={0.8}
            >
              <ThemedCard variant="glass" style={styles.featureCard}>
                <View style={[styles.featureIconBg, { backgroundColor: colors.secondaryGlow }]}>
                  <Ionicons name="help-circle" size={28} color={colors.secondary} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Would You Rather 🎲</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Fun couples game</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
              </ThemedCard>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { playClick(); router.push('/coin-flip'); }}
              activeOpacity={0.8}
            >
              <ThemedCard variant="glass" style={styles.featureCard}>
                <View style={[styles.featureIconBg, { backgroundColor: 'rgba(255, 215, 0, 0.2)' }]}>
                  <Text style={{ fontSize: 26 }}>🪙</Text>
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Who's Right? 🪙</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Flip a coin to decide</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
              </ThemedCard>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { playClick(); router.push('/together-for'); }}
              activeOpacity={0.8}
            >
              <ThemedCard variant="glass" style={styles.featureCard}>
                <View style={[styles.featureIconBg, { backgroundColor: colors.primaryGlow }]}>
                  <Text style={{ fontSize: 26 }}>🕯</Text>
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>Together For 🕯</Text>
                  <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Our time together</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
              </ThemedCard>
            </TouchableOpacity>
          </View>

          {/* Need a Hug */}
          <View style={styles.hugSection}>
            <TouchableOpacity
              style={[styles.hugButton, { backgroundColor: colors.secondary, shadowColor: colors.secondary }]}
              onPress={handleNeedHug}
              activeOpacity={0.8}
            >
              <Ionicons name="heart-half" size={24} color="#FFFFFF" />
              <Text style={styles.hugButtonText}>Need a bigger hug?</Text>
            </TouchableOpacity>
            <Text style={[styles.hugSubtext, { color: colors.textMuted }]}>(when your sad and being my silly crybaby)</Text>
          </View>

          {/* Back to Valentine's */}
          <TouchableOpacity
            style={styles.valentineButton}
            onPress={() => { playClick(); router.push('/personalization'); }}
            activeOpacity={0.8}
          >
            <Ionicons name="gift" size={18} color={colors.textSecondary} />
            <Text style={[styles.valentineButtonText, { color: colors.textSecondary }]}>Start Valentine's Journey</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ThemedBackground>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  newDayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  newDayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  activityCard: {
    width: (width - 52) / 2,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  activityIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityCount: {
    fontSize: 12,
  },
  specialSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  featureIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  hugSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  hugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  hugButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hugSubtext: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  valentineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  valentineButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Activity View Styles
  activityContent: {
    padding: 20,
    alignItems: 'center',
  },
  contentCard: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardContent: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 32,
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  answerInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Sad Mode Styles
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
  },
  sadContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sadTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 30,
  },
  sadCard: {
    marginBottom: 30,
    width: width - 48,
  },
  sadMessageText: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 32,
    fontStyle: 'italic',
  },
  nextSadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginBottom: 40,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextSadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sadFooter: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
