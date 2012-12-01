game.Balloon = game.Circle.extend({
    "init" : function init(x, y, r, settings) {
        settings = settings || {};

        // Default settings
        settings.collision_type = c.TYPE_BALLOON;

        this.parent(x, y, r, settings);

        // FIXME: Add triangle shape


        this.anchor = cp.v(0, this.r * -1.5);
        this.createTime = me.timer.getTime();

        this.name = "balloon";
        this.touch_pos = false;

        // Bind input
        me.input.registerMouseEvent("mousedown", this, this.touch.bind(this), true);
        this.subs = [];
        this.subs.push(me.event.subscribe(c.EVENT_DRAG, this.drag.bind(this)));
        this.subs.push(me.event.subscribe(c.EVENT_TOUCHEND, this.touchEnd.bind(this)));
    },

    "destroy" : function destroy() {
        this.subs.forEach(function (sub) {
            me.event.unsubscribe(sub);
        });
        this.subs = [];
    },

    "touch" : function touch(e) {
        var touch = me.input.touches[0],
            dist = cp.v.dist(
                game.player.body.p,
                cp.v(touch.x, c.HEIGHT - touch.y)
            );

        // Ship must be within 100 pixels to clone.
        if (dist <= 100) {
            this.touch_pos = touch;
        }
    },

    "drag" : function drag(e) {
        if (this.touch_pos) {
            this.touch_pos = me.input.touches[0];
        }
    },

    "touchEnd" : function touchEnd(e) {
        if (this.touch_pos) {
            // Copy the settings to a new variable
            var settings = {};
            for (var setting in this.settings) {
                settings[setting] = this.settings[setting];
            }
            // And alter it with a TTL
            settings.ttl = 5000;

            var balloon = new game.Balloon(this.pos.x, this.pos.y, this.r, settings);
            game.clone(balloon, this, this.touch_pos, this.anchor);

            this.touch_pos = false;
        }
    },

    "update" : function update() {
        // Handle TTL
        if (me.timer.getTime() - this.createTime >= this.settings.ttl) {
            // Reset createTime to prevent double-removes
            this.createTime = me.timer.getTime();

            if (this.rope) {
                // Remove the two control point bodies and rope entity
                cm.remove(this.rope.c2);
                cm.remove(this.rope.c3);
                me.game.remove(this.rope);
            }

            // Remove the balloon body and entity
            cm.remove(this.body);
            me.game.remove(this);
        }
        else {
            this.parent();
        }
    },

    "draw" : function draw(context) {
        var b = this.body,
            p = b.p,
            lightlevel = Math.max(this.lightlevel, game.scene.lightlevel);

        context.save();

        context.translate(p.x, c.HEIGHT - p.y);
        context.rotate(-b.a);

        context.beginPath();
        context.moveTo(0, this.r * 1.5);
        context.arc(0, 0, this.r, Math.PI * 0.75, Math.PI * 0.25);
        context.closePath();

        context.fillStyle = game.getColor(game.darkenColor(this.color, lightlevel));
        context.fill();

        context.strokeStyle = "black";
        context.stroke();

        context.restore();
    }
});
