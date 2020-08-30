"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const YoutubeVideosScraper_1 = require("./Utils/YoutubeVideosScraper");
const app = express_1.default();
const PORT = process.env.PORT || 1025;
require('dotenv').config();
app.use(express_1.default.static('public'));
app.get("/v1/videoinfo/:videoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let videoId = req.params.videoId;
    let cookies = process.env.COOKIES ? process.env.COOKIES : "";
    let info = yield ytdl_core_1.default.getInfo(videoId, {
        requestOptions: {
            cookie: cookies
        }
    });
    let responseInfo = {
        details: {
            thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
            title: info.title,
            description: info.description
        },
        related: info.related_videos,
        formats: info.formats
    };
    res.json(responseInfo);
}));
app.get("/v1/trendvideos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.get('https://m.youtube.com/feed/trending')
        .then((axres) => {
        var scraper = new YoutubeVideosScraper_1.YoutubeVideosScraper(axres.data);
        var results = scraper.scrapYoutubeTrendsPage();
        res.json(results);
    }).catch((err) => {
        res.status(404);
    });
}));
app.get("/v1/suggestions/:videoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.get(`https://m.youtube.com/watch?v=${req.params.videoId}`)
        .then((axres) => {
        var scraper = new YoutubeVideosScraper_1.YoutubeVideosScraper(axres.data);
        var results = scraper.scrapRelatedVideos();
        res.json(results);
    }).catch((err) => {
        res.status(404);
    });
}));
app.get("/v1/homevideos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.get('https://m.youtube.com')
        .then((axres) => {
        var scraper = new YoutubeVideosScraper_1.YoutubeVideosScraper(axres.data);
        var results = scraper.scrapYoutubeHomePage();
        res.json(results);
    }).catch((err) => {
        res.status(404);
    });
}));
app.listen(PORT, () => {
    console.log(`Server listening in: ${PORT}`);
});
