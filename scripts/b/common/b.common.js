/**
 * A collection of useful Javascript functions
 */
B.Common = function(){
    /**
     * Check if an object is undefined and give a default value if undefined
     *
     * @param obj
     * @param defaultValue
     */
    this.default = function(obj, defaultValue){
        return isNull(obj) ? defaultValue : obj;
    }

    /**
     * Check if an object is null or empty (undefined)
     * @param obj
     */
    this.isNull = function(obj){
        return typeof obj == 'undefined' || obj == ''
    }

    this.randomString = function(){
        return Math.random().toString(36).substring(7);
    }
}
B.markLoaded("b.common.js")
