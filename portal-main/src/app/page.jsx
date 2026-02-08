"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { getStats } from "@/services/stats";
import Loader from "@/components/custom/loader";
import useToast from "@/hooks/useToast";

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data } = await getStats();
      setMetrics(data);
      setSelectedMetric(data[0]);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName, color) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="h-5 w-5" style={{ color }} /> : null;
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading || !selectedMetric) return <Loader />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Welcome back! Here's an overview of your system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card
              key={metric.id}
              className={`group hover:shadow-lg transition-all duration-300 border-muted/50 cursor-pointer ${
                selectedMetric.id === metric.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedMetric(metric)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {metric.title}
                </CardTitle>
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  {getIcon(metric.icon, metric.color)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{metric.total}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  {metric.description}
                </p>
                <p
                  className={`text-sm ${
                    metric.trend < 0 ? "text-red-500" : "text-green-500"
                  } mt-1`}
                >
                  {metric.trend} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Chart View */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedMetric.title} Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={selectedMetric.data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      selectedMetric.formatValue
                        ? [
                            selectedMetric.formatValue(value),
                            selectedMetric.title,
                          ]
                        : [value.toLocaleString(), selectedMetric.title]
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={selectedMetric.color}
                    fill={`${selectedMetric.color}20`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
