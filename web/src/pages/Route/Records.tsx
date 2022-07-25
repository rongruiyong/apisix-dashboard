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
import { Card } from 'antd';
import Form from 'antd/es/form';
import { Input, Select, DatePicker, Button, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { history, useIntl } from 'umi';
import * as echarts from 'echarts';
import styles from './Records.less';
import Chart from './RecordsChart'
import {
  recordsList,
  callerList,
  chartList,
} from './service';
import { check } from 'prettier';

// import Chart from './Chart';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

// import { create, fetchItem, update, checkUniqueName, checkHostWithSSL } from './service';



type Props = {
  // FIXME
  route: any;
  match: any;
};



const Page: React.FC<Props> = (props) => {
  const { formatMessage } = useIntl();
  // const [step3Data, setStep3Data] = useState(DEFAULT_STEP_3_DATA);
  const [optionList, setOptionList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [tablTotal, setTableTotal] = useState(0);
  const { rid } = (props as any).match.params;
  const [chartData, setChartData] = useState([]);
  const [dayOrMonth, setDayOrMonth] = useState('day');
  const queryParams = {
    page: 1,  //定义当前页
    pageSize: 10,   //定义每页的条数
    isChange: false, // 当paginationSizeChange改变页码和当前页数后，paginationChange不在改变
  }
  const [form] = Form.useForm();

  const paginationChange = (page: number, pageSize: number) => {
    if (!queryParams.isChange) {
      queryParams.page = page;
      queryParams.pageSize = pageSize;
    }
    getRecordsList()
  }

  const paginationSizeChange = (current: number, size: number) => {
    queryParams.page = 1;
    queryParams.pageSize = size;
    queryParams.isChange = true;
  }
  const getRecordsList = () => {
    queryParams.isChange = false;
    const fieldsValue = form.getFieldsValue();
    const rangeValue = fieldsValue['time'];
    const params = {
      caller: fieldsValue.caller,
      routerName: fieldsValue.routerName,
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      routerId: rid,
      dayOrMonth: dayOrMonth,
    }
    if (rangeValue && rangeValue.length) {
      params.startTime = rangeValue[0].format('YYYY-MM-DD');
      params.endTime = rangeValue[1].format('YYYY-MM-DD');
    }
    recordsList(params).then(({ data }) => {
      setTableList(data.records || [])
      setTableTotal(data.total)
    });
  }

  useEffect(() => {
    callerList().then((data) => {
      setOptionList(data.data || []);
    });
    getRecordsList()
  }, []);

  const getChartData = () => {
    const fieldsValue = form.getFieldsValue();
    const rangeValue = fieldsValue['time'];
    const params = {
      caller: fieldsValue.caller,
      routerName: fieldsValue.routerName,
      routerId: rid,
      dayOrMonth: dayOrMonth,
    }
    if (rangeValue && rangeValue.length) {
      params.startTime = rangeValue[0].format('YYYY-MM-DD');
      params.endTime = rangeValue[1].format('YYYY-MM-DD');
    }
    chartList(params).then(({ data }) => {
      setChartData(data || [])
    });
  }
  useEffect(() => {
    getChartData()
  }, [dayOrMonth])

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = () => {
    getRecordsList();
    getChartData();
  }

  const QueryForm: React.FC = () => {
    return (
      <Form form={form} name="query" layout="inline" onFinish={onFinish}>
        <Form.Item label="调用方：" name="caller" style={{ marginBottom: '3px' }}>
          <Select placeholder="请选择调用方" style={{ minWidth: "180px" }}>
            {optionList.map((item) => (
              <Select.Option value={item.code} key={item.code} >
                {item.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="访问时间：" name="time" style={{ marginBottom: '3px' }}>
          <RangePicker
            format={dateFormat}
          />
        </Form.Item>

        <Form.Item
          name="routerName"
          label="服务："
          style={{ marginBottom: '3px' }}
        >
          <Input placeholder="请输入服务名称" />
        </Form.Item>
        <Form.Item style={{ marginBottom: '3px' }}>
          <Button htmlType="button" onClick={onReset} style={{ marginLeft: "10px" }}>
            重置
          </Button>
          <Button
            type="primary" htmlType="submit"
            style={{ marginLeft: "10px" }}
          >
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const columns: ProColumns<RouteModule.ResponseBody>[] = [
    {
      title: "序号",
      hideInSearch: true,
      dataIndex: 'sort',
      width: 60,
      align: 'center',
    },
    {
      title: "访问时间",
      hideInSearch: true,
      dataIndex: 'startTime',
      width: 160,
      align: 'center'
    },
    {
      title: "服务名称",
      hideInSearch: true,
      dataIndex: 'serviceName',
      ellipsis: true,
    },
    {
      title: "调用方",
      hideInSearch: true,
      dataIndex: 'caller',
      width: 160,
      align: 'center',
    },
    {
      title: "IP",
      hideInSearch: true,
      dataIndex: 'realIp',
      width: 140,
      align: 'center',
    },
    {
      title: "调用状态",
      dataIndex: 'callStatus',
      hideInSearch: true,
      width: 100,
      align: 'center'
    },
  ];


  return (
    <>
      <PageHeaderWrapper
        title={`${formatMessage({ id: 'page.route.records' })}`}
      >
        <Card bordered={false}>
          <QueryForm />
        </Card>
        <Card bordered={false} style={{ marginTop: "15px" }}>
          <Chart data={chartData} changeDay={(val: string) => setDayOrMonth(val)} />
        </Card>
        <Card bordered={false} style={{ marginTop: "15px" }}>
          <ProTable<RouteModule.ResponseBody>
            rowKey="id"
            columns={columns}
            dataSource={tableList}
            search={false}
            pagination={{
              onChange: paginationChange,
              onShowSizeChange: paginationSizeChange,
              pageSize: queryParams.pageSize,
              current: queryParams.page,
              total: tablTotal
            }}
            tableAlertRender={false}
          />
        </Card>
      </PageHeaderWrapper>
    </>
  );

};

export default Page;
