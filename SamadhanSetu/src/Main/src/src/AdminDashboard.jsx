// AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet, ActivityIndicator, Modal 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ReportCard from '../components/reports/ReportCard';
import { Report, User } from '@/entities/all';
import Icon from 'react-native-vector-icons/Feather'; // example icon library
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        return;
      }
      const data = await Report.list('-created_date', 100);
      setReports(data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'resolved') updateData.resolved_date = new Date().toISOString().split('T')[0];
      await Report.update(reportId, updateData);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStats = () => {
    const total = reports.length;
    const pending = reports.filter(r => ['submitted', 'acknowledged'].includes(r.status)).length;
    const inProgress = reports.filter(r => r.status === 'in_progress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const urgent = reports.filter(r => r.priority === 'urgent').length;
    return { total, pending, inProgress, resolved, urgent };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ marginTop: 10 }}>Loading admin dashboard...</Text>
      </View>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.center}>
        <Icon name="shield" size={60} color="red" />
        <Text style={styles.title}>Access Denied</Text>
        <Text>You need admin privileges to access this dashboard.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Icon name="shield" size={24} color="#16a34a" /> Municipal Admin Dashboard
        </Text>
        <Text style={styles.headerSubtitle}>Manage and track civic issues across the city</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {['total','pending','inProgress','resolved','urgent'].map((key,index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statNumber}>{stats[key]}</Text>
            <Text style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          </View>
        ))}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#999" style={{ marginLeft: 5 }} />
          <TextInput
            placeholder="Search reports..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>

        <Picker
          selectedValue={statusFilter}
          onValueChange={setStatusFilter}
          style={styles.picker}
        >
          <Picker.Item label="All Status" value="all" />
          <Picker.Item label="Submitted" value="submitted" />
          <Picker.Item label="Acknowledged" value="acknowledged" />
          <Picker.Item label="Assigned" value="assigned" />
          <Picker.Item label="In Progress" value="in_progress" />
          <Picker.Item label="Resolved" value="resolved" />
          <Picker.Item label="Closed" value="closed" />
        </Picker>

        <Picker
          selectedValue={categoryFilter}
          onValueChange={setCategoryFilter}
          style={styles.picker}
        >
          <Picker.Item label="All Types" value="all" />
          <Picker.Item label="Pothole" value="pothole" />
          <Picker.Item label="Streetlight" value="streetlight" />
          <Picker.Item label="Trash" value="trash" />
          <Picker.Item label="Water Leak" value="water_leak" />
          <Picker.Item label="Graffiti" value="graffiti" />
          <Picker.Item label="Traffic Signal" value="traffic_signal" />
          <Picker.Item label="Sidewalk" value="sidewalk" />
          <Picker.Item label="Noise" value="noise" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedReport(item)} style={styles.reportItem}>
            <Text style={styles.reportTitle}>{item.title}</Text>
            <Text style={styles.reportDesc}>{item.description}</Text>
            <Picker
              selectedValue={item.status}
              onValueChange={(value) => handleStatusUpdate(item.id, value)}
              style={styles.reportPicker}
            >
              <Picker.Item label="Submitted" value="submitted" />
              <Picker.Item label="Acknowledged" value="acknowledged" />
              <Picker.Item label="Assigned" value="assigned" />
              <Picker.Item label="In Progress" value="in_progress" />
              <Picker.Item label="Resolved" value="resolved" />
              <Picker.Item label="Closed" value="closed" />
            </Picker>
          </TouchableOpacity>
        )}
      />

      {/* Selected Report Modal */}
      <Modal visible={!!selectedReport} transparent animationType="fade">
        <View style={styles.modalBg}>
          <ReportCard
            report={selectedReport}
            onClick={() => {}}
            showActions={true}
            onStatusUpdate={handleStatusUpdate}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReport(null)}>
            <Text style={{ color: '#16a34a' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0fdf4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#065f46' },
  headerSubtitle: { fontSize: 14, color: '#4b5563', marginTop: 4 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#fff', padding: 10, borderRadius: 8, flex: 1, margin: 2, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#065f46' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  filters: { marginBottom: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', borderRadius: 5 },
  searchInput: { flex: 1, padding: 8 },
  picker: { height: 40, backgroundColor: '#fff', marginBottom: 10 },
  reportItem: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 8 },
  reportTitle: { fontWeight: 'bold', fontSize: 16 },
  reportDesc: { fontSize: 12, color: '#6b7280', marginVertical: 4 },
  reportPicker: { height: 35, backgroundColor: '#e5e7eb' },
  modalBg: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000aa', padding: 20 },
  closeBtn: { marginTop: 10, padding: 8, backgroundColor: '#fff', borderRadius: 5 },
});
