<?php

namespace App\Http\Controllers;
use Smoqadam;
use Illuminate\Http\Request;
use Smoqadam\Video;

class YoutubeController extends Controller
{

    public function GetInfo(Request $request,string $videoId){
        if (str_contains($videoId, '=')) {
            $videoId = explode('=', $videoId, null)[1];
        }
        $video = new Video($videoId);
        $details = $video->getDetails();
        $videoInfo = [
            'title' => $details->getTitle(),
            'thumbnails' => $details->getThumbnails(),
            'view_count' => $details->getViewCount(),
            'rating' => $details->getRating()
        ];
        $formatsInfos = [];
        $formats = $video->getFormats();
        foreach ($formats as $format) {
            $formatsInfos[] = [
                    'videoUrl' => $format->getUrl(),
                    'mimeType' => $format->getMimeType(),
                    'size' => $format->getSize(),
                    'quality' => $format->getQuality(),
                    'fps' => $format->getQuality()
            ];
        }

        return response()->json(compact('formatsInfos', 'videoInfo'), 200);
    }
}
