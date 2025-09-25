// src/screens/SubmitReport.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';  // or any icon set you prefer
import { useNavigation } from '@react-navigation/native';

import { User, Report } from '../entities/all';  // adjust path
import QuickReportForm from '../components/reports/QuickReportForm';
import { SendEmail } from '../integrations/Core';  // adjust path

export default function SubmitReportScreen() {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        // If not authenticated, navigate to login screen
        // navigation.navigate('Login');
        console.warn('User not authenticated', error);
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const newReport = await Report.create(formData);

      // Send notification email if possible
      try {
        if (user && user.email) {
          await SendEmail({
            to: user.email,
            subject: 'Report Submitted Successfully - Samadhan Setu',
            body: `Dear ${user.full_name || 'Citizen'},

Thank you for submitting your civic report through Samadhan Setu!

Report Details:
- Title: ${formData.title}
- Category: ${formData.category}
- Description: ${formData.description}
- Status: Submitted
- Report ID: ${newReport.id}

Your report has been received and will be reviewed by the relevant municipal department. You will receive email updates as your report progresses through our system.

Thank you for helping improve our community!

Best regards,
Samadhan Setu Team`,
          });
        }
      } catch (emailError) {
        console.error('Failed to send

