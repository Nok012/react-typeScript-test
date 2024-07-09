import React, { useState } from 'react'
import { TrashBin } from '../models/ITrashBin';
import { mockTrashBins } from '../mock/TrashBin';
import { Button, Typography } from '@mui/material';


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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<'id' | 'fillLevel' | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const filteredBins = mockTrashBins.filter(bin =>
        bin.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedBins = [...filteredBins].sort((a, b) => {
        if (sortField) {
            const fieldA = a[sortField];
            const fieldB = b[sortField];

            if (fieldA < fieldB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (fieldA > fieldB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const handleSort = (field: 'id' | 'fillLevel') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    return (
        <div>
            <Typography variant="h3" sx={{ textAlign: 'center', mt: 8, mb: 4 }} component="h3">
                Trash Bin Dashboard
            </Typography>
            <input
                type="text"
                placeholder="Search by location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="sort-buttons">
                <Button variant="contained" onClick={() => handleSort('id')}>
                    Sort by ID
                </Button>
                <Button variant="contained" onClick={() => handleSort('fillLevel')}>
                    Sort by Fill Level
                </Button>
            </div>
            <Typography variant="h5" sx={{ textAlign: 'center' }} component="h5">
                Trash Table
            </Typography>
            <TrashBinTable bins={sortedBins} />
        </div>
    )
}
