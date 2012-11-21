game.LightSource = game.Circle.extend({
    "init" : function init(x, y, r, settings) {
        settings = settings || {};
        settings.intensity = settings.intensity || 200; // Intensity radius
        settings.brightness = settings.brightness || 0.8; // Gradient ratio
        settings.color = settings.color || [ 255, 255, 224 ];

        this.settings = settings;

        var self = this;
        // FIXME: Call this function every time the browser resizes
        function createCanvas() {
            var canvas = document.createElement("canvas");
            canvas.width = c.WIDTH;
            canvas.height = c.HEIGHT;

            self.backbuffer = canvas.getContext("2d");
        }
        createCanvas();

        this.parent(x, y, r, settings);
    },

    "draw" : function draw(context) {
        var space = cm.getSpace(),
            body = this.body,
            p = body.p,
            x = p.x,
            y = c.HEIGHT - p.y,
            r = this.r,
            settings = this.settings,
            intensity = settings.intensity,
            i2 = intensity * 2,
            backbuffer = this.backbuffer;


        // Clear backbuffer
        backbuffer.globalCompositeOperation = "copy";

        // FIXME: Render beams (like from a flashlight or lamp with a shade)
        // Should be possible with a clipping region

        // Render a radial beam of light
        var gradial = backbuffer.createRadialGradient(x, y, r * 1.5, x, y, intensity);
        gradial.addColorStop(0, game.getColor(settings.color, settings.brightness));
        gradial.addColorStop(1, game.getColor(settings.color, 0));

        backbuffer.fillStyle = gradial;
        backbuffer.fillRect(x - intensity, y - intensity, i2, i2);

        // Render shadows as subtractive polygons
        backbuffer.globalCompositeOperation = "destination-out";
        backbuffer.fillStyle = "black";


        // Draw shadows for every polygon shape within the intensity radius
        var bb = new cp.BB(x - intensity, p.y - intensity, x + intensity, p.y + intensity);
        space.bbQuery(bb, c.LAYER_SHAPES, 0, function (shape) {
            // FIXME: Support segments and circles
            if (shape == body.shapeList[0] || shape.type != "poly") {
                return;
            }

            var shape_p = shape.body.p;

            // Get a unit vector pointing from the shape to the lightsource, then rotate 90 degrees clockwise
            var axis = cp.v.perp(cp.v.normalize(cp.v.sub(shape_p, p)));

            var verts = shape.verts;
            var min, max;

            // Rotate the first vector in the shape, and project it against `axis`
            var vector = cp.v.rotate(shape.body.rot, cp.v(verts[0], verts[1]));
            var projection = cp.v.dot(vector, axis);
            min = max = projection;
            var corners = [ vector, vector ];

            // Iterate the rest of the vectors to find the min and max projection lengths
            var len = verts.length;
            for (var i = 2; i < len; i += 2) {
                vector = cp.v.rotate(shape.body.rot, cp.v(verts[i], verts[i + 1]));
                projection = cp.v.dot(vector, axis);
                if (projection < min) {
                    min = projection;
                    corners[0] = vector;
                }
                else if (projection > max) {
                    max = projection;
                    corners[1] = vector;
                }
            }

            // Offset the two projection vectors by the body position
            corners[0].add(shape_p);
            corners[1].add(shape_p);

            // Cast two rays away from the lightsource, starting at the projection vectors
            var rays = [
                cp.v.normalize(cp.v.sub(corners[0], p)).mult(i2),
                cp.v.normalize(cp.v.sub(corners[1], p)).mult(i2)
            ];

            // Create a shadow polygon and clear its region in the light beam
            backbuffer.beginPath();
            backbuffer.moveTo(corners[0].x, c.HEIGHT - corners[0].y);
            backbuffer.lineTo(corners[1].x, c.HEIGHT - corners[1].y);
            backbuffer.lineTo(corners[1].x + rays[1].x, c.HEIGHT - corners[1].y - rays[1].y);
            backbuffer.lineTo(corners[0].x + rays[0].x, c.HEIGHT - corners[0].y - rays[0].y);

            backbuffer.fill();

/*
            // Create a shadow polygon with reverse winding
            context.moveTo(corners[0].x, c.HEIGHT - corners[0].y);
            context.lineTo(corners[0].x + rays[0].x, c.HEIGHT - corners[0].y - rays[0].y);
            context.lineTo(corners[1].x + rays[1].x, c.HEIGHT - corners[1].y - rays[1].y);
            context.lineTo(corners[1].x, c.HEIGHT - corners[1].y);
            context.lineTo(corners[0].x, c.HEIGHT - corners[0].y);
*/
        });


        // Draw backbuffer to screen
        context.drawImage(backbuffer.canvas, 0, 0);

        // Draw bulb
        this.parent(context);
    }
});
