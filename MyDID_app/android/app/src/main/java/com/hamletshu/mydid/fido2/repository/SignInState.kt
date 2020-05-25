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

/**
 * Represents the sign in/out state of the user. Used to navigate between screens in the app.
 */
sealed class SignInState {

    /**
     * 사용자가 로그아웃 했습니다.
     * The user is signed out.
     */
    object SignedOut : SignInState()

    /**
     * 사용자가 로그인 중입니다. 사용자가 사용자 이름을 입력했으며 로그인 할 준비가되었습니다.
     * 비밀번호 또는 FIDO2.
     * The user is signing in. The user has entered the username and is ready to sign in with
     * password or FIDO2.
     */
    data class SigningIn(
        val username: String
    ) : SignInState()

    /**
     * 사용자 로그인에 실패했습니다.
     * The user sign-in failed.
     */
    data class SignInError(
        val error: String
    ) : SignInState()

    /**
     * 사용자가 로그인했습니다.
     * The user is signed in.
     */
    data class SignedIn(
        val username: String,
        val token: String
    ) : SignInState()
}
