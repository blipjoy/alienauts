game.Scientist = Object.extend({
    "init" : function init(x, y, settings) {
        this.visible = true;

        settings = settings || {};

        this.pos = new me.Vector2d(x, y);
        this.color = settings.color || "#141414";
        this.direction = settings.direction || 1; // -1 or 1
        this.head = settings.head || 1; // 0 or 1

        this.writing = 0;
        this.bounce = 0;

        this.canTilt = true;
        this.canTurn = true;
        this.moving = false;

        this.ticks = 0;
    },

    "update" : function update() {
        var self = this;

        // Write on clipboard
        if (!self.writing && !Math.floor(Math.random() * 100)) {
            self.writing = 16;
        }
        self.writing = Math.max(self.writing - 1, 0);

        // Tilt head
        if (self.canTilt && !Math.floor(Math.random() * 200)) {
            self.canTilt = false;
            new me.Tween(self)
                .to({
                    "head" : self.head ? 0 : 1
                }, 250)
                .onComplete(function () {
                    self.canTilt = true;
                })
                .start();
        }

        if (!self.moving && self.canTurn) {
            var dest = 0;

            // Walk
            if (!Math.floor(Math.random() * 400)) {
                // Walk between 100 .. c.WIDTH - 100, up to 200 pixels at a time
                if (self.direction > 0) {
                    dest = Math.min(Math.floor(Math.random() * (c.WIDTH - 100 - self.pos.x)), 200);
                }
                else {
                    dest = Math.max(Math.floor(Math.random() * -(self.pos.x - 100)), -200);
                }

                self.moving = true;
                new me.Tween(self.pos)
                    .to({
                        "x" : self.pos.x + dest
                    }, Math.abs(dest) * 30)
                    .easing(me.Tween.Easing.Sinusoidal.EaseInOut)
                    .onUpdate(function () {
                        self.bounce += 0.1;
                    })
                    .onComplete(function () {
                        self.moving = false;
                    })
                    .start();
            }

            // Turn around
            else if (!Math.floor(Math.random() * 500)) {
                self.canTurn = false;
                new me.Tween(self)
                    .to({
                        "direction" : self.direction * -1
                    }, 250)
                    .onComplete(function () {
                        self.canTurn = true;
                    })
                    .start();
            }
        }

        // FIXME
        return true;
    },

    "draw" : function draw(context) {
        var p = this.pos,
            ticks = this.ticks++,
            step = ticks * 0.1,
            writing = this.writing,
            self = this;

        function drawShape(shape) {
            context.beginPath();
            context.moveTo(shape[0][0] * self.direction, shape[0][1]);
            for (var i = 1; i < shape.length; i++) {
                context.lineTo(shape[i][0] * self.direction, shape[i][1]);
            }
            context.closePath();
        }

        context.save();
        context.fillStyle = this.color;
        context.translate(p.x, p.y + Math.cos(this.bounce) * 3);

        // Head
        var head = [
            [ -19, -23 ],
            [  21, -23 ],
            [  15, -19 ],
            [  17,  5  ],
            [  13,  7  ],
            [  11,  23 ],
            [ -19,  23 ],
            [ -19,  7  ],
            [ -21,  7  ],
            [ -21, -5  ],
            [ -19, -5  ]
        ];
        context.save();
        context.translate(-21 * this.direction, 23);
        context.rotate((Math.PI / 16) * this.head * this.direction);
        context.translate(21 * this.direction, -23);
        drawShape(head);
        context.restore();
        context.fill();

        // Torso
        context.translate(0, 46);
        context.beginPath();
        context.rect(-21 * this.direction, -26, 28 * this.direction, 64);
        context.fill();

        // Arms
        context.beginPath();
        context.moveTo(-20 * this.direction, -26);
        context.lineTo(-20 * this.direction, 23);
        context.lineTo(-25 * this.direction, 18);
        context.closePath();

        context.rect(6 * this.direction, 2, 22 * this.direction, 22);

        // Clipboard
        context.rotate(Math.PI / 4 * this.direction);
        context.rect(13 * this.direction, -36, 24 * this.direction, 36);

        // Hand
        context.rect(10 * this.direction, -18, 4 * this.direction, 12);

        // Pencil
        context.translate(24 * this.direction, -24);
        if (writing) {
            context.rotate(Math.sin(ticks) * (Math.PI / 32) * this.direction);
        }
        context.rect((writing ? -8 - writing : -24) * this.direction, 0, 16 * this.direction, 3);

        context.fill();

        context.restore();
    }
});
