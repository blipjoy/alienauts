game.LightSource = game.Circle.extend({
    "init" : function init(x, y, r, settings) {
        settings = settings || {};
        settings.intensity = settings.intensity || 200; // Intensity radius
        settings.brightness = settings.brightness || 0.8; // Gradient ratio
        settings.color = settings.color || [ 255, 255, 224 ];
        settings.mass = settings.mass || 0.2;

        this.settings = settings;

        var self = this;
        // FIXME: Call this function every time the browser resizes
        function createCanvas() {
            var canvas = document.createElement("canvas");
            var i2 = settings.intensity * 2;
            canvas.width = i2;
            canvas.height = i2;

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
            rsq = r * r;
            settings = this.settings,
            intensity = settings.intensity,
            i2 = intensity * 2,
            backbuffer = this.backbuffer;


        // Clear backbuffer
        backbuffer.globalCompositeOperation = "copy";

        // FIXME: Render beams (like from a flashlight or lamp with a shade)
        // Should be possible with a clipping region

        // Render a radial beam of light
        var gradial = backbuffer.createRadialGradient(intensity, intensity, r * 1.5, intensity, intensity, intensity);
        gradial.addColorStop(0, game.getColor(settings.color, settings.brightness));
        gradial.addColorStop(1, game.getColor(settings.color, 0));

        backbuffer.fillStyle = gradial;
        backbuffer.fillRect(0, 0, i2, i2);

        // Render shadows as subtractive polygons
        backbuffer.globalCompositeOperation = "destination-out";
        backbuffer.fillStyle = "black";

        // Draw shadows for every polygon shape within the intensity radius
        var bb = new cp.BB(x - intensity, p.y - intensity, x + intensity, p.y + intensity);
        space.bbQuery(bb, c.LAYER_SHAPES, 0, function (shape) {
            // FIXME: Support segments and circles
            if (shape === body.shapeList[0] || shape.type !== "poly") {
                return;
            }

            var shape_p = shape.body.p;
            var verts = shape.verts;
            var test_min = 0,
                test_max = 0;

            // Rotation vector to apply to all vertex angles
            var rot = cp.v(1, 0);

            // Get the general angle of the light beam that is approaching the shape
            var vector = cp.v.toangle(cp.v.sub(p, shape_p));
            var half_pi = Math.PI / 2;
            if ((vector > -half_pi) && (vector < half_pi)) {
                // Rotate all vertex angles by 180 degrees
                // This fixes problems with comparing angles that underflow/overflow the -Pi..Pi range
                rot = cp.v(-1, 0);
            }


            // Get the position of the vertex (in world coordinates)
            var vertex = cp.v.rotate(shape.body.rot, cp.v(verts[0], verts[1])).add(shape_p);

            // Create an axis vector between lightsource center and vertex
            var axis = cp.v.sub(vertex, p);

            // Get the tangent angle to calculate the tangent lines of the lightsource
            var ratio = rsq / cp.v.lengthsq(axis);
            var tangent = Math.acos(ratio);
            // And the angle on the vertex for the tangent line
            var theta = Math.asin(ratio);

            // Record the min and max angles
            var direction = cp.v.toangle(cp.v.rotate(rot, axis));
            var min = direction + theta;
            var max = direction - theta;

            var angles = [ -tangent, tangent ];
            var corners = [ vertex, vertex ];
            var axes = [ axis, axis ];


            // Iterate the rest of the vectors to find the min and max projection lengths
            var len = verts.length;
            for (var i = 2; i < len; i += 2) {
                vertex = cp.v.rotate(shape.body.rot, cp.v(verts[i], verts[i + 1])).add(shape_p);
                axis = cp.v.sub(vertex, p);

                ratio = rsq / cp.v.lengthsq(axis);
                tangent = Math.acos(ratio);
                theta = Math.asin(ratio);

                direction = cp.v.toangle(cp.v.rotate(rot, axis));
                test_min = direction + theta;
                test_max = direction - theta;


                if (test_min < min) {
                    min = test_min;
                    angles[0] = -tangent;
                    corners[0] = vertex;
                    axes[0] = axis;
                }
                if (test_max > max) {
                    max = test_max;
                    angles[1] = tangent;
                    corners[1] = vertex;
                    axes[1] = axis;
                }
            }


            // Get the tangent line endpoints in world coordinates
            var tangents = [
                cp.v.rotate(cp.v.forangle(angles[0]), cp.v.normalize(axes[0])).mult(r),
                cp.v.rotate(cp.v.forangle(angles[1]), cp.v.normalize(axes[1])).mult(r)
            ];

            corners[0].sub(p);
            corners[1].sub(p);

            // Cast rays from each vertex away from the tangent line on the light source
            var rays = [
                cp.v.normalize(cp.v.sub(corners[0], tangents[0])).mult(i2),
                cp.v.normalize(cp.v.sub(corners[1], tangents[1])).mult(i2)
            ];


            // Create a shadow polygon and clear its region from the light beam
            backbuffer.beginPath();
            backbuffer.moveTo(intensity + corners[0].x, intensity - corners[0].y);
            backbuffer.lineTo(intensity + corners[1].x, intensity - corners[1].y);
            backbuffer.lineTo(intensity + corners[1].x + rays[1].x, intensity - corners[1].y - rays[1].y);
            backbuffer.lineTo(intensity + corners[0].x + rays[0].x, intensity - corners[0].y - rays[0].y);
            backbuffer.fill();
        });

        // Draw backbuffer to screen
        context.drawImage(backbuffer.canvas, x - intensity, y - intensity);

        // Draw bulb
        this.parent(context);
    }
});
