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
import request from './requestType';
// import  {request}  from 'umi';
import { pickBy, identity, isArguments } from 'lodash';

import { transformStepData, transformRouteData, transformUpstreamNodes } from './transform';
import { transformLabelList } from '@/helpers';
import { fetchUpstreamList } from '@/components/Upstream/service';


export const create = (data: RouteModule.RequestData, mode?: RouteModule.RequestMode) =>
  request(`/apisix/admin/routes`, {
    method: 'POST',
    data: mode === 'RawData' ? data : transformStepData(data),
  });

export const update = (
  rid: string,
  data: RouteModule.RequestData,
  mode?: RouteModule.RequestMode,
) =>
  request(`/apisix/admin/routes/${rid}`, {
    method: 'PUT',
    data: mode === 'RawData' ? data : transformStepData(data),
  });

export const fetchItem = (rid: number) =>
  request(`/apisix/admin/routes/${rid}`).then((data) => transformRouteData(data.data));

export const fetchList = ({ current = 1, pageSize = 10, ...res }) => {
  const { labels = [], API_VERSION = [], status } = res;

  return request<Res<ResListData<RouteModule.ResponseBody>>>('/apisix/admin/routes', {
    params: {
      name: res.name,
      uri: res.uri,
      label: labels.concat(API_VERSION).join(','),
      page: current,
      page_size: pageSize,
      status,
    },
  }).then(({ data }) => {
    let arrRow = data.rows || [];
    let total = data.total_size || 0;
    let arrId = arrRow.map(el => { return el.id });
    return fetchUseList(arrRow, total, arrId)
  });
};

const fetchUseList = (arrRow: Array<any>, total: number, arrId: Array<any>) => {
  return request('/science/apisix/router/replenish', {
    params: {
      routerIds: arrId.join(','),
    },
  }).then(({ data }) => {
    let arrList = convertData(data, arrRow);
    return {
      data: arrList,
      total: total,
    }
  })
}

const convertData = (data1: Array<any>, data2: Array<any>) => {
  let city = {};
  let res: Array<any> = [];
  try {
    data1.forEach(t => {
      city[t.routerId] = {
        id: t.routerId,
        producer: t.producer,
        callers: t.callers,
        callNum: t.callNum
      };
    });
  } catch (e) {
    return [];
  }
  data2.map(item => {
    if (!item.id || item.id === "") return;
    if (!city[item.id]) return;
    res.push({
      producer: city[item.id].producer,
      callers: city[item.id].callers,
      callNum: city[item.id].callNum,
      ...item
    });
  });
  return res;
}

export const remove = (rid: string) => request(`/apisix/admin/routes/${rid}`, { method: 'DELETE' });

export const checkUniqueName = (name = '', exclude = '') =>
  request('/apisix/admin/notexist/routes', {
    params: pickBy(
      {
        name,
        exclude,
      },
      identity,
    ),
  });

export const fetchUpstreamItem = (sid: string) => {
  return request(`/apisix/admin/upstreams/${sid}`).then(({ nodes, timeout, id }) => {
    return {
      upstreamHostList: transformUpstreamNodes(nodes),
      timeout,
      upstream_id: id,
    };
  });
};

export const checkHostWithSSL = (hosts: string[]) =>
  request('/apisix/admin/check_ssl_exists', {
    method: 'POST',
    data: { hosts },
  });

export const fetchLabelList = () =>
  request('/apisix/admin/labels/route').then(({ data }) => transformLabelList(data && data.rows) as LabelList);

export const updateRouteStatus = (rid: string, status: RouteModule.RouteStatus) =>
  request(`/apisix/admin/routes/${rid}`, {
    method: 'PATCH',
    data: { status },
  });

export const debugRoute = (headers: any, data: RouteModule.debugRequest) => {
  return request('/apisix/admin/debug-request-forwarding', {
    method: 'post',
    data,
    headers,
  });
};

export const fetchServiceList = () =>
  request('/apisix/admin/services').then(({ data }) => ({
    data: data.rows,
    total: data.total_size,
  }));

export const exportRoutes = (ids?: string) => {
  return request(`/apisix/admin/export/routes/${ids}`);
};

export const importRoutes = (formData: FormData) => {
  return request('/apisix/admin/import/routes', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  });
};

export const callerList = () => {
  return request('/science/apisix/caller/dic');
}

export const recordsList = (params: Object) => {
  return request('/science/apisix/router/list', {
    params: params
  })
};

export const chartList = (params: Object) => {
  return request('/science/apisix/router/statistic', {
    params: params
  })
};