game.PlayScreen = me.ScreenObject.extend({
    "onResetEvent" : function onResetEvent() {
        var vp = me.game.viewport;
        var space = cm.getSpace();

        // Create a floor
        me.game.add(new game.Line(
            cp.v(0, 0),
            cp.v(me.video.getWidth(), 0),
            3,
            {
                "elasticity" : 1,
                "friction" : 1,
                "color" : "black"
            }
        ), 1000);

        // Create player entity.
        game.player = new game.Player(140, c.HEIGHT - 35);
        me.game.add(game.player, 1000);

        // Bind input
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.registerMouseEvent("mousedown", vp, game.player.touch.bind(game.player), true);
        me.input.registerMouseEvent("mouseup", vp, game.player.touchEnd.bind(game.player), true);
        me.input.registerMouseEvent("touchstart", vp, game.player.touch.bind(game.player), true);
        me.input.registerMouseEvent("touchend", vp, game.player.touchEnd.bind(game.player), true);


        // Create a funky polygon
        var verts = [
            -20, 0,
            -13, 15,
            8, 16,
            14, 0,
            9, -13,
            -10, -15
        ];
        me.game.add(new game.Poly(150, c.HEIGHT - 220, verts, cp.vzero, {
            "color" : "dodgerblue"
        }), 1000);

        // Create a lightsource swinging from a rope.
        var light = new game.LightSource(415, c.HEIGHT - 140, 10);
        me.game.add(light, 1000);
        me.game.add(new game.Rope(light.body, space.staticBody, cp.v(-10, 0), cp.v(300, 165), 100), 999);


        me.game.sort();

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
    },

    // FIXME: Don't clear the BG here
    "draw" : function draw(context) {
        me.video.clearSurface(context, "#222");
    }
});
