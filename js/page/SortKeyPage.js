import React, {Component} from 'react';
import {
  View,
  Alert,
  StyleSheet,
    TouchableHighlight,
    Text,
} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';
import {connect} from 'react-redux';
import actions from '../action/index';
import NavigationBar from '../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import CheckBox from 'react-native-check-box'
import Ionicons from "react-native-vector-icons/Ionicons";
import ArrayUtil from "../util/ArrayUtil";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SortableListView from 'react-native-sortable-listview-newer'
const THEME_COLOR = '#678';



class SortKeyPage extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})
    this.languageDao = new LanguageDao(this.params.flag)
    this.state = {
      checkedArray: SortKeyPage._keys(this.props)
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const checkedArray = SortKeyPage._keys(nextProps, null, prevState)
    if (prevState.keys !== checkedArray) {
      return {
        keys: checkedArray,
      }
    }
    return null;
  }
  componentDidMount() {
    this.backPress.componentDidMount()
    if (SortKeyPage._keys(this.props).length === 0) {
      let {onLoadLanguage} = this.props
      onLoadLanguage(this.params.flag)
    }
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
  }

  static _keys(props, state) {
    if (state && state.checkedArray && state.checkedArray.length) {
      return state.checkedArray
    }
    const flag = SortKeyPage._flag(props)
    let dataArray = props.language[flag] || []
    let keys = []
    for (let i = 0, j = dataArray.length; i < j; i++) {
      let data = dataArray[i]
      if (data.checked) keys.push(data)
    }
    return keys
  }

  static _flag(props) {
    const {flag} = props.navigation.state.params
    return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages'
  }

  onBackPress(e) {
    this.onBack()
    return true
  }

  onSave(hasChecked) {
    if (!hasChecked) {
      if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
        NavigationUtil.goBack(this.props.navigation)
        return;
      }
    }
    this.languageDao.save(this.getSortResult())
    const {onLoadLanguage} = this.props
    onLoadLanguage(this.params.flag)
    NavigationUtil.goBack(this.props.navigation)
  }

  getSortResult() {
    const flag = SortKeyPage._flag(this.props)
    let sortResultArray = ArrayUtil.clone(this.props.language[flag])
    const originalCheckArray = SortKeyPage._keys(this.props)
    for (let i = 0, j = originalCheckArray.length; i < j; i++) {
      let item = originalCheckArray[i]
      let index = this.props.language[flag].indexOf(item)
      sortResultArray.splice(index, 1, this.state.checkedArray[i])
    }
    return sortResultArray
  }

  onBack() {
    if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
      Alert.alert('Warning', 'Do your want to save you change?',
          [
            {
              text: 'No', onPress: () => {
                NavigationUtil.goBack(this.props.navigation)
              }
            }, {
              text: 'Yes', onPress: () => {
                this.onSave()
            }
          }
          ])
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  render() {
    let title = this.params.flag === FLAG_LANGUAGE.flag_language ? 'Sorting Language' : 'Sorting Tag'
    let navigationBar =
      <NavigationBar
        title={title}
        leftButton={ViewUtil.getLeftBackButton(()=> this.onBack())}
        style={{backgroundColor: THEME_COLOR}}
        rightButton={ViewUtil.getRightButton('Save', () => this.onSave())}
      />
    return <View style={styles.container}>
      {navigationBar}
      <SortableListView
          data={this.state.checkedArray}
          order={Object.keys(this.state.checkedArray)}
          onRowMoved={e => {
            this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0])
            this.forceUpdate()
          }}
          renderRow={row => <SortCell data={row} {...this.params}/>}
      />
    </View>
  }
}

class SortCell extends Component {
  render() {
    return (
        <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}
        >
          <View style={{marginRight: 10, flexDirection: 'row'}}>
            <MaterialCommunityIcons
              name={'sort'}
              size={16}
              style={{marginRight: 10, color: THEME_COLOR}}
            />
            <Text>{this.props.data.name}</Text>
          </View>
        </TouchableHighlight>
    )
  }
}

const mapPopularStateToProps = state =>({
  language: state.language,
})

const mapPopularDispatchToProps = dispatch => ({
  onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})

export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    flex: 1,
    height: 0.3,
    backgroundColor: 'darkgray',
  },
  item: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: '#eee',
    height: 50,
    justifyContent: 'center',
  },
  hidden: {
    height: 0
  }
});
