class Configuration {
    getBasePath() {
        const envUrl = process.env.REACT_APP_API_URL
        if (envUrl === undefined) {
            return "/api"
        }
        return envUrl
    }
    getPoductAvatarPath(productID: string) {
        return this.getBasePath() + "/products/" + productID + "/avatar"
    }
    getDefaultTimeout() {
        return 5000 //timeout in MS
    }
    getTestProductAvatarPath(productID: string) {
        return "./data/products/" + productID + ".jpg"
    }
    getCoinName() {
        return "€"
    }
    isDebugMode() {
        return true
    }
    formatPrice(priceInCents: number) {
        var formatter = new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
          });
        
        return formatter.format(priceInCents / 100)
    }
    //this is for the chef panel
    get ordersRefreshMs() {
        return 5000
    }
    get messageTimeout() {
        return 10000
    }
    get clearMessages() {
        return true
    }
}

const config = new Configuration();

export default config;