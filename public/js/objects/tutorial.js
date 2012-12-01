game.Tutorial = Object.extend({
    "init" : function init(tutorial) {
        this.tutorial = tutorial;
        this.cloud = me.loader.getImage("cloud");

        this.visible = true;
    },

    "update" : function update() {
        // FIXME
        return true;
    },

    "draw" : function draw(context) {
        var x = game.player.pos.x - 25,
            y = game.player.pos.y - this.cloud.height - 10;

        context.save();

        context.translate(x, y);

        context.drawImage(this.cloud, 0, 0);
        this.tutorial.anim(context, this.tutorial.ticks++);

        context.restore();
    }
});
