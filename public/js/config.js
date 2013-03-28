/* Constants */
var c = {
    "DEBUG"             : false,

    "WIDTH"             : 960,
    "HEIGHT"            : 600,

    // Chipmunk shape layers
    "LAYER_NONE"        : 0x00000000,
    "LAYER_SHAPES"      : 0x00000001,
    "LAYER_ROPES"       : 0x00000002,
    "LAYER_AIRFLOW"     : 0x00000004,

    // Chipmunk collision groups
    "GROUP_ROPE"        : 1, // Rope control points
    "GROUP_CHAIN"       : 2, // Chain segments

    // Chipmunk collision types
    "TYPE_PLAYER"       : 1,
    "TYPE_EXIT"         : 2,
    "TYPE_AIRFLOW"      : 3,
    "TYPE_BALLOON"      : 4,
    "TYPE_SOLID"        : 5, // Solid lines; walls, floors, ceilings, etc.

    // minpubsub events
    "EVENT_DRAG"        : "game.drag",
    "EVENT_TOUCHEND"    : "game.touchEnd",

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
    enableDebug(true);
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
try {
    Object.keys(c).forEach(function eachKey(key) {
        if (typeof(c[key]) === "function") {
            return;
        }

        c.__defineGetter__(
            key,
            (function getterFactory(value) {
                return function returnValue() {
                    return value
                };
            })(c[key])
        );
    });
}
catch (e) {
    // No getters? FAKE CONSTANTS!
}


// Game engine settings.
me.sys.pauseOnBlur = false;
me.sys.gravity = 0;
//me.sys.dirtyRegion = true; // Be fast!
//me.sys.preRender = true; // Be faster!
me.sys.useNativeAnimFrame = true; // Be fastest!
me.sys.stopOnAudioError = false;

function enableDebug(enable) {
    me.debug.renderHitBox = enable;
    //me.debug.renderCollisionMap = enable;
}

// Game states.
me.state.BLIPJOY = me.state.USER + 0;
me.state.SCENE00 = me.state.USER + 10;
me.state.SCENE01 = me.state.USER + 11;
me.state.SCENE02 = me.state.USER + 12;
me.state.SCENE03 = me.state.USER + 13;
