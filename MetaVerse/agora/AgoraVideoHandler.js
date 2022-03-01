class AgoraVideoHandler{

    client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    agoraToken="f07df2b85dc04996b8be8072117dd5a0"; //your agora token

    localAudioTrack=null
    localVideoTrack=null
    remoteAudioTrack =null
    remoteVideoTrack=null
    ptr = null;
    canvas = document.createElement('canvas');
    ctx = this.canvas.getContext('2d');
    videoElement =null
    animationframe = null;
    dataHeap = null;
    image = new Image();

    constructor(){
        this.canvas.width = 1280;
        this.canvas.height = 720; 
     
    }

    async joinChannel(channel_name, ptr){
        this.ptr = ptr;
        let client = this.client;
        this.dataHeap =  new Uint8Array(window.unityInstance.Module.HEAPU8.buffer, ptr, 1280 * 720 *4);
        //this.drawImage();
        await client.join(this.agoraToken,channel_name,null,null);
        //client.setClientRole('host')
        client.on("user-published", async (user, mediaType) => {
            // Subscribe to a remote user.
            await client.subscribe(user, mediaType);
            console.log("subscribe success");
            // If the subscribed track is audio.
            
            await this.stop_presentation();

            if (mediaType === "video") {
                try{
                    this.videoElement=null;
                    if(this.remoteVideoTrack!=null){
                        this.remoteVideoTrack.stop();
                        this.remoteVideoTrack=null;
                    }
               
                }catch(e){
                    console.log(e)
                }

                let remotePlayerContainer = document.createElement("div");
                remotePlayerContainer.id = user.uid.toString();
                remotePlayerContainer.style.display = "none";
                document.body.append(remotePlayerContainer);

                const remoteVideoTrack = user.videoTrack;
                remoteVideoTrack.play(remotePlayerContainer);
                this.remoteVideoTrack = remoteVideoTrack;

                this.videoElement = $( `#${user.uid.toString()}` ).find( "video" )[0]
            }

            if (mediaType === "audio") {

                    if(this.remoteAudioTrack!=null){
                        this.remoteAudioTrack.stop();
                    }
           
                    const remoteAudioTrack = user.audioTrack;
                    remoteAudioTrack.play();
                    this.remoteAudioTrack=remoteAudioTrack;
                
            }
        });
        
        client.on("user-unpublished", user => {
            // Get the dynamically created DIV container.
            //console.log(`hetansh: ${$(`#video_${this.remoteVideoTrack.toString()}`).length}`)
            if(this.remoteVideoTrack!=null && $(`#video_${this.remoteVideoTrack.toString()}`).length==0 && this.localVideoTrack==null){
                this.remoteVideoTrack=null;
                this.videoElement=null;  
                //this.drawImage() 
            }

            let playerContainer = document.getElementById(user.uid);
            if(playerContainer!=null){
                playerContainer.remove();
            }
           
        });

        if(this.animationframe==null){
            this.animationframe = window.requestAnimationFrame(this.bridgemanager.bind(this));
        }
    }

    drawImage(){
        this.ctx.drawImage(this.image, 0, 0, 1280, 720);
        //this.dataHeap = new Uint8Array(window.unityInstance.Module.HEAPU8.buffer, this.ptr, 1280 * 720 * 4);
        this.dataHeap.set(this.ctx.getImageData(0, 0, 1280, 720).data);
    }


    bridgemanager() {
        if(this.videoElement!=null){
            this.ctx.drawImage(this.videoElement, 0, 0, 1280, 720);
            this.dataHeap = new Uint8Array(window.unityInstance.Module.HEAPU8.buffer, this.ptr, 1280 * 720 * 4);
            this.dataHeap.set(this.ctx.getImageData(0, 0, 1280, 720).data);
        }
        this.animationframe = window.requestAnimationFrame(this.bridgemanager.bind(this));
    }



    async leaveChannel(){
        await this.stop_presentation();
        await (this.client).leave();
    }

    async createChannel(){
        console.log("hetansh: I am in create channel")
        await this.enableAudioVideo()
    }


    async stop_presentation(){
        if(this.localAudioTrack!=null){
            this.localAudioTrack.close();
            this.localAudioTrack=null;
        }
        if(this.localVideoTrack!=null){
            this.localVideoTrack.close();
            this.localVideoTrack=null;
        }

        if(this.remoteVideoTrack==null){
          // this.drawImage()
        }

        try{
            $( `#${this.client.uid.toString()}` ).remove();
        }catch(e){
            console.log("hetansh: stop_presentation error"+e)
        }
        this.client.unpublish();
    }


    async enableAudioVideo(){
        console.log("hetansh: enable audio video")

        await this.stop_presentation();

        try{
            document.exitPointerLock();
            console.log("hetansh: starting screen share")
            let localVideoTrack = await AgoraRTC.createScreenVideoTrack({ encoderConfig: "240p" });
            if(localVideoTrack!=null){
                this.videoElement = null;
                if(this.remoteVideoTrack!=null){
                    this.remoteVideoTrack.stop();
                    this.remoteVideoTrack=null;
                }

                let remotePlayerContainer = document.createElement("div");
                remotePlayerContainer.id = this.client.uid.toString();
                remotePlayerContainer.style.display = "none";
                document.body.append(remotePlayerContainer);
                
                localVideoTrack.play(remotePlayerContainer);
                this.localVideoTrack = localVideoTrack;
                this.videoElement = $( `#${this.client.uid.toString()}` ).find( "video" )[0]

                
                this.client.publish([this.localVideoTrack]);
                window.unityInstance.SendMessage('PlayerArmature', 'presentation');
                if(this.animationframe==null){
                    this.animationframe = window.requestAnimationFrame(this.bridgemanager.bind(this));
                }
            }
        }catch(e){
            console.log("hetansh: video share error:"+e)
        }

        try{
            document.exitPointerLock();
            let localAudioTrack =  await AgoraRTC.createMicrophoneAudioTrack();
            if(localAudioTrack!=null){
                this.localAudioTrack =localAudioTrack
                this.client.publish([this.localAudioTrack]);
            }
        }catch(e){
            console.log(e)
        }
        
    }   
}