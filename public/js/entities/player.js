game.Player = Object.extend({
    "init" : function init(x, y) {
        var space = cm.getSpace();

        this.visible = true;

        this.body = new cp.Body(1, Infinity);
        var shape = space.addShape(new cp.CircleShape(this.body, 25, cp.vzero));
        shape.setElasticity(0.3);
        shape.setFriction(0.8);
        shape.setLayers(c.LAYER_SHAPES);

        this.body.p = cp.v(x, c.HEIGHT - y);
        space.addBody(this.body);

        this.lastPressed = [ false, false ];

        this.ticks = 0;
    },

    "update" : function update() {
        var b = this.body,
            pressed = [
                me.input.isKeyPressed("left"),
                me.input.isKeyPressed("right")
            ];

        if (pressed[0] && !this.lastPressed[0]) {
            this.move(-200);
        }
        else if (pressed[1] && !this.lastPressed[1]) {
            this.move(200);
        }
        else if ((!pressed[0] && this.lastPressed[0]) || (!pressed[1] && this.lastPressed[1])) {
            this.move(0);
        }

        this.lastPressed = pressed;

        return ((b.vx != 0) || (b.vy != 0));
    },

    "touch" : function touch(e) {
        var vp = me.game.viewport,
            touch = me.input.touches[0];

        if (touch.x >= vp.width * 0.75) {
            // Right
            this.move(200);
        }
        else if (touch.x < vp.width * 0.25) {
            // Left
            this.move(-200);
        }
    },

    "touchEnd" : function touchEnd(e) {
        this.move(0);
    },

    "move" : function move(velocity) {
        var b = this.body;

        if (velocity) {
            b.activate();
        }
        b.shapeList[0].surface_v = cp.v(velocity, 0);
    },

    "draw" : function draw(context) {
        var p = this.body.p,
            ticks = this.ticks,
            step = ticks * 0.1;

        this.ticks++;


        function ellipse(cx, cy, w, h) {
            context.beginPath();
            var lx = cx - w / 2,
                rx = cx + w / 2,
                ty = cy - h / 2,
                by = cy + h / 2;

            var magic = 0.551784;
            var xmagic = magic * w / 2;
            var ymagic = magic * h / 2;

            context.moveTo(cx, ty);
            context.bezierCurveTo(cx + xmagic, ty, rx, cy - ymagic, rx, cy);
            context.bezierCurveTo(rx, cy + ymagic, cx + xmagic, by, cx, by);
            context.bezierCurveTo(cx - xmagic, by, lx, cy + ymagic, lx, cy);
            context.bezierCurveTo(lx, cy - ymagic, cx - xmagic, ty, cx, ty);
            context.fill();
            context.stroke();
        }


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
        context.fillStyle = "#444";
        context.rotate(wobble);
        ellipse(0, 0, 50, 25 + stretch);


        // Draw rotating line
        context.beginPath();
        context.moveTo(-Math.cos(step) * 25, -Math.sin(step) * 12.5 - Math.abs(stretch / 2));
        context.lineTo(Math.cos(step) * 25, Math.sin(step) * 12.5 + Math.abs(stretch / 2));
        context.fill();
        context.stroke();


        // Draw dome
        context.fillStyle = "#666";
        context.beginPath();
        context.moveTo(-12.5, 0);
        context.arc(0, 0, 12.5, Math.PI, 0);
        context.arc(0, -21, 25, Math.PI * 0.35, Math.PI * 0.65);
        context.closePath();
        context.fill();
        context.stroke();

        context.restore();
    }
});
