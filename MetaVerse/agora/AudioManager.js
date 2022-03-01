let objectState = {}
let myChannel = null;
let myObjName=null
window.myLocalAudio =null
function createChannel(obj_name,channel_name){
    let agHandler = objectState[obj_name];
    if(!agHandler){
        agHandler = new AgoraAudioHandler()
        objectState[obj_name] = agHandler;
        agHandler.createChannel(channel_name);
    }
}

function leaveChannel(obj_name){
 
    let agHandler = objectState[obj_name];
    if(agHandler){
        agHandler.leaveChannel()
        delete objectState[obj_name];
    }
    
}



function setAudioLevel(obj_name,level){
    let agHandler = objectState[obj_name];
    if(agHandler){
        agHandler.setVolume(level);
    }
    
}
