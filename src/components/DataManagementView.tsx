import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Progress } from './ui/progress';
import { Database, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react';

export function DataManagementView() {
  const [selectedDataset, setSelectedDataset] = useState('nutrition');

  const datasets = [
    { id: 'nutrition', name: 'Nutrition', records: 45678, issues: 12, status: 'warning', lastSync: '15 min' },
    { id: 'exercises', name: 'Exercices', records: 23456, issues: 3, status: 'success', lastSync: '5 min' },
    { id: 'biometry', name: 'Biométrie', records: 67890, issues: 8, status: 'warning', lastSync: '22 min' },
  ];

  const anomalies = [
    { 
      id: 1, 
      type: 'duplicate', 
      dataset: 'Nutrition',
      field: 'user_id: 12345',
      description: 'Enregistrement dupliqué détecté pour le même utilisateur et timestamp',
      severity: 'high',
      count: 3
    },
    { 
      id: 2, 
      type: 'missing', 
      dataset: 'Nutrition',
      field: 'calories',
      description: 'Valeur manquante dans le champ calories (8 enregistrements)',
      severity: 'high',
      count: 8
    },
    { 
      id: 3, 
      type: 'outlier', 
      dataset: 'Nutrition',
      field: 'protein',
      description: 'Valeur aberrante : 9999g de protéines (moyenne: 85g)',
      severity: 'medium',
      count: 1
    },
    { 
      id: 4, 
      type: 'format', 
      dataset: 'Exercices',
      field: 'duration',
      description: 'Format incorrect : durée en minutes au lieu de secondes',
      severity: 'low',
      count: 2
    },
    { 
      id: 5, 
      type: 'missing', 
      dataset: 'Biométrie',
      field: 'heart_rate',
      description: 'Données de fréquence cardiaque manquantes',
      severity: 'medium',
      count: 5
    },
  ];

  const [selectedAnomalies, setSelectedAnomalies] = useState<number[]>([]);

  const toggleAnomaly = (id: number) => {
    setSelectedAnomalies(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const serverStatus = [
    { name: 'Serveur Principal ETL', status: 'online', cpu: 45, memory: 62, uptime: '99.8%' },
    { name: 'Base de Données PostgreSQL', status: 'online', cpu: 38, memory: 71, uptime: '99.9%' },
    { name: 'API Gateway', status: 'warning', cpu: 78, memory: 85, uptime: '98.2%' },
  ];

  return (
    <div className="space-y-6">
      {/* Datasets Overview */}
      <section aria-labelledby="datasets-section">
        <h3 id="datasets-section" className="text-lg font-semibold text-[#4A5568] mb-4">
          Datasets Disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <Card
              key={dataset.id}
              className={`cursor-pointer transition-all ${
                selectedDataset === dataset.id 
                  ? 'ring-2 ring-[#4A90E2]' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedDataset(dataset.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4A90E2] bg-opacity-10 flex items-center justify-center">
                      <Database className="w-5 h-5 text-[#4A90E2]" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#4A5568]">{dataset.name}</h4>
                      <p className="text-xs text-[#4A5568] opacity-70">
                        {dataset.records.toLocaleString()} enreg.
                      </p>
                    </div>
                  </div>
                  {dataset.status === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-[#FFB88C]" aria-label="Avertissement" />
                  )}
                  {dataset.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-[#5CC58C]" aria-label="Aucun problème" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#4A5568] opacity-70">Anomalies</span>
                  <Badge variant={dataset.issues > 5 ? "destructive" : "secondary"}>
                    {dataset.issues}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-[#4A5568] opacity-70">Dernière sync</span>
                  <span className="text-[#4A5568]">{dataset.lastSync}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Data Quality & Anomalies */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>
              Gestion des Anomalies - {datasets.find(d => d.id === selectedDataset)?.name}
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5568] opacity-50" aria-hidden="true" />
                <Input
                  type="search"
                  placeholder="Rechercher une anomalie..."
                  className="pl-10 w-64"
                  aria-label="Rechercher une anomalie"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="duplicate">Doublons</SelectItem>
                  <SelectItem value="missing">Manquants</SelectItem>
                  <SelectItem value="outlier">Aberrants</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox aria-label="Sélectionner toutes les anomalies" />
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Champ</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sévérité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anomalies
                  .filter(a => a.dataset === datasets.find(d => d.id === selectedDataset)?.name)
                  .map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedAnomalies.includes(anomaly.id)}
                        onCheckedChange={() => toggleAnomaly(anomaly.id)}
                        aria-label={`Sélectionner l'anomalie ${anomaly.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#4A90E2] bg-opacity-10 text-[#4A90E2] border-[#4A90E2]">
                        {anomaly.type === 'duplicate' && 'Doublon'}
                        {anomaly.type === 'missing' && 'Manquant'}
                        {anomaly.type === 'outlier' && 'Aberrant'}
                        {anomaly.type === 'format' && 'Format'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#4A5568]">{anomaly.dataset}</TableCell>
                    <TableCell>
                      <code className="text-sm font-mono text-[#4A5568] bg-gray-100 px-2 py-1 rounded">
                        {anomaly.field}
                      </code>
                    </TableCell>
                    <TableCell className="text-[#4A5568]">
                      {anomaly.description}
                      <span className="ml-2 text-xs text-[#4A5568] opacity-70">
                        ({anomaly.count} occurrence{anomaly.count > 1 ? 's' : ''})
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          anomaly.severity === 'high' 
                            ? 'bg-[#FF887B] bg-opacity-10 text-[#FF887B] border-[#FF887B]'
                            : anomaly.severity === 'medium'
                            ? 'bg-[#FFB88C] bg-opacity-10 text-[#FFB88C] border-[#FFB88C]'
                            : 'bg-[#7FD8BE] bg-opacity-10 text-[#7FD8BE] border-[#7FD8BE]'
                        }
                      >
                        {anomaly.severity === 'high' && 'Élevée'}
                        {anomaly.severity === 'medium' && 'Moyenne'}
                        {anomaly.severity === 'low' && 'Faible'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm"
                          className="bg-[#5CC58C] hover:bg-[#4db57a]"
                          aria-label={`Valider l'anomalie ${anomaly.id}`}
                        >
                          Valider
                        </Button>
                        <Button 
                          size="sm"
                          variant="destructive"
                          className="bg-[#FF887B] hover:bg-[#ff7066]"
                          aria-label={`Rejeter l'anomalie ${anomaly.id}`}
                        >
                          Rejeter
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedAnomalies.length > 0 && (
            <div className="mt-4 p-4 bg-[#4A90E2] bg-opacity-10 rounded-lg flex items-center justify-between">
              <p className="text-sm text-[#4A5568]">
                <span className="font-semibold">{selectedAnomalies.length}</span> anomalie{selectedAnomalies.length > 1 ? 's' : ''} sélectionnée{selectedAnomalies.length > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-3">
                <Button className="bg-[#5CC58C] hover:bg-[#4db57a]">
                  Valider la sélection
                </Button>
                <Button variant="destructive" className="bg-[#FF887B] hover:bg-[#ff7066]">
                  Rejeter la sélection
                </Button>
                <Button variant="outline">
                  Corriger automatiquement
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des Serveurs ETL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serverStatus.map((server, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      server.status === 'online' ? 'bg-[#5CC58C]' : 'bg-[#FFB88C]'
                    }`} aria-label={server.status === 'online' ? 'En ligne' : 'Avertissement'}></div>
                    <h4 className="font-semibold text-[#4A5568]">{server.name}</h4>
                  </div>
                  <Badge variant="outline" className="bg-[#5CC58C] bg-opacity-10 text-[#5CC58C] border-[#5CC58C]">
                    Uptime: {server.uptime}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#4A5568] opacity-70 mb-2">CPU</p>
                    <Progress value={server.cpu} className="h-2" />
                    <p className="text-sm font-semibold text-[#4A5568] mt-1">{server.cpu}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4A5568] opacity-70 mb-2">Mémoire</p>
                    <Progress value={server.memory} className="h-2" />
                    <p className="text-sm font-semibold text-[#4A5568] mt-1">{server.memory}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}