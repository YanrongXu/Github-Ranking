import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  DeviceEventEmitter,
    ScrollView
} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../action/index';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-toast-message';
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/FavoriteDao';
import {FLAG_STORAGE} from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';
import {onFlushPopularFavorite} from '../action/popular';
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import CheckBox from 'react-native-check-box'
import Ionicons from "react-native-vector-icons/Ionicons";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);


class CustomKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
    this.changeValues = []
    this.isRemoveKey = !!this.params.isRemoveKey
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      keys: []
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
      return {
        keys: CustomKeyPage._keys(nextProps, null, prevState)
      }
    }
    return null
  }
  componentDidMount() {
    this.backPress.componentDidMount()
    if (CustomKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
    this.setState({
      keys: CustomKeyPage._keys(this.props)
    })
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  static _keys(props, original, state) {
    const {flag, isRemoveKey} = props.navigation.state.params
    let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages"
    if (isRemoveKey && original){

    } else {
      return props.language[key]
    }
  }
  onBackPress(e) {
    this.onBack()
    return true
  }
  onSave() {

  }
  renderView() {
    let dataArray = this.state.keys
    if (!dataArray || dataArray.length === 0) return
    let len = dataArray.length
    let views = []
    for (let i = 0, l = len; i < l; i += 2) {
      views.push(
          <View keys={i}>
            <View style={styles.item}>
              {this.renderCheckBox(dataArray[i], i)}
              {i + 1 < len && this.renderCheckBox(dataArray[i+1], i+1)}
            </View>
            <View style={styles.line}/>
          </View>
      )
    }
    return views
  }
  onClick(data, index) {

  }
  onBack() {
    NavigationUtil.goBack(this.props.navigation)
  }
  _checkImage(checked) {
    const {theme} = this.params
    return <Ionicons
      name={checked ? 'ios-checkbox' : 'md-square-outline'}
      size={20}
      style={{
        color: THEME_COLOR
      }}
    />
  }
  renderCheckBox(data, index) {
    return <CheckBox
      style={{flex: 1, padding: 10}}
      onClick = {() => this.onClick(data, index)}
      isChecked={data.isChecked}
      leftText={data.name}
      checkedImage={this._checkImage(true)}
      unCheckedImage={this._checkImage(false)}
    />
  }
  render() {
    let title = this.isRemoveKey ? 'Remove Tag' : 'Customize Tag'
    title = this.params.flag === FLAG_LANGUAGE.flag_language ? 'Customize Language' : title
    let rightButtonTitle = this.isRemoveKey ? 'Remove' : 'Save'
    let navigationBar =
      <NavigationBar
        title={title}
        leftButton={ViewUtil.getLeftBackButton(()=> this.onBack())}
        style={{backgroundColor: THEME_COLOR}}
        rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
      />
    return <View style={styles.container}>
      {navigationBar}
      <ScrollView>
        {this.renderView()}
      </ScrollView>
    </View>
  }
}

const mapPopularStateToProps = state =>({
  language: state.language,
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage)



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row'
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  }
});
