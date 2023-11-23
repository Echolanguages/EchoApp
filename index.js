/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import notifee, {
  AndroidBadgeIconType,
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
} from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

async function onMessageReceived(message) {
  console.log("onMessageReceived", message);

  const channelId = await notifee.createChannel({
    id: "echo",
    name: "Default Channel",
    vibration: true,
    sound: "default",
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PRIVATE,
    badge: true,
  });

  console.log("chat_flag", message?.data?.chat_flag);
  console.log("message?.data?.push_type", message?.data?.push_type);
  if (message?.data?.chat_flag != "1") {
    await notifee.displayNotification({
      ...message.notification,
      data: message.data,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PRIVATE,
        sound: "default",
        pressAction: {
          id: "default",
        },
        ...(message.notification.android?.imageUrl && {
          style: {
            type: AndroidStyle.BIGPICTURE,
            picture: message.notification.android?.imageUrl,
          },
        }),
      },
      ios: {
        sound: "default",
      },
    });
  }
}

messaging().onMessage(onMessageReceived);

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Update a users messages list using AsyncStorage
  console.log("messages===>", remoteMessage);
  //  notifee.displayNotification({ title: "Fake notification", body: "This is not the real notification" })
});

notifee.onBackgroundEvent(async (notification) => {
  console.log("notifiee background", notification);
});

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
