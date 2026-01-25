import React, { createContext, useState, useContext } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextType>({
  userName: 'Sehaj',
  setUserName: () => {},
});

export const useUser = () => useContext(UserContext);

export default function RootLayout() {
  const [userName, setUserName] = useState('Sehaj');

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#FFF5F7' },
          }}
        />
      </SafeAreaProvider>
    </UserContext.Provider>
  );
}
