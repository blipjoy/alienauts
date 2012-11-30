game.PlayScreen = me.ScreenObject.extend({
    "init" : function init() {
        this.parent.apply(this, arguments);

        this.lightlevel = 0;
        this.color = "#141414";
    },

    "onResetEvent" : function onResetEvent() {
        var vp = me.game.viewport;

        me.game.viewport.fadeOut("#000", 250, function () {
            // Bind input
            me.input.registerMouseEvent("mousedown", game.player, game.player.touch.bind(game.player), true);
            me.input.registerMouseEvent("mousemove", vp, game.player.drag.bind(game.player), true);
            me.input.registerMouseEvent("mouseup", vp, game.player.touchEnd.bind(game.player), true);

            // Install collision handlers
            game.installExitHandler();

            // HUD
            /*
            me.game.addHUD(0, 0, c.WIDTH, c.HEIGHT);
            me.game.HUD.addItem("money", new game.money(0, 0));
            me.game.add(new game.panel(~~(c.WIDTH * 0.2), c.HEIGHT));
            me.game.sort();
            */
        });
    },

    "onDestroyEvent" : function onDestroyEvent() {
        // Unbind input
        this.unbind();

        // Remove all bodies and shapes from the Chipmunk space.
        cm.removeAll();
    },

    "unbind" : function unbind() {
        var vp = me.game.viewport;

        // Unbind input
        me.input.releaseMouseEvent("mousedown", game.player);
        me.input.releaseMouseEvent("mousemove", vp);
        me.input.releaseMouseEvent("mouseup", vp);
    },

    "draw" : function draw(context) {
        me.video.clearSurface(context, this.color);
    }
});
