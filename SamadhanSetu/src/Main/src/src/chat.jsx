// src/screens/Chat.js

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

// Sample data (you’ll replace with your real data / props / state)
const conversations = [
  { id: 1, name: 'Priya Sharma', lastMessage: 'Great, see you then!', time: '10:30 AM', unread: 2 },
  { id: 2, name: 'Raj Kumar', lastMessage: 'Can you send me the report?', time: '9:45 AM', unread: 0 },
  // … more
];

const messagesByConv = {
  1: [
    { sender: 'Priya Sharma', text: 'Hey! Are we still on for the park cleanup on Sunday?', time: '10:28 AM' },
    { sender: 'me', text: "Yes, definitely! I'll be there.", time: '10:29 AM' },
    { sender: 'Priya Sharma', text: 'Great, see you then!', time: '10:30 AM' },
  ],
  2: [
    { sender: 'Raj Kumar', text: 'Can you send me the report?', time: '9:45 AM' },
  ],
};

export default function ChatScreen() {
  const navigation = useNavigation();
  const [selectedConversationId, setSelectedConversationId] = useState(1);
  const [inputText, setInputText] = useState('');

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const messages = messagesByConv[selectedConversationId] || [];

  const onSend = () => {
    if (!inputText.trim()) return;
    // Here you’d send message via API or update local state
    // For demo, append to messagesByConv (not ideal for state immutability)
    messagesByConv[selectedConversationId].push({
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setInputText('');
    // Force re-render by toggling state or using useState for messages
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.convItem, item.id === selectedConversationId && styles.convItemSelected]}
      onPress={() => setSelectedConversationId(item.id)}
    >
      <Text style={styles.convName}>{item.name}</Text>
      <Text style={styles.convLast}>{item.lastMessage}</Text>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowRight : styles.messageRowLeft]}>
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
          <Text style={isMe ? styles.messageTextMe : styles.messageTextOther}>{item.text}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sidebar}>
        <FlatList
          data={conversations}
          keyExtractor={item => item.id.toString()}
          renderItem={renderConversationItem}
        />
      </View>

      <View style={styles.chatArea}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedConversationId(null)}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.chatTitle}>{selectedConversation?.name}</Text>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, idx) => idx.toString()}
          style={styles.messagesList}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
            />
            <TouchableOpacity onPress={onSend} style={styles.sendButton}>
              <Icon name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#fff' },
  sidebar: { width: 120, borderRightWidth: 1, borderColor: '#ddd' },
  convItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  convItemSelected: {
    backgroundColor: '#edf7f0',
  },
  convName: { fontSize: 16, fontWeight: '600' },
  convLast: { fontSize: 12, color: '#666' },
  unreadBadge: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 2,
  },
  unreadBadgeText: { color: 'white', fontSize: 10 },
  chatArea: { flex: 1, flexDirection: 'column' },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  chatTitle: { fontSize: 18, fontWeight: '600', marginLeft: 12 },
  messagesList: { flex: 1, padding: 12 },
  messageRow: { marginVertical: 4 },
  messageRowLeft: { alignItems: 'flex-start' },
  messageRowRight: { alignItems: 'flex-end' },
  messageBubble: { maxWidth: '80%', padding: 8, borderRadius: 8 },
  messageBubbleMe: { backgroundColor: '#dcf8c6' },
  messageBubbleOther: { backgroundColor: '#f1f0f0' },
  messageTextMe: { color: '#000' },
  messageTextOther: { color: '#000' },
  messageTime: { fontSize: 10, color: '#888', marginTop: 4, textAlign: 'right' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#22C55E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
