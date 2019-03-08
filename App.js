import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator
} from "react-navigation";
import { Provider } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import store from "./src/publics/redux/store";

import HomeScreen from "./src/screen/Home";
import CartScreen from "./src/screen/Cart";
import CheckoutScreen from "./src/screen/Checkout";
import DetailProductScreen from "./src/screen/DetailProduct";
import AccountScreen from "./src/screen/Account";
import AddAddressScreen from "./src/screen/AddAddress";
import EditAddressScreen from "./src/screen/EditAddress";
import EditProfileScreen from "./src/screen/EditProfile";
import CheckoutAccountScreen from "./src/screen/CheckoutAccount";
import PaymentMethodScreen from "./src/screen/PaymentMethod";
import CourierScreen from "./src/screen/Courier";
import PaymentProcessScreen from "./src/screen/PaymentProcess";
import SearchScreen from "./src/screen/Search";
import RegisterScreen from "./src/screen/Register";

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  DetailProduct: {
    screen: DetailProductScreen,
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: "bold"
      },
      headerTransparent: "true",
      headerTintColor: "#fff"
    })
  },
  Cart: {
    screen: CartScreen,
    navigationOptions: () => ({
      title: "Cart"
    })
  },
  Checkout: {
    screen: CheckoutScreen,
    navigationOptions: () => ({
      title: "Checkout"
    })
  },
  CheckoutAccount: {
    screen: CheckoutAccountScreen,
    navigationOptions: () => ({
      title: "Account"
    })
  },
  PaymentMethod: {
    screen: PaymentMethodScreen,
    navigationOptions: () => ({
      title: "Payment Method"
    })
  },
  Courier: {
    screen: CourierScreen,
    navigationOptions: () => ({
      title: "Courier"
    })
  },
  PaymentProcess: {
    screen: PaymentProcessScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: () => ({
      header: null
    })
  }
});

const AccountStack = createStackNavigator({
  Account: {
    screen: AccountScreen,
    navigationOptions: () => ({
      header: null
    })
  },
  AddAddress: {
    screen: AddAddressScreen,
    navigationOptions: () => ({
      title: "Address"
    })
  },
  EditAddress: {
    screen: EditAddressScreen,
    navigationOptions: () => ({
      title: "Address"
    })
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: () => ({
      title: "Profile"
    })
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: () => ({
      title: "Register"
    })
  }
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

AccountStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

const AppContainer = createAppContainer(
  createBottomTabNavigator(
    {
      Home: {
        screen: HomeStack,
        navigationOptions: {
          title: "Home"
        }
      },
      Account: {
        screen: AccountStack,
        navigationOptions: {
          title: "Account"
        }
      }
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === "Home") {
            iconName = `ios-home`;
          } else if (routeName === "Account") {
            iconName = `md-people`;
          }

          // You can return any component that you like here! We usually use an
          // icon component from react-native-vector-icons
          return <Ionicons name={iconName} size={25} color={tintColor} />;
        }
      }),
      tabBarOptions: {
        activeTintColor: "#729ee5",
        inactiveTintColor: "gray"
      }
    }
  )
);

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
