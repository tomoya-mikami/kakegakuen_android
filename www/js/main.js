/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var home = {

    //画面の初期化
    initialize: function() {
        $('#budget').text(window.localStorage.getItem("budget"));
    },

    //予算の更新
    budget_update: function() {
        $('#budget').text(window.localStorage.getItem("budget"));
    }
}

app.initialize();
home.initialize();

//jqueryコード
$('#post').click(function(){
    console.log('ajax')
    $.ajax({
        url:'https://kakeigakuen.xyz/api/books',
        type:'POST',
        dataType: 'json',
        data:{
            'costs':$('#costs').val(),
            'token':window.localStorage.getItem("token")
        }
    })
    .done(function(data){
        console.log(data);
        if (data.token != "error") {
            window.localStorage.setItem('budget', data.budget);
            window.localStorage.setItem('token', data.token);
            home.budget_update();
        } else {
            console.log("error");
        }
    })
    .fail(function(data){
        console.log(data);
    });
});
$('#logout').click(function(){
    window.localStorage.clear();
    window.location.href = "index.html";
});