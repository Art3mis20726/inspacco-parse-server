const FCM = require('fcm-node');
const serverKey = 'AAAA0_N9vLo:APA91bHxkns1tRCIBXp-Xh6OslcYd2TbEM0nRbnHYa8DQGCFoaa5CR9-_l_ugWxc1fdzwAxp6XFquk4U4GrgsbOUxF4LLB8MaigY_aDWh2GOEl8C88tvgjmOy1usaX1EcFsL3gbFfZCB'; // Your Firebase Server Key
const fcm = new FCM(serverKey);
const fs = require('fs');
const csv = require('fast-csv'); // You can use the 'fast-csv' library for CSV parsing


const sendMessage = (userid,token)=>{
     if(token.startsWith('Expo')){
        return ;
     }
    const message = {
        to: 'ccl4CPFoSkWw2Z1oC2LV5Q:APA91bEf2MjyJprvWnCOLMg_BkXezQ2d9ho_HD2cd5u3x4uMjPwCdw2nuSGJEoXjzocoDnLd-7yiGXJIKDbiroVA4n0U89awzoaIgNYyQPLZSrUQr4TWW3ingiNQwQsIlRctcoDZr_ZF', // Device registration token
        notification: {
            title: 'Inspacco Update Avilable',
            body: 'Update Required to Continue',
            sound : "default", 
          badge: "1"
        },
        data:{
            link:'https://play.google.com/store/apps/details?id=com.inspacco.mobile'
        }
    };
    
    fcm.send(message, function(err, response) {
        if (err) {
            console.error('Error sending notification:', err);
        } else {
            console.log(`Notification sent successfully: ${userid}`, response);
        }
    });
};


// Sample function to process user and token
function processUserAndToken(user, token) {
    console.log(`Processing user: ${user}, Token: ${token}`);
    // Your logic here
}

// Path to your CSV file
const csvFilePath = '/Users/sunilmore/Downloads/ExpoPushToken.csv';

fs.createReadStream(csvFilePath)
    .pipe(csv.parse({ headers: true }))
    .on('data', (row) => {
        // Assuming your CSV has 'user' and 'token' columns
        const user = row.user;
        const token = row.token;
        
        // Call the sample function with extracted user and token
        processUserAndToken(user, token);
    })
    .on('end', () => {
        console.log('CSV file parsing finished.');
    })
    .on('error', (error) => {
        console.error('Error parsing CSV file:', error);
    });
