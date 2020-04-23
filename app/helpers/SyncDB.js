import { CONTACT } from '../constants/storage';
import AsyncStorage from '@react-native-community/async-storage';

// safepath.tch.harvard.edu:80/api/v1/contacts
//export const SERVER = "10.1.10.98:4567"
//export const SERVER = "192.168.0.11:4567";
export const SERVER = "safepath.tch.harvard.edu:80";

export async function saveContactToUpload(_uploader, _contact, _rssi, _date) {
  let contactData = { uploader:_uploader, contact: _contact, rssi:_rssi, date:_date.toISOString() };
  AsyncStorage.setItem(CONTACT + _contact + _date.toISOString(), JSON.stringify(contactData));  
};

function uploadAndRemove(key) {
    AsyncStorage.getItem(key).then(contact => {
        if (contact) {
            fetch('http://' + SERVER + "/api/v1/contacts", 
                {
                    method: "POST",
                    headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                    },
                    body: contact
                }
            ).then(response => {
                if (response.status == 200) {
                    AsyncStorage.removeItem(key);
                }
            }).catch(error => {
                console.log("Upload Error", error); 
            });
        } 
    });
}

export async function sync () {
    fetch('http://' + SERVER + "/api/v1/health", 
        {
            method: "GET",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
            }
        }
    ).then(response => {
        if (response == 200) { // is online
            AsyncStorage.getAllKeys().then(ks => {
                ks.sort().map(key => {
                    // it's a uuid
                    if (key.startsWith(CONTACT)) {
                        console.log("Uploading Key", key);
                        uploadAndRemove(key);
                    }
                })
            });
        }
    }).catch(error => {
        console.log("Phone Offline", error); 
    });
}