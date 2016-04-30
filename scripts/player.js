/**
 * This class represents a single player in the game.
 *
 * More players and their options can be added later to handle
 * more scenarios.
 *
 * @param options: maps of key -> values
 * @constructor
 */
function Player(name, options){
    this.name = Bui_Common.default(name, "default_player")
    this.x  = Bui_Common.default(options.x, 0)
    this.y  = Bui_Common.default(options.y, 0)
    this.id

    /**
     * Create a new HTML element with unique ID and put it to the playing area
     */
    this.init = function(){
        // check if this id already exist as other player's id
        while(this.IDExists(this.id = Bui_Common.randomString())){
            this.prototype.ALL_PLAYERS_ID[this.id] = true;
        }

        // create HTML element for this player
        this.createHTMLPreresentation()
    }

    /**
     * Check if the ID already exists in the game
     */
    this.IDExists = function(id){
        if(Bui_Common.isNull(this.prototype.ALL_PLAYERS_ID)){
            this.prototype.ALL_PLAYERS_ID = {}
        }

        return !Bui_Common.isNull(this.prototype.ALL_PLAYERS_ID[id])
    }

    this.createHTMLPreresentation = function(){
    }
}