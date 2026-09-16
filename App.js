import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import { TransactionsProvider } from './app/context/TransactionsContext';
import { BusinessProvider } from './app/context/BusinessContext';
import { CategoriesProvider } from './app/context/CategoriesContext';
import { AuthProvider } from './app/context/AuthContext';
import { NetworkProvider } from './app/context/NetworkContext';
import OfflineBanner from './app/components/OfflineBanner/OfflineBanner';
import PendingSyncBanner from './app/components/PendingSyncBanner/PendingSyncBanner';


export default function App() {
  return (
  <NetworkProvider>
    <AuthProvider>
    <BusinessProvider>
      <CategoriesProvider>
        <TransactionsProvider>
          <OfflineBanner />
           <PendingSyncBanner />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </TransactionsProvider>
      </CategoriesProvider>
    </BusinessProvider>
    </AuthProvider>
  </NetworkProvider>

  );
}