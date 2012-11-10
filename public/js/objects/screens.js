game.PlayScreen = me.ScreenObject.extend({
    "onResetEvent" : function onResetEvent() {
        var vp = me.game.viewport;

        // Create a floor
        var space = cm.getSpace();
        var floor = space.addShape(new cp.SegmentShape(
            space.staticBody,
            cp.v(0, 0),
            cp.v(me.video.getWidth(), 0),
            0
        ));
        floor.setElasticity(1);
        floor.setFriction(1);

        var slope = space.addShape(new cp.SegmentShape(
            space.staticBody,
            cp.v(0, 100),
            cp.v(100, 0),
            0
        ));
        slope.setElasticity(1);
        slope.setFriction(1);

        var circle, rect;

        // Create player entity.
        game.player = new game.Player(116, c.HEIGHT - 32);
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

        // Create a small red square attached to a small green balloon.
        circle = new game.Circle(50, 100, 10, "green", true);
        rect = new game.Rect(50, 150, 15, 15, "red");
        me.game.add(circle, 1000);
        me.game.add(rect, 1000);
        me.game.add(new game.Rope(circle.body, rect.body, cp.vzero, cp.vzero, 50, 0.005), 1001);

        // Create a large blue square attached to a large orange balloon.
        circle = new game.Circle(25, 100, 15, "orange", true);
        rect = new game.Rect(25, 150, 20, 20, "blue");
        me.game.add(circle, 1000);
        me.game.add(rect, 1000);
        me.game.add(new game.Rope(circle.body, rect.body, cp.vzero, cp.vzero, 50, 0.005), 1001);

        // Create a few more squares to weigh down the balloons.
        me.game.add(new game.Rect(50, 20, 25, 15, "lime"), 1000);
        me.game.add(new game.Circle(25, 20, 10, "purple"), 1000);

        // Create a catapult
        var catapult = new game.Rect(300, c.HEIGHT - 90, 200, 10, "olive");
        me.game.add(catapult, 1000);
        space.addConstraint(new cp.PivotJoint(catapult.body, space.staticBody, cp.v(300, 90)));

        // Create a light object to attach to one end of the catapult
        rect = new game.Rect(250, c.HEIGHT - 110, 40, 20, "salmon", 0.2);
        me.game.add(rect, 1000);

        // Tie the object to the end of the catapult
        me.game.add(new game.Rope(catapult.body, rect.body, cp.v(-100, 0), cp.v(20, 0), 80, 0.005), 1001);

        // Then add a bunch of weight to fling the object with the catapult
        me.game.add(new game.Rect(400, c.HEIGHT - 250, 20, 20, "royalblue", 1000), 1000);

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
        me.video.clearSurface(context, "#ccc");
    }
});
