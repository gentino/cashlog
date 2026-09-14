import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import { TransactionsProvider } from './app/context/TransactionsContext';
import { BusinessProvider } from './app/context/BusinessContext';

export default function App() {
  return (
    <BusinessProvider>
      <TransactionsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </TransactionsProvider>
    </BusinessProvider>
  );
}