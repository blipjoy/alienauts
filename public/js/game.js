
/* Game namespace */
var game = {
    // Run on page load.
    "onload" : function onload() {
        // Initialize the video.
        if (!me.video.init("screen", c.WIDTH, c.HEIGHT)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.video.setImageSmoothing(false);

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
        // Set the ScreenObjects for game state management.
        me.state.set(me.state.BLIPJOY, new game.BlipjoyScreen(true));

        me.state.set(me.state.SCENE00, new game.Scene00(true));
        me.state.set(me.state.SCENE01, new game.Scene01(true));
        me.state.set(me.state.SCENE02, new game.Scene02(true));
//        me.state.set(me.state.SCENE03, new game.Scene03(true));

        // Start the game.
        me.state.change(me.state.BLIPJOY); //BLIPJOY
    },

    // Helper function to determine if a variable is an Object.
    "isObject" : function isObject(object) {
        try {
            return (!Array.isArray(object) && Object.keys(object));
        }
        catch (e) {
            return false;
        }
    },

    // Helper function to generate a hex string.
    "toHex" : function toHex(num, pad) {
        return ("0000000000000000" + num.toString(16)).substr(-(pad || 2));
    },

    // Return the number exactly halfway between a and b.
    "midpoint" : function midpoint(a, b) {
        return (a + b) / 2;
    },

    // Blend two color values using addition.
    "addColor" : function addColor(a, b) {
        a = game.parseColor(a);
        b = game.parseColor(b);

        return [
            Math.min(a[0] + b[0], 255),
            Math.min(a[1] + b[1], 255),
            Math.min(a[2] + b[2], 255)
        ];
    },

    // Darken a color value by 0..1
    "darkenColor" : function darkenColor(color, scale) {
        color = game.parseColor(color);

        return [
            Math.min(Math.round(color[0] * scale), 255),
            Math.min(Math.round(color[1] * scale), 255),
            Math.min(Math.round(color[2] * scale), 255)
        ];
    },

    "rgbCache" : {},

    // Parse a CSS color and cache the result, returns an array of RGB values.
    "parseColor" : function parseColor(color) {
        if (Array.isArray(color)) {
            return color;
        }

        var rgb = this.rgbCache[color];

        if (!rgb) {
            rgb = this.HashtoRGB(this.CSStoRGB(color));
            this.rgbCache[color] = rgb;
        }

        return rgb;
    },

    // Return a CSS color with optional alpha.
    "getColor" : function getColor(color, a) {
        var rgb = this.parseColor(color);

        if (Array.isArray(rgb)) {
            if (typeof(a) === "number") {
                return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + a + ")";
            }

            return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
        }
        else if ((typeof(a) === "undefined") && (typeof(rgb) === "string")) {
            return rgb;
        }

        throw "Tried to set alpha on a color that isn't an array";
    },

    "HashtoRGB" : function HashtoRGB(color) {
        if ((typeof(color) !== "string") ||
            (color.charAt(0) !== "#")) {
            return color;
        }

        // Strip hash
        color = color.substr(1);

        var r, g, b;
        if (color.length === 3) {
            // 3-digit hex notation
            r = color.charAt(0) + color.charAt(0);
            g = color.charAt(1) + color.charAt(1);
            b = color.charAt(2) + color.charAt(2);
        }
        else {
            // 6-digit hex notation
            r = color.substr(0, 2);
            g = color.substr(2, 2);
            b = color.substr(4, 2);
        }

        return [
            parseInt(r, 16),
            parseInt(g, 16),
            parseInt(b, 16)
        ];
    },

    // Convert CSS color names to RGB values.
    "CSStoRGB" : function CSStoRGB(color) {
        var colors = {
            // CSS1
            "black"                 : [   0,   0,   0 ],
            "silver"                : [ 192, 192, 129 ],
            "gray"                  : [ 128, 128, 128 ],
            "white"                 : [ 255, 255, 255 ],
            "maroon"                : [ 128,   0,   0 ],
            "red"                   : [ 255,   0,   0 ],
            "purple"                : [ 128,   0, 128 ],
            "fuchsia"               : [ 255,   0, 255 ],
            "green"                 : [   0, 128,   0 ],
            "lime"                  : [   0, 255,   0 ],
            "olive"                 : [ 128, 128,   0 ],
            "yellow"                : [ 255, 255,   0 ],
            "navy"                  : [   0,   0, 128 ],
            "blue"                  : [   0,   0, 255 ],
            "teal"                  : [   0, 128, 128 ],
            "aqua"                  : [   0, 255, 255 ],

            // CSS2
            "orange"                : [ 255, 165,   0 ],

            // CSS3
            "aliceblue"             : [ 240, 248, 245 ],
            "antiquewhite"          : [ 250, 235, 215 ],
            "aquamarine"            : [ 127, 255, 212 ],
            "azure"                 : [ 240, 255, 255 ],
            "beige"                 : [ 245, 245, 220 ],
            "bisque"                : [ 255, 228, 196 ],
            "blanchedalmond"        : [ 255, 235, 205 ],
            "blueviolet"            : [ 138,  43, 226 ],
            "brown"                 : [ 165,  42,  42 ],
            "burlywood"             : [ 222, 184,  35 ],
            "cadetblue"             : [  95, 158, 160 ],
            "chartreuse"            : [ 127, 255,   0 ],
            "chocolate"             : [ 210, 105,  30 ],
            "coral"                 : [ 255, 127,  80 ],
            "cornflowerblue"        : [ 100, 149, 237 ],
            "cornsilk"              : [ 255, 248, 220 ],
            "crimson"               : [ 220,  20,  60 ],
            "darkblue"              : [   0,   0, 139 ],
            "darkcyan"              : [   0, 139, 139 ],
            "darkgoldenrod"         : [ 184, 134,  11 ],
            "darkgray[*]"           : [ 169, 169, 169 ],
            "darkgreen"             : [   0, 100,   0 ],
            "darkgrey[*]"           : [ 169, 169, 169 ],
            "darkkhaki"             : [ 189, 183, 107 ],
            "darkmagenta"           : [ 139,   0, 139 ],
            "darkolivegreen"        : [  85, 107,  47 ],
            "darkorange"            : [ 255, 140,   0 ],
            "darkorchid"            : [ 153,  50, 204 ],
            "darkred"               : [ 139,   0,   0 ],
            "darksalmon"            : [ 233, 150, 122 ],
            "darkseagreen"          : [ 143, 188, 143 ],
            "darkslateblue"         : [  72,  61, 139 ],
            "darkslategray"         : [  47,  79,  79 ],
            "darkslategrey"         : [  47,  79,  79 ],
            "darkturquoise"         : [   0, 206, 209 ],
            "darkviolet"            : [ 148,   0, 211 ],
            "deeppink"              : [ 255,  20, 147 ],
            "deepskyblue"           : [   0, 191, 255 ],
            "dimgray"               : [ 105, 105, 105 ],
            "dimgrey"               : [ 105, 105, 105 ],
            "dodgerblue"            : [  30, 144, 255 ],
            "firebrick"             : [ 178,  34,  34 ],
            "floralwhite"           : [ 255, 250, 240 ],
            "forestgreen"           : [  34, 139,  34 ],
            "gainsboro"             : [ 220, 220, 220 ],
            "ghostwhite"            : [ 248, 248, 255 ],
            "gold"                  : [ 255, 215,   0 ],
            "goldenrod"             : [ 218, 165,  32 ],
            "greenyellow"           : [ 173, 255,  47 ],
            "grey"                  : [ 128, 128, 128 ],
            "honeydew"              : [ 240, 255, 240 ],
            "hotpink"               : [ 255, 105, 180 ],
            "indianred"             : [ 205,  92,  92 ],
            "indigo"                : [  75,   0, 130 ],
            "ivory"                 : [ 255, 255, 240 ],
            "khaki"                 : [ 240, 230, 140 ],
            "lavender"              : [ 230, 230, 250 ],
            "lavenderblush"         : [ 255, 240, 245 ],
            "lawngreen"             : [ 124, 252,   0 ],
            "lemonchiffon"          : [ 255, 250, 205 ],
            "lightblue"             : [ 173, 216, 230 ],
            "lightcoral"            : [ 240, 128, 128 ],
            "lightcyan"             : [ 224, 255, 255 ],
            "lightgoldenrodyellow"  : [ 250, 250, 210 ],
            "lightgray"             : [ 211, 211, 211 ],
            "lightgreen"            : [ 144, 238, 144 ],
            "lightgrey"             : [ 211, 211, 211 ],
            "lightpink"             : [ 255, 182, 193 ],
            "lightsalmon"           : [ 255, 160, 122 ],
            "lightseagreen"         : [  32, 178, 170 ],
            "lightskyblue"          : [ 135, 206, 250 ],
            "lightslategray"        : [ 119, 136, 153 ],
            "lightslategrey"        : [ 119, 136, 153 ],
            "lightsteelblue"        : [ 176, 196, 222 ],
            "lightyellow"           : [ 255, 255, 224 ],
            "limegreen"             : [  50, 205,  50 ],
            "linen"                 : [ 250, 240, 230 ],
            "mediumaquamarine"      : [ 102, 205, 170 ],
            "mediumblue"            : [   0,   0, 205 ],
            "mediumorchid"          : [ 186,  85, 211 ],
            "mediumpurple"          : [ 147, 112, 219 ],
            "mediumseagreen"        : [  60, 179, 113 ],
            "mediumslateblue"       : [ 123, 104, 238 ],
            "mediumspringgreen"     : [   0, 250, 154 ],
            "mediumturquoise"       : [  72, 209, 204 ],
            "mediumvioletred"       : [ 199,  21, 133 ],
            "midnightblue"          : [  25,  25, 112 ],
            "mintcream"             : [ 245, 255, 250 ],
            "mistyrose"             : [ 255, 228, 225 ],
            "moccasin"              : [ 255, 228, 181 ],
            "navajowhite"           : [ 255, 222, 173 ],
            "oldlace"               : [ 253, 245, 230 ],
            "olivedrab"             : [ 107, 142,  35 ],
            "orangered"             : [ 255,  69,   0 ],
            "orchid"                : [ 218, 112, 214 ],
            "palegoldenrod"         : [ 238, 232, 170 ],
            "palegreen"             : [ 152, 251, 152 ],
            "paleturquoise"         : [ 175, 238, 238 ],
            "palevioletred"         : [ 219, 112, 147 ],
            "papayawhip"            : [ 255, 239, 213 ],
            "peachpuff"             : [ 255, 218, 185 ],
            "peru"                  : [ 205, 133,  63 ],
            "pink"                  : [ 255, 192, 203 ],
            "plum"                  : [ 221, 160, 221 ],
            "powderblue"            : [ 176, 224, 230 ],
            "rosybrown"             : [ 188, 143, 143 ],
            "royalblue"             : [  65, 105, 225 ],
            "saddlebrown"           : [ 139,  69,  19 ],
            "salmon"                : [ 250, 128, 114 ],
            "sandybrown"            : [ 244, 164,  96 ],
            "seagreen"              : [  46, 139,  87 ],
            "seashell"              : [ 255, 245, 238 ],
            "sienna"                : [ 160,  82,  45 ],
            "skyblue"               : [ 135, 206, 235 ],
            "slateblue"             : [ 106,  90, 205 ],
            "slategray"             : [ 112, 128, 144 ],
            "slategrey"             : [ 112, 128, 144 ],
            "snow"                  : [ 255, 250, 250 ],
            "springgreen"           : [   0, 255, 127 ],
            "steelblue"             : [  70, 130, 180 ],
            "tan"                   : [ 210, 180, 140 ],
            "thistle"               : [ 216, 191, 216 ],
            "tomato"                : [ 255,  99,  71 ],
            "turquoise"             : [  64, 224, 208 ],
            "violet"                : [ 238, 130, 238 ],
            "wheat"                 : [ 245, 222, 179 ],
            "whitesmoke"            : [ 245, 245, 245 ],
            "yellowgreen"           : [ 154, 205,  50 ]
        };

        return colors[color] || color;
    }
};
