/* Constants */
var c = {
    "DEBUG"             : false,

    "WIDTH"             : function WIDTH() {
        return window.innerWidth || 640;
    },
    "HEIGHT"            : function HEIGHT() {
        return window.innerHeight || 480;
    },

    // Chipmunk shape layers
    "LAYER_NONE"        : 0x00000000,
    "LAYER_SHAPES"      : 0x00000001,
    "LAYER_ROPES"       : 0x00000002,

    // Chipmunk collision groups
    "GROUP_ROPE"        : 1, // Rope control points
    "GROUP_CHAIN"       : 2, // Chain segments

    // Chipmunk collision types
    "TYPE_PLAYER"       : 1,
    "TYPE_EXIT"         : 2,

    "MOBILE"            : navigator.userAgent.match(/Android|iPhone|iPad|iPod/i),
    "GUID"              : (function () {
        function S4() {
            return ("000" + Math.floor(Math.random() * 0x10000).toString(16)).slice(-4);
        };

        return (
            S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
    })()
};

// Helper to enable debug by setting a special hash in the URL.
if (document.location.hash === "#debug") {
    c.DEBUG = true;
}

// Adjust height for mobile browsers to account for the iOS bar.
// Is this necessary for Android?
if (c.MOBILE) {
    c.HEIGHT = window.outerHeight - 20;
}

window.addEventListener("hashchange", function onHashChange(e) {
    var debug = (document.location.hash === "#debug");
    try {
        if (!c.hasOwnProperty("DEBUG")) {
            c.__defineGetter__("DEBUG", function () {
                return debug;
            });
        }
    }
    catch (e) {
        c.DEBUG = debug;
    }
});

// Turn the `c` object into a hash of constants.
Object.keys(c).forEach(function eachKey(key) {
    try {
        c.__defineGetter__(
            key,
            (typeof(c[key]) === "function") ?
                c[key] :
                (function getterFactory(value) {
                    return function returnValue() {
                        return value
                    };
                })(c[key])
        );
    }
    catch (e) {
        // No getters? FAKE CONSTANTS!
        if (typeof(c[key]) === "function") {
            c[key] = c[key]();
        }
    }
});


// Game engine settings.
me.sys.pauseOnBlur = false;
me.sys.gravity = 0;
me.sys.useNativeAnimFrame = true; // Be fast!
//me.sys.dirtyRegion = true; // Be faster!
//me.debug.renderHitBox = true;
//me.debug.renderCollisionMap = true;
me.sys.stopOnAudioError = false;

// Game states.
me.state.BLIPJOY = me.state.USER + 0;
me.state.SCENE00 = me.state.USER + 10;
me.state.SCENE01 = me.state.USER + 11;
me.state.SCENE02 = me.state.USER + 12;
me.state.SCENE03 = me.state.USER + 13;
