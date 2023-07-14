import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatBubble = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f2f2f2',
  },
});

export default ChatBubble;
