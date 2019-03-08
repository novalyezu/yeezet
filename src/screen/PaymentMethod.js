import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Container,
  Header,
  Content,
  Accordion,
  CardItem,
  Body,
  ListItem,
  List,
  Right,
  Left,
  Text,
  Thumbnail
} from "native-base";

import "../data";

export default class PaymentMethod extends Component {
  constructor() {
    super();
    this.state = {
      vacc: paymentType[0].vacc,

      gerai: paymentType[0].gerai
    };
  }

  setPayment = (tipe, data) => () => {
    this.props.navigation.navigate("Checkout", { pymt: data, tipe: tipe });
  };

  render() {
    return (
      <Container style={styles.body}>
        <Content>
          <View style={styles.cardview}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: "#333333"
              }}
            >
              Virtual Account
            </Text>
            <Text style={{ fontSize: 12 }}>
              So fast, don't need unique code.
            </Text>
            <List>
              {this.state.vacc.map(data => {
                return (
                  <ListItem
                    avatar
                    style={{ marginTop: 5, marginBottom: 5 }}
                    button
                    onPress={this.setPayment("Virtual Account", data)}
                    key={data.id}
                  >
                    <Left>
                      <Image
                        source={data.image}
                        style={{ width: 70, height: 22 }}
                      />
                    </Left>
                    <Body>
                      <Text>{data.title}</Text>
                    </Body>
                    <Right>
                      <Ionicons name="md-arrow-dropright" size={20} />
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </View>
          <View style={styles.cardview}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: "#333333"
              }}
            >
              Bank Transfer
            </Text>
            <Text style={{ fontSize: 12 }}>
              Transactions with unique code dan verification.
            </Text>
            <List>
              {this.state.vacc.map(data => {
                return (
                  <ListItem
                    avatar
                    style={{ marginTop: 5, marginBottom: 5 }}
                    button
                    onPress={this.setPayment("Bank Transfer", data)}
                    key={data.id}
                  >
                    <Left>
                      <Image
                        source={data.image}
                        style={{ width: 70, height: 22 }}
                      />
                    </Left>
                    <Body>
                      <Text>{data.title}</Text>
                    </Body>
                    <Right>
                      <Ionicons name="md-arrow-dropright" size={20} />
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </View>
          <View style={[styles.cardview, { marginBottom: 10 }]}>
            <Text style={styles.title}>Branch</Text>
            <Text style={{ fontSize: 12 }}>
              Complete your transactions at your nearest branch.
            </Text>
            <List>
              {this.state.gerai.map(data => {
                return (
                  <ListItem
                    avatar
                    style={{ marginTop: 5, marginBottom: 5 }}
                    button
                    onPress={this.setPayment("Branch", data)}
                    key={data.id}
                  >
                    <Left>
                      <Image
                        source={data.image}
                        style={{ width: 70, height: 22 }}
                      />
                    </Left>
                    <Body>
                      <Text>{data.title}</Text>
                    </Body>
                    <Right>
                      <Ionicons name="md-arrow-dropright" size={20} />
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#efefef"
  },
  cardview: {
    marginTop: 10,
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingLeft: 10
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333333"
  }
});
