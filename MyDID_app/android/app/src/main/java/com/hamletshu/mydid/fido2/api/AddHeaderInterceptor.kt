/*
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.hamletshu.mydid.fido2.api

import okhttp3.Interceptor
import okhttp3.Response

/*
* 실행시마다 항상 같은 쿠키값을 유지하는 방법
* 1. 로그인한뒤 받은 Response에서 쿠키정보를 가져온다.
2. 가져온 쿠키정보를 안드로이드의 SharedPreferences에 저장해둔다.
3. 이후 수행되는 Request마다 SharedPreferences에서 쿠키를 가져와서 Header에 추가해서 보낸다.
* */
internal class AddHeaderInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        return chain.proceed(
            chain.request().newBuilder()
                .header("X-Requested-With", "XMLHttpRequest")
                .build()
        )
    }
}
