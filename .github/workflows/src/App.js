import "./styles.css";
import { useState } from "react";

const taxRate = [
  { salary: 500000, rate: 6 },
  { salary: 500000, rate: 12 },
  { salary: 500000, rate: 18 },
  { salary: 500000, rate: 24 },
  { salary: 500000, rate: 30 },
  { salary: 100000000, rate: 36 },
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "LKR",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default function App() {
  const [salary, setSalary] = useState();
  const [tax, setTax] = useState({ range: [0, 0, 0, 0, 0, 0], total: "0.00" });
  const [epf, setEpf] = useState("0.00");
  const [netSalary, setNetSalary] = useState("0.00");

  const handleSalaryChange = (e) => {
    const newSalary = e.target.value;
    const newSalaryInt = parseInt(newSalary) * 12;
    let totalTax = 0;
    if (newSalaryInt > 1200000) {
      let rest = newSalaryInt - 1200000;
      const range = [];
      for (const tax of taxRate) {
        const max = rest > tax.salary ? tax.salary : rest;
        rest -= max;
        const calculatedTax = (max * tax.rate) / 100;
        range.push(formatter.format(calculatedTax / 12));
        totalTax += calculatedTax / 12;
      }

      setTax({ range, total: formatter.format(totalTax) });
    } else {
      setTax({ range: [0, 0, 0, 0, 0, 0], total: "0.00" });
    }

    const epf = (newSalaryInt * 0.08) / 12;
    setEpf(formatter.format(epf));

    setNetSalary(formatter.format(newSalaryInt / 12 - totalTax - epf));

    setSalary(newSalary);
  };
  return (
    <div className="container mt-4">
      <div className="heading">
        <h1>Net Salary Calculator</h1>
        <div class="col-xs-12">Enter your monthly salary</div>
        <input
          type="number"
          value={salary}
          onChange={handleSalaryChange}
          className="required amount form_textfield form-control"
          placeholder="Amount (LKR) *"
        />
        <h5 className="mt-2">
          Calculating net salary for {formatter.format(salary ?? 0)}
        </h5>
      </div>

      <table
        className="bordered"
        style={{ width: "100%", maxWidth: "800px", textAlign: "right" }}
      >
        <thead>
          <tr>
            <th width="33%">Monthly Salary (Annual Salary/12)</th>
            <th width="20%">Rate (%)</th>
            <th>Tax</th>
          </tr>
        </thead>
        <tbody id="tb">
          <tr>
            <td>Up to 1,200,000/12</td>
            <td>Relief</td>
            <td>-</td>
          </tr>
          <tr>
            <td>1st 500,000/12</td>
            <td>6</td>
            <td>{tax.range[0]}</td>
          </tr>
          <tr>
            <td>2nd 500,000/12</td>
            <td>12</td>
            <td>{tax.range[1]}</td>
          </tr>
          <tr>
            <td>3rd 500,000/12</td>
            <td>18</td>
            <td>{tax.range[2]}</td>
          </tr>
          <tr>
            <td>4th 500,000/12</td>
            <td>24</td>
            <td>{tax.range[3]}</td>
          </tr>
          <tr>
            <td>5th 500,000/12</td>
            <td>30</td>
            <td>{tax.range[4]}</td>
          </tr>
          <tr>
            <td>Above 3,700,000/12</td>
            <td>36</td>
            <td>{tax.range[5]}</td>
          </tr>
          <tr>
            <td colSpan="2">
              <strong>Total Tax</strong>
            </td>
            <td>
              <strong>{tax.total}</strong>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colSpan="2">
              <strong>EPF</strong> (8%)
            </td>
            <td>{epf}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colSpan="2">
              <strong>Net Salary</strong>
            </td>
            <td>{netSalary}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
