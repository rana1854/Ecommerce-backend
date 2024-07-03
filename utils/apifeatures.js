class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr };

        // Remove fields from queryCopy that are not relevant to filtering
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Handle price range filtering with operators
        if (queryCopy.price) {
            let priceQuery = {};

            // Iterate through possible operators and build the query
            Object.keys(queryCopy.price).forEach((key) => {
                // Check if the key is a valid operator (gt, gte, lt, lte)
                if (['gt', 'gte', 'lt', 'lte'].includes(key)) {
                    priceQuery[`$${key}`] = parseInt(queryCopy.price[key]);
                }
            });

            this.query = this.query.find({ ...this.query._conditions, price: priceQuery });
        }

        return this;
    }

    //pagination
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}

export default ApiFeatures;
