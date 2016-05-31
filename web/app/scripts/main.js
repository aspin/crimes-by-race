import { configGraphs } from './graphs';
import { rotateHeader } from './rotating-header';
import { parallaxScroll } from './scroll';
import { renderDefault, configForm } from './filters';



$(document).ready(() => {
  const context = document.getElementById('chart');
  const barChart = renderDefault(context);
  configForm(barChart);
  configGraphs();
  rotateHeader();
  parallaxScroll();
});



