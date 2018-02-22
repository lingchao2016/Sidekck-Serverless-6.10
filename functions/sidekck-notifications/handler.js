'use strict';

var firebase = require('firebase');
var unirest = require('unirest');
var moment = require('moment');
var URL = require('url');

// Firebase service account details
var dev_credentials = {
  "type": "service_account",
  "project_id": "sidekick-dev-cf9f9",
  "private_key_id": "df3273e991a75e4ac8dd96b70bb47ef5afbdf4c9",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCo+a3QE827DAeJ\n907232dXm2EAhAux27oZAsq5V25G8cKacxMKLLri7usuZPKfxv/nx9gWNH2J1qmo\n/TDWH7tWZHTxz3s5kSniPf1wfMMHrlh95FwJeg/3mEB61HB3Zud2IJ7ozMi/mcy0\nMh3pGO5SkklG3kmpXlFlDdVAFLVf7gBc/zNNCSZJlH0EwV9TLxi3Hd8pA9bzXsnI\nhYfYah1Vu7/OpRx9n2t2oNuYJDXAvlnrwe0JTinkOmMTi0KHFOgaJ9Jnme8BuwyG\nPU8c1ey1BNJj552F7qroFcELgQEK4Cy4SxsnZe5wCEst1SaSWSMaNCsOvoiap88h\ngf5zUEU3AgMBAAECggEANIcxbi7J1Ky/pzb3GC2IvaYyuGtUC11H88B3brhsMqez\nHDpLn+0Zx7QH7is5dUvyf4YTeYulvvS5VywmQ1on7YpbBFTAdLvYrlkg8RgHtNqQ\n7cnQhq2oSwrMeKKTt7qIl6M6YxpOCanxBc9SlwTGCWsqVlqBwaHtYaG0OjB11bTw\nO8r4Hk5tl3SfXJ/7Oy9iZVpGTqjFRdOomGpsrwGELpJl1OGezOjfJ6c1eH6+VOu9\nxR7NxdFBo+wfqHFzFEZsLz6sUTlEhzXmXAP96Ys2SHxN+CPSRNtVnnrC3/4PY+SB\nxs5cgeTBjtNxI9Adue8IKewbgxFd5jviOE5+ZLjauQKBgQDgqFsEthDAGRBFfplp\n7Y50Pko2Uuoj8YjKLezZVkTu4pjq7MbPsyaSCMf/AhxKSMcgR1QNBbDTcOSgtUc2\n9Tx17CG+gC/IGSP5Mfy1/895xkvMBFiltbTj/s1d2E9cCseNGeo52JR5va40BLup\nibFzDbNdIUic/9DDT2JCsWXfDQKBgQDAjKE3tXxDr4o5vrwicVfxYIdqWSJOvQPF\nEnjzwJTZmvl123q1Z+YOfLubdkZcVmbmZYfplNKpGunZyJHiAYkGe9g39/s89IwZ\nOTTmf50c//SXyjscv3Sdr4nwI7BQZX1d0iwc7b7HEd0JnI/me+9y6uL5cLKjUdYZ\nGa0mqc/EUwKBgAhamk/ZiVPrWqyK4Z+LwuFVs6LDgItnnuONw6HtUFDlwjPyLA5r\nJgMGKpGz/WNRw33SyTBWxtWF/Cpxsz06702fQz33PE+fh7PrhO8rnQZ1NjpW6wj2\nccyMnAxiT8knaXY4wXn3MMY6JHEwv921DhEuMD5FT5Lu/E9W81txh009AoGAFn5X\nNxLUeXPASg6mG7/x7hjAuQPApkIedp850f/lY6ZfDg2dwCNrFLYtlHO0tITDcJbb\n0cW49lhWiUKNCEH1p/Q/xgoKJ4zJ8QhlzaeKyyB7il/tl+Yl0WX4Tz1cE4hHpPYw\ngRClAMxtbfoENYC08E/QRCOOOtYMlNITEDk2NFECgYANjTblMp8L8DZHS9sa1fMl\nTjE7qc7XqqemihV9VFUbtpVmmJJHVByEfTcOqsT6WEV7lEnpSyelIfH+/NQjehwj\nw3UGb+5wZv/e85gZzFcGKBDaUH7C8y2D0WKBF4e1wzkfAoFKTHx2MjV10hL/Xbk1\nXPgkXGMSqGYPj+xLer5IAg==\n-----END PRIVATE KEY-----\n",
  "client_email": "1095133334337-compute@developer.gserviceaccount.com",
  "client_id": "114737708945467250662",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/1095133334337-compute%40developer.gserviceaccount.com"
};

