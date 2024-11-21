class APIFilters{
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
    };

    search(){
        const keyword = this.queryStr.keyword? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i',
            },   
        } : {} 
        this.query = this.query.find({...keyword});
        return this;
    }

    filters(){
        const queryCopy={...this.queryStr};
       
        //Fields to remove
        const fieldsToRemove = ['keyword','page'];
        fieldsToRemove.forEach((el)=>delete queryCopy[el]);
        
        //advanced filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) =>`$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination({resPerPage,resPerFilter}){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerFilter * (currentPage-1);

        this.query = this.query.limit(resPerFilter).skip(skip);
        return this;
    }
};

export default APIFilters;