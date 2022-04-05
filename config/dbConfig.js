/*
module.exports = {
    HOST: "localhost",
    USER: "ahadjigavriel",
    PASSWORD: "Ahad12@",
    DB: "tap2sos",
    //dialect: "mongodb",
    port: "3306",
    dialectOptions: {
        charset: 'utf8',
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
*/
module.exports = {
    url: "mongodb://localhost:2020/",
    database: "tap2sos",
    imgBucket: "photos",
};