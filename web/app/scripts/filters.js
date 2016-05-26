import { createBarGraph } from './graphs';

import {
  CrimeByRace,
  Population,
  ViolentCrime,
  PropertyCrime,
  DrugCrime,
  OtherCrime,
  Reporting,
  Poverty
} from './data';

const AMERICAN_POPULATION = 318900000;
const AllCrimes = Object.keys(CrimeByRace);

export function renderDefault(context) {
  return render(context, AllCrimes, createScaling(1, 1, 1), 'Number of Arrests');
}

function render(context, crimes, scaling, label) {
  const labels = ['White', 'Black', 'Asian'];
  const datasets = [
    {
      label: label,
      data: [
        computeCrimeTotal(crimes, 'white', scaling.white),
        computeCrimeTotal(crimes, 'black', scaling.black),
        computeCrimeTotal(crimes, 'asian', scaling.asian)
      ],
      backgroundColor: 'rgba(108, 149, 66, 0.5)'
    }
  ];
  return createBarGraph(context, labels, datasets);
}


function update(chart, crimes, scaling, label) {
  chart.data.datasets[0].data = [
    computeCrimeTotal(crimes, 'white', scaling.white),
    computeCrimeTotal(crimes, 'black', scaling.black),
    computeCrimeTotal(crimes, 'asian', scaling.asian)
  ];
  chart.data.datasets[0].label = label;
  chart.update();
}

function computeCrimeTotal(crimes, race, scale) {
  const crimeStats = _.pick(CrimeByRace, crimes);
  return _.reduce(crimeStats, (sum, breakdown, crime) => {
      return sum + breakdown[race];
    }, 0) * scale;
}

function createScaling(white, black, asian) {
  return { white, black, asian };
}


export function configForm(barChart) {
  $('form').change((event) => {
    event.preventDefault();
    let crimes = [];
    let scaling = createScaling(1, 1, 1);
    let label = 'Number of people arrested';

    if (event.currentTarget.scalePopulation.checked) {
      scaling = _.mapValues(Population, percent => (1 / (percent * AMERICAN_POPULATION)));
      label = 'Percent of population arrested';
    }
    if (event.currentTarget.reportedCrime.checked) {
      _.forOwn(scaling, (scale, race) => {
        scaling[race] = scale / Reporting[race];
      });
    }
    if (event.currentTarget.poverty.checked) {
      // poverty => twice as likely compared to higher income
      // more blacks in poverty
      // reducing count contribution of impoverished part
      _.forOwn(scaling, (scale, race) => {
        scaling[race] = scale * (1 - (0.5 * Poverty[race]));
      });
    }
    if (event.currentTarget.violentCrime.checked) {
      crimes.push(...ViolentCrime);
    }
    if (event.currentTarget.propertyCrime.checked) {
      crimes.push(...PropertyCrime);
    }
    if (event.currentTarget.drugOffenses.checked) {
      crimes.push(...DrugCrime);
    }
    if (event.currentTarget.other.checked) {
      crimes.push(...OtherCrime);
    }
    update(
      barChart,
      crimes,
      scaling,
      label
    );
  });

}
