B.DOM.Element = function (name){
    var _element = document.createElement(name);

    this.set = function(att, val){
        _element.setAttribute(att, val)
        return this
    }

    this.get = function(){
        return _element
    }

    this.appendToBody = function(){
        B.DOM.appendTo(this, document.body)
        return this
    }

    this.newChild = function(element){
        if(!element instanceof B.DOM.Element){
            throw new B.DOM.Exception("Appending element needs to be of type B.DOM.Element")
        }

        _element.appendChild(element.get())
        return this
    }
}
B.markLoaded("b.dom.element.js")
