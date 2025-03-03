import { useState } from 'react'
import './TrashBinDashboard.css';
import { TrashBin } from '../models/ITrashBin';
import { mockTrashBins } from '../mock/TrashBin';
import { Button, Container, CssBaseline, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


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

function TrashBinMap({ bins }: { bins: TrashBin[] }) {

    const getMarkerIcon = (fillLevel: number) => {
        if (fillLevel > 79) return 'icons/marker-red.png';
        return 'icons/marker-green.png';
    };

    const createCustomIcon = (iconUrl: string) => {
        return new L.Icon({
            iconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
            shadowAnchor: [12, 41]
        });
    };

    return (
        <div>

            <MapContainer center={[13.7563, 100.5018]} zoom={13} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {bins.map((bin) => (
                    <Marker
                        key={bin.id}
                        position={bin.coordinates}
                        icon={createCustomIcon(getMarkerIcon(bin.fillLevel))}
                    >
                        <Popup>
                            <b>ID:</b> {bin.id} <br />
                            <b>Location:</b> {bin.location} <br />
                            <b>Fill Level:</b> {bin.fillLevel}%
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
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
            <CssBaseline />
            <Container maxWidth="lg">
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

            <Typography variant="h5" sx={{ textAlign: 'center', mt: 8, mb: 2 }} component="h5">
                Trash Bin Chart
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sortedBins}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fillLevel" fill="#7b1fa2" barSize={100} />
                </BarChart>
            </ResponsiveContainer>

            <Typography variant="h5" sx={{ textAlign: 'center', mt: 8, mb: 2 }} component="h5">
                Trash Bin Map
            </Typography>
            <TrashBinMap bins={sortedBins} />
            </Container>
        </div>
    )
}
