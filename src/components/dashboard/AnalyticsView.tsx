import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Progress } from '../ui/progress';
import { TrendingUp, Activity, Flame, Moon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalyticsView() {
  const engagementData = [
    { date: '01/02', steps: 8234, calories: 2145, sleep: 7.2 },
    { date: '02/02', steps: 9521, calories: 2389, sleep: 6.8 },
    { date: '03/02', steps: 7892, calories: 2012, sleep: 7.5 },
    { date: '04/02', steps: 10234, calories: 2567, sleep: 7.1 },
    { date: '05/02', steps: 11456, calories: 2789, sleep: 8.0 },
    { date: '06/02', steps: 9876, calories: 2456, sleep: 7.3 },
    { date: '07/02', steps: 8945, calories: 2234, sleep: 6.9 },
  ];

  // Progression moyenne
  const progressionData = [
    { week: 'Sem 1', progression: 65, satisfaction: 72 },
    { week: 'Sem 2', progression: 71, satisfaction: 75 },
    { week: 'Sem 3', progression: 76, satisfaction: 78 },
    { week: 'Sem 4', progression: 82, satisfaction: 85 },
    { week: 'Sem 5', progression: 87, satisfaction: 88 },
    { week: 'Sem 6', progression: 91, satisfaction: 92 },
  ];

  // Tendances nutritionnelles
  const nutritionTrends = [
    { profile: 'Végétarien', users: 3456, avgCalories: 1850, avgProtein: 65 },
    { profile: 'Omnivore', users: 5234, avgCalories: 2200, avgProtein: 95 },
    { profile: 'Végétalien', users: 1789, avgCalories: 1750, avgProtein: 55 },
    { profile: 'Paleo', users: 2345, avgCalories: 2100, avgProtein: 110 },
  ];

  // Conversion Premium vs B2B
  const conversionData = [
    { name: 'Premium B2C', value: 2945, color: '#4A90E2' },
    { name: 'Marque Blanche B2B', value: 1234, color: '#5CC58C' },
    { name: 'Freemium', value: 8274, color: '#7FD8BE' },
  ];

  // Engagement Metrics Cards
  const engagementMetrics = [
    { 
      label: 'Activité Moyenne', 
      value: '9,451', 
      unit: 'pas/jour',
      trend: '+12.3%',
      icon: Activity,
      color: '#4A90E2'
    },
    { 
      label: 'Calories Brûlées', 
      value: '2,370', 
      unit: 'kcal/jour',
      trend: '+8.7%',
      icon: Flame,
      color: '#FF887B'
    },
    { 
      label: 'Sommeil Moyen', 
      value: '7.3', 
      unit: 'heures',
      trend: '+0.5h',
      icon: Moon,
      color: '#7FD8BE'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <section aria-labelledby="engagement-metrics">
        <h3 id="engagement-metrics" className="text-lg font-semibold text-[#4A5568] mb-4">
          Indicateurs d&apos;Engagement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engagementMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-[#4A5568] opacity-70">{metric.label}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-3xl font-bold text-[#4A5568]">{metric.value}</p>
                        <span className="text-sm text-[#4A5568] opacity-70">{metric.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4" style={{ color: metric.color }} aria-hidden="true" />
                        <span className="text-sm font-semibold" style={{ color: metric.color }}>
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: metric.color }} aria-hidden="true" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Engagement Evolution */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de l&apos;Engagement (7 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF887B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF887B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7FD8BE" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7FD8BE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#4A5568" />
              <YAxis yAxisId="left" stroke="#4A5568" />
              <YAxis yAxisId="right" orientation="right" stroke="#4A5568" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                labelStyle={{ color: '#4A5568' }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="steps" 
                stroke="#4A90E2" 
                strokeWidth={2}
                fill="url(#colorSteps)"
                name="Pas"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="calories" 
                stroke="#FF887B" 
                strokeWidth={2}
                fill="url(#colorCalories)"
                name="Calories"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="sleep" 
                stroke="#7FD8BE" 
                strokeWidth={3}
                name="Sommeil (h)"
                dot={{ fill: '#7FD8BE', r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression Moyenne */}
        <Card>
          <CardHeader>
            <CardTitle>Progression Moyenne des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="week" stroke="#4A5568" />
                <YAxis stroke="#4A5568" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                  labelStyle={{ color: '#4A5568' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="progression" 
                  stroke="#4A90E2" 
                  strokeWidth={3}
                  name="Progression (%)"
                  dot={{ fill: '#4A90E2', r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#5CC58C" 
                  strokeWidth={3}
                  name="Satisfaction (%)"
                  dot={{ fill: '#5CC58C', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Premium vs B2B */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition Démographique & Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {conversionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    ></div>
                    <span className="text-sm text-[#4A5568]">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#4A5568]">
                    {item.value.toLocaleString()} utilisateurs
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances Nutritionnelles par Profil Utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profil Alimentaire</TableHead>
                  <TableHead className="text-right">Utilisateurs</TableHead>
                  <TableHead className="text-right">Calories Moy.</TableHead>
                  <TableHead className="text-right">Protéines Moy.</TableHead>
                  <TableHead>Distribution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nutritionTrends.map((trend, index) => {
                  const totalUsers = nutritionTrends.reduce((sum, t) => sum + t.users, 0);
                  const percentage = (trend.users / totalUsers * 100).toFixed(1);
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-[#4A5568]">
                        {trend.profile}
                      </TableCell>
                      <TableCell className="text-right text-[#4A5568]">
                        {trend.users.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-[#4A5568]">
                        {trend.avgCalories} kcal
                      </TableCell>
                      <TableCell className="text-right text-[#4A5568]">
                        {trend.avgProtein}g
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={parseFloat(percentage)} className="flex-1" />
                          <span className="text-sm font-semibold text-[#4A5568] w-12 text-right">
                            {percentage}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}