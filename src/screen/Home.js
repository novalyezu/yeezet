import React, { Component } from "react";
import {
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Animated,
  ScrollView,
  Alert,
  AsyncStorage
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
  Header,
  Item,
  Icon,
  Input,
  Right,
  Grid,
  Col,
  Badge,
  Button
} from "native-base";
import { NavigationEvents } from "react-navigation";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slideshow from "react-native-slideshow";
import { connect } from "react-redux";

import { getProducts, getProduct } from "../publics/redux/actions/products";

import "../data";
import { getProfile, newToken } from "../publics/redux/actions/auth";

class Home extends Component {
  constructor() {
    super();
    this.rat = [];
    this.state = {
      hasMore: false,
      populardeals: populardeal,
      search: "",
      position: 1,
      interval: null,
      dataSource: [
        {
          title: "ALIENWARE 17 R5",
          caption: "Ultimate Mobile Gaming Rig",
          category: "GADGETS",
          screen: "",
          url:
            "http://www.dingit.tv/blog/wp-content/uploads/2016/01/alienware-17-3.jpg"
        },
        {
          title: "KALIBRE ORI 3in1",
          caption: "Multifungsi Ransel Muat 2 Laptop",
          category: "BAGS",
          screen: "",
          url:
            "https://ecs7.tokopedia.net/img/cache/700/product-1/2018/5/21/199196/199196_1664f3de-6d13-4433-b2a2-674d20854929_700_700.jpg"
        },
        {
          title: "GUNDAM UNICORN",
          caption: "MG Full Armor Unicorn Gundam",
          category: "TOYS",
          screen: "",
          url:
            "https://ecs7.tokopedia.net/img/cache/700/product-1/2018/7/28/3185342/3185342_740c77ac-7f25-46c1-80e0-dce09943a511_995_1071.jpg"
        }
      ]
    };

    this.animatedValue = new Animated.Value(0);
    this.refreshScreen = this.refreshScreen.bind(this);
  }

