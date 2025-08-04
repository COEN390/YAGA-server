import admin from "firebase-admin"

const sendFCMMessage = async (title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    topic: "scan"
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("FCM Response:", response);
  } catch (error) {
    console.error("Error sending FCM message:", error);
  }
};


export { sendFCMMessage }