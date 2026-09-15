import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import { TransactionsProvider } from './app/context/TransactionsContext';
import { BusinessProvider } from './app/context/BusinessContext';
import { CategoriesProvider } from './app/context/CategoriesContext';

export default function App() {
  return (
    <BusinessProvider>
      <CategoriesProvider>
        <TransactionsProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </TransactionsProvider>
      </CategoriesProvider>
    </BusinessProvider>
  );
}