  componentWillMount() {
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position:
            this.state.position === this.state.dataSource.length
              ? 0
              : this.state.position + 1
        });
      }, 3000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  componentDidMount() {
    this.refreshToken()
      .then(res => {
        const auth = this.props.auth;
        AsyncStorage.setItem("token", auth.access_token.token);
        AsyncStorage.setItem("refreshToken", auth.access_token.refreshToken);
        this.getProfile()
          .then(res => {})
          .catch(err => {
            console.log("error :v " + err);
          });
      })
      .catch(err => {
        console.log("error :v RT " + err);
      });
    this.getData();
  }

  refreshToken = async () => {
    const refresh_token = await AsyncStorage.getItem("refreshToken");
    await this.props.dispatch(newToken(refresh_token));
  };

  refreshScreen() {
    this.setState({ isAuth: this.props.auth.isAuth });
    if (!this.state.isAuth) {
      this.getProfile()
        .then(res => {})
        .catch(err => {
          console.log("error :v " + err);
        });
    }
  }

  getProfile = async () => {
    const token = await AsyncStorage.getItem("token");
    await this.props.dispatch(getProfile(token));
  };

  getData = async () => {
    const get = await this.props.dispatch(getProducts());
    if (get) {
      this.setState({
        hasMore: this.props.products.hasMore
      });
    }
  };

  loadMoreData = async () => {
    this.setState({
      hasMore: false
    });
    let url = this.props.products.nextPage;
    const load = await this.props.dispatch(getProducts(url));
    if (load) {
      this.setState({
        hasMore: this.props.products.hasMore
      });
    }
  };

  animateBackgroundColor = () => {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1500
    }).start(() => {
      this.animateBackgroundColor();
    });
  };

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

  goToDetailsProduct = item => () => {
    let product_id = item.id;
    this.props.navigation.navigate("DetailProduct", { product_id });
  };

  searchProduct = () => {
    this.props.navigation.navigate("Search");
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

  renderWeeklyDeals = ({ item }) => (
    <Col style={styles.column}>
      <View style={styles.viewColumn} />
      <CardItem cardBody style={{ alignSelf: "center" }}>
        <Image
          source={{ uri: item.image[0] }}
          style={{ width: 100, height: 100, margin: 10 }}
        />
        <Body style={{ marginTop: 10 }}>
          <Text style={styles.title}>{this.title_truncate(item.name)}</Text>
          <Text style={styles.fake_price}>
            ${this.formatUsd(item.fake_price)}
          </Text>
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

  renderProductList = ({ item }) => (
    <Col style={styles.columnProduct}>
      <TouchableOpacity onPress={this.goToDetailsProduct(item)}>
        <CardItem cardBody style={{ alignSelf: "center" }}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </CardItem>
        <CardItem>
          <Body style={{ marginLeft: -5, marginRight: -5 }}>
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
      </TouchableOpacity>
    </Col>
  );

  render() {
    let totalItem = 0;

    const backgroundColorVar = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["#adadad", "#f9f9f9", "#adadad"]
    });

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
      <Container style={styles.body}>
        <NavigationEvents
          onWillFocus={payload => {
            this.refreshScreen();
          }}
        />
        <Header style={{ backgroundColor: "#fff" }} noLeft>
          <Body>
            <Text style={styles.headerTitle}>Yeezet</Text>
          </Body>
          <Right>
            <TouchableOpacity onPress={this.goToCart}>
              <Ionicons name="md-cart" size={30} style={{ marginRight: 8 }} />
              {totalItem > 0 ? (
                <View style={{ position: "absolute", top: 0, right: 0 }}>
                  <Badge style={styles.badge} />
                  <Text style={styles.badgeText}>{totalItem}</Text>
                </View>
              ) : (
                <View />
              )}
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={styles.search}>
          <Card>
            <Item>
              <TouchableOpacity onPress={this.searchProduct}>
                <View style={styles.searchInput}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Icon
                      name="ios-search"
                      style={{ marginLeft: 10, marginTop: 3 }}
                    />
                    <Text style={{ marginTop: 5, marginLeft: 10 }}>
                      Search...
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Item>
          </Card>
        </View>
        <Content style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent) && this.state.hasMore) {
                this.loadMoreData();
                this.animateBackgroundColor();
              }
            }}
            scrollEventThrottle={16}
          >
            <Slideshow
              dataSource={this.state.dataSource}
              position={this.state.position}
              onPositionChanged={position => this.setState({ position })}
              height={300}
              arrowSize={0}
            />
            <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
              <View
                style={{ width: 10, height: 25, backgroundColor: "#24a55b" }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 5 }}>
                WEEKLY POPULAR DEALS
              </Text>
            </View>
            <View style={styles.onerow}>
              <Grid>
                <FlatList
                  data={this.state.populardeals}
                  renderItem={this.renderWeeklyDeals}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={1}
                />
              </Grid>
            </View>
            <View style={{ flex: 1, flexDirection: "row", margin: 10 }}>
              <View
                style={{ width: 10, height: 25, backgroundColor: "#4389f9" }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 5 }}>
                JUST FOR YOU
              </Text>
            </View>
            <View style={styles.onerow}>
              <Grid>
                <FlatList
                  data={this.props.products.data}
                  renderItem={this.renderProductList}
                  refreshing={this.props.products.isLoading}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  // onEndReached={() => this.loadMoreData()}
                  // onEndReachedThreshold={0.5}
                  // ListFooterComponent={() => {
                  //   return (
                  //     this.state.isLoading && (
                  //       <View style={{ flex: 1, padding: 10 }}>
                  //         <ActivityIndicator size="small" />
                  //       </View>
                  //     )
                  //   );
                  // }}
                />
              </Grid>
              {this.props.products.isLoading ? (
                <Grid>
                  <Col style={styles.columnProduct}>
                    <CardItem cardBody style={{ alignSelf: "center" }}>
                      <Animated.View
                        style={[
                          styles.imageLoading,
                          { backgroundColor: backgroundColorVar }
                        ]}
                      />
                    </CardItem>
                    <CardItem>
                      <Body style={{ marginLeft: -5, marginRight: -5 }}>
                        <Animated.View
                          style={[
                            styles.titleLoading,
                            { backgroundColor: backgroundColorVar }
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.priceLoading,
                            { backgroundColor: backgroundColorVar }
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.ratingLoading,
                            { backgroundColor: backgroundColorVar }
                          ]}
                        />
                      </Body>
                    </CardItem>
                  </Col>
                  <Col style={styles.columnProduct}>
                    <CardItem cardBody style={{ alignSelf: "center" }}>
                      <Animated.View
                        style={[
                          styles.imageLoading,
                          { backgroundColor: backgroundColorVar }
                        ]}
                      />
                    </CardItem>
                    <CardItem>
                      <Body style={{ marginLeft: -5, marginRight: -5 }}>
                        <Animated.View
                          style={[
                            styles.titleLoading,
                            { backgroundColor: backgroundColorVar }
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.priceLoading,
                            { backgroundColor: backgroundColorVar }
                          ]}
                        />
                        <Animated.View
                          style={[
                            styles.ratingLoading,
                            { backgroundColor: backgroundColorVar }
                          ]}
                        />
                      </Body>
                    </CardItem>
                  </Col>
                </Grid>
              ) : null}
            </View>
          </ScrollView>
        </Content>
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

export default connect(mapStateToProps)(Home);

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#efefef"
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginLeft: 8
  },
  searchInput: {
    width: Dimensions.get("window").width - 20,
    height: 35,
    backgroundColor: "#efefef",
    margin: 5,
    borderRadius: 10
  },
  onerow: {
    flex: 1
  },
  image: {
    width: 150,
    height: 150
  },
  title: {
    fontWeight: "bold"
  },
  price: {
    textAlign: "left",
    fontWeight: "bold",
    color: "green",
    marginBottom: 5
  },
  desc: {
    fontSize: 14,
    marginTop: 5
  },
  fake_price: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontSize: 12,
    marginTop: 5
  },
  column: {
    height: 130,
    backgroundColor: "#fff"
  },
  columnProduct: {
    height: 265,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#d0d0d0"
  },
  viewColumn: {
    height: 2,
    width: 350,
    backgroundColor: "#efefef",
    alignSelf: "center"
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
  },
  imageLoading: {
    width: 150,
    height: 130,
    marginTop: 20,
    marginBottom: 10
  },
  titleLoading: {
    width: 168,
    height: 15,
    marginBottom: 5
  },
  priceLoading: {
    width: 50,
    height: 15,
    marginBottom: 5
  },
  ratingLoading: {
    width: 90,
    height: 15,
    marginBottom: 5
  }
});
