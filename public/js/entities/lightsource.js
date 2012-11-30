game.LightSource = game.Circle.extend({
    "init" : function init(x, y, r, settings) {
        settings = settings || {};
        settings.intensity = settings.intensity || 200; // Intensity radius
        settings.brightness = settings.brightness || 0.8; // Gradient ratio
        settings.color = settings.color || [ 255, 255, 224 ];
        settings.mass = settings.mass || 0.2;
        settings.off = settings.off || false;
        settings.flickering = settings.flickering || false;

        this.settings = settings;

        var i = settings.intensity,
            i2 = i * 2;

        this.backbuffer = me.video.createCanvasSurface(i2, i2);
        this.backbuffer.fillStyle = "black";

        // FIXME: Render directional light (like from a flashlight or lamp with a shade)
        // Should be possible with a clipping region

        // Render a radial beam of light
        this.gradial = me.video.createCanvasSurface(i2, i2);
        var gradial = this.gradial.createRadialGradient(i, i, r * 1.5, i, i, i);
        gradial.addColorStop(0, game.getColor(settings.color, settings.brightness));
        gradial.addColorStop(1, game.getColor(settings.color, 0));

        this.gradial.fillStyle = gradial;
        this.gradial.fillRect(0, 0, i2, i2);

        this.parent(x, y, r, settings);

        this.lightsource = true;
    },

    "update" : function update() {
        // Flickering light
        var settings = this.settings;
        if (settings.flickering && !Math.floor(Math.random() * 10)) {
            this.settings.off = !settings.off;
        }

        return this.parent();
    },

    "draw" : function draw(context) {
        var space = cm.getSpace(),
            body = this.body,
            p = body.p,
            x = p.x,
            y = c.HEIGHT - p.y,
            r = this.r,
            rsq = r * r,
            settings = this.settings,
            intensity = settings.intensity,
            i2 = intensity * 2,
            backbuffer = this.backbuffer;

        if (settings.off) {
            this.color = "rgba(0, 0, 0, 0)";
            return this.parent(context);
        }

        this.color = settings.color;

        // Clear backbuffer
        backbuffer.globalCompositeOperation = "copy";
        backbuffer.drawImage(this.gradial.canvas, 0, 0);

        // Render shadows as subtractive polygons
        backbuffer.globalCompositeOperation = "destination-out";

        // Draw shadows for every polygon shape within the intensity radius
        var bb = new cp.BB(x - intensity, p.y - intensity, x + intensity, p.y + intensity);
        space.bbQuery(bb, c.LAYER_SHAPES, 0, function (shape) {
            // FIXME: Support segments
            if (shape.entity.lightsource ||
                shape.type === "segment") {
                return;
            }

            var shape_p = shape.body.p;
            var shape_rot = shape.body.rot;
            var shape_entity = shape.entity;

            // Set lightlevel
            shape_entity.lightlevel += Math.min(Math.max(intensity - cp.v.dist(p, shape_p) + r * 3, 0) / intensity, 1);

            // These vars act as outputs (via closure) from the projection functions.
            var angles = [ 0, 0 ],
                corners = [ cp.vzero, cp.vzero ],
                axis = cp.vzero;


            function projectionFromPoly() {
                var verts = shape.verts;
                var test_min = 0,
                    test_max = 0,
                    test_axis = cp.vzero;

                // Rotation vector to apply to all vertex angles
                var fix = cp.v(1, 0);

                // Get the general angle of the light beam that is approaching the shape
                var vector = cp.v.toangle(cp.v.sub(p, shape_p));
                var half_pi = Math.PI / 2;
                if ((vector > -half_pi) && (vector < half_pi)) {
                    // Rotate all vertex angles by 180 degrees
                    // This fixes problems with comparing angles that underflow/overflow the -Pi..Pi range
                    fix = cp.v(-1, 0);
                }


                // Get the position of the vertex (in world coordinates)
                var vertex = cp.v.rotate(shape_rot, cp.v(verts[0], verts[1])).add(shape_p);

                // Create an axis vector between lightsource center and vertex
                axis = cp.v.sub(vertex, p);

                // Get the tangent angle to calculate the tangent lines of the lightsource
                var ratio = rsq / cp.v.lengthsq(axis);
                var tangent = Math.acos(ratio);
                // And the angle on the vertex for the tangent line
                var theta = Math.asin(ratio);

                // Record the min and max angles
                var direction = cp.v.toangle(cp.v.rotate(fix, axis));
                var min = direction + theta;
                var max = direction - theta;

                angles = [ -tangent, tangent ];
                corners = [ vertex, vertex ];


                // Iterate the rest of the vertices to find the min and max projection lengths
                var len = verts.length;
                for (var i = 2; i < len; i += 2) {
                    vertex = cp.v.rotate(shape_rot, cp.v(verts[i], verts[i + 1])).add(shape_p);
                    test_axis = cp.v.sub(vertex, p);

                    ratio = rsq / cp.v.lengthsq(test_axis);
                    tangent = Math.acos(ratio);
                    theta = Math.asin(ratio);

                    direction = cp.v.toangle(cp.v.rotate(fix, test_axis));
                    test_min = direction + theta;
                    test_max = direction - theta;


                    if (test_min < min) {
                        min = test_min;
                        angles[0] = -tangent;
                        corners[0] = vertex;
                        axis = test_axis;
                    }
                    if (test_max > max) {
                        max = test_max;
                        angles[1] = tangent;
                        corners[1] = vertex;
                        axis = test_axis;
                    }
                }
            }


            function projectionFromCircle() {
                // Get r^2 for circle, which will help calculate the tangent lines
                var sr = shape.r;
                var srsq = sr * sr;

                var vr = [
                    cp.v(0, sr),
                    cp.v(0, -sr)
                ];

                // Create an axis vector between lightsource center and circle center
                axis = cp.v.sub(shape_p, p);

                // rotation vector
                var direction = cp.v.normalize(axis);

                // Get the tangent angle to calculate the tangent lines of the lightsource
                var ratio = (srsq - rsq) / cp.v.lengthsq(axis);
                var tangent = Math.acos(ratio);
                // And the angle on the vertex for the tangent line
                var theta = Math.asin(ratio);

                // Set outputs
                angles = [ tangent, -tangent ];
                corners = [
                    cp.v.rotate(direction, cp.v.rotate(cp.v.forangle(theta), vr[0])).add(shape_p),
                    cp.v.rotate(direction, cp.v.rotate(cp.v.forangle(-theta), vr[1])).add(shape_p)
                ];
            }


            // get projection vertices
            switch (shape.type) {
                case "circle":
                    projectionFromCircle();

                    // Fill circle
                    var pos = cp.v.sub(shape_p, p);
                    pos.x += intensity;
                    pos.y = intensity - pos.y;

                    backbuffer.beginPath();
                    backbuffer.moveTo(pos.x + shape.r, pos.y);
                    backbuffer.arc(pos.x, pos.y, shape.r, 0, Math.PI * 2);
                    backbuffer.fill();
                    break;

                case "poly":
                    projectionFromPoly();

                    // Fill poly
                    var verts = shape.verts;
                    backbuffer.save();

                    backbuffer.translate(intensity + shape_p.x - p.x, intensity - shape_p.y + p.y);
                    backbuffer.rotate(-shape.body.a);

                    backbuffer.beginPath();
                    backbuffer.moveTo(verts[0], -verts[1]);

                    var len = verts.length;
                    for (var i = 2; i < len; i += 2) {
                        backbuffer.lineTo(verts[i], -verts[i + 1]);
                    }

                    backbuffer.closePath();
                    backbuffer.fill();

                    backbuffer.restore();

                    break;

                case "segment":
                    break;
            }

            // Get the tangent line endpoints in world coordinates
            axis = cp.v.normalize(axis);
            var tangents = [
                cp.v.rotate(cp.v.forangle(angles[0]), axis).mult(r),
                cp.v.rotate(cp.v.forangle(angles[1]), axis).mult(r)
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
        return this.parent(context);
    }
});
