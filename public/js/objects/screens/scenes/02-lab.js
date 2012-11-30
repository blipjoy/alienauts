game.Scene02 = game.Scene01.extend({
    "exit" : me.state.SCENE03,

    "onResetEvent" : function onResetEvent() {
        this.parent();

        var space = cm.getSpace(),
            h = c.HEIGHT * 0.33;

        // Create an obstacle.
        me.game.add(new game.Line(
            cp.v(c.WIDTH - 200, h),
            cp.v(c.WIDTH - 200, c.HEIGHT * 0.40),
            3,
            {
                "elasticity" : 1,
                "friction" : 1,
                "color" : "transparent"
            }
        ), 1000);

        // Create a balloon.
        var balloon = new game.Circle(
            c.WIDTH * 0.5,
            c.HEIGHT * 0.4,
            20,
            {
                "mass" : -0.8
            }
        );
        me.game.add(balloon, 1003);

        // Attach balloon with a rope.
        me.game.add(new game.Rope(balloon.body, space.staticBody, cp.v(0, -10), cp.v(c.WIDTH * 0.5, h), 100, {
            "mass" : 0.2
        }), 1002);

        // Create a second scientist.
        me.game.add(new game.Scientist((Math.random() * 250) + 250, c.HEIGHT - 90, {
            "direction" : 1,
            "head" : 0
        }), 2000);
    },

    "draw" : function draw(context) {
        this.parent(context);

        context.fillStyle = "#ddf";

        // Draw obstacle
        var x = c.WIDTH - 200;
        var y = c.HEIGHT / 2;

        // Left face
        context.beginPath();
        context.moveTo(x - 20, c.HEIGHT * 0.35);
        context.lineTo(x + 20, c.HEIGHT * 0.45);
        context.lineTo(x + 20, y + 100);
        context.lineTo(x - 20, y);
        context.closePath();
        context.stroke();
        context.fill();

        // Top face
        context.fillStyle = "#ccd";
        context.beginPath();
        context.moveTo(x - 20, c.HEIGHT * 0.35);
        context.lineTo(x - 10, c.HEIGHT * 0.35);
        context.lineTo(x + 34, c.HEIGHT * 0.45);
        context.lineTo(x + 20, c.HEIGHT * 0.45);
        context.closePath();
        context.stroke();
        context.fill();

        // Front face
        context.fillStyle = "#bbc";
        context.beginPath();
        context.moveTo(x + 20, c.HEIGHT * 0.45);
        context.lineTo(x + 34, c.HEIGHT * 0.45);
        context.lineTo(x + 34, y + 100);
        context.lineTo(x + 20, y + 100);
        context.closePath();
        context.stroke();
        context.fill();
    }
});
