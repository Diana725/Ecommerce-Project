import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "8ae75e243ebf6185e29a",
  cluster: "mt1",
  forceTLS: true,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for authentication
    },
  },
});

export default echo;
