game.Circle = me.Rect.extend({
    "init" : function init(x, y, r, c, isBalloon) {
        var space = cm.getSpace();

        this.parent(new me.Vector2d(x - r, y - r), r, r);
        this.visible = true;

        this.r = r;
        this.color = c;

        var b = this.body = new cp.Body(1, cp.momentForCircle(1, 0, r, cp.vzero));
        var shape = space.addShape(new cp.CircleShape(b, r, cp.vzero));
        shape.setElasticity(0.3);
        shape.setFriction(0.5);

        if (isBalloon) {
            var vf = b.velocity_func;
            var tg = cp.v(0, 550);
            b.velocity_func = function velocity_func(g, d, dt) {
                vf.bind(b)(tg, d, dt);
            }
        }

        b.p = cp.v(x, me.video.getHeight() - y);
        space.addBody(b);
    },

    "update" : function update() {
        var b = this.body,
            p = b.p,
            pos = this.pos;

        pos.x = p.x;
        pos.y = p.y;

        return ((b.vx != 0) || (b.vy != 0));
    },

    "draw" : function draw(context) {
        var b = this.body,
            p = b.p;

        context.save();

        context.translate(p.x, me.video.getHeight() - p.y);
        context.rotate(-b.a);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.r, 0);
        context.arc(0, 0, this.r, 0, Math.PI * 2);

        context.fillStyle = b.isSleeping() ? "gray" : this.color;
        context.fill();

        context.strokeStyle = "black";
        context.stroke();

        context.restore();
    }
});
