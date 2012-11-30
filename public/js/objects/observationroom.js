game.ObservationRoom = Object.extend({
    "init" : function init(settings) {
        this.visible = true;

        settings = settings || {};

        this.color = settings.color || "#141414";

        // Cache border
        var w = c.WIDTH,
            h = c.HEIGHT,
            r = 10; // rounded corner radius

        this.border = me.video.createCanvasSurface(w, h);

        this.border.beginPath();
        this.border.rect(0, 0, w, h);
        this.border.moveTo(r, r + r);
        this.border.arcTo(r, h - r, w - r, h - r, r);
        this.border.arcTo(w - r, h - r, w - r, r, r);
        this.border.arcTo(w - r, r, r, r, r);
        this.border.arcTo(r, r, r, h - r, r);
        this.border.fillStyle = this.color;
        this.border.fill();

        this.ticks = 0;
    },

    "update" : function update() {
        return false;
    },

    "draw" : function draw(context) {
        // Draw window border
        context.drawImage(this.border.canvas, 0, 0);
    }
});
