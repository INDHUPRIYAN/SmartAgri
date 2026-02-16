import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>🌱 Welcome to Smart Agri</Text>
        <Text style={styles.subtitle}>Helping farmers with smart solutions</Text>

        {/* Navigation Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/auth/signin')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Stack manages the navigation between screens */}
        <Stack />

        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#276749',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2F855A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
