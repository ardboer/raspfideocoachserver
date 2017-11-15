#!/bin/bash
ffmpeg -f concat -safe 0 -i <(printf "file '$PWD/%s'\n" recordings/*.h264 | sort -r | tail -n +2 | head -n $2 | sort ) -vcodec copy public/clips/$1.mp4
#ffmpeg -f concat -safe 0 -i <(printf "file '$PWD/%s'\n" recordings/*.mp4 | sort -r | tail -n +2 | head -n $2 | sort ) -vcodec copy public/clips/$1.mp4
