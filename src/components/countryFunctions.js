import React from 'react';
import ReactCountryFlag from "react-country-flag";

export default function countryInfo(nation){
  const CountryCodes = require('country-code-info');
  const country = CountryCodes.findCountry({'fifa': nation});
  const countryName = country ? (country.a2 === 'GB' ? convertCountryName(nation) : country.name) : nation;
  const countryA2 = country ? (country.a2 === 'GB' ? (countryName === "Scotland" ? 'GB-SCT' : 'GB-'+nation) : country.a2) : null;
  const countryFlag = countryA2 ? <ReactCountryFlag countryCode={countryA2} svg style={{width: '3em', height: '2.2em', border: '1px solid black'}}/> : null;
  return [countryName, countryFlag];
}

function convertCountryName(country){
  let name = '';
  switch(country){
    case 'ENG':
      name = 'England';
      break;
    case 'NIR':
      name = 'Northern Ireland';
      break;
    case 'SCO':
      name = 'Scotland';
      break;
    case 'WAL':
      name = 'Wales';
      break;
    default:
      name = '';
      break;
  }
  return name;
}
