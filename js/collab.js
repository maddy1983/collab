$(function () {

    var apiKey = "46002202";
    var sessionId = "1_MX40NjAwMjIwMn5-MTUxOTc4MTUzMTU4OX41cTVpdEJud3RLa24zVVB5ekV0RVFDb2J-fg";
    var token = "T1==cGFydG5lcl9pZD00NjAwMjIwMiZzaWc9ODg2MGYxNmNiM2RmZTc3OGJmYzk2MzE2ZTg3YTVmYjdhYmZhNWU2YjpzZXNzaW9uX2lkPTFfTVg0ME5qQXdNakl3TW41LU1UVXhPVGM0TVRVek1UVTRPWDQxY1RWcGRFSnVkM1JMYTI0elZWQjVla1YwUlZGRGIySi1mZyZjcmVhdGVfdGltZT0xNTE5NzgxNTUyJm5vbmNlPTAuOTkxNTEzNDA0NzgyMzgzJnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1MjAzODYzNTMmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0=";
    // let task1 = setInterval(function () {
    //     collabFn.callRefreshAjax();
    //     collabFn.callAjax();
    // }, 5000);
    session = "";
    collabFn = {
        makeSession: function (val) {
            session = OT.initSession(apiKey, sessionId);
        },
        initializeSession: function () {
            // apiKey = sessionObj.apiKey;
            // token = sessionObj.token;
            // sessionId = sessionObj.sessionId;
            // Subscribe to a newly created stream
            session.on('streamCreated', function (event) {
                if (event.stream.hasVideo) {
                    console.log("Publisher started streaming.");
                    session.subscribe(event.stream, 'camera-subscriber');
                    // video_sec();
                    $('.tokbox_features_sec, #tok_video_sec').show();
                } else {
                    session.subscribe(event.stream, 'audio-subscriber');
                    $('.tokbox_features_sec, #tok_audio_sec').show();
                }
            });
            // On session disconnect
            session.on('sessionDisconnected', function (event) {
                console.log('You were disconnected from the session.', event.reason);
                $('.tokbox_features_sec').hide();
            });

            if (session.isConnected()) {
                console.log('Session is already connected');
            } else {
                // Connecting the session with the given token
                session.connect(token, function (error) {
                    if (error) {
                        console.log('There was an error connecting to the session', error.name, error.message);
                    } else {
                        if (error) {
                            console.log('There was an error connecting to the session', error.name, error.message);
                        } else {
                            console.log('You have connected to the session.');
                            video_sec();
                            // initiateTokbox();
                        }
                        // console.log('You have connected to the session.');
                    }
                });

            }
            // Maintaining a connection count when the session is created/ disconnected
            var connectionCount = 0;
            session.on({
                connectionCreated: function (event) {
                    connectionCount++;
                    if (session.connection) {
                        if (event.connection.connectionId != session.connection.connectionId) {
                            console.log('Another client connected. ' + connectionCount + ' total.');
                        }
                    }
                },
                connectionDestroyed: function connectionDestroyedHandler(event) {
                    connectionCount--;
                    console.log('A client disconnected. ' + connectionCount + ' total.');
                    var msgHistory = document.querySelector('#chat'),
                        msgli = document.createElement('div');
                    msgli.className = 'text-r';
                    msgli.innerHTML = "Connection is disconnected from other end. Messages will not be send. Please close the chat.";
                    msgHistory.appendChild(msgli);
                    $('.chat_box').innerHTML = msgli;
                }
            });

            // Receive a message and append it to the corresponding chatbox differentiated by the dataId
            session.on('signal:msg', function (event) {
                console.log(event);
                // collabFn.callAjax();
                var content = '',
                    timeStamp, avatar,
                    msgHistory = document.querySelector('.chatBox-' + event.data.id),

                    msgli = document.createElement('div'),
                    user = event.from.connectionId === session.connection.connectionId ? 'mine' : 'their',
                    currentSession = session,
                    textString;


                if (previousData !== event.data) {
                    previousData = event.data;
                    if (user === 'mine') {
                        avatar = event.data.msgFrom;
                        timeStamp = new Date().toLocaleTimeString();
                        content =
                            '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                            '<p class="chat_user_avatar">' + avatar + '</p>' +
                            '<p class="messageText">' + event.data.text + '</p>' +
                            '<p class="chat_message_time">' + timeStamp + '</p' +
                            '</div>' +
                            '</div>'
                    } else {
                        avatar = event.data.msgFrom;
                        timeStamp = new Date().toLocaleTimeString();
                        content = '<div class="msj macro">' +
                            '<div class="text text-l">' +
                            '<p class="chat_user_avatar">' + avatar + '</p>' +
                            '<p class="messageText">' + event.data.text + '</p>' +
                            '<p class="chat_message_time">' + timeStamp + '</p' +
                            '</div>' +
                            '</div>';
                    }
                    session['chatHistory'] = session['chatHistory'] ? session['chatHistory'] + content : '' + content;
                    console.log(session['chatHistory']);
                    // msgli.innerHTML = content;
                    $('#chat').append(content);
                    // $('.chat_box').innerHTML = msgli;
                    // collabFn.openChatWindows(event);
                    // // Adding the scrollDown funcationality for the textChat message
                    // msgHistory.scrollTop = (msgHistory.scrollHeight - msgHistory.clientHeight);
                    $('.tokbox_features_sec, #tok_chatbox_sec').show();
                } else {
                    console.log('Duplicate Data');
                }
            });
        }
    }
    collabFn.makeSession();
    // Text chat
    var form = document.querySelector('.collabration-1');
    var msgTxt = document.querySelector('#submit_message');

    var height = 0;
    $('p.messageText').each(function (i, value) {
        height += parseInt($(this).height());
    });

    height += '';

    $('.chat_box').animate({
        scrollTop: height
    });

    $(document).on("keyup", "#submit_message", function (event) {
        //alert(event.keyCode);
        var textVal = event.target.value.trim();
        if (event.keyCode == 13 && textVal.length) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            console.log('====');
            session.signal({
                type: 'msg',
                // data: textVal,
                data: {
                    text: textVal,
                    id: loggedInUser.user_id,
                    msgTo: toUser, //selectedIdObj.selectedId.id,
                    msgFrom: loggedInUser.first_name
                },
                // to: toUser
            }, function (error) {
                if (error) {
                    console.log('Error sending signal:', error.name, error.message);
                } else {
                    msgTxt.value = '';
                }
            });
            $(this).val('');
            // debugger;
        }
    });

    // $('#collabration').on({
    //     mouseenter: function (e) {
    //         $(".collab_icons").stop().animate({
    //             right: 40
    //         }, 600, function () {
    //             $(".collab_icons").stop().animate({
    //                 width: 45
    //             });
    //         });
    //         e.stopPropagation()
    //     },
    //     // mouseout: function (e) {
    //     //     $(".collab_icons").stop().animate({
    //     //         right: "-40px",
    //     //         width: 0
    //     //     }, 1200);
    //     //     e.stopPropagation()
    //     // }
    // });

    $('.tokbox_btn').click(function () {
        let id = $(this).attr('id');
        $('.tokbox_features_sec').show();
        $('.tokbox_features').hide();
        $("#" + id + "_sec").show(function () {
            switch (id) {
                case 'tok_video':
                    video_sec();
                    break
                case 'tok_audio':
                    audio_sec();
                    break
                case 'tok_sharing':
                    screenshare();
                    break
            }
        });
    });

    // start chatting
    $('#start_chat').click(function () {
        var liveSession;
        var chatOpened;
        console.log($('input.checkbox_names:checked'));
        $('input.checkbox_names:checked').each(function (key, input) {
            selectedId.push({
                id: input.id,
                name: $(input).parent().text()
            });
            // $(input).prop('checked', false);
            //Removing the selected for reselection
        });
        console.log(selectedId);
        selectedIdObj = {
            selectedId,
            'action': 'start_chat'
        };
        liveSession = collabFn.sessionAjaxCall(selectedIdObj);
        sessionArray.push(liveSession);
        // chatOpened = collabFn.openChatWindows(selectedId, liveSession);
        $('#chat-list').hide();
        showListFlag = true;
    });

    // dragging section
    // $('.tokbox_features_sec').draggable().resizable({
    //     stop: function (event, ui) {
    //         var publishContainer = document.getElementById("camera-publisher");
    //         var audioContainer = document.getElementById("audio-publisher");
    //         let hgt = ($('.tokbox_features_sec').height() - $('.opentok_feature_icons').height() - 25) + "px"
    //         publishContainer.style.height = hgt;
    //         audioContainer.style.height = hgt;
    //     }
    // });

    $(document).on('click', '.collab_user_close', function () {
        let id = $(this).closest('.collab_user').attr('id');
        users_added.splice(users_added.indexOf(id), 1);
        $(".users_list #" + id).remove();
        $('.collab_contacts_sec input:checkbox#' + id).prop('checked', false);
    });

    function audio_sec() {
        var pubOptions = {
            publishVideo: false
        };

        session.publish("audio-subscriber", pubOptions)
            .on("streamCreated", function (event) {
                console.log("Publisher started streaming.");
                session.subscribe(event.stream, 'audio-subscriber');
            });
    };

    function video_sec() {
        var publisherOptions = {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        };
        var publisher = OT.initPublisher('camera-publisher', publisherOptions, function (error) {
            if (error) {
                console.log('There was an error initializing the publisher: ', error.name, error.message);
                return;
            }
            session.publish(publisher, function (error) {
                if (error) {
                    console.log('There was an error publishing: ', error.name, error.message);
                }
            });
        });
    };

    // $('.tokbox_features_sec').draggable();
    $('#collab_contacts').click(function () {
        var pos = $(this).offset();
        let id = this.id;
        $("." + id + "_sec").css({
            top: pos.top,
            left: pos.left + 20
        });
        $("." + id + "_sec").show();
        collabFn.getCollabUsers();
    });
    // closing function
    $('.close_btn').click(function () {
        $(this).closest('.parent_sec').hide();
    });

    function screenshare() {
        // initializeSession();
        OT.checkScreenSharingCapability(function (response) {
            if (!response.supported || response.extensionRegistered === false) {
                alert('This browser does not support screen sharing.');
            } else {
                // Screen sharing is available. Publish the screen.
                // Create an element, but do not display it in the HTML DOM:
                var screenContainerElement = document.createElement('div');
                var screenSharingPublisher = OT.initPublisher(
                    screenContainerElement, {
                        videoSource: 'screen'
                    },
                    function (error) {
                        if (error) {
                            alert('Something went wrong: ' + error.message);
                        } else {
                            session.publish(
                                screenSharingPublisher,
                                function (error) {
                                    if (error) {
                                        alert('Something went wrong: ' + error.message);
                                    }
                                });
                        }
                    });
            }
        });
    }

});