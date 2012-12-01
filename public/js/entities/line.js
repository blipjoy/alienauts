game.Line = Object.extend({
    "init" : function init(a, b, r, settings) {
        settings = settings || {};

        // Default settings
        settings.color = settings.color || [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ];
        settings.mass = settings.mass || 1;
        settings.group = settings.group || 0;
        settings.collision_type = settings.collision_type || c.TYPE_SOLID;
        settings.elasticity = settings.elasticity || 0.3;
        settings.friction = settings.friction || 0.5;

        var space = cm.getSpace();

        this.visible = true;
        this.name = "line";

        this.color = settings.color;
        this.r = r;

        var shape = this.shape = space.addShape(new cp.SegmentShape(space.staticBody, a, b, r));
        shape.setElasticity(settings.elasticity);
        shape.setFriction(settings.friction);
        shape.setLayers(c.LAYER_SHAPES | c.LAYER_AIRFLOW);
        shape.group = settings.group;
        shape.collision_type = settings.collision_type;
        shape.entity = this;
    },

    "update" : function update() {
        // FIXME
        return false;
    },

    "draw" : function draw(context) {
        if (this.color === "transparent") {
            return;
        }

        var shape = this.shape,
            a = shape.a,
            b = shape.b;

        context.save();

        context.beginPath();
        context.moveTo(a.x, c.HEIGHT - a.y);
        context.lineTo(b.x, c.HEIGHT - b.y);

        context.lineWidth = this.r;
        context.lineCap = "round";
        context.strokeStyle = game.getColor(this.color);
        context.stroke();

        context.restore();
    }
});
