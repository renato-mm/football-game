import React from 'react';
import './teamHomePanelFinance.css';

export default function TeamHomePanelFinance(props){

  const cashFormat = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: "name",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <div>
      <table className = {"teamHomePanelFinance"}>
        <thead>
          <tr>
            <th>Season</th>
            <th>{props.season}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan="2">Incomes</th>
          </tr>
          <tr>
            <td>Tickets</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Players sold</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Prizes</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th colSpan="2">Expenses</th>
          </tr>
          <tr>
            <td>Salaries</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Players bought</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Stands</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Interest</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td>Total income</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Total expense</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Balance</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
      </table>
      <table className = {"teamHomePanelFinanceCurrent"}>
        <tbody>
          <tr>
            <td>Total salaries</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Loan interest</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Current cash</td>
            <td>{cashFormat(0)}</td>
          </tr>
          <tr>
            <td>Tickets cost</td>
            <td>{cashFormat(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  
}
