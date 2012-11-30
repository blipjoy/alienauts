game.BlipjoyScreen = me.ScreenObject.extend({
    "regions" : [
        { t: 0, x: 8, y: 0, w: 8, h: 8 },       // Invader
        { t: 500, x: 0, y: 9, w: 3, h: 5 },     // B
        { t: 200, x: 4, y: 9, w: 3, h: 5 },     // L
        { t: 500, x: 8, y: 9, w: 1, h: 5 },     // i
        { t: 150, x: 10, y: 9, w: 3, h: 5 },    // P
        { t: 150, x: 13, y: 9, w: 3, h: 5 },    // J
        { t: 250, x: 17, y: 9, w: 3, h: 5 },    // O
        { t: 500, x: 21, y: 9, w: 3, h: 5 }     // Y
    ],

    "init" : function init() {
        // Simple image resize function using "nearest neighbor"
        // Only works for scaling up
        function resize(image, scale) {
            var iw = image.width,
                ih = image.height,
                ipitch = iw * 4,
                ow = iw * scale,
                oh = ih * scale,
                opitch = ow * 4,
                context = me.video.createCanvasSurface(ow, oh);

            // Get original pixels
            context.drawImage(image, 0, 0);
            var ipixels = context.getImageData(0, 0, iw, ih),
                opixels = context.createImageData(ow, oh);

            var ix = 0,
                iy = 0;

            for (var oy = 0; oy < oh; oy++) {
                iy = Math.floor(oy / scale);
                for (var x = 0, ox = 0; x < ow; x++, ox += 4) {
                    ix = Math.floor(x / scale) * 4;
                    opixels.data[ox + 0 + oy * opitch] = ipixels.data[ix + 0 + iy * ipitch]; // R
                    opixels.data[ox + 1 + oy * opitch] = ipixels.data[ix + 1 + iy * ipitch]; // G
                    opixels.data[ox + 2 + oy * opitch] = ipixels.data[ix + 2 + iy * ipitch]; // B
                    opixels.data[ox + 3 + oy * opitch] = ipixels.data[ix + 3 + iy * ipitch]; // A
                }
            }

            context.putImageData(opixels, 0, 0);

            return context.canvas;
        }

        var img = me.loader.getImage("blipjoy"),
            scale = Math.round(Math.min(
                c.WIDTH / img.width / 3,
                c.HEIGHT / img.height / 3
            ));
        this.logo = resize(img, scale);

        // Resize the regions, too
        var len = this.regions.length,
            r = null;
        for (var i = 0; i < len; i++) {
            r = this.regions[i];
            r.x *= scale;
            r.y *= scale;
            r.w *= scale;
            r.h *= scale;
        }

        this.parent.apply(this, arguments);
    },

    "onResetEvent" : function onResetEvent() {
        var self = this;

        // There are better ways to do this. :)
        self.state = 0;
        self.timeout = setTimeout(function timer() {
            self.state++;
            var r = self.regions[self.state];
            if (r) {
                self.timeout = setTimeout(timer, r.t);
            }
        }, 500);

        setTimeout(function () {
            me.game.viewport.fadeIn("#000", 250, function () {
                me.state.change(me.state.SCENE01);
            });
        }, 5000);
    },

    "onDestroyEvent" : function onDestroyEvent() {
        clearTimeout(this.timeout);
    },

    "update" : function update() {
        return true;
    },

    "draw" : function draw(context) {
        var img = this.logo,
            x = (c.WIDTH - img.width) / 2,
            y = (c.HEIGHT - img.height) / 2,
            r = null;

        me.video.clearSurface(context, "#000");

        var len = Math.min(this.state, this.regions.length);
        for (i = 0; i < len; i++) {
            r = this.regions[i];
            context.drawImage(
                img,
                r.x, r.y, r.w, r.h,
                x + r.x, y + r.y, r.w, r.h
            );
        }
    }
});