var prod_credentials = {
  "type": "service_account",
  "project_id": "sidekck-9ac02",
  "private_key_id": "afd19059a3253155a7af4d66d8082fbdb0829153",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4VuEUXtXDn9tb\nzT3zXcaC3SmBs3sLTFZnHF83KKs6YaOCSfDgIGsau4vXC4GFETDjbL9Wq3L/aoTU\nn1ZJwesM6byPk00aEu3CFURG8ikckNruhyTPvYyQ+zu9sHtZOpwO8TeFBvEJfsza\nzLdqcNOEmKJkn8VxP3CZkoGeM3nE00uYiBpkkiAysA9SrltXXNDTseX+1zOFXwkI\nuwOyxSe/4QLPvY5OyUV1eeO77mhmrPLo3Dn0dCdN+fTfARaQlMPGQ1nYTCgVaiBk\nQ9LmNIyOhJnLVYfnvguViWKK/PEANOM1m3bTaT4eOoPi/z1q2FkWxfvLtHyDyAi6\nCRrrx1RXAgMBAAECggEAP6FNpFhv9UzSzUd1YPI3uahZ0XmAuY+qK4FxpHqXUFmv\ntSOMz/Cgx+OBC8Pe+23JsFczXNlloqDEJRizElarqhNskSrJbHyoMVxh6xNf+YpO\n6BMiM8s8IDd4kau/iDdg8w90mKiivyJT2BreHRHBEX4WYCF+Z+78ESavM0qVd8jZ\n0GlWK9VoSSYnMH7NUB4K04F3zKmXyliRYOatP/Toqhtd3kCn+5QMEHO8FikKuVRX\nH6PvNHGiWQZEPRWBTBOl/wBOaol+2Dk4ppsl0eAc3fblT9e+EFVMBpAOVsmI9ayS\nNsXu1zdv9upUZg//2d6ZYcl0FINW3ox5ZCKIDl1WUQKBgQDZvZJlHYop2lDVhVnG\n889VAJe68DqBnOYlmumCqwhBR2KF3nc4P2/QF2MB+aPiafaHr4EJPs1rMAQVBjJU\nwLxIkous+C9xCY9yWI2ywDmphk1NjHXtMS1E1+xlyMs2EDVKji+mxsmhFIUNWPjw\nbbMzyV24zWFzzynYYI/XF5Hj8wKBgQDYutp5Zn7Z6X0etAbn6pCYqfmbftruHLRq\ndmVFqDm8aEnjvsCYmQwafbWwvMdPktjFNmEcSly3bLFw6Hjzoan4TxmL2Dbc6go+\ng1nS9XS7zvrxuoE0L4AAV8O5e/dLjDFjyoXj3NepXmuTGOyAEpiPG0QeWe0OtFqQ\nCMQQdwN7DQKBgQCNYbR/B5FA38sA+ddzgbgsX3gmH/o9Ut11qYLaH6f6ixmEBxGu\najJ2Edlt3OT3DQrQy7qjgC3t3X2pER75PTSEgvNC2twjL6v++VT4rixC0Tu8kOm5\nm+bi/rk21gxtDFUuFekHB6jAeQxzwEPUCccEZ0n9xw3yHp/zKa/8YAeQ1QKBgF95\nAKEWG69XAf0yhRBI7mWyCvkKytq13mw/t6EV2Ek9D7+52hHe6cwJsK4omwxcvg0y\nRVk3ENzkjs4UOqPohX2TKsfF+XUbzGN5bWpXIpNRPI6cACrC+fosr1XYXDn1ihRR\ntOWJ9Z7wrybfhd9tUbNI6ZsNNjaSEIr+sZAnPWtJAoGBAIvaelp+f2J5IiKsjx9b\nuuZpCdDE+F0RaFDY/jo7MVu88PdZh9yIrQ8S8N/tBlHc6LJS1b7ZX9taFfGDyYrR\nDRlhH4u6kvucut3ogsusxI5X9ctSypVf0V92maWVYjd1B62YLAc+LFGBzktVCqn8\n2LgKt/9zgYTvD0HBNW5PGO+s\n-----END PRIVATE KEY-----\n",
  "client_email": "aws-910@sidekck-9ac02.iam.gserviceaccount.com",
  "client_id": "101643199052388124504",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/aws-910%40sidekck-9ac02.iam.gserviceaccount.com"
};


