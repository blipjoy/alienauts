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
        settings.layers = settings.layers || c.LAYER_SHAPES;
        settings.group = settings.group || 0;
        settings.collision_type = settings.collision_type || 0;
        settings.elasticity = settings.elasticity || 0.3;
        settings.friction = settings.friction || 0.5;

        this.settings = settings;

        var space = cm.getSpace();
        var r2 = r * 2;

        this.parent(new me.Vector2d(x - r, y - r), r2, r2);
        this.visible = true;
        this.name = "circle";

        this.r = r;
        this.color = settings.color;

        var b = this.body = new cp.Body(Math.abs(settings.mass), cp.momentForCircle(Math.abs(settings.mass), 0, r, cp.vzero));
        var shape = space.addShape(new cp.CircleShape(b, r, cp.vzero));
        shape.setElasticity(settings.elasticity);
        shape.setFriction(settings.friction);
        shape.setLayers(settings.layers);
        shape.group = settings.group;
        shape.collision_type = settings.collision_type;
        shape.entity = this;

        // FIXME
        if (settings.mass < 0) {
            var vf = b.velocity_func;
            b.velocity_func = function velocity_func(g, d, dt) {
                var tg = cp.v(g.x, g.y * settings.mass);
                vf.bind(b)(tg, d, dt);
            }
        }

        b.p = cp.v(x, c.HEIGHT - y);
        space.addBody(b);
    },

    "update" : function update() {
        var b = this.body,
            p = b.p,
            r = this.r;

        // Sync melonJS Rect with Chipmunk body
        this.pos.x = p.x - r;
        this.pos.y = c.HEIGHT - p.y - r;

        // Reset the light level
        this.lightlevel = this.name === "lightsource" ? 1 : 0;

        return ((b.vx != 0) || (b.vy != 0));
    },

    "draw" : function draw(context) {
        var b = this.body,
            p = b.p,
            lightlevel = Math.max(this.lightlevel, game.scene.lightlevel);

        context.save();

        context.translate(p.x, c.HEIGHT - p.y);
        context.rotate(-b.a);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.r, 0);
        context.arc(0, 0, this.r, 0, Math.PI * 2);

        context.fillStyle = game.getColor(game.darkenColor(this.color, lightlevel));
        context.fill();

        context.strokeStyle = "black";
        context.stroke();

        context.restore();
    }
});
