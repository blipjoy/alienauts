/* Create a Chipmunk collision handler for exits */
game.installAirFlowHandler = function installAirFlowHandler() {
    if (!game.airFlowHandlerInstalled) {
        game.airFlowHandlerInstalled = true;
        cm.getSpace().addCollisionHandler(
            c.TYPE_AIRFLOW,
            c.TYPE_BALLOON,
            null,
            function balloon_current(arbiter, space) {
                var shapes = arbiter.getShapes(),
                    current = shapes[0].entity,
                    balloon = shapes[1].body;

                balloon.applyImpulse(current.force, cp.vzero);
                return true;
            }
        );
    }
};

game.AirFlow = me.Renderable.extend({
    "init" : function init(x, y, w, h, settings) {
        this.parent(new me.Vector2d(x, y), w, h);
        this.name = "air flow";

        settings = settings || {};

        // Default settings
        settings.color = settings.color || [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ];
        settings.force = settings.force || cp.v(1, 0);

        var space = cm.getSpace();
        var bb = new cp.BB(x, c.HEIGHT - y - h, x + w, c.HEIGHT - y);
        var shape = space.addShape(new cp.BoxShape2(space.staticBody, bb));
        shape.setSensor(true);
        shape.setLayers(c.LAYER_AIRFLOW);
        shape.collision_type = c.TYPE_AIRFLOW;
        shape.entity = this;

        this.color = settings.color;
        this.force = settings.force;

        if (!c.DEBUG) {
            this.visible = false;
        }
    },

    "update" : function update() {
        // FIXME
        return true;
    },

    "draw" : function draw(context) {
        var x = this.pos.x,
            y = this.pos.y,
            w = this.width,
            h = this.height,
            hw = this.hWidth,
            hh = this.hHeight,
            r = Math.min(hw, hh),
            force = this.force;

        context.save();
        context.strokeStyle = context.fillStyle = game.getColor(this.color);
        context.strokeRect(x, y, w, h);

        context.translate(x + hw, y + hh);
        context.rotate(cp.v.toangle(cp.v(force.x, -force.y)));

        context.beginPath();
        context.moveTo(-r, r * -0.333);
        context.lineTo(r * 0.333, r * -0.333);
        context.lineTo(r * 0.333, -r);
        context.lineTo(r, 0);
        context.lineTo(r * 0.333, r);
        context.lineTo(r * 0.333, r * 0.333);
        context.lineTo(-r, r * 0.333);
        context.closePath();

        context.fill();
        context.restore();
    }
})
