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

    //予算の更新
    budget_update: function() {
        $('#budget').text(window.localStorage.getItem("budget"));
    },

    //かけいちゃんの描画
    draw_chara: function() {
        //まずはajaxで画像のpathをうけとる
        $.ajax({
            url:'https://kakeigakuen.xyz/api/image',
            type:'POST',
            dataType: 'json',
            data:{
                'token':window.localStorage.getItem("token")
            }
        })
        .done(function(data){
            console.log(data);
            if (data.token != "error") {
                var path = data.path
                $('#kakeicyan').empty();
                path.some(function(val,index){
                    $('#kakeicyan').append('<img src="' +val+ '" class="kakeicyan-img">');
                })
            } else {
                console.log("error");
            }
        })
        .fail(function(data){
            console.log(data);
        });
    },

    startRecognition: function(){
        window.plugins.speechRecognition.startListening(function(result){
            // 入力結果をインプットに出力する
            console.log(result);
            $('#costs').val(result);
        }, function(err){
            console.error(err);
        }, {
            language: "en-US",
            showPopup: true
        });
    },

    //音声認識
    speach_rec: function() {
        window.plugins.speechRecognition.isRecognitionAvailable(function(available){
            if(!available){
                console.log("音声入力を利用できません");
                $('#costs').val("音声入力を利用できません");
            }
        
            // マイクの許可を要求
            window.plugins.speechRecognition.hasPermission(function (isGranted){
                if(isGranted){
                    this.startRecognition();
                }else{
                    // 許可をリクエスト
                    window.plugins.speechRecognition.requestPermission(function (){
                        // 大丈夫なら録音開始
                        this.startRecognition();
                    }, function (err){
                        console.log(err);
                    });
                }
            }, function(err){
                console.log(err);
            });
        }, function(err){
            console.log(err);
        });
    },

    //post
    post_book: function() {
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
    }
}

var home_initialized = {
    initialize: function() {
        home.budget_update();
        home.draw_chara();
    }
}

app.initialize();
home_initialized.initialize();

//ボタンイベント
$('#post').click(function(){
    home.post_book();
});

$('#speach').click(function(){
    home.speach_rec();
});

$('#logout').click(function(){
    window.localStorage.clear();
    window.location.href = "index.html";
});

$('#closet').click(function(){
    home.draw_chara();
});