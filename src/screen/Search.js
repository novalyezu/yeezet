import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import {
  Container,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Input,
  Right,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Col,
  Grid
} from "native-base";

import axios from "axios";
import { server } from "../utils/server";
import Ionicons from "react-native-vector-icons/Ionicons";

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      products: [],
      isLoading: false,
      hasMore: false
    };

    this.rat = [];
    this.offset = 1;
  }

  title_truncate = str => {
    if (str !== undefined && str.length > 35) {
      return str.substring(0, 35) + "...";
    } else {
      return str;
    }
  };

  desc_truncate = str => {
    if (str.length > 28) {
      return str.substring(0, 28) + "...";
    } else {
      return str;
    }
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

  searchInput = text => {
    this.setState({
      search: text
    });
  };

  search = () => {
    axios({
      method: "post",
      url: `${server.url}/api/v1/products/search`,
      data: {
        keyword: this.state.search,
        offset: this.offset
      }
    })
      .then(res => {
        this.setState({
          products: res.data.data,
          hasMore: true
        });
      })
      .catch(err => {
        console.log("error :v " + err);
      });
  };

  loadMoreData = () => {
    this.setState({
      isLoading: true,
      hasMore: false
    });

    axios({
      method: "post",
      url: `${server.url}/api/v1/products/search`,
      data: {
        keyword: this.state.search,
        offset: this.offset + 1
      }
    })
      .then(res => {
        setTimeout(() => {
          this.setState({
            products: [...this.state.products, ...res.data.data],
            isLoading: false
          });
        }, 1000);
        if (res.data.page !== res.data.lastPage) {
          this.setState({
            hasMore: true
          });
        }
      })
      .catch(err => {
        console.log("error :v " + err);
        this.setState({
          isLoading: false
        });
      });
  };

  formatUsd = num => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  goToDetailsProduct = item => () => {
    let product_id = item.id;
    this.props.navigation.navigate("DetailProduct", { product_id });
  };

  renderProductList = ({ item, index }) => (
    <Col style={styles.column}>
      <View style={styles.viewColumn} />
      <CardItem
        cardBody
        button
        style={{ alignSelf: "center" }}
        onPress={this.goToDetailsProduct(item)}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: 100, height: 100, margin: 10 }}
        />
        <Body style={{ marginTop: 10 }}>
          <Text style={styles.title}>{this.title_truncate(item.name)}</Text>
          <Text style={styles.price}>${this.formatUsd(item.price)}</Text>
          <Text>
            {this.setRating(item.rating)}
            {this.rat.map((data, index) => (
              <Ionicons name={data} size={20} key={index} color="orange" />
            ))}
          </Text>
        </Body>
      </CardItem>
    </Col>
  );

  render() {
    const isCloseToBottom = ({
      layoutMeasurement,
      contentOffset,
      contentSize
    }) => {
      const paddingToBottom = 20;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    };

    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Icon name="arrow-back" color="black" />
            </TouchableOpacity>
          </Left>
          <Body style={{ marginLeft: -30 }}>
            <Input
              placeholder="Search here..."
              onChangeText={text => this.searchInput(text)}
              value={this.state.search}
              style={{ width: 300 }}
              autoFocus
            />
          </Body>
          <Right>
            <TouchableOpacity onPress={this.search}>
              <Icon name="md-search" color="black" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Content style={styles.body} contentContainerStyle={{ flex: 1 }}>
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent) && this.state.hasMore) {
                this.loadMoreData();
              }
            }}
            scrollEventThrottle={16}
          >
            <View style={styles.onerow}>
              <Grid>
                <FlatList
                  data={this.state.products}
                  renderItem={this.renderProductList}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={1}
                  ListFooterComponent={() => {
                    return (
                      this.state.isLoading && (
                        <View style={{ flex: 1, padding: 10 }}>
                          <ActivityIndicator size="small" />
                        </View>
                      )
                    );
                  }}
                />
              </Grid>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1
  },
  body: {
    backgroundColor: "#efefef",
    flex: 1
  },
  cardview: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: -1
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
  onerow: {
    flex: 1,
    marginTop: 10
  },
  column: {
    height: 130,
    backgroundColor: "#fff"
  },
  viewColumn: {
    height: 2,
    width: 350,
    backgroundColor: "#efefef",
    alignSelf: "center"
  }
});
