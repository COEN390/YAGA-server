import axios from "axios";


const sendPushNotification = async (device, title, body) => {
    const serverKey = "BLZoBfv1LZw7PxwF4msg0oC5V0HLbbJSybTKkjbngluEvjAW-9b4iOLM4WHBBhcip5DZw_JvfrjWU6hWeXx4Ohw";

    const payload = {
  to: "/topics/all", // 🔥 this is the broadcast target
  notification: {
    title: "Hello!",
    body: "This is a global message."
  },
  priority: "high"
};

axios.post("https://fcm.googleapis.com/fcm/send", payload, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `key=${serverKey}`
});

}