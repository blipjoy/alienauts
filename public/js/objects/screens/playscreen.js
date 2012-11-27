game.PlayScreen = me.ScreenObject.extend({
    "onResetEvent" : function onResetEvent() {
        var vp = me.game.viewport;

        // Bind input
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.registerMouseEvent("mousedown", vp, game.player.touch.bind(game.player), true);
        me.input.registerMouseEvent("mouseup", vp, game.player.touchEnd.bind(game.player), true);
        me.input.registerMouseEvent("touchstart", vp, game.player.touch.bind(game.player), true);
        me.input.registerMouseEvent("touchend", vp, game.player.touchEnd.bind(game.player), true);

        // HUD
        /*
        me.game.addHUD(0, 0, c.WIDTH, c.HEIGHT);
        me.game.HUD.addItem("money", new game.money(0, 0));
        me.game.add(new game.panel(~~(c.WIDTH * 0.2), c.HEIGHT));
        me.game.sort();
        */
    },

    "onDestroyEvent" : function onDestroyEvent() {
        var vp = me.game.viewport;

        // Unbind input
        me.input.unbindKey(me.input.KEY.LEFT);
        me.input.unbindKey(me.input.KEY.RIGHT);
        me.input.unbindKey(me.input.KEY.A);
        me.input.unbindKey(me.input.KEY.D);
        me.input.releaseMouseEvent("mousedown", vp);
        me.input.releaseMouseEvent("mouseup", vp);
        me.input.releaseMouseEvent("touchstart", vp);
        me.input.releaseMouseEvent("touchend", vp);
    }
});
