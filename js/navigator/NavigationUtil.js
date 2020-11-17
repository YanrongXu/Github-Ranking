export default class NavigationUtil {
    /**
     * direct to desire page
     * @param params param that need to pass
     * @param page name of page (page router)
     */
    static goPage(params, page) {
        const navigation = NavigationUtil.navigation;
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null');
        }
        navigation.navigate(
            page,
            {
                ...params
            }
        )
    }

    /**
     * reset to homePage
     * @param params 
     */

    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate('Main')
    }
}