// initialize firebase app
firebase.initializeApp({
  serviceAccount: prod_credentials,
  databaseURL: "https://sidekck-9ac02.firebaseio.com/"
  //serviceAccount: dev_credentials,
  //databaseURL: "https://sidekick-dev-cf9f9.firebaseio.com/"
});

var database = firebase.database();
var ref = database.ref();

var messagingRequestHeader = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  //'Authorization': 'key=AIzaSyAxf9KgIo7HapLAFF2Tzrphea_Uy5vDdhM'
  'Authorization': 'key=AIzaSyDP5meFR6bFKPxXj_9NRfegmdCAKoVmtrM'
};

var sendMessagingRequest = function (payload, cb) {
  unirest.post('https://fcm.googleapis.com/fcm/send')
      .headers(messagingRequestHeader)
      .send(payload)
      .end(function (response) {
        cb(response.body);
      });
};

var getUserFCMToken = function (userId) {
  return new Promise(function (resolve, reject) {
    ref.child('users').child(userId).child('FCM_token').once('value', function (snapshot) {
          resolve(snapshot.val());
        },
        function (error) {
          reject(error);
        })
  })
};

var messageType = {
  friend_request_received: 'friend_request_received',
  friend_request_rejected: 'friend_request_rejected',
  friend_request_accepted: 'friend_request_accepted',

  workout_invite_received: 'workout_invite_received',
  workout_invite_rejected: 'workout_invite_rejected',
  workout_invite_accepted: 'workout_invite_accepted',
  workout_invite_canceled: 'workout_invite_canceled',

  chat_message: 'chat_message'
};

var message = {
  to: '',
  priority: 'high',
  data: {
    type: '',
    sender: ''
  },
  notification: {
    body: '',
    badge: 1,
    sound: 'default'
  }
};

