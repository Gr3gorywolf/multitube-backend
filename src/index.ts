import express from "express";
import axios from "axios";
import ytdl from "ytdl-core";
import {YoutubeVideosScraper} from "./Utils/YoutubeVideosScraper"
const app = express();
const PORT = process.env.PORT || 1025; 

require('dotenv').config();
app.use(express.static('public'));
app.get("/v1/videoinfo/:videoId",async (req,res)=>{
  let videoId = req.params.videoId;
  let info = await ytdl.getInfo(videoId);
  let responseInfo = {
      details:{
        thumbnail:`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        title:info.title,
        description:info.description
      },
      related:info.related_videos,
      formats:info.formats
  }
  res.json(responseInfo);
});

app.get("/v1/trendvideos",async (req,res)=>{
   axios.get('https://m.youtube.com/feed/trending')
   .then((axres)=>{
    var scraper  = new YoutubeVideosScraper(axres.data)
    var results = scraper.scrapYoutubeTrendsPage();
    res.json(results);
   }).catch((err)=>{
     res.status(404);
   });
});

app.get("/v1/homevideos",async (req,res)=>{
  axios.get('https://m.youtube.com')
  .then((axres)=>{
   var scraper  = new YoutubeVideosScraper(axres.data)
   var results = scraper.scrapYoutubeHomePage();
   res.json(results);
  }).catch((err)=>{
    res.status(404);
  });
});


app.listen(PORT,()=>{
   console.log(`Server listening in: ${PORT}`)
});
