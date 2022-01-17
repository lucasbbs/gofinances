import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { AuthProvider, useAuth } from '../hooks/auth';

const Routes = () => {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user.id ? <AppRoutes /> : <AuthRoutes />}
      {/* <AppRoutes></AppRoutes> */}
    </NavigationContainer>
  );
};

export default Routes;
