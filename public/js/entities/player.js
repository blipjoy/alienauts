game.Player = me.Rect.extend({
    "init" : function init(x, y) {
        var space = cm.getSpace();
        var w = 32,
            h = 64,
            color = "pink";

        this.parent(new me.Vector2d(x - (w / 2), y - (h / 2)), w, h);
        this.visible = true;

        this.color = color;

        this.body = new cp.Body(1, Infinity);
        var shape = space.addShape(new cp.BoxShape(this.body, w, h));
        shape.setElasticity(0.3);
        shape.setFriction(0.8);
        shape.setLayers(c.LAYER_SHAPES);

        this.body.p = cp.v(x, me.video.getHeight() - y);
        space.addBody(this.body);

        this.lastPressed = [ false, false ];
    },

    "update" : function update() {
        var b = this.body,
            p = b.p,
            pos = this.pos,
            pressed = [
                me.input.isKeyPressed("left"),
                me.input.isKeyPressed("right")
            ];

        pos.x = p.x - b.hw;
        pos.y = me.video.getHeight() - p.y - b.hw;

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
            b.shapeList[0].surface_v = cp.v(velocity, 0);
        }
        else {
            b.shapeList[0].surface_v = cp.vzero;
        }
    },

    "draw" : function draw(context) {
        var b = this.body,
            p = b.p,
            w = this.width,
            h = this.height,
            hw = -w / 2,
            hh = -h / 2;

        context.save();

        // FIXME: We probably shouldn't worry about rotation.
        context.translate(p.x, me.video.getHeight() - p.y);
        context.rotate(-b.a);

        context.fillStyle = b.isSleeping() ? "gray" : this.color;
        context.fillRect(hw, hh, w, h);

        context.lineWidth = 3;
        context.strokeStyle = "black";
        context.strokeRect(hw, hh, w, h);

        context.restore();
    }
});
