// src/screens/Analytics.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Report, User } from '../entities/all';  // adjust path
// For icons, you might use react-native-vector-icons or similar
import Icon from 'react-native-vector-icons/Feather';  
// You may use a chart library for React Native, e.g. react-native-svg-charts or victory-native
import { subDays, format } from 'date-fns';

export default function AnalyticsScreen() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.role !== 'admin') {
        // you may use a navigation redirect instead of alert
        console.warn('Access denied. Admin privileges required.');
        return;
      }
      const data = await Report.list('-created_date', 200);
      setReports(data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const getAnalyticsData = () => {
    const now = new Date();
    const lastWeek = subDays(now, 7);
    const lastMonth = subDays(now, 30);

    const thisWeek = reports.filter(r => new Date(r.created_date) >= lastWeek).length;
    const thisMonth = reports.filter(r => new Date(r.created_date) >= lastMonth).length;

    const statusBreakdown = reports.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
    const categoryBreakdown = reports.reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    }, {});
    const priorityBreakdown = reports.reduce((acc, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {});

    const resolvedReports = reports.filter(r => r.status === 'resolved' && r.resolved_date);
    const avgResolutionTime = resolvedReports.length > 0
      ? resolvedReports.reduce((sum, r) => {
          const created = new Date(r.created_date);
          const resolved = new Date(r.resolved_date);
          return sum + (resolved - created) / (1000 * 60 * 60 * 24);
        }, 0) / resolvedReports.length
      : 0;

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const count = reports.filter(r => {
        const d = new Date(r.created_date);
        return d.toDateString() === date.toDateString();
      }).length;
      weeklyData.push({
        date: format(date, 'MMM dd'),
        reports: count,
      });
    }

    return {
      thisWeek,
      thisMonth,
      statusBreakdown,
      categoryBreakdown,
      priorityBreakdown,
      avgResolutionTime,
      weeklyData,
      totalReports: reports.length,
      resolvedCount: statusBreakdown.resolved || 0,
      pendingCount: (statusBreakdown.submitted || 0) + (statusBreakdown.acknowledged || 0),
      inProgressCount: statusBreakdown.in_progress || 0,
    };
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ marginTop: 10 }}>Loading analytics...</Text>
      </View>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.center}>
        <Icon name="shield" size={60} color="red" />
        <Text style={styles.title}>Access Denied</Text>
        <Text>You need admin privileges to access analytics.</Text>
      </View>
    );
  }

  const analytics = getAnalyticsData();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics & Insights</Text>
        <Text style={styles.headerSubtitle}>
          Performance metrics and trends
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{analytics.totalReports}</Text>
          <Text style={styles.metricLabel}>Total Reports</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{analytics.resolvedCount}</Text>
          <Text style={styles.metricLabel}>Resolved</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>
            {analytics.avgResolutionTime.toFixed(1)}
          </Text>
          <Text style={styles.metricLabel}>Avg Resolution (days)</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{analytics.thisWeek}</Text>
          <Text style={styles.metricLabel}>This Week</Text>
        </View>
      </View>

      {/* Additional analytics breakdowns */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status Breakdown</Text>
        {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
          <View key={status} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{status}</Text>
            <Text style={styles.breakdownValue}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {Object.entries(analytics.categoryBreakdown).map(([cat, count]) => (
          <View key={cat} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{cat}</Text>
            <Text style={styles.breakdownValue}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority Breakdown</Text>
        {Object.entries(analytics.priorityBreakdown).map(([p, count]) => (
          <View key={p} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{p}</Text>
            <Text style={styles.breakdownValue}>{count}</Text>
          </View>
        ))}
      </View>

      {/* Weekly Trend */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Trend</Text>
        {analytics.weeklyData.map((day, idx) => (
          <View key={idx} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{day.date}</Text>
            <Text style={styles.breakdownValue}>{day.reports}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#065f46' },
  headerSubtitle: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  metricNumber: { fontSize: 20, fontWeight: 'bold', color: '#065f46' },
  metricLabel: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  section: { marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  breakdownLabel: { fontSize: 14, color: '#374151' },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: '#065f46' },
});

