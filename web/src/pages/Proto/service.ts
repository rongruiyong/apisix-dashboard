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
import { request } from 'umi';

export const fetchList = ({ current = 1, pageSize = 10, ...res }) => {
  return request<Res<ResListData<ProtoModule.ResponseBody>>>('/apisix/admin/proto', {
    params: {
      desc: res.desc,
      page: current,
      page_size: pageSize,
    },
  }).then(({ data }) => {
    return {
      data: data.rows,
      total: data.total_size,
    };
  });
};

export const create = (data: ProtoModule.ProtoData) =>
  request('/apisix/admin/proto', {
    method: 'POST',
    data,
  });

export const update = (data: ProtoModule.ProtoData) => {
  request(`/apisix/admin/proto/${data.id}`, {
    method: 'PUT',
    data,
  });
};
export const remove = (rid: string) => request(`/apisix/admin/proto/${rid}`, { method: 'DELETE' });
