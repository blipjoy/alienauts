game.Scene01 = game.PlayScreen.extend({
    // Exit to next scene
    "exit" : me.state.SCENE02,

    // Tutorial object definition
    "tutorial" : {
        "ticks" : 0,
        "anim" : function (context, ticks) {
            context.drawImage(
                me.loader.getImage("ship"),
                35 + Math.sin(ticks * 0.05) * 20,
                30
            );

            context.drawImage(
                me.loader.getImage("hand"),
                45 + (Math.sin(ticks * 0.05) + Math.cos(ticks * 0.05)) * 20,
                40
            );
        }
    },

    "init" : function init() {
        this.parent.apply(this, arguments);

        this.lightlevel = 1;
        this.color = "#ddf";
    },

    "onResetEvent" : function onResetEvent() {
        var self = this;
        game.scene = this;

        var h = c.HEIGHT * 0.333;

        // Create a floor.
        var settings = {
            "elasticity" : 1,
            "friction" : 1,
            "color" : c.DEBUG ? "red" : "transparent"
        };
        me.game.add(new game.Line(
            cp.v(0, h),
            cp.v(c.WIDTH, h),
            3,
            settings
        ), 1000);

        // And walls.
        me.game.add(new game.Line(
            cp.v(50, h),
            cp.v(50, c.HEIGHT),
            3,
            settings
        ), 1000);
        me.game.add(new game.Exit(
            cp.v(c.WIDTH - 25, h),
            cp.v(c.WIDTH - 25, c.HEIGHT),
            {
                "color" : this.color,
                "to" : this.exit
            }
        ), 1999);

        // And ceiling.
        me.game.add(new game.Line(
            cp.v(0, c.HEIGHT),
            cp.v(c.WIDTH, c.HEIGHT),
            3,
            settings
        ), 1000);


        // Create player entity.
        game.player = new game.Player(140, c.HEIGHT * 0.666 - 25);
        me.game.add(game.player, 1001);

        // Spawn a tutorial object after 15 seconds.
        this.tutorialTimer = setTimeout(function () {
            me.game.add(new game.Tutorial(self.tutorial), 1001);
            me.game.sort();
        }, 15000);


        // Create the observation window.
        me.game.add(new game.ObservationRoom(), 2000);

        // Create a scientist.
        me.game.add(new game.Scientist((Math.random() * 200) + 100, c.HEIGHT - 90, {
            "direction" : -1,
            "head" : 1
        }), 2000);

        this.parent();
    },

    "onDestroyEvent" : function onDestroyEvent() {
        clearTimeout(this.tutorialTimer);

        this.parent();
    },

    "draw" : function draw(context) {
        var hh = c.HEIGHT / 2;

        this.parent(context);

        context.lineWidth = 1;
        context.strokeStyle = "#aaa";
        context.fillstyle = "#141414";


        // Perspective lines
        context.beginPath();
        context.moveTo(0, hh + 100);
        context.lineTo(100, hh);
        context.lineTo(c.WIDTH - 100, hh);
        context.lineTo(c.WIDTH, hh + 100);
        context.moveTo(100, 0);
        context.lineTo(100, hh);
        context.moveTo(c.WIDTH - 100, 0);
        context.lineTo(c.WIDTH - 100, hh);
        context.stroke();

        // Closed door
        context.beginPath();
        context.moveTo(75, hh + 25);
        context.lineTo(75, c.HEIGHT * 0.20);
        context.lineTo(25, c.HEIGHT * 0.23);
        context.lineTo(25, hh + 75);
        context.stroke();

        // Door
        context.beginPath();
        context.moveTo(c.WIDTH - 75, hh + 25);
        context.lineTo(c.WIDTH - 75, c.HEIGHT * 0.20);
        context.lineTo(c.WIDTH - 25, c.HEIGHT * 0.23);
        context.lineTo(c.WIDTH - 25, hh + 75);
        context.closePath();
        context.fill();
        context.stroke();
    }
});
