game.Rect = me.Rect.extend({
    "init" : function init(x, y, w, h, settings) {
        settings = settings || {};

        // Default settings
        settings.color = settings.color || "#"
            + game.toHex(Math.floor(Math.random() * 256))
            + game.toHex(Math.floor(Math.random() * 256))
            + game.toHex(Math.floor(Math.random() * 256));
        settings.mass = settings.mass || 1;
        settings.group = settings.group || 0;

        var space = cm.getSpace();

        this.parent(new me.Vector2d(x - (w / 2), y - (h / 2)), w, h);
        this.visible = true;

        this.color = settings.color;

        var b = this.body = new cp.Body(settings.mass, cp.momentForBox(settings.mass, w, h));
        var shape = space.addShape(new cp.BoxShape(b, w, h));
        shape.setElasticity(0.3);
        shape.setFriction(0.5);
        shape.setLayers(c.LAYER_SHAPES);
        shape.group = settings.group;

        b.p = cp.v(x, me.video.getHeight() - y);
        space.addBody(b);
    },

    "update" : function update() {
        var b = this.body,
            p = b.p,
            pos = this.pos;

        pos.x = p.x - b.hw;
        pos.y = me.video.getHeight() - p.y - b.hw;

        return ((b.vx != 0) || (b.vy != 0));
    },

    "draw" : function draw(context) {
        var b = this.body,
            p = b.p,
            w = this.width,
            h = this.height,
            hw = -w / 2,
            hh = -h / 2;

        context.save();

        context.translate(p.x, me.video.getHeight() - p.y);
        context.rotate(-b.a);

        context.fillStyle = b.isSleeping() ? "gray" : this.color;
        context.fillRect(hw, hh, w, h);

        context.strokeStyle = "black";
        context.strokeRect(hw, hh, w, h);

        context.restore();
    }
});
