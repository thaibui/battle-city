var Config = {
    /**
     * The main playground of the game
     * @type {{playground: map}}
     */
    playground : {
        objects : {
            block : {
                id : "BID",
                class : "BClass",
                style : "width:64px; height:64px;"
            }
        },
        id : "BTGameArea",
        class : "BTTank"
    },

    player : {
        tank : {
            id : "PTankId",
            class : "PTank",
            style : "width:64px; height:64px;"
        }
    }

}
B.markLoaded("config.js")
