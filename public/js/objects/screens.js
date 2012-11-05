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

        me.game.add(new game.Rect(50, 90, 15, 15, "red"), 1000);
        me.game.add(new game.Circle(45, 45, 10, "green"), 1000);
        me.game.add(new game.Rect(70, 40, 20, 20, "blue"), 1000);
        me.game.add(new game.Rect(20, 60, 25, 15, "lime"), 1000);
        me.game.add(new game.Rect(35, 20, 15, 25, "purple"), 1000);
        me.game.add(new game.Circle(15, 90, 15, "orange"), 1000);
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
