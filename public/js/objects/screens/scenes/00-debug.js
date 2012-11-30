game.Scene00 = game.PlayScreen.extend({
    "onResetEvent" : function onResetEvent() {
        game.scene = this;

        var space = cm.getSpace();

        // Create a floor
        me.game.add(new game.Line(
            cp.v(0, 0),
            cp.v(c.WIDTH, 0),
            3,
            {
                "elasticity" : 1,
                "friction" : 1,
                "color" : "black"
            }
        ), 1002);

        // Create player entity.
        game.player = new game.Player(140, c.HEIGHT - 25);
        me.game.add(game.player, 1002);

        // Create a funky polygon swinging from a rope.
        var verts = [
            -20, 0,
            -13, 15,
            8, 16,
            14, 0,
            9, -13,
            -10, -15
        ];
        var poly = new game.Poly(250, c.HEIGHT - 220, verts, cp.vzero, {
            "color" : "dodgerblue"
        });
        me.game.add(poly, 1002);
        me.game.add(new game.Rope(poly.body, space.staticBody, cp.v(-20, 0), cp.v(270, 220), 130), 1000);

        // Create a circle swinging from a rope.
        var circle = new game.Circle(350, c.HEIGHT - 100, 20, {
            "color" : "indigo"
        });
        me.game.add(circle, 1002);
        me.game.add(new game.Rope(circle.body, space.staticBody, cp.v(0, 20), cp.v(330, 135), 70), 1000);

        // Create a lightsource swinging from a rope.
        var light = new game.LightSource(415, c.HEIGHT - 140, 10, {
            "brightness" : 0.25,
            "intensity" : 100
        });
        me.game.add(light, 1001);
        me.game.add(new game.Rope(light.body, space.staticBody, cp.v(-10, 0), cp.v(400, 175), 100, {
            "mass" : 0.2
        }), 1000);

        // A second linesource is constrained to the wall.
        light = new game.LightSource(200, c.HEIGHT - 80, 10, {
            "brightness" : 0.25,
            "intensity" : 100,
            "off" : true,
            "flickering" : true
        });
        me.game.add(light, 1001);
        space.addConstraint(new cp.PivotJoint(light.body, space.staticBody, cp.vzero, cp.v(200, 80)));

        this.parent();
    },

    "draw" : function draw(context) {
        me.video.clearSurface(context, this.color);
    }
});
