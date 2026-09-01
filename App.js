import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import { TransactionsProvider } from './app/context/TransactionsContext';

export default function App() {
  return (
    <TransactionsProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </TransactionsProvider>
  );
}