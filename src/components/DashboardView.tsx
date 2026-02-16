import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, TrendingUp, Users, CreditCard, Database, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function DashboardView() {
  // Mock data
  const kpiData = [
    { label: 'Qualité des Données', value: '98.5%', trend: '+2.3%', icon: Database, color: '#5CC58C', status: 'success' },
    { label: 'Utilisateurs Actifs', value: '12,453', trend: '+8.7%', icon: Users, color: '#4A90E2', status: 'success' },
    { label: 'Conversion Premium', value: '23.4%', trend: '+5.1%', icon: CreditCard, color: '#7FD8BE', status: 'success' },
    { label: 'Erreurs Pipeline', value: '12', trend: '-4', icon: AlertTriangle, color: '#FF887B', status: 'warning' },
  ];

  const ageDistribution = [
    { name: '18-25', value: 2345 },
    { name: '26-35', value: 4123 },
    { name: '36-45', value: 3456 },
    { name: '46-55', value: 1789 },
    { name: '56+', value: 740 },
  ];

  const dataQualityTrend = [
    { date: 'Lun', quality: 97.2, errors: 23 },
    { date: 'Mar', quality: 97.8, errors: 18 },
    { date: 'Mer', quality: 98.1, errors: 15 },
    { date: 'Jeu', quality: 98.5, errors: 12 },
    { date: 'Ven', quality: 98.3, errors: 14 },
    { date: 'Sam', quality: 98.7, errors: 10 },
    { date: 'Dim', quality: 98.5, errors: 12 },
  ];

  const objectivesData = [
    { name: 'Perte de poids', value: 4523, color: '#4A90E2' },
    { name: 'Prise de masse', value: 3245, color: '#5CC58C' },
    { name: 'Bien-être', value: 2789, color: '#7FD8BE' },
    { name: 'Performance', value: 1896, color: '#FFB88C' },
  ];

  const alerts = [
    { id: 1, type: 'error', message: 'Pipeline Nutrition : 8 enregistrements avec valeurs manquantes', time: 'Il y a 15 min' },
    { id: 2, type: 'warning', message: 'API Biométrie : Latence élevée détectée (>500ms)', time: 'Il y a 1h' },
    { id: 3, type: 'success', message: 'Nettoyage automatique : 234 doublons supprimés', time: 'Il y a 2h' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <section aria-labelledby="kpi-section">
        <h3 id="kpi-section" className="sr-only">Indicateurs clés de performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Quality Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendance Qualité des Données (7 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataQualityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#4A5568" />
                <YAxis stroke="#4A5568" domain={[95, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                  labelStyle={{ color: '#4A5568' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="#4A90E2" 
                  strokeWidth={3}
                  name="Qualité (%)"
                  dot={{ fill: '#4A90E2', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Âge</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#4A5568" />
                <YAxis stroke="#4A5568" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                  labelStyle={{ color: '#4A5568' }}
                />
                <Bar dataKey="value" fill="#4A90E2" name="Utilisateurs" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objectives Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Objectifs Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={objectivesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {objectivesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alertes Pipeline d&apos;Ingestion</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" role="list">
              {alerts.map((alert) => (
                <li 
                  key={alert.id}
                  className="flex items-start gap-3 p-4 rounded-lg border"
                  style={{
                    borderColor: alert.type === 'error' ? '#FF887B' : alert.type === 'warning' ? '#FFB88C' : '#5CC58C',
                    backgroundColor: alert.type === 'error' ? '#FF887B10' : alert.type === 'warning' ? '#FFB88C10' : '#5CC58C10'
                  }}
                >
                  {alert.type === 'error' && <XCircle className="w-5 h-5 text-[#FF887B] flex-shrink-0 mt-0.5" aria-hidden="true" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#FFB88C] flex-shrink-0 mt-0.5" aria-hidden="true" />}
                  {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-[#5CC58C] flex-shrink-0 mt-0.5" aria-hidden="true" />}
                  <div className="flex-1">
                    <p className="text-sm text-[#4A5568] font-medium">{alert.message}</p>
                    <p className="text-xs text-[#4A5568] opacity-70 mt-1">{alert.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
