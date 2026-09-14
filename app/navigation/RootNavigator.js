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
// import CurrencyPreferencesScreen from '../screens/CurrencyPreferencesScreen';

const Stack = createNativeStackNavigator();
export default function RootNavigator() {
  return (
    // <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false }}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Onboarding flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Main app */}
      <Stack.Screen name="MainTabs" component={MainTabs} />


      {/* Profile sub-screens */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
      {/* <Stack.Screen name="CurrencyPreferences" component={CurrencyPreferencesScreen} /> */}


      {/* Modals */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="AddSale" component={AddSaleScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}