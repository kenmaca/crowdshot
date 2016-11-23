const config = {
  apiKey: 'AIzaSyBjumJLkClQJxnpRNjNRRw9yPVkrwgYUbs',
  authDomain: 'crowdshot-11ce3.firebaseapp.com',
  databaseURL: 'https://crowdshot-11ce3.firebaseio.com',
  storageBucket: 'crowdshot-11ce3.appspot.com',
  messagingSenderId: '580889623356'
};
const StripePrivateAPI = 'sk_test_ZajBLN6RSgJ3JJr4TNrQZadF';
const FCMServerKey = 'AIzaSyAsFEg-ElTGnf-nPWGNM1BJ8kbskRrFj00';

// start database
const fetch = require('node-fetch');
const Base64 = require('base-64');
const firebase = require('firebase');
const GeoFire = require('geofire');
const Firebase = firebase.initializeApp(config);
const Database = firebase.database();
const FCM = require('fcm-node');

// global data
let activeContests = {};

// helper utils
function message(profileId, key, notification, data, attempt) {
  console.log(`Attempting to contact ${profileId}..`);
  attempt = attempt ? attempt: 0;
  return new Promise((resolve, reject) => {

    // get the fcm token
    Database.ref(
      `profiles/${profileId}/fcm`
    ).once('value', token => {
      if (token.exists()) {
        console.log(`Found FCM, contacting ${token.val()}..`);
        new FCM(FCMServerKey).send(Object.assign(
          {
            to: token.val(),
            priority: 10,
            collapse_key: key
          }, notification && {
            notification: notification
          }, data && {
            data: data
          }
        ), (err, response) => {
          if (err) {

            // continue to send up to 3 times until successful
            if (attempt < 3) message(
              profileId, key, notification, data, attempt + 1
            ); else reject(err);
          } else {
            resolve(response);
          }
        });
      } else {
        reject('Profile not registered with FCM');
      }
    });
  });
}

