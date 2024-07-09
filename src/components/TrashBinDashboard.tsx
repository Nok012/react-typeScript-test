import React from 'react'
import { TrashBin } from '../models/ITrashBin';


function TrashBinTable({ bins }: { bins: TrashBin[] }) {

    return (
        <div>
            <table className="trash-bin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Location</th>
                        <th>Fill Level (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {bins.map((bin) => (
                        <tr key={bin.id} className={bin.fillLevel > 79 ? 'highlight' : ''}>
                            <td>{bin.id}</td>
                            <td>{bin.location}</td>
                            <td>{bin.fillLevel}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default function TrashBinDashboard() {
  return (
    <div>TrashBinDashboard</div>
  )
}
