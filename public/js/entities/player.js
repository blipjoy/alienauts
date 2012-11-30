game.Player = me.Rect.extend({
    "init" : function init(x, y) {
        this.r = 25;
        this.parent(new me.Vector2d(x - this.r, y - this.r), this.r * 2, this.r * 2);

        var space = cm.getSpace();

        this.visible = true;

        this.body = new cp.Body(1, Infinity);
        var shape = space.addShape(new cp.CircleShape(this.body, this.r, cp.vzero));
        shape.setElasticity(0.3);
        shape.setFriction(0.8);
        shape.setLayers(c.LAYER_SHAPES);
        shape.collision_type = c.TYPE_PLAYER;
        shape.entity = this;

        this.body.p = cp.v(x, c.HEIGHT - y);
        space.addBody(this.body);

        this.touch_pos = false;

        this.ticks = 0;
    },

    "update" : function update() {
        var p = this.body.p,
            r = this.r,
            r2 = r * 2;

        if (this.touch_pos && (
            (this.velocity > 0 && p.x > this.touch_pos.x - r2) ||
            (this.velocity < 0 && p.x < this.touch_pos.x + r2)
            )) {
            this.move(0);
        }

        // Sync melonJS Rect with Chipmunk body
        this.pos.x = p.x - r;
        this.pos.y = c.HEIGHT - p.y - r;

        // Reset the light level
        this.lightlevel = 0;

        // Always animate
        return true;
    },

    "touch" : function touch(e) {
        this.touch_pos = me.input.touches[0];
    },

    "drag" : function drag(e) {
        if (this.touch_pos) {
            var r = this.r,
                p = this.body.p,
                touch = me.input.touches[0];

            if (touch.x > p.x + r) {
                this.move(200);
            }
            else if (touch.x < p.x - r) {
                this.move(-200);
            }

            this.touch_pos = touch;
        }
    },

    "touchEnd" : function touchEnd(e) {
        this.touch_pos = false;
        this.move(0);
    },

    "move" : function move(velocity) {
        var b = this.body;

        this.velocity = velocity;
        if (velocity) {
            b.activate();
        }
        b.shapeList[0].surface_v = cp.v(velocity, 0);
    },

    "draw" : function draw(context) {
        var p = this.body.p,
            r = this.r,
            ticks = this.ticks++,
            step = ticks * 0.1,
            lightlevel = Math.max(this.lightlevel, game.scene.lightlevel);


        function ellipse(x, y, w, h) {
            context.beginPath();
            var hw = w / 2,
                hh = h / 2,
                lx = x - hw,
                rx = x + hw,
                ty = y - hh,
                by = y + hh;

            var xmagic = hw * 0.551784,
                ymagic = hh * 0.551784,
                xmin = x - xmagic,
                xmax = x + xmagic,
                ymin = y - ymagic,
                ymax = y + ymagic;

            context.moveTo(x, ty);
            context.bezierCurveTo(xmax, ty, rx, ymin, rx, y);
            context.bezierCurveTo(rx, ymax, xmax, by, x, by);
            context.bezierCurveTo(xmin, by, lx, ymax, lx, y);
            context.bezierCurveTo(lx, ymin, xmin, ty, x, ty);
            context.fill();
            context.stroke();
        }


        // Animation
        var wobble = Math.cos(step) * (Math.PI / 25),
            stretch = Math.sin(step) * 5;


        context.save();

        context.translate(p.x, c.HEIGHT - p.y - 13 + stretch);

        // Draw beams
        context.lineCap = "round";
        context.lineWidth = 5;

        function beam(r) {
            var a = Math.PI * 0.25;
            context.beginPath();
            context.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            context.arc(0, 0, r, a, Math.PI * 0.75);
            context.stroke();
        }

        var alpha = ((1 / 10) * (ticks % 10)) * 0.333;
        context.strokeStyle = "rgba(128, 128, 0, " + (1 - alpha) + ")";
        beam(10 + (ticks % 10));
        context.strokeStyle = "rgba(128, 128, 0, " + (0.666 - alpha) + ")";
        beam(20 + (ticks % 10));
        context.strokeStyle = "rgba(128, 128, 0, " + (0.333 - alpha) + ")";
        beam(30 + (ticks % 10));


        // Draw saucer body
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.fillStyle = game.getColor(game.darkenColor([ 0x66, 0x66, 0x66 ], lightlevel));
        context.rotate(wobble);
        ellipse(0, 0, r * 2, r + stretch);


        // Draw rotating line
        var x = Math.cos(step) * r,
            y = (Math.sin(step) * r + Math.abs(stretch)) / 2;

        context.beginPath();
        context.moveTo(-x, -y);
        context.lineTo(x, y);
        context.fill();
        context.stroke();


        // Draw dome
        context.fillStyle = game.getColor(game.darkenColor([ 0x88, 0x88, 0x88 ], lightlevel));
        context.beginPath();
        context.moveTo(-r / 2, 0);
        context.arc(0, 0, r / 2, Math.PI, 0);
        context.arc(0, -21, r, Math.PI * 0.35, Math.PI * 0.65);
        context.closePath();
        context.fill();
        context.stroke();

        context.restore();
    }
});
