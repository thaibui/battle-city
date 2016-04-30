B.DOM = {}

B.DOM.new = function(name){
    return new B.DOM.Element(name)
}

B.DOM.appendTo = function(element, doc){
    if(!element instanceof B.DOM.Element){
        throw new B.DOM.Exception("Appending element needs to be of type B.DOM.Element")
    }

    doc.appendChild(element.get())
}

B.load(
    {"scriptDir": B.defaults.scriptDir},
    [
        {"name": "b.dom.element.js", "dir": "b/dom"},
        {"name": "b.dom.exception.js", "dir": "b/dom"}
    ],
    []
)
B.markLoaded("b.dom.js")
