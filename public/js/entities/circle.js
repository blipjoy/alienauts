game.Circle = me.Rect.extend({
    "init" : function init(x, y, r, settings) {
        settings = settings || {};

        // Default settings
        settings.color = settings.color || [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ];
        settings.mass = settings.mass || 1;
        settings.group = settings.group || 0;
        settings.isBalloon = settings.isBalloon || false;
        settings.elasticity = settings.elasticity || 0.3;
        settings.friction = settings.friction || 0.5;

        var space = cm.getSpace();
        var r2 = r * 2;

        this.parent(new me.Vector2d(x - r, y - r), r2, r2);
        this.visible = true;

        this.r = r;
        this.color = settings.color;

        var b = this.body = new cp.Body(settings.mass, cp.momentForCircle(settings.mass, 0, r, cp.vzero));
        var shape = space.addShape(new cp.CircleShape(b, r, cp.vzero));
        shape.setElasticity(settings.elasticity);
        shape.setFriction(settings.friction);
        shape.setLayers(c.LAYER_SHAPES);
        shape.group = settings.group;

        // FIXME
        if (settings.isBalloon) {
            var vf = b.velocity_func;
            var tg = cp.v(0, 600);
            b.velocity_func = function velocity_func(g, d, dt) {
                vf.bind(b)(tg, d, dt);
            }
        }

        b.p = cp.v(x, c.HEIGHT - y);
        space.addBody(b);
    },

    "update" : function update() {
        var b = this.body,
            p = b.p,
            pos = this.pos;

        pos.x = p.x - this.r;
        pos.y = c.HEIGHT - p.y - this.r;

        return ((b.vx != 0) || (b.vy != 0));
    },

    "draw" : function draw(context) {
        var b = this.body,
            p = b.p;

        context.save();

        context.translate(p.x, c.HEIGHT - p.y);
        context.rotate(-b.a);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.r, 0);
        context.arc(0, 0, this.r, 0, Math.PI * 2);

        context.fillStyle = game.getColor(this.color);
        context.fill();

        context.strokeStyle = "black";
        context.stroke();

        context.restore();
    }
});
