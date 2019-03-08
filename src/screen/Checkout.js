import React, { Component } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
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
  Header,
  Right,
  Left,
  Grid,
  Col
} from "native-base";

import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import { getCarts } from "../publics/redux/actions/carts";
import { getAddress } from "../publics/redux/actions/address";

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Carts: [],
      address: this.props.address.data,
      mainAdd: 0,
      selectedAdd: []
    };
  }

  formatUsd = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  componentDidMount() {
    // if (this.state.mainAdd !== 0) {
    //   let selected = [];

    //   this.props.address.data.map(data => {
    //     if (data.id === this.mainAdd) {
    //       selected = {
    //         label: data.label,
    //         fullAddress: data.full_address
    //       };
    //     }
    //   });
    //   this.setState({
    //     selectedAdd: selected
    //   });
    // }
    this.getAddress()
      .then(res => {
        this.getMainAdd();
      })
      .catch(err => {});
    this.getCart();
  }

  getAddress = async () => {
    const user_id = this.props.auth.data.id;
    const token = this.props.auth.access_token.token;
    await this.props.dispatch(getAddress(user_id, token));
  };

  getMainAdd = async () => {
    let main = await AsyncStorage.getItem("mainAdd");
    let selected = [];
    this.props.address.data.map(data => {
      if (data.id == main) {
        selected = {
          label: data.label,
          fullAddress: data.full_address
        };
      }
    });
    this.setState({
      mainAdd: main,
      selectedAdd: selected
    });
  };

  getCart = async () => {
    this.setState({
      isLoading: true
    });
    const token = await AsyncStorage.getItem("token");
    const auth = this.props.auth;
    await this.props.dispatch(getCarts(token, auth.data.id));
  };

  refresh = () => {
    this.getAddress()
      .then(res => {
        this.getMainAdd();
      })
      .catch(err => {});
  };

  payNow = (payType, totalPrice, crir, newParam) => () => {
    if (
      this.state.mainAdd === 0 ||
      payType === undefined ||
      crir === undefined
    ) {
      Alert.alert(
        "Warning!",
        "Please select an address, payment method and courier.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      this.props.navigation.navigate("PaymentProcess", {
        payType: payType,
        totalPrice: totalPrice
      });
    }
  };

  renderListItem = ({ item }) => (
    <Col style={{ height: 130, backgroundColor: "#fff" }}>
      <View style={styles.listItem} />

      <CardItem cardBody style={{ alignSelf: "center" }}>
        <Image
          source={{ uri: item.products.image }}
          style={{ width: 100, height: 100, margin: 10 }}
        />
        <Body style={{ marginTop: 10 }}>
          <Text style={styles.title}>{item.products.name}</Text>
          <Text style={styles.price}>${this.formatUsd(item.price)}</Text>
          <View style={styles.dorongQty}>
            <Text style={{ fontSize: 14 }}>Qty: {item.qty}</Text>
          </View>
        </Body>
      </CardItem>
    </Col>
  );

  render() {
    const newParam = this.props.navigation.getParam("data");
    const payType = this.props.navigation.getParam("tipe");
    const Pymt = this.props.navigation.getParam("pymt");
    const Crir = this.props.navigation.getParam("crir");
    let totalPriceProduct = this.props.carts.totalPrice;
    let totalPrice = totalPriceProduct;
    if (Crir !== undefined) {
      totalPrice = totalPrice + Crir.price;
    }
    return (
      <Container style={styles.body}>
        <Content>
          <View style={styles.cardview}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("CheckoutAccount", {
                  onGoBack: () => this.refresh()
                });
              }}
            >
              <CardItem>
                <Body>
                  <Text style={styles.titleCard}>Address Delivery</Text>
                  {newParam !== undefined ? (
                    <Text style={{ marginTop: 5 }}>
                      {newParam.label} - {newParam.fullAddress}
                    </Text>
                  ) : (
                    <Text style={{ marginTop: 5 }}>
                      {this.state.selectedAdd.label} -{" "}
                      {this.state.selectedAdd.fullAddress}
                    </Text>
                  )}
                </Body>
                <Right>
                  <Ionicons name="md-arrow-dropright" size={20} />
                </Right>
              </CardItem>
            </TouchableOpacity>
          </View>
          <View style={styles.cardview}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("PaymentMethod");
              }}
            >
              <CardItem>
                <Body>
                  <Text style={styles.titleCard}>Payment Method</Text>
                  <Text style={{ marginTop: 5 }}>
                    Choose your payment method.
                  </Text>
                  {payType !== undefined ? (
                    <View
                      style={{ flex: 1, flexDirection: "row", marginTop: 15 }}
                    >
                      <Text style={{ fontWeight: "bold", marginRight: 10 }}>
                        {payType}
                      </Text>
                      <Image
                        source={Pymt.image}
                        style={{ width: 70, height: 22 }}
                      />
                    </View>
                  ) : (
                    <View />
                  )}
                </Body>
                <Right>
                  <Ionicons name="md-arrow-dropright" size={20} />
                </Right>
              </CardItem>
            </TouchableOpacity>
          </View>
          <View style={styles.cardview}>
            <CardItem>
              <Text style={styles.titleCard}>List Item</Text>
            </CardItem>
            <Grid>
              <FlatList
                data={this.props.carts.carts}
                renderItem={this.renderListItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
              />
            </Grid>
          </View>
          <View style={styles.cardview}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Courier");
              }}
            >
              <CardItem>
                <Body>
                  <Text style={styles.titleCard}>Courier</Text>
                  <Text style={{ marginTop: 5 }}>
                    Choose your best courier.
                  </Text>
                  {Crir !== undefined ? (
                    <View
                      style={{ flex: 1, flexDirection: "row", marginTop: 15 }}
                    >
                      <Image
                        source={Crir.image}
                        style={{ width: 70, height: 22 }}
                      />
                      <Text style={{ color: "green", marginLeft: 10 }}>
                        : ${this.formatUsd(Crir.price)}
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                </Body>
                <Right>
                  <Ionicons name="md-arrow-dropright" size={20} />
                </Right>
              </CardItem>
            </TouchableOpacity>
          </View>
          <View style={[styles.cardview, { marginBottom: 10 }]}>
            <CardItem>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <View>
                  <Text style={styles.titleCard}>Detail Cost</Text>
                </View>
                <View style={styles.detailCost}>
                  <Text>Total Price of Product</Text>
                  <Text style={styles.price}>
                    ${this.formatUsd(totalPriceProduct)}
                  </Text>
                </View>
                <View style={styles.dorongCourier}>
                  <Text>Courier Cost</Text>
                  {Crir !== undefined ? (
                    <Text style={styles.price}>
                      ${this.formatUsd(Crir.price)}
                    </Text>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </CardItem>
          </View>
        </Content>
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
                style={styles.btn}
                onPress={this.payNow(Pymt, totalPrice, Crir, newParam)}
              >
                <Text style={styles.textBtn}>PAY</Text>
              </Button>
            </View>
          </View>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    carts: state.carts,
    address: state.address,
    auth: state.auth
  };
};

export default connect(mapStateToProps)(Checkout);

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
    marginTop: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },
  price: {
    fontWeight: "bold",
    marginTop: 5,
    color: "green"
  },
  btnqty: {
    padding: 10,
    marginRight: 15
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
    width: Dimensions.get("window").width - 10
  },
  textBtn: {
    color: "#fff"
  },
  titleCard: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333333"
  },
  listItem: {
    height: 2,
    width: 350,
    backgroundColor: "#efefef",
    alignSelf: "center"
  },
  dorongQty: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10
  },
  detailCost: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  dorongCourier: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
