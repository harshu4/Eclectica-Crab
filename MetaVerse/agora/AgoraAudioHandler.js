class AgoraAudioHandler{

    client = AgoraRTC.createClient({  mode: "rtc", codec: "vp8" });
    agoraToken="f07df2b85dc04996b8be8072117dd5a0"
    localAudioTrack=null
    async leaveChannel(){
        await (this.client).leave();
    }

    async createChannel(channel_name){
        let client = this.client
        await client.join(this.agoraToken,channel_name,null,null);
        //await client.setClientRole('host');

        if(window.myLocalAudio==null){
            document.exitPointerLock();
            window.myLocalAudio = await AgoraRTC.createMicrophoneAudioTrack();  
        }
        this.localAudioTrack = window.myLocalAudio;
        this.client.publish([this.localAudioTrack]);  
        this.client.on("user-published", async (user, mediaType) => {
            // Subscribe to a remote user.
            await client.subscribe(user, mediaType);
            console.log("subscribe success");
            // If the subscribed track is audio.
            if (mediaType === "audio") {

              const remoteAudioTrack = user.audioTrack;
              remoteAudioTrack.play()
            }
        });

        this.client.on("user-unpublished", user => {
            // Get the dynamically created DIV container.
            const playerContainer = document.getElementById(user.uid);
            // Destroy the container.
            playerContainer.remove();
   
        });
    }

}

