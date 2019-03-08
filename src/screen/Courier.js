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

export default class Courier extends Component {
  constructor() {
    super();
    this.state = {
      courier: [
        {
          id: 1,
          title: "J&T",
          price: 15,
          image: require("../image/jnt.png")
        },
        {
          id: 2,
          title: "JNE",
          price: 14,
          image: require("../image/jne.png")
        },
        {
          id: 3,
          title: "Grab",
          price: 15,
          image: require("../image/grab.png")
        },
        {
          id: 4,
          title: "GO-SEND",
          price: 13,
          image: require("../image/gosend.png")
        }
      ]
    };
  }

  setCourier = data => () => {
    this.props.navigation.navigate("Checkout", { crir: data });
  };

  render() {
    return (
      <Container style={styles.body}>
        <Content>
          <View style={styles.cardview}>
            <Text style={styles.title}>Courier</Text>
            <Text style={{ fontSize: 12 }}>Choose your best courier.</Text>
            <List>
              {this.state.courier.map(data => {
                return (
                  <ListItem
                    avatar
                    style={{ marginTop: 5, marginBottom: 5 }}
                    button
                    onPress={this.setCourier(data)}
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
                      <Text note style={{ color: "green" }}>
                        ${data.price}
                      </Text>
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
