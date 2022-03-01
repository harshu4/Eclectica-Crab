let current_presentation = null
let current_channel_name = null

function join_presentation(channel_name, ptr){
    channel_name=window.config1.contract;
    if(channel_name!=current_channel_name && current_presentation!==null){
        leave_presentation()
    }else if(current_presentation!==null){
        return;
    }
    current_channel_name = channel_name
    console.log("i am called to join presentation");
    current_presentation = new AgoraVideoHandler();
    current_presentation.joinChannel(channel_name, ptr)
}


function do_presentation(){
    if(current_presentation!=null){
        current_presentation.createChannel()
    }
}

function stop_presenting(){
    if(current_presentation!=null){
        current_presentation.stop_presentation()
    }
}



function leave_presentation(){
    current_presentation.leaveChannel();
}
