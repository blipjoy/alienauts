game.Rope = Object.extend({
    "init" : function init(body1, body2, anchor1, anchor2, length, m) {
        var space = cm.getSpace();

        this.c1 = body1;
        this.c4 = body2;
        this.a1 = anchor1;
        this.a2 = anchor2;

        function createControlPoint(endpoint, anchor, p, l) {
            var body = new cp.Body(m, Infinity);
            body.p.x = p.x;
            body.p.y = p.y;

            // Default control radius is 3
            var shape = space.addShape(new cp.CircleShape(body, 3, cp.vzero));
            shape.setElasticity(0);
            shape.setFriction(0.5);
            shape.setLayers(c.LAYER_ROPES);
            shape.group = c.GROUP_ROPE;

            space.addBody(body);

            // The control point is attached to its endpoint via a slide joint.
            space.addConstraint(new cp.SlideJoint(endpoint, body, anchor, cp.vzero, 0, l));

            return body;
        }

        // FIXME: Determine proper segment length for control point.
        var seglenth = Math.round(length / 3);

        // Calculate midpoint between both endpoints.
        var mid = cp.v(
            game.midpoint(body1.p.x, body2.p.x),
            game.midpoint(body1.p.y, body2.p.y)
        );

        // Create two control points
        var c2 = this.c2 = createControlPoint(body1, anchor1, mid, seglenth);
        var c3 = this.c3 = createControlPoint(body2, anchor2, mid, seglenth);

        // Both control points are attached via a slide joint.
        space.addConstraint(new cp.SlideJoint(c2, c3, cp.vzero, cp.vzero, 0, seglenth));

        this.visible = true;
    },

    "update" : function update() {
        return (
            (this.c1.vx != 0) || (this.c1.vy != 0) ||
            (this.c2.vx != 0) || (this.c2.vy != 0) ||
            (this.c3.vx != 0) || (this.c3.vy != 0) ||
            (this.c4.vx != 0) || (this.c4.vy != 0)
        );
    },

    "draw" : function draw(context) {
        var h = me.video.getHeight();
        var rot1 = cp.v.rotate(this.a1, this.c1.rot);
        var rot2 = cp.v.rotate(this.a2, this.c4.rot);

        context.save();

        context.beginPath();
        context.moveTo(
            this.c1.p.x + rot1.x, h - this.c1.p.y - rot1.y
        );
        context.bezierCurveTo(
            this.c2.p.x, h - this.c2.p.y,
            this.c3.p.x, h - this.c3.p.y,
            this.c4.p.x + rot2.x, h - this.c4.p.y - rot2.y
        );

        context.strokeStyle = "#222";
        context.lineWidth = 3;
        context.lineCap = "round";
        context.stroke();

        context.restore();
    }
});
