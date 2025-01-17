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
import type React from 'react';

import LoginMethodPassword from '@/pages/User/components/LoginMethodPassword';
import type { UserModule } from '@/pages/User/typing';
import { getLogoutPath } from '@/helpers';

/**
 * Login Methods List
 */
const loginMethods: UserModule.LoginMethod[] = [LoginMethodPassword];

/**
 * User Logout Page
 * @constructor
 */
const Page: React.FC = () => {
  // run all logout method
  loginMethods.forEach((item) => {
    item.logout();
  });

  const redirect = getLogoutPath('redirect');
  window.location.href = `/apisix-ui/user/login${redirect ? `?redirect=${redirect}` : ''}`;

  return null;
};

export default Page;
