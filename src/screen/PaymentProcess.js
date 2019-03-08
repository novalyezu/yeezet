import React, { Component } from "react";
import {
  View,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  AsyncStorage
} from "react-native";
import {
  Container,
  Text,
  CardItem,
  Left,
  Body,
  Right,
  Button
} from "native-base";

import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import { getCarts } from "../publics/redux/actions/carts";
import { donePay } from "../publics/redux/actions/carts";

class PaymentProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addDress: this.props.address.data,
      addressData: [],
      addOp: addressOption,
      mainAdd: 0,
      Carts: []
    };
  }

  componentWillMount() {
    this.getMainAdd()
      .then(res => {
        this.getDataFull();
        this.setState({
          addressData: this.props.address.data
        });
      })
      .catch(err => {});
  }

  componentDidMount() {
    this.getCart();
  }

  getMainAdd = async () => {
    let main = await AsyncStorage.getItem("mainAdd");
    this.setState({
      mainAdd: main
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

  getDataFull = () => {
    this.setState(prevState => ({
      addDress: prevState.addDress.map(add => {
        this.state.addOp.map(addop => {
          if (add.province == addop.id) {
            Object.assign(add, {
              province: addop.province
            });
            addop.district.map(dist => {
              if (add.district == dist.id) {
                Object.assign(add, {
                  district: dist.district_name
                });
                dist.sub_district.map(subdist => {
                  if (add.subDistrict == subdist.id) {
                    Object.assign(add, {
                      subDistrict: subdist.sub_district_name
                    });
                  }
                });
              }
            });
          } else {
            add;
          }
        });
      })
    }));
  };

  formatUsd = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  handleDonePay = () => {
    this.doneShop()
      .then(res => {
        this.props.navigation.navigate("Home");
      })
      .catch(err => {});
  };

  doneShop = async () => {
    const user_id = this.props.auth.data.id;
    await this.props.dispatch(donePay(user_id));
  };

  renderShoppingList = ({ item }) => (
    <View key={item.id}>
      <CardItem style={styles.shopping}>
        <Body>
          <Text>{item.products.name}</Text>
          <Text style={{ color: "gray", fontSize: 14, marginTop: 5 }}>
            Qty: {item.qty}
          </Text>
        </Body>
        <Right>
          <Image
            source={{
              uri: item.products.image
            }}
            style={{ width: 80, height: 80 }}
          />
        </Right>
      </CardItem>
    </View>
  );

  render() {
    const totalPrice = this.props.navigation.getParam("totalPrice");
    const payType = this.props.navigation.getParam("payType");
    return (
      <Container style={{ backgroundColor: "#efefef" }}>
        <ScrollView>
          <CardItem>
            <Body>
              <Ionicons name="ios-information-circle" size={20} />
            </Body>
            <Text style={{ marginLeft: -150 }}>Always be wary of scams.</Text>
            <Right />
          </CardItem>
          <View>
            <CardItem style={{ backgroundColor: "#efefef" }}>
              <Body>
                <Text style={{ fontSize: 14, color: "gray" }}>PAYMENT ID</Text>
              </Body>
              <Right>
                <Text style={{ fontSize: 14 }}>YZ131427</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 12, color: "gray" }}>
                  AMOUNT OF THE BILL
                </Text>
                <Text style={{ color: "green", marginTop: 5 }}>
                  ${this.formatUsd(totalPrice)}
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ marginTop: 10 }}>
              <Body>
                <Text style={{ fontSize: 12, color: "gray" }}>
                  PAYMENT INSTRUCTIONS
                </Text>
                <Image source={payType.image} style={styles.image} />
                <Text style={{ alignSelf: "center", fontSize: 14 }}>
                  {payType.title} Number Virtual Account
                </Text>
                <Text style={styles.number}>1112000144</Text>
                <Text style={{ alignSelf: "center" }}>a/n</Text>
                <Text style={{ alignSelf: "center", fontWeight: "bold" }}>
                  NOVAL VATRIA YEZU
                </Text>
              </Body>
            </CardItem>
            <CardItem style={{ marginTop: 10 }}>
              <Body>
                <Text style={{ fontSize: 12, color: "gray" }}>
                  ADDRESS DELIVERY
                </Text>
                {this.state.addressData.map((data, key) => {
                  if (data.id == this.state.mainAdd) {
                    return (
                      <View key={data.id}>
                        <Text style={{ marginTop: 5, fontWeight: "bold" }}>
                          {data.name}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          {data.full_address}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          Kecamatan {data.subDistrict}, Kabupaten{" "}
                          {data.district}
                        </Text>
                        <Text style={{ fontSize: 14 }}>
                          {data.province}, {data.postal_code}
                        </Text>
                        <Text style={{ fontSize: 14 }}>{data.phone}</Text>
                      </View>
                    );
                  }
                })}
              </Body>
            </CardItem>
            <CardItem style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 12, color: "gray" }}>SHOPPING LIST</Text>
            </CardItem>
            <View style={{ marginTop: -10 }}>
              <FlatList
                data={this.props.carts.carts}
                renderItem={this.renderShoppingList}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <Button
              success
              block
              onPress={this.handleDonePay}
              style={{
                margin: 5
              }}
            >
              <Text>DONE</Text>
            </Button>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    carts: state.carts,
    auth: state.auth,
    address: state.address
  };
};

export default connect(mapStateToProps)(PaymentProcess);

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 37,
    alignSelf: "center",
    marginTop: 5
  },
  number: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 18
  },
  shopping: {
    borderBottomWidth: 1,
    borderBottomColor: "#efefef"
  }
});
