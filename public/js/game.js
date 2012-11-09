
/* Game namespace */
var game = {
    // Run on page load.
    "onload" : function onload() {
        // Initialize the video.
        if (!me.video.init("screen", c.WIDTH, c.HEIGHT)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Initialize Chipmunk-js
        var space = cm.getSpace();
        space.gravity = cp.v(0, -500);

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
        this.loadResources();

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    "loadResources" : function loadResources() {
        // Set all resources to be loaded.
        var resources = [];

        // Graphics.
        this.resources["img"].forEach(function forEach(value) {
            resources.push({
                "name"  : value,
                "type"  : "image",
                "src"   : "resources/img/" + value + ".png"
            })
        });

        // Maps.
        this.resources["map"].forEach(function forEach(value) {
            resources.push({
                "name"  : value,
                "type"  : "tmx",
                "src"   : "resources/map/" + value + ".tmx"
            })
        });

        // Sound effects.
        this.resources["sfx"].forEach(function forEach(value) {
            resources.push({
                "name"      : value,
                "type"      : "audio",
                "src"       : "resources/sfx/",
                "channel"   : 2
            })
        });

        // Music.
        this.resources["bgm"].forEach(function forEach(value) {
            resources.push({
                "name"      : value,
                "type"      : "audio",
                "src"       : "resources/bgm/",
                "channel"   : 1
            })
        });

        // Load the resources.
        me.loader.preload(resources);
    },

    // Run on game resources loaded.
    "loaded" : function loaded() {
        // Set the "Select" ScreenObject.
        //me.state.set(me.state.MENU, new game.SelectScreen());

        // Set the "Play" ScreenObject.
        // FIXME: Don't create PlayScreen as an object
        me.state.set(me.state.PLAY, new game.PlayScreen(true));

        // Entities.
        //me.entityPool.add("truck", game.Truck);
        //me.entityPool.add("plant", game.Plant);

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.D, "right");

        // Start the game.
        me.state.change(me.state.PLAY);
    },

    // Helper function to determine if a variable is an Object.
    "isObject" : function isObject(object) {
        try {
            return (!Array.isArray(object) && Object.keys(object));
        }
        catch (e) {
            return false;
        }
    }
};