firebase.auth().signInWithEmailAndPassword(
  'server@crowdshot.com',
  'GrayHatesLemonade'
).catch(error => {
  console.log(error);
}).then(() => {

  // new contest proximity notifier
  console.log('Starting New Contest Proximity Notifier..')
  Database.ref('locations').on('child_added', data => {
    let location = data.val();
    console.log(`New Contest found: ${
      data.key
    }; Notifying nearby Contestants..`);

    // grab contest information
    Database.ref(
      `contests/${data.key}`
    ).once('value', data => {
      if (data.exists()) {
        let contest = data.val();

        // select all profiles within 10km
        activeContests[data.key] = new GeoFire(
          Database.ref('profileLocations')
        ).query({
          center: [
            location.l[0],
            location.l[1]
          ],

          // default notify within 1 km of contest center
          radius: 1
        });

        // and notify them when they come in range
        activeContests[data.key].on(
          'key_entered',
          (profileId, location, distance) => {
            message(
              profileId,
              'contestNearby',
              {
                type: 'contestNearby',
                title: `There\'s a contest ${
                  contest.near ? `near ${contest.near}`: 'nearby'
                }!`,
                body: `Submit a photo to win a $${contest.bounty} bounty!`
              },
              {
                contestId: data.key
              }
            ).then(
              response => console.log(
                `Nearby notification sent to ${profileId}`
              )
            ).catch(
              err => console.log(err)
            );
          }
        );
      }
    });
  });

  // contest end clean up
  console.log('Starting Contest End Cleanup');
  Database.ref('locations').on('child_removed', data => {
    console.log(`Contest Ended: ${data.key}; Perfoming cleanup..`);

    // remove proximity notifier
    activeContests[data.key].cancel();
  });

  // contest processor
  console.log('Starting Contest Processor..');
  Database.ref('contestTasks').on('child_added', data => {
    console.log(`New Contest Task found: ${
      data.key
    }; Awarding/Refunding Contest..`);

    Database.ref(
      `contests/${
        data.key
      }`
    ).once('value', contestData => {
      if (contestData.exists()) {
        let contest = contestData.val();

        // remove from map of active contests
        Database.ref(`locations/${data.key}`).remove();

        // award prizes if completed
        if (contest.isComplete) {
          let prizes = Object.keys(contest.prizes);
          Database.ref(
            `entries/${
              data.key
            }`
          ).once('value', entriesData => {
            if (entriesData.exists()) {
              let entriesBlob = entriesData.val();
              let winners = Object.keys(entriesBlob).filter(
                entry => entriesBlob[entry].selected
              );

              for (let winner of winners) {

                // first award to profile prizes list
                Database.ref(
                  `profiles/${
                    entriesBlob[winner].createdBy
                  }/prizes`
                ).update({
                  [prizes.pop()]: {
                    '.value': contest.bounty,
                    '.priority': 0 - Date.now()
                  }
                });

                // contact the winner
                message(
                  entriesBlob[winner].createdBy,
                  'contestWinner',
                  {
                    title: 'Congrats! You\'ve won a contest!',
                    body: `Your account was awarded a bounty of $${contest.bounty}!`
                  },
                  {
                    type: 'contestWinner',
                    contestId: data.key,
                    entryId: winner
                  }
                ).then(
                  response => console.log(
                    `Message sent to ${entriesBlob[winner].createdBy}`
                  )
                ).catch(
                  err => console.log(err)
                );

                // and update prizes total
                let walletRef = Database.ref(
                  `profiles/${
                    entriesBlob[winner].createdBy
                  }/wallet`
                );
                walletRef.once('value', wallet => {
                  walletRef.set(
                    (wallet.val() || 0) + contest.bounty
                  );
                });
              }
            }
          });
        } else if (contest.isCancelled) {

          // TODO: handle cancelled contest by refunding
        }

        // now remove task to stop future processing
        Database.ref(
          `contestTasks/${
            data.key
          }`
        ).remove();
      }
    });
  });

  // charge transactions
  console.log('Starting Transaction Charging Listener..');
  Database.ref('transactions').on('child_added', data => {
    let transaction = data.val();

    // if not processed
    if (!transaction.processed) {
      console.log(`New Transaction Attempt found: ${
        data.key
      }; Attempting to charge and approve transaction..`);

      if (transaction.value > 0) {
        let charge = {
          amount: transaction.value,
          currency: 'cad',
          customer: transaction.stripeCustomerId,
          source: transaction.stripeCardId,
          description: `Transaction for ${
            transaction.createdBy
          }`
        };
        fetch(
          'https://api.stripe.com/v1/charges',
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${
                Base64.encode(`${StripePrivateAPI}:`)
              }`
            },
            body: Object.keys(charge).map(
              key => `${encodeURIComponent(key)}=${
                encodeURIComponent(charge[key])
              }`
            ).join('&')
          }
        ).then(response => {
          return response.json();
        }).then(json => {
          if (!json.error) {
            Database.ref(
              `transactions/${data.key}`
            ).update({
              stripeChargeId: json.id,
              processed: true,
              approved: true
            });
          } else {
            Database.ref(
              `transactions/${data.key}`
            ).update({
              processed: true,
              error: json.error
            });
          }
        });

      // automatically approve free contests
      } else {
        Database.ref(`transactions/${data.key}`).update({
          processed: true,
          approved: true
        });
      }
    }
  });

  // add Stripe customers to new profiles
  console.log('Starting New User Listener..');
  Database.ref('profiles').on('child_added', data => {
    let user = data.val();

    // add Stripe customer if newly created
    if (!user.stripeCustomerId) {
      console.log(`New User found: ${
        user.displayName
      }; Provisioning Stripe Customer..`);
      let customer = {
        description: `${
          user.displayName
        } (${
          data.key
        })`,
        email: user.email
      };
      fetch(
        'https://api.stripe.com/v1/customers',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${
              Base64.encode(`${StripePrivateAPI}:`)
            }`
          },
          body: Object.keys(customer).map(
            key => `${encodeURIComponent(key)}=${
              encodeURIComponent(customer[key])
            }`
          ).join('&')
        }
      ).then(response => {
        return response.json();
      }).then(json => {
        if (!json.error) {
          Database.ref(
            `profiles/${data.key}/stripeCustomerId`
          ).set(json.id);
        }
      });
    }
  })

  // add billing tokens to Stripe customers
  console.log('Starting New Card Listener..');
  Database.ref('billing').on('child_added', data => {
    let token = data.val();

    // convert token into card if inactive (newly added)
    if (!token.active) {
      console.log(`New Card found: ${token.stripeToken}`);
      fetch(
        `https://api.stripe.com/v1/customers/${
          token.stripeCustomerId
        }/sources`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${
              Base64.encode(`${StripePrivateAPI}:`)
            }`
          },
          body: `${
            encodeURIComponent('source')
          }=${
            encodeURIComponent(token.stripeToken)
          }`
        }
      ).then(response => {
        return response.json();
      }).then(json => {
        if (json.error) {

          // remove token due to error
          Database.ref(
            `billing/${data.key}`
          ).update({
            error: json.error
          });
          Database.ref(
            `profiles/${
              token.createdBy
            }/billing/${
              data.key
            }`
          ).remove();
        } else {

          // looks good, so convert to card
          Database.ref(
            `billing/${data.key}`
          ).update({
            active: true,
            stripeCardId: json.id,
            stripeToken: null,
            lastFour: json.last4,
            name: json.name,
            expiryMonth: json.exp_month,
            expiryYear: json.exp_year,
            type: (() => {
              switch(json.brand) {
                case 'MasterCard': return 1;
                case 'American Express': return 2;
                default: return 0;
              }
            })()
          });
        }
      });
    }
  });
});
