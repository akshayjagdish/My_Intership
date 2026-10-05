import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LineChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';

declare const process: { env: { EXPO_PUBLIC_API_BASE_URL?: string } };

type MetricSnapshot = {
  timestamp: string;
  activeUsers: number;
  pageViews: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  p95LatencyMs: number;
  churnRisk: number;
  topRoute: string;
};

type Alert = {
  id: string;
  severity: string;
  title: string;
  message: string;
  createdAt: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

export default function App() {
  const { width } = useWindowDimensions();
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`${WS_BASE_URL}/ws/metrics`);
    socket.onmessage = event => {
      const metric = JSON.parse(event.data);
      setMetrics(current => [...current.slice(-23), metric]);
      const nextAlerts = deriveAlerts(metric);
      if (nextAlerts.length > 0) {
        setAlerts(current => [...nextAlerts, ...current].slice(0, 5));
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const latest = metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
  const chart = useMemo(() => {
    const points = metrics.length ? metrics : Array.from({ length: 6 }, (_, index) => ({
      revenue: index * 1000,
      conversionRate: 0,
      timestamp: '',
      activeUsers: 0,
      pageViews: 0,
      conversions: 0,
      p95LatencyMs: 0,
      churnRisk: 0,
      topRoute: '/'
    }));
    return {
      labels: points.slice(-6).map((_, index) => `${index + 1}`),
      datasets: [{ data: points.slice(-6).map(item => Math.round(item.revenue / 1000)) }]
    };
  }, [metrics]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Realtime Business Intelligence</Text>
          <Text style={styles.title}>Command Center</Text>
        </View>

        <View style={styles.grid}>
          <Kpi icon="users" label="Active users" value={formatNumber(latest?.activeUsers)} />
          <Kpi icon="shopping-cart" label="Conversions" value={formatNumber(latest?.conversions)} />
          <Kpi icon="dollar-sign" label="Revenue" value={`$${formatNumber(Math.round(latest?.revenue ?? 0))}`} />
          <Kpi icon="zap" label="p95 latency" value={`${latest?.p95LatencyMs ?? 0} ms`} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Revenue Momentum</Text>
          <LineChart
            data={chart}
            width={Math.max(320, width - 40)}
            height={220}
            yAxisSuffix="k"
            chartConfig={{
              backgroundGradientFrom: '#14213d',
              backgroundGradientTo: '#1f2937',
              color: opacity => `rgba(118, 255, 214, ${opacity})`,
              labelColor: opacity => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: { r: '4' }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Behavior Signals</Text>
          <Signal label="Conversion rate" value={`${(((latest?.conversionRate ?? 0) * 100)).toFixed(2)}%`} />
          <Signal label="Churn risk" value={`${(((latest?.churnRisk ?? 0) * 100)).toFixed(1)}%`} />
          <Signal label="Top route" value={latest?.topRoute ?? '/'} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Live Alerts</Text>
          {alerts.length === 0 ? (
            <Text style={styles.muted}>No active alerts.</Text>
          ) : alerts.map(alert => (
            <View key={alert.id} style={styles.alert}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.muted}>{alert.message}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Kpi({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.kpi}>
      <Feather name={icon} color="#76ffd6" size={20} />
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.signal}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.signalValue}>{value}</Text>
    </View>
  );
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
}

function deriveAlerts(metric: MetricSnapshot): Alert[] {
  const createdAt = new Date().toISOString();
  const alerts: Alert[] = [];
  if (metric.conversionRate < 0.035) {
    alerts.push({
      id: `${metric.timestamp}-conversion`,
      severity: 'critical',
      title: 'Conversion rate dropped',
      message: `Conversion rate is ${(metric.conversionRate * 100).toFixed(2)}%`,
      createdAt
    });
  }
  if (metric.p95LatencyMs > 900) {
    alerts.push({
      id: `${metric.timestamp}-latency`,
      severity: 'warning',
      title: 'Latency threshold exceeded',
      message: `p95 latency is ${metric.p95LatencyMs} ms on ${metric.topRoute}`,
      createdAt
    });
  }
  return alerts;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#101820' },
  content: { padding: 20, gap: 18 },
  header: { marginTop: 18 },
  kicker: { color: '#76ffd6', fontSize: 13, textTransform: 'uppercase' },
  title: { color: '#ffffff', fontSize: 36, fontWeight: '800', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpi: { backgroundColor: '#17212f', borderRadius: 8, padding: 14, width: '47%', gap: 8 },
  kpiValue: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  kpiLabel: { color: '#a9b4c2', fontSize: 13 },
  panel: { backgroundColor: '#17212f', borderRadius: 8, padding: 16, gap: 12 },
  panelTitle: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  chart: { borderRadius: 8, marginLeft: -16 },
  signal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  signalValue: { color: '#ffffff', fontWeight: '700' },
  muted: { color: '#a9b4c2' },
  alert: { borderLeftColor: '#ffcc66', borderLeftWidth: 3, paddingLeft: 12, gap: 4 },
  alertTitle: { color: '#ffffff', fontWeight: '700' }
});
