// src/screens/PrivacyPolicy.js

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
// For icons, use a React Native icon library
import Icon from 'react-native-vector-icons/Feather'; 
// Or use other icon sets like react-native-vector-icons/Ionicons etc.

// Assume you have navigation via React Navigation
import { useNavigation } from '@react-navigation/native';

export default function PrivacyPolicy() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Icon name="lock" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.heading2}>Our Commitment to Your Privacy</Text>
        <Text style={styles.paragraph}>
          This Privacy Policy describes how your personal information is collected, used, and shared when you use our application.
        </Text>

        <Text style={styles.heading3}>Personal Information We Collect</Text>
        <Text style={styles.paragraph}>
          When you use the app, we automatically collect certain information about your device, including information about your … (rest of text)  
        </Text>

        <Text style={styles.heading3}>How Do We Use Your Personal Information?</Text>
        <Text style={styles.paragraph}>
          We use the information we collect generally to fulfill any services provided through the app. Additionally, we use this information to:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Communicate with you;</Text>
          <Text style={styles.listItem}>• Screen our orders for potential risk or fraud; and</Text>
          <Text style={styles.listItem}>• When in line with the preferences you have shared …</Text>
        </View>

        <Text style={styles.heading3}>Sharing Your Personal Information</Text>
        <Text style={styles.paragraph}>
          We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use analytics to help us understand how our customers use the app.
        </Text>

        <Text style={styles.heading3}>Your Rights</Text>
        <Text style={styles.paragraph}>
          If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffffcc', // translucent
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    color: '#374151',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  list: {
    marginVertical: 8,
    paddingLeft: 16,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
    marginBottom: 4,
  },
});
