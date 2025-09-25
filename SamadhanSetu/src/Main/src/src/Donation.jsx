// src/screens/Donations.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { User, Donation, Cause } from '../entities/all';  // adjust relative path
// Use vector icons or other icon libraries
import Icon from 'react-native-vector-icons/Feather';

// If you need tabs, you can use react-navigation's Tab navigator or react-native-tab-view, etc.
import DonationForm from '../components/donations/DonationForm';
import CauseCard from '../components/donations/CauseCard';
import DonationHistory from '../components/donations/DonationHistory';

export default function DonationsScreen() {
  const [user, setUser] = useState(null);
  const [causes, setCauses] = useState([]);
  const [donations, setDonations] = useState([]);
  const [selectedCause, setSelectedCause] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [activeTab, setActiveTab] = useState('causes'); // “causes” or “history”
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [causesData, donationsData] = await Promise.all([
        Cause.list('-created_date', 50),
        Donation.filter({ created_by: currentUser.email }, '-created_date', 20),
      ]);

      setCauses(causesData);
      setDonations(donationsData);
    } catch (error) {
      console.error('Error loading data:', error);
      // In web you used redirect, here maybe navigation to login
    }
    setIsLoading(false);
  };

  const handleDonationSuccess = async (donationData) => {
    try {
      await Donation.create(donationData);
      setShowDonationForm(false);
      setSelectedCause(null);
      loadData();
    } catch (error) {
      console.error('Error saving donation:', error);
    }
  };

  const getStats = () => {
    const totalDonated = donations
      .filter((d) => d.status === 'completed')
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    const donationCount = donations.filter((d) => d.status === 'completed').length;
    const uniqueCauses = new Set(
      donations
        .filter((d) => d.status === 'completed')
        .map((d) => d.cause_id)
    ).size;

    return { totalDonated, donationCount, uniqueCauses };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e53e3e" />
        <Text style={{ marginTop: 10 }}>Loading donation platform...</Text>
      </View>
    );
  }

  // Main UI
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="heart" size={32} color="#e53e3e" />
        <Text style={styles.title}>Donation & Funding</Text>
        <Text style={styles.subtitle}>
          Support meaningful causes, help disaster victims, and fund environmental heroes.
        </Text>
      </View>

      {/* User Stats */}
      {user && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹{stats.totalDonated.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Donated</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.donationCount}</Text>
            <Text style={styles.statLabel}>Donations Made</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.uniqueCauses}</Text>
            <Text style={styles.statLabel}>Causes Supported</Text>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'causes' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('causes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'causes' && styles.activeTabText,
            ]}
          >
            Causes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'history' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'causes' && (
        <View style={styles.section}>
          {causes.map((cause, index) => (
            <CauseCard
              key={cause.id}
              cause={cause}
              onDonate={() => {
                setSelectedCause(cause);
                setShowDonationForm(true);
              }}
            />
          ))}
        </View>
      )}

      {activeTab === 'history' && (
        <View style={styles.section}>
          <DonationHistory donations={donations} />
        </View>
      )}

      {/* Donation Form Modal */}
      {showDonationForm && selectedCause && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <DonationForm
              cause={selectedCause}
              user={user}
              onSuccess={handleDonationSuccess}
              onCancel={() => {
                setShowDonationForm(false);
                setSelectedCause(null);
              }}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#e53e3e', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#4a5568', textAlign: 'center', marginTop: 6 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  statCard: {
    backgroundColor: '#f7fafc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
  },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#2d3748' },
  statLabel: { fontSize: 12, color: '#718096', marginTop: 4 },
  tabBar: { flexDirection: 'row', marginVertical: 10 },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
  },
  activeTabButton: {
    borderBottomColor: '#e53e3e',
  },
  tabText: { fontSize: 16, color: '#4a5568' },
  activeTabText: { color: '#e53e3e', fontWeight: 'bold' },
  section: { marginVertical: 16 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
});
