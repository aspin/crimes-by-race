export function parallaxScroll() {
  const animationVisible = 'translateNone';
  const animationTop = 'translateUp';
  const animationBottom = 'translateDown';
  const animationDuration = 800;
  const animationEasing = 'easeInCubic';

  const $sections = $('section');

  const $visibleSection = $sections.filter('.section-visible');
  const $topSection = $visibleSection.prevAll('section');
  const $bottomSection = $visibleSection.nextAll('section');

  $visibleSection.children('div').velocity(animationVisible, 1, () => {
    $visibleSection.css('opacity', 1);
    $topSection.css('opacity', 1);
    $bottomSection.css('opacity', 1);
  });
  $topSection.children('div').velocity(animationTop, 0);
  $bottomSection.children('div').velocity(animationBottom, 0);

  let delta = 0;
  const scrollThreshold = 5;
  $(window).on('DOMMouseScroll mousewheel', (event) => {
    if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
      delta--;
      if (Math.abs(delta) >= scrollThreshold) {
        previousSection();
      }
    } else {
      delta++;
      if (delta >= scrollThreshold) {
        nextSection();
      }
    }
    return false;
  });

  let animating = false;
  let actual = 1;
  function previousSection() {
    const visibleSection = $sections.filter('.section-visible');
    if (!animating && !visibleSection.is(':first-child')) {
      animating = true;
      visibleSection.removeClass('section-visible')
        .children('div')
        .velocity(animationBottom, animationDuration, animationEasing)
        .end()
        .prev('section')
        .addClass('section-visible')
        .children('div')
        .velocity(animationVisible, animationDuration, animationEasing, () => {
          animating = false;
        });
      actual = actual - 1;
    }
    delta = 0;
  }

  function nextSection() {
    const visibleSection = $sections.filter('.section-visible');
    if (!animating && !visibleSection.is(':last-of-type')) {
      animating = true;
      visibleSection.removeClass('section-visible')
        .children('div')
        .velocity(animationTop, animationDuration, animationEasing)
        .end()
        .next('section')
        .addClass('section-visible')
        .children('div')
        .velocity(animationVisible, animationDuration, animationEasing, () => {
          animating = false;
        });
      actual = actual + 1;
    }
    delta = 0;
  }
}


$.Velocity
  .RegisterEffect('translateDown', {
    defaultDuration: 1,
    calls: [
      [ { translateY: '100%'}, 1]
    ]
  });
$.Velocity
  .RegisterEffect('translateNone', {
    defaultDuration: 1,
    calls: [
      [ { translateY: '0', opacity: '1', scale: '1', rotateX: '0', boxShadowBlur: '0'}, 1]
    ]
  });
$.Velocity
  .RegisterEffect('translateUp', {
    defaultDuration: 1,
    calls: [
      [ { translateY: '-50%'}, 1]
    ]
  });
