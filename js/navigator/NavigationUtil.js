export default class NavigationUtil {
    /**
     * reset to homePage
     * @param params 
     */

    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate('Main')
    }
}