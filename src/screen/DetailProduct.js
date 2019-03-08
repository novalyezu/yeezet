import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  Alert
} from "react-native";
import {
  View,
  Text,
  Container,
  Content,
  Card,
  CardItem,
  Left,
  Body,
  Button,
  Right,
  Footer,
  Badge
} from "native-base";
import { connect } from "react-redux";
import { getProduct } from "../publics/redux/actions/products";
import { addToCart } from "../publics/redux/actions/carts";

import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const Toast = props => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
    return null;
  }
  return null;
};

class DetailProduct extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    this.product_id = navigation.getParam("product_id");
    this.rat = [];

    this.state = {
      price: 0,
      products: [],
      qty: 0,
      visible: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    await this.props.dispatch(getProduct(this.product_id));
  };

  formatUsd = num => {
    if (num !== undefined) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
  };

  goToCart = () => {
    const auth = this.props.auth;
    if (auth.isAuth) {
      this.props.navigation.navigate("Cart");
    } else {
      Alert.alert("Warning", "Sorry, please login first!", [
        {
          text: "Ok",
          style: "cancel",
          onPress: async () => {
            this.props.navigation.navigate("Account");
          }
        }
      ]);
    }
  };

  addToCart = async () => {
    const auth = this.props.auth;
    if (auth.isAuth) {
      const addNew = await this.props.dispatch(
        addToCart(auth.access_token.token, {
          user_id: auth.data.id,
          product_id: this.props.products.detail.id,
          qty: 1,
          price: this.props.products.detail.price
        })
      );
      if (addNew) {
        this.setState(
          {
            visible: true
          },
          () => {
            this.hideToast();
          }
        );
      }
    } else {
      Alert.alert("Warning", "Sorry, please login first!", [
        {
          text: "Ok",
          style: "cancel",
          onPress: async () => {
            this.props.navigation.navigate("Account");
          }
        }
      ]);
    }
  };

  buyNow = async () => {
    const addNew = await this.props.dispatch(
      addToCart({
        product_id: this.props.products.detail.id,
        qty: 1,
        price: this.props.products.detail.price
      })
    );
    if (addNew) {
      this.props.navigation.navigate("Checkout");
    }
  };

  hideToast = () => {
    this.setState({
      visible: false
    });
  };

  setRating = rating => {
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        this.rat[i] = "md-star";
      } else {
        this.rat[i] = "md-star-outline";
      }
    }
  };

  render() {
    let totalItem = 0;
    return (
      <Container>
        {this.props.products.isLoading ? (
          <View style={styles.activity}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <Content>
            <Toast
              visible={this.state.visible}
              message="Product added to cart!."
            />
            <View style={styles.backImage}>
              <Image
                source={{ uri: this.props.products.detail.image }}
                style={{ height: 400, width: null }}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.6)", "transparent"]}
                style={styles.linearGradient}
              />
              <TouchableOpacity
                style={{ position: "absolute", top: 15, right: 5 }}
                onPress={this.goToCart}
              >
                <Ionicons
                  name="md-cart"
                  size={30}
                  style={{ marginRight: 15 }}
                  color="#fff"
                />
                {totalItem > 0 ? (
                  <View style={{ position: "absolute", top: 0, right: 0 }}>
                    <Badge style={styles.badge} />
                    <Text style={styles.badgeText}>{totalItem}</Text>
                  </View>
                ) : (
                  <View />
                )}
              </TouchableOpacity>
            </View>
            <Card>
              <CardItem bordered>
                <Body>
                  <Text style={styles.title}>
                    {this.props.products.detail.name}
                  </Text>
                  <Text style={styles.price}>
                    ${this.formatUsd(this.props.products.detail.price)}
                  </Text>
                  <Text>
                    {this.setRating(this.props.products.detail.rating)}
                    {this.rat.map((data, index) => (
                      <Ionicons
                        name={data}
                        size={20}
                        key={index}
                        color="orange"
                      />
                    ))}
                  </Text>
                </Body>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Text style={styles.descTitle}>Description :</Text>
                  <Text style={styles.desc}>
                    {this.props.products.detail.description}
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        )}
        {!this.props.products.isLoading ? (
          <Footer style={{ backgroundColor: "#fff" }}>
            <View style={styles.viewBtn}>
              <Button
                bordered
                info
                block
                style={styles.btn}
                onPress={this.buyNow}
              >
                <Text>Buy Now</Text>
              </Button>
              <Button info block style={styles.btn} onPress={this.addToCart}>
                <Text>Add to Cart</Text>
              </Button>
            </View>
          </Footer>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.products,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(DetailProduct);

const styles = StyleSheet.create({
  activity: {
    alignSelf: "center",
    marginTop: Dimensions.get("window").height / 2
  },
  backImage: {},
  image: {
    width: null,
    height: 400
  },
  title: {
    fontSize: 22,
    fontWeight: "bold"
  },
  price: {
    textAlign: "left",
    fontWeight: "bold",
    marginTop: 5,
    color: "green",
    fontSize: 18
  },
  desc: {
    fontSize: 16,
    marginTop: 5
  },
  descTitle: {
    fontSize: 17,
    fontWeight: "bold"
  },
  viewBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginTop: 5
  },
  btn: {
    width: Dimensions.get("window").width / 2 - 10
  },
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 60
  },
  badge: {
    width: 20,
    height: 20,
    position: "absolute",
    top: -5,
    right: 0
  },
  badgeText: {
    position: "absolute",
    top: -6,
    right: 5,
    color: "#fff",
    fontSize: 15
  }
});
