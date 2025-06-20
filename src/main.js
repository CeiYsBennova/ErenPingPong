import gsap from 'https://esm.run/gsap';
import Draggable from 'https://esm.run/gsap/Draggable';
import InertiaPlugin from 'https://esm.run/gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

const friction = -0.7;
let vw = window.innerWidth;
let vh = window.innerHeight;

const ball = document.querySelector(".ball");
if (!ball) throw new Error("Missing .ball");

const radius = ball.getBoundingClientRect().width / 2;
const ballProps = gsap.getProperty(ball);
const tracker = InertiaPlugin.track(ball, "x,y")[0];

gsap.defaults({ overwrite: true });

gsap.set(ball, {
  xPercent: -50,
  yPercent: -50,
  x: vw / 2,
  y: vh / 2,
});

new Draggable(ball, {
  bounds: window,
  onPress() {
    gsap.killTweensOf(ball);
    this.update();
  },
  onDragEnd: animateBounce
});

window.addEventListener("resize", () => {
  vw = window.innerWidth;
  vh = window.innerHeight;
});

function animateBounce(x = "+=0", y = "+=0", vx = "auto", vy = "auto") {
  gsap.fromTo(ball, { x, y }, {
    inertia: { x: vx, y: vy },
    onUpdate: checkBounds
  });
}

function checkBounds() {
  let x = ballProps("x");
  let y = ballProps("y");
  let vx = tracker.get("x");
  let vy = tracker.get("y");
  let xPos = x;
  let yPos = y;
  let hitting = false;

  if (x + radius > vw) {
    xPos = vw - radius;
    vx *= friction;
    hitting = true;
  } else if (x - radius < 0) {
    xPos = radius;
    vx *= friction;
    hitting = true;
  }

  if (y + radius > vh) {
    yPos = vh - radius;
    vy *= friction;
    hitting = true;
  } else if (y - radius < 0) {
    yPos = radius;
    vy *= friction;
    hitting = true;
  }

  if (hitting) {
    animateBounce(xPos, yPos, vx, vy);
  }
}
