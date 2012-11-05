game.PlayScreen = me.ScreenObject.extend({
    "onResetEvent" : function() {
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

        var c, r;
        c = new game.Circle(50, 100, 10, "green");
        r = new game.Rect(50, 150, 15, 15, "red");
        me.game.add(c, 1000);
        me.game.add(r, 1000);
        space.addConstraint(new cp.PinJoint(c.body, r.body, cp.vzero, cp.vzero));

        c = new game.Circle(25, 100, 15, "orange");
        r = new game.Rect(25, 150, 20, 20, "blue");
        me.game.add(c, 1000);
        me.game.add(r, 1000);
        space.addConstraint(new cp.PinJoint(c.body, r.body, cp.vzero, cp.vzero));

        me.game.add(new game.Rect(50, 20, 25, 15, "lime"), 1000);
        me.game.add(new game.Rect(25, 20, 15, 25, "purple"), 1000);
        me.game.sort();

        // HUD
        /*
        me.game.addHUD(0, 0, c.WIDTH, c.HEIGHT);
        me.game.HUD.addItem("money", new game.money(0, 0));
        me.game.add(new game.panel(~~(c.WIDTH * 0.2), c.HEIGHT));
        me.game.sort();
        */
    },

    "onDestroyEvent" : function() {
        // ...
    },

    // FIXME: Don't clear the BG here
    "draw" : function draw(context) {
        me.video.clearSurface(context, "#ccc");
    }
});
