import BackgroundFetch from 'react-native-background-fetch';
import { sync } from '../helpers/SyncDB';

const UPLOAD_INTERVAL = 15; // the value is received in minutes

export function executeTask() {
  console.log('[BackgroundFetch ForegroundTask] start: ');
  sync();
  console.log('[BackgroundFetch ForegroundTask] start: ');
}

let MyHeadlessTask = async (event) => {
    // Get task id from event {}:
  let taskId = event.taskId;
  console.log('[BackgroundFetch HeadlessTask] start: ', event);

  sync();

  console.log('[BackgroundFetch HeadlessTask] finish: ', event);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish(taskId);
}

export default class BackgroundTaskServices {
  static start() {
    // Configure it.
    console.log('creating background task object');
    BackgroundFetch.configure(
      {
        minimumFetchInterval: UPLOAD_INTERVAL,
        // Android options
        forceAlarmManager: false, // <-- Set true to bypass JobScheduler.
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
        enableHeadless: true,
      },
      async taskId => {
        console.log('[js] Received background-fetch event: ', taskId);
        executeTask();
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('[js] RNBackgroundFetch failed to start', error);
      },
    );

    // Register your BackgroundFetch HeadlessTask
    BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
        switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
            console.log("BackgroundFetch restricted");
            break;
        case BackgroundFetch.STATUS_DENIED:
            console.log("BackgroundFetch denied");
            break;
        case BackgroundFetch.STATUS_AVAILABLE:
            console.log("BackgroundFetch is enabled");
            break;
        }
    });

    sync();
  }

  static stop() {
    BackgroundFetch.stop();
  }
}
