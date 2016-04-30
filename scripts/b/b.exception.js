B.Exception = function(msg){
    var msg = msg
    this.toString = function() {
        return "B.Exception: " + msg
    }
}
B.markLoaded("b.exception.js")
