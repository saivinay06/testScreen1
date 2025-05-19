import React from "react";

function PackageTable({ data }) {
  return (
    <table className="table-auto w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-1 py-2">S.No</th>
          <th className="border border-gray-300 px-4 py-2">Game type</th>
          <th className="border border-gray-300 px-4 py-2">Game mode</th>
          <th className="border border-gray-300 px-4 py-2">Tier</th>
          <th className="border border-gray-300 px-4 py-2">Entry fee </th>
        </tr>
      </thead>
      <tbody>
        {data.map((each, _) => (
          <tr key={each.id}>
            <td className="px-4 py-2">{each.id}</td>
            <td className="px-4 py-2">{each.gameType}</td>
            <td className="px-4 py-2">{each.gameMode}</td>
            <td className="px-4 py-2">{each.tier}</td>
            <td className="px-4 py-2">{each.entryFee}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PackageTable;
