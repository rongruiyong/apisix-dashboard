/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './Records.less';

interface childProps {
  data: Array,
  changeDay: Function
}

const Chart: React.FC = (props) => {
  const chartDom = useRef(null);
  const [myChart, setMyChart] = useState<echarts.ECharts>();
  const [dayOrMonth, setDayOrMonth] = useState('day');
  const { data, changeDay } = props;
  // echarts 配置项
  const option = {
    title: {
      text: '调用次数统计',
      textStyle: {
        fontWeight: 'normal', //粗细
      },
    },
    grid: {
      top: 65,
      left: 40,
      right: 20,
      bottom: 30,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: false,
    },
    xAxis: {
      boundaryGap: false,
      type: 'category',
      data: data.map(el => { return el.dayOrMonth }),
    },
    yAxis: {
      type: 'value',
      name: '单位：次',
      nameTextStyle: {
        fontSize: 14,
        left: 125,
        top: 5,
      },
      axisLine: {
        show: true,
      },
    },
    series: {
      name: '访问量',
      data: data.map(el => { return el.callNum }),
      type: 'line'
    },

  };

  const onClickItem = (val: String) => {
    setDayOrMonth(val);
    changeDay(val);
  };

  const renderChart = () => {
    // echarts 初始化
    chartDom?.current && setMyChart(echarts.init(chartDom?.current));
    myChart && option && myChart.setOption(option);
  }

  useEffect(() => {
    renderChart()
  }, [data]);


  return (
    <>
      <div className={styles.chartWarp}>
        <div className={styles.chartBtn}>
          <span className={dayOrMonth === 'day' ? styles.active : ''} onClick={() => onClickItem('day')}>按日</span>
          <span className={dayOrMonth === 'month' ? styles.active : ''} onClick={() => onClickItem('month')}>按月</span>
        </div>
        <div ref={chartDom} style={{ width: "100%", height: 320, display: 'inline-block', verticalAlign: 'top' }}></div>
      </div>
    </>
  );
};

export default Chart;
