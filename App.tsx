import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import { Portal, Provider as PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { LogBox } from "react-native";
import persistStore from "redux-persist/es/persistStore";
import { store } from "./src/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { navigationRef } from "./src/navigation/navActions";
import { MyTheme } from "./src/utility/styleUtils";
import FlashMessage from "react-native-flash-message";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";

LogBox.ignoreAllLogs(true);

const App = () => {
  let persistor = persistStore(store);
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLIC_KEY}
      // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      // merchantIdentifier="merchant.com.{{echo}}" // required for Apple Pay
    >
      <PaperProvider>
        <Portal.Host>
          <SafeAreaProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer
                  theme={MyTheme}
                  onReady={() => {
                    setTimeout(() => {
                      SplashScreen.hide();
                    }, 1000);
                  }}
                  ref={navigationRef}
                >
                  <Navigation />
                </NavigationContainer>
              </PersistGate>
            </Provider>
          </SafeAreaProvider>
        </Portal.Host>
        <FlashMessage floating={true} />
      </PaperProvider>
    </StripeProvider>
  );
};

export default App;
