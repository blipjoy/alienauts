game.Rect = game.Poly.extend({
    "init" : function init(x, y, w, h, settings) {
        var hw = w / 2,
            hh = h / 2;

        var verts = [
            -hw, -hh,
            -hw, hh,
            hw, hh,
            hw, -hh
        ];

        this.parent(x, y, verts, cp.vzero, settings);
    }
});
