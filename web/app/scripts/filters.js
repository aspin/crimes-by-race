import { createBarGraph } from './graphs';

import {
  CrimeByRace,
  Population,
  ViolentCrime,
  PropertyCrime,
  DrugCrime,
  OtherCrime,
  Reporting,
  Poverty,
  Incarceration,
  WhiteCollar
} from './data';

const AMERICAN_POPULATION = 318900000;
const AllCrimes = Object.keys(CrimeByRace);

export function renderDefault(context) {
  return render(context, AllCrimes, createScaling(1, 1, 1), 'Number of people arrests');
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
      backgroundColor: 'rgba(255, 255, 255, 0.5)'
    }
  ];
  return createBarGraph(context, labels, datasets);
}


function update(chart, dataset, label) {
  chart.data.datasets[0].data = dataset;
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
  let showingOptions = true;
  $('#graphs .toggle').click(() => {
    if (showingOptions) {
      $('#graphs .options').css('right', '-250px');
    } else {
      $('#graphs .options').css('right', '0px');
    }
    showingOptions = !showingOptions;
  });

  $('form').change((event) => {
    event.preventDefault();
    updateForm(event.currentTarget);
    const label = getLabel(event.currentTarget);
    const scaling = getScaling(event.currentTarget);
    const crimes = getCrimes(event.currentTarget);
    const dataSet = makeDataset(event.currentTarget, crimes, scaling);
    update( barChart, dataSet, label );
  });
}

function updateForm(form) {
  if (form.showing.value == 'incarceration') {
    $('#chart-offenses input[type=checkbox]').prop('disabled', true);
  } else {
    $('#chart-offenses input[type=checkbox]').prop('disabled', false);
  }
}

function makeDataset(form, crimes, scaling) {
  let dataset = [
    computeCrimeTotal(crimes, 'white', scaling.white),
    computeCrimeTotal(crimes, 'black', scaling.black),
    computeCrimeTotal(crimes, 'asian', scaling.asian)
  ];

  if (form.showing.value == 'incarceration') {
    dataset = [
      Incarceration.white * scaling.white,
      Incarceration.black * scaling.black,
      Incarceration.asian * scaling.asian
    ];
  }
  return dataset;
}

function getLabel(form) {
  let verb = 'arrested';
  let quantity = 'Number';
  let noun = 'people';

  if (form.scalePopulation.checked) {
    quantity = 'Percent';
    noun = 'population';
  }

  if (form.showing.value == 'incarceration') {
    verb = 'incarcerated';
  }

  return `${ quantity } of ${ noun } ${ verb }`;
}

function getScaling(form) {
  let scaling = createScaling(1, 1, 1);
  if (form.scalePopulation.checked) {
    scaling = _.mapValues(Population, percent => (1 / (percent * AMERICAN_POPULATION)));
  }
  if (form.reportedCrime.checked) {
    _.forOwn(scaling, (scale, race) => {
      scaling[race] = scale / Reporting[race];
    });
  }
  if (form.poverty.checked) {
    _.forOwn(scaling, (scale, race) => {
      scaling[race] = scale * (1 - (0.50 * Poverty[race]));
    });
  }
  if (form.whiteCollar.checked) {
    _.forOwn(scaling, (scale, race) => {
      scaling[race] = scale * (1 + WhiteCollar[race]);
    });
  }
  return scaling;
}

function getCrimes(form) {
  let crimes = [];
  if (form.violentCrime.checked) {
    crimes.push(...ViolentCrime);
  }
  if (form.propertyCrime.checked) {
    crimes.push(...PropertyCrime);
  }
  if (form.drugOffenses.checked) {
    crimes.push(...DrugCrime);
  }
  if (form.other.checked) {
    crimes.push(...OtherCrime);
  }
  return crimes;
}
