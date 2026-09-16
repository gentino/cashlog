import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabs from './MainTabs';
import AddSaleScreen from '../screens/AddSaleScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ManageCategoriesScreen from '../screens/ManageCategoriesScreen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../constants/theme';
import DayDetailScreen from '../screens/DayDetailScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'MainTabs' : 'Welcome'}
      screenOptions={{ headerShown: false }}
    >
      {/* Onboarding flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} />

      {/* Main app */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Profile sub-screens */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />

      {/* Modals */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AddSale" component={AddSaleScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});