game.Chain = Object.extend({
    "init" : function init(body1, body2, anchor1, anchor2, points, settings) {
        var self = this;

        points = points || [];
        settings = settings || {};

        // Default settings
        settings.color = settings.color || [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ];
        settings.mass = settings.mass || 1;
        settings.group = c.GROUP_CHAIN;
        settings.elasticity = settings.elasticity || 0;
        settings.friction = settings.friction || 0.5;

        var space = cm.getSpace();

        // Segment size
        var w = 10,
            h = 5,
            hw = w / 2,
            hh = h / 2;

        function createSegment(x, y, neighbor, anchor) {
            var rect = new game.Rect(x, y, w, h, settings);
            var angle = cp.v.toangle(cp.v.normalize(cp.v.sub(neighbor.p, rect.body.p)));
            rect.body.setAngle(angle);

            space.addConstraint(new cp.PivotJoint(neighbor, rect.body, anchor, cp.v(hw, 0)));

            return rect;
        }

        body1.shapeList[0].group = c.GROUP_CHAIN;
        body2.shapeList[0].group = c.GROUP_CHAIN;

        this.a1 = anchor1;
        this.a2 = anchor2;
        this.segments = [];

        // Create segments between each point
        var neighbor = body1,
            anchor = anchor1,
            last_point = cp.v.add(body1.p, anchor1),
            pos = null,
            segment = null;

        points.push(cp.v.add(body2.p, anchor2));
        points.forEach(function (point) {
            var len = cp.v.dist(last_point, point) / w;
            for (var i = 1; i < len; i++) {
                pos = cp.v.lerpconst(last_point, point, i * w);
                segment = createSegment(pos.x, c.HEIGHT - pos.y, neighbor, anchor);
                self.segments.push(segment);

                neighbor = segment.body;
                anchor = cp.v(-hw, 0);
            }

            last_point = point;
        });

        // Add final pivot to body 2
        space.addConstraint(new cp.PivotJoint(neighbor, body2, cp.v(-hw, 0), anchor2));

        this.visible = true;
    },

    "update" : function update() {
        return this.segments.some(function (segment) {
            return (segment.body.vx != 0 || segment.body.vy != 0);
        });
    },

    "draw" : function draw(context) {
        this.segments.forEach(function (segment) {
            segment.draw(context);
        });
    }
});
