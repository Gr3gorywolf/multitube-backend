import * as cheerio from "cheerio";
import { YoutubeHomeResponse } from '../Interfaces/YoutubeHomeResponse';
import { YoutubeTrendsResponse } from '../Interfaces/YoutubeTrendsResponse';
import { SearchResult, Kind, Thumbnails } from '../Interfaces/SearchResult';
import { UrlHelper } from './UrlHelper';
import { Suggestion } from "../Interfaces/Suggestion";
export class YoutubeVideosScraper {


  HtmlContent: string = "";
  $: CheerioStatic;
  constructor(content: string) {
    this.HtmlContent = content;
    this.$ = cheerio.load(this.HtmlContent);
  }



  extractVideosJson(): any {
    var parsedData: any;
    for (let data of this.$("script").toArray()) {
      for (let child of data.children) {
        if (child.type == "text" && child.data !== undefined) {
          if (child.data.includes(`window["ytInitialData"] =`)) {
            let jsonContent = child.data.split(`window["ytInitialData"] =`)[1].split("}}}}};")[0];
            jsonContent += "}}}}}";
            parsedData = (JSON.parse(jsonContent.trim()));
          }
        }

      }
    }
    return parsedData;

  }

 scrapRelatedVideos():Array<Suggestion> {
   var suggestions:Array<Suggestion> = [];
   var extractedData  =  this.$('.compact-media-item-metadata-content').toArray();
   console.log(extractedData)
    for(let data of extractedData){
      
      let title = this.$('.compact-media-item-headline',data).text();
      let link = `https://www.youtube.com/watch?v=${data.attribs['href']}` ;
      suggestions.push({
        Name:title,
        Link: link,
        Portrait:new UrlHelper().getThumbnailFromUrl(link)
      })
    } 
    return suggestions;
 }

  scrapYoutubeHomePage(): Array<SearchResult> {

    var results: Array<SearchResult> = [];
    var parsedData: YoutubeHomeResponse = this.extractVideosJson();
    console.log(parsedData);
    for (let tab of parsedData.contents.twoColumnBrowseResultsRenderer.tabs) {
      for (var cont of tab.tabRenderer.content.richGridRenderer.contents) {
        try {
          if (cont.richItemRenderer !== undefined) {
            var video = cont.richItemRenderer.content.videoRenderer;
            if (video !== undefined) {
              var videoUrl = new UrlHelper().getYoutubeUrlById(video.videoId);
              results.push({
                channelId: "",
                channelTitle: video.ownerText.runs[0].text,
                description: video.descriptionSnippet.runs[0].text,
                id: video.videoId,
                kind: Kind.YoutubeVideo,
                link: videoUrl,
                publishedAt: new Date(),
                title: video.title.runs[0].text,
                thumbnails: null
              } as SearchResult)
            }
          }
        } catch (ex) { }
      }
    }
    console.log(results);
    return results;
  }


  scrapYoutubeTrendsPage(): Array<SearchResult> {
    var results: Array<SearchResult> = [];
    var parsedData: YoutubeTrendsResponse = this.extractVideosJson();
    console.log(parsedData);

    for (let tab of parsedData.contents.twoColumnBrowseResultsRenderer.tabs) {
      for (var cont of tab.tabRenderer.content.sectionListRenderer.contents) {
        for (var secContents of cont.itemSectionRenderer.contents) {
          try {
            for (var secContents2 of secContents.shelfRenderer.content.expandedShelfContentsRenderer.items) {
              var video = secContents2.videoRenderer;
              var videoUrl = new UrlHelper().getYoutubeUrlById(video.videoId);
              results.push({
                channelId: "",
                channelTitle: video.ownerText.runs[0].text,
                description: video.descriptionSnippet.runs[0].text,
                id: video.videoId,
                kind: Kind.YoutubeVideo,
                link: videoUrl,
                publishedAt: new Date(),
                title: video.title.runs[0].text,
                thumbnails: null
              } as SearchResult)
            }
          } catch (ex) { }
        }
      }
    }
    console.log(results);
    return results;
  }



}



