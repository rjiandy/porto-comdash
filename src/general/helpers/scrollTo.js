// @flow

let scrollAnimationTimeout: ?mixed;

function easeInOutQuad(t: number, b: number, c: number, d: number) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
}

export default function scrollTo(
  scrollNode: Element,
  to: number,
  duration: number,
) {
  let scrollTop = scrollNode.scrollTop;
  let scrollLeft = scrollNode.scrollLeft;
  let change = to - scrollTop;
  let startTime = Date.now();
  // if currently doing an animation, cancel it
  clearTimeout(scrollAnimationTimeout);
  let animateScroll = () => {
    let currentTime = Date.now() - startTime;
    let newScrollTop;
    if (currentTime > duration) {
      newScrollTop = to;
    } else {
      newScrollTop = easeInOutQuad(currentTime, scrollTop, change, duration);
    }
    // $FlowFixMe
    scrollNode.scrollTo(scrollLeft, newScrollTop);
    if (currentTime < duration) {
      scrollAnimationTimeout = requestAnimationFrame(animateScroll);
    }
  };
  scrollAnimationTimeout = requestAnimationFrame(animateScroll);
}
