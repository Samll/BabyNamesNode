import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import InvitePartnerScreen from '../screens/InvitePartner';
import NameSwiperScreen from '../screens/NameSwiper';
import RoundSummaryScreen from '../screens/RoundSummary';
import MatchedNamesScreen from '../screens/MatchedNames';
import { RootStackParamList } from './types';
import { useAuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isBootstrapping } = useAuthContext();

  if (isBootstrapping) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={isAuthenticated ? 'app-stack' : 'auth-stack'}
        initialRouteName={isAuthenticated ? 'InvitePartner' : 'Login'}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="InvitePartner"
              component={InvitePartnerScreen}
              options={{ title: 'Invite Partner' }}
            />
            <Stack.Screen
              name="NameSwiper"
              component={NameSwiperScreen}
              options={{ title: 'Vote on Names' }}
            />
            <Stack.Screen
              name="RoundSummary"
              component={RoundSummaryScreen}
              options={{ title: 'Round Summary' }}
            />
            <Stack.Screen
              name="MatchedNames"
              component={MatchedNamesScreen}
              options={{ title: 'Matched Names' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Create account' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default RootNavigator;
