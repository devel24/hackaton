import React, { useState } from 'react';
import { View, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import ChatBubble from '../components/ChatBubble';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async () => {
    var newMessageBody = { "role": "user", "content": newMessage };
    setNewMessage('');
    var oldMessages = [...messages, newMessageBody];
    setMessages(oldMessages);
    var newMessages = await invokeChatGPT(oldMessages);
    setMessages([...oldMessages, ...newMessages]);
  };

  const invokeChatGPT = async (messages) => {
    var body = JSON.stringify({
      "dataSources": [
        {
          "type": "AzureCognitiveSearch",
          "parameters": {
            "endpoint": "https://hackaton-search.search.windows.net",
            "key": "W0XdxvzrxMPl2dtvhSiImFsi95DTixpkZe3KqwWlMZAzSeD0XxwS",
            "indexName": "serch2",
            "semanticConfiguration": "",
            "queryType": "simple",
            "fieldsMapping": null,
            "inScope": true,
            "roleInformation": "Tu eres un asistente de ia que ayuda a la gente a encontrar información"
          }
        }
      ],
      "messages": messages,
      "deployment": "prueba",
      "temperature": 0,
      "top_p": 1,
      "max_tokens": 800,
      "stop": null,
      "stream": false
    });
    const response = await fetch('https://wb-use-dvoai01.openai.azure.com/openai/deployments/prueba/extensions/chat/completions?api-version=2023-06-01-preview', {
      method: 'POST',
      headers: {
        'api-key': '69fce65599924898a96d653e93111289',
        'Content-Type': 'application/json'
      },
      body: body,
    });
    const data = await response.json();
    return data.choices[0].messages
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages.filter(item=>!item.content.toLowerCase().includes("citations"))}
        renderItem={({ item }) => {
          return <ChatBubble message={item.content} />
        }}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} disabled={newMessage.trim().length === 0} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default ChatScreen;
