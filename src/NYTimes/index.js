const fetch = require("node-fetch");
class NYTimes {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async getMostPopular() {
        return await fetch(`https://api.nytimes.com/svc/mostpopular/v2/emailed/7.json?api-key=${this.apiKey}`)
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error('Something went wrong')
                }
                return res.json()
            });
    }

    getHeaders(obj) {
        if (obj.results === undefined) {
            throw new Error('Articles is not defined');
        }

        return obj.results.map(article => article.title)
    }
}

module.exports = NYTimes;