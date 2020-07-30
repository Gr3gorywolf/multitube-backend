import express from "express";
import ytdl from "ytdl-core";
const app = express();
const PORT = process.env.PORT || 1025; 

require('dotenv').config();

app.get("/api/v1/videoinfo/:videoId",async (req,res)=>{
  let videoId = req.params.videoId;
  let info = await ytdl.getInfo(videoId);

  let responseInfo = {
      details:{
        thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        title:info.title,
        description:info.description
      },
      formats:info.formats
  }
  res.json(responseInfo);
});



app.listen(PORT,()=>{
   console.log(`Server listening in: ${PORT}`)
});
