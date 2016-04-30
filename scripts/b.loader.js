/**
 * Placeholder for B Javascript Framework
 */
var B = B || {}

B.CONST = {
   LOADED: {
       FALSE: "false",
       TRUE: "true",
       LOADING: "loading"
   }
}

B.defaults = {
    "scriptDir": "scripts",
    "readyIntervalCheck": 500
}

B._scripts = [] // all scripts to be loaded
B._readyInterval

B.ready = function(callback){
    B._readyInterval = setInterval(function(){
        ready = true
        B._scripts.forEach(function(s){
            if(s.loaded != B.CONST.LOADED.TRUE)
                ready = false
        })

        if(ready == true){
            clearInterval(B._readyInterval)
            callback()
        }
    }, B.defaults.readyIntervalCheck)
}

B.load = function(config, autoLoadClasses, autoLoadPackages){
    loc = window.location.pathname;
    dir = loc.substring(0, loc.lastIndexOf("/"))

    if(typeof autoLoadPackages != 'undefined') autoLoadPackages.forEach(function(f){
        paths = f.substr(0, f.length - 3).split('.')
        paths.push(f)
        paths.unshift(2)
        paths[0] = config.scriptDir;

        s = document.createElement("script")
        s.setAttribute("src", paths.join("/"))
        B._scripts.push({"element": s, "loaded": B.CONST.LOADED.FALSE, "name": f})
    })

    autoLoadClasses.forEach(function(f){
        paths = [config.scriptDir, f.dir, f.name]

        s = document.createElement("script")
        s.setAttribute("src", paths.join("/"))
        B._scripts.push({"element": s, "loaded": B.CONST.LOADED.FALSE, "name": f.name})
    })

    B._scripts.forEach(function(s){
        if(s.loaded == B.CONST.LOADED.FALSE) {
            document.head.appendChild(s.element)
            s.loaded = B.CONST.LOADED.LOADING
        }
    })
}

B.markLoaded = function(name){
    B._scripts.forEach(function(s){
        if(s.name == name){
            s.loaded = B.CONST.LOADED.TRUE
        }
    })
}

B.load(
    {"scriptDir": B.defaults.scriptDir},
    [{"name": "b.exception.js", "dir" : "b"}],
    ["b.common.js", "b.dom.js"]
)
