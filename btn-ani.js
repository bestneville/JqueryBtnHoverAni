(function () {
    function ButtonHoverAnimation(btn, index, defaults) {
        //调用者
        this.btn = btn;
        //调用索引,哪一个效果
        this.index = index;
        this.color = defaults.color;
        this.init();
    }

    ButtonHoverAnimation.prototype = {
        init: function () {
            //后面的方法都使用这个obj对象的参数值
            var obj = this;
            obj.run = false;
            if (obj.btn.css('position') != 'fixed' && obj.btn.css('position') != 'absolute') {
                obj.btn.css('position', 'relative');
            }
            //宽高即调用者的宽高
            obj.width = obj.btn.width();
            obj.height = obj.btn.height();
            //将调用者的子内容层级提高,并且在最底层添加一个与调用者等宽高的画布canvas
            //这样,我们的在canvas上的绘制作为背景不会影响到内容的展示
            obj.btn.children().each(function () {
                if ($(this).css('position') != 'fixed' && $(this).css('position') != 'absolute') {
                    $(this).css({'position': 'relative', 'z-index': '2'});
                } else if (parseInt($(this).css('z-index')) < 2) {
                    $(this).css({'z-index': '2'});
                }
            });
            //背景色默认白色
            if (obj.btn.css('background-color') != "rgba(0, 0, 0, 0)") {
                obj.backgroundColor = obj.btn.css('background-color');
            } else {
                obj.backgroundColor = '#ffffff';
            }
            //添加画布,层级最低
            obj.btn.append('<canvas width="' + obj.width + '" height="' + obj.height + '" style="position:absolute; top:0; left:0; z-index:1;"></canvas>');
            obj.ctx = obj.btn.children('canvas')[0].getContext('2d');
            //画笔的颜色,如果调用者没有传入,每次鼠标移入初始化一个随机色
            if (obj.color === false) {
                obj.btn.mouseenter(function () {
                    obj.color = 'hsl(' + (Math.random() * 360) + ',60%,80%)';
                    obj.ctx.fillStyle = obj.color;
                });
            } else {
                obj.ctx.fillStyle = obj.color;
            }
            //鼠标移动时记录坐标x,y
            obj.btn.mousemove(function (e) {
                obj.x = e.pageX - obj.btn.offset().left - parseInt(obj.btn.css('border-left-width'));
                obj.y = e.pageY - obj.btn.offset().top - parseInt(obj.btn.css('border-top-width'));
            });
            obj.array = [];
            //鼠标移入移出时,我们记录一个mouseenter变量,并且移入时使用display方法去寻找对应的效果
            obj.btn.mouseenter(function (e) {
                obj.mouseenter = true;
                obj.x = e.pageX - obj.btn.offset().left - parseInt(obj.btn.css('border-left-width'));
                obj.y = e.pageY - obj.btn.offset().top - parseInt(obj.btn.css('border-top-width'));
                obj.display(obj);
            });
            obj.btn.mouseleave(function () {
                obj.mouseenter = false;
            });
            //清屏
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
        },
        drawArc: function (obj, x, y, radius, startAngle, endAngle, globalAlpha, fillStyle) {
            obj.ctx.beginPath();
            obj.ctx.arc(x, y, radius, startAngle, endAngle);
            obj.ctx.closePath();
            obj.ctx.globalAlpha = globalAlpha;
            obj.ctx.fillStyle = fillStyle;
            obj.ctx.fill();
        },
        display: function (obj) {
            if (obj.index == 1) {
                obj.radius = 0;
                obj.radiusMax = Math.sqrt(Math.pow(obj.width / 2, 2) + Math.pow(obj.height / 2, 2));
                if (!obj.run) {
                    obj.run = true;
                    obj.ani1(obj);
                }
            } else if (obj.index == 2) {
                if (obj.array.length == 0) {
                    obj.radius = Math.sqrt(Math.pow(obj.width / 2, 2) + Math.pow(obj.height / 2, 2));
                    obj.array = [obj.width / 2, obj.height / 2, obj.radius, -90];
                }
                if (!obj.run) {
                    obj.run = true;
                    obj.ani2(obj);
                }
            } else if (obj.index == 3) {
                if (obj.array.length == 0) {
                    obj.rectHeight = Math.ceil(obj.height / 3);
                    obj.array[0] = {x: 0, y: -obj.rectHeight, w: obj.width, h: obj.rectHeight};
                    obj.array[1] = {x: 0, y: obj.height, w: obj.width, h: obj.rectHeight};
                    obj.array[2] = {x: -obj.width / 2, y: obj.rectHeight, w: obj.width / 2, h: obj.rectHeight};
                    obj.array[3] = {x: obj.width, y: obj.rectHeight, w: obj.width / 2, h: obj.rectHeight};
                    obj.ySpeed = obj.rectHeight / 10;
                    obj.xSpeed = obj.width / 20;
                }

                if (!obj.run) {
                    obj.run = true;
                    obj.ani3(obj);
                }

            } else if (obj.index == 4) {
                if (obj.array.length == 0) {
                    obj.array[0] = {x: obj.width / 2, y: 0};
                    obj.array[1] = {x: obj.width / 2, y: obj.height};
                    obj.array[2] = {x: 0, y: obj.height / 2};
                    obj.array[3] = {x: obj.width, y: obj.height / 2};
                    obj.ySpeed = obj.height / 40;
                    obj.xSpeed = obj.width / 40;
                }

                if (!obj.run) {
                    obj.run = true;
                    obj.ani4(obj);
                }

            } else if (obj.index == 5) {
                if (obj.array.length == 0) {
                    obj.ani5(obj);
                }
            } else if (obj.index == 6) {
                if (obj.array.length == 0) {
                    obj.ani6(obj);
                }
            } else if (obj.index == 7) {
                if (obj.array.length == 0) {
                    obj.ani7(obj);
                }
            } else {
                console.warn('请注意，没有第' + obj.index + '个效果！！');
            }
        },
        ani1: function (obj) {
            //清屏
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
            //鼠标移入
            if (obj.mouseenter) {
                obj.radius += 5;
            } else {
                obj.radius -= 5;
            }

            if (obj.radius >= obj.radiusMax) {
                obj.radius = obj.radiusMax;
            } else if (obj.radius <= 0) {
                obj.radius = 0;
            }
            obj.drawArc(obj, obj.width / 2, obj.height / 2, obj.radius, 0, Math.PI * 2, 1, obj.color);
            if (obj.mouseenter || obj.radius > 0) {
                requestAnimationFrame(function () {
                    obj.ani1(obj);
                })
            } else {
                obj.radius = 0;
                obj.ctx.clearRect(0, 0, obj.width, obj.height);
                obj.run = false;
            }
        },
        ani2: function (obj) {
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
            if (obj.mouseenter) {
                obj.array[3] += 15;
            } else {
                obj.array[3] -= 15;
            }
            if (obj.array[3] >= 270) {
                obj.array[3] = 270;
            } else if (obj.array[3] <= -90) {
                obj.array[3] = -90;
            }

            obj.ctx.globalAlpha = 1;
            obj.ctx.fillStyle = obj.color;
            obj.ctx.beginPath();
            obj.ctx.moveTo(obj.array[0], obj.array[1]);
            obj.ctx.arc(obj.array[0], obj.array[1], obj.array[2], -90 * Math.PI / 180, obj.array[3] * Math.PI / 180);
            obj.ctx.closePath();
            obj.ctx.fill();
            if (obj.mouseenter || obj.array[3] > -90) {
                requestAnimationFrame(function () {
                    obj.ani2(obj);
                });
            } else {
                obj.array = [];
                obj.ctx.clearRect(0, 0, obj.width, obj.height);
                obj.run = false;
            }
        },
        ani3: function (obj) {
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
            if (obj.mouseenter) {
                obj.array[0].y += obj.ySpeed;
                obj.array[1].y -= obj.ySpeed;
                if (obj.array[0].y >= 0) {
                    obj.array[0].y = 0;
                    obj.array[1].y = obj.height - obj.rectHeight;
                    obj.array[2].x += obj.xSpeed;
                    obj.array[3].x -= obj.xSpeed;
                    if (obj.array[2].x >= 0) {
                        obj.array[2].x = 0;
                        obj.array[3].x = obj.width / 2;
                    }
                }
            } else {
                obj.array[2].x -= obj.xSpeed;
                obj.array[3].x += obj.xSpeed;
                if (obj.array[2].x <= -obj.width / 2) {
                    obj.array[2].x = -obj.width / 2;
                    obj.array[3].x = obj.width;
                    obj.array[0].y -= obj.ySpeed;
                    obj.array[1].y += obj.ySpeed;
                    if (obj.array[0].y <= -obj.rectHeight) {
                        obj.array[0].y = -obj.rectHeight;
                        obj.array[1].y = obj.height;
                    }
                }
            }

            obj.ctx.globalAlpha = 1;
            obj.ctx.fillStyle = obj.color;
            for (var i = 0; i < obj.array.length; i++) {
                obj.ctx.fillRect(obj.array[i].x, obj.array[i].y, obj.array[i].w, obj.array[i].h);
            }

            if (obj.mouseenter || obj.array[0].y > -obj.rectHeight) {
                requestAnimationFrame(function () {
                    obj.ani3(obj);
                });
            } else {
                obj.ctx.clearRect(0, 0, obj.width, obj.height);
                obj.array = [];
                obj.run = false;
            }
        },
        ani4: function (obj) {
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
            if (obj.mouseenter) {
                obj.array[0].y += obj.ySpeed;
                obj.array[1].y -= obj.ySpeed;
                obj.array[2].x += obj.xSpeed;
                obj.array[3].x -= obj.xSpeed;
                if (obj.array[0].y >= obj.height / 2) {
                    obj.array[0].y = obj.array[1].y = obj.height / 2;
                    obj.array[2].x = obj.array[3].x = obj.width / 2;
                }
            } else {
                obj.array[0].y -= obj.ySpeed;
                obj.array[1].y += obj.ySpeed;
                obj.array[2].x -= obj.xSpeed;
                obj.array[3].x += obj.xSpeed;
                if (obj.array[0].y <= 0) {
                    obj.array[0].y = 0;
                    obj.array[1].y = obj.height;
                    obj.array[2].x = 0;
                    obj.array[3].x = obj.width;
                }
            }

            for (var i = 0; i < obj.array.length; i++) {
                obj.ctx.globalAlpha = 1;
                obj.ctx.fillStyle = obj.color;
                if (obj.array[0].y >= obj.height / 2) {
                    obj.ctx.fillRect(0, 0, obj.width, obj.height);
                } else {
                    obj.ctx.beginPath();
                    obj.ctx.moveTo(obj.array[i].x, obj.array[i].y);
                    obj.ctx.lineTo(i == 3 ? obj.array[i].x + obj.width / 2 : obj.array[i].x - obj.width / 2,
                        i == 1 ? obj.array[i].y + obj.height / 2 : obj.array[i].y - obj.height / 2);
                    obj.ctx.lineTo(i == 2 ? obj.array[i].x - obj.width / 2 : obj.array[i].x + obj.width / 2,
                        i == 0 ? obj.array[i].y - obj.height / 2 : obj.array[i].y + obj.height / 2);
                    obj.ctx.fill();
                }
            }
            if (obj.mouseenter || obj.array[0].x > 0) {
                requestAnimationFrame(function () {
                    obj.ani4(obj);
                });
            } else {
                obj.ctx.clearRect(0, 0, obj.width, obj.height);
                obj.array = [];
                obj.run = false;
            }

        },
        ani5: function (obj) {
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
            if (obj.mouseenter && Math.random() < .5) {
                obj.array.push({
                    x: Math.random() * obj.width,
                    y: Math.random() * obj.height,
                    radius: 1,
                    alpha: 1,
                    color: obj.color
                })
            }

            for (var i = 0; i < obj.array.length; i++) {
                obj.drawArc(obj, obj.array[i].x, obj.array[i].y, obj.array[i].radius, 0, 2 * Math.PI, obj.array[i].alpha, obj.array[i].color);
                obj.array[i].alpha -= .02;
                obj.array[i].radius += .4;
                if (obj.array[i].alpha <= 0) {
                    obj.array.splice(i, 1);
                    i--;
                }
            }
            obj.ctx.globalAlpha = 1;
            if (obj.mouseenter || obj.array.length > 0) {
                requestAnimationFrame(function () {
                    obj.ani5(obj);
                })
            } else {
                obj.ctx.clearRect(0, 0, obj.width, obj.height);
            }

        },
        ani6: function (obj) {
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
            if (obj.mouseenter) {
                obj.radius = Math.random() * 3 + 1;
                obj.direction = Math.random() * Math.PI * 2;
                obj.array.push({x: obj.x, y: obj.y, radius: obj.radius, direction: obj.direction})
            }

            for (var i = 0; i < obj.array.length; i++) {
                obj.drawArc(obj, obj.array[i].x, obj.array[i].y, obj.array[i].radius, 0, 2 * Math.PI, 0.6, obj.color);
                obj.array[i].x += Math.cos(obj.array[i].direction);
                obj.array[i].y += Math.sin(obj.array[i].direction);

                if (obj.array[i].y > obj.array[i].radius + obj.height || obj.array[i].y < -obj.array[i].radius || obj.array[i].x < -obj.array[i].radius || obj.array[i].x > obj.array[i].radius + obj.width) {
                    obj.array.splice(i, 1);
                    i--;
                }
            }

            obj.ctx.globalAlpha = 1;
            if (obj.mouseenter || obj.array.length > 0) {
                requestAnimationFrame(function () {
                    obj.ani6(obj);
                })
            } else {
                obj.ctx.clearRect(0, 0, obj.width, obj.height);
            }
        },
        ani7: function (obj) {
            obj.ctx.clearRect(0, 0, obj.width, obj.height);
            if (obj.mouseenter) {
                obj.radius = Math.random() * 5 + 1;
                obj.array.push({
                    x: Math.random() * obj.width,
                    y: Math.random() * obj.height,
                    radius: obj.radius,
                    alpha: 1
                })
            }

            for (var i = 0; i < obj.array.length; i++) {
                obj.drawArc(obj, obj.array[i].x, obj.array[i].y, obj.array[i].radius, 0, 2 * Math.PI, obj.array[i].alpha, obj.color);
                obj.array[i].x += Math.cos(Math.random() * 2 * Math.PI);
                obj.array[i].y += Math.sin(Math.random() * 2 * Math.PI);
                obj.array[i].alpha -= .02;
                if (obj.array[i].alpha <= 0) {
                    obj.array.splice(i, 1);
                    i--;
                }
            }
            obj.ctx.globalAlpha = 1;
            if (obj.mouseenter || obj.array.length > 0) {
                requestAnimationFrame(function () {
                    obj.ani7(obj);
                })
            } else {
                obj.ctx.clearRect(0, 0, obj.width, obj.height);
            }


        }

    };
    var defaults = {
        color: false
    };
    $.fn.btnHoverAni = function (index, config) {
        defaults = {
            color: false
        };
        $.extend(defaults, config);
        $(this).each(function () {
            new ButtonHoverAnimation($(this), index, defaults);
        });
    }
})(jQuery);


(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var xx = 0; xx < vendors.length && !window.requestAnimationFrame; ++xx) {
        window.requestAnimationFrame = window[vendors[xx] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[xx] + 'CancelAnimationFrame'] ||
            window[vendors[xx] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());