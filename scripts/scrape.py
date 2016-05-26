from bs4 import BeautifulSoup

import requests
import json

FBI_CRIME_REPORT = 'https://www.fbi.gov/about-us/cjis/ucr/crime-in-the-u.s/2014/crime-in-the-u.s.-2014/tables/table-43'
DATA_DIRECTORY = '../web/app/data/'

def json_crime_by_race(filename):
    fbi_crime_in_us = requests.get(FBI_CRIME_REPORT)
    crime_soup = BeautifulSoup(fbi_crime_in_us.text, 'html.parser')
    crime_table = crime_soup.find(id = 'table-data-container')

    races = [
        'total', 
        'white',
        'black',
        'native',
        'asian',
        'islander'
    ]
    stats = {}

    crime_rows = crime_table.find_all('tr')
    for row in crime_rows[3:]:
        crime = row.find('th').text.strip()
        rates = row.find_all('td')[:6]

        crime_stats = {}
        for i, rate in enumerate(rates):
            crime_stats[races[i]] = int(rate.text.strip().replace(',', ''))
        stats[crime] = crime_stats

    with open(filename, 'w') as f:
        json.dump(stats, f, indent = 4)

def main():
    json_crime_by_race(DATA_DIRECTORY + 'crime_by_race.json')

main()
