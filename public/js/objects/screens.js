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

        // Create a slope
        me.game.add(new game.Line(
            cp.v(0, 100),
            cp.v(100, 0),
            3,
            {
                "elasticity" : 1,
                "friction" : 1,
                "color" : "black"
            }
        ), 1000);

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
        circle = new game.Circle(75, 100, 10, {
            "color" : "green",
            "isBalloon" : true
        });
        rect = new game.Rect(75, 150, 15, 15, {
            "color" : "red"
        });
        me.game.add(circle, 1000);
        me.game.add(rect, 1000);
        me.game.add(new game.Rope(circle.body, rect.body, cp.v(0, -10), cp.v(-7.5, 7.5), 32.5, 0.005), 1001);

        // Create a large blue square attached to a large orange balloon.
        circle = new game.Circle(25, 100, 15, {
            "color" : "orange",
            "isBalloon" : true
        });
        rect = new game.Rect(25, 150, 20, 20, {
            "color" : "blue"
        });
        me.game.add(circle, 1000);
        me.game.add(rect, 1000);
        me.game.add(new game.Rope(circle.body, rect.body, cp.v(0, -15), cp.v(0, 10), 25, 0.005), 1001);

        // Create a few more squares to weigh down the balloons.
        me.game.add(new game.Rect(75, 20, 25, 15), 1000);
        me.game.add(new game.Circle(25, 20, 10), 1000);

        // Create a catapult
        var catapult = new game.Rect(300, c.HEIGHT - 90, 200, 10);
        me.game.add(catapult, 1000);
        space.addConstraint(new cp.PivotJoint(catapult.body, space.staticBody, catapult.body.p));

        // Create a light object to attach to one end of the catapult
        rect = new game.Rect(250, c.HEIGHT - 110, 40, 20, {
            "mass" : 0.2
        });
        me.game.add(rect, 1000);

        // Tie the object to the end of the catapult
        me.game.add(new game.Rope(catapult.body, rect.body, cp.v(-100, 0), cp.v(20, 0), 80, 0.005), 1001);

        // Then add a bunch of weight to fling the object with the catapult
        me.game.add(new game.Rect(370, c.HEIGHT - 110, 20, 20, {
            "mass" : 50
        }), 1000);

        // Create some pulleys
        var p1 = new game.Circle(300, c.HEIGHT - 300, 10);
        me.game.add(p1, 1000);
        space.addConstraint(new cp.PivotJoint(p1.body, space.staticBody, p1.body.p));

        var p2 = new game.Circle(450, c.HEIGHT - 300, 10);
        me.game.add(p2, 1000);
        space.addConstraint(new cp.PivotJoint(p2.body, space.staticBody, p2.body.p));

        // Create a heavy "door" for the pulleys
        rect = new game.Rect(450, c.HEIGHT - 80, 40, 160, {
            "mass" : 30
        });
        me.game.add(rect, 1000);

        // Create a chain that wraps around the pulleys
        me.game.add(new game.Chain(catapult.body, rect.body, cp.v(100, 0), cp.v(0, 80), [
            cp.v(p1.body.p.x - 10, p1.body.p.y + 10),
            cp.v(p2.body.p.x + 10, p2.body.p.y + 10)
        ]), 1000);

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
