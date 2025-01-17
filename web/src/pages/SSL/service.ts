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
  return request<Res<ResListData<SSLModule.ResponseBody>>>('/apisix/admin/ssl', {
    params: {
      page: current,
      page_size: pageSize,
      ...res,
    },
  }).then(({ data }) => {
    return {
      total: data.total_size,
      data: data.rows,
    };
  });
};

export const remove = (id: string) =>
  request(`/apisix/admin/ssl/${id}`, {
    method: 'DELETE',
  });

export const create = (data: SSLModule.SSL) =>
  request('/apisix/admin/ssl', {
    method: 'POST',
    data,
  });

export const verifyKeyPaire = (cert = '', key = ''): Promise<SSLModule.VerifyKeyPaireProps> =>
  request('/apisix/admin/check_ssl_cert', {
    method: 'POST',
    data: { cert, key },
  });

export const update = (id: string, data: SSLModule.SSL) =>
  request(`/apisix/admin/ssl/${id}`, {
    method: 'PUT',
    data,
  });
