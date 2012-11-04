game.Rect = me.Rect.extend({
    "init" : function init(x, y, w, h, c) {
        var space = cm.getSpace();

        this.parent(new me.Vector2d(x - (w / 2), y - (h / 2)), w, h);
        this.visible = true;

        this.color = c;

        this.body = new cp.Body(1, cp.momentForBox(1, w, h));
        var shape = space.addShape(new cp.BoxShape(this.body, w, h));
        shape.setElasticity(0.3);
        shape.setFriction(0.5);

        this.body.p = cp.v(x, me.video.getHeight() - y);
        space.addBody(this.body);
    },

    "update" : function update() {
        var p = this.body.p,
            pos = this.pos;

        pos.x = p.x;
        pos.y = p.y;

        return ((this.body.vx != 0) || (this.body.vy != 0));
    },

    "draw" : function draw(context) {
        var b = this.body,
            p = b.p,
            w = this.width,
            h = this.height;

        context.save();
        context.fillStyle = this.color;
        context.translate(p.x, me.video.getHeight() - p.y);
        context.rotate(-b.a);
        context.fillRect(-w / 2, -h / 2, w, h);
        context.restore();
    }
});
