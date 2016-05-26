export function configGraphs() {
  Chart.defaults.global.defaultFontColor = '#6C9542';
  Chart.defaults.global.defaultFontFamily = 'Source Sans Pro';

  Chart.defaults.global.legend.display = false;
}

export function createBarGraph2() {
  const data = {
    labels: ['White', 'Black', 'Asian'],
    series: [
      [
        computeCrimeTotal(AllCrimes, 'white'),
        computeCrimeTotal(AllCrimes, 'black'),
        computeCrimeTotal(AllCrimes, 'asian')
      ]
    ]
  };
  const options = {
    plugins: [
      Chartist.plugins.ctBarLabels()
    ]
  };

  new Chartist.Bar('.ct-chart', data, options);
}

export function createBarGraph(context, labels, datasets) {
  const chartData = {
    labels: labels,
    datasets: datasets
  };
  return new Chart(context, {
    type: 'bar',
    data: chartData
  });
}
