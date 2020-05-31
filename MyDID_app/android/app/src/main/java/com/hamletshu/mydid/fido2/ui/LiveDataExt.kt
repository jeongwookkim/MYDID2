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

package com.hamletshu.mydid.fido2.ui

import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LiveData
import androidx.lifecycle.Observer

//관측가능한(Observed한) 데이터 홀더
//항상 마지막 상태의 데이터를 보관하고 있으며, 상태가 변하면 구독자들에게 변화된 데이터를 전달해주는 역할
fun <T> LiveData<T>.observeOnce(lifecycleOwner: LifecycleOwner, onChanged: (T) -> Unit) {
    val observer = object : Observer<T> {
        override fun onChanged(t: T) {
            if (t != null) {
                onChanged(t)
                removeObserver(this)
            }
        }
    }
    observe(lifecycleOwner, observer)
}
