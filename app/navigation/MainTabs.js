import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: 'home',
  History: 'calendar',
  Reports: 'bar-chart',
  Profile: 'person',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}