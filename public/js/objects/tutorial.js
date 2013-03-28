game.Tutorial = me.Renderable.extend({
    "init" : function init(tutorial) {
        this.tutorial = tutorial;
        this.cloud = me.loader.getImage("cloud");

        this.parent(new me.Vector2d(
            game.player.pos.x - 25,
            game.player.pos.y - this.cloud.height - 10
        ), this.cloud.width, this.cloud.height);
        this.name = "tutorial";
    },

    "update" : function update() {
        // FIXME
        return true;
    },

    "draw" : function draw(context) {
        var x = this.pos.x = game.player.pos.x - 25,
            y = this.pos.y = game.player.pos.y - this.cloud.height - 10;

        context.save();

        context.translate(x, y);

        context.drawImage(this.cloud, 0, 0);
        this.tutorial.anim(context, this.tutorial.ticks++);

        context.restore();
    }
});
