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

package com.hamletshu.mydid.fido2.repository

import android.content.SharedPreferences
import androidx.lifecycle.LiveData

//관측가능한(Observed한) 데이터 홀더
//항상 마지막 상태의 데이터를 보관하고 있으며, 상태가 변하면 구독자들에게 변화된 데이터를 전달해주는 역할

fun SharedPreferences.liveString(key: String, defaultValue: String): LiveData<String> {
    return SharedPreferenceLiveData(this, key, defaultValue, SharedPreferences::getString)
}

fun SharedPreferences.liveString(key: String): LiveData<String?> {
    return SharedPreferenceLiveData(this, key, null, SharedPreferences::getString)
}

fun SharedPreferences.liveInt(key: String, defaultValue: Int): LiveData<Int> {
    return SharedPreferenceLiveData(this, key, defaultValue, SharedPreferences::getInt)
}

fun SharedPreferences.liveBoolean(key: String, defaultValue: Boolean): LiveData<Boolean> {
    return SharedPreferenceLiveData(this, key, defaultValue, SharedPreferences::getBoolean)
}

fun SharedPreferences.liveFloat(key: String, defaultValue: Float): LiveData<Float> {
    return SharedPreferenceLiveData(this, key, defaultValue, SharedPreferences::getFloat)
}

fun SharedPreferences.liveLong(key: String, defaultValue: Long): LiveData<Long> {
    return SharedPreferenceLiveData(this, key, defaultValue, SharedPreferences::getLong)
}

fun SharedPreferences.liveStringSet(key: String, defaultValue: Set<String>): LiveData<Set<String>> {
    return SharedPreferenceLiveData(this, key, defaultValue, SharedPreferences::getStringSet)
}

//SharedPreferences API는 키-값 쌍을 읽고 쓰는 용도로 사용됩니다.
internal class SharedPreferenceLiveData<T>(
    private val prefs: SharedPreferences,
    private val key: String,
    private val defaultValue: T,
    private val getter: (SharedPreferences).(String, T) -> T?
) : LiveData<T>() {

    private val listener = SharedPreferences.OnSharedPreferenceChangeListener { _, key ->
        if (key == this.key) {
            value = prefs.getter(key, defaultValue)
        }
    }

    override fun onActive() {
        super.onActive()
        value = prefs.getter(key, defaultValue)
        prefs.registerOnSharedPreferenceChangeListener(listener)
    }

    override fun onInactive() {
        super.onInactive()
        prefs.unregisterOnSharedPreferenceChangeListener(listener)
    }

}
