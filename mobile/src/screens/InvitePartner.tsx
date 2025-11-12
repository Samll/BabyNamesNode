import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { authApi } from '../services/api';

const InvitePartnerScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'InvitePartner'>
> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = async () => {
    try {
      setIsSubmitting(true);
      const { code } = await authApi.invitePartner({ email });
      setInviteCode(code);
      Alert.alert('Invitation sent', 'Share the invite code with your partner.');
    } catch (error) {
      Alert.alert('Invite failed', 'Unable to send invitation right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite your partner</Text>
      <Text style={styles.subtitle}>
        Add your partner to sync votes and discover supermatches together.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Partner email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Pressable
        style={[styles.button, (!email || isSubmitting) && styles.disabled]}
        onPress={handleInvite}
        disabled={!email || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send invite</Text>
        )}
      </Pressable>
      {inviteCode ? (
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Invite code</Text>
          <Text selectable style={styles.code}>
            {inviteCode}
          </Text>
        </View>
      ) : null}
      <Pressable
        style={[styles.secondaryButton]}
        onPress={() => navigation.navigate('NameSwiper')}
      >
        <Text style={styles.secondaryText}>Start voting</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827'
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24
  },
  input: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: '#7c3aed',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  disabled: {
    opacity: 0.6
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16
  },
  codeBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#eef2ff'
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338ca'
  },
  code: {
    fontSize: 20,
    fontWeight: '700',
    color: '#312e81',
    marginTop: 8
  },
  secondaryButton: {
    marginTop: 32,
    alignItems: 'center'
  },
  secondaryText: {
    color: '#2563eb',
    fontWeight: '600'
  }
});

export default InvitePartnerScreen;