module.exports.handler = function (event, context, callback) {
  const input = event.body;
  var token = input.token;

  // Authenticate token and get the sender's user id
  firebase.auth().verifyIdToken(token).then(function (decodedToken) {
    var senderUid = decodedToken.uid;
    var senderName = decodedToken.name;

    processMessagingRequest(senderUid, senderName)

  }).catch(function (error) {
    // Token is invalid
    return context.fail('Unauthorized:' + error)
  });

  function processMessagingRequest(senderUid, senderName) {
    if (senderName == null) {
      senderName = "A Sidekck user"
    }

    switch (input.operation) {
      case 'friend_request_send': {
        var recipientId = input.recipientId;

        // todo: handle request before sending notification
        // get the recipient's fcm token
        getUserFCMToken(recipientId)
            .then(function (fcmToken) {
              message.to = fcmToken;

              // construct message object
              message.data.type = messageType.friend_request_received;
              message.notification.body = senderName + ' has sent you a friend request!';
              message.data.sender = senderUid;

              // make sure they are not friends yet.
              ref.child('user_friend').child(senderUid).child(recipientId).child('is_friend')
                  .once('value', function (snapshot) {
                    var isFriend = snapshot.val();
                    if (isFriend == 1) {
                      return context.done(null, {message: "They are already friends"});
                    }

                    // send request
                    sendMessagingRequest(message, function (response) {
                      // add to firebase db
                      var userNotifRef = ref.child('user_notification').child(recipientId).push();
                      var userNotifRefPath = URL.parse(userNotifRef.toString()).path;

                      var userNotifData = {
                        sender: senderUid,
                        sender_name: senderName,
                        type: 'friend_request_received',
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        processed: false,
                        ignored: false
                      };

                      // update friends relationship : 0 means request pending.
                      var status = {is_friend: 0};
                      var userFriendRefPath = 'user_friend/' + senderUid + '/' + recipientId;

                      var fanoutObject = {};
                      fanoutObject[userNotifRefPath] = userNotifData;
                      fanoutObject[userFriendRefPath] = status;

                      ref.update(fanoutObject, function (err) {
                        if (err) {
                          return context.fail('Unknown Operation:', err)
                        }
                        else {
                          return context.done(null, response);
                        }
                      }); // atomic updating goodness
                    });
                  });
            })
            .catch(function (error) {
              // Token is invalid
              return context.fail('Unknown Operation:' + error)
            });
        break;
      }

      case 'friend_request_reject': {
        message.data.type = messageType.friend_request_rejected;
        // send request
        break;
      }

      case 'friend_request_accept': {
        var requestId = input.requestId;
        if (!requestId) {
          return context.fail('Unknown Operation:', 'invalid request id')
        }

        // find the request object
        ref.child('user_notification').child(senderUid).child(requestId).once('value', function (snapshot) {

          var requestVal = snapshot.val();

          if (!requestVal) {
            return context.fail('Unknown Operation:', 'invalid request id')
          }

          var recipientId = snapshot.val().sender;
          var requestType = snapshot.val().type;

          if (!recipientId || requestType != 'friend_request_received') {
            return context.fail('Unknown Operation:', 'invalid request')
          }

          // make sure they are not friends yet.
          ref.child('user_friend').child(senderUid).child(recipientId).child('is_friend')
              .once('value', function (snapshot) {
                var isFriend = snapshot.val();
                if (isFriend == 1) {
                  return context.done(null, {message: "They are already friends"});
                }

                // add to firebase db
                var userNotifRefPath = 'user_notification/' + recipientId;
                var newNotifRef = ref.child(userNotifRefPath).push();

                var userNotifData = {
                  sender: senderUid,
                  sender_name: senderName,
                  type: 'friend_request_accepted',
                  timestamp: firebase.database.ServerValue.TIMESTAMP,
                  processed: false,
                  ignored: false
                };

                var senderRefPath = 'user_friend/' + senderUid + '/' + recipientId;
                var recipientRefPath = 'user_friend/' + recipientId + '/' + senderUid;
                var friendStatus = {
                  is_friend: 1,
                  friend_since: firebase.database.ServerValue.TIMESTAMP
                };

                var fanoutObject = {};
                fanoutObject[userNotifRefPath + '/' + newNotifRef.key] = userNotifData;
                fanoutObject[senderRefPath] = friendStatus;
                fanoutObject[recipientRefPath] = friendStatus;

                // update friends relationship
                ref.update(fanoutObject, function (err) {
                  if (err) {
                    return context.fail('Unknown Operation:', err)
                  }

                  // success. Send push notification to user
                  getUserFCMToken(recipientId)
                      .then(function (fcmToken) {
                        message.to = fcmToken;
                        // construct message object
                        message.data.type = messageType.friend_request_accepted;
                        message.notification.body = senderName + ' has accepted your friend request!';
                        // send request
                        sendMessagingRequest(message, function (response) {
                          return context.done(null, response);
                        });
                      }).catch(function (error) {
                    // Token is invalid
                    return context.fail('Unknown Operation:' + error)
                  });
                });
              });// atomic updating goodness
        });
        break;
      }

        // WORKOUT INVITE //
      case 'workout_invite_send':
      {
        var workoutId = input.workoutId;
        var recipientId = input.recipientId;

        if (!workoutId || !recipientId) {
          return context.fail('Unknown Operation:', 'invalid workout id')
        }

        // find the invite object
        ref.child('workout_invite').child(workoutId).once('value', function (snapshot) {

          var inviteVal = snapshot.val();

          // make sure invitation exists
          if (!inviteVal) {
            return context.fail('Unknown Operation:', 'invalid workout invite id')
          }

          // Notification to inviter
          var userNotifRefPath = 'user_notification/' + recipientId;
          var newNotifRef = ref.child(userNotifRefPath).push();
          var newNotifId = newNotifRef.key;

          var userNotifData = {
            sender: senderUid,
            sender_name: senderName,
            type: messageType.workout_invite_received,
            workout_invite_id: workoutId,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            processed: false,
            ignored: false
          };

          // Update all objects
          var fanoutObject = {};
          fanoutObject['user_notification/' + recipientId + '/' + newNotifId] = userNotifData;

          // Save fanout object and send push notification
          ref.update(fanoutObject, function (err) {
            if (err) {
              return context.fail('Unknown Operation:', err)
            }

            // success. Send push notification to user
            getUserFCMToken(recipientId)
                .then(function (fcmToken) {
                  message.to = fcmToken;
                  // construct message object
                  message.data.type = messageType.workout_invite_received;
                  message.notification.body = senderName + ' has sent you a workout invite.';
                  // send request
                  sendMessagingRequest(message, function (response) {
                    return context.done(null, response);
                  });
                }).catch(function (error) {
              // Token is invalid
              return context.fail('Unknown Operation:' + error)
            });
          });
        });
        break;
      }

      case 'workout_invite_accept': {
        var workoutId = input.workoutId;

        if (!workoutId) {
          return context.fail('Unknown Operation:', 'invalid workout id')
        }

        // find the invite object
        ref.child('workout_invite').child(workoutId).once('value', function (snapshot) {

          var inviteVal = snapshot.val();
          // make sure invitation exists
          if (!inviteVal) {
            return context.fail('Unknown Operation:', 'invalid workout invite id')
          }

          // make sure it is not taken
          var canceled = inviteVal.canceled_by_inviter || inviteVal.canceled_by_invitee;
          var invitee = inviteVal.invitee;
          var inviter = inviteVal.inviter;

          // TODO: return informative error code

          if (canceled || invitee != null) {
            return context.fail('Unknown Operation:', 'This invitation is taken')
          }

          var planId = inviteVal.plan;
          if (!planId) {
            return context.fail('Unknown Operation:', 'This invite is not valid')
          }

          // todo: sanity check
          var gym = snapshot.val().gym;
          var workoutTime = snapshot.val().workout_time;

          var workoutTimestamp = moment.unix(workoutTime);
          var workoutDate = workoutTimestamp.format("YYYY-MM-DD");
		  try{
		  	workoutDate = snapshot.val().workout_date;
		  }catch(e){
		  }
          // Now take it.
          // Update invite
          var updatedInvite = inviteVal;
          updatedInvite.invitee = senderUid;
          updatedInvite.accepted = true;
          updatedInvite.available = false;

          // Copy the workout to invitee.
          var calendarEventRef = ref.child('user_workout_calendar').child(senderUid).push();
          var calendarEventId = calendarEventRef.key;
          var newCalendarEvent = {
            created: firebase.database.ServerValue.TIMESTAMP,
            start_date: workoutDate,
            end_date: workoutDate,
            repeat: 0,
            plan: planId
          };

          // Create a user workout invite object for this recipient.
          var newWorkoutInvite = {
            invite: workoutId,
            scheduled_workout: calendarEventId
          };

          // Notification to inviter
          var userNotifRefPath = 'user_notification/' + inviter;
          var newNotifRef = ref.child(userNotifRefPath).push();
          var newNotifId = newNotifRef.key;

          var userNotifData = {
            sender: senderUid,
            sender_name: senderName,
            type: messageType.workout_invite_accepted,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            processed: false,
            ignored: false
          };

          // Update all objects
          var fanoutObject = {};
          fanoutObject['workout_invite/' + workoutId] = updatedInvite;
          // TODO: handle private workout
          // TODO: just delete this node from published workout. The user can publish again.
          fanoutObject['user_workout_calendar/' + senderUid + '/' + calendarEventId] = newCalendarEvent;
          fanoutObject['user_workout_invite/' + senderUid + '/' + calendarEventId + ':' + workoutDate] = newWorkoutInvite;
          fanoutObject['user_notification/' + inviter + '/' + newNotifId] = userNotifData;

          // Save fanout object and send push notification
          ref.update(fanoutObject, function (err) {
            if (err) {
              return context.fail('Unknown Operation:', err)
            }

            // success. Send push notification to user
            getUserFCMToken(inviter)
                .then(function (fcmToken) {
                  message.to = fcmToken;
                  // construct message object
                  message.data.type = messageType.workout_invite_accepted;
                  message.notification.body = senderName + ' has accepted your workout invite!';
                  // send request
                  sendMessagingRequest(message, function (response) {
                    return context.done(null, response);
                  });
                }).catch(function (error) {
              // Token is invalid
              return context.fail('Unknown Operation:' + error)
            });
          });// atomic updating goodness
        });
        break;
      }

      case 'workout_invite_reject': {
        var workoutId = input.workoutId;
        if (!workoutId) {
          return context.fail('Unknown Operation:', 'invalid workout id')
        }

        // find the invite object
        ref.child('workout_invite').child(workoutId).once('value', function (snapshot) {

          var inviteVal = snapshot.val();

          // make sure invitation exists
          if (!inviteVal) {
            return context.fail('Unknown Operation:', 'invalid workout invite id')
          }

          var invitee = inviteVal.invitee;
          var inviter = inviteVal.inviter;

          // Notification to inviter
          var userNotifRefPath = 'user_notification/' + inviter;
          var newNotifRef = ref.child(userNotifRefPath).push();
          var newNotifId = newNotifRef.key;

          var userNotifData = {
            sender: senderUid,
            sender_name: senderName,
            type: messageType.workout_invite_rejected,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            processed: false,
            ignored: false
          };

          // Update all objects
          var fanoutObject = {};
          fanoutObject['user_notification/' + inviter + '/' + newNotifId] = userNotifData;

          // Save fanout object and send push notification
          ref.update(fanoutObject, function (err) {
            if (err) {
              return context.fail('Unknown Operation:', err)
            }

            // success. Send push notification to user
            getUserFCMToken(inviter)
                .then(function (fcmToken) {
                  message.to = fcmToken;
                  // construct message object
                  message.data.type = messageType.workout_invite_rejected;
                  message.notification.body = senderName + ' has rejected your workout invite.';
                  // send request
                  sendMessagingRequest(message, function (response) {
                    return context.done(null, response);
                  });
                }).catch(function (error) {
              // Token is invalid
              return context.fail('Unknown Operation:' + error)
            });
          });// atomic updating goodness
        });
        break;
      }

      case 'workout_invite_cancel': {
        var workoutId = input.workoutId;
        if (!workoutId) {
          return context.fail('Unknown Operation:', 'invalid workout id')
        }

        // find the invite object
        ref.child('workout_invite').child(workoutId).once('value', function (snapshot) {

          var inviteVal = snapshot.val();

          if (!inviteVal) {
            return context.fail('Unknown Operation:', 'invalid workout invite id')
          }

          // make sure it has not been cancelled yet
          var canceled = inviteVal.canceled_by_inviter || inviteVal.canceled_by_invitee;
          var invitee = inviteVal.invitee;
          var inviter = inviteVal.inviter;

          if (canceled || invitee == null) {
            return context.fail('Unknown Operation:', 'Nobody has taken this invitation or it has already been canceled.')
          }

          var planId = inviteVal.plan;
          if (!planId) {
            return context.fail('Unknown Operation:', 'This invite is not valid')
          }

          // now cancel it
          // canceled by inviter (sender is inviter)
          var updatedInvite = inviteVal;
          var notify;

          if (senderUid == inviter) {
            updatedInvite.canceled_by_inviter = true;
            notify = invitee;
          }

          else if (senderUid == invitee) {
            updatedInvite.canceled_by_invitee = true;
            notify = inviter;
          }
          else {
            return context.fail('Unknown Operation:', 'Access not permitted.')
          }

          // Notification to the other participant
          var userNotifRefPath = 'user_notification/' + notify;
          var newNotifRef = ref.child(userNotifRefPath).push();
          var newNotifId = newNotifRef.key;

          var userNotifData = {
            sender: senderUid,
            sender_name: senderName,
            type: messageType.workout_invite_canceled,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            processed: false,
            ignored: false
          };

          // Update all objects
          var fanoutObject = {};
          fanoutObject['workout_invite/' + workoutId] = updatedInvite;
          fanoutObject['user_notification/' + inviter + '/' + newNotifId] = userNotifData;

          // Save fanout object and send push notification
          ref.update(fanoutObject, function (err) {
            if (err) {
              return context.fail('Unknown Operation:', err)
            }

            // success. Send push notification to user
            getUserFCMToken(inviter)
                .then(function (fcmToken) {
                  message.to = fcmToken;
                  // construct message object
                  message.data.type = messageType.workout_invite_accepted;
                  message.notification.body = senderName + ' has cancelled your workout invite!';
                  // send request
                  sendMessagingRequest(message, function (response) {
                    return context.done(null, response);
                  });
                }).catch(function (error) {
              // Token is invalid
              return context.fail('Unknown Operation:' + error)
            });
          });// atomic updating goodness
        });
        break;
      }

      case 'chat_message': {
        var recipientId = input.recipientId;
        var text = input.message_text;

        if (!recipientId) {
          return context.fail('Unknown Operation:', 'invalid workout id')
        }
        // success. Send push notification to user
        getUserFCMToken(recipientId)
            .then(function (fcmToken) {
              message.to = fcmToken;
              // construct message object
              message.data.type = messageType.chat_message;
              message.notification.body = senderName + ' : '+ text;
              // send request
              sendMessagingRequest(message, function (response) {
                return context.done(null, response);
              });
            }).catch(function (error) {
          // Token is invalid
          return context.fail('Unknown Operation:' + error)
        });
        break;
      }

      default:
        return context.fail('Unknown Operation:')
    }
  }
};