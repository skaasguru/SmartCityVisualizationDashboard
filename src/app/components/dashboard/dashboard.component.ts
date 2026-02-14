import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  template: `
    <div class="dashboard-container">
      <header>
        <h1>AetherCity Analytics</h1>
        <p>Live Urban Data Command Center</p>
      </header>
      
      <div class="charts-grid">
        <div class="chart-card glass">
          <h3>Energy Distribution (MW)</h3>
          <div echarts [options]="energyOption" class="chart"></div>
        </div>
        
        <div class="chart-card glass">
          <h3>Resource Allocation</h3>
          <div echarts [options]="resourceOption" class="chart"></div>
        </div>
        
        <div class="chart-card glass">
          <h3>Urban Vitality Index</h3>
          <div echarts [options]="vitalityOption" class="chart"></div>
        </div>
        
        <div class="chart-card glass">
          <h3>Population Trend</h3>
          <div echarts [options]="trendOption" class="chart"></div>
        </div>

        <div class="chart-card glass">
          <h3>Resource Flow (Sankey)</h3>
          <div echarts [options]="flowOption" class="chart"></div>
        </div>

        <div class="chart-card glass">
          <h3>City Heat Intensity</h3>
          <div echarts [options]="heatmapOption" class="chart"></div>
        </div>

        <div class="chart-card glass">
          <h3>Network Health</h3>
          <div echarts [options]="gaugeOption" class="chart"></div>
        </div>

        <div class="chart-card glass">
          <h3>District Budget (Treemap)</h3>
          <div echarts [options]="treemapOption" class="chart"></div>
        </div>

        <div class="chart-card glass">
          <h3>IoT Sensor Clusters</h3>
          <div echarts [options]="scatterOption" class="chart"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem 2rem;
      color: white;
      font-family: 'Inter', sans-serif;
      height: 100%;
      overflow-y: auto;
      position: relative;
    }
    
    header {
      margin-bottom: 2rem;
      pointer-events: auto;
    }
    
    header h1 {
      font-size: 2.5rem;
      margin: 0;
      background: linear-gradient(90deg, #00f2fe 0%, #4facfe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      pointer-events: auto;
      padding-bottom: 5rem;
    }
    
    .chart-card {
      padding: 1.5rem;
      border-radius: 16px;
      min-height: 350px;
    }
    
    .glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }
    
    .chart {
      height: 300px;
      width: 100%;
    }
    
    h3 {
      margin-top: 0;
      font-weight: 300;
      color: #00f2fe;
    }
  `]
})
export class DashboardComponent {
  energyOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#ccc' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#00f2fe' }, { offset: 1, color: '#4facfe' }]
        }
      }
    }]
  };

  resourceOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#111',
        borderWidth: 2
      },
      label: { show: false },
      data: [
        { value: 1048, name: 'Solar' },
        { value: 735, name: 'Wind' },
        { value: 580, name: 'Grid' },
        { value: 484, name: 'Hydro' }
      ]
    }]
  };

  vitalityOption: EChartsOption = {
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: 'Safety', max: 100 },
        { name: 'Health', max: 100 },
        { name: 'Education', max: 100 },
        { name: 'Commute', max: 100 },
        { name: 'Greenery', max: 100 }
      ],
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [85, 90, 75, 40, 95],
          name: 'Current Score',
          areaStyle: { color: 'rgba(0, 242, 254, 0.3)' },
          lineStyle: { color: '#00f2fe' }
        }
      ]
    }]
  };

  trendOption: EChartsOption = {
    backgroundColor: 'transparent',
    xAxis: {
      type: 'category',
      data: ['2020', '2021', '2022', '2023', '2024', '2025'],
      axisLabel: { color: '#ccc' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#ccc' },
      splitLine: { show: false }
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330],
      type: 'line',
      smooth: true,
      lineStyle: { width: 4, color: '#f093fb' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(240, 147, 251, 0.4)' }, { offset: 1, color: 'transparent' }]
        }
      }
    }]
  };

  flowOption: EChartsOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'sankey',
      emphasis: { focus: 'adjacency' },
      data: [
        { name: 'Water' }, { name: 'Energy' }, { name: 'Data' },
        { name: 'Residential' }, { name: 'Industrial' }, { name: 'Commercial' }
      ],
      links: [
        { source: 'Water', target: 'Residential', value: 50 },
        { source: 'Water', target: 'Industrial', value: 30 },
        { source: 'Energy', target: 'Residential', value: 100 },
        { source: 'Energy', target: 'Commercial', value: 80 },
        { source: 'Data', target: 'Commercial', value: 200 }
      ],
      lineStyle: { color: 'source', opacity: 0.6 }
    }]
  };

  heatmapOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: { position: 'top' },
    grid: { height: '50%', top: '10%' },
    xAxis: {
      type: 'category',
      data: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
      axisLabel: { color: '#ccc' }
    },
    yAxis: {
      type: 'category',
      data: ['North', 'South', 'East', 'West', 'Central'],
      axisLabel: { color: '#ccc' }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: { color: ['#4facfe', '#00f2fe', '#f093fb'] }
    },
    series: [{
      name: 'Heat',
      type: 'heatmap',
      data: [
        [0, 0, 5], [1, 0, 1], [2, 0, 0], [3, 0, 2], [4, 0, 4], [5, 0, 6],
        [0, 1, 1], [1, 1, 0], [2, 1, 3], [3, 1, 7], [4, 1, 2], [5, 1, 1],
        [0, 2, 8], [1, 2, 2], [2, 2, 4], [3, 2, 5], [4, 2, 1], [5, 2, 0],
        [4, 4, 10], [5, 4, 9], [6, 4, 8]
      ],
      label: { show: false }
    }]
  };

  gaugeOption: EChartsOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [[0.3, '#FF6E76'], [0.7, '#FDDD60'], [1, '#7CFFB2']]
        }
      },
      pointer: { length: '60%', width: 5 },
      data: [{ value: 88, name: 'System Load' }],
      detail: { formatter: '{value}%', color: 'inherit', fontSize: 24 }
    }]
  };

  treemapOption: EChartsOption = {
    backgroundColor: 'transparent',
    series: [{
      type: 'treemap',
      data: [
        {
          name: 'Infrastructure',
          value: 100,
          children: [
            { name: 'Roads', value: 40 },
            { name: 'Bridges', value: 60 }
          ]
        },
        {
          name: 'Services',
          value: 80,
          children: [
            { name: 'Police', value: 30 },
            { name: 'Fire', value: 20 },
            { name: 'Health', value: 30 }
          ]
        }
      ],
      breadcrumb: { show: false }
    }]
  };

  scatterOption: EChartsOption = {
    backgroundColor: 'transparent',
    xAxis: { gridIndex: 0, axisLabel: { color: '#ccc' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    yAxis: { gridIndex: 0, axisLabel: { color: '#ccc' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    series: [{
      symbolSize: 20,
      data: [
        [10.0, 8.04], [8.0, 6.95], [13.0, 7.58], [9.0, 8.81], [11.0, 8.33],
        [14.0, 9.96], [6.0, 7.24], [4.0, 4.26], [12.0, 10.84], [7.0, 4.82], [5.0, 5.68]
      ],
      type: 'scatter',
      itemStyle: { color: '#f093fb' }
    }]
  };
}
