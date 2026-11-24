(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // global-three:three
  var require_three = __commonJS({
    "global-three:three"(exports, module) {
      module.exports = window.THREE;
    }
  });

  // system/engine/core.js
  var THREE11 = __toESM(require_three(), 1);

  // system/engine/page.js
  var THREE6 = __toESM(require_three(), 1);

  // system/engine/fx.js
  var THREE = __toESM(require_three(), 1);

  // system/engine/book.js
  var BOOK = {
    title: "",
    subtitle: "",
    cast: [],
    byId: {},
    narrator: { pitch: 1, rate: 0.92 },
    settings: { readFirst: true, voiceOn: true }
  };
  var AGE = {
    3: { seconds: 12, times: 12, hintAfter: 6, stay: 2.6, popTimes: 5, growTimes: 6, rub: 500, strict: false, copyRounds: [2, 2, 3], holdSeconds: 2, pairs: 3 },
    5: { seconds: 8, times: 18, hintAfter: 10, stay: 1.8, popTimes: 6, growTimes: 8, rub: 800, strict: false, copyRounds: [3, 3, 4, 4], holdSeconds: 2.5, pairs: 4 },
    7: { seconds: 6, times: 24, hintAfter: 15, stay: 1.3, popTimes: 8, growTimes: 10, rub: 1100, strict: true, copyRounds: [3, 3, 4, 5, 6], holdSeconds: 3, pairs: 5 }
  };
  var age = () => AGE[BOOK.age] || AGE[5];
  var CALM = { on: false };
  function setBook(b) {
    Object.assign(BOOK, b);
    BOOK.narrator = { pitch: 1, rate: 0.92, ...b.narrator || {} };
    BOOK.settings = { readFirst: true, voiceOn: true, ...b.settings || {} };
    BOOK.byId = {};
    for (const c of BOOK.cast || []) BOOK.byId[c.id] = c;
  }
  var voice = (id) => BOOK.byId[id] && BOOK.byId[id].voice || BOOK.narrator;
  var castColor = (id) => BOOK.byId[id] && BOOK.byId[id].color || "#7a5aa0";
  var fireworkColor = (id) => BOOK.byId[id] && (BOOK.byId[id].firework || BOOK.byId[id].color) || "#ffd84a";
  var markColor = (id) => BOOK.byId[id] && (BOOK.byId[id].mark || BOOK.byId[id].color) || "#ffe36b";
  var meowOf = (id) => BOOK.byId[id] && BOOK.byId[id].meow || null;
  var isCast = (id) => !!BOOK.byId[id];
  var castIds = () => (BOOK.cast || []).map((c) => c.id);

  // system/engine/fx.js
  var easeOutBack = (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  var easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  function canvasTex(w, h, draw) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  var SPARK = null;
  function sparkTexture() {
    if (SPARK) return SPARK;
    SPARK = canvasTex(64, 64, (g, w, h) => {
      const cx = w / 2, cy = h / 2;
      const grd = g.createRadialGradient(cx, cy, 0, cx, cy, 30);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.25, "rgba(255,255,255,0.55)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);
      g.fillStyle = "#fff";
      g.beginPath();
      const s = 30, k = 3.5;
      g.moveTo(cx, cy - s);
      g.quadraticCurveTo(cx + k, cy - k, cx + s, cy);
      g.quadraticCurveTo(cx + k, cy + k, cx, cy + s);
      g.quadraticCurveTo(cx - k, cy + k, cx - s, cy);
      g.quadraticCurveTo(cx - k, cy - k, cx, cy - s);
      g.fill();
    });
    return SPARK;
  }
  var Particles = class {
    constructor(max = 1400) {
      this.max = max;
      this.n = 0;
      const g = new THREE.BufferGeometry();
      this.pos = new Float32Array(max * 3);
      this.col = new Float32Array(max * 3);
      this.size = new Float32Array(max);
      this.alpha = new Float32Array(max);
      this.vel = new Float32Array(max * 3);
      this.life = new Float32Array(max);
      this.maxLife = new Float32Array(max);
      this.drag = new Float32Array(max);
      this.grav = new Float32Array(max);
      this.size0 = new Float32Array(max);
      this.tw = new Float32Array(max);
      g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute("pcolor", new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute("psize", new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute("palpha", new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
      g.setDrawRange(0, 0);
      this.uniforms = { map: { value: sparkTexture() }, uPx: { value: 400 } };
      const m = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `attribute vec3 pcolor; attribute float psize; attribute float palpha; uniform float uPx;
        varying vec3 vC; varying float vA;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0);
          float s = length(modelViewMatrix[0].xyz);
          gl_PointSize = clamp(psize * s * uPx * projectionMatrix[1][1] / -mv.z, 0.0, 256.0);
          gl_Position = projectionMatrix * mv; vC = pcolor; vA = palpha; }`,
        fragmentShader: `uniform sampler2D map; varying vec3 vC; varying float vA;
        void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vC * t.rgb, t.a * vA); }`,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending
      });
      this.points = new THREE.Points(g, m);
      this.points.frustumCulled = false;
      this.points.renderOrder = 900;
      this.tmpC = new THREE.Color();
      this.up = new THREE.Vector3(0, 0.5, 0.86);
    }
    setPixelScale(h) {
      this.uniforms.uPx.value = h / 2;
    }
    emit(p, v, color, size = 0.02, life = 1, drag = 0.94, grav = -0.25, tw = 1) {
      if (this.n >= this.max) return;
      if (CALM.on && Math.random() < 0.5) return;
      const i = this.n++;
      this.pos.set([p.x, p.y, p.z], i * 3);
      this.vel.set([v.x, v.y, v.z], i * 3);
      this.tmpC.set(color);
      this.col.set([this.tmpC.r, this.tmpC.g, this.tmpC.b], i * 3);
      this.size0[i] = size;
      this.size[i] = 0;
      this.alpha[i] = 1;
      this.life[i] = 0;
      this.maxLife[i] = life;
      this.drag[i] = drag;
      this.grav[i] = grav;
      this.tw[i] = tw;
    }
    // radial sparkle burst
    burst(p, n = 12, power = 1, colors = ["#fff2a8", "#ffffff", "#ffc2e2", "#bfe8ff"], size = 0.026) {
      for (let k = 0; k < n; k++) {
        const a = Math.random() * Math.PI * 2, s = (0.08 + Math.random() * 0.22) * power;
        this.emit(
          p,
          { x: Math.cos(a) * s, y: Math.sin(a) * s, z: (0.12 + Math.random() * 0.3) * power },
          colors[k % colors.length],
          size * (0.6 + Math.random() * 0.8),
          0.7 + Math.random() * 0.6
        );
      }
    }
    update(dt) {
      const up = this.up;
      for (let i = 0; i < this.n; i++) {
        this.life[i] += dt;
        const u = this.life[i] / this.maxLife[i];
        if (u >= 1) {
          this._kill(i);
          i--;
          continue;
        }
        const d = Math.pow(this.drag[i], dt * 60), gr = this.grav[i] * dt;
        const j = i * 3;
        this.vel[j] = this.vel[j] * d + up.x * gr;
        this.vel[j + 1] = this.vel[j + 1] * d + up.y * gr;
        this.vel[j + 2] = this.vel[j + 2] * d + up.z * gr;
        this.pos[j] += this.vel[j] * dt;
        this.pos[j + 1] += this.vel[j + 1] * dt;
        this.pos[j + 2] += this.vel[j + 2] * dt;
        const tw = this.tw[i] ? 0.75 + 0.25 * Math.sin(this.life[i] * 34 + i) : 1;
        this.size[i] = this.size0[i] * (u < 0.12 ? u / 0.12 : 1) * tw;
        this.alpha[i] = 1 - u * u;
      }
      const g = this.points.geometry;
      g.setDrawRange(0, this.n);
      for (const k of ["position", "pcolor", "psize", "palpha"]) g.attributes[k].needsUpdate = true;
    }
    _kill(i) {
      const last = --this.n;
      if (i === last) return;
      const c3 = (arr) => {
        arr[i * 3] = arr[last * 3];
        arr[i * 3 + 1] = arr[last * 3 + 1];
        arr[i * 3 + 2] = arr[last * 3 + 2];
      };
      c3(this.pos);
      c3(this.vel);
      c3(this.col);
      for (const a of [this.size, this.alpha, this.life, this.maxLife, this.drag, this.grav, this.size0, this.tw]) a[i] = a[last];
    }
    clear() {
      this.n = 0;
    }
  };
  function rrect(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  var PRINT_COLOR = { cat: "#ff8fb1", rabbit: "#ff9fc0", dog: "#c9895a", bear: "#a06a44", bird: "#f2a23a", human: "#ff9a76" };
  var PRINTS = {};
  function printTexture(hand) {
    const kind = hand && PRINT_COLOR[hand.kind] ? hand.kind : "cat";
    const color = hand && hand.print || PRINT_COLOR[kind];
    const key = `${kind}:${color}`;
    if (PRINTS[key]) return PRINTS[key];
    PRINTS[key] = canvasTex(128, 128, (g) => {
      const shapes2 = [];
      const pad = (x, y, rx, ry) => shapes2.push((w) => {
        g.beginPath();
        g.ellipse(x, y, rx + w, ry + w, 0, 0, Math.PI * 2);
        g.fill();
      });
      const bar = (x0, y0, x1, y1, r) => shapes2.push((w) => {
        g.beginPath();
        g.moveTo(x0, y0);
        g.lineTo(x1, y1);
        g.lineWidth = 2 * (r + w);
        g.stroke();
      });
      if (kind === "human") {
        pad(64, 84, 25, 24);
        bar(44, 86, 22, 62, 8);
        bar(50, 66, 46, 26, 7.5);
        bar(63, 64, 63, 18, 7.5);
        bar(76, 66, 80, 26, 7.5);
        bar(86, 74, 98, 44, 6.5);
      } else if (kind === "bird") {
        bar(64, 92, 64, 34, 6);
        bar(64, 92, 30, 52, 6);
        bar(64, 92, 98, 52, 6);
        bar(64, 92, 64, 116, 5);
      } else if (kind === "rabbit") {
        pad(64, 84, 22, 28);
        pad(38, 44, 10, 14);
        pad(56, 32, 10, 14);
        pad(74, 32, 10, 14);
        pad(92, 44, 10, 14);
      } else if (kind === "dog" || kind === "bear") {
        pad(64, 84, 31, 24);
        pad(30, 52, 13, 15);
        pad(51, 31, 13, 15);
        pad(77, 31, 13, 15);
        pad(98, 52, 13, 15);
      } else {
        pad(64, 82, 30, 25);
        pad(30, 50, 12, 15);
        pad(50, 30, 12, 15);
        pad(78, 30, 12, 15);
        pad(98, 50, 12, 15);
      }
      g.lineCap = "round";
      g.lineJoin = "round";
      g.fillStyle = g.strokeStyle = "#ffffff";
      shapes2.forEach((s) => s(3.5));
      g.fillStyle = g.strokeStyle = color;
      shapes2.forEach((s) => s(0));
    });
    return PRINTS[key];
  }
  var MARK_NAMES = ["!", "?", "note", "heart", "sweat", "zzz", "idea", "angry"];
  var MARKS = {};
  function markTexture(kind, font) {
    if (MARKS[kind]) return MARKS[kind];
    MARKS[kind] = canvasTex(160, 160, (g) => {
      g.lineJoin = "round";
      g.lineCap = "round";
      const ink = (fill2, draw) => {
        g.save();
        draw();
        g.lineWidth = 18;
        g.strokeStyle = "#4a3360";
        g.stroke();
        g.restore();
        g.save();
        draw();
        g.lineWidth = 9;
        g.strokeStyle = "#ffffff";
        g.stroke();
        g.restore();
        g.save();
        draw();
        g.fillStyle = fill2;
        g.fill();
        g.restore();
      };
      const text = (t, fill2, size, x = 80, y = 84) => {
        g.font = `bold ${size}px ${font}`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.lineWidth = 22;
        g.strokeStyle = "#4a3360";
        g.strokeText(t, x, y);
        g.lineWidth = 12;
        g.strokeStyle = "#ffffff";
        g.strokeText(t, x, y);
        g.fillStyle = fill2;
        g.fillText(t, x, y);
      };
      const strokes = (col, draw) => {
        for (const [w, c] of [[22, "#4a3360"], [13, "#ffffff"], [7, col]]) {
          g.beginPath();
          draw();
          g.lineWidth = w;
          g.strokeStyle = c;
          g.stroke();
        }
      };
      if (kind === "!") text("！", "#ff5a4a", 120);
      else if (kind === "?") text("？", "#3fa9e0", 120);
      else if (kind === "zzz") {
        text("Z", "#6a6ae8", 74, 62, 96);
        text("z", "#6a6ae8", 50, 112, 50);
      } else if (kind === "heart") ink("#ff6b8a", () => {
        g.beginPath();
        g.moveTo(80, 132);
        g.bezierCurveTo(20, 92, 22, 36, 56, 34);
        g.bezierCurveTo(70, 33, 78, 42, 80, 52);
        g.bezierCurveTo(82, 42, 90, 33, 104, 34);
        g.bezierCurveTo(138, 36, 140, 92, 80, 132);
        g.closePath();
      });
      else if (kind === "sweat") ink("#7cc8f2", () => {
        g.beginPath();
        g.moveTo(80, 22);
        g.bezierCurveTo(98, 56, 118, 78, 118, 102);
        g.arc(80, 102, 38, 0, Math.PI);
        g.bezierCurveTo(42, 78, 62, 56, 80, 22);
        g.closePath();
      });
      else if (kind === "note") {
        ink("#b07ae8", () => {
          g.beginPath();
          g.ellipse(52, 118, 20, 15, -0.4, 0, Math.PI * 2);
          g.ellipse(112, 104, 20, 15, -0.4, 0, Math.PI * 2);
          g.rect(64, 40, 10, 80);
          g.rect(124, 26, 10, 80);
          g.moveTo(64, 40);
          g.lineTo(134, 26);
          g.lineTo(134, 48);
          g.lineTo(64, 62);
          g.closePath();
        });
      } else if (kind === "idea") {
        strokes("#ffcf3a", () => {
          for (const a of [-2.4, -1.57, -0.74, -3, -0.14]) {
            g.moveTo(80 + Math.cos(a) * 56, 72 + Math.sin(a) * 56);
            g.lineTo(80 + Math.cos(a) * 72, 72 + Math.sin(a) * 72);
          }
        });
        ink("#ffe066", () => {
          g.beginPath();
          g.arc(80, 74, 34, Math.PI * 0.8, Math.PI * 2.2);
          g.lineTo(96, 120);
          g.lineTo(64, 120);
          g.closePath();
        });
        ink("#b8b0c8", () => {
          g.beginPath();
          g.rect(64, 122, 32, 16);
        });
      } else if (kind === "angry") {
        strokes("#ff5a4a", () => {
          for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
            g.moveTo(80 + sx * 14, 80 + sy * 50);
            g.quadraticCurveTo(80 + sx * 16, 80 + sy * 16, 80 + sx * 50, 80 + sy * 14);
          }
        });
      }
    });
    return MARKS[kind];
  }
  function follow(d, want, dt) {
    if (!d.at || !dt || d.at.distanceTo(want) > 0.25) {
      d.at = want.clone();
      return;
    }
    d.at.lerp(want, 1 - Math.exp(-dt * 7));
  }
  var TEXTS = /* @__PURE__ */ new Map();
  var KEEP_TEXTS = 120;
  var UPLOAD = null;
  var setTextUpload = (fn) => {
    UPLOAD = fn;
  };
  function keptText(key, make) {
    let t = TEXTS.get(key);
    if (t) {
      TEXTS.delete(key);
      TEXTS.set(key, t);
      return t;
    }
    t = make();
    t.users = 0;
    TEXTS.set(key, t);
    if (UPLOAD) UPLOAD(t.tex);
    for (const [k, v] of TEXTS) {
      if (TEXTS.size <= KEEP_TEXTS) break;
      if (!v.users) {
        v.tex.dispose();
        TEXTS.delete(k);
      }
    }
    return t;
  }
  function letGo(sp) {
    const d = sp.userData;
    if (d.text) d.text.users--;
    else if (d.kind !== "stamp" && !d.shared) sp.material.map.dispose();
    sp.material.dispose();
  }
  function spriteKeeper() {
    const c = document.createElement("canvas");
    c.width = c.height = 2;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, depthWrite: false, transparent: true }));
    sp.visible = false;
    sp.name = "keeper";
    return sp;
  }
  var TOUCHES = 0;
  var RANK = { mark: 1, ono: 2, bubble: 3 };
  var Labels = class {
    constructor(root, font) {
      this.root = root;
      this.font = font;
      this.items = [];
      this.bubbles = {};
      this.gauges = {};
      this.layer = 0;
    }
    // a new touch: what it shows goes in front of everything shown before
    touched() {
      this.layer = ++TOUCHES;
      return this.layer;
    }
    // run fn with what it shows in an earlier touch's layer (a reaction that comes a little later)
    inLayer(layer, fn) {
      const was = this.layer;
      this.layer = layer;
      try {
        return fn();
      } finally {
        if (this.layer === layer) this.layer = was;
      }
    }
    _order(kind) {
      return 1e3 + this.layer * 10 + RANK[kind];
    }
    // the print and the feeling marks drawn and sent to the screen before the first touch (page.js warmTexts)
    warmMarks(hand, kinds) {
      const t = [printTexture(hand), ...kinds.map((k) => markTexture(k, this.font))];
      if (UPLOAD) t.forEach((x) => UPLOAD(x));
      return t;
    }
    // a picture just made ready is drawn in this frame, too small to be seen (some phones get a picture ready only
    // when it is first drawn); warmHide: the ones of the frame before go
    warmShow(i, tex) {
      const ws = this._warmSp || (this._warmSp = []);
      let sp = ws[i];
      if (!sp) {
        sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }));
        sp.scale.set(1e-5, 1e-5, 1);
        sp.frustumCulled = false;
        sp.name = "warm";
        this.root.add(sp);
        ws[i] = sp;
      }
      sp.material.map = tex;
      sp.visible = true;
    }
    warmHide() {
      if (this._warmSp) for (const sp of this._warmSp) sp.visible = false;
    }
    // tap feedback: a little print of the main character's hand (paw, hand …) that pops and fades (unlike any sparkle or glow)
    stamp(p, hand) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: printTexture(hand), depthTest: false, depthWrite: false, transparent: true }));
      sp.renderOrder = 940;
      sp.material.rotation = (Math.random() - 0.5) * 0.7;
      const s = 0.05 * (this.scale || 1);
      sp.userData = { kind: "stamp", age: 0, life: 0.75, s };
      sp.position.set(p.x, p.y, p.z + 0.012);
      sp.scale.set(1e-3, 1e-3, 1);
      this.root.add(sp);
      this.items.push(sp);
    }
    // a feeling mark (MARK_NAMES) right above a character's head; it pops, bobs and fades.
    // When the character speaks, the mark goes (the words say it): see bubble()
    speaking(owner) {
      const b = this.bubbles[owner];
      return !!(b && b.userData.age < b.userData.life);
    }
    mark(kind, anchorFn, owner = null) {
      if (owner && this.speaking(owner)) return;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: markTexture(kind, this.font), depthTest: false, depthWrite: false, transparent: true }));
      sp.center.set(0.5, 0);
      sp.renderOrder = this._order("mark");
      const s = 0.07 * (this.scale || 1);
      sp.userData = { kind: "mark", shared: true, age: 0, life: 1.8, s, anchorFn, owner };
      sp.position.copy(anchorFn());
      sp.scale.set(1e-3, 1e-3, 1);
      this.root.add(sp);
      this.items.push(sp);
    }
    // ring timer / power bar that follows a point. kind: 'ring' | 'bar'
    gauge(key, kind, anchorFn, text = "", color = "#5fc46a") {
      this.removeGauge(key);
      const W2 = kind === "bar" ? 300 : 140, H2 = kind === "bar" ? 96 : 140;
      const c = document.createElement("canvas");
      c.width = W2;
      c.height = H2;
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }));
      sp.center.set(0.5, 0);
      sp.renderOrder = 990;
      sp.userData = { kind, anchorFn, c, tex, text, color, frac: -1, W: W2, H: H2, age: 0, blink: false };
      this.root.add(sp);
      this.gauges[key] = sp;
      this.setGauge(key, 1);
      return sp;
    }
    setGauge(key, frac, blink = false) {
      const sp = this.gauges[key];
      if (!sp) return;
      const d = sp.userData;
      frac = Math.max(0, Math.min(1, frac));
      if (Math.abs(frac - d.frac) < 0.01 && blink === d.blink) return;
      d.frac = frac;
      d.blink = blink;
      const g = d.c.getContext("2d");
      g.clearRect(0, 0, d.W, d.H);
      if (d.kind === "ring") {
        const cx = d.W / 2, cy = d.H / 2, r = 54;
        g.fillStyle = "#fffdf6";
        g.beginPath();
        g.arc(cx, cy, r + 8, 0, Math.PI * 2);
        g.fill();
        g.lineWidth = 6;
        g.strokeStyle = "#4a3360";
        g.stroke();
        g.lineWidth = 14;
        g.strokeStyle = "#e8e2f0";
        g.beginPath();
        g.arc(cx, cy, r - 6, 0, Math.PI * 2);
        g.stroke();
        g.strokeStyle = frac > 0.35 ? d.color : "#ff8a3a";
        g.lineCap = "round";
        g.beginPath();
        g.arc(cx, cy, r - 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
        g.stroke();
        g.fillStyle = "#3b2e5a";
        g.font = `bold ${d.text.length > 2 ? 30 : 44}px ${this.font}`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(d.text, cx, cy + 2);
      } else {
        const x = 10, y = 40, w = d.W - 20, h = 44;
        g.fillStyle = "#fffdf6";
        g.strokeStyle = "#4a3360";
        g.lineWidth = 6;
        rrect(g, x, y, w, h, 22);
        g.fill();
        g.stroke();
        const grd = g.createLinearGradient(x, 0, x + w, 0);
        grd.addColorStop(0, "#ffcf5a");
        grd.addColorStop(1, "#ff5a4a");
        g.fillStyle = grd;
        if (frac > 0.01) {
          rrect(g, x + 6, y + 6, (w - 12) * frac, h - 12, 16);
          g.fill();
        }
        if (d.text) {
          g.font = `bold 28px ${this.font}`;
          const tw = Math.min(d.W - 24, g.measureText(d.text).width + 28);
          g.fillStyle = "#fffdf6";
          g.strokeStyle = "#4a3360";
          g.lineWidth = 4;
          rrect(g, (d.W - tw) / 2, 2, tw, 34, 17);
          g.fill();
          g.stroke();
          g.fillStyle = "#3b2e5a";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(d.text, d.W / 2, 20, d.W - 40);
        }
      }
      d.tex.needsUpdate = true;
    }
    removeGauge(key) {
      const g = this.gauges[key];
      if (!g) return;
      this.root.remove(g);
      g.material.map.dispose();
      g.material.dispose();
      delete this.gauges[key];
    }
    _onoTex(text, color) {
      const fs = 96, pad = 26;
      const meas = document.createElement("canvas").getContext("2d");
      meas.font = `bold ${fs}px ${this.font}`;
      const w = Math.ceil(meas.measureText(text).width + pad * 2), h = Math.ceil(fs * 1.45);
      const tex = canvasTex(w, h, (g) => {
        g.font = `bold ${fs}px ${this.font}`;
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.lineJoin = "round";
        g.lineWidth = 26;
        g.strokeStyle = "#4a3360";
        g.strokeText(text, w / 2, h / 2);
        g.lineWidth = 15;
        g.strokeStyle = "#ffffff";
        g.strokeText(text, w / 2, h / 2);
        g.fillStyle = color;
        g.fillText(text, w / 2, h / 2);
      });
      return { tex, W: w, H: h };
    }
    onoText(text, color = "#ff6a5a") {
      return keptText(`o|${color}|${text}`, () => this._onoTex(text, color));
    }
    bubbleText(text, color) {
      return keptText(`b|${color}|${text}`, () => this._bubbleTex(text, color));
    }
    ono(text, p, color = "#ff6a5a", size = 1) {
      const T3 = this.onoText(text, color), w = T3.W, h = T3.H;
      T3.users++;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: T3.tex, depthTest: false, depthWrite: false, transparent: true }));
      sp.center.set(0.5, 0);
      sp.renderOrder = this._order("ono");
      const k = 52e-5 * size * (this.scale || 1);
      sp.material.rotation = (Math.random() - 0.5) * 0.3;
      sp.userData = { kind: "ono", age: 0, life: 1.25, w: w * k, h: h * k, p0: p.clone(), text: T3 };
      sp.position.copy(p);
      sp.scale.set(1e-3, 1e-3, 1);
      this.root.add(sp);
      this.items.push(sp);
    }
    _bubbleTex(text, color) {
      const fs = 46, pad = 30, maxW = 600;
      const meas = document.createElement("canvas").getContext("2d");
      meas.font = `bold ${fs}px ${this.font}`;
      const lines = [];
      for (const para of text.split("\n")) {
        let cur = "";
        for (const tok of para.match(new RegExp("[\\p{L}\\p{N}'’.,!?;:\\-]+(?<![\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}])\\s*|\\s+|.", "gu")) || []) {
          const word = /^[\p{Script=Latin}\p{N}]/u.test(tok) && meas.measureText(tok.trimEnd()).width <= maxW ? [tok] : [...tok];
          for (const w of word) {
            if (meas.measureText((cur + w).trimEnd()).width > maxW && cur.trim()) {
              lines.push(cur.trimEnd());
              cur = w.trimStart();
            } else cur += w;
          }
        }
        if (cur.trim()) lines.push(cur.trimEnd());
      }
      const tw = Math.max(...lines.map((l) => meas.measureText(l).width));
      const bw = Math.ceil(tw + pad * 2), lh = fs * 1.3, bh = Math.ceil(lines.length * lh + pad * 1.6), tail = 34;
      const W2 = bw + 16, H2 = bh + tail + 16;
      const tex = canvasTex(W2, H2, (g) => {
        const x = 8, y = 8, r = 34;
        g.beginPath();
        g.moveTo(x + r, y);
        g.lineTo(x + bw - r, y);
        g.quadraticCurveTo(x + bw, y, x + bw, y + r);
        g.lineTo(x + bw, y + bh - r);
        g.quadraticCurveTo(x + bw, y + bh, x + bw - r, y + bh);
        g.lineTo(x + bw / 2 + 22, y + bh);
        g.lineTo(x + bw / 2, y + bh + tail);
        g.lineTo(x + bw / 2 - 22, y + bh);
        g.lineTo(x + r, y + bh);
        g.quadraticCurveTo(x, y + bh, x, y + bh - r);
        g.lineTo(x, y + r);
        g.quadraticCurveTo(x, y, x + r, y);
        g.closePath();
        g.fillStyle = "#fffdf6";
        g.fill();
        g.lineWidth = 7;
        g.strokeStyle = color;
        g.lineJoin = "round";
        g.stroke();
        g.fillStyle = "#3b2e5a";
        g.font = `bold ${fs}px ${this.font}`;
        g.textBaseline = "middle";
        g.textAlign = "center";
        lines.forEach((l, i) => g.fillText(l, x + bw / 2, y + pad * 0.8 + lh * (i + 0.5)));
      });
      return { tex, W: W2, H: H2 };
    }
    bubble(key, text, color, anchorFn) {
      this.removeBubble(key);
      for (const m of this.items) if (m.userData.kind === "mark" && m.userData.owner === key) m.userData.life = Math.min(m.userData.life, m.userData.age + 0.12);
      for (const b of Object.values(this.bubbles)) b.userData.life = Math.min(b.userData.life, b.userData.age + 0.6);
      const T3 = this.bubbleText(text, color), W2 = T3.W, H2 = T3.H;
      T3.users++;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: T3.tex, depthTest: false, depthWrite: false, transparent: true }));
      sp.center.set(0.5, 0);
      sp.renderOrder = this._order("bubble");
      const k = 48e-5 * (this.scale || 1);
      sp.userData = { kind: "bubble", anchorFn, w: W2 * k, h: H2 * k, age: 0, life: 2.4 + text.length * 0.09, text: T3 };
      sp.scale.set(1e-3, 1e-3, 1);
      this.root.add(sp);
      this.bubbles[key] = sp;
      this._place(sp);
    }
    removeBubble(key) {
      const b = this.bubbles[key];
      if (!b) return;
      this.root.remove(b);
      letGo(b);
      delete this.bubbles[key];
    }
    clear() {
      Object.keys(this.bubbles).forEach((k) => this.removeBubble(k));
      Object.keys(this.gauges).forEach((k) => this.removeGauge(k));
      for (const s of this.items) {
        this.root.remove(s);
        letGo(s);
      }
      this.items = [];
    }
    // a word that would rise onto a gauge (power bar, timer ring) goes up beside it instead, so both can be read.
    // With several gauges in a row (みんなで: a ring over each one), it takes the free place nearest to where it was
    // (so it stays by the thing that was touched), not the side of one gauge and then of the next, and the next …
    _beside(d, up) {
      const boxes = Object.values(this.gauges).map((g) => {
        const gd = g.userData, base = (gd.kind === "bar" ? 62e-5 : 36e-5) * (this.scale || 1);
        return { w: gd.W * base, h: gd.H * base, c: gd.anchorFn() };
      });
      if (!boxes.length) return;
      const hitsAt = (x) => boxes.some((b) => {
        const a = d.p0.clone().sub(b.c).dot(up) + 0.07;
        return a < b.h && a + d.h > 0 && Math.abs(x - b.c.x) < (b.w + d.w) / 2;
      });
      if (!hitsAt(d.p0.x)) return;
      const lim = 0.5 - d.w / 2, cand = [];
      for (const b of boxes) for (const s of [-1, 1]) cand.push(b.c.x + s * ((b.w + d.w) / 2 + 0.01));
      const free = cand.filter((x) => Math.abs(x) <= lim && !hitsAt(x)).sort((a, b) => Math.abs(a - d.p0.x) - Math.abs(b - d.p0.x));
      if (free.length && Math.abs(free[0] - d.p0.x) < 0.25) {
        d.p0.x = free[0];
        return;
      }
      d.noRise = true;
    }
    _place(sp, dt = 0) {
      const d = sp.userData;
      follow(d, d.anchorFn(), dt);
      const v = d.at.clone(), half = d.w / 2;
      v.x = Math.min(0.52 - half, Math.max(-0.52 + half, v.x));
      sp.position.copy(v);
    }
    update(dt, up) {
      this.items = this.items.filter((s) => {
        const d = s.userData;
        d.age += dt;
        const u = d.age / d.life;
        if (u >= 1) {
          this.root.remove(s);
          letGo(s);
          return false;
        }
        if (d.kind === "stamp") {
          const k2 = easeOutBack(Math.min(1, d.age / 0.18)) * d.s;
          s.scale.set(k2, k2, 1);
          s.material.opacity = u > 0.45 ? 1 - (u - 0.45) / 0.55 : 1;
          return true;
        }
        if (d.kind === "mark") {
          const k2 = easeOutBack(Math.min(1, d.age / 0.22)) * d.s, bob = Math.sin(d.age * 7) * 4e-3;
          follow(d, d.anchorFn(), dt);
          s.position.copy(d.at).add(up.clone().multiplyScalar(bob));
          s.scale.set(k2, k2, 1);
          s.material.opacity = u > 0.75 ? 1 - (u - 0.75) / 0.25 : 1;
          return true;
        }
        if (!d.placed) {
          d.placed = true;
          this._beside(d, up);
        }
        const k = easeOutBack(Math.min(1, d.age / 0.25));
        s.scale.set(d.w * k, d.h * k, 1);
        const rise = d.noRise ? 0.012 : 0.07 * easeOutBack(Math.min(1, u * 1.4));
        s.position.set(d.p0.x + up.x * rise, d.p0.y + up.y * rise, d.p0.z + up.z * rise);
        s.material.opacity = u > 0.75 ? 1 - (u - 0.75) / 0.25 : 1;
        return true;
      });
      for (const g of Object.values(this.gauges)) {
        const d = g.userData;
        d.age += dt;
        const v = d.anchorFn();
        g.position.copy(v);
        const base = (d.kind === "bar" ? 62e-5 : 36e-5) * (this.scale || 1);
        const pop = easeOutBack(Math.min(1, d.age / 0.25));
        const vis = d.blink ? Math.sin(d.age * 18) > -0.2 ? 1 : 0.35 : 1;
        g.scale.set(d.W * base * pop, d.H * base * pop, 1);
        g.material.opacity = vis;
      }
      for (const [key, b] of Object.entries(this.bubbles)) {
        const d = b.userData;
        d.age += dt;
        this._place(b, dt);
        const k = easeOutBack(Math.min(1, d.age / 0.28));
        b.scale.set(d.w * k, d.h * k, 1);
        const out = d.age - d.life;
        b.material.opacity = out > 0 ? Math.max(0, 1 - out / 0.3) : 1;
        if (out > 0.3) this.removeBubble(key);
      }
    }
  };

  // system/engine/scene.js
  var THREE2 = __toESM(require_three(), 1);
  var PH = 0.75;
  var px = ([x, y]) => [x / 1600 - 0.5, PH / 2 - y / 1600];
  var rnd = (a, b) => a + Math.random() * (b - a);
  var pick = (a) => a[Math.floor(Math.random() * a.length)];
  var air = (pg, x, y, h) => new THREE2.Vector3(x, y, 0.01).add(pg.up.clone().multiplyScalar(h));
  var IDLE = {
    float: (c, t, k) => {
      c.still.position.y = (Math.sin(t * 1.7) * 0.5 + 0.5) * 8e-3 * k;
    },
    // ふわふわ
    breathe: (c, t, k) => {
      const s = Math.sin(t * 1.9) * 0.028 * k;
      c.still.scale.set(c.flipX * (1 - s * 0.35), 1 + s, 1);
    },
    // すやすや
    sway: (c, t, k) => {
      c.still.rotation.z = Math.sin(t * 1.3) * 0.05 * k;
    },
    // ゆらゆら
    // 飛び回る: small loops in front of its place, each piece on its own path (ほたる・ちょう・はち)
    fly: (c, t, k) => {
      const fx = 1.2 + 0.35 * Math.sin(c.phase * 2.3), fy = 1.1 + 0.6 * Math.cos(c.phase * 1.7);
      c.still.position.set(Math.sin(t * fx) * 0.045 * k, (0.02 + Math.sin(t * fy + 1) * 0.028) * k, 0.02 + Math.sin(t * 1.1) * 6e-3 * k);
    }
  };
  var WEATHER = {
    snow: { rate: 14, make: (pg) => pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(0.28, 0.4)), { x: rnd(-0.02, 0.02), y: 0, z: 0 }, pick(["#ffffff", "#eef6ff"]), rnd(0.012, 0.022), rnd(4, 6), 0.99, -0.06, 0) },
    rain: { rate: 40, make: (pg) => {
      const v = pg.up.clone().multiplyScalar(-0.9);
      pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(0.3, 0.42)), { x: 0.05, y: v.y, z: v.z }, "#bfe3ff", rnd(6e-3, 9e-3), 0.55, 1, -0.6, 0);
    } },
    petals: { rate: 7, make: (pg) => pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(0.28, 0.4)), { x: rnd(-0.06, 0.06), y: 0, z: 0 }, pick(["#ffc1d4", "#fff3f6", "#ffd1e1"]), rnd(0.016, 0.024), rnd(4, 5.5), 0.985, -0.05, 1) },
    leaves: { rate: 6, make: (pg) => pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(0.28, 0.4)), { x: rnd(-0.07, 0.07), y: 0, z: 0 }, pick(["#f2a03a", "#e8743a", "#d8b23a", "#a8c45a"]), rnd(0.018, 0.026), rnd(4, 5.5), 0.985, -0.06, 1) },
    fireflies: { rate: 3, make: (pg) => pg.fx.emit(air(pg, rnd(-0.48, 0.48), rnd(-0.3, 0.2), rnd(0.02, 0.14)), { x: rnd(-0.03, 0.03), y: rnd(-0.02, 0.02), z: rnd(-0.01, 0.02) }, pick(["#d8ff6a", "#f2ff9a"]), rnd(0.02, 0.028), rnd(2.5, 4), 0.995, 4e-3, 1) },
    bubbles: { rate: 4, make: (pg) => pg.fx.emit(air(pg, rnd(-0.48, 0.48), rnd(-0.3, 0.3), 0), { x: rnd(-0.01, 0.01), y: 0, z: 0 }, pick(["#e8f8ff", "#ffffff"]), rnd(0.016, 0.026), rnd(3, 4.5), 0.99, 0.05, 1) },
    stars: { rate: 6, make: (pg) => pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.2, 0.3), rnd(0.18, 0.4)), { x: 0, y: 0, z: 0 }, pick(["#fff2b0", "#ffffff", "#bfe3ff"]), rnd(0.014, 0.022), rnd(1.2, 2), 1, 0, 1) }
  };
  function weatherTick(pg, kind, dt) {
    const w = WEATHER[kind];
    if (!w || !pg.open) return;
    pg._wx = (pg._wx || 0) + dt * w.rate;
    while (pg._wx >= 1) {
      pg._wx -= 1;
      w.make(pg);
    }
  }
  var MOODS = {
    // おやすみ：流れ星がいくつも流れ、月明かりのきらきらが降る
    night(pg) {
      for (let k = 0; k < (CALM.on ? 3 : 6); k++) pg.later(300 + k * 650, () => {
        const x0 = rnd(-0.45, 0.1), h0 = rnd(0.3, 0.4), dir = new THREE2.Vector3(0.42, 0, 0).add(pg.up.clone().multiplyScalar(-0.18));
        pg.sfx("sui");
        pg.tween(0.9, (t) => {
          const p = air(pg, x0, 0.1, h0).add(dir.clone().multiplyScalar(t));
          pg.fx.emit(p, { x: 0, y: 0, z: 0 }, "#fff6c8", 0.022 * (1 - t * 0.5), 0.6, 1, 0, 0);
        });
      });
      pg.tween(5, () => {
        if (Math.random() < 0.5) pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.2, 0.3), rnd(0.2, 0.4)), { x: 0, y: 0, z: 0 }, pick(["#fff2b0", "#ffffff"]), 0.016, 1.6, 1, -0.01, 1);
      });
    },
    // 星空いっぱい（いちばん大きな おやすみ）：流れ星が たくさん流れ、星が ふりそそぎ、さいごに 大きな金色の流れ星
    starry(pg) {
      MOODS.night(pg);
      for (let k = 0; k < (CALM.on ? 3 : 8); k++) pg.later(1500 + k * 520, () => {
        const x0 = rnd(-0.45, 0.25), h0 = rnd(0.28, 0.42), dir = new THREE2.Vector3(rnd(0.3, 0.45), 0, 0).add(pg.up.clone().multiplyScalar(-0.16));
        pg.tween(1, (t) => pg.fx.emit(air(pg, x0, 0.1, h0).add(dir.clone().multiplyScalar(t)), { x: 0, y: 0, z: 0 }, pick(["#fff6c8", "#ffe08a", "#c8f0ff"]), 0.02 * (1 - t * 0.5), 0.7, 1, 0, 0));
      });
      pg.tween(7, () => {
        if (Math.random() < 0.7) pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.2, 0.3), rnd(0.25, 0.42)), { x: 0, y: -pg.up.y * 0.02, z: -pg.up.z * 0.02 }, pick(["#fff2b0", "#ffffff", "#ffe08a"]), 0.014, 2.2, 1, 0, 0);
      });
      pg.later(CALM.on ? 4200 : 5600, () => {
        const x0 = -0.4, dir = new THREE2.Vector3(0.8, 0, 0).add(pg.up.clone().multiplyScalar(-0.12));
        pg.sfx("kirarin");
        pg.tween(1.6, (t) => {
          for (let k = 0; k < 2; k++) pg.fx.emit(air(pg, x0, 0.12, 0.4).add(dir.clone().multiplyScalar(t)), { x: rnd(-0.01, 0.01), y: 0, z: 0 }, "#ffd84a", 0.032 * (1 - t * 0.4), 0.9, 1, 0, 0);
        });
      });
    },
    // おいわい：紙ふぶき
    celebrate(pg) {
      const cols = ["#ff5a6a", "#ffcf3a", "#5fc46a", "#3fa9e0", "#b07ae8", "#ff9fd0"];
      pg.sfx("waiwai");
      pg.tween(3, () => {
        for (let k = 0; k < 3; k++) pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(0.32, 0.42)), { x: rnd(-0.05, 0.05), y: rnd(-0.02, 0.02), z: 0 }, pick(cols), rnd(0.014, 0.022), rnd(2.5, 3.5), 0.98, -0.12, 1);
      });
    },
    // 春：花が咲くように花びらがはじけ、ふわふわ舞う
    spring(pg) {
      pg.sfx("powa");
      const ids = Object.keys(pg.cards).filter((id) => pg.C(id).body.visible);
      for (let k = 0; k < 6; k++) pg.later(k * 220, () => {
        const p = ids.length ? pg.top(pick(ids), 0.9) : air(pg, rnd(-0.4, 0.4), rnd(-0.2, 0.2), 0.1);
        pg.fx.burst(p, 18, 1, ["#ffc1d4", "#fff3f6", "#ffd1e1", "#fff2a8"]);
      });
      pg.tween(3.5, () => {
        if (Math.random() < 0.6) WEATHER.petals.make(pg);
      });
    },
    // 海：あわが下からたくさんのぼる
    sea(pg) {
      pg.sfx("shuwa");
      pg.tween(3.5, () => {
        for (let k = 0; k < 2; k++) WEATHER.bubbles.make(pg);
      });
      pg.later(300, () => pg.fx.burst(air(pg, 0, 0, 0.15), 24, 1.2, ["#e8f8ff", "#bfe8ff", "#ffffff"]));
    },
    // 虹：空に虹がかかる（keep: かかったまま、ページが かわるまで: lastingTick）
    rainbow(pg, keep = false) {
      pg.sfx("chime");
      const tex = rainbowTexture();
      const m = new THREE2.Mesh(new THREE2.PlaneGeometry(0.9, 0.45), new THREE2.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }));
      const holder = new THREE2.Group();
      holder.add(m);
      m.position.set(0, 0.2, 0);
      holder.position.set(0, 0.15, 2e-3);
      pg.root.add(holder);
      pg._extras.push(holder);
      if (keep) {
        pg._rainbow = { holder, m, a: 0 };
        pg.tween(1.2, (t) => {
          holder.rotation.x = pg.viewTheta * 0.9;
          pg._rainbow.a = t;
          m.material.opacity = t * 0.85;
        });
        return;
      }
      pg.tween(6, (t) => {
        holder.rotation.x = pg.viewTheta * 0.9;
        m.material.opacity = Math.min(1, t * 5, (1 - t) * 4) * 0.85;
        if (!CALM.on && Math.random() < 0.3) pg.fx.emit(air(pg, rnd(-0.4, 0.4), 0.15, rnd(0.2, 0.45)), { x: 0, y: 0, z: 0 }, "#ffffff", 0.016, 1, 1, 0, 1);
      }, () => {
        pg.root.remove(holder);
      });
    }
  };
  var sky = (pg, x, h) => new THREE2.Vector3(x, 0.1, 0.01).add(pg.up.clone().multiplyScalar(h));
  var twinkleStar = (pg, cols = ["#fff2b0", "#ffffff"]) => pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.2, 0.3), rnd(0.2, 0.4)), { x: 0, y: 0, z: 0 }, pick(cols), 0.016, 1.6, 1, -0.01, 1);
  function shootingStar(pg) {
    const x0 = rnd(-0.45, 0.1), h0 = rnd(0.3, 0.4), dir = new THREE2.Vector3(0.42, 0, 0).add(pg.up.clone().multiplyScalar(-0.18));
    pg.tween(0.9, (t) => pg.fx.emit(air(pg, x0, 0.1, h0).add(dir.clone().multiplyScalar(t)), { x: 0, y: 0, z: 0 }, "#fff6c8", 0.022 * (1 - t * 0.5), 0.6, 1, 0, 0));
  }
  var CONFETTI = ["#ff5a6a", "#ffcf3a", "#5fc46a", "#3fa9e0", "#b07ae8", "#ff9fd0"];
  var LASTING = {
    // ふつうの きらきら: now and then a little twinkle by one of the characters
    sparkle: { from: 1.5, every: [0.8, 1.4], event: (pg) => {
      const ids = castIds().filter((id2) => pg.C(id2) && pg.C(id2).body.visible);
      if (!ids.length) {
        twinkleStar(pg, ["#fff2a8", "#ffffff"]);
        return;
      }
      const id = pick(ids), p = pg.top(id, 1);
      for (let k = 0; k < 3; k++) pg.fx.emit({ x: p.x + rnd(-0.03, 0.03), y: p.y + rnd(-0.01, 0.02), z: p.z + rnd(0, 0.02) }, { x: rnd(-0.01, 0.01), y: 0, z: rnd(0, 0.015) }, pick(["#fff2a8", "#ffffff", fireworkColor(id)]), 0.014, 0.9, 0.96, 0.01, 1);
    } },
    // 紙ふぶき: about a quarter of the start, falling on and on
    celebrate: { from: 3, rate: 40, make: (pg) => pg.fx.emit(air(pg, rnd(-0.5, 0.5), rnd(-0.3, 0.3), rnd(0.32, 0.42)), { x: rnd(-0.05, 0.05), y: rnd(-0.02, 0.02), z: 0 }, pick(CONFETTI), rnd(0.014, 0.022), rnd(2.5, 3.5), 0.98, -0.12, 1) },
    spring: { from: 3.5, rate: 7, make: (pg) => WEATHER.petals.make(pg) },
    // 花びら
    sea: { from: 3.5, rate: 6, make: (pg) => WEATHER.bubbles.make(pg) },
    // あわ
    // 夜: the stars go on twinkling, and a shooting star now and then
    night: { from: 5, rate: 8, make: (pg) => twinkleStar(pg), every: [10, 15], event: shootingStar },
    starry: { from: 7, rate: 12, make: (pg) => twinkleStar(pg, ["#fff2b0", "#ffffff", "#ffe08a"]), every: [10, 15], event: shootingStar },
    // 花火: glitter in the night sky, and a small quiet firework high up every 10 seconds or so
    fireworks: { from: 3, rate: 15, make: (pg) => glitter(pg), every: [9, 11], event: (pg) => smallFirework(pg) },
    finale: { from: 7, rate: 15, make: (pg) => glitter(pg), every: [9, 11], event: (pg) => smallFirework(pg) }
  };
  function glitter(pg) {
    pg.fx.emit(sky(pg, -0.5 + Math.random(), 0.32 + Math.random() * 0.14), { x: (Math.random() - 0.5) * 0.02, y: -pg.up.y * 0.03, z: -pg.up.z * 0.03 }, Math.random() < 0.6 ? "#ffe9a0" : "#ffffff", 0.016 + Math.random() * 0.012, 2.4, 0.99, -0.03, 1);
  }
  function smallFirework(pg) {
    const ids = castIds().filter((id) => pg.C(id)), x = rnd(-0.3, 0.3);
    pg.firework(sky(pg, x, rnd(0.34, 0.4)), ids.length ? fireworkColor(pick(ids)) : "#ffd84a", "#ffffff", pick(["peony", "ring"]), new THREE2.Vector3(x * 0.8, -0.1, 0.01), null, { quiet: true, scale: 0.55 });
  }
  function startLasting(pg, effect, trail) {
    const kind = effect === void 0 || effect === "sparkle" || !(effect in LASTING || effect === "rainbow" || effect === "none") ? "sparkle" : effect;
    pg._lasting = { kind, t: 0, acc: 0, next: null, trail: trail && trail.length >= 2 ? trail : null, tacc: 0 };
  }
  function lastingTick(pg, dt) {
    const L = pg._lasting;
    if (!L || !pg.open) return;
    L.t += dt;
    const R = pg._rainbow;
    if (R && R.a >= 1) {
      R.holder.rotation.x = pg.viewTheta * 0.9;
      R.m.material.opacity = CALM.on ? 0.85 : 0.8 + Math.sin(L.t * 1.3) * 0.06;
    }
    if (L.trail && L.t >= 2.2) {
      L.tacc += dt * (CALM.on ? 14 : 24);
      while (L.tacc >= 1) {
        L.tacc -= 1;
        const P = L.trail, u = Math.random() * (P.length - 1), i = Math.min(P.length - 2, Math.floor(u)), f = u - i;
        pg.fx.emit({ x: P[i][0] + (P[i + 1][0] - P[i][0]) * f, y: P[i][1] + (P[i + 1][1] - P[i][1]) * f, z: 0.01 }, { x: 0, y: 0, z: CALM.on ? 0 : 0.05 }, L.color || "#ffe08a", 0.03, 1.6, 0.95, 0, CALM.on ? 0 : 1);
      }
    }
    const k = LASTING[L.kind];
    if (!k || CALM.on || L.t < k.from) return;
    if (k.rate) {
      L.acc += dt * k.rate;
      while (L.acc >= 1) {
        L.acc -= 1;
        k.make(pg);
      }
    }
    if (k.event) {
      if (L.next === null) L.next = L.t + (L.kind === "sparkle" ? 0 : rnd(...k.every) * 0.5);
      if (L.t >= L.next) {
        k.event(pg);
        L.next = L.t + rnd(...k.every);
      }
    }
  }
  var RAINBOW = null;
  function rainbowTexture() {
    if (RAINBOW) return RAINBOW;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d");
    const cols = ["#ff5a5a", "#ffa03a", "#ffe14a", "#6fd06a", "#4ab0f0", "#6a6ae8", "#b07ae8"];
    cols.forEach((col, i) => {
      g.strokeStyle = col;
      g.lineWidth = 16;
      g.globalAlpha = 0.9;
      g.beginPath();
      g.arc(256, 256, 236 - i * 15, Math.PI, 0);
      g.stroke();
    });
    RAINBOW = new THREE2.CanvasTexture(c);
    RAINBOW.colorSpace = THREE2.SRGBColorSpace;
    return RAINBOW;
  }
  var WARM = null;
  function warmTexture() {
    if (WARM) return WARM;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, "rgba(255,240,170,0.95)");
    grd.addColorStop(0.4, "rgba(255,200,90,0.45)");
    grd.addColorStop(1, "rgba(255,170,60,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    WARM = new THREE2.CanvasTexture(c);
    WARM.colorSpace = THREE2.SRGBColorSpace;
    return WARM;
  }
  function light(pg, id, on = true) {
    const c = pg.C(id);
    if (!c) return;
    if (pg.tex[`${id}@on`]) pg.swap(id, on ? `${id}@on` : c.m.tex[0]);
    if (!c.lamp) {
      const s = Math.max(c.w, c.h) * 1.6;
      c.lamp = new THREE2.Mesh(new THREE2.PlaneGeometry(s, s), new THREE2.MeshBasicMaterial({ map: warmTexture(), transparent: true, depthWrite: false, blending: THREE2.AdditiveBlending, opacity: 0 }));
      c.lamp.position.set(c.m.pivot === "left" ? c.w / 2 : c.m.pivot === "right" ? -c.w / 2 : 0, c.m.pivot === "top" ? -c.h / 2 : c.h / 2, -4e-3);
      c.body.add(c.lamp);
    }
    c.lit = on;
    const lamp = c.lamp, from = lamp.material.opacity, to = on ? 0.9 : 0;
    pg.tween(0.5, (t) => {
      lamp.material.opacity = from + (to - from) * t;
      tint(pg, c);
    });
  }
  var NIGHT = new THREE2.Color("#4a5288");
  var WHITE = new THREE2.Color("#ffffff");
  function tint(pg, c) {
    const k = c.lit ? 0 : (pg._dark || 0) / 0.6;
    c.mesh.material.color.copy(WHITE).lerp(NIGHT, Math.min(1, k));
  }
  function darken(pg, amount = 0.45, dur = 1.5) {
    amount = Math.max(0, Math.min(0.6, amount));
    if (!pg._darkPlane) {
      pg._darkPlane = new THREE2.Mesh(new THREE2.PlaneGeometry(1, PH), new THREE2.MeshBasicMaterial({ color: "#0b1030", transparent: true, depthWrite: false, opacity: 0 }));
      pg._darkPlane.position.z = 6e-4;
      pg.root.add(pg._darkPlane);
    }
    const from = pg._dark || 0;
    const set = (v) => {
      pg._dark = v;
      pg._darkPlane.material.opacity = v;
      Object.values(pg.cards).forEach((c) => tint(pg, c));
    };
    if (dur <= 0) set(amount);
    else pg.tween(dur, (t) => set(from + (amount - from) * t));
  }
  function canTravel(pg, id) {
    const c = pg.C(id);
    return !!(c && !c.m.parent);
  }
  function walk(pg, id, points, { speed = 0.16, flip = false, back = false } = {}) {
    const c = pg.C(id);
    if (!canTravel(pg, id) || !points || !points.length) return 0;
    const home = c.pivotHome;
    const atHome = c.pivot.position.distanceTo(home) < 2e-3;
    let path = points.map((q) => {
      const [x, y] = px(q);
      return new THREE2.Vector3(x, y, home.z);
    });
    if (back && !atHome) path = [...path.slice(0, -1).reverse(), home.clone()];
    path = [c.pivot.position.clone(), ...path];
    const seg = [];
    let total = 0;
    for (let i = 1; i < path.length; i++) {
      const d = path[i].distanceTo(path[i - 1]);
      seg.push(d);
      total += d;
    }
    if (total < 1e-4) return 0;
    const dur = Math.max(0.8, total / speed), b = c.body;
    const face = c.m.faces === "left" ? -1 : 1;
    flip = flip || c.m.faces === "left" || c.m.faces === "right";
    pg.tween(dur, (t) => {
      let dist = t * total, i = 0;
      while (i < seg.length - 1 && dist > seg[i]) {
        dist -= seg[i];
        i++;
      }
      const k = seg[i] ? dist / seg[i] : 1;
      c.pivot.position.lerpVectors(path[i], path[i + 1], Math.min(1, k));
      b.position.y = pg.base(c).y + Math.abs(Math.sin(t * dur * 9)) * 0.012;
      if (flip && Math.abs(path[i + 1].x - path[i].x) > 1e-4) {
        c.flipX = (path[i + 1].x < path[i].x ? -1 : 1) * face;
        c.still.scale.x = c.flipX * Math.abs(c.still.scale.x);
      }
    }, () => {
      b.position.y = pg.base(c).y;
    });
    return dur;
  }
  function reveal(pg, boxId, itemId) {
    const box = pg.C(boxId), item = pg.C(itemId);
    if (!box || !item || !item.hidden) return false;
    if (pg.tex[`${boxId}@open`]) pg.swap(boxId, `${boxId}@open`);
    pg.sfx("pon");
    if (!canTravel(pg, itemId)) {
      pg.rise(itemId, -item.h, 0.85);
      pg.later(400, () => pg.burst(itemId, 18, 1.1));
      return true;
    }
    const from = new THREE2.Vector3();
    box.pivot.getWorldPosition(from);
    pg.root.worldToLocal(from);
    from.z = item.pivotHome.z;
    const to = item.pivotHome.clone(), b = item.body;
    item.pivot.position.copy(from);
    b.scale.setScalar(0.3);
    pg.show(itemId);
    pg.tween(0.8, (t) => {
      item.pivot.position.lerpVectors(from, to, t);
      b.position.y = pg.base(item).y + Math.sin(Math.PI * t) * 0.12;
      b.scale.setScalar(0.3 + 0.7 * Math.min(1, t * 1.6));
    }, () => {
      b.position.y = pg.base(item).y;
      b.scale.setScalar(1);
      pg.burst(itemId, 18, 1.1);
      pg.sfx("kirarin");
    });
    return true;
  }

  // system/engine/lang.js
  var LANGS = {
    ja: { name: "にほんご", speech: "ja-JP" },
    en: { name: "English", speech: "en-US" },
    pt: { name: "Português", speech: "pt-BR" }
  };
  var LANG = { now: "ja", voice: "ja", book: {} };
  var KIT = {
    en: {
      // ぬりえ
      "ぬりえ": "Coloring",
      "おわる": "Done",
      "まえの ページ": "Previous page",
      "つぎの ページ": "Next page",
      "ひとつ もどす": "Undo",
      "はじめから": "Start over",
      "おおきく": "Zoom in",
      "ちいさく": "Zoom out",
      "けしゴム": "Eraser",
      "けす": "Erase",
      "はいけいも ぬる": "Color the background",
      "えほんの いろ": "Colors in the book",
      "じぶんの いろ": "My colors",
      "みほんの いろ": "Original colors",
      "あとで でてくる え": "Pictures that come out later",
      "かくれている え": "Hidden pictures",
      "ページ": "Page",
      "いろを けして、はじめから ぬる？": "Erase the colors and start over?",
      "この ページを けす": "Erase this page",
      "ぜんぶの ページを けす": "Erase all pages",
      "やめる": "Cancel",
      "ぬった いろで うごくよ！": "Now they move in your colors!",
      "あか": "Red",
      "ピンク": "Pink",
      "だいだい": "Orange",
      "きいろ": "Yellow",
      "きみどり": "Yellow-green",
      "みどり": "Green",
      "みずいろ": "Light blue",
      "あお": "Blue",
      "むらさき": "Purple",
      "ちゃいろ": "Brown",
      "はだいろ": "Peach",
      "はいいろ": "Gray",
      "くろ": "Black",
      "しろ": "White",
      "えほんの ページを うつしてね": "Point the camera at a page of the book",
      "ひょうし": "Front cover",
      "♪ キラリンが きこえないときは": "♪ Can't hear the chime?",
      "よみこみなおす": "Reload",
      "ページを めくって、": "Turn the page,",
      "この ページを うつしてね": "and show me this page!",
      "1ページから よもう！ 1ページを うつしてね": "Let's start from page 1! Show page 1 to the camera",
      "1ページを うつしてね": "Show page 1 to the camera",
      "じゅんびちゅう…": "Getting ready…",
      "カメラを じゅんびちゅう…": "Starting the camera…",
      "① まず おはなしを よむ（きく）": "① First, read (or listen to) the story",
      "② 「あそぶ」を おすと、えに さわって あそべるよ": '② Press "Play" to touch the pictures and play',
      "AR えほん": "AR picture book",
      "ARだけ": "AR only",
      "おおう": "Cover",
      "おはなしを きいてね": "Listen to the story",
      "おはなしを よんだら「あそぶ」を おしてね": 'After the story, press "Play"',
      "かみの えが みえるように しました": "The paper picture shows now",
      "かみも ひょうじ": "Showing the paper too",
      "かみを かくして、ARの ぶぶんだけ ひょうじ": "Hiding the paper, showing only the AR",
      "ページ ぜんたいを ARで おおいました": "The whole page is covered by AR",
      "こうかおん オン": "Sound effects on",
      "こうかおん オフ": "Sound effects off",
      "セリフ オン": "Voices on",
      "セリフ オフ": "Voices off",
      "この たんまつでは よみあげが つかえません": "Reading aloud is not available on this device",
      "この ページは https の URL で ひらく ひつようが あります。": "This page must be opened with an https URL.",
      "カメラの きょかを オンにして、もういちど ためしてね。": "Allow the camera, then try again.",
      "（ブラウザの せってい → カメラ → きょか）": "(Browser settings → Camera → Allow)",
      "カメラが つかえませんでした": "The camera couldn't be used",
      "さいしょから よもう！": "Let's read from the beginning!",
      "もういちど あそぼう！": "Let's play again!",
      "オン": "on",
      "オフ": "off",
      "ひかえめモード（ひかりと うごきを ひかえめに）": "Calm mode (softer lights and movement)",
      "ゆびで ドラッグすると みる むきが かわるよ。": "Drag with your finger to look from another side.",
      "はじめる": "Start",
      "おとが でます。iPhone は マナーモードを オフにしてね。": "This book has sound. On iPhone, turn off silent mode.",
      "カメラなしプレビュー": "preview without camera",
      "ライセンス表示": "Licenses",
      "スマホの カメラを つかいます。": "This uses your phone's camera.",
      "えほんの ページ（いんさつした かみ、または パソコンの がめん）を よういしてね。": "Have a page of the book ready (printed on paper, or on a computer screen).",
      "カメラで はじめる": "Start with the camera",
      "カメラなしで みる": "View without the camera",
      "もういちど": "Try again",
      "さいしょ": "Restart",
      "はじめ": "Home",
      "さいしょから よむ": "Read from the beginning",
      "さく": "By",
      "はじめに もどる": "Back to the cover",
      "まえの ページ": "Previous page",
      "つぎの ページ": "Next page",
      "できた！": "Done!",
      "▶ あそぶ": "▶ Play",
      "よむ": "Read",
      "とめる": "Stop",
      "セリフ": "Voices",
      "こうかおん": "Sounds",
      "もどす": "Reset",
      "もじ": "Text",
      "もじを ひょうじ": "Showing the text",
      "もじを かくす": "Hiding the text",
      "この ページに ふくまれる ソフトウェアと フォントの ライセンスです。": "Licenses of the software and fonts in this page.",
      "とじる": "Close",
      "あそぼう！": "Let's play!",
      "いろいろ さわってみてね": "Touch things and see what happens",
      "ドーン！": "Boom!",
      "パーン！": "Pow!",
      "ドドーン！": "BOOM!",
      "ポン！": "Pop!",
      "グッ": "Push!",
      "グイッ": "Heave!",
      "ゴシゴシ": "Scrub scrub",
      "キュッキュッ": "Squeak squeak",
      "ぴかぴか！": "Sparkly!",
      "みつけた！": "Found it!",
      "せいかい！": "Right!",
      "ちがうみたい": "Not this one",
      "ちがうよ": "Oops!",
      "あれれ？": "Huh?",
      "さいしょから もういちど": "Start again from the first one",
      "タッチ！": "Tap!",
      "みつけた": "Found",
      "いないみたい": "Not here",
      "みつけた！ ほかにも だれか かくれているみたい": "Found! Someone else seems to be hiding too.",
      "{x}が いっしょに いくよ！": "{x} is coming along!",
      "{x}を ありがとう！ {y}を どうぞ": "Thank you for the {x}! Here is a {y}.",
      "{y}を つかって あそぼう！": "Let's play with the {y}!",
      "てで そっと つかまえよう！": "Let's catch them gently with your hands!",
      "てで ポンと たたこう！": "Let's tap them with your hand!",
      "おちてくる ものを タッチしてね": "Touch the things falling down",
      "キャッチ": "Caught",
      "ぜんぶ キャッチしたね！": "You caught them all!",
      "ゆびで おして はこんでね": "Press and carry it with your finger",
      "ひかった じゅんばんに タッチしてね": "Touch them in the order they shine",
      "おなじ えを 2まい さがしてね": "Find two cards with the same picture",
      "ながく おしてね": "Press and hold",
      "てんを じゅんばんに なぞってね": "Trace the dots in order",
      "はこんだ": "Carried",
      "できた": "Done",
      "ペア": "Pairs",
      "つないだ": "Joined",
      "ゆびで おしたまま うごかしてね": "Keep your finger on it and move it",
      "よく みててね": "Watch carefully",
      "おなじ じゅんばんで タッチしてね": "Now touch them in the same order",
      "もういちど みてね": "Let's watch once more",
      "ゆびを はなさずに ながく おしてね": "Keep pressing without lifting your finger",
      "とどいた！": "Got there!",
      "やったね！": "You did it!",
      "すごい！": "Great!",
      "そろった！": "A pair!",
      "おなじ！": "Same!",
      "ぎゅー": "Squeeze",
      "もうすこし！": "Almost!",
      "ぜんぶ はこんだね！": "You carried them all!",
      "よく おぼえたね！": "You remembered so well!",
      "ぜんぶ そろったね！": "You found all the pairs!",
      "できあがり！": "All done!",
      "タッチ": "Tap",
      "じゅんばん": "Order",
      "そだつ": "Grow",
      "きせかえ": "Dress-up",
      "きれい": "Clean",
      "ちから": "Power",
      "できたね！ すごい！": "You did it! Great!",
      "おおきく なったね！": "It grew so big!",
      "ぜんぶ つかまえたね！": "You caught them all!",
      "ぴかぴかに なったね！": "All shiny now!",
      "なんども タッチしてね": "Tap it again and again",
      "じゅんばんに タッチしてね": "Tap them in order",
      "どれかな？ えらんで タッチしてね": "Which one? Tap to choose",
      "でてきたら タッチしてね": "Tap them when they pop up",
      "なんども タッチして そだててね": "Tap again and again to make it grow",
      "おてほんと おなじに してね": "Make it look like the example",
      "タッチして きせかえしてね": "Tap to change the clothes",
      "ゆびで こすってね": "Rub with your finger",
      "みんなを タッチしてから、なんども タッチしてね": "Tap everyone first, then tap again and again",
      "びくとも しない": "It won't budge",
      "まずは みんなを タッチ！": "Tap everyone first!",
      "いまだ！ なんども タッチ！": "Now! Tap again and again!",
      "つかれちゃった！ もういちど みんなを タッチ": "They got tired! Tap everyone again",
      "ふぅ…": "Phew…",
      "みんな": "Everyone",
      "かくれている ものを {n}つ さがしてね": "Find the {n} hidden things",
      "{n}びょうの うちに ぜんぶ タッチしてね": "Tap them all within {n} seconds",
      "じかんぎれ！ {n}びょうの うちに ぜんぶ タッチしてね": "Time's up! Tap them all within {n} seconds",
      // the end of the book, stamps, things you carry, for grown-ups, languages
      "おしまい": "The End",
      "よんでくれて ありがとう！": "Thank you for reading!",
      "ごほうびスタンプ": "Reward stamps",
      "ぜんぶの ページで スタンプを もらったよ！": "You got a stamp on every page!",
      "スタンプの ない ページも あそんでみてね": "Try the pages without a stamp, too",
      "スタンプ ゲット！": "You got a stamp!",
      "もちもの": "Things you have",
      "{x}を てに いれた！": "You got: {x}!",
      "おとなの かたへ": "For grown-ups",
      "ことば": "Language",
      "こえ": "Voice",
      "よみあげ チェック": "Reading check",
      "▶ を おすと、この スマホの こえで よみます。よみかたが ちがう ことばは、読み上げ原稿（read）を なおします。": "Press ▶ to hear it in this phone's voice. Fix the translation if something sounds wrong.",
      "この ページを ぜんぶ よむ": "Read the whole page",
      "はじめる がめんへ": "To the start screen",
      "おはなし": "Story",
      "そのほかの セリフ": "Other lines"
    },
    pt: {
      // ぬりえ
      "ぬりえ": "Colorir",
      "おわる": "Pronto",
      "まえの ページ": "Página anterior",
      "つぎの ページ": "Próxima página",
      "ひとつ もどす": "Desfazer",
      "はじめから": "Recomeçar",
      "おおきく": "Aumentar",
      "ちいさく": "Diminuir",
      "けしゴム": "Borracha",
      "けす": "Apagar",
      "はいけいも ぬる": "Colorir o fundo",
      "えほんの いろ": "Cores no livro",
      "じぶんの いろ": "Minhas cores",
      "みほんの いろ": "Cores originais",
      "あとで でてくる え": "Figuras que aparecem depois",
      "かくれている え": "Figuras escondidas",
      "ページ": "Página",
      "いろを けして、はじめから ぬる？": "Apagar as cores e começar de novo?",
      "この ページを けす": "Apagar esta página",
      "ぜんぶの ページを けす": "Apagar todas as páginas",
      "やめる": "Cancelar",
      "ぬった いろで うごくよ！": "Agora elas se mexem com as suas cores!",
      "あか": "Vermelho",
      "ピンク": "Rosa",
      "だいだい": "Laranja",
      "きいろ": "Amarelo",
      "きみどり": "Verde-claro",
      "みどり": "Verde",
      "みずいろ": "Azul-claro",
      "あお": "Azul",
      "むらさき": "Roxo",
      "ちゃいろ": "Marrom",
      "はだいろ": "Pêssego",
      "はいいろ": "Cinza",
      "くろ": "Preto",
      "しろ": "Branco",
      "えほんの ページを うつしてね": "Aponte a câmera para uma página do livro",
      "ひょうし": "Capa",
      "♪ キラリンが きこえないときは": "♪ Não ouviu o som?",
      "よみこみなおす": "Recarregar",
      "ページを めくって、": "Vire a página",
      "この ページを うつしてね": "e me mostre esta página!",
      "1ページから よもう！ 1ページを うつしてね": "Vamos começar pela página 1! Mostre a página 1 para a câmera",
      "1ページを うつしてね": "Mostre a página 1 para a câmera",
      "じゅんびちゅう…": "Preparando…",
      "カメラを じゅんびちゅう…": "Ligando a câmera…",
      "① まず おはなしを よむ（きく）": "① Primeiro, leia (ou ouça) a história",
      "② 「あそぶ」を おすと、えに さわって あそべるよ": '② Toque em "Brincar" para tocar nas figuras e brincar',
      "AR えほん": "Livro ilustrado em AR",
      "ARだけ": "Só AR",
      "おおう": "Cobrir",
      "おはなしを きいてね": "Ouça a história",
      "おはなしを よんだら「あそぶ」を おしてね": 'Depois da história, toque em "Brincar"',
      "かみの えが みえるように しました": "Agora a figura do papel aparece",
      "かみも ひょうじ": "Mostrando o papel também",
      "かみを かくして、ARの ぶぶんだけ ひょうじ": "Escondendo o papel, só o AR aparece",
      "ページ ぜんたいを ARで おおいました": "A página inteira está coberta pelo AR",
      "こうかおん オン": "Efeitos sonoros ligados",
      "こうかおん オフ": "Efeitos sonoros desligados",
      "セリフ オン": "Vozes ligadas",
      "セリフ オフ": "Vozes desligadas",
      "この たんまつでは よみあげが つかえません": "A leitura em voz alta não funciona neste aparelho",
      "この ページは https の URL で ひらく ひつようが あります。": "Esta página precisa ser aberta com um endereço https.",
      "カメラの きょかを オンにして、もういちど ためしてね。": "Permita o uso da câmera e tente de novo.",
      "（ブラウザの せってい → カメラ → きょか）": "(Configurações do navegador → Câmera → Permitir)",
      "カメラが つかえませんでした": "Não foi possível usar a câmera",
      "さいしょから よもう！": "Vamos ler desde o começo!",
      "もういちど あそぼう！": "Vamos brincar de novo!",
      "オン": "ligado",
      "オフ": "desligado",
      "ひかえめモード（ひかりと うごきを ひかえめに）": "Modo calmo (luzes e movimentos mais suaves)",
      "ゆびで ドラッグすると みる むきが かわるよ。": "Arraste com o dedo para ver de outro ângulo.",
      "はじめる": "Começar",
      "おとが でます。iPhone は マナーモードを オフにしてね。": "Este livro tem som. No iPhone, desative o modo silencioso.",
      "カメラなしプレビュー": "prévia sem câmera",
      "ライセンス表示": "Licenças",
      "スマホの カメラを つかいます。": "Usa a câmera do celular.",
      "えほんの ページ（いんさつした かみ、または パソコンの がめん）を よういしてね。": "Deixe uma página do livro pronta (impressa em papel ou na tela de um computador).",
      "カメラで はじめる": "Começar com a câmera",
      "カメラなしで みる": "Ver sem a câmera",
      "もういちど": "Tentar de novo",
      "さいしょ": "Recomeçar",
      "はじめ": "Início",
      "さいしょから よむ": "Ler desde o começo",
      "さく": "Autor",
      "はじめに もどる": "Voltar para a capa",
      "まえの ページ": "Página anterior",
      "つぎの ページ": "Próxima página",
      "できた！": "Feito!",
      "▶ あそぶ": "▶ Brincar",
      "よむ": "Ler",
      "とめる": "Parar",
      "セリフ": "Vozes",
      "こうかおん": "Sons",
      "もどす": "Reiniciar",
      "もじ": "Texto",
      "もじを ひょうじ": "Mostrando o texto",
      "もじを かくす": "Escondendo o texto",
      "この ページに ふくまれる ソフトウェアと フォントの ライセンスです。": "Licenças dos programas e das fontes desta página.",
      "とじる": "Fechar",
      "あそぼう！": "Vamos brincar!",
      "いろいろ さわってみてね": "Toque nas coisas e veja o que acontece",
      "ドーン！": "Bum!",
      "パーン！": "Pá!",
      "ドドーン！": "BUUUM!",
      "ポン！": "Pop!",
      "グッ": "Força!",
      "グイッ": "Upa!",
      "ゴシゴシ": "Esfrega, esfrega",
      "キュッキュッ": "Nhec, nhec",
      "ぴかぴか！": "Brilhando!",
      "みつけた！": "Achei!",
      "せいかい！": "Acertou!",
      "ちがうみたい": "Não é esse",
      "ちがうよ": "Ops!",
      "あれれ？": "Ué?",
      "さいしょから もういちど": "Comece de novo pelo primeiro",
      "タッチ！": "Toque!",
      "みつけた": "Achados",
      "いないみたい": "Não está aqui",
      "みつけた！ ほかにも だれか かくれているみたい": "Achei! Parece que tem mais alguém escondido.",
      "{x}が いっしょに いくよ！": "{x} vem junto!",
      "{x}を ありがとう！ {y}を どうぞ": "Obrigado por {x}! Aqui está: {y}.",
      "{y}を つかって あそぼう！": "Vamos brincar com {y}!",
      "てで そっと つかまえよう！": "Vamos pegar com as mãos, devagarinho!",
      "てで ポンと たたこう！": "Vamos bater de leve com a mão!",
      "おちてくる ものを タッチしてね": "Toque nas coisas que caem",
      "キャッチ": "Pegos",
      "ぜんぶ キャッチしたね！": "Você pegou todos!",
      "ゆびで おして はこんでね": "Segure com o dedo e leve",
      "ひかった じゅんばんに タッチしてね": "Toque na ordem em que brilharem",
      "おなじ えを 2まい さがしてね": "Encontre duas cartas iguais",
      "ながく おしてね": "Aperte e segure",
      "てんを じゅんばんに なぞってね": "Ligue os pontos em ordem",
      "はこんだ": "Levados",
      "できた": "Feitos",
      "ペア": "Pares",
      "つないだ": "Ligados",
      "ゆびで おしたまま うごかしてね": "Mantenha o dedo e arraste",
      "よく みててね": "Preste atenção",
      "おなじ じゅんばんで タッチしてね": "Agora toque na mesma ordem",
      "もういちど みてね": "Vamos ver mais uma vez",
      "ゆびを はなさずに ながく おしてね": "Continue apertando sem soltar o dedo",
      "とどいた！": "Chegou!",
      "やったね！": "Conseguiu!",
      "すごい！": "Incrível!",
      "そろった！": "Um par!",
      "おなじ！": "Iguais!",
      "ぎゅー": "Aperta",
      "もうすこし！": "Quase!",
      "ぜんぶ はこんだね！": "Você levou todos!",
      "よく おぼえたね！": "Que boa memória!",
      "ぜんぶ そろったね！": "Você achou todos os pares!",
      "できあがり！": "Pronto!",
      "タッチ": "Toques",
      "じゅんばん": "Ordem",
      "そだつ": "Crescer",
      "きせかえ": "Roupas",
      "きれい": "Limpo",
      "ちから": "Força",
      "できたね！ すごい！": "Conseguiu! Muito bem!",
      "おおきく なったね！": "Cresceu bastante!",
      "ぜんぶ つかまえたね！": "Pegou todos!",
      "ぴかぴかに なったね！": "Ficou brilhando!",
      "なんども タッチしてね": "Toque várias vezes",
      "じゅんばんに タッチしてね": "Toque na ordem certa",
      "どれかな？ えらんで タッチしてね": "Qual será? Toque para escolher",
      "でてきたら タッチしてね": "Toque quando aparecerem",
      "なんども タッチして そだててね": "Toque várias vezes para fazer crescer",
      "おてほんと おなじに してね": "Deixe igual ao modelo",
      "タッチして きせかえしてね": "Toque para trocar a roupa",
      "ゆびで こすってね": "Esfregue com o dedo",
      "みんなを タッチしてから、なんども タッチしてね": "Toque em todos primeiro e depois toque várias vezes",
      "びくとも しない": "Não se mexe nem um pouco",
      "まずは みんなを タッチ！": "Primeiro, toque em todos!",
      "いまだ！ なんども タッチ！": "Agora! Toque várias vezes!",
      "つかれちゃった！ もういちど みんなを タッチ": "Ficaram cansados! Toque em todos de novo",
      "ふぅ…": "Ufa…",
      "みんな": "Todos",
      "かくれている ものを {n}つ さがしてね": "Encontre as {n} coisas escondidas",
      "{n}びょうの うちに ぜんぶ タッチしてね": "Toque em todos em {n} segundos",
      "じかんぎれ！ {n}びょうの うちに ぜんぶ タッチしてね": "Acabou o tempo! Toque em todos em {n} segundos",
      "おしまい": "Fim",
      "よんでくれて ありがとう！": "Obrigado por ler!",
      "ごほうびスタンプ": "Carimbos de prêmio",
      "ぜんぶの ページで スタンプを もらったよ！": "Você ganhou um carimbo em todas as páginas!",
      "スタンプの ない ページも あそんでみてね": "Brinque também nas páginas sem carimbo",
      "スタンプ ゲット！": "Ganhou um carimbo!",
      "もちもの": "Seus itens",
      "{x}を てに いれた！": "Você pegou: {x}!",
      "おとなの かたへ": "Para os adultos",
      "ことば": "Idioma",
      "こえ": "Voz",
      "よみあげ チェック": "Verificar a leitura",
      "▶ を おすと、この スマホの こえで よみます。よみかたが ちがう ことばは、読み上げ原稿（read）を なおします。": "Toque em ▶ para ouvir com a voz deste celular. Se algo soar errado, corrija a tradução.",
      "この ページを ぜんぶ よむ": "Ler a página inteira",
      "はじめる がめんへ": "Para a tela inicial",
      "おはなし": "História",
      "そのほかの セリフ": "Outras falas"
    }
  };
  var ADULTS = {
    ja: {
      how: ["印刷した絵本（またはパソコンの画面に表示したページ）を用意します。", "このページの「カメラで はじめる」を押し、カメラの使用を許可します。", "絵本のページを映すと、絵が飛び出します。「よむ」で読み上げ、「あそぶ」で絵にさわって遊べます。"],
      safe: ["周りに気をつけ、歩きながら使わないでください。", "明るい場所で使うと、よく映ります。", "長く続けて使うときは、ときどき休憩しましょう。光の点滅が気になるときは「ひかえめモード」をオンにしてください。", "カメラの映像はスマホの中だけで使われ、外部には送られません。"],
      titles: { how: "使いかた", safe: "安心して使うために", about: "この絵本について" },
      by: "作",
      url: "この絵本のページ",
      repo: "GitHub のページ",
      kit: "この絵本は「越前市ぷらぷらぼ AR えほんキット」で作りました。"
    },
    en: {
      how: ["Have the printed book ready (or a page shown on a computer screen).", 'Press "Start with the camera" on this page and allow the camera.', 'Point the camera at a page and the pictures pop up. "Read" reads the story aloud, and "Play" lets you touch the pictures.'],
      safe: ["Watch your surroundings and do not use it while walking.", "It works best in a bright place.", 'Take breaks when using it for a long time. If flashing lights bother your child, turn on "Calm mode".', "The camera image is used only inside your phone and is not sent anywhere."],
      titles: { how: "How to use", safe: "For safe use", about: "About this book" },
      by: "By",
      url: "This book online",
      repo: "On GitHub",
      kit: "This book was made with the PULAPULABO AR picture book kit."
    },
    pt: {
      how: ["Deixe o livro impresso pronto (ou uma página na tela de um computador).", 'Toque em "Começar com a câmera" nesta página e permita a câmera.', 'Aponte a câmera para uma página e as figuras saltam. "Ler" lê a história em voz alta e "Brincar" deixa tocar nas figuras.'],
      safe: ["Preste atenção ao redor e não use enquanto anda.", "Funciona melhor em um lugar claro.", 'Faça pausas quando usar por muito tempo. Se as luzes piscando incomodarem a criança, ligue o "Modo calmo".', "A imagem da câmera é usada só dentro do celular e não é enviada para lugar nenhum."],
      titles: { how: "Como usar", safe: "Para usar com segurança", about: "Sobre este livro" },
      by: "Autor",
      url: "Este livro na internet",
      repo: "No GitHub",
      kit: "Este livro foi feito com o kit de livros ilustrados em AR PULAPULABO."
    }
  };
  var norm = (t) => String(t).replace(/[\s　]+/g, " ").trim();
  var PAT = {};
  function patterns(l) {
    if (PAT[l]) return PAT[l];
    PAT[l] = Object.entries(KIT[l] || {}).filter(([k]) => k.includes("{n}")).map(([k, v]) => {
      const re = new RegExp(`^${k.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace("{n}", "(\\d+)")}$`);
      return { re, v };
    });
    return PAT[l];
  }
  function tr(text, l = LANG.now) {
    if (text == null || l === "ja") return text;
    const s = String(text), b = LANG.book[l] || {};
    if (b[s] !== void 0 && b[s] !== "") return b[s];
    const n = norm(s);
    if (b[n]) return b[n];
    const k = KIT[l] || {};
    if (k[s]) return k[s];
    if (k[n]) return k[n];
    for (const { re, v } of patterns(l)) {
      const m = n.match(re);
      if (m) return v.replace("{n}", m[1]);
    }
    return s;
  }
  function trx(text, vals) {
    let out = tr(text);
    for (const [k, v] of Object.entries(vals)) out = out.replace(`{${k}}`, v);
    return out;
  }
  var plain = (t) => String(t ?? "").replace(/\{([^{}|]+)\|([^{}]+)\}/g, "$2");
  function setBookLangs(maps) {
    LANG.book = maps || {};
  }
  function setLang(l) {
    LANG.now = LANGS[l] ? l : "ja";
    try {
      document.documentElement.lang = LANG.now;
    } catch (e) {
    }
  }
  function startLang(langs) {
    if (!langs || langs.length < 2) return "ja";
    try {
      const v = localStorage.getItem("ehon-lang");
      if (langs.includes(v)) return v;
    } catch (e) {
    }
    const nav = (navigator.language || "ja").slice(0, 2).toLowerCase();
    return langs.includes(nav) ? nav : "ja";
  }
  function saveLang(l) {
    try {
      localStorage.setItem("ehon-lang", l);
    } catch (e) {
    }
  }
  function setVoiceLang(l) {
    LANG.voice = LANGS[l] ? l : "ja";
  }
  function startVoiceLang(langs, words) {
    if (!langs || langs.length < 2) return "ja";
    try {
      const v = localStorage.getItem("ehon-voice");
      if (langs.includes(v)) return v;
    } catch (e) {
    }
    return langs.includes(words) ? words : "ja";
  }
  function saveVoiceLang(l) {
    try {
      localStorage.setItem("ehon-voice", l);
    } catch (e) {
    }
  }

  // system/engine/story.js
  var ICONS = {};
  var MEM = { items: [], chosen: {}, names: {}, stamps: {}, counts: {}, joined: [], looks: {}, cleared: {}, seen: {} };
  var listeners = [];
  var onMemory = (fn) => listeners.push(fn);
  var changed = (what, value) => listeners.forEach((fn) => fn(what, value));
  function forget() {
    Object.assign(MEM, { items: [], chosen: {}, names: {}, stamps: {}, counts: {}, joined: [], looks: {}, cleared: {}, seen: {} });
    changed("all");
  }
  var itemOf = (id) => (BOOK.items || []).find((x) => x.id === id) || { id, name: BOOK.byId[id] && BOOK.byId[id].name || id };
  var has = (id) => MEM.items.includes(id);
  function getItem(id) {
    if (!id || has(id)) return false;
    MEM.items.push(id);
    changed("item", id);
    return true;
  }
  function giveItem(id) {
    if (!has(id)) return false;
    MEM.items = MEM.items.filter((x) => x !== id);
    changed("give", id);
    return true;
  }
  function setCount(key, n) {
    MEM.counts[key] = n;
    MEM.names[key] = String(n);
    changed("count", key);
  }
  function join(id) {
    if (MEM.joined.includes(id)) return false;
    MEM.joined.push(id);
    changed("join", id);
    return true;
  }
  function keepLook(id, look) {
    MEM.looks[id] = look;
    changed("look", id);
  }
  function markSeen(n) {
    MEM.seen[n] = true;
  }
  function markCleared(n) {
    MEM.cleared[n] = true;
  }
  function remember(key, id, name) {
    MEM.chosen[key] = id;
    MEM.names[key] = name || id;
    changed("chosen", key);
  }
  function holds(spec, pg = null) {
    if (spec.need && ![].concat(spec.need).every(has)) return false;
    if (spec.if) {
      for (const [k, v] of Object.entries(spec.if)) if (!(k === "found" ? foundOn(pg, v) : test(k, v))) return false;
    }
    return true;
  }
  function foundOn(pg, v) {
    const f = pg && pg.gs && pg.gs.foundIds;
    return !!f && [].concat(v).every((id) => f[id]);
  }
  function compare(have, want) {
    if (typeof want === "number") return have >= want;
    const m = /^\s*(>=|<=|>|<|=)?\s*(\d+)\s*$/.exec(String(want));
    if (!m) return false;
    const v = Number(m[2]);
    switch (m[1]) {
      case "<=":
        return have <= v;
      case "<":
        return have < v;
      case ">":
        return have > v;
      case "=":
        return have === v;
      default:
        return have >= v;
    }
  }
  function test(k, v) {
    switch (k) {
      case "cleared":
        return [].concat(v).every((n) => MEM.cleared[n]);
      case "seen":
        return [].concat(v).every((n) => MEM.seen[n]);
      case "joined":
        return [].concat(v).every((id) => MEM.joined.includes(id));
      case "stamps": {
        const got = Object.keys(MEM.cleared).length;
        return v === "all" ? got >= (BOOK.pageCount || 1) : compare(got, v);
      }
      default:
        if (k in MEM.counts || typeof v === "number" || /^\s*[<>=]/.test(String(v))) return compare(MEM.counts[k] || 0, v);
        return [].concat(v).includes(MEM.chosen[k]);
    }
  }
  function fill(text, l) {
    return String(text ?? "").replace(/\{([A-Za-z0-9_-]+)\}/g, (m, k) => MEM.names[k] !== void 0 ? plain(tr(MEM.names[k], l)) : m);
  }
  var shown = (text, l) => plain(fill(tr(text, l), l));
  function stamp(n) {
    if (MEM.stamps[n]) return false;
    MEM.stamps[n] = true;
    changed("stamp", n);
    return true;
  }

  // system/engine/glow.js
  var THREE3 = __toESM(require_three(), 1);
  var GLOW = null;
  function glowTexture() {
    if (GLOW) return GLOW;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grd.addColorStop(0, "rgba(235,255,150,0.95)");
    grd.addColorStop(0.35, "rgba(200,255,90,0.45)");
    grd.addColorStop(1, "rgba(180,255,80,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    GLOW = new THREE3.CanvasTexture(c);
    GLOW.colorSpace = THREE3.SRGBColorSpace;
    return GLOW;
  }
  function addHalo(pg, ff, size = 0.1) {
    const c = pg.C(ff);
    if (c.halo) return;
    const m = new THREE3.Mesh(new THREE3.PlaneGeometry(size, size), new THREE3.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE3.AdditiveBlending }));
    m.position.set(0, c.h * 0.42, -6e-3);
    c.body.add(m);
    c.halo = m;
  }
  function blinkHalo(c, time, phase = 0, flash = 0) {
    if (!c.halo) return;
    const k = Math.max(0.55 + 0.45 * Math.max(0, Math.sin((time + phase) * 4.2)), 0.6 + flash * 0.9);
    c.halo.material.opacity = k;
    c.halo.scale.setScalar(0.85 + 0.35 * k);
  }

  // system/engine/textbox.js
  var THREE4 = __toESM(require_three(), 1);
  var X0 = 30;
  var Y0 = 866;
  var X1 = 1570;
  var Y1 = 1180;
  var K = 1.25;
  var RUBY = /\{([^{}|]+)\|([^{}]+)\}/g;
  function rrect2(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function pieces(raw) {
    const s = fill(tr(raw));
    if (LANG.now !== "ja") return [{ t: plain(s), r: null }];
    const out = [];
    let pos = 0;
    for (const m of s.matchAll(RUBY)) {
      if (m.index > pos) out.push({ t: s.slice(pos, m.index), r: null });
      out.push({ t: m[1], r: m[2] });
      pos = m.index + m[0].length;
    }
    if (pos < s.length) out.push({ t: s.slice(pos), r: null });
    return out;
  }
  function rows(g, parts, maxW) {
    const words = [];
    for (const p of parts) {
      if (p.r) {
        words.push({ ...p, sp: false });
        continue;
      }
      p.t.split(/(\s+)/).forEach((w2) => {
        if (w2) words.push({ t: w2, r: null, sp: /^\s+$/.test(w2) });
      });
    }
    const out = [];
    let cur = [], w = 0;
    const push = () => {
      while (cur.length && cur[cur.length - 1].sp) cur.pop();
      if (cur.length) out.push(cur);
      cur = [];
      w = 0;
    };
    for (const wd of words) {
      const ww = g.measureText(wd.t).width;
      if (wd.sp && !cur.length) continue;
      if (w + ww > maxW && cur.length && !wd.sp) push();
      if (ww > maxW && !wd.r) {
        for (const ch of wd.t) {
          const cw = g.measureText(ch).width;
          if (w + cw > maxW && cur.length) push();
          cur.push({ t: ch, r: null, sp: false });
          w += cw;
        }
        continue;
      }
      cur.push(wd);
      w += ww;
    }
    push();
    return out;
  }
  function drawTextBox(manifest, font) {
    const P = manifest.panel;
    if (!P) return null;
    const fillC = P.fill || "#fff8e8", border = P.border || "#e9c47a", ink = P.ink || "#3b2e5a", accent = P.accent || "#e8756a";
    const c = document.createElement("canvas");
    c.width = Math.round((X1 - X0) * K);
    c.height = Math.round((Y1 - Y0) * K);
    const g = c.getContext("2d");
    g.scale(K, K);
    g.translate(-X0, -Y0);
    g.lineJoin = "round";
    rrect2(g, 40, 944, 1520, 226, 30);
    g.fillStyle = fillC;
    g.fill();
    g.lineWidth = 6;
    g.strokeStyle = border;
    g.stroke();
    g.save();
    g.setLineDash([12, 10]);
    g.globalAlpha = 0.6;
    rrect2(g, 56, 960, 1488, 194, 22);
    g.lineWidth = 3;
    g.stroke();
    g.restore();
    const mark = P.mark || "number";
    if (mark !== "none") {
      g.beginPath();
      g.arc(1452, 1030, 40, 0, Math.PI * 2);
      g.fillStyle = "#ffe9a8";
      g.fill();
      g.lineWidth = 5;
      g.strokeStyle = border;
      g.stroke();
      g.fillStyle = "#8a5a2a";
      g.textAlign = "center";
      if (mark === "paw") {
        g.fillStyle = "#d9894a";
        const paw = (x, y2, rx, ry) => {
          g.beginPath();
          g.ellipse(x, y2, rx, ry, 0, 0, Math.PI * 2);
          g.fill();
        };
        paw(1452, 1036, 13.6, 11.2);
        [[-13.6, -10], [-4.8, -18], [4.8, -18], [13.6, -10]].forEach(([dx, dy]) => paw(1452 + dx, 1028 + dy, 5.6, 5.6));
        g.fillStyle = "#8a5a2a";
      } else {
        g.font = `900 36px ${font}`;
        g.fillText(String(P.n), 1452, 1043);
      }
      g.font = `900 28px ${font}`;
      g.fillText(`${P.n} / ${P.count}`, 1452, 1108);
    }
    if (P.title) {
      const t = plain(fill(tr(P.title)));
      g.font = `900 40px ${font}`;
      const w = g.measureText(t).width + 64;
      rrect2(g, 60, 878, w, 64, 32);
      g.fillStyle = accent;
      g.fill();
      g.lineWidth = 6;
      g.strokeStyle = "#fff3d9";
      g.stroke();
      g.fillStyle = "#fff8e8";
      g.textAlign = "left";
      g.fillText(t, 92, 923);
    }
    const story = manifest.story || [];
    const maxW = mark === "none" ? 1460 : 1310, maxFs = P.size === "large" ? 50 : 40;
    const ruby = LANG.now === "ja" && story.some((s) => /\{[^{}|]+\|[^{}]+\}/.test(s));
    let fs = maxFs, laid;
    for (; fs >= 16; fs -= 1) {
      g.font = `700 ${fs}px ${font}`;
      laid = story.map((s) => rows(g, pieces(s), maxW));
      const n = laid.reduce((a, r) => a + r.length, 0);
      if (n * fs * (ruby ? 1.62 : 1.25) <= 200) break;
    }
    const lh = Math.round(fs * (ruby ? 1.62 : 1.25));
    const total = laid.reduce((a, r) => a + r.length, 0);
    let y = 1060 - lh * (total - 1) / 2 + fs * (ruby ? 0.55 : 0.35);
    g.textAlign = "left";
    g.fillStyle = ink;
    const boxes = [];
    for (const rs of laid) {
      const top = y;
      let wmax = 0;
      for (const row of rs) {
        let x = 92;
        for (const wd of row) {
          g.font = `700 ${fs}px ${font}`;
          g.fillStyle = ink;
          const ww = g.measureText(wd.t).width;
          g.fillText(wd.t, x, y);
          if (wd.r) {
            g.font = `700 ${Math.round(fs * 0.46)}px ${font}`;
            g.textAlign = "center";
            g.fillText(wd.r, x + ww / 2, y - fs * 0.98);
            g.textAlign = "left";
          }
          x += ww;
        }
        wmax = Math.max(wmax, x - 92);
        y += lh;
      }
      const up = ruby ? fs * 1.5 : fs * 1.02;
      boxes.push({ x: 78, y: Math.round(top - up), w: Math.round(wmax + 28), h: Math.round(y - lh - top + up + fs * 0.32) });
    }
    return { canvas: c, boxes };
  }
  function textBoxMesh() {
    const S3 = 1 / 1600, PH4 = 0.75;
    const m = new THREE4.Mesh(new THREE4.PlaneGeometry((X1 - X0) * S3, (Y1 - Y0) * S3), new THREE4.MeshBasicMaterial({ transparent: true, depthWrite: false }));
    m.position.set((X0 + X1) / 2 * S3 - 0.5, PH4 / 2 - (Y0 + Y1) / 2 * S3, 74e-5);
    m.renderOrder = 1;
    m.visible = false;
    return m;
  }

  // system/engine/tool.js
  var THREE5 = __toESM(require_three(), 1);
  var HAND = 0.075;
  var TOOL = 0.11;
  var HANDS = {
    human: { color: "#ffd9b8", pad: "#e8a080", line: "#7a4a2a" },
    cat: { color: "#fffaf0", pad: "#ffb3c8", line: "#4a3328" },
    dog: { color: "#d9a066", pad: "#6a4030", line: "#4a3328" },
    bear: { color: "#9a6a44", pad: "#4a2e22", line: "#3b2a20" },
    rabbit: { color: "#fffaf0", pad: "#ffb3c8", line: "#4a3328" },
    bird: { color: "#ffd84a", pad: "#f2a23a", line: "#6a4a20" }
  };
  var WORDS = [
    ["human", /おとこのこ|おんなのこ|男の子|女の子|こども|子ども|にんげん|人間|おじいさん|おばあさん|おとうさん|おかあさん|human|boy|girl/i],
    ["cat", /ねこ|ネコ|猫|cat|ちゃトラ|キジトラ|サバトラ|しろトラ|三毛|みけねこ|ミケネコ|にゃん/i],
    ["dog", /いぬ|イヌ|犬|dog|きつね|キツネ|たぬき|タヌキ/i],
    ["bear", /くま|クマ|熊|bear|パンダ|panda/i],
    ["rabbit", /うさぎ|ウサギ|兎|rabbit|りす|リス|ねずみ|ネズミ|ハムスター/i],
    ["bird", /とり|トリ|鳥|ひよこ|ヒヨコ|ペンギン|ふくろう|フクロウ|bird/i]
  ];
  function handOf() {
    let h = BOOK.hand;
    if (typeof h === "string") h = { kind: h };
    if (!h || !HANDS[h.kind]) {
      const c = (BOOK.cast || [])[0] || {};
      const text = [c.id, c.name, c.look, c.about].join(" ");
      const w = WORDS.find(([, re]) => re.test(text));
      h = { ...h || {}, kind: w ? w[0] : "human" };
    }
    return { kind: h.kind, ...HANDS[h.kind], ...h.color ? { color: h.color } : {}, ...h.pad ? { pad: h.pad } : {} };
  }
  function handSVG({ kind, color, pad, line }) {
    const head = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 120 120">';
    const paw = (toes, big, claws = "") => `${head}<path d="M60 16 C84 16 100 36 100 62 C100 90 82 106 60 106 C38 106 20 90 20 62 C20 36 36 16 60 16Z" fill="${color}" stroke="${line}" stroke-width="5"/>${claws}${toes}${big}</svg>`;
    const bean = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${pad}"/>`;
    const bigPad = `<path d="M60 64 C73 64 84 72 84 83 C84 94 73 98 60 94 C47 98 36 94 36 83 C36 72 47 64 60 64Z" fill="${pad}"/>`;
    switch (kind) {
      case "cat":
        return paw(bean(36, 52, 8, 10) + bean(51, 38, 8, 10) + bean(69, 38, 8, 10) + bean(84, 52, 8, 10), bigPad);
      case "dog":
        return paw(bean(35, 50, 10, 12) + bean(51, 34, 10, 12) + bean(69, 34, 10, 12) + bean(85, 50, 10, 12), bigPad);
      case "bear":
        return paw(
          bean(34, 48, 10, 11) + bean(50, 34, 10, 11) + bean(70, 34, 10, 11) + bean(86, 48, 10, 11),
          bigPad,
          `<g fill="${line}"><path d="M30 34 l4 -12 l5 11Z"/><path d="M46 20 l5 -12 l4 12Z"/><path d="M66 20 l4 -12 l5 12Z"/><path d="M82 34 l5 -11 l4 12Z"/></g>`
        );
      case "rabbit":
        return `${head}<ellipse cx="60" cy="62" rx="32" ry="44" fill="${color}" stroke="${line}" stroke-width="5"/>${bean(46, 40, 6, 8)}${bean(60, 32, 6, 8)}${bean(74, 40, 6, 8)}<ellipse cx="60" cy="74" rx="14" ry="18" fill="${pad}"/></svg>`;
      case "bird":
        return `${head}<g stroke="${line}" stroke-width="4" stroke-linejoin="round"><path d="M18 74 C26 40 56 20 98 22 C86 34 84 40 92 44 C78 50 78 56 86 62 C72 66 70 72 76 78 C58 84 36 88 18 74Z" fill="${color}"/><path d="M40 70 C52 58 66 50 84 44 M44 78 C56 70 66 66 78 62" fill="none" stroke="${pad}" stroke-width="5" stroke-linecap="round"/></g></svg>`;
      default:
        return `${head}<g stroke="${line}" stroke-width="5" stroke-linejoin="round" fill="${color}"><path d="M30 70 Q24 44 34 40 Q42 38 44 56 L46 30 Q47 20 55 20 Q63 21 62 31 L62 50 L64 24 Q66 14 74 15 Q82 17 80 28 L78 52 L84 34 Q88 26 95 29 Q101 33 97 42 L88 74 Q82 102 58 104 Q36 104 30 70 Z"/></g><path d="M50 84 Q60 90 72 84" stroke="${pad}" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
    }
  }
  var SVG = {
    net: '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 160 160"><path d="M84,70 L148,150" stroke="#4a3360" stroke-width="15" stroke-linecap="round"/><path d="M84,70 L148,150" stroke="#c98a50" stroke-width="9" stroke-linecap="round"/><path d="M12,48 Q14,118 50,132 Q84,122 88,48Z" fill="#f2fbff" stroke="#4a3360" stroke-width="4"/><g stroke="#9cc4e8" stroke-width="3" fill="none"><path d="M22,62 Q50,76 80,62 M20,82 Q50,98 80,82 M28,104 Q50,116 72,104 M32,50 Q34,100 48,128 M50,50 L50,130 M68,50 Q66,100 54,128"/></g><ellipse cx="50" cy="46" rx="40" ry="16" fill="none" stroke="#4a3360" stroke-width="11"/><ellipse cx="50" cy="46" rx="40" ry="16" fill="none" stroke="#3a7ac0" stroke-width="6"/></svg>',
    poi: '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 120 120"><path d="M62 62 L102 108" stroke="#e8756a" stroke-width="10" stroke-linecap="round"/><circle cx="44" cy="42" r="32" fill="#ffffff" stroke="#e8756a" stroke-width="8"/><circle cx="44" cy="42" r="24" fill="#eaf6ff"/></svg>',
    hammer: '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 120 120"><path d="M60 56 L98 110" stroke="#f2c230" stroke-width="11" stroke-linecap="round"/><rect x="14" y="20" width="76" height="40" rx="18" transform="rotate(-35 52 40)" fill="#ff6a5a" stroke="#b83a30" stroke-width="5"/><path d="M28 30 L36 52" stroke="#ffb0a8" stroke-width="5" stroke-linecap="round" transform="rotate(-35 52 40)"/></svg>'
  };
  var KIND = { net: "net", ami: "net", mushiami: "net", poi: "poi", hammer: "hammer", piko: "hammer" };
  var TEX = {};
  function texOf(key, src) {
    if (TEX[key]) return TEX[key];
    const t = new THREE5.Texture();
    t.colorSpace = THREE5.SRGBColorSpace;
    const im = new Image();
    im.onload = () => {
      t.image = im;
      t.needsUpdate = true;
    };
    im.src = src;
    return TEX[key] = t;
  }
  var svgURI = (s) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
  function toolTex(id) {
    if (id && ICONS[id]) return texOf(`i:${id}`, ICONS[id]);
    if (id && KIND[id]) return texOf(`k:${KIND[id]}`, svgURI(SVG[KIND[id]]));
    if (ICONS.hand) return texOf("i:hand", ICONS.hand);
    const h = handOf();
    return texOf(`h:${h.kind}:${h.color}:${h.pad}`, svgURI(handSVG(h)));
  }
  var useOf = (g) => g.tool && g.tool.use || (g.type === "pop" && (g.style || "rise") === "rise" ? "whack" : "scoop");
  function toolStart(pg, g) {
    const T3 = g.tool;
    if (!T3 || !T3.id) return 0;
    toolTex(null);
    toolTex(T3.id);
    if (has(T3.id)) {
      pg.gs.tool = T3.id;
      if (!pg.gs.toldTool) {
        pg.gs.toldTool = true;
        pg.toast(trx("{y}を つかって あそぼう！", { y: shown(itemOf(T3.id).name) }), 2600);
      }
      return 0;
    }
    if (T3.from && has(T3.from)) {
      const by = T3.who && pg.C(T3.who) ? T3.who : null;
      const words = T3.say || trx("{x}を ありがとう！ {y}を どうぞ", { x: shown(itemOf(T3.from).name), y: shown(itemOf(T3.id).name) });
      giveItem(T3.from);
      if (by) {
        handOver(pg, T3.from, by);
        pg.later(700, () => {
          pg.hop(by, 0.05);
          pg.say(by, words);
        });
      } else pg.toast(words, 2600);
      pg.later(2300, () => {
        getItem(T3.id);
        pg.gs.tool = T3.id;
      });
      pg.gs.toldTool = true;
      return 2.9;
    }
    pg.gs.tool = null;
    if (!pg.gs.toldHand) {
      pg.gs.toldHand = true;
      pg.toast(T3.hand ? shown(T3.hand) : tr(useOf(g) === "whack" ? "てで ポンと たたこう！" : "てで そっと つかまえよう！"), 2600);
    }
    return 0;
  }
  var reach = (pg) => pg.gs.tool ? TOOL : HAND;
  var hasTool = (g) => !!(g.tool && g.tool.id);
  function toolSwing(pg, g, at) {
    if (!hasTool(g) || !at) return;
    const tool = pg.gs.tool, use = useOf(g);
    const mat = new THREE5.SpriteMaterial({ map: toolTex(tool), transparent: true, depthTest: false, depthWrite: false });
    const s = new THREE5.Sprite(mat);
    s.renderOrder = 20;
    const size = tool ? 0.1 : 0.08;
    s.scale.set(1e-3, 1e-3, 1);
    const p0 = at.clone().add(pg.up.clone().multiplyScalar(0.03));
    s.position.copy(p0);
    pg.root.add(s);
    pg._extras.push(s);
    const dur = use === "whack" ? 0.55 : 0.7;
    pg.tween(dur, (t) => {
      if (use === "whack") {
        const k2 = t < 0.45 ? 0.6 * (1 - easeInOut(t / 0.45)) : -0.25 * Math.sin(Math.PI * (t - 0.45) / 0.55);
        mat.rotation = k2;
        s.position.copy(p0).add(pg.up.clone().multiplyScalar(0.02 * Math.max(0, k2)));
      } else {
        mat.rotation = -0.5 + 0.9 * easeInOut(t);
        s.position.copy(p0).add(pg.up.clone().multiplyScalar(0.035 * Math.sin(Math.PI * t)));
      }
      const k = size * Math.min(1, 0.6 + t * 4);
      s.scale.set(k, k, 1);
      mat.opacity = t < 0.1 ? t / 0.1 : t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
    }, () => {
      pg.root.remove(s);
      mat.dispose();
    });
  }
  function handOver(pg, itemId, toId) {
    const c = pg.C(toId);
    if (!c || !ICONS[itemId]) return;
    const mat = new THREE5.SpriteMaterial({ map: texOf(`i:${itemId}`, ICONS[itemId]), transparent: true, depthTest: false, depthWrite: false });
    const s = new THREE5.Sprite(mat);
    s.renderOrder = 20;
    s.scale.set(0.07, 0.07, 1);
    pg.root.add(s);
    pg._extras.push(s);
    pg.tween(0.9, (t) => {
      const p = pg.top(toId, 1).add(pg.up.clone().multiplyScalar(0.08 * (1 - easeInOut(t))));
      s.position.copy(p);
      mat.opacity = t < 0.15 ? t / 0.15 : t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2;
    }, () => {
      pg.root.remove(s);
      mat.dispose();
      pg.burst(toId, 12, 0.9, ["#fff2a8", "#ffffff"]);
      pg.sfx("pon");
    });
  }

  // system/engine/page.js
  var S = 1 / 1600;
  var PH2 = 0.75;
  var px2x = (px2) => px2 * S - 0.5;
  var py2y = (py) => PH2 / 2 - py * S;
  function cardMaterial(map) {
    const m = new THREE6.MeshBasicMaterial({ map, side: THREE6.DoubleSide, alphaTest: 0.5, transparent: false });
    m.alphaToCoverage = true;
    m.onBeforeCompile = (sh) => {
      sh.fragmentShader = sh.fragmentShader.replace(
        "#include <map_fragment>",
        "#include <map_fragment>\nif (!gl_FrontFacing) { diffuseColor.rgb = vec3(0.95, 0.90, 0.80); }"
      );
    };
    return m;
  }
  function shadowMaterial(map) {
    return new THREE6.ShaderMaterial({
      uniforms: { map: { value: map }, opacity: { value: 0 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform sampler2D map; uniform float opacity; varying vec2 vUv; void main(){ float a = texture2D(map, vUv).a; gl_FragColor = vec4(0.03,0.03,0.12, a * opacity); }",
      transparent: true,
      depthWrite: false
    });
  }
  var MEAS = null;
  var TALK_MAX = 15;
  var PageView = class {
    constructor({ n, manifest, tex, alpha, plateImg, maskImg, font, sound, ui, logic }) {
      this.n = n;
      this.tex = tex;
      this.alpha = alpha;
      this.sound = sound;
      this.ui = ui;
      this.logic = logic;
      this.story = manifest.story;
      this.lines = manifest.lines || [];
      this.manifest = manifest;
      this.font = font;
      this.root = new THREE6.Group();
      this.cards = {};
      this.tweens = [];
      this.timers = [];
      this.open = false;
      this.playing = false;
      this.viewTheta = 0.9;
      this.time = 0;
      this.mode = "cover";
      this.busyUntil = {};
      this.state = {};
      this._extras = [];
      this.up = new THREE6.Vector3(0, Math.cos(0.9), Math.sin(0.9));
      const plateTex = new THREE6.Texture(plateImg);
      plateTex.colorSpace = THREE6.SRGBColorSpace;
      plateTex.needsUpdate = true;
      this.plate = new THREE6.Mesh(new THREE6.PlaneGeometry(1, PH2), new THREE6.MeshBasicMaterial({ map: plateTex }));
      this.plate.name = "plate";
      this.root.add(this.plate);
      this.margin = new THREE6.Mesh(new THREE6.PlaneGeometry(1.07, PH2 + 0.07), new THREE6.MeshBasicMaterial({ color: 16315626 }));
      this.margin.position.z = -6e-4;
      this.root.add(this.margin);
      this.plateImg = plateImg;
      this.maskImg = maskImg;
      const patchTex = new THREE6.CanvasTexture(this._patchCanvas(plateImg));
      patchTex.colorSpace = THREE6.SRGBColorSpace;
      this.patch = new THREE6.Mesh(new THREE6.PlaneGeometry(1, PH2), new THREE6.MeshBasicMaterial({ map: patchTex, transparent: true, depthWrite: false }));
      this.patch.position.z = 3e-4;
      this.patch.visible = false;
      this.root.add(this.patch);
      this.guide = this._guide();
      this.root.add(this.guide);
      const P = manifest.pieces;
      const ids = Object.keys(P);
      ids.forEach((cid, idx) => {
        const m = P[cid];
        const w = m.w * S, h = m.h * S;
        const geo = new THREE6.PlaneGeometry(w, h);
        let pvx = m.x + m.w / 2, pvy = m.y + m.h;
        if (m.pivot === "top") {
          geo.translate(0, -h / 2, 0);
          pvy = m.y;
        } else if (m.pivot === "left") {
          geo.translate(w / 2, h / 2, 0);
          pvx = m.x;
        } else if (m.pivot === "right") {
          geo.translate(-w / 2, h / 2, 0);
          pvx = m.x + m.w;
        } else geo.translate(0, h / 2, 0);
        const mesh = new THREE6.Mesh(geo, cardMaterial(tex[m.tex[0]]));
        mesh.name = cid;
        mesh.userData.tex = m.tex[0];
        const body = new THREE6.Group();
        body.add(mesh);
        const still = new THREE6.Group();
        still.add(body);
        const pivot = new THREE6.Group();
        pivot.add(still);
        const card = { id: cid, m, w, h, mesh, body, still, pivot, pvx, pvy, theta: 0, vel: 0, delay: 0, fold: 1, hidden: m.hidden, flat: m.flat, order: idx, phase: idx * 1.7, flipX: 1 };
        if (m.hidden) body.visible = false;
        this.cards[cid] = card;
      });
      const standing = ids.map((i) => this.cards[i]).filter((c) => !c.m.parent && !c.m.flat && (c.m.pivot || "bottom") === "bottom");
      standing.forEach((b, i) => {
        for (const a of standing.slice(0, i)) {
          if (Math.abs(a.pvy + (a.nudge || 0) * 4 - b.pvy) > 6) continue;
          if (a.m.x + a.m.w <= b.m.x || b.m.x + b.m.w <= a.m.x) continue;
          b.nudge = Math.max(b.nudge || 0, (a.nudge || 0) + 1);
        }
      });
      for (const cid of ids) {
        const cd = this.cards[cid], m = cd.m;
        if (m.parent) {
          const p = this.cards[m.parent];
          const sib = ids.filter((i) => this.cards[i].m.parent === m.parent && !!this.cards[i].m.behind === !!m.behind && !this.cards[i].m.depth);
          const k = sib.indexOf(cid), step = 6e-4;
          cd.pivot.position.set((cd.pvx - p.pvx) * S, (p.pvy - cd.pvy) * S, m.depth ? -m.depth * S : m.behind ? -15e-4 - (sib.length - 1 - k) * step : 15e-4 + k * step);
          p.body.add(cd.pivot);
        } else {
          cd.pivot.position.set(px2x(cd.pvx), py2y(cd.pvy + (cd.nudge || 0) * 4), 15e-4 + cd.order * 5e-4);
          this.root.add(cd.pivot);
          if (!m.flat) {
            const sh = new THREE6.Mesh(cd.mesh.geometry, shadowMaterial(cd.mesh.material.map));
            sh.position.copy(cd.pivot.position);
            sh.position.z = 8e-4;
            sh.renderOrder = 1;
            cd.shadow = sh;
            this.root.add(sh);
          }
        }
      }
      for (const cid of ids) this.cards[cid].pivotHome = this.cards[cid].pivot.position.clone();
      this.topCards = ids.map((i) => this.cards[i]).filter((c) => !c.m.parent);
      this.idleCards = ids.map((i) => this.cards[i]).filter((c) => IDLE[c.m.idle]);
      this.blinkCards = ids.map((i) => this.cards[i]).filter((c) => tex[`${c.id}@blink`]);
      this.blinkCards.forEach((c) => {
        c.blinkT = 1 + Math.random() * 3;
      });
      this.glowCards = ids.map((i) => this.cards[i]).filter((c) => c.m.glow);
      this.glowCards.forEach((c) => {
        addHalo(this, c.id, Math.max(0.08, Math.min(0.2, c.w * 1.4)));
        c.glowing = true;
        c.glowFlash = -9;
      });
      this.pickables = [this.plate, ...ids.map((i) => this.cards[i].mesh)];
      if (logic.sky) {
        const geo = new THREE6.PlaneGeometry(1.6, 0.9);
        geo.translate(0, 0.45, 0);
        const sky2 = new THREE6.Mesh(geo, new THREE6.MeshBasicMaterial({ visible: false, side: THREE6.DoubleSide }));
        sky2.name = "sky";
        const sp = new THREE6.Group();
        sp.position.set(0, PH2 / 2, 1e-3);
        sp.add(sky2);
        this.root.add(sp);
        this.skyPivot = sp;
        this.pickables.push(sky2);
      }
      this.fx = new Particles(logic.maxParticles || 1500);
      this.root.add(this.fx.points);
      this.labels = new Labels(this.root, font);
      this.twinkleT = 0;
      if (logic.dark) darken(this, logic.dark, 0);
      logic.init && logic.init(this);
    }
    _guide() {
      const gr = new THREE6.Group();
      const pts = [[-0.5, -PH2 / 2], [0.5, -PH2 / 2], [0.5, PH2 / 2], [-0.5, PH2 / 2]].map(([x, y]) => new THREE6.Vector3(x, y, 5e-4));
      const loop = new THREE6.LineLoop(new THREE6.BufferGeometry().setFromPoints(pts), new THREE6.LineDashedMaterial({ color: 16774105, dashSize: 0.018, gapSize: 0.012, transparent: true, opacity: 0.55 }));
      loop.computeLineDistances();
      gr.add(loop);
      const cm = new THREE6.MeshBasicMaterial({ color: 16774105, transparent: true, opacity: 0.9, depthWrite: false });
      const L = 0.06, T3 = 7e-3;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const a = new THREE6.Mesh(new THREE6.PlaneGeometry(L, T3), cm);
        a.position.set(sx * (0.5 - L / 2), sy * (PH2 / 2), 6e-4);
        const b = new THREE6.Mesh(new THREE6.PlaneGeometry(T3, L), cm);
        b.position.set(sx * 0.5, sy * (PH2 / 2 - L / 2), 6e-4);
        gr.add(a, b);
      }
      gr.visible = false;
      return gr;
    }
    // ---------- modes / open state ----------
    setMode(mode) {
      this.mode = mode;
      const cover = mode === "cover";
      this.plate.material.colorWrite = cover;
      this.margin.material.colorWrite = cover;
      this.patch.visible = !cover;
      this.guide.visible = mode === "arOnly";
    }
    setOpen(open, instant = false) {
      this.open = open;
      this.topCards.forEach((c, i) => {
        c.delay = open ? 0.12 + (this.topCards.length - i) * 0.035 : 0;
        if (instant && !open) {
          c.theta = 0;
          c.vel = 0;
          c.pivot.rotation.x = 0;
        }
      });
      if (!open) {
        this.labels.clear();
      }
      if (this.logic.ambience) {
        if (open) this.sound.ambience(this.logic.ambience, this);
        else this.sound.stopAmbience(this);
      }
      if (open && this.logic.opening) this.logic.opening(this);
      if (open && this.logic.open) this.later(900, () => this.logic.open(this));
    }
    setViewDir(camLocal) {
      const thetaCam = Math.atan2(-camLocal.y, camLocal.z);
      let t = thetaCam + 0.35 * (Math.PI / 2 - thetaCam);
      t = Math.min(1.45, Math.max(0.45, t));
      this.viewTheta += (t - this.viewTheta) * 0.06;
    }
    measure(camera, viewportW, viewportH) {
      this.camera = camera;
      const a = new THREE6.Vector3(-0.5, 0, 0), b = new THREE6.Vector3(0.5, 0, 0);
      this.root.localToWorld(a);
      this.root.localToWorld(b);
      a.project(camera);
      b.project(camera);
      const px2 = Math.abs(b.x - a.x) / 2 * viewportW;
      if (px2 > 10) this.labels.scale = Math.min(1.9, Math.max(0.9, 560 / px2));
      this.fx.setPixelScale(viewportH * Math.min(2, window.devicePixelRatio || 1));
    }
    _patchCanvas(img2) {
      const c = document.createElement("canvas");
      c.width = 1600;
      c.height = 1200;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(img2, 0, 0, 1600, 1200);
      const id = g.getImageData(0, 0, 1600, 1200);
      if (!this._maskData) {
        const m2 = document.createElement("canvas");
        m2.width = 800;
        m2.height = 600;
        const mg = m2.getContext("2d", { willReadFrequently: true });
        mg.drawImage(this.maskImg, 0, 0, 800, 600);
        this._maskData = mg.getImageData(0, 0, 800, 600).data;
      }
      const md = this._maskData;
      for (let y = 0; y < 1200; y++) for (let x = 0; x < 1600; x++) id.data[(y * 1600 + x) * 4 + 3] = md[((y >> 1) * 800 + (x >> 1)) * 4];
      g.putImageData(id, 0, 0);
      return c;
    }
    // ぬりえ: the paper with the coloured background (null: the printed one again)
    setPlate(img2) {
      const t = this.plate.material.map, want = img2 || this.plateImg;
      if (t.image === want) return;
      t.image = want;
      t.needsUpdate = true;
      const p = this.patch.material.map;
      p.image = this._patchCanvas(want);
      p.needsUpdate = true;
    }
    // put piece `id` somewhere else for a while: on piece `parentId` ("behind" it or in front), or standing on its own
    // (parentId null), with its bottom at page pixels `at` = [x, y]. reset() puts it back where it is drawn.
    // (かくれんぼ: hiding at another place each time; a found one that comes out and stands in front)
    placePiece(id, parentId, at, { behind = false } = {}) {
      const c = this.cards[id];
      if (!c) return null;
      if (!c.home) c.home = { m: c.m, pvx: c.pvx, pvy: c.pvy };
      const wasParent = c.m.parent ? this.cards[c.m.parent] : null;
      const [x, y] = at || [c.pvx, c.pvy];
      if (c.pivot.parent) c.pivot.parent.remove(c.pivot);
      this.topCards = this.topCards.filter((t) => t !== c);
      c.m = { ...c.home.m, parent: parentId || null, behind: !!(parentId && behind) };
      c.pvx = x;
      c.pvy = y;
      if (parentId) {
        const p = this.cards[parentId];
        c.pivot.position.set((x - p.pvx) * S, (p.pvy - y) * S, behind ? -15e-4 : 4e-3);
        c.pivot.rotation.x = 0;
        p.body.add(c.pivot);
        if (c.shadow) c.shadow.visible = false;
      } else {
        c.pivot.position.set(px2x(x), py2y(y), 15e-4 + c.order * 5e-4);
        if (wasParent) {
          c.theta = wasParent.theta;
          c.vel = 0;
        }
        c.fold = 1;
        c.delay = 0;
        c.pivot.rotation.x = c.theta;
        this.root.add(c.pivot);
        this.topCards.push(c);
        if (!c.shadow && !c.m.flat) {
          const sh = new THREE6.Mesh(c.mesh.geometry, shadowMaterial(c.mesh.material.map));
          sh.position.copy(c.pivot.position);
          sh.position.z = 8e-4;
          sh.renderOrder = 1;
          c.shadow = sh;
          this.root.add(sh);
        }
        if (c.shadow) c.shadow.visible = true;
      }
      return c;
    }
    // a piece moved by placePiece goes back to where it is drawn
    _placeBack(c) {
      if (!c.home) return;
      if (c.pivot.parent) c.pivot.parent.remove(c.pivot);
      this.topCards = this.topCards.filter((t) => t !== c);
      c.m = c.home.m;
      c.pvx = c.home.pvx;
      c.pvy = c.home.pvy;
      c.home = null;
      c.stillNow = false;
      if (c.m.parent) {
        this.cards[c.m.parent].body.add(c.pivot);
        c.pivot.rotation.x = 0;
        if (c.shadow) c.shadow.visible = false;
      } else {
        this.root.add(c.pivot);
        this.topCards.push(c);
        if (c.shadow) c.shadow.visible = true;
      }
    }
    reset() {
      this.timers.forEach(clearTimeout);
      this.timers = [];
      this.tweens = [];
      this.resets = (this.resets || 0) + 1;
      this.labels.clear();
      this.fx.clear();
      for (const c of Object.values(this.cards)) this._placeBack(c);
      for (const c of Object.values(this.cards)) {
        c.body.position.set(0, 0, 0);
        c.body.rotation.set(0, 0, 0);
        c.body.scale.set(1, 1, 1);
        c.body.userData.base = null;
        c.body.visible = !c.m.hidden;
        c.fold = 1;
        c.pivot.position.copy(c.pivotHome);
        c.still.position.set(0, 0, 0);
        c.still.rotation.set(0, 0, 0);
        c.still.scale.set(1, 1, 1);
        c.flipX = 1;
        c.talkUntil = 0;
        c.lit = false;
        if (c.lamp) c.lamp.material.opacity = 0;
        this.swap(c.id, c.m.tex[0]);
      }
      this._extras.forEach((o) => this.root.remove(o));
      this._extras = [];
      this._lasting = null;
      this._rainbow = null;
      this._talk = {};
      this._voice = {};
      if (this._hl) this._hl.material.opacity = 0;
      if (this._dark || this.logic.dark) darken(this, this.logic.dark || 0, 0);
      this.state = {};
      this.busyUntil = {};
      this.playing = false;
      this.done = false;
      this.ui && this.ui.setDone(this.n, false);
      this.logic.init && this.logic.init(this);
    }
    complete() {
      const was = this.done;
      this.done = true;
      this.ui && this.ui.setDone(this.n, true);
      if (!was && this.onComplete) this.onComplete(this.n);
    }
    // story time (false) / play time (true)
    setPlaying(on) {
      const was = this.playing;
      this.playing = on;
      if (on && !was) this.logic.play && this.logic.play(this);
    }
    // the "let's play!" cue when story time ends
    playSignal() {
      const p = new THREE6.Vector3(0, 0.05, 0.02).add(this.up.clone().multiplyScalar(0.12));
      this.labels.ono(shown("あそぼう！"), p, "#5fc46a", 1.3);
      for (let i = 0; i < 5; i++) this.later(i * 120, () => this.fx.burst(new THREE6.Vector3(-0.35 + i * 0.175, 0, 0.03), 12, 1, ["#fff2a8", "#ffffff", "#b8f0a0"]));
      this.sfx("kirarin");
    }
    // ---------- helpers for page scripts ----------
    C(id) {
      return this.cards[id];
    }
    // "can't be touched for a while": pg.busy('clock', 3) … if (pg.isBusy('clock')) return;
    // (any name works; touch reactions in page.json use the names "touch:<id>" or "touch:<lock>")
    busy(key, seconds) {
      this.busyUntil[key] = Math.max(this.busyUntil[key] || 0, this.time + seconds);
    }
    isBusy(key) {
      return (this.busyUntil[key] || 0) > this.time;
    }
    // (what happens later belongs to the touch that started it: its words and bubbles stay in that touch's layer)
    later(ms, fn) {
      const layer = this.labels ? this.labels.layer : 0;
      const t = setTimeout(() => this.labels ? this.labels.inLayer(layer, fn) : fn(), ms);
      this.timers.push(t);
      return t;
    }
    tween(dur, fn, done) {
      this.tweens.push({ t: 0, dur, fn, done });
    }
    swap(id, texName) {
      const c = this.cards[id];
      if (!c || !this.tex[texName]) return;
      c.mesh.userData.tex = texName;
      c.blinking = 0;
      this._face(c, texName);
      const look = texName.includes("@") ? texName.slice(texName.indexOf("@") + 1) : "";
      for (const k of Object.values(this.cards)) {
        if (k.m.parent !== id) continue;
        if (look && this.tex[`${k.id}@${look}`]) {
          k._follow = true;
          this.swap(k.id, `${k.id}@${look}`);
        } else if (k._follow) {
          k._follow = false;
          this.swap(k.id, k.m.tex[0]);
        }
      }
    }
    // the picture on screen only (blinking / talking); texOf() still tells the real one
    _face(c, texName) {
      if (c.mesh.material.map === this.tex[texName]) return;
      c.mesh.material.map = this.tex[texName];
      if (c.shadow) c.shadow.material.uniforms.map.value = this.tex[texName];
    }
    texOf(id) {
      return this.cards[id].mesh.userData.tex;
    }
    show(id) {
      this.cards[id].body.visible = true;
      this.cards[id].hidden = false;
    }
    hide(id) {
      this.cards[id].body.visible = false;
      this.cards[id].hidden = true;
    }
    // the touch print: the main character's hand (book.json "hand": "human" / "cat" / …, or { "kind": …, "print": "#…" })
    handPrint() {
      if (!this._hand) {
        const h = handOf(), b = BOOK.hand;
        this._hand = { kind: h.kind, print: b && typeof b === "object" && (b.print || b.pad) || null };
      }
      return this._hand;
    }
    base(c) {
      const b = c.body;
      if (!b.userData.base) b.userData.base = { x: 0, y: 0, z: 0 };
      return b.userData.base;
    }
    // (the usual speeds are a little slow, for small children: a hop 0.7 s, a turn 1.2 s)
    hop(id, height = 0.05, dur = 0.7, times = 1) {
      const c = this.cards[id], b = c.body, bs = this.base(c);
      this.tween(dur * times, (t) => {
        const u = t * times % 1;
        b.position.y = bs.y + Math.sin(Math.PI * u) * height;
        const lerp = (a, z, k) => a + (z - a) * (k < 0 ? 0 : k > 1 ? 1 : k);
        const sq = u < 0.12 ? lerp(1, 0.9, u / 0.12) : u < 0.3 ? lerp(0.9, 1.05, (u - 0.12) / 0.18) : u < 0.8 ? 1.05 : u < 0.92 ? lerp(1.05, 0.92, (u - 0.8) / 0.12) : lerp(0.92, 1, (u - 0.92) / 0.08);
        b.scale.set(2 - sq, sq, 1);
      }, () => {
        b.position.y = bs.y;
        b.scale.set(1, 1, 1);
      });
    }
    wobble(id, amp = 0.1, dur = 1.1, freq = 4) {
      const b = this.cards[id].body;
      this.tween(dur, (t) => {
        b.rotation.z = Math.sin(t * Math.PI * freq) * amp * (1 - t);
      }, () => {
        b.rotation.z = 0;
      });
    }
    shake(id, amp = 8e-3, dur = 0.5) {
      const c = this.cards[id], b = c.body, bs = this.base(c);
      this.tween(dur, (t) => {
        b.position.x = bs.x + Math.sin(t * 70) * amp * (1 - t);
      }, () => {
        b.position.x = bs.x;
      });
    }
    spin(id, axis = "y", turns = 1, dur = 1.2, onHalf) {
      const b = this.cards[id].body;
      let done = false;
      this.tween(dur, (t) => {
        b.rotation[axis] = easeInOut(t) * Math.PI * 2 * turns;
        if (!done && t > 0.25 / turns) {
          done = true;
          onHalf && onHalf();
        }
      }, () => {
        b.rotation[axis] = 0;
      });
    }
    rise(id, from = -0.1, dur = 0.85) {
      const c = this.cards[id], b = c.body, bs = this.base(c);
      this.show(id);
      this.tween(dur, (t) => {
        b.position.y = bs.y + from * (1 - easeInOut(t));
      }, () => {
        b.position.y = bs.y;
      });
    }
    moveTo(id, x, y, z, dur = 0.6, ease = easeOutBack) {
      const c = this.cards[id], b = c.body, bs = this.base(c);
      const f = { x: bs.x, y: bs.y, z: bs.z }, to = { x: x ?? bs.x, y: y ?? bs.y, z: z ?? bs.z };
      this.tween(dur, (t) => {
        const k = ease(t);
        bs.x = f.x + (to.x - f.x) * k;
        bs.y = f.y + (to.y - f.y) * k;
        bs.z = f.z + (to.z - f.z) * k;
        b.position.set(bs.x, bs.y, bs.z);
      });
    }
    swing(id, amp = 0.35, dur = 2, freq = 3) {
      this.wobble(id, amp, dur, freq);
    }
    topple(id, dur = 1.4) {
      const c = this.cards[id];
      this.tween(dur, (t) => {
        c.fold = t < 0.3 ? 1 - easeInOut(t / 0.3) : easeOutBack((t - 0.3) / 0.7);
      }, () => {
        c.fold = 1;
      });
    }
    pulse(id, k = 1.15, dur = 0.7) {
      const b = this.cards[id].body;
      this.tween(dur, (t) => {
        const s = 1 + (k - 1) * Math.sin(Math.PI * t);
        b.scale.set(s, s, 1);
      }, () => b.scale.set(1, 1, 1));
    }
    // the picture shown now, inside the piece's box (page px x0, y0, x1, y1): the pictures of one piece can differ
    // in size (a pot and the flower that grows from it), and words, marks and gauges go by the one shown now
    seenBox(c) {
      return c.m.boxes && c.m.boxes[c.mesh.userData.tex] || [0, 0, c.m.w, c.m.h];
    }
    seenSize(c) {
      const [x0, y0, x1, y1] = this.seenBox(c);
      return { w: (x1 - x0) * S, h: (y1 - y0) * S };
    }
    // a point of the picture shown now, from where the piece turns: the middle, at f of its height (0 = foot, 1 = top)
    _seen(c, f) {
      const [x0, y0, x1, y1] = this.seenBox(c);
      const x = (x0 + x1) / 2 * S - (c.m.pivot === "left" ? 0 : c.m.pivot === "right" ? c.w : c.w / 2);
      const y = c.m.pivot === "top" ? -y1 * S + (y1 - y0) * S * f : (c.m.h - y1) * S + (y1 - y0) * S * f;
      return [x, y];
    }
    top(id, f = 1, dz = 0.01) {
      const c = this.cards[id], [x, y] = this._seen(c, f);
      const v = new THREE6.Vector3(x, y, dz);
      c.body.localToWorld(v);
      return this.root.worldToLocal(v);
    }
    // where words and marks stand over piece `id`: its place, not its turning picture — a spin, a flip or a lean
    // does not swing them around (a hop or a walk still takes them along, smoothly: fx.js follow)
    anchor(id, f = 1, dz = 0.01) {
      const c = this.cards[id], [x, y] = this._seen(c, f);
      const v = new THREE6.Vector3(x, y, dz).add(c.still.position).add(c.body.position);
      c.pivot.localToWorld(v);
      return this.root.worldToLocal(v);
    }
    // speech bubble above piece `id`, spoken in the voice of `who` (a character id; defaults to id)
    say(id, text, key = id, who = id) {
      if (!this.cards[id]) return;
      const color = castColor(who), show = shown(text);
      this.labels.bubble(key, show, color, () => this.anchor(id, 1, 4e-3));
      if (this.tex[`${id}@talk`]) this.cards[id].talkUntil = this.time + Math.min(3.5, 0.8 + show.length * 0.08);
      (this._voice = this._voice || {})[key] = this.sound.say(text.replace(/\n/g, " "), voice(who));
    }
    // `who` is still saying its line: its bubble is up, or its voice is still speaking
    saying(who) {
      const j = this._voice && this._voice[who];
      return this.labels.speaking(who) || !!(j && !j.done);
    }
    // a touch that makes a line (presets.js react): that piece waits until the line has been said —
    // at least until `at` seconds (when a later step says it), and never longer than TALK_MAX seconds
    talkLock(key, who, at) {
      (this._talk = this._talk || {})[key] = { who, from: this.time, until: this.time + at + 0.35 };
    }
    talking(key) {
      const k = this._talk && this._talk[key];
      if (!k) return false;
      if (this.time - k.from < TALK_MAX && (this.time < k.until || k.who.some((w) => this.saying(w)))) return true;
      delete this._talk[key];
      return false;
    }
    // the scene (see scene.js): an ending for the mood, lights, darkness, walking, jumping out of a box
    mood(name) {
      if (MOODS[name]) MOODS[name](this);
    }
    light(id, on = true) {
      light(this, id, on);
    }
    darken(amount, dur = 1.5) {
      darken(this, amount, dur);
    }
    walk(id, points, opts) {
      return walk(this, id, points, opts);
    }
    reveal(boxId, itemId) {
      return reveal(this, boxId, itemId);
    }
    // もちもの: put a thing in the bag (core.js shows it); true when it is new
    getItem(id) {
      return getItem(id);
    }
    // AR の文章: the story box drawn again in the language being used, over the printed one (on / off)
    setText(on) {
      if (!this.manifest.panel) return;
      if (!this._tb) {
        this._tb = textBoxMesh();
        this.root.add(this._tb);
      }
      if (on && this._tbLang !== LANG.now) {
        const d = drawTextBox(this.manifest, this.font);
        const t = new THREE6.CanvasTexture(d.canvas);
        t.colorSpace = THREE6.SRGBColorSpace;
        t.anisotropy = 4;
        if (this._tb.material.map) this._tb.material.map.dispose();
        this._tb.material.map = t;
        this._tb.material.needsUpdate = true;
        this._tbBoxes = d.boxes;
        this._tbLang = LANG.now;
      }
      this._tb.visible = !!on;
    }
    // the reading highlight on line i of the story (-1: none) — on the AR box when it is shown, else on the paper
    highlight(i) {
      const L = (this._tb && this._tb.visible ? this._tbBoxes : this.lines)[i];
      if (!this._hl) {
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 64;
        const g = c.getContext("2d");
        g.fillStyle = "rgba(255,214,70,0.55)";
        g.beginPath();
        g.roundRect ? g.roundRect(2, 2, 252, 60, 28) : g.rect(2, 2, 252, 60);
        g.fill();
        const t = new THREE6.CanvasTexture(c);
        t.colorSpace = THREE6.SRGBColorSpace;
        this._hl = new THREE6.Mesh(new THREE6.PlaneGeometry(1, 1), new THREE6.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0 }));
        this._hl.position.z = 78e-5;
        this._hl.renderOrder = 2;
        this.root.add(this._hl);
      }
      const m = this._hl.material, from = m.opacity, to = L ? 1 : 0;
      if (L) {
        this._hl.scale.set(L.w * S, L.h * S, 1);
        this._hl.position.x = px2x(L.x + L.w / 2);
        this._hl.position.y = py2y(L.y + L.h / 2);
      }
      this.tween(0.25, (t) => {
        m.opacity = from + (to - from) * t;
      });
    }
    // a feeling mark beside the head: '!' '?' 'note' 'heart' 'sweat' 'zzz' 'idea' 'angry'
    // a feeling mark right above the head — not while that one speaks (the words say it)
    mark(id, kind) {
      if (!this.cards[id]) return;
      this.labels.mark(kind, () => this.anchor(id, 1.02, 8e-3), id);
    }
    // a word that pops up (ポン！): at piece `at` (by its head) or at a point. While the words of the touches just
    // before are still there (touched again and again), it comes at another place close around that spot
    ono(text, at, color) {
      const p = typeof at === "string" ? this.top(at, 0.75, 0.03) : at.clone().add(new THREE6.Vector3(0, 0, 0.02));
      const t = shown(text), R = this._wordRoom(t);
      if (R.area(p, R.words) > 0.2) return this._onoNear(t, p, color, R);
      this.labels.ono(t, p, color);
    }
    // the size of word `t`, the words still floating, the gauges, and the tests for a place
    _wordRoom(t) {
      const L = this.labels, up = this.up, sy = (v) => v.dot(up);
      const k = 52e-5 * (L.scale || 1);
      const meas = MEAS = MEAS || document.createElement("canvas").getContext("2d");
      meas.font = `bold 96px ${L.font}`;
      const lw = (meas.measureText(t).width + 52) * k, lh = 96 * 1.45 * k, rise = 0.07;
      const gauges = [], words = [];
      for (const g of Object.values(L.gauges)) {
        const gd = g.userData, base = (gd.kind === "bar" ? 62e-5 : 36e-5) * (L.scale || 1), gc = gd.anchorFn();
        gauges.push([gc.x - gd.W * base / 2, gc.x + gd.W * base / 2, sy(gc), sy(gc) + gd.H * base]);
      }
      for (const w of L.items) {
        const d = w.userData;
        if (d.kind !== "ono" || d.age > d.life * 0.9) continue;
        words.push([d.p0.x - d.w / 2, d.p0.x + d.w / 2, sy(d.p0), sy(d.p0) + rise + d.h]);
      }
      const area = (q, list) => {
        const x0 = q.x - lw / 2, x1 = q.x + lw / 2, y0 = sy(q), y1 = sy(q) + rise + lh;
        let a = 0;
        for (const [bx0, bx1, by0, by1] of list) a += Math.max(0, Math.min(x1, bx1) - Math.max(x0, bx0)) * Math.max(0, Math.min(y1, by1) - Math.max(y0, by0));
        return a / (lw * (rise + lh));
      };
      const cam = this.camera, tmp = new THREE6.Vector3();
      const seen = (v) => {
        tmp.copy(v);
        this.root.localToWorld(tmp);
        tmp.project(cam);
        return tmp.x > -0.95 && tmp.x < 0.95 && tmp.y > -0.72 && tmp.y < 0.7;
      };
      const topLine = sy(new THREE6.Vector3(0, PH2 / 2, 0)) + 0.13;
      const onScreen = (q) => {
        if (!cam) return Math.abs(q.x) <= 0.5 - lw / 2 && sy(q) + rise + lh <= topLine;
        const hi = up.clone().multiplyScalar(rise + lh);
        return [q.clone().setX(q.x - lw / 2), q.clone().setX(q.x + lw / 2), q.clone().setX(q.x - lw / 2).add(hi), q.clone().setX(q.x + lw / 2).add(hi)].every(seen);
      };
      const recent = this._onoRecent = this._onoRecent || [];
      const near = (q, f = 0.8) => recent.some((r) => Math.hypot(r.x - q.x, sy(r) - sy(q)) < lw * f);
      return { lw, lh, rise, sy, words, gauges, area, onScreen, recent, near };
    }
    // a word close around point p: beside it, a little above or below it, or to the side (within NEAR words of it) —
    // as little as it can over the floating words or the gauges, not where the last words were
    _onoNear(t, p, color, R = this._wordRoom(t)) {
      const { lw, lh, rise, sy } = R, row = lh + rise, jit = () => (Math.random() - 0.5) * 7e-3, NEAR2 = 0.7;
      let best = null, bs = -Infinity;
      for (const dx of [-1.05, -0.55, 0, 0.55, 1.05]) for (const dy of [-0.6, 0, 0.55, 1.05]) {
        if (!dx && !dy) continue;
        const q = p.clone();
        q.x += dx * NEAR2 * lw + jit();
        q.add(this.up.clone().multiplyScalar(dy * NEAR2 * row));
        if (!R.onScreen(q)) continue;
        const v = -5 * R.area(q, R.gauges) - 2.5 * R.area(q, R.words) - (R.near(q, 0.8 * NEAR2) ? 1.5 : 0) - Math.hypot(q.x - p.x, sy(q) - sy(p)) * 8 + Math.random() * 0.6;
        if (v > bs) {
          bs = v;
          best = q;
        }
      }
      if (!best) best = p;
      R.recent.push(best);
      if (R.recent.length > 3) R.recent.shift();
      this.labels.ono(t, best, color);
    }
    // a word around piece `id` (なんども タッチ): each time at another place close
    // around it — beside it, above it, on its edge — not over the gauges, not where the last words were, and if it can
    // be, not over other pieces (being close to the piece counts more than that)
    onoAround(text, id, color) {
      const c = this.cards[id], t = shown(text);
      if (!c || !c.body.visible) {
        this.labels.ono(t, this.top(id, 0.75, 0.03), color);
        return;
      }
      const R = this._wordRoom(t), { lw, lh, rise, sy } = R;
      const mine = /* @__PURE__ */ new Set([id]);
      for (let q = c.m.parent; q; q = this.cards[q] && this.cards[q].m.parent) mine.add(q);
      const pieces2 = [];
      for (const o of Object.values(this.cards)) {
        if (mine.has(o.id) || !o.body.visible || o.m.flat || !o.pivot.visible) continue;
        const b02 = this.top(o.id, 0), b12 = this.top(o.id, 1), ow = this.seenSize(o).w;
        pieces2.push([b02.x - ow / 2, b02.x + ow / 2, Math.min(sy(b02), sy(b12)), Math.max(sy(b02), sy(b12))]);
      }
      const { w: cw, h: ch } = this.seenSize(c);
      const cand = [], step = (lh + rise) / Math.max(ch, 0.05), jit = () => (Math.random() - 0.5) * 0.012;
      for (const f of [0.1, 0.35, 0.6, 0.85]) for (const side of [-1, 1]) for (const out of [-lw * 0.3, 4e-3, lw * 0.35]) {
        const q = this.top(id, f, 0.03);
        q.x += side * (cw / 2 + lw / 2 + out) + jit();
        cand.push(q);
      }
      for (const dx of [-0.4, -0.2, 0, 0.2, 0.4]) for (const f of [0.95, 1 + step * 0.6]) {
        const q = this.top(id, f, 0.03);
        q.x += dx * cw + jit();
        cand.push(q);
      }
      if (cw > lw * 1.6) for (const dx of [-0.25, 0.25]) for (const f of [0.45, 0.7]) {
        const q = this.top(id, f, 0.03);
        q.x += dx * cw + jit();
        cand.push(q);
      }
      const b0 = this.top(id, 0), b1 = this.top(id, 1), cx = b0.x, lo = Math.min(sy(b0), sy(b1)), hi = Math.max(sy(b0), sy(b1));
      const gap = (q) => {
        const mx = q.x, my = sy(q) + (rise + lh) / 2;
        return Math.hypot(Math.max(0, Math.abs(mx - cx) - cw / 2 - lw / 2), Math.max(0, my - hi, lo - my));
      };
      let best = null, bs = -Infinity;
      for (const q of cand) {
        if (!R.onScreen(q)) continue;
        const v = -5 * R.area(q, R.gauges) - 2.5 * R.area(q, R.words) - 1.2 * R.area(q, pieces2) - (R.near(q) ? 1.5 : 0) - gap(q) * 12 + Math.random() * 0.6;
        if (v > bs) {
          bs = v;
          best = q;
        }
      }
      if (!best) best = this.top(id, 0.75, 0.03);
      R.recent.push(best);
      if (R.recent.length > 3) R.recent.shift();
      this.labels.ono(t, best, color);
    }
    sfx(name, ...args) {
      this.sound.sfx(name, ...args);
    }
    burst(at, n = 14, power = 1, colors) {
      const p = typeof at === "string" ? this.top(at, 0.6) : at;
      this.fx.burst(p, n, power, colors);
    }
    // rings sit beside the head (speech bubbles use the spot above it); bars sit above
    gauge(key, kind, id, text, color, f = 1.12) {
      const c = this.cards[id];
      const fn = kind === "ring" ? () => this.top(id, 0.78, 8e-3).add(new THREE6.Vector3(this.seenSize(c).w * 0.5, 0, 0)) : () => this.top(id, f, 6e-3);
      return this.labels.gauge(key, kind, fn, shown(text), color);
    }
    setGauge(key, frac, blink) {
      this.labels.setGauge(key, frac, blink);
    }
    removeGauge(key) {
      this.labels.removeGauge(key);
    }
    progress(done, total) {
      this.ui && this.ui.setProgress(this.n, done, total);
    }
    toast(t, ms) {
      this.ui && this.ui.toast(t, ms);
    }
    // steam / dust / bubbles rising from a point
    puff(at, n = 10, color = "#ffffff", spread = 0.03, rise = 0.12, size = 0.03) {
      const p = typeof at === "string" ? this.top(at, 0.9) : at;
      for (let k = 0; k < n; k++) {
        const v = { x: (Math.random() - 0.5) * spread * 4, y: this.up.y * rise * (0.6 + Math.random() * 0.6), z: this.up.z * rise * (0.6 + Math.random() * 0.6) };
        this.fx.emit({ x: p.x + (Math.random() - 0.5) * spread, y: p.y, z: p.z + 0.01 }, v, color, size * (0.7 + Math.random() * 0.6), 0.9 + Math.random() * 0.5, 0.97, 0.02, 0);
      }
    }
    // falling leaves / petals
    leaves(at, n = 10, colors = ["#7cc27a", "#ffb36b", "#f2d04a"]) {
      const p = typeof at === "string" ? this.top(at, 0.8) : at;
      for (let k = 0; k < n; k++) {
        this.fx.emit({ x: p.x + (Math.random() - 0.5) * 0.15, y: p.y, z: p.z + 0.02 }, { x: (Math.random() - 0.5) * 0.12, y: 0, z: 0.05 }, colors[k % colors.length], 0.028, 1.4 + Math.random() * 0.6, 0.96, -0.18, 1);
      }
    }
    ripple(at, color = "#bfe8ff") {
      for (let r = 0; r < 2; r++) for (let k = 0; k < 18; k++) {
        const a = k / 18 * Math.PI * 2, s = 0.12 + r * 0.06;
        this.fx.emit({ x: at.x, y: at.y, z: 4e-3 }, { x: Math.cos(a) * s, y: Math.sin(a) * s * 0.4, z: 0 }, color, 0.018, 0.8, 0.93, 0, 0);
      }
    }
    trail(points, color = "#fff07a", n = 40) {
      for (let k = 0; k < n; k++) {
        const u = k / (n - 1), i = Math.min(points.length - 2, Math.floor(u * (points.length - 1))), f = u * (points.length - 1) - i;
        const a = points[i], b = points[i + 1];
        this.later(k * 35, () => this.fx.emit({ x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, z: 0.01 }, { x: 0, y: 0, z: 0.05 }, color, 0.03, 1.6, 0.95, 0, 1));
      }
    }
    // ---------- fireworks ----------
    // opts: { quiet: true } no sound, { scale: 0.55 } a small one
    firework(target, color = "#ffd84a", color2 = "#ffffff", kind = "peony", from = null, onBurst = null, opts = {}) {
      const up = this.up.clone();
      const start = from || new THREE6.Vector3(target.x + (Math.random() - 0.5) * 0.05, -0.05, 0.01);
      const dur = 0.75;
      if (!opts.quiet) this.sfx("fwLaunch");
      const head = new THREE6.Vector3();
      this.tween(dur, (t) => {
        const k = easeInOut(t);
        head.lerpVectors(start, target, k);
        this.fx.emit(head, { x: (Math.random() - 0.5) * 0.02, y: 0, z: 0 }, "#ffe9b0", 0.016, 0.35, 0.9, -0.1, 0);
      }, () => {
        this._explode(target, color, color2, kind, up, opts);
        onBurst && onBurst();
      });
    }
    _explode(p, color, color2, kind, up, opts = {}) {
      if (!opts.quiet) this.sfx("fwBoom");
      const sc = opts.scale || 1;
      const right = new THREE6.Vector3(1, 0, 0);
      const back = new THREE6.Vector3().crossVectors(right, up).normalize();
      if (kind === "ring") {
        const N = Math.round(48 * sc);
        for (let i = 0; i < N; i++) {
          const a = i / N * Math.PI * 2;
          const v = right.clone().multiplyScalar(Math.cos(a) * 0.5 * sc).add(up.clone().multiplyScalar(Math.sin(a) * 0.5 * sc));
          this.fx.emit(p, v, i % 2 ? color : color2, 0.026 * Math.max(0.7, sc), 1.4, 0.92, -0.08, 1);
        }
        for (let i = 0; i < Math.round(16 * sc); i++) {
          const a = Math.random() * Math.PI * 2;
          this.fx.emit(p, right.clone().multiplyScalar(Math.cos(a) * 0.15 * sc).add(up.clone().multiplyScalar(Math.sin(a) * 0.15 * sc)), "#ffffff", 0.02, 1, 0.92, -0.08, 1);
        }
      } else if (kind === "willow") {
        const N = 64;
        for (let i = 0; i < N; i++) {
          const a = Math.random() * Math.PI * 2, s = 0.25 + Math.random() * 0.2;
          const v = right.clone().multiplyScalar(Math.cos(a) * s).add(up.clone().multiplyScalar(Math.abs(Math.sin(a)) * s * 0.8 + 0.05));
          this.fx.emit(p, v, i % 3 ? color : "#fff6c8", 0.024, 2.4 + Math.random() * 0.6, 0.95, -0.22, 1);
        }
      } else if (kind === "heart") {
        const N = 90;
        for (let i = 0; i < N; i++) {
          const t = i / N * Math.PI * 2;
          const hx = 16 * Math.pow(Math.sin(t), 3) / 17, hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17;
          const v = right.clone().multiplyScalar(hx * 0.62).add(up.clone().multiplyScalar(hy * 0.62));
          const cols = castIds().map(fireworkColor);
          if (!cols.length) cols.push("#ff6aa0");
          this.fx.emit(p, v, cols[Math.floor(i / N * cols.length)], 0.03, 1.8, 0.92, -0.04, 1);
        }
      } else {
        const N = Math.round(70 * sc);
        for (let i = 0; i < N; i++) {
          const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1);
          const d = new THREE6.Vector3(Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a));
          const v = right.clone().multiplyScalar(d.x).add(up.clone().multiplyScalar(d.y)).add(back.clone().multiplyScalar(d.z * 0.4)).multiplyScalar(0.55 * sc);
          this.fx.emit(p, v, i % 4 === 0 ? color2 : color, 0.028 * Math.max(0.7, sc), 1.3 + Math.random() * 0.5, 0.92, -0.12, 1);
        }
        for (let i = 0; i < 20; i++) {
          const a = i / 20 * Math.PI * 2;
          const v = right.clone().multiplyScalar(Math.cos(a) * 0.28 * sc).add(up.clone().multiplyScalar(Math.sin(a) * 0.28 * sc));
          this.fx.emit(p, v, color2, 0.022, 1, 0.92, -0.1, 1);
        }
      }
      if (CALM.on || opts.quiet) return;
      this.later(450, () => {
        this.sfx("fwCrackle");
        for (let i = 0; i < 26; i++) {
          const q = p.clone().add(new THREE6.Vector3((Math.random() - 0.5) * 0.22, 0, 0)).add(up.clone().multiplyScalar((Math.random() - 0.5) * 0.18));
          this.later(Math.random() * 500, () => this.fx.emit(q, { x: 0, y: 0, z: 0 }, "#ffffff", 0.018, 0.25, 0.9, 0, 1));
        }
      });
    }
    // ---------- picking ----------
    // the nearest piece under the finger ("behind": the ones behind it, nearest first)
    pick(raycaster) {
      const all = this._hits(raycaster, true), hit = all[0] || null;
      if (hit) hit.behind = all.slice(1);
      return hit;
    }
    // what is under the finger, nearest first: visible, and not where the picture is see-through
    // (all = false: only the nearest one)
    // is the picture of piece `id` shown now solid at page pixel (px, py)?
    solidAt(id, px2, py) {
      const c = this.cards[id], a = c && this.alpha[c.mesh.userData.tex];
      if (!a) return false;
      const ox = c.home ? c.pvx - c.home.pvx : 0, oy = c.home ? c.pvy - c.home.pvy : 0;
      const u = (px2 - c.m.x - ox) / c.m.w, v = (py - c.m.y - oy) / c.m.h;
      if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;
      return a.data[Math.floor(v * a.h) * a.w + Math.floor(u * a.w)] > 60;
    }
    // the place of page pixel (px, py) on the picture of standing piece `id`, in the page's space (it leans with the piece)
    pointOn(id, px2, py, dz = 0.01) {
      const c = this.cards[id], v = new THREE6.Vector3((px2 - c.pvx) * S, (c.pvy - py) * S, dz);
      c.body.localToWorld(v);
      return this.root.worldToLocal(v);
    }
    // piece `id` can be touched a little around its picture too (px: page pixels around the picture shown now;
    // without it, 30 px or a third of its smaller side): an invisible board just behind it, which moves and grows with it
    reach(id, px2) {
      const c = this.cards[id];
      if (!c || c.reachBoard) return;
      const [x0, y0, x1, y1] = this.seenBox(c), [cx, cy] = this._seen(c, 0.5);
      if (px2 === void 0) px2 = Math.max(30, Math.min(x1 - x0, y1 - y0) / 3);
      const geo = new THREE6.PlaneGeometry((x1 - x0 + px2 * 2) * S, (y1 - y0 + px2 * 2) * S);
      const board = new THREE6.Mesh(geo, new THREE6.MeshBasicMaterial({ visible: false, side: THREE6.DoubleSide }));
      board.name = id;
      board.userData.reach = true;
      board.position.set(cx, cy, -4e-4);
      c.body.add(board);
      c.reachBoard = board;
      this.pickables.push(board);
    }
    _hits(raycaster, all) {
      const out = [];
      for (const h of raycaster.intersectObjects(this.pickables, false)) {
        let o = h.object, vis = true;
        if (o.name !== "sky") {
          while (o) {
            if (!o.visible) {
              vis = false;
              break;
            }
            o = o.parent;
          }
        }
        if (!vis) continue;
        if (h.object === this.plate || h.object.name === "sky") {
          const point = this.root.worldToLocal(h.point.clone());
          out.push({ id: h.object.name, point, at: [(point.x + 0.5) / S, (PH2 / 2 - point.y) / S] });
          if (!all) break;
          continue;
        }
        const a = this.alpha[h.object.userData.tex];
        if (a && h.uv) {
          const x = Math.min(a.w - 1, Math.floor(h.uv.x * a.w)), y = Math.min(a.h - 1, Math.floor((1 - h.uv.y) * a.h));
          if (a.data[y * a.w + x] < 60) continue;
        }
        const m = !h.object.userData.reach && this.cards[h.object.name] && this.cards[h.object.name].m;
        const at = m && h.uv ? [m.x + h.uv.x * m.w, m.y + (1 - h.uv.y) * m.h] : null;
        out.push({ id: h.object.name, point: this.root.worldToLocal(h.point.clone()), at });
        if (!all) break;
      }
      return out;
    }
    tap(hit, playable = true) {
      if (!hit) return;
      const L = this.logic;
      this.labels.stamp(hit.point, this.handPrint());
      if (!playable) return;
      this.labels.touched();
      if (L.tap && L.tap(hit.id, this, hit)) return;
      const a = L.ambient && L.ambient[hit.id];
      if (a) {
        a(this, hit);
        return;
      }
      this.sfx("twinkle");
    }
    // a finger on the page: what it touches (as pick) and where it is on the paper ("ground"), also off the pieces
    // "under": the ids of every piece under the finger, nearest first (also the ones behind the nearest one: carry)
    touchAt(raycaster) {
      const all = this._hits(raycaster, true), hit = all[0] || null;
      const under = all.map((h) => h.id).filter((id) => this.cards[id]);
      this.root.updateMatrixWorld();
      const n = new THREE6.Vector3(0, 0, 1).transformDirection(this.root.matrixWorld), o = new THREE6.Vector3().setFromMatrixPosition(this.root.matrixWorld);
      const p = raycaster.ray.intersectPlane(new THREE6.Plane().setFromNormalAndCoplanarPoint(n, o), new THREE6.Vector3());
      const ground = p ? this.root.worldToLocal(p) : null;
      if (hit) {
        hit.ground = ground;
        hit.under = under;
        return hit;
      }
      return ground ? { id: null, point: ground, ground, under } : null;
    }
    // a finger pressed on a piece and moving over it (games like "rub", "carry", "hold", "trace"), then lifted
    grab(hit) {
      if (hit && this.playing) this.labels.touched();
      return !!(hit && this.playing && this.logic.grab && this.logic.grab(hit.id, this, hit));
    }
    rubAt(hit, px2) {
      if (hit && this.playing && this.logic.rub) this.logic.rub(hit.id, this, hit, px2);
    }
    release(hit) {
      if (this.playing && this.logic.release) this.logic.release(hit ? hit.id : null, this, hit);
    }
    narration() {
      return this.logic.narration ? this.logic.narration(this) : [];
    }
    // idle moves, blinking and talking (only on the piece's own main picture)
    _life(dt) {
      const k = CALM.on ? 0.5 : 1;
      for (const c of this.idleCards) {
        if (c.stillNow) continue;
        if (c.idleK !== void 0 && c.idleK < 1) c.idleK = Math.min(1, c.idleK + dt / 1.5);
        IDLE[c.m.idle](c, this.time + c.phase, k * (c.idleK ?? 1));
      }
      for (const c of this.glowCards) {
        c.halo.visible = true;
        blinkHalo(c, this.time, c.phase, Math.max(0, 1 - (this.time - c.glowFlash) / 0.8));
      }
      for (const c of this.blinkCards) {
        if (c.blinking > 0) {
          c.blinking -= dt;
          if (c.blinking <= 0) this._face(c, c.mesh.userData.tex);
          continue;
        }
        c.blinkT -= dt;
        if (c.blinkT <= 0) {
          c.blinkT = 2.2 + Math.random() * 3.2;
          if (c.mesh.userData.tex === c.m.tex[0] && !(c.talkUntil > this.time)) {
            c.blinking = 0.14;
            this._face(c, `${c.id}@blink`);
          }
        }
      }
      for (const c of Object.values(this.cards)) {
        if (!c.talkUntil) continue;
        const main = c.mesh.userData.tex;
        if (c.talkUntil > this.time && main === c.m.tex[0]) this._face(c, Math.floor(this.time / 0.15) % 2 ? `${c.id}@talk` : main);
        else {
          c.talkUntil = 0;
          if (!(c.blinking > 0)) this._face(c, main);
        }
      }
    }
    // its lines and words are drawn now, a few in each frame (core.js: when the page is opened, and when the
    // language changes), and each is shown once too small to be seen, so none has to be drawn or made ready when
    // a finger touches
    warmTexts() {
      const texts = this.logic.texts || [];
      this._warm = texts.map((x) => x.kind === "b" ? () => this.labels.bubbleText(shown(x.text), castColor(x.who)).tex : () => this.labels.onoText(shown(x.text), x.color).tex);
      this._warm.push(() => this.labels.onoText(shown("あそぼう！"), "#5fc46a").tex);
      this._warm.unshift(...this.labels.warmMarks(this.handPrint(), MARK_NAMES).map((t) => () => t));
    }
    // ---------- per frame ----------
    update(dt) {
      dt = Math.min(dt, 0.05);
      this.time += dt;
      this.labels.warmHide();
      const w0 = performance.now();
      for (let i = 0; i < 2 && this._warm && this._warm.length && (i === 0 || performance.now() - w0 < 3); i++) this.labels.warmShow(i, this._warm.shift()());
      this.up.set(0, Math.cos(this.viewTheta), Math.sin(this.viewTheta));
      this.fx.up.copy(this.up);
      for (const c of this.topCards) {
        if (c.delay > 0) {
          c.delay -= dt;
          continue;
        }
        const target = c.flat ? 0 : (this.open ? this.viewTheta : 0) * c.fold;
        c.vel += (75 * (target - c.theta) - 9.5 * c.vel) * dt;
        c.theta += c.vel * dt;
        c.pivot.rotation.x = c.theta;
        if (c.shadow) {
          const st = Math.max(0, Math.sin(c.theta));
          c.shadow.scale.y = 0.45 * st + 1e-3;
          c.shadow.material.uniforms.opacity.value = 0.34 * st * (c.body.visible ? 1 : 0);
          c.shadow.position.x = c.pivot.position.x + c.body.position.x;
          c.shadow.position.y = c.pivot.position.y;
        }
      }
      if (this.skyPivot) this.skyPivot.rotation.x = this.viewTheta;
      const running = this.tweens, resets = this.resets;
      this.tweens = [];
      const going = running.filter((tw) => {
        tw.started = true;
        tw.t += dt;
        const u = Math.min(1, tw.t / tw.dur);
        tw.fn(u);
        if (u >= 1) {
          tw.done && tw.done();
          return false;
        }
        return true;
      });
      if (this.resets === resets) this.tweens = going.concat(this.tweens);
      this.twinkleT -= dt;
      if (this.open && this.twinkleT <= 0 && this.logic.twinkle !== false) {
        this.twinkleT = 0.35 + Math.random() * 0.5;
        const tw = this.logic.twinkleArea || [-0.48, 0.48, 0.05, 0.36];
        this.fx.emit({ x: tw[0] + Math.random() * (tw[1] - tw[0]), y: tw[2] + Math.random() * (tw[3] - tw[2]), z: 4e-3 }, { x: 0, y: 0, z: 0 }, Math.random() < 0.5 ? "#fff2b0" : "#bfe3ff", 0.02, 1.4, 1, 0, 1);
      }
      this._life(dt);
      if (this.logic.weather) weatherTick(this, this.logic.weather, dt);
      lastingTick(this, dt);
      this.logic.update && this.logic.update(this, dt);
      for (const tw of this.tweens) if (!tw.started) {
        tw.started = true;
        tw.fn(0);
      }
      this.fx.update(dt);
      this.labels.update(dt, this.up);
    }
  };

  // system/engine/coverprompt.js
  var THREE7 = __toESM(require_three(), 1);
  var COVER_LINES = ["ページを めくって、", "この ページを うつしてね"];
  var CW = 1280;
  var CH = 600;
  var W = 0.56;
  var H = W * CH / CW;
  var X = -0.02;
  var Y = 0.03;
  var Z = 0.025;
  var ARROW = 0.13;
  var AX0 = 0.41;
  var AX1 = 0.33;
  var AY = 0.03;
  var IN = 0.7;
  var BOB = 2.6;
  var LOOP = 2.4;
  function rrect3(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  var plane = (w, h) => new THREE7.Mesh(new THREE7.PlaneGeometry(w, h), new THREE7.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0 }));
  function drawArrow() {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    g.lineCap = "round";
    g.lineJoin = "round";
    const path = () => {
      g.beginPath();
      g.moveTo(212, 176);
      g.quadraticCurveTo(150, 30, 66, 128);
    };
    const head = () => {
      g.beginPath();
      g.moveTo(40, 92);
      g.lineTo(56, 160);
      g.lineTo(104, 126);
      g.closePath();
    };
    g.strokeStyle = "#fff8e8";
    g.lineWidth = 46;
    path();
    g.stroke();
    g.lineWidth = 18;
    head();
    g.stroke();
    g.fillStyle = "#fff8e8";
    g.fill();
    g.strokeStyle = "#e8756a";
    g.lineWidth = 26;
    path();
    g.stroke();
    g.fillStyle = "#e8756a";
    head();
    g.fill();
    const t = new THREE7.CanvasTexture(c);
    t.colorSpace = THREE7.SRGBColorSpace;
    return t;
  }
  var CoverPrompt = class {
    constructor({ thumb, font }) {
      this.font = font;
      this.group = new THREE7.Group();
      this.card = plane(W, H);
      this.card.position.set(X, Y, Z);
      this.card.renderOrder = 3;
      this.arrow = plane(ARROW, ARROW);
      this.arrow.position.set(AX0, AY, Z);
      this.arrow.renderOrder = 3;
      this.arrow.material.map = drawArrow();
      this.group.add(this.card, this.arrow);
      this.canvas = document.createElement("canvas");
      this.canvas.width = CW;
      this.canvas.height = CH;
      this.tex = new THREE7.CanvasTexture(this.canvas);
      this.tex.colorSpace = THREE7.SRGBColorSpace;
      this.card.material.map = this.tex;
      this.img = new Image();
      this.img.onload = () => this.draw();
      if (thumb) this.img.src = thumb;
      this.t = 0;
      this.drawn = null;
    }
    // the words to say (the same as on the card)
    text(lang) {
      return COVER_LINES.map((l) => tr(l, lang)).join(" ");
    }
    // the card comes up again (each time the cover is found after it was lost)
    show() {
      if (this.drawn !== LANG.now) this.draw();
      this.t = 0;
      this.update(0);
    }
    draw() {
      const g = this.canvas.getContext("2d");
      g.clearRect(0, 0, CW, CH);
      rrect3(g, 14, 14, CW - 28, CH - 28, 56);
      g.fillStyle = "#fff8e8";
      g.fill();
      g.lineWidth = 14;
      g.strokeStyle = "#e9c47a";
      g.stroke();
      g.save();
      g.setLineDash([22, 16]);
      g.globalAlpha = 0.6;
      rrect3(g, 44, 44, CW - 88, CH - 88, 36);
      g.lineWidth = 5;
      g.stroke();
      g.restore();
      const tw = 440, th = 330, tx = 64, ty = (CH - th) / 2;
      g.save();
      g.translate(tx + tw / 2, ty + th / 2);
      g.rotate(-0.05);
      g.fillStyle = "rgba(60,40,80,0.18)";
      g.fillRect(-tw / 2 + 10, -th / 2 + 14, tw, th);
      g.fillStyle = "#ffffff";
      g.fillRect(-tw / 2 - 12, -th / 2 - 12, tw + 24, th + 24);
      if (this.img.complete && this.img.naturalWidth) g.drawImage(this.img, -tw / 2, -th / 2, tw, th);
      g.beginPath();
      g.arc(-tw / 2 + 4, -th / 2 + 4, 42, 0, Math.PI * 2);
      g.fillStyle = "#e8756a";
      g.fill();
      g.lineWidth = 8;
      g.strokeStyle = "#fff3d9";
      g.stroke();
      g.fillStyle = "#fff8e8";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `900 50px ${this.font}`;
      g.fillText("1", -tw / 2 + 4, -th / 2 + 7);
      g.restore();
      const lines = COVER_LINES.map((l) => tr(l)), x0 = tx + tw + 50, maxW = CW - x0 - 60;
      let fs = 72;
      for (; fs > 30; fs -= 2) {
        g.font = `900 ${fs}px ${this.font}`;
        if (lines.every((l) => g.measureText(l).width <= maxW)) break;
      }
      g.textAlign = "left";
      g.textBaseline = "middle";
      g.fillStyle = "#3b2e5a";
      const lh = fs * 1.45;
      lines.forEach((l, i) => g.fillText(l, x0, CH / 2 + (i - (lines.length - 1) / 2) * lh));
      this.tex.needsUpdate = true;
      this.drawn = LANG.now;
    }
    // the card comes up softly, then floats; the arrow sweeps from the right edge to the left, over and over
    update(dt) {
      this.t += dt;
      const k = easeInOut(Math.min(1, this.t / IN));
      const s = 0.86 + 0.14 * k;
      this.card.scale.set(s, s, 1);
      this.card.material.opacity = k;
      this.card.position.z = Z + 4e-3 * Math.sin(Math.PI * 2 * this.t / BOB);
      const u = this.t % LOOP / LOOP;
      this.arrow.position.x = AX0 + (AX1 - AX0) * easeInOut(u);
      this.arrow.material.opacity = k * Math.sin(Math.PI * u);
    }
  };

  // system/engine/read.js
  var READ = {};
  var norm2 = (t) => t.replace(/[\s\u3000]+/g, "");
  function setReadMap(map) {
    for (const [k, v] of Object.entries(map || {})) READ[norm2(k)] = v;
  }
  function tidy(t) {
    return t.replace(/[\s\u3000]+/g, "").replace(/〜/g, "ー").replace(/…/g, "、").replace(/[♪★☆「」]/g, "");
  }
  function spoken(text) {
    const l = LANG.voice;
    if (l !== "ja") return shown(text, l).replace(/[♪★☆「」『』〜]/g, "");
    const r = READ[norm2(text)];
    return r ? plain(fill(r, "ja")) : tidy(plain(fill(text, "ja")));
  }

  // system/engine/sound.js
  var kidVoice = () => (BOOK.settings.voice || "kid") === "kid";
  var KID_PITCH = 1.3;
  var Sound = class {
    constructor() {
      this.sfxOn = true;
      this.narrationOn = false;
      this.ctx = null;
      this.voice = null;
      this._pickVoice();
      if (typeof speechSynthesis !== "undefined") speechSynthesis.onvoiceschanged = () => this._pickVoice();
    }
    // called on every touch (core.js, before the page handles the touch): makes the sound and the voice ready,
    // and wakes the sound again. (The phone's usual sound output: no "audioSession" type is set — set to "playback",
    // an iPhone shows the page as music playing, also on a paired Apple Watch.)
    unlock() {
      this._primeVoice();
      try {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          this.ctx = new AC();
          this.master = this.ctx.createGain();
          this.master.gain.value = 0.5;
          this.master.connect(this.ctx.destination);
          const b = this.ctx.createBuffer(1, 1, 22050), s = this.ctx.createBufferSource();
          s.buffer = b;
          s.connect(this.ctx.destination);
          s.start(0);
          this._noiseBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
          const d = this._noiseBuf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          this.ctx.onstatechange = () => this._awake();
          const again = () => {
            if (document.visibilityState !== "hidden") this._wake();
          };
          document.addEventListener("visibilitychange", again);
          window.addEventListener("pageshow", again);
          window.addEventListener("focus", again);
        }
        this._wake();
        if (this.ctx.state === "running") this._flush();
      } catch (e) {
      }
      this.syncAmbience();
    }
    // start the sound again whenever it is not playing (outside a touch some phones refuse; the next touch tries again)
    _wake() {
      const c = this.ctx;
      if (!c || c.state === "running" || c.state === "closed") return;
      try {
        const p = c.resume();
        if (p && p.then) p.then(() => this._awake(), () => {
        });
      } catch (e) {
      }
    }
    _awake() {
      if (this.ctx && this.ctx.state === "running") this._flush();
      this.syncAmbience();
    }
    // effects asked for while the sound was getting ready (the very first touch, or waking up): played as soon as it runs
    _flush() {
      const q = this._queue || [];
      this._queue = [];
      const now = performance.now();
      q.forEach((j) => {
        if (now - j.t < 1200 && this.ok) {
          try {
            j.R.call(this, j.arg);
          } catch (e) {
          }
        }
      });
    }
    get ok() {
      return this.sfxOn && this.ctx && this.ctx.state === "running";
    }
    // ---- building blocks ----
    tone({ type = "sine", f0, f1, f2, t = 0, dur = 0.3, vol = 0.3, attack = 0.01, filter = null, vib = 0, trem = 0, dest = this.master }) {
      const c = this.ctx, now = c.currentTime + t;
      const o = c.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(f0, now);
      if (f2) {
        o.frequency.exponentialRampToValueAtTime(f1, now + dur * 0.35);
        o.frequency.exponentialRampToValueAtTime(f2, now + dur * 0.95);
      } else if (f1) o.frequency.exponentialRampToValueAtTime(f1, now + dur * 0.9);
      const g = c.createGain();
      g.gain.setValueAtTime(1e-4, now);
      g.gain.exponentialRampToValueAtTime(vol, now + attack);
      g.gain.exponentialRampToValueAtTime(1e-4, now + dur);
      let node = o;
      if (filter) {
        const fl = c.createBiquadFilter();
        fl.type = filter.type || "lowpass";
        fl.frequency.value = filter.f;
        fl.Q.value = filter.q || 1;
        node.connect(fl);
        node = fl;
      }
      if (vib) {
        const l = c.createOscillator(), lg = c.createGain();
        l.frequency.value = 7;
        lg.gain.value = vib;
        l.connect(lg);
        lg.connect(o.frequency);
        l.start(now);
        l.stop(now + dur + 0.05);
      }
      let out = g;
      if (trem) {
        const tg = c.createGain(), l = c.createOscillator(), lg = c.createGain();
        l.frequency.value = trem;
        lg.gain.value = 0.5;
        tg.gain.value = 0.5;
        l.connect(lg);
        lg.connect(tg.gain);
        l.start(now);
        l.stop(now + dur + 0.05);
        g.connect(tg);
        out = tg;
      }
      node.connect(g);
      out.connect(dest);
      o.start(now);
      o.stop(now + dur + 0.05);
    }
    noise({ t = 0, dur = 0.3, vol = 0.3, f0 = 1800, f1, type = "lowpass", q = 1, attack = 0.02, dest = this.master }) {
      const c = this.ctx, now = c.currentTime + t;
      const s = c.createBufferSource();
      s.buffer = this._noiseBuf;
      const fl = c.createBiquadFilter();
      fl.type = type;
      fl.Q.value = q;
      fl.frequency.setValueAtTime(f0, now);
      if (f1) fl.frequency.exponentialRampToValueAtTime(f1, now + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(1e-4, now);
      g.gain.exponentialRampToValueAtTime(vol, now + attack);
      g.gain.exponentialRampToValueAtTime(1e-4, now + dur);
      s.connect(fl);
      fl.connect(g);
      g.connect(dest);
      s.start(now, Math.random());
      s.stop(now + dur + 0.05);
    }
    clicks(n, gap, f, { type = "square", vol = 0.12, dur = 0.04, jitter = 0, t = 0 } = {}) {
      for (let i = 0; i < n; i++) this.tone({ type, f0: f * (1 + (Math.random() - 0.5) * jitter), t: t + i * gap, dur, vol });
    }
    // ---- 環境音: one quiet sound that goes on while a page is open (page.json "ambience") ----
    ambience(kind, owner) {
      this._amb = { kind, owner };
      this.syncAmbience();
    }
    stopAmbience(owner) {
      if (this._amb && this._amb.owner === owner) {
        this._amb = null;
        this.syncAmbience();
      }
    }
    syncAmbience() {
      const want = this.ok && this._amb && AMBIENCE[this._amb.kind] ? this._amb.kind : null;
      if (this._ambNow && this._ambNow.kind === want) return;
      if (this._ambNow) {
        const a2 = this._ambNow;
        this._ambNow = null;
        clearInterval(a2.timer);
        a2.gain.gain.setTargetAtTime(1e-4, this.ctx.currentTime, 0.25);
        setTimeout(() => {
          a2.nodes.forEach((n) => {
            try {
              n.stop();
            } catch (e) {
            }
          });
          a2.gain.disconnect();
        }, 1500);
      }
      if (!want) return;
      const c = this.ctx, gain = c.createGain();
      gain.gain.value = 1e-4;
      gain.connect(this.master);
      const a = { kind: want, gain, nodes: [], timer: null, level: AMBIENCE[want].level };
      AMBIENCE[want].start.call(this, a);
      const duck = () => {
        const v = a.level * (this.narrating || this._talking ? 0.35 : 1) * (CALM.on ? 0.6 : 1);
        gain.gain.setTargetAtTime(v, c.currentTime, 0.4);
        if (a.tick) a.tick();
      };
      duck();
      a.timer = setInterval(duck, 250);
      this._ambNow = a;
    }
    // a looping noise through a filter (with an optional slow swell)
    _loopNoise(a, { type = "lowpass", f = 800, q = 0.7, vol = 1, swell = 0, rate = 0.1, sweep = 0 }) {
      const c = this.ctx, s = c.createBufferSource();
      s.buffer = this._noiseBuf;
      s.loop = true;
      const fl = c.createBiquadFilter();
      fl.type = type;
      fl.frequency.value = f;
      fl.Q.value = q;
      const g = c.createGain();
      g.gain.value = vol;
      s.connect(fl);
      fl.connect(g);
      g.connect(a.gain);
      s.start(0, Math.random());
      a.nodes.push(s);
      if (swell || sweep) {
        const l = c.createOscillator();
        l.frequency.value = rate;
        if (swell) {
          const lg = c.createGain();
          lg.gain.value = vol * swell;
          l.connect(lg);
          lg.connect(g.gain);
        }
        if (sweep) {
          const lf = c.createGain();
          lf.gain.value = sweep;
          l.connect(lf);
          lf.connect(fl.frequency);
        }
        l.start();
        a.nodes.push(l);
      }
      return g;
    }
    // ---- effect bank ----
    sfx(name, arg) {
      if (!this.sfxOn) return;
      const R = this.R[name];
      if (!R) return;
      if (this.ok) {
        R.call(this, arg);
        return;
      }
      const q = this._queue = this._queue || [];
      q.push({ R, arg, t: performance.now() });
      if (q.length > 6) q.shift();
      this._wake();
    }
    get R() {
      return this._R || (this._R = {
        twinkle() {
          const n = [1047, 1175, 1319, 1568, 1760, 2093];
          const f = n[Math.floor(Math.random() * n.length)];
          this.tone({ type: "triangle", f0: f, dur: 0.6, vol: 0.18 });
          this.tone({ f0: f * 2, t: 0.05, dur: 0.4, vol: 0.05 });
        },
        meow(id) {
          const m = meowOf(id) || {};
          const k = m.pitch || 1, len = m.length || 0.6;
          const c = this.ctx, now = c.currentTime;
          const o = c.createOscillator();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(540 * k, now);
          o.frequency.exponentialRampToValueAtTime(840 * k, now + len * 0.25);
          o.frequency.exponentialRampToValueAtTime(460 * k, now + len);
          const fl = c.createBiquadFilter();
          fl.type = "bandpass";
          fl.Q.value = 5;
          fl.frequency.setValueAtTime(900 * k, now);
          fl.frequency.exponentialRampToValueAtTime(2300 * k, now + len * 0.3);
          fl.frequency.exponentialRampToValueAtTime(1e3 * k, now + len);
          const g = c.createGain();
          g.gain.setValueAtTime(1e-4, now);
          g.gain.exponentialRampToValueAtTime(0.8, now + 0.05);
          g.gain.setValueAtTime(0.8, now + len * 0.65);
          g.gain.exponentialRampToValueAtTime(1e-4, now + len);
          o.connect(fl);
          fl.connect(g);
          g.connect(this.master);
          o.start(now);
          o.stop(now + len + 0.05);
        },
        boing() {
          this.tone({ type: "triangle", f0: 240, f1: 640, dur: 0.18, vol: 0.35 });
          this.tone({ type: "triangle", f0: 640, f1: 300, t: 0.16, dur: 0.2, vol: 0.28 });
        },
        pon() {
          this.tone({ f0: 320, f1: 980, dur: 0.16, vol: 0.4 });
        },
        // a bell with its own pitch (まねっこ, なぞって つなぐ): note(0) … note(5)
        note(i = 0) {
          const n = [523, 587, 659, 784, 880, 1047];
          const f = n[(i % 6 + 6) % 6];
          this.tone({ type: "triangle", f0: f, dur: 0.55, vol: 0.28 });
          this.tone({ f0: f * 2, dur: 0.35, vol: 0.08 });
        },
        pyoko() {
          this.tone({ type: "triangle", f0: 380, f1: 1100, dur: 0.12, vol: 0.26 });
          this.tone({ f0: 1400, t: 0.1, dur: 0.08, vol: 0.08 });
        },
        kyu() {
          this.tone({ type: "sawtooth", f0: 1700, f1: 2500, dur: 0.09, vol: 0.06, filter: { type: "bandpass", f: 2400, q: 3 } });
        },
        po() {
          this.tone({ f0: 500, f1: 900, dur: 0.12, vol: 0.25 });
        },
        gara() {
          this.noise({ dur: 0.28, vol: 0.3, f0: 1500, type: "bandpass", q: 2 });
          this.clicks(5, 0.045, 700, { type: "triangle", vol: 0.1, jitter: 0.4 });
        },
        patan() {
          this.tone({ f0: 160, f1: 60, dur: 0.18, vol: 0.5 });
          this.noise({ dur: 0.1, vol: 0.3, f0: 700 });
        },
        chikutaku() {
          for (let i = 0; i < 6; i++) this.tone({ type: "square", f0: i % 2 ? 1500 : 2e3, t: i * 0.26, dur: 0.035, vol: 0.12, filter: { f: 3e3 } });
        },
        poppo() {
          this.tone({ f0: 720, f1: 690, dur: 0.28, vol: 0.4, attack: 0.03, filter: { f: 1400 } });
          this.tone({ f0: 580, f1: 560, t: 0.34, dur: 0.38, vol: 0.4, attack: 0.03, filter: { f: 1400 } });
        },
        fuwa() {
          this.noise({ dur: 0.7, vol: 0.22, f0: 900, f1: 300, attack: 0.15 });
        },
        garagara() {
          for (let i = 0; i < 9; i++) this.tone({ type: "triangle", f0: 300 + Math.random() * 500, t: i * 0.06 + Math.random() * 0.02, dur: 0.07, vol: 0.18 });
          this.noise({ dur: 0.5, vol: 0.12, f0: 900 });
        },
        korokoro() {
          for (let i = 0; i < 7; i++) this.tone({ f0: 1300 + i % 2 * 300, t: i * 0.09, dur: 0.06, vol: 0.14 });
        },
        chirin() {
          [2637, 3520, 5274].forEach((f, i) => this.tone({ f0: f, dur: 1.6 - i * 0.4, vol: 0.16 / (i + 1) }));
          this.tone({ f0: 2637, t: 0.35, dur: 1.2, vol: 0.08 });
        },
        shushu() {
          for (let i = 0; i < 3; i++) this.noise({ t: i * 0.22, dur: 0.18, vol: 0.22, f0: 4200, type: "bandpass", q: 0.8 });
        },
        kasa() {
          for (let i = 0; i < 5; i++) this.noise({ t: i * 0.07 + Math.random() * 0.03, dur: 0.09, vol: 0.2, f0: 3200, type: "bandpass", q: 1.2, attack: 5e-3 });
        },
        yusa() {
          this.noise({ dur: 0.8, vol: 0.2, f0: 1200, f1: 600, attack: 0.1 });
          this.R.kasa.call(this);
        },
        poyon() {
          this.tone({ type: "triangle", f0: 300, f1: 760, f2: 260, dur: 0.4, vol: 0.32 });
        },
        kuru() {
          this.clicks(12, 0.045, 1700, { type: "square", vol: 0.06, dur: 0.02 });
        },
        kaa() {
          for (let i = 0; i < 2; i++) this.tone({ type: "sawtooth", f0: 760, f1: 520, t: i * 0.42, dur: 0.32, vol: 0.32, filter: { type: "bandpass", f: 1300, q: 4 } });
        },
        pata() {
          for (let i = 0; i < 3; i++) this.noise({ t: i * 0.16, dur: 0.12, vol: 0.18, f0: 1300, type: "bandpass", q: 1 });
        },
        pichan() {
          this.tone({ f0: 1500, f1: 480, dur: 0.12, vol: 0.32 });
          this.tone({ f0: 900, f1: 1400, t: 0.1, dur: 0.1, vol: 0.18 });
        },
        nosso() {
          this.tone({ f0: 220, f1: 130, dur: 0.5, vol: 0.2, attack: 0.08 });
        },
        gugu() {
          this.tone({ type: "sawtooth", f0: 75, f1: 58, dur: 0.6, vol: 0.28, filter: { f: 320 } });
          this.noise({ dur: 0.5, vol: 0.18, f0: 380 });
        },
        sawa() {
          this.noise({ dur: 0.9, vol: 0.18, f0: 2600, type: "bandpass", q: 0.7, attack: 0.2 });
        },
        kero() {
          for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) this.tone({ type: "square", f0: 240, f1: 190, t: i * 0.32 + j * 0.035, dur: 0.05, vol: 0.12, filter: { type: "bandpass", f: 900, q: 3 } });
        },
        kirarin() {
          [1568, 2093, 2637, 3136, 4186].forEach((f, i) => this.tone({ f0: f, t: i * 0.06, dur: 0.7, vol: 0.14 }));
        },
        powa() {
          this.tone({ f0: 660, dur: 1, vol: 0.14, attack: 0.25 });
          this.tone({ f0: 990, dur: 1, vol: 0.08, attack: 0.3 });
          this.tone({ f0: 1320, t: 0.1, dur: 0.8, vol: 0.05, attack: 0.3 });
        },
        riin() {
          for (let i = 0; i < 2; i++) this.tone({ f0: 4200, t: i * 0.5, dur: 0.38, vol: 0.08, trem: 32 });
        },
        gata() {
          this.clicks(7, 0.05, 420, { type: "triangle", vol: 0.2, jitter: 0.3, dur: 0.05 });
        },
        konkon() {
          this.tone({ f0: 900, f1: 500, dur: 0.08, vol: 0.3, filter: { f: 1800 } });
          this.tone({ f0: 900, f1: 500, t: 0.18, dur: 0.08, vol: 0.3, filter: { f: 1800 } });
        },
        mogu() {
          for (let i = 0; i < 4; i++) this.noise({ t: i * 0.14, dur: 0.08, vol: 0.2, f0: 700, type: "bandpass", q: 2 });
        },
        shuwa() {
          this.noise({ dur: 0.9, vol: 0.12, f0: 6e3, type: "highpass" });
          for (let i = 0; i < 14; i++) this.tone({ f0: 3e3 + Math.random() * 3e3, t: Math.random() * 0.8, dur: 0.02, vol: 0.05 });
        },
        karan() {
          this.tone({ f0: 2400, dur: 0.8, vol: 0.18 });
          this.tone({ f0: 3610, dur: 0.6, vol: 0.08 });
          this.tone({ f0: 2400, t: 0.16, dur: 0.5, vol: 0.08 });
        },
        moku() {
          this.noise({ dur: 1, vol: 0.2, f0: 500, f1: 250, attack: 0.25 });
        },
        sui() {
          this.tone({ f0: 1800, f1: 2600, dur: 0.35, vol: 0.08, attack: 0.08 });
        },
        zawa() {
          this.noise({ dur: 1, vol: 0.18, f0: 1800, type: "bandpass", q: 0.6, attack: 0.25 });
        },
        waiwai() {
          this.noise({ dur: 1, vol: 0.12, f0: 900, type: "bandpass", q: 1.5, attack: 0.2 });
          for (let i = 0; i < 8; i++) this.tone({ type: "triangle", f0: 300 + Math.random() * 400, t: Math.random() * 0.8, dur: 0.12, vol: 0.05, vib: 20 });
        },
        gottsun() {
          this.tone({ f0: 180, f1: 70, dur: 0.22, vol: 0.55 });
          this.noise({ dur: 0.12, vol: 0.35, f0: 900 });
          this.tone({ type: "triangle", f0: 1200, f1: 1600, t: 0.15, dur: 0.3, vol: 0.12, vib: 40 });
        },
        gorogoro() {
          this.tone({ type: "sawtooth", f0: 70, f1: 50, dur: 1.4, vol: 0.3, filter: { f: 260 }, trem: 9 });
          this.noise({ dur: 1.4, vol: 0.2, f0: 300, attack: 0.1 });
        },
        doteh() {
          this.tone({ f0: 140, f1: 60, dur: 0.25, vol: 0.5 });
          this.noise({ dur: 0.18, vol: 0.3, f0: 500 });
        },
        chime() {
          [1047, 1319, 1568, 2093].forEach((f, i) => {
            this.tone({ f0: f, t: i * 0.09, dur: 1.2, vol: 0.2 });
            this.tone({ f0: f * 2.01, t: i * 0.09, dur: 0.6, vol: 0.05 });
          });
        },
        hoot() {
          this.tone({ f0: 420, f1: 380, dur: 0.32, vol: 0.45, attack: 0.05, filter: { f: 900 }, vib: 6 });
          this.tone({ f0: 380, f1: 340, t: 0.42, dur: 0.45, vol: 0.45, attack: 0.05, filter: { f: 900 }, vib: 6 });
        },
        puff() {
          this.noise({ dur: 0.45, vol: 0.3, f0: 2400, f1: 300 });
        },
        undo() {
          this.tone({ type: "triangle", f0: 700, f1: 330, dur: 0.35, vol: 0.18 });
        },
        gu() {
          this.tone({ f0: 120, f1: 70, dur: 0.14, vol: 0.45 });
          this.noise({ dur: 0.08, vol: 0.2, f0: 600 });
        },
        ready() {
          this.tone({ type: "triangle", f0: 880, f1: 1320, dur: 0.18, vol: 0.18 });
        },
        strain() {
          this.tone({ type: "triangle", f0: 200, f1: 240, dur: 0.5, vol: 0.18, vib: 8 });
        },
        door() {
          this.tone({ type: "sawtooth", f0: 180, f1: 320, dur: 0.6, vol: 0.12, filter: { type: "bandpass", f: 900, q: 6 } });
          this.tone({ f0: 800, f1: 500, t: 0.62, dur: 0.1, vol: 0.25 });
        },
        found() {
          [784, 1047, 1319, 1568].forEach((f, i) => this.tone({ type: "square", f0: f, t: i * 0.08, dur: 0.22, vol: 0.07, filter: { f: 2500 } }));
          this.tone({ f0: 2093, t: 0.32, dur: 0.8, vol: 0.15 });
        },
        fanfare() {
          [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.tone({ type: "square", f0: f, t: i * 0.13, dur: 0.24, vol: 0.08, filter: { f: 2200 } }));
          [523, 659, 784, 1047].forEach((f) => this.tone({ type: "triangle", f0: f, t: 0.8, dur: 1.6, vol: 0.1 }));
        },
        finale() {
          const seq = [523, 659, 784, 1047, 1319, 1568, 2093];
          seq.forEach((f, i) => this.tone({ type: "square", f0: f, t: i * 0.11, dur: 0.3, vol: 0.07, filter: { f: 2600 } }));
          [523, 659, 784, 1047].forEach((f) => this.tone({ type: "triangle", f0: f, t: 0.85, dur: 2.8, vol: 0.11, attack: 0.05 }));
          [1047, 1319, 1568, 2093].forEach((f) => this.tone({ f0: f, t: 0.85, dur: 2.2, vol: 0.05, attack: 0.1 }));
          for (let i = 0; i < 14; i++) this.tone({ f0: 1568 + Math.random() * 2e3, t: 1 + i * 0.14, dur: 0.6, vol: 0.05 });
        },
        fwLaunch() {
          this.tone({ f0: 500, f1: 1900, dur: 0.8, vol: 0.06, attack: 0.05 });
          this.noise({ dur: 0.7, vol: 0.05, f0: 3e3, type: "bandpass", q: 1 });
        },
        fwBoom() {
          this.noise({ dur: 1.3, vol: 0.7, f0: 1400, f1: 120, attack: 5e-3 });
          this.tone({ f0: 90, f1: 38, dur: 0.6, vol: 0.6 });
        },
        fwCrackle() {
          for (let i = 0; i < 26; i++) this.noise({ t: Math.random() * 0.9, dur: 0.03, vol: 0.12, f0: 5e3, type: "highpass", attack: 2e-3 });
        }
      });
    }
    // ---- speech ----
    // the voice for each language. "kid" (かわいい声, the default): a woman's voice when the device has one, spoken higher.
    // Otherwise: the higher-quality voices first.
    _pickVoice() {
      if (typeof speechSynthesis === "undefined") return;
      const all = speechSynthesis.getVoices(), kid = kidVoice();
      const GOOD = /enhanced|premium|拡張|強化|高品質|natural|neural/i;
      const best = (re, female, male, names) => {
        const vs = all.filter((v) => re.test(v.lang));
        if (kid) {
          return vs.find((v) => female.test(v.name) && GOOD.test(v.name)) || vs.find((v) => female.test(v.name)) || vs.find((v) => !male.test(v.name) && GOOD.test(v.name)) || vs.find((v) => !male.test(v.name)) || vs[0] || null;
        }
        return vs.find((v) => GOOD.test(v.name)) || vs.find((v) => names.test(v.name)) || vs[0] || null;
      };
      const jaF = /kyoko|o-ren|nanami|haruka|ayumi|sayaka|mizuki|google|female|女性/i, jaM = /otoya|hattori|ichiro|keita|daichi|naoki|male|男性/i;
      const enF = /samantha|karen|moira|tessa|fiona|victoria|allison|ava|susan|zira|aria|jenny|google us english|female/i, enM = /alex|daniel|fred|tom|aaron|david|mark|guy|ralph|\bmale/i;
      const ptF = /luciana|joana|francisca|maria|fernanda|google português|female|feminin/i, ptM = /felipe|antonio|daniel|\bmale|masculin/i;
      this.voices = {
        ja: best(/^ja/i, jaF, jaM, /kyoko|o-ren|otoya|hattori|google|nanami|haruka|ayumi|ichiro/i),
        en: best(/^en[-_]US/i, enF, enM, /samantha|google|aria|jenny|zira/i) || best(/^en/i, enF, enM, /google/i),
        pt: best(/^pt[-_]BR/i, ptF, ptM, /luciana|google|francisca|maria/i) || best(/^pt/i, ptF, ptM, /google/i)
      };
      this.voice = this.voices.ja;
    }
    get canSpeak() {
      return typeof speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined";
    }
    // iPhone / iPad: the voice speaks only after it has once been started by a touch. セリフ is on from the start, so
    // the first reading (when a page or the cover is found) comes from a timer, not a touch, and would stay silent.
    // So each touch, until the voice has worked once, starts a silent, empty utterance.
    _primeVoice() {
      if (this._voiceOK || !this.canSpeak) return;
      try {
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0;
        u.onstart = u.onend = () => {
          this._voiceOK = true;
        };
        this._primeU = u;
        speechSynthesis.speak(u);
      } catch (e) {
      }
    }
    stopSpeech() {
      this._run = (this._run || 0) + 1;
      if (this.canSpeak) speechSynthesis.cancel();
      this.narrating = false;
      this._talking = false;
      this._dropLines();
      clearTimeout(this._safety);
    }
    // the line being said and the one waiting: over (job.done)
    _dropLines() {
      if (this._job) this._job.done = true;
      if (this._pending) this._pending.done = true;
      this._job = this._pending = null;
    }
    _utt(text, { pitch = 1, rate = 0.95 } = {}) {
      const u = new SpeechSynthesisUtterance(spoken(text));
      u.lang = LANGS[LANG.voice].speech;
      u.pitch = Math.min(2, pitch * (kidVoice() ? KID_PITCH : 1));
      u.rate = rate;
      const v = this.voices && this.voices[LANG.voice];
      if (v) u.voice = v;
      return u;
    }
    // character lines: only with セリフ on, never on top of the page reading, and never cut off.
    // If a character is still talking, the newest line waits and plays right after (older waiting lines are dropped).
    // a line (セリフ) by voice; returns its job, whose "done" tells when it has been said (or will not be said)
    say(text, opts) {
      if (!this.narrationOn || !this.canSpeak || this.narrating) return null;
      const job = { text, opts, t: Date.now(), done: false };
      if (this._talking) {
        if (this._pending) this._pending.done = true;
        this._pending = job;
        return job;
      }
      this._line(job);
      return job;
    }
    _line(job) {
      this._talking = true;
      this._job = job;
      const u = this._utt(job.text, job.opts);
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        clearTimeout(this._safety);
        this._talking = false;
        job.done = true;
        if (this._job === job) this._job = null;
        const next = this._pending;
        this._pending = null;
        if (next && Date.now() - next.t < 2500 && this.narrationOn && !this.narrating) this._line(next);
        else if (next) next.done = true;
      };
      u.onend = done;
      u.onerror = done;
      u.onstart = () => {
        this._voiceOK = true;
      };
      this._safety = setTimeout(done, 1800 + spoken(job.text).length * 260);
      speechSynthesis.speak(u);
    }
    // page reading: one utterance per printed line, read as whole sentences.
    // The lines are spoken one after another (not queued all at once): some phones never tell when a queued line starts,
    // so the line's onstart (the reading highlight) is called here, as each line is handed to the voice.
    narrate(segs, onend) {
      if (!this.canSpeak || !segs.length) {
        onend && onend();
        return false;
      }
      speechSynthesis.cancel();
      clearTimeout(this._safety);
      this._talking = false;
      this._dropLines();
      this.narrating = true;
      const run = this._run = (this._run || 0) + 1;
      const next = (i) => {
        if (run !== this._run) return;
        if (i >= segs.length) {
          clearTimeout(this._safety);
          this.narrating = false;
          onend && onend();
          return;
        }
        const sg = segs[i], u = this._utt(sg.text, sg.voice);
        let finished = false;
        const fin = () => {
          if (finished) return;
          finished = true;
          clearTimeout(this._safety);
          setTimeout(() => next(i + 1), 150);
        };
        u.onend = fin;
        u.onerror = fin;
        u.onstart = () => {
          this._voiceOK = true;
        };
        this._u = u;
        if (sg.onstart) sg.onstart();
        this._safety = setTimeout(fin, 3e3 + spoken(sg.text).length * 300 / (u.rate || 1));
        speechSynthesis.speak(u);
      };
      next(0);
      return true;
    }
  };
  var chance = (p) => Math.random() < p;
  var AMBIENCE = {
    waves: { level: 0.16, start(a) {
      this._loopNoise(a, { f: 520, vol: 0.6, swell: 0.9, rate: 0.11, sweep: 260 });
    } },
    // なみ
    wind: { level: 0.12, start(a) {
      this._loopNoise(a, { type: "bandpass", f: 600, q: 1.4, vol: 0.7, swell: 0.6, rate: 0.07, sweep: 380 });
    } },
    // かぜ
    rain: { level: 0.1, start(a) {
      this._loopNoise(a, { type: "highpass", f: 1400, vol: 0.6 });
      this._loopNoise(a, { f: 380, vol: 0.4 });
    } },
    // あめ
    stream: {
      // おがわ
      level: 0.1,
      start(a) {
        const g = this._loopNoise(a, { type: "bandpass", f: 1700, q: 0.9, vol: 0.7 });
        a.tick = () => g.gain.setTargetAtTime(0.45 + Math.random() * 0.45, this.ctx.currentTime, 0.05);
      }
    },
    insects: {
      // むしの こえ（リーン リーン）
      level: 0.22,
      start(a) {
        a.tick = () => {
          if (chance(0.3)) [0, 0.22].forEach((t) => this.tone({ f0: 4300 + Math.random() * 300, t, dur: 0.18, vol: 0.05, trem: 38, dest: a.gain }));
        };
      }
    },
    birds: {
      // ことり（チュンチュン）
      level: 0.22,
      start(a) {
        a.tick = () => {
          if (!chance(0.12)) return;
          const f = 2400 + Math.random() * 900, n = 2 + Math.floor(Math.random() * 3);
          for (let k = 0; k < n; k++) this.tone({ type: "sine", f0: f, f1: f * 1.45, t: k * 0.13, dur: 0.09, vol: 0.05, dest: a.gain });
        };
      }
    },
    fire: {
      // たきび（パチパチ）
      level: 0.14,
      start(a) {
        this._loopNoise(a, { f: 300, vol: 0.5, swell: 0.3, rate: 0.3 });
        a.tick = () => {
          for (let k = 0; k < 3; k++) if (chance(0.25)) this.noise({ t: Math.random() * 0.25, dur: 0.03, vol: 0.12, f0: 2600, type: "highpass", attack: 2e-3, dest: a.gain });
        };
      }
    }
  };

  // system/engine/ui.js
  var I = {
    book: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5V19c-2.5-1.3-5.5-1.3-9 .7-3.5-2-6.5-2-9-.7Z" fill="#fff4d6" stroke="#4a3360" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 6v13.7" stroke="#4a3360" stroke-width="1.8"/></svg>',
    stop: '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="6" y="6" width="12" height="12" rx="2.5" fill="#4a3360"/></svg>',
    voice: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="9" cy="9" r="4" fill="#ffd96b" stroke="#4a3360" stroke-width="1.8"/><path d="M2.5 20c.6-4 3.3-6 6.5-6s5.9 2 6.5 6" fill="#ffd96b" stroke="#4a3360" stroke-width="1.8"/><path d="M17 7.5a4 4 0 0 1 0 5M19.5 5a7.5 7.5 0 0 1 0 10" fill="none" stroke="#4a3360" stroke-width="1.8" stroke-linecap="round"/></svg>',
    sfx: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 17V5l11-2v12" fill="none" stroke="#4a3360" stroke-width="1.8" stroke-linejoin="round"/><circle cx="6.5" cy="17" r="3" fill="#ff8fb1" stroke="#4a3360" stroke-width="1.8"/><circle cx="17.5" cy="15" r="3" fill="#7cc6f0" stroke="#4a3360" stroke-width="1.8"/></svg>',
    slash: '<path d="M3 3l18 18" stroke="#c4504f" stroke-width="2.6" stroke-linecap="round"/>',
    reset: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12a7 7 0 1 0 2.2-5.1" fill="none" stroke="#4a3360" stroke-width="2.2" stroke-linecap="round"/><path d="M6.5 3.5v4h4" fill="none" stroke="#4a3360" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    text: '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="3" y="4.5" width="18" height="15" rx="3" fill="#fff4d6" stroke="#4a3360" stroke-width="1.8"/><path d="M7 9.5h10M7 13h10M7 16.5h6" stroke="#4a3360" stroke-width="1.8" stroke-linecap="round"/></svg>',
    layers: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4 3 8.5l9 4.5 9-4.5Z" fill="#ffd96b" stroke="#4a3360" stroke-width="1.8" stroke-linejoin="round"/><path d="m3 12.5 9 4.5 9-4.5M3 16.5l9 4.5 9-4.5" fill="none" stroke="#4a3360" stroke-width="1.8" stroke-linejoin="round" stroke-dasharray="2.5 2"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M15 5l-7 7 7 7" fill="none" stroke="#4a3360" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    restart: '<svg viewBox="0 0 24 24" width="18" height="18"><rect x="4" y="5" width="3" height="14" rx="1" fill="#4a3360"/><path d="M19 5v14L8.5 12Z" fill="#4a3360" stroke="#4a3360" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M3.5 11.5 12 4l8.5 7.5" fill="none" stroke="#4a3360" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10.5V20h12v-9.5" fill="#ffd96b" stroke="#4a3360" stroke-width="2" stroke-linejoin="round"/><rect x="10" y="14" width="4" height="6" fill="#4a3360"/></svg>',
    crayon: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 20l2.2-6.6L16.6 3a2 2 0 0 1 2.8 0l1.6 1.6a2 2 0 0 1 0 2.8L10.6 17.8Z" fill="#ff8fb1" stroke="#4a3360" stroke-width="1.8" stroke-linejoin="round"/><path d="M6.2 13.4l4.4 4.4M4 20l2-.6" stroke="#4a3360" stroke-width="1.8" stroke-linecap="round"/></svg>',
    globe: '<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="8.5" fill="#bfe6ff" stroke="#4a3360" stroke-width="1.8"/><path d="M3.5 12h17M12 3.5c-2.6 2.4-3.8 5.2-3.8 8.5s1.2 6.1 3.8 8.5M12 3.5c2.6 2.4 3.8 5.2 3.8 8.5s-1.2 6.1-3.8 8.5" fill="none" stroke="#4a3360" stroke-width="1.6"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M9 5l7 7-7 7" fill="none" stroke="#4a3360" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var withSlash = (svg, off) => off ? svg.replace("</svg>", `${I.slash}</svg>`) : svg;
  var icon = (name, color = "#ffffff") => (I[name] || "").split("#4a3360").join(color);
  var UI = class {
    constructor(h) {
      this.h = h;
      this.hud = document.getElementById("hud");
      this.hud.innerHTML = `
      <div class="top">
        <div class="tl">
          <div class="chip page"><b class="pn">1/4</b><span class="pname"></span></div>
          <button class="mini restart" type="button" aria-label="さいしょから よむ">${I.restart}<span>さいしょ</span></button>
          <button class="mini home" type="button" aria-label="はじめに もどる">${I.home}<span>はじめ</span></button>
          <button class="mini langbtn" type="button" aria-label="ことば" aria-expanded="false" hidden>${I.globe}<span>ことば</span></button>
        </div>
        <div class="langpop" hidden></div>
        <div class="tr">
          <div class="chip prog"><span class="lbl"></span><span class="slots"></span></div>
          <div class="bag" aria-label="もちもの"></div>
        </div>
      </div>
      <div class="hint" role="status"><span class="ht"></span><b class="done">できた！</b></div>
      <div class="coverhelp"><span>♪ キラリンが きこえないときは</span><button type="button" class="reload">よみこみなおす</button></div>
      <div class="toast" role="status"></div>
      <div class="caption" aria-live="polite"></div>
      <div class="stamppop" aria-hidden="true"></div>
      <button class="playbtn" type="button">▶ あそぶ</button>
      <button class="endbtn" type="button">📖 おしまい</button>
      <button class="nav prev" type="button" aria-label="まえの ページ">${I.left}</button>
      <button class="nav next" type="button" aria-label="つぎの ページ">${I.right}</button>
      <div class="bottom">
        <button class="tb read" type="button"><i>${I.book}</i><span>よむ</span></button>
        <button class="tb narr" type="button" aria-pressed="true"><i>${I.voice}</i><span>セリフ</span></button>
        <button class="tb sfx" type="button" aria-pressed="true"><i>${I.sfx}</i><span>こうかおん</span></button>
        <button class="tb reset" type="button"><i>${I.reset}</i><span>もどす</span></button>
        <button class="tb text" type="button" aria-pressed="false"><i>${I.text}</i><span>もじ</span></button>
        <button class="tb paper" type="button" aria-pressed="false"><i>${I.layers}</i><span>ARだけ</span></button>
      </div>`;
      const q = (s) => this.hud.querySelector(s);
      this.el = { read: q(".read"), narr: q(".narr"), sfx: q(".sfx"), reset: q(".reset"), paper: q(".paper"), prev: q(".prev"), next: q(".next"), toast: q(".toast"), pn: q(".pn"), pname: q(".pname"), lbl: q(".prog .lbl"), slots: q(".prog .slots") };
      this.el.read.addEventListener("click", () => h.onRead());
      this.el.narr.addEventListener("click", () => h.onNarration());
      this.el.sfx.addEventListener("click", () => h.onSfx());
      this.el.reset.addEventListener("click", () => h.onReset());
      this.el.text = q(".tb.text");
      this.el.text.addEventListener("click", () => h.onText());
      this.el.paper.addEventListener("click", () => h.onPaper());
      this.el.prev.addEventListener("click", () => h.onPage(-1));
      this.el.next.addEventListener("click", () => h.onPage(1));
      this.el.hint = q(".hint");
      this.el.ht = q(".hint .ht");
      this.el.play = q(".playbtn");
      q(".mini.restart").addEventListener("click", () => h.onRestart());
      q(".mini.home").addEventListener("click", () => h.onHome());
      this.el.langbtn = q(".mini.langbtn");
      this.el.langpop = q(".langpop");
      this.el.langbtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openLangs(this.el.langpop.hidden);
      });
      this.el.langpop.addEventListener("click", (e) => {
        e.stopPropagation();
        const b = e.target.closest("button");
        if (!b) return;
        try {
          if (b.dataset.lang) h.onWords(b.dataset.lang);
          else if (b.dataset.voice) h.onVoice(b.dataset.voice);
        } finally {
          this.drawLangs();
        }
      });
      document.addEventListener("pointerdown", (e) => {
        if (!this.el.langpop.hidden && !e.target.closest(".langpop, .mini.langbtn")) this.openLangs(false);
      });
      this.el.play.addEventListener("click", () => h.onPlay());
      q(".coverhelp .reload").addEventListener("click", () => location.reload());
      this.el.end = q(".endbtn");
      this.el.end.addEventListener("click", () => h.onEnding());
      this.el.bag = q(".bag");
      this.el.caption = q(".caption");
      this.el.stamp = q(".stamppop");
      this.done = {};
      this.prog = {};
      this.relabel();
    }
    // ことば: the button is there when the book has two languages or more
    setLangs(list) {
      this._langs = (list || []).filter((l) => LANGS[l]);
      this.el.langbtn.hidden = this._langs.length < 2;
      if (this._langs.length < 2) this.openLangs(false);
    }
    openLangs(on) {
      this.el.langpop.hidden = !on;
      this.el.langbtn.setAttribute("aria-expanded", String(on));
      this.el.langbtn.classList.toggle("active", on);
      if (on) this.drawLangs();
    }
    drawLangs() {
      const row = (label, key, now) => `<div class="lrow"><small>${tr(label)}</small>${this._langs.map((l) => `<button type="button" data-${key}="${l}" class="${l === now ? "on" : ""}" lang="${l}" aria-pressed="${l === now}">${LANGS[l].name}</button>`).join("")}</div>`;
      this.el.langpop.innerHTML = row("もじ", "lang", LANG.now) + row("こえ", "voice", LANG.voice);
    }
    // the buttons' words in the language being used
    relabel() {
      const q = (s) => this.hud.querySelector(s);
      const set = (sel, ja, attr) => {
        const el = q(sel);
        if (!el) return;
        if (attr) el.setAttribute(attr, tr(ja));
        else el.textContent = tr(ja);
      };
      set(".mini.restart span", "さいしょ");
      set(".mini.restart", "さいしょから よむ", "aria-label");
      set(".mini.home span", "はじめ");
      set(".mini.home", "はじめに もどる", "aria-label");
      set(".mini.langbtn span", "ことば");
      set(".mini.langbtn", "ことば", "aria-label");
      if (this.el.langpop && !this.el.langpop.hidden) this.drawLangs();
      set(".nav.prev", "まえの ページ", "aria-label");
      set(".nav.next", "つぎの ページ", "aria-label");
      set(".hint .done", "できた！");
      set(".playbtn", "▶ あそぶ");
      this.el.end.textContent = `📖 ${tr("おしまい")}`;
      set(".coverhelp span", "♪ キラリンが きこえないときは");
      set(".coverhelp .reload", "よみこみなおす");
      set(".tb.narr span", "セリフ");
      set(".tb.sfx span", "こうかおん");
      set(".tb.reset span", "もどす");
      set(".tb.text span", "もじ");
      set(".bag", "もちもの", "aria-label");
      if (this._paperJa) this.setPaperLabel(this._paperJa);
      this.setReading(!!this._reading);
      if (this.page) {
        this.setPage(this.page, this._pname, this.progDef);
        this.setHint(this._hintJa, this._story);
      }
      if (this._cover) this.el.pname.textContent = tr("ひょうし");
    }
    show(on = true) {
      this.hud.classList.toggle("on", on);
    }
    setNav(on) {
      this.hud.classList.toggle("withnav", on);
    }
    setPaperLabel(t) {
      this._paperJa = t;
      this.el.paper.querySelector("span").textContent = tr(t);
    }
    setPaperMode(on) {
      this.el.paper.classList.toggle("active", on);
      this.el.paper.setAttribute("aria-pressed", String(on));
    }
    setNarration(on) {
      this.el.narr.classList.toggle("off", !on);
      this.el.narr.setAttribute("aria-pressed", String(on));
      this.el.narr.querySelector("i").innerHTML = withSlash(I.voice, !on);
    }
    // the おしまい button: after the last page is cleared, it opens the book's ending
    setEnd(on) {
      this.el.end.classList.toggle("on", on);
    }
    setText(on) {
      this.el.text.classList.toggle("active", on);
      this.el.text.setAttribute("aria-pressed", String(on));
    }
    setSfx(on) {
      this.hud.classList.toggle("nosfx", !on);
      this.el.sfx.classList.toggle("off", !on);
      this.el.sfx.setAttribute("aria-pressed", String(on));
      this.el.sfx.querySelector("i").innerHTML = withSlash(I.sfx, !on);
    }
    setReading(on) {
      this._reading = on;
      this.el.read.classList.toggle("active", on);
      this.el.read.querySelector("i").innerHTML = on ? I.stop : I.book;
      this.el.read.querySelector("span").textContent = tr(on ? "とめる" : "よむ");
      if (!on) this.caption("");
    }
    // the printed cover is shown (camera): the chip says so; the page's hint, progress and buttons wait
    setCover(on) {
      if (on === !!this._cover) return;
      this._cover = on;
      this.hud.classList.toggle("oncover", on);
      if (on) {
        this._chip = [this.el.pn.textContent, this.el.pname.textContent];
        this.el.pname.textContent = tr("ひょうし");
      } else if (this.page) this.setPage(this.page, this._pname, this.progDef);
      else [this.el.pn.textContent, this.el.pname.textContent] = this._chip;
    }
    setPage(n, name, progressDef) {
      this.page = n;
      this._pname = name;
      this.el.pn.textContent = `${n}/${this.count || n}`;
      this.el.pname.textContent = shown(name);
      this.el.prev.disabled = n <= 1;
      this.el.next.disabled = n >= (this.count || n);
      this._renderDone && this._renderDone();
      this.progDef = progressDef;
      this._renderProg();
    }
    setProgress(n, done, total) {
      this.prog[n] = { done, total };
      if (n === this.page) this._renderProg();
    }
    _renderProg() {
      const d = this.progDef;
      this.el.slots.parentElement.style.display = d ? "" : "none";
      if (!d) return;
      const p = this.prog[this.page] || { done: 0, total: d.total || (d.colors ? d.colors.length : 3) };
      this.el.lbl.textContent = shown(d.label);
      let s = "";
      for (let i = 0; i < p.total; i++) {
        const got = i < p.done;
        if (!d.colors) s += `<i class="dot plain${got ? " got" : ""}"></i>`;
        else s += `<i class="dot${got ? " got" : ""}" style="--c:${d.colors[i % d.colors.length]}"></i>`;
      }
      const was = this.el.slots.querySelectorAll(".got").length;
      this.el.slots.innerHTML = s;
      if (p.done > was && p.done > 0) {
        const el = this.el.slots.children[p.done - 1];
        el && el.classList.add("pop");
      }
      this.el.slots.parentElement.classList.toggle("complete", p.done >= p.total);
    }
    // persistent hint for the page (story phase: what to do first; play phase: the page's goal)
    setHint(text, story = false) {
      this._hintJa = text;
      this.el.ht.textContent = text ? shown(text) : "";
      this.el.hint.classList.toggle("on", !!text);
      this.el.hint.classList.toggle("story", story);
      this._story = story;
      this._renderDone();
    }
    setStory(on) {
      this.el.play.classList.toggle("on", on);
      this.hud.classList.toggle("storymode", on);
    }
    setDone(n, done) {
      this.done[n] = done;
      this._renderDone();
    }
    _renderDone() {
      this.el.hint.classList.toggle("isdone", !this._story && !!this.done[this.page]);
    }
    toast(text, ms = 3e3) {
      this.el.toast.textContent = shown(text);
      this.el.toast.classList.add("on");
      clearTimeout(this._tt);
      this._tt = setTimeout(() => this.el.toast.classList.remove("on"), ms);
    }
    // subtitles while reading in another language ('' hides them)
    caption(text) {
      this.el.caption.textContent = text || "";
      this.el.caption.classList.toggle("on", !!text);
    }
    // もちもの: the things in the bag (icons: { id: picture }), the newest one pops
    setBag(items, icons, names, fresh) {
      this.el.bag.innerHTML = items.map((id) => `<i class="item${id === fresh ? " pop" : ""}" title="${esc(names(id))}">${icons[id] ? `<img src="${icons[id]}" alt="${esc(names(id))}">` : `<b>${esc(names(id).slice(0, 2))}</b>`}</i>`).join("");
      this.el.bag.classList.toggle("on", items.length > 0);
    }
    // ごほうびスタンプ: a stamp pops in the middle of the screen, then fades
    stampPop(html) {
      const el = this.el.stamp;
      el.innerHTML = `${html}<b>${esc(tr("スタンプ ゲット！"))}</b>`;
      el.classList.remove("on");
      void el.offsetWidth;
      el.classList.add("on");
      clearTimeout(this._st);
      this._st = setTimeout(() => el.classList.remove("on"), 2600);
    }
  };
  var esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function panel(id, html) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      el.className = "panel";
      document.body.appendChild(el);
    }
    el.innerHTML = `<div class="card">${html}</div>`;
    el.classList.add("on");
    return el;
  }
  function hidePanel(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove("on");
  }
  function showLicenses() {
    const text = window.EHON_LICENSES || "";
    const el = panel("licenses", `<h2>${tr("ライセンス表示")}</h2><p class="lic">${tr("この ページに ふくまれる ソフトウェアと フォントの ライセンスです。")}</p><pre></pre><button class="big close" type="button">${tr("とじる")}</button>`);
    el.querySelector("pre").textContent = text;
    el.querySelector(".close").addEventListener("click", () => hidePanel("licenses"));
  }

  // system/engine/presets.js
  var THREE10 = __toESM(require_three(), 1);

  // system/engine/goals.js
  var THREE9 = __toESM(require_three(), 1);

  // system/engine/games.js
  var THREE8 = __toESM(require_three(), 1);
  var PX = 1 / 1600;
  var PH3 = 0.75;
  var pagePoint = ([x, y]) => new THREE8.Vector3(x * PX - 0.5, PH3 / 2 - y * PX, 0);
  var near2 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  var groundOf = (hit) => hit ? hit.ground || hit.point : null;
  var toldOnce = (pg, key, text, ms = 2600) => {
    if (pg.gs[key]) return;
    pg.gs[key] = true;
    pg.toast(text, ms);
  };
  function moreHint(g) {
    switch (g.type) {
      case "carry":
        return "ゆびで おして はこんでね";
      case "copy":
        return "ひかった じゅんばんに タッチしてね";
      case "pairs":
        return "おなじ えを 2まい さがしてね";
      case "hold":
        return "ながく おしてね";
      case "trace":
        return "てんを じゅんばんに なぞってね";
      default:
        return null;
    }
  }
  function moreProgress(g, dots) {
    switch (g.type) {
      case "carry":
        return dots("はこんだ", g.items.length);
      case "copy":
        return dots("できた", param(g, "rounds", "copyRounds").length);
      case "pairs":
        return dots("ペア", pairsInPlay(g));
      case "trace":
        return dots("つないだ", g.points.length - 1 + (g.close ? 1 : 0));
      default:
        return null;
    }
  }
  function moreHintTargets(pg, g) {
    const gs = pg.gs;
    switch (g.type) {
      case "carry":
        return g.items.filter((id) => !gs.carried[id]);
      case "copy":
        return gs.phase === "input" ? [gs.seq[gs.pos]] : [];
      case "pairs": {
        const left = g.cards.filter((id) => !gs.matched[id] && gs.group[id] !== void 0);
        const open = gs.open.length === 1 ? gs.open[0] : null, k = open ? gs.group[open] : left.length ? gs.group[left[0]] : null;
        return left.filter((id) => gs.group[id] === k && id !== open);
      }
      case "hold":
        return [g.target];
      case "trace":
        if (gs.dots && gs.dots[gs.next]) pulseDot(pg, gs.dots[gs.next]);
        return typeof g.points[gs.next] === "string" ? [g.points[gs.next]] : [];
      default:
        return [];
    }
  }
  var destOf = (g, id) => typeof g.to === "string" ? g.to : (g.to || {})[id];
  function seatOf(pg, g, c, to) {
    const T3 = pg.C(to), seat = g.seat && g.seat[to];
    if (!seat) return [T3.pvx, T3.pvy];
    const [a0, b0, a1, b1] = pg.seenBox(c), mid = (b0 + b1) / 2;
    return [seat[0] - ((a0 + a1) / 2 - c.m.w / 2), c.m.pivot === "top" ? seat[1] - mid : seat[1] + c.m.h - mid];
  }
  function reachOf(pg, g, to) {
    let r = g.reach || 0.1;
    const T3 = pg.C(to);
    if (!T3 || typeof g.to === "string") return r;
    for (const o of new Set(Object.values(g.to || {}))) {
      const O = o !== to && pg.C(o);
      if (O) r = Math.min(r, near2(T3.pivot.position, O.pivot.position) * 0.5);
    }
    return r;
  }
  function within(pg, id, to) {
    for (let c = pg.cards[id]; c; c = c.m.parent ? pg.cards[c.m.parent] : null) if (c.id === to) return true;
    return false;
  }
  var overTarget = (pg, hit, to, self) => !!(to && hit && hit.under && hit.under.some((id) => !within(pg, id, self) && within(pg, id, to)));
  function inFront(pg, id, on) {
    const c = pg.C(id);
    if (!c) return;
    c._front = on;
    c.pivot.traverse((o) => {
      if (o.isMesh && o.userData.tex !== void 0) {
        o.material.depthTest = !on;
        o.renderOrder = on ? 5 : 0;
      }
    });
  }
  function carryHome(pg, c, dur = 0.6) {
    const p0 = c.pivot.position.clone(), home = c.pivotHome;
    pg.tween(
      dur,
      (t) => {
        c.pivot.position.lerpVectors(p0, home, easeInOut(t));
        if (c.shadow) c.shadow.position.set(c.pivot.position.x, c.pivot.position.y, c.shadow.position.z);
      },
      () => {
        c.pivot.position.copy(home);
        if (c.shadow) c.shadow.position.set(home.x, home.y, c.shadow.position.z);
        inFront(pg, c.id, false);
      }
    );
  }
  var carry = {
    texts: (g) => wordsOf(g.word, ["とどいた！", "やったね！"]).map((x) => said(x, g.color || "#e8756a")),
    init(pg) {
      for (const c of Object.values(pg.cards)) if (c._front) inFront(pg, c.id, false);
      pg.gs.carried = {};
      pg.gs.drag = null;
      pg.gs.on = {};
    },
    grab(pg, g, id, hit) {
      if (pg.gs.done || !g.items.includes(id) || pg.gs.carried[id] || !hit) return false;
      const c = pg.C(id), at = groundOf(hit);
      pg.gs.drag = { id, off: new THREE8.Vector3(c.pivot.position.x - at.x, c.pivot.position.y - at.y, 0), near: null };
      inFront(pg, id, true);
      pg.hop(id, 0.025, 0.4);
      pg.sfx("pon");
      progressed(pg);
      return true;
    },
    rub(pg, g, id, hit) {
      const d = pg.gs.drag, at = groundOf(hit);
      if (!d || !at) return;
      const c = pg.C(d.id);
      c.pivot.position.x = Math.max(-0.48, Math.min(0.48, at.x + d.off.x));
      c.pivot.position.y = Math.max(-PH3 / 2 + 0.02, Math.min(PH3 / 2 - 0.02, at.y + d.off.y));
      if (c.shadow) c.shadow.position.set(c.pivot.position.x, c.pivot.position.y, c.shadow.position.z);
      const to = destOf(g, d.id), T3 = to && pg.C(to);
      const close = T3 && (overTarget(pg, hit, to, d.id) || near2(c.pivot.position, T3.pivot.position) < reachOf(pg, g, to));
      if (close && d.near !== to) {
        d.near = to;
        pg.pulse(to, 1.08, 0.5);
        pg.sfx("twinkle");
      }
      if (!close) d.near = null;
      if (!CALM.on && Math.random() < 0.15) pg.fx.burst(pg.top(d.id, 0.3), 2, 0.4, ["#fff2a8", "#ffffff"]);
    },
    release(pg, g, id, hit) {
      const d = pg.gs.drag;
      if (!d) return;
      pg.gs.drag = null;
      const c = pg.C(d.id), to = destOf(g, d.id), T3 = to && pg.C(to);
      const over = !!T3 && overTarget(pg, hit, to, d.id);
      if (!T3 || !over && near2(c.pivot.position, T3.pivot.position) >= reachOf(pg, g, to)) {
        carryHome(pg, c);
        return;
      }
      pg.gs.carried[d.id] = true;
      progressed(pg);
      const shadow = () => {
        if (c.shadow) c.shadow.position.set(c.pivot.position.x, c.pivot.position.y, c.shadow.position.z);
      };
      const goIn = () => {
        pg.tween(0.35, (t) => c.body.scale.setScalar(1 - t), () => {
          pg.hide(d.id);
          c.body.scale.setScalar(1);
          inFront(pg, d.id, false);
        });
        if (c.shadow) c.shadow.visible = false;
      };
      const r = g.react && g.react[d.id];
      const arrived = () => {
        if (r) react(pg, to, r, null, { free: true, auto: true });
        else {
          pg.hop(to, 0.05);
          pg.sfx(g.sound || "mogu");
        }
        pg.ono(pick2(g.word || ["とどいた！", "やったね！"], nextIdx(pg, "carry")), pg.top(to, 1.05), g.color || "#e8756a");
        pg.burst(to, 14, 1);
      };
      if (over && !g.stay) {
        pg.later(150, goIn);
        pg.later(450, arrived);
      } else {
        const at = g.stay ? seatOf(pg, g, c, to) : [T3.pvx, T3.pvy];
        const p0 = c.pivot.position.clone(), p1 = g.stay ? pg.pointOn(to, at[0], at[1], 4e-3) : T3.pivot.position.clone();
        if (!g.stay) p1.z = p0.z;
        pg.tween(0.45, (t) => {
          c.pivot.position.lerpVectors(p0, p1, easeInOut(t));
          shadow();
        }, () => {
          if (!g.stay) {
            goIn();
            arrived();
            return;
          }
          inFront(pg, d.id, false);
          pg.placePiece(d.id, to, at);
          pg.gs.on[to] = d.id;
          arrived();
        });
      }
      const n = Object.keys(pg.gs.carried).length;
      pg.progress(n, g.items.length);
      if (g.count) setCount(g.count, n);
      if (n === g.items.length) pg.later(1500, () => goalDone(pg, g));
    },
    tap(pg, g, id, hit) {
      const on = pg.gs.on && pg.gs.on[id];
      if (on) {
        const a = pg.logic.ambient && pg.logic.ambient[on];
        if (a) a(pg, hit);
        return true;
      }
      if (!g.items.includes(id) || pg.gs.done || pg.gs.carried[id]) return false;
      pg.wobble(id, 0.05, 0.6);
      toldOnce(pg, "toldCarry", "ゆびで おしたまま うごかしてね");
      return true;
    }
  };
  var NOTE_COL = ["#ff8a7a", "#ffcf3a", "#7ad68a", "#6ab8f0", "#c49af0", "#ff9fd0"];
  function shine(pg, g, id) {
    const i = g.targets.indexOf(id);
    pg.pulse(id, 1.18, 0.6);
    pg.sfx("note", i);
    pg.burst(id, CALM.on ? 6 : 12, 0.8, [NOTE_COL[i % NOTE_COL.length], "#ffffff"]);
  }
  function copyShow(pg, g) {
    const gs = pg.gs, len = param(g, "rounds", "copyRounds")[gs.round];
    if (!gs.seq || gs.seq.length !== len) {
      gs.seq = [];
      for (let k = 0; k < len; k++) {
        let id;
        do {
          id = g.targets[Math.floor(Math.random() * g.targets.length)];
        } while (g.targets.length > 1 && id === gs.seq[k - 1]);
        gs.seq.push(id);
      }
    }
    gs.phase = "show";
    gs.pos = 0;
    toldOnce(pg, `toldWatch${gs.round}`, "よく みててね", 1800);
    gs.seq.forEach((id, k) => pg.later(1300 + k * 1e3, () => shine(pg, g, id)));
    pg.later(1300 + gs.seq.length * 1e3 + 300, () => {
      gs.phase = "input";
      gs.lastMove = pg.time;
      pg.toast("おなじ じゅんばんで タッチしてね", 2400);
    });
  }
  var copy = {
    texts: (g) => [said(g.wrongWord || "あれれ？", "#7a5aa0"), ...wordsOf(g.word, ["できた！", "すごい！"]).map((x) => said(x, g.color || "#e8b21f"))],
    init(pg) {
      pg.gs.round = 0;
      pg.gs.phase = "wait";
      pg.gs.seq = null;
    },
    play(pg, g) {
      copyShow(pg, g);
    },
    tap(pg, g, id) {
      if (!g.targets.includes(id) || pg.gs.done) return false;
      const gs = pg.gs;
      if (gs.phase !== "input") {
        pg.wobble(id, 0.03, 0.4);
        return true;
      }
      if (id !== gs.seq[gs.pos]) {
        gs.phase = "show-again";
        pg.wobble(id, 0.06, 0.8);
        pg.sfx("undo");
        pg.ono(g.wrongWord || "あれれ？", id, "#7a5aa0");
        pg.later(900, () => {
          pg.toast("もういちど みてね", 1800);
          copyShow(pg, g);
        });
        return true;
      }
      shine(pg, g, id);
      gs.pos++;
      progressed(pg);
      if (gs.pos < gs.seq.length) return true;
      const rounds = param(g, "rounds", "copyRounds");
      gs.round++;
      gs.seq = null;
      gs.phase = "wait";
      pg.progress(gs.round, rounds.length);
      pg.ono(pick2(g.word || ["できた！", "すごい！"], nextIdx(pg, "copy")), pg.top(id, 1.1), g.color || "#e8b21f");
      pg.sfx("kirarin");
      if (gs.round >= rounds.length) pg.later(1e3, () => goalDone(pg, g));
      else pg.later(1200, () => copyShow(pg, g));
      return true;
    }
  };
  function pairsOf(g) {
    if (g.pairs) return g.pairs;
    const by = {};
    for (const id of g.cards) (by[id.replace(/\d+$/, "")] = by[id.replace(/\d+$/, "")] || []).push(id);
    return Object.values(by).filter((p) => p.length >= 2);
  }
  var pairsInPlay = (g) => Math.max(1, Math.min(pairsOf(g).length, param(g, "pairCount", "pairs")));
  function cardsInPlay(pg, g, n) {
    const cs = g.cards.map((id) => pg.C(id)).filter(Boolean), rows2 = [];
    for (const c of [...cs].sort((a, b) => a.pvy - b.pvy)) {
      const r = rows2.find((x) => Math.abs(x[0].pvy - c.pvy) < 40);
      if (r) r.push(c);
      else rows2.push([c]);
    }
    rows2.forEach((r) => r.sort((a, b) => a.pvx - b.pvx));
    const per = n * 2 / rows2.length;
    if (!Number.isInteger(per) || rows2.some((r) => r.length < per)) return cs.slice(0, n * 2).map((c) => [c, 0]);
    return rows2.flatMap((r) => {
      const s = Math.floor((r.length - per) / 2), use = r.slice(s, s + per);
      const dx = (r[0].pvx + r[r.length - 1].pvx) / 2 - (use[0].pvx + use[use.length - 1].pvx) / 2;
      return use.map((c) => [c, dx]);
    });
  }
  var BACK = null;
  function backTexture() {
    if (BACK) return BACK;
    const c = document.createElement("canvas");
    c.width = 192;
    c.height = 256;
    const g = c.getContext("2d");
    g.fillStyle = "#fff8e8";
    g.beginPath();
    g.roundRect(4, 4, 184, 248, 22);
    g.fill();
    g.fillStyle = "#8f7ad6";
    g.beginPath();
    g.roundRect(16, 16, 160, 224, 16);
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 6;
    for (let k = -256; k < 256; k += 28) {
      g.beginPath();
      g.moveTo(16 + k, 16);
      g.lineTo(176 + k, 240);
      g.stroke();
    }
    g.fillStyle = "#ffe36b";
    g.font = "900 120px sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("?", 96, 136);
    BACK = new THREE8.CanvasTexture(c);
    BACK.colorSpace = THREE8.SRGBColorSpace;
    return BACK;
  }
  function turn(pg, id, tex) {
    pg.spin(id, "y", 1, 0.8, () => {
      pg.C(id).mesh.material.map = tex;
    });
  }
  var pairs = {
    texts: (g) => wordsOf(g.word, ["そろった！", "おなじ！"]).map((x) => said(x, g.color || "#e8756a")),
    init(pg, g) {
      const gs = pg.gs;
      gs.open = [];
      gs.matched = {};
      gs.face = {};
      gs.group = {};
      const all = pairsOf(g), n = pairsInPlay(g), faces = [];
      const P = [...all].sort(() => Math.random() - 0.5).slice(0, n);
      P.forEach((p, k) => p.forEach((id) => faces.push({ tex: pg.C(id) && pg.tex[pg.C(id).m.tex[0]], k })));
      for (let i = faces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [faces[i], faces[j]] = [faces[j], faces[i]];
      }
      gs.total = n;
      g.cards.forEach((id) => pg.C(id) && pg.hide(id));
      cardsInPlay(pg, g, n).forEach(([c, dx], i) => {
        if (!faces[i]) return;
        if (dx) pg.placePiece(c.id, null, [c.pvx + dx, c.pvy]);
        gs.face[c.id] = faces[i].tex;
        gs.group[c.id] = faces[i].k;
        pg.show(c.id);
        c.mesh.material.map = backTexture();
      });
    },
    tap(pg, g, id) {
      const gs = pg.gs;
      if (!g.cards.includes(id) || gs.group[id] === void 0 || pg.gs.done) return false;
      if (gs.matched[id] || gs.open.includes(id) || gs.open.length >= 2) return true;
      gs.open.push(id);
      turn(pg, id, gs.face[id]);
      pg.sfx("pon");
      progressed(pg);
      if (gs.open.length < 2) return true;
      const [a, b] = gs.open;
      if (gs.group[a] === gs.group[b]) {
        pg.later(900, () => {
          gs.matched[a] = gs.matched[b] = true;
          gs.open = [];
          [a, b].forEach((x) => {
            pg.hop(x, 0.04);
            pg.burst(x, 14, 1);
          });
          pg.sfx("kirarin");
          pg.ono(pick2(g.word || ["そろった！", "おなじ！"], nextIdx(pg, "pairs")), pg.top(b, 1.1), g.color || "#e8756a");
          const n = Object.keys(gs.matched).length / 2, total = gs.total;
          pg.progress(n, total);
          if (n >= total) pg.later(900, () => goalDone(pg, g));
        });
      } else {
        pg.later(1300, () => {
          pg.sfx("undo");
          [a, b].forEach((x) => turn(pg, x, backTexture()));
          pg.later(850, () => {
            gs.open = [];
          });
        });
      }
      return true;
    }
  };
  var hold = {
    texts: (g) => [said(g.doneWord || "できた！", g.color || "#e8756a"), ...wordsOf(g.word, ["ぎゅー", "もうすこし！"]).map((x) => said(x, g.color || "#e8756a"))],
    // (the target can be pressed a little around its picture too: small fingers on a small balloon)
    init(pg, g) {
      pg.gs.p = 0;
      pg.gs.holding = false;
      if (pg.C(g.target)) pg.reach(g.target);
    },
    grab(pg, g, id) {
      if (id !== g.target || pg.gs.done || pg.gs.full) return false;
      pg.gs.holding = true;
      progressed(pg);
      if (!pg.labels.gauges.hold) pg.gauge("hold", "bar", g.target, g.gauge || "ぎゅー", "#ff8fb1", 1.12);
      return true;
    },
    release(pg) {
      pg.gs.holding = false;
    },
    update(pg, g, dt) {
      const gs = pg.gs;
      if (gs.done || gs.full || !pg.playing) return;
      const secs = param(g, "seconds", "holdSeconds");
      const was = gs.p;
      gs.p = gs.holding ? Math.min(1, gs.p + dt / secs) : Math.max(0, gs.p - dt / (secs * 2.5));
      if (gs.p === was && !gs.holding) return;
      const c = pg.C(g.target), b = c.body, bs = pg.base(c), p = gs.p, motion = g.motion || "grow";
      if (motion === "grow") {
        const k = 1 + ((g.grow || 1.5) - 1) * easeInOut(p);
        b.scale.set(k, k, 1);
      } else if (motion === "pull") {
        b.position.y = bs.y + 0.06 * p;
        b.rotation.z = gs.holding ? 0.04 * Math.sin(pg.time * 18) * p : 0;
      } else {
        b.position.x = bs.x + (gs.holding ? 4e-3 * p * Math.sin(pg.time * 40) : 0);
      }
      pg.setGauge("hold", p);
      if (gs.holding) {
        progressed(pg);
        if (pg.time - (gs.sndT || 0) > 0.45) {
          gs.sndT = pg.time;
          pg.sfx(g.sound || "powa");
        }
        if (pg.time - (gs.wordT || 0) > 1.2) {
          gs.wordT = pg.time;
          pg.onoAround(pick2(g.word || ["ぎゅー", "もうすこし！"], nextIdx(pg, "hold")), g.target, g.color || "#e8756a");
        }
      }
      if (p >= 1) {
        gs.full = true;
        gs.holding = false;
        pg.removeGauge("hold");
        if (g.swap) pg.swap(g.target, altKey(pg, g.target, g.swap));
        const k0 = b.scale.x, y0 = b.position.y, x0 = b.position.x, r0 = b.rotation.z;
        pg.tween(0.8, (t) => {
          const e = easeInOut(t), bump = 0.06 * Math.sin(Math.PI * t);
          const k = k0 + (1 - k0) * e + bump;
          b.scale.set(k, k, 1);
          b.position.y = y0 + (bs.y - y0) * e;
          b.position.x = x0 + (bs.x - x0) * e;
          b.rotation.z = r0 * (1 - e);
        }, () => {
          b.scale.set(1, 1, 1);
          b.position.set(bs.x, bs.y, bs.z);
          b.rotation.z = 0;
        });
        pg.burst(g.target, 24, 1.3);
        pg.sfx("kirarin");
        pg.ono(g.doneWord || "できた！", pg.top(g.target, 1.15), g.color || "#e8756a");
        pg.later(700, () => goalDone(pg, g));
      }
    },
    tap(pg, g, id) {
      if (id !== g.target || pg.gs.done) return false;
      pg.pulse(id, 1.05, 0.4);
      toldOnce(pg, "toldHold", "ゆびを はなさずに ながく おしてね");
      return true;
    }
  };
  var DOT_R = 0.045;
  var DOT = null;
  function dotTexture() {
    if (DOT) return DOT;
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d"), grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    grd.addColorStop(0, "#ffffff");
    grd.addColorStop(0.35, "#fff3a0");
    grd.addColorStop(1, "rgba(255,230,120,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    DOT = new THREE8.CanvasTexture(c);
    DOT.colorSpace = THREE8.SRGBColorSpace;
    return DOT;
  }
  var pointOf = (pg, p) => typeof p === "string" ? pg.C(p) ? pg.top(p, 0.5) : null : pagePoint(p).setZ(2e-3);
  function pulseDot(pg, m) {
    const s0 = m.userData.size;
    pg.tween(0.8, (t) => m.scale.setScalar(s0 * (1 + 0.6 * Math.sin(Math.PI * t))));
  }
  function segment(pg, a, b, color) {
    const len = near2(a, b), mesh = new THREE8.Mesh(new THREE8.PlaneGeometry(1, 8e-3), new THREE8.MeshBasicMaterial({ color, transparent: true, depthWrite: false }));
    mesh.position.set(a.x, a.y, Math.max(a.z, b.z) + 15e-4);
    mesh.rotation.z = Math.atan2(b.y - a.y, b.x - a.x);
    mesh.renderOrder = 3;
    pg.root.add(mesh);
    pg._extras.push(mesh);
    pg.tween(0.35, (t) => {
      const l = Math.max(1e-3, len * t);
      mesh.scale.x = l;
      mesh.position.set(a.x + (b.x - a.x) * t / 2, a.y + (b.y - a.y) * t / 2, mesh.position.z);
    });
  }
  function traceReach(pg, g, hit) {
    const gs = pg.gs, total = g.points.length + (g.close ? 1 : 0);
    if (!hit || gs.next >= total) return false;
    const i = gs.next % g.points.length, want = gs.pts[i];
    if (!want) return false;
    const onPiece = typeof g.points[i] === "string";
    if (onPiece ? !(hit.id === g.points[i] || hit.point.distanceTo(want) < DOT_R * 1.5) : near2(groundOf(hit), want) > DOT_R) return false;
    if (gs.next > 0) segment(pg, gs.pts[gs.next - 1], want, g.color || "#ffe08a");
    const m = gs.dots[gs.next % g.points.length];
    if (m) {
      m.material.color.set("#ffffff");
      pulseDot(pg, m);
    }
    pg.sfx("note", gs.next % 6);
    progressed(pg);
    gs.next++;
    if (gs.next > 1) pg.progress(gs.next - 1, total - 1);
    if (gs.next >= total) {
      pg.later(500, () => {
        if (g.show && pg.C(g.show)) {
          const b = pg.C(g.show).body;
          pg.show(g.show);
          pg.tween(0.7, (t) => b.scale.setScalar(0.6 + 0.4 * easeOutBack(t)), () => b.scale.setScalar(1));
          pg.later(300, () => pg.burst(g.show, 24, 1.3));
        }
        pg.sfx("kirarin");
        pg.ono(g.word || "できた！", gs.pts[0].clone().add(pg.up.clone().multiplyScalar(0.06)), g.color || "#e8b21f");
        pg.later(900, () => goalDone(pg, g));
      });
    }
    return true;
  }
  var trace = {
    texts: (g) => wordsOf(g.word, "できた！").map((x) => said(x, g.color || "#e8b21f")),
    init(pg, g) {
      const gs = pg.gs;
      gs.next = 0;
      gs.pts = g.points.map((p) => pointOf(pg, p));
      gs.dots = gs.pts.map((p) => {
        if (!p) return null;
        const m = new THREE8.Sprite(new THREE8.SpriteMaterial({ map: dotTexture(), color: "#ffe9a0", transparent: true, depthWrite: false }));
        m.userData.size = 0.035;
        m.scale.setScalar(0.035);
        m.position.copy(p).setZ(p.z + 4e-3);
        m.renderOrder = 4;
        pg.root.add(m);
        pg._extras.push(m);
        return m;
      });
      if (g.show && pg.C(g.show)) {
        pg.hide(g.show);
        pg.C(g.show).flat = true;
      }
    },
    play(pg) {
      const m = pg.gs.dots[0];
      if (m) pulseDot(pg, m);
    },
    grab(pg, g, id, hit) {
      if (pg.gs.done || !hit) return false;
      return traceReach(pg, g, hit) || pg.gs.pts.some((p) => p && near2(groundOf(hit), p) < DOT_R * 1.5);
    },
    rub(pg, g, id, hit) {
      if (!pg.gs.done) traceReach(pg, g, hit);
    },
    tap(pg, g, id, hit) {
      if (pg.gs.done) return false;
      if (traceReach(pg, g, hit)) return true;
      if (id === "plate" || id === null) {
        const m = pg.gs.dots[pg.gs.next % g.points.length];
        if (m) pulseDot(pg, m);
      }
      return false;
    }
  };
  var MORE_GAMES = { carry, copy, pairs, hold, trace };

  // system/engine/goals.js
  var param = (g, key, ageKey = key) => g[key] ?? age()[ageKey];
  var progressed = (pg) => {
    pg.gs.lastMove = pg.time;
  };
  var windowOf = (g, n) => g.seconds ?? Math.round(age().seconds * Math.max(1, n) / 4);
  var noSwap = (spec) => {
    const o = { ...spec };
    delete o.swap;
    return o;
  };
  function goalHint(g) {
    switch (g.type) {
      case "find":
        return `かくれている ものを ${g.items.length}つ さがしてね`;
      case "gather":
        return `${windowOf(g, g.targets.length)}びょうの うちに ぜんぶ タッチしてね`;
      case "mash":
        return g.team ? "みんなを タッチしてから、なんども タッチしてね" : "なんども タッチしてね";
      case "order":
        return "じゅんばんに タッチしてね";
      case "choose":
        return quizOf(g)[0].question || "どれかな？ えらんで タッチしてね";
      case "pop":
        return "でてきたら タッチしてね";
      case "grow":
        return "なんども タッチして そだててね";
      case "dressup":
        return g.answer ? "おてほんと おなじに してね" : "タッチして きせかえしてね";
      case "rub":
        return "ゆびで こすってね";
      case "fall":
        return "おちてくる ものを タッチしてね";
      default:
        return moreHint(g) || "いろいろ さわってみてね";
    }
  }
  function goalProgress(g) {
    const dots = (label, total, colors) => ({ label: g.label || label, total, colors });
    switch (g.type) {
      case "find":
        return dots("みつけた", g.items.length);
      case "choose":
        return quizTotal(g) > 1 ? dots("せいかい", quizTotal(g)) : null;
      case "gather":
        return dots("タッチ", g.targets.length, g.targets.map((t) => isCast(t) ? markColor(t) : "#ffe36b"));
      case "mash":
        return g.team ? dots("みんな", g.team.length, g.team.map((t) => isCast(t) ? markColor(t) : "#ffe36b")) : null;
      case "order":
        return dots("じゅんばん", g.targets.length);
      case "pop":
        return dots("タッチ", param(g, "times", "popTimes"));
      case "grow":
        return dots("そだつ", (g.stages || []).length);
      case "dressup":
        return dots("きせかえ", Object.keys(g.answer || g.looks || {}).length);
      case "rub":
        return dots("きれい", g.targets.length);
      case "fall":
        return dots("キャッチ", param(g, "times", "popTimes"));
      default:
        return moreProgress(g, dots);
    }
  }
  function hintTargets(pg, g) {
    const gs = pg.gs;
    switch (g.type) {
      case "find":
        return g.items.filter((it) => !gs.found[findKey(it)] && !waitsForMain(pg, it) && !(gs.place && gs.place[findKey(it)] && gs.place[findKey(it)].part)).map((it) => gs.place && gs.place[findKey(it)] ? gs.place[findKey(it)].spot : it.spot);
      case "gather":
        return g.targets.filter((t) => !gs.ready[t]);
      case "mash": {
        const wait = (g.team || []).filter((t) => !gs.ready[t]);
        return wait.length ? wait : [g.target];
      }
      case "grow":
        return [g.target];
      case "order":
        return [g.targets[gs.next]];
      case "choose": {
        const q = quizOf(g)[gs.q || 0] || g;
        return (q.options || []).filter((o) => !(gs.got && gs.got[o]));
      }
      case "pop":
        return Object.keys(gs.up);
      case "dressup":
        return Object.keys(g.looks || {}).filter((id) => !lookMatches(pg, g, id));
      case "rub":
        return g.targets.filter((t) => !gs.cleared[t]);
      case "fall":
        return Object.keys(gs.up);
      default:
        return moreHintTargets(pg, g);
    }
  }
  function showHint(pg, g) {
    if (g.type === "find") {
      for (const it of g.items) {
        const pl = pg.gs.place[findKey(it)];
        if (pg.gs.found[findKey(it)] || !pl || !pl.part || waitsForMain(pg, it)) continue;
        if (!CALM.on) pg.burst(pg.pointOn(pl.spot, pl.center[0], pl.center[1], 0.02), 12, 0.8, ["#fff2a8", "#ffffff"]);
        pg.hop(it.item, 0.03);
      }
    }
    const ids = hintTargets(pg, g).filter((id) => id && pg.C(id) && pg.C(id).body.visible);
    if (!ids.length) return;
    if (g.type === "choose") ask(pg, quizOf(g)[pg.gs.q || 0] || g);
    ids.forEach((id, i) => pg.later(i * 160, () => {
      pg.pulse(id, 1.1, 0.6);
      if (!CALM.on) pg.burst(id, 8, 0.7, ["#fff2a8", "#ffffff"]);
    }));
    pg.sfx("twinkle");
  }
  var skyPoint = (pg, x, h) => new THREE9.Vector3(x, 0.1, 0.01).add(pg.up.clone().multiplyScalar(h));
  function finale(pg) {
    const ids = castIds().filter((id) => pg.C(id));
    const cols = [...ids.map(fireworkColor), "#ffe9a0", "#ffffff"];
    const kinds = ["peony", "ring", "peony", "willow", "ring", "peony"];
    const shots = CALM.on ? 6 : 14;
    for (let i = 0; i < shots; i++) {
      pg.later(700 + i * (CALM.on ? 600 : 300) + Math.random() * 120, () => {
        const x = (i % 2 ? 1 : -1) * (0.08 + Math.random() * 0.32), h = 0.17 + Math.random() * 0.17;
        const c = cols[i % cols.length], c2 = cols[(i + 3) % cols.length];
        pg.firework(
          skyPoint(pg, x, h),
          c,
          c2,
          kinds[i % kinds.length],
          new THREE9.Vector3(x * 0.8, -0.1, 0.01),
          i % 3 === 0 ? () => pg.ono(["ドーン！", "パーン！", "ドドーン！"][i / 3 % 3], skyPoint(pg, x, h + 0.07), c) : null
        );
      });
    }
    if (!CALM.on) {
      pg.tween(6.5, () => {
        for (let k = 0; k < 2; k++) {
          const p = skyPoint(pg, -0.5 + Math.random(), 0.32 + Math.random() * 0.14);
          pg.fx.emit(p, { x: (Math.random() - 0.5) * 0.02, y: -pg.up.y * 0.03, z: -pg.up.z * 0.03 }, Math.random() < 0.6 ? "#ffe9a0" : "#ffffff", 0.016 + Math.random() * 0.012, 2.4, 0.99, -0.03, 1);
        }
      });
    }
    ids.forEach((id, i) => pg.later(500 + i * 220, () => pg.burst(id, 20, 1.2, ["#fff2a8", "#ffffff", fireworkColor(id)])));
    pg.later(CALM.on ? 4800 : 5200, () => {
      pg.firework(skyPoint(pg, 0, 0.3), "#ffd84a", "#fff6c8", "willow", new THREE9.Vector3(0, -0.12, 0.01), () => {
        pg.ono("ドドーン！", skyPoint(pg, 0, 0.4), "#ffd84a");
        pg.sfx("finale");
        ids.forEach((id, i) => pg.later(i * 120, () => {
          pg.hop(id, 0.07);
          pg.burst(id, 16, 1.3, ["#fff2a8", "#ffffff", "#ffc2e2"]);
        }));
      });
    });
  }
  var DONE_TOAST = {
    choose: "せいかい！",
    pop: "ぜんぶ つかまえたね！",
    fall: "ぜんぶ キャッチしたね！",
    grow: "おおきく なったね！",
    rub: "ぴかぴかに なったね！",
    carry: "ぜんぶ はこんだね！",
    copy: "よく おぼえたね！",
    pairs: "ぜんぶ そろったね！",
    trace: "できあがり！"
  };
  function goalDone(pg, g) {
    if (pg.gs.done) return;
    pg.gs.done = true;
    pg.complete();
    let d = g.done || {};
    if ((d.if || d.need) && !holds(d)) d = d.else || {};
    pg.later(400, () => {
      pg.sfx(d.sound || "fanfare");
      if (d.toast !== "") pg.toast(d.toast || (g.type === "choose" && !g.answer ? "これに きめた！" : DONE_TOAST[g.type]) || "できたね！ すごい！", 3e3);
      if (d.get) [].concat(d.get).forEach((it, i) => pg.later(1200 + i * 500, () => pg.getItem(it)));
      const cast = castIds().filter((id) => pg.C(id));
      const face = d.face === void 0 ? "happy" : d.face;
      if (face) cast.forEach((id) => {
        const k = `${id}@${face}`;
        if (pg.tex[k]) {
          clearTimeout(pg.C(id)._backT);
          pg.swap(id, k);
        }
      });
      if (d.hop !== false) cast.filter((id) => !(d.move && d.move[id])).forEach((id, i) => pg.later(i * 130, () => pg.hop(id, 0.05)));
      Object.entries(d.move || {}).forEach(([id, mv], i) => pg.C(id) && moveOf(pg, mv) && pg.later(i * 150, () => moveOf(pg, mv)(pg, id)));
      const tr2 = Array.isArray(d.trail) ? { points: d.trail } : d.trail;
      const trailPts = tr2 && Array.isArray(tr2.points) && tr2.points.length >= 2 ? tr2.points.map(([x, y]) => [x / 1600 - 0.5, 0.375 - y / 1600]) : null;
      if (trailPts) pg.later(300, () => pg.trail(trailPts, tr2.color || "#ffe08a", 40));
      Object.entries(d.walk || {}).forEach(([id, w], i) => canTravel(pg, id) && pg.later(i * 200, () => walk(pg, id, Array.isArray(w) ? w : w.points, { flip: !!w.flip })));
      [].concat(d.light || []).forEach((id, i) => pg.C(id) && pg.later(300 + i * 250, () => light(pg, id, true)));
      if (typeof d.dark === "number") darken(pg, d.dark, 2);
      const says = Array.isArray(d.say) ? d.say : d.say ? [d.say] : [];
      const speakers = new Set(says.map((s) => s && s.who));
      if (d.mark) Object.entries(typeof d.mark === "string" ? Object.fromEntries(cast.map((id) => [id, d.mark])) : d.mark).filter(([id]) => !speakers.has(id)).forEach(([id, k], i) => pg.later(200 + i * 150, () => pg.mark(id, k)));
      const keep = d.keep !== false;
      if (keep) {
        startLasting(pg, d.effect, trailPts);
        if (trailPts) pg._lasting.color = tr2.color || "#ffe08a";
      }
      if (MOODS[d.effect]) MOODS[d.effect](pg, keep);
      else if (d.effect === "finale") finale(pg);
      else if (d.effect === "none") {
      } else if (d.effect === "fireworks") {
        for (let k = 0; k < (CALM.on ? 3 : 6); k++) pg.later(200 + k * 320, () => {
          const x = -0.35 + Math.random() * 0.7, p = new THREE9.Vector3(x, 0.05, 0.01).add(pg.up.clone().multiplyScalar(0.3 + Math.random() * 0.08));
          const ids = cast.length ? cast : ["_"];
          pg.firework(p, fireworkColor(ids[k % ids.length]), "#ffffff", k % 2 ? "ring" : "peony", new THREE9.Vector3(x, -0.08, 0.01));
        });
      } else {
        for (let k = 0; k < 5; k++) pg.later(k * 160, () => pg.fx.burst(new THREE9.Vector3(-0.36 + k * 0.18, -0.02 + Math.random() * 0.2, 0.04), 16, 1.2));
      }
      says.forEach((s, k) => pg.later(700 + k * 1700, () => pg.C(s.who) && pg.say(s.who, s.text)));
    });
  }
  function ask(pg, g) {
    if (!g.question) return;
    if (g.who && pg.C(g.who)) pg.say(g.who, g.question);
    else pg.toast(g.question, 2600);
  }
  function lookOf(pg, g, id) {
    const list = ["", ...g.looks[id] || []];
    return list[pg.gs.look[id] || 0];
  }
  function lookMatches(pg, g, id) {
    if (!g.answer || !(id in g.answer)) return true;
    const want = g.answer[id] === "base" ? "" : g.answer[id];
    return lookOf(pg, g, id) === want;
  }
  function rubClear(pg, g, id) {
    pg.gs.cleared[id] = true;
    pg.removeGauge(`r_${id}`);
    pg.sfx(g.doneSound || "kirarin");
    pg.ono(g.doneWord || "ぴかぴか！", id, g.color || "#3fa9e0");
    if (g.swap && pg.tex[`${id}@${g.swap}`]) {
      pg.swap(id, `${id}@${g.swap}`);
      pg.burst(id, 18, 1.1);
    } else {
      const b = pg.C(id).body;
      pg.puff(pg.top(id, 0.5), 18, "#ffffff", 0.02, 0.14, 0.03);
      pg.tween(0.5, (t) => b.scale.setScalar(1 - t), () => {
        pg.hide(id);
        b.scale.setScalar(1);
      });
    }
    const n = Object.keys(pg.gs.cleared).length;
    pg.progress(n, g.targets.length);
    progressed(pg);
    if (n === g.targets.length) pg.later(900, () => goalDone(pg, g));
  }
  function rubAdd(pg, g, id, amount, hit) {
    if (pg.gs.cleared[id]) return;
    pg.gs.rubbed[id] = Math.min(1, (pg.gs.rubbed[id] || 0) + amount);
    if (!pg.labels.gauges[`r_${id}`]) pg.gauge(`r_${id}`, "bar", id, g.gauge || "ぴかぴか", "#3fa9e0", 1.05);
    pg.setGauge(`r_${id}`, pg.gs.rubbed[id]);
    const t = pg.time;
    if (t - (pg.gs.fxT || 0) > 0.12) {
      pg.gs.fxT = t;
      pg.puff(hit ? hit.point : pg.top(id, 0.5), CALM.on ? 2 : 4, g.particle || "#e8f8ff", 0.012, 0.08, 0.02);
    }
    if (t - (pg.gs.sndT || 0) > 0.3) {
      pg.gs.sndT = t;
      pg.sfx(g.sound || "kyu");
    }
    if (t - (pg.gs.wordT || 0) > 1) {
      pg.gs.wordT = t;
      pg.ono(pick2(g.word || ["ゴシゴシ", "キュッキュッ"], nextIdx(pg, "rub")), hit ? hit.point : id, g.color || "#3fa9e0");
    }
    if (pg.gs.rubbed[id] >= 1) rubClear(pg, g, id);
  }
  var POP_STYLE = {
    rise: {
      inT: 0.5,
      come(pg, id, L) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        pg.show(id);
        pg.tween(0.5, (t) => {
          b.position.y = bs.y + L - (c.h + L) * (1 - easeInOut(t));
        });
      },
      stay(pg, id, e, L) {
        const c = pg.C(id);
        c.body.position.y = pg.base(c).y + L;
      },
      go(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c), y0 = b.position.y;
        pg.tween(0.35, (t) => {
          b.position.y = y0 - (y0 - bs.y + c.h) * t * t;
        }, () => {
          pg.hide(id);
          b.position.y = bs.y;
        });
      }
    },
    swim: {
      inT: 0.9,
      come(pg, id, L) {
        const c = pg.C(id), b = c.body, bs = pg.base(c), k = Math.random() < 0.5 ? -1 : 1;
        c.popDir = k;
        pg.show(id);
        pg.tween(0.9, (t) => {
          const e = easeInOut(t);
          b.position.x = bs.x + k * 0.07 * (1 - e);
          b.position.y = bs.y + L - (c.h + L) * (1 - e);
          b.rotation.z = k * 0.25 * (1 - e);
        });
      },
      stay(pg, id, e, L) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        b.position.y = bs.y + L + 6e-3 * Math.sin(e * 3);
        b.rotation.z = 0.08 * Math.sin(e * 2.2);
      },
      go(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c), k = -(c.popDir || 1), y0 = b.position.y;
        pg.tween(
          0.7,
          (t) => {
            const e = easeInOut(t);
            b.position.x = bs.x + k * 0.06 * e;
            b.position.y = y0 - (y0 - bs.y + c.h) * e;
            b.rotation.z = -k * 0.3 * e;
          },
          () => {
            pg.hide(id);
            b.position.set(bs.x, bs.y, bs.z);
            b.rotation.z = 0;
          }
        );
      }
    },
    fly: {
      inT: 1.1,
      come(pg, id, L) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        pg.show(id);
        pg.tween(1.1, (t) => {
          const e = easeInOut(t);
          b.position.y = bs.y + L - (c.h * 1.2 + L) * (1 - e);
          b.position.x = bs.x + 0.02 * Math.sin(Math.PI * 2 * t) * (1 - t);
        });
        c.glowFlash = pg.time;
      },
      stay(pg, id, e, L) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        b.position.x = bs.x + 0.018 * Math.sin(e * 1.6);
        b.position.y = bs.y + L + 0.012 * Math.sin(e * 3.2);
      },
      go(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c), x0 = b.position.x, y0 = b.position.y;
        pg.tween(
          1,
          (t) => {
            const e = easeInOut(t);
            b.position.x = x0 + (bs.x - x0) * e;
            b.position.y = y0 + (bs.y - c.h * 1.2 - y0) * e;
          },
          () => {
            pg.hide(id);
            b.position.set(bs.x, bs.y, bs.z);
          }
        );
      }
    },
    fall: {
      inT: 0,
      come(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        pg.show(id);
        b.position.y = bs.y + FALL_H;
        c.fallT = 0;
      },
      stay() {
      },
      go(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        pg.tween(0.7, (t) => {
          b.position.y = bs.y + 0.02 * Math.sin(Math.PI * t);
          b.scale.setScalar(Math.max(1e-3, 1 - easeInOut(t)));
        }, () => {
          pg.hide(id);
          b.position.y = bs.y;
          b.scale.setScalar(1);
        });
      }
    }
  };
  var FALL_H = 0.3;
  function liftOf(pg, g, id) {
    const c = pg.C(id);
    if (c.popLift !== void 0) return c.popLift;
    let L = typeof g.lift === "number" ? g.lift * c.h : g.style === "fly" ? 0.02 : 0;
    if (typeof g.lift !== "number") for (const k of [].concat(g.behind || [])) {
      const f = pg.C(k);
      if (!f) continue;
      const overlap2 = Math.min(c.m.x + c.m.w, f.m.x + f.m.w) - Math.max(c.m.x, f.m.x);
      if (overlap2 > 0 && f.m.y + f.m.h > c.m.y + c.m.h) L = Math.max(L, f.h * 0.85);
    }
    return c.popLift = L;
  }
  var popStyle = (g) => POP_STYLE[g.type === "fall" ? "fall" : g.style] || POP_STYLE.rise;
  var popTimes = (g) => param(g, "times", "popTimes");
  var GRACE = 0.5;
  var catchable = (pg) => [...Object.keys(pg.gs.up), ...Object.keys(pg.gs.leaving).filter((id) => pg.time - pg.gs.leaving[id] < GRACE)];
  function nearTarget(pg, g, hit) {
    if (!hit) return null;
    let best = null, bd = reach(pg);
    for (const id of catchable(pg)) {
      const d = pg.top(id, 0.5).distanceTo(hit.point);
      if (d < bd) {
        bd = d;
        best = id;
      }
    }
    return best;
  }
  function boxSlot(pg, box, size) {
    const used = pg.gs.slots, minD = Math.max(size * 1.4, box.w * 0.2);
    let best = null, bestD = -1;
    for (let k = 0; k < 24; k++) {
      const p = new THREE9.Vector3((Math.random() - 0.5) * box.w * 0.56, box.h * (0.12 + Math.random() * 0.5), 0);
      const d = used.length ? Math.min(...used.map((q) => Math.hypot(q.x - p.x, q.y - p.y))) : 1;
      if (d >= minD) {
        best = p;
        break;
      }
      if (d > bestD) {
        bestD = d;
        best = p;
      }
    }
    used.push(best);
    return best.clone();
  }
  function intoBox(pg, g, id) {
    const box = pg.C(g.into), c = pg.C(id);
    if (!box || !c) return;
    const n = pg.gs.inside.length;
    if (n >= 14) return;
    const mesh = new THREE9.Mesh(c.mesh.geometry, cardMaterial(c.mesh.material.map));
    const k = Math.min(0.55, box.w * 0.32 / c.w);
    mesh.renderOrder = 2;
    const slot = boxSlot(pg, box, c.w * k);
    slot.z = 12e-4 + n * 1e-4;
    if (box.m.pivot === "top") slot.y -= box.h;
    const glow = c.m.glow ? new THREE9.Mesh(new THREE9.PlaneGeometry(c.w * 1.6, c.w * 1.6), new THREE9.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE9.AdditiveBlending })) : null;
    const from = pg.top(id, 0.5);
    pg.root.add(mesh);
    pg._extras.push(mesh);
    pg.tween(0.8, (t) => {
      const to = box.body.localToWorld(slot.clone());
      pg.root.worldToLocal(to);
      const e = easeInOut(t), p = from.clone().lerp(to, e).add(pg.up.clone().multiplyScalar(0.08 * Math.sin(Math.PI * t)));
      const s = 1 + (k - 1) * e;
      mesh.scale.set(s, s, 1);
      mesh.position.copy(p);
      mesh.quaternion.copy(box.body.getWorldQuaternion(new THREE9.Quaternion()));
      const pq = pg.root.getWorldQuaternion(new THREE9.Quaternion()).invert();
      mesh.quaternion.premultiply(pq);
    }, () => {
      pg.root.remove(mesh);
      mesh.position.copy(slot);
      mesh.quaternion.identity();
      mesh.scale.set(k, k, 1);
      mesh.userData.caught = true;
      box.body.add(mesh);
      if (glow) {
        glow.position.set(slot.x, slot.y + c.h * k * 0.4, slot.z - 4e-4);
        glow.userData.caught = true;
        glow.userData.born = pg.time;
        glow.material.opacity = 0;
        box.body.add(glow);
        pg.gs.glows.push(glow);
      }
      pg.gs.inside.push(mesh);
      pg.pulse(g.into, 1.06, 0.5);
      pg.sfx("po");
      if (c.m.glow || g.intoLight) {
        light(pg, g.into, true);
        pg.later(600, () => {
          if (box.lamp) box.lamp.material.opacity = Math.min(1, 0.3 + 0.1 * pg.gs.inside.length);
        });
      }
    });
  }
  function popGame(type) {
    return {
      texts: (g) => wordsOf(g.word, ["ポン！", "タッチ！"]).map((x) => said(x, g.color || "#e8756a")),
      init(pg, g) {
        pg.gs.up = {};
        pg.gs.leaving = {};
        pg.gs.caught = 0;
        pg.gs.nextAt = 0;
        pg.gs.inside = [];
        pg.gs.glows = [];
        pg.gs.slots = [];
        g.targets.forEach((t) => pg.C(t) && pg.hide(t));
        const box = g.into && pg.C(g.into);
        if (box) box.body.children.filter((o) => o.userData.caught).forEach((o) => box.body.remove(o));
      },
      play(pg, g) {
        pg.gs.nextAt = pg.time + 0.8 + toolStart(pg, g);
      },
      open(pg, g) {
        if (pg.playing && hasTool(g) && !pg.gs.tool) pg.gs.nextAt = Math.max(pg.gs.nextAt, pg.time + toolStart(pg, g));
      },
      update(pg, g, dt) {
        for (const g2 of pg.gs.glows) g2.material.opacity = Math.min(1, (pg.time - g2.userData.born) / 0.6) * (0.55 + 0.35 * Math.sin(pg.time * 3 + g2.id));
        if (pg.gs.done || pg.gs.finishing || !pg.playing || !pg.open) return;
        const S3 = popStyle(g), stay = param(g, "stay");
        for (const [id2, t0] of Object.entries(pg.gs.up)) {
          const e = pg.time - t0;
          if (type === "fall") {
            const c = pg.C(id2), b = c.body, bs = pg.base(c), fallT = stay * 2;
            b.position.y = bs.y + FALL_H * Math.max(0, 1 - e / fallT);
            b.rotation.z = 0.15 * Math.sin(e * 2.5);
            if (e >= fallT) {
              delete pg.gs.up[id2];
              pg.gs.leaving[id2] = pg.time;
              b.rotation.z = 0;
              S3.go(pg, id2);
              pg.sfx("po");
            }
            continue;
          }
          if (e > S3.inT) S3.stay(pg, id2, e - S3.inT, liftOf(pg, g, id2));
          if (e > S3.inT + stay) {
            delete pg.gs.up[id2];
            pg.gs.leaving[id2] = pg.time;
            S3.go(pg, id2);
          }
        }
        if (pg.time < pg.gs.nextAt || Object.keys(pg.gs.up).length >= (g.together || 1)) return;
        const free = g.targets.filter((t) => pg.C(t) && !pg.gs.up[t] && !pg.C(t).body.visible);
        for (const t of free) delete pg.gs.leaving[t];
        if (!free.length) return;
        const id = free[Math.floor(Math.random() * free.length)];
        pg.gs.up[id] = pg.time;
        S3.come(pg, id, type === "fall" ? 0 : liftOf(pg, g, id));
        pg.sfx(g.upSound || (type === "fall" ? "sui" : "pyoko"));
        pg.gs.nextAt = pg.time + S3.inT + stay * 0.6 + 0.4;
      },
      tap(pg, g, id, hit) {
        const mine = g.targets.includes(id) || [].concat(g.behind || []).includes(id) || id === "plate" || id === g.into;
        if (pg.gs.done) return false;
        if (pg.gs.finishing) return g.targets.includes(id);
        const t = g.targets.includes(id) && catchable(pg).includes(id) ? id : nearTarget(pg, g, hit);
        if (!t) {
          if (mine && hasTool(g)) {
            toolSwing(pg, g, hit && hit.point);
            return true;
          }
          return g.targets.includes(id);
        }
        const at = pg.top(t, 0.5);
        delete pg.gs.up[t];
        delete pg.gs.leaving[t];
        pg.gs.caught++;
        progressed(pg);
        toolSwing(pg, g, at);
        const r = g.react && g.react[t];
        if (r) react(pg, t, r, null, { free: true });
        else pg.sfx(g.sound || "pon");
        pg.ono(pick2(g.word || ["ポン！", "タッチ！"], nextIdx(pg, "pop")), pg.top(t, 1), g.color || "#e8756a");
        const c = pg.C(t), b = c.body, bs = pg.base(c);
        if (g.into && pg.C(g.into)) {
          pg.burst(t, 10, 0.8, ["#fff2a8", "#ffffff"]);
          intoBox(pg, g, t);
          pg.later(120, () => {
            pg.hide(t);
            b.position.set(bs.x, bs.y, bs.z);
            b.rotation.z = 0;
            b.scale.setScalar(1);
          });
        } else if (type === "fall") {
          pg.burst(t, 14, 1);
          pg.tween(0.4, (k) => b.scale.setScalar(1 - k), () => {
            pg.hide(t);
            b.position.set(bs.x, bs.y, bs.z);
            b.rotation.z = 0;
            b.scale.setScalar(1);
          });
        } else {
          pg.burst(t, 14, 1);
          pg.later(250, () => {
            b.rotation.z = 0;
            POP_STYLE.rise.go(pg, t);
          });
        }
        if (g.count) setCount(g.count, pg.gs.caught);
        const times = popTimes(g);
        pg.progress(Math.min(pg.gs.caught, times), times);
        if (pg.gs.caught >= times) {
          pg.gs.finishing = true;
          pg.later(900, () => {
            if (!g.into) g.targets.forEach((x, i) => pg.C(x) && pg.later(i * 120, () => (type === "fall" ? POP_STYLE.rise : popStyle(g)).come(pg, x, type === "fall" ? 0 : liftOf(pg, g, x))));
            goalDone(pg, g);
          });
        }
        return true;
      }
    };
  }
  var findKey = (it) => it.item || it.spot;
  var AREA_MORE = 0.2;
  var waitsForMain = (pg, it) => !!(pg.gs.mainId && it.item !== pg.gs.mainId && !pg.gs.found[pg.gs.mainId]);
  function comeOutMode(pg, it, spotId, feetY) {
    if (it.comeOut === "front" || it.comeOut === "here") return it.comeOut;
    const c = pg.C(it.item), s = pg.C(spotId);
    if (!c || !s || c.m.glow || ["fly", "float"].includes(c.m.idle) || c.m.pivot && c.m.pivot !== "bottom") return "here";
    if (s.m.pivot && s.m.pivot !== "bottom" || s.m.flat || s.pvy < 600) return "here";
    return (feetY ?? c.pvy) >= s.pvy - 60 ? "front" : "here";
  }
  function hideAt(pg, it, pl) {
    const s = pg.C(pl.spot), c = pg.C(it.item);
    if (!s || !c) return;
    const [x, y] = pl.at || [s.pvx, s.pvy];
    if (comeOutMode(pg, it, pl.spot, y) === "front") pg.placePiece(it.item, null, [x, Math.min(y, s.pvy - 14)]);
    else pg.placePiece(it.item, pl.spot, [x, y], { behind: true });
    pg.hide(it.item);
    const flip = (id) => {
      const k = pg.C(id);
      k.flipX = pl.flip ? -1 : 1;
      k.still.scale.x = k.flipX * Math.abs(k.still.scale.x);
    };
    flip(it.item);
    if (it.clue && pg.C(it.clue)) {
      pg.placePiece(it.clue, pl.spot, pl.peek || [x, y], { behind: true });
      pg.hide(it.clue);
      flip(it.clue);
    }
  }
  var PEEK = 0.18;
  function splitOf(pg, it, spotId) {
    if (it.split !== void 0) return [4, 9].includes(it.split) ? it.split : 1;
    const s = pg.C(spotId), c = pg.C(it.item);
    if (!s || !c) return 1;
    const [x0, y0, x1, y1] = pg.seenBox(s), [a0, b0, a1, b1] = pg.seenBox(c);
    const r = Math.min((x1 - x0) / Math.max(1, a1 - a0), (y1 - y0) / Math.max(1, b1 - b0));
    return r >= 2 ? 9 : r >= 1.4 ? 4 : 1;
  }
  var median = (a) => {
    const b = a.filter((v) => v !== null).sort((p, q) => p - q);
    return b.length ? b[b.length >> 1] : null;
  };
  function topEdge(pg, id, x0, x1, ya, yb) {
    const col = (x) => {
      for (let y = ya; y < yb; y += 3) if (pg.solidAt(id, x, y)) return y;
      return null;
    };
    const out = [];
    for (let x = x0; x <= x1; x += Math.max(2, (x1 - x0) / 12)) out.push(col(x));
    return median(out);
  }
  function sideEdge(pg, id, k, y0, y1, xa, xb) {
    const row = (y) => {
      if (k < 0) {
        for (let x = xa; x < xb; x += 3) if (pg.solidAt(id, x, y)) return x;
      } else {
        for (let x = xb; x > xa; x -= 3) if (pg.solidAt(id, x, y)) return x;
      }
      return null;
    };
    const out = [];
    for (let y = y0; y <= y1; y += Math.max(2, (y1 - y0) / 12)) out.push(row(y));
    return median(out);
  }
  function hidingParts(pg, it, spotId, n) {
    const s = pg.C(spotId), c = pg.C(it.item), [sx0, sy0, sx1, sy1] = pg.seenBox(s), [a0, b0, a1, b1] = pg.seenBox(c);
    const X02 = s.m.x + sx0, Y02 = s.m.y + sy0, X12 = s.m.x + sx1, Y12 = s.m.y + sy1, k = n === 9 ? 3 : 2;
    const cw = (X12 - X02) / k, ch = (Y12 - Y02) / k, W2 = a1 - a0, H2 = b1 - b0, foot = s.pvy;
    const front = inFront2(pg, spotId, it.item), out = [];
    for (let r = 0; r < k; r++) for (let q = 0; q < k; q++) {
      if (k === 3 && q === 1 && r >= 1) continue;
      const area = [X02 + q * cw, Y02 + r * ch, X02 + (q + 1) * cw, Y02 + (r + 1) * ch];
      let fx, fy, dx = 0, dy = 0;
      if (r === 0) {
        const cx = Math.max(X02 + W2 / 2, Math.min(X12 - W2 / 2, (area[0] + area[2]) / 2));
        const edge = topEdge(pg, spotId, cx - W2 / 4, cx + W2 / 4, Y02, Y12) ?? Y02;
        fx = cx + (c.m.w / 2 - (a0 + a1) / 2);
        fy = edge - PEEK * H2 + c.m.h - b0;
        dy = H2 * 0.04;
      } else {
        const side = q === 0 ? -1 : 1;
        const cy = r === k - 1 ? foot - H2 / 2 : (area[1] + area[3]) / 2;
        const edge = sideEdge(pg, spotId, side, cy - H2 / 4, cy + H2 / 4, X02, X12) ?? (side < 0 ? X02 : X12);
        fx = side < 0 ? edge - PEEK * W2 - a0 + c.m.w / 2 : edge + PEEK * W2 + c.m.w / 2 - a1;
        fy = Math.min(foot - 4, cy + c.m.h - (b0 + b1) / 2);
        dx = -side * W2 * 0.04;
      }
      let share = shownShare(pg, it.item, fx, fy, spotId, front);
      for (let t = 0; t < 14 && share > 0.24; t++) {
        fx += dx;
        fy = Math.min(foot - 4, fy + dy);
        share = shownShare(pg, it.item, fx, fy, spotId, front);
      }
      for (let t = 0; t < 14 && share < 0.07; t++) {
        fx -= dx;
        fy -= dy;
        share = shownShare(pg, it.item, fx, fy, spotId, front);
      }
      if (share < 0.04 || share > 0.3) continue;
      let n2 = 0, sx = 0, sy = 0;
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
        const x = area[0] + (area[2] - area[0]) * (i + 0.5) / 8, y = area[1] + (area[3] - area[1]) * (j + 0.5) / 8;
        if (pg.solidAt(spotId, x, y) && !hides(pg, front, x, y)) {
          n2++;
          sx += x;
          sy += y;
        }
      }
      if (n2 < 10) continue;
      out.push({ spot: spotId, area, at: [fx, fy], part: { r, q, k }, peeks: true, center: [sx / n2, sy / n2], peekAt: peekOf(pg, it.item, fx, fy, spotId, front).at });
    }
    return out;
  }
  function inFront2(pg, spotId, itemId) {
    const s = pg.C(spotId), y = (o) => o.m.parent && pg.C(o.m.parent) ? pg.C(o.m.parent).pvy : o.pvy;
    return Object.values(pg.cards).filter((o) => o.id !== spotId && o.id !== itemId && o.body.visible && !o.flat && !o.m.flat && (o.m.parent === spotId ? !o.m.behind : y(o) > s.pvy + 2)).map((o) => ({ id: o.id, up: o.m.parent === spotId ? 0 : (y(o) - s.pvy) * 0.8, box: [o.m.x, o.m.y, o.m.x + o.m.w, o.m.y + o.m.h] }));
  }
  var hides = (pg, front, x, y) => front.some((f) => f.up ? x > f.box[0] && x < f.box[2] && y > f.box[1] - f.up && y < f.box[3] : pg.solidAt(f.id, x, y));
  function peekOf(pg, itemId, fx, fy, spotId, front) {
    const c = pg.C(itemId), a = pg.alpha[c.mesh.userData.tex];
    if (!a) return { share: 0, at: null };
    const x0 = fx - c.m.w / 2, y0 = fy - c.m.h;
    let on = 0, seen = 0, sx = 0, sy = 0;
    for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) {
      const u = (i + 0.5) / 16, v = (j + 0.5) / 16;
      if (a.data[Math.floor(v * a.h) * a.w + Math.floor(u * a.w)] <= 60) continue;
      on++;
      const px2 = x0 + u * c.m.w, py = y0 + v * c.m.h;
      if (!pg.solidAt(spotId, px2, py) && !hides(pg, front, px2, py)) {
        seen++;
        sx += px2;
        sy += py;
      }
    }
    return { share: on ? seen / on : 0, at: seen ? [sx / seen, sy / seen] : null };
  }
  var shownShare = (pg, itemId, fx, fy, spotId, front) => peekOf(pg, itemId, fx, fy, spotId, front).share;
  var overlap = (a, b) => {
    const w = Math.min(a[2], b[2]) - Math.max(a[0], b[0]), h = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
    return w > 0 && h > 0 ? w * h / Math.min((a[2] - a[0]) * (a[3] - a[1]), (b[2] - b[0]) * (b[3] - b[1])) : 0;
  };
  var isCharacter = (pg, id) => {
    const c = pg.C(id);
    return !!c && (isCast(id) || !!c.m.faces || c.m.tex.some((t) => /@(blink|talk)$/.test(t)));
  };
  function partOut(pg, it, spotId, part) {
    if (it.comeOut === "front" || it.comeOut === "here") return it.comeOut;
    const c = pg.C(it.item), s = pg.C(spotId);
    if (comeOutMode(pg, it, spotId, s.pvy) === "here" || !isCharacter(pg, it.item)) return "here";
    if (pg.seenSize(c).h >= pg.seenSize(s).h * 0.45) return "front";
    return part.r === 0 ? "here" : "front";
  }
  function hideInPart(pg, it, pl) {
    const c = pg.C(it.item);
    pg.placePiece(it.item, pl.spot, pl.at, { behind: true });
    pg.hide(it.item);
    c.stillNow = true;
    c.still.position.set(0, 0, 0);
    pg.reach(it.item, NEAR);
  }
  var SEEN = 0.7;
  var NEAR = 40;
  function boxAt(pg, c, fx, fy) {
    const [a0, b0, a1, b1] = pg.seenBox(c), x0 = fx - c.m.w / 2, y0 = c.m.pivot === "top" ? fy : fy - c.m.h;
    return [x0 + a0, y0 + b0, x0 + a1, y0 + b1];
  }
  function keepClear(pg, g, itemId) {
    const out = [], stand = pg.gs.stand || {}, me = boxAt(pg, pg.C(itemId), 0, 0), big = 4 * (me[2] - me[0]) * (me[3] - me[1]);
    for (const o of Object.values(pg.cards)) {
      if (o.id === itemId) continue;
      const pl = pg.gs.place && pg.gs.place[o.id];
      if (pl && pl.peeks && !pg.gs.found[o.id]) {
        if (pl.peekAt && o.body.visible) out.push([pl.peekAt[0] - 24, pl.peekAt[1] - 24, pl.peekAt[0] + 24, pl.peekAt[1] + 24]);
        continue;
      }
      const b = stand[o.id] || (o.body.visible && isCharacter(pg, o.id) ? boxAt(pg, o, o.pvx, o.pvy) : null);
      if (b && (stand[o.id] || (b[2] - b[0]) * (b[3] - b[1]) <= big)) out.push(b);
    }
    return out;
  }
  var clash = (box, others) => others.some((o) => overlap(box, o) > 0.12);
  function frontOfGround(pg, fy, skip) {
    const y = (o) => o.m.parent && pg.C(o.m.parent) ? pg.C(o.m.parent).pvy : o.pvy;
    return Object.values(pg.cards).filter((o) => !skip.includes(o.id) && !skip.includes(o.m.parent) && o.body.visible && !o.flat && !o.m.flat && !(o.m.parent && o.m.behind) && y(o) > fy + 2).map((o) => ({ id: o.id, up: (y(o) - fy) * 0.8 }));
  }
  var coveredAt = (pg, cov, x, y) => cov.some((f) => pg.solidAt(f.id, x, y) || f.up > 0 && (pg.solidAt(f.id, x, y + f.up / 2) || pg.solidAt(f.id, x, y + f.up)));
  function seenShare(pg, c, fx, fy, cov, spotId) {
    const a = pg.alpha[c.mesh.userData.tex];
    if (!a) return 1;
    const x0 = fx - c.m.w / 2, y0 = c.m.pivot === "top" ? fy : fy - c.m.h;
    let on = 0, seen = 0;
    for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) {
      const u = (i + 0.5) / 12, v = (j + 0.5) / 12;
      if (a.data[Math.floor(v * a.h) * a.w + Math.floor(u * a.w)] <= 60) continue;
      on++;
      const px2 = x0 + u * c.m.w, py = y0 + v * c.m.h;
      if (!(spotId && pg.solidAt(spotId, px2, py)) && !(spotId ? hides(pg, cov, px2, py) : coveredAt(pg, cov, px2, py))) seen++;
    }
    return on ? seen / on : 1;
  }
  function bestPlace(cands, others) {
    cands.sort((p, q) => p.cost - q.cost);
    const seen = (p) => p.seen === void 0 ? p.seen = p.see() : p.seen;
    return cands.find((p) => !clash(p.box, others) && seen(p) >= SEEN) || cands.find((p) => seen(p) >= SEEN) || cands.reduce((m, p) => !m || seen(p) > seen(m) ? p : m, null);
  }
  var pageX = (pg, c, cx) => {
    const [a0, , a1] = pg.seenBox(c);
    return cx - ((a0 + a1) / 2 - c.m.w / 2);
  };
  var inPage = (pg, c, fx, fy) => {
    const b = boxAt(pg, c, fx, fy);
    return b[0] >= 8 && b[2] <= 1592 && b[1] >= 8;
  };
  function topPlace(pg, g, it, spotId) {
    const c = pg.C(it.item), s = pg.C(spotId), [a0, b0, a1, b1] = pg.seenBox(c), W2 = a1 - a0, H2 = b1 - b0;
    const [sx0, sy0, sx1, sy1] = pg.seenBox(s), X02 = s.m.x + sx0, X12 = s.m.x + sx1;
    const cov = inFront2(pg, spotId, it.item), others = keepClear(pg, g, it.item), cx0 = c.pvx - c.m.w / 2 + (a0 + a1) / 2, cands = [];
    for (let i = 0; i < 9; i++) {
      const cx = cx0 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * W2 * 0.45;
      if (cx < X02 + W2 * 0.3 || cx > X12 - W2 * 0.3) continue;
      const edge = topEdge(pg, spotId, cx - W2 / 4, cx + W2 / 4, s.m.y + sy0, s.m.y + sy1) ?? s.m.y + sy0;
      const fx = pageX(pg, c, cx), fy = edge + H2 * 0.08 + (c.m.h - b1);
      if (!inPage(pg, c, fx, fy)) continue;
      cands.push({ fx, fy, cost: Math.abs(cx - cx0), see: () => seenShare(pg, c, fx, fy, cov, spotId), box: boxAt(pg, c, fx, fy) });
    }
    return bestPlace(cands, others);
  }
  function groundPlace(pg, g, it, spotId) {
    const c = pg.C(it.item), s = pg.C(spotId), [a0, , a1] = pg.seenBox(c), W2 = a1 - a0;
    const [sx0, , sx1] = pg.seenBox(s), X02 = s.m.x + sx0, X12 = s.m.x + sx1, others = keepClear(pg, g, it.item);
    const cx0 = c.pvx - c.m.w / 2 + (a0 + a1) / 2, k = cx0 - X02 < X12 - cx0 ? -1 : 1;
    const y0 = Math.min(940, s.pvy + 34), cands = [], covs = {};
    for (const side of [k, -k]) {
      const edge = side < 0 ? X02 : X12;
      for (let i = -3; i < 5; i++) {
        const cx = edge + side * (i >= 0 ? W2 * 0.15 + i * W2 * 0.6 : -W2 * 0.45 + (i + 1) * W2 * 0.6);
        for (let j = 0; j < 4; j++) {
          const fy = Math.min(940, y0 + j * 36), fx = pageX(pg, c, cx);
          if (!inPage(pg, c, fx, fy) || j && fy === y0) continue;
          const cov = () => covs[fy] || (covs[fy] = frontOfGround(pg, fy, [it.item, spotId]));
          const def = edge + side * W2 * 0.15;
          cands.push({ fx, fy, cost: Math.abs(cx - def) + (fy - y0) * 2 + (side !== k ? 80 : 0), see: () => seenShare(pg, c, fx, fy, cov()), box: boxAt(pg, c, fx, fy) });
        }
      }
    }
    return bestPlace(cands, others);
  }
  function liftOff(pg, c) {
    const p = pg.C(c.m.parent);
    if (!p) return 0;
    pg.root.updateMatrixWorld(true);
    const P = pg.root.worldToLocal(c.pivot.getWorldPosition(new THREE9.Vector3()));
    const sn = Math.sin(p.theta), cs = Math.cos(p.theta), z0 = 15e-4 + c.order * 5e-4;
    const h = sn > 0.2 ? Math.max(0, (P.z - z0) / sn) : 0, y = P.y - h * cs;
    pg.placePiece(c.id, null, [(P.x + 0.5) * 1600, (0.375 - y) * 1600]);
    c.pivot.position.set(P.x, y, z0);
    return h;
  }
  function wakeUp(c) {
    c.stillNow = false;
    c.idleK = 0;
  }
  function slideTo(pg, it, to) {
    const c = pg.C(it.item), from = [c.pvx, c.pvy], p0 = c.pivot.position.clone();
    pg.show(it.item);
    pg.tween(0.9, (t) => {
      const k = easeInOut(t);
      c.pivot.position.x = p0.x + (to.fx - from[0]) * S_PX * k;
      c.pivot.position.y = p0.y + (from[1] - to.fy) * S_PX * k;
    }, () => {
      c.pvx = to.fx;
      c.pvy = to.fy;
      pg.hop(it.item, 0.03);
      pg.burst(it.item, 20, 1.2);
    });
  }
  var S_PX = 1 / 1600;
  function comeOut(pg, g, it, spotId) {
    const c = pg.C(it.item), s = pg.C(spotId), pl = pg.gs.place[findKey(it)];
    wakeUp(c);
    pg.gs.stand = pg.gs.stand || {};
    const mode = pl && pl.part && s ? partOut(pg, it, spotId, pl.part) : !s ? "here" : comeOutMode(pg, it, spotId, c.pvy);
    if (mode === "here" && pl && pl.part) {
      const to2 = topPlace(pg, g, it, spotId);
      if (to2 && to2.seen >= SEEN) {
        pg.gs.stand[it.item] = to2.box;
        return slideTo(pg, it, to2);
      }
    }
    if (mode === "here" || !s) return popUp(pg, g, it, spotId);
    const to = groundPlace(pg, g, it, spotId);
    if (!to) return popUp(pg, g, it, spotId);
    pg.gs.stand[it.item] = to.box;
    const h = c.m.parent ? liftOff(pg, c) : 0;
    walkOut(pg, it, c, s, to, h);
  }
  function popUp(pg, g, it, spotId) {
    const c = pg.C(it.item), s = pg.C(spotId), [a0, b0, a1, b1] = pg.seenBox(c), W2 = a1 - a0, H2 = b1 - b0;
    pg.gs.stand = pg.gs.stand || {};
    if (it.spotMove || !s) {
      pg.gs.stand[it.item] = boxAt(pg, c, c.pvx, c.pvy);
      pg.rise(it.item, -c.h, 1.1);
      pg.later(550, () => pg.burst(it.item, 20, 1.2));
      return;
    }
    if (!c.m.parent && !c.body.visible) pg.placePiece(it.item, spotId, [c.pvx, c.pvy], { behind: true });
    const on = c.m.parent && pg.C(c.m.parent) ? c.m.parent : null, peeking = c.body.visible, cands = [];
    const cov = on ? inFront2(pg, on, it.item) : null, others = keepClear(pg, g, it.item);
    for (let i = 0; i < 11; i++) for (let j = 0; j < 16; j++) {
      const fx = c.pvx + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * W2 * 0.4, fy = c.pvy - j * H2 * 0.1;
      if (!inPage(pg, c, fx, fy)) continue;
      const see = () => on ? seenShare(pg, c, fx, fy, cov, on) : seenShare(pg, c, fx, fy, frontOfGround(pg, fy, [it.item]));
      cands.push({ fx, fy, cost: Math.abs(fx - c.pvx) * 4 + (c.pvy - fy), see, box: boxAt(pg, c, fx, fy) });
    }
    const to = bestPlace(cands, others) || { fx: c.pvx, fy: c.pvy, box: boxAt(pg, c, c.pvx, c.pvy) };
    pg.gs.stand[it.item] = to.box;
    if (peeking && on) return slideTo(pg, it, to);
    if (to.fx !== c.pvx || to.fy !== c.pvy) pg.placePiece(it.item, on, [to.fx, to.fy], { behind: !!(on && c.m.behind) });
    pg.rise(it.item, -c.h, 1.1);
    pg.later(550, () => pg.burst(it.item, 20, 1.2));
  }
  function walkOut(pg, it, c, s, to, h0 = 0) {
    const [a0, , a1] = pg.seenBox(c), W2 = a1 - a0, [sx0, , sx1] = pg.seenBox(s), X02 = s.m.x + sx0, X12 = s.m.x + sx1;
    const x0 = c.pvx, y0 = c.pvy, cx = (X02 + X12) / 2;
    const k = to.fx < X02 ? -1 : to.fx > X12 ? 1 : x0 < cx ? -1 : 1;
    const xs = Math.max(W2 / 2 + 10, Math.min(1590 - W2 / 2, k < 0 ? X02 - W2 / 2 - 8 : X12 + W2 / 2 + 8));
    const v = (x, y, h) => new THREE9.Vector3(x / 1600 - 0.5, 0.375 - y / 1600, h);
    const pts = [v(x0, y0, h0), v(xs, y0, h0), v(xs, y0, 0), v(xs, to.fy, 0), v(to.fx, to.fy, 0)];
    pts[0].x = c.pivot.position.x;
    pts[0].y = pts[1].y = pts[2].y = c.pivot.position.y;
    const seg = pts.slice(1).map((p, i) => p.distanceTo(pts[i])), total = seg.reduce((a, b2) => a + b2, 0) || 1e-6;
    const b = c.body, bs = pg.base(c), dur = Math.min(1.35, 0.8 + total * 2), z = c.pivot.position.z;
    pg.show(it.item);
    pg.tween(dur, (t) => {
      let d = easeInOut(t) * total, i = 0;
      while (i < seg.length - 1 && d > seg[i]) {
        d -= seg[i];
        i++;
      }
      const u = seg[i] ? Math.min(1, d / seg[i]) : 1, p = pts[i].clone().lerp(pts[i + 1], u);
      c.pivot.position.set(p.x, p.y, z);
      const jump = i === 1 && h0 > 0.01 ? Math.sin(Math.PI * u) * 0.02 : 0;
      b.position.y = bs.y + p.z + jump + (p.z > 1e-3 ? 0 : Math.abs(Math.sin(t * Math.PI * 4)) * 0.014);
    }, () => {
      b.position.y = bs.y;
      c.pvx = to.fx;
      c.pvy = to.fy;
      c.pivot.position.set(pts[4].x, pts[4].y, z);
      if (c.shadow) c.shadow.position.set(c.pivot.position.x, c.pivot.position.y, 8e-4);
      pg.hop(it.item, 0.04);
      pg.burst(it.item, 18, 1.1);
    });
  }
  function callOut(pg, it) {
    const pl = pg.gs.place[findKey(it)], spot = pl ? pl.spot : it.spot;
    const from = it.clue && pg.C(it.clue) && pg.C(it.clue).body.visible ? it.clue : pl && pl.peeks ? it.item : spot;
    const call = it.call || {};
    if (call.say) pg.say(from, call.say, `call_${findKey(it)}`, call.who || it.item || spot);
    if (call.sound) pg.sfx(call.sound);
    pg.later(300, () => {
      pg.wobble(spot, 0.03, 0.7);
      if (it.clue && pg.C(it.clue) && pg.C(it.clue).body.visible) pg.hop(it.clue, 0.03);
    });
  }
  var said = (text, color) => ({ kind: "o", text, color });
  var told = (text, who) => ({ kind: "b", text, who });
  var wordsOf = (w, kit) => [].concat(w || kit).filter((x) => typeof x === "string");
  var quizOf = (g) => g.questions && g.questions.length ? g.questions.map((q) => ({ ...g, ...q, questions: void 0 })) : [g];
  var answersOf = (q) => q.answer === void 0 || q.answer === null || q.answer === "" ? null : [].concat(q.answer);
  var quizTotal = (g) => quizOf(g).reduce((n, q) => n + (answersOf(q) ? answersOf(q).length : 1), 0);
  var GOALS = {
    // さがす: "items": [{ "spot": the piece to touch, "item": the hidden piece that comes out, … }] — all found → cleared
    //   "area": [x1, y1, x2, y2] — only this part of the spot finds it (page pixels: 屋台の のれん・台の下 …)
    //   "places": [{ "spot", "area", "at": [x, y], "peek": [x, y], "flip": true }] — it hides at one of these places,
    //       another one each time the page is played ("at": where its feet are while it hides, behind the spot)
    //   "clue": a small hidden picture (ちらっと 見える 手がかり) shown at the place's "peek" — touching it finds it too
    //   "call": { "say": "いちろう〜", "after": 10 } — not found for a while (or after 3 misses): it calls out, its place shakes
    //   "comeOut": "front" — comes out from behind the spot and stands on the ground a little in front of it (人・ねこ);
    //              "here" — comes up from behind the spot where it is, over its top (とりが 木の 上に・うさぎが 雲の 上に;
    //              one peeking out at the side climbs up behind the spot). Not written: "front" when it stands on the ground
    //              (its feet about where the spot stands), "here" when it is up in the spot, flies or glows
    //   goal "main": the one the page is about (まいごの おかあさん): the hints and the calls are for it until it is
    //       found; found, a word says others are hiding too ("toast" of its item, or the kit's). Lines that change
    //       when it is found: "if": { "found": "<its id>" } (presets.js). No "main": all of them are the same
    //   goal "misses": [{ "spot", "area", "react" }] — something else is there (ヨーヨーが ぽよーん …);
    //   goal "miss": what a spot with nothing there does (default: it shakes, "いないみたい")
    // A touch finds it on its place, a little around the place too (AREA_MORE of its size), and on the bit of it that
    // shows or just beside it (NEAR px)
    find: {
      texts: (g) => [said(g.missWord || "いないみたい", "#7a5aa0"), ...(g.items || []).flatMap((it) => [
        ...it.word !== false ? [said(it.word || "みつけた！", it.color || "#e8b21f")] : [],
        ...it.call && typeof it.call.say === "string" ? [told(it.call.say, it.call.who || it.item || it.spot)] : [],
        ...wordsOf(it.say).map((x) => told(x, it.who || it.item || it.spot))
      ])],
      // would a touch on piece `id` (where: hit.at) find one that still hides?
      finds(pg, g, id, hit) {
        const at = hit && hit.at;
        const inArea = (a) => {
          if (!a || !at) return true;
          const mx = Math.max(24, (a[2] - a[0]) * AREA_MORE), my = Math.max(24, (a[3] - a[1]) * AREA_MORE);
          return at[0] >= a[0] - mx && at[0] <= a[2] + mx && at[1] >= a[1] - my && at[1] <= a[3] + my;
        };
        const on = (spot) => id === spot || pg.C(id) && pg.C(id).m.parent === spot && !pg.C(id).m.behind;
        return g.items.some((x) => {
          const k = findKey(x);
          if (pg.gs.found[k]) return false;
          if (x.clue && id === x.clue) return true;
          const pl = pg.gs.place[k];
          if (pl && pl.peeks && id === x.item) return true;
          return pl ? (pl.part ? on(pl.spot) : id === pl.spot) && inArea(pl.area) : id === x.spot && inArea(x.area);
        });
      },
      init(pg, g) {
        pg.gs.found = {};
        pg.gs.place = {};
        pg.gs.callAt = {};
        pg.gs.misses = 0;
        pg.gs.stand = {};
        pg.gs.mainId = g.main && g.items.some((it) => it.item === g.main) ? g.main : null;
        const cache = pg._hiding || (pg._hiding = {});
        for (const it of g.items) {
          if (it.item && pg.C(it.item)) pg.hide(it.item);
          if (it.clue && pg.C(it.clue)) pg.hide(it.clue);
          if (!it.item || !pg.C(it.item)) continue;
          const places = it.places && it.places.length ? it.places : it.spot ? [{ spot: it.spot, area: it.area }] : [];
          const pl = places[Math.floor(Math.random() * places.length)];
          if (!pl) continue;
          const n = pl.at || pl.peek || pl.area ? 1 : splitOf(pg, it, pl.spot);
          if (n > 1) {
            const key = `${it.item}|${pl.spot}|${n}`;
            const all = cache[key] || (cache[key] = hidingParts(pg, it, pl.spot, n));
            const taken = Object.values(pg.gs.place).filter((p) => p.spot === pl.spot && p.part).map((p) => p.area);
            const parts = all.filter((p) => !taken.some((a) => overlap(a, p.area) > 0.3));
            const part = parts[Math.floor(Math.random() * parts.length)];
            if (part) {
              pg.gs.place[findKey(it)] = part;
              hideInPart(pg, it, part);
              continue;
            }
          }
          if (it.places && it.places.length) {
            pg.gs.place[findKey(it)] = pl;
            hideAt(pg, it, pl);
          }
        }
      },
      play(pg, g) {
        for (const it of g.items) {
          const k = findKey(it);
          if (it.clue && pg.C(it.clue) && !pg.gs.found[k]) {
            pg.show(it.clue);
            pg.gs.clueT = pg.time + 2;
          }
          const pl = pg.gs.place[k];
          if (pl && pl.peeks && !pg.gs.found[k]) {
            pg.show(it.item);
            pg.gs.clueT = pg.time + 2;
          }
          if (it.call && !waitsForMain(pg, it)) pg.gs.callAt[k] = pg.time + (it.call.after ?? 10);
        }
      },
      update(pg, g) {
        if (pg.gs.done || !pg.playing || !pg.open) return;
        for (const it of g.items) {
          const k = findKey(it);
          if (pg.gs.found[k]) continue;
          if (it.clue && pg.C(it.clue) && pg.C(it.clue).body.visible && pg.time > (pg.gs.clueT || 0)) {
            pg.gs.clueT = pg.time + 3.5 + Math.random() * 2;
            pg.wobble(it.clue, 0.06, 0.6);
          }
          const pl = pg.gs.place[k];
          if (pl && pl.peeks && pg.C(it.item).body.visible && pg.time > (pg.gs.clueT || 0)) {
            pg.gs.clueT = pg.time + 3.5 + Math.random() * 2;
            pg.wobble(it.item, 0.06, 0.6);
          }
          if (it.call && pg.gs.callAt[k] !== void 0 && (pg.time > pg.gs.callAt[k] || pg.gs.misses >= 3)) {
            pg.gs.misses = 0;
            pg.gs.callAt[k] = pg.time + (it.call.every ?? it.call.after ?? 10);
            callOut(pg, it);
          }
        }
      },
      tap(pg, g, id, hit) {
        const foundOne = (x) => g.items.some((it2) => it2.item === x && pg.gs.found[findKey(it2)]);
        if (hit && hit.behind && foundOne(id)) {
          const h = hit.behind.find((b) => !foundOne(b.id) && GOALS.find.finds(pg, g, b.id, b));
          if (h) {
            id = h.id;
            hit = h;
          }
        }
        const at = hit && hit.at;
        const inArea = (a, more = 0) => {
          if (!a || !at) return true;
          const mx = Math.max(more ? 24 : 0, (a[2] - a[0]) * more), my = Math.max(more ? 24 : 0, (a[3] - a[1]) * more);
          return at[0] >= a[0] - mx && at[0] <= a[2] + mx && at[1] >= a[1] - my && at[1] <= a[3] + my;
        };
        const on = (spot2) => id === spot2 || pg.C(id) && pg.C(id).m.parent === spot2 && !pg.C(id).m.behind;
        const finds = (x, more) => {
          const k = findKey(x);
          if (pg.gs.found[k]) return false;
          if (x.clue && id === x.clue) return true;
          const pl2 = pg.gs.place[k];
          if (pl2 && pl2.peeks && id === x.item) return true;
          return pl2 ? (pl2.part ? on(pl2.spot) : id === pl2.spot) && inArea(pl2.area, more) : id === x.spot && inArea(x.area, more);
        };
        const it = g.items.find((x) => finds(x, 0)) || g.items.find((x) => finds(x, AREA_MORE));
        if (!it) {
          if (pg.gs.done) return false;
          if (g.items.some((x) => x.item === id && pg.gs.found[findKey(x)] || x.clue === id)) return false;
          const ms = (g.misses || []).find((m) => m.spot === id && inArea(m.area));
          if (ms) {
            progressed(pg);
            if (react(pg, id, ms.react || {}, hit, { free: true }) !== false) pg.gs.misses++;
            return true;
          }
          const looking = g.items.some((x) => !pg.gs.found[findKey(x)] && (x.spot === id || (x.places || []).some((p) => p.spot === id)));
          if (!looking) return false;
          progressed(pg);
          if (g.miss) {
            if (react(pg, id, g.miss, hit, { free: true }) !== false) pg.gs.misses++;
          } else {
            pg.gs.misses++;
            pg.wobble(id, 0.035, 0.6);
            pg.sfx("po");
            pg.ono(g.missWord || "いないみたい", hit && hit.point ? hit.point.clone().add(pg.up.clone().multiplyScalar(0.02)) : id, "#7a5aa0");
          }
          return true;
        }
        const key = findKey(it), pl = pg.gs.place[key], spot = pl ? pl.spot : it.spot;
        pg.gs.found[key] = true;
        progressed(pg);
        pg.gs.misses = 0;
        pg.gs.foundIds = { ...pg.gs.foundIds || {}, [it.item || it.spot]: true };
        if (it.clue && pg.C(it.clue)) {
          pg.burst(it.clue, 10, 0.7);
          pg.hide(it.clue);
        }
        if (it.spotMove && moveOf(pg, it.spotMove)) moveOf(pg, it.spotMove)(pg, spot);
        else pg.wobble(spot, 0.06, 0.9);
        if (it.item && pg.C(it.item)) pg.later(250, () => {
          comeOut(pg, g, it, spot);
          pg.sfx(it.sound || "pon");
        });
        if (it.swap) pg.spin(spot, "y", 1, 1.2, () => pg.swap(spot, altKey(pg, spot, it.swap)));
        pg.sfx("kirarin");
        if (it.word !== false) pg.ono(it.word || "みつけた！", pg.top(spot, 1.1), it.color || "#e8b21f");
        const sayer = it.who || it.item || spot;
        const by = it.who && pg.C(it.who) ? it.who : it.item || spot;
        if (it.say) pg.later(it.item ? 1300 : 800, () => pg.say(by, it.say, by, sayer));
        if (it.get) pg.later(1400, () => pg.getItem(it.get));
        if (it.react) react(pg, spot, it.react, null, { free: true });
        const n = Object.keys(pg.gs.found).length;
        pg.progress(n, g.items.length);
        if (g.count) setCount(g.count, n);
        pg.later(400, () => pg.sfx("found"));
        if (it.item && it.item === pg.gs.mainId && n < g.items.length) {
          for (const x of g.items) if (x.call && !pg.gs.found[findKey(x)]) pg.gs.callAt[findKey(x)] = pg.time + (x.call.after ?? 10);
          pg.later(2600, () => pg.toast(it.toast || "みつけた！ ほかにも だれか かくれているみたい", 2800));
        }
        if (n === g.items.length) pg.later(it.item ? 2200 : 1500, () => goalDone(pg, g));
        return true;
      }
    },
    gather: {
      texts: (g) => [said(g.undoWord || "あれれ？", "#7a5aa0")],
      init(pg) {
        pg.gs.ready = {};
      },
      update(pg, g) {
        if (pg.gs.done || pg.gs.finishing) return;
        const W2 = windowOf(g, g.targets.length);
        for (const [id, t] of Object.entries(pg.gs.ready)) {
          const frac = 1 - (pg.time - t) / W2;
          if (frac > 0) {
            pg.setGauge(`g_${id}`, frac, frac < 0.3);
            continue;
          }
          delete pg.gs.ready[id];
          pg.removeGauge(`g_${id}`);
          const r = g.react && g.react[id];
          if (r && r.swap) pg.swap(id, pg.C(id).m.tex[0]);
          pg.sfx("undo");
          const u = g.undo && g.undo[id];
          if (u) react(pg, id, noSwap(u), null, { free: true, auto: true });
          else pg.ono(g.undoWord || "あれれ？", id, "#7a5aa0");
          pg.progress(Object.keys(pg.gs.ready).length, g.targets.length);
          if (!pg.gs.told) {
            pg.gs.told = true;
            pg.toast(`じかんぎれ！ ${W2}びょうの うちに ぜんぶ タッチしてね`, 3200);
          }
        }
      },
      tap(pg, g, id) {
        if (!g.targets.includes(id) || pg.gs.done || pg.gs.finishing) return false;
        const fresh = !pg.gs.ready[id];
        pg.gs.ready[id] = pg.time;
        if (fresh) {
          progressed(pg);
          pg.gauge(`g_${id}`, "ring", id, g.readyWord || "OK", "#5fc46a");
          const r = g.react && g.react[id];
          if (r && r.swap) pg.swap(id, altKey(pg, id, r.swap));
          if (r) react(pg, id, noSwap(r), null, { free: true });
          else {
            pg.hop(id, 0.05);
            if (isCast(id)) pg.sfx("meow", id);
            else pg.sfx("pon");
          }
        } else {
          const a = g.again && g.again[id];
          if (a) {
            react(pg, id, noSwap(a), null, { free: true });
            if (!a.sound) pg.sfx("ready");
          } else {
            pg.wobble(id, 0.04, 0.6);
            pg.sfx("ready");
          }
        }
        pg.setGauge(`g_${id}`, 1);
        const n = Object.keys(pg.gs.ready).length;
        pg.progress(n, g.targets.length);
        if (n === g.targets.length) {
          pg.gs.finishing = true;
          pg.later(600, () => {
            g.targets.forEach((t) => pg.removeGauge(`g_${t}`));
            goalDone(pg, g);
          });
        }
        return true;
      }
    },
    // なんども タッチ: "target" again and again until the power bar is full.
    //   "team": ["ma", "hi", …] — みんなで: everyone in the team must be touched first (each keeps going for a while,
    //   like gather: 4 of them have the age's "seconds", more of them more: windowOf); only then does the target move.
    //   Touching the target keeps the team going.
    //   per team member: "react" (first touch), "again", "undo" (got tired), "win" (when the target moves)
    mash: {
      texts: (g) => [said("ふぅ…", "#7a5aa0"), said(g.stuckWord || "びくとも しない", "#7a5aa0"), ...wordsOf(g.word, ["グッ", "グイッ"]).map((x) => said(x, g.color || "#e8756a"))],
      init(pg) {
        pg.gs.power = 0;
        pg.gs.ready = {};
      },
      update(pg, g, dt) {
        if (pg.gs.done || pg.gs.moving) return;
        if (g.team) {
          const W2 = windowOf(g, (g.team || []).length);
          for (const [id, t] of Object.entries(pg.gs.ready)) {
            const frac = 1 - (pg.time - t) / W2;
            if (frac > 0) {
              pg.setGauge(`m_${id}`, frac, frac < 0.3);
              continue;
            }
            delete pg.gs.ready[id];
            pg.removeGauge(`m_${id}`);
            const r = g.react && g.react[id];
            if (r && r.swap) pg.swap(id, pg.C(id).m.tex[0]);
            pg.sfx("undo");
            const u = g.undo && g.undo[id];
            if (u) react(pg, id, noSwap(u), null, { free: true, auto: true });
            else pg.ono("ふぅ…", id, "#7a5aa0");
            if (pg.labels.gauges.mash) {
              pg.gs.power = 0;
              pg.removeGauge("mash");
            }
            pg.progress(Object.keys(pg.gs.ready).length, g.team.length);
            if (!pg.gs.toldTired) {
              pg.gs.toldTired = true;
              pg.toast("つかれちゃった！ もういちど みんなを タッチ", 3e3);
            }
          }
        }
        if (!pg.gs.power) return;
        if (pg.time - (pg.gs.lastTap || 0) < 0.8) return;
        pg.gs.power = Math.max(0, pg.gs.power - (g.decay ?? 0.04) * dt);
        pg.setGauge("mash", pg.gs.power);
      },
      tap(pg, g, id) {
        if (pg.gs.done || pg.gs.moving) return g.team && g.team.includes(id) && !pg.gs.done ? true : id === g.target && !pg.gs.done;
        if (g.team && g.team.includes(id)) {
          const fresh = !pg.gs.ready[id];
          pg.gs.ready[id] = pg.time;
          progressed(pg);
          if (fresh) {
            pg.gauge(`m_${id}`, "ring", id, g.readyWord || "OK", "#ff8fb1");
            const r = g.react && g.react[id];
            if (r && r.swap) pg.swap(id, altKey(pg, id, r.swap));
            if (r) react(pg, id, noSwap(r), null, { free: true });
            else {
              pg.hop(id, 0.04);
              pg.sfx(isCast(id) ? "meow" : "pon", id);
            }
          } else {
            const a = g.again && g.again[id];
            if (a) react(pg, id, noSwap(a), null, { free: true });
            else {
              pg.wobble(id, 0.03, 0.6);
              pg.sfx("ready");
            }
          }
          pg.setGauge(`m_${id}`, 1);
          const n = Object.keys(pg.gs.ready).length;
          pg.progress(n, g.team.length);
          if (n === g.team.length && !pg.labels.gauges.mash) {
            pg.gauge("mash", "bar", g.target, g.gauge || "ちから", "#ff5a4a", 1.08);
            pg.setGauge("mash", pg.gs.power);
            pg.toast("いまだ！ なんども タッチ！", 2600);
            pg.sfx("ready");
          }
          return true;
        }
        if (id !== g.target) return false;
        if (g.team && Object.keys(pg.gs.ready).length < g.team.length) {
          pg.shake(g.target, 6e-3, 0.7);
          pg.sfx("gugu");
          pg.onoAround(g.stuckWord || "びくとも しない", g.target, "#7a5aa0");
          if (!pg.gs.toldTeam) {
            pg.gs.toldTeam = true;
            pg.toast("まずは みんなを タッチ！", 2600);
          }
          return true;
        }
        if (g.team) for (const t of g.team) {
          pg.gs.ready[t] = pg.time;
          pg.wobble(t, 0.025, 0.3);
        }
        if (!pg.labels.gauges.mash) pg.gauge("mash", "bar", g.target, g.gauge || "ちから", "#ff5a4a", 1.08);
        pg.gs.lastTap = pg.time;
        progressed(pg);
        pg.gs.power = Math.min(1, pg.gs.power + 1 / param(g, "times") + 1e-6);
        pg.setGauge("mash", pg.gs.power);
        if (g.tapMove && moveOf(pg, g.tapMove)) moveOf(pg, g.tapMove)(pg, g.target, null, g);
        else pg.shake(g.target, 6e-3, 0.3);
        pg.sfx(g.sound || "gu");
        pg.onoAround(pick2(g.word || ["グッ", "グイッ"], nextIdx(pg, "mash")), g.target, g.color || "#e8756a");
        if (pg.gs.power >= 1) {
          pg.gs.moving = true;
          pg.removeGauge("mash");
          (g.team || []).forEach((t, i) => {
            pg.removeGauge(`m_${t}`);
            const w = g.win && g.win[t];
            if (w) pg.later(250 + i * 90, () => react(pg, t, w, null, { free: true, auto: true }));
          });
          const away = g.doneMove || "rollAway";
          const c = pg.C(g.target), b = c.body, hh = c.h / 2;
          if (away === "rollAway") {
            pg.sfx("gorogoro");
            pg.tween(1.4, (t) => {
              const k = 1 - Math.pow(1 - t, 2), a = -Math.PI * 2 * k;
              b.rotation.z = a;
              b.position.x = 0.2 * k + hh * Math.sin(a);
              b.position.y = hh * (1 - Math.cos(a));
            });
          } else if (away === "flyAway") {
            pg.sfx("boing");
            pg.tween(1.2, (t) => {
              b.position.y = t * t * 0.5;
              b.rotation.z = t * 2;
            }, () => pg.hide(g.target));
          } else if (away === "pop") {
            pg.sfx("pon");
            pg.burst(g.target, 30, 1.4);
            pg.hide(g.target);
          } else if (away !== "none" && moveOf(pg, away)) moveOf(pg, away)(pg, g.target, null, g);
          pg.later(g.team && g.win ? 2400 : 1200, () => goalDone(pg, g));
        }
        return true;
      }
    },
    // じゅんばんに タッチ: "targets" in order; a wrong one wobbles (with "strict", it starts again)
    order: {
      texts: (g) => [said(g.wrongWord || "ちがうよ", "#7a5aa0"), ...(g.targets || []).map((t, i) => said(pick2(g.words || [String(i + 1)], i), g.color || "#e8b21f"))],
      init(pg) {
        pg.gs.next = 0;
      },
      tap(pg, g, id) {
        const i = g.targets.indexOf(id);
        if (i < 0 || pg.gs.done) return false;
        if (i < pg.gs.next) return false;
        if (i === pg.gs.next) {
          pg.gs.next++;
          progressed(pg);
          const r = g.react && g.react[id];
          if (r) react(pg, id, r, null, { free: true });
          else {
            pg.hop(id, 0.05);
            pg.sfx("pon");
          }
          pg.ono(pick2(g.words || [String(i + 1)], i), pg.top(id, 1.05), g.color || "#e8b21f");
          pg.gauge(`o_${id}`, "ring", id, String(i + 1), "#5fc46a");
          pg.setGauge(`o_${id}`, 1);
          pg.progress(pg.gs.next, g.targets.length);
          if (pg.gs.next === g.targets.length) pg.later(900, () => {
            g.targets.forEach((t) => pg.removeGauge(`o_${t}`));
            goalDone(pg, g);
          });
        } else {
          pg.wobble(id, 0.06, 0.8);
          pg.sfx("undo");
          pg.ono(g.wrongWord || "ちがうよ", id, "#7a5aa0");
          if (param(g, "strict") && pg.gs.next > 0) {
            g.targets.forEach((t) => pg.removeGauge(`o_${t}`));
            pg.gs.next = 0;
            pg.progress(0, g.targets.length);
            pg.toast(g.again || "さいしょから もういちど", 2200);
          }
        }
        return true;
      }
    },
    // えらぶ（クイズ）: "question", "options" (pieces), "answer"
    //   no "answer": any one is right (えらぶだけ). "remember": "gift" keeps what was chosen for later pages ("{gift}" in texts)
    // えらぶ（クイズ）: "question", "options", "answer" — or "answer": [ … ] (several are right: find them all),
    //   or "questions": [{ "question", "answer", "options", "right", "wrong" }, …] asked one after another (all right → cleared).
    //   No "answer": whatever is chosen is the choice ("remember": what was chosen, for other pages)
    choose: {
      texts: (g) => [said("もう みつけたよ", "#7a5aa0"), ...quizOf(g).flatMap((q) => [
        said(q.rightWord || (answersOf(q) ? "せいかい！" : "これに きめた！"), "#e8b21f"),
        said(q.wrongWord || "ちがうみたい", "#7a5aa0"),
        ...q.who && typeof q.question === "string" ? [told(q.question, q.who)] : []
      ])],
      init(pg) {
        pg.gs.q = 0;
        pg.gs.got = {};
        pg.gs.right = 0;
      },
      play(pg, g) {
        pg.later(500, () => ask(pg, quizOf(g)[pg.gs.q] || g));
      },
      tap(pg, g, id) {
        const Q = quizOf(g), q = Q[pg.gs.q];
        if (!q || pg.gs.done || !(q.options || []).includes(id)) return false;
        if (pg.gs.next) return true;
        const ans = answersOf(q);
        if (!ans || ans.includes(id)) {
          if (ans && pg.gs.got[id]) {
            pg.hop(id, 0.04, 0.6);
            pg.ono("もう みつけたよ", id, "#7a5aa0");
            return true;
          }
          pg.gs.got[id] = true;
          pg.gs.right++;
          pg.gs.chosen = id;
          progressed(pg);
          if (!ans && q.remember) remember(q.remember, id, q.names && q.names[id] || itemOf(id).name);
          const r = q.react && q.react[id] || q.right;
          if (r) react(pg, id, r, null, { free: true });
          else {
            pg.hop(id, 0.08, 0.75);
            pg.sfx("kirarin");
          }
          if (!(r && r.word)) pg.ono(q.rightWord || (ans ? "せいかい！" : "これに きめた！"), pg.top(id, 1.1), "#e8b21f");
          pg.burst(id, 20, 1.2);
          pg.progress(pg.gs.right, quizTotal(g));
          const left = ans ? ans.filter((a) => !pg.gs.got[a]).length : 0;
          if (left > 0) {
            pg.later(700, () => pg.toast(`あと ${left}つ！`, 1800));
            return true;
          }
          if (pg.gs.q + 1 < Q.length) {
            pg.gs.next = true;
            pg.later(1900, () => {
              pg.gs.q++;
              pg.gs.got = {};
              pg.gs.next = false;
              pg.toast(`${pg.gs.q + 1}もんめ`, 1400);
              pg.later(300, () => ask(pg, Q[pg.gs.q]));
            });
          } else pg.later(900, () => goalDone(pg, g));
        } else {
          const w = q.wrong && q.wrong[id];
          if (w) react(pg, id, w, null, { free: true });
          else {
            pg.wobble(id, 0.06, 0.8);
            pg.sfx("undo");
            pg.ono(q.wrongWord || "ちがうみたい", id, "#7a5aa0");
          }
        }
        return true;
      }
    },
    // でてきたら タッチ: "targets" (hidden pieces) come out one by one and go back; touch them while they are out.
    //   "style": "rise" (下から ぴょこっ: もぐら) / "swim" (よこから 泳いで来て もぐる: 金魚) / "fly" (ふわっと 飛んで来て 光る: ほたる)
    //   "behind": the front pieces they hide behind (穴・水そうの ふち・草) — touching those also catches one nearby
    //   "into": a piece the caught ones go into and stay (金魚ばち・かご・びん)
    //   "tool": 道具と手 (tool.js);  "count": "fish" — the number caught, for other pages ({fish}, "if": { "fish": 3 })
    pop: popGame("pop"),
    // おちてくる ものを キャッチ: "targets" fall from the sky; touch them before they reach the ground (same options as pop)
    fall: popGame("fall"),
    // そだてる: tap "target" "times" times for each of the "stages" (pictures <target>@<stage>)
    grow: {
      texts: (g) => wordsOf(g.words).map((x) => said(x, g.color || "#5fc46a")),
      init(pg) {
        pg.gs.stage = 0;
        pg.gs.n = 0;
      },
      tap(pg, g, id) {
        if (id !== g.target || pg.gs.done) return false;
        const times = param(g, "times", "growTimes"), stages = g.stages || [];
        if (pg.gs.stage >= stages.length) return true;
        if (!pg.labels.gauges.grow) pg.gauge("grow", "bar", g.target, g.gauge || "そだつ", "#5fc46a", 1.08);
        pg.gs.n++;
        progressed(pg);
        pg.pulse(id, 1.08, 0.6);
        pg.sfx(g.sound || "pon");
        pg.setGauge("grow", pg.gs.n / times);
        if (pg.gs.n < times) return true;
        pg.gs.n = 0;
        const s = stages[pg.gs.stage++];
        pg.spin(id, "y", 1, 1, () => pg.swap(id, altKey(pg, id, s)));
        pg.sfx("kirarin");
        pg.later(350, () => pg.burst(id, 18, 1.1));
        if (g.words) pg.onoAround(pick2(g.words, pg.gs.stage - 1), id, g.color || "#5fc46a");
        pg.progress(pg.gs.stage, stages.length);
        pg.setGauge("grow", 0);
        if (pg.gs.stage >= stages.length) {
          pg.removeGauge("grow");
          pg.later(1e3, () => goalDone(pg, g));
        }
        return true;
      }
    },
    // きせかえ: each tap shows the next look ("looks": { id: [alt, alt] }); match "answer" to clear
    dressup: {
      init(pg) {
        pg.gs.look = {};
        pg.gs.seen = {};
      },
      tap(pg, g, id) {
        const looks = g.looks[id];
        if (!looks || pg.gs.done) return false;
        const list = ["", ...looks], i = ((pg.gs.look[id] || 0) + 1) % list.length;
        pg.gs.look[id] = i;
        if (g.keep) keepLook(id, list[i]);
        (pg.gs.seen[id] = pg.gs.seen[id] || /* @__PURE__ */ new Set()).add(i);
        pg.spin(id, "y", 1, 0.8, () => pg.swap(id, i === 0 ? pg.C(id).m.tex[0] : altKey(pg, id, list[i])));
        pg.sfx(g.sound || "pon");
        const ids = Object.keys(g.answer || g.looks);
        const ok = g.answer ? ids.filter((t) => lookMatches(pg, g, t)).length : ids.filter((t) => (pg.gs.seen[t] || /* @__PURE__ */ new Set()).size >= g.looks[t].length).length;
        pg.progress(ok, ids.length);
        if (ok === ids.length) {
          progressed(pg);
          pg.later(800, () => goalDone(pg, g));
        }
        return true;
      }
    },
    // こする・はらう: rub "targets" with a finger (taps help a little too) until they are clean
    rub: {
      texts: (g) => [said(g.doneWord || "ぴかぴか！", g.color || "#3fa9e0"), ...wordsOf(g.word, ["ゴシゴシ", "キュッキュッ"]).map((x) => said(x, g.color || "#3fa9e0"))],
      init(pg) {
        pg.gs.rubbed = {};
        pg.gs.cleared = {};
      },
      grab(pg, g, id) {
        return g.targets.includes(id) && !pg.gs.done && !pg.gs.cleared[id];
      },
      rub(pg, g, id, hit, px2) {
        if (g.targets.includes(id) && !pg.gs.done) {
          progressed(pg);
          rubAdd(pg, g, id, px2 / param(g, "amount", "rub"), hit);
        }
      },
      tap(pg, g, id, hit) {
        if (!g.targets.includes(id) || pg.gs.done) return false;
        if (pg.gs.cleared[id]) return false;
        progressed(pg);
        rubAdd(pg, g, id, 0.15, hit);
        return true;
      }
    }
  };
  Object.assign(GOALS, MORE_GAMES);
  function goalUpdate(pg, g, dt) {
    const G = GOALS[g.type];
    if (G.update) G.update(pg, g, dt);
    const wait = param(g, "hintAfter");
    if (!wait || pg.gs.done || !pg.playing || !pg.open) return;
    if (pg.gs.lastMove === void 0) pg.gs.lastMove = pg.time;
    const since = Math.max(pg.gs.lastMove, pg.gs.lastHint ?? -Infinity);
    if (pg.time - since > wait) {
      pg.gs.lastHint = pg.time;
      showHint(pg, g);
    }
  }

  // system/engine/presets.js
  var pick2 = (v, i) => Array.isArray(v) ? v[i % v.length] : v;
  var altKey = (pg, id, alt) => pg.tex[`${id}@${alt}`] ? `${id}@${alt}` : alt;
  function nextIdx(pg, key) {
    pg.gs.idx = pg.gs.idx || {};
    const i = pg.gs.idx[key] || 0;
    pg.gs.idx[key] = i + 1;
    return i;
  }
  var slow = () => CALM.on ? 1.6 : 1;
  var small = () => CALM.on ? 0.5 : 1;
  var pw = (spec) => spec && typeof spec.power === "number" ? spec.power : 1;
  var dirOf = (spec, def = 1) => spec && spec.dir === "left" ? -1 : spec && spec.dir === "right" ? 1 : def;
  var faceOf = (pg, id) => {
    const c = pg.C(id), f = c && c.m.faces;
    return f === "left" ? -1 : 1;
  };
  var turnsOf = (spec) => spec && spec.turns > 0 ? spec.turns : 1;
  var turnTime = (n) => 1.2 * (1 + (n - 1) * 0.45);
  var other = (pg, spec) => spec && spec.with && pg.C(spec.with) ? spec.with : null;
  var MOVES = {
    hop: (pg, id, hit, spec) => pg.hop(id, 0.05 * pw(spec), 0.7),
    bigHop: (pg, id, hit, spec) => pg.hop(id, 0.09 * (CALM.on ? 0.7 : 1) * pw(spec), 0.8),
    jump2: (pg, id, hit, spec) => pg.hop(id, 0.05 * pw(spec), 0.55, 2),
    wobble: (pg, id, hit, spec) => pg.wobble(id, 0.08 * small() * pw(spec), 1.1, 4),
    // ぶるぶる：4回 ゆれて、だんだん とまる（こまかすぎない はやさ）
    shake: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), a = 7e-3 * small() * pw(spec);
      pg.tween(0.9, (t) => {
        b.position.x = bs.x + Math.sin(t * Math.PI * 8) * a * (1 - t);
      }, () => {
        b.position.x = bs.x;
      });
    },
    spin: (pg, id, hit, spec) => {
      const n = turnsOf(spec), d = turnTime(n) * slow();
      pg.spin(id, "y", n, d);
      return d;
    },
    turn: (pg, id, hit, spec) => {
      const n = turnsOf(spec), d = turnTime(n) * slow();
      pg.spin(id, "z", n * dirOf(spec, 1), d);
      return d;
    },
    pulse: (pg, id, hit, spec) => pg.pulse(id, 1 + 0.18 * pw(spec), 0.7),
    // ゆらゆら ゆれる。"with": もう1つの絵が 左右反対に いっしょに ゆれる（カーテン）
    swing: (pg, id, hit, spec) => {
      const a = 0.4 * (CALM.on ? 0.6 : 1) * pw(spec);
      pg.swing(id, a, 2, 3);
      const o = other(pg, spec);
      if (o) pg.swing(o, -a, 2, 3);
      return 2;
    },
    topple: (pg, id) => pg.topple(id, 1.4),
    // ころころ ころがって もどる（"dir": "left" で左へ）
    roll: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), k = dirOf(spec, 1), d = 1.7 * slow();
      pg.tween(d, (t) => {
        const u = Math.sin(Math.PI * t);
        b.position.x = bs.x + k * u * 0.06;
        b.rotation.z = -k * u * Math.PI * 1.4;
      }, () => {
        b.position.x = bs.x;
        b.rotation.z = 0;
      });
      return d;
    },
    fly: (pg, id) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), d = 2.6 * slow();
      pg.tween(d, (t) => {
        const a = easeInOut(t) * Math.PI * 2;
        b.position.set(bs.x + Math.sin(a) * 0.06, bs.y + (1 - Math.cos(a)) * 0.03, bs.z + Math.sin(a * 2) * 0.01);
      }, () => b.position.set(bs.x, bs.y, bs.z));
      return d;
    },
    slideLeft: (pg, id) => slideToggle(pg, id, -0.1),
    slideRight: (pg, id) => slideToggle(pg, id, 0.1),
    rise: (pg, id) => pg.rise(id, -pg.C(id).h * 0.6, 0.85),
    // ドアのように ひらく（もう一度で しまる）。ちょうつがいは "pivot": "left"（左の はし）か "right"（右の はし）。
    // どちらも 手前（へやの中）に ひらく
    // ひらく／しめる（"pivot": "left" / "right" の ドア）。へやの ドアは 外へ（かべの むこうへ）ひらく。
    // "opens": "in" の 絵（たんす・れいぞうこ・とだな・はこ）は 手前へ ひらく。
    // 外へ ひらく ドアは、うしろに 立つ 外の けしき（"depth" の 絵）に ぶつからない ところまで ひらく
    open: (pg, id) => {
      const c = pg.C(id), b = c.body, from = b.rotation.y, right = c.m.pivot === "right";
      let to = 0;
      if (Math.abs(from) < 0.1) {
        if (c.m.opens === "in") to = right ? 1.45 : -1.45;
        else {
          let a = 1.3;
          for (const k of Object.values(pg.cards)) {
            if (!k.m.depth || k.m.parent !== c.m.parent || k.m.x > c.m.x + c.m.w || k.m.x + k.m.w < c.m.x) continue;
            a = Math.min(a, Math.asin(Math.max(0.2, Math.min(1, (k.m.depth - 14) / Math.max(1, c.m.w)))));
          }
          to = right ? -a : a;
        }
      }
      pg.tween(1.1, (t) => {
        b.rotation.y = from + (to - from) * easeInOut(t);
      });
    },
    // ---- とびだす・でてくる ----
    // かくれていたものが ぽーんと とび出して、くるっと回って もとに もどる（おべんとうの おにぎり）
    popBack: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), was = c.hidden;
      pg.show(id);
      pg.tween(
        1.2,
        (t) => {
          b.position.y = bs.y + Math.sin(Math.PI * t) * 0.12 * pw(spec);
          b.rotation.z = easeInOut(t) * Math.PI * 2;
        },
        () => {
          b.position.y = bs.y;
          b.rotation.z = 0;
          if (was) pg.hide(id);
        }
      );
      return 1.2;
    },
    // あなから 出てきて、少しして もどる（はと時計の はと）
    peek: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), was = c.hidden, k = pw(spec);
      pg.show(id);
      const at = (u) => {
        b.position.z = bs.z + 0.03 * k * u;
        b.position.y = bs.y + 0.012 * k * u;
      };
      pg.tween(0.5, (t) => at(easeInOut(t)));
      pg.later(1200, () => pg.tween(0.45, (t) => at(1 - easeInOut(t)), () => {
        b.position.set(bs.x, bs.y, bs.z);
        if (was) pg.hide(id);
      }));
      return 1.65;
    },
    // 手前に 出てくる／もどる（ひきだし）
    pullOut: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), z = 0.045 * pw(spec);
      pg.tween(0.5, (t) => {
        const k = easeInOut(t);
        b.position.z = bs.z + z * k;
        b.position.y = bs.y - 4e-3 * k;
      });
      return 0.5;
    },
    pushIn: (pg, id) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), z0 = b.position.z, y0 = b.position.y;
      pg.tween(0.4, (t) => {
        const k = easeInOut(t);
        b.position.z = z0 + (bs.z - z0) * k;
        b.position.y = y0 + (bs.y - y0) * k;
      }, () => b.position.set(bs.x, bs.y, bs.z));
      return 0.4;
    },
    // 上から 落ちてきて、ぽんぽん はねる
    dropIn: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), h = 0.25 * pw(spec);
      pg.show(id);
      const bounce = (t) => {
        const n = 7.5625, d = 2.75;
        if (t < 1 / d) return n * t * t;
        if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
        if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
        return n * (t -= 2.625 / d) * t + 0.984375;
      };
      pg.tween(1.3, (t) => {
        b.position.y = bs.y + h * (1 - bounce(t));
      }, () => {
        b.position.y = bs.y;
      });
      return 1.3;
    },
    // ---- とぶ・ころぶ・ぶつかる ----
    // とび立って、ひとまわりして もどってくる（カラス・ちょう）
    flyOff: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), k = dirOf(spec, faceOf(pg, id)), p = pw(spec);
      pg.tween(2.2, (t) => {
        const u = Math.sin(Math.PI * t);
        b.position.set(bs.x + k * u * 0.08 * p, bs.y + u * 0.09 * p, bs.z + u * 0.05);
        b.rotation.z = Math.sin(t * Math.PI * 8) * 0.1 * u;
      }, () => {
        b.position.set(bs.x, bs.y, bs.z);
        b.rotation.z = 0;
      });
      return 2.2;
    },
    // 前へ ぴょーんと とんで もどる（カエル）
    leap: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), k = dirOf(spec, faceOf(pg, id)), p = pw(spec);
      pg.tween(0.8, (t) => {
        const u = Math.sin(Math.PI * t);
        b.position.y = bs.y + u * 0.07 * p;
        b.position.x = bs.x + k * u * 0.03 * p;
      }, () => b.position.set(bs.x, bs.y, bs.z));
      return 0.8;
    },
    // "with" の絵と ゴツンと ぶつかる（2つが よって、はなれる）
    bonk: (pg, id, hit, spec) => {
      const a = pg.C(id), o = other(pg, spec), oc = o && pg.C(o), ba = pg.base(a), bo = oc && pg.base(oc);
      const k = oc ? Math.sign(oc.pvx - a.pvx) || 1 : dirOf(spec, 1), d = 0.035 * pw(spec);
      pg.tween(0.75, (t) => {
        const u = t < 0.47 ? easeInOut(t / 0.47) : 1 - easeInOut((t - 0.47) / 0.53);
        a.body.position.x = ba.x + k * u * d;
        if (oc) oc.body.position.x = bo.x - k * u * d;
      }, () => {
        a.body.position.x = ba.x;
        if (oc) oc.body.position.x = bo.x;
      });
      pg.later(350, () => pg.burst(oc ? pg.top(id, 0.85).lerp(pg.top(o, 0.85), 0.5) : pg.top(id, 0.85), 14, 1, ["#ffe36b", "#ffffff"]));
      return 0.8;
    },
    // ドテッと ころぶ（たおれたまま）／おきあがる／ころんで 少しして おきあがる
    tumble: (pg, id, hit, spec) => fall(pg, id, dirOf(spec, faceOf(pg, id))),
    getUp: (pg, id) => getUp(pg, id),
    trip: (pg, id, hit, spec) => {
      fall(pg, id, dirOf(spec, faceOf(pg, id)));
      pg.later(1500, () => getUp(pg, id));
      return 2.1;
    },
    // 前に かたむく／もどる（いわを おす）
    lean: (pg, id, hit, spec) => {
      const b = pg.C(id).body, from = b.rotation.z, to = -0.1 * dirOf(spec, 1) * pw(spec);
      pg.tween(0.45, (t) => {
        b.rotation.z = from + (to - from) * easeInOut(t);
      });
      return 0.45;
    },
    unlean: (pg, id) => {
      const b = pg.C(id).body, from = b.rotation.z;
      pg.tween(0.45, (t) => {
        b.rotation.z = from * (1 - easeInOut(t));
      });
      return 0.45;
    },
    // ---- ずれる・ながれる・ふるえる ----
    // ググッと 少し ずれる。もう一度で もどる（小石）
    nudge: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), dx = 0.014 * dirOf(spec, 1) * pw(spec);
      const out = Math.abs(b.position.x - bs.x) > Math.abs(dx) / 2, from = b.position.x, to = out ? bs.x : bs.x + dx;
      pg.tween(0.65, (t) => {
        b.position.x = from + (to - from) * easeInOut(t);
        b.rotation.z = Math.sin(t * Math.PI) * -0.08 * Math.sign(dx || 1);
      }, () => {
        b.rotation.z = 0;
      });
      return 0.65;
    },
    // もくもく ふくらみながら、ゆっくり ながれていって、また ゆっくり もどってくる（けむり・くも）
    drift: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), k = dirOf(spec, faceOf(pg, id)), p = pw(spec);
      pg.tween(4, (t) => {
        const u = Math.sin(Math.PI * t);
        const s = 1 + 0.2 * p * u;
        b.scale.set(s, s, 1);
        b.position.x = bs.x + k * 0.08 * p * (1 - Math.cos(Math.PI * 2 * t)) / 2;
      }, () => {
        b.scale.set(1, 1, 1);
        b.position.x = bs.x;
      });
      return 4;
    },
    // コンコン：ゆっくり 2回 かたむいて もどる（家・きりかぶ・とびらを たたく。shake より ゆっくり 大きめ）
    knock: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), p = pw(spec) * small();
      pg.tween(1, (t) => {
        const k = Math.sin(Math.PI * (t * 2 % 1));
        b.rotation.z = -0.03 * p * k;
        b.position.x = bs.x + 7e-3 * p * k;
      }, () => {
        b.rotation.z = 0;
        b.position.x = bs.x;
      });
      return 1;
    },
    // こまかく ふるえる（コオロギ・こわい）
    shiver: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), a = 4e-3 * pw(spec);
      pg.tween(1.2, (t) => {
        b.position.x = bs.x + Math.sin(t * Math.PI * 14) * a * Math.sin(Math.PI * t);
      }, () => {
        b.position.x = bs.x;
      });
      return 1.2;
    },
    // ---- 気持ち ----
    // うんうん（うなずく）
    nod: (pg, id, hit, spec) => {
      const b = pg.C(id).body, p = pw(spec);
      pg.tween(1.1, (t) => {
        b.rotation.x = Math.max(0, Math.sin(t * Math.PI * 2)) * 0.28 * p;
      }, () => {
        b.rotation.x = 0;
      });
      return 1.1;
    },
    // いやいや（首を よこに ふる）
    shakeHead: (pg, id, hit, spec) => {
      const b = pg.C(id).body, p = pw(spec);
      pg.tween(1.2, (t) => {
        b.rotation.y = Math.sin(t * Math.PI * 4) * 0.35 * p * Math.sin(Math.PI * t);
      }, () => {
        b.rotation.y = 0;
      });
      return 1.2;
    },
    // ぺこり（おじぎ）
    bow: (pg, id, hit, spec) => {
      const b = pg.C(id).body, p = pw(spec);
      pg.tween(1.5, (t) => {
        b.rotation.x = Math.sin(Math.PI * t) * 0.5 * p;
      }, () => {
        b.rotation.x = 0;
      });
      return 1.5;
    },
    // うろうろ（いったり きたり）
    pace: (pg, id, hit, spec) => {
      const c = pg.C(id), b = c.body, bs = pg.base(c), p = pw(spec);
      pg.tween(2.8, (t) => {
        b.position.x = bs.x + Math.sin(t * Math.PI * 4) * 0.035 * p;
        b.position.y = bs.y + Math.abs(Math.sin(t * Math.PI * 12)) * 8e-3;
      }, () => {
        b.position.x = bs.x;
        b.position.y = bs.y;
      });
      return 2.8;
    },
    // ---- はずむ ----
    // びよーんと のびて ちぢむ
    stretch: (pg, id, hit, spec) => {
      const b = pg.C(id).body, p = pw(spec);
      pg.tween(1.1, (t) => {
        const e = Math.sin(t * Math.PI * 3) * (1 - t) * 0.3 * p;
        b.scale.set(1 - e * 0.5, 1 + e, 1);
      }, () => b.scale.set(1, 1, 1));
      return 1.1;
    },
    // ---- つみき ----
    // 上に つんだ絵（parent を この絵にした絵）が ガラガラ くずれて、少しして つみなおす
    crumble: (pg, id) => {
      const base = pg.C(id), kids = Object.values(pg.cards).filter((c) => c.m.parent === id && !c.hidden);
      pg.wobble(id, 0.05, 0.7);
      kids.forEach((c, i) => {
        const b = c.body, bs = pg.base(c), up = c.pivotHome.y;
        const side = c.pvx >= base.pvx ? 1 : -1, dx = side * (0.02 + 0.018 * i + Math.random() * 0.01);
        const rot = -side * (0.5 + Math.random() * 0.9);
        pg.tween(0.7, (t) => {
          b.position.x = bs.x + dx * t;
          b.position.y = bs.y - up * t * t + Math.sin(Math.PI * t) * 0.015;
          b.rotation.z = rot * t;
        });
        pg.later(1800 + i * 220, () => {
          const x0 = b.position.x, y0 = b.position.y, r0 = b.rotation.z;
          pg.tween(0.6, (t) => {
            const k = easeInOut(t);
            b.position.x = x0 + (bs.x - x0) * k;
            b.position.y = y0 + (bs.y - y0) * k + Math.sin(Math.PI * t) * 0.03;
            b.rotation.z = r0 * (1 - k);
          }, () => {
            b.position.set(bs.x, bs.y, bs.z);
            b.rotation.z = 0;
          });
        });
      });
      return 1.8 + kids.length * 0.22 + 0.65;
    },
    none: () => {
    }
  };
  function slideToggle(pg, id, dx) {
    const c = pg.C(id), bs = pg.base(c);
    pg.moveTo(id, Math.abs(bs.x) > 0.01 ? 0 : dx, void 0, void 0, 1, easeInOut);
    return 1;
  }
  function fall(pg, id, k) {
    const c = pg.C(id), b = c.body, bs = pg.base(c), r0 = b.rotation.z;
    pg.tween(0.8, (t) => {
      b.rotation.z = r0 + (-0.7 * k - r0) * Math.sin(Math.PI * t * 0.5);
      b.position.x = bs.x + 0.05 * k * t;
      b.position.y = bs.y + Math.sin(Math.PI * t) * 0.03;
    });
    return 0.8;
  }
  function getUp(pg, id) {
    const c = pg.C(id), b = c.body, bs = pg.base(c), r0 = b.rotation.z, x0 = b.position.x;
    pg.tween(0.6, (t) => {
      const k = easeInOut(t);
      b.rotation.z = r0 * (1 - k);
      b.position.x = x0 + (bs.x - x0) * k;
    }, () => {
      b.rotation.z = 0;
      b.position.x = bs.x;
    });
    return 0.6;
  }
  var MOVE_TIME = { hop: 0.7, bigHop: 0.8, jump2: 1.1, wobble: 1.1, shake: 0.9, spin: 1.2, turn: 1.2, pulse: 0.7, swing: 2, topple: 1.4, roll: 1.7, fly: 2.6, slideLeft: 1, slideRight: 1, rise: 0.85, open: 1.1, none: 0 };
  var LONG_MOVES = ["spin", "turn", "swing", "topple", "roll", "fly", "slideLeft", "slideRight", "rise", "open"];
  var autoWait = (spec) => spec.move && LONG_MOVES.includes(spec.move) ? MOVE_TIME[spec.move] * (["spin", "turn", "roll", "fly"].includes(spec.move) ? slow() : 1) + 0.05 : 0;
  var EFFECTS = {
    sparkle: (pg, id) => pg.burst(id, 16, 1),
    leaves: (pg, id) => pg.leaves(pg.top(id, 0.7), 12),
    petals: (pg, id) => pg.leaves(pg.top(id, 0.7), 12, ["#ffc1d4", "#fff3f6", "#ffd1e1"]),
    steam: (pg, id) => pg.puff(pg.top(id, 0.85), 14, "#ffffff", 0.02, 0.15, 0.04),
    bubbles: (pg, id) => pg.puff(pg.top(id, 0.9), 16, "#e8f8ff", 0.01, 0.18, 0.018),
    ripple: (pg, id, hit) => pg.ripple(hit ? hit.point : pg.top(id, 0.3)),
    firework: (pg, id) => {
      const p = pg.top(id, 1);
      const target = p.clone().add(pg.up.clone().multiplyScalar(0.25));
      pg.firework(target, fireworkColor(id), "#ffffff", "peony", p);
    },
    glow: (pg, id) => {
      const c = pg.C(id);
      if (c.glowing) {
        c.glowFlash = pg.time;
        return;
      }
      addHalo(pg, id, Math.max(0.08, Math.min(0.2, c.w * 1.4)));
      c.halo.visible = true;
      pg.tween(2.2, (t) => {
        blinkHalo(c, pg.time);
        c.halo.material.opacity *= Math.min(1, t * 6, (1 - t) * 6);
      }, () => {
        c.halo.visible = false;
      });
    }
  };
  var moveOf = (pg, name) => pg.logic && pg.logic.moves && pg.logic.moves[name] || MOVES[name];
  function seqTime(spec) {
    let t = 0, end = autoWait(spec);
    for (const st of [].concat(spec.then || [])) {
      t += st.delay || 0;
      end = Math.max(end, t + seqTime(st));
    }
    return end;
  }
  function talkPlan(pg, id, spec) {
    const who = [];
    let at = -1;
    const walkSteps = (st, t) => {
      if (st.say) {
        const target = st.on && pg.C(st.on) ? st.on : id;
        who.push(st.who && st.who !== target && pg.C(st.who) ? st.who : target);
        at = Math.max(at, t);
      }
      let d = t;
      for (const n of [].concat(st.then || [])) {
        d += n.delay || 0;
        walkSteps(n, d);
      }
    };
    walkSteps(spec, 0);
    return who.length ? { who, at } : null;
  }
  function react(pg, id, spec, hit, opts = {}) {
    if (!spec) return;
    if (!pg.C(id)) return;
    if ((spec.need || spec.if || spec.give) && (!holds(spec, pg) || spec.give && !has(spec.give))) {
      if (spec.else) react(pg, id, spec.else, hit, { ...opts, idx: `${opts.idx || id}:else` });
      return;
    }
    const key = `touch:${spec.lock || id}`;
    const lockKey = opts.lockKey || (!opts.free && typeof spec.wait !== "number" ? key : null);
    const talk = !opts.step && !opts.auto && talkPlan(pg, id, spec), talkKey = `talk:${spec.lock || id}`;
    if (talk && pg.talking(talkKey)) return false;
    if (!opts.free) {
      if (pg.isBusy(key)) return;
      const wait = typeof spec.wait === "number" ? spec.wait : seqTime(spec);
      if (wait > 0) pg.busy(key, wait);
    }
    if (talk) pg.talkLock(talkKey, talk.who, talk.at);
    const target = spec.on && pg.C(spec.on) ? spec.on : id;
    const took = act(pg, target, spec, hit, opts.idx || id);
    if (lockKey && took > 0) pg.busy(lockKey, took + 0.05);
    let t = 0;
    [].concat(spec.then || []).forEach((st, k) => {
      t += st.delay || 0;
      pg.later(t * 1e3, () => react(pg, id, st, null, { free: true, step: true, idx: `${opts.idx || id}:then${k}`, lockKey }));
    });
  }
  function act(pg, id, spec, hit, idxKey) {
    const c = pg.C(id);
    let took = 0;
    const who = spec.who || (isCast(id) ? id : null);
    const i = nextIdx(pg, `${idxKey}${id === idxKey ? "" : `>${id}`}`);
    const step = Array.isArray(spec.swap) ? nextIdx(pg, `${idxKey}:swap`) : null;
    const at = (v) => step === null || !Array.isArray(v) ? pick2(v, i) : v[Math.min(step, v.length - 1)];
    const mv = spec.move && moveOf(pg, Array.isArray(spec.move) ? pick2(spec.move, i) : spec.move);
    if (mv) {
      const r = mv(pg, id, hit, spec);
      if (typeof r === "number") took = Math.max(took, r);
    }
    if (spec.sound) pg.sfx(spec.sound, who || id);
    if (spec.word) pg.ono(at(spec.word), hit && spec.wordAt === "touch" ? hit.point : id, spec.color);
    const by = spec.who && spec.who !== id && pg.C(spec.who) ? spec.who : id;
    if (spec.say) pg.say(by, at(spec.say), by, who || id);
    if (Array.isArray(spec.swap)) pg.swap(id, altKey(pg, id, at(spec.swap)));
    else if (spec.swap) {
      const main = c.m.tex[0], alt = spec.swap === "base" ? main : altKey(pg, id, spec.swap);
      const showing = pg.texOf(id) !== main;
      if (spec.back === 0 || spec.back === "toggle") pg.swap(id, showing ? main : alt);
      else if (spec.back === false) {
        clearTimeout(c._backT);
        pg.swap(id, alt);
      } else {
        pg.swap(id, alt);
        clearTimeout(c._backT);
        c._backT = pg.later((spec.back || 2.5) * 1e3, () => pg.swap(id, main));
      }
    }
    if (spec.effect && EFFECTS[spec.effect]) EFFECTS[spec.effect](pg, id, hit);
    if (spec.show && pg.C(spec.show) && pg.C(spec.show).hidden) {
      pg.rise(spec.show, -pg.C(spec.show).h, 0.85);
      if (spec.hideAfter) pg.later(spec.hideAfter * 1e3, () => pg.hide(spec.show));
    }
    if (spec.mark) pg.mark(id, pick2(spec.mark, i));
    if (spec.walk && canTravel(pg, id)) {
      const w = Array.isArray(spec.walk) ? { points: spec.walk } : spec.walk;
      took = Math.max(took, walk(pg, id, w.points, { flip: !!w.flip, back: true }) || 0);
    }
    if (spec.light) (spec.light === true ? [id] : [].concat(spec.light)).forEach((l) => pg.C(l) && light(pg, l, !pg.C(l).lit));
    if (spec.reveal) reveal(pg, id, spec.reveal);
    if (spec.get) pg.getItem(spec.get);
    if (spec.give && giveItem(spec.give)) handOver(pg, spec.give, id);
    if (spec.join) join(spec.join);
    if (spec.remember) for (const [k, v] of Object.entries(spec.remember)) remember(k, v, itemOf(v).name);
    return took;
  }
  function parseAct(a) {
    if (!a) return [];
    return (Array.isArray(a) ? a : [a]).map((x) => typeof x === "string" ? { id: x.split(":")[0], move: x.split(":")[1] || "hop" } : x);
  }
  function defaultNarration(pg, def) {
    return (def.story || []).map((s, line) => {
      const item = typeof s === "string" ? { text: s } : s;
      const acts = parseAct(item.act);
      return { text: item.text, line, voice: voice("n"), onstart: acts.length ? () => acts.forEach((a, k) => pg.later(400 + k * 400, () => pg.C(a.id) && moveOf(pg, a.move) && moveOf(pg, a.move)(pg, a.id))) : null };
    });
  }
  function castProgress(p) {
    if (p && p.cast) {
      const ids = castIds();
      return { ...p, colors: ids.map(markColor), total: p.total || ids.length };
    }
    return p;
  }
  function whenNow(pg) {
    for (const c of Object.values(pg.cards)) {
      const w = c.m.when;
      if (!w) continue;
      if (!c.m.hidden) {
        if (holds(w)) pg.show(c.id);
        else pg.hide(c.id);
      } else if (holds(w)) pg.show(c.id);
    }
  }
  function whenHide(pg) {
    for (const c of Object.values(pg.cards)) {
      const w = c.m.when;
      if (w && !c.m.hidden) {
        if (!holds(w)) pg.hide(c.id);
        else if (c.hidden) pg.show(c.id);
      }
    }
  }
  function pageOpen(pg) {
    let k = 0;
    for (const c of Object.values(pg.cards)) {
      const w = c.m.when;
      if (w && !c.m.hidden) {
        if (holds(w)) {
          if (c.hidden) pg.show(c.id);
        } else pg.hide(c.id);
        continue;
      }
      if (w && c.hidden && holds(w)) pg.later(200 + k++ * 220, () => {
        if (c.hidden) {
          pg.rise(c.id, -c.h, 0.85);
          pg.later(600, () => pg.burst(c.id, 10, 0.8, ["#fff2a8", "#ffffff"]));
        }
      });
      if (c.id in MEM.looks) {
        const look = MEM.looks[c.id], key = look ? `${c.id}@${look}` : c.m.tex[0];
        if (pg.tex[key] && pg.texOf(c.id) !== key) pg.swap(c.id, key);
      }
    }
  }
  function pageTexts(def, pieces2 = [], script = {}) {
    const out = [], ids = new Set(pieces2);
    const walk2 = (o, who) => {
      if (!o || typeof o !== "object") return;
      if (Array.isArray(o)) {
        o.forEach((x) => walk2(x, who));
        return;
      }
      const w = o.who || o.item || o.on || o.spot || who;
      for (const x of o.say === void 0 ? [] : [].concat(o.say)) {
        if (typeof x === "string") out.push({ kind: "b", text: x, who: w });
        else if (x && typeof x === "object" && typeof x.text === "string") out.push({ kind: "b", text: x.text, who: x.who || w });
      }
      for (const x of [].concat(o.word || [])) if (typeof x === "string") out.push({ kind: "o", text: x, color: o.color });
      for (const [k, v] of Object.entries(o)) if (k !== "say" && v && typeof v === "object") walk2(v, ids.has(k) ? k : w);
    };
    for (const [id, spec] of Object.entries(def.touch || {})) walk2(spec, id);
    if (def.goal) walk2(def.goal, def.goal.who || null);
    const G = def.goal && GOALS[def.goal.type];
    if (G && G.texts) out.push(...G.texts(def.goal));
    out.push(...skyWords(def, pieces2, script));
    const seen = /* @__PURE__ */ new Set();
    return out.filter((x) => {
      const k = `${x.kind}|${x.kind === "b" ? x.who : x.color}|${x.text}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
  var callsFinale = (script) => [...Object.values(script || {}), ...Object.values(script && script.moves || {})].some((f) => typeof f === "function" && /\bfinale\w*\(/.test(String(f)));
  function skyWords(def, pieces2, script) {
    const out = [], ids = castIds(), boom = (text, color) => out.push({ kind: "o", text, color });
    if (def.skyFireworks) for (const c of ids.length ? ids.map(fireworkColor) : ["#ffd84a"]) {
      boom("ドーン！", c);
      boom("パーン！", c);
    }
    if (JSON.stringify(def).includes('"finale"') || callsFinale(script)) {
      const cols = [...ids.filter((id) => pieces2.includes(id)).map(fireworkColor), "#ffe9a0", "#ffffff"];
      for (let i = 0; i < 14; i += 3) boom(["ドーン！", "パーン！", "ドドーン！"][i / 3 % 3], cols[i % cols.length]);
      boom("ドドーン！", "#ffd84a");
    }
    return out;
  }
  function makeLogic(def, script, pieces2 = []) {
    script = script || {};
    const g = def.goal && GOALS[def.goal.type] ? def.goal : null;
    const G = g ? GOALS[g.type] : null;
    const touch = def.touch || {};
    const ambient = {};
    for (const [id, spec] of Object.entries(touch)) ambient[id] = (pg, hit) => pg.done && spec.after ? react(pg, id, spec.after, hit, { idx: `${id}:after` }) : react(pg, id, spec, hit);
    const L = {
      name: def.name ?? script.name ?? "",
      hint: def.hint ?? script.hint ?? (g ? goalHint(g) : "いろいろ さわってみてね"),
      progress: castProgress(def.progress !== void 0 ? def.progress : script.progress !== void 0 ? script.progress : g ? goalProgress(g) : null),
      twinkle: def.twinkle ?? script.twinkle,
      twinkleArea: def.twinkleArea ?? script.twinkleArea,
      sky: !!(def.skyFireworks || script.sky),
      maxParticles: def.maxParticles ?? script.maxParticles,
      moves: script.moves || {},
      // this page's own moves (script.js), usable as "move" in page.json
      weather: def.weather,
      // snow / rain / petals / leaves / fireflies / bubbles / stars
      ambience: def.ambience,
      // a quiet sound all the time: waves / wind / rain / stream / insects / birds / fire
      dark: def.dark || 0,
      // the page starts darker (0 … 0.6)
      texts: pageTexts(def, pieces2, script),
      // its lines and words, to draw before they are needed
      init(pg) {
        pg.gs = {};
        if (pg._opened) whenNow(pg);
        if (G) {
          G.init(pg, g);
          const p = L.progress;
          if (p) pg.progress(0, p.total || 0);
        }
        if (script.init) script.init(pg);
      },
      update(pg, dt) {
        if (G) goalUpdate(pg, g, dt);
        if (script.update) script.update(pg, dt);
      },
      // story time is over: the games that start now (a question, things popping up), and the hint clock
      play(pg) {
        pg.gs.lastMove = pg.time;
        if (G && G.play) G.play(pg, g);
        if (script.play) script.play(pg);
      },
      // a finger pressed on a piece: true when the game wants the finger's movement ("rub")
      grab(id, pg, hit) {
        return !!(G && G.grab && G.grab(pg, g, id, hit));
      },
      rub(id, pg, hit, px2) {
        if (G && G.rub) G.rub(pg, g, id, hit, px2);
      },
      release(id, pg, hit) {
        if (G && G.release) G.release(pg, g, id, hit);
      },
      tap(id, pg, hit) {
        if (script.tap && script.tap(id, pg, hit)) return true;
        if (G && G.tap(pg, g, id, hit)) return true;
        if (def.skyFireworks && (id === "sky" || id === "plate" && hit.point.y > -0.02)) {
          const ids = castIds();
          const col = ids.length ? fireworkColor(ids[Math.floor(Math.random() * ids.length)]) : "#ffd84a";
          const target = id === "sky" ? hit.point.clone() : hit.point.clone().add(pg.up.clone().multiplyScalar(0.22));
          pg.firework(target, col, "#ffffff", "peony", new THREE10.Vector3(target.x, -0.08, 0.01), () => pg.ono(Math.random() < 0.5 ? "ドーン！" : "パーン！", target.clone().add(pg.up.clone().multiplyScalar(0.08)), col));
          return true;
        }
        return false;
      },
      ambient: { ...ambient, ...script.ambient || {} },
      narration(pg) {
        return script.narration ? script.narration(pg) : defaultNarration(pg, def);
      },
      opening(pg) {
        whenHide(pg);
      },
      // the page is shown (again): what other pages left behind comes out, then the game and the page's own script
      open(pg) {
        pg._opened = true;
        pageOpen(pg);
        if (G && G.open) G.open(pg, g);
        if (script.open) script.open(pg);
      }
    };
    return L;
  }

  // system/engine/nurie.js
  var T = (ja) => esc(tr(ja));
  var WHITE2 = "#ffffff";
  var HELP = "#c9c0d3";
  var THIN = "#d9d2e0";
  var PALETTE = [
    ["#e8452c", "あか"],
    ["#ff8fb1", "ピンク"],
    ["#f39a2b", "だいだい"],
    ["#ffd93b", "きいろ"],
    ["#a6d84a", "きみどり"],
    ["#3fa34d", "みどり"],
    ["#6fc8f0", "みずいろ"],
    ["#2f6fd6", "あお"],
    ["#8b5cc7", "むらさき"],
    ["#9a6236", "ちゃいろ"],
    ["#ffd7b0", "はだいろ"],
    ["#a7a7a7", "はいいろ"],
    ["#3a3340", "くろ"],
    ["#ffffff", "しろ"]
  ];
  var SHAPES = /* @__PURE__ */ new Set(["path", "rect", "circle", "ellipse", "polygon", "polyline"]);
  var SKIP = /* @__PURE__ */ new Set(["defs", "clipPath", "mask", "pattern", "marker", "symbol", "linearGradient", "radialGradient", "filter", "style", "title", "desc", "metadata"]);
  var GEO = ["d", "points", "x", "y", "width", "height", "cx", "cy", "r", "rx", "ry", "transform"];
  var NAMED = { white: "#ffffff", black: "#000000", red: "#ff0000", none: "none", transparent: "none" };
  function norm3(c) {
    if (c == null) return null;
    c = String(c).trim().toLowerCase();
    if (NAMED[c]) return NAMED[c];
    if (/^#[0-9a-f]{3}$/.test(c)) return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
    if (/^#[0-9a-f]{6}/.test(c)) return c.slice(0, 7);
    if (c.startsWith("url")) return "url";
    return c;
  }
  function luma(hex) {
    if (!/^#[0-9a-f]{6}$/.test(hex)) return 1;
    const v = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255);
    return 0.299 * v[0] + 0.587 * v[1] + 0.114 * v[2];
  }
  function own(el, name) {
    const st = el.getAttribute("style");
    if (st) {
      const m = new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`).exec(st);
      if (m) return m[1].trim();
    }
    const a = el.getAttribute(name);
    return a == null ? null : a;
  }
  function inherit(el, name) {
    for (let e = el; e && e.nodeType === 1; e = e.parentNode) {
      const v = own(e, name);
      if (v != null && v !== "inherit") return v;
    }
    return null;
  }
  function opacity(el) {
    let o = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentNode) {
      const v = own(e, "opacity");
      if (v != null) o *= parseFloat(v) || 0;
    }
    const fo = inherit(el, "fill-opacity");
    return o * (fo == null ? 1 : parseFloat(fo));
  }
  function setOwn(el, name, value) {
    const st = el.getAttribute("style");
    if (st) el.setAttribute("style", st.replace(new RegExp(`(?:^|;)\\s*${name}\\s*:[^;]*`, "g"), ""));
    if (value == null) el.removeAttribute(name);
    else el.setAttribute(name, value);
  }
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(36);
  }
  function sigOf(el) {
    let s = el.nodeName;
    for (const a of GEO) {
      const v = el.getAttribute(a);
      if (v != null) s += `|${a}=${v}`;
    }
    for (let e = el.parentNode; e && e.nodeType === 1; e = e.parentNode) {
      const t = e.getAttribute("transform");
      if (t) s += `<${t}`;
    }
    return hash(s);
  }
  function* shapes(node) {
    for (const el of node.children || []) {
      if (SKIP.has(el.nodeName)) continue;
      if (SHAPES.has(el.nodeName)) yield el;
      yield* shapes(el);
    }
  }
  function prepare(text, prefix = "") {
    if (prefix) {
      text = text.replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`).replace(/(xlink:)?href="#([^"]+)"/g, (m, x, id) => `${x || ""}href="#${prefix}${id}"`);
    }
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    const svg = doc.documentElement;
    if (!svg || svg.nodeName !== "svg" || doc.getElementsByTagName("parsererror").length) return null;
    const count = {};
    for (const el of shapes(svg)) {
      const s = norm3(inherit(el, "stroke"));
      if (s && s !== "none") count[s] = (count[s] || 0) + 1;
    }
    const ink = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
    const inkColor = ink ? ink[0] : "#000000";
    const parts = [], seen = {};
    for (const el of shapes(svg)) {
      const given = inherit(el, "fill"), stroke = norm3(inherit(el, "stroke"));
      const fill2 = given == null && stroke && stroke !== "none" ? "none" : norm3(given ?? "#000000");
      if (fill2 === "none") {
        const st2 = norm3(inherit(el, "stroke"));
        if (!st2 || st2 === "none" || st2 === "url" || st2 === inkColor || luma(st2) < 0.12) continue;
        if (opacity(el) < 0.95) {
          el.setAttribute("display", "none");
          continue;
        }
        const sig2 = sigOf(el), n2 = seen[sig2] = (seen[sig2] ?? -1) + 1;
        parts.push({ el, key: n2 ? `${sig2}.${n2}` : sig2, orig: `line:${st2}`, line: parseFloat(inherit(el, "stroke-width") ?? "1") >= 8 ? "thick" : "thin" });
        continue;
      }
      if (opacity(el) < 0.95) {
        el.setAttribute("display", "none");
        continue;
      }
      if (/\b(eye|mouth|shine|ink|line)\b/.test(el.getAttribute("class") || "")) continue;
      if (fill2 !== "url" && (fill2 === inkColor || luma(fill2) < 0.12)) continue;
      const sig = sigOf(el), n = seen[sig] = (seen[sig] ?? -1) + 1;
      const st = norm3(inherit(el, "stroke")), sw = parseFloat(inherit(el, "stroke-width") ?? "1");
      parts.push({ el, key: n ? `${sig}.${n}` : sig, orig: fill2, lined: !!st && st !== "none" && sw > 0 });
    }
    return { doc, svg, parts };
  }
  function paint(el, color, lined, line) {
    if (line) {
      setOwn(el, "stroke", color || (line === "thick" ? WHITE2 : THIN));
      setOwn(el, "stroke-opacity", null);
      return;
    }
    setOwn(el, "fill", color || WHITE2);
    setOwn(el, "fill-opacity", null);
    if (!lined) {
      if (color) {
        setOwn(el, "stroke", null);
        setOwn(el, "stroke-width", null);
      } else {
        setOwn(el, "stroke", HELP);
        setOwn(el, "stroke-width", "2");
      }
    }
  }
  function fallbackOf(prep, colors) {
    const by = {};
    for (const p of prep.parts) {
      const c = colors[p.key];
      if (!c) continue;
      (by[p.orig] ||= {})[c] = ((by[p.orig] || {})[c] || 0) + 1;
    }
    const out = {};
    for (const [o, cs] of Object.entries(by)) out[o] = Object.entries(cs).sort((a, b) => b[1] - a[1])[0][0];
    return out;
  }
  function colorAll(prep, colors, fallback) {
    for (const p of prep.parts) paint(p.el, colors[p.key] || fallback && fallback[p.orig] || null, p.lined, p.line);
  }
  var canvas = (w, h) => {
    const c = document.createElement("canvas");
    c.width = Math.max(1, w);
    c.height = Math.max(1, h);
    return c;
  };
  async function svgImage(prep) {
    const text = new XMLSerializer().serializeToString(prep.svg);
    const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    try {
      const im = new Image();
      im.src = url;
      await im.decode();
      return im;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
    }
  }
  var pngImage = async (src) => {
    const im = new Image();
    im.src = src;
    await im.decode();
    return im;
  };
  function paper(c, o) {
    if (!o) return c;
    const out = canvas(c.width, c.height), g = out.getContext("2d");
    for (const r of [o.width, o.width * 0.5]) for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      g.drawImage(c, Math.cos(a) * r, Math.sin(a) * r);
    }
    g.globalCompositeOperation = "source-in";
    g.fillStyle = o.color;
    g.fillRect(0, 0, out.width, out.height);
    g.globalCompositeOperation = "source-over";
    g.drawImage(c, 0, 0);
    return out;
  }
  var KEY = (id) => `ehon-nurie:${id}`;
  var tick = () => new Promise((r) => setTimeout(r, 0));
  var underFirst = (list) => {
    const out = [];
    for (const m of list) {
      const k = m.behind && m.parent ? out.findIndex((x) => x.id === m.parent) : -1;
      if (k >= 0) out.splice(k, 0, m);
      else out.push(m);
    }
    return out;
  };
  var Nurie = class {
    constructor(ctx, data, assets2) {
      this.ctx = ctx;
      this.data = data;
      this.A = assets2;
      this.preps = {};
      this.runs = {};
      this.state = { bg: data.background === true, use: true, pages: {} };
      try {
        const s = JSON.parse(localStorage.getItem(KEY(data.id)) || "null");
        if (s && s.pages) {
          if (!s.bgSet) delete s.bg;
          Object.assign(this.state, s);
        }
      } catch (e) {
      }
      this.color = PALETTE[0][0];
      this.undo = [];
      this.dirty = /* @__PURE__ */ new Set();
    }
    get available() {
      return this.data.pages.some((p) => p.bg || Object.keys(p.tex || {}).length);
    }
    save() {
      try {
        localStorage.setItem(KEY(this.data.id), JSON.stringify(this.state));
      } catch (e) {
      }
    }
    pageId(i) {
      return this.A.pages[i].id;
    }
    colored(i) {
      const st = this.state.pages[this.pageId(i)];
      if (!st) return false;
      return Object.entries(st).some(([np, cs]) => (np !== "_bg" || this.state.bg) && Object.keys(cs).length);
    }
    prep(i, key, text) {
      const k = `${i}/${key}`;
      if (!this.preps[k]) this.preps[k] = prepare(text);
      return this.preps[k];
    }
    // the AR / preview pictures of page i: the colours, or the book's own (みほんの いろ / nothing coloured on the page)
    async apply(i) {
      const pg = this.ctx.pages[this.A.pages[i].n];
      if (!pg) return;
      const run = this.runs[i] = (this.runs[i] || 0) + 1;
      const N = this.data.pages[i], man = this.A.pages[i].manifest, st = this.state.pages[this.pageId(i)] || {};
      const on = this.state.use && this.colored(i);
      const ol = this.data.outline;
      for (const m of Object.values(man.pieces)) {
        for (const key of m.tex) {
          const t = pg.tex[key];
          if (!t) continue;
          if (!t.userData.orig) t.userData.orig = t.image;
          if (!on || !N.tex[key]) {
            if (t.image !== t.userData.orig) {
              t.image = t.userData.orig;
              t.needsUpdate = true;
            }
            continue;
          }
          const prep = this.prep(i, key, N.tex[key]);
          if (!prep) continue;
          const colors = st[m.id] || {};
          let fb = null;
          if (key !== m.id && N.tex[m.id]) {
            const base = this.prep(i, m.id, N.tex[m.id]);
            if (base) fb = fallbackOf(base, colors);
          }
          colorAll(prep, colors, fb);
          let c;
          try {
            const im = await svgImage(prep);
            c = canvas(m.w, m.h);
            c.getContext("2d").drawImage(im, -m.x, -m.y, 1600, 1200);
            c = paper(c, ol);
          } catch (e) {
            continue;
          }
          if (run !== this.runs[i]) return;
          t.image = c;
          t.needsUpdate = true;
          await tick();
        }
      }
      if (on && this.state.bg && N.bg) {
        const prep = this.prep(i, "_bg", N.bg);
        if (prep) {
          colorAll(prep, st._bg || {}, null);
          try {
            const c = canvas(1600, 1200), g = c.getContext("2d");
            g.fillStyle = "#ffffff";
            g.fillRect(0, 0, 1600, 1200);
            g.drawImage(await svgImage(prep), 0, 0, 1600, 1200);
            if (N.over) g.drawImage(await pngImage(N.over.src), N.over.x, N.over.y, N.over.w, N.over.h);
            if (run === this.runs[i]) pg.setPlate(c);
          } catch (e) {
          }
        }
      } else pg.setPlate(null);
    }
    async applyAll(list) {
      for (const i of list || this.A.pages.map((p, k) => k)) await this.apply(i);
    }
    // ---------- the ぬりえ screen ----------
    open(i = 0, onClose = null) {
      this.i = Math.max(0, Math.min(this.A.pages.length - 1, i));
      this.focus = null;
      this.onClose = onClose;
      this.useBefore = this.state.use;
      this.bgBefore = this.state.bg;
      let el = document.getElementById("nurie");
      if (!el) {
        el = document.createElement("div");
        el.id = "nurie";
        document.body.appendChild(el);
      }
      el.innerHTML = `
      <div class="nu-top">
        <button class="nu-btn nu-close" type="button">✓ ${T("おわる")}</button>
        <div class="nu-pages"><button class="nu-btn nu-prev" type="button" aria-label="${T("まえの ページ")}">◀</button><b class="nu-pn"></b><button class="nu-btn nu-next" type="button" aria-label="${T("つぎの ページ")}">▶</button></div>
        <button class="nu-btn nu-undo" type="button">↶ ${T("ひとつ もどす")}</button>
        <button class="nu-btn nu-clear" type="button">${T("はじめから")}</button>
      </div>
      <div class="nu-opts">
        <button class="nu-tog nu-bg" type="button"></button>
        <button class="nu-tog nu-use" type="button"></button>
      </div>
      <div class="nu-stage"><div class="nu-zoom"></div><div class="nu-fit"><button class="nu-btn nu-zin" type="button" aria-label="${T("おおきく")}">＋</button><button class="nu-btn nu-zout" type="button" aria-label="${T("ちいさく")}">－</button></div></div>
      <div class="nu-tray"></div>
      <div class="nu-palette">${PALETTE.map(([c, n]) => `<button class="nu-sw" type="button" data-c="${c}" style="--c:${c}" aria-label="${T(n)}"></button>`).join("")}<button class="nu-sw nu-erase" type="button" data-c="" aria-label="${T("けしゴム")}">${T("けす")}</button></div>
      <div class="nu-ask" hidden></div>`;
      el.hidden = false;
      this.el = el;
      document.body.classList.add("nurie-open");
      const q = (s) => el.querySelector(s);
      q(".nu-close").addEventListener("click", () => this.close());
      q(".nu-prev").addEventListener("click", () => this.go(this.i - 1));
      q(".nu-next").addEventListener("click", () => this.go(this.i + 1));
      q(".nu-undo").addEventListener("click", () => this.back());
      q(".nu-clear").addEventListener("click", () => this.askClear());
      q(".nu-bg").addEventListener("click", () => {
        this.state.bg = !this.state.bg;
        this.state.bgSet = true;
        this.save();
        this.dirty.add(this.i);
        this.draw();
      });
      q(".nu-use").addEventListener("click", () => {
        this.state.use = !this.state.use;
        this.save();
        this.opts();
      });
      q(".nu-zin").addEventListener("click", () => this.zoomBy(1.4));
      q(".nu-zout").addEventListener("click", () => this.zoomBy(1 / 1.4));
      el.querySelectorAll(".nu-sw").forEach((b) => b.addEventListener("click", () => {
        this.color = b.dataset.c;
        this.swatches();
      }));
      this.input(q(".nu-stage"));
      this.swatches();
      this.draw();
    }
    swatches() {
      this.el.querySelectorAll(".nu-sw").forEach((b) => b.classList.toggle("on", b.dataset.c === this.color));
    }
    opts() {
      const has2 = !!this.data.pages[this.i].bg, b = this.el.querySelector(".nu-bg");
      b.hidden = !has2;
      b.innerHTML = `${T("はいけいも ぬる")}：<b>${T(this.state.bg ? "オン" : "オフ")}</b>`;
      b.classList.toggle("on", this.state.bg);
      const u = this.el.querySelector(".nu-use");
      u.innerHTML = `${T("えほんの いろ")}：<b>${T(this.state.use ? "じぶんの いろ" : "みほんの いろ")}</b>`;
      u.classList.toggle("on", this.state.use);
    }
    go(i) {
      if (i < 0 || i >= this.A.pages.length) return;
      this.i = i;
      this.focus = null;
      this.draw();
    }
    // the page (or one picture that comes out later), as a line drawing with the colours so far
    draw() {
      const i = this.i, P = this.A.pages[i], N = this.data.pages[i], man = P.manifest;
      const st = this.state.pages[P.id] ||= {};
      this.el.querySelector(".nu-pn").textContent = `${i + 1}/${this.A.pages.length}`;
      this.opts();
      const parts = [];
      const add = (np, text, attrs = "") => {
        const prep = prepare(text, `n${i}_${np}_`);
        if (!prep) return false;
        for (const p of prep.parts) {
          p.el.setAttribute("data-nk", p.key);
          p.el.setAttribute("data-np", np);
          if (p.line) p.el.setAttribute("data-nline", p.line);
          else if (!p.lined) p.el.setAttribute("data-nl", "0");
        }
        colorAll(prep, st[np] || {}, null);
        const svg = prep.svg;
        svg.setAttribute("x", "0");
        svg.setAttribute("y", "0");
        svg.setAttribute("width", "1600");
        svg.setAttribute("height", "1200");
        svg.setAttribute("overflow", "visible");
        parts.push(`<g data-np="${esc(np)}" ${attrs}>${new XMLSerializer().serializeToString(svg)}</g>`);
        return true;
      };
      const img2 = (href, x, y, w, h) => parts.push(`<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"/>`);
      let vb = "0 0 1600 1200";
      if (this.focus) {
        const m = man.pieces[this.focus];
        add(m.id, N.tex[m.id]);
        const pad = 30;
        vb = `${m.x - pad} ${m.y - pad} ${m.w + pad * 2} ${m.h + pad * 2}`;
      } else {
        const bgOn = this.state.bg && N.bg;
        if (!bgOn || !add("_bg", N.bg)) img2(P.plate, 0, 0, 1600, 1200);
        for (const m of underFirst(Object.values(man.pieces))) {
          if (m.hidden) continue;
          if (!(N.tex[m.id] && add(m.id, N.tex[m.id]))) img2(P.tex[m.id], m.x, m.y, m.w, m.h);
        }
        if (bgOn && N.over) img2(N.over.src, N.over.x, N.over.y, N.over.w, N.over.h);
      }
      const z = this.el.querySelector(".nu-zoom");
      z.innerHTML = `<svg class="nu-svg" xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${parts.join("")}</svg>`;
      this.zoom = { s: 1, x: 0, y: 0 };
      this.place();
      this.tray();
    }
    // the pictures that come out later (hidden on the paper): colour them too, one at a time
    tray() {
      const i = this.i, P = this.A.pages[i], N = this.data.pages[i], man = P.manifest;
      const hidden = Object.values(man.pieces).filter((m) => (m.hidden || m.depth) && N.tex[m.id]);
      const t = this.el.querySelector(".nu-tray");
      if (!hidden.length) {
        t.hidden = true;
        t.innerHTML = "";
        return;
      }
      t.hidden = false;
      t.innerHTML = `<small>${T(hidden.some((m) => m.depth) ? "かくれている え" : "あとで でてくる え")}</small>
      <button class="nu-card ${this.focus ? "" : "on"}" type="button" data-f=""><img src="${this.A.thumbs[i]}" alt=""><span>${T("ページ")}</span></button>
      ${hidden.map((m) => `<button class="nu-card ${this.focus === m.id ? "on" : ""}" type="button" data-f="${esc(m.id)}"><img src="${P.tex[m.id]}" alt=""></button>`).join("")}`;
      t.querySelectorAll(".nu-card").forEach((b) => b.addEventListener("click", () => {
        this.focus = b.dataset.f || null;
        this.draw();
      }));
    }
    fill(x, y) {
      const hit = document.elementFromPoint(x, y);
      const el = hit && hit.closest && hit.closest("[data-nk]");
      if (!el || !this.el.contains(el)) return;
      const np = el.getAttribute("data-np"), nk = el.getAttribute("data-nk");
      const pid = this.pageId(this.i), st = this.state.pages[pid] ||= {}, cs = st[np] ||= {};
      const prev = cs[nk] || null, color = this.color || null;
      if (prev === color) return;
      this.undo.push({ i: this.i, np, nk, prev });
      if (this.undo.length > 200) this.undo.shift();
      this.set(np, nk, color);
      this.splash(x, y, color || WHITE2);
      try {
        this.ctx.sound.sfx("po");
      } catch (e) {
      }
    }
    set(np, nk, color) {
      const pid = this.pageId(this.i), cs = (this.state.pages[pid] ||= {})[np] ||= {};
      if (color) cs[nk] = color;
      else delete cs[nk];
      this.el.querySelectorAll(`[data-np="${CSS.escape(np)}"][data-nk="${CSS.escape(nk)}"]`).forEach((e) => paint(e, color, e.getAttribute("data-nl") !== "0", e.getAttribute("data-nline")));
      this.dirty.add(this.i);
      this.save();
    }
    back() {
      const u = this.undo.pop();
      if (!u) return;
      if (u.i !== this.i) {
        this.i = u.i;
        this.focus = null;
        this.draw();
      }
      this.set(u.np, u.nk, u.prev);
    }
    splash(x, y, c) {
      const d = document.createElement("div");
      d.className = "nu-splash";
      d.style.cssText = `left:${x}px;top:${y}px;--c:${c}`;
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 600);
    }
    askClear() {
      const a = this.el.querySelector(".nu-ask");
      a.hidden = false;
      a.innerHTML = `<div class="nu-card2"><p>${T("いろを けして、はじめから ぬる？")}</p>
      <button class="nu-btn page" type="button">${T("この ページを けす")}</button>
      <button class="nu-btn all" type="button">${T("ぜんぶの ページを けす")}</button>
      <button class="nu-btn no" type="button">${T("やめる")}</button></div>`;
      a.querySelector(".page").addEventListener("click", () => {
        delete this.state.pages[this.pageId(this.i)];
        this.undo = [];
        this.dirty.add(this.i);
        this.save();
        a.hidden = true;
        this.draw();
      });
      a.querySelector(".all").addEventListener("click", () => {
        this.A.pages.forEach((p, k) => {
          if (this.state.pages[p.id]) this.dirty.add(k);
        });
        this.state.pages = {};
        this.undo = [];
        this.save();
        a.hidden = true;
        this.draw();
      });
      a.querySelector(".no").addEventListener("click", () => {
        a.hidden = true;
      });
    }
    // zoom (＋ − and two fingers) and moving around (one finger, when zoomed); a short tap colours
    place() {
      const z = this.zoom, s = this.el.querySelector(".nu-svg");
      if (!s) return;
      s.style.transform = `translate(${z.x}px, ${z.y}px) scale(${z.s})`;
    }
    zoomBy(k) {
      const z = this.zoom;
      z.s = Math.max(1, Math.min(5, z.s * k));
      if (z.s === 1) {
        z.x = 0;
        z.y = 0;
      }
      this.place();
    }
    input(stage) {
      const pts = /* @__PURE__ */ new Map();
      let moved = false, pinch = 0;
      stage.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".nu-fit")) return;
        stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
        if (pts.size === 1) moved = false;
        if (pts.size === 2) {
          const [a, b] = [...pts.values()];
          pinch = Math.hypot(a.x - b.x, a.y - b.y);
          moved = true;
        }
      });
      stage.addEventListener("pointermove", (e) => {
        const p = pts.get(e.pointerId);
        if (!p) return;
        const dx = e.clientX - p.x, dy = e.clientY - p.y;
        p.x = e.clientX;
        p.y = e.clientY;
        if (pts.size === 2) {
          const [a, b] = [...pts.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinch > 0) this.zoomBy(d / pinch);
          pinch = d;
          return;
        }
        if (Math.hypot(p.x - p.sx, p.y - p.sy) > 8) moved = true;
        if (moved && this.zoom.s > 1) {
          this.zoom.x += dx;
          this.zoom.y += dy;
          this.place();
        }
      });
      const end = (e) => {
        if (!pts.has(e.pointerId)) return;
        const single = pts.size === 1;
        pts.delete(e.pointerId);
        if (single && !moved && e.type === "pointerup") this.fill(e.clientX, e.clientY);
      };
      stage.addEventListener("pointerup", end);
      stage.addEventListener("pointercancel", end);
    }
    close() {
      if (!this.el) return;
      this.el.hidden = true;
      this.el.innerHTML = "";
      document.body.classList.remove("nurie-open");
      if (this.state.use !== this.useBefore || this.state.bg !== this.bgBefore) this.A.pages.forEach((p, k) => this.dirty.add(k));
      const list = [...this.dirty];
      this.dirty.clear();
      const done = this.onClose;
      this.onClose = null;
      if (done) done(list.length > 0);
      if (list.length) this.applyAll(list);
    }
  };
  function makeNurie(ctx, assets2) {
    if (!assets2.nurie || !assets2.nurie.pages) return null;
    const n = new Nurie(ctx, assets2.nurie, assets2);
    return n.available ? n : null;
  }

  // system/engine/core.js
  var FONT = 'ZenMaru, "Hiragino Maru Gothic ProN", "Hiragino Sans", "Noto Sans JP", sans-serif';
  var ASSETS = null;
  var T2 = (ja) => esc(tr(ja));
  var S2 = (t) => esc(shown(t));
  var castHTML = () => {
    const cast = (BOOK.cast || []).filter((c) => c.intro !== false);
    if (!cast.length) return "";
    return `<div class="cast">${cast.map((c) => `
  <div class="who" style="border-color:${esc(c.frame || c.mark || c.color || "#f1d79f")}">${ASSETS.cast[c.id] ? `<img src="${ASSETS.cast[c.id]}" alt="">` : ""}<div><b>${S2(c.name)}</b><small>${S2(c.look || "")}</small><span>${S2(c.about || "")}</span></div></div>`).join("")}</div>`;
  };
  var langsHTML = () => {
    const L = (BOOK.languages || []).filter((l) => LANGS[l]);
    if (L.length < 2) return "";
    const row = (label, key, now) => `<div class="lrow"><small>${T2(label)}</small>${L.map((l) => `<button type="button" data-${key}="${l}" class="${l === now ? "on" : ""}" lang="${l}" aria-pressed="${l === now}">${LANGS[l].name}</button>`).join("")}</div>`;
    return `<div class="langs two">${row("もじ", "lang", LANG.now)}${row("こえ", "voice", LANG.voice)}</div>`;
  };
  function setWords(ctx, l) {
    setLang(l);
    saveLang(LANG.now);
    ctx.ui.relabel();
    setText(ctx, LANG.now !== "ja");
    if (ctx.coverPrompt) ctx.coverPrompt.draw();
    if (ctx.pages[ctx.cur]) ctx.pages[ctx.cur].warmTexts();
  }
  function setVoice(ctx, l) {
    setVoiceLang(l);
    saveVoiceLang(LANG.voice);
    if (ctx.reading) stopReading(ctx);
    else ctx.sound.stopSpeech();
  }
  var img = async (url) => {
    const i = new Image();
    i.src = url;
    await i.decode();
    return i;
  };
  async function loadFont() {
    try {
      const ff = new FontFace("ZenMaru", `url(${ASSETS.font})`, { weight: "700" });
      await ff.load();
      document.fonts.add(ff);
    } catch (e) {
    }
  }
  async function loadPage(P, sound, ui) {
    const tex = {}, alpha = {};
    await Promise.all(Object.entries(P.tex).map(async ([k, url]) => {
      const im = await img(url);
      const t = new THREE11.Texture(im);
      t.colorSpace = THREE11.SRGBColorSpace;
      t.anisotropy = 4;
      t.needsUpdate = true;
      tex[k] = t;
      const sc = Math.min(1, 192 / Math.max(im.width, im.height));
      const w = Math.max(1, Math.round(im.width * sc)), h = Math.max(1, Math.round(im.height * sc));
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(im, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data, a = new Uint8Array(w * h);
      for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
      alpha[k] = { w, h, data: a };
    }));
    const [plateImg, maskImg] = await Promise.all([img(P.plate), img(P.mask)]);
    return new PageView({ n: P.n, manifest: P.manifest, tex, alpha, plateImg, maskImg, font: FONT, sound, ui, logic: makeLogic(P.def, P.script, Object.keys(P.manifest.pieces || {})) });
  }
  function attachInput(el, { onTap, onDrag, onPinch, onGrab, onRub, onRelease }) {
    const pts = /* @__PURE__ */ new Map();
    let moved = false, pinchD = 0, multi = false, grabbed = false;
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
      if (pts.size === 1) {
        moved = false;
        multi = false;
        grabbed = !!(onGrab && onGrab(e.clientX, e.clientY));
      }
      if (pts.size === 2) {
        multi = true;
        grabbed = false;
        const [a, b] = [...pts.values()];
        pinchD = Math.hypot(a.x - b.x, a.y - b.y);
      }
    });
    el.addEventListener("pointermove", (e) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (grabbed && !multi) {
        if (Math.hypot(p.x - p.sx, p.y - p.sy) > 10) moved = true;
        onRub(p.x, p.y, Math.hypot(dx, dy));
        return;
      }
      if (pts.size === 2 && onPinch) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchD > 0) onPinch(d / pinchD);
        pinchD = d;
        return;
      }
      if (Math.hypot(p.x - p.sx, p.y - p.sy) > 10) moved = true;
      if (moved && onDrag && !multi) onDrag(dx, dy);
    });
    const end = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (grabbed && !multi && onRelease) onRelease(e.clientX, e.clientY);
      if (!moved && !multi && e.type === "pointerup") onTap(e.clientX, e.clientY);
      if (!pts.size) grabbed = false;
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }
  async function init({ ar = false, startAR = null, assets: assets2, scripts: scripts2 = {} } = {}) {
    ASSETS = assets2;
    Object.assign(ICONS, assets2.items || {});
    setBook(assets2.book);
    setReadMap(assets2.read);
    setBookLangs(assets2.lang);
    setLang(startLang(BOOK.languages));
    setVoiceLang(startVoiceLang(BOOK.languages, LANG.now));
    document.title = assets2.book.title + (assets2.book.subtitle ? ` — ${assets2.book.subtitle}` : "");
    const container = document.getElementById("stage");
    const sound = new Sound();
    sound.narrationOn = !!BOOK.settings.voiceOn;
    ["touchend", "click", "pointerup", "keydown"].forEach((ev) => document.addEventListener(ev, () => sound.unlock(), { passive: true, capture: true }));
    CALM.on = loadCalm();
    const ctx = { container, sound, pages: {}, cur: 0, reading: false, readToken: 0, mode: "cover", ar, played: {}, phase: {}, running: false };
    const ui = new UI({
      onRead: () => {
        sound.unlock();
        if (ctx.reading) {
          stopReading(ctx);
          return;
        }
        if (ctx.onCover) ctx.readCover();
        else readPage(ctx, ctx.cur);
      },
      onNarration: () => {
        sound.unlock();
        sound.narrationOn = !sound.narrationOn;
        ui.setNarration(sound.narrationOn);
        if (!sound.narrationOn) stopReading(ctx);
        ui.toast(sound.narrationOn ? "セリフ オン" : "セリフ オフ", 1500);
        if (ctx.onCover) {
          if (sound.narrationOn && !ctx.reading) ctx.readCover();
        } else if (ctx.phase[ctx.cur] === "story") {
          ui.setHint(storyHint(ctx), true);
          if (sound.narrationOn && !ctx.reading) readPage(ctx, ctx.cur);
        }
      },
      onSfx: () => {
        sound.unlock();
        sound.sfxOn = !sound.sfxOn;
        sound.syncAmbience();
        ui.setSfx(sound.sfxOn);
        ui.toast(sound.sfxOn ? "こうかおん オン" : "こうかおん オフ", 1500);
      },
      onText: () => {
        sound.unlock();
        setText(ctx, !ctx.textOn);
        ui.toast(ctx.textOn ? "もじを ひょうじ" : "もじを かくす", 1500);
      },
      onReset: () => {
        sound.unlock();
        if (ctx.onCover) return;
        const pg = ctx.pages[ctx.cur];
        if (pg) {
          pg.reset();
          if (ctx.phase[ctx.cur] === "play") {
            pg.setPlaying(true);
            ui.setHint(pg.logic.hint, false);
          }
          ui.toast("もういちど あそぼう！", 1800);
        }
        endButton(ctx);
      },
      onEnding: () => {
        sound.unlock();
        stopReading(ctx);
        showEnding(ctx);
      },
      onPaper: () => {
        sound.unlock();
        ctx.togglePaper && ctx.togglePaper();
      },
      onPage: (d) => {
        sound.unlock();
        ctx.goto && ctx.goto(Math.min(ctx.count, Math.max(1, ctx.cur + d)));
      },
      onPlay: () => {
        sound.unlock();
        if (ctx.phase[ctx.cur] === "story") {
          stopReading(ctx);
          enterPlay(ctx, ctx.cur);
        }
      },
      onRestart: () => {
        sound.unlock();
        restart(ctx);
        restartToast(ctx);
      },
      onHome: () => {
        sound.unlock();
        restart(ctx, true);
        showStart(ctx);
      },
      // ことば (on every page): もじ and こえ each on its own; the choice stays for the next pages too
      onWords: (l) => {
        sound.unlock();
        setWords(ctx, l);
      },
      onVoice: (l) => {
        sound.unlock();
        const again = ctx.reading;
        setVoice(ctx, l);
        if (ctx.onCover && ctx.coverAgain) ctx.coverAgain();
        else if (again) readPage(ctx, ctx.cur);
      }
    });
    ctx.ui = ui;
    ui.setNarration(sound.narrationOn);
    ui.setSfx(sound.sfxOn);
    ui.setLangs(BOOK.languages);
    panel("loading", `<div class="spinner"></div><p>${T2("じゅんびちゅう…")}</p>`);
    await loadFont();
    for (const P of ASSETS.pages) ctx.pages[P.n] = await loadPage({ ...P, script: scripts2[P.id] }, sound, ui);
    for (const pg of Object.values(ctx.pages)) pg.onComplete = (n) => pageCleared(ctx, n);
    ctx.nurie = makeNurie(ctx, ASSETS);
    if (ctx.nurie) setTimeout(() => ctx.nurie.applyAll(), 300);
    setText(ctx, LANG.now !== "ja");
    onMemory((what, id) => {
      ui.setBag(MEM.items, ASSETS.items || {}, (x) => shown(itemOf(x).name), what === "item" && has(id) ? id : null);
      if (what === "item" && has(id)) {
        sound.sfx("kirarin");
        ui.toast(trx("{x}を てに いれた！", { x: shown(itemOf(id).name) }), 2200);
      }
      if (what === "join") {
        sound.sfx("kirarin");
        ui.toast(trx("{x}が いっしょに いくよ！", { x: shown(itemOf(id).name) }), 2400);
      }
    });
    ctx.count = ASSETS.pages.length;
    BOOK.pageCount = ctx.count;
    ui.count = ctx.count;
    ui.el.pn.textContent = `1/${ctx.count}`;
    hidePanel("loading");
    window.__pages = ctx.pages;
    window.__ctx = ctx;
    ctx.startPreview = () => {
      hidePanel("start");
      hidePanel("error");
      sound.unlock();
      ctx.running = true;
      runPreview(ctx);
    };
    ctx.startAR = startAR;
    if (location.hash === "#yomi") showYomi(ctx);
    else showStart(ctx);
    let then = null;
    try {
      then = sessionStorage.getItem("ehon-start");
      sessionStorage.removeItem("ehon-start");
    } catch (e) {
    }
    if (then === "preview") ctx.startPreview();
    else if (then === "camera" && ar) {
      const go = document.querySelector("#start .go");
      if (go) go.click();
    }
  }
  function loadCalm() {
    try {
      const v = localStorage.getItem("ehon-calm");
      if (v === "1" || v === "0") return v === "1";
    } catch (e) {
    }
    return BOOK.calm === true || !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  var calmLabel = () => `${tr("ひかえめモード（ひかりと うごきを ひかえめに）")}：${tr(CALM.on ? "オン" : "オフ")}`;
  function wireCalm() {
    const b = document.querySelector("#start .calm");
    if (!b) return;
    b.textContent = calmLabel();
    b.addEventListener("click", () => {
      CALM.on = !CALM.on;
      b.textContent = calmLabel();
      try {
        localStorage.setItem("ehon-calm", CALM.on ? "1" : "0");
      } catch (e) {
      }
    });
  }
  function wireStart(ctx) {
    wireCalm();
    document.querySelector("#start .lic").addEventListener("click", showLicenses);
    const ad = document.querySelector("#start .adults");
    if (ad) ad.addEventListener("click", showAdults);
    document.querySelectorAll("#start .langs button").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.lang) setWords(ctx, b.dataset.lang);
      else setVoice(ctx, b.dataset.voice);
      showStart(ctx);
    }));
  }
  var nurieHTML = (ctx) => ctx.nurie ? `<button class="small nuriego" type="button">${icon("crayon", "#6a56ad")} ${T2("ぬりえ")}</button>` : "";
  function wireNurie(ctx) {
    const b = document.querySelector("#start .nuriego");
    if (!b) return;
    b.addEventListener("click", () => {
      ctx.sound.unlock();
      ctx.nurie.open(0);
    });
  }
  var startTail = () => `<button class="link calm" type="button"></button>${BOOK.settings.forAdults ? `<button class="link adults" type="button">${T2("おとなの かたへ")}</button>` : ""}
      <button class="link lic" type="button">${T2("ライセンス表示")}</button>`;
  function showStart(ctx) {
    const { sound, container } = ctx;
    const startPreview = ctx.startPreview, startAR = ctx.startAR;
    const how = BOOK.settings.readFirst ? `<p class="howto">${T2("① まず おはなしを よむ（きく）")}<br>${T2("② 「あそぶ」を おすと、えに さわって あそべるよ")}</p>` : "";
    const sub = BOOK.subtitle ? S2(BOOK.subtitle) : T2("AR えほん");
    const again = () => {
      sound.unlock();
      hidePanel("start");
      restart(ctx);
      if (ctx.camera) ctx.ui.toast("1ページを うつしてね", 2600);
    };
    const switchTo = (how2) => {
      try {
        sessionStorage.setItem("ehon-start", how2);
      } catch (e) {
      }
      location.reload();
    };
    if (!ctx.ar) {
      panel("start", `
      <h1>${S2(BOOK.title)}</h1>
      <p class="sub">${sub} ・ ${T2("カメラなしプレビュー")}</p>
      ${langsHTML()}${castHTML()}${how}
      <p>${T2("ゆびで ドラッグすると みる むきが かわるよ。")}</p>
      <button class="big go" type="button">${T2("はじめる")}</button>
      ${nurieHTML(ctx)}
      <p class="note">${T2("おとが でます。iPhone は マナーモードを オフにしてね。")}</p>
      ${startTail()}`);
      wireStart(ctx);
      wireNurie(ctx);
      document.querySelector("#start .go").addEventListener("click", ctx.running ? again : startPreview);
      return;
    }
    panel("start", `
    <h1>${S2(BOOK.title)}</h1>
    <p class="sub">${sub}</p>
    ${langsHTML()}${castHTML()}${how}
    <p>${T2("スマホの カメラを つかいます。")}<br>${T2("えほんの ページ（いんさつした かみ、または パソコンの がめん）を よういしてね。")}</p>
    <button class="big go" type="button">${T2("カメラで はじめる")}</button>
    <button class="mid nocam" type="button">${T2("カメラなしで みる")}</button>
    ${nurieHTML(ctx)}
    <p class="note">${T2("おとが でます。iPhone は マナーモードを オフにしてね。")}</p>
    ${startTail()}`);
    wireStart(ctx);
    wireNurie(ctx);
    document.querySelector("#start .nocam").addEventListener("click", !ctx.running ? startPreview : ctx.camera ? () => switchTo("preview") : again);
    document.querySelector("#start .go").addEventListener("click", ctx.running && ctx.camera ? again : ctx.running ? () => switchTo("camera") : async () => {
      sound.unlock();
      hidePanel("start");
      panel("loading", `<div class="spinner"></div><p>${T2("カメラを じゅんびちゅう…")}</p>`);
      try {
        await startAR(ctx);
        ctx.running = true;
        ctx.camera = true;
        hidePanel("loading");
      } catch (err) {
        hidePanel("loading");
        container.innerHTML = "";
        const insecure = !window.isSecureContext;
        panel("error", `<h2>${T2("カメラが つかえませんでした")}</h2>
        <p>${insecure ? T2("この ページは https の URL で ひらく ひつようが あります。") : `${T2("カメラの きょかを オンにして、もういちど ためしてね。")}<br>${T2("（ブラウザの せってい → カメラ → きょか）")}`}</p>
        <button class="big retry" type="button">${T2("もういちど")}</button>
        <button class="link nocam" type="button">${T2("カメラなしで みる")}</button>`);
        document.querySelector("#error .retry").addEventListener("click", () => location.reload());
        document.querySelector("#error .nocam").addEventListener("click", startPreview);
      }
    });
  }
  function linesOf(def) {
    const out = [], seen = /* @__PURE__ */ new Set();
    const add = (text, who) => {
      if (typeof text === "string" && text.trim() && !seen.has(text)) {
        seen.add(text);
        out.push({ text, who: who || "n" });
      }
    };
    (def.story || []).forEach((s) => add(typeof s === "string" ? s : s && s.text, "n"));
    const walk2 = (v, who) => {
      if (!v || typeof v !== "object") return;
      if (Array.isArray(v)) {
        v.forEach((x) => walk2(x, who));
        return;
      }
      const w = v.who || v.on || who;
      if (v.say !== void 0) [].concat(v.say).forEach((x) => typeof x === "string" ? add(x, w) : walk2(x, w));
      if (typeof v.text === "string" && v.who) add(v.text, v.who);
      if (typeof v.question === "string") add(v.question, w);
      for (const [k, x] of Object.entries(v)) {
        if (["story", "say", "pieces"].includes(k) || !x || typeof x !== "object") continue;
        if (["touch", "react", "again", "undo", "wrong"].includes(k) && !Array.isArray(x)) Object.entries(x).forEach(([id, spec]) => walk2(spec, id));
        else if (k === "items" && Array.isArray(x)) x.forEach((it) => walk2(it, it && (it.who || it.item || it.spot)));
        else walk2(x, w);
      }
    };
    walk2(def, "n");
    return out;
  }
  function showYomi(ctx) {
    const all = [];
    const who = (id) => id === "n" ? tr("おはなし") : shown(BOOK.byId[id] && BOOK.byId[id].name || id);
    const pagesHTML = ASSETS.pages.map((P) => {
      const rows2 = linesOf(P.def).map((L) => {
        const i = all.push(L) - 1;
        return `<div class="row"><button class="play" type="button" data-i="${i}" aria-label="▶">▶</button><div><span class="t">${S2(L.text)}</span>
        <small>${esc(who(L.who))}${LANG.voice === "ja" ? `　よみ：${esc(spoken(L.text))}` : ""}</small></div></div>`;
      }).join("");
      return `<h3><span>${P.n}. ${S2(P.def.name || "")}</span><button class="all" type="button" data-p="${P.n}">${T2("この ページを ぜんぶ よむ")}</button></h3>${rows2}`;
    }).join("");
    const norm4 = (t) => String(t).replace(/[\s\u3000]+/g, "");
    const known = new Set(all.map((L) => norm4(L.text)));
    const extra = Object.keys(ASSETS.read || {}).filter((t) => !known.has(norm4(t))).map((t) => {
      const i = all.push({ text: t, who: "n" }) - 1;
      return `<div class="row"><button class="play" type="button" data-i="${i}" aria-label="▶">▶</button><div><span class="t">${S2(t)}</span>${LANG.voice === "ja" ? `<small>よみ：${esc(spoken(t))}</small>` : ""}</div></div>`;
    }).join("");
    const el = panel("yomi", `<h2>${T2("よみあげ チェック")}</h2>
    <p class="note">${T2("▶ を おすと、この スマホの こえで よみます。よみかたが ちがう ことばは、読み上げ原稿（read）を なおします。")}</p>
    ${langsHTML()}${pagesHTML}${extra ? `<h3><span>${T2("そのほかの セリフ")}</span></h3>${extra}` : ""}
    <button class="big close" type="button">${T2("はじめる がめんへ")}</button>`);
    const say = (list) => {
      ctx.sound.unlock();
      ctx.sound.narrate(list.map((L) => ({ text: L.text, voice: voice(L.who) })));
    };
    el.querySelectorAll(".play").forEach((b) => b.addEventListener("click", () => say([all[+b.dataset.i]])));
    el.querySelectorAll(".all").forEach((b) => b.addEventListener("click", () => say(linesOf(ASSETS.pages[+b.dataset.p - 1].def))));
    el.querySelectorAll(".langs button").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.lang) setWords(ctx, b.dataset.lang);
      else setVoice(ctx, b.dataset.voice);
      showYomi(ctx);
    }));
    el.querySelector(".close").addEventListener("click", () => {
      ctx.sound.stopSpeech();
      hidePanel("yomi");
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch (e) {
      }
      showStart(ctx);
    });
  }
  function showAdults() {
    const A = ADULTS[LANG.now] || ADULTS.ja, li = (t) => `<li>${esc(t)}</li>`;
    const link = (label, href) => `<li>${esc(label)}：<a href="${esc(href)}" target="_blank" rel="noopener">${esc(href)}</a></li>`;
    const url = BOOK.repo ? link(A.repo, BOOK.repo) : BOOK.url ? link(A.url, BOOK.url) : "";
    const el = panel("adults", `<h2>${T2("おとなの かたへ")}</h2>
    <h3>${esc(A.titles.how)}</h3><ol>${A.how.map(li).join("")}</ol>
    <h3>${esc(A.titles.safe)}</h3><ul>${A.safe.map(li).join("")}</ul>
    ${BOOK.adultNote ? `<p>${S2(BOOK.adultNote)}</p>` : ""}
    <h3>${esc(A.titles.about)}</h3>
    <ul><li>${S2(BOOK.title)}${BOOK.subtitle ? ` — ${S2(BOOK.subtitle)}` : ""}</li>${BOOK.author ? `<li>${esc(A.by)}：${S2(BOOK.author)}</li>` : ""}${url}<li>${esc(A.kit)}</li></ul>
    <button class="big close" type="button">${T2("とじる")}</button>`);
    el.querySelector(".close").addEventListener("click", () => hidePanel("adults"));
  }
  function stampHTML(ctx, n, got = true) {
    if (!got) return `<div class="stamp empty"><span class="no">${n}</span></div>`;
    const pg = ctx.pages[n];
    const present = (BOOK.cast || []).map((c) => c.id).filter((id) => pg.cards[id] && ASSETS.cast[id]);
    const who = present.length ? present[(n - 1) % present.length] : Object.keys(pg.cards).find((id) => isCast(id));
    const col = who ? castColor(who) : "#e8756a";
    return `<div class="stamp" style="--c:${esc(col)}">${who && ASSETS.cast[who] ? `<img src="${ASSETS.cast[who]}" alt="">` : '<span class="star">★</span>'}<span class="no">${n}</span></div>`;
  }
  function pageCleared(ctx, n) {
    markCleared(n);
    if (!BOOK.settings.ending) return;
    if (stamp(n)) setTimeout(() => ctx.ui.stampPop(stampHTML(ctx, n)), 2300);
    if (n === ctx.count) {
      clearTimeout(ctx.endT);
      ctx.endT = setTimeout(() => endButton(ctx), 3200);
    }
  }
  function endButton(ctx) {
    const pg = ctx.pages[ctx.count];
    ctx.ui.setEnd(!!(BOOK.settings.ending && ctx.cur === ctx.count && pg && pg.done && ctx.phase[ctx.count] === "play"));
  }
  function showEnding(ctx) {
    const got = Object.keys(MEM.stamps).length;
    const stamps = Array.from({ length: ctx.count }, (_, i) => stampHTML(ctx, i + 1, !!MEM.stamps[i + 1])).join("");
    const el = panel("ending", `<h1>${T2("おしまい")}</h1>
    <p>${T2("よんでくれて ありがとう！")}</p>
    <h2>${T2("ごほうびスタンプ")}</h2>
    <div class="stamps">${stamps}</div>
    <p class="note">${T2(got >= ctx.count ? "ぜんぶの ページで スタンプを もらったよ！" : "スタンプの ない ページも あそんでみてね")}</p>
    <button class="big restart" type="button">${icon("restart")}<span>${T2("さいしょから よむ")}</span></button>
    <button class="big second home" type="button">${icon("home")}<span>${T2("はじめに もどる")}</span></button>
    ${BOOK.author ? `<p class="by">${T2("さく")}${LANG.now === "ja" ? "：" : ": "}${S2(BOOK.author)}</p>` : ""}`);
    el.querySelector(".home").addEventListener("click", () => {
      ctx.sound.unlock();
      restart(ctx, true);
      showStart(ctx);
    });
    el.querySelector(".restart").addEventListener("click", () => {
      ctx.sound.unlock();
      restart(ctx);
      restartToast(ctx);
    });
  }
  var restartToast = (ctx) => ctx.ui.toast(ctx.ar ? "1ページから よもう！ 1ページを うつしてね" : "さいしょから よもう！", 2600);
  function setText(ctx, on) {
    ctx.textOn = on;
    ctx.ui.setText(on);
    Object.values(ctx.pages).forEach((p) => p.setText(on));
  }
  function stopReading(ctx) {
    ctx.readToken++;
    ctx.sound.stopSpeech();
    ctx.reading = false;
    ctx.ui.setReading(false);
    if (BOOK.settings.highlight) Object.values(ctx.pages).forEach((p) => p.highlight(-1));
  }
  function readPage(ctx, n) {
    const pg = ctx.pages[n];
    if (!pg) return;
    if (!ctx.sound.canSpeak) {
      ctx.ui.toast("この たんまつでは よみあげが つかえません");
      return;
    }
    const token = ++ctx.readToken;
    ctx.reading = true;
    ctx.ui.setReading(true);
    const segs = pg.narration().map((sg) => sg.line === void 0 ? sg : { ...sg, onstart: () => {
      if (sg.onstart) sg.onstart();
      if (BOOK.settings.highlight) pg.highlight(sg.line);
      if (LANG.now !== "ja" && !ctx.textOn) ctx.ui.caption(shown(sg.text));
    } });
    ctx.sound.narrate(segs, () => {
      if (token !== ctx.readToken) return;
      ctx.reading = false;
      ctx.ui.setReading(false);
      if (BOOK.settings.highlight) pg.highlight(-1);
      if (ctx.cur === n && ctx.phase[n] === "story") enterPlay(ctx, n);
    });
  }
  function readCover(ctx, prompt) {
    if (!ctx.sound.canSpeak) {
      ctx.ui.toast("この たんまつでは よみあげが つかえません");
      return;
    }
    const token = ++ctx.readToken;
    ctx.reading = true;
    ctx.ui.setReading(true);
    ctx.sound.narrate([{ text: prompt.text(LANG.voice), voice: voice("n") }], () => {
      if (token !== ctx.readToken) return;
      ctx.reading = false;
      ctx.ui.setReading(false);
    });
  }
  function storyHint(ctx) {
    return ctx.sound.narrationOn ? "おはなしを きいてね" : "おはなしを よんだら「あそぶ」を おしてね";
  }
  function enterStory(ctx, n) {
    ctx.phase[n] = "story";
    ctx.pages[n].setPlaying(false);
    ctx.ui.setHint(storyHint(ctx), true);
    ctx.ui.setStory(true);
    if (ctx.sound.narrationOn) ctx.narrT = setTimeout(() => {
      if (ctx.cur === n && ctx.phase[n] === "story" && !ctx.reading) readPage(ctx, n);
    }, 1600);
  }
  function enterPlay(ctx, n, quiet = false) {
    ctx.phase[n] = "play";
    ctx.played[n] = true;
    ctx.pages[n].setPlaying(true);
    const L = ctx.pages[n].logic;
    ctx.ui.setStory(false);
    ctx.ui.setHint(L.hint, false);
    if (!quiet) ctx.pages[n].playSignal();
  }
  function activate(ctx, n, force = false) {
    const changed2 = ctx.cur !== n;
    ctx.cur = n;
    markSeen(n);
    const L = ctx.pages[n].logic;
    ctx.ui.setPage(n, L.name, L.progress);
    if (!changed2 && !force) return;
    stopReading(ctx);
    clearTimeout(ctx.narrT);
    ctx.pages[n].warmTexts();
    if (ctx.played[n] || !BOOK.settings.readFirst) enterPlay(ctx, n, true);
    else enterStory(ctx, n);
    endButton(ctx);
  }
  function restart(ctx, quiet = false) {
    stopReading(ctx);
    clearTimeout(ctx.narrT);
    clearTimeout(ctx.endT);
    forget();
    hidePanel("ending");
    ctx.ui.setEnd(false);
    Object.values(ctx.pages).forEach((p) => p.reset());
    ctx.played = {};
    ctx.phase = {};
    if (quiet) return;
    if (ctx.goto) {
      if (ctx.cur === 1) activate(ctx, 1, true);
      else ctx.goto(1);
    } else if (ctx.cur) activate(ctx, ctx.cur, true);
  }
  function warmUp(ctx, renderer, scene, camera) {
    scene.add(spriteKeeper(), drawKinds());
    setTextUpload((t) => renderer.initTexture(t));
    for (const pg of Object.values(ctx.pages)) {
      for (const t of Object.values(pg.tex)) renderer.initTexture(t);
      pg.root.traverse((o) => {
        if (o.material && o.material.map) renderer.initTexture(o.material.map);
      });
      renderer.compile(pg.root, camera, scene);
    }
    renderer.compile(scene, camera);
    drawOnce(ctx, renderer, scene, camera);
  }
  function drawKinds() {
    const g = new THREE11.Group(), geo = new THREE11.PlaneGeometry(1e-4, 1e-4);
    for (const m of [
      new THREE11.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false }),
      new THREE11.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE11.AdditiveBlending }),
      new THREE11.MeshBasicMaterial({ map: warmTexture(), transparent: true, depthWrite: false, blending: THREE11.AdditiveBlending }),
      new THREE11.MeshBasicMaterial({ color: 16777215, transparent: true, depthWrite: false })
    ]) g.add(new THREE11.Mesh(geo, m));
    const dot = new THREE11.Sprite(new THREE11.SpriteMaterial({ map: dotTexture(), transparent: true, depthWrite: false }));
    dot.scale.set(1e-4, 1e-4, 1);
    g.add(dot);
    g.visible = false;
    g.name = "kinds";
    return g;
  }
  function drawOnce(ctx, renderer, scene, camera) {
    const all = new THREE11.Group(), back = [], hidden = [], culled = [], geo = new THREE11.PlaneGeometry(1e-4, 1e-4);
    for (const pg of Object.values(ctx.pages)) {
      back.push([pg.root, pg.root.parent]);
      all.add(pg.root);
      for (const t of new Set(Object.values(pg.tex))) all.add(new THREE11.Mesh(geo, cardMaterial(t)));
    }
    scene.add(all);
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
      if (o.frustumCulled) {
        culled.push(o);
        o.frustumCulled = false;
      }
    });
    renderer.render(scene, camera);
    hidden.forEach((o) => {
      o.visible = false;
    });
    culled.forEach((o) => {
      o.frustumCulled = true;
    });
    scene.remove(all);
    for (const [r, p] of back) {
      if (p) p.add(r);
      else all.remove(r);
    }
    all.children.forEach((m) => m.material.dispose());
    geo.dispose();
    renderer.clear();
  }
  var CHIME = 5e3;
  var CHIME_READ = 650;
  async function runAR(ctx, MindARThree, mindURL) {
    const { container, ui, pages } = ctx;
    const mt = new MindARThree({
      container,
      imageTargetSrc: mindURL,
      maxTrack: 1,
      uiLoading: "no",
      uiScanning: "no",
      uiError: "no",
      filterMinCF: 1e-4,
      filterBeta: 5e-3,
      missTolerance: 8,
      warmupTolerance: 3
    });
    const { renderer, scene, camera } = mt;
    window.__view = { camera, canvas: renderer.domElement, renderer };
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const anchors = {};
    let coverA = null;
    const nothingShown = () => !Object.values(anchors).some((x) => x.group.visible) && !(coverA && coverA.group.visible);
    for (let n = 1; n <= ctx.count; n++) {
      const a = mt.addAnchor(n - 1);
      anchors[n] = a;
      a.group.add(pages[n].root);
      pages[n].setMode("reveal");
      let lost = null;
      a.onTargetFound = () => {
        clearTimeout(lost);
        hidePanel("scan");
        if (ctx.onCover) {
          ctx.onCover = false;
          ui.setCover(false);
          stopReading(ctx);
        }
        pages[n].setOpen(true);
        activate(ctx, n);
      };
      a.onTargetLost = () => {
        clearTimeout(lost);
        lost = setTimeout(() => {
          pages[n].setOpen(false, true);
          if (nothingShown()) scan();
        }, 1200);
      };
    }
    const prompt = ASSETS.coverTarget ? new CoverPrompt({ thumb: ASSETS.thumbs[0], font: FONT }) : null;
    if (prompt) {
      coverA = mt.addAnchor(ctx.count);
      coverA.group.add(prompt.group);
      ctx.coverPrompt = prompt;
      ctx.readCover = () => readCover(ctx, prompt);
      let lost = null, shown2 = false, chimeT = null, readT = null;
      const chimeStop = () => {
        clearTimeout(chimeT);
        clearTimeout(readT);
        chimeT = readT = null;
      };
      const chime = () => {
        chimeStop();
        if (!ctx.onCover) return;
        if (ctx.reading) {
          chimeT = setTimeout(chime, 400);
          return;
        }
        ctx.sound.sfx("kirarin");
        if (ctx.sound.narrationOn) readT = setTimeout(() => {
          if (ctx.onCover && !ctx.reading) ctx.readCover();
        }, CHIME_READ);
        chimeT = setTimeout(chime, CHIME);
      };
      ctx.coverAgain = () => {
        stopReading(ctx);
        chime();
      };
      coverA.onTargetFound = () => {
        clearTimeout(lost);
        hidePanel("scan");
        ctx.onCover = true;
        ui.setCover(true);
        if (shown2) return;
        shown2 = true;
        prompt.show();
        ctx.coverAgain();
      };
      coverA.onTargetLost = () => {
        clearTimeout(lost);
        lost = setTimeout(() => {
          shown2 = false;
          chimeStop();
          if (ctx.onCover) {
            ctx.onCover = false;
            ui.setCover(false);
            if (ctx.reading) stopReading(ctx);
          }
          if (nothingShown()) scan();
        }, 1200);
      };
    }
    warmUp(ctx, renderer, scene, camera);
    ctx.mode = "reveal";
    ctx.togglePaper = () => {
      ctx.mode = ctx.mode === "cover" ? "reveal" : "cover";
      Object.values(pages).forEach((p) => p.setMode(ctx.mode));
      ui.setPaperMode(ctx.mode === "cover");
      ui.toast(ctx.mode === "cover" ? "ページ ぜんたいを ARで おおいました" : "かみの えが みえるように しました", 2200);
    };
    const scan = () => panel("scan", `<div class="grid">${ASSETS.thumbs.map((t) => `<img src="${t}" alt="">`).join("")}</div><p>${T2("えほんの ページを うつしてね")}</p>`);
    await mt.start();
    ui.setPaperLabel("おおう");
    ui.setNav(false);
    ui.show(true);
    scan();
    const ray = new THREE11.Raycaster(), ndc = new THREE11.Vector2(), cam = new THREE11.Vector3();
    attachInput(container, {
      onTap: (x, y) => {
        ctx.sound.unlock();
        const a = anchors[ctx.cur];
        if (!a || !a.group.visible) return;
        const r = renderer.domElement.getBoundingClientRect();
        ndc.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
        scene.updateMatrixWorld();
        ray.setFromCamera(ndc, camera);
        const pg = pages[ctx.cur];
        pg.tap(pg.pick(ray), ctx.phase[ctx.cur] === "play");
      },
      onGrab: (x, y) => {
        const pg = pages[ctx.cur], a = anchors[ctx.cur];
        if (!pg || !a || !a.group.visible) return false;
        return pg.grab(pickAt(x, y));
      },
      onRub: (x, y, d) => {
        const pg = pages[ctx.cur];
        if (pg) pg.rubAt(pickAt(x, y), d);
      },
      onRelease: (x, y) => {
        const pg = pages[ctx.cur];
        if (pg) pg.release(pickAt(x, y));
      }
    });
    function pickAt(x, y) {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      scene.updateMatrixWorld();
      ray.setFromCamera(ndc, camera);
      return pages[ctx.cur].touchAt(ray);
    }
    const clock = new THREE11.Clock();
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      scene.updateMatrixWorld();
      camera.getWorldPosition(cam);
      if (coverA && coverA.group.visible) prompt.update(dt);
      for (let n = 1; n <= ctx.count; n++) {
        if (!anchors[n].group.visible) continue;
        const pg = pages[n];
        pg.setViewDir(pg.root.worldToLocal(cam.clone()));
        pg.measure(camera, container.clientWidth, container.clientHeight);
        pg.update(dt);
      }
      renderer.render(scene, camera);
    });
  }
  function radialTex(inner, outer) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(128, 128, 10, 128, 128, 128);
    grd.addColorStop(0, inner);
    grd.addColorStop(1, outer);
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE11.CanvasTexture(c);
    t.colorSpace = THREE11.SRGBColorSpace;
    return t;
  }
  function runPreview(ctx) {
    const { container, ui, pages } = ctx;
    container.classList.add("preview");
    const renderer = new THREE11.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    container.appendChild(renderer.domElement);
    const scene = new THREE11.Scene();
    const camera = new THREE11.PerspectiveCamera(38, 1, 0.01, 50);
    camera.up.set(0, 0, 1);
    window.__view = { camera, canvas: renderer.domElement, renderer };
    const shade = new THREE11.Mesh(new THREE11.PlaneGeometry(1.55, 1.3), new THREE11.MeshBasicMaterial({ map: radialTex("rgba(0,0,0,0.55)", "rgba(0,0,0,0)"), transparent: true, depthWrite: false }));
    shade.position.set(0.02, 0, -4e-3);
    scene.add(shade);
    let az = 0, el = 0.9, zoom = 1, base = 2;
    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const tv = Math.tan(camera.fov / 2 * Math.PI / 180);
      base = Math.max(0.62 / (tv * camera.aspect), 0.66 / tv);
    };
    const place = () => {
      const d = base * zoom;
      camera.position.set(d * Math.cos(el) * Math.sin(az), -d * Math.cos(el) * Math.cos(az), d * Math.sin(el));
      camera.lookAt(0, 0.03, 0.08);
    };
    window.addEventListener("resize", () => {
      resize();
      place();
    });
    resize();
    place();
    warmUp(ctx, renderer, scene, camera);
    ctx.goto = (n) => {
      if (n === ctx.cur) return;
      const old = pages[ctx.cur];
      if (old) {
        old.setOpen(false, true);
        scene.remove(old.root);
      }
      const pg = pages[n];
      scene.add(pg.root);
      pg.setMode(ctx.mode);
      if (pg.logic.opening) pg.logic.opening(pg);
      setTimeout(() => pg.setOpen(true), 150);
      activate(ctx, n);
    };
    ctx.togglePaper = () => {
      ctx.mode = ctx.mode === "arOnly" ? "cover" : "arOnly";
      Object.values(pages).forEach((p) => p.setMode(ctx.mode));
      shade.visible = ctx.mode !== "arOnly";
      ui.setPaperMode(ctx.mode === "arOnly");
      ui.toast(ctx.mode === "arOnly" ? "かみを かくして、ARの ぶぶんだけ ひょうじ" : "かみも ひょうじ", 2200);
    };
    const ray = new THREE11.Raycaster(), ndc = new THREE11.Vector2();
    attachInput(renderer.domElement, {
      onTap: (x, y) => {
        ctx.sound.unlock();
        const r = renderer.domElement.getBoundingClientRect();
        ndc.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
        scene.updateMatrixWorld();
        ray.setFromCamera(ndc, camera);
        const pg = pages[ctx.cur];
        pg.tap(pg.pick(ray), ctx.phase[ctx.cur] === "play");
      },
      onDrag: (dx, dy) => {
        az = Math.max(-0.7, Math.min(0.7, az - dx * 5e-3));
        el = Math.max(0.3, Math.min(1.38, el + dy * 5e-3));
        place();
      },
      onPinch: (k) => {
        zoom = Math.max(0.55, Math.min(1.4, zoom / k));
        place();
      },
      onGrab: (x, y) => pages[ctx.cur].grab(pickAt(x, y)),
      onRub: (x, y, d) => pages[ctx.cur].rubAt(pickAt(x, y), d),
      onRelease: (x, y) => pages[ctx.cur].release(pickAt(x, y))
    });
    function pickAt(x, y) {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
      scene.updateMatrixWorld();
      ray.setFromCamera(ndc, camera);
      return pages[ctx.cur].touchAt(ray);
    }
    ui.setPaperLabel("ARだけ");
    ui.setNav(ctx.count > 1);
    ui.show(true);
    ctx.goto(1);
    const clock = new THREE11.Clock(), cam = new THREE11.Vector3();
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      const pg = pages[ctx.cur];
      camera.getWorldPosition(cam);
      pg.setViewDir(pg.root.worldToLocal(cam.clone()));
      pg.measure(camera, container.clientWidth, container.clientHeight);
      pg.update(dt);
      renderer.render(scene, camera);
    });
  }

  // books/usagi-kuma-christmas/pages/p1/script.js
  var squash = (pg, id, k = 0.12, dur = 0.4) => {
    const b = pg.C(id).body;
    pg.tween(dur, (t) => {
      const u = Math.sin(Math.PI * t);
      b.scale.set(1 + u * k * 0.5, 1 - u * k, 1);
    }, () => b.scale.set(1, 1, 1));
  };
  var script_default = {
    moves: {
      // うさぎさん「やったー」：ぐっと しゃがんで ためて → 大ジャンプしながら くるっと 1回 → ぴょんぴょん（2.6 秒）
      usaJump(pg, id) {
        squash(pg, id, 0.16, 0.45);
        pg.later(450, () => {
          pg.hop(id, 0.1, 0.9);
          pg.spin(id, "y", 1, 1.2);
        });
        pg.later(1700, () => pg.hop(id, 0.03, 0.45, 2));
        return 2.6;
      },
      // うさぎさん「どこかな？」：左を見て、右を見て（きょろきょろ）→ みみが ぴんっと のびて ぴょん（2.9 秒）
      usaLook(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.8, (t) => {
          b.rotation.y = t < 0.5 ? Math.sin(t / 0.5 * Math.PI) * 0.6 : -Math.sin((t - 0.5) / 0.5 * Math.PI) * 0.6;
        }, () => {
          b.rotation.y = 0;
        });
        pg.later(1850, () => pg.tween(0.7, (t) => {
          const u = Math.sin(Math.PI * t);
          b.scale.set(1 - u * 0.05, 1 + u * 0.14, 1);
        }, () => b.scale.set(1, 1, 1)));
        pg.later(2350, () => pg.hop(id, 0.03, 0.5));
        return 2.9;
      },
      // うさぎさん（うれしい）：ぴょーん、ぴょん、ぴょっ（だんだん小さく。1.75 秒）
      usaHop3(pg, id) {
        pg.hop(id, 0.08, 0.7);
        pg.later(700, () => pg.hop(id, 0.05, 0.55));
        pg.later(1250, () => pg.hop(id, 0.025, 0.45));
        return 1.75;
      }
    }
  };

  // books/usagi-kuma-christmas/pages/p2/script.js
  var squash2 = (pg, id, k = 0.12, dur = 0.4) => {
    const b = pg.C(id).body;
    pg.tween(dur, (t) => {
      const u = Math.sin(Math.PI * t);
      b.scale.set(1 + u * k * 0.5, 1 - u * k, 1);
    }, () => b.scale.set(1, 1, 1));
  };
  var script_default2 = {
    moves: {
      // うさぎさん「どこかな？」：左を見て、右を見て（きょろきょろ）→ みみが ぴんっと のびて ぴょん（2.9 秒）
      usaLook(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.8, (t) => {
          b.rotation.y = t < 0.5 ? Math.sin(t / 0.5 * Math.PI) * 0.6 : -Math.sin((t - 0.5) / 0.5 * Math.PI) * 0.6;
        }, () => {
          b.rotation.y = 0;
        });
        pg.later(1850, () => pg.tween(0.7, (t) => {
          const u = Math.sin(Math.PI * t);
          b.scale.set(1 - u * 0.05, 1 + u * 0.14, 1);
        }, () => b.scale.set(1, 1, 1)));
        pg.later(2350, () => pg.hop(id, 0.03, 0.5));
        return 2.9;
      },
      // うさぎさん「やったー」：ぐっと しゃがんで ためて → 大ジャンプしながら くるっと 1回 → ぴょんぴょん（2.6 秒）
      usaJump(pg, id) {
        squash2(pg, id, 0.16, 0.45);
        pg.later(450, () => {
          pg.hop(id, 0.1, 0.9);
          pg.spin(id, "y", 1, 1.2);
        });
        pg.later(1700, () => pg.hop(id, 0.03, 0.45, 2));
        return 2.6;
      },
      // うさぎさん（うれしい）：ぴょーん、ぴょん、ぴょっ（だんだん小さく。1.75 秒）
      usaHop3(pg, id) {
        pg.hop(id, 0.08, 0.7);
        pg.later(700, () => pg.hop(id, 0.05, 0.55));
        pg.later(1250, () => pg.hop(id, 0.025, 0.45));
        return 1.75;
      }
    }
  };

  // books/usagi-kuma-christmas/pages/p3/script.js
  var squash3 = (pg, id, k = 0.12, dur = 0.4) => {
    const b = pg.C(id).body;
    pg.tween(dur, (t) => {
      const u = Math.sin(Math.PI * t);
      b.scale.set(1 + u * k * 0.5, 1 - u * k, 1);
    }, () => b.scale.set(1, 1, 1));
  };
  var script_default3 = {
    moves: {
      // うさぎさん「くまさーん！」：ちょっと しゃがんで → くまさんの ほうへ からだを のばして よぶ → ぴょん（2.0 秒）
      usaCall(pg, id) {
        const b = pg.C(id).body;
        squash3(pg, id, 0.1, 0.35);
        pg.later(350, () => pg.tween(1, (t) => {
          b.rotation.z = Math.sin(Math.PI * t) * 0.18;
        }, () => {
          b.rotation.z = 0;
        }));
        pg.later(1400, () => pg.hop(id, 0.04, 0.55));
        return 2;
      },
      // うさぎさん「やったー」：ぐっと しゃがんで ためて → 大ジャンプしながら くるっと 1回 → ぴょんぴょん（2.6 秒）
      usaJump(pg, id) {
        squash3(pg, id, 0.16, 0.45);
        pg.later(450, () => {
          pg.hop(id, 0.1, 0.9);
          pg.spin(id, "y", 1, 1.2);
        });
        pg.later(1700, () => pg.hop(id, 0.03, 0.45, 2));
        return 2.6;
      },
      // くまさん「うとうと → 大あくび → こっくり」（3.6 秒）
      kumaDoze(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.5, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.08;
        }, () => {
          b.rotation.z = 0;
        });
        pg.later(1500, () => pg.tween(1, (t) => {
          const u = Math.sin(Math.PI * t);
          b.scale.set(1 - u * 0.05, 1 + u * 0.12, 1);
        }, () => b.scale.set(1, 1, 1)));
        pg.later(2500, () => pg.tween(1.1, (t) => {
          b.rotation.x = Math.sin(Math.PI * t) * 0.38;
        }, () => {
          b.rotation.x = 0;
        }));
        return 3.6;
      },
      // くまさん「のびーっと おきて → ぶるっ → ゆっくり おじぎ」（3.3 秒）
      kumaWake(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.2, (t) => {
          const u = Math.sin(Math.PI * t);
          b.scale.set(1 - u * 0.05, 1 + u * 0.15, 1);
        }, () => b.scale.set(1, 1, 1));
        pg.later(1200, () => pg.tween(0.8, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 4) * 0.06 * (1 - t);
        }, () => {
          b.rotation.z = 0;
        }));
        pg.later(2050, () => pg.tween(1.2, (t) => {
          b.rotation.x = Math.sin(Math.PI * t) * 0.42;
        }, () => {
          b.rotation.x = 0;
        }));
        return 3.3;
      },
      // くまさん（なんども タッチ）：ゆさゆさ ゆれて もどる（タッチに すぐ こたえる）
      kumaTap(pg, id) {
        const b = pg.C(id).body;
        pg.tween(0.6, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 2) * Math.exp(-3 * t) * 0.1;
        }, () => {
          b.rotation.z = 0;
        });
      },
      // くまさん（うれしい）：のんびり ゆらゆら → ぴょんと とんで ゆっくり くるっ（2.6 秒）
      kumaJoy(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.2, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.1;
        }, () => {
          b.rotation.z = 0;
        });
        pg.later(1200, () => {
          pg.hop(id, 0.06, 0.8);
          pg.spin(id, "y", 1, 1.3);
        });
        return 2.6;
      }
    }
  };

  // books/usagi-kuma-christmas/pages/p4/script.js
  var squash4 = (pg, id, k = 0.12, dur = 0.4) => {
    const b = pg.C(id).body;
    pg.tween(dur, (t) => {
      const u = Math.sin(Math.PI * t);
      b.scale.set(1 + u * k * 0.5, 1 - u * k, 1);
    }, () => b.scale.set(1, 1, 1));
  };
  var script_default4 = {
    moves: {
      // うさぎさん「やったー」：ぐっと しゃがんで ためて → 大ジャンプしながら くるっと 1回 → ぴょんぴょん（2.6 秒）
      usaJump(pg, id) {
        squash4(pg, id, 0.16, 0.45);
        pg.later(450, () => {
          pg.hop(id, 0.1, 0.9);
          pg.spin(id, "y", 1, 1.2);
        });
        pg.later(1700, () => pg.hop(id, 0.03, 0.45, 2));
        return 2.6;
      },
      // うさぎさん（うれしい）：ぴょーん、ぴょん、ぴょっ（だんだん小さく。1.75 秒）
      usaHop3(pg, id) {
        pg.hop(id, 0.08, 0.7);
        pg.later(700, () => pg.hop(id, 0.05, 0.55));
        pg.later(1250, () => pg.hop(id, 0.025, 0.45));
        return 1.75;
      },
      // うさぎさん「ひっぱろう！」：うしろに そって ぐーっと ひっぱり → ぴょん（1.9 秒）
      usaPush(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.4, (t) => {
          b.rotation.x = -Math.sin(Math.PI * t) * 0.3;
        }, () => {
          b.rotation.x = 0;
        });
        pg.later(1400, () => pg.hop(id, 0.03, 0.45));
        return 1.9;
      },
      // くまさん（うれしい）：のんびり ゆらゆら → ぴょんと とんで ゆっくり くるっ（2.6 秒）
      kumaJoy(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.2, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.1;
        }, () => {
          b.rotation.z = 0;
        });
        pg.later(1200, () => {
          pg.hop(id, 0.06, 0.8);
          pg.spin(id, "y", 1, 1.3);
        });
        return 2.6;
      },
      // くまさん「がんばるよ」：うしろに そって ぐぐっと ひっぱり → ふう（2.0 秒）
      kumaPush(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.5, (t) => {
          b.rotation.x = -Math.sin(Math.PI * t) * 0.28;
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.04;
        }, () => {
          b.rotation.x = 0;
          b.rotation.z = 0;
        });
        pg.later(1500, () => squash4(pg, id, 0.08, 0.5));
        return 2;
      },
      // くまさん「うとうと → 大あくび → こっくり」（3.6 秒）
      kumaDoze(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.5, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.08;
        }, () => {
          b.rotation.z = 0;
        });
        pg.later(1500, () => pg.tween(1, (t) => {
          const u = Math.sin(Math.PI * t);
          b.scale.set(1 - u * 0.05, 1 + u * 0.12, 1);
        }, () => b.scale.set(1, 1, 1)));
        pg.later(2500, () => pg.tween(1.1, (t) => {
          b.rotation.x = Math.sin(Math.PI * t) * 0.38;
        }, () => {
          b.rotation.x = 0;
        }));
        return 3.6;
      },
      // クラッカー（なんども タッチ）：ぎゅっと ちぢんで ぷるん（タッチに すぐ こたえる）
      crackerShake(pg, id) {
        const b = pg.C(id).body;
        pg.tween(0.5, (t) => {
          const e = Math.sin(t * Math.PI * 2) * Math.exp(-3 * t) * 0.12;
          b.scale.set(1 + e, 1 - e, 1);
        }, () => b.scale.set(1, 1, 1));
      },
      // クラッカー（クリア）：ぎゅーっと ためて → パーン！ テープと かみふぶきが とびだす（1.9 秒）
      crackerPop(pg, id) {
        const b = pg.C(id).body;
        pg.tween(0.7, (t) => {
          const u = Math.sin(Math.PI * t);
          b.scale.set(1 + u * 0.1, 1 - u * 0.14, 1);
        }, () => b.scale.set(1, 1, 1));
        pg.later(650, () => {
          pg.sfx("fwBoom");
          pg.swap(id, "cracker@pan");
          pg.burst(id, 40, 1.4, ["#e8424f", "#f2c14e", "#4aa0e0", "#8cc66a", "#e86ab0", "#ffffff"]);
          pg.hop(id, 0.04, 0.6);
        });
        pg.later(1100, () => pg.firework(pg.top(id, 1.3), "#ffe36b", "#e8424f", "peony"));
        return 1.9;
      }
    }
  };

  // books/usagi-kuma-christmas/pages/p5/script.js
  var script_default5 = {
    moves: {
      // うさぎさん（ねている）：ゆっくり ゆらゆら、すう すう（2.8 秒）
      usaSleep(pg, id) {
        const b = pg.C(id).body;
        pg.tween(2.8, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.07;
          b.scale.set(1, 1 + Math.sin(t * Math.PI * 2) * 0.03, 1);
        }, () => {
          b.rotation.z = 0;
          b.scale.set(1, 1, 1);
        });
        return 2.8;
      },
      // くまさん（ねている）：ゆっくり すう すう、こっくり（3.2 秒）
      kumaSleep(pg, id) {
        const b = pg.C(id).body;
        pg.tween(3.2, (t) => {
          b.scale.set(1 + Math.sin(t * Math.PI * 2) * 0.02, 1 + Math.sin(t * Math.PI * 2) * 0.04, 1);
          b.rotation.x = Math.sin(Math.PI * t) * 0.2;
        }, () => {
          b.scale.set(1, 1, 1);
          b.rotation.x = 0;
        });
        return 3.2;
      },
      // サンタさん「ホッホッホー」：ゆったり ゆれて、ふくらむように わらう（2.0 秒）
      santaWave(pg, id) {
        const b = pg.C(id).body;
        pg.tween(2, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 3) * 0.06 * (1 - t * 0.5);
          const s = 1 + Math.sin(Math.PI * t) * 0.05;
          b.scale.set(s, s, 1);
        }, () => {
          b.rotation.z = 0;
          b.scale.set(1, 1, 1);
        });
        pg.later(600, () => pg.burst(id, 10, 0.7, ["#ffffff", "#fff6c9"]));
        return 2;
      },
      // トナカイ「シャンシャン」：そらを かけるように ぽん ぽん ぽん（2.0 秒）
      tonakaiRun(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        pg.tween(2, (t) => {
          b.position.y = bs.y + Math.abs(Math.sin(t * Math.PI * 3)) * 0.03;
          b.rotation.z = Math.sin(t * Math.PI * 3) * 0.05;
        }, () => {
          b.position.y = bs.y;
          b.rotation.z = 0;
        });
        pg.later(300, () => pg.burst(id, 8, 0.6, ["#fff6c9", "#ffe08a"]));
        return 2;
      },
      // サンタさんの そり（クリア）：すうっと 右上へ とんでいって、ゆっくり もどる（3.2 秒）
      soriFly(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        pg.tween(3.2, (t) => {
          const u = Math.sin(Math.PI * t);
          b.position.x = bs.x + u * 0.12;
          b.position.y = bs.y + u * 0.05;
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.05;
        }, () => {
          b.position.x = bs.x;
          b.position.y = bs.y;
          b.rotation.z = 0;
        });
        pg.later(500, () => pg.burst(id, 16, 1, ["#fff6c9", "#ffffff", "#ffe08a"]));
        return 3.2;
      },
      // トナカイ（クリア）：そりと いっしょに すうっと とんで、ゆっくり もどる（3.2 秒）
      tonakaiFly(pg, id) {
        const c = pg.C(id), b = c.body, bs = pg.base(c);
        pg.tween(3.2, (t) => {
          const u = Math.sin(Math.PI * t);
          b.position.x = bs.x + u * 0.12;
          b.position.y = bs.y + u * 0.06 + Math.abs(Math.sin(t * Math.PI * 4)) * 0.01;
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.05;
        }, () => {
          b.position.x = bs.x;
          b.position.y = bs.y;
          b.rotation.z = 0;
        });
        return 3.2;
      }
    }
  };

  // books/usagi-kuma-christmas/pages/p6/script.js
  var squash5 = (pg, id, k = 0.12, dur = 0.4) => {
    const b = pg.C(id).body;
    pg.tween(dur, (t) => {
      const u = Math.sin(Math.PI * t);
      b.scale.set(1 + u * k * 0.5, 1 - u * k, 1);
    }, () => b.scale.set(1, 1, 1));
  };
  var script_default6 = {
    moves: {
      // くまさん「のびーっと おきて → ぶるっ → ゆっくり おじぎ」（3.3 秒）
      kumaWake(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.2, (t) => {
          const u = Math.sin(Math.PI * t);
          b.scale.set(1 - u * 0.05, 1 + u * 0.15, 1);
        }, () => b.scale.set(1, 1, 1));
        pg.later(1200, () => pg.tween(0.8, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 4) * 0.06 * (1 - t);
        }, () => {
          b.rotation.z = 0;
        }));
        pg.later(2050, () => pg.tween(1.2, (t) => {
          b.rotation.x = Math.sin(Math.PI * t) * 0.42;
        }, () => {
          b.rotation.x = 0;
        }));
        return 3.3;
      },
      // くまさん（うれしい）：のんびり ゆらゆら → ぴょんと とんで ゆっくり くるっ（2.6 秒）
      kumaJoy(pg, id) {
        const b = pg.C(id).body;
        pg.tween(1.2, (t) => {
          b.rotation.z = Math.sin(t * Math.PI * 2) * 0.1;
        }, () => {
          b.rotation.z = 0;
        });
        pg.later(1200, () => {
          pg.hop(id, 0.06, 0.8);
          pg.spin(id, "y", 1, 1.3);
        });
        return 2.6;
      },
      // うさぎさん「やったー」：ぐっと しゃがんで ためて → 大ジャンプしながら くるっと 1回 → ぴょんぴょん（2.6 秒）
      usaJump(pg, id) {
        squash5(pg, id, 0.16, 0.45);
        pg.later(450, () => {
          pg.hop(id, 0.1, 0.9);
          pg.spin(id, "y", 1, 1.2);
        });
        pg.later(1700, () => pg.hop(id, 0.03, 0.45, 2));
        return 2.6;
      },
      // うさぎさん（うれしい）：ぴょーん、ぴょん、ぴょっ（だんだん小さく。1.75 秒）
      usaHop3(pg, id) {
        pg.hop(id, 0.08, 0.7);
        pg.later(700, () => pg.hop(id, 0.05, 0.55));
        pg.later(1250, () => pg.hop(id, 0.025, 0.45));
        return 1.75;
      }
    }
  };

  // .cache/build/usagi-kuma-christmas/engine.js
  var scripts = { "p1": script_default, "p2": script_default2, "p3": script_default3, "p4": script_default4, "p5": script_default5, "p6": script_default6 };
  function assets() {
    const B = window.EHON_BOOK, P = window.EHON_PICTURES;
    return {
      book: B.book,
      read: B.read,
      lang: B.lang,
      font: P.font,
      cast: P.cast,
      items: P.items,
      thumbs: P.thumbs,
      coverTarget: P.coverTarget,
      nurie: window.EHON_NURIE || null,
      pages: B.pages.map((p, i) => ({ ...p, ...P.pages[i] }))
    };
  }
  window.EhonEngine = {
    start({ mode = "preview", mind = "ehon/targets.mind" } = {}) {
      const ar = mode === "ar";
      return init({ ar, assets: assets(), scripts, startAR: ar ? (ctx) => runAR(ctx, window.MindARThree, mind) : null });
    }
  };
})();
