const Web = SIP.Web;

const api = "https://eclectica-bot.herokuapp.com";

let user = null;
let aor = null;

const getAccount = async () => {
    const response = await fetch(`${api}/sip`);
    const { aor, endpoint } = await response.json();
    return { aor, endpoint };
};
  
const createUser = async (aor, server) => {
    const user = new Web.SimpleUser(server, { aor });
    await user.connect();
    await user.register();
    return user;
};
  
const runCall = async (aor, name) => {
    const data = { aor, name };
    await fetch(`${api}/call`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

window.setAiUser = async () =>{
    const data = await getAccount();
    const endpoint = data.endpoint;
    aor = data.aor;
    user = await createUser(aor, endpoint);
  
    const audio = new Audio();
    user.delegate = {
      onCallReceived: async () => {
        await user.answer();
        audio.srcObject = user.remoteMediaStream;
        audio.play();
      },
      onCallHangup: () => {
        audio.srcObject = null;
      },
    };
}

window.enable_bot = async ()=>{
    console.log('bot enable')
    runCall(aor, "friend").catch(() => {
    });
}

window.disable_bot = async ()=>{
    console.log('bot disable')
    await user.hangup().catch(() => {
      
    });
}
