// app/screens/DashboardScreen.js
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function HowItWorksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { fontSize: 20, color: colors.textPrimary },
});