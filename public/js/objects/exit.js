/* Create a Chipmunk collision handler for exits */
game.installExitHandler = function installExitHandler() {
    if (!game.exitHandlerInstalled) {
        game.exitHandlerInstalled = true;
        cm.getSpace().addCollisionHandler(
            c.TYPE_PLAYER,
            c.TYPE_EXIT,
            function exit_scene(arbiter, space) {
                me.game.viewport.fadeIn("#000", 250, function () {
                    me.state.change(arbiter.getB().to);

                    return true;
                });
            }
        );
    }
};

game.Exit = me.Renderable.extend({
    "init" : function init(a, b, settings) {
        this.parent(
            new me.Vector2d(
                a.x,
                c.HEIGHT - Math.max(a.y, b.y)
            ),
            c.WIDTH - a.x,
            Math.abs(a.y - b.y)
        );
        this.name = "exit";

        settings = settings || {};
        settings.color = settings.color || "#000";
        settings.to = settings.to || me.state.BLIPJOY;

        this.color = settings.color;

        var space = cm.getSpace();

        this.body = space.staticBody;
        var shape = space.addShape(new cp.SegmentShape(this.body, a, b, 3));
        shape.setLayers(c.LAYER_SHAPES);
        shape.collision_type = c.TYPE_EXIT;
        shape.entity = this;

        shape.to = settings.to;
    },

    "update" : function update() {
        // FIXME
        return true;
    },

    "draw" : function draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.pos.x, this.pos.y, this.w, this.h);
    }
});
