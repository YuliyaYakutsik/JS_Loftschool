export default (function(){
    const obj = {};

    return {
        hasKey(key) {
            return obj[key] ? true : false;
        },

        createKey(key) {
            obj[key] = [];
        },

        appendDataToKey(key, data) {
            obj[key].push(data);
        },

        getDataByKey(key) {
            return obj[key];
        }
    }
})();