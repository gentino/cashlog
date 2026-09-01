import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import SignInScreen from '../screens/SignInScreen';
import MainTabs from './MainTabs';
import AddSaleScreen from '../screens/AddSaleScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
      {/* Onboarding flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />

      {/* Main app */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Modals */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AddSale" component={AddSaleScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}