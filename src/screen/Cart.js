import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  TextInput,
  AsyncStorage
} from "react-native";
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Thumbnail,
  Button,
  Footer,
  Header
} from "native-base";

import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import {
  getCarts,
  handleAdd,
  handleMin,
  deleteItem
} from "../publics/redux/actions/carts";

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    this.getCart().then(res => {
      this.setState({
        isLoading: false
      });
    });
  }

  getCart = async () => {
    this.setState({
      isLoading: true
    });
    const token = await AsyncStorage.getItem("token");
    const auth = this.props.auth;
    await this.props.dispatch(getCarts(token, auth.data.id));
  };

  deleteItem = (name, id) => () => {
    Alert.alert(
      "Delete product",
      "Are you sure want to delete " + name + " ?",
      [
        { text: "No" },
        {
          text: "Yes",
          style: "cancel",
          onPress: async () => {
            await this.props.dispatch(deleteItem(id));
            // const dlt =
            // if (dlt) {
            //   this.getCart().then(res => {
            //     this.setState({
            //       isLoading: false
            //     });
            //   });
            // }
          }
        }
      ]
    );
  };

  formatUsd = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  handleMin = (item, index) => () => {
    if (item.qty === 0) {
      this.deleteItem(item.products.name, item.id)();
    } else {
      let body = {
        qty: item.qty - 1,
        price: item.products.price * (item.qty - 1)
      };
      this.props.dispatch(handleMin(item.id, body));
    }
  };

  handleAdd = (item, index) => () => {
    let body = {
      qty: item.qty + 1,
      price: item.products.price * (item.qty + 1)
    };
    this.props.dispatch(handleAdd(item.id, body));
  };

  handleChange = (item, text) => {
    if (text !== "") {
      let body = {
        qty: parseInt(text),
        price: item.products.price * parseInt(text)
      };
      this.props.dispatch(handleAdd(item.id, body));
    }
  };

  goToDetailsProduct = item => () => {
    let product_id = item.products.id;
    this.props.navigation.navigate("DetailProduct", { product_id });
  };

  renderProductList = ({ item, index }) => (
    <Card style={styles.cardview}>
      <CardItem button onPress={this.goToDetailsProduct(item)}>
        <Body>
          <Text style={styles.title}>{item.products.name}</Text>
          <Text style={styles.price}>
            ${this.formatUsd(item.products.price)}
          </Text>
        </Body>
        <Thumbnail source={{ uri: item.products.image }} />
      </CardItem>
      <CardItem>
        <Button
          light
          style={styles.btnqty}
          onPress={this.handleMin(item, index)}
        >
          <Ionicons name="ios-remove" size={25} />
        </Button>
        <TextInput
          value={item.qty.toString()}
          style={{
            borderWidth: 1,
            height: 30,
            paddingTop: 0,
            paddingBottom: 0,
            width: 50,
            marginLeft: -10,
            marginRight: -10,
            borderColor: "gray"
          }}
          keyboardType="numeric"
          onChangeText={text => {
            this.handleChange(item, text);
          }}
        />
        <Button
          light
          style={[styles.btnqty, { marginLeft: 15 }]}
          onPress={this.handleAdd(item, index)}
        >
          <Ionicons name="ios-add" size={25} />
        </Button>
        <Text style={styles.price}>
          Subtotal: ${this.formatUsd(item.price)}
        </Text>
        <View style={styles.btntrash}>
          <TouchableOpacity
            onPress={this.deleteItem(item.products.name, item.id)}
          >
            <Ionicons name="ios-trash" size={30} />
          </TouchableOpacity>
        </View>
      </CardItem>
    </Card>
  );

  render() {
    let totalItem = this.props.carts.carts.length;
    let totalPrice = this.props.carts.totalPrice;
    return (
      <Container style={styles.body}>
        <Content>
          {this.state.isLoading ? (
            <ActivityIndicator
              style={{
                alignSelf: "center",
                marginTop: Dimensions.get("window").height / 2 - 50
              }}
              size="large"
            />
          ) : totalItem > 0 ? (
            <View>
              <Card style={[styles.cardview, { marginTop: 10 }]}>
                <CardItem>
                  <Text>Total Item : {totalItem}</Text>
                </CardItem>
              </Card>
              <FlatList
                data={this.props.carts.carts}
                refreshing={this.props.carts.isLoading}
                renderItem={this.renderProductList}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          ) : (
            <View>
              <Image
                source={require("../image/no_cart.png")}
                style={{ width: null, height: 230 }}
              />
              <Text style={styles.noProduct}>
                There is no product on your cart!
              </Text>
              <Text style={{ alignSelf: "center" }}>
                Lets shopping at Yeezet, and feel the ease.
              </Text>
            </View>
          )}
        </Content>
        {this.state.isLoading ? (
          <View />
        ) : totalItem > 0 ? (
          <Footer style={{ backgroundColor: "#fff", height: 80 }}>
            <View style={styles.viewBtn}>
              <Text
                style={[
                  styles.price,
                  { alignSelf: "center", marginTop: -1, marginBottom: 5 }
                ]}
              >
                Total: ${this.formatUsd(totalPrice)}
              </Text>

              <View style={styles.bottom}>
                <Button
                  info
                  block
                  bordered
                  style={styles.btn}
                  onPress={() => {
                    this.props.navigation.navigate("Home");
                  }}
                >
                  <Text style={{ color: "#5b9aff" }}>SHOP MORE</Text>
                </Button>
                {totalItem > 0 ? (
                  <Button
                    info
                    block
                    style={styles.btn}
                    onPress={() => {
                      this.props.navigation.navigate("Checkout");
                    }}
                  >
                    <Text style={styles.textBtn}>CHECKOUT</Text>
                  </Button>
                ) : (
                  <Button
                    info
                    block
                    style={styles.btn}
                    onPress={() => {
                      Alert.alert("Sorry", "Your cart is empty.", [
                        { text: "OK" }
                      ]);
                    }}
                  >
                    <Text style={styles.textBtn}>CHECKOUT</Text>
                  </Button>
                )}
              </View>
            </View>
          </Footer>
        ) : null}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    carts: state.carts,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Cart);

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#efefef"
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center"
  },
  cardview: {
    marginLeft: 15,
    marginRight: 15
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  },
  price: {
    fontWeight: "bold",
    marginTop: 5,
    color: "green"
  },
  btnqty: {
    padding: 10,
    height: 30,
    marginRight: 15,
    backgroundColor: "#d8d8d8"
  },
  btntrash: {
    flex: 1,
    alignItems: "flex-end"
  },
  viewBtn: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 5
  },
  btn: {
    width: Dimensions.get("window").width / 2 - 10
  },
  textBtn: {
    color: "#fff"
  },
  noProduct: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold"
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
