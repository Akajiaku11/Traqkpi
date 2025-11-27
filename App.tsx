import React, { useEffect, useState } from 'react';
import { StatusBar, PermissionsAndroid, Platform, View, ActivityIndicator } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { AuthProvider } from './src/providers/Auth';
import AppNav from './src/navigation/AppNav';
import KPIDatabase from './src/config/KPIDatabase';

// Enable SQLite debugging (optional)
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const App = () => {
  useEffect(() => {
    requestPermissions();
    initializeApp();
    //initializeDatabase();
  }, []);

  const [isReady, setIsReady] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs storage permission to export data',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const initializeApp = async () => {
    try {
      // Initialize database after app is mounted
      await KPIDatabase.initialize();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsReady(true);
    }
  };

  // const initializeDatabase = async () => {
  //   try {
  //     // Initialize database with sample data if needed
  //     const db = SQLite.openDatabase(
  //       { name: 'KPI.db', location: 'default' },
  //       () => console.log('Database initialized successfully'),
  //       error => console.error('Database initialization error:', error)
  //     );
  //   } catch (error) {
  //     console.error('Failed to initialize database:', error);
  //   }
  // };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2575FC" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <AuthProvider>
         <AppNav />
      </AuthProvider>
    </>
  );
};

export default App;