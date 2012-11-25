game.Poly = Object.extend({
    "init" : function init(x, y, verts, center, settings) {
        settings = settings || {};

        // Default settings
        settings.color = settings.color || [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ];
        settings.mass = settings.mass || 1;
        settings.group = settings.group || 0;
        settings.elasticity = settings.elasticity || 0.3;
        settings.friction = settings.friction || 0.5;

        this.visible = true;
        this.color = settings.color;

        var b = this.body = new cp.Body(settings.mass, cp.momentForPoly(settings.mass, verts, center));
        var space = cm.getSpace();
        var shape = space.addShape(new cp.PolyShape(b, verts, center));
        shape.setElasticity(settings.elasticity);
        shape.setFriction(settings.friction);
        shape.setLayers(c.LAYER_SHAPES);
        shape.group = settings.group;

        b.p = cp.v(x, c.HEIGHT - y);
        space.addBody(b);
    },

    "update" : function update() {
        var b = this.body;

        return ((b.vx != 0) || (b.vy != 0));
    },

    "draw" : function draw(context) {
        var body = this.body,
            p = body.p,
            verts = body.shapeList[0].verts;

        context.save();

        context.translate(p.x, c.HEIGHT - p.y);
        context.rotate(-body.a);

        context.beginPath();
        context.moveTo(verts[0], -verts[1]);

        var len = verts.length;
        for (var i = 2; i < len; i += 2) {
            context.lineTo(verts[i], -verts[i + 1]);
        }

        context.closePath();

        context.fillStyle = game.getColor(this.color);
        context.fill();

        context.strokeStyle = "black";
        context.stroke();

        context.restore();
    }
});
