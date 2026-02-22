/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Progress } from '../ui/progress';
import { Activity, Server, AlertTriangle, CheckCircle, Clock, TrendingUp, XCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ApiLogsView() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // API Calls data
  const apiCallsData = [
    { time: '00:00', calls: 234, errors: 2, latency: 145 },
    { time: '04:00', calls: 156, errors: 1, latency: 132 },
    { time: '08:00', calls: 567, errors: 5, latency: 178 },
    { time: '12:00', calls: 892, errors: 8, latency: 234 },
    { time: '16:00', calls: 745, errors: 6, latency: 198 },
    { time: '20:00', calls: 623, errors: 4, latency: 167 },
  ];

  // Endpoints stats
  const endpointsStats = [
    { endpoint: '/api/v1/nutrition/meals', calls: 12456, avgLatency: 145, errors: 23, successRate: 99.8 },
    { endpoint: '/api/v1/exercises/workouts', calls: 9234, avgLatency: 178, errors: 12, successRate: 99.9 },
    { endpoint: '/api/v1/biometry/heartrate', calls: 15678, avgLatency: 234, errors: 45, successRate: 99.7 },
    { endpoint: '/api/v1/users/profile', calls: 6789, avgLatency: 98, errors: 5, successRate: 99.9 },
    { endpoint: '/api/v1/analytics/dashboard', calls: 4567, avgLatency: 567, errors: 18, successRate: 99.6 },
  ];

  // Server status
  const servers = [
    { 
      name: 'API Gateway Principal',
      status: 'online',
      uptime: '99.8%',
      requests: '45.2K/h',
      cpu: 67,
      memory: 78,
      lastRestart: 'Il y a 12 jours'
    },
    { 
      name: 'API Gateway Secondaire',
      status: 'online',
      uptime: '99.9%',
      requests: '23.4K/h',
      cpu: 45,
      memory: 62,
      lastRestart: 'Il y a 8 jours'
    },
    { 
      name: 'ETL Pipeline Worker 1',
      status: 'warning',
      uptime: '98.2%',
      requests: '1.2K/h',
      cpu: 89,
      memory: 91,
      lastRestart: 'Il y a 3 heures'
    },
  ];

  // Recent logs
  const recentLogs = [
    { 
      id: 1, 
      timestamp: '2026-02-04 14:23:45',
      level: 'error',
      service: 'ETL Pipeline',
      message: 'Connection timeout to PostgreSQL database',
      details: 'Host: db-prod-01.internal:5432'
    },
    { 
      id: 2, 
      timestamp: '2026-02-04 14:18:12',
      level: 'warning',
      service: 'API Gateway',
      message: 'High latency detected on /api/v1/analytics/dashboard',
      details: 'Response time: 1245ms (threshold: 500ms)'
    },
    { 
      id: 3, 
      timestamp: '2026-02-04 14:15:33',
      level: 'info',
      service: 'ETL Pipeline',
      message: 'Batch processing completed successfully',
      details: '2,345 records processed in 45 seconds'
    },
    { 
      id: 4, 
      timestamp: '2026-02-04 14:12:08',
      level: 'error',
      service: 'API Nutrition',
      message: 'Validation error: Invalid calorie value',
      details: 'user_id: 12345, value: -150 (must be positive)'
    },
    { 
      id: 5, 
      timestamp: '2026-02-04 14:08:54',
      level: 'warning',
      service: 'API Biométrie',
      message: 'Rate limit approaching for user 67890',
      details: '98/100 requests in current window'
    },
  ];

  const kpiCards = [
    { label: 'Total Appels API', value: '48.9K', trend: '+12.5%', icon: Activity, color: '#4A90E2' },
    { label: 'Taux de Succès', value: '99.7%', trend: '+0.2%', icon: CheckCircle, color: '#5CC58C' },
    { label: 'Latence Moyenne', value: '187ms', trend: '-23ms', icon: Clock, color: '#7FD8BE' },
    { label: 'Erreurs Totales', value: '93', trend: '-12', icon: AlertTriangle, color: '#FF887B' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section aria-labelledby="api-kpis">
        <h3 id="api-kpis" className="sr-only">Indicateurs clés de l&apos;API</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-[#4A5568] opacity-70">{kpi.label}</p>
                      <p className="text-3xl font-bold text-[#4A5568] mt-2">{kpi.value}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4" style={{ color: kpi.color }} aria-hidden="true" />
                        <span className="text-sm font-semibold" style={{ color: kpi.color }}>
                          {kpi.trend}
                        </span>
                      </div>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${kpi.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: kpi.color }} aria-hidden="true" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* API Calls Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monitoring des Appels API REST</CardTitle>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7j">7j</SelectItem>
                <SelectItem value="30j">30j</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apiCallsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#4A5568" />
              <YAxis yAxisId="left" stroke="#4A5568" />
              <YAxis yAxisId="right" orientation="right" stroke="#4A5568" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                labelStyle={{ color: '#4A5568' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="calls" fill="#4A90E2" name="Appels" radius={[8, 8, 0, 0]} />
              <Bar yAxisId="left" dataKey="errors" fill="#FF887B" name="Erreurs" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#7FD8BE" strokeWidth={3} name="Latence (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Servers Status */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des Serveurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {servers.map((server, index) => (
              <div key={index} className="p-5 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4A90E2] bg-opacity-10">
                      <Server className="w-5 h-5 text-[#4A90E2]" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#4A5568]">{server.name}</h4>
                      <p className="text-xs text-[#4A5568] opacity-70 mt-0.5">
                        Dernier redémarrage: {server.lastRestart}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={server.status === 'online' ? 'default' : 'secondary'}
                    className={server.status === 'online' ? 'bg-[#5CC58C] hover:bg-[#5CC58C]' : 'bg-[#FFB88C] hover:bg-[#FFB88C]'}
                  >
                    {server.status === 'online' ? 'En ligne' : 'Avertissement'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-[#4A5568] opacity-70 mb-1">Uptime</p>
                    <p className="text-sm font-semibold text-[#4A5568]">{server.uptime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4A5568] opacity-70 mb-1">Requêtes/h</p>
                    <p className="text-sm font-semibold text-[#4A5568]">{server.requests}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4A5568] opacity-70 mb-2">CPU</p>
                    <Progress 
                      value={server.cpu} 
                      className="h-2"
                      // @ts-expect-error
                      style={{ '--progress-background': server.cpu > 80 ? '#FF887B' : '#4A90E2' }}
                    />
                    <p className="text-xs font-semibold text-[#4A5568] mt-1">{server.cpu}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4A5568] opacity-70 mb-2">Mémoire</p>
                    <Progress 
                      value={server.memory} 
                      className="h-2"
                      // @ts-ignore
                      style={{ '--progress-background': server.memory > 85 ? '#FF887B' : '#7FD8BE' }}
                    />
                    <p className="text-xs font-semibold text-[#4A5568] mt-1">{server.memory}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Endpoints Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistiques des Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead className="text-right">Appels</TableHead>
                  <TableHead className="text-right">Latence Moy.</TableHead>
                  <TableHead className="text-right">Erreurs</TableHead>
                  <TableHead className="text-right">Taux de Succès</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpointsStats.map((endpoint, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <code className="text-sm text-[#4A90E2] bg-[#4A90E2] bg-opacity-10 px-2 py-1 rounded">
                        {endpoint.endpoint}
                      </code>
                    </TableCell>
                    <TableCell className="text-right text-[#4A5568] font-medium">
                      {endpoint.calls.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${
                        endpoint.avgLatency > 300 ? 'text-[#FF887B]' : 'text-[#5CC58C]'
                      }`}>
                        {endpoint.avgLatency}ms
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${
                        endpoint.errors > 20 ? 'text-[#FF887B]' : 'text-[#4A5568]'
                      }`}>
                        {endpoint.errors}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-[#5CC58C] hover:bg-[#5CC58C]">
                        {endpoint.successRate}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Logs ETL Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Logs d&apos;Erreurs du Pipeline ETL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div 
                key={log.id}
                className="p-4 rounded-lg border-l-4 hover:bg-gray-50 transition-colors"
                style={{
                  borderLeftColor: 
                    log.level === 'error' ? '#FF887B' : 
                    log.level === 'warning' ? '#FFB88C' : 
                    '#5CC58C',
                  backgroundColor: 
                    log.level === 'error' ? '#FF887B05' : 
                    log.level === 'warning' ? '#FFB88C05' : 
                    '#5CC58C05'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`uppercase ${
                        log.level === 'error' 
                          ? 'bg-[#FF887B] hover:bg-[#FF887B]'
                          : log.level === 'warning'
                          ? 'bg-[#FFB88C] hover:bg-[#FFB88C]'
                          : 'bg-[#5CC58C] hover:bg-[#5CC58C]'
                      }`}
                    >
                      {log.level}
                    </Badge>
                    <span className="text-sm font-medium text-[#4A5568]">{log.service}</span>
                  </div>
                  <span className="text-xs text-[#4A5568] opacity-70">{log.timestamp}</span>
                </div>
                <p className="text-sm text-[#4A5568] mb-1">{log.message}</p>
                <code className="text-xs text-[#4A5568] opacity-70 font-mono bg-gray-100 px-2 py-1 rounded">
                  {log.details}
